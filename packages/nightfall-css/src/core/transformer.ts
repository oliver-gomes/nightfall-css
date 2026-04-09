/**
 * Core bidirectional color transformation engine.
 * Orchestrates the full theme transformation pipeline.
 */

import type { OKLCH } from '../utils/color-space.js';
import { hexToOklch, oklchToHex, parseCssColor, rgbaToHex } from '../utils/color-space.js';
import type { ClassifiedColor, ColorRole } from './classifier.js';
import { autoFixContrast, type ContrastLevel } from './contrast.js';
import {
  transformBackgroundLtD,
  transformSurfaceLtD,
  transformTextLtD,
  transformBrandLtD,
  transformBorderLtD,
  transformShadowLtD,
} from './light-to-dark.js';
import {
  transformBackgroundDtL,
  transformSurfaceDtL,
  transformTextDtL,
  transformBrandDtL,
  transformBorderDtL,
  generateLightModeShadows,
} from './dark-to-light.js';
import type { PresetConfig } from '../presets/neutral.js';

export type Direction = 'light-to-dark' | 'dark-to-light';

export interface TransformConfig {
  direction: Direction;
  preset: PresetConfig;
  contrast: {
    target: ContrastLevel;
    autoFix: boolean;
  };
  brand: {
    preserve: string[]; // hex colors to preserve
    maxChromaShift: number;
    maxLightnessShift: number;
  };
}

export interface TransformedToken {
  role: ColorRole;
  original: string; // hex
  transformed: string; // hex or rgba string
  originalOklch: OKLCH;
  transformedOklch: OKLCH;
  contrastRatio?: number;
  wasAutoFixed?: boolean;
}

export interface TransformResult {
  direction: Direction;
  tokens: TransformedToken[];
  shadows?: Array<{ name: string; value: string }>;
  warnings: string[];
}

/**
 * Transform a full set of classified colors to the opposite theme.
 */
export function transformTheme(
  colors: ClassifiedColor[],
  config: TransformConfig
): TransformResult {
  const { direction, preset, contrast, brand } = config;
  const tokens: TransformedToken[] = [];
  const warnings: string[] = [];

  // Find the page background for contrast calculations
  const pageBg = colors.find((c) => c.role === 'background.page');
  let transformedBgHex = '#0a0a0b';

  // Transform each classified color
  for (const color of colors) {
    const oklch = color.oklch;
    let transformed: OKLCH;
    let cssOverride: string | undefined;

    if (direction === 'light-to-dark') {
      transformed = transformColorLtD(color, oklch, preset, brand, pageBg?.oklch);
      if (color.role.startsWith('border.')) {
        const border = transformBorderLtD(oklch);
        cssOverride = `rgba(${border.r}, ${border.g}, ${border.b}, ${border.alpha.toFixed(3)})`;
      }
    } else {
      transformed = transformColorDtL(color, oklch, brand, pageBg?.oklch);
      if (color.role.startsWith('border.')) {
        const border = transformBorderDtL(oklch);
        cssOverride = `rgba(${border.r}, ${border.g}, ${border.b}, ${border.alpha.toFixed(3)})`;
      }
    }

    const transformedHex = cssOverride || oklchToHex(transformed);

    if (color.role === 'background.page') {
      transformedBgHex = oklchToHex(transformed);
    }

    tokens.push({
      role: color.role,
      original: color.value,
      transformed: transformedHex,
      originalOklch: oklch,
      transformedOklch: transformed,
    });
  }

  // WCAG contrast enforcement
  if (contrast.autoFix) {
    enforceContrast(tokens, transformedBgHex, contrast.target, warnings);
  }

  // Generate shadows for dark→light
  let shadows: Array<{ name: string; value: string }> | undefined;
  if (direction === 'dark-to-light') {
    const hasShadows = colors.some((c) => c.role.startsWith('shadow.'));
    if (!hasShadows) {
      shadows = generateLightModeShadows();
    }
  }

  return { direction, tokens, shadows, warnings };
}

function transformColorLtD(
  color: ClassifiedColor,
  oklch: OKLCH,
  preset: PresetConfig,
  brand: TransformConfig['brand'],
  pageBgOklch?: OKLCH
): OKLCH {
  const options = {
    preset,
    preserveHue: true,
    maxChromaShift: brand.maxChromaShift,
    maxLightnessShift: brand.maxLightnessShift,
  };

  switch (true) {
    case color.role === 'background.page':
      return transformBackgroundLtD(oklch, options);
    case color.role === 'background.surface':
      return transformSurfaceLtD(oklch, 1, options);
    case color.role === 'background.elevated':
      return transformSurfaceLtD(oklch, 2, options);
    case color.role.startsWith('text.'):
      return transformTextLtD(oklch, options);
    case color.role.startsWith('brand.') || color.role.startsWith('accent.'):
      return transformBrandLtD(oklch, preset.backgroundBase, options);
    case color.role.startsWith('status.'):
      return transformBrandLtD(oklch, preset.backgroundBase, options);
    case color.role.startsWith('shadow.'):
      return { ...oklch, L: 0 }; // Shadows go full dark in dark mode
    case color.role === 'overlay.backdrop':
      return { ...oklch, L: 0.02 };
    default:
      return transformBackgroundLtD(oklch, options);
  }
}

function transformColorDtL(
  color: ClassifiedColor,
  oklch: OKLCH,
  brand: TransformConfig['brand'],
  pageBgOklch?: OKLCH
): OKLCH {
  switch (true) {
    case color.role === 'background.page':
      return transformBackgroundDtL(oklch);
    case color.role === 'background.surface':
      return transformSurfaceDtL(oklch, 1);
    case color.role === 'background.elevated':
      return transformSurfaceDtL(oklch, 2);
    case color.role.startsWith('text.'):
      return transformTextDtL(oklch);
    case color.role.startsWith('brand.') || color.role.startsWith('accent.'):
      return transformBrandDtL(oklch, 0.98, brand.maxChromaShift, brand.maxLightnessShift);
    case color.role.startsWith('status.'):
      return transformBrandDtL(oklch, 0.98, brand.maxChromaShift, brand.maxLightnessShift);
    case color.role.startsWith('shadow.'):
      return { ...oklch, L: 0 };
    case color.role === 'overlay.backdrop':
      return { ...oklch, L: 0.02 };
    default:
      return transformBackgroundDtL(oklch);
  }
}

function enforceContrast(
  tokens: TransformedToken[],
  bgHex: string,
  target: ContrastLevel,
  warnings: string[]
): void {
  // Find background tokens
  const bgTokens = tokens.filter((t) => t.role.startsWith('background.'));
  const fgTokens = tokens.filter(
    (t) => t.role.startsWith('text.') || t.role.startsWith('brand.') || t.role.startsWith('accent.')
  );

  for (const fg of fgTokens) {
    // Skip non-hex values (rgba borders, etc.)
    if (fg.transformed.startsWith('rgba')) continue;

    // Check against page background
    const fix = autoFixContrast(fg.transformed, bgHex, target);
    if (fix.wasFixed) {
      fg.transformed = fix.color;
      fg.transformedOklch = hexToOklch(fix.color);
      fg.wasAutoFixed = true;
      fg.contrastRatio = fix.ratio;
      warnings.push(
        `Auto-fixed ${fg.role}: ${fg.original} → ${fix.color} (${fix.ratio.toFixed(1)}:1 ${target})`
      );
    } else {
      fg.contrastRatio = fix.ratio;
    }

    // Also check against surface backgrounds
    for (const bg of bgTokens) {
      if (bg.role === 'background.page') continue;
      if (bg.transformed.startsWith('rgba')) continue;

      const surfaceFix = autoFixContrast(fg.transformed, bg.transformed, target);
      if (surfaceFix.wasFixed && !fg.wasAutoFixed) {
        fg.transformed = surfaceFix.color;
        fg.transformedOklch = hexToOklch(surfaceFix.color);
        fg.wasAutoFixed = true;
        fg.contrastRatio = surfaceFix.ratio;
      }
    }
  }
}

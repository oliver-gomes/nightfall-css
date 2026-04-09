/**
 * Light → Dark transformation rules in OKLCH color space
 */

import type { OKLCH } from '../utils/color-space.js';
import { gamutMapOklch } from '../utils/color-space.js';
import type { PresetConfig } from '../presets/neutral.js';

export interface TransformOptions {
  preset: PresetConfig;
  preserveHue: boolean;
  maxChromaShift: number;
  maxLightnessShift: number;
}

const defaultOptions: TransformOptions = {
  preset: {
    name: 'neutral',
    backgroundBase: 0.06,
    surfaceStep: 0.04,
    textPrimary: 0.90,
    chromaScale: 0.7,
    warmth: 0,
  },
  preserveHue: true,
  maxChromaShift: 0.15,
  maxLightnessShift: 0.2,
};

/**
 * Transform a light background to dark.
 */
export function transformBackgroundLtD(oklch: OKLCH, options = defaultOptions): OKLCH {
  const { preset } = options;
  let L: number;

  if (oklch.L > 0.95) {
    // Pure/near-white → deep dark
    L = preset.backgroundBase + (1 - oklch.L) * 0.1;
  } else if (oklch.L > 0.90) {
    // Light gray → dark
    L = 0.10 + (1 - oklch.L) * 0.2;
  } else if (oklch.L > 0.80) {
    // Medium-light → medium-dark
    L = 0.14 + (1 - oklch.L) * 0.3;
  } else {
    // Already fairly dark — modest adjustment
    L = Math.max(0.05, 1 - oklch.L * 1.1);
  }

  // Reduce chroma for dark backgrounds (dark surfaces should be desaturated)
  const C = oklch.C * preset.chromaScale * 0.5;

  // Preserve hue, add warmth if preset specifies
  let H = oklch.H;
  if (preset.warmth !== 0) {
    // Shift hue slightly toward warm (amber ~80) or cool (blue ~260)
    const targetHue = preset.warmth > 0 ? 80 : 260;
    H = H + (targetHue - H) * Math.abs(preset.warmth) * 0.1;
    if (H < 0) H += 360;
    if (H >= 360) H -= 360;
  }

  return gamutMapOklch({ L: Math.max(0, Math.min(1, L)), C: Math.max(0, C), H });
}

/**
 * Transform light surface colors to dark (cards, panels, modals).
 * Creates an elevation stack where "higher" = "lighter" in dark mode.
 */
export function transformSurfaceLtD(
  oklch: OKLCH,
  elevationLevel: number, // 0 = page, 1 = card, 2 = popover, 3 = tooltip
  options = defaultOptions
): OKLCH {
  const { preset } = options;
  const baseL = preset.backgroundBase;
  const step = preset.surfaceStep;

  const L = baseL + step * elevationLevel;
  const C = oklch.C * preset.chromaScale * 0.4;

  return gamutMapOklch({ L, C, H: oklch.H });
}

/**
 * Transform light-theme text to dark-theme text.
 */
export function transformTextLtD(oklch: OKLCH, options = defaultOptions): OKLCH {
  const { preset } = options;
  let L: number;

  if (oklch.L < 0.15) {
    // Near-black text → off-white
    L = preset.textPrimary;
  } else if (oklch.L < 0.35) {
    // Dark gray → medium-light
    L = 0.75;
  } else if (oklch.L < 0.55) {
    // Medium text → medium-dark
    L = 0.55;
  } else {
    // Light text (muted, placeholder) → dim
    L = 0.40;
  }

  // Slightly reduce chroma for dark mode text
  const C = oklch.C * 0.85;

  return gamutMapOklch({ L, C, H: oklch.H });
}

/**
 * Transform brand/accent colors for dark mode.
 * Preserves identity — minimal shift.
 */
export function transformBrandLtD(
  oklch: OKLCH,
  bgLightness: number,
  options = defaultOptions
): OKLCH {
  let L = oklch.L;
  let C = oklch.C;

  // Adjust lightness to ensure contrast on dark bg
  // Need at least 4.5:1 against the dark background
  if (L < bgLightness + 0.25) {
    L = bgLightness + 0.35;
  }

  // Reduce saturation slightly (bright colors on dark feel harsh)
  C = Math.max(0, C * (1 - options.maxChromaShift));

  // Clamp lightness shift
  const originalL = oklch.L;
  const maxShift = options.maxLightnessShift;
  if (Math.abs(L - originalL) > maxShift) {
    L = originalL + Math.sign(L - originalL) * maxShift;
  }

  return gamutMapOklch({ L, C, H: oklch.H });
}

/**
 * Transform borders for dark mode.
 */
export function transformBorderLtD(oklch: OKLCH): { type: 'rgba'; r: number; g: number; b: number; alpha: number } {
  // Light borders → semi-transparent white borders in dark mode
  const alpha = (1 - oklch.L) * 0.15;
  return { type: 'rgba', r: 255, g: 255, b: 255, alpha: Math.max(0.03, Math.min(0.2, alpha)) };
}

/**
 * Transform shadows for dark mode.
 */
export function transformShadowLtD(shadow: {
  color: OKLCH;
  alpha: number;
  blur: number;
  spread: number;
  x: number;
  y: number;
}): typeof shadow {
  return {
    ...shadow,
    color: { ...shadow.color, L: 0 },
    alpha: Math.min(1, shadow.alpha * 1.5),
    blur: shadow.blur * 1.2,
    spread: shadow.spread * 0.8,
  };
}

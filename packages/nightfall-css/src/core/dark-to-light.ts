/**
 * Dark → Light transformation rules in OKLCH color space
 */

import type { OKLCH } from '../utils/color-space.js';
import { gamutMapOklch } from '../utils/color-space.js';
import type { PresetConfig } from '../presets/neutral.js';

/**
 * Transform a dark background to light.
 */
export function transformBackgroundDtL(oklch: OKLCH): OKLCH {
  let L: number;

  if (oklch.L < 0.08) {
    // Near-black → near-white
    L = 0.98;
  } else if (oklch.L < 0.15) {
    // Very dark → slightly off-white
    L = 0.96;
  } else if (oklch.L < 0.25) {
    // Dark → subtle gray-white
    L = 0.92;
  } else if (oklch.L < 0.35) {
    // Medium-dark → light gray
    L = 0.88;
  } else {
    // Not that dark — moderate adjustment
    L = Math.min(0.98, 0.5 + oklch.L * 0.5);
  }

  // Light surfaces can carry subtle warmth/coolness better than dark ones
  const C = oklch.C * 1.1; // slight chroma increase

  return gamutMapOklch({ L, C: Math.max(0, C), H: oklch.H });
}

/**
 * Transform dark surface colors to light (reverse elevation model).
 * In light mode: page bg is lightest, cards slightly off-white with shadow, popovers get stronger shadows.
 */
export function transformSurfaceDtL(
  oklch: OKLCH,
  elevationLevel: number // 0 = page, 1 = card, 2 = popover
): OKLCH {
  const baseLightness = 0.98;
  // In light mode, surfaces are very close in lightness — differentiated by shadow
  const L = Math.max(0.92, baseLightness - elevationLevel * 0.01);
  const C = oklch.C * 1.05;

  return gamutMapOklch({ L, C: Math.max(0, C), H: oklch.H });
}

/**
 * Transform dark-theme text to light-theme text.
 */
export function transformTextDtL(oklch: OKLCH): OKLCH {
  let L: number;

  if (oklch.L > 0.88) {
    // Near-white text → near-black
    L = 0.12;
  } else if (oklch.L > 0.70) {
    // Light text → dark gray
    L = 0.28;
  } else if (oklch.L > 0.50) {
    // Medium text → medium gray
    L = 0.45;
  } else if (oklch.L > 0.35) {
    // Dim text → lighter gray
    L = 0.60;
  } else {
    // Very dim → muted
    L = 0.65;
  }

  // Can slightly increase chroma (dark-mode grays are often desaturated;
  // light mode can afford subtle color in text)
  const C = oklch.C * 1.1;

  return gamutMapOklch({ L, C: Math.max(0, C), H: oklch.H });
}

/**
 * Transform brand/accent colors for light mode.
 * Increase saturation slightly — brand colors pop more on light bg.
 */
export function transformBrandDtL(
  oklch: OKLCH,
  bgLightness: number,
  maxChromaShift = 0.15,
  maxLightnessShift = 0.2
): OKLCH {
  let L = oklch.L;
  let C = oklch.C;

  // Increase chroma — brand colors can be more vibrant on light backgrounds
  C = Math.min(0.4, C * (1 + maxChromaShift));

  // Decrease lightness to maintain contrast on light bg
  // Need sufficient contrast against near-white
  if (L > bgLightness - 0.3) {
    L = bgLightness - 0.4;
  }

  // For very bright accent colors (neon greens, cyans) — decrease L significantly
  if (C > 0.15 && L > 0.6) {
    L = 0.45;
  }

  // Clamp lightness shift
  const originalL = oklch.L;
  if (Math.abs(L - originalL) > maxLightnessShift) {
    L = originalL + Math.sign(L - originalL) * maxLightnessShift;
  }

  return gamutMapOklch({ L: Math.max(0.1, Math.min(0.8, L)), C, H: oklch.H });
}

/**
 * Transform borders for light mode.
 */
export function transformBorderDtL(oklch: OKLCH): { type: 'rgba'; r: number; g: number; b: number; alpha: number } {
  // Dark borders (rgba white on dark) → rgba black on light
  const alpha = oklch.L * 0.08;
  return { type: 'rgba', r: 0, g: 0, b: 0, alpha: Math.max(0.04, Math.min(0.15, alpha)) };
}

/**
 * Generate shadow scale for light mode.
 * Dark UIs often have minimal/no shadows — light mode NEEDS shadows for depth.
 */
export interface GeneratedShadow {
  name: string;
  value: string;
}

export function generateLightModeShadows(): GeneratedShadow[] {
  return [
    {
      name: 'shadow-sm',
      value: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    {
      name: 'shadow-md',
      value: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    },
    {
      name: 'shadow-lg',
      value: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    },
    {
      name: 'shadow-xl',
      value: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    },
  ];
}

/**
 * Palette generation & harmony preservation
 */

import type { OKLCH } from '../utils/color-space.js';
import { gamutMapOklch, hexToOklch, oklchToHex } from '../utils/color-space.js';
import { interpolateOklch } from '../utils/interpolate.js';

export interface PaletteColor {
  name: string;
  hex: string;
  oklch: OKLCH;
}

/**
 * Generate a harmonious palette from a base color.
 */
export function generatePalette(baseHex: string, steps = 10): PaletteColor[] {
  const base = hexToOklch(baseHex);
  const palette: PaletteColor[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const L = 0.95 - t * 0.85; // From very light to very dark
    const C = base.C * (1 - Math.abs(t - 0.5) * 0.6); // Peak chroma in middle

    const color = gamutMapOklch({ L, C, H: base.H });
    const hex = oklchToHex(color);

    palette.push({
      name: `${(i + 1) * 100}`,
      hex,
      oklch: color,
    });
  }

  return palette;
}

/**
 * Preserve the relative harmony between palette colors during transformation.
 * Ensures the "feel" of the palette is maintained.
 */
export function preserveHarmony(
  original: OKLCH[],
  transformed: OKLCH[]
): OKLCH[] {
  if (original.length !== transformed.length) return transformed;

  // Calculate relative lightness steps in original
  const originalSteps = original.map((c, i) =>
    i === 0 ? 0 : c.L - original[i - 1].L
  );

  // Calculate relative chroma ratios
  const originalChromaRatios = original.map((c, i) =>
    i === 0 || original[i - 1].C === 0 ? 1 : c.C / original[i - 1].C
  );

  // Apply relative steps to transformed base
  const result = [transformed[0]];
  for (let i = 1; i < transformed.length; i++) {
    const L = result[i - 1].L + originalSteps[i];
    const C = result[i - 1].C * originalChromaRatios[i];
    result.push(gamutMapOklch({ L: Math.max(0, Math.min(1, L)), C: Math.max(0, C), H: transformed[i].H }));
  }

  return result;
}

/**
 * Generate complementary color (opposite hue).
 */
export function complementary(oklch: OKLCH): OKLCH {
  return { ...oklch, H: (oklch.H + 180) % 360 };
}

/**
 * Generate analogous colors (±30 degrees hue).
 */
export function analogous(oklch: OKLCH): [OKLCH, OKLCH] {
  return [
    { ...oklch, H: (oklch.H + 30) % 360 },
    { ...oklch, H: (oklch.H + 330) % 360 },
  ];
}

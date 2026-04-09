/**
 * Color interpolation utilities in OKLCH space
 */

import type { OKLCH } from './color-space.js';
import { oklchToOklab, oklabToOklch } from './color-space.js';
import type { OKLAB } from './color-space.js';

/**
 * Interpolate between two OKLCH colors.
 * Handles hue interpolation correctly (shortest path around the circle).
 */
export function interpolateOklch(a: OKLCH, b: OKLCH, t: number): OKLCH {
  // Clamp t to 0-1
  t = Math.max(0, Math.min(1, t));

  const L = a.L + (b.L - a.L) * t;
  const C = a.C + (b.C - a.C) * t;

  // Hue interpolation via shortest path
  let dH = b.H - a.H;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;
  let H = a.H + dH * t;
  if (H < 0) H += 360;
  if (H >= 360) H -= 360;

  return { L, C, H };
}

/**
 * Interpolate in OKLAB space (better for some transitions).
 */
export function interpolateOklab(a: OKLAB, b: OKLAB, t: number): OKLAB {
  t = Math.max(0, Math.min(1, t));
  return {
    L: a.L + (b.L - a.L) * t,
    a: a.a + (b.a - a.a) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

/**
 * Generate a scale of N colors between two OKLCH endpoints.
 */
export function generateScale(start: OKLCH, end: OKLCH, steps: number): OKLCH[] {
  const result: OKLCH[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps <= 1 ? 0 : i / (steps - 1);
    result.push(interpolateOklch(start, end, t));
  }
  return result;
}

/**
 * Generate a lightness ramp preserving hue and chroma.
 */
export function lightnessRamp(base: OKLCH, lightnessValues: number[]): OKLCH[] {
  return lightnessValues.map((L) => ({ ...base, L }));
}

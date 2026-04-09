/**
 * Color difference (perceptual distance) using OKLCH/OKLAB
 */

import type { OKLAB, OKLCH } from './color-space.js';

/**
 * Simple Euclidean delta-E in OKLAB space.
 * Good enough for most use cases and fast.
 */
export function deltaEOklab(a: OKLAB, b: OKLAB): number {
  const dL = a.L - b.L;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Delta-E in OKLCH, weighting lightness, chroma, and hue separately.
 * More intuitive for theme transformations.
 */
export function deltaEOklch(a: OKLCH, b: OKLCH): number {
  const dL = a.L - b.L;
  const dC = a.C - b.C;

  // Hue difference in degrees, handling wraparound
  let dH = a.H - b.H;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;

  // Convert hue angle difference to a chord length
  const avgC = (a.C + b.C) / 2;
  const hueChord = 2 * avgC * Math.sin((dH * Math.PI) / 360);

  // Weighted combination
  return Math.sqrt(dL * dL + dC * dC + hueChord * hueChord);
}

/**
 * Check if two OKLCH colors are perceptually similar.
 * Threshold of ~0.02 is a "just noticeable difference" in OKLAB.
 */
export function isPerceptuallySimilar(a: OKLCH, b: OKLCH, threshold = 0.04): boolean {
  return deltaEOklch(a, b) < threshold;
}

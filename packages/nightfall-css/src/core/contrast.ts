/**
 * WCAG contrast ratio checker & enforcer
 */

import { hexToRgb, relativeLuminance, hexToOklch, oklchToHex, type OKLCH } from '../utils/color-space.js';
import { gamutMapOklch } from '../utils/color-space.js';

export type ContrastLevel = 'AA' | 'AAA';

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
}

/**
 * Calculate WCAG 2.1 contrast ratio between two colors.
 * Returns a ratio from 1:1 to 21:1.
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const lum1 = relativeLuminance(hexToRgb(hex1));
  const lum2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check contrast against WCAG thresholds.
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    passesAALarge: ratio >= 3,
  };
}

/**
 * Auto-fix a foreground color to meet contrast requirements against a background.
 * Adjusts lightness in OKLCH with minimal perceptual change.
 * Returns the fixed color hex and the achieved ratio.
 */
export function autoFixContrast(
  foreground: string,
  background: string,
  target: ContrastLevel = 'AA',
  largeText = false
): { color: string; ratio: number; wasFixed: boolean } {
  const minRatio = largeText ? 3 : target === 'AAA' ? 7 : 4.5;
  const current = contrastRatio(foreground, background);

  if (current >= minRatio) {
    return { color: foreground, ratio: current, wasFixed: false };
  }

  const fgOklch = hexToOklch(foreground);
  const bgOklch = hexToOklch(background);

  // Determine direction: if bg is dark, increase fg lightness; if bg is light, decrease fg lightness
  const direction = bgOklch.L < 0.5 ? 1 : -1;

  let bestColor = foreground;
  let bestRatio = current;

  // Binary search for the minimum lightness change that meets contrast
  let lo = fgOklch.L;
  let hi = direction > 0 ? 1.0 : 0.0;

  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    const candidate: OKLCH = gamutMapOklch({ ...fgOklch, L: mid });
    const candidateHex = oklchToHex(candidate);
    const ratio = contrastRatio(candidateHex, background);

    if (ratio >= minRatio) {
      bestColor = candidateHex;
      bestRatio = ratio;
      // Try to find a lightness closer to original
      if (direction > 0) {
        hi = mid;
      } else {
        lo = mid;
      }
    } else {
      if (direction > 0) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
  }

  return { color: bestColor, ratio: bestRatio, wasFixed: bestRatio >= minRatio };
}

/**
 * Check all color pairs and return audit results.
 */
export interface AuditPair {
  foreground: { role: string; color: string };
  background: { role: string; color: string };
  result: ContrastResult;
  fixed?: { color: string; ratio: number };
}

export function auditColorPairs(
  pairs: Array<{ fgRole: string; fgColor: string; bgRole: string; bgColor: string }>,
  target: ContrastLevel = 'AA',
  autoFix = true
): AuditPair[] {
  return pairs.map(({ fgRole, fgColor, bgRole, bgColor }) => {
    const result = checkContrast(fgColor, bgColor);
    const minRatio = target === 'AAA' ? 7 : 4.5;

    let fixed: { color: string; ratio: number } | undefined;
    if (autoFix && result.ratio < minRatio) {
      const fixResult = autoFixContrast(fgColor, bgColor, target);
      if (fixResult.wasFixed) {
        fixed = { color: fixResult.color, ratio: fixResult.ratio };
      }
    }

    return {
      foreground: { role: fgRole, color: fgColor },
      background: { role: bgRole, color: bgColor },
      result,
      fixed,
    };
  });
}

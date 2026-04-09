/**
 * Auto-detects if the current UI is light-mode or dark-mode.
 */

import { hexToOklch, parseCssColor, rgbaToHex } from '../utils/color-space.js';

export type ThemeDirection = 'light' | 'dark' | 'ambiguous';

export interface DetectionResult {
  direction: ThemeDirection;
  confidence: number; // 0-1
  averageLightness: number;
  backgroundLightness: number;
  textLightness: number;
  details: string;
}

export interface DetectionConfig {
  lightnessThreshold: {
    light: number; // default 0.6
    dark: number;  // default 0.4
  };
}

const defaultConfig: DetectionConfig = {
  lightnessThreshold: {
    light: 0.6,
    dark: 0.4,
  },
};

/**
 * Detect theme direction from extracted color data.
 */
export function detectThemeDirection(
  colors: {
    backgrounds: string[];
    texts: string[];
    rootBackground?: string;
  },
  config: DetectionConfig = defaultConfig
): DetectionResult {
  const { backgrounds, texts, rootBackground } = colors;

  // Calculate average background lightness
  let bgLightnessSum = 0;
  let bgCount = 0;

  for (const bg of backgrounds) {
    const parsed = parseCssColor(bg);
    if (!parsed || parsed.a < 0.1) continue; // skip transparent
    const hex = rgbaToHex({ ...parsed, a: 1 });
    const oklch = hexToOklch(hex);
    bgLightnessSum += oklch.L;
    bgCount++;
  }

  // Root background gets extra weight
  let rootBgL = 0.5;
  if (rootBackground) {
    const parsed = parseCssColor(rootBackground);
    if (parsed && parsed.a > 0.1) {
      const hex = rgbaToHex({ ...parsed, a: 1 });
      rootBgL = hexToOklch(hex).L;
      bgLightnessSum += rootBgL * 3; // 3x weight for root
      bgCount += 3;
    }
  }

  const avgBgL = bgCount > 0 ? bgLightnessSum / bgCount : 0.5;

  // Calculate average text lightness
  let textLightnessSum = 0;
  let textCount = 0;

  for (const text of texts) {
    const parsed = parseCssColor(text);
    if (!parsed || parsed.a < 0.1) continue;
    const hex = rgbaToHex({ ...parsed, a: 1 });
    const oklch = hexToOklch(hex);
    textLightnessSum += oklch.L;
    textCount++;
  }

  const avgTextL = textCount > 0 ? textLightnessSum / textCount : 0.5;

  // Determine direction
  let direction: ThemeDirection;
  let confidence: number;

  if (avgBgL > config.lightnessThreshold.light) {
    direction = 'light';
    confidence = Math.min(1, (avgBgL - config.lightnessThreshold.light) / 0.3 + 0.5);
  } else if (avgBgL < config.lightnessThreshold.dark) {
    direction = 'dark';
    confidence = Math.min(1, (config.lightnessThreshold.dark - avgBgL) / 0.3 + 0.5);
  } else {
    // Ambiguous — use text-to-bg contrast direction as tiebreaker
    if (avgTextL < avgBgL) {
      direction = 'light'; // dark text on light bg
      confidence = 0.4;
    } else if (avgTextL > avgBgL) {
      direction = 'dark'; // light text on dark bg
      confidence = 0.4;
    } else {
      direction = 'ambiguous';
      confidence = 0.1;
    }
  }

  const dirLabel = direction === 'light' ? 'light-mode' : direction === 'dark' ? 'dark-mode' : 'ambiguous';
  const genLabel = direction === 'light' ? 'dark' : direction === 'dark' ? 'light' : 'unknown';

  return {
    direction,
    confidence,
    averageLightness: avgBgL,
    backgroundLightness: rootBgL,
    textLightness: avgTextL,
    details: direction === 'ambiguous'
      ? `Ambiguous (avg bg lightness: ${avgBgL.toFixed(2)}). Use --direction flag to specify.`
      : `Detected: ${dirLabel} app → generating ${genLabel} theme`,
  };
}

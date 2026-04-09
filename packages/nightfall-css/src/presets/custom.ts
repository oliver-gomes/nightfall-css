/**
 * Custom preset — user-defined preset support.
 */

import type { PresetConfig } from './neutral.js';
import { neutral } from './neutral.js';
import { warm } from './warm.js';
import { midnight } from './midnight.js';
import { oled } from './oled.js';
import { dimmed } from './dimmed.js';

const presets: Record<string, PresetConfig> = {
  neutral,
  warm,
  midnight,
  oled,
  dimmed,
};

/**
 * Get a preset by name, or return the neutral preset as default.
 */
export function getPreset(name: string): PresetConfig {
  return presets[name] || neutral;
}

/**
 * Create a custom preset by merging overrides with a base preset.
 */
export function createCustomPreset(
  overrides: Partial<PresetConfig>,
  base: PresetConfig = neutral
): PresetConfig {
  return { ...base, ...overrides, name: overrides.name || 'custom' };
}

/**
 * List all available preset names.
 */
export function listPresets(): string[] {
  return Object.keys(presets);
}

export { presets };

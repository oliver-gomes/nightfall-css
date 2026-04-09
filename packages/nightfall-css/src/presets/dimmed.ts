/**
 * Dimmed preset — softer, lower contrast (easier on eyes).
 */

import type { PresetConfig } from './neutral.js';

export const dimmed: PresetConfig = {
  name: 'dimmed',
  backgroundBase: 0.12, // Not as dark — easier on eyes
  surfaceStep: 0.03,
  textPrimary: 0.82, // Not as bright — less contrast
  chromaScale: 0.65,
  warmth: 0.15, // Slightly warm
};

export default dimmed;

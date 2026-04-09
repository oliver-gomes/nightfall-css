/**
 * OLED preset — true black (#000) for OLED screens.
 */

import type { PresetConfig } from './neutral.js';

export const oled: PresetConfig = {
  name: 'oled',
  backgroundBase: 0.0, // True black
  surfaceStep: 0.05, // Bigger steps since base is pure black
  textPrimary: 0.92,
  chromaScale: 0.6,
  warmth: 0,
};

export default oled;

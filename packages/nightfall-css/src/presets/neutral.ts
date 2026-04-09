/**
 * Neutral preset — cool gray dark theme (the default).
 */

export interface PresetConfig {
  name: string;
  backgroundBase: number; // L value for page background
  surfaceStep: number; // L increment per elevation level
  textPrimary: number; // L value for primary text
  chromaScale: number; // multiplier for chroma in dark bg (0-1)
  warmth: number; // -1 to 1, 0 = neutral, >0 = warm, <0 = cool
}

export const neutral: PresetConfig = {
  name: 'neutral',
  backgroundBase: 0.06,
  surfaceStep: 0.04,
  textPrimary: 0.90,
  chromaScale: 0.7,
  warmth: 0,
};

export default neutral;

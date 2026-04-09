/**
 * Nightfall CSS — The other theme. Reverse-engineered.
 *
 * Public API for programmatic usage.
 */

// Core
export { transformTheme, type TransformConfig, type TransformResult, type TransformedToken, type Direction } from './core/transformer.js';
export { detectThemeDirection, type DetectionResult, type ThemeDirection } from './core/detector.js';
export { classifyColors, type ClassifiedColor, type ColorRole, type ColorUsage } from './core/classifier.js';
export { buildColorGraph, graphToSvg, type ColorGraph, type GraphNode, type GraphEdge } from './core/color-graph.js';
export { contrastRatio, checkContrast, autoFixContrast, auditColorPairs, type ContrastResult, type AuditPair } from './core/contrast.js';

// Color utilities
export { hexToOklch, oklchToHex, hexToRgb, rgbToHex, parseCssColor, type OKLCH, type OKLAB, type RGB, type RGBA } from './utils/color-space.js';
export { deltaEOklab, deltaEOklch, isPerceptuallySimilar } from './utils/delta-e.js';
export { interpolateOklch, generateScale, lightnessRamp } from './utils/interpolate.js';

// Transformation rules
export { transformBackgroundLtD, transformTextLtD, transformBrandLtD } from './core/light-to-dark.js';
export { transformBackgroundDtL, transformTextDtL, transformBrandDtL, generateLightModeShadows } from './core/dark-to-light.js';

// Exporters
export { exportCssVariables } from './exporters/css-variables.js';
export { exportTailwindConfig } from './exporters/tailwind-config.js';
export { exportScssVariables } from './exporters/scss-variables.js';
export { exportJsonTokens } from './exporters/json-tokens.js';
export { exportFigmaTokens } from './exporters/figma-tokens.js';
export { exportStyleDictionary } from './exporters/style-dictionary.js';

// Presets
export { getPreset, createCustomPreset, listPresets } from './presets/custom.js';
export type { PresetConfig } from './presets/neutral.js';

// Shadows
export { parseShadow, shadowToCss, generateElevationShadows } from './core/shadows.js';

// Palette
export { generatePalette, preserveHarmony, complementary, analogous } from './core/palette.js';

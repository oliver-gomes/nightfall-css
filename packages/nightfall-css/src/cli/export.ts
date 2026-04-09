/**
 * Export utilities — writes output files in the requested format.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import type { TransformResult } from '../core/transformer.js';
import { exportCssVariables } from '../exporters/css-variables.js';
import { exportTailwindConfig } from '../exporters/tailwind-config.js';
import { exportScssVariables } from '../exporters/scss-variables.js';
import { exportJsonTokens } from '../exporters/json-tokens.js';
import { exportFigmaTokens } from '../exporters/figma-tokens.js';
import { exportStyleDictionary } from '../exporters/style-dictionary.js';

export type ExportFormat =
  | 'css-variables'
  | 'tailwind'
  | 'scss'
  | 'json-tokens'
  | 'figma-tokens'
  | 'style-dictionary';

const formatExporters: Record<ExportFormat, (result: TransformResult) => string> = {
  'css-variables': (r) => exportCssVariables(r),
  tailwind: exportTailwindConfig,
  scss: exportScssVariables,
  'json-tokens': exportJsonTokens,
  'figma-tokens': exportFigmaTokens,
  'style-dictionary': exportStyleDictionary,
};

const formatExtensions: Record<ExportFormat, string> = {
  'css-variables': 'css',
  tailwind: 'js',
  scss: 'scss',
  'json-tokens': 'json',
  'figma-tokens': 'json',
  'style-dictionary': 'json',
};

/**
 * Export a transform result to a file.
 */
export function exportToFile(
  result: TransformResult,
  format: ExportFormat,
  outputPath?: string
): string {
  const exporter = formatExporters[format];
  if (!exporter) {
    throw new Error(`Unknown export format: ${format}`);
  }

  const content = exporter(result);
  const ext = formatExtensions[format];
  const path = outputPath || `nightfall-generated.${ext}`;

  // Ensure directory exists
  const dir = dirname(path);
  if (dir !== '.') {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(path, content, 'utf-8');
  return path;
}

/**
 * Get supported format names.
 */
export function getSupportedFormats(): ExportFormat[] {
  return Object.keys(formatExporters) as ExportFormat[];
}

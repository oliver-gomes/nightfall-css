/**
 * Generate command — transforms extracted colors and exports theme file.
 */

import chalk from 'chalk';
import type { TransformConfig } from '../core/transformer.js';

export interface GenerateOptions {
  format?: string;
  output?: string;
  preset?: string;
  direction?: string;
}

export async function generateCommand(opts: GenerateOptions): Promise<void> {
  const ora = (await import('ora')).default;
  const { readFileSync, writeFileSync, existsSync } = await import('fs');

  const spinner = ora({
    text: 'Generating theme...',
    color: 'magenta',
  }).start();

  // Load scan data
  if (!existsSync('.nightfall.json')) {
    spinner.fail(chalk.red('No .nightfall.json found. Run `nightfall-css scan` first.'));
    return;
  }

  const data = JSON.parse(readFileSync('.nightfall.json', 'utf-8'));

  // Load preset
  const { getPreset } = await import('../presets/custom.js');
  const preset = getPreset(opts.preset || data.preset || 'neutral');

  // Determine direction
  let direction = opts.direction || data.detectedDirection || 'light-to-dark';
  if (direction === 'auto') {
    direction = data.detectedDirection || 'light-to-dark';
  }

  const isBoth = direction === 'both';
  const directions = isBoth
    ? ['light-to-dark', 'dark-to-light'] as const
    : [direction as 'light-to-dark' | 'dark-to-light'];

  // Reconstruct classified colors
  const classifiedColors = Object.entries(data.source || {}).map(([role, info]: [string, any]) => ({
    role: role as any,
    value: info.value,
    oklch: info.oklch
      ? { L: info.oklch[0], C: info.oklch[1], H: info.oklch[2] }
      : { L: 0.5, C: 0, H: 0 },
    usage: info.usage || 0,
    cssProperty: 'background-color' as string,
  }));

  if (classifiedColors.length === 0) {
    spinner.fail(chalk.red('No color data found. Try running `nightfall-css scan` again.'));
    return;
  }

  // Transform
  const { transformTheme } = await import('../core/transformer.js');
  const format = opts.format || 'css-variables';
  let outputContent = '';

  for (const dir of directions) {
    spinner.text = `Transforming ${chalk.cyan(dir)}...`;

    const config: TransformConfig = {
      direction: dir,
      preset,
      contrast: { target: 'AA', autoFix: true },
      brand: {
        preserve: data.brand?.preserve || [],
        maxChromaShift: 0.15,
        maxLightnessShift: 0.2,
      },
    };

    const result = transformTheme(classifiedColors, config);

    // Export
    switch (format) {
      case 'css-variables': {
        const { exportCssVariables } = await import('../exporters/css-variables.js');
        outputContent += exportCssVariables(result);
        break;
      }
      case 'tailwind': {
        const { exportTailwindConfig } = await import('../exporters/tailwind-config.js');
        outputContent += exportTailwindConfig(result);
        break;
      }
      case 'scss': {
        const { exportScssVariables } = await import('../exporters/scss-variables.js');
        outputContent += exportScssVariables(result);
        break;
      }
      case 'json-tokens': {
        const { exportJsonTokens } = await import('../exporters/json-tokens.js');
        outputContent += exportJsonTokens(result);
        break;
      }
      case 'figma-tokens': {
        const { exportFigmaTokens } = await import('../exporters/figma-tokens.js');
        outputContent += exportFigmaTokens(result);
        break;
      }
      case 'style-dictionary': {
        const { exportStyleDictionary } = await import('../exporters/style-dictionary.js');
        outputContent += exportStyleDictionary(result);
        break;
      }
      default:
        spinner.fail(chalk.red(`Unknown format: ${format}`));
        return;
    }

    if (isBoth) outputContent += '\n';

    // Log warnings
    for (const warning of result.warnings) {
      console.log(chalk.yellow(`  ⚠ ${warning}`));
    }
  }

  // Determine output path
  const formatExtensions: Record<string, string> = {
    'css-variables': 'css',
    tailwind: 'js',
    scss: 'scss',
    'json-tokens': 'json',
    'figma-tokens': 'json',
    'style-dictionary': 'json',
  };

  const ext = formatExtensions[format] || 'css';
  const outputPath = opts.output || `nightfall-generated.${ext}`;

  writeFileSync(outputPath, outputContent);

  spinner.succeed(chalk.green('Theme generated!'));

  const tokenCount = classifiedColors.length;
  console.log(`\n  ${chalk.dim('Format:')} ${chalk.bold(format)}`);
  console.log(`  ${chalk.dim('Tokens:')} ${chalk.bold(String(tokenCount))}`);
  console.log(`  ${chalk.dim('Preset:')} ${chalk.bold(preset.name)}`);
  console.log(`  ${chalk.dim('Output:')} ${chalk.cyan(outputPath)}`);
  console.log(`\n  ${chalk.dim('Drop it in:')} ${chalk.cyan(`@import './${outputPath}';`)}\n`);
}

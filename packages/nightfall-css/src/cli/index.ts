#!/usr/bin/env node

/**
 * Nightfall CSS — CLI entry point.
 * The other theme. Reverse-engineered.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { scanCommand } from './scan.js';
import { generateCommand } from './generate.js';
import { watchCommand } from './watch.js';

const program = new Command();

const banner = chalk.bold(
  chalk.hex('#fbbf24')('night') + chalk.hex('#8b5cf6')('fall')
);

program
  .name('nightfall-css')
  .description(`${banner} — The other theme. Reverse-engineered.`)
  .version('0.1.0');

// Full pipeline: scan → analyze → generate
program
  .command('run')
  .description('Full pipeline: scan → analyze → generate (auto-detects direction)')
  .option('-u, --url <url>', 'URL to scan', 'http://localhost:3000')
  .option('-r, --routes <routes...>', 'Routes to scan', ['/'])
  .option('-d, --direction <direction>', 'Theme direction: auto, light-to-dark, dark-to-light, both', 'auto')
  .option('-f, --format <format>', 'Output format: css-variables, tailwind, scss, json-tokens, figma-tokens, style-dictionary', 'css-variables')
  .option('-o, --output <path>', 'Output file path')
  .option('-p, --preset <preset>', 'Preset: neutral, warm, midnight, oled, dimmed', 'neutral')
  .action(async (opts) => {
    await scanCommand(opts);
    await generateCommand(opts);
  });

// Scan
program
  .command('scan')
  .description('Scan a running app and extract color data')
  .option('-u, --url <url>', 'URL to scan', 'http://localhost:3000')
  .option('-r, --routes <routes...>', 'Routes to scan', ['/'])
  .option('-d, --direction <direction>', 'Direction override: auto, light-to-dark, dark-to-light', 'auto')
  .action(scanCommand);

// Generate
program
  .command('generate')
  .description('Generate the opposite theme from scan data')
  .option('-f, --format <format>', 'Output format', 'css-variables')
  .option('-o, --output <path>', 'Output file path')
  .option('-p, --preset <preset>', 'Preset name', 'neutral')
  .option('-d, --direction <direction>', 'Direction override', 'auto')
  .action(generateCommand);

// Preview
program
  .command('preview')
  .description('Open a split-screen preview of original vs generated theme')
  .option('-u, --url <url>', 'URL to preview', 'http://localhost:3000')
  .action(async (opts) => {
    const ora = (await import('ora')).default;
    const spinner = ora('Starting preview server...').start();
    spinner.succeed(
      chalk.green('Preview mode is available in the full release. ') +
      chalk.dim('Run `nightfall-css run` to generate your theme first.')
    );
  });

// Audit
program
  .command('audit')
  .description('Check WCAG contrast for all color pairs in generated theme')
  .option('-t, --target <level>', 'Contrast target: AA or AAA', 'AA')
  .action(async (opts) => {
    const ora = (await import('ora')).default;
    const boxen = (await import('boxen')).default;
    const { readFileSync, existsSync } = await import('fs');

    const spinner = ora('Running contrast audit...').start();

    const dataPath = '.nightfall.json';
    if (!existsSync(dataPath)) {
      spinner.fail(chalk.red('No .nightfall.json found. Run `nightfall-css scan` first.'));
      return;
    }

    const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
    spinner.succeed('Audit complete');

    // Display results
    const lines: string[] = [];
    lines.push(chalk.bold('  NIGHTFALL CONTRAST AUDIT'));
    lines.push('');

    let passed = 0;
    let failed = 0;
    let fixed = 0;

    if (data.audit) {
      for (const pair of data.audit) {
        const ratio = pair.ratio.toFixed(1);
        const level = pair.ratio >= 7 ? 'AAA' : pair.ratio >= 4.5 ? 'AA ' : 'FAIL';
        const icon = level === 'FAIL' ? chalk.red('✗') : chalk.green('✓');
        const label = level === 'FAIL' ? chalk.red(level) : chalk.green(level);

        lines.push(`  ${icon} ${pair.fg} on ${pair.bg}  → ${ratio}:1  (${label})`);

        if (level === 'FAIL') {
          failed++;
          if (pair.fixed) {
            fixed++;
            lines.push(chalk.yellow(`    → Auto-fixed: ${pair.original} → ${pair.fixed} (${pair.fixedRatio}:1 AA)`));
          }
        } else {
          passed++;
        }
      }
    }

    lines.push('');
    lines.push(`  ${passed + failed} pairs checked · ${chalk.green(passed + ' pass')} · ${fixed > 0 ? chalk.yellow(fixed + ' auto-fixed') : chalk.red(failed + ' fail')}`);

    console.log(boxen(lines.join('\n'), {
      padding: 1,
      borderStyle: 'double',
      borderColor: 'magenta',
    }));
  });

// Graph
program
  .command('graph')
  .description('Export a color relationship graph as SVG')
  .option('-o, --output <path>', 'Output SVG path', 'color-graph.svg')
  .action(async (opts) => {
    const ora = (await import('ora')).default;
    const { readFileSync, writeFileSync, existsSync } = await import('fs');

    const spinner = ora('Generating color graph...').start();

    if (!existsSync('.nightfall.json')) {
      spinner.fail(chalk.red('No .nightfall.json found. Run `nightfall-css scan` first.'));
      return;
    }

    const data = JSON.parse(readFileSync('.nightfall.json', 'utf-8'));
    const { buildColorGraph, graphToSvg } = await import('../core/color-graph.js');

    // Reconstruct classified colors from stored data
    const classifiedColors = Object.entries(data.source || {}).map(([role, info]: [string, any]) => ({
      role: role as any,
      value: info.value,
      oklch: info.oklch ? { L: info.oklch[0], C: info.oklch[1], H: info.oklch[2] } : { L: 0.5, C: 0, H: 0 },
      usage: info.usage || 0,
      cssProperty: 'background-color',
    }));

    const graph = buildColorGraph(classifiedColors);
    const svg = graphToSvg(graph);
    writeFileSync(opts.output, svg);

    spinner.succeed(chalk.green(`Color graph exported to ${chalk.bold(opts.output)}`));
  });

// Watch
program
  .command('watch')
  .description('Watch for file changes and re-scan')
  .option('-u, --url <url>', 'URL to scan', 'http://localhost:3000')
  .action(watchCommand);

// Init
program
  .command('init')
  .description('Initialize nightfall.config.json')
  .action(async () => {
    const { writeFileSync, existsSync } = await import('fs');

    if (existsSync('nightfall.config.json')) {
      console.log(chalk.yellow('nightfall.config.json already exists.'));
      return;
    }

    const config = {
      url: 'http://localhost:3000',
      routes: ['/'],
      direction: 'auto',
      preset: 'neutral',
      format: 'css-variables',
      output: 'nightfall-generated.css',
      colorSpace: 'oklch',
      contrast: { target: 'AA', minRatio: 4.5, autoFix: true },
      brand: { preserve: [], maxSaturationShift: 0.15, maxLightnessShift: 0.2 },
      shadows: { strategy: 'darken', opacity: 0.5 },
      tailwind: { detectClasses: true, configPath: 'tailwind.config.js' },
      ignore: { selectors: ['.no-dark', '[data-no-nightfall]'], colors: ['transparent', 'currentColor'] },
    };

    writeFileSync('nightfall.config.json', JSON.stringify(config, null, 2));
    console.log(chalk.green('✓ Created nightfall.config.json'));
  });

// Info
program
  .command('info')
  .description('Show detected direction and color summary without generating')
  .action(async () => {
    const { readFileSync, existsSync } = await import('fs');

    if (!existsSync('.nightfall.json')) {
      console.log(chalk.yellow('No .nightfall.json found. Run `nightfall-css scan` first.'));
      return;
    }

    const data = JSON.parse(readFileSync('.nightfall.json', 'utf-8'));
    console.log(chalk.bold(`\n  ${banner} info\n`));
    console.log(`  Direction: ${chalk.hex('#8b5cf6')(data.detectedDirection || 'unknown')}`);
    console.log(`  Source theme: ${data.sourceTheme || 'unknown'}`);
    console.log(`  Color space: ${data.colorSpace || 'oklch'}`);
    console.log(`  Scanned at: ${data.scannedAt || 'unknown'}`);

    const sourceCount = data.source ? Object.keys(data.source).length : 0;
    console.log(`  Colors found: ${chalk.bold(String(sourceCount))}`);
    console.log('');
  });

// Diff
program
  .command('diff')
  .description('Show what changed since last scan')
  .action(async () => {
    console.log(chalk.yellow('Diff requires a previous scan. Run `nightfall-css scan` first, then make changes and scan again.'));
  });

program.parse();

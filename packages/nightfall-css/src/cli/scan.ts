/**
 * Scan command — launches Playwright, visits pages, extracts colors.
 */

import chalk from 'chalk';
import type { ExtractedElement } from '../analyzers/dom-walker.js';

export interface ScanOptions {
  url: string;
  routes?: string[];
  direction?: string;
}

export async function scanCommand(opts: ScanOptions): Promise<void> {
  const ora = (await import('ora')).default;

  const banner = chalk.hex('#fbbf24')('night') + chalk.hex('#8b5cf6')('fall');
  console.log(`\n  ${chalk.bold(banner)} ${chalk.dim('v0.1.0')}\n`);

  const spinner = ora({
    text: 'Launching browser...',
    color: 'magenta',
  }).start();

  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    const routes = opts.routes || ['/'];
    const allElements: ExtractedElement[] = [];
    const cssVariables: Record<string, string> = {};
    const tailwindClasses: string[] = [];

    for (const route of routes) {
      const url = opts.url.replace(/\/$/, '') + route;
      spinner.text = `Scanning ${chalk.cyan(url)}...`;

      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000); // Let animations settle

      // Extract DOM colors
      const { getDomWalkerScript, getCssVariablesScript, getTailwindClassesScript } = await import('../analyzers/dom-walker.js');
      const elements = await page.evaluate(getDomWalkerScript()) as ExtractedElement[];
      allElements.push(...elements);

      // Extract CSS variables
      const vars = await page.evaluate(getCssVariablesScript()) as Record<string, string>;
      Object.assign(cssVariables, vars);

      // Extract Tailwind classes
      const classes = await page.evaluate(getTailwindClassesScript()) as string[];
      tailwindClasses.push(...classes);
    }

    await browser.close();

    spinner.text = 'Analyzing colors...';

    // Extract unique colors
    const { extractColors } = await import('./extract.js');
    const colorData = extractColors(allElements);

    // Detect direction
    const { detectThemeDirection } = await import('../core/detector.js');
    const detection = detectThemeDirection({
      backgrounds: colorData.backgrounds.map((b) => b.color),
      texts: colorData.texts.map((t) => t.color),
      rootBackground: colorData.rootBackground,
    });

    // Determine final direction
    let direction = opts.direction || 'auto';
    if (direction === 'auto') {
      if (detection.direction === 'light') {
        direction = 'light-to-dark';
      } else if (detection.direction === 'dark') {
        direction = 'dark-to-light';
      } else {
        spinner.warn(chalk.yellow('Ambiguous theme. Please specify --direction.'));
        return;
      }
    }

    // Classify colors
    const { classifyColors } = await import('../core/classifier.js');
    const isLight = detection.direction === 'light';
    const classified = classifyColors(colorData.all, isLight);

    // Build color graph
    const { buildColorGraph } = await import('../core/color-graph.js');
    const graph = buildColorGraph(classified);

    // Save to .nightfall.json
    const { writeFileSync } = await import('fs');
    const nightfallData = {
      version: '1.0.0',
      scannedAt: new Date().toISOString(),
      routes,
      url: opts.url,
      colorSpace: 'oklch',
      detectedDirection: direction,
      sourceTheme: isLight ? 'light' : 'dark',
      generatedTheme: isLight ? 'dark' : 'light',
      detection: {
        direction: detection.direction,
        confidence: detection.confidence,
        averageLightness: detection.averageLightness,
      },
      source: Object.fromEntries(
        classified.map((c) => [
          c.role,
          {
            value: c.value,
            oklch: [c.oklch.L, c.oklch.C, c.oklch.H],
            usage: c.usage,
          },
        ])
      ),
      cssVariables,
      tailwindClasses: [...new Set(tailwindClasses)],
      graph: {
        edges: graph.edges.map((e) => ({
          from: e.from,
          to: e.to,
          relation: e.relation,
          contrast: Number(e.contrast.toFixed(2)),
        })),
      },
    };

    writeFileSync('.nightfall.json', JSON.stringify(nightfallData, null, 2));

    spinner.succeed(chalk.green('Scan complete!'));

    // Show detection result
    const dirIcon = isLight ? '🌙' : '☀️';
    const genTheme = isLight ? 'dark' : 'light';
    console.log(
      `\n  ${chalk.dim('✨')} ${chalk.bold(detection.details)} ${dirIcon}\n`
    );
    console.log(`  ${chalk.dim('Colors found:')} ${chalk.bold(String(classified.length))}`);
    console.log(`  ${chalk.dim('Confidence:')} ${chalk.bold((detection.confidence * 100).toFixed(0) + '%')}`);
    console.log(`  ${chalk.dim('CSS variables:')} ${chalk.bold(String(Object.keys(cssVariables).length))}`);
    console.log(`  ${chalk.dim('Tailwind classes:')} ${chalk.bold(String(new Set(tailwindClasses).size))}`);
    console.log(`\n  ${chalk.dim('Saved to')} ${chalk.cyan('.nightfall.json')}`);
    console.log(`  ${chalk.dim('Next:')} ${chalk.cyan('nightfall-css generate')}\n`);

  } catch (error: any) {
    if (error.message?.includes('playwright')) {
      spinner.fail(chalk.red('Playwright not installed. Run: npx playwright install chromium'));
    } else {
      spinner.fail(chalk.red(`Scan failed: ${error.message}`));
    }
  }
}

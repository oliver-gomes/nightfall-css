/**
 * Watch mode — re-scans when files change.
 */

import chalk from 'chalk';

export interface WatchOptions {
  url: string;
  routes?: string[];
}

export async function watchCommand(opts: WatchOptions): Promise<void> {
  const ora = (await import('ora')).default;

  console.log(`\n  ${chalk.hex('#fbbf24')('night')}${chalk.hex('#8b5cf6')('fall')} ${chalk.dim('watch mode')}\n`);
  console.log(chalk.dim('  Watching for changes... Press Ctrl+C to stop.\n'));

  const chokidar = await import('chokidar');
  const { scanCommand } = await import('./scan.js');

  // Watch common source directories
  const watchPaths = [
    'src/**/*.{css,scss,less,tsx,jsx,ts,js,vue,svelte}',
    'app/**/*.{css,scss,less,tsx,jsx,ts,js}',
    'pages/**/*.{css,scss,less,tsx,jsx,ts,js}',
    'components/**/*.{css,scss,less,tsx,jsx,ts,js}',
    'styles/**/*.{css,scss,less}',
  ];

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let isScanning = false;

  const watcher = chokidar.watch(watchPaths, {
    ignored: ['node_modules', '.next', 'dist', '.nightfall.json'],
    persistent: true,
    ignoreInitial: true,
  });

  const handleChange = (path: string) => {
    if (isScanning) return;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      console.log(chalk.dim(`  File changed: ${path}`));
      isScanning = true;

      try {
        await scanCommand({ url: opts.url, routes: opts.routes });
      } catch (err: any) {
        console.log(chalk.red(`  Re-scan failed: ${err.message}`));
      }

      isScanning = false;
    }, 500);
  };

  watcher
    .on('change', handleChange)
    .on('add', handleChange)
    .on('unlink', handleChange);

  // Run initial scan
  try {
    await scanCommand({ url: opts.url, routes: opts.routes });
  } catch (err: any) {
    console.log(chalk.red(`  Initial scan failed: ${err.message}`));
  }
}

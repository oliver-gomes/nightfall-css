import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function PerformancePage() {
  return (
    <DocPage
      title="Performance"
      description="Incremental scanning, hash-based caching, and route-level optimization for fast theme generation."
    >
      <DocSection title="Overview">
        <p>
          Nightfall is designed to be fast even on large applications. The first scan captures
          everything; subsequent scans only process what changed. On a typical 20-route app,
          incremental rescans take under 2 seconds.
        </p>
      </DocSection>

      <DocSection title="Incremental Scanning">
        <p>
          After the first full scan, Nightfall only re-scans routes where the visual output
          changed. It detects changes by comparing a hash of the visible DOM state:
        </p>
        <CodeBlock
          language="bash"
          code={`# First scan: full (all routes)
npx nightfall-css scan --url http://localhost:3000 --routes / /about /pricing
# [scan] Scanning 3 routes (first run)...
# [scan] /         → 14 colors found (320ms)
# [scan] /about    → 8 colors found (180ms)
# [scan] /pricing  → 11 colors found (220ms)
# [scan] Total: 720ms

# Second scan: incremental (only changed routes)
npx nightfall-css scan --url http://localhost:3000 --routes / /about /pricing
# [scan] /         → unchanged (hash match, skipped)
# [scan] /about    → unchanged (hash match, skipped)
# [scan] /pricing  → 2 colors changed (190ms)
# [scan] Total: 190ms`}
        />
      </DocSection>

      <DocSection title="Hash-Based Caching">
        <p>
          Nightfall caches scan results in <code>.nightfall/cache/</code>. Each route gets a
          hash based on the visible DOM state. The hash includes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Computed styles</strong> — All color-related CSS properties on every visible element</li>
          <li><strong className="text-nf-text">CSS variables</strong> — Values of all custom properties on :root</li>
          <li><strong className="text-nf-text">DOM structure</strong> — Element nesting that affects color relationships</li>
        </ul>
        <CodeBlock
          language="js"
          filename=".nightfall/cache/route-hashes.json"
          code={`{
  "/": {
    "hash": "a3f8e2c1",
    "scannedAt": "2026-04-08T12:00:00Z",
    "colorCount": 14
  },
  "/about": {
    "hash": "b7d4f190",
    "scannedAt": "2026-04-08T12:00:00Z",
    "colorCount": 8
  },
  "/pricing": {
    "hash": "c2e5a3b8",
    "scannedAt": "2026-04-08T12:00:05Z",
    "colorCount": 11
  }
}`}
        />
      </DocSection>

      <DocSection title="Route-Level Caching">
        <p>
          Each route&apos;s scan data is cached independently. This means:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Parallel scanning</strong> — Multiple routes can be scanned concurrently using Playwright browser contexts</li>
          <li><strong className="text-nf-text">Partial invalidation</strong> — Changing one route only rescans that route, not the whole app</li>
          <li><strong className="text-nf-text">Cache sharing</strong> — Colors found on multiple routes are deduplicated in the final output</li>
        </ul>
      </DocSection>

      <DocSection title="Cache Management">
        <CodeBlock
          language="bash"
          code={`# View cache stats
npx nightfall-css cache --stats
# Routes cached: 12
# Total colors: 34
# Cache size: 48KB
# Last full scan: 2026-04-08T12:00:00Z

# Clear the cache (forces full rescan)
npx nightfall-css cache --clear

# Clear cache for a specific route
npx nightfall-css cache --clear --route /pricing`}
        />
      </DocSection>

      <DocSection title="Parallel Route Scanning">
        <p>
          By default, Nightfall scans up to 3 routes concurrently. Increase this for faster
          scans on large sites (at the cost of more memory):
        </p>
        <CodeBlock
          language="bash"
          code={`# Scan 5 routes in parallel
npx nightfall-css scan --url http://localhost:3000 \\
  --routes / /about /pricing /docs /blog \\
  --concurrency 5`}
        />
      </DocSection>

      <DocSection title="Generation Performance">
        <p>
          Theme generation (the transform step) is fast because it operates on the color
          graph in memory, not on the DOM. Typical generation times:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Small app (10-20 colors)</strong> — Under 10ms</li>
          <li><strong className="text-nf-text">Medium app (20-50 colors)</strong> — Under 25ms</li>
          <li><strong className="text-nf-text">Large app (50-100 colors)</strong> — Under 50ms</li>
          <li><strong className="text-nf-text">Very large (100+ colors)</strong> — Under 100ms</li>
        </ul>
        <p>
          The bottleneck is always the scanning step (browser launch + page rendering), not
          the transformation.
        </p>
      </DocSection>

      <DocSection title="Watch Mode Optimization">
        <p>
          In watch mode, Nightfall keeps the Playwright browser open between rescans,
          eliminating the browser launch overhead (typically 500-1000ms):
        </p>
        <CodeBlock
          language="bash"
          code={`# Watch mode keeps browser warm
npx nightfall-css watch --url http://localhost:3000

# First scan: ~1200ms (includes browser launch)
# Subsequent rescans: ~200ms (browser already running)
# Incremental rescans: ~100ms (only changed routes)`}
        />
      </DocSection>
    </DocPage>
  );
}

import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function ScanCommandPage() {
  return (
    <DocPage
      title="scan"
      description="Launch a headless browser, visit your pages, and extract every color relationship in your UI."
    >
      <DocSection title="Basic Usage">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan --url http://localhost:3000`}
        />
        <p>
          This launches Playwright, visits the root route, and extracts all computed styles
          including background colors, text colors, border colors, box shadows, and CSS variables.
        </p>
      </DocSection>

      <DocSection title="Multi-Route Scanning">
        <p>
          Pass multiple routes to scan your entire application. Nightfall deduplicates
          colors across routes and merges results into a single color graph:
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan --url http://localhost:3000 --routes / /about /pricing /dashboard

# Scan routes from a file (one route per line)
npx nightfall-css scan --url http://localhost:3000 --routes-file routes.txt`}
        />
      </DocSection>

      <DocSection title="What Gets Extracted">
        <p>For every visible DOM element, Nightfall collects:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Computed styles</strong> — <code>background-color</code>, <code>color</code>, <code>border-color</code>, <code>box-shadow</code>, <code>outline-color</code></li>
          <li><strong className="text-nf-text">CSS custom properties</strong> — All <code>--var</code> declarations on <code>:root</code> and scoped elements</li>
          <li><strong className="text-nf-text">Tailwind classes</strong> — Detected utility classes like <code>bg-slate-100</code>, <code>text-gray-900</code></li>
          <li><strong className="text-nf-text">Element relationships</strong> — Parent-child nesting to build the color graph</li>
          <li><strong className="text-nf-text">Contrast ratios</strong> — WCAG contrast between every foreground/background pair</li>
        </ul>
      </DocSection>

      <DocSection title="Options">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan --url URL [options]

Options:
  --url <url>            Target URL (required)
  --routes <paths...>    Routes to visit (default: /)
  --routes-file <file>   Load routes from a file
  --direction <dir>      Force direction: light-to-dark | dark-to-light | both
  --wait <ms>            Wait time after page load (default: 1000)
  --viewport <WxH>       Viewport size (default: 1280x720)
  --auth <cookie>        Authentication cookie to inject
  --ignore <selectors>   CSS selectors to skip
  --output <path>        Save scan data to file (default: .nightfall/scan.json)
  --verbose              Show detailed scan progress`}
        />
      </DocSection>

      <DocSection title="Authentication">
        <p>
          For pages behind authentication, pass a session cookie:
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan \\
  --url http://localhost:3000 \\
  --routes /dashboard /settings \\
  --auth "session=abc123; Path=/; HttpOnly"`}
        />
      </DocSection>

      <DocSection title="Scan Output">
        <p>
          The scan produces a JSON file at <code>.nightfall/scan.json</code> containing the
          full color graph. You can inspect it to see what Nightfall found:
        </p>
        <CodeBlock
          language="js"
          filename=".nightfall/scan.json"
          code={`{
  "version": "0.1.0",
  "scannedAt": "2026-04-08T12:00:00Z",
  "direction": "light-to-dark",
  "routes": ["/", "/about"],
  "colors": {
    "backgrounds": [
      { "value": "oklch(0.99 0.002 240)", "role": "page", "area": 921600 },
      { "value": "oklch(1.00 0.000 0)", "role": "surface", "area": 345600 }
    ],
    "text": [
      { "value": "oklch(0.15 0.01 240)", "role": "heading", "contrastOn": "page" },
      { "value": "oklch(0.30 0.01 240)", "role": "body", "contrastOn": "surface" }
    ],
    "borders": [...],
    "shadows": [...],
    "brand": [...]
  },
  "variables": {
    "--bg-primary": "#fafafa",
    "--text-primary": "#111827"
  }
}`}
        />
      </DocSection>

      <DocSection title="Ignoring Elements">
        <p>
          Skip elements that should not be theme-transformed (e.g., images, videos, third-party widgets):
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan \\
  --url http://localhost:3000 \\
  --ignore "img, video, iframe, [data-nightfall-ignore]"`}
        />
      </DocSection>
    </DocPage>
  );
}

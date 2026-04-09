import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function CiCdPage() {
  return (
    <DocPage
      title="CI/CD Integration"
      description="Run Nightfall in your continuous integration pipeline to auto-generate themes and catch contrast regressions."
    >
      <DocSection title="GitHub Actions">
        <p>
          The most common setup: generate the theme and run a contrast audit on every push.
          The workflow starts your dev server, waits for it to be ready, then runs Nightfall:
        </p>
        <CodeBlock
          language="bash"
          filename=".github/workflows/nightfall.yml"
          code={`name: Nightfall Theme Generation
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  nightfall:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      # Install Playwright browsers (needed for scanning)
      - run: npx playwright install chromium

      # Start dev server in background
      - run: npm run dev &

      # Wait for dev server to be ready
      - run: npx wait-on http://localhost:3000 --timeout 30000

      # Scan and generate theme
      - run: npx nightfall-css scan --url http://localhost:3000 --routes / /about /pricing
      - run: npx nightfall-css generate --format css-variables --output styles/dark-theme.css

      # Run contrast audit (fails the build if any pair is below AA)
      - run: npx nightfall-css audit --level aa --json > audit-report.json

      # Upload audit report as artifact
      - uses: actions/upload-artifact@v4
        with:
          name: nightfall-audit
          path: audit-report.json

      # Optional: export color graph
      - run: npx nightfall-css graph --output color-graph.svg
      - uses: actions/upload-artifact@v4
        with:
          name: color-graph
          path: color-graph.svg`}
        />
      </DocSection>

      <DocSection title="Auto-Commit Generated Theme">
        <p>
          Automatically commit the generated theme file back to the repository so it stays
          in sync with your source styles:
        </p>
        <CodeBlock
          language="bash"
          filename=".github/workflows/nightfall-commit.yml"
          code={`name: Auto-Generate Theme
on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.css'
      - 'src/**/*.tsx'
      - 'src/**/*.jsx'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run dev &
      - run: npx wait-on http://localhost:3000

      - run: npx nightfall-css scan --url http://localhost:3000
      - run: npx nightfall-css generate --format css-variables --output styles/dark-theme.css
      - run: npx nightfall-css audit --fix

      # Commit if there are changes
      - name: Commit generated theme
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add styles/dark-theme.css
          git diff --staged --quiet || git commit -m "chore: regenerate dark theme"
          git push`}
        />
      </DocSection>

      <DocSection title="PR Contrast Check">
        <p>
          Add a check that blocks PRs if they introduce contrast regressions:
        </p>
        <CodeBlock
          language="bash"
          filename=".github/workflows/contrast-check.yml"
          code={`name: Contrast Check
on: [pull_request]

jobs:
  contrast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run dev &
      - run: npx wait-on http://localhost:3000

      - run: npx nightfall-css scan --url http://localhost:3000
      - run: npx nightfall-css audit --level aa --json > audit.json

      # Fail if compliance is below 100%
      - name: Check compliance
        run: |
          COMPLIANCE=$(node -e "const r=require('./audit.json'); console.log(r.summary.compliance)")
          if [ "$COMPLIANCE" != "1" ]; then
            echo "Contrast audit failed. See audit.json for details."
            cat audit.json | node -e "const r=require('./audit.json'); r.pairs.filter(p=>!p.pass).forEach(p=>console.log(p.foreground,'on',p.background,p.ratio+':1'))"
            exit 1
          fi`}
        />
      </DocSection>

      <DocSection title="Other CI Platforms">
        <p>
          Nightfall works in any CI environment that supports Node.js and headless browsers.
          The key requirements are:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Node.js 18+</strong> — Required for the Nightfall CLI</li>
          <li><strong className="text-nf-text">Playwright Chromium</strong> — Run <code>npx playwright install chromium</code> before scanning</li>
          <li><strong className="text-nf-text">Running dev server</strong> — Nightfall scans a live URL, so your app must be running</li>
        </ul>
        <CodeBlock
          language="bash"
          filename="Generic CI script"
          code={`# Works in GitLab CI, CircleCI, Jenkins, etc.
npm ci
npx playwright install chromium
npm run dev &
npx wait-on http://localhost:3000
npx nightfall-css scan --url http://localhost:3000
npx nightfall-css generate --format css-variables
npx nightfall-css audit --level aa`}
        />
      </DocSection>

      <DocSection title="Caching in CI">
        <p>
          Cache the <code>.nightfall/</code> directory between CI runs to speed up
          incremental scans:
        </p>
        <CodeBlock
          language="bash"
          code={`# GitHub Actions caching
- uses: actions/cache@v4
  with:
    path: .nightfall/cache
    key: nightfall-\${{ hashFiles('src/**/*.css', 'src/**/*.tsx') }}`}
        />
      </DocSection>
    </DocPage>
  );
}

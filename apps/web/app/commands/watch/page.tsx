import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function WatchCommandPage() {
  return (
    <DocPage
      title="watch"
      description="Re-scan automatically when your source files change for a seamless development workflow."
    >
      <DocSection title="Basic Usage">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css watch --url http://localhost:3000`}
        />
        <p>
          Watches your source directories for file changes. When a CSS, TSX, JSX, or other
          relevant file is modified, Nightfall automatically re-scans your running app and
          regenerates the theme. This keeps your opposite theme in sync during development.
        </p>
      </DocSection>

      <DocSection title="Watched File Types">
        <p>By default, Nightfall watches for changes to these file types:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><code>.css</code>, <code>.scss</code>, <code>.less</code> — Stylesheet changes</li>
          <li><code>.tsx</code>, <code>.jsx</code> — Component changes that affect styles</li>
          <li><code>.ts</code>, <code>.js</code> — Configuration or utility changes</li>
          <li><code>.html</code> — Template changes</li>
        </ul>
      </DocSection>

      <DocSection title="Watched Directories">
        <p>Nightfall watches these directories by default:</p>
        <CodeBlock
          language="bash"
          code={`# Default watched directories
src/
app/
pages/
components/
styles/

# Ignored by default
node_modules/
.next/
dist/
build/
.nightfall/`}
        />
      </DocSection>

      <DocSection title="Options">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css watch [options]

Options:
  --url <url>          Target URL (required)
  --format <format>    Output format (default: css-variables)
  --output <path>      Output file path
  --preset <name>      Apply a preset
  --debounce <ms>      Debounce delay before re-scan (default: 500)
  --watch-dirs <dirs>  Custom directories to watch
  --ignore <patterns>  Additional ignore patterns
  --routes <paths>     Routes to scan on each change
  --verbose            Show detailed re-scan output`}
        />
      </DocSection>

      <DocSection title="Custom Watch Directories">
        <p>Override the default watched directories:</p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css watch \\
  --url http://localhost:3000 \\
  --watch-dirs src/styles src/components src/layouts`}
        />
      </DocSection>

      <DocSection title="Output During Watch">
        <p>
          Watch mode provides real-time feedback as it detects changes and regenerates:
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css watch --url http://localhost:3000 --verbose

# [watch] Watching src/, app/, styles/
# [watch] Initial scan complete — 24 tokens generated
# [watch] Waiting for changes...
#
# [watch] Changed: src/components/Card.tsx
# [watch] Re-scanning http://localhost:3000...
# [watch] 2 colors changed, 22 unchanged
# [watch] Regenerated ./nightfall-theme.css (18ms)
#
# [watch] Changed: src/styles/globals.css
# [watch] Re-scanning http://localhost:3000...
# [watch] 5 colors changed, 19 unchanged
# [watch] Regenerated ./nightfall-theme.css (22ms)`}
        />
      </DocSection>

      <DocSection title="With Hot Reload">
        <p>
          Watch mode pairs perfectly with your dev server&apos;s hot reload. When you change a
          style, your dev server reloads, then Nightfall re-scans the updated page and
          regenerates the opposite theme — all automatically:
        </p>
        <CodeBlock
          language="bash"
          code={`# Terminal 1: Your dev server
npm run dev

# Terminal 2: Nightfall watch mode
npx nightfall-css watch --url http://localhost:3000 --format css-variables`}
        />
      </DocSection>

      <DocSection title="Debounce">
        <p>
          Rapid file saves (e.g., from auto-save) are debounced to avoid redundant scans.
          The default debounce is 500ms. Increase it if your dev server takes longer to rebuild:
        </p>
        <CodeBlock
          language="bash"
          code={`# Wait 2 seconds after last change before re-scanning
npx nightfall-css watch --url http://localhost:3000 --debounce 2000`}
        />
      </DocSection>
    </DocPage>
  );
}

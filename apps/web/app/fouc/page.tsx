import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function FoucPage() {
  return (
    <DocPage
      title="FOUC Prevention"
      description="Prevent flash of unstyled content with a tiny inline script that runs before first paint."
    >
      <DocSection title="The Problem">
        <p>
          Without FOUC prevention, users see a brief flash of the wrong theme. The page loads
          with the default (usually light) theme, then JavaScript executes and switches to dark.
          This flash is jarring and makes the app feel broken.
        </p>
        <p>
          The fix is a synchronous inline script in the <code>&lt;head&gt;</code> that runs before
          the browser paints. It reads the stored preference and applies it immediately.
        </p>
      </DocSection>

      <DocSection title="The Script">
        <p>
          Under 500 bytes. Add it as an inline script in your <code>&lt;head&gt;</code>:
        </p>
        <CodeBlock
          language="js"
          filename="FOUC prevention script"
          code={`(function() {
  var d = document.documentElement;
  var s = 'nightfall-theme';
  var a = 'data-theme';
  try {
    var t = localStorage.getItem(s);
    if (t === 'dark' || t === 'light') {
      d.setAttribute(a, t);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      d.setAttribute(a, 'dark');
    }
  } catch (e) {}
})();`}
        />
      </DocSection>

      <DocSection title="Next.js Integration">
        <p>
          In Next.js, use <code>dangerouslySetInnerHTML</code> to inline the script:
        </p>
        <CodeBlock
          language="tsx"
          filename="app/layout.tsx"
          code={`import { nightfallScript } from 'nightfall-css/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: nightfallScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}`}
        />
        <p>
          The <code>suppressHydrationWarning</code> on the <code>&lt;html&gt;</code> element prevents
          React from warning about the attribute mismatch between server and client.
        </p>
      </DocSection>

      <DocSection title="Plain HTML">
        <p>For non-framework projects, paste the script directly:</p>
        <CodeBlock
          language="js"
          filename="index.html"
          code={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>My App</title>
  <script>
    (function() {
      var d = document.documentElement;
      var t = localStorage.getItem('nightfall-theme');
      if (t === 'dark' || t === 'light') {
        d.setAttribute('data-theme', t);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        d.setAttribute('data-theme', 'dark');
      }
    })();
  </script>
  <link rel="stylesheet" href="nightfall-theme.css" />
</head>
<body>
  <!-- Your content -->
</body>
</html>`}
        />
      </DocSection>

      <DocSection title="How It Works">
        <ol className="list-decimal list-inside space-y-3 text-nf-text-muted">
          <li><strong className="text-nf-text">Inline in head</strong> — The script is inline (not an external file), so it executes synchronously before the browser paints.</li>
          <li><strong className="text-nf-text">Check localStorage</strong> — Reads the stored theme preference. If the user previously chose dark mode, it applies immediately.</li>
          <li><strong className="text-nf-text">Fall back to system preference</strong> — If no stored preference exists, checks <code>prefers-color-scheme: dark</code>.</li>
          <li><strong className="text-nf-text">Set the attribute</strong> — Applies <code>data-theme=&quot;dark&quot;</code> on the <code>&lt;html&gt;</code> element before the CSS is evaluated, so the correct theme variables are used from the very first paint.</li>
          <li><strong className="text-nf-text">Error handling</strong> — The <code>try/catch</code> handles cases where localStorage is disabled (private browsing, iframes).</li>
        </ol>
      </DocSection>

      <DocSection title="Custom Storage Key">
        <p>
          If you use a custom <code>storageKey</code> in the provider, update the FOUC script
          to match:
        </p>
        <CodeBlock
          language="js"
          code={`import { createFoucScript } from 'nightfall-css/script'

// Generate a FOUC script with custom options
const script = createFoucScript({
  storageKey: 'my-app-theme',
  attribute: 'data-color-mode',
  defaultDark: false,  // Don't default to dark even if system prefers it
})`}
        />
      </DocSection>
    </DocPage>
  );
}

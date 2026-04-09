import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";
import { ToggleShowcase } from "@/components/ToggleShowcase";

export default function ThemeTogglePage() {
  return (
    <DocPage
      title="Theme Toggle"
      description="Add a light/dark toggle button to your site in under a minute. Works with React or plain JS."
    >
      <DocSection title="Preview">
        <p>
          Click the toggles below to see them in action. Each mini-preview has
          its own independent theme state.
        </p>
        <ToggleShowcase />
      </DocSection>

      <DocSection title="React">
        <p>
          Drop the <code className="text-nf-cyan text-sm">NightfallToggle</code> component
          anywhere inside your <code className="text-nf-cyan text-sm">NightfallProvider</code>:
        </p>
        <CodeBlock
          language="tsx"
          filename="Header.tsx"
          code={`import { NightfallToggle } from 'nightfall-css/react'

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <NightfallToggle />
    </header>
  )
}`}
        />
        <p>Customise with props:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li>
            <code className="text-nf-cyan text-sm">size</code> —{" "}
            <code>&quot;sm&quot;</code> | <code>&quot;md&quot;</code> |{" "}
            <code>&quot;lg&quot;</code> (default: <code>&quot;md&quot;</code>)
          </li>
          <li>
            <code className="text-nf-cyan text-sm">iconStyle</code> —{" "}
            <code>&quot;system&quot;</code> | <code>&quot;emoji&quot;</code> |{" "}
            <code>&quot;text&quot;</code> (default: <code>&quot;system&quot;</code>)
          </li>
          <li>
            <code className="text-nf-cyan text-sm">className</code> — Additional classes for custom styling
          </li>
        </ul>
      </DocSection>

      <DocSection title="Build Your Own (React)">
        <p>
          Use the <code className="text-nf-cyan text-sm">useNightfall</code> hook
          to build a fully custom toggle:
        </p>
        <CodeBlock
          language="tsx"
          filename="CustomToggle.tsx"
          code={`import { useNightfall } from 'nightfall-css/react'

export function CustomToggle() {
  const { resolvedTheme, toggleTheme } = useNightfall()

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}`}
        />
      </DocSection>

      <DocSection title="Vanilla JS">
        <p>
          For non-React projects, inject a pre-built toggle button with one function call:
        </p>
        <CodeBlock
          language="html"
          filename="index.html"
          code={`<div id="toggle-container"></div>

<script type="module">
  import {
    createToggle,
    getToggleHTML,
    getToggleCSS
  } from 'nightfall-css/script'

  // 1. Inject the toggle CSS
  const style = document.createElement('style')
  style.textContent = getToggleCSS()
  document.head.appendChild(style)

  // 2. Inject the toggle button
  document.querySelector('#toggle-container')
    .innerHTML = getToggleHTML()

  // 3. Wire up the toggle logic
  const { toggle } = createToggle()
  document.querySelector('#nightfall-toggle')
    .addEventListener('click', toggle)
</script>`}
        />
      </DocSection>

      <DocSection title="Styling">
        <p>
          The built-in toggle uses the <code className="text-nf-cyan text-sm">.nightfall-toggle</code> class.
          Override it to match your design:
        </p>
        <CodeBlock
          language="css"
          filename="custom-toggle.css"
          code={`/* Override size and color */
.nightfall-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--nf-text);
}

.nightfall-toggle:hover {
  background: var(--nf-surface);
}

/* Icon visibility is handled automatically:
   - Sun icon shows in dark mode
   - Moon icon shows in light mode */`}
        />
      </DocSection>

      <DocSection title="Keyboard Accessible">
        <p>
          Both the React component and the vanilla HTML toggle include proper
          accessibility out of the box:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li>
            <code className="text-nf-cyan text-sm">aria-label=&quot;Toggle theme&quot;</code> for screen readers
          </li>
          <li>Focusable with <kbd className="px-1.5 py-0.5 rounded bg-nf-surface border border-nf-border text-xs">Tab</kbd> and activatable with <kbd className="px-1.5 py-0.5 rounded bg-nf-surface border border-nf-border text-xs">Enter</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-nf-surface border border-nf-border text-xs">Space</kbd></li>
          <li>Visible focus ring for keyboard navigation</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}

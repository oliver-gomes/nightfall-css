import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function ReactPage() {
  return (
    <DocPage
      title="React Integration"
      description="NightfallProvider, useNightfall hook, and NightfallToggle component — under 3KB total."
    >
      <DocSection title="Installation">
        <p>
          The React integration is included in the main package. No additional install needed:
        </p>
        <CodeBlock
          language="bash"
          code={`npm install nightfall-css
# React components are at nightfall-css/react`}
        />
      </DocSection>

      <DocSection title="NightfallProvider">
        <p>
          Wrap your app with the provider. It manages theme state, localStorage persistence,
          and system preference detection:
        </p>
        <CodeBlock
          language="tsx"
          filename="app/layout.tsx"
          code={`import { NightfallProvider } from 'nightfall-css/react'
import './nightfall-generated.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NightfallProvider
          defaultTheme="system"
          storageKey="nightfall-theme"
          attribute="data-theme"
        >
          {children}
        </NightfallProvider>
      </body>
    </html>
  )
}`}
        />
        <p>Provider props:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><code className="text-nf-cyan text-sm">defaultTheme</code> — Initial theme: <code>&quot;light&quot;</code>, <code>&quot;dark&quot;</code>, or <code>&quot;system&quot;</code> (default: <code>&quot;system&quot;</code>)</li>
          <li><code className="text-nf-cyan text-sm">storageKey</code> — localStorage key for persistence (default: <code>&quot;nightfall-theme&quot;</code>)</li>
          <li><code className="text-nf-cyan text-sm">attribute</code> — HTML attribute set on the root element (default: <code>&quot;data-theme&quot;</code>)</li>
          <li><code className="text-nf-cyan text-sm">enableSystem</code> — Whether to respect <code>prefers-color-scheme</code> (default: <code>true</code>)</li>
          <li><code className="text-nf-cyan text-sm">disableTransition</code> — Disable CSS transitions during theme switch to prevent flicker (default: <code>false</code>)</li>
        </ul>
      </DocSection>

      <DocSection title="useNightfall Hook">
        <p>
          Access theme state and controls from any component:
        </p>
        <CodeBlock
          language="tsx"
          filename="ThemeStatus.tsx"
          code={`import { useNightfall } from 'nightfall-css/react'

export function ThemeStatus() {
  const {
    theme,          // 'light' | 'dark' | 'system'
    resolvedTheme,  // 'light' | 'dark' (actual resolved value)
    setTheme,       // (theme: string) => void
    toggleTheme,    // () => void — switches between light and dark
    systemTheme,    // 'light' | 'dark' — current OS preference
  } = useNightfall()

  return (
    <div>
      <p>Setting: {theme}</p>
      <p>Resolved: {resolvedTheme}</p>
      <p>System prefers: {systemTheme}</p>

      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}`}
        />
      </DocSection>

      <DocSection title="NightfallToggle Component">
        <p>
          A ready-to-use toggle button with sun/moon icons and smooth transitions:
        </p>
        <CodeBlock
          language="tsx"
          filename="Header.tsx"
          code={`import { NightfallToggle } from 'nightfall-css/react'

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <NightfallToggle
        size="md"           // 'sm' | 'md' | 'lg'
        iconStyle="system"  // 'system' | 'emoji' | 'text'
        className="custom-toggle-class"
      />
    </header>
  )
}

// Renders a button that:
// - Shows a sun icon in dark mode (click to switch to light)
// - Shows a moon icon in light mode (click to switch to dark)
// - Animates the icon transition
// - Includes aria-label for accessibility`}
        />
      </DocSection>

      <DocSection title="Server Components (Next.js)">
        <p>
          The provider works with React Server Components. Only the provider and toggle are
          client components — your page content remains a server component:
        </p>
        <CodeBlock
          language="tsx"
          filename="app/page.tsx"
          code={`// This is a Server Component — no 'use client' needed
export default function Page() {
  return (
    <main>
      <h1>Hello from a Server Component</h1>
      <p>Theme switching works because the provider is in the layout.</p>
    </main>
  )
}`}
        />
      </DocSection>

      <DocSection title="Avoiding Hydration Mismatch">
        <p>
          The provider delays rendering theme-dependent content until after hydration to prevent
          React hydration mismatches. Add <code>suppressHydrationWarning</code> to your
          <code> html</code> element and use the FOUC prevention script for seamless loading:
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
      <body>
        <NightfallProvider>{children}</NightfallProvider>
      </body>
    </html>
  )
}`}
        />
      </DocSection>
    </DocPage>
  );
}

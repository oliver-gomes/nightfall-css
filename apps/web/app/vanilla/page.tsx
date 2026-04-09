import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function VanillaPage() {
  return (
    <DocPage
      title="Vanilla JS"
      description="Framework-free theme toggle for any project — plain JavaScript, no dependencies."
    >
      <DocSection title="createToggle">
        <p>
          The core toggle function manages theme state, localStorage persistence, and
          DOM attribute updates:
        </p>
        <CodeBlock
          language="js"
          filename="theme-setup.js"
          code={`import { createToggle } from 'nightfall-css/script'

const toggle = createToggle({
  storageKey: 'nightfall-theme',  // localStorage key
  attribute: 'data-theme',        // HTML attribute to set
  defaultTheme: 'system',         // 'light' | 'dark' | 'system'
  onChange: (theme) => {
    console.log('Theme changed to:', theme)
  },
})

// Toggle between light and dark
document.querySelector('#toggle-btn')
  .addEventListener('click', toggle.toggle)

// Get current theme
console.log(toggle.getTheme())       // 'light' | 'dark' | 'system'
console.log(toggle.getResolved())    // 'light' | 'dark'

// Set explicitly
toggle.setTheme('dark')
toggle.setTheme('light')
toggle.setTheme('system')

// Listen for system preference changes
// (handled automatically, but you can add custom logic)
toggle.onSystemChange((systemTheme) => {
  console.log('OS preference changed to:', systemTheme)
})`}
        />
      </DocSection>

      <DocSection title="getToggleHTML">
        <p>
          Get a ready-to-use HTML string for a theme toggle button. Drop it into any page:
        </p>
        <CodeBlock
          language="js"
          filename="inject-toggle.js"
          code={`import { getToggleHTML } from 'nightfall-css/script'

// Get the HTML for a toggle button
const html = getToggleHTML({
  size: 'md',          // 'sm' | 'md' | 'lg'
  iconStyle: 'svg',   // 'svg' | 'emoji' | 'text'
  ariaLabel: 'Toggle dark mode',
})

// Inject it into your page
document.querySelector('#theme-toggle-container').innerHTML = html

// The HTML output looks like:
// <button
//   id="nightfall-toggle"
//   aria-label="Toggle dark mode"
//   class="nightfall-toggle nightfall-toggle--md"
// >
//   <svg class="nightfall-icon-sun">...</svg>
//   <svg class="nightfall-icon-moon">...</svg>
// </button>`}
        />
      </DocSection>

      <DocSection title="getToggleCSS">
        <p>
          Get the minimal CSS needed for the toggle button. Inject it as a style tag or
          include it in your build:
        </p>
        <CodeBlock
          language="js"
          filename="inject-styles.js"
          code={`import { getToggleCSS } from 'nightfall-css/script'

// Get the CSS string
const css = getToggleCSS()

// Inject as a style tag
const style = document.createElement('style')
style.textContent = css
document.head.appendChild(style)

// Or include in your build pipeline
// The CSS handles:
// - Sun/moon icon visibility based on current theme
// - Smooth rotation/fade transition between icons
// - Hover and focus states
// - Size variants (sm, md, lg)`}
        />
      </DocSection>

      <DocSection title="Full Example">
        <p>A complete vanilla JS setup with no framework:</p>
        <CodeBlock
          language="js"
          filename="index.html"
          code={`<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="nightfall-theme.css" />
  <script>
    // FOUC prevention (inline, runs before paint)
    (function(){
      var t = localStorage.getItem('nightfall-theme');
      if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  </script>
</head>
<body>
  <header>
    <h1>My Site</h1>
    <div id="toggle-container"></div>
  </header>

  <script type="module">
    import { createToggle, getToggleHTML, getToggleCSS } from 'nightfall-css/script'

    // Inject toggle CSS
    const style = document.createElement('style')
    style.textContent = getToggleCSS()
    document.head.appendChild(style)

    // Inject toggle button
    document.querySelector('#toggle-container').innerHTML = getToggleHTML()

    // Initialize toggle logic
    const toggle = createToggle({ storageKey: 'nightfall-theme' })

    document.querySelector('#nightfall-toggle')
      .addEventListener('click', toggle.toggle)
  </script>
</body>
</html>`}
        />
      </DocSection>

      <DocSection title="CDN Usage">
        <p>For projects without a build step, use the CDN version:</p>
        <CodeBlock
          language="js"
          code={`<script src="https://unpkg.com/nightfall-css/dist/script.umd.js"></script>
<script>
  const toggle = NightfallCSS.createToggle({ storageKey: 'theme' })
  document.querySelector('#btn').addEventListener('click', toggle.toggle)
</script>`}
        />
      </DocSection>
    </DocPage>
  );
}

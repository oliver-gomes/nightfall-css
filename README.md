<p align="center">
 <img width="1200" height="200" alt="Nightfall" src="https://github.com/user-attachments/assets/b0dee599-ab28-4436-a77a-ef611020684c" />

</p>

# nightfall-css

The other theme. Reverse-engineered. Auto-generate the opposite theme from your existing UI — dark-to-light or light-to-dark.

No `filter: invert()`. No naive color swap. Nightfall visits your running app, analyzes every color relationship, and produces a production-ready complementary theme.

## Quick start

```bash
npm install nightfall-css
```

```bash
# Full pipeline — scan your app and generate the opposite theme
npx nightfall-css run --url http://localhost:3000
```

## How it works

1. **Scan** — Opens a headless browser, visits your running app, and extracts every color from the computed styles
2. **Detect** — Determines whether your app is light-mode or dark-mode using luminance analysis
3. **Transform** — Maps each color to its opposite using OKLCH color science, preserving hue, brand identity, and contrast hierarchy
4. **Generate** — Outputs a complete theme in your chosen format

## Commands

```bash
# Scan your UI and extract colors
npx nightfall-css scan --url http://localhost:3000

# Generate the opposite theme
npx nightfall-css generate --direction auto --format css-variables

# Preview side-by-side in the browser
npx nightfall-css preview

# Audit WCAG contrast compliance
npx nightfall-css audit

# Watch for changes and regenerate
npx nightfall-css watch --url http://localhost:3000
```

## CLI flags

| Flag | Default | Description |
|------|---------|-------------|
| `--url` | `http://localhost:3000` | URL to scan |
| `--routes` | `/` | Routes to scan |
| `--direction` | `auto` | `auto`, `light-to-dark`, `dark-to-light`, `both` |
| `--format` | `css-variables` | Output format (see below) |
| `--output` | — | Output file path |
| `--preset` | `neutral` | `neutral`, `warm`, `midnight`, `oled`, `dimmed` |

## Export formats

| Format | Flag | Output |
|--------|------|--------|
| CSS Variables | `css-variables` | `:root` / `[data-theme="dark"]` custom properties |
| Tailwind | `tailwind` | `tailwind.config.js` color extension |
| SCSS | `scss` | `$variable` declarations |
| Design Tokens (JSON) | `json-tokens` | W3C Design Tokens format |
| Figma Tokens | `figma-tokens` | Figma Tokens Studio compatible |
| Style Dictionary | `style-dictionary` | Style Dictionary source format |

## React

```tsx
import { NightfallProvider, NightfallToggle } from 'nightfall-css/react'
import './nightfall-theme.css'

export default function Layout({ children }) {
  return (
    <NightfallProvider defaultTheme="system">
      <header>
        <NightfallToggle />
      </header>
      {children}
    </NightfallProvider>
  )
}
```

### useNightfall hook

```tsx
import { useNightfall } from 'nightfall-css/react'

function ThemeSwitch() {
  const { resolvedTheme, toggleTheme, setTheme } = useNightfall()

  return (
    <div>
      <p>Current: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

## Vanilla JS

```js
import { createToggle, getToggleHTML, getToggleCSS } from 'nightfall-css/script'

// Inject toggle button and styles
document.head.appendChild(
  Object.assign(document.createElement('style'), { textContent: getToggleCSS() })
)
document.querySelector('#toggle').innerHTML = getToggleHTML()

// Wire up
const { toggle } = createToggle({ storageKey: 'nightfall-theme' })
document.querySelector('#nightfall-toggle').addEventListener('click', toggle)
```

## FOUC prevention

Add this inline script before any stylesheet to prevent flash of unstyled content:

```html
<script>
  (function(){
    var t = localStorage.getItem('nightfall-theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

## Package exports

| Import | Use |
|--------|-----|
| `nightfall-css` | Core API — `scan`, `generate`, `analyze` |
| `nightfall-css/react` | `NightfallProvider`, `useNightfall`, `NightfallToggle` |
| `nightfall-css/script` | `createToggle`, `getToggleHTML`, `getToggleCSS`, FOUC script |

## Color science

Nightfall uses **OKLCH** (Oklab Lightness, Chroma, Hue) for perceptually uniform color transformations:

- **Backgrounds** invert lightness on a curve — white doesn't become pure black
- **Text hierarchy** is preserved — headings stay highest contrast, muted text stays subtle
- **Brand colors** shift minimally — recognizable hue preserved, contrast adapted
- **Shadows** transform to glows in dark mode with matching intensity
- **WCAG compliance** is auto-enforced — contrast ratios are adjusted to meet AA/AAA

## Links

- [Docs](https://nightfall-css.vercel.app/overview)
- [npm](https://www.npmjs.com/package/nightfall-css)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=oliver-gomes/nightfall-css&type=Date)](https://star-history.com/#oliver-gomes/nightfall-css&Date)

## License

MIT

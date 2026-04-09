# nightfall-css

**The other theme. Reverse-engineered.**

Nightfall is an open-source developer tool that automatically generates the opposite theme from your existing UI — dark→light or light→dark. Not `filter: invert()`. Not a naive color swap. Nightfall visits your running app, analyzes every color relationship, and produces a complete complementary theme that preserves your design intent.

## Quick Start

```bash
# Scan your running app
npx nightfall-css scan --url http://localhost:3000

# Generate the opposite theme
npx nightfall-css generate --format css-variables

# Drop it in
# @import './nightfall-generated.css';
```

## Features

- **Bidirectional** — Light→dark or dark→light. Auto-detects direction.
- **OKLCH Color Science** — Perceptually uniform transformations.
- **WCAG Auto-Fix** — Contrast checked and auto-corrected.
- **Brand Preservation** — Your brand colors stay recognizable.
- **6 Export Formats** — CSS variables, Tailwind, SCSS, JSON tokens, Figma tokens, Style Dictionary.
- **Zero Runtime** — Output is just CSS. Optional ~3KB React toggle.
- **5 Presets** — Neutral, warm, midnight, OLED, dimmed.

## Commands

```bash
npx nightfall-css run                    # Full pipeline (auto-detect)
npx nightfall-css scan --url URL         # Scan and extract colors
npx nightfall-css generate --format FMT  # Generate theme
npx nightfall-css preview                # Split-screen preview
npx nightfall-css audit                  # WCAG contrast audit
npx nightfall-css graph --output SVG     # Color relationship graph
npx nightfall-css watch                  # Watch mode
npx nightfall-css init                   # Create config file
```

## Config

```json
{
  "url": "http://localhost:3000",
  "routes": ["/", "/about"],
  "direction": "auto",
  "preset": "neutral",
  "format": "css-variables",
  "contrast": { "target": "AA", "autoFix": true }
}
```

## React Integration

```tsx
import { NightfallProvider } from 'nightfall-css/react'
import './nightfall-generated.css'

export default function Layout({ children }) {
  return (
    <NightfallProvider defaultTheme="system">
      {children}
    </NightfallProvider>
  )
}
```

## License

MIT

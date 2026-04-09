import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function LightToDarkPage() {
  return (
    <DocPage
      title="Light → Dark"
      description="How Nightfall transforms a light UI into a dark theme while preserving hierarchy, brand identity, and accessibility."
    >
      <DocSection title="Background Inversion">
        <p>
          Page backgrounds invert their lightness in OKLCH space. Pure white (<code>L=1.0</code>)
          maps to a deep dark (<code>L=0.13</code>), not pure black. This avoids the harsh feel
          of true-black dark modes while maintaining contrast.
        </p>
        <CodeBlock
          language="css"
          filename="backgrounds.css"
          code={`/* Light original → Dark generated */
--bg-page:    oklch(0.99 0.002 240);   /* #fafafa → */
--bg-page:    oklch(0.13 0.005 240);   /* #0f1012 */

--bg-surface: oklch(1.00 0.000 0);     /* #ffffff → */
--bg-surface: oklch(0.17 0.005 240);   /* #181a1e */`}
        />
      </DocSection>

      <DocSection title="Surface Elevation Stack">
        <p>
          In dark mode, elevation is communicated through lightness rather than shadows.
          Higher surfaces are lighter, creating a visual stacking order:
        </p>
        <CodeBlock
          language="css"
          filename="elevation.css"
          code={`/* Dark elevation stack */
--bg-page:      oklch(0.13 0.005 240);  /* Base layer */
--bg-surface:   oklch(0.17 0.005 240);  /* Cards, panels */
--bg-elevated:  oklch(0.21 0.005 240);  /* Dropdowns, modals */
--bg-overlay:   oklch(0.25 0.005 240);  /* Popovers, tooltips */`}
        />
        <p>
          Each level is approximately <code>+0.04 L</code> above the previous, creating
          subtle but perceptible layering.
        </p>
      </DocSection>

      <DocSection title="Text Mapping">
        <p>
          Text colors invert along the lightness axis, maintaining the same contrast hierarchy:
        </p>
        <CodeBlock
          language="css"
          filename="text.css"
          code={`/* Light text → Dark text */
--text-heading: oklch(0.15 0.01 240);  /* Near-black → */
--text-heading: oklch(0.95 0.01 240);  /* Near-white */

--text-body:    oklch(0.30 0.01 240);  /* Dark gray → */
--text-body:    oklch(0.82 0.01 240);  /* Light gray */

--text-muted:   oklch(0.55 0.01 240);  /* Mid gray → */
--text-muted:   oklch(0.60 0.01 240);  /* Slightly lighter mid */`}
        />
      </DocSection>

      <DocSection title="Brand Color Preservation">
        <p>
          Brand colors shift minimally. Hue is never changed. Saturation adjusts by at most 15%,
          and lightness by at most 20%. This keeps your brand recognizable:
        </p>
        <CodeBlock
          language="css"
          filename="brand.css"
          code={`/* Brand blue in light → dark */
--brand-primary: oklch(0.55 0.22 260);  /* #2563eb → */
--brand-primary: oklch(0.62 0.20 260);  /* #3b82f6 */
/* Hue: unchanged | Chroma: -0.02 | Lightness: +0.07 */`}
        />
      </DocSection>

      <DocSection title="Border Transformation">
        <p>
          Solid light-mode borders (typically gray) become semi-transparent white borders in
          dark mode. This adapts naturally to any surface they sit on:
        </p>
        <CodeBlock
          language="css"
          filename="borders.css"
          code={`/* Light → Dark borders */
--border-default: #e5e7eb;              /* Gray-200 → */
--border-default: rgba(255, 255, 255, 0.08);  /* White at 8% */

--border-strong:  #d1d5db;              /* Gray-300 → */
--border-strong:  rgba(255, 255, 255, 0.14);  /* White at 14% */`}
        />
      </DocSection>

      <DocSection title="Shadow Transformation">
        <p>
          Shadows in dark mode need more opacity and larger blur to remain visible against
          dark backgrounds:
        </p>
        <CodeBlock
          language="css"
          filename="shadows.css"
          code={`/* Light → Dark shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);     /* → */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.30);

--shadow-md: 0 4px 6px rgba(0,0,0,0.07);     /* → */
--shadow-md: 0 4px 8px rgba(0,0,0,0.40);

--shadow-lg: 0 10px 15px rgba(0,0,0,0.10);   /* → */
--shadow-lg: 0 10px 20px rgba(0,0,0,0.50);`}
        />
      </DocSection>

      <DocSection title="Full Example">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan --url http://localhost:3000 --direction light-to-dark
npx nightfall-css generate --format css-variables --output dark-theme.css`}
        />
      </DocSection>
    </DocPage>
  );
}

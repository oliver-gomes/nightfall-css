import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function DarkToLightPage() {
  return (
    <DocPage
      title="Dark → Light"
      description="Generating a light theme from an existing dark UI — including shadow generation from scratch."
    >
      <DocSection title="Background Inversion">
        <p>
          Deep dark backgrounds map to near-white, not pure white. This avoids the
          clinical feel of <code>#ffffff</code> everywhere and keeps the result warm
          and approachable:
        </p>
        <CodeBlock
          language="css"
          filename="backgrounds.css"
          code={`/* Dark original → Light generated */
--bg-page:    oklch(0.13 0.005 240);   /* #0f1012 → */
--bg-page:    oklch(0.98 0.003 240);   /* #f8f9fb */

--bg-surface: oklch(0.17 0.005 240);   /* #181a1e → */
--bg-surface: oklch(1.00 0.000 0);     /* #ffffff */`}
        />
      </DocSection>

      <DocSection title="Reverse Elevation Model">
        <p>
          In dark UIs, higher surfaces are lighter. In light mode, the model reverses:
          higher surfaces are slightly darker or use shadows to communicate depth:
        </p>
        <CodeBlock
          language="css"
          filename="elevation.css"
          code={`/* Light elevation stack */
--bg-page:      oklch(0.98 0.003 240);  /* Base layer — lightest */
--bg-surface:   oklch(1.00 0.000 0);    /* Cards — white */
--bg-elevated:  oklch(1.00 0.000 0);    /* Dropdowns — white + shadow */
--bg-overlay:   oklch(1.00 0.000 0);    /* Popovers — white + larger shadow */`}
        />
        <p>
          In light mode, elevation is primarily communicated through shadows rather than
          background color differences.
        </p>
      </DocSection>

      <DocSection title="Text Transformation">
        <p>
          Light text on dark backgrounds becomes dark text on light backgrounds.
          The hierarchy is preserved through relative contrast:
        </p>
        <CodeBlock
          language="css"
          filename="text.css"
          code={`/* Dark text → Light text */
--text-heading: oklch(0.95 0.01 240);  /* Near-white → */
--text-heading: oklch(0.15 0.01 240);  /* Near-black */

--text-body:    oklch(0.82 0.01 240);  /* Light gray → */
--text-body:    oklch(0.30 0.01 240);  /* Dark gray */

--text-muted:   oklch(0.60 0.01 240);  /* Mid gray → */
--text-muted:   oklch(0.50 0.01 240);  /* Slightly darker mid */`}
        />
      </DocSection>

      <DocSection title="Brand Colors Can Be More Vibrant">
        <p>
          On light backgrounds, brand colors have more room to be vivid. Nightfall may
          increase chroma slightly while staying within the delta-E budget:
        </p>
        <CodeBlock
          language="css"
          filename="brand.css"
          code={`/* Brand blue in dark → light */
--brand-primary: oklch(0.62 0.20 260);  /* #3b82f6 → */
--brand-primary: oklch(0.55 0.23 260);  /* #2563eb */
/* Hue: unchanged | Chroma: +0.03 | Lightness: -0.07 */`}
        />
      </DocSection>

      <DocSection title="Border Transformation">
        <p>
          Semi-transparent white borders from dark mode become semi-transparent black
          borders in light mode:
        </p>
        <CodeBlock
          language="css"
          filename="borders.css"
          code={`/* Dark → Light borders */
--border-default: rgba(255, 255, 255, 0.08);  /* → */
--border-default: rgba(0, 0, 0, 0.08);        /* Black at 8% */

--border-strong:  rgba(255, 255, 255, 0.14);  /* → */
--border-strong:  rgba(0, 0, 0, 0.12);        /* Black at 12% */`}
        />
      </DocSection>

      <DocSection title="Shadow Generation from Scratch">
        <p>
          Dark UIs typically have no visible shadows (they disappear against dark backgrounds).
          When generating a light theme, Nightfall creates a complete shadow scale from scratch:
        </p>
        <CodeBlock
          language="css"
          filename="shadows.css"
          code={`/* Generated shadow scale for light theme */
--shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md:  0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.04);
--shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.08), 0 8px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.14);`}
        />
        <p>
          The generated scale follows Material Design and Tailwind conventions, using
          layered shadows with decreasing opacity for a natural, soft appearance.
        </p>
      </DocSection>

      <DocSection title="Full Example">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan --url http://localhost:3000 --direction dark-to-light
npx nightfall-css generate --format css-variables --output light-theme.css`}
        />
      </DocSection>
    </DocPage>
  );
}

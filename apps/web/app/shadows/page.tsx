import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function ShadowsPage() {
  return (
    <DocPage
      title="Shadows"
      description="Bidirectional shadow transformation — including generating shadows from scratch when dark UIs have none."
    >
      <DocSection title="The Challenge">
        <p>
          Shadows are the hardest part of bidirectional theme generation. In light mode,
          shadows provide depth and elevation cues. In dark mode, shadows are nearly invisible
          and elevation is communicated through surface lightness instead. Nightfall handles
          both directions correctly.
        </p>
      </DocSection>

      <DocSection title="Light to Dark: Adapting Shadows">
        <p>
          When transforming light to dark, existing shadows need to become more prominent
          because they have less contrast against dark backgrounds:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Opacity increased by 3-5x</strong> — A shadow at <code>rgba(0,0,0,0.05)</code> becomes <code>rgba(0,0,0,0.30)</code></li>
          <li><strong className="text-nf-text">Blur radius increased by 1.2-1.5x</strong> — Slightly softer to compensate for the increased opacity</li>
          <li><strong className="text-nf-text">Spread reduced slightly</strong> — Tighter shadows look more natural on dark surfaces</li>
        </ul>
        <CodeBlock
          language="css"
          filename="light-to-dark shadows"
          code={`/* Original light shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07),
             0 2px 4px -2px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08),
             0 4px 6px -4px rgba(0, 0, 0, 0.04);

/* Transformed dark shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.30);
--shadow-md: 0 4px 8px -1px rgba(0, 0, 0, 0.40),
             0 2px 5px -2px rgba(0, 0, 0, 0.30);
--shadow-lg: 0 10px 20px -3px rgba(0, 0, 0, 0.50),
             0 4px 8px -4px rgba(0, 0, 0, 0.25);`}
        />
      </DocSection>

      <DocSection title="Dark to Light: Generating from Scratch">
        <p>
          Dark UIs often have <strong>zero shadows</strong> because they are invisible on dark
          backgrounds. When generating a light theme from a dark source, Nightfall creates
          a complete shadow scale from scratch based on the elevation model:
        </p>
        <CodeBlock
          language="js"
          filename="shadow-generation.js"
          code={`function generateShadowScale(elevationLevels) {
  // Map each elevation level to a shadow
  // Higher elevation = more prominent shadow
  return {
    xs:  '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm:  '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md:  '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04)',
    lg:  '0 10px 15px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.04)',
    xl:  '0 20px 25px rgba(0, 0, 0, 0.08), 0 8px 10px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.14)',
  };
}`}
        />
      </DocSection>

      <DocSection title="Generated Shadow Scale">
        <p>
          The generated shadow scale follows established conventions from Material Design
          and Tailwind CSS, using layered shadows for natural depth:
        </p>
        <CodeBlock
          language="css"
          filename="generated-shadows.css"
          code={`/* Generated shadow scale for light theme */
--shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.06),
              0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md:  0 4px 6px rgba(0, 0, 0, 0.05),
              0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.06),
              0 4px 6px rgba(0, 0, 0, 0.04);
--shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.08),
              0 8px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.14);`}
        />
      </DocSection>

      <DocSection title="Elevation-to-Shadow Mapping">
        <p>
          Nightfall maps the dark theme&apos;s lightness-based elevation to shadow-based elevation
          in the light theme:
        </p>
        <CodeBlock
          language="bash"
          code={`# Dark theme elevation (lightness-based)     → Light theme elevation (shadow-based)
# --bg-page     L=0.13 (base)                → --bg-page     white, no shadow
# --bg-surface  L=0.17 (+0.04 from base)     → --bg-surface  white + shadow-sm
# --bg-elevated L=0.21 (+0.08 from base)     → --bg-elevated white + shadow-md
# --bg-overlay  L=0.25 (+0.12 from base)     → --bg-overlay  white + shadow-lg`}
        />
      </DocSection>

      <DocSection title="Multi-Layer Shadows">
        <p>
          Each shadow level uses two layers: a larger ambient shadow and a smaller direct shadow.
          This produces a more natural, physically-inspired appearance compared to single-layer shadows:
        </p>
        <CodeBlock
          language="css"
          code={`/* Single layer (flat, unnatural) */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.10);

/* Two layers (natural, depth) */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05),   /* ambient */
             0 2px 4px rgba(0, 0, 0, 0.04);    /* direct */`}
        />
      </DocSection>
    </DocPage>
  );
}

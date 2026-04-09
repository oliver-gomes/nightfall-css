import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function PreviewCommandPage() {
  return (
    <DocPage
      title="preview"
      description="Visually compare your original theme with the generated one in a split-screen browser."
    >
      <DocSection title="Basic Usage">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css preview`}
        />
        <p>
          Opens a local browser window with a split-screen comparison. The left side shows
          your original UI, and the right side shows the generated theme applied in real time.
          A draggable divider lets you slide between the two.
        </p>
      </DocSection>

      <DocSection title="Split-Screen Interface">
        <p>The preview window includes:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Draggable divider</strong> — Click and drag to compare any region of your UI side by side.</li>
          <li><strong className="text-nf-text">Preset selector</strong> — Switch between presets (neutral, warm, midnight, oled, dimmed) and see the result instantly.</li>
          <li><strong className="text-nf-text">Contrast toggle</strong> — Toggle WCAG contrast overlays to see which elements pass AA/AAA.</li>
          <li><strong className="text-nf-text">Color overrides</strong> — Click any color swatch to manually tweak it and see the change live.</li>
          <li><strong className="text-nf-text">Export button</strong> — When satisfied, click Export to write the theme file.</li>
        </ul>
      </DocSection>

      <DocSection title="Options">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css preview [options]

Options:
  --url <url>          Target URL (uses scan data URL by default)
  --port <port>        Local preview server port (default: 4400)
  --preset <name>      Start with a specific preset
  --format <format>    Export format when using the Export button
  --output <path>      Export output path
  --route <path>       Start on a specific route`}
        />
      </DocSection>

      <DocSection title="Preset Selector">
        <p>
          The preset dropdown in the toolbar lets you cycle through all available presets.
          Each preset applies immediately so you can compare them visually:
        </p>
        <CodeBlock
          language="bash"
          code={`# Start preview with the midnight preset selected
npx nightfall-css preview --preset midnight`}
        />
      </DocSection>

      <DocSection title="Contrast Overlay">
        <p>
          Toggle the contrast overlay to see a color-coded map of WCAG compliance across your UI:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><span className="text-green-500 font-semibold">Green outline</span> — Passes WCAG AAA (7:1 or better)</li>
          <li><span className="text-yellow-500 font-semibold">Yellow outline</span> — Passes WCAG AA (4.5:1) but not AAA</li>
          <li><span className="text-red-500 font-semibold">Red outline</span> — Fails WCAG AA (below 4.5:1)</li>
        </ul>
      </DocSection>

      <DocSection title="Color Overrides">
        <p>
          Click any color in the generated theme panel to open an inline editor.
          Adjustments are constrained to maintain WCAG compliance:
        </p>
        <CodeBlock
          language="bash"
          code={`# In the preview window:
# 1. Click a color swatch in the right panel
# 2. Adjust hue, chroma, or lightness with sliders
# 3. The preview updates in real time
# 4. Contrast ratios are recalculated live
# 5. A warning appears if your change would break WCAG AA`}
        />
      </DocSection>

      <DocSection title="Exporting from Preview">
        <p>
          Once satisfied, click the Export button in the top-right corner.
          This writes the theme file with any manual overrides baked in:
        </p>
        <CodeBlock
          language="bash"
          code={`# The Export button runs the equivalent of:
npx nightfall-css generate --format css-variables --output dark-theme.css
# With any manual color overrides included in the output`}
        />
      </DocSection>

      <DocSection title="Keyboard Shortcuts">
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><code>1-5</code> — Switch between presets</li>
          <li><code>C</code> — Toggle contrast overlay</li>
          <li><code>R</code> — Reset all overrides</li>
          <li><code>E</code> — Export current theme</li>
          <li><code>Left/Right arrows</code> — Move the divider</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}

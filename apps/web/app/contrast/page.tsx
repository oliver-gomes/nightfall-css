import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function ContrastPage() {
  return (
    <DocPage
      title="Contrast"
      description="WCAG contrast enforcement with automatic correction that preserves your design intent."
    >
      <DocSection title="WCAG Standards">
        <p>Nightfall enforces WCAG 2.1 contrast requirements:</p>
        <ul className="list-disc list-inside space-y-3 text-nf-text-muted">
          <li>
            <strong className="text-nf-text">WCAG AA</strong> — The default target.
            Requires 4.5:1 contrast ratio for normal text and 3:1 for large text
            (18px+ or 14px+ bold).
          </li>
          <li>
            <strong className="text-nf-text">WCAG AAA</strong> — The stricter standard.
            Requires 7:1 for normal text and 4.5:1 for large text. Use <code>--contrast aaa</code> to
            target this level.
          </li>
        </ul>
      </DocSection>

      <DocSection title="How Contrast Is Checked">
        <p>
          During generation, Nightfall checks every foreground color against the background
          it was originally observed on. The color graph from the scan phase tells Nightfall
          which colors sit on which surfaces:
        </p>
        <CodeBlock
          language="bash"
          code={`# Contrast checking during generation
# [contrast] --text-heading on --bg-page:     15.2:1 ✓ AAA
# [contrast] --text-body on --bg-page:        10.1:1 ✓ AAA
# [contrast] --text-body on --bg-surface:      9.8:1 ✓ AAA
# [contrast] --text-muted on --bg-page:        4.7:1 ✓ AA
# [contrast] --text-muted on --bg-elevated:    3.8:1 ✗ FAIL
# [contrast] → Auto-fixing --text-muted...`}
        />
      </DocSection>

      <DocSection title="Auto-Fix Algorithm">
        <p>
          When a color pair fails contrast, Nightfall adjusts the foreground color&apos;s lightness
          in OKLCH space with the minimum change needed:
        </p>
        <CodeBlock
          language="js"
          filename="contrast-fix.js"
          code={`function autoFixContrast(foreground, background, targetRatio) {
  const fgOklch = toOKLCH(foreground);
  const bgOklch = toOKLCH(background);

  // Determine direction: lighten or darken the foreground?
  // On dark backgrounds, lighten. On light backgrounds, darken.
  const direction = bgOklch.l < 0.5 ? +1 : -1;

  // Binary search for the minimum lightness adjustment
  let lo = 0, hi = direction === +1 ? (1 - fgOklch.l) : fgOklch.l;
  let bestL = fgOklch.l;

  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    const testL = fgOklch.l + mid * direction;
    const ratio = contrastRatio(
      { ...fgOklch, l: testL },
      bgOklch
    );

    if (ratio >= targetRatio) {
      bestL = testL;
      hi = mid; // Try less adjustment
    } else {
      lo = mid; // Need more adjustment
    }
  }

  // Hue and chroma are unchanged
  return { l: bestL, c: fgOklch.c, h: fgOklch.h };
}`}
        />
      </DocSection>

      <DocSection title="Minimal Perceptual Change">
        <p>
          The auto-fix always produces the smallest possible visual change:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Only lightness changes</strong> — Hue and chroma are never modified. The color keeps its character.</li>
          <li><strong className="text-nf-text">Binary search precision</strong> — 20 iterations of binary search find the exact threshold to within 0.001 L units.</li>
          <li><strong className="text-nf-text">Direction-aware</strong> — On dark backgrounds, text gets lighter. On light backgrounds, text gets darker. Always moving away from the background.</li>
        </ul>
      </DocSection>

      <DocSection title="Configuration">
        <CodeBlock
          language="bash"
          code={`# Target WCAG AA (default)
npx nightfall-css generate --format css-variables --contrast aa

# Target WCAG AAA
npx nightfall-css generate --format css-variables --contrast aaa

# Disable auto-fix (just report failures)
npx nightfall-css generate --format css-variables --no-auto-fix`}
        />
        <CodeBlock
          language="js"
          filename="nightfall.config.js"
          code={`module.exports = {
  contrast: {
    target: 'aa',        // 'aa' or 'aaa'
    autoFix: true,       // Auto-adjust failing pairs
    reportOnly: false,   // If true, warn but don't fix
    ignore: [            // Skip contrast check for these pairs
      'border-*',        // Borders don't need text contrast
      'shadow-*',        // Shadows don't need contrast
    ]
  }
};`}
        />
      </DocSection>

      <DocSection title="Large Text Exception">
        <p>
          WCAG allows lower contrast for large text (18px regular or 14px bold). Nightfall
          detects text size from the scan data and applies the appropriate threshold:
        </p>
        <CodeBlock
          language="bash"
          code={`# Large text gets a lower threshold
# [contrast] --text-heading (24px) on --bg-surface: 3.2:1 ✓ AA (large text: 3:1)
# [contrast] --text-body (16px) on --bg-surface:    3.2:1 ✗ FAIL (normal text: 4.5:1)`}
        />
      </DocSection>
    </DocPage>
  );
}

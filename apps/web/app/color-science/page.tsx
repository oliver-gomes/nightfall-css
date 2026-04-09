import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function ColorSciencePage() {
  return (
    <DocPage
      title="Color Science"
      description="A deep dive into OKLCH, perceptual uniformity, delta-E, and gamut mapping — the foundations of Nightfall's transformations."
    >
      <DocSection title="Why OKLCH?">
        <p>
          HSL is not perceptually uniform. A 10-degree hue shift at one point on the wheel
          looks dramatically different than the same shift elsewhere. HSL &quot;yellow&quot; at 50%
          lightness appears far brighter than HSL &quot;blue&quot; at 50% lightness. This means
          HSL-based dark mode generators produce inconsistent results.
        </p>
        <p className="mt-3">
          OKLCH (created by Bjorn Ottosson in 2020) solves this. Equal numerical changes in
          L, C, or H produce equal <em>visual</em> changes across the entire color space.
          When Nightfall shifts a color&apos;s lightness by 0.1, it looks like the same amount
          of change whether the color is red, blue, or green.
        </p>
      </DocSection>

      <DocSection title="The Three Channels">
        <ul className="list-disc list-inside space-y-4 text-nf-text-muted">
          <li>
            <strong className="text-nf-text">L (Lightness)</strong> — Ranges from 0 (pure black)
            to 1 (pure white). Unlike HSL lightness, OKLCH L is perceptually linear:
            L=0.5 genuinely looks like &quot;medium brightness&quot; to human eyes, regardless of hue.
          </li>
          <li>
            <strong className="text-nf-text">C (Chroma)</strong> — Saturation intensity, starting
            at 0 (pure gray). Higher values are more vivid. Unlike HSL saturation, OKLCH
            chroma is perceptually meaningful — a chroma of 0.1 looks equally saturated
            across all hues.
          </li>
          <li>
            <strong className="text-nf-text">H (Hue)</strong> — 0 to 360 degrees around the color
            wheel. Unlike HSL, equal angular distances in OKLCH feel equally different to the
            human eye.
          </li>
        </ul>
      </DocSection>

      <DocSection title="OKLCH vs HSL: A Comparison">
        <CodeBlock
          language="bash"
          code={`# HSL: "50% lightness" looks wildly different across hues
hsl(60, 100%, 50%)   →  Yellow  →  Appears VERY bright
hsl(240, 100%, 50%)  →  Blue    →  Appears quite dark

# OKLCH: L=0.7 looks equally bright across all hues
oklch(0.7 0.15 90)   →  Yellow  →  Moderate brightness
oklch(0.7 0.15 260)  →  Blue    →  Moderate brightness (same!)

# This is why OKLCH produces better theme transformations.
# When we set L=0.15 for a dark background, it looks equally
# dark regardless of the hue undertone chosen.`}
        />
      </DocSection>

      <DocSection title="Delta-E: Measuring Perceptual Distance">
        <p>
          Delta-E (dE) measures the perceptual distance between two colors. Nightfall uses
          the OKLCH-based delta-E formula to verify that transformations stay within acceptable
          bounds:
        </p>
        <CodeBlock
          language="js"
          filename="delta-e.js"
          code={`function deltaE(color1, color2) {
  // Both colors in OKLCH
  const dL = color1.l - color2.l;
  const dC = color1.c - color2.c;

  // Hue difference needs special handling for the circular nature
  let dH = color1.h - color2.h;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;

  // Convert hue difference to a linear distance
  const hDist = 2 * Math.sqrt(color1.c * color2.c) *
    Math.sin((dH * Math.PI) / 360);

  return Math.sqrt(dL * dL + dC * dC + hDist * hDist);
}`}
        />
        <p>Nightfall uses delta-E for:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Brand color budgets</strong> — Ensures brand colors stay within dE &lt; 15 of their original values</li>
          <li><strong className="text-nf-text">Auto-fix validation</strong> — Verifies that contrast fixes are minimal</li>
          <li><strong className="text-nf-text">Roundtrip testing</strong> — Confirms that light-to-dark-to-light produces dE &lt; 2.0</li>
        </ul>
      </DocSection>

      <DocSection title="Delta-E Reference Scale">
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">0 - 1</strong> — Imperceptible difference</li>
          <li><strong className="text-nf-text">1 - 2</strong> — Perceptible only through close comparison</li>
          <li><strong className="text-nf-text">2 - 5</strong> — Noticeable at a glance</li>
          <li><strong className="text-nf-text">5 - 10</strong> — Clearly different but same color family</li>
          <li><strong className="text-nf-text">10 - 15</strong> — Different shade of the same hue</li>
          <li><strong className="text-nf-text">15+</strong> — Starts to feel like a different color</li>
        </ul>
      </DocSection>

      <DocSection title="Gamut Mapping">
        <p>
          OKLCH can represent colors outside the sRGB gamut (the range of colors displays
          can show). When a transformation produces an out-of-gamut color, Nightfall uses
          binary search to find the maximum chroma that fits within sRGB:
        </p>
        <CodeBlock
          language="js"
          filename="gamut-mapping.js"
          code={`function gamutMap(oklch) {
  // Check if the color is within sRGB gamut
  if (isInGamut(oklch)) return oklch;

  // Binary search: reduce chroma until the color fits in sRGB
  let lo = 0;
  let hi = oklch.c;
  let bestC = 0;

  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    const test = { l: oklch.l, c: mid, h: oklch.h };

    if (isInGamut(test)) {
      bestC = mid;
      lo = mid;  // Can we push chroma higher?
    } else {
      hi = mid;  // Need less chroma
    }
  }

  return { l: oklch.l, c: bestC, h: oklch.h };
}

// This preserves the hue and lightness exactly,
// reducing only chroma (saturation) to fit.
// The result is the most vivid version of the
// color that sRGB can display.`}
        />
      </DocSection>

      <DocSection title="CSS Native OKLCH">
        <p>
          Modern CSS supports OKLCH natively, which means Nightfall&apos;s output values work
          directly in stylesheets without conversion:
        </p>
        <CodeBlock
          language="css"
          code={`/* OKLCH in CSS — supported in all modern browsers */
.card {
  background: oklch(0.17 0.005 240);
  color: oklch(0.82 0.01 240);
  border-color: oklch(0.30 0.005 240 / 0.5);  /* with alpha */
}`}
        />
        <p>
          Browser support: Chrome 111+, Firefox 113+, Safari 15.4+. Use the
          <code> --fallback hex</code> option for older browsers.
        </p>
      </DocSection>
    </DocPage>
  );
}

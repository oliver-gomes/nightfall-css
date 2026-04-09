import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function BrandColorsPage() {
  return (
    <DocPage
      title="Brand Colors"
      description="How Nightfall preserves your brand identity during theme transformation with strict perceptual budgets."
    >
      <DocSection title="The Problem">
        <p>
          Naive color inversion turns your brand blue into an ugly orange. Even simple lightness
          flipping can produce muddy, unrecognizable brand colors. Your brand&apos;s primary blue at
          <code> oklch(0.55 0.22 260)</code> inverted naively would become <code>oklch(0.45 0.22 80)</code> — a completely different color.
        </p>
        <p>
          Nightfall solves this by treating brand colors as a special classification with
          strict transformation budgets.
        </p>
      </DocSection>

      <DocSection title="Transformation Budgets">
        <p>Brand colors are constrained by three hard limits:</p>
        <ul className="list-disc list-inside space-y-3 text-nf-text-muted">
          <li>
            <strong className="text-nf-text">Hue: never changes</strong> — Your blue stays blue. Period.
            The hue angle is locked during transformation.
          </li>
          <li>
            <strong className="text-nf-text">Chroma: max 15% shift</strong> — Saturation may increase
            slightly to maintain vibrancy on dark backgrounds, or decrease slightly to avoid
            clipping, but never by more than 15%.
          </li>
          <li>
            <strong className="text-nf-text">Lightness: max 20% shift</strong> — The color may lighten
            to maintain contrast on dark backgrounds, but the change is bounded.
          </li>
          <li>
            <strong className="text-nf-text">Delta-E: max 15</strong> — The overall perceptual distance
            between original and transformed brand color must be below 15. This is a
            safety net that catches any combination of changes that would make the color
            unrecognizable.
          </li>
        </ul>
      </DocSection>

      <DocSection title="How It Works">
        <CodeBlock
          language="js"
          filename="brand-transform.js"
          code={`function transformBrandColor(original, direction) {
  const oklch = toOKLCH(original);

  // Hue is LOCKED
  const newH = oklch.h;

  // Lightness shifts just enough for contrast, within budget
  let newL = oklch.l;
  if (direction === 'light-to-dark') {
    // Lighten brand color for dark backgrounds
    newL = Math.min(oklch.l + 0.20, oklch.l * 1.15);
  } else {
    // Darken brand color for light backgrounds
    newL = Math.max(oklch.l - 0.20, oklch.l * 0.85);
  }

  // Chroma adjusts slightly for contrast
  let newC = oklch.c;
  newC = clamp(newC, oklch.c * 0.85, oklch.c * 1.15);

  // Verify delta-E budget
  const result = { l: newL, c: newC, h: newH };
  const distance = deltaE(oklch, result);

  if (distance > 15) {
    // Pull back toward original until within budget
    return interpolate(oklch, result, 15 / distance);
  }

  return result;
}`}
        />
      </DocSection>

      <DocSection title="Example Transformations">
        <CodeBlock
          language="css"
          filename="brand-examples.css"
          code={`/* Brand blue — light to dark */
--brand-primary: oklch(0.55 0.22 260);  /* Original: #2563eb */
--brand-primary: oklch(0.62 0.20 260);  /* Dark:     #3b82f6 */
/* ΔL: +0.07 | ΔC: -0.02 | ΔH: 0 | ΔE: 4.2 ✓ */

/* Brand purple — light to dark */
--brand-accent: oklch(0.50 0.25 300);   /* Original: #7c3aed */
--brand-accent: oklch(0.58 0.23 300);   /* Dark:     #8b5cf6 */
/* ΔL: +0.08 | ΔC: -0.02 | ΔH: 0 | ΔE: 5.1 ✓ */

/* Brand green — light to dark */
--brand-success: oklch(0.55 0.18 145);  /* Original: #16a34a */
--brand-success: oklch(0.62 0.17 145);  /* Dark:     #22c55e */
/* ΔL: +0.07 | ΔC: -0.01 | ΔH: 0 | ΔE: 3.8 ✓ */`}
        />
      </DocSection>

      <DocSection title="Registering Brand Colors">
        <p>
          Nightfall auto-detects brand colors (saturated, non-gray colors used on interactive
          elements). You can also register them explicitly for tighter control:
        </p>
        <CodeBlock
          language="js"
          filename="nightfall.config.js"
          code={`module.exports = {
  brand: {
    // Colors to preserve (hex, rgb, oklch, or CSS variable names)
    preserve: ['#2563eb', '#7c3aed', '#16a34a'],

    // Optional: tighten or loosen budgets
    maxChromaShift: 0.15,    // default: 0.15 (15%)
    maxLightnessShift: 0.20, // default: 0.20 (20%)
    maxDeltaE: 15,           // default: 15
  }
};`}
        />
      </DocSection>

      <DocSection title="Delta-E Scale">
        <p>For context, here is what delta-E values mean perceptually:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">0-1</strong> — Not perceptible to the human eye</li>
          <li><strong className="text-nf-text">1-2</strong> — Perceptible only through close observation</li>
          <li><strong className="text-nf-text">2-5</strong> — Perceptible at a glance</li>
          <li><strong className="text-nf-text">5-10</strong> — Clearly different but still recognizably the same color</li>
          <li><strong className="text-nf-text">10-15</strong> — Different shade of the same hue family</li>
          <li><strong className="text-nf-text">15+</strong> — Starts to feel like a different color entirely</li>
        </ul>
        <p>
          Nightfall&apos;s default budget of 15 keeps brand colors firmly within the &quot;same color
          family&quot; range.
        </p>
      </DocSection>
    </DocPage>
  );
}

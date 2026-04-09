import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function AutoDetectPage() {
  return (
    <DocPage
      title="Auto-Detection"
      description="How Nightfall determines whether your site is light or dark — no configuration required."
    >
      <DocSection title="How It Works">
        <p>
          When you run Nightfall without a <code>--direction</code> flag, it automatically detects
          whether your UI is in light mode or dark mode. This detection happens in OKLCH color space
          for perceptual accuracy.
        </p>
        <ol className="list-decimal list-inside space-y-3 text-nf-text-muted">
          <li><strong className="text-nf-text">Sample the background</strong> — Nightfall reads the computed <code>background-color</code> of the root element and major surface containers.</li>
          <li><strong className="text-nf-text">Compute weighted average lightness</strong> — Each sampled color is converted to OKLCH. The lightness (L) values are averaged, weighted by the element&apos;s visible area in the viewport.</li>
          <li><strong className="text-nf-text">Classify the theme</strong> — The weighted average L value determines the direction.</li>
        </ol>
      </DocSection>

      <DocSection title="Detection Thresholds">
        <p>The decision boundaries are based on OKLCH lightness (L ranges from 0 to 1):</p>
        <CodeBlock
          language="bash"
          code={`# Detection thresholds
L > 0.6  →  Light mode detected  →  generates dark theme
L < 0.4  →  Dark mode detected   →  generates light theme
0.4 ≤ L ≤ 0.6  →  Ambiguous  →  falls back to --direction flag`}
        />
        <p>
          The ambiguous zone (0.4 to 0.6) covers mid-tone UIs where the intent is unclear.
          In these cases, Nightfall requires you to specify the direction explicitly.
        </p>
      </DocSection>

      <DocSection title="Weighted Sampling">
        <p>
          Not all elements contribute equally. A full-screen hero background matters more than a
          tiny badge. Nightfall weights each sample by its pixel area relative to the viewport:
        </p>
        <CodeBlock
          language="js"
          filename="detection-algorithm.js"
          code={`// Simplified detection logic
function detectDirection(elements) {
  let totalWeight = 0;
  let weightedL = 0;

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    const area = rect.width * rect.height;
    const bg = getComputedStyle(el).backgroundColor;
    const oklch = toOKLCH(bg);

    weightedL += oklch.l * area;
    totalWeight += area;
  }

  const avgL = weightedL / totalWeight;

  if (avgL > 0.6) return "light-to-dark";
  if (avgL < 0.4) return "dark-to-light";
  return "ambiguous";
}`}
        />
      </DocSection>

      <DocSection title="Overriding Auto-Detection">
        <p>
          If auto-detection picks the wrong direction (rare, but possible with unusual color
          schemes), override it with the <code>--direction</code> flag:
        </p>
        <CodeBlock
          language="bash"
          code={`# Force light-to-dark even if detection says otherwise
npx nightfall-css scan --url http://localhost:3000 --direction light-to-dark

# Force dark-to-light
npx nightfall-css scan --url http://localhost:3000 --direction dark-to-light`}
        />
      </DocSection>

      <DocSection title="Debugging Detection">
        <p>
          Use the <code>--verbose</code> flag to see exactly what Nightfall detected:
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css scan --url http://localhost:3000 --verbose

# Output:
# [detect] Sampled 14 background surfaces
# [detect] Weighted avg lightness: L=0.94
# [detect] Classification: LIGHT (L > 0.6)
# [detect] Direction: light-to-dark`}
        />
      </DocSection>
    </DocPage>
  );
}

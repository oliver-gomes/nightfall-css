import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function JsonTokensFormatPage() {
  return (
    <DocPage
      title="Design Tokens (JSON)"
      description="Export as W3C Design Tokens Community Group format with Nightfall metadata."
    >
      <DocSection title="Generate">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css generate --format json-tokens --output nightfall-tokens.json`}
        />
      </DocSection>

      <DocSection title="Output Example">
        <p>
          Follows the <a href="https://design-tokens.github.io/community-group/format/" className="text-nf-cyan underline">W3C Design Tokens</a> specification
          with Nightfall extensions for original values, OKLCH coordinates, and contrast metadata:
        </p>
        <CodeBlock
          language="js"
          filename="nightfall-tokens.json"
          code={`{
  "$name": "Nightfall Generated Theme",
  "$description": "Dark theme generated from light source",
  "nightfall": {
    "$type": "nightfall-metadata",
    "version": "0.1.0",
    "direction": "light-to-dark",
    "preset": "neutral",
    "generatedAt": "2026-04-08T12:00:00Z"
  },
  "color": {
    "background": {
      "page": {
        "$type": "color",
        "$value": "oklch(0.13 0.005 240)",
        "$extensions": {
          "nightfall": {
            "hex": "#0f1012",
            "originalValue": "#fafafa",
            "oklch": { "l": 0.13, "c": 0.005, "h": 240 },
            "role": "background.page"
          }
        }
      },
      "surface": {
        "$type": "color",
        "$value": "oklch(0.17 0.005 240)",
        "$extensions": {
          "nightfall": {
            "hex": "#181a1e",
            "originalValue": "#ffffff",
            "oklch": { "l": 0.17, "c": 0.005, "h": 240 },
            "role": "background.surface"
          }
        }
      }
    },
    "text": {
      "heading": {
        "$type": "color",
        "$value": "oklch(0.95 0.01 240)",
        "$extensions": {
          "nightfall": {
            "hex": "#f0f1f3",
            "originalValue": "#111827",
            "contrastOn": "background.page",
            "contrastRatio": 15.2
          }
        }
      },
      "body": {
        "$type": "color",
        "$value": "oklch(0.82 0.01 240)"
      },
      "muted": {
        "$type": "color",
        "$value": "oklch(0.60 0.01 240)"
      }
    },
    "brand": {
      "primary": {
        "$type": "color",
        "$value": "oklch(0.62 0.20 260)",
        "$extensions": {
          "nightfall": {
            "hex": "#3b82f6",
            "originalValue": "#2563eb",
            "deltaE": 4.2,
            "hueShift": 0
          }
        }
      }
    }
  },
  "shadow": {
    "sm": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "1px",
        "blur": "2px",
        "color": "rgba(0, 0, 0, 0.30)"
      }
    },
    "md": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "4px",
        "blur": "8px",
        "color": "rgba(0, 0, 0, 0.40)"
      }
    }
  }
}`}
        />
      </DocSection>

      <DocSection title="Using with Build Tools">
        <p>
          The W3C format works with any token pipeline. Parse the JSON and transform it
          into your target platform:
        </p>
        <CodeBlock
          language="js"
          filename="transform-tokens.js"
          code={`const tokens = require('./nightfall-tokens.json');

// Walk the token tree
function walkTokens(obj, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (value.$type && value.$value) {
      console.log(path.concat(key).join('.'), '=', value.$value);
    } else if (typeof value === 'object') {
      walkTokens(value, path.concat(key));
    }
  }
}

walkTokens(tokens);
// color.background.page = oklch(0.13 0.005 240)
// color.text.heading = oklch(0.95 0.01 240)
// ...`}
        />
      </DocSection>

      <DocSection title="Nightfall Extensions">
        <p>
          The <code>$extensions.nightfall</code> object on each token provides extra context
          not available in the standard format:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">hex</strong> — sRGB hex fallback value</li>
          <li><strong className="text-nf-text">originalValue</strong> — The source color before transformation</li>
          <li><strong className="text-nf-text">oklch</strong> — Decomposed OKLCH channels</li>
          <li><strong className="text-nf-text">role</strong> — Semantic role assigned during classification</li>
          <li><strong className="text-nf-text">contrastOn</strong> — Which background this color is measured against</li>
          <li><strong className="text-nf-text">contrastRatio</strong> — WCAG contrast ratio</li>
          <li><strong className="text-nf-text">deltaE</strong> — Perceptual distance from original (for brand colors)</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}

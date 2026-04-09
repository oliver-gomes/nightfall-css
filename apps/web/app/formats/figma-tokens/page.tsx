import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function FigmaTokensFormatPage() {
  return (
    <DocPage
      title="Figma Tokens"
      description="Export in Figma Tokens plugin format for seamless design-to-dev handoff."
    >
      <DocSection title="Generate">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css generate --format figma-tokens --output nightfall-figma-tokens.json`}
        />
      </DocSection>

      <DocSection title="Output Example">
        <p>
          The output is compatible with the <strong>Tokens Studio for Figma</strong> plugin
          (formerly Figma Tokens). Import it directly to sync your design system:
        </p>
        <CodeBlock
          language="js"
          filename="nightfall-figma-tokens.json"
          code={`{
  "dark": {
    "background": {
      "page": {
        "value": "#0f1012",
        "type": "color",
        "description": "Page background — oklch(0.13 0.005 240)"
      },
      "surface": {
        "value": "#181a1e",
        "type": "color",
        "description": "Card/panel surface — oklch(0.17 0.005 240)"
      },
      "elevated": {
        "value": "#22242a",
        "type": "color",
        "description": "Elevated surface (dropdowns, modals)"
      },
      "overlay": {
        "value": "#2c2e36",
        "type": "color",
        "description": "Overlay surface (popovers, tooltips)"
      }
    },
    "text": {
      "heading": {
        "value": "#f0f1f3",
        "type": "color",
        "description": "Heading text — 15.2:1 on page bg"
      },
      "body": {
        "value": "#c8cad0",
        "type": "color",
        "description": "Body text — 10.1:1 on page bg"
      },
      "muted": {
        "value": "#8b8f9a",
        "type": "color",
        "description": "Muted/secondary text — 4.7:1 on page bg"
      }
    },
    "border": {
      "default": {
        "value": "rgba(255, 255, 255, 0.08)",
        "type": "color"
      },
      "strong": {
        "value": "rgba(255, 255, 255, 0.14)",
        "type": "color"
      }
    },
    "brand": {
      "primary": {
        "value": "#3b82f6",
        "type": "color",
        "description": "Brand primary — ΔE 4.2 from original"
      },
      "text": {
        "value": "#f8faff",
        "type": "color"
      }
    },
    "shadow": {
      "sm": {
        "value": "0 1px 2px rgba(0,0,0,0.30)",
        "type": "boxShadow"
      },
      "md": {
        "value": "0 4px 8px rgba(0,0,0,0.40)",
        "type": "boxShadow"
      },
      "lg": {
        "value": "0 10px 20px rgba(0,0,0,0.50)",
        "type": "boxShadow"
      }
    }
  }
}`}
        />
      </DocSection>

      <DocSection title="Importing into Figma">
        <ol className="list-decimal list-inside space-y-3 text-nf-text-muted">
          <li><strong className="text-nf-text">Install Tokens Studio</strong> — Install the Tokens Studio for Figma plugin from the Figma Community.</li>
          <li><strong className="text-nf-text">Open the plugin</strong> — In your Figma file, open Tokens Studio from the plugin menu.</li>
          <li><strong className="text-nf-text">Import JSON</strong> — Click the settings gear, choose &quot;Import&quot;, and select your <code>nightfall-figma-tokens.json</code> file.</li>
          <li><strong className="text-nf-text">Apply tokens</strong> — Select frames or components and apply the dark theme tokens. The plugin maps token names to Figma styles automatically.</li>
        </ol>
      </DocSection>

      <DocSection title="Syncing with Git">
        <p>
          Tokens Studio supports syncing tokens via a Git repository. Commit
          the generated JSON to your repo, and designers can pull updates whenever
          you regenerate the theme:
        </p>
        <CodeBlock
          language="bash"
          code={`# Regenerate and commit
npx nightfall-css generate --format figma-tokens --output tokens/dark.json
git add tokens/dark.json
git commit -m "Update dark theme tokens"
git push

# Designers sync in Figma via Tokens Studio's Git integration`}
        />
      </DocSection>

      <DocSection title="Hex Values">
        <p>
          Figma does not support OKLCH natively, so the Figma Tokens format outputs hex values.
          The OKLCH coordinates are included in each token&apos;s description field for reference.
        </p>
      </DocSection>
    </DocPage>
  );
}

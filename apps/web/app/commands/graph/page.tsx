import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function GraphCommandPage() {
  return (
    <DocPage
      title="graph"
      description="Export your color relationship graph as an SVG diagram with contrast ratios."
    >
      <DocSection title="Basic Usage">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css graph --output color-graph.svg`}
        />
        <p>
          Generates an SVG tree diagram that visualizes every color in your theme, how they
          relate to each other (parent/child nesting), and the contrast ratio between each pair.
        </p>
      </DocSection>

      <DocSection title="What the Graph Shows">
        <p>
          The graph is a tree rooted at your page background. Each node is a colored circle
          representing a color token. Edges are labeled with the WCAG contrast ratio between
          connected colors:
        </p>
        <CodeBlock
          language="bash"
          code={`# Example graph structure:
#
#   ● --bg-page (#fafafa)
#   ├── ● --bg-surface (#ffffff)
#   │   ├── ● --text-heading (#111827)    18.1:1 ✓ AAA
#   │   ├── ● --text-body (#374151)       11.2:1 ✓ AAA
#   │   ├── ● --text-muted (#9ca3af)       4.6:1 ✓ AA
#   │   ├── ● --border-default (#e5e7eb)   1.3:1
#   │   └── ● --brand-primary (#2563eb)    4.8:1 ✓ AA
#   │       └── ● --brand-text (#ffffff)   8.1:1 ✓ AAA
#   └── ● --bg-elevated (#f3f4f6)
#       └── ● --text-body (#374151)        9.8:1 ✓ AAA`}
        />
      </DocSection>

      <DocSection title="Options">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css graph [options]

Options:
  --input <path>       Scan data path (default: .nightfall/scan.json)
  --output <path>      Output SVG file path (required)
  --theme <side>       Which theme to graph: original | generated | both
  --show-ratios        Label edges with contrast ratios (default: true)
  --show-values        Show hex/oklch values in nodes (default: true)
  --show-roles         Show semantic role labels (default: true)
  --min-contrast <n>   Highlight edges below this ratio in red
  --width <px>         SVG width (default: 1200)
  --height <px>        SVG height (default: auto)`}
        />
      </DocSection>

      <DocSection title="Comparing Both Themes">
        <p>
          Use <code>--theme both</code> to generate a side-by-side graph comparing your
          original and generated themes:
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css graph --theme both --output comparison.svg

# Produces a two-column SVG:
# Left column:  Original theme graph
# Right column: Generated theme graph
# Dashed lines connect corresponding tokens across both`}
        />
      </DocSection>

      <DocSection title="Highlighting Contrast Issues">
        <p>
          Use <code>--min-contrast</code> to highlight any edges that fall below a threshold,
          making it easy to spot accessibility problems at a glance:
        </p>
        <CodeBlock
          language="bash"
          code={`# Highlight any pair below 4.5:1
npx nightfall-css graph --min-contrast 4.5 --output audit-graph.svg

# Red edges   = below threshold (failing)
# Green edges = above threshold (passing)`}
        />
      </DocSection>

      <DocSection title="Using the SVG">
        <p>
          The generated SVG is a standalone file with no external dependencies. Use it
          in documentation, design reviews, or pull request descriptions:
        </p>
        <CodeBlock
          language="bash"
          code={`# Embed in a README
![Color Graph](./color-graph.svg)

# Open in browser
open color-graph.svg

# Include in CI artifacts
npx nightfall-css graph --output artifacts/color-graph.svg`}
        />
      </DocSection>
    </DocPage>
  );
}

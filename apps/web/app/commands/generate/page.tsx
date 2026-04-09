import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function GenerateCommandPage() {
  return (
    <DocPage
      title="generate"
      description="Transform scanned colors and export them in your preferred format."
    >
      <DocSection title="Basic Usage">
        <p>
          After scanning, run <code>generate</code> to produce the transformed theme:
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css generate --format css-variables`}
        />
        <p>
          This reads the scan data from <code>.nightfall/scan.json</code> and writes the
          transformed theme to the default output path.
        </p>
      </DocSection>

      <DocSection title="Format Options">
        <p>Nightfall supports six output formats:</p>
        <CodeBlock
          language="bash"
          code={`# CSS custom properties (default)
npx nightfall-css generate --format css-variables

# Tailwind CSS config
npx nightfall-css generate --format tailwind

# SCSS variables
npx nightfall-css generate --format scss

# W3C Design Tokens (JSON)
npx nightfall-css generate --format json-tokens

# Figma Tokens plugin format
npx nightfall-css generate --format figma-tokens

# Style Dictionary format
npx nightfall-css generate --format style-dict`}
        />
      </DocSection>

      <DocSection title="Output Path Configuration">
        <p>Control where generated files are written:</p>
        <CodeBlock
          language="bash"
          code={`# Specific output file
npx nightfall-css generate --format css-variables --output ./styles/dark-theme.css

# Output directory (filename is auto-generated)
npx nightfall-css generate --format tailwind --output ./config/

# Default output paths by format:
# css-variables  → ./nightfall-theme.css
# tailwind       → ./nightfall.tailwind.js
# scss           → ./nightfall-theme.scss
# json-tokens    → ./nightfall-tokens.json
# figma-tokens   → ./nightfall-figma-tokens.json
# style-dict     → ./nightfall-style-dict.json`}
        />
      </DocSection>

      <DocSection title="All Options">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css generate [options]

Options:
  --format <format>    Output format (required — see above)
  --output <path>      Output file or directory
  --input <path>       Scan data path (default: .nightfall/scan.json)
  --preset <name>      Apply a preset: neutral | warm | midnight | oled | dimmed
  --direction <dir>    Override direction from scan data
  --contrast <level>   Minimum contrast: aa | aaa (default: aa)
  --selector <sel>     CSS scope selector (default: [data-theme="dark"])
  --prefix <str>       Variable prefix (default: none)
  --dry-run            Preview output without writing files
  --verbose            Show transformation details`}
        />
      </DocSection>

      <DocSection title="Dry Run">
        <p>Preview what will be generated without writing any files:</p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css generate --format css-variables --dry-run

# [generate] Would write 24 tokens to ./nightfall-theme.css
# [generate] Preview:
#   --bg-page: oklch(0.13 0.005 240);
#   --bg-surface: oklch(0.17 0.005 240);
#   --text-heading: oklch(0.95 0.01 240);
#   ...`}
        />
      </DocSection>

      <DocSection title="Variable Prefix">
        <p>Add a prefix to all generated variable names to avoid collisions:</p>
        <CodeBlock
          language="css"
          filename="prefixed output"
          code={`/* --prefix nf */
--nf-bg-page: oklch(0.13 0.005 240);
--nf-bg-surface: oklch(0.17 0.005 240);
--nf-text-heading: oklch(0.95 0.01 240);`}
        />
      </DocSection>

      <DocSection title="Combining Scan and Generate">
        <p>For convenience, you can chain scan and generate:</p>
        <CodeBlock
          language="bash"
          code={`# Two-step workflow
npx nightfall-css scan --url http://localhost:3000
npx nightfall-css generate --format css-variables

# Chain them together
npx nightfall-css scan --url http://localhost:3000 && npx nightfall-css generate --format css-variables`}
        />
      </DocSection>
    </DocPage>
  );
}

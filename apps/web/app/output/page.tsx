import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function OutputPage() {
  return (
    <DocPage
      title="Output Formats"
      description="Nightfall exports to 6 formats. Pick the one that fits your stack."
    >
      <DocSection title="CSS Variables (Default)">
        <CodeBlock
          language="css"
          filename="nightfall-generated.css"
          code={`:root[data-theme="dark"],
.dark {
  --color-bg-page: #0a0a0b;
  --color-bg-surface: #141416;
  --color-bg-elevated: #1e1e22;
  --color-text-primary: #e5e7eb;
  --color-text-secondary: #9ca3af;
  --color-border-default: rgba(255, 255, 255, 0.1);
  --color-brand-primary: #3b82f6;
}`}
        />
      </DocSection>

      <DocSection title="Tailwind Config">
        <CodeBlock language="bash" code="npx nightfall-css generate --format tailwind" />
        <p>Generates a <code className="text-nf-cyan text-sm bg-nf-surface px-1.5 py-0.5 rounded">nightfall.tailwind.js</code> you can spread into your Tailwind config.</p>
      </DocSection>

      <DocSection title="All Formats">
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">css-variables</strong> — CSS custom properties (default)</li>
          <li><strong className="text-nf-text">tailwind</strong> — Tailwind CSS config extension</li>
          <li><strong className="text-nf-text">scss</strong> — SCSS variables + color map</li>
          <li><strong className="text-nf-text">json-tokens</strong> — W3C Design Tokens format</li>
          <li><strong className="text-nf-text">figma-tokens</strong> — Figma Tokens plugin format</li>
          <li><strong className="text-nf-text">style-dictionary</strong> — Style Dictionary format</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}

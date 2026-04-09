import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function InstallPage() {
  return (
    <DocPage
      title="Installation"
      description="Get started with Nightfall CSS in under a minute."
    >
      <DocSection title="Quick Start">
        <p>Install Nightfall CSS as a dev dependency:</p>
        <CodeBlock code="npm install nightfall-css --save-dev" language="bash" />
        <p>Or use it directly with npx:</p>
        <CodeBlock code="npx nightfall-css scan --url http://localhost:3000" language="bash" />
      </DocSection>

      <DocSection title="Requirements">
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li>Node.js 18 or later</li>
          <li>A running development server (the URL Nightfall will scan)</li>
          <li>Playwright (installed automatically on first run)</li>
        </ul>
      </DocSection>

      <DocSection title="Initialize Config">
        <p>Create a <code className="text-nf-cyan text-sm bg-nf-surface px-1.5 py-0.5 rounded">nightfall.config.json</code> file:</p>
        <CodeBlock code="npx nightfall-css init" language="bash" />
        <p>This creates a config file with sensible defaults. You can customize the URL, routes, output format, preset, and more.</p>
      </DocSection>

      <DocSection title="First Scan">
        <p>Start your dev server, then run:</p>
        <CodeBlock
          code={`# Start your app\nnpm run dev\n\n# In another terminal, scan it\nnpx nightfall-css run`}
          language="bash"
        />
        <p>
          Nightfall will auto-detect whether your app is light or dark,
          analyze every color relationship, and generate the opposite theme.
        </p>
      </DocSection>
    </DocPage>
  );
}

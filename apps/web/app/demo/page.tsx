"use client";

import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export default function DemoPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-nf-text-heading mb-2">Interactive Demo</h1>
        <p className="text-lg text-nf-text-muted leading-relaxed">
          Drag the slider to compare original and generated themes side by side.
          Toggle between Light-to-Dark and Dark-to-Light directions to see how
          Nightfall transforms colors in both directions.
        </p>
      </div>

      <BeforeAfterSlider />

      <div className="space-y-4 text-nf-text leading-relaxed">
        <h2 className="text-xl font-bold text-nf-text-heading">What You Are Seeing</h2>
        <p>
          This demo shows a mock dashboard UI being transformed by Nightfall. The left side
          is the original theme and the right side is the generated opposite theme. Notice how:
        </p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li>
            <strong className="text-nf-text">Backgrounds invert properly</strong> — White does not
            become pure black. Instead it maps to a deep dark gray that feels natural.
          </li>
          <li>
            <strong className="text-nf-text">Text hierarchy is preserved</strong> — Headings remain
            the highest contrast, body text is slightly lower, and muted text stays subtle.
          </li>
          <li>
            <strong className="text-nf-text">Brand colors stay recognizable</strong> — The blue
            accent color shifts slightly for contrast but remains identifiably the same blue.
          </li>
          <li>
            <strong className="text-nf-text">Chart elements adapt</strong> — Data visualization
            colors adjust to maintain readability on the new background.
          </li>
          <li>
            <strong className="text-nf-text">Status colors work in both modes</strong> — Green
            for success, the accent for processing — both adapt to their background.
          </li>
        </ul>
      </div>

      <div className="space-y-4 text-nf-text leading-relaxed">
        <h2 className="text-xl font-bold text-nf-text-heading">Try It on Your Site</h2>
        <p>
          To see this transformation applied to your own UI, run:
        </p>
        <div className="group relative rounded-lg border border-nf-border bg-nf-surface overflow-hidden">
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            <code>
              <span className="text-nf-cyan">npx</span>{" "}
              <span className="text-nf-amber">nightfall-css</span>{" "}
              <span className="text-nf-text">scan --url http://localhost:3000</span>
              {"\n"}
              <span className="text-nf-cyan">npx</span>{" "}
              <span className="text-nf-amber">nightfall-css</span>{" "}
              <span className="text-nf-text">preview</span>
            </code>
          </pre>
        </div>
        <p>
          The <code>preview</code> command opens an interactive split-screen view of your
          actual site with the generated theme applied — just like this demo, but with
          your real UI.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";

const examples = [
  {
    name: "GitHub",
    url: "github.com",
    direction: "Light to Dark",
    colors: ["#ffffff", "#f6f8fa", "#24292f", "#0969da", "#1f883d"],
    darkColors: ["#0d1117", "#161b22", "#e6edf3", "#2f81f7", "#3fb950"],
    description: "GitHub's light theme transformed into a dark variant. Note how the blue link color brightens slightly while the green success color becomes more vivid.",
  },
  {
    name: "Linear",
    url: "linear.app",
    direction: "Dark to Light",
    colors: ["#101016", "#1b1b22", "#eeeef0", "#5e6ad2", "#26b5ce"],
    darkColors: ["#f8f8fa", "#ffffff", "#1c1c21", "#4f5bc4", "#1da7c0"],
    description: "Linear's signature dark UI reversed into a light theme. Brand purple stays unmistakably Linear. A shadow scale is generated from scratch since the dark version uses surface lightness for depth.",
  },
  {
    name: "Stripe",
    url: "stripe.com",
    direction: "Light to Dark",
    colors: ["#ffffff", "#f6f9fc", "#425466", "#635bff", "#0a2540"],
    darkColors: ["#0a0e14", "#121820", "#c4cdd8", "#7a73ff", "#e8f0fe"],
    description: "Stripe's clean light design transformed to dark mode. The signature purple maintains its identity with a delta-E of only 3.8.",
  },
];

export default function TryItPage() {
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState(0);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-nf-text-heading mb-2">Try It</h1>
        <p className="text-lg text-nf-text-muted leading-relaxed">
          See how Nightfall transforms real websites. Enter a URL or explore the
          pre-computed examples below.
        </p>
      </div>

      {/* URL input */}
      <div>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-site.com"
            className="flex-1 px-4 py-2.5 rounded-lg bg-nf-surface border border-nf-border text-nf-text placeholder:text-nf-text-dim focus:outline-none focus:border-nf-violet text-sm"
          />
          <button className="px-5 py-2.5 rounded-lg bg-nf-violet text-white font-medium text-sm opacity-50 cursor-not-allowed">
            Analyze
          </button>
        </div>
        <p className="text-xs text-nf-text-dim mt-2">
          Live URL analysis requires the Nightfall CLI running locally. Install it and run
          the command shown below instead. Explore the pre-computed examples to see the output.
        </p>
      </div>

      {/* Pre-computed examples */}
      <div>
        <h2 className="text-lg font-semibold text-nf-text-heading mb-4">Pre-computed Examples</h2>
        <div className="flex gap-3 mb-6">
          {examples.map((ex, i) => (
            <button
              key={ex.name}
              onClick={() => setSelected(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selected === i
                  ? "bg-nf-violet text-white"
                  : "bg-nf-surface text-nf-text-muted border border-nf-border hover:text-nf-text"
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="p-5 rounded-xl border border-nf-border bg-nf-surface/50 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-nf-text-muted">{examples[selected].url}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-nf-violet/10 text-nf-violet border border-nf-violet/20">
              {examples[selected].direction}
            </span>
          </div>

          <p className="text-sm text-nf-text-muted">{examples[selected].description}</p>

          {/* Original colors */}
          <div>
            <p className="text-xs font-semibold text-nf-text-heading mb-2">Original</p>
            <div className="flex gap-2">
              {examples[selected].colors.map((color) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg border border-nf-border" style={{ background: color }} />
                  <span className="text-[9px] font-mono text-nf-text-dim">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generated colors */}
          <div>
            <p className="text-xs font-semibold text-nf-text-heading mb-2">Generated</p>
            <div className="flex gap-2">
              {examples[selected].darkColors.map((color) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg border border-nf-border" style={{ background: color }} />
                  <span className="text-[9px] font-mono text-nf-text-dim">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <CodeBlock
            code={`npx nightfall-css scan --url https://${examples[selected].url}\nnpx nightfall-css generate --format css-variables`}
            language="bash"
          />
        </div>
      </div>

      {/* Local usage */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-nf-text-heading">Run It Locally</h2>
        <p className="text-sm text-nf-text-muted">
          To analyze any site, run Nightfall locally. It launches a headless browser,
          visits your pages, and extracts every color:
        </p>
        <CodeBlock
          language="bash"
          code={`# Install
npm install -g nightfall-css

# Scan your running dev server
npx nightfall-css scan --url http://localhost:3000

# Generate the opposite theme
npx nightfall-css generate --format css-variables

# Open the interactive preview
npx nightfall-css preview`}
        />
      </div>
    </div>
  );
}

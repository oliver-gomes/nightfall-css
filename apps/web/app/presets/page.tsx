import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function PresetsPage() {
  const presets = [
    {
      name: "neutral",
      desc: "Cool gray. The default preset — clean, professional, and universally appropriate. Uses a blue-gray undertone that works for SaaS, documentation, and enterprise apps.",
      bg: "#0a0a0b",
      surface: "#141416",
      elevated: "#1e1e22",
      text: "#e5e7eb",
      muted: "#9ca3af",
    },
    {
      name: "warm",
      desc: "Brown and amber undertones create a cozy, inviting feel. Works well for editorial content, portfolios, and lifestyle brands.",
      bg: "#0d0a07",
      surface: "#171210",
      elevated: "#211c18",
      text: "#e8e2da",
      muted: "#a89e94",
    },
    {
      name: "midnight",
      desc: "Deep blue-black. Elegant and premium. Great for creative tools, developer products, and apps that want a sophisticated nighttime feel.",
      bg: "#060810",
      surface: "#0c1020",
      elevated: "#141a2e",
      text: "#dde1ef",
      muted: "#8890aa",
    },
    {
      name: "oled",
      desc: "True black (#000000) backgrounds for OLED screens. Maximum contrast for readability. Saves battery on mobile devices with OLED displays.",
      bg: "#000000",
      surface: "#0a0a0a",
      elevated: "#141414",
      text: "#f0f0f0",
      muted: "#a0a0a0",
    },
    {
      name: "dimmed",
      desc: "Softer, lower contrast for extended reading sessions. Reduces eye strain by using lighter dark backgrounds and slightly muted foreground colors.",
      bg: "#1a1a1a",
      surface: "#222222",
      elevated: "#2a2a2a",
      text: "#d0d0d0",
      muted: "#909090",
    },
  ];

  return (
    <DocPage
      title="Presets"
      description="Five built-in presets for different dark theme aesthetics. Each adjusts the base darkness, undertone, and contrast curve."
    >
      <DocSection title="Available Presets">
        <div className="grid gap-4">
          {presets.map((p) => (
            <div key={p.name} className="p-4 rounded-lg border border-nf-border">
              <div className="flex items-start gap-4 mb-3">
                <div className="flex gap-1 flex-shrink-0">
                  <div className="w-8 h-8 rounded-md border border-nf-border" style={{ background: p.bg }} title="Page background" />
                  <div className="w-8 h-8 rounded-md border border-nf-border" style={{ background: p.surface }} title="Surface" />
                  <div className="w-8 h-8 rounded-md border border-nf-border" style={{ background: p.elevated }} title="Elevated" />
                  <div className="w-5 h-8 rounded-md" style={{ background: p.text }} title="Text" />
                  <div className="w-5 h-8 rounded-md" style={{ background: p.muted }} title="Muted" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-nf-text-heading">{p.name}</h3>
                  <p className="text-sm text-nf-text-muted mt-1">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Using a Preset">
        <CodeBlock
          language="bash"
          code={`# Apply during generation
npx nightfall-css generate --format css-variables --preset midnight

# Apply during preview
npx nightfall-css preview --preset warm

# Override with --direction both
npx nightfall-css generate --direction both --preset oled`}
        />
      </DocSection>

      <DocSection title="What Presets Control">
        <p>Each preset adjusts these parameters:</p>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Base lightness</strong> — How dark the page background is (L=0.05 for oled, L=0.13 for neutral, L=0.18 for dimmed)</li>
          <li><strong className="text-nf-text">Hue undertone</strong> — The hue angle for neutral surfaces (240 for neutral, 30 for warm, 250 for midnight)</li>
          <li><strong className="text-nf-text">Chroma amount</strong> — How much color tint the neutrals have (0 for oled, 0.005 for neutral, 0.015 for midnight)</li>
          <li><strong className="text-nf-text">Elevation step</strong> — Lightness increment per surface level (0.04 for neutral, 0.035 for dimmed)</li>
          <li><strong className="text-nf-text">Text contrast curve</strong> — How much contrast text has against backgrounds</li>
        </ul>
      </DocSection>

      <DocSection title="Preset Comparison">
        <CodeBlock
          language="css"
          filename="page backgrounds by preset"
          code={`/* neutral */  --bg-page: oklch(0.13 0.005 240);  /* Cool gray */
/* warm */     --bg-page: oklch(0.12 0.010 30);   /* Warm brown */
/* midnight */ --bg-page: oklch(0.10 0.015 250);  /* Deep blue */
/* oled */     --bg-page: oklch(0.00 0.000 0);    /* True black */
/* dimmed */   --bg-page: oklch(0.18 0.003 240);  /* Soft gray */`}
        />
      </DocSection>

      <DocSection title="Custom Presets">
        <p>
          You can create custom presets by providing a configuration file:
        </p>
        <CodeBlock
          language="js"
          filename="nightfall.config.js"
          code={`module.exports = {
  presets: {
    custom: {
      baseLightness: 0.10,
      hueUndertone: 280,    // Purple undertone
      chromaAmount: 0.02,
      elevationStep: 0.05,
      textContrast: 'high',
    }
  }
};`}
        />
        <CodeBlock
          language="bash"
          code={`npx nightfall-css generate --preset custom`}
        />
      </DocSection>
    </DocPage>
  );
}

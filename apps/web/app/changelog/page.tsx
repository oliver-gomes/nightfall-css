import { DocPage, DocSection } from "@/components/DocPage";

export default function ChangelogPage() {
  return (
    <DocPage
      title="Changelog"
      description="Version history for nightfall-css."
    >
      <DocSection title="v0.1.0 — Initial Release">
        <p className="text-sm text-nf-text-muted mb-4">April 2026</p>
        <p className="mb-4">
          The first public release of Nightfall CSS. Everything you need to reverse-engineer
          a theme from your existing UI.
        </p>

        <h3 className="text-base font-semibold text-nf-text-heading mb-2 mt-6">Core Features</h3>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">Bidirectional theme generation</strong> — Light to Dark, Dark to Light, or both in one pass</li>
          <li><strong className="text-nf-text">Auto-detection</strong> — Automatically determines whether your UI is light or dark by sampling background lightness in OKLCH space</li>
          <li><strong className="text-nf-text">OKLCH color engine</strong> — All transformations happen in perceptually uniform OKLCH color space, producing natural-looking results</li>
          <li><strong className="text-nf-text">Color relationship graph</strong> — Builds a tree of which colors sit on which surfaces, preserving hierarchy during transformation</li>
          <li><strong className="text-nf-text">WCAG contrast enforcement</strong> — Checks all foreground/background pairs against AA or AAA standards with automatic correction</li>
          <li><strong className="text-nf-text">Brand color preservation</strong> — Hue never changes, chroma max 15% shift, lightness max 20% shift, delta-E max 15</li>
          <li><strong className="text-nf-text">Shadow generation</strong> — When transforming dark to light, generates a complete shadow scale from scratch</li>
        </ul>

        <h3 className="text-base font-semibold text-nf-text-heading mb-2 mt-6">CLI Commands</h3>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">scan</strong> — Launch Playwright, visit routes, extract computed styles and CSS variables</li>
          <li><strong className="text-nf-text">generate</strong> — Transform scanned colors and export in any format</li>
          <li><strong className="text-nf-text">preview</strong> — Split-screen browser comparison with draggable divider</li>
          <li><strong className="text-nf-text">audit</strong> — WCAG contrast audit with auto-fix option</li>
          <li><strong className="text-nf-text">graph</strong> — Export color relationship graph as SVG</li>
          <li><strong className="text-nf-text">watch</strong> — Re-scan on file changes during development</li>
        </ul>

        <h3 className="text-base font-semibold text-nf-text-heading mb-2 mt-6">Output Formats</h3>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li>CSS custom properties (with OKLCH and optional hex fallbacks)</li>
          <li>Tailwind CSS theme extension</li>
          <li>SCSS variables with color maps</li>
          <li>W3C Design Tokens (JSON) with Nightfall metadata extensions</li>
          <li>Figma Tokens plugin format for design handoff</li>
          <li>Style Dictionary format for cross-platform token pipelines</li>
        </ul>

        <h3 className="text-base font-semibold text-nf-text-heading mb-2 mt-6">Presets</h3>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">neutral</strong> — Cool gray, clean and professional (default)</li>
          <li><strong className="text-nf-text">warm</strong> — Brown/amber undertones, cozy and inviting</li>
          <li><strong className="text-nf-text">midnight</strong> — Deep blue-black, elegant and premium</li>
          <li><strong className="text-nf-text">oled</strong> — True black (#000) for OLED screens, maximum battery saving</li>
          <li><strong className="text-nf-text">dimmed</strong> — Softer, lower contrast for extended reading</li>
        </ul>

        <h3 className="text-base font-semibold text-nf-text-heading mb-2 mt-6">Integrations</h3>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li><strong className="text-nf-text">React</strong> — NightfallProvider, useNightfall hook, NightfallToggle component (under 3KB)</li>
          <li><strong className="text-nf-text">Vanilla JS</strong> — createToggle(), getToggleHTML(), getToggleCSS() for framework-free projects</li>
          <li><strong className="text-nf-text">FOUC prevention</strong> — Under-500-byte inline script to prevent flash of wrong theme</li>
          <li><strong className="text-nf-text">Programmatic API</strong> — transformTheme(), detectThemeDirection(), classifyColors(), and more</li>
        </ul>

        <h3 className="text-base font-semibold text-nf-text-heading mb-2 mt-6">Performance</h3>
        <ul className="list-disc list-inside space-y-2 text-nf-text-muted">
          <li>Incremental scanning with hash-based change detection</li>
          <li>Route-level caching for partial invalidation</li>
          <li>Parallel route scanning (configurable concurrency)</li>
          <li>Watch mode keeps browser warm for sub-200ms rescans</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}

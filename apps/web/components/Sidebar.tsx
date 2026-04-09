"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NightfallLogoFull } from "./NightfallLogo";
import { ThemeToggle } from "./ThemeToggle";
import clsx from "clsx";

const navigation = [
  {
    title: "GETTING STARTED",
    items: [
      { name: "Overview", href: "/overview" },
      { name: "How it works", href: "/how-it-works" },
      { name: "Install", href: "/install" },
      { name: "Output formats", href: "/output" },
    ],
  },
  {
    title: "DIRECTIONS",
    items: [
      { name: "Auto-Detection", href: "/directions/auto-detect" },
      { name: "Light \u2192 Dark", href: "/directions/light-to-dark" },
      { name: "Dark \u2192 Light", href: "/directions/dark-to-light" },
      { name: "Both Themes", href: "/directions/both" },
    ],
  },
  {
    title: "COMMANDS",
    items: [
      { name: "scan", href: "/commands/scan" },
      { name: "generate", href: "/commands/generate" },
      { name: "preview", href: "/commands/preview" },
      { name: "audit", href: "/commands/audit" },
      { name: "graph", href: "/commands/graph" },
      { name: "watch", href: "/commands/watch" },
    ],
  },
  {
    title: "EXPORT FORMATS",
    items: [
      { name: "CSS Variables", href: "/formats/css-variables" },
      { name: "Tailwind Config", href: "/formats/tailwind" },
      { name: "SCSS Variables", href: "/formats/scss" },
      { name: "Design Tokens (JSON)", href: "/formats/json-tokens" },
      { name: "Figma Tokens", href: "/formats/figma-tokens" },
      { name: "Style Dictionary", href: "/formats/style-dict" },
    ],
  },
  {
    title: "CUSTOMIZATION",
    items: [
      { name: "Presets", href: "/presets" },
      { name: "Brand Colors", href: "/brand-colors" },
      { name: "Contrast", href: "/contrast" },
      { name: "Shadows", href: "/shadows" },
    ],
  },
  {
    title: "RUNTIME",
    items: [
      { name: "React", href: "/react" },
      { name: "Vanilla JS", href: "/vanilla" },
      { name: "Theme Toggle", href: "/theme-toggle" },
      { name: "FOUC Prevention", href: "/fouc" },
    ],
  },
  {
    title: "ADVANCED",
    items: [
      { name: "Color Science", href: "/color-science" },
      { name: "Performance", href: "/performance" },
      { name: "CI/CD Integration", href: "/ci-cd" },
    ],
  },
  {
    title: "PLAYGROUND",
    items: [
      { name: "Interactive Demo", href: "/demo" },
      { name: "Try It", href: "/try-it" },
      { name: "Color Playground", href: "/playground" },
    ],
  },
  {
    title: "META",
    items: [
      { name: "API Reference", href: "/api" },
      { name: "Changelog", href: "/changelog" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-nf-surface border border-nf-border"
        aria-label="Toggle navigation"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {mobileOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-screen w-[var(--spacing-sidebar)] bg-nf-bg border-r border-nf-border flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-nf-border">
          <Link href="/overview" onClick={() => setMobileOpen(false)}>
            <NightfallLogoFull />
          </Link>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nf-violet/10 text-nf-violet border border-nf-violet/20">
            v0.1.0
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navigation.map((group) => (
            <div key={group.title} className="mb-5">
              <h3 className="px-3 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-nf-text-dim uppercase">
                {group.title}
              </h3>
              <ul>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                          "block px-3 py-1.5 rounded-md text-sm transition-colors relative",
                          isActive
                            ? "text-nf-violet bg-nf-violet/8 font-medium"
                            : "text-nf-text-muted hover:text-nf-text hover:bg-nf-surface",
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-nf-violet rounded-full" />
                        )}
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-nf-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/nightfall-css/nightfall"
              target="_blank"
              rel="noopener"
              className="text-nf-text-muted hover:text-nf-text transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.npmjs.com/package/nightfall-css"
              target="_blank"
              rel="noopener"
              className="text-nf-text-muted hover:text-nf-text transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
              </svg>
            </a>
          </div>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}

"use client";

import { useState } from "react";

function SunIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

type ToggleSize = "sm" | "md" | "lg";

const sizes: Record<ToggleSize, { btn: string; icon: number; label: string }> =
  {
    sm: { btn: "w-8 h-8", icon: 14, label: "Small" },
    md: { btn: "w-10 h-10", icon: 18, label: "Medium" },
    lg: { btn: "w-12 h-12", icon: 22, label: "Large" },
  };

function DemoToggle({
  size,
  dark,
  onToggle,
}: {
  size: ToggleSize;
  dark: boolean;
  onToggle: () => void;
}) {
  const s = sizes[size];
  return (
    <button
      onClick={onToggle}
      className={`relative ${s.btn} rounded-lg flex items-center justify-center border border-nf-border hover:bg-nf-surface transition-all cursor-pointer`}
      aria-label="Toggle theme"
    >
      <span
        style={{
          transition:
            "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
          transform: dark ? "rotate(0deg) scale(1)" : "rotate(120deg) scale(0)",
          opacity: dark ? 1 : 0,
          position: "absolute",
        }}
      >
        <SunIcon size={s.icon} />
      </span>
      <span
        style={{
          transition:
            "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
          transform: dark
            ? "rotate(-120deg) scale(0)"
            : "rotate(0deg) scale(1)",
          opacity: dark ? 0 : 1,
          position: "absolute",
        }}
      >
        <MoonIcon size={s.icon} />
      </span>
    </button>
  );
}

function DemoPill({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full border border-nf-border bg-nf-surface transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full bg-nf-violet flex items-center justify-center transition-all duration-300"
        style={{ left: dark ? "calc(100% - 26px)" : "2px" }}
      >
        {dark ? <SunIcon size={12} /> : <MoonIcon size={12} />}
      </span>
    </button>
  );
}

function DemoSegmented({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-nf-border bg-nf-surface p-0.5">
      <button
        onClick={() => dark && onToggle()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
          !dark
            ? "bg-nf-violet text-white"
            : "text-nf-text-muted hover:text-nf-text"
        }`}
      >
        <SunIcon size={12} />
        Light
      </button>
      <button
        onClick={() => !dark && onToggle()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
          dark
            ? "bg-nf-violet text-white"
            : "text-nf-text-muted hover:text-nf-text"
        }`}
      >
        <MoonIcon size={12} />
        Dark
      </button>
    </div>
  );
}

function PreviewCard({
  label,
  dark,
  children,
}: {
  label: string;
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-full rounded-xl border border-nf-border overflow-hidden transition-colors duration-500"
        style={{
          background: dark ? "#0c0a14" : "#faf9fc",
          color: dark ? "#e4e0ed" : "#1a1625",
        }}
      >
        {/* Mini navbar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b transition-colors duration-500"
          style={{ borderColor: dark ? "#2a2535" : "#e8e4f0" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded transition-colors duration-500"
              style={{ background: dark ? "#7c3aed" : "#8b5cf6" }}
            />
            <span className="text-xs font-semibold">My App</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] transition-colors duration-500"
              style={{ color: dark ? "#8b839c" : "#9490a3" }}
            >
              Dashboard
            </span>
            <span
              className="text-[10px] transition-colors duration-500"
              style={{ color: dark ? "#8b839c" : "#9490a3" }}
            >
              Settings
            </span>
            {children}
          </div>
        </div>
        {/* Mini content */}
        <div className="px-4 py-4 space-y-2">
          <div
            className="h-2 w-24 rounded transition-colors duration-500"
            style={{ background: dark ? "#2a2535" : "#e8e4f0" }}
          />
          <div
            className="h-2 w-36 rounded transition-colors duration-500"
            style={{ background: dark ? "#1e1a2a" : "#f0edf5" }}
          />
          <div className="flex gap-2 mt-3">
            <div
              className="h-8 w-20 rounded transition-colors duration-500"
              style={{ background: dark ? "#1e1a2a" : "#f0edf5" }}
            />
            <div
              className="h-8 w-20 rounded transition-colors duration-500"
              style={{ background: dark ? "#1e1a2a" : "#f0edf5" }}
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-nf-text-muted">{label}</span>
    </div>
  );
}

function SizeVariantItem({ size }: { size: ToggleSize }) {
  const [dark, setDark] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <DemoToggle size={size} dark={dark} onToggle={() => setDark(!dark)} />
      <span className="text-[10px] font-mono text-nf-text-muted">
        {sizes[size].label}
      </span>
    </div>
  );
}

export function ToggleShowcase() {
  const [icon, setIcon] = useState(true);
  const [pill, setPill] = useState(true);
  const [seg, setSeg] = useState(true);

  return (
    <div className="space-y-6">
      {/* Live previews grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <PreviewCard label="Icon Button" dark={icon}>
          <DemoToggle size="sm" dark={icon} onToggle={() => setIcon(!icon)} />
        </PreviewCard>

        <PreviewCard label="Pill Switch" dark={pill}>
          <DemoPill dark={pill} onToggle={() => setPill(!pill)} />
        </PreviewCard>
      </div>

      {/* Size variants */}
      <div className="rounded-xl border border-nf-border bg-nf-surface/50 p-5">
        <p className="text-xs font-mono text-nf-text-dim uppercase tracking-wider mb-4">
          Size Variants
        </p>
        <div className="flex items-center gap-6">
          {(["sm", "md", "lg"] as ToggleSize[]).map((size) => (
            <SizeVariantItem key={size} size={size} />
          ))}
        </div>
      </div>
    </div>
  );
}

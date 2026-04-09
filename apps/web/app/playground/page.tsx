"use client";

import { useState, useMemo } from "react";

function hexToOklchSimple(hex: string): { L: number; C: number; H: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const lr = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const lg = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const lb = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const l = 0.4122 * lr + 0.5363 * lg + 0.0514 * lb;
  const m = 0.2119 * lr + 0.6807 * lg + 0.1074 * lb;
  const s = 0.0883 * lr + 0.2817 * lg + 0.6300 * lb;

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);

  const L = 0.2105 * l_ + 0.7936 * m_ - 0.0041 * s_;
  const a = 1.9780 * l_ - 2.4286 * m_ + 0.4506 * s_;
  const bv = 0.0259 * l_ + 0.7828 * m_ - 0.8087 * s_;

  const C = Math.sqrt(a * a + bv * bv);
  let H = (Math.atan2(bv, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return { L, C, H };
}

function transformToDark(oklch: { L: number; C: number; H: number }): { L: number; C: number; H: number } {
  let L;
  if (oklch.L > 0.95) L = 0.06;
  else if (oklch.L > 0.8) L = 0.12;
  else if (oklch.L > 0.5) L = 1 - oklch.L;
  else if (oklch.L < 0.2) L = 0.88;
  else L = 0.7;
  return { L, C: oklch.C * 0.85, H: oklch.H };
}

function transformToLight(oklch: { L: number; C: number; H: number }): { L: number; C: number; H: number } {
  let L;
  if (oklch.L < 0.05) L = 0.98;
  else if (oklch.L < 0.2) L = 0.92;
  else if (oklch.L < 0.5) L = 1 - oklch.L;
  else if (oklch.L > 0.8) L = 0.15;
  else L = 0.35;
  return { L, C: oklch.C * 1.1, H: oklch.H };
}

function oklchToHexSimple(oklch: { L: number; C: number; H: number }): string {
  const hRad = (oklch.H * Math.PI) / 180;
  const a = oklch.C * Math.cos(hRad);
  const bv = oklch.C * Math.sin(hRad);

  const l_ = oklch.L + 0.3963 * a + 0.2158 * bv;
  const m_ = oklch.L - 0.1056 * a - 0.0639 * bv;
  const s_ = oklch.L - 0.0895 * a - 1.2915 * bv;

  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;

  let r = 4.0767 * l - 3.3077 * m + 0.2310 * s;
  let g = -1.2684 * l + 2.6098 * m - 0.3413 * s;
  let b = -0.0042 * l - 0.7034 * m + 1.7076 * s;

  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  const toSrgb = (c: number) => c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  const rr = Math.round(toSrgb(r) * 255).toString(16).padStart(2, "0");
  const gg = Math.round(toSrgb(g) * 255).toString(16).padStart(2, "0");
  const bb = Math.round(toSrgb(b) * 255).toString(16).padStart(2, "0");

  return `#${rr}${gg}${bb}`;
}

function computeDeltaE(a: { L: number; C: number; H: number }, b: { L: number; C: number; H: number }): number {
  const dL = a.L - b.L;
  const dC = a.C - b.C;
  let dH = a.H - b.H;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;
  const hDist = 2 * Math.sqrt(a.C * b.C) * Math.sin((dH * Math.PI) / 360);
  return Math.sqrt(dL * dL + dC * dC + hDist * hDist);
}

export default function PlaygroundPage() {
  const [color, setColor] = useState("#2563eb");
  const [direction, setDirection] = useState<"dark" | "light">("dark");

  const oklch = useMemo(() => hexToOklchSimple(color), [color]);
  const transformedOklch = useMemo(
    () => (direction === "dark" ? transformToDark(oklch) : transformToLight(oklch)),
    [oklch, direction]
  );
  const transformedHex = useMemo(() => oklchToHexSimple(transformedOklch), [transformedOklch]);
  const dE = useMemo(() => computeDeltaE(oklch, transformedOklch), [oklch, transformedOklch]);

  const presetColors = ["#2563eb", "#7c3aed", "#16a34a", "#dc2626", "#ea580c", "#0891b2", "#ffffff", "#18181b"];

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-nf-text-heading mb-2">Color Playground</h1>
        <p className="text-lg text-nf-text-muted leading-relaxed">
          Pick a color, see its OKLCH decomposition, and preview the Nightfall-transformed
          equivalent in real time.
        </p>
      </div>

      {/* Direction toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setDirection("dark")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            direction === "dark"
              ? "bg-nf-violet text-white"
              : "bg-nf-surface text-nf-text-muted border border-nf-border hover:text-nf-text"
          }`}
        >
          To Dark
        </button>
        <button
          onClick={() => setDirection("light")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            direction === "light"
              ? "bg-nf-violet text-white"
              : "bg-nf-surface text-nf-text-muted border border-nf-border hover:text-nf-text"
          }`}
        >
          To Light
        </button>
      </div>

      {/* Preset colors */}
      <div>
        <p className="text-xs font-semibold text-nf-text-heading mb-2">Quick Pick</p>
        <div className="flex gap-2">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-md border-2 transition-all ${
                color === c ? "border-nf-violet scale-110" : "border-nf-border hover:border-nf-text-muted"
              }`}
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-nf-text-heading">Input Color</h3>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <div>
              <div className="font-mono text-sm">{color}</div>
              <div className="text-xs text-nf-text-muted mt-1 font-mono">
                L: {oklch.L.toFixed(3)}
              </div>
              <div className="text-xs text-nf-text-muted font-mono">
                C: {oklch.C.toFixed(3)}
              </div>
              <div className="text-xs text-nf-text-muted font-mono">
                H: {oklch.H.toFixed(1)}
              </div>
            </div>
          </div>
          <div className="w-full h-24 rounded-xl border border-nf-border" style={{ background: color }} />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-nf-text-heading">
            {direction === "dark" ? "Dark" : "Light"} Mode Equivalent
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border border-nf-border" style={{ background: transformedHex }} />
            <div>
              <div className="font-mono text-sm">{transformedHex}</div>
              <div className="text-xs text-nf-text-muted mt-1 font-mono">
                L: {transformedOklch.L.toFixed(3)}
              </div>
              <div className="text-xs text-nf-text-muted font-mono">
                C: {transformedOklch.C.toFixed(3)}
              </div>
              <div className="text-xs text-nf-text-muted font-mono">
                H: {transformedOklch.H.toFixed(1)}
              </div>
            </div>
          </div>
          <div className="w-full h-24 rounded-xl border border-nf-border" style={{ background: transformedHex }} />
        </div>
      </div>

      {/* Delta-E */}
      <div className="p-4 rounded-lg border border-nf-border bg-nf-surface/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-nf-text-muted">Perceptual distance (delta-E)</span>
          <span className="font-mono text-sm font-bold text-nf-text-heading">{dE.toFixed(2)}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-nf-elevated overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (dE / 0.5) * 100)}%`,
              background: dE < 5 ? "#22c55e" : dE < 10 ? "#eab308" : dE < 15 ? "#f97316" : "#ef4444",
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-nf-text-dim">
          <span>Imperceptible</span>
          <span>Noticeable</span>
          <span>Different shade</span>
          <span>Different color</span>
        </div>
      </div>

      {/* Comparison on backgrounds */}
      <div className="rounded-xl border border-nf-border overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="p-8 flex items-center justify-center" style={{ background: direction === "dark" ? "#fafafa" : "#0a0a0b" }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white/20" style={{ background: color }} />
              <span className="text-xs font-mono" style={{ color: direction === "dark" ? "#18181b" : "#e5e7eb" }}>
                Original
              </span>
            </div>
          </div>
          <div className="p-8 flex items-center justify-center" style={{ background: direction === "dark" ? "#0a0a0b" : "#fafafa" }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white/20" style={{ background: transformedHex }} />
              <span className="text-xs font-mono" style={{ color: direction === "dark" ? "#e5e7eb" : "#18181b" }}>
                Transformed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OKLCH explanation */}
      <div className="space-y-3 text-sm text-nf-text-muted">
        <h3 className="text-sm font-semibold text-nf-text-heading">Reading the Values</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong className="text-nf-text">L (Lightness)</strong> — 0 is black, 1 is white. Nightfall inverts this during transformation.</li>
          <li><strong className="text-nf-text">C (Chroma)</strong> — Saturation intensity. Reduced slightly during dark transforms for comfort.</li>
          <li><strong className="text-nf-text">H (Hue)</strong> — The color angle (0-360). Nightfall never changes this for brand colors.</li>
          <li><strong className="text-nf-text">Delta-E</strong> — Below 5 means the colors are recognizably the same. Brand colors stay under 15.</li>
        </ul>
      </div>
    </div>
  );
}

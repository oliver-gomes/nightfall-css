"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import clsx from "clsx";

const lightDashboard = {
  bg: "#fafafa",
  surface: "#ffffff",
  border: "#e4e4e7",
  text: "#18181b",
  textMuted: "#71717a",
  brand: "#2563eb",
  brandText: "#ffffff",
  success: "#16a34a",
  shadow: "0 1px 3px rgba(0,0,0,0.08)",
};

const darkDashboard = {
  bg: "#0a0a0b",
  surface: "#141416",
  border: "rgba(255,255,255,0.08)",
  text: "#e5e7eb",
  textMuted: "#9ca3af",
  brand: "#3b82f6",
  brandText: "#ffffff",
  success: "#22c55e",
  shadow: "0 1px 3px rgba(0,0,0,0.4)",
};

function DashboardMock({ theme }: { theme: typeof lightDashboard }) {
  return (
    <div className="w-full h-full select-none" style={{ background: theme.bg, color: theme.text }}>
      {/* Top nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: theme.border, background: theme.surface }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md" style={{ background: theme.brand }} />
          <span className="font-semibold text-sm">Acme Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full" style={{ background: theme.border }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Revenue", value: "$48,290", change: "+12.5%" },
            { label: "Users", value: "2,841", change: "+8.2%" },
            { label: "Orders", value: "1,023", change: "+24.1%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-3"
              style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
            >
              <div className="text-[10px] mb-1" style={{ color: theme.textMuted }}>{stat.label}</div>
              <div className="text-base font-bold">{stat.value}</div>
              <div className="text-[10px] mt-1" style={{ color: theme.success }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="rounded-lg p-3" style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <div className="text-xs font-medium mb-2">Revenue Over Time</div>
          <div className="flex items-end gap-1.5 h-20">
            {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{ height: `${h}%`, background: i === 11 ? theme.brand : `${theme.brand}40` }}
              />
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden" style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <div className="text-xs font-medium p-3 border-b" style={{ borderColor: theme.border }}>Recent Orders</div>
          {[
            { id: "#3210", customer: "Sarah K.", amount: "$249", status: "Completed" },
            { id: "#3209", customer: "Mike R.", amount: "$149", status: "Processing" },
            { id: "#3208", customer: "Anna L.", amount: "$399", status: "Completed" },
          ].map((row) => (
            <div key={row.id} className="flex items-center justify-between px-3 py-2 border-b last:border-0 text-[11px]" style={{ borderColor: theme.border }}>
              <span style={{ color: theme.textMuted }}>{row.id}</span>
              <span>{row.customer}</span>
              <span>{row.amount}</span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: row.status === "Completed" ? `${theme.success}20` : `${theme.brand}20`,
                  color: row.status === "Completed" ? theme.success : theme.brand,
                }}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState<"ltod" | "dtol">("ltod");

  const leftTheme = direction === "ltod" ? lightDashboard : darkDashboard;
  const rightTheme = direction === "ltod" ? darkDashboard : lightDashboard;

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(2, p - 2));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(98, p + 2));
  }, []);

  return (
    <div className="space-y-4">
      {/* Direction toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setDirection("ltod")}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
            direction === "ltod"
              ? "bg-nf-violet text-white"
              : "bg-nf-surface text-nf-text-muted border border-nf-border hover:text-nf-text"
          )}
        >
          Light → Dark
        </button>
        <button
          onClick={() => setDirection("dtol")}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
            direction === "dtol"
              ? "bg-nf-violet text-white"
              : "bg-nf-surface text-nf-text-muted border border-nf-border hover:text-nf-text"
          )}
        >
          Dark → Light
        </button>
      </div>

      {/* Browser mockup */}
      <div className="rounded-xl border border-nf-border overflow-hidden bg-nf-surface">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-nf-border bg-nf-elevated">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 mx-8">
            <div className="bg-nf-bg rounded-md px-3 py-1 text-xs text-nf-text-muted text-center font-mono">
              localhost:3000
            </div>
          </div>
        </div>

        {/* Slider area */}
        <div
          ref={containerRef}
          className="relative h-[420px] overflow-hidden cursor-col-resize touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Before/after comparison slider"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Left panel (full width, clipped) */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <DashboardMock theme={leftTheme} />
            {/* Label */}
            <div className="absolute top-3 left-3 text-[10px] font-mono px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm">
              {direction === "ltod" ? "Original (Light)" : "Original (Dark)"}
            </div>
          </div>

          {/* Right panel (full width, clipped) */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
            <DashboardMock theme={rightTheme} />
            {/* Label */}
            <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm">
              {direction === "ltod" ? "Generated (Dark)" : "Generated (Light)"}
            </div>
          </div>

          {/* Divider */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10 pointer-events-none"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          >
            {/* Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-2 border-nf-violet flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5">
                <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

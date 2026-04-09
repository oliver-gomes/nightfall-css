"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { CodeBlock } from "@/components/CodeBlock";
import { FeatureCard } from "@/components/FeatureCard";
import { StarField } from "@/components/StarField";

const features = [
  {
    title: "Bidirectional",
    description:
      "Light\u2192dark or dark\u2192light. Auto-detects your current theme and generates the opposite. Or generate both at once.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M8 3l-6 6 6 6M16 3l6 6-6 6" />
      </svg>
    ),
  },
  {
    title: "OKLCH Color Science",
    description:
      "Perceptually uniform color space. Colors look right to human eyes, not just mathematically inverted.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "WCAG Auto-Fix",
    description:
      "Every color pair is checked for contrast. Failures are auto-corrected with minimal visual shift.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    title: "Brand Preservation",
    description:
      "Your brand blue stays blue. Configurable tolerance for saturation and lightness shifts.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "6 Export Formats",
    description:
      "CSS variables, Tailwind, SCSS, JSON tokens, Figma tokens, Style Dictionary.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    title: "Visual Preview",
    description:
      "Split-screen browser preview with draggable divider. See your generated theme before committing.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="12" y1="3" x2="12" y2="17" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Zero Runtime",
    description:
      "The output is just CSS. No JavaScript, no framework dependency. ~3KB optional React toggle.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "5 Built-in Presets",
    description:
      "Neutral, warm, midnight, OLED-black, dimmed. Or bring your own.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="12" r="2.5" />
        <circle cx="8.5" cy="18.5" r="2.5" />
        <circle cx="15.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Contrast Audit",
    description:
      "Full WCAG AA/AAA report for every color pair in your generated theme.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function OverviewPage() {
  const [themeIndex, setThemeIndex] = useState(0);

  const themes = [
    {
      label: "dark theme",
      gradient: "from-violet-400 via-purple-400 to-indigo-600",
      glow: "rgba(139, 92, 246, 0.3)",
    },
    {
      label: "light theme",
      gradient: "from-amber-300 via-orange-400 to-rose-500",
      glow: "rgba(251, 191, 36, 0.3)",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((i) => (i + 1) % themes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="relative pt-8 pb-4">
        <StarField />
        <motion.div
          className="relative z-10 max-w-2xl"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.h1
            className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6"
            variants={item}
          >
            <span className="text-nf-text-heading">Your next</span>
            <br />
            <span className="relative inline-flex h-[1.2em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={themes[themeIndex].label}
                  className={`bg-gradient-to-r ${themes[themeIndex].gradient} bg-clip-text text-transparent inline-block`}
                  initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    textShadow: `0 0 40px ${themes[themeIndex].glow}, 0 0 80px ${themes[themeIndex].glow}`,
                  }}
                >
                  {themes[themeIndex].label}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span className="bg-gradient-to-r from-nf-text-heading via-nf-violet-light to-nf-violet bg-clip-text text-transparent">
              reverse-engineered.
            </span>
          </motion.h1>

          {/* Animated underline accent */}
          <motion.div
            className="h-[2px] rounded-full mb-8"
            variants={item}
            style={{
              background: `linear-gradient(to right, ${themeIndex === 0 ? "#8b5cf6" : "#fbbf24"}, transparent)`,
              width: "180px",
              transition: "background 0.6s ease",
            }}
          />

          <motion.div variants={item} className="mb-6 max-w-xs">
            <CodeBlock code="npm install nightfall-css" language="bash" />
          </motion.div>

          <motion.p
            className="text-base text-nf-text-muted leading-relaxed max-w-xl mb-6"
            variants={item}
          >
            Nightfall scans your live UI, detects light or dark mode, builds a
            color relationship graph, and generates the opposite theme — in
            OKLCH color space, with WCAG contrast enforcement and your brand
            colors preserved.
          </motion.p>

          <motion.p className="text-sm text-nf-text-dim" variants={item}>
            Not{" "}
            <span className="text-nf-violet">
              <code className="text-xs">filter: invert()</code>
            </span>
            . Not a color swap. Real theme generation.
          </motion.p>
        </motion.div>
      </section>

      {/* BEFORE/AFTER DEMO */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-2">
            See it in action
          </h2>
          <p className="text-sm text-nf-text-muted text-center mb-6">
            Drag the slider to compare original and generated themes
          </p>
          <BeforeAfterSlider />
        </motion.div>
      </section>

      {/* 3 STEPS */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-10">
            How you use it
          </h2>

          <div className="space-y-8 max-w-2xl mx-auto">
            <Step
              number={1}
              title="Scan your app"
              caption="Nightfall visits your running dev server, auto-detects if you're light-mode or dark-mode, and builds a complete color relationship graph."
            >
              <CodeBlock
                code="npx nightfall-css scan --url http://localhost:3000"
                language="bash"
              />
            </Step>

            <Step
              number={2}
              title="Generate the opposite theme"
              caption="Transforms every color in OKLCH space — in whichever direction your app needs. Preserves contrast ratios, brand identity, and visual hierarchy."
            >
              <CodeBlock
                code="npx nightfall-css generate --format css-variables"
                language="bash"
              />
            </Step>

            <Step
              number={3}
              title="Drop it in"
              caption={`A single CSS file. No runtime. No JavaScript. Just CSS variables that activate with [data-theme="dark"] or .dark.`}
            >
              <CodeBlock
                code={`@import './nightfall-generated.css';`}
                language="css"
              />
            </Step>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-2">
            Everything you need
          </h2>
          <p className="text-sm text-nf-text-muted text-center mb-8">
            Production-ready theme generation, not a toy color inverter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="h-full"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* COLOR SCIENCE TEASER */}
      <section className="pb-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-2">
            Color science, not guesswork
          </h2>
          <p className="text-sm text-nf-text-muted text-center mb-8">
            Every transformation happens in OKLCH color space — perceptually
            uniform, so your dark theme feels natural.
          </p>

          <div className="max-w-lg mx-auto">
            {/* Light colors */}
            <div className="flex justify-between mb-3">
              {[
                { color: "#ffffff", label: "White" },
                { color: "#f4f4f5", label: "Surface" },
                { color: "#18181b", label: "Text" },
                { color: "#2563eb", label: "Brand" },
                { color: "#16a34a", label: "Success" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-10 h-10 rounded-lg border border-nf-border"
                    style={{ background: c.color }}
                  />
                  <span className="text-[10px] text-nf-text-muted">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <div className="flex justify-between px-3 my-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg
                  key={i}
                  width="16"
                  height="24"
                  viewBox="0 0 16 24"
                  className="text-nf-violet"
                >
                  <path
                    d="M8 4v16M4 16l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              ))}
            </div>

            {/* Dark colors */}
            <div className="flex justify-between">
              {[
                { color: "#0a0a0b", label: "Deep dark" },
                { color: "#141416", label: "Surface" },
                { color: "#e5e7eb", label: "Text" },
                { color: "#3b82f6", label: "Brand" },
                { color: "#22c55e", label: "Success" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-10 h-10 rounded-lg border border-nf-border"
                    style={{ background: c.color }}
                  />
                  <span className="text-[10px] text-nf-text-muted">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function Step({
  number,
  title,
  caption,
  children,
}: {
  number: number;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nf-violet/15 border border-nf-violet/30 flex items-center justify-center text-sm font-bold text-nf-violet">
        {number}
      </div>
      <div className="flex-1 space-y-3">
        <h3 className="text-lg font-semibold text-nf-text-heading">{title}</h3>
        {children}
        <p className="text-sm text-nf-text-muted">{caption}</p>
      </div>
    </div>
  );
}

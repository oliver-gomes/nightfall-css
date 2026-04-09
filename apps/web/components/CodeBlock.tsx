"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-lg border border-nf-border bg-nf-surface overflow-hidden">
      {filename && (
        <div className="px-4 py-2 border-b border-nf-border text-xs font-mono text-nf-text-muted">
          {filename}
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className={`language-${language}`}>
            {highlightCode(code, language)}
          </code>
        </pre>
        <button
          onClick={copy}
          className="absolute top-3 right-3 p-1.5 rounded-md bg-nf-elevated/80 border border-nf-border text-nf-text-muted hover:text-nf-text opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Copy code"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function highlightCode(code: string, language: string): React.ReactNode[] {
  // Simple syntax highlighting without external deps
  const lines = code.split("\n");

  return lines.map((line, i) => {
    let highlighted: React.ReactNode;

    if (language === "bash") {
      highlighted = highlightBash(line);
    } else if (language === "css") {
      highlighted = highlightCss(line);
    } else if (language === "js" || language === "javascript" || language === "tsx") {
      highlighted = highlightJs(line);
    } else {
      highlighted = line;
    }

    return (
      <span key={i}>
        {highlighted}
        {i < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
}

function highlightBash(line: string): React.ReactNode {
  if (line.startsWith("#")) {
    return <span className="text-nf-text-dim">{line}</span>;
  }
  if (line.startsWith("$") || line.startsWith("npx") || line.startsWith("npm")) {
    // Highlight command
    const parts = line.split(" ");
    return (
      <>
        <span className="text-nf-cyan">{parts[0]}</span>
        {" "}
        <span className="text-nf-amber">{parts[1] || ""}</span>
        {parts.length > 2 && (
          <span className="text-nf-text"> {parts.slice(2).join(" ")}</span>
        )}
      </>
    );
  }
  return line;
}

function highlightCss(line: string): React.ReactNode {
  const trimmed = line.trim();
  if (trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return <span className="text-nf-text-dim">{line}</span>;
  }
  if (trimmed.startsWith("--")) {
    const [prop, ...vals] = trimmed.split(":");
    return (
      <>
        {"  "}<span className="text-nf-cyan">{prop.trim()}</span>
        <span className="text-nf-text-muted">: </span>
        <span className="text-nf-amber">{vals.join(":").replace(";", "")}</span>
        <span className="text-nf-text-muted">;</span>
      </>
    );
  }
  if (trimmed.startsWith("@import")) {
    return <span className="text-nf-violet">{line}</span>;
  }
  return line;
}

function highlightJs(line: string): React.ReactNode {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) {
    return <span className="text-nf-text-dim">{line}</span>;
  }
  if (trimmed.startsWith("import")) {
    return <span className="text-nf-violet">{line}</span>;
  }
  return line;
}

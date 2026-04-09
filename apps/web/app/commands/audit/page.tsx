import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function AuditCommandPage() {
  return (
    <DocPage
      title="audit"
      description="Run a WCAG contrast audit on your generated theme and auto-fix failing pairs."
    >
      <DocSection title="Basic Usage">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css audit`}
        />
        <p>
          Reads your scan data and generated theme, then checks every foreground/background
          color pair against WCAG contrast requirements. Produces a detailed report with
          pass/fail status for each pair.
        </p>
      </DocSection>

      <DocSection title="Audit Report">
        <p>The report lists every color pair with its contrast ratio and compliance level:</p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css audit

# Nightfall CSS — Contrast Audit Report
# ══════════════════════════════════════
#
# ✓ PASS  --text-heading on --bg-page        15.2:1  AAA
# ✓ PASS  --text-heading on --bg-surface     14.8:1  AAA
# ✓ PASS  --text-body on --bg-page           10.1:1  AAA
# ✓ PASS  --text-body on --bg-surface         9.8:1  AAA
# ⚠ PASS  --text-muted on --bg-page           4.7:1  AA only
# ✗ FAIL  --text-muted on --bg-elevated        3.8:1  Below AA
# ✓ PASS  --brand-primary on --bg-surface      5.2:1  AA
# ✓ PASS  --brand-text on --brand-primary      8.1:1  AAA
#
# Summary: 7 pass, 1 fail (87.5% compliant)
# Run with --fix to auto-correct failing pairs`}
        />
      </DocSection>

      <DocSection title="Auto-Fix">
        <p>
          The <code>--fix</code> flag automatically adjusts failing color pairs to meet
          the target contrast level with minimal perceptual change:
        </p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css audit --fix

# ✗ FAIL  --text-muted on --bg-elevated  3.8:1 (need 4.5:1)
#   → Fixed: adjusted --text-muted lightness +0.06
#   → New ratio: 4.6:1 ✓ AA
#   → Delta-E from original: 3.2 (within budget)
#
# Updated theme written to ./nightfall-theme.css`}
        />
        <p>
          Auto-fix adjusts the foreground color&apos;s lightness in OKLCH space, making the
          smallest change needed to reach the target ratio while keeping hue and chroma intact.
        </p>
      </DocSection>

      <DocSection title="Contrast Levels">
        <CodeBlock
          language="bash"
          code={`# Target WCAG AA (4.5:1 for normal text, 3:1 for large text)
npx nightfall-css audit --level aa

# Target WCAG AAA (7:1 for normal text, 4.5:1 for large text)
npx nightfall-css audit --level aaa`}
        />
      </DocSection>

      <DocSection title="All Options">
        <CodeBlock
          language="bash"
          code={`npx nightfall-css audit [options]

Options:
  --input <path>       Scan data path (default: .nightfall/scan.json)
  --theme <path>       Generated theme file to audit
  --level <level>      Target level: aa | aaa (default: aa)
  --fix                Auto-fix failing pairs
  --fix-output <path>  Output path for fixed theme
  --json               Output report as JSON
  --verbose            Show delta-E and adjustment details`}
        />
      </DocSection>

      <DocSection title="JSON Output">
        <p>For CI integration, output the audit report as structured JSON:</p>
        <CodeBlock
          language="bash"
          code={`npx nightfall-css audit --json > audit-report.json`}
        />
        <CodeBlock
          language="js"
          filename="audit-report.json"
          code={`{
  "summary": { "pass": 7, "fail": 1, "total": 8, "compliance": 0.875 },
  "pairs": [
    {
      "foreground": "--text-heading",
      "background": "--bg-page",
      "ratio": 15.2,
      "level": "AAA",
      "pass": true
    },
    {
      "foreground": "--text-muted",
      "background": "--bg-elevated",
      "ratio": 3.8,
      "level": "fail",
      "pass": false,
      "fix": {
        "adjustment": "+0.06 lightness",
        "newRatio": 4.6,
        "deltaE": 3.2
      }
    }
  ]
}`}
        />
      </DocSection>
    </DocPage>
  );
}

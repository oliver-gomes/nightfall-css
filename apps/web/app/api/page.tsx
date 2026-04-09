import { DocPage, DocSection } from "@/components/DocPage";
import { CodeBlock } from "@/components/CodeBlock";

export default function ApiPage() {
  return (
    <DocPage
      title="API Reference"
      description="Programmatic API for using Nightfall in your own tools, scripts, and build pipelines."
    >
      <DocSection title="Installation">
        <CodeBlock
          language="bash"
          code={`npm install nightfall-css`}
        />
        <CodeBlock
          language="tsx"
          code={`import {
  transformTheme,
  detectThemeDirection,
  classifyColors,
  buildColorGraph,
  contrastRatio,
  autoFixContrast,
  hexToOklch,
  oklchToHex,
  deltaE,
  gamutMap,
} from 'nightfall-css'`}
        />
      </DocSection>

      <DocSection title="transformTheme()">
        <p>
          The main transformation function. Takes classified colors and a configuration object,
          returns the complete transformed theme:
        </p>
        <CodeBlock
          language="tsx"
          code={`const result = transformTheme(classifiedColors, {
  direction: 'light-to-dark',
  preset: 'neutral',
  contrast: { target: 'aa', autoFix: true },
  brand: {
    preserve: ['#2563eb', '#7c3aed'],
    maxChromaShift: 0.15,
    maxLightnessShift: 0.20,
    maxDeltaE: 15,
  },
})

// result.tokens — Record<string, TransformedToken>
// result.shadows — ShadowScale (generated for dark→light)
// result.warnings — string[] (auto-fix warnings)
// result.metadata — { direction, preset, generatedAt }`}
        />
        <p>Type signature:</p>
        <CodeBlock
          language="tsx"
          code={`function transformTheme(
  colors: ClassifiedColor[],
  config: TransformConfig
): TransformResult

interface TransformConfig {
  direction: 'light-to-dark' | 'dark-to-light' | 'both'
  preset?: 'neutral' | 'warm' | 'midnight' | 'oled' | 'dimmed' | string
  contrast?: { target: 'aa' | 'aaa'; autoFix: boolean }
  brand?: {
    preserve: string[]
    maxChromaShift?: number
    maxLightnessShift?: number
    maxDeltaE?: number
  }
}

interface TransformResult {
  tokens: Record<string, TransformedToken>
  shadows: ShadowScale
  warnings: string[]
  metadata: TransformMetadata
}`}
        />
      </DocSection>

      <DocSection title="detectThemeDirection()">
        <p>
          Analyzes a set of background colors and returns the detected theme direction:
        </p>
        <CodeBlock
          language="tsx"
          code={`const direction = detectThemeDirection(backgrounds)

// backgrounds: Array<{ color: string; area: number }>
// Returns: 'light' | 'dark' | 'ambiguous'

// Example:
const direction = detectThemeDirection([
  { color: '#ffffff', area: 921600 },
  { color: '#f8f9fa', area: 345600 },
])
// → 'light' (weighted avg L > 0.6)`}
        />
      </DocSection>

      <DocSection title="classifyColors()">
        <p>
          Takes raw scanned colors and assigns semantic roles (background, text, border, brand, etc.):
        </p>
        <CodeBlock
          language="tsx"
          code={`const classified = classifyColors(rawColors)

// rawColors: Array<{ value: string; property: string; parentBg?: string }>
// Returns: ClassifiedColor[]

interface ClassifiedColor {
  value: string            // oklch(...) or hex
  role: string             // 'background.page' | 'text.heading' | 'brand.primary' | ...
  property: string         // CSS property it came from
  parentBackground: string // What surface it sits on
  contrastRatio: number    // Against its parent
}

// Example:
const classified = classifyColors([
  { value: '#ffffff', property: 'background-color', parentBg: null },
  { value: '#111827', property: 'color', parentBg: '#ffffff' },
  { value: '#2563eb', property: 'background-color', parentBg: '#ffffff' },
])
// → [
//   { value: '#ffffff', role: 'background.page', ... },
//   { value: '#111827', role: 'text.heading', contrastRatio: 18.1, ... },
//   { value: '#2563eb', role: 'brand.primary', contrastRatio: 4.8, ... },
// ]`}
        />
      </DocSection>

      <DocSection title="buildColorGraph()">
        <p>
          Builds the color relationship graph from classified colors:
        </p>
        <CodeBlock
          language="tsx"
          code={`const graph = buildColorGraph(classifiedColors)

// Returns a tree structure:
interface ColorNode {
  token: string           // Variable name
  value: string           // Color value
  role: string            // Semantic role
  children: ColorNode[]   // Colors that sit on this one
  contrastRatio?: number  // Contrast against parent
}

// Traverse the graph:
function walk(node: ColorNode, depth = 0) {
  console.log('  '.repeat(depth) + node.token + ' ' + node.value)
  for (const child of node.children) {
    walk(child, depth + 1)
  }
}
walk(graph.root)`}
        />
      </DocSection>

      <DocSection title="Color Utilities">
        <CodeBlock
          language="tsx"
          code={`import {
  hexToOklch,
  oklchToHex,
  contrastRatio,
  deltaE,
  gamutMap,
} from 'nightfall-css'

// Convert hex to OKLCH
const oklch = hexToOklch('#2563eb')
// { l: 0.55, c: 0.22, h: 260 }

// Convert OKLCH back to hex
const hex = oklchToHex({ l: 0.55, c: 0.22, h: 260 })
// '#2563eb'

// Calculate WCAG contrast ratio between two colors
const ratio = contrastRatio('#ffffff', '#2563eb')
// 4.87

// Measure perceptual distance between two OKLCH colors
const distance = deltaE(
  { l: 0.55, c: 0.22, h: 260 },
  { l: 0.62, c: 0.20, h: 260 }
)
// 4.2

// Map an out-of-gamut OKLCH color to the nearest in-gamut sRGB color
const inGamut = gamutMap({ l: 0.8, c: 0.35, h: 150 })
// { l: 0.8, c: 0.22, h: 150 } — chroma reduced to fit sRGB`}
        />
      </DocSection>

      <DocSection title="autoFixContrast()">
        <p>
          Adjusts a foreground color to meet a target contrast ratio against a background:
        </p>
        <CodeBlock
          language="tsx"
          code={`const fixed = autoFixContrast({
  foreground: '#9ca3af',
  background: '#1e1e22',
  targetRatio: 4.5,  // WCAG AA
})

// fixed.value — the adjusted foreground color
// fixed.ratio — the new contrast ratio
// fixed.deltaE — perceptual distance from original
// fixed.adjustment — description of what changed

// Example result:
// {
//   value: '#b0b5bd',
//   ratio: 4.6,
//   deltaE: 3.2,
//   adjustment: 'lightness +0.06'
// }`}
        />
      </DocSection>

      <DocSection title="Presets">
        <CodeBlock
          language="tsx"
          code={`import { getPreset, listPresets } from 'nightfall-css'

// Get a preset configuration
const midnight = getPreset('midnight')
// {
//   baseLightness: 0.10,
//   hueUndertone: 250,
//   chromaAmount: 0.015,
//   elevationStep: 0.04,
//   textContrast: 'normal',
// }

// List all available presets
const presets = listPresets()
// ['neutral', 'warm', 'midnight', 'oled', 'dimmed']`}
        />
      </DocSection>

      <DocSection title="Export Functions">
        <CodeBlock
          language="tsx"
          code={`import {
  exportCssVariables,
  exportTailwind,
  exportScss,
  exportJsonTokens,
  exportFigmaTokens,
  exportStyleDictionary,
} from 'nightfall-css'

// Each takes a TransformResult and returns a string
const css = exportCssVariables(result, {
  selector: '[data-theme="dark"]',
  prefix: 'nf',
  fallback: 'hex',
})

const tailwind = exportTailwind(result)
const scss = exportScss(result)
const json = exportJsonTokens(result)
const figma = exportFigmaTokens(result)
const sd = exportStyleDictionary(result)`}
        />
      </DocSection>
    </DocPage>
  );
}

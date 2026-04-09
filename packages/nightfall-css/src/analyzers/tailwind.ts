/**
 * Tailwind CSS class detection & config extraction.
 */

export interface TailwindColorUsage {
  className: string;
  utility: string; // bg, text, border, ring, etc.
  colorName: string; // blue, gray, etc.
  shade?: string; // 500, 600, etc.
  opacity?: string; // /50, /75, etc.
}

/**
 * Parse Tailwind color classes into structured data.
 */
export function parseTailwindClasses(classes: string[]): TailwindColorUsage[] {
  const results: TailwindColorUsage[] = [];
  const colorRegex = /^(bg|text|border|ring|shadow|outline|fill|stroke|accent|caret|decoration)-([\w]+)(?:-(\d+))?(?:\/(\d+))?$/;

  for (const cls of classes) {
    const match = cls.match(colorRegex);
    if (match) {
      results.push({
        className: cls,
        utility: match[1],
        colorName: match[2],
        shade: match[3],
        opacity: match[4],
      });
    }
  }

  return results;
}

/**
 * Check if the page appears to use Tailwind CSS.
 */
export function detectTailwind(classes: string[]): boolean {
  const tailwindPatterns = [
    /^(flex|grid|block|inline|hidden)$/,
    /^(p|m|w|h|gap)-/,
    /^(bg|text|border)-/,
    /^(rounded|shadow|ring)-?/,
    /^(sm|md|lg|xl|2xl):/,
  ];

  let matchCount = 0;
  for (const cls of classes) {
    for (const pattern of tailwindPatterns) {
      if (pattern.test(cls)) {
        matchCount++;
        break;
      }
    }
  }

  // If >20% of classes match Tailwind patterns, it's likely Tailwind
  return matchCount > classes.length * 0.2;
}

/**
 * Standard Tailwind color palette values.
 */
export const tailwindColors: Record<string, Record<string, string>> = {
  slate: { '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1', '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155', '800': '#1e293b', '900': '#0f172a', '950': '#020617' },
  gray: { '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db', '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151', '800': '#1f2937', '900': '#111827', '950': '#030712' },
  zinc: { '50': '#fafafa', '100': '#f4f4f5', '200': '#e4e4e7', '300': '#d4d4d8', '400': '#a1a1aa', '500': '#71717a', '600': '#52525b', '700': '#3f3f46', '800': '#27272a', '900': '#18181b', '950': '#09090b' },
  neutral: { '50': '#fafafa', '100': '#f5f5f5', '200': '#e5e5e5', '300': '#d4d4d4', '400': '#a3a3a3', '500': '#737373', '600': '#525252', '700': '#404040', '800': '#262626', '900': '#171717', '950': '#0a0a0a' },
  stone: { '50': '#fafaf9', '100': '#f5f5f4', '200': '#e7e5e4', '300': '#d6d3d1', '400': '#a8a29e', '500': '#78716c', '600': '#57534e', '700': '#44403c', '800': '#292524', '900': '#1c1917', '950': '#0c0a09' },
  red: { '50': '#fef2f2', '500': '#ef4444', '600': '#dc2626', '700': '#b91c1c' },
  green: { '50': '#f0fdf4', '500': '#22c55e', '600': '#16a34a', '700': '#15803d' },
  blue: { '50': '#eff6ff', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8' },
  yellow: { '50': '#fefce8', '500': '#eab308', '600': '#ca8a04' },
  violet: { '50': '#f5f3ff', '500': '#8b5cf6', '600': '#7c3aed', '700': '#6d28d9' },
};

/**
 * Resolve a Tailwind class to its hex value.
 */
export function resolveTailwindColor(colorName: string, shade?: string): string | null {
  const palette = tailwindColors[colorName];
  if (!palette) return null;
  return palette[shade || '500'] || null;
}

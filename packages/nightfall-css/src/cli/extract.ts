/**
 * Color extraction — processes DOM walker output into color usage data.
 */

import type { ExtractedElement } from '../analyzers/dom-walker.js';
import type { ColorUsage } from '../core/classifier.js';
import { parseCssColor, rgbaToHex } from '../utils/color-space.js';

export interface ExtractedColors {
  backgrounds: Array<{ color: string; count: number; selectors: string[] }>;
  texts: Array<{ color: string; count: number; selectors: string[] }>;
  borders: Array<{ color: string; count: number; selectors: string[] }>;
  shadows: Array<{ color: string; count: number; selectors: string[] }>;
  rootBackground: string | undefined;
  all: ColorUsage[];
}

function isTransparent(color: string): boolean {
  if (!color || color === 'transparent') return true;
  const parsed = parseCssColor(color);
  return !parsed || parsed.a < 0.05;
}

function normalizeColor(color: string): string | null {
  const parsed = parseCssColor(color);
  if (!parsed || parsed.a < 0.05) return null;
  // Normalize to 6-digit hex (ignoring alpha for classification)
  return rgbaToHex({ ...parsed, a: 1 });
}

/**
 * Extract and aggregate colors from DOM walker output.
 */
export function extractColors(elements: ExtractedElement[]): ExtractedColors {
  const bgMap = new Map<string, { count: number; selectors: string[] }>();
  const textMap = new Map<string, { count: number; selectors: string[] }>();
  const borderMap = new Map<string, { count: number; selectors: string[] }>();
  const shadowMap = new Map<string, { count: number; selectors: string[] }>();

  let rootBackground: string | undefined;

  for (const el of elements) {
    if (!el.isVisible) continue;

    const { styles, selector, tag, depth } = el;

    // Root background
    if ((tag === 'html' || tag === 'body') && !isTransparent(styles.backgroundColor)) {
      rootBackground = styles.backgroundColor;
    }

    // Backgrounds
    const bgHex = normalizeColor(styles.backgroundColor);
    if (bgHex) {
      const existing = bgMap.get(bgHex);
      if (existing) {
        existing.count++;
        if (existing.selectors.length < 5) existing.selectors.push(selector);
      } else {
        bgMap.set(bgHex, { count: 1, selectors: [selector] });
      }
    }

    // Text colors
    const textHex = normalizeColor(styles.color);
    if (textHex) {
      const existing = textMap.get(textHex);
      if (existing) {
        existing.count++;
        if (existing.selectors.length < 5) existing.selectors.push(selector);
      } else {
        textMap.set(textHex, { count: 1, selectors: [selector] });
      }
    }

    // Border colors
    const borderColors = [
      styles.borderTopColor,
      styles.borderRightColor,
      styles.borderBottomColor,
      styles.borderLeftColor,
    ];
    for (const bc of borderColors) {
      const borderHex = normalizeColor(bc);
      if (borderHex) {
        const existing = borderMap.get(borderHex);
        if (existing) {
          existing.count++;
        } else {
          borderMap.set(borderHex, { count: 1, selectors: [selector] });
        }
      }
    }

    // Shadows
    if (styles.boxShadow && styles.boxShadow !== 'none') {
      const shadowColors = styles.boxShadow.match(/rgba?\([^)]+\)/g) || [];
      for (const sc of shadowColors) {
        const hex = normalizeColor(sc);
        if (hex) {
          const existing = shadowMap.get(hex);
          if (existing) {
            existing.count++;
          } else {
            shadowMap.set(hex, { count: 1, selectors: [selector] });
          }
        }
      }
    }
  }

  const backgrounds = mapToArray(bgMap);
  const texts = mapToArray(textMap);
  const borders = mapToArray(borderMap);
  const shadows = mapToArray(shadowMap);

  // Combine all into ColorUsage format
  const all: ColorUsage[] = [
    ...backgrounds.map((b) => ({ color: b.color, property: 'background-color', count: b.count, elements: b.selectors })),
    ...texts.map((t) => ({ color: t.color, property: 'color', count: t.count, elements: t.selectors })),
    ...borders.map((b) => ({ color: b.color, property: 'border-color', count: b.count, elements: b.selectors })),
    ...shadows.map((s) => ({ color: s.color, property: 'box-shadow', count: s.count, elements: s.selectors })),
  ];

  return { backgrounds, texts, borders, shadows, rootBackground, all };
}

function mapToArray(map: Map<string, { count: number; selectors: string[] }>) {
  return Array.from(map.entries())
    .map(([color, data]) => ({ color, ...data }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Visual hierarchy detection — determines the layering of UI elements.
 * Background → Surface → Card → Text
 */

import type { OKLCH } from '../utils/color-space.js';
import { hexToOklch, parseCssColor, rgbaToHex } from '../utils/color-space.js';

export interface HierarchyLevel {
  level: number; // 0 = page bg, 1 = surface, 2 = elevated, etc.
  color: string;
  oklch: OKLCH;
  area: number; // approximate visual area covered
  elements: string[];
}

export interface HierarchyResult {
  isLight: boolean;
  levels: HierarchyLevel[];
}

/**
 * Detect the visual hierarchy from extracted background colors.
 */
export function detectHierarchy(
  backgrounds: Array<{ color: string; area: number; selector: string }>
): HierarchyResult {
  // Deduplicate and aggregate area by color
  const colorMap = new Map<string, { area: number; elements: string[] }>();

  for (const bg of backgrounds) {
    const parsed = parseCssColor(bg.color);
    if (!parsed || parsed.a < 0.1) continue;

    const hex = rgbaToHex({ ...parsed, a: 1 });
    const existing = colorMap.get(hex);
    if (existing) {
      existing.area += bg.area;
      existing.elements.push(bg.selector);
    } else {
      colorMap.set(hex, { area: bg.area, elements: [bg.selector] });
    }
  }

  // Convert to array with OKLCH values
  const colors = Array.from(colorMap.entries()).map(([hex, data]) => ({
    color: hex,
    oklch: hexToOklch(hex),
    area: data.area,
    elements: data.elements,
  }));

  if (colors.length === 0) {
    return { isLight: true, levels: [] };
  }

  // Sort by area (largest first) — the largest area bg is likely the page bg
  colors.sort((a, b) => b.area - a.area);

  // Determine if light or dark based on the dominant (largest area) background
  const dominantL = colors[0].oklch.L;
  const isLight = dominantL > 0.5;

  // Sort by lightness for hierarchy assignment
  if (isLight) {
    // Light theme: lightest = page, darker = elevated
    colors.sort((a, b) => b.oklch.L - a.oklch.L);
  } else {
    // Dark theme: darkest = page, lighter = elevated
    colors.sort((a, b) => a.oklch.L - b.oklch.L);
  }

  // Assign levels, merging very similar colors
  const levels: HierarchyLevel[] = [];
  let levelNum = 0;

  for (const color of colors) {
    // Check if this color is too similar to the previous level
    if (levels.length > 0) {
      const prevOklch = levels[levels.length - 1].oklch;
      const ldiff = Math.abs(color.oklch.L - prevOklch.L);
      if (ldiff < 0.02) {
        // Merge into previous level
        levels[levels.length - 1].area += color.area;
        levels[levels.length - 1].elements.push(...color.elements);
        continue;
      }
    }

    levels.push({
      level: levelNum++,
      color: color.color,
      oklch: color.oklch,
      area: color.area,
      elements: color.elements,
    });

    if (levelNum >= 5) break; // Max 5 hierarchy levels
  }

  return { isLight, levels };
}

/**
 * Classifies color roles — assigns semantic roles to extracted colors.
 */

import { hexToOklch, type OKLCH } from '../utils/color-space.js';
import { contrastRatio } from './contrast.js';

export type ColorRole =
  | 'background.page'
  | 'background.surface'
  | 'background.elevated'
  | 'text.primary'
  | 'text.secondary'
  | 'text.tertiary'
  | 'text.inverse'
  | 'border.default'
  | 'border.subtle'
  | 'brand.primary'
  | 'brand.secondary'
  | 'accent.link'
  | 'accent.focus'
  | 'status.success'
  | 'status.warning'
  | 'status.error'
  | 'status.info'
  | 'shadow.default'
  | 'shadow.strong'
  | 'overlay.backdrop';

export interface ClassifiedColor {
  role: ColorRole;
  value: string; // hex
  oklch: OKLCH;
  usage: number; // how many elements use this color
  cssProperty: string; // which CSS property it came from
}

export interface ColorUsage {
  color: string;
  property: string;
  count: number;
  elements: string[]; // selector hints
}

/**
 * Classify a set of extracted colors into semantic roles.
 */
export function classifyColors(
  colorUsages: ColorUsage[],
  isLightTheme: boolean
): ClassifiedColor[] {
  const classified: ClassifiedColor[] = [];
  const used = new Set<string>();

  // Group by property type
  const backgrounds = colorUsages.filter((c) => c.property.includes('background'));
  const textColors = colorUsages.filter((c) => c.property === 'color');
  const borders = colorUsages.filter((c) => c.property.includes('border'));
  const shadows = colorUsages.filter((c) => c.property.includes('shadow'));

  // Sort by usage count (most used first)
  backgrounds.sort((a, b) => b.count - a.count);
  textColors.sort((a, b) => b.count - a.count);
  borders.sort((a, b) => b.count - a.count);

  // Classify backgrounds
  const bgColors = backgrounds.map((b) => ({
    ...b,
    oklch: hexToOklch(b.color),
  }));

  if (isLightTheme) {
    // Light theme: lightest bg = page, next = surface, next = elevated
    bgColors.sort((a, b) => b.oklch.L - a.oklch.L);
  } else {
    // Dark theme: darkest bg = page, next = surface, next = elevated
    bgColors.sort((a, b) => a.oklch.L - b.oklch.L);
  }

  const bgRoles: ColorRole[] = ['background.page', 'background.surface', 'background.elevated'];
  bgColors.slice(0, 3).forEach((bg, i) => {
    if (!used.has(bg.color)) {
      classified.push({
        role: bgRoles[i] || 'background.elevated',
        value: bg.color,
        oklch: bg.oklch,
        usage: bg.count,
        cssProperty: bg.property,
      });
      used.add(bg.color);
    }
  });

  // Classify text
  const txtColors = textColors.map((t) => ({
    ...t,
    oklch: hexToOklch(t.color),
  }));

  if (isLightTheme) {
    // Light: darkest text = primary, medium = secondary, lighter = tertiary
    txtColors.sort((a, b) => a.oklch.L - b.oklch.L);
  } else {
    // Dark: lightest text = primary, medium = secondary, darker = tertiary
    txtColors.sort((a, b) => b.oklch.L - a.oklch.L);
  }

  const textRoles: ColorRole[] = ['text.primary', 'text.secondary', 'text.tertiary'];
  const chromaThreshold = 0.04; // Colors with more chroma might be brand/accent, not text

  let textIdx = 0;
  for (const txt of txtColors) {
    if (textIdx >= 3) break;
    if (used.has(txt.color)) continue;

    // Skip highly chromatic colors (likely brand/accent)
    if (txt.oklch.C > chromaThreshold && textIdx === 0) {
      // Check if it might be a brand/accent color
      const isChromatic = txt.oklch.C > 0.08;
      if (isChromatic) {
        classified.push({
          role: 'brand.primary',
          value: txt.color,
          oklch: txt.oklch,
          usage: txt.count,
          cssProperty: txt.property,
        });
        used.add(txt.color);
        continue;
      }
    }

    classified.push({
      role: textRoles[textIdx],
      value: txt.color,
      oklch: txt.oklch,
      usage: txt.count,
      cssProperty: txt.property,
    });
    used.add(txt.color);
    textIdx++;
  }

  // Classify borders
  const borderRoles: ColorRole[] = ['border.default', 'border.subtle'];
  borders.slice(0, 2).forEach((b, i) => {
    if (!used.has(b.color)) {
      classified.push({
        role: borderRoles[i],
        value: b.color,
        oklch: hexToOklch(b.color),
        usage: b.count,
        cssProperty: b.property,
      });
      used.add(b.color);
    }
  });

  // Classify remaining chromatic colors as brand/accent
  const remaining = colorUsages.filter((c) => !used.has(c.color));
  for (const color of remaining) {
    const oklch = hexToOklch(color.color);
    if (oklch.C > 0.08) {
      // Classify by hue
      const role = classifyByHue(oklch, used, classified);
      if (role) {
        classified.push({
          role,
          value: color.color,
          oklch,
          usage: color.count,
          cssProperty: color.property,
        });
        used.add(color.color);
      }
    }
  }

  // Classify shadows
  shadows.slice(0, 2).forEach((s, i) => {
    if (!used.has(s.color)) {
      classified.push({
        role: i === 0 ? 'shadow.default' : 'shadow.strong',
        value: s.color,
        oklch: hexToOklch(s.color),
        usage: s.count,
        cssProperty: s.property,
      });
      used.add(s.color);
    }
  });

  return classified;
}

function classifyByHue(oklch: OKLCH, used: Set<string>, existing: ClassifiedColor[]): ColorRole | null {
  const hue = oklch.H;
  const hasRole = (r: ColorRole) => existing.some((c) => c.role === r);

  // Green family: 120-170
  if (hue >= 120 && hue <= 170 && !hasRole('status.success')) {
    return 'status.success';
  }
  // Red family: 0-30, 330-360
  if ((hue <= 30 || hue >= 330) && !hasRole('status.error')) {
    return 'status.error';
  }
  // Yellow/amber family: 60-100
  if (hue >= 60 && hue <= 100 && !hasRole('status.warning')) {
    return 'status.warning';
  }
  // Blue family: 220-270
  if (hue >= 220 && hue <= 270) {
    if (!hasRole('brand.primary')) return 'brand.primary';
    if (!hasRole('status.info')) return 'status.info';
    if (!hasRole('accent.link')) return 'accent.link';
  }
  // Purple family: 270-330
  if (hue >= 270 && hue <= 330) {
    if (!hasRole('brand.secondary')) return 'brand.secondary';
    if (!hasRole('accent.focus')) return 'accent.focus';
  }

  // Fallback
  if (!hasRole('brand.primary')) return 'brand.primary';
  if (!hasRole('brand.secondary')) return 'brand.secondary';
  if (!hasRole('accent.link')) return 'accent.link';

  return null;
}

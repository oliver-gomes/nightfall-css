/**
 * Shadow transformation — handles bidirectional shadow mapping.
 */

export interface ParsedShadow {
  inset: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

/**
 * Parse a CSS box-shadow value into components.
 */
export function parseShadow(shadow: string): ParsedShadow[] {
  const shadows: ParsedShadow[] = [];
  // Split by comma, but not inside rgba()
  const parts = shadow.split(/,(?![^(]*\))/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed === 'none') continue;

    const inset = trimmed.includes('inset');
    const cleaned = trimmed.replace('inset', '').trim();

    // Extract color
    const rgbaMatch = cleaned.match(/rgba?\([^)]+\)/);
    const hexMatch = cleaned.match(/#[0-9a-fA-F]{3,8}/);
    const color = rgbaMatch?.[0] || hexMatch?.[0] || 'rgba(0, 0, 0, 0.1)';

    // Extract numeric values
    const withoutColor = cleaned
      .replace(/rgba?\([^)]+\)/, '')
      .replace(/#[0-9a-fA-F]{3,8}/, '')
      .trim();
    const nums = withoutColor.match(/-?[\d.]+/g)?.map(Number) || [0, 0, 0, 0];

    shadows.push({
      inset,
      x: nums[0] || 0,
      y: nums[1] || 0,
      blur: nums[2] || 0,
      spread: nums[3] || 0,
      color,
    });
  }

  return shadows;
}

/**
 * Convert parsed shadow back to CSS string.
 */
export function shadowToCss(shadow: ParsedShadow): string {
  const parts: string[] = [];
  if (shadow.inset) parts.push('inset');
  parts.push(`${shadow.x}px`);
  parts.push(`${shadow.y}px`);
  parts.push(`${shadow.blur}px`);
  if (shadow.spread !== 0) parts.push(`${shadow.spread}px`);
  parts.push(shadow.color);
  return parts.join(' ');
}

/**
 * Transform shadows from light → dark.
 * In dark mode, shadows are darker and less visible.
 */
export function transformShadowsLightToDark(shadows: ParsedShadow[]): ParsedShadow[] {
  return shadows.map((s) => {
    // Increase opacity, increase blur, reduce spread
    const alphaMatch = s.color.match(/[\d.]+\s*\)/);
    let newColor = s.color;
    if (alphaMatch) {
      const alpha = parseFloat(alphaMatch[0]);
      const newAlpha = Math.min(1, alpha * 1.5);
      newColor = s.color.replace(/[\d.]+\s*\)/, `${newAlpha.toFixed(3)})`);
    }

    return {
      ...s,
      blur: Math.round(s.blur * 1.2),
      spread: Math.round(s.spread * 0.8),
      color: newColor,
    };
  });
}

/**
 * Transform shadows from dark → light or generate from scratch.
 * Dark mode UIs often have no/minimal shadows — light mode needs them.
 */
export function transformShadowsDarkToLight(shadows: ParsedShadow[]): ParsedShadow[] {
  if (shadows.length === 0) {
    // Generate default light-mode shadows
    return parseShadow('0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)');
  }

  return shadows.map((s) => {
    // Convert dark glow-style shadows to proper directional shadows
    const alphaMatch = s.color.match(/[\d.]+\s*\)/);
    let newColor = 'rgba(0, 0, 0, 0.08)';

    if (alphaMatch) {
      const alpha = parseFloat(alphaMatch[0]);
      // If it was a white glow (dark-mode style), convert to downward shadow
      if (s.color.includes('255')) {
        const newAlpha = Math.min(0.15, alpha * 3);
        newColor = `rgba(0, 0, 0, ${newAlpha.toFixed(3)})`;
      } else {
        const newAlpha = Math.max(0.03, alpha * 0.6);
        newColor = `rgba(0, 0, 0, ${newAlpha.toFixed(3)})`;
      }
    }

    return {
      ...s,
      y: Math.max(1, s.y || 2), // Ensure downward shadow
      blur: Math.max(2, s.blur),
      spread: Math.min(0, s.spread),
      color: newColor,
    };
  });
}

/**
 * Generate elevation-based shadow scale for light mode.
 */
export function generateElevationShadows(): Record<string, string> {
  return {
    'shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
    'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    'shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    'shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    'shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    'shadow-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  };
}

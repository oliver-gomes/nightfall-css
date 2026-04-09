/**
 * OKLCH / OKLAB color space utilities
 * All transformations in Nightfall happen in OKLCH — perceptually uniform color space.
 */

export interface RGB {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
}

export interface OKLAB {
  L: number; // 0-1 (lightness)
  a: number; // roughly -0.4 to 0.4
  b: number; // roughly -0.4 to 0.4
}

export interface OKLCH {
  L: number; // 0-1 (lightness)
  C: number; // 0+ (chroma)
  H: number; // 0-360 (hue in degrees)
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

// sRGB linearization
function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function delinearize(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// sRGB → Linear RGB
export function srgbToLinear(rgb: RGB): RGB {
  return {
    r: linearize(rgb.r),
    g: linearize(rgb.g),
    b: linearize(rgb.b),
  };
}

// Linear RGB → sRGB
export function linearToSrgb(rgb: RGB): RGB {
  return {
    r: delinearize(rgb.r),
    g: delinearize(rgb.g),
    b: delinearize(rgb.b),
  };
}

// Linear sRGB → OKLAB
export function linearRgbToOklab(rgb: RGB): OKLAB {
  const l = 0.4122214708 * rgb.r + 0.5363325363 * rgb.g + 0.0514459929 * rgb.b;
  const m = 0.2119034982 * rgb.r + 0.6806995451 * rgb.g + 0.1073969566 * rgb.b;
  const s = 0.0883024619 * rgb.r + 0.2817188376 * rgb.g + 0.6299787005 * rgb.b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

// OKLAB → Linear sRGB
export function oklabToLinearRgb(lab: OKLAB): RGB {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
}

// OKLAB → OKLCH
export function oklabToOklch(lab: OKLAB): OKLCH {
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let H = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L: lab.L, C, H };
}

// OKLCH → OKLAB
export function oklchToOklab(lch: OKLCH): OKLAB {
  const hRad = (lch.H * Math.PI) / 180;
  return {
    L: lch.L,
    a: lch.C * Math.cos(hRad),
    b: lch.C * Math.sin(hRad),
  };
}

// Convenience: hex → OKLCH
export function hexToOklch(hex: string): OKLCH {
  const rgb = hexToRgb(hex);
  const linear = srgbToLinear(rgb);
  const lab = linearRgbToOklab(linear);
  return oklabToOklch(lab);
}

// Convenience: OKLCH → hex
export function oklchToHex(lch: OKLCH): string {
  const lab = oklchToOklab(lch);
  const linear = oklabToLinearRgb(lab);
  const srgb = linearToSrgb(linear);
  return rgbToHex(clampRgb(srgb));
}

// Parse hex color → RGB (0-1 range)
export function hexToRgb(hex: string): RGB {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
  };
}

// RGB (0-1) → hex
export function rgbToHex(rgb: RGB): string {
  const r = Math.round(rgb.r * 255)
    .toString(16)
    .padStart(2, '0');
  const g = Math.round(rgb.g * 255)
    .toString(16)
    .padStart(2, '0');
  const b = Math.round(rgb.b * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${r}${g}${b}`;
}

// Clamp RGB values to 0-1 (gamut mapping)
export function clampRgb(rgb: RGB): RGB {
  return {
    r: Math.max(0, Math.min(1, rgb.r)),
    g: Math.max(0, Math.min(1, rgb.g)),
    b: Math.max(0, Math.min(1, rgb.b)),
  };
}

// Check if OKLCH color is within sRGB gamut
export function isInGamut(lch: OKLCH): boolean {
  const lab = oklchToOklab(lch);
  const rgb = oklabToLinearRgb(lab);
  const srgb = linearToSrgb(rgb);
  const eps = 0.001;
  return (
    srgb.r >= -eps && srgb.r <= 1 + eps &&
    srgb.g >= -eps && srgb.g <= 1 + eps &&
    srgb.b >= -eps && srgb.b <= 1 + eps
  );
}

// Gamut map: reduce chroma until color fits in sRGB
export function gamutMapOklch(lch: OKLCH): OKLCH {
  if (isInGamut(lch)) return lch;

  let lo = 0;
  let hi = lch.C;
  let mapped = { ...lch };

  // Binary search for max chroma within gamut
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    mapped = { ...lch, C: mid };
    if (isInGamut(mapped)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return { ...lch, C: lo };
}

// Parse any CSS color string to RGBA
export function parseCssColor(color: string): RGBA | null {
  color = color.trim().toLowerCase();

  // Named colors
  const named: Record<string, string> = {
    transparent: '#00000000',
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#008000',
    blue: '#0000ff',
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    orange: '#ffa500',
    purple: '#800080',
    gray: '#808080',
    grey: '#808080',
  };

  if (named[color]) {
    color = named[color];
  }

  // Hex
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    let a = 1;
    if (hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      a = parseInt(hex.slice(6, 8), 16) / 255;
      hex = hex.slice(0, 6);
    } else if (hex.length === 8) {
      a = parseInt(hex.slice(6, 8), 16) / 255;
      hex = hex.slice(0, 6);
    } else if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const rgb = hexToRgb('#' + hex);
    return { ...rgb, a };
  }

  // rgb() / rgba()
  const rgbMatch = color.match(/rgba?\(\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?))?\s*\)/);
  if (rgbMatch) {
    const parseVal = (v: string, max: number) =>
      v.endsWith('%') ? (parseFloat(v) / 100) * max : parseFloat(v);
    return {
      r: parseVal(rgbMatch[1], 255) / 255,
      g: parseVal(rgbMatch[2], 255) / 255,
      b: parseVal(rgbMatch[3], 255) / 255,
      a: rgbMatch[4] ? parseVal(rgbMatch[4], 1) : 1,
    };
  }

  // hsl() / hsla()
  const hslMatch = color.match(/hsla?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)%\s*[,\s]\s*([\d.]+)%\s*(?:[,/]\s*([\d.]+%?))?\s*\)/);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]) / 360;
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;
    const a = hslMatch[4] ? (hslMatch[4].endsWith('%') ? parseFloat(hslMatch[4]) / 100 : parseFloat(hslMatch[4])) : 1;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    if (s === 0) {
      return { r: l, g: l, b: l, a };
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: hue2rgb(p, q, h + 1 / 3),
      g: hue2rgb(p, q, h),
      b: hue2rgb(p, q, h - 1 / 3),
      a,
    };
  }

  return null;
}

// RGBA → hex (with optional alpha)
export function rgbaToHex(rgba: RGBA): string {
  const hex = rgbToHex({ r: rgba.r, g: rgba.g, b: rgba.b });
  if (rgba.a < 1) {
    const alphaHex = Math.round(rgba.a * 255)
      .toString(16)
      .padStart(2, '0');
    return hex + alphaHex;
  }
  return hex;
}

// RGBA → CSS string
export function rgbaToCss(rgba: RGBA): string {
  const r = Math.round(rgba.r * 255);
  const g = Math.round(rgba.g * 255);
  const b = Math.round(rgba.b * 255);
  if (rgba.a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${Number(rgba.a.toFixed(3))})`;
  }
  return rgbToHex({ r: rgba.r, g: rgba.g, b: rgba.b });
}

// Get relative luminance (for WCAG calculations) from sRGB
export function relativeLuminance(rgb: RGB): number {
  const linear = srgbToLinear(rgb);
  return 0.2126 * linear.r + 0.7152 * linear.g + 0.0722 * linear.b;
}

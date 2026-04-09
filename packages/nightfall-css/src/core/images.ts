/**
 * Image/media brightness adjustment suggestions.
 */

export interface ImageSuggestion {
  selector: string;
  property: string;
  lightValue: string;
  darkValue: string;
  reason: string;
}

/**
 * Generate CSS suggestions for adjusting images in the opposite theme.
 */
export function generateImageSuggestions(direction: 'light-to-dark' | 'dark-to-light'): ImageSuggestion[] {
  if (direction === 'light-to-dark') {
    return [
      {
        selector: 'img',
        property: 'filter',
        lightValue: 'none',
        darkValue: 'brightness(0.9) contrast(1.05)',
        reason: 'Slightly reduce brightness for images on dark backgrounds',
      },
      {
        selector: 'img[src$=".svg"]',
        property: 'filter',
        lightValue: 'none',
        darkValue: 'brightness(0.85)',
        reason: 'SVG icons may need slightly more dimming',
      },
      {
        selector: 'video',
        property: 'filter',
        lightValue: 'none',
        darkValue: 'brightness(0.95)',
        reason: 'Subtle brightness reduction for video content',
      },
    ];
  }

  return [
    {
      selector: 'img',
      property: 'filter',
      lightValue: 'brightness(1.05) contrast(1.02)',
      darkValue: 'none',
      reason: 'Slightly increase brightness for images on light backgrounds',
    },
    {
      selector: 'img[src$=".svg"]',
      property: 'filter',
      lightValue: 'brightness(1.1)',
      darkValue: 'none',
      reason: 'SVG icons may need slight brightening on light backgrounds',
    },
  ];
}

/**
 * Generate overlay suggestion for images to reduce harsh contrast.
 */
export function generateImageOverlay(
  direction: 'light-to-dark' | 'dark-to-light',
  opacity = 0.05
): string {
  if (direction === 'light-to-dark') {
    return `linear-gradient(rgba(0, 0, 0, ${opacity}), rgba(0, 0, 0, ${opacity}))`;
  }
  return `linear-gradient(rgba(255, 255, 255, ${opacity}), rgba(255, 255, 255, ${opacity}))`;
}

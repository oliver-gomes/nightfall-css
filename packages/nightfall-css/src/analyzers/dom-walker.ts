/**
 * DOM Walker — walks the DOM tree in a headless browser, collecting computed styles.
 */

export interface ExtractedElement {
  tag: string;
  selector: string;
  styles: {
    backgroundColor: string;
    color: string;
    borderColor: string;
    borderTopColor: string;
    borderRightColor: string;
    borderBottomColor: string;
    borderLeftColor: string;
    boxShadow: string;
    outlineColor: string;
    fill: string;
    stroke: string;
    opacity: string;
  };
  isVisible: boolean;
  rect: { x: number; y: number; width: number; height: number };
  children: number;
  depth: number;
}

/**
 * Script that runs in the browser context to extract color data from all visible elements.
 */
export function getDomWalkerScript(): string {
  return `
    (() => {
      const elements = [];
      const visited = new Set();

      function getSelector(el) {
        if (el.id) return '#' + el.id;
        let path = '';
        let current = el;
        while (current && current !== document.body) {
          let selector = current.tagName.toLowerCase();
          if (current.className && typeof current.className === 'string') {
            const cls = current.className.trim().split(/\\s+/).slice(0, 2).join('.');
            if (cls) selector += '.' + cls;
          }
          path = path ? selector + ' > ' + path : selector;
          current = current.parentElement;
        }
        return 'body > ' + path;
      }

      function walk(el, depth = 0) {
        if (!el || visited.has(el) || depth > 30) return;
        visited.add(el);

        const rect = el.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 &&
          getComputedStyle(el).display !== 'none' &&
          getComputedStyle(el).visibility !== 'hidden';

        if (!isVisible && depth > 0) return;

        const computed = getComputedStyle(el);

        elements.push({
          tag: el.tagName.toLowerCase(),
          selector: getSelector(el),
          styles: {
            backgroundColor: computed.backgroundColor,
            color: computed.color,
            borderColor: computed.borderColor,
            borderTopColor: computed.borderTopColor,
            borderRightColor: computed.borderRightColor,
            borderBottomColor: computed.borderBottomColor,
            borderLeftColor: computed.borderLeftColor,
            boxShadow: computed.boxShadow,
            outlineColor: computed.outlineColor,
            fill: computed.fill || '',
            stroke: computed.stroke || '',
            opacity: computed.opacity,
          },
          isVisible,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          children: el.children.length,
          depth,
        });

        for (const child of el.children) {
          walk(child, depth + 1);
        }
      }

      walk(document.documentElement);
      return elements;
    })()
  `;
}

/**
 * Script to extract CSS custom properties from stylesheets.
 */
export function getCssVariablesScript(): string {
  return `
    (() => {
      const vars = {};

      // From computed styles on root
      const rootStyles = getComputedStyle(document.documentElement);
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.style) {
              for (let i = 0; i < rule.style.length; i++) {
                const prop = rule.style[i];
                if (prop.startsWith('--')) {
                  vars[prop] = rule.style.getPropertyValue(prop).trim();
                }
              }
            }
          }
        } catch (e) {
          // Cross-origin stylesheet, skip
        }
      }

      return vars;
    })()
  `;
}

/**
 * Script to extract Tailwind classes from elements.
 */
export function getTailwindClassesScript(): string {
  return `
    (() => {
      const classes = new Set();
      const colorClasses = /^(bg|text|border|ring|shadow|outline|fill|stroke)-(\\w+)(-\\d+)?(\\/\\d+)?$/;

      document.querySelectorAll('*').forEach(el => {
        if (el.className && typeof el.className === 'string') {
          el.className.split(/\\s+/).forEach(cls => {
            if (colorClasses.test(cls)) {
              classes.add(cls);
            }
          });
        }
      });

      return Array.from(classes);
    })()
  `;
}

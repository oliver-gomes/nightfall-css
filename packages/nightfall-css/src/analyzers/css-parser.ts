/**
 * CSS Parser — parses existing stylesheets for variable names and color values.
 */

export interface CssVariable {
  name: string;
  value: string;
  selector: string;
}

export interface CssColorDeclaration {
  selector: string;
  property: string;
  value: string;
  specificity: number;
}

/**
 * Extract CSS custom properties from a CSS string.
 */
export function extractCssVariables(css: string): CssVariable[] {
  const vars: CssVariable[] = [];
  const ruleRegex = /([^{}]+)\{([^{}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = ruleRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    const declarations = match[2];
    const varRegex = /(--[\w-]+)\s*:\s*([^;]+)/g;
    let varMatch: RegExpExecArray | null;

    while ((varMatch = varRegex.exec(declarations)) !== null) {
      vars.push({
        name: varMatch[1],
        value: varMatch[2].trim(),
        selector,
      });
    }
  }

  return vars;
}

/**
 * Extract color-related declarations from CSS.
 */
export function extractColorDeclarations(css: string): CssColorDeclaration[] {
  const decls: CssColorDeclaration[] = [];
  const colorProps = [
    'color', 'background-color', 'background', 'border-color',
    'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
    'box-shadow', 'outline-color', 'text-decoration-color', 'fill', 'stroke',
  ];

  const ruleRegex = /([^{}]+)\{([^{}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = ruleRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    const declarations = match[2];

    for (const prop of colorProps) {
      const propRegex = new RegExp(`${prop}\\s*:\\s*([^;]+)`, 'gi');
      let propMatch: RegExpExecArray | null;

      while ((propMatch = propRegex.exec(declarations)) !== null) {
        const value = propMatch[1].trim();
        // Check if value contains a color
        if (hasColorValue(value)) {
          decls.push({
            selector,
            property: prop,
            value,
            specificity: calculateSpecificity(selector),
          });
        }
      }
    }
  }

  return decls;
}

function hasColorValue(value: string): boolean {
  return /(?:#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|oklch\(|var\(--)/i.test(value);
}

function calculateSpecificity(selector: string): number {
  const ids = (selector.match(/#/g) || []).length;
  const classes = (selector.match(/\./g) || []).length;
  const tags = selector.split(/[\s>+~]/).filter(Boolean).length;
  return ids * 100 + classes * 10 + tags;
}

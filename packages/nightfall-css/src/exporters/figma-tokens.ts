/**
 * Export as Figma Tokens plugin format.
 */

import type { TransformResult } from '../core/transformer.js';

export function exportFigmaTokens(result: TransformResult): string {
  const themeName = result.direction === 'light-to-dark' ? 'dark' : 'light';

  const tokens: Record<string, any> = {
    [themeName]: {},
  };

  const theme = tokens[themeName];

  for (const token of result.tokens) {
    const [group, name] = token.role.split('.');

    if (!theme[group]) theme[group] = {};

    theme[group][name] = {
      value: token.transformed,
      type: 'color',
      description: `${token.role}`,
    };
  }

  if (result.shadows) {
    theme.shadow = theme.shadow || {};
    for (const shadow of result.shadows) {
      const name = shadow.name.replace('shadow-', '');
      theme.shadow[name] = {
        value: shadow.value,
        type: 'boxShadow',
      };
    }
  }

  return JSON.stringify(tokens, null, 2);
}

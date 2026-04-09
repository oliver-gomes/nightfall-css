/**
 * Export as Style Dictionary format.
 */

import type { TransformResult } from '../core/transformer.js';

export function exportStyleDictionary(result: TransformResult): string {
  const tokens: Record<string, any> = {
    color: {},
  };

  for (const token of result.tokens) {
    const [group, name] = token.role.split('.');

    if (!tokens.color[group]) tokens.color[group] = {};

    tokens.color[group][name] = {
      value: token.transformed,
      original: { value: token.original },
      attributes: {
        category: 'color',
        type: group,
        item: name,
      },
      comment: `Nightfall: ${token.role} (${result.direction})`,
    };
  }

  if (result.shadows) {
    tokens.shadow = {};
    for (const shadow of result.shadows) {
      const name = shadow.name.replace('shadow-', '');
      tokens.shadow[name] = {
        value: shadow.value,
        attributes: { category: 'shadow', type: name },
      };
    }
  }

  return JSON.stringify(tokens, null, 2);
}

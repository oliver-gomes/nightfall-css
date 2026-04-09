/**
 * Semantic token mapper — maps raw colors to role-based design tokens.
 */

import type { ClassifiedColor, ColorRole } from './classifier.js';
import type { TransformedToken } from './transformer.js';

export interface SemanticToken {
  name: string;
  cssVariable: string;
  value: string;
  role: ColorRole;
}

/**
 * Map classified colors to semantic CSS variable names.
 */
export function toSemanticTokens(colors: ClassifiedColor[]): SemanticToken[] {
  return colors.map((c) => ({
    name: roleToName(c.role),
    cssVariable: roleToCssVar(c.role),
    value: c.value,
    role: c.role,
  }));
}

/**
 * Map transformed tokens to semantic CSS variable names.
 */
export function transformedToSemanticTokens(tokens: TransformedToken[]): SemanticToken[] {
  return tokens.map((t) => ({
    name: roleToName(t.role),
    cssVariable: roleToCssVar(t.role),
    value: t.transformed,
    role: t.role,
  }));
}

function roleToName(role: ColorRole): string {
  return role.replace('.', '-');
}

function roleToCssVar(role: ColorRole): string {
  return `--color-${role.replace('.', '-')}`;
}

/**
 * Get all standard semantic token names.
 */
export function getStandardTokenNames(): Array<{ role: ColorRole; cssVar: string; description: string }> {
  return [
    { role: 'background.page', cssVar: '--color-bg-page', description: 'Page background' },
    { role: 'background.surface', cssVar: '--color-bg-surface', description: 'Card/panel surface' },
    { role: 'background.elevated', cssVar: '--color-bg-elevated', description: 'Popover/dropdown/tooltip' },
    { role: 'text.primary', cssVar: '--color-text-primary', description: 'Main body text' },
    { role: 'text.secondary', cssVar: '--color-text-secondary', description: 'Muted/supporting text' },
    { role: 'text.tertiary', cssVar: '--color-text-tertiary', description: 'Placeholder/hint text' },
    { role: 'text.inverse', cssVar: '--color-text-inverse', description: 'Text on colored backgrounds' },
    { role: 'border.default', cssVar: '--color-border-default', description: 'Standard borders' },
    { role: 'border.subtle', cssVar: '--color-border-subtle', description: 'Hairline/divider borders' },
    { role: 'brand.primary', cssVar: '--color-brand-primary', description: 'Primary brand color' },
    { role: 'brand.secondary', cssVar: '--color-brand-secondary', description: 'Secondary brand color' },
    { role: 'accent.link', cssVar: '--color-accent-link', description: 'Link color' },
    { role: 'accent.focus', cssVar: '--color-accent-focus', description: 'Focus ring color' },
    { role: 'status.success', cssVar: '--color-status-success', description: 'Success green' },
    { role: 'status.warning', cssVar: '--color-status-warning', description: 'Warning amber' },
    { role: 'status.error', cssVar: '--color-status-error', description: 'Error red' },
    { role: 'status.info', cssVar: '--color-status-info', description: 'Info blue' },
    { role: 'shadow.default', cssVar: '--color-shadow-default', description: 'Default shadow color' },
    { role: 'shadow.strong', cssVar: '--color-shadow-strong', description: 'Strong shadow color' },
    { role: 'overlay.backdrop', cssVar: '--color-overlay-backdrop', description: 'Modal/backdrop overlay' },
  ];
}

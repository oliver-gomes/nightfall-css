/**
 * Component analyzer — groups colors by component context.
 */

import type { ExtractedElement } from './dom-walker.js';

export interface ComponentGroup {
  name: string;
  selector: string;
  colors: {
    background: string[];
    text: string[];
    border: string[];
    shadow: string[];
  };
  childCount: number;
}

/**
 * Group extracted elements into logical component groups.
 */
export function groupByComponent(elements: ExtractedElement[]): ComponentGroup[] {
  const groups: Map<string, ComponentGroup> = new Map();

  // Identify component-like elements (elements with significant children)
  const componentElements = elements.filter(
    (el) => el.children > 0 && el.depth < 6 && el.isVisible
  );

  for (const el of componentElements) {
    // Use a simplified selector as group key
    const groupKey = simplifySelector(el.selector);
    const existing = groups.get(groupKey);

    if (existing) {
      addColors(existing, el);
    } else {
      const group: ComponentGroup = {
        name: inferComponentName(el),
        selector: el.selector,
        colors: { background: [], text: [], border: [], shadow: [] },
        childCount: el.children,
      };
      addColors(group, el);
      groups.set(groupKey, group);
    }
  }

  return Array.from(groups.values()).filter(
    (g) => g.colors.background.length > 0 || g.colors.text.length > 0
  );
}

function addColors(group: ComponentGroup, el: ExtractedElement): void {
  const { styles } = el;

  if (styles.backgroundColor && !isTransparent(styles.backgroundColor)) {
    group.colors.background.push(styles.backgroundColor);
  }
  if (styles.color && !isTransparent(styles.color)) {
    group.colors.text.push(styles.color);
  }
  if (styles.borderColor && !isTransparent(styles.borderColor)) {
    group.colors.border.push(styles.borderColor);
  }
  if (styles.boxShadow && styles.boxShadow !== 'none') {
    group.colors.shadow.push(styles.boxShadow);
  }
}

function isTransparent(color: string): boolean {
  return (
    color === 'transparent' ||
    color === 'rgba(0, 0, 0, 0)' ||
    color === 'rgba(0,0,0,0)'
  );
}

function simplifySelector(selector: string): string {
  // Take the last 2 segments
  const parts = selector.split(' > ');
  return parts.slice(-2).join(' > ');
}

function inferComponentName(el: ExtractedElement): string {
  const { tag, selector } = el;

  // Try to infer a meaningful name from classes
  const classMatch = selector.match(/\.([a-zA-Z][\w-]*)/);
  if (classMatch) {
    return classMatch[1].replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Common semantic elements
  const semanticNames: Record<string, string> = {
    nav: 'Navigation',
    header: 'Header',
    footer: 'Footer',
    main: 'Main Content',
    aside: 'Sidebar',
    section: 'Section',
    article: 'Article',
    form: 'Form',
    button: 'Button',
    table: 'Table',
  };

  return semanticNames[tag] || tag.toUpperCase();
}

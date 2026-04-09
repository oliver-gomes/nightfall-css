/**
 * Vanilla JS theme toggle — no framework dependency.
 */

import { STORAGE_KEY } from './script.js';

export interface ToggleOptions {
  storageKey?: string;
  attribute?: string;
  onChange?: (theme: 'light' | 'dark') => void;
}

/**
 * Create a theme toggle that switches between light and dark.
 */
export function createToggle(options: ToggleOptions = {}) {
  const {
    storageKey = STORAGE_KEY,
    attribute = 'data-theme',
    onChange,
  } = options;

  function getTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme: 'light' | 'dark') {
    const root = document.documentElement;
    root.setAttribute(attribute, theme);
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    try {
      localStorage.setItem(storageKey, theme);
    } catch {}

    onChange?.(theme);
  }

  function toggle() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  return { getTheme, setTheme, toggle };
}

/**
 * Generate HTML for a sun/moon toggle button.
 */
export function getToggleHTML(): string {
  return `
<button
  type="button"
  class="nightfall-toggle"
  aria-label="Toggle theme"
  onclick="this.nightfallToggle?.()"
>
  <svg class="nightfall-toggle-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
  <svg class="nightfall-toggle-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>`;
}

/**
 * CSS for the toggle button.
 */
export function getToggleCSS(): string {
  return `
.nightfall-toggle {
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: background-color 0.2s;
}
.nightfall-toggle:hover {
  background: rgba(128, 128, 128, 0.1);
}
.nightfall-toggle-sun { display: none; }
.nightfall-toggle-moon { display: block; }
[data-theme="dark"] .nightfall-toggle-sun { display: block; }
[data-theme="dark"] .nightfall-toggle-moon { display: none; }
`;
}

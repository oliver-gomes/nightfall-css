/**
 * Inline FOUC (Flash of Unstyled Content) prevention script.
 * This should be injected into <head> as an inline script.
 * It reads the stored theme preference and applies it before the page renders.
 *
 * Total size: ~400 bytes minified.
 */

export const nightfallScript = `(function(){try{var t=localStorage.getItem('nightfall-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.add(t)}else if(!t||t==='system'){var m=window.matchMedia('(prefers-color-scheme:dark)').matches;var d=m?'dark':'light';document.documentElement.setAttribute('data-theme',d);document.documentElement.classList.add(d)}}catch(e){}})()`;

/**
 * Get the FOUC prevention script as a ready-to-use HTML script tag.
 */
export function getScriptTag(): string {
  return `<script>${nightfallScript}</script>`;
}

/**
 * Storage key used by the runtime.
 */
export const STORAGE_KEY = 'nightfall-theme';

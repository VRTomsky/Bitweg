// Lichtschalter oben rechts: hell <-> dunkel. Gilt sofort und wird gespeichert.
// (Im Profil gibt es zusaetzlich "Wie System".)

import { h } from '../util.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { applyTheme } from '../theme.js';

const SUN = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>';

const isDark = () => document.documentElement.dataset.theme === 'dark';

function paint(btn) {
  const dark = isDark();
  btn.setAttribute('aria-checked', String(dark));
  btn.title = dark ? t('Dunkel. Auf hell umschalten', 'Dark. Switch to light') : t('Hell. Auf dunkel umschalten', 'Light. Switch to dark');
  btn.querySelector('.theme-knob').innerHTML = dark ? MOON : SUN;
}

/** Alle Schalter auf der Seite auffrischen (z. B. wenn im Profil umgestellt wurde) */
export function refreshThemeToggles() {
  document.querySelectorAll('.theme-toggle').forEach(paint);
}

export function themeToggle(extraClass = '') {
  const btn = h('button', {
    type: 'button',
    role: 'switch',
    class: `theme-toggle ${extraClass}`.trim(),
    'aria-label': t('Dunkler Modus', 'Dark mode'),
    onclick: () => {
      const next = isDark() ? 'light' : 'dark';
      store.update(s => { s.settings.theme = next; });
      applyTheme();
      refreshThemeToggles();
    },
  }, h('span', { class: 'theme-knob' }));
  paint(btn);
  return btn;
}

// Steht im Profil "Wie System" und das System wechselt hell/dunkel: Schalter mitziehen
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => setTimeout(refreshThemeToggles, 0));

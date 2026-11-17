// Google und Apple: Logos und der Bereich "Anmelden mit" im Profil (Konto verbinden / trennen)

import { t } from '../i18n.js';
import { h, toast, confirmDialog } from '../util.js';
import { PROVIDERS, loginProviders, linkedProviders, linkProvider, unlinkProvider, germanError } from '../cloud.js';

export const GOOGLE_SVG = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
export const APPLE_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>';
export const PROVIDER_ICON = { google: GOOGLE_SVG, apple: APPLE_SVG };
export const PROVIDER_NAME = { google: 'Google', apple: 'Apple' };

/**
 * "Anmelden mit": Google/Apple zum Konto hinzufuegen oder wieder trennen.
 * beforeLeave: wird vor der Weiterleitung zu Google/Apple aufgerufen (z. B. offene Aenderungen speichern).
 * Zeigt sich nur, wenn mindestens ein Anbieter in Supabase eingeschaltet (oder schon verbunden) ist.
 */
export function connectedAccounts({ beforeLeave } = {}) {
  const box = h('div', { class: 'linked', hidden: true });

  async function paint() {
    let enabled;
    let mine;
    try {
      [enabled, mine] = await Promise.all([loginProviders(), linkedProviders()]);
    } catch (err) {
      console.warn('Bitweg: verbundene Konten nicht lesbar', err);
      return;
    }
    const shown = PROVIDERS.filter(p => enabled.includes(p) || mine.includes(p));
    if (!shown.length) { box.hidden = true; return; }
    box.replaceChildren(
      h('p', { class: 'eyebrow' }, t('Anmelden mit', 'Sign in with')),
      h('ul', { class: 'linked-list' }, shown.map(p => row(p, mine))),
      h('p', { class: 'muted linked-note' }, t('Verbunden heißt: Du kannst dich auch mit diesem Konto einloggen. Andere sehen das nicht.', 'Connected means: you can also log in with this account. Others don\'t see this.')));
    box.hidden = false;
  }

  function row(p, mine) {
    const on = mine.includes(p);
    const name = PROVIDER_NAME[p];
    let btn = null;
    if (!on) {
      btn = h('button', {
        type: 'button', class: 'btn btn-small btn-sky',
        onclick: async () => {
          btn.disabled = true;
          btn.textContent = t('Einen Moment ...', 'One moment ...');
          try {
            if (beforeLeave) await beforeLeave();
            const inPage = await linkProvider(p);
            if (inPage) { toast(t(`${name} ist jetzt verbunden`, `${name} is now connected`)); paint(); }
            // sonst: Browser geht gerade zu Google bzw. Apple und kommt danach zurueck
          } catch (err) {
            toast(t('Verbinden hat nicht geklappt', 'Connecting didn\'t work'), germanError(err));
            btn.disabled = false;
            btn.textContent = t('Verbinden', 'Connect');
          }
        },
      }, t('Verbinden', 'Connect'));
    } else if (mine.length >= 2) {
      // Trennen nur, wenn danach noch eine andere Anmeldung bleibt
      btn = h('button', {
        type: 'button', class: 'btn btn-small btn-ghost',
        onclick: async () => {
          if (!(await confirmDialog({ title: t(`${name} trennen?`, `Disconnect ${name}?`), text: t(`Danach kannst du dich nicht mehr mit ${name} einloggen. Dein Konto, Fortschritt und deine Freunde bleiben.`, `After that you can no longer log in with ${name}. Your account, progress and friends stay.`), ok: t('Trennen', 'Disconnect') }))) return;
          btn.disabled = true;
          try {
            await unlinkProvider(p);
            toast(t(`${name} getrennt`, `${name} disconnected`));
            paint();
          } catch (err) {
            toast(t('Trennen hat nicht geklappt', 'Disconnecting didn\'t work'), germanError(err));
            btn.disabled = false;
          }
        },
      }, t('Trennen', 'Disconnect'));
    }
    return h('li', { class: 'linked-row' },
      h('span', { class: `linked-icon is-${p}`, html: PROVIDER_ICON[p] }),
      h('span', { class: 'linked-name' }, h('b', {}, name), h('small', { class: on ? 'is-on' : 'muted' }, on ? t('Verbunden', 'Connected') : t('Nicht verbunden', 'Not connected'))),
      btn);
  }

  paint();
  return box;
}

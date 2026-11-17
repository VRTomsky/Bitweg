// Kleines rotes "Admin" neben dem Namen des Bitweg-Admins (supabase/07-admin-abzeichen.sql).
// Steht immer im Dokument, wird aber erst sichtbar, sobald die Admin-Liste geladen ist.

import { t } from '../i18n.js';
import { h } from '../util.js';
import { isAdminId, onAdminIds, loadAdminIds, currentUser } from '../cloud.js';

/** userId: Konto-ID, oder 'me' fuer das eigene Profil (auch wenn das Login noch laedt) */
export function adminBadge(userId) {
  if (!userId) return null;
  const id = () => (userId === 'me' ? currentUser()?.id : userId);
  return h('span', {
    class: 'admin-badge', 'data-admin-uid': userId, hidden: !isAdminId(id()),
    title: t('Betreibt Bitweg', 'Runs Bitweg'),
  }, 'Admin');
}

// Sobald die Liste da ist: alle Abzeichen auf der Seite richtig ein- bzw. ausblenden
onAdminIds(() => {
  document.querySelectorAll('[data-admin-uid]').forEach(el => {
    const uid = el.dataset.adminUid === 'me' ? currentUser()?.id : el.dataset.adminUid;
    el.hidden = !isAdminId(uid);
  });
});
loadAdminIds();

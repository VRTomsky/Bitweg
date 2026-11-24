// Kleine Landesflaggen als SVG (Emoji-Flaggen zeigt Windows nicht an).
// EN = Vereinigtes Koenigreich.

const DE = '<svg viewBox="0 0 5 3" aria-hidden="true"><rect width="5" height="3" fill="#FFCE00"/><rect width="5" height="2" fill="#DD0000"/><rect width="5" height="1" fill="#000"/></svg>';

const EN = '<svg viewBox="0 0 60 30" aria-hidden="true"><path d="M0 0h60v30H0z" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>';

const TR = '<svg viewBox="0 0 1200 800" aria-hidden="true"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="200" fill="#fff"/><circle cx="475" cy="400" r="160" fill="#E30A17"/><polygon fill="#fff" points="583.334,400 764.235,458.779 652.431,304.894 652.431,495.106 764.235,341.221"/></svg>';

const FLAGS = { de: DE, en: EN, tr: TR };

export function flag(lang) {
  return `<span class="flag">${FLAGS[lang] || DE}</span>`;
}

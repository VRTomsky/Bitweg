# Bitweg: Anleitung und Technik

Bitweg ist eine Lern-App für Python und C++ im Stil einer Sprachlern-App. Es gibt sie in zwei Versionen:

- **Online** unter https://bitweg.de/: im Browser, ohne Installation, Python läuft dort über Pyodide. Konto freiwillig.
- **Auf dem eigenen PC** (`start.bat`, `server.py`): mit deinem Python und einem echten C++-Compiler. Ohne Konto bleibt alles lokal, mit Konto kommt derselbe Fortschritt mit.

Die Abschnitte bis „Profil“ beschreiben vor allem die PC-Version, danach geht es um die Online-Version, Konten und die Technik.

> Zum Namen: Die App hieß früher **Laufzeit**. Dateien, Ordner und Speicher-Schlüssel (`Laufzeit.lnk`, `Laufzeit-Sicherungen`, `laufzeit.*`, Header `X-Laufzeit`) heißen absichtlich weiter so, damit kein Fortschritt verloren geht.

## Starten (PC-Version)

**Normalfall: nichts tun.** Der Server startet beim Anmelden an Windows automatisch und unsichtbar im Hintergrund. Du öffnest einfach im Browser **`http://127.0.0.1:5741`**, am schnellsten über die Verknüpfung **`Laufzeit`** auf dem Desktop.

- Autostart: Verknüpfung `Laufzeit.lnk` im Windows-Autostart-Ordner (`Win+R`, `shell:startup`). Sie startet `pythonw.exe server.py --no-browser`, also ohne Fenster. Löschst du die Verknüpfung, ist der Autostart aus.
- **`beenden.bat`** stoppt den Hintergrund-Server (nur Bitweg auf Port 5741, sonst nichts).
- **`start.bat`** startet ihn von Hand mit sichtbarem Fenster, z. B. nach `beenden.bat`. Läuft er schon, öffnet `start.bat` nur den Browser.
- Meldungen des Hintergrund-Servers landen in `server.log` (wird bei jedem Start neu angelegt).
- Wichtig: Dein Fortschritt hängt am Browser **und** an der Adresse. Nutz immer dieselbe, also `127.0.0.1:5741`. Unter `localhost:5741` sieht der Browser einen leeren Stand (dann über Profil → Sicherung wiederherstellen).

Beim allerersten Öffnen startet die **Einführung**: Bit fragt, welche Sprache du lernen willst, warum, wie alt du bist, ob du schon programmiert hast, wie viel du kannst, wie viel Zeit du pro Tag hast und ob alles installiert ist. Bei Sprachen, Zielen und Vorkenntnissen sind mehrere Antworten möglich. Wählst du beide Sprachen, fragt Bit für jede einzeln nach Wissensstand und Startpunkt. Deine Ziele markieren später passende Abschnitte im Lernpfad („Wichtig für: …“), zeigen oben deinen nächsten Meilenstein und klappen in der Werkstatt die passenden Anleitungen auf. Ändern kannst du sie im Profil unter „Über dich“. Danach wählst du: von vorne anfangen oder **Einstufungstest** (bis zu 10 Fragen, nach zwei Fehlern ist Schluss, bestandene Abschnitte werden übersprungen).

Kurs wechseln oder den zweiten Kurs hinzufügen: oben rechts auf das Kurs-Symbol (Python- oder C++-Logo) klicken. Daneben sitzen der **Hell/Dunkel-Schalter** (Sonne/Mond) und die **Sprachwahl** mit Landesflagge (Deutsch/English). Am Handy und in schmalen Fenstern ist das alles in der Kopfzeile.

Beim ersten Start sucht der Server einige Sekunden nach dem C++-Compiler. In der **Werkstatt** siehst du, was gefunden wurde.

## Was wo ist

| Bereich | Wofür |
|---|---|
| Lernen | Lernpfad mit Abschnitten, Lektionen und Abschnittstest (Pokal). Kurs wechseln über das Kurs-Menü. „Leitfaden“ im Banner zeigt alle Erklärungen eines Abschnitts |
| Training | Wiederholt Übungen aus fertigen Lektionen. Fehler kommen öfter dran |
| Projekte | Echte Programme in Etappen und freie Aufgaben ohne Vorlage, geprüft mit mehreren Testfällen |
| Labor | Freier Editor, führt beliebigen Code aus, mit Eingaben |
| Werkstatt | Systemcheck und Anleitungen: VS Code, Python, Compiler, Raylib, Unreal |
| Freunde | Freunde suchen und hinzufügen, Chat, Gruppen, Anfeuern, Wochen-Rangliste (nur mit Konto) |
| Profil | Stufe, Verlauf, Abzeichen, Hell/Dunkel/Wie System, Tagesziel, Sicherung, Konto |

Rechts (bzw. oben am Handy): Serie, XP, drei Tagesaufgaben, Stufe und nächstes Abzeichen.

Tastatur in Lektionen: `Enter` prüft und geht weiter, `1` bis `4` wählt bei Multiple Choice, `Strg+Enter` führt im Editor den Code aus, `Tab` rückt ein.

## Wie dein Code geprüft wird

- **Python** läuft auf dem PC mit deinem installierten Python, online mit Pyodide (CPython 3.12 im Browser).
- **C++** wird auf dem PC mit einem echten Compiler übersetzt und als `.exe` gestartet: `g++` bzw. `clang++`, falls vorhanden, sonst der Visual-Studio-Compiler `cl.exe` (Standard C++20). Online gibt es keinen Compiler, dort prüft Bitweg nur die Regeln der Aufgabe („Angenommen, aber ungeprüft“).
- Jede Aufgabe prüft erst Regeln (z. B. „nutze eine Schleife“), dann die echte Ausgabe.
- **Kleine Tippfehler im Ausgabetext zählen als richtig** (z. B. `ZieL` statt `Ziel`, `Gegnr` statt `Gegner`, ein Leerzeichen zu viel). Die App sagt dann „Richtig, mit kleinem Tippfehler“ und zeigt, was abweicht. Streng bleibt sie bei Zahlen, Satzzeichen, Zeilen, bei `True`/`False`/`None`, Typnamen wie `int` und in Aufgaben, in denen Groß-/Kleinschreibung das Thema ist (`upper()`, `lower()`, `toupper`). Pro Wort ist ein Buchstabe Abweichung erlaubt (Wörter ab 4 Buchstaben), insgesamt höchstens zwei. Logik in `app/js/tolerance.js`.
- Fehlermeldungen werden in verständliche Hinweise übersetzt (`app/js/hints.js`), die Fehlerzeile wird im Editor markiert.
- Programme werden nach 5 Sekunden gestoppt. So hängt nichts bei Endlosschleifen.

Raylib-, pygame- und Unreal-Code öffnet Fenster oder braucht ein Unreal-Projekt. Diese Aufgaben werden über Regeln geprüft, nicht ausgeführt. Ausprobieren kannst du sie in VS Code bzw. Unreal, siehe Werkstatt.

## Sicherheit

Der Server ist nur über `127.0.0.1` erreichbar, also nur von deinem PC. Andere Webseiten im Browser können keinen Code ausführen lassen: Der Server verlangt einen eigenen Header und prüft Herkunft und Host. Er führt aber den Code aus, den **du** eintippst, mit deinen Rechten. Lass das Fenster also nicht laufen, wenn jemand anderes an deinem PC Code einfügt, den du nicht kennst.

## Abwechslung und Gold

- **Wiederholen** einer Lektion: keine Erklärkarten mehr, gut die Hälfte der Aufgaben ist neu erzeugt (andere Zahlen, Namen, Grenzen). Dazu kommen Wiederholungs-Aufgaben aus früheren Abschnitten.
- **Gold holen** (im Popover einer geschafften Lektion): schwere neue Aufgaben, höchstens 1 Fehler. Die Lektion bekommt eine Krone.
- **Abschnittstest**: überwiegend neue Aufgaben, die so in den Lektionen nicht vorkamen.
- **Gold-Prüfung** (am Pokal, sobald alle Lektionen des Abschnitts Gold sind): 12 schwere Aufgaben, höchstens 2 Fehler. Danach wird der ganze Abschnitt golden.
- Das **Training** mischt Fehler von früher mit neuen Varianten.

Der Generator steckt in `app/js/content/generators.js` (Englisch: `content/en/generators.js`). Jede Variante wurde automatisch mit echtem Python und C++ gegengeprüft.

**Geprüft im November 2026:** Alle 204 Lektionen (Deutsch und Englisch) und 3312 Zufallsaufgaben wurden automatisch durchgerechnet (3869 Musterlösungen mit CPython und g++), dazu beide Kurse komplett im Browser durchgespielt.

## Fortschritt und Sicherung

Alles liegt im `localStorage` des Browsers. In der PC-Version sichert Bitweg zusätzlich **automatisch auf deinen Desktop**, in den Ordner `Laufzeit-Sicherungen`:

- nach dem Lernen (frühestens 20 Sekunden nach der letzten Änderung, höchstens alle 5 Minuten)
- beim Schließen oder Minimieren der Seite
- einmal am Tag beim Start

Pro Tag gibt es eine Datei, die letzten 14 bleiben erhalten. Wäre die neue Sicherung kleiner als die heutige (z. B. nach „Alles zurücksetzen“), bleibt die alte als `...-vorher-...` erhalten. Unter **Profil, Sicherung auf dem Desktop** siehst du alle Sicherungen, kannst jede laden oder das automatische Sichern abschalten. Ist der Browser-Speicher einmal leer, bietet die Einführung direkt „Fortschritt vom Desktop laden“ an.

## Profil

Unter **Profil, Profil bearbeiten** stellst du Name, Benutzername, „Über mich“, Profilbild und Titelbild ein. Nach dem Hochladen öffnet sich ein Zuschneide-Fenster: Bild ziehen, mit Regler oder Mausrad zoomen (Tastatur: Pfeiltasten und Plus/Minus), „Übernehmen“. Bilder lassen sich auch mit Strg+V einfügen.

Mit Konto zusätzlich:
- **Anmelden mit:** Google (bzw. Apple) mit einem bestehenden E-Mail-Konto **verbinden** oder wieder trennen.
- **Profil → Konto:** Passwort ändern oder (bei reinen Google-Konten) festlegen, E-Mail ändern, blockierte Nutzer, ausloggen, Konto löschen.
- Neben dem Namen von Admins steht ein rotes **ADMIN**.

## Online-Version, Konten und Freunde

- **Online:** https://bitweg.de/ (GitHub-Repo `VRTomsky/Bitweg`). Jeder Push auf `main` veröffentlicht `app/` neu, über `.github/workflows/pages.yml`. Der Job schreibt dabei die Version in den Service Worker, versucht es bei einer GitHub-Störung nach 30 Sekunden ein zweites Mal und meldet die Seiten danach per IndexNow an Bing & Co.
- **Weitere GitHub-Jobs:** `.github/workflows/supabase-wach.yml` fragt zweimal täglich die Datenbank, damit Supabase das Gratis-Projekt nicht schlafen legt.
- **Name:** Seit November 2026 heißt die App **Bitweg** (laufzeit.de war vergeben). Alte technische Namen siehe oben.
- **Handy:** Die Seite ist eine PWA (`manifest.webmanifest`, `sw.js`, Icons in `img/`). In Chrome: Menü → „App installieren“. Unten erscheint eine Leiste mit allen Bereichen.
- **Offline-Speicher (`sw.js`):** Online kommen JS, CSS, Schriften und Bilder aus dem Speicher des Browsers, nur die Seite selbst wird jedes Mal neu geholt. Ein Neuladen schickt so 2 statt über 80 Anfragen. Das ist wichtig, weil GitHub Pages pro Internet-Adresse drosselt („Rate limit exceeded“) und sich in der Schule alle eine Adresse teilen. Jede Veröffentlichung bekommt einen neuen Speicher; kurz nach dem Öffnen lädt die App dann einmal neu. Lokal (`server.py`) wird immer frisch geladen.
- **Gruppenchats:** `views/groups.js`, Datenbank `supabase/03-gruppen.sql`. Chat-Fenster für Freunde und Gruppen teilen sich `views/chatbox.js` (Scrollen, Anhänge, Bildvorschau mit Zoom: Mausrad zur Mausposition, ziehen, Doppelklick, auf dem Handy zwei Finger).
- Woran die App merkt, dass sie online läuft: Adresse ist nicht `127.0.0.1`/`localhost` (`app/js/env.js`). Zum Testen lokal `?web` an die Adresse hängen.
- **Python online:** Pyodide (echtes CPython 3.12 als WebAssembly) in einem Web Worker (`pyworker.js`, `webpython.js`). Endlosschleifen: Worker wird nach 5 Sekunden beendet und neu gestartet. Beim ersten Mal lädt es etwa 10 MB.
- **C++ online:** kein Compiler. Aufgaben werden über die Regeln geprüft („Angenommen, aber ungeprüft“). In der Werkstatt steht, wie man die PC-Version herunterlädt.
- **Konten:** Supabase, eingerichtet laut `EINRICHTEN.md`. Zugangsdaten in `app/js/config.js`. Sind sie leer, bleibt alles lokal wie vorher.
  - `cloud.js`: Login, Speichern im Konto, Freunde, Nachrichten, Anfeuern.
  - `views/account.js`: Seiten Login, Registrieren (auch mit Google/Apple), Benutzername wählen, Passwort.
  - `views/friends.js`: Freunde, fremde Profile, Chat. `views/groups.js`: Gruppen.
  - `views/providers.js`: Google/Apple verbinden und trennen. `views/adminbadge.js`: rotes ADMIN.
  - `supabase/*.sql`: Tabellen und Zugriffsregeln, Reihenfolge siehe `EINRICHTEN.md`.
- **Google und Apple:** Die Knöpfe erscheinen nur, wenn der Anbieter in Supabase eingeschaltet ist (die App fragt `/auth/v1/settings`). Nach der Rückkehr landet man auf `#/konto/weiter`. Neue Konten bekommen von der Datenbank einen freien Benutzernamen (`05-google-apple.sql`) und bestätigen oder ändern ihn einmal. Ohne Passwort zeigt das Profil „Passwort festlegen“ statt „Passwort ändern“.
- **Speichern im Konto:** 4 Sekunden nach jeder Änderung und beim Schließen. Beim Einloggen gewinnt der Stand mit mehr XP. Wenn beide Fortschritt haben, fragt die App nach. Der Stand eines anderen Kontos auf demselben Gerät wird nie übernommen. Beim Ausloggen wird der Browser geleert.
- **Was Freunde sehen:** Name, Benutzername, Bilder, Bio, XP, Serie, Kurs, Abschnitt, Lektionen, Gold und die Lerntage der letzten 60 Tage. Daraus berechnet die App die gemeinsame Serie.
- **Schutz:**
  - Nachrichten und Anfeuern gehen nur unter Freunden.
  - Maximal 20 Nachrichten pro Minute, dieselbe Anfeuer-Art einmal pro Stunde.
  - Blockieren beendet die Freundschaft und macht sich gegenseitig unsichtbar.
  - Meldungen landen in der Tabelle `reports`.
  - Eigene Nachrichten, Bilder und Dateien kann jeder löschen (für alle). Der Admin (Tabelle `app_admins`, nur über den SQL Editor) kann seine Chats mit einer Person komplett leeren.
- **Testen ohne Supabase:** `?web&mock` an die Adresse hängen. Dann läuft eine Attrappe mit erfundenen Test-Nutzern (`cloud-mock.js`) nur im Browser. Konten mit „admin“ im Benutzernamen sind dort Admin.

## Rechtliches, Google und KI-Assistenten

- `app/datenschutz.html`, `app/impressum.html`, `app/ueber.html` (auch für Lehrkräfte): statische Seiten mit `css/legal.css`, verlinkt von Startseite, Login und Profil.
- **Suchmaschinen:** `index.html` hat Titel, Beschreibung, Open-Graph-Vorschaubild (`img/og-image.png`), strukturierte Daten (JSON-LD) und einen Infotext für Crawler ohne JavaScript (für Besucher unsichtbar). Dazu `robots.txt`, `sitemap.xml` und die Google-Search-Console-Bestätigung.
- **KI-Assistenten:** `llms.txt` beschreibt Bitweg kurz in Textform.
- Suchmaschinen- und KI-Crawler bekommen immer die deutsche Fassung (`app/js/i18n.js`).

## Neue Lektionen hinzufügen

Inhalte stehen in `app/js/content/`: Abschnitt 1 bis 4 in `python.js` und `cpp.js`, die übrigen in `python-5-8.js`, `python-9-11.js`, `python-12-15.js`, `cpp-5-8.js`, `cpp-9-11.js`, `cpp-12-14.js` und `cpp-15-19.js`. Die englische Fassung liegt mit denselben IDs in `content/en/`, Projekte und freie Aufgaben in `content/projects/` (bzw. `projects/en/`). Neue Lektionen immer auf Deutsch **und** Englisch anlegen. Eine Lektion ist ein Objekt mit `id`, `title`, `goal` und `steps`. Die Übungstypen sind in `app/js/content/helpers.js` beschrieben. Beispiel:

```js
{
  id: 'py5-1',
  title: 'Listen',
  goal: 'Mehrere Werte in einer Variable speichern.',
  steps: [
    concept('Eine Liste', 'Eine **Liste** speichert mehrere Werte ...', { code: 'items = ["Schwert", "Schild"]' }),
    predict('Was wird ausgegeben?', 'items = ["a", "b"]\nprint(items[0])', 'a'),
    write('Gib das letzte Element aus.', 'items = [1, 2, 3]\n', { expect: '3', solution: 'items = [1, 2, 3]\nprint(items[-1])' }),
  ],
},
```

Neuer Abschnitt: ein weiteres Objekt in `units`. Der Lernpfad, das Freischalten, XP und das Training passen sich automatisch an.

## Aufbau

```
Bitweg/
  start.bat, beenden.bat   PC-Version starten und stoppen
  server.py                Lokaler Server: liefert app/ aus, fuehrt Python und C++ aus (nur 127.0.0.1)
  supabase/                Datenbank: schema.sql, dann 02 bis 08 (siehe EINRICHTEN.md)
  .github/workflows/       pages.yml (veroeffentlichen), supabase-wach.yml (Datenbank wach halten)
  app/                     Die Webseite (wird so veroeffentlicht, kein Build-Schritt)
    index.html             Rahmen der App, Suchmaschinen-Infos
    ueber.html, datenschutz.html, impressum.html
    robots.txt, sitemap.xml, llms.txt
    sw.js                  Offline-Speicher (Service Worker)
    manifest.webmanifest   App-Installation am Handy
    fonts/                 Schriften, selbst gehostet
    img/                   Icons, Logos, Vorschaubild
    css/                   tokens (Farben, Designsystem), app, lesson, onboarding, projects, social, legal
    js/main.js             Router (#/pfad, #/lektion/..., #/konto ...)
    js/store.js            Lernstand im Browser
    js/i18n.js             Deutsch/Englisch: t('Deutsch', 'English')
    js/cloud.js            Konto, Freunde, Chat, Gruppen (Supabase); cloud-mock.js = Test-Attrappe
    js/gamification.js     XP, Stufen, Serie, Abzeichen
    js/runner.js           Code ausfuehren und pruefen (pyworker.js/webpython.js = Python im Browser)
    js/tolerance.js        Nachsicht bei kleinen Tippfehlern
    js/hints.js            Fehlermeldungen verstaendlich
    js/editor.js, highlight.js   Code-Editor und Syntax-Farben
    js/mascot.js           Die Figur Bit (SVG)
    js/flags.js            Landesflaggen fuer die Sprachwahl
    js/content/            Kurse, Lektionen, Generatoren (102 Lektionen, DE in content/, EN in content/en/)
    js/views/              Seiten: Lernpfad, Lektion, Training, Projekte, Labor, Werkstatt, Profil,
                           Freunde, Gruppen, Konto, Einfuehrung, Hell/Dunkel-Schalter, Sprachwahl
```

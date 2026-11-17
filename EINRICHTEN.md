# Konten einrichten (einmalig, ca. 10 Minuten)

Damit Registrieren, Freunde und Nachrichten funktionieren, braucht Bitweg eine Datenbank. Dafür nutzen wir **Supabase** (kostenlos für kleine Projekte).

## 1. Supabase-Konto und Projekt

1. Geh auf **https://supabase.com** und klick **Start your project**.
2. **Continue with GitHub** (mit deinem GitHub-Konto VRTomsky).
3. **New project**:
   - Name: `laufzeit`
   - Database Password: auf **Generate a password** klicken. Das Passwort brauchst du für Bitweg nicht, gib es niemandem.
   - Region: **Central EU (Frankfurt)**
   - Plan: **Free**
4. **Create new project**, dann 1 bis 2 Minuten warten.

## 2. Datenbank anlegen

1. Links **SQL Editor** öffnen, **New query**.
2. Den kompletten Inhalt der Datei `supabase/schema.sql` hineinkopieren.
3. **Run** klicken. Unten muss stehen: *Success. No rows returned*.

## 3. Anmeldung einstellen

1. Links **Authentication**, dann **Sign In / Providers**, dann **Email**:
   - **Enable Email provider**: an
   - **Confirm email**: **aus** (empfohlen)
   - Speichern.

   Warum aus? Supabase schickt kostenlos nur sehr wenige E-Mails pro Stunde. Mit „aus“ funktioniert die Registrierung sofort, ohne Bestätigungsmail. „Passwort vergessen“ schickt trotzdem eine E-Mail.
2. **Authentication**, dann **URL Configuration**:
   - **Site URL**: `https://bitweg.de/`
   - **Redirect URLs** hinzufügen:
     - `https://bitweg.de/`
     - `http://127.0.0.1:5741/`

## 4. Zugangsdaten an Claude geben

1. Links **Project Settings** (Zahnrad), dann **API Keys** bzw. **Data API**.
2. Diese zwei Werte kopieren:
   - **Project URL**, sieht aus wie `https://abcdefgh.supabase.co`
   - **anon public** Key (unter „Legacy API Keys“) oder **Publishable key** (`sb_publishable_...`)
3. Beide Claude schicken. Die trägt Claude in `app/js/config.js` ein.

**Niemals** den Key **service_role** oder **secret** weitergeben oder irgendwo eintragen. Der hat alle Rechte. Der „anon“- bzw. „publishable“-Key ist dagegen für Webseiten gedacht und darf öffentlich sein. Was er darf, regeln die Zugriffsregeln aus `schema.sql`.

## 5. Bilder und Dateien im Chat (Erweiterung)

1. **SQL Editor**, **New query**.
2. Inhalt von `supabase/02-anhaenge.sql` einfügen, **Run**.
3. Fertig. Der private Speicher „chat“ wird dabei automatisch angelegt (max. 5 MB pro Datei, nur Bilder, PDF, Text, ZIP). Dateien sehen nur Absender und Empfänger.

## 6. Gruppenchats (Erweiterung)

Erst nach Schritt 5 ausführen, die Gruppen nutzen denselben Speicher.

1. **SQL Editor**, **New query**.
2. Inhalt von `supabase/03-gruppen.sql` einfügen, **Run**.
3. Fertig. Unter **Freunde** erscheint oben „Gruppen“ mit dem Knopf „Neue Gruppe“. Regeln: nur eigene Freunde hinzufügen, höchstens 30 Mitglieder, lesen und schreiben nur Mitglieder. Wer eine Gruppe gründet, kann sie umbenennen und Mitglieder entfernen.

Solange 03 nicht ausgeführt ist, zeigt die App statt der Gruppen einen Hinweis. Der normale Chat läuft trotzdem.

## 7. Gruppenbild, Banner, Bio und Admins (Erweiterung)

Erst nach Schritt 6 ausführen.

1. **SQL Editor**, **New query**.
2. Inhalt von `supabase/04-gruppen-profil.sql` einfügen, **Run**.
3. Fertig. In einer Gruppe oben auf den Namen tippen: Wer die Gruppe gegründet hat, kann Mitglieder **zum Admin** machen. Gründer und Admins können Gruppenbild, Banner, Name und Bio ändern. Admins können normale Mitglieder entfernen, Admins entfernen kann nur der Gründer.

Ohne 04 laufen Gruppen weiter wie bisher, nur ohne Bild, Bio und Admins.

## 8. Anmelden mit Google und Apple (Erweiterung)

Danach gibt es auf Login- und Registrier-Seite die Knöpfe **Weiter mit Google** und **Weiter mit Apple**. Jeder Knopf erscheint von selbst, sobald der Anbieter in Supabase eingeschaltet ist. Du kannst also auch nur Google machen (kostenlos) und Apple später (kostet bei Apple 99 $ pro Jahr).

### 8a. Datenbank (einmal, für beide)

1. **SQL Editor**, **New query**.
2. Inhalt von `supabase/05-google-apple.sql` einfügen, **Run**.

Ohne diesen Schritt scheitert das erste Anmelden mit Google/Apple mit „Database error saving new user“, weil Google keinen Benutzernamen mitbringt. Jetzt denkt sich die Datenbank einen aus, und die App fragt danach einmal, ob man ihn behalten oder ändern will.

### 8b. Google

1. **https://console.cloud.google.com** öffnen, oben **Projekt auswählen**, **Neues Projekt**, Name `Bitweg`, **Erstellen**.
2. Menü, **APIs & Dienste** (bzw. **Google Auth Platform**), **OAuth-Zustimmungsbildschirm** bzw. **Branding**:
   - App-Name: `Bitweg`, Support-E-Mail: deine
   - Zielgruppe: **Extern**
   - Autorisierte Domains: `bitweg.de` und `supabase.co`
   - Datenzugriff/Bereiche: `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile` (das sind die Standardwerte)
   - Unter **Zielgruppe** auf **App veröffentlichen** klicken. Sonst können sich nur eingetragene Testnutzer anmelden.
3. **Clients** (bzw. **Anmeldedaten**), **Client erstellen** bzw. **OAuth-Client-ID**:
   - Anwendungstyp: **Webanwendung**, Name: `Bitweg`
   - Autorisierte JavaScript-Quellen: `https://bitweg.de`
   - Autorisierte Weiterleitungs-URIs: `https://jpqpkoihjjumncilonik.supabase.co/auth/v1/callback`
   - **Erstellen**. Jetzt werden **Client-ID** und **Clientschlüssel** angezeigt.
4. Supabase: **Authentication**, **Sign In / Providers**, **Google**:
   - **Enable Sign in with Google**: an
   - **Client IDs**: die Client-ID, **Client Secret**: den Clientschlüssel
   - **Save**.

Der Clientschlüssel kommt nur in Supabase, nicht in die App und nicht ins Repo.

### 8c. Apple

Braucht ein Konto im **Apple Developer Program** (https://developer.apple.com/programs, 99 $ pro Jahr).

1. **https://developer.apple.com/account**, **Certificates, IDs & Profiles**, **Identifiers**, **+**:
   - **App IDs**, Typ **App**, Description `Bitweg`, Bundle ID (Explicit) `de.bitweg.app`
   - Bei Capabilities **Sign in with Apple** anhaken, **Continue**, **Register**.
2. Wieder **Identifiers**, **+**, diesmal **Services IDs**:
   - Description `Bitweg Web`, Identifier `de.bitweg.web`, **Register**.
   - Den neuen Eintrag öffnen, **Sign in with Apple** anhaken, **Configure**:
     - Primary App ID: `de.bitweg.app`
     - Domains: `jpqpkoihjjumncilonik.supabase.co`
     - Return URLs: `https://jpqpkoihjjumncilonik.supabase.co/auth/v1/callback`
   - **Next**, **Done**, **Continue**, **Save**.
3. **Keys**, **+**: Name `Bitweg Login`, **Sign in with Apple** anhaken, **Configure**, App ID `de.bitweg.app` wählen, **Save**, **Continue**, **Register**.
   - **Download** lädt eine `.p8`-Datei. Das geht **nur einmal**, gut aufheben, niemandem geben.
   - Die **Key ID** notieren. Die **Team ID** steht oben rechts unter deinem Namen.
4. Supabase: **Authentication**, **Sign In / Providers**, **Apple**:
   - **Enable Sign in with Apple**: an
   - **Client IDs**: `de.bitweg.web`
   - **Secret Key**: Apple will hier keinen festen Schlüssel, sondern einen daraus erzeugten. Auf der Supabase-Seite zu Apple (Link „docs“ neben dem Feld, Abschnitt „Generate a client secret“) gibt es einen Generator: Team ID, Key ID, Services ID und den Inhalt der `.p8`-Datei eintragen, das Ergebnis hier einfügen.
   - **Save**.

**Wichtig:** Dieser erzeugte Schlüssel läuft nach höchstens **6 Monaten** ab. Dann geht „Weiter mit Apple“ nicht mehr, bis du Schritt 4 mit derselben `.p8`-Datei wiederholst. Am besten gleich einen Kalender-Eintrag machen.

### Gut zu wissen

- **Gleiche E-Mail = gleiches Konto.** Wer schon mit E-Mail und Passwort registriert ist und dann „Weiter mit Google“ mit derselben Adresse nimmt, landet im selben Konto.
- **Apple kann die E-Mail verstecken.** Dann bekommt Bitweg eine Adresse wie `abc123@privaterelay.appleid.com`. Das ist normal, die App braucht die echte Adresse nicht.
- **Google/Apple-Konten haben erst mal kein Passwort.** Unter **Profil → Konto** gibt es dafür „Passwort festlegen“. Danach geht auch der Login mit E-Mail und Passwort.
- **In WhatsApp, Instagram und TikTok** blockt Google die Anmeldung im eingebauten Browser. Die App zeigt dort einen Hinweis, die Seite erst im richtigen Browser zu öffnen.
- **Lokale Version** (`start.bat`): Die Knöpfe gibt es dort auch, weil `http://127.0.0.1:5741/` schon bei den Redirect URLs steht (Schritt 3).

## E-Mail und Passwort ändern

Geht in der App unter **Profil → Konto**, jeweils mit dem aktuellen Passwort. Bei einer neuen E-Mail schickt Supabase Bestätigungs-Links (meist an alte und neue Adresse). Wie viele Mails pro Stunde rausgehen, hängt am E-Mail-Versand: Mit dem eingebauten Supabase-Versand sind es nur wenige, mit eigenem SMTP (Authentication → Emails → SMTP Settings) deutlich mehr.

## Danach: Admin-Aufgaben

- **Meldungen ansehen:** Supabase, **Table Editor**, Tabelle `reports`. Dort steht, wer wen warum gemeldet hat.
- **Nutzer sperren oder löschen:** **Authentication**, **Users**, beim Nutzer auf die drei Punkte.
- **Passwort für jemanden zurücksetzen:** Bei **Authentication**, **Users** „Send password recovery“.

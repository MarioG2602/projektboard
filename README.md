# Projektboard

Eine lokale, plattformübergreifende erste Version zur Verwaltung von Projekten und Aufgaben.

## Start

`index.html` per Doppelklick in Edge, Chrome, Firefox oder Safari öffnen.

## Enthalten

- Mehrere Projekte
- Frei benennbare, verschiebbare und löschbare Spalten
- Drag-and-drop für Aufgaben und Spalten
- Frei sortierbare Aufgaben innerhalb und zwischen Spalten
- Filter nach Priorität, Label und Fälligkeit
- Cloud-synchronisierter Papierkorb für Aufgaben, Spalten und Projekte
- Sofort-Rückgängig per Button oder `Strg/Cmd + Z`
- Aufgaben mit Beschreibung, Priorität, Fälligkeit und Label
- Suche und Fortschrittsanzeige
- Automatische Speicherung im Browser
- JSON-Backup und Wiederherstellung
- Automatischer Cloud-Sync über Supabase
- Automatische lokale Sicherheitsstände und bis zu 20 Cloud-Sicherungsstände
- Datenprüfung und automatische Reparatur beschädigter oder älterer Datenstände

## Synchronisierung zwischen Windows und Mac

Führe zunächst den Inhalt von `SUPABASE_SETUP.sql` einmal im Supabase SQL Editor aus.
Führe das Skript nach Aktualisierungen erneut aus, damit neue Sicherheitsfunktionen und Datenbankspalten ergänzt werden.

Das aktuelle SQL-Skript erlaubt der App nur Lesezugriff auf die Haupttabelle. Schreibvorgänge laufen ausschließlich über eine geprüfte Datenbankfunktion mit Versionskontrolle und automatischer Cloud-Sicherung.

1. Öffne das Projektboard auf beiden Geräten.
2. Klicke auf **Anmelden / Konto erstellen**.
3. Erstelle einmal ein Konto und bestätige gegebenenfalls die E-Mail.
4. Melde dich auf beiden Geräten mit demselben Konto an.

Änderungen werden automatisch in Supabase gespeichert und etwa alle zehn Sekunden auf anderen geöffneten Geräten eingelesen. Lokal bleibt zusätzlich eine Offline-Kopie erhalten.

Wenn Windows und Mac denselben älteren Stand gleichzeitig ändern, stoppt die App vor dem Überschreiben und fordert zur Konfliktauflösung auf.

Während eine Suche oder ein Filter aktiv ist, wird Drag-and-drop bewusst deaktiviert, damit ausgeblendete Aufgaben nicht versehentlich umsortiert werden.

Gelöschte Elemente landen im Papierkorb und können wiederhergestellt werden. Nur das Leeren des Papierkorbs oder „Endgültig löschen“ entfernt Inhalte dauerhaft.

## Veröffentlichung und Installation

Die Veröffentlichung über GitHub Pages und die nötigen Supabase-Weiterleitungsadressen sind in `DEPLOYMENT.md` beschrieben. Über eine veröffentlichte HTTPS-Adresse lässt sich das Projektboard als PWA auf Windows, Mac, iPhone und iPad installieren.

## Technische Prüfung

Mit installiertem Node.js:

`node data-core.test.js`

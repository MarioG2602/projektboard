# Manueller Testplan Projektboard

## Vorbereitung

- `index.html` unter Windows und Mac jeweils in Chrome oder Edge öffnen.
- Für Sync-Tests auf beiden Geräten mit demselben OneDrive-Konto anmelden.
- Testdaten verwenden; vor dem Test bei Bedarf ein Backup exportieren.
- Ergebnis je Prüfschritt mit `OK` oder `FEHLER` und kurzer Notiz dokumentieren.

## Kernfunktionen

1. **Start und lokale Speicherung**
   - Board öffnen und prüfen, dass Projekte, Spalten und Aufgaben sichtbar sind.
   - Ein Projekt anlegen, umbenennen und zwischen Projekten wechseln.
   - Seite neu laden und Browser neu starten.
   - Erwartung: Alle Änderungen bleiben erhalten.

2. **Spalten**
   - Spalte anlegen, umbenennen, per Drag-and-drop verschieben und löschen.
   - Erwartung: Reihenfolge und Bezeichnungen stimmen; Löschen verhält sich nachvollziehbar und beschädigt keine anderen Daten.

3. **Aufgaben**
   - Aufgabe mit Titel, Beschreibung, Priorität, Fälligkeit und Label anlegen.
   - Aufgabe bearbeiten, zwischen Spalten verschieben und löschen.
   - Erwartung: Alle Felder und Positionen werden korrekt angezeigt und gespeichert.

4. **Aufgaben-Sortierung innerhalb und zwischen Spalten**
   - In einer Spalte mindestens drei eindeutig benannte Aufgaben anlegen und per Drag-and-drop an den Anfang, in die Mitte und ans Ende verschieben.
   - Seite neu laden und prüfen, dass die neue Reihenfolge erhalten bleibt.
   - Eine Aufgabe aus einer Spalte an den Anfang, in die Mitte und ans Ende einer anderen Spalte verschieben.
   - Eine Aufgabe in eine leere Spalte und anschließend zurück in die ursprüngliche Spalte verschieben.
   - Seite erneut laden und zwischen Projekten wechseln.
   - Erwartung: Jede Aufgabe erscheint genau einmal an der gewählten Position; Reihenfolgen und Spaltenzuordnung bleiben nach Neuladen und Projektwechsel erhalten.

5. **Filter nach Priorität, Label und Fälligkeit**
   - Aufgaben mit unterschiedlichen Prioritäten, Labels und Fälligkeiten anlegen, darunter mindestens eine Aufgabe ohne Label und eine ohne Fälligkeit.
   - Nacheinander nach jeder vorhandenen Priorität filtern.
   - Erwartung: Es erscheinen ausschließlich Aufgaben der gewählten Priorität; Aufgaben anderer Prioritäten werden ausgeblendet.
   - Nacheinander nach jedem vorhandenen Label filtern.
   - Erwartung: Es erscheinen ausschließlich Aufgaben mit dem gewählten Label; Aufgaben ohne Label oder mit anderen Labels werden ausgeblendet.
   - Fälligkeitsfilter mit überfälligen, heute fälligen, zukünftig fälligen und nicht terminierten Aufgaben prüfen.
   - Erwartung: Jeder Fälligkeitsfilter zeigt ausschließlich die fachlich passende Aufgabenmenge; Aufgaben ohne Fälligkeit werden nur angezeigt, wenn der gewählte Filter dies vorsieht.
   - Prioritäts-, Label- und Fälligkeitsfilter kombinieren.
   - Erwartung: Es erscheinen nur Aufgaben, die alle aktiven Filter erfüllen.
   - Bei aktiven Filtern eine sichtbare Aufgabe bearbeiten und zwischen Spalten verschieben.
   - Erwartung: Die Aufgabe bleibt nur sichtbar, solange sie alle aktiven Filter erfüllt; nicht passende Aufgaben und Daten werden nicht verändert.
   - Alle Filter zurücksetzen.
   - Erwartung: Sämtliche Aufgaben erscheinen wieder in ihrer gespeicherten Spalte und Reihenfolge.

6. **Suche und Fortschritt**
   - Nach einem eindeutigen Aufgabentitel oder Label suchen.
   - Aufgaben in verschiedene Spalten verschieben.
   - Erwartung: Suche zeigt nur passende Aufgaben; Fortschrittsanzeige aktualisiert sich korrekt.

7. **Backup und Wiederherstellung**
   - **Backup exportieren** klicken und erzeugte JSON-Datei prüfen.
   - Danach erkennbare Änderungen am Board vornehmen und das Backup über **Backup importieren** einlesen.
   - Erwartung: Der frühere Stand wird vollständig wiederhergestellt.
   - Eine ungültige JSON-Datei importieren.
   - Erwartung: Verständliche Fehlermeldung; aktueller Stand bleibt erhalten.

## Papierkorb, Rückgängig und Wiederherstellung

### Aufgaben

1. **Aufgabe löschen und sofort rückgängig machen**
   - Eine eindeutig benannte Aufgabe mit Beschreibung, Priorität, Fälligkeit und Label anlegen und ihre Spalte sowie Position merken.
   - Aufgabe löschen und unmittelbar die angebotene Aktion **Rückgängig** ausführen.
   - Erwartung: Die Aufgabe erscheint wieder genau einmal in ihrer ursprünglichen Spalte und möglichst an ihrer ursprünglichen Position; alle Felder bleiben unverändert; im Papierkorb verbleibt keine Kopie.
   - Aufgabe erneut löschen, das Zeitfenster für **Rückgängig** verstreichen lassen und danach versuchen, die Aktion auszuführen.
   - Erwartung: **Rückgängig** ist nach Ablauf des Zeitfensters nicht mehr verfügbar; die Aufgabe bleibt im Papierkorb.

2. **Aufgabe aus dem Papierkorb wiederherstellen**
   - Eine Aufgabe löschen, den Papierkorb öffnen und den Eintrag anhand seines Titels prüfen.
   - Erwartung: Der Papierkorb zeigt die gelöschte Aufgabe eindeutig und verändert keine anderen Aufgaben.
   - Die Aufgabe wiederherstellen, zwischen Projekten wechseln und die Seite neu laden.
   - Erwartung: Die Aufgabe erscheint genau einmal im ursprünglichen Projekt und möglichst in ihrer ursprünglichen Spalte und Position; alle Felder bleiben erhalten; der Eintrag ist aus dem Papierkorb entfernt.

3. **Aufgabe endgültig löschen**
   - Eine Aufgabe löschen und im Papierkorb **Endgültig löschen** wählen.
   - Eine eventuell angezeigte Sicherheitsabfrage zunächst abbrechen.
   - Erwartung: Die Aufgabe bleibt im Papierkorb und kann weiterhin wiederhergestellt werden.
   - **Endgültig löschen** erneut wählen und bestätigen; anschließend Seite neu laden.
   - Erwartung: Die Aufgabe ist weder im Board noch im Papierkorb vorhanden und kann nicht wiederhergestellt werden; andere Aufgaben bleiben unverändert.

### Spalten

1. **Spalte löschen und sofort rückgängig machen**
   - Eine eindeutig benannte Spalte mit mindestens zwei eindeutig benannten Aufgaben anlegen und ihre Position merken.
   - Spalte löschen und unmittelbar **Rückgängig** ausführen.
   - Erwartung: Die Spalte erscheint wieder genau einmal an ihrer ursprünglichen Position; sämtliche enthaltenen Aufgaben, deren Felder und Reihenfolge bleiben erhalten; im Papierkorb verbleibt keine Kopie.
   - Spalte erneut löschen und das Zeitfenster für **Rückgängig** verstreichen lassen.
   - Erwartung: Die Spalte und ihre Aufgaben sind nicht im Board sichtbar und bleiben gemeinsam im Papierkorb wiederherstellbar.

2. **Spalte aus dem Papierkorb wiederherstellen**
   - Eine Spalte mit Aufgaben löschen, den Papierkorb öffnen und den Spalteneintrag prüfen.
   - Erwartung: Die Abhängigkeit zwischen Spalte und enthaltenen Aufgaben ist eindeutig erkennbar; andere Spalten und Aufgaben werden nicht verändert.
   - Die Spalte wiederherstellen, zwischen Projekten wechseln und die Seite neu laden.
   - Erwartung: Die Spalte erscheint genau einmal im ursprünglichen Projekt und möglichst an ihrer ursprünglichen Position; alle enthaltenen Aufgaben erscheinen genau einmal in ihrer ursprünglichen Reihenfolge und mit unveränderten Feldern; die Einträge sind aus dem Papierkorb entfernt.

3. **Spalte endgültig löschen**
   - Eine gelöschte Spalte mit Aufgaben im Papierkorb endgültig löschen und eine eventuell angezeigte Sicherheitsabfrage zunächst abbrechen.
   - Erwartung: Spalte und Aufgaben bleiben vollständig im Papierkorb erhalten.
   - Endgültiges Löschen erneut wählen und bestätigen; anschließend Seite neu laden.
   - Erwartung: Die Spalte und sämtliche enthaltenen Aufgaben sind weder im Board noch im Papierkorb vorhanden und können nicht wiederhergestellt werden; andere Spalten und Aufgaben bleiben unverändert.

### Projekte

1. **Projekt löschen und sofort rückgängig machen**
   - Ein eindeutig benanntes Projekt mit mindestens zwei Spalten und mehreren eindeutig benannten Aufgaben anlegen und seine Position merken.
   - Projekt löschen und unmittelbar **Rückgängig** ausführen.
   - Erwartung: Das Projekt erscheint wieder genau einmal an seiner ursprünglichen Position; sämtliche Spalten, Aufgaben, Felder und Reihenfolgen bleiben erhalten; im Papierkorb verbleibt keine Kopie.
   - Projekt erneut löschen und das Zeitfenster für **Rückgängig** verstreichen lassen.
   - Erwartung: Das Projekt ist nicht in der Projektauswahl sichtbar und bleibt mitsamt allen enthaltenen Spalten und Aufgaben im Papierkorb wiederherstellbar; ein anderes verfügbares Projekt wird ohne Fehler angezeigt.

2. **Projekt aus dem Papierkorb wiederherstellen**
   - Ein Projekt mit Spalten und Aufgaben löschen, den Papierkorb öffnen und den Projekteintrag prüfen.
   - Erwartung: Die Abhängigkeiten zwischen Projekt, Spalten und Aufgaben sind eindeutig erkennbar; andere Projekte werden nicht verändert.
   - Das Projekt wiederherstellen, zwischen Projekten wechseln und die Seite neu laden.
   - Erwartung: Das Projekt erscheint genau einmal in der Projektauswahl und möglichst an seiner ursprünglichen Position; sämtliche Spalten und Aufgaben erscheinen genau einmal mit unveränderten Feldern und Reihenfolgen; die Einträge sind aus dem Papierkorb entfernt.

3. **Projekt endgültig löschen**
   - Ein gelöschtes Projekt mit Spalten und Aufgaben im Papierkorb endgültig löschen und eine eventuell angezeigte Sicherheitsabfrage zunächst abbrechen.
   - Erwartung: Projekt, Spalten und Aufgaben bleiben vollständig im Papierkorb erhalten.
   - Endgültiges Löschen erneut wählen und bestätigen; anschließend Seite neu laden.
   - Erwartung: Das Projekt und sämtliche enthaltenen Spalten und Aufgaben sind weder im Board noch im Papierkorb vorhanden und können nicht wiederhergestellt werden; andere Projekte bleiben unverändert und nutzbar.

### Gemeinsame Papierkorb-Prüfungen

- Je eine Aufgabe, Spalte und ein Projekt löschen und prüfen, dass alle drei Einträge im Papierkorb eindeutig nach Typ und Name unterscheidbar sind.
- Einen einzelnen Eintrag wiederherstellen und einen anderen endgültig löschen.
- Erwartung: Die Aktionen betreffen ausschließlich den gewählten Eintrag einschließlich seiner fachlich abhängigen Inhalte; alle übrigen Papierkorb- und Board-Einträge bleiben unverändert.
- Seite mit gefülltem Papierkorb neu laden und Browser neu starten.
- Erwartung: Inhalt und Zustand des Papierkorbs bleiben vollständig erhalten.

## Windows/Mac-OneDrive-Sync

1. In OneDrive einen gemeinsamen Testordner anlegen und dessen vollständige Synchronisierung auf Windows und Mac abwarten.
2. Unter Windows das Board in Chrome oder Edge öffnen, **Sync-Datei verbinden** wählen und im OneDrive-Testordner `projektboard-daten.json` anlegen.
3. Eine eindeutig benannte Aufgabe erstellen und warten, bis OneDrive die Datei als synchronisiert meldet.
4. Unter Mac dasselbe Board öffnen, **Sync-Datei verbinden** wählen und exakt dieselbe OneDrive-Datei auswählen.
5. Mindestens 15 Sekunden warten.
   - Erwartung: Windows-Aufgabe erscheint auf dem Mac; Sync-Status zeigt **Synchronisiert**.
6. Nur auf dem Mac eine zweite eindeutig benannte Aufgabe erstellen, OneDrive-Synchronisierung abwarten und anschließend mindestens 15 Sekunden auf Windows warten.
   - Erwartung: Mac-Aufgabe erscheint unter Windows; bestehende Daten bleiben erhalten.
7. Browser auf beiden Geräten schließen und erneut öffnen.
   - Erwartung: Lokale Daten sind vorhanden; nach erneutem Verbinden mit der Sync-Datei ist der Stand identisch.
8. OneDrive auf einem Gerät kurz pausieren oder die Sync-Datei vorübergehend unerreichbar machen.
   - Erwartung: Die App meldet den Sync-Fehler verständlich und lokale Bearbeitung bleibt möglich.

## Konflikttest und Abschluss

- Auf Windows und Mac gleichzeitig unterschiedliche Änderungen durchführen.
- Erwartung: Mögliches Erzeugen einer OneDrive-Konfliktkopie dokumentieren; prüfen, welcher Stand in der verbundenen Datei erhalten bleibt.
- Danach einen eindeutigen gewünschten Stand per Backup/Import wiederherstellen und erneut auf beide Geräte synchronisieren.
- Test bestanden, wenn Kernfunktionen fehlerfrei arbeiten, Neustarts überstehen und der sequenzielle Windows/Mac-Sync in beide Richtungen ohne Datenverlust funktioniert.

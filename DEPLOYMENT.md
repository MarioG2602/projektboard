# Projektboard kostenlos veröffentlichen

Die App ist vollständig statisch. Für die Veröffentlichung sind kein Build-Schritt
und kein eigener Server nötig. Empfohlen wird GitHub Pages.

## Veröffentlichung mit GitHub Pages

1. Auf [GitHub](https://github.com/) ein neues öffentliches Repository erstellen,
   zum Beispiel `projektboard`.
2. Mindestens `index.html` aus diesem Ordner in das Repository hochladen.
3. Im GitHub-Repository **Settings > Pages** öffnen.
4. Unter **Build and deployment** als Quelle **Deploy from a branch** wählen.
5. Branch **main** und Ordner **/(root)** auswählen und mit **Save** bestätigen.
6. Nach wenigen Minuten ist die App unter folgender Adresse erreichbar:

   ```text
   https://GITHUB-BENUTZERNAME.github.io/REPOSITORY-NAME/
   ```

   Beispiel:

   ```text
   https://maxmustermann.github.io/projektboard/
   ```

Bei späteren Änderungen genügt es, die aktualisierte `index.html` in den
`main`-Branch hochzuladen. GitHub Pages veröffentlicht sie automatisch erneut.

## Supabase Auth konfigurieren

Damit Anmeldung und E-Mail-Bestätigung von der veröffentlichten App aus
funktionieren, im zugehörigen Supabase-Projekt **Authentication > URL
Configuration** öffnen und folgende Werte setzen:

- **Site URL**

  ```text
  https://GITHUB-BENUTZERNAME.github.io/REPOSITORY-NAME/
  ```

- **Redirect URLs**

  ```text
  https://GITHUB-BENUTZERNAME.github.io/REPOSITORY-NAME/
  https://GITHUB-BENUTZERNAME.github.io/REPOSITORY-NAME/**
  ```

Für lokale Tests kann zusätzlich diese Redirect URL eingetragen werden:

```text
http://localhost:*/
```

Die Platzhalter müssen durch den tatsächlichen GitHub-Benutzernamen und
Repository-Namen ersetzt werden. Bei einer später eingerichteten eigenen Domain
müssen **Site URL** und **Redirect URLs** entsprechend ergänzt oder angepasst
werden.

## Hinweise

- Die in einer statischen App sichtbare Supabase-URL und der öffentliche
  `anon`-Schlüssel sind dafür vorgesehen. Ein `service_role`-Schlüssel darf
  niemals in `index.html` stehen.
- Die Datenbank muss zuvor mit `SUPABASE_SETUP.sql` eingerichtet worden sein.
- Nach der Veröffentlichung Anmeldung, Synchronisierung und Neuladen der Seite
  einmal über die GitHub-Pages-Adresse testen.

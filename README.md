# Stundenplan-Planungshilfe für Studierende der Technischen Hochschule Mittelhessen

Dieses Projekt ist eine Webseite, die Studierenden der Technischen Hochschule Mittelhessen bei der Planung ihres Stundenplans hilft. Mithilfe der Webseite können die Studierenden einzelne Module auswählen und ihren Stundenplan auf diese Weise zusammenstellen. Ein Kalender zeigt die ausgewählten Module an und markiert zeitliche Konflikte farblich.

Bitte beachten Sie, dass diese Webseite die Stundenplan Informationen lokal auf dem Computer des Benutzers verarbeitet und dass der Server nur die statischen Webseiteninhalte bereitstellt. Es werden keine Stundenplan Informationen an den Server gesendet oder von diesem empfangen. Die Verarbeitung erfolgt vollständig auf dem Computer des Benutzers.

Die Webseite ist unter folgender URL erreichbar: https://thm-planer.skillkiller.de/

## Abhängigkeiten

Das Projekt nutzt folgende wichtige Abhängigkeiten:

- [ical.js](https://github.com/mozilla-comm/ical.js/): Eine JavaScript-Bibliothek zum Parsen von iCalendar-Dateien.
- [Bootstrap](https://getbootstrap.com/): Ein CSS-Framework zum schnellen Entwickeln von responsiven Webseiten.
- [FullCalendar](https://fullcalendar.io/): Eine JavaScript-Bibliothek zum Erstellen von interaktiven Kalendern.

## Verwendete Technologien

Das Projekt basiert auf folgenden Technologien:

- HTML
- CSS
- TypeScript
- Webpack

## Lokales Bauen des Projekts

Um das Projekt lokal zu bauen, müssen die folgenden Schritte ausgeführt werden:

1. Stellen Sie sicher, dass Node.js auf Ihrem Computer installiert ist.
2. Öffnen Sie ein Terminal oder eine Befehlszeile im Hauptverzeichnis des Projekts.
3. Führen Sie den Befehl `npm install` aus, um die Abhängigkeiten des Projekts zu installieren.
4. Führen Sie den Befehl `npm run build` aus, um das Projekt zu bauen.
5. Das gebaute Projekt befindet sich nun im `dist`-Verzeichnis.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Informationen zur Lizenzierung finden Sie in der Datei `LICENSE`.

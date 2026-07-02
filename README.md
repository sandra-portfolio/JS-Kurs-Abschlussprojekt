# Mein Digitales Bücherregal

Hier ist mein selbstgebautes digitales Bücherregal! Mit dieser Web-App kann ich meine persönliche Buchsammlung verwalten, den Überblick behalten und gelesene Bücher direkt bewerten.

<img src="./Screenshots README/Screenshot_Projekt.png" width="100%" style="display: block; margin: 20px 0; clear: both;"/>

## Was kann das Bücherregal?

- **Bücher eintragen:** Über ein Formular (Modal) kann ich neue Bücher mit Titel, Autor, Genre und einem eigenen Cover-Bild (Upload vom PC) hinzufügen.
<img src="./Screenshots README/Screenshot_Buch_hinzufuegen.png" width="300" style="display: block; margin: 20px 0; clear: both;"/>
- **Filter- & Suchfunktion:** Ich kann nach bestimmten Titeln oder Autoren suchen, nach Genres filtern (z.B. Krimi oder Fantasy) oder mir nur gelesene/ungelesene Bücher anzeigen lassen.
- **Sortieren:** Das Regal sortiert sich auf Wunsch automatisch nach dem Alphabet (Titel/Autor) oder zeigt die am besten bewerteten Bücher ganz oben an.
- **Sterne vergeben:** Wenn ich ein Buch fertig gelesen habe, kann ich ihm direkt 1 bis 5 Sterne geben.
<p></p>
<img src="./Screenshots README/Screenshot_Buch_bewerten.png" width="300" style="display: block; margin: 20px 0; clear: both;"/>
<p></p>
- **Dunkler Modus (Dark Mode):** Die App hat ein eigenes Design für den Dark Mode – inklusive perfekt angepasster, weißer Eingabefelder im Formular für besten Kontrast.
- **Automatisches Speichern:** Alle Bücher werden sicher im Browser gespeichert (`localStorage`). Selbst wenn ich die Seite neu lade, geht nichts verloren!

## Wie ist der Code aufgebaut?

Mir war wichtig, dass der Code nicht in einer einzigen, riesigen Datei landet. Deshalb habe ich das Projekt in vier klare Bereiche aufgeteilt. Das macht den Code super sauber und leicht zu erweitern:

1. **`elements.js` (Die Elementsammlung):** Hier werden alle Knöpfe, Eingabefelder und Container der Webseite einmalig gesammelt und unter dem Namen `DOM` gespeichert. So muss JavaScript nicht ständig neu danach suchen.
2. **`funktionen.js`, `handler-funktionen.js` (Das Gehirn der App):** Hier steckt die eigentliche Logik. Diese Dateien berechnen die Filter, sortieren die Bücher, wandeln die hochgeladenen Bilder um und speichern alles ab.
3. **`events.js` (Der Vermittler):** Diese Datei wartet nur auf die Klicks oder Eingaben des Nutzers (z.B. wenn jemand auf "Buch hinzufügen" drückt) und leitet den Befehl sofort an das "Gehirn" (`handler-funktionen.js`) weiter.
4. **`main.js` (Der Startknopf):** Das ist die Startdatei. Sie sorgt beim Laden der Seite dafür, dass die alten Bücher geladen werden und prüft, ob der Dark Mode aktiv sein soll und stellt die Default Sortierung wieder her

## Verwendete Techniken

Das komplette Projekt wurde mit den Standard-Webtechniken gebaut – ohne komplizierte Zusatzprogramme:
- **HTML5 & CSS3** (inklusive responsivem Design für das Modal)
- **Vanilla JavaScript** (Modernes JS, strikt aufgeteilt in Module)

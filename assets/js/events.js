'use strict';

function initialisiereEvents() {

    // 1. Genre-Menü toggle
    DOM.genresToggleBtn.addEventListener('click', toggleGenreMenueOptik);

    // 2. Status-Buttons (Alle, Gelesen, Ungelesen)
    DOM.statusButtons.forEach(btn => {
        btn.addEventListener('click', statusFilterAusfuehren);
    });

    // 3. Genre-Chips (Krimi, Fantasy, etc.)
    DOM.genreChips.forEach(chip => {
        chip.addEventListener('click', genreFilterAusfuehren);
    });

    // 4. Dropdown Sortieren
    DOM.sortierSelect.addEventListener('change', sortierungAusfuehren);

    // 5. Hört auf jede Eingabe in deinem Suchfeld
    DOM.suchInput.addEventListener('input', sucheAusfuehren);

    // 6. Klick auf Tag (für ○ Ungelesen und Löschen)
    DOM.buecherGrid.addEventListener('click', buchKarteKlickVerarbeiten);

    // 7. Modal: Wenn im Pop-up Sterne angeklickt werden > Sterne merken
    DOM.modalSterneBereich.addEventListener('click', modalSterneKlickHandler);

    // 8. Modal: Wenn "Speichern" geklickt wird > Bewertung sichern
    DOM.modalSpeichernBtn.addEventListener('click', modalSpeichernHandler);

    // 9. Modal: Wenn "x" geklickt wird > Modal schließen
    DOM.modalSchliessenX.addEventListener('click', modalSchliessenHandler);

    // 10. Löschen einer Karte
    DOM.buecherGrid.addEventListener('click', buchLoeschenVerarbeiten);

    // 11. Modal öffnen über DEINEN Button (.btn-add)
    DOM.btnAdd.addEventListener('click', modalHinzufuegenOeffnenHandler);

    // 12. Modal schließen über das "X" im Hinzufügen-Modal
    DOM.modalHinzufuegenSchliessen.addEventListener('click', modalHinzufuegenSchliessenHandler);

    // 13. Auf die Änderung der "Gelesen"-Checkbox reagieren
    DOM.inputGelesen.addEventListener('change', gelesenCheckboxAenderungHandler);

    // 14. Klicks auf die Sterne innerhalb des Sterne-Containers abfangen
    DOM.hinzufuegenSterneContainer.addEventListener('click', sternHinzufuegenKlickHandler);

    // 15. Das Abschicken des Formulars abfangen
    DOM.formNeuesBuch.addEventListener('submit', neuesBuchHinzufuegenHandler);

}
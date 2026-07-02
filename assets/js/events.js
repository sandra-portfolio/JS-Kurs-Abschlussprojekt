'use strict';

const initialisiereEvents = () => {

    // 1. Genre-Menü toggle
    DOM.genresToggleBtn.addEventListener('click', toggleGenreMenueOptik);

    // 2. Status-Buttons (Alle, Gelesen, Ungelesen)
    DOM.statusButtons.forEach(btn => {
        btn.addEventListener('click', statusFilterAusfuehren);
    });

    // 3. Genre (Krimi, Fantasy, etc.)
    DOM.genreChips.forEach(chip => {
        chip.addEventListener('click', genreFilterAusfuehren);
    });

    // 4. Dropdown Sortieren
    DOM.sortierSelect.addEventListener('change', sortierungAusfuehren);

    // 5. Suchfeld
    DOM.suchInput.addEventListener('input', sucheAusfuehren);

    // 6. Klick auf Tag (für ○ Ungelesen)
    DOM.buecherGrid.addEventListener('click', buchKarteKlickVerarbeiten);

    // 7. Modal Buch bewerten: Wenn im Pop-up Sterne angeklickt werden > Sterne merken
    DOM.modalSterneBereich.addEventListener('click', modalSterneKlickHandler);

    // 8. Modal Buch bewerten: Wenn "Speichern" geklickt wird > Bewertung sichern
    DOM.modalSpeichernBtn.addEventListener('click', modalSpeichernHandler);

    // 9. Modal Buch bewerten: Wenn "x" geklickt wird > Modal schließen
    DOM.modalSchliessenX.addEventListener('click', modalSchliessenHandler);

    // 10. Löschen einer Karte
    DOM.buecherGrid.addEventListener('click', buchLoeschenVerarbeiten);

    // 11. Modal öffnen über Button "Buch hinzufügen" (.btn-add)
    DOM.btnAdd.addEventListener('click', modalHinzufuegenOeffnenHandler);

    // 12. Modal schließen über das "X" im Hinzufügen-Modal
    DOM.modalHinzufuegenSchliessen.addEventListener('click', modalHinzufuegenSchliessenHandler);

    // 13. Auf die Änderung der "Gelesen"-Checkbox bei Buch hinzufügen reagieren
    DOM.inputGelesen.addEventListener('change', gelesenCheckboxAenderungHandler);

    // 14. Klicks auf die Sterne innerhalb des Sterne-Containers
    DOM.hinzufuegenSterneContainer.addEventListener('click', sternHinzufuegenKlickHandler);

    // 15. Das Abschicken des Formulars
    DOM.formNeuesBuch.addEventListener('submit', neuesBuchHinzufuegenHandler);

    // 16. Bearbeiten bereits bestehender Bücher öffnen mit Klick auf den Stift
    DOM.buecherGrid.addEventListener('click', buecherBearbeitenOeffnenHandler);

}
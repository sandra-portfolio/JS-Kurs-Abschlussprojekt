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

    // 9. Modal: Wenn "Abbrechen" geklickt wird > Modal schließenX
    DOM.modalAbbrechenBtn.addEventListener('click', modalSchliessenHandler);
    DOM.modalSchliessenX.addEventListener('click', modalSchliessenHandler);

}
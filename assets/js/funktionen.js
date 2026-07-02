'use strict';

// GLOBALER STATE
const aktiveFilter = {
    status: 'alle',
    genre: 'alle',
    sortierung: 'titel',
    suchbegriff: ''
};

// ==========================================
// LOGIK: FILTERUNG
// ==========================================

const wendeFilterAn = () => {
    let gefilterteBuecher = meinBuecherRegal;

    // 1. Filter: Status
    if (aktiveFilter.status !== 'alle') {
        gefilterteBuecher = gefilterteBuecher.filter(b => b.status === aktiveFilter.status);
    }

    // 2. Filter: Genre
    if (aktiveFilter.genre !== 'alle') {
        gefilterteBuecher = gefilterteBuecher.filter(b => b.genre === aktiveFilter.genre);
    }


    // 3. Sortierung nach Autor, Titel oder Bewertung
    let sortierteBuecher = [...gefilterteBuecher];

    if (aktiveFilter.sortierung === 'titel') {
        sortierteBuecher.sort((a, b) => a.titel.localeCompare(b.titel));
    }
    else if (aktiveFilter.sortierung === 'autor') {
        sortierteBuecher.sort((a, b) => a.autor.localeCompare(b.autor));
    }
    else if (aktiveFilter.sortierung === 'bewertung') {
        sortierteBuecher.sort((a, b) => {
            const bewertungA = a.status === 'ungelesen' ? 0 : (Number(a.bewertung) || 0);
            const bewertungB = b.status === 'ungelesen' ? 0 : (Number(b.bewertung) || 0);

            return bewertungB - bewertungA; // Absteigend sortieren
        });
    }

    // 4. Suchleiste Suche nach Titel oder Autor
    if (aktiveFilter.suchbegriff !== '') {
        gefilterteBuecher = gefilterteBuecher.filter(b => {
            // Umwandlung in Kleinbuchstaben
            const titelPasst = b.titel.toLowerCase().includes(aktiveFilter.suchbegriff);
            const autorPasst = b.autor.toLowerCase().includes(aktiveFilter.suchbegriff);

            // Wenn der Text im Titel ODER im Autor vorkommt, bleibt das Buch drin
            return titelPasst || autorPasst;
        });
    }

    renderRegal(sortierteBuecher);
}


// ==========================================
// HILFSFUNKTIONEN
// ==========================================

// Funktion für die Sterne auf den Buchkarten
const generiereSterneHtml = (bewertung) => {
    let sterneHtml = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= bewertung) {
            sterneHtml += '<span class="aktiv">★</span>';
        } else {
            sterneHtml += '<span>★</span>';
        }
    }
    return sterneHtml;
}

//  Färbt die Sterne im Modal gelb
const sterneImModalFaerben = (bewertung, sterneListe) => {
    sterneListe.forEach(stern => {
        const sternWert = Number(stern.getAttribute('data-wert'));
        stern.classList.toggle('aktiv', sternWert <= bewertung);
    });
};


// Saubere Darstellung beim Neuladen, sortiert immer nach Titel und im Dropdown ist das richtige ausgewählt
const initDefault = () => {
    const istDark = localStorage.getItem('darkmodeAktiv') === 'true';

    document.body.classList.toggle('dark-theme', istDark);
    DOM.darkModeToggle.checked = istDark;

    // 1. Zwinge das Dropdown im HTML immer auf "titel"
    DOM.sortierSelect.value = 'titel';

    // 2. Setze den JavaScript-State passend dazu fest
    aktiveFilter.sortierung = 'titel';

    // 3. Zeichne das Regal das erste Mal
    wendeFilterAn();
};

// Speichert in LocalStorage und triggert die Filterkette
const datenSpeichernUndAktualisieren = () => {
    localStorage.setItem('gespeicherteBuecher', JSON.stringify(meinBuecherRegal));
    wendeFilterAn();
};

// Hilfsfunktion zum sauberen Schließen und Resetten des Modals
const modalHinzufuegenSchliessenAnpassung = () => {
    DOM.modalHinzufuegen.classList.add('ausgeblendet');
    DOM.formNeuesBuch.reset();
    DOM.aktuellEditiertesBuchId = null; // Wichtig! ID wieder löschen
    document.querySelector('#modal-hinzufuegen h2').textContent = "Neues Buch eintragen";
    document.querySelector('#modal-hinzufuegen .btn-speichern-bewertung').textContent = "Buch ins Regal stellen";
    document.querySelector('#input-cover').required = true;
    document.querySelector('#hinzufuegen-sterne-bereich').classList.add('ausgeblendet');
    temporaereHinzufuegenSterne = 0;
};

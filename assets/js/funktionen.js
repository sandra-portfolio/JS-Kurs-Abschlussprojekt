'use strict';

// GLOBALER STATE
const aktiveFilter = {
    status: 'alle',
    genre: 'alle',
    sortierung: 'titel',
    suchbegriff: ''
};

let aktuellZuBewertendesBuchIndex = null;

// ==========================================
// INITIALISIERUNG & DATEN-LOGIK (LocalStorage / Fetch)
// ==========================================

const initialisiereDaten = () => {
    // Wenn im LocalStorage schon Daten waren, hat elements.js sie bereits in meinBuecherRegal geladen
    if (meinBuecherRegal.length === 0) {
        // Falls leer (erster Start): Aus JSON-Datei laden
        fetch('assets/data/buecher.json')
            .then(response => {
                if (!response.ok) throw new Error("Fehler beim Laden der Spieldaten");
                return response.json();
            })
            .then(daten => {
                meinBuecherRegal = daten;
                // Direkt im LocalStorage für das nächste Mal sichern
                localStorage.setItem('meineBuecher', JSON.stringify(meinBuecherRegal));
                wendeFilterAn();
            })
            .catch(error => console.error("Daten-Fehler:", error));
    } else {
        // Wenn Daten da waren, direkt filtern und anzeigen
        wendeFilterAn();
    }
}

// ==========================================
// CORE-LOGIK: FILTERUNG
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

    // 3. Suchleiste Suche nach Titel oder Autor
    if (aktiveFilter.suchbegriff !== '') {
        gefilterteBuecher = gefilterteBuecher.filter(b => {
            // Wir wandeln auch die Daten aus der JSON in Kleinbuchstaben um, um sie fair zu vergleichen
            const titelPasst = b.titel.toLowerCase().includes(aktiveFilter.suchbegriff);
            const autorPasst = b.autor.toLowerCase().includes(aktiveFilter.suchbegriff);

            // Wenn der Text im Titel ODER im Autor vorkommt, bleibt das Buch drin
            return titelPasst || autorPasst;
        });
    }

    // 4. Sortierung nach Autor, Titel oder Bewertung
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

    renderRegal(sortierteBuecher);
}

// ==========================================
// EVENT-HANDLER (Werden von events.js getriggert)
// ==========================================

// Handler 1: Öffnet/Schließt das Genre-Menü visuell
const toggleGenreMenueOptik = () => {
    DOM.genreContainer.classList.toggle('offen');
    DOM.genresToggleBtn.classList.toggle('aktiv');
}

// Handler 2: Verarbeitet den Klick auf Alle/Gelesen/Ungelesen
const statusFilterAusfuehren= (e) => {
    const geklickterBtn = e.target;

    // Visuelles Feedback: Nutzt die Liste aus elements.js
    DOM.statusButtons.forEach(b => b.classList.remove('aktiv'));
    geklickterBtn.classList.add('aktiv');

    // Filterwert setzen und Logik triggern
    aktiveFilter.status = geklickterBtn.getAttribute('data-filter');
    wendeFilterAn();
}

// Handler 3: Verarbeitet den Klick auf die Genre-Chips
const genreFilterAusfuehren= (e) => {
    const geklickterChip = e.target;

    // 1. Alle Chips optisch deaktivieren
    DOM.genreChips.forEach(c => c.classList.remove('aktiv'));

    // 2. Den gerade geklickten Chip aktivieren
    geklickterChip.classList.add('aktiv');

    // 3. Wert auslesen (wird entweder 'Krimi', 'Fantasy' ODER eben 'alle' sein)
    aktiveFilter.genre = geklickterChip.getAttribute('data-filter');

    // 4. Grid neu filtern und zeichnen
    wendeFilterAn();
}

// Handler 4: Der Handler für das 'change'-Event, dorpdown sortieren
const sortierungAusfuehren= (e) => {
    // e.target ist dein <select>. e.target.value liefert "titel", "autor" oder "bewertung"
    aktiveFilter.sortierung = e.target.value;

    // Alles neu berechnen und zeichnen
    wendeFilterAn();
}

// Handler 5: Suchleiste Navigation
const sucheAusfuehren = (e) => {
    // .toLowerCase() macht die Suche unempfindlich gegenüber Groß-/Kleinschreibung
    // .trim() schneidet versehentliche Leerzeichen am Anfang/Ende weg
    aktiveFilter.suchbegriff = e.target.value.toLowerCase().trim();

    wendeFilterAn();
};

// Handler 6: Steuert, was passiert, wenn man auf "○ Ungelesen" klickt
const buchKarteKlickVerarbeiten = (e) => {
    // 1. Suchen, ob der Klick auf oder innerhalb des Status-Buttons war
    const statusBtn = e.target.closest('.status-toggle-btn');

    // Wenn kein Status-Button getroffen wurde, brechen wir sofort ab!
    if (!statusBtn) return;

    // 2. Den Index direkt vom Button auslesen und in eine echte Zahl umwandeln
    const indexAttr = statusBtn.getAttribute('data-index');
    console.log("Geklickter Button Index Text:", indexAttr); // Test-Ausgabe

    const index = Number(indexAttr);
    console.log("Geklickter Index als Zahl:", index); // Test-Ausgabe

    // 3. Buch aus dem Regal holen
    const buch = meinBuecherRegal[index];
    if (!buch) {
        console.error("KEIN BUCH UNTER DIESEM INDEX GEFUNDEN:", index);
        return;
    }

    console.log("Buch erfolgreich erkannt:", buch.titel, "aktueller Status:", buch.status);

    // 4. Die eigentliche Logik
    if (buch.status === 'ungelesen') {
        aktuellZuBewertendesBuchIndex = index;

        DOM.modalTitel.textContent = `"${buch.titel}" bewerten`;
        DOM.modalSterneBereich.setAttribute('data-gewaehlte-sterne', '0');
        sterneImModalFaerben(0);

        DOM.modal.classList.remove('ausgeblendet');
        console.log("Modal sollte jetzt sichtbar sein für:", buch.titel);
    } else {
        // Wenn schon gelesen, zurück auf ungelesen
        buch.status = 'ungelesen';
        buch.bewertung = 0;
        datenSpeichernUndAktualisieren();
    }
};

// Handler 7: Wenn im Modal ein Stern angeklickt wird
const modalSterneKlickHandler = (e) => {
    if (e.target.classList.contains('modal-stern')) {
        const gewaehlterWert = e.target.getAttribute('data-wert');
        DOM.modalSterneBereich.setAttribute('data-gewaehlte-sterne', gewaehlterWert);
        sterneImModalFaerben(Number(gewaehlterWert));
    }
};

// Handler 8: Wenn im Modal auf "Speichern" geklickt wird
const modalSpeichernHandler = () => {
    if (aktuellZuBewertendesBuchIndex !== null) {
        const buch = meinBuecherRegal[aktuellZuBewertendesBuchIndex];
        const sterne = Number(DOM.modalSterneBereich.getAttribute('data-gewaehlte-sterne'));

        buch.status = 'gelesen';
        buch.bewertung = sterne === 0 ? 1 : sterne;

        DOM.modal.classList.add('ausgeblendet');
        datenSpeichernUndAktualisieren();
        aktuellZuBewertendesBuchIndex = null;
    }
};

// Handler 9: Wenn das Modal geschlossen oder abgebrochen wird
const modalSchliessenHandler = () => {
    DOM.modal.classList.add('ausgeblendet');
    aktuellZuBewertendesBuchIndex = null;
};

// ==========================================
// HILFSFUNKTIONEN
// ==========================================

// Deine bestehende Funktion für die Sterne auf den Buchkarten (Bleibt genau so!)
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

//Saubere Darstellung beim Neuladen sortiert immer nach Titel und im Dropdown ist das richtige ausgewählt
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

// Hilfsfunktion: Färbt die Sterne im Modal gelb
const sterneImModalFaerben = (bewertung) => {
    DOM.modalSterne.forEach(stern => {
        const sternWert = Number(stern.getAttribute('data-wert'));
        stern.classList.toggle('aktiv', sternWert <= bewertung);
    });
};

// Hilfsfunktion: Speichert in LocalStorage und triggert die Filterkette
const datenSpeichernUndAktualisieren = () => {
    localStorage.setItem('meinBuecherRegal', JSON.stringify(meinBuecherRegal));
    wendeFilterAn();
};
'use strict';

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
    const statusBtn = e.target.closest('.status-toggle-btn');
    if (!statusBtn) return;

    // 1. ID aus dem Button holen
    const buchId = statusBtn.getAttribute('data-id');

    // 2. Buch im Regal suchen
    const buch = meinBuecherRegal.find(b => b.id === buchId);

    if (!buch) return; // Sicherheitsnetz

    // 3. Nur wenn das Buch AKTUELL 'ungelesen' ist, öffnen wir das Modal
    if (buch.status === 'ungelesen') {
        aktuellZuBewertendesBuchId = buchId;

        DOM.modalTitel.textContent = `"${buch.titel}" bewerten`;
        DOM.modalSterneBereich.setAttribute('data-gewaehlte-sterne', '0');
        if (typeof sterneImModalFaerben === 'function') sterneImModalFaerben(0, DOM.modalSterne);

        DOM.modal.classList.remove('ausgeblendet');
    } else {
        // HIER WAR VORHER: buch.status = 'ungelesen';
        // Das haben wir gelöscht! Jetzt passiert einfach GAR NICHTS,
        // wenn das Buch bereits gelesen ist.
        console.log("Dieses Buch wurde bereits gelesen und kann nicht zurückgesetzt werden.");
    }
};

// Handler 7: Wenn im Modal ein Stern angeklickt wird
const modalSterneKlickHandler = (e) => {
    if (e.target.classList.contains('modal-stern')) {
        const gewaehlterWert = e.target.getAttribute('data-wert');
        DOM.modalSterneBereich.setAttribute('data-gewaehlte-sterne', gewaehlterWert);
        sterneImModalFaerben(Number(gewaehlterWert), DOM.modalSterne);
    }
};

// Handler 8: Wenn im Modal auf "Speichern" geklickt wird
const modalSpeichernHandler = () => {
    // 1. Prüfen, ob überhaupt eine ID im Speicher liegt
    if (aktuellZuBewertendesBuchId !== null) {

        // 2. Das Buch im Regal suchen
        const buch = meinBuecherRegal.find(b => b.id === aktuellZuBewertendesBuchId);

        // ERST PRÜFEN, OB DAS BUCH EXISTIERT!
        if (buch) {
            const sterne = Number(DOM.modalSterneBereich.getAttribute('data-gewaehlte-sterne'));

            buch.status = 'gelesen';
            buch.bewertung = sterne === 0 ? 1 : sterne;

            DOM.modal.classList.add('ausgeblendet');
            datenSpeichernUndAktualisieren();
        } else {
            // Wenn es nicht existiert, meckern wir in der Konsole, anstatt abzustürzen!
            console.error("Modal-Fehler: Buch mit dieser ID wurde im Regal nicht gefunden:", aktuellZuBewertendesBuchId);
        }

        // ID wieder aufräumen
        aktuellZuBewertendesBuchId = null;
    }
};

// Handler 9: Wenn das Modal geschlossen oder abgebrochen wird
const modalSchliessenHandler = () => {
    DOM.modal.classList.add('ausgeblendet');
    aktuellZuBewertendesBuchId = null;
};

// Handler 10: Ganze Buchkarte löschen
const buchLoeschenVerarbeiten = (e) => {
    // 1. Klick auf das normale X oben rechts > Karte abdunkeln
    const loeschenBtn = e.target.closest('.btn-loeschen');
    if (loeschenBtn) {
        const buchKarte = loeschenBtn.closest('.buch-karte');
        buchKarte.classList.add('loeschen-aktiv');
        return;
    }

    // 2. Klick auf "Nein" im Schleier > Abdunkeln rückgängig machen
    const neinBtn = e.target.closest('.btn-loeschen-nein');
    if (neinBtn) {
        const buchKarte = neinBtn.closest('.buch-karte');
        buchKarte.classList.remove('loeschen-aktiv');
        return;
    }

    // 3. Klick auf "Ja" im Schleier > Buch wirklich löschen
    const jaBtn = e.target.closest('.btn-loeschen-ja');
    if (jaBtn) {
        const buchId = jaBtn.getAttribute('data-id');

        // Aus dem Array werfen
        meinBuecherRegal = meinBuecherRegal.filter(b => b.id !== buchId);

        // Speichern und Regal neu zeichnen
        datenSpeichernUndAktualisieren();
    }
};

// Handler 11: Modal öffnen
const modalHinzufuegenOeffnenHandler = () => {
    const modal = document.querySelector('#modal-hinzufuegen');
    modal.classList.remove('ausgeblendet');
};

// Handler 12: Modal schließen und Formular leeren
const modalHinzufuegenSchliessenHandler = () => {
    const modal = document.querySelector('#modal-hinzufuegen');
    const form = document.querySelector('#form-neues-buch');
    modal.classList.add('ausgeblendet');
    form.reset()
};

// Handler 13: Sterne ein- oder ausblenden, wenn die Checkbox sich ändert
const gelesenCheckboxAenderungHandler = () => {
    const checkbox = document.querySelector('#input-gelesen');
    const sterneBereich = document.querySelector('#hinzufuegen-sterne-bereich');

    if (checkbox.checked) {
        sterneBereich.classList.remove('ausgeblendet');
    } else {
        sterneBereich.classList.add('ausgeblendet');
        temporaereHinzufuegenSterne = 0;

        const sterneHinzufuegen = document.querySelectorAll('.stern-hinzufuegen');
        sterneImModalFaerben(0, sterneHinzufuegen);
    }
};

// Handler 14: Klicks auf die Sterne im Hinzufügen-Modal abfangen
const sternHinzufuegenKlickHandler = (e) => {
    const stern = e.target.closest('.stern-hinzufuegen');
    if (!stern) return;

    temporaereHinzufuegenSterne = Number(stern.getAttribute('data-wert'));

    const sterneHinzufuegen = document.querySelectorAll('.stern-hinzufuegen');
    sterneImModalFaerben(temporaereHinzufuegenSterne, sterneHinzufuegen);
};

// Handler 15: Das Abschicken des Formulars verarbeiten
const neuesBuchHinzufuegenHandler = (e) => {
    e.preventDefault();

    const titel = document.querySelector('#input-titel').value;
    const autor = document.querySelector('#input-autor').value;
    const genre = document.querySelector('#input-genre').value;
    const istGelesen = document.querySelector('#input-gelesen').checked;
    const bildDatei = document.querySelector('#input-cover').files[0];

    if (!bildDatei) return;

    const reader = new FileReader();
    reader.readAsDataURL(bildDatei);

    reader.onload = () => {
        const bildBase64 = reader.result;

        const neuesBuch = {
            id: "buch_" + Date.now(),
            titel: titel,
            autor: autor,
            genre: genre,
            cover: bildBase64,
            status: istGelesen ? "gelesen" : "ungelesen",
            bewertung: istGelesen ? temporaereHinzufuegenSterne : 0
        };

        meinBuecherRegal.push(neuesBuch);
        datenSpeichernUndAktualisieren();

        modalHinzufuegenSchliessenHandler();
        document.querySelector('#hinzufuegen-sterne-bereich').classList.add('ausgeblendet');
        temporaereHinzufuegenSterne = 0;

        const sterneHinzufuegen = document.querySelectorAll('.stern-hinzufuegen');
        sterneImModalFaerben(0, sterneHinzufuegen);
    };
};
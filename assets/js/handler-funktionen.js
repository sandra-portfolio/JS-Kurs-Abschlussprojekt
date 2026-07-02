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

    DOM.statusButtons.forEach(b => b.classList.remove('aktiv'));
    geklickterBtn.classList.add('aktiv');

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

// Handler 4: Der Handler für das 'change'-Event, dropdown sortieren
const sortierungAusfuehren= (e) => {
    // e.target ist das <select>. e.target.value liefert "titel", "autor" oder "bewertung"
    aktiveFilter.sortierung = e.target.value;

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

    // 3. Nur wenn das Buch AKTUELL 'ungelesen' ist, wird das Modal geöffnet
    if (buch.status === 'ungelesen') {
        aktuellZuBewertendesBuchId = buchId;

        DOM.modalTitel.textContent = `"${buch.titel}" bewerten`;
        DOM.modalSterneBereich.setAttribute('data-gewaehlte-sterne', '0');
        if (typeof sterneImModalFaerben === 'function') sterneImModalFaerben(0, DOM.modalSterne);

        DOM.modal.classList.remove('ausgeblendet');
    } else {
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

        // Prüfung ob das Buch existiert
        if (buch) {
            const sterne = Number(DOM.modalSterneBereich.getAttribute('data-gewaehlte-sterne'));

            buch.status = 'gelesen';
            buch.bewertung = sterne === 0 ? 1 : sterne;

            DOM.modal.classList.add('ausgeblendet');
            datenSpeichernUndAktualisieren();
        } else {
            // Wenn es nicht existiert, Konsolenausgabe
            console.error("Modal-Fehler: Buch mit dieser ID wurde im Regal nicht gefunden:", aktuellZuBewertendesBuchId);
        }

        // ID wieder leeren
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

    // 2. Klick auf "Nein" im Overlay > Abdunkeln rückgängig machen
    const neinBtn = e.target.closest('.btn-loeschen-nein');
    if (neinBtn) {
        const buchKarte = neinBtn.closest('.buch-karte');
        buchKarte.classList.remove('loeschen-aktiv');
        return;
    }

    // 3. Klick auf "Ja" im Overlay > Buch wirklich löschen
    const jaBtn = e.target.closest('.btn-loeschen-ja');
    if (jaBtn) {
        const buchId = jaBtn.getAttribute('data-id');

        // Aus dem Array werfen
        meinBuecherRegal = meinBuecherRegal.filter(b => b.id !== buchId);

        datenSpeichernUndAktualisieren();
    }
};

// Handler 11: Modal öffnen "neues Buch"
const modalHinzufuegenOeffnenHandler = () => {
    // 1. Überschrift wieder auf "Buch hinzufügen" zurücksetzen
    document.querySelector('#modal-hinzufuegen h2').textContent = "Buch hinzufügen";

    // 2. Den Button-Text wieder auf "Hinzufügen" setzen
    document.querySelector('#modal-hinzufuegen .btn-speichern-bewertung').textContent = "Buch ins Regal stellen";

    // 3. Die ID für das Editieren löschen, damit das System weiß: "Es ist ein neues Buch"
    DOM.aktuellEditiertesBuchId = null;

    // 4. Fehler-Meldung verstecken
    const fehlerAnzeige = document.querySelector('#modal-fehler-meldung');
    if (fehlerAnzeige) {
        fehlerAnzeige.style.display = 'none';
        fehlerAnzeige.textContent = '';
    }

    // 5. Alle Formularfelder komplett leeren
    document.querySelector('#input-titel').value = "";
    document.querySelector('#input-autor').value = "";
    document.querySelector('#input-genre').value = "";
    document.querySelector('#input-cover').value = ""; // Bild-Input leeren
    document.querySelector('#input-cover').required = true; // Cover ist bei neuem Buch wieder Pflicht!

    // 6. Checkbox für "gelesen" deaktivieren
    document.querySelector('#input-gelesen').checked = false;

    // 7. Sterne-Bereich verstecken und Zähler auf 0 setzen
    const sterneBereich = document.querySelector('#hinzufuegen-sterne-bereich');
    if (sterneBereich) {
        sterneBereich.classList.add('ausgeblendet');
    }
    temporaereHinzufuegenSterne = 0;

    // 8. die Farbe zurücksetzen (alle grau)
    const sterneHinzufuegen = document.querySelectorAll('.stern-hinzufuegen');
    if (typeof sterneImModalFaerben === 'function') {
        sterneImModalFaerben(0, sterneHinzufuegen);
    }

    // 9. Erst wenn alles zurückgesetzt ist: Modal anzeigen
    const modal = document.querySelector('#modal-hinzufuegen');
    modal.classList.remove('ausgeblendet');
};

// Handler 12: Modal schließen und Formular leeren
const modalHinzufuegenSchliessenHandler = () => {
    const modal = document.querySelector('#modal-hinzufuegen');
    const form = document.querySelector('#form-neues-buch');
    modal.classList.add('ausgeblendet');
    form.reset();
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

    const titelInput = document.querySelector('#input-titel').value.trim();
    const fehlerAnzeige = document.querySelector('#modal-fehler-meldung');

    // 1. Wenn wir ein NEUES Buch hinzufügen (nicht beim Bearbeiten!)
    if (DOM.aktuellEditiertesBuchId === null) {

        //  prüfen, ob der Titel (ignoriert Groß-/Kleinschreibung) schon im Regal existiert
        const buchExistiert = meinBuecherRegal.some(b => b.titel.toLowerCase() === titelInput.toLowerCase());

        if (buchExistiert) {
            // Fehlermeldung reinschreiben und sichtbar machen
            fehlerAnzeige.textContent = `Das Buch "${titelInput}" existiert bereits im Regal!`;
            fehlerAnzeige.style.display = 'block';
            return;
        }
    }

    const titel = document.querySelector('#input-titel').value;
    const autor = document.querySelector('#input-autor').value;
    const genre = document.querySelector('#input-genre').value;
    const istGelesen = document.querySelector('#input-gelesen').checked;
    const bildDatei = document.querySelector('#input-cover').files[0];

    // Funktion zum eigentlichen Speichern im Array
    const speichereBuchDaten = (coverBildBase64 = null) => {
        if (DOM.aktuellEditiertesBuchId) {
            // MODUS: BEARBEITEN
            const buch = meinBuecherRegal.find(b => b.id === DOM.aktuellEditiertesBuchId);
            if (buch) {
                buch.titel = titel;
                buch.autor = autor;
                buch.genre = genre;
                buch.status = istGelesen ? "gelesen" : "ungelesen";
                buch.bewertung = istGelesen ? temporaereHinzufuegenSterne : 0;
                // Nur überschreiben, wenn auch ein neues Bild ausgewählt wurde
                if (coverBildBase64) buch.cover = coverBildBase64;
            }
        } else {
            // MODUS: NEU HINZUFÜGEN
            const neuesBuch = {
                id: "buch_" + Date.now(),
                titel: titel,
                autor: autor,
                genre: genre,
                cover: coverBildBase64,
                status: istGelesen ? "gelesen" : "ungelesen",
                bewertung: istGelesen ? temporaereHinzufuegenSterne : 0
            };
            meinBuecherRegal.push(neuesBuch);
        }

        datenSpeichernUndAktualisieren();
        modalHinzufuegenSchliessenAnpassung();
    };

    // Wenn ein neues Bild hochgeladen wurde, via FileReader einlesen
    if (bildDatei) {
        const reader = new FileReader();
        reader.readAsDataURL(bildDatei);
        reader.onload = () => speichereBuchDaten(reader.result);
    } else {
        // Kein neues Bild? Dann direkt speichern (wichtig fürs Bearbeiten!)
        speichereBuchDaten();
    }
};

// Handler 16: Bestehendes Buch bearbeiten
const buecherBearbeitenOeffnenHandler = (e) => {
    // 1. Prüfen, ob der Klick überhaupt den Bearbeiten-Button (oder das Icon darin) getroffen hat
    const bearbeitenBtn = e.target.closest('.btn-edit');
    if (!bearbeitenBtn) return; // Wenn nicht, brechen wir sofort ab

    // 2. ID aus dem Button ziehen
    const buchId = bearbeitenBtn.getAttribute('data-id');

    // 3. Das passende Buch aus dem Regal-Array suchen
    const buch = meinBuecherRegal.find(b => b.id === buchId);
    if (!buch) return; // Sicherheitsnetz: Falls kein Buch gefunden wurde

    // 4. ID in den Elementen zwischenspeichern (wichtig fürs spätere Speichern!)
    DOM.aktuellEditiertesBuchId = buchId;

    // 5. Die vorhandenen Daten in die Formularfelder eintragen
    document.querySelector('#input-titel').value = buch.titel;
    document.querySelector('#input-autor').value = buch.autor;
    document.querySelector('#input-genre').value = buch.genre;
    document.querySelector('#input-gelesen').checked = (buch.status === 'gelesen');

    // 6. Maske optisch anpassen (Überschrift & Button-Text ändern)
    document.querySelector('#modal-hinzufuegen h2').textContent = "Buch bearbeiten";
    document.querySelector('#modal-hinzufuegen .btn-speichern-bewertung').textContent = "Änderungen speichern";

    // Cover-Feld ist beim Bearbeiten optional, falls man das alte Bild behalten will
    document.querySelector('#input-cover').required = false;

    // 7. Sternebereich anzeigen & färben, falls das Buch bereits gelesen war
    if (buch.status === 'gelesen') {
        document.querySelector('#hinzufuegen-sterne-bereich').classList.remove('ausgeblendet');
        temporaereHinzufuegenSterne = buch.bewertung || 0;
        const sterneHinzufuegen = document.querySelectorAll('.stern-hinzufuegen');
        if (typeof sterneImModalFaerben === 'function') {
            sterneImModalFaerben(temporaereHinzufuegenSterne, sterneHinzufuegen);
        }
    }

    // 8. Das Modal anzeigen (Klasse 'ausgeblendet' entfernen)
    DOM.modalHinzufuegen.classList.remove('ausgeblendet');
};
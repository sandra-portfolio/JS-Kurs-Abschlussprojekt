'use strict';

const renderRegal= (buch) => {
    console.log("RENDER: Zeichne das Grid neu...");
    DOM.buecherGrid.innerHTML = "";

    // Wir nutzen hier (buch, index), damit wir die genaue Position im Array haben (0, 1, 2...)
    buch.forEach((buch, index) => {
        const karte = document.createElement('div');
        karte.className = 'buch-karte';

        const statusKlasse = buch.status === 'gelesen' ? 'tag-gelesen' : 'tag-ungelesen';
        const statusIcon = buch.status === 'ungelesen' ? '○ ' : '✓ ';
        const statusText = statusIcon + buch.status.charAt(0).toUpperCase() + buch.status.slice(1);

        // Sterne holen oder leere Sterne anzeigen
        const sterneHtml = buch.status === 'gelesen' ? generiereSterneHtml(buch.bewertung) : generiereSterneHtml(0);

        // zur eindeutigen erkennung hängen wir überall die id aus der json an
        karte.innerHTML = `
            <button class="btn-loeschen" data-id="${buch.id}">✕</button>
    
            <button class="status-tag ${statusKlasse} status-toggle-btn" data-id="${buch.id}">
                ${statusText}
            </button>
    
            <img class="buch-cover" src="${buch.cover}" alt="Cover von ${buch.titel}">
    
             <h3>${buch.titel}</h3>
                <p class="autor">${buch.autor}</p>
                <p class="genre">${buch.genre}</p>
    
            <div class="sterne sterne-click-bereich" data-id="$${buch.id}">
                ${sterneHtml}
            </div>
            `;

        DOM.buecherGrid.append(karte);
    });
}
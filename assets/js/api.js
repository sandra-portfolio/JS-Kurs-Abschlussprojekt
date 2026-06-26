'use strict';

const ladeUndZeigeBuecher = () => {
    console.log("API: Prüfe LocalStorage...");

    // 1. Schauen, ob bereits Daten im Browser gespeichert sind
    const lokalGespeichert = localStorage.getItem('gespeicherteBuecher');

    if (lokalGespeichert) {
        console.log("API: Daten im LocalStorage gefunden! Lade diese...");
        // Text wieder in ein echtes JavaScript-Array umwandeln
        meinBuecherRegal = JSON.parse(lokalGespeichert);
        renderRegal(meinBuecherRegal);
    } else {
        console.log("API: Kein LocalStorage vorhanden. Starte AJAX-Fetch zur JSON...");
        // Wenn der Browser noch leer ist (beim allerersten Aufruf), holen wir die JSON
        fetch('./assets/data/buecher.json')
            .then(antwort => {
                if (!antwort.ok) throw new Error("Fehler beim Laden");
                return antwort.json();
            })
            .then(daten => {
                meinBuecherRegal = daten;

                // Direkt für das nächste Mal im LocalStorage merken!
                localStorage.setItem('gespeicherteBuecher', JSON.stringify(meinBuecherRegal));

                renderRegal(meinBuecherRegal);
            })
            .catch(fehler => console.error("API-Fehler:", fehler));
    }
}
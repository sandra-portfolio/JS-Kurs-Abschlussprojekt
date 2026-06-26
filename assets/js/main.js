'use strict';

/**
 * DIE INITIALISIERUNGS-FUNKTION (Der alleinige Startknopf)
 */
const init = () => {
    console.log("SCRIPT: Anwendung startet...");
    ladeUndZeigeBuecher();
    darkModeInitialisieren();
    initialisiereEvents();
    initDefault();
}

// Starten, wenn das DOM bereit ist
document.addEventListener('DOMContentLoaded', init);
'use strict';

const darkModeInitialisieren= () => {
    DOM.darkModeToggle.addEventListener('change', (event) => {
        const istAktiv = event.target.checked;
        document.body.classList.toggle('dark-theme', istAktiv);
        localStorage.setItem('darkmodeAktiv', istAktiv);
    });
}
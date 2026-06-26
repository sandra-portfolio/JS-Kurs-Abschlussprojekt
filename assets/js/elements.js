'use strict';

// Alle DOM-Elemente zentral an einem Ort
const DOM = {
    // Grid für die Bücher
    buecherGrid: document.querySelector('.buecher-grid'),

    // Dark-Mode
    darkModeToggle: document.querySelector('#dark-mode-toggle'),

    // Filter Alle/Ungelesen/Gelesen
    statusButtons: document.querySelectorAll('.filter-links .filter-btn:not(.toggle-btn)'),

    // Sortierung Genre
    genreChips: document.querySelectorAll('.genre-filter-container .chip'),
    genresToggleBtn: document.querySelector('#genres-toggle-btn'),
    genreContainer: document.querySelector('#genre-container'),

    // Dropdown Sortierung
    sortierSelect: document.querySelector('.sortier-select'),

    // Sucheleiste
    suchInput: document.querySelector('.such-input'),

    // Die Elemente für das Bewertungs-Pop-up (Modal)
    modal: document.querySelector('#bewertung-modal'),
    modalTitel: document.querySelector('#modal-buch-titel'),
    modalSterneBereich: document.querySelector('.modal-sterne'),
    modalSterne: document.querySelectorAll('.modal-stern'), // Holt alle 5 Sterne als NodeList
    modalSpeichernBtn: document.querySelector('.btn-speichern-bewertung'),
    modalAbbrechenBtn: document.querySelector('.btn-abbrechen'),
    modalSchliessenX: document.querySelector('.modal-schliessen')
};

// Unser globaler Datenspeicher für die Laufzeit
let meinBuecherRegal = [];
let addTemporaereSterne = 0;

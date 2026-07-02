'use strict';

// Alle DOM-Elemente zentral an einem Ort
const DOM = {
    // Grid für die Bücher
    buecherGrid: document.querySelector('.buecher-grid'),

    // Dark-Mode
    darkModeToggle: document.querySelector('#dark-mode-toggle'),

    // Filter Alle/Ungelesen/Gelesen
    statusButtons: document.querySelectorAll('.filter-links .filter-btn:not(.toggle-btn)'),

    // Filter Genre
    genreChips: document.querySelectorAll('.genre-filter-container .chip'),
    genresToggleBtn: document.querySelector('#genres-toggle-btn'),
    genreContainer: document.querySelector('#genre-container'),

    // Dropdown Sortierung
    sortierSelect: document.querySelector('.sortier-select'),

    // Suchleiste
    suchInput: document.querySelector('.such-input'),

    // Die Elemente für das Bewertungs-Pop-up (Modal)
    modal: document.querySelector('#bewertung-modal'),
    modalTitel: document.querySelector('#modal-buch-titel'),
    modalSterneBereich: document.querySelector('.modal-sterne'),
    modalSterne: document.querySelectorAll('.modal-stern'), // Holt alle 5 Sterne als NodeList
    modalSpeichernBtn: document.querySelector('.btn-speichern-bewertung'),
    modalAbbrechenBtn: document.querySelector('.btn-abbrechen'),
    modalSchliessenX: document.querySelector('.modal-schliessen'),

    // Die Elemente für das "Buch hinzufügen"-Modal
    btnAdd: document.querySelector('.btn-add'),
    modalHinzufuegen: document.querySelector('#modal-hinzufuegen'),
    modalHinzufuegenSchliessen: document.querySelector('#modal-hinzufuegen-schliessen'),
    inputGelesen: document.querySelector('#input-gelesen'),
    hinzufuegenSterneBereich: document.querySelector('#hinzufuegen-sterne-bereich'),
    hinzufuegenSterneContainer: document.querySelector('#hinzufuegen-sterne-bereich .sterne-container'),
    formNeuesBuch: document.querySelector('#form-neues-buch'),
    aktuellEditiertesBuchId: null
};

// Globaler Datenspeicher für die Laufzeit
let meinBuecherRegal = [];
let temporaereHinzufuegenSterne = 0;
let aktuellZuBewertendesBuchId = null;

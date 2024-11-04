// Sprawdzenie lokalnego storage dla trybu ciemnego
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode'); // Aktywuj tryb ciemny
}

// Funkcja do przełączania trybu ciemnego
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
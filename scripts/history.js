// Funkcja do wywoływania zapisu historii
function saveHistory() {
    if (history.length === 0) {
        alert("Brak historii do zapisania!");
        return;
    }
    saveHistoryToFile();
}

// Funkcja kopiująca zawartość li do schowka
function copyHistoryItem(element) {
    // Uzyskaj tekst z elementu li
    const textToCopy = element.textContent; // Używamy textContent, aby uzyskać tekst

    // Utwórz tymczasowy element textarea
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy; // Ustaw wartość na tekst z li
    document.body.appendChild(textarea); // Dodaj textarea do body

    // Wybierz tekst w textarea
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Dla mobilnych urządzeń

    // Skopiuj tekst do schowka
    document.execCommand('copy');

    // Usuń tymczasowy textarea
    document.body.removeChild(textarea);

    // Wyświetlenie komunikatu "Skopiowano!"
    showCopyNotification(event.clientX, event.clientY);
}

function showCopyNotification(x, y) {
    // Tworzenie elementu powiadomienia
    const notification = document.createElement('div');
    notification.textContent = 'Skopiowano!';
    notification.className = 'notification'; // Dodajemy klasę do powiadomienia
    notification.style.left = `${x}px`;
    notification.style.top = `${y - 30}px`;

    // Dodaj powiadomienie do body
    document.body.appendChild(notification);

    // Płynne pojawianie się powiadomienia
    requestAnimationFrame(() => {
        notification.style.opacity = 1; // Ustawiamy opacity na 1, co powoduje fade in
    });

    // Ukrycie powiadomienia po 1.5 sekundy
    setTimeout(() => {
        notification.style.opacity = 0; // Ustawiamy opacity na 0, co powoduje fade out

        // Po zakończeniu fade out, usuwamy powiadomienie z DOM
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500); // Czekamy na zakończenie animacji (0.5s)
    }, 650);
}

function addToHistory(entry) {
    // Sprawdzenie, czy entry nie jest pusty
    if (!entry) return; // Jeśli entry jest puste, nie rób nic

    history.push(entry); // Dodaj wpis do historii
    const historyList = document.getElementById('historyList');
    const noHistoryMessage = document.getElementById('noHistoryMessage'); // Pobierz element komunikatu

    // Sprawdzenie, czy element historyList istnieje
    if (historyList) {
        const listItem = document.createElement('li');
        listItem.textContent = entry; // Ustaw tekst listy na entry
        
        // Przypisanie funkcji kopiującej do kliknięcia na li
        listItem.onclick = function() {
            copyHistoryItem(listItem);
        };

        historyList.appendChild(listItem); // Dodaj element do listy historii
        
        // Ukryj komunikat o braku obliczeń
        if (noHistoryMessage) {
            noHistoryMessage.style.display = 'none'; // Ukryj komunikat
        }
    }
}

function clearHistory() {
    history = []; // Wyczyść tablicę historii
    const historyList = document.getElementById('historyList'); // Zmienione
    const noHistoryMessage = document.getElementById('noHistoryMessage'); // Zmienione

    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }

    if (noHistoryMessage) {
        noHistoryMessage.style.display = 'block'; // Upewnij się, że komunikat jest widoczny
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const clearHistoryButton = document.querySelector('.clearHistory');
    if (clearHistoryButton) {
        clearHistoryButton.addEventListener('click', clearHistory);
    }
});

// Funkcja do zapisywania historii do pliku
function saveHistoryToFile() {
    const blob = new Blob([history.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obliczenia.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
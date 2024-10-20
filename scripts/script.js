let currentInput = '0'; // Ustawienie wyświetlacza na 0 przy załadowaniu
let history = []; // Tablica do przechowywania historii obliczeń
let resultComputed = false; // Flaga do śledzenia, czy wynik został obliczony

// Sprawdzenie lokalnego storage dla trybu ciemnego
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode'); // Aktywuj tryb ciemny
}

// Obsługa zdarzenia klawiatury
document.getElementById('display').addEventListener('keydown', function(event) {
    // Ignoruj klawisze: Alt, Ctrl, Meta
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    // Definiowanie dozwolonych klawiszy
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '^', '(', ')', '%', ',', '|', 'Enter', 'Backspace', 'Escape'];

    // Sprawdzenie, czy naciśnięty klawisz jest dozwolony
    if (!allowedKeys.includes(event.key)) {
        event.preventDefault(); // Zapobiega wprowadzeniu niedozwolonego znaku
        return; // Kończy funkcję
    }

    // Obsługa naciśnięcia klawisza Enter
    if (event.key === 'Enter') {
        calculate(); // Oblicz wynik
        event.preventDefault(); // Zatrzymaj domyślne zachowanie
    } 
    // Obsługa naciśnięcia klawisza Backspace
    else if (event.key === 'Backspace') {
        deleteLastCharacter(); // Usuń ostatni znak
        event.preventDefault(); // Zatrzymaj domyślne zachowanie
    } 
    // Obsługa naciśnięcia klawisza Escape
    else if (event.key === 'Escape') {
        clearDisplay(); // Wyczyść wyświetlacz
        event.preventDefault(); // Zatrzymaj domyślne zachowanie
    } 
    // Obsługa innych klawiszy (cyfry, operatory, itp.)
    else {
        appendNumber(event.key); // Dodaj wprowadzony znak do aktualnego wejścia
        event.preventDefault(); // Zatrzymaj domyślne zachowanie
    }
});

// Dodanie zdarzenia focus, aby usunąć '0' z wyświetlacza
document.getElementById('display').addEventListener('focus', function() {
    if (currentInput === '0') {
        currentInput = ''; // Ustawienie na pusty ciąg
        updateDisplay(); // Aktualizacja wyświetlacza
    }
});

// Dodanie zdarzenia blur, aby przywrócić '0', jeśli pole jest puste
document.getElementById('display').addEventListener('blur', function() {
    if (currentInput === '') {
        currentInput = '0'; // Ustawienie na '0', jeśli pole jest puste
        updateDisplay(); // Aktualizacja wyświetlacza
    }
});

function appendNumber(number) {
    // Resetowanie wyświetlacza po uzyskaniu wyniku
    if (resultComputed) {
        currentInput = number === ',' ? '0,' : number; // Reset do '0,' jeśli to przecinek
        resultComputed = false; // Resetowanie flagi
    } else {
        // Obsługa znaku '|'
        if (number === '|') {
            if (!currentInput.endsWith('|')) { // Nie dodawaj, jeśli już jest
                currentInput += '|'; // Dodaj '|'
            } else {
                // Użytkownik próbował dodać drugi '|', więc usuwamy
                currentInput = currentInput.slice(0, -1); // Usuwamy ostatni '|'
            }
        } else if (number === ',') {
            const lastOperatorPos = Math.max(
                currentInput.lastIndexOf('+'),
                currentInput.lastIndexOf('-'),
                currentInput.lastIndexOf('*'),
                currentInput.lastIndexOf('/'),
                currentInput.lastIndexOf('^')
            );

            // Sprawdzenie, czy przecinek jest po ostatnim operatorze
            const afterLastOperator = currentInput.substring(lastOperatorPos + 1);

            // Jeśli brak liczb po operatorze, czyli wciśnięto operator i potem przecinek
            if (afterLastOperator === '') {
                currentInput += '0,'; // Dodaj '0,' po operatorze
            } else if (!afterLastOperator.includes(',')) {
                // Dodaj przecinek tylko jeśli jeszcze nie ma przecinka w liczbie po ostatnim operatorze
                currentInput += ',';
            }
        } else {
            const lastChar = currentInput[currentInput.length - 1];

            // Jeśli aktualny wyświetlacz to '0'
            if (currentInput === '0') {
                if (number === '+' || number === '-') {
                    currentInput = number; // Ustaw tylko operator
                } else {
                    currentInput = number; // Ustaw nową liczbę
                }
            } else if ('+-*/^'.includes(lastChar) && (number === '+' || number === '-')) {
                // Zamień operator, jeśli ostatni znak to operator
                currentInput = currentInput.slice(0, -1) + number; // Zamień ostatni operator
            } else {
                // Dodaj nową cyfrę
                currentInput += number;
            }
        }
    }
    updateDisplay(); // Zaktualizuj wyświetlacz
}

function calculate() {
    try {
        // Liczymy otwarte nawiasy
        const openCount = (currentInput.match(/\(/g) || []).length;
        const closeCount = (currentInput.match(/\)/g) || []).length;

        // Dodaj brakujące nawiasy zamykające
        const missingClosingBrackets = openCount - closeCount;
        if (missingClosingBrackets > 0) {
            currentInput += ')'.repeat(missingClosingBrackets); // Dodaj tyle ')' ile brakujących
        }

        // Zamień 'pi' na Math.PI
        let evalInput = currentInput
            .replace(/(\d)([a-zA-Z])/g, '$1*$2') // Dodaj mnożenie przed zmiennymi
            .replace(/,/g, '.') // Zamień przecinki na kropki
            .replace(/\^/g, '**') // Zamień ^ na **
            .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

        // Loguj przetworzone wyrażenie przed zamianą wartości bezwzględnych
        console.log("Przetworzone wyrażenie:", evalInput);

        // Zamień wartości bezwzględne '|' na 'Math.abs()'
        evalInput = evalInput.replace(/\|([^|]+)\|/g, 'Math.abs($1)');

        // Loguj wyrażenie po zamianie wartości bezwzględnych
        console.log("Wyrażenie po zamianie wartości bezwzględnych:", evalInput);

        // Oblicz wynik
        const result = eval(evalInput);
        
        // Dodaj do historii tylko jeśli nie obliczono wcześniej
        if (!resultComputed) {
            addToHistory(`${currentInput} = ${result}`);
        }

        currentInput = result.toString();
        resultComputed = true; // Ustaw flagę na true
        highlightResult(); // Wywołanie highlightResult() przed updateDisplay
    } catch (error) {
        console.error("Błąd obliczeń:", error); // Log błędu
        currentInput = 'ERROR';
        resultComputed = false; // Resetuj flagę w przypadku błędu
    }
    updateDisplay();
}

// Funkcja do przełączania trybu ciemnego
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

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

// Funkcja do wywoływania zapisu historii
function saveHistory() {
    if (history.length === 0) {
        alert("Brak historii do zapisania!");
        return;
    }
    saveHistoryToFile();
}

// Aktualizowanie wyświetlacza
function updateDisplay() {
    const display = document.getElementById('display');
    display.value = currentInput || '0';
}

// Wywołanie wczytania stanu trybu ciemnego na początku
window.onload = function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
};

function appendOperator(operator) {
    // Resetowanie wyświetlacza po uzyskaniu wyniku
    if (resultComputed) {
        currentInput = operator; // Ustawienie na operator bez 0
        resultComputed = false; // Resetowanie flagi
    } else {
        // Jeżeli aktualny wyświetlacz to '0' i użytkownik wciśnie '-' lub '+', to wyświetl tylko ten operator
        if (currentInput === '0' && (operator === '-' || operator === '+')) {
            currentInput = operator;
        } else if ('+-*/^'.includes(currentInput[currentInput.length - 1])) {
            // Zamień ostatni operator na nowy, jeśli ostatni znak to operator
            currentInput = currentInput.slice(0, -1) + operator;
        } else {
            currentInput += operator; // Dodaj operator do aktualnego wyrażenia
        }
    }
    updateDisplay(); // Zaktualizuj wyświetlacz
}

// Funkcja do usuwania ostatniego znaku
function deleteLastCharacter() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0'; // Przywrócenie do 0, gdy nie ma więcej znaków
    }
    updateDisplay();
}

// Funkcja do czyszczenia wyświetlacza
function clearDisplay() {
    currentInput = '0'; // Przywrócenie do 0
    resultComputed = false; // Resetowanie flagi
    updateDisplay();
}

// Funkcje matematyczne
function sqrt() {
    // Oblicz wynik na podstawie aktualnego wejścia
    let evalInput = currentInput
        .replace(/,/g, '.') // Zamień przecinki na kropki
        .replace(/\^/g, '**') // Zamień ^ na **
        .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

    // Oblicz wynik
    try {
        const evaluatedResult = eval(evalInput); // Oblicz wyrażenie
        const result = Math.sqrt(evaluatedResult); // Pierwiastek kwadratowy
        
        if (!resultComputed) {
            addToHistory(`sqrt(${currentInput}) = ${result}`);
        }

        currentInput = result.toString();
        resultComputed = true; // Ustaw flagę na true
        updateDisplay();
    } catch (error) {
        console.error("Błąd obliczeń:", error); // Log błędu
        currentInput = 'ERROR';
        resultComputed = false; // Resetuj flagę w przypadku błędu
    }
}

function sin() {
    // Oblicz wynik na podstawie aktualnego wejścia
    let evalInput = currentInput
        .replace(/,/g, '.') // Zamień przecinki na kropki
        .replace(/\^/g, '**') // Zamień ^ na **
        .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

    // Oblicz wynik
    try {
        const evaluatedResult = eval(evalInput); // Oblicz wyrażenie
        const result = Math.sin(evaluatedResult * Math.PI / 180); // Przekształć na radiany
        
        // Dodaj do historii tylko jeśli nie obliczono wcześniej
        if (!resultComputed) {
            addToHistory(`sin(${currentInput}) = ${result}`);
        }

        currentInput = result.toString();
        resultComputed = true; // Ustaw flagę na true
        updateDisplay();
    } catch (error) {
        console.error("Błąd obliczeń:", error); // Log błędu
        currentInput = 'ERROR';
        resultComputed = false; // Resetuj flagę w przypadku błędu
    }
}

function cos() {
    // Oblicz wynik na podstawie aktualnego wejścia
    let evalInput = currentInput
        .replace(/,/g, '.') // Zamień przecinki na kropki
        .replace(/\^/g, '**') // Zamień ^ na **
        .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

    // Oblicz wynik
    try {
        const evaluatedResult = eval(evalInput); // Oblicz wyrażenie
        const result = Math.cos(evaluatedResult * Math.PI / 180); // Przekształć na radiany
        
        if (!resultComputed) {
            addToHistory(`cos(${currentInput}) = ${result}`);
        }

        currentInput = result.toString();
        resultComputed = true; // Ustaw flagę na true
        updateDisplay();
    } catch (error) {
        console.error("Błąd obliczeń:", error); // Log błędu
        currentInput = 'ERROR';
        resultComputed = false; // Resetuj flagę w przypadku błędu
    }
}

function tan() {
    // Oblicz wynik na podstawie aktualnego wejścia
    let evalInput = currentInput
        .replace(/,/g, '.') // Zamień przecinki na kropki
        .replace(/\^/g, '**') // Zamień ^ na **
        .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

    // Oblicz wynik
    try {
        const evaluatedResult = eval(evalInput); // Oblicz wyrażenie
        const result = Math.tan(evaluatedResult * Math.PI / 180); // Przekształć na radiany
        
        if (!resultComputed) {
            addToHistory(`tan(${currentInput}) = ${result}`);
        }

        currentInput = result.toString();
        resultComputed = true; // Ustaw flagę na true
        updateDisplay();
    } catch (error) {
        console.error("Błąd obliczeń:", error); // Log błędu
        currentInput = 'ERROR';
        resultComputed = false; // Resetuj flagę w przypadku błędu
    }
}

function ctg() {
    // Oblicz wynik na podstawie aktualnego wejścia
    let evalInput = currentInput
        .replace(/,/g, '.') // Zamień przecinki na kropki
        .replace(/\^/g, '**') // Zamień ^ na **
        .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

    // Oblicz wynik
    try {
        const evaluatedResult = eval(evalInput); // Oblicz wyrażenie
        const result = 1 / Math.tan(evaluatedResult * Math.PI / 180); // Przekształć na radiany
        
        if (!resultComputed) {
            addToHistory(`ctg(${currentInput}) = ${result}`);
        }

        currentInput = result.toString();
        resultComputed = true; // Ustaw flagę na true
        updateDisplay();
    } catch (error) {
        console.error("Błąd obliczeń:", error); // Log błędu
        currentInput = 'ERROR';
        resultComputed = false; // Resetuj flagę w przypadku błędu
    }
}

function log() {
    // Oblicz wynik na podstawie aktualnego wejścia
    let evalInput = currentInput
        .replace(/,/g, '.') // Zamień przecinki na kropki
        .replace(/\^/g, '**') // Zamień ^ na **
        .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

    // Oblicz wynik
    try {
        const evaluatedResult = eval(evalInput); // Oblicz wyrażenie
        const result = Math.log10(evaluatedResult); // Logarytm o podstawie 10
        
        if (!resultComputed) {
            addToHistory(`log(${currentInput}) = ${result}`); // Dodaj do historii
        }

        currentInput = result.toString(); // Ustaw wynik jako aktualne wejście
        resultComputed = true; // Ustaw flagę na true
        updateDisplay(); // Zaktualizuj wyświetlanie
    } catch (error) {
        console.error("Błąd obliczeń:", error); // Log błędu
        currentInput = 'ERROR'; // Ustaw komunikat o błędzie
        resultComputed = false; // Resetuj flagę w przypadku błędu
    }
}


function factorial() {
    calculate();
    let num = parseInt(currentInput.replace(',', '.'));
    if (num < 0) {
        alert("Silnia z liczby ujemnej nie istnieje.");
        return;
    }
    let result = 1;
    for (let i = 1; i <= num; i++) {
        result *= i;
    }
    addToHistory(`${currentInput}! = ${result}`);
    currentInput = result.toString();
    resultComputed = true;
    updateDisplay();
}

function absolute() {
    const number = parseFloat(currentInput.replace(',', '.'));
    const result = Math.abs(number); // Oblicza wartość bezwzględną
    addToHistory(`|${currentInput}| = ${result}`); // Dodaj do historii
    currentInput = result.toString(); // Ustaw wynik jako aktualne wejście
    resultComputed = true; // Ustaw flagę wynikową
    updateDisplay(); // Zaktualizuj wyświetlacz
}

// Funkcja do obliczeń
function calculate() {
    try {
        // Liczymy otwarte nawiasy
        const openCount = (currentInput.match(/\(/g) || []).length;
        const closeCount = (currentInput.match(/\)/g) || []).length;
        
        // Dodaj brakujące nawiasy zamykające
        const missingClosingBrackets = openCount - closeCount;
        if (missingClosingBrackets > 0) {
            currentInput += ')'.repeat(missingClosingBrackets); // Dodaj tyle ')' ile brakujących
        }

        // Zamień wszystkie wystąpienia 'pi' na Math.PI w obliczeniach
        const evalInput = currentInput.replace(/(\d)([a-zA-Z])/g, '$1*$2')
                                       .replace(/,/g, '.')
                                       .replace(/\^/g, '**')
                                       .replace(/pi/g, Math.PI); // Zmiana 'pi' na wartość liczbową

        const result = eval(evalInput);
        addToHistory(`${currentInput} = ${result}`);
        currentInput = result.toString();
        resultComputed = true;
        highlightResult(); // Wywołanie highlightResult() przed updateDisplay
    } catch (error) {
        currentInput = 'ERROR';
    }
    updateDisplay(); // Upewnij się, że ta funkcja aktualizuje wyświetlacz
}

function openParenthesis() {
    // Sprawdzenie, czy aktualny wyświetlacz to '0'
    if (currentInput === '0') {
        currentInput = '('; // Zastąpienie '0' samym nawiasem otwierającym
    } else if ('+-*/^('.includes(currentInput[currentInput.length - 1])) {
        // Jeśli ostatni znak to operator lub nawias otwierający, dodaj nawias otwierający
        currentInput += '(';
    } else {
        // W przeciwnym razie, dodaj '*' przed nawiasem
        currentInput += '*(';
    }
    updateDisplay(); // Zaktualizuj wyświetlacz
}

function closeParenthesis() {
    const openCount = (currentInput.match(/\(/g) || []).length;
    const closeCount = (currentInput.match(/\)/g) || []).length;

    if (openCount > closeCount) {
        currentInput += ')';
    }
    updateDisplay();
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

function highlightResult() {
    const display = document.getElementById('display');
    display.classList.add('highlight');
    setTimeout(() => {
        display.classList.remove('highlight');
    }, 1000);
}

function updateDisplay() {
    const display = document.getElementById('display');
    // Zamień 'pi' na symbol π, '*' na symbol × oraz '/' na symbol ÷ w wyświetlaczu
    const displayInput = currentInput
        .replace(/pi/g, '\u03C0')
        .replace(/\*/g, '\u00D7')
        .replace(/\//g, '\u00F7');

    // Ustawienie wartości wyświetlacza na wynik lub '0' w przypadku pustego wejścia
    display.value = displayInput.length > 0 ? displayInput : '0';
}

function appendPi() {
    // Dodanie pi do aktualnego wejścia
    if (currentInput === '0' || '+-*/^'.includes(currentInput[currentInput.length - 1]) || currentInput[currentInput.length - 1] === '(') {
        currentInput += 'pi'; // Dodaj pi bez mnożenia, jeśli to nowe wyrażenie
    } else {
        currentInput += '*pi'; // Dodaj mnożenie przed pi
    }
    updateDisplay();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Funkcja do animacji fade in i przesunięcia
window.onload = function () {
    document.body.style.opacity = 1; // Ustawienie przezroczystości body na 1 po załadowaniu
    const elements = Array.from(document.body.children);
    
    // Funkcja do animacji fade in
    const fadeIn = (element, delay) => {
        element.classList.add('fade-in'); // Dodanie klasy do elementu
        setTimeout(() => {
            element.classList.add('visible'); // Po opóźnieniu dodajemy klasę visible
        }, delay);
    };

    // Dodanie animacji dla każdego elementu
    elements.forEach((element, index) => {
        fadeIn(element, index * 100); // Opóźnienie w zależności od indeksu elementu
    });

    // Przesunięcie kalkulatora i historii
    setTimeout(() => {
        const calculator = document.querySelector('.calculator');
        if (calculator) {
            calculator.classList.add('slide-in'); // Dodanie klasy do animacji
        }
    }, 200); 

    setTimeout(() => {
        const history = document.querySelector('.history-content');
        if (history) {
            history.classList.add('slide-in'); // Dodanie klasy do animacji
        }
    }, 300); 
};

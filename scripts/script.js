let currentInput = '0'; // Ustawienie wyświetlacza na 0 przy załadowaniu
let history = []; // Tablica do przechowywania historii obliczeń
let resultComputed = false; // Flaga do śledzenia, czy wynik został obliczony

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
    if (resultComputed) {
        currentInput = number === ',' ? '0,' : number;
        resultComputed = false;
    } else {
        if (number === '|') {
            const openPipes = (currentInput.match(/\|/g) || []).length;
            if (openPipes % 2 === 0) {
                currentInput += '|'; // Dodaj pierwszy '|' (otwarcie)
            } else if (openPipes % 2 === 1 && !currentInput.endsWith('|')) {
                currentInput += '|'; // Dodaj drugi '|' (zamknięcie)
            }
        } else if (number === ',') {
            const lastOperatorPos = Math.max(
                currentInput.lastIndexOf('+'),
                currentInput.lastIndexOf('-'),
                currentInput.lastIndexOf('*'),
                currentInput.lastIndexOf('/'),
                currentInput.lastIndexOf('^')
            );
            const afterLastOperator = currentInput.substring(lastOperatorPos + 1);
            if (afterLastOperator === '') {
                currentInput += '0,';
            } else if (!afterLastOperator.includes(',')) {
                currentInput += ',';
            }
        } else {
            const lastChar = currentInput[currentInput.length - 1];
            if (currentInput === '0') {
                currentInput = number === '+' || number === '-' ? number : number;
            } else if ('+-*/^'.includes(lastChar) && (number === '+' || number === '-')) {
                currentInput = currentInput.slice(0, -1) + number;
            } else {
                currentInput += number;
            }
        }
    }
    updateDisplay();
}

function calculate() {
    try {
        const openCount = (currentInput.match(/\(/g) || []).length;
        const closeCount = (currentInput.match(/\)/g) || []).length;
        const missingClosingBrackets = openCount - closeCount;
        if (missingClosingBrackets > 0) {
            currentInput += ')'.repeat(missingClosingBrackets);
        }

        let evalInput = currentInput
            .replace(/(\d)([a-zA-Z])/g, '$1*$2')
            .replace(/,/g, '.')
            .replace(/\^/g, '**')
            .replace(/pi/g, Math.PI);

        evalInput = evalInput.replace(/\|([^|]+)\|/g, 'Math.abs($1)');

        const result = eval(evalInput);

        if (!resultComputed) {
            addToHistory(`${currentInput} = ${result}`);
        }

        currentInput = result.toString();
        resultComputed = true;
        highlightResult();
    } catch (error) {
        console.error("Błąd obliczeń:", error);
        currentInput = 'ERROR';
        resultComputed = false;
    }
    updateDisplay();
}

// Aktualizowanie wyświetlacza
function updateDisplay() {
    const display = document.getElementById('display');
    display.value = currentInput || '0';
}

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

// Funkcja do animacji fade in i przesunięcia
window.onload = function () {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
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

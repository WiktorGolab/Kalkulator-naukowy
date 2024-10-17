let currentInput = '0'; // Ustawienie wyświetlacza na 0 przy załadowaniu
let history = []; // Tablica do przechowywania historii obliczeń
let resultComputed = false; // Flaga do śledzenia, czy wynik został obliczony

// Sprawdzenie lokalnego storage dla trybu ciemnego
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode'); // Aktywuj tryb ciemny
}

function appendNumber(number) {
    // Resetowanie wyświetlacza po uzyskaniu wyniku
    if (resultComputed) {
        currentInput = number === ',' ? '0,' : number; // Reset do '0,' jeśli to przecinek
        resultComputed = false; // Resetowanie flagi
    } else {
        // Jeżeli użytkownik wciśnie przecinek
        if (number === ',') {
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


// Funkcja do obliczeń
function calculate() {
    try {
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


// Funkcja do dodawania operatorów
function appendOperator(operator) {
    // Resetowanie wyświetlacza po uzyskaniu wyniku
    if (resultComputed) {
        currentInput = operator; // Ustawienie na operator bez 0
        resultComputed = false; // Resetowanie flagi
    } else {
        // Jeśli końcówka aktualnego wyrażenia to operator
        if ('+-*/^'.includes(currentInput[currentInput.length - 1])) {
            // Zamień ostatni operator na nowy
            currentInput = currentInput.slice(0, -1) + operator;
        } else {
            currentInput += operator; // Dodaj operator do aktualnego wyrażenia
        }
    }
    updateDisplay(); // Upewnij się, że wyświetlacz jest aktualizowany
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
    const result = Math.sqrt(parseFloat(currentInput.replace(',', '.')));
    addToHistory(`√(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resultComputed = true;
    updateDisplay();
}

function sin() {
    const result = Math.sin(parseFloat(currentInput.replace(',', '.') * Math.PI / 180));
    addToHistory(`sin(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resultComputed = true;
    updateDisplay();
}

function cos() {
    const result = Math.cos(parseFloat(currentInput.replace(',', '.') * Math.PI / 180));
    addToHistory(`cos(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resultComputed = true;
    updateDisplay();
}

function tan() {
    const result = Math.tan(parseFloat(currentInput.replace(',', '.') * Math.PI / 180));
    addToHistory(`tg(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resultComputed = true;
    updateDisplay();
}

function ctg() {
    const x = parseFloat(currentInput.replace(',', '.') * Math.PI / 180);
    if (Math.tan(x) === 0) {
        alert("ctg(0) jest nieskończonością");
        return;
    }
    const result = 1 / Math.tan(x);
    addToHistory(`ctg(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resultComputed = true;
    updateDisplay();
}

function log() {
    const result = Math.log10(parseFloat(currentInput.replace(',', '.')));
    addToHistory(`log(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resultComputed = true;
    updateDisplay();
}

function factorial() {
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
    if (currentInput === '0' || '+-*/^'.includes(currentInput[currentInput.length - 1])) {
        currentInput += '(';
    } else {
        currentInput += '*(';
    }
    updateDisplay();
}

function closeParenthesis() {
    const openCount = (currentInput.match(/\(/g) || []).length;
    const closeCount = (currentInput.match(/\)/g) || []).length;

    if (openCount > closeCount) {
        currentInput += ')';
    }
    updateDisplay();
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
        .replace(/pi/g, 'π')  // Zamiana 'pi' na 'π'
        .replace(/\*/g, '×')  // Zamiana '*' na '×'
        .replace(/\//g, '÷');  // Zamiana '/' na '÷'

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

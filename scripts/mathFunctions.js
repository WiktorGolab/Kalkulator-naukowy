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
    try {
        // Przekształca currentInput na liczbę i liczy wartość bezwzględną
        const number = parseFloat(currentInput.replace(',', '.'));
        const result = Math.abs(number);
        addToHistory(`|${currentInput}| = ${result}`);
        currentInput = result.toString();
        resultComputed = true;
        updateDisplay();
    } catch (error) {
        console.error("Błąd obliczeń wartości bezwzględnej:", error);
        currentInput = 'ERROR';
        resultComputed = false;
        updateDisplay();
    }
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

function appendPi() {
    // Dodanie pi do aktualnego wejścia
    if (currentInput === '0' || '+-*/^'.includes(currentInput[currentInput.length - 1]) || currentInput[currentInput.length - 1] === '(') {
        currentInput += 'pi'; // Dodaj pi bez mnożenia, jeśli to nowe wyrażenie
    } else {
        currentInput += '*pi'; // Dodaj mnożenie przed pi
    }
    updateDisplay();
}
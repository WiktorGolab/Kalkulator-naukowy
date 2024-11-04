# Kalkulator JavaScript
To jest prosty kalkulator stworzony w JavaScript, który obsługuje podstawowe operacje matematyczne, funkcje specjalne, a także tryb ciemny oraz historię obliczeń. Kalkulator jest przyjazny dla użytkownika i intuicyjny w obsłudze. Projekt nie jest w pełni skończony.

## Funkcje
1. **Podstawowe Operacje**
   - Dodawanie (`+`)
   - Odejmowanie (`-`)
   - Mnożenie (`×`)
   - Dzielenie (`÷`)
   - Potęgowanie (`x^y`)

2. **Specjalne Funkcje**
   - Pierwiastek kwadratowy (`√x`)
   - Sinus kąta (`sin`)
   - Cosinus kąta (`cos`)
   - Tangens kąta (`tg`)
   - Cotangens kąta (`ctg`)
   - Logarytm dziesiętny (`log`)
   - Silnia (`n!`)
   - Wartość bezwzględna (`|x|`)

3. **Działania na Nawiasach**
   - Umożliwia korzystanie z nawiasów w celu określenia kolejności działań.

4. **Historia Obliczeń**
   - Zapisuje każde działanie w historii, którą można zapisać do pliku tekstowego.

5. **Tryb Ciemny**
   - Umożliwia włączenie lub wyłączenie trybu ciemnego.

6. **Resetowanie i Usuwanie**
   - Możliwość zresetowania kalkulatora oraz usunięcia ostatnich znaków.

7. **Obliczanie Wyników**
   - Umożliwia obliczenie wyniku po wprowadzeniu wyrażenia.

8. **Obsługa Błędów**
   - Informuje o błędach wyświetlając komunikat `ERROR`.

## Instrukcje Obsługi

### 1. Podstawowe Operacje
Wprowadź cyfry klikając odpowiednie przyciski numeryczne (0-9). Możesz używać przecinka `,` do wprowadzania liczb dziesiętnych.

### 2. Specjalne Funkcje
Aby wprowadzić liczbę pi (π), naciśnij przycisk `π`. Kalkulator automatycznie doda znak mnożenia, jeśli to konieczne.

### 3. Działania na Nawiasach
- Otwieranie nawiasu: `(`
- Zamykanie nawiasu: `)` (tylko jeśli liczba otwartych nawiasów jest większa niż zamkniętych)

### 4. Historia Obliczeń
Kalkulator zapisuje każde wykonane działanie w historii obliczeń. Możesz zapisać historię jako plik tekstowy klikając przycisk **Zapisz historię**.

### 5. Tryb Ciemny
Możesz włączyć lub wyłączyć tryb ciemny klikając przycisk **Tryb Ciemny**.

### 6. Resetowanie i Usuwanie
Użyj przycisku **C**, aby zresetować ekran kalkulatora do wartości `0`. Aby usunąć ostatnio wprowadzone znaki, użyj przycisku usuwania (`←`).

### 7. Obliczanie Wyników
Po wprowadzeniu wyrażenia naciśnij przycisk **=** aby obliczyć wynik.

### 8. Obsługa Błędów
W przypadku błędnych działań kalkulator wyświetli komunikat `ERROR`.

## Instalacja
Umieść wszystkie pliki w tym samym folderze. Aby uruchomić kalkulator, wystarczy otworzyć plik HTML w przeglądarce internetowej. Możesz również zaimplementować go w swoim projekcie webowym, dodając odpowiedni kod HTML, CSS i JavaScript.

## Użycie
1. Otwórz kalkulator w przeglądarce.
2. Wprowadź dane, wybierz operacje, a następnie kliknij przycisk **=**.
3. Możesz zapisać historię obliczeń do pliku tekstowego.

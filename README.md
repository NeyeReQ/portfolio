# NeyeR Portfolio

Statyczne portfolio przygotowane do publikacji w GitHub Pages. Nie wymaga płatnego hostingu, serwera aplikacyjnego ani bazy danych.

## Struktura

- `index.html` — strona główna, opis, kontakt i wybór działu portfolio.
- `graphics.html` — osobna podstrona grafiki z filtrami kategorii.
- `editing.html` — osobna podstrona montażu z filtrami kategorii.
- `portfolio-data.json` — kategorie i prace. Plik jest publiczny, nie umieszczaj w nim danych prywatnych.
- `assets/projects/` — miejsce na dodane grafiki, miniatury i filmy.
- `admin-local.html` — lokalny panel zarządzania treścią.
- `site.js`, `portfolio-page.js`, `admin-local.js` — logika strony i panelu.

## Publikacja przez GitHub Pages

1. Umieść zawartość folderu `neyer-portfolio` w repozytorium GitHub.
2. W repozytorium otwórz **Settings → Pages**.
3. Wybierz publikację z gałęzi `main` i katalogu `/ (root)`.
4. Zaznacz wymuszanie HTTPS, gdy opcja będzie dostępna.
5. Poczekaj na zakończenie wdrożenia GitHub Pages.

GitHub Pages publikuje statyczne pliki HTML, CSS i JavaScript. Nie uruchamia PHP/Python/Ruby po stronie serwera i nie daje możliwości bezpiecznego ukrycia tokenu w publicznym JavaScripcie.

## Zarządzanie treścią — bez grzebania w kodzie

1. Otwórz adres `https://TWOJ-NICK.github.io/NAZWA-REPO/admin-local.html` w Chrome lub Edge.
2. Kliknij **Wybierz folder projektu** i wskaż lokalny folder sklonowany z GitHuba, zawierający `index.html` oraz `portfolio-data.json`.
3. Dodawaj/usuwaj kategorie, realizacje, grafiki i filmy w panelu. Panel zapisuje `portfolio-data.json` i pliki do `assets/projects/` bezpośrednio w wybranym folderze komputera.
4. Otwórz GitHub Desktop, sprawdź zmiany, wykonaj **Commit to main**, a następnie **Push origin**.
5. Po wdrożeniu GitHub Pages nowe kategorie i prace będą widoczne dla odwiedzających.

### Ważne zasady bezpieczeństwa

- Panel lokalny nie zawiera tokenu GitHub, hasła ani klucza API.
- Nie wysyła zawartości folderu do zewnętrznego serwera. Wybierasz lokalny folder, a zapis odbywa się na Twoim komputerze.
- `admin-local.html` nie jest logowaniem do GitHuba i nie jest prywatnym panelem online. Osoba odwiedzająca jego adres może zobaczyć interfejs, ale nie otrzyma dostępu do Twojego repozytorium; może edytować wyłącznie folder, który sama wskaże i któremu sama udzieli uprawnień w przeglądarce.
- Nie dodawaj haseł, tokenów, danych osobowych klientów ani prywatnych materiałów do publicznego repozytorium.
- 100% gwarancji braku ataku DDoS lub awarii nie da się zapewnić. GitHub Pages ogranicza ryzyko utrzymywania własnego serwera, ale nadal podlega limitom i mechanizmom ochrony GitHuba.

## Multimedia

- Obrazki najlepiej zapisywać jako WebP/JPG/PNG i optymalizować przed dodaniem.
- Filmy kompresuj do MP4/H.264 lub WebM. Duże filmy szybko zwiększają rozmiar repozytorium i transfer strony; panel ostrzega przy plikach większych niż 100 MB.
- Usunięcie pracy/kategorii usuwa jej wpis z katalogu portfolio. Pliki multimedialne pozostają w `assets/projects/`, aby uniknąć przypadkowego skasowania pliku używanego w innym wpisie. Niepotrzebne pliki można usunąć osobno.

## Kategorie domyślne

Grafika: Grafika 3D, Banery, Overlay, Awatary, Miniaturki i plakaty, Nagłówki, Przeróbka zdjęcia na ilustrację, Logo.

Montaż: Odcinki, Wstawki, Animacje, Przejścia.

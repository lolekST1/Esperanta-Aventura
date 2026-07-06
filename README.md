# 🦊 Esperanta Aventuro

Gra edukacyjna do nauki esperanta dla dziecka w wieku 5–7 lat.
Nauka przez zabawę i kontekst — **żadnych quizów, list słówek ani tłumaczeń**.
Słowa poznaje się przez działanie w świecie gry: lis Vulpo mówi *„Trovu la pomon!"*,
dziecko stuka w jabłko, świat reaguje, spadają gwiazdki, słówko trafia do albumu.

## ▶️ Jak uruchomić

Gra to czysta aplikacja webowa (PWA) — **zero instalacji, zero budowania**:

```bash
# dowolny serwer statyczny, np.:
python3 -m http.server 8000
# → otwórz http://localhost:8000 (najlepiej na telefonie)
```

Docelowo: hosting na GitHub Pages / Netlify / Vercel. Po pierwszym otwarciu
gra działa **w pełni offline** (service worker) i można ją "zainstalować"
na ekranie głównym telefonu jak zwykłą aplikację.

## 🧭 Decyzja techniczna (i dlaczego nie Godot)

Rozważane opcje: Godot 4, Web/PWA, Unity, hybryda (Web MVP → Godot).

**Wybrano: Web/PWA (HTML + CSS + vanilla JS, bez frameworka i bez build stepu) — także docelowo, nie tylko na MVP.**

Uzasadnienie:

| Kryterium | Web/PWA | Godot 4 |
|---|---|---|
| Czas do pierwszej grywalnej wersji | godziny | dni |
| Testowanie na telefonie dziecka | otwarcie linku | eksport APK + instalacja |
| Iteracja z udziałem dziecka (kluczowa!) | natychmiastowa | wolna |
| Tap, animacje, dźwięk, TTS | w pełni wystarczające | wystarczające |
| Offline + ikona na ekranie głównym | tak (PWA) | tak |
| Fizyka, shadery, złożone sceny | słabsze | mocne |

Ta gra to **stukanie w duże obiekty + proste animacje + dźwięk**. To nie wymaga
silnika gier. Plan „Web MVP, potem przepisanie na Godota" oznacza podwójną pracę
bez realnego zysku — przepisujemy tylko, jeśli kiedyś zabraknie możliwości webu
(np. zaawansowane minigry zręcznościowe). Unity odrzucone jako przerost formy.

Dodatkowy argument: **Web Speech API** daje darmowy TTS. Głosy esperanckie są
rzadkie, ale polska fonetyka jest niemal identyczna z esperancką — polski głos
systemowy czyta esperanto zaskakująco poprawnie (fallback: eo → pl → domyślny).
W fazie 2 i tak planowane są nagrania lektorskie.

## 🏗️ Architektura

```
index.html            # wszystkie ekrany (start, gra, wygrana, vortaro)
css/style.css         # mobile-first, cele dotykowe ≥ 60 px, animacje CSS
js/
  main.js             # bootstrap, obsługa ekranów, rejestracja SW
  game.js             # silnik pętli gry (niezależny od treści!)
  audio.js            # TTS (Web Speech) + efekty (Web Audio, syntetyzowane)
  data/zones.js       # ★ CAŁA treść gry: strefy, NPC, zadania, słówka
sw.js                 # cache offline
manifest.webmanifest  # instalacja PWA, blokada orientacji portrait
assets/icon.svg       # ikona
```

Kluczowa zasada: **silnik nie zna żadnych słówek**. `game.js` wykonuje pętlę
„instrukcja → interakcja → reakcja → nagroda" na danych ze `zones.js`.
Dodanie strefy, słówka czy zadania **nie wymaga zmian w silniku**.

### Model danych zadania

```js
{
  instruction: "Trovu la pomon!",          // co mówi NPC
  objects: [{ id: "pomo", emoji: "🍎" }],  // co widać na scenie
  correct: "pomo",                          // poprawny obiekt
  reward: { word: "pomo", emoji: "🍎" }     // słówko do albumu Vortaro
}
```

## 🎮 Pętla gry (MVP — strefa Fruktejo)

1. NPC Vulpo 🦊 mówi instrukcję (dymek + TTS, przycisk 🔊 powtarza)
2. Na scenie 3 duże owoce w losowej kolejności
3. Trafienie → fanfary, animacja, spadające gwiazdki ⭐, słówko do Vortaro 📖
4. Pomyłka → łagodne „Provu denove!", obiekt się kiwa, **zero kary**, instrukcja wraca
5. Po 6 zadaniach (owoce + kolory) ekran „Bonege!" i możliwość powtórki

Postęp (gwiazdki, zebrane słówka) zapisuje się w `localStorage`.

## 🗺️ Roadmapa

**Faza 1 (✅)** — grywalne MVP: Fruktejo, Vulpo, 6 zadań
(pomo/banano/piro + ruĝa/flava/verda), gwiazdki, Vortaro, TTS, offline PWA.

**Faza 2 (✅ w większości)** — wybór stref i nowe światy
- ✅ mapa wyspy Esperantio jako ekran wyboru stref (odblokowywanie po kolei)
- ✅ strefa Vilaĝo 🏡 z misiem Urso (dom, jedzenie, granda/malgranda przez skalę obiektów)
- ✅ strefa Arbaro 🌳 z papugą Papago (zwierzęta, czasowniki ruchu — obiekty *animowane*: „Tuŝu la saltantan beston!")
- ✅ zapis postępu per strefa (gwiazdki, ukończenie)
- ⬜ nagrania lektorskie zamiast TTS (pliki mp3 per fraza, mapowane w `zones.js`)

**Faza 3 — głębia mechanik: słowa jako umiejętności**
- zebrane słówka odblokowują akcje w świecie (akvo → podlewanie, ruĝa → czerwone drzwi)
- nowe typy zadań w silniku: `tap` (jest), `drag` (Donu la pomon al Urso), `sequence` (Unue... poste...)
- kolejne NPC z osobowościami: 🐻 Urso (wolny, jedzenie), 🦜 Papago (powtarzanie), 🦉 Strigo (zagadki)

**Faza 4 — pełna gra**
- Marbordo 🏖️ (pogoda, emocje), Kastelo 🏰 (dłuższe zdania, zadania wieloetapowe)
- adaptacyjne powtórki: słówka z pomyłkami wracają częściej (niewidoczne spaced repetition)
- opcjonalnie: rozpoznawanie mowy (dziecko odpowiada głosem), tryb rodzica z podglądem postępów

### Jak dodać nowe treści

- **Nowe zadanie/słówko**: dopisz obiekt do `tasks` w `js/data/zones.js`
- **Nowa strefa**: dodaj wpis do `ZONES` (NPC, frazy, zadania) — silnik obsłuży resztę
- **Nowy typ interakcji**: dodaj pole `type` w zadaniu i gałąź w `game.js`

## 🎨 Zasady projektowe

- cele dotykowe ≥ 60 px, jedna czynność na ekran, brak tekstu wymagającego czytania
- NPC mówi **wyłącznie po esperancku**; interfejs oparty na ikonach
- sukces = celebracja; porażka = tylko łagodna zachęta (bez pasków życia, timerów, punktów ujemnych)
- grafika: emoji jako placeholdery → docelowo prosty, przyjazny styl kreskówkowy

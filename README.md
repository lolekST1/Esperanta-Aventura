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
  type: "tap",                              // "tap" (domyślnie) | "drag" | "sequence"
  instruction: "Trovu la pomon!",          // co mówi NPC
  objects: [{ id: "pomo", emoji: "🍎" }],  // co widać na scenie
  correct: "pomo",                          // poprawny obiekt (tap/drag)
  sequence: ["pomo", "banano"],             // kolejność stuknięć (tylko "sequence")
  reward: { word: "pomo", emoji: "🍎" }     // słówko do albumu Vortaro
}
```

Typy interakcji:
- **tap** — stuknij poprawny obiekt (klasyka)
- **drag** — przeciągnij poprawny obiekt NA NPC („*Donu la panon al Urso!*");
  upuszczenie obok = ciche wślizgnięcie z powrotem (zero kary), sam tap = powtórzenie instrukcji
- **sequence** — stuknij obiekty w zadanej kolejności („*Unue tuŝu la sunon, poste la lunon!*");
  dobry krok zostaje podświetlony ✔, pomyłka łagodnie zeruje postęp

### Słowa jako umiejętności (`zone.skill`)

Zebrane słówko odblokowuje **akcję w świecie**. Na scenie strefy wisi okrągły
przycisk: pokazuje ❓ dopóki dziecko nie zna wymaganego słowa, a po jego
nauczeniu — emoji akcji (pulsuje). Akcja to mała scenka przemiany
(np. 🌱→🌳) z nagrodą-słówkiem za pierwsze użycie; kolejne stuknięcia
powtarzają samą scenkę (dzieci kochają powtórki):

```js
skill: {
  word: "akvo",              // wymagane słówko z Vortaro
  emoji: "🪣",                // przycisk akcji po odblokowaniu
  before: "🌱", after: "🌳",  // scenka przemiany
  line: "Vi konas la vorton akvo! Akvu la arbeton!",
  praise: "Rigardu! La arbeto kreskis!",
  lockedLine: "Ŝŝŝ... tio estas sekreto. Lernu pli da vortoj!",
  reward: { word: "arbo", emoji: "🌳" },   // słówko za pierwsze użycie
}
```

Słowa-klucze są **międzystrefowe** (ruĝa z Fruktejo otwiera drzwi w Vilaĝo,
akvo z Monto podlewa drzewko w Fruktejo...) — dają powód, by wracać do
ukończonych stref. Na mapie strefa z nowo odblokowaną, nieużytą akcją
dostaje iskierkę ✨ i pulsuje (`save.skillsDone` per strefa).

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
  — **notatka z testów (2026-07-07):** darmowe głosy przeglądarki (Web Speech
    API) są niespójne między urządzeniami i wymagają transliteracji-obejść
    (patrz `js/audio.js`); test z OpenAI TTS wykazał, że głosy **Cedar, Marin
    i Nova** poprawnie wymawiają esperanckie testowe słowa (sciuro, birdo,
    hundino) bez żadnych sztuczek. Jeśli nagrania lektorskie nie wejdą od
    razu, wygenerowanie fraz przez OpenAI TTS (jednorazowo, offline, jako
    pliki mp3) tymi głosami może być szybszą drogą do dobrej wymowy niż
    dalsze łatanie Web Speech API

**Faza 2.5 (✅)** — fabuła, personalizacja i żywe audio
- ✅ bajka wprowadzająca: lot balonem na wyspę Esperantio (powtarzalna z mapy 📜)
- ✅ wybór własnej postaci (awatar towarzyszy dziecku w HUD i na ekranach wygranej)
- ✅ spersonalizowane głosy NPC (rate/pitch: Vulpo szybki i wysoki, Urso wolny i niski, Papago skrzekliwy)
- ✅ tempo gry sterowane mową — kwestie wybrzmiewają do końca, celebracje mają czas na animacje (taniec NPC, konfetti, wejście NPC na scenę)
- ✅ lepsza wymowa TTS: preferencja głosów eo→pl→hr/sk/cs/it/es (nigdy angielski, gdy jest alternatywa) + transliteracja esperanta na polską ortografię dla głosu pl
- ✅ prawdziwa mapa wyspy: SVG-owa wyspa (plaża + ląd), przerywana ścieżka łącząca strefy w kolejności `ZONE_ORDER`, awatar dziecka fizycznie chodzi między znacznikami stref (animacja spaceru, pozycja zapamiętywana między sesjami — `js/map.js`, współrzędne w `zone.map` w `zones.js`)
- ✅ miniopowiastki per strefa: NPC po powitaniu tłumaczy, po co prosi o pomoc (`zone.story` w `zones.js`) — gra się raz, przy pierwszym wejściu do strefy (`save.storiesSeen`), przy kolejnych wizytach pomijana
- ✅ zamknięta pętla fabularna: `winText` każdej strefy nawiązuje wprost do celu z `story` (Vulpo dziękuje za pełny koszyk, Urso za znalezione jedzenie, zwierzęta w Arbaro są odnalezione)
- ✅ ożywiona mapa: znacznik nieodwiedzonej, odblokowanej strefy delikatnie pulsuje (zaproszenie do stuknięcia), każdy znacznik pokazuje też twarz NPC danej strefy
- ✅ wielki finał wyspy: po ukończeniu WSZYSTKICH obecnych stref — jednorazowy ekran świętowania z całą obsadą NPC i awatarem, zapowiedź kolejnych przygód (`save.islandCelebrated`)

**Faza 3 (✅) — głębia mechanik: słowa jako umiejętności**
- ✅ zebrane słówka odblokowują akcje w świecie (`zone.skill`): ruĝa → czerwone
  drzwi Urso (🎁), pano → karmienie ptaków w Arbaro (🎶), akvo → podlewanie
  drzewka Vulpo (🌳), flugi → nocny lot ze Strigo (🌌); klucze są międzystrefowe,
  a mapa iskierką ✨ pokazuje, gdzie czeka świeżo odblokowana akcja
- ✅ nowe typy zadań w silniku: `tap` (był), `drag` („Donu la panon al Urso!" —
  przeciąganie obiektu na NPC, pointer capture, zero kary za upuszczenie obok),
  `sequence` („Unue tuŝu la sunon, poste la lunon!" — stukanie w kolejności)
- ✅ nowy NPC z osobowością: 🦉 Strigo (mądry, spokojny, mówi „hu-hu", zadaje
  zagadki opisujące cechami: „Ĝi estas granda kaj alta...") w nowej strefie
  Monto 🏔️ (luno/suno/stelo/akvo/monto/nokto + zagadki używające już znanych
  słów granda i flugi)

**Faza 4 — pełna gra**
- Marbordo 🏖️ (pogoda, emocje), Kastelo 🏰 (dłuższe zdania, zadania wieloetapowe)
- adaptacyjne powtórki: słówka z pomyłkami wracają częściej (niewidoczne spaced repetition)
- opcjonalnie: rozpoznawanie mowy (dziecko odpowiada głosem), tryb rodzica z podglądem postępów

### Jak dodać nowe treści

- **Nowe zadanie/słówko**: dopisz obiekt do `tasks` w `js/data/zones.js`
  (z `type: "drag"` lub `"sequence"`, jeśli ma być inne niż stuknięcie)
- **Nowa strefa**: dodaj wpis do `ZONES` (NPC, frazy, zadania, `map: {x, y}` — pozycja na wyspie w %) i dopisz jej id do `ZONE_ORDER` — mapa i ścieżka narysują się same
- **Nowa akcja-słowo**: dodaj `skill` do strefy (patrz wyżej) — przycisk,
  blokada i iskierka na mapie zadziałają same
- **Nowy typ interakcji**: dodaj pole `type` w zadaniu i gałąź w `game.js`

## 🎨 Zasady projektowe

- cele dotykowe ≥ 60 px, jedna czynność na ekran, brak tekstu wymagającego czytania
- NPC mówi **wyłącznie po esperancku**; interfejs oparty na ikonach
- sukces = celebracja; porażka = tylko łagodna zachęta (bez pasków życia, timerów, punktów ujemnych)
- grafika: emoji jako placeholdery → docelowo prosty, przyjazny styl kreskówkowy

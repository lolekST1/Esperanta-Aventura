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
- ✅ nagrania lektorskie przez OpenAI TTS — WYGENEROWANE dla wszystkich
  197 kwestii gry (patrz sekcja „🎙️ Nagrania lektorskie (OpenAI TTS)"
  niżej). Web Speech zostaje jako fallback (na wypadek braku pliku albo
  błędu odtwarzania), ale w normalnych warunkach gra mówi już nagranymi
  głosami

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
- ✅ akcje specjalne wymagają dotyku dziecka (nic nie dzieje się samo —
  scena "before" czeka bezczynnie, dopóki dziecko jej nie stuknie),
  numerki kolejności (1, 2, 3...) zamiast ticków w zadaniach sekwencji,
  duszek ręki demonstrujący pierwsze zadanie każdego typu (tap/drag/
  sequence) powtarza gest w kółko, dopóki dziecko go samo nie wykona,
  a znacznik strefy z gotowym do odkrycia sekretem skrzy się gwiazdkami

**Faza 4 (w trakcie) — pełna gra**
- ✅ Marbordo 🏖️ — NPC 🦀 Kankro (żywiołowy, "Klik-klik!"), słownictwo
  pogody i emocji (pluvo/vento/nubo/ĉielarko/feliĉa/trista + drag + sequence),
  skill "nokto" (uczony w Monto) odsłania gwiaździste niebo nad morzem
- ✅ Kastelo 🏰 — NPC 🐉 Drako (głęboki, dramatyczny, "Ha!"), dłuższe zdania
  („Tuŝu la altan turon!" — nowe przymiotniki alta/malalta w stylu skali
  granda/malgranda), zadanie wieloetapowe: sekwencja na 3 kroki zamiast 2
  („Unue tuŝu la ŝlosilon, poste la pordon, fine la kronon!" — z przypomnieniem
  „pordo" z Vilaĝo), skill "helpi" (uczony w Marbordo) otwiera sekretną komnatę
- ✅ Ĉielo 🌌 — NPC ☁️ Nubeto (miękka, rozmarzona, "Puf-puf!"), słownictwo
  nieba i przedmiotów latających (kajto/balono/aviadilo/fulmo), nowy typ zadania
  „kaŝludo" (memory game — obiekty widać przez chwilę, potem się chowają,
  dziecko stuka z pamięci), skill "trezoro" (uczony w Kastelo) odkrywa
  ukrytą tęczę w chmurach.
  Wyspa ma teraz 7 stref — mapa, kolejność odblokowania i finał (8 postaci:
  awatar + 7 NPC) objęły ją automatycznie, bez zmian w silniku
- ✅ adaptacyjne powtórki: każda pomyłka podbija licznik `save.mistakes[słowo]`;
  po wyczerpaniu zwykłych zadań strefy silnik niewidocznie dokłada do 2 zadań
  odpowiadających najczęściej mylonym słówkom — z DOWOLNEJ strefy, nie tylko
  bieżącej (generyczny indeks słowo → zadanie budowany raz ze wszystkich
  `ZONES`). Dziecko widzi zwykłe kolejne "Trovu la...!", bez żadnego oznaczenia
  "to jest powtórka". Poprawna odpowiedź na powtórkę zeruje licznik (słówko
  przestaje wracać, dopóki znów się nie pomyli) — silnik wciąż nie zna żadnych
  KONKRETNYCH słówek, tylko generycznie operuje na polu `reward.word`
- opcjonalnie: rozpoznawanie mowy (dziecko odpowiada głosem), tryb rodzica z podglądem postępów

### Jak dodać nowe treści

- **Nowe zadanie/słówko**: dopisz obiekt do `tasks` w `js/data/zones.js`
  (z `type: "drag"` lub `"sequence"`, jeśli ma być inne niż stuknięcie)
- **Nowa strefa**: dodaj wpis do `ZONES` (NPC, frazy, zadania, `map: {x, y}` — pozycja na wyspie w %) i dopisz jej id do `ZONE_ORDER` — mapa i ścieżka narysują się same
- **Nowa akcja-słowo**: dodaj `skill` do strefy (patrz wyżej) — przycisk,
  blokada i iskierka na mapie zadziałają same
- **Nowy typ interakcji**: dodaj pole `type` w zadaniu i gałąź w `game.js`

## 🎙️ Nagrania lektorskie (OpenAI TTS)

Web Speech API (darmowe głosy przeglądarki) działa jako fallback zawsze
dostępny, ale bywa niespójne między urządzeniami i wymaga transliteracji-
-obejść (patrz komentarze w `js/audio.js`). Gra używa więc gotowych nagrań
mp3, wygenerowanych raz, offline, przez OpenAI TTS — testy wykazały, że
głosy **Marin, Nova, Sage i Coral** poprawnie wymawiają esperanckie słowa
testowe (sciuro, birdo, hundino) bez żadnych sztuczek; **Shimmer, Cedar i
Verse odrzucone** po odsłuchu (gorsza wymowa esperanckich skupisk
spółgłosek, np. „sciuro" czytane jak angielskie „sh..."). Wyjątek: smok
Drako dostał głos **Onyx** (żaden ze zweryfikowanych głosów nie brzmiał
jak głęboki, dramatyczny smok) — jeszcze niepotwierdzony odsłuchem.

**Jak to działa:**

1. `tools/generate-tts.mjs` zbiera WSZYSTKIE unikalne kwestie wypowiadane
   w grze (powitania NPC, historyjki, instrukcje zadań, frazy sukcesu/
   pomyłki, teksty umiejętności, słówka-nagrody, bajka wprowadzająca, kilka
   stałych fraz interfejsu) — bezpośrednio z `js/data/zones.js` i
   `js/data/story.js`, więc nie trzeba niczego wypisywać ręcznie. Przed
   wysłaniem do API tekst przechodzi `preprocessEsperantoForTTS()` —
   rozbija myślnikiem trudne skupiska spółgłosek (`sc→s-ts`, `kn→k-n`,
   `gn→g-n`, `pn→p-n`, `ps→p-s`, `mn→m-n`) i ziew samogłoskowy
   (`i([aeou])→i-$1`, np. „papilio"→„papili-o") — bez tego model bywa
   skłonny czytać je jak angielskie odpowiedniki. Do zapytania dołączona
   jest też szczegółowa instrukcja esperanckiej fonetyki (`instructions`,
   działa z modelem `gpt-4o-mini-tts`).
2. Każdy z 6 NPC (+ narrator + osobny profil dla wolno wymawianych słówek-
   -nagród) ma przypisany jeden ze zweryfikowanych głosów OpenAI,
   różnicowany tempem i stylem (`ROLES` w skrypcie) — sam skrypt woła
   `POST https://api.openai.com/v1/audio/speech` (model `gpt-4o-mini-tts`
   domyślnie) i zapisuje wynik jako `assets/audio/<rola>-<hash>.mp3`.
3. Wynikowa mapa `(tempo, wysokość, tekst) → ścieżka pliku` trafia do
   `js/data/audioManifest.js`. `js/audio.js` sprawdza ten manifest w
   `speak()`: jeśli jest nagranie — odtwarza je (`<audio>`); jeśli nie ma,
   albo odtwarzanie się nie powiedzie (brak pliku, błąd sieci) — **zawsze**
   przezroczyście spada na dotychczasową syntezę Web Speech. Gra nigdy nie
   wymaga nagrań, żeby działać.

**Uwaga o generacjach TTS:** OpenAI TTS czasem zwraca niemal ciche nagranie
dla pojedynczego, krótkiego słowa (zdarzyło się to raz dla „dormi" —
zmierzona amplituda ~0.001 zamiast typowych ~0.3-0.5). Zwykły retry
(usunięcie pliku + ponowne uruchomienie skryptu) naprawia problem. Warto
od czasu do czasu zmierzyć amplitudę wygenerowanych plików (Web Audio
`decodeAudioData` + `getChannelData`), zwłaszcza dla nowych słówek-nagród.

**Uruchomienie** (wymaga Node 18+ i klucza OpenAI):

```bash
OPENAI_API_KEY=sk-... node tools/generate-tts.mjs
# albo najpierw podgląd listy fraz bez wywoływania API:
node tools/generate-tts.mjs --dry-run
```

Bezpieczne do przerwania i ponownego uruchomienia w dowolnym momencie —
pomija kwestie, dla których plik mp3 już istnieje na dysku i jest wpisany
w manifeście, więc generowanie można robić stopniowo, strefa po strefie.
Nowe zadanie/strefa/frazę dopisane później do `zones.js` automatycznie
pojawią się na liście przy kolejnym uruchomieniu skryptu — nic nie trzeba
synchronizować ręcznie poza czterema stałymi frazami interfejsu wypisanymi
wprost w `tools/generate-tts.mjs` (`NARRATOR_UI_LINES`).

## 🎨 Zasady projektowe

- cele dotykowe ≥ 60 px, jedna czynność na ekran, brak tekstu wymagającego czytania
- NPC mówi **wyłącznie po esperancku**; interfejs oparty na ikonach
- sukces = celebracja; porażka = tylko łagodna zachęta (bez pasków życia, timerów, punktów ujemnych)
- grafika: emoji jako placeholdery → docelowo prosty, przyjazny styl kreskówkowy

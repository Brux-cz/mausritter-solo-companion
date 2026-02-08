# Mausritter Solo Companion — Analýza stavu

> Dokument založený na faktech z kódu (17 460 řádků JSX, commit `5e6288d`).
> Všechna čísla řádků odkazují na `mausritter-project/mausritter-solo-companion.jsx`.

---

## ČÁST 1: Technická analýza současného stavu

### 1.1 Architektura

| Vlastnost | Hodnota |
|-----------|---------|
| Hlavní soubor | `mausritter-solo-companion.jsx` — **17 460 řádků** |
| Build systém | `build-html.js` (93 řádků) — vloží JSX do HTML šablony |
| Transpilace | Babel **in-browser** (`babel-standalone` z CDN) |
| UI framework | React 18 + Tailwind CSS (oba z CDN) |
| Cloud sync | Firebase 10.7 compat + Google Drive API v3 |
| Package manager | **Žádný** — žádný `package.json`, žádné npm závislosti |
| Bundler | **Žádný** — žádný Webpack/Vite/esbuild |
| Testy | **Žádné** |
| TypeScript | **Ne** — čistý JSX |

Celá aplikace je **jeden soubor** načítaný přímo prohlížečem. Babel transpiluje JSX za běhu (pomalý start na slabých zařízeních).

### 1.2 Stavové řízení

**Hlavní komponenta `MausritterSoloCompanion`** (ř. 14341–17459):

- **51 useState hooků** na top-level komponentě
- Celkem **165 useState** v celém souboru (dalších 114 v podkomponentách)
- **0 useContext** — žádný Context API
- **0 useReducer** — žádný reducer pattern
- Žádná state management knihovna (Redux, Zustand, Jotai...)

**Props drilling — počty props předávaných do panelů:**

| Panel | Řádky | Počet props |
|-------|-------|-------------|
| **JournalPanel** | 17355–17430 | **22** (vč. inline handler funkcí) |
| **CharacterPanel** | 17278–17299 | **17** |
| **WorldPanel** | 17303–17329 | **14** (vč. inline handler funkcí) |
| **OraclePanel** | 17201–17249 | **13** |
| **EventsPanel** | 17270–17276 | **5** |
| **FactionPanel** | 17333–17337 | **4** |
| **TimePanel** | 17262–17266 | **3** |
| **CombatPanel** | 17252–17258 | **3** |
| **LexikonPanel** | 17341–17347 | **3** |
| **SmallWorldPanel** | 17349–17351 | **1** |

**Důsledek:** Každá změna kteréhokoli z 51 stavů → **re-render celého React stromu** (žádná memoizace, žádný Context pro izolaci).

### 1.3 Datový model

**Save verze:** v4 (konstanta `SAVE_VERSION` na ř. 2025)

**Migrační systém** (ř. 2028–2117):
- v1→v2 (ř. 2030): Konverze single character → parties systém
- v2→v3 (ř. 2052): Přidání settlements a worldNPCs
- v3→v4 (ř. 2062): Standardizace gameTime formátu

**10 hlavních datových polí:**

```
parties[]               — Družiny s členy
├── members[]           — Postavy (PC, hirelings)
│   ├── inventory[]     — Inventář (sloty)
│   ├── stats{}         — STR, DEX, WIL, HP (current/max)
│   └── conditions[]    — Stavy (exhausted, frightened...)
└── gameTime{}          — Herní čas (day, season, watch, turn)
activePartyId           — ID aktivní družiny
activeCharacterId       — ID aktivní postavy
journal[]               — Záznamy deníku (20+ typů)
factions[]              — Frakce s cíli a vztahy
settlements[]           — Osady s NPC referencemi
worldNPCs[]             — Globální NPC
timedEvents[]           — Časované události
lexicon[]               — Lexikon (encyklopedie)
journalPartyFilter      — Filtr deníku (jen v UI, neukládá se)
```

### 1.4 Storage systémy — KRITICKÁ SEKCE

#### Dvě různé funkce pro serializaci dat

| Funkce | Řádek | Použití | timedEvents | lexicon |
|--------|-------|---------|-------------|---------|
| **getGameState()** | 14770 | Firebase sync | ✅ (ř. 14779) | ✅ (ř. 14780) |
| **getSaveData()** | 15168 | GDrive + FileSystem | ❌ **CHYBÍ** | ❌ **CHYBÍ** |
| **handleExport()** | 14625 | Ruční export JSON | ✅ (ř. 14635) | ✅ (ř. 14636) |
| **localStorage save** | 14598 | Auto-save | ✅ (ř. 14607) | ✅ (ř. 14608) |

#### Kompletní tabulka storage kompatibility

| Operace | Funkce | Řádek | parties–worldNPCs | timedEvents | lexicon |
|---------|--------|-------|-------------------|-------------|---------|
| **localStorage save** | useEffect | 14594 | ✅ | ✅ | ✅ |
| **localStorage load** | useEffect | 14556 | ✅ | ✅ (ř. 14579) | ✅ (ř. 14580) |
| **Firebase save** | syncToFirebase | 14804 | ✅ | ✅ | ✅ |
| **Firebase load** | applyGameState | 14784 | ✅ | ✅ | ✅ |
| **GDrive save** | saveToGoogleDrive | 15951 | ✅ | ❌ **CHYBÍ** | ❌ **CHYBÍ** |
| **GDrive load** | loadFromGoogleDrive | 16061 | ✅ | ❌ **CHYBÍ** | ❌ **CHYBÍ** |
| **FileSystem save** | saveToFile | 15181 | ✅ | ❌ **CHYBÍ** | ❌ **CHYBÍ** |
| **FileSystem load** | loadFromFile | 15199 | ✅ | ❌ **CHYBÍ** | ❌ **CHYBÍ** |
| **Ruční export** | handleExport | 14625 | ✅ | ✅ | ✅ |
| **Ruční import** | handleImport | 14655 | ✅ | ❌ **CHYBÍ** | ❌ **CHYBÍ** |

**Příčina:** `getSaveData()` (ř. 15168–15178) vrací jen 7 polí + version + lastModified. Chybí `timedEvents` a `lexicon`. GDrive i FileSystem tuto funkci volají.

**Důsledek:**
- Uživatel používající Google Drive nebo File System API **přijde o timedEvents a lexicon** při každém uložení a načtení
- Ruční import ztratí data, i když export je obsahuje
- Data zůstanou jen v localStorage a Firebase

#### Debounce časy

| Backend | Debounce | Ref proměnná | Řádek |
|---------|----------|-------------|-------|
| localStorage | **0 ms** (synchronní, blokuje UI) | — | 14614 |
| Firebase | **500 ms** | syncToFirebaseRef | 14824 |
| FileSystem | **2 000 ms** | saveTimeoutRef | 15290 |
| Google Drive | **3 000 ms** | googleSaveTimeoutRef | 16092 |

→ Data nikdy nejsou konzistentní mezi backendy ve stejný okamžik.

### 1.5 Multiplayer systém

**Technologie:** Firebase Realtime Database (compat SDK v10.7)

**Room systém** (ř. 14695–15158):
- 6-znakový kód (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, bez 0/O, 1/I)
- 4-ciferný PIN (1000–9999) uložený **plaintextem** ve Firebase (`rooms/{code}/meta/players/{id}/pin`)
- Player ID = hash z `name_pin` (ř. 14710–14720)
- URL join: `#room=XXXXX` (ř. 15148–15158)

**Sync model — last-write-wins:**
- Při každé změně stavu: `stateRef.set(state)` → přepíše **CELÝ stav** v rooms/{code}/state
- Žádné field-level merging, žádné CRDT, žádný OT
- `.on('value')` listener přijme celý snapshot → `applyGameState()` přepíše lokální stav
- Filtr: ignoruje změny od sebe samého (`state._lastModifiedBy !== playerId`)

**500ms timing guard** (ř. 14992–14995):
```
isLoadingFromFirebaseRef.current = true;
applyGameState(remoteState, 'initial');
setTimeout(() => { isLoadingFromFirebaseRef.current = false; }, 500);
```
Chrání proti feedback loopu: bez něj by `applyGameState` triggernul useEffect → `syncToFirebase` → přepsal remote stav zpět. Krehké — závisí na tom, že React zpracuje 51 `setState` volání do 500ms.

**Připojení do místnosti:**
- Lokální data se **kompletně přepíšou** daty z Firebase room (ř. 14986–14995)
- Žádný merge, žádný confirm dialog, žádná záloha

### 1.6 Generátory

**Celkový počet:** ~50 generátorových funkcí v kódu

**3 různé vzory ukládání do deníku:**

| Vzor | Kde | Default | Logika |
|------|-----|---------|--------|
| `silentMode` | OraclePanel (ř. 3105) | `false` (loguje) | `if (!silentMode)` → loguj |
| `logToJournal` | SmallWorldPanel (ř. 14002) | `true` (loguje) | `if (logToJournal)` → loguj |
| přímé volání | CombatPanel, CharacterPanel | vždy | `onLogEntry(entry)` bez podmínky |

**Bug: FloatingDice ignoruje silentMode**
FloatingDice (ř. 13718) má vlastní `quickRoll`, `quickYesNo`, `rollActionTheme` atd. — tyto funkce **vždy** ukládají do deníku přes `onLogEntry` callback. Nemají přístup k `silentMode` z OraclePanel.

**Duplikace: `generateSettlementEvent` existuje 2×:**
- OraclePanel verze (ř. 3504) — obecný generátor, type `'event_settlement'`
- WorldPanel verze (ř. 8380) — specifický pro osadu, type `'event'`, jiná pravděpodobnost komplikace

**Nekonzistentní subtypy záznamů** (příklady z OraclePanel):
`custom_dice`, `yes_no`, `complication`, `consequence`, `altered_scene`, `action_theme`, `frame_scene`, `card`, `narrative`, `encounter`, `creature`, `event`, `event_settlement`, `event_rumor`, `event_wilderness`, `event_action`

SmallWorldPanel přidává: `sensory`, `megastructure`, `loot`, `trap`, `whatis`

Celkem **20+ unikátních subtypů** bez jednotného standardu.

### 1.7 Deník (JournalPanel)

**Definice:** ř. 11428 (dostává 22 props)

**Editace:** `<textarea>` — ne rich text editor
- Max šířka: `max-w-3xl` (768px)
- Font: serif (`font-serif`)
- Formátování: Pouze plain text + @mentions

**@Mentions systém** (ř. 2424–2718):
- Formát: `@[Jméno](typ:id)` → klikatelný odkaz
- Při psaní: autocomplete dropdown s NPC, osadami, lexikonem
- Auto-vytváření Lexikon záznamů z @mentions v textu (ř. 11581–11614)
- Regex pro parsování (ř. 2604): podporuje 3 formáty (přímé ID, lore tagy, jmenné zmínky s českou diakritikou)

**Drag & drop** (ř. 11450–11757):
- HTML5 Drag and Drop API + touch fallback
- Přesouvání záznamů v deníku změnou pořadí v poli
- Vizuální indikátory: dragged = `opacity-50`, drop target = `border-b-2 border-amber-500`

**Inline vkládání:** Tlačítko pro vložení nového záznamu mezi existující

**Autor u záznamů** (ř. 11959–11962):
- Zobrazuje se **pouze v multiplayer módu** (`entry.authorName`)
- Badge: `text-amber-700 bg-amber-100`
- Nastavuje se při vytvoření záznamu (ř. 11571–11572)
- Funguje pro narrative i oracle záznamy — ale jen pokud byl záznam vytvořen v multiplayer session

### 1.8 Scény

**Stav: NEEXISTUJÍ jako systém.**

Existuje pouze jednorázový generátor „Zarámuj scénu" (ř. 3211–3280):
- Hodí d6 na altered scene
- Vygeneruje opening + setting + action + theme
- Pokud altered (5+): přidá komplikaci
- Výstup: jeden záznam v deníku, type `frame_scene`

**Co chybí:**
- Žádné sledování začátku/konce scény
- Žádní účastníci scény
- Žádná eskalace/deeskalace
- Žádný typ scény (boj/průzkum/social/odpočinek)
- Žádný kontext pro generátory (např. „jsi v boji → nabídni bojové akce")

TimeBar (ř. 13502–13712) sleduje den/hlídku/tah, ale ne scény.

### 1.9 Co funguje dobře

- **Migrační systém** (v1→v4) — robustní, sekvenční, s fallbacky (ř. 2028–2117)
- **@Mentions + auto-Lexikon** — elegantní systém s autocomplete a auto-vytvářením záznamů
- **Amber/medieval téma** — konzistentní vizuální styl přes celou aplikaci
- **Firebase presence** — `onDisconnect().remove()` pro sledování online hráčů
- **URL room join** — `#room=XXXXX` pro snadné sdílení
- **FloatingDice widget** — rychlé hody bez přepínání panelů, radiální menu
- **Drag & drop v deníku** — funguje na desktopu i mobilu (touch fallback)
- **TimeBar** — kompaktní sledování herního času s připomínkami setkání a vyčerpání
- **Hireling systém** — generátor kandidátů s dostupností a typovými bonusy
- **Export** — kompletní (všech 10 polí včetně timedEvents a lexicon)

---

## ČÁST 2: Datový tok (textový diagram)

```
Uživatel udělá změnu (např. přidá záznam do deníku)
    ↓
setJournal(prev => [...])  (React state update)
    ↓
useEffect závislosti se spustí (parties, activePartyId, activeCharacterId,
  journal, factions, settlements, worldNPCs, timedEvents, lexicon, roomConnected, roomCode)
    ↓
    ├─→ [A] localStorage.setItem() — OKAMŽITÉ, 0ms, synchronní
    │       Klíč: 'mausritter-save' (sólo) nebo 'mausritter-save-{roomCode}' (MP)
    │       Data: KOMPLETNÍ (všech 10 polí vč. timedEvents + lexicon)
    │       Řádek: 14594–14615
    │
    ├─→ [B] syncToFirebase() — 500ms debounce (pokud roomConnected)
    │       Používá getGameState() → KOMPLETNÍ data (všech 10 polí)
    │       stateRef.set(state) → přepíše CELÝ stav v rooms/{code}/state
    │       Ostatní klienti dostanou snapshot přes .on('value')
    │       → applyGameState() aplikuje celý stav (přeskočí pokud od stejného uživatele)
    │       Řádky: 14804–14825, trigger: 15141–15145
    │
    ├─→ [C] saveToGoogleDrive() — 3000ms debounce (pokud connected)
    │       Používá getSaveData() → ⚠️ CHYBÍ timedEvents, lexicon!
    │       PATCH na files/{id} v Google Drive
    │       Řádky: 15951–16057, trigger: 16088
    │
    └─→ [D] saveToFile() — 2000ms debounce (pokud fileHandle)
            Používá getSaveData() → ⚠️ CHYBÍ timedEvents, lexicon!
            FileSystemFileHandle.createWritable()
            Řádky: 15181–15196, trigger: 15280
```

### Kde se data ztrácí

```
1. UKLÁDÁNÍ: GDrive a FileSystem nikdy neuloží timedEvents/lexicon
   getSaveData() (ř. 15168-15178) → chybí 2 ze 10 polí

2. NAČÍTÁNÍ: Import/Load funkce timedEvents/lexicon neobnoví
   loadFromFile() (ř. 15206-15212) → sety jen 7 polí
   loadFromGoogleDrive() (ř. 16071-16077) → sety jen 7 polí
   handleImport() (ř. 14669-14675) → sety jen 7 polí
   (i když handleExport() je exportuje korektně!)

3. MULTIPLAYER JOIN: Připojení do místnosti přepíše lokální data
   joinRoom() (ř. 14986-14995) → applyGameState(remoteState)
   Žádný merge, žádná záloha, žádný confirm

4. SOUBĚŽNÁ EDITACE: Poslední zápis vyhrává úplně
   Dva hráči editující současně → stateRef.set(CELÝ stav)
   Žádné field-level merging → ztráta změn jednoho hráče
```

---

## ČÁST 3: Vize uživatele (požadavky na budoucnost)

### Scény
- Začátek/konec scény jako explicitní akce
- Typ scény: boj, průzkum, sociální interakce, odpočinek
- Účastníci scény (PC, NPC, tvorové)
- Eskalace/deeskalace tenze
- Kontext pro generátory: „jsi v boji → relevantní výsledky"

### Text editor
- Volný styl psaní jako Obsidian/Notion/Google Docs
- Ne textarea v „chlívcích" s pevnou šířkou 768px
- Rich text: tučné, kurzíva, nadpisy, seznamy
- Inline obrázky a mapy

### Generátory
- Jednotný standard pro všechny generátory
- Každý má možnost „zapsat/nezapsat do deníku"
- Tichý hod + pozdější zápis (roll → review → confirm)
- Žádné duplikace (jedna implementace pro settlement events atd.)

### Mapy
- Kreslení map přímo v aplikaci
- Vkládání obrázků (upload)
- Nahrání existující mapy
- Inspirace: tldraw, Excalidraw

### Multiplayer chat
- Oddělený komunikační kanál od příběhového deníku
- Hráči se baví nezávisle na herních tazích
- OOC (out of character) diskuze bez znečištění deníku

### Autor u všech záznamů
- Ne jen u narrative, ale u všech typů v deníku
- Viditelný i po exportu/importu
- Fungující i v sólo módu (přiřazení k aktivní postavě)

### Profesionální deník
- Plná šířka stránky (ne max 768px)
- Lepší layout a oddělovače mezi sekcemi
- Vizuální kvalita na úrovni publikovatelného dokumentu
- Formátovací nástroje (headings, dividers, emphasis)

---

## ČÁST 4: Univerzální Deep Search prompt

Následující prompt je v angličtině pro lepší výsledky s AI službami. Je připravený ke copy-paste do jakékoli AI služby (ChatGPT, Claude, Gemini, Perplexity, atd.).

---

```
I'm building a solo tabletop RPG companion web app for Mausritter (a mouse-themed OSR RPG).
The app has grown organically to 17,500 lines in a single JSX file with no build tools,
no tests, and no type system. I need to modernize it while keeping it usable for a
non-professional developer (hobbyist).

CURRENT STATE:
- Single JSX file (17,460 lines), in-browser Babel transpilation, no bundler
- React 18 + Tailwind CSS from CDN, Firebase 10.7 compat, Google Drive API v3
- 51 useState hooks on the top-level component, props drilled to 12 panels
  (JournalPanel receives 22 props)
- No Context API, no state management library, no memoization
- Every state change re-renders the entire component tree
- 4 independent storage backends with different data completeness:
  - localStorage (complete, 0ms sync)
  - Firebase Realtime DB (complete, 500ms debounce)
  - Google Drive (MISSING timedEvents + lexicon fields)
  - File System Access API (MISSING timedEvents + lexicon fields)
- Multiplayer: Firebase rooms with last-write-wins full-state replacement,
  500ms timing guard against feedback loops, PINs stored in plaintext
- ~50 generator functions, ~90 data lookup tables, 20+ journal entry subtypes
- 3 different patterns for "log to journal" toggle across panels
- No scene management system (just a one-shot "Frame Scene" generator)
- Journal is textarea-based (no rich text), max-width 768px, serif font
- @mentions system with autocomplete and auto-Lexicon creation

I NEED HELP WITH THESE SPECIFIC AREAS:

1. SYNC / OFFLINE-FIRST ARCHITECTURE
   Problem: 4 storage backends with inconsistent data, no conflict resolution,
   last-write-wins multiplayer, data loss on Google Drive/FileSystem saves.
   Questions:
   - What offline-first sync frameworks exist for web apps? (CRDTs, event sourcing, etc.)
   - How do apps like Notion, Obsidian, or Figma handle multi-device sync?
   - What's the simplest way to add field-level merging to Firebase sync?
   - Are there lightweight CRDT libraries suitable for a hobby project?
   - How should I handle the "two functions serialize different fields" bug pattern?
   - What sync architectures work well for turn-based tabletop RPG apps specifically?

2. SCENE MANAGEMENT SYSTEM
   Problem: No concept of scenes. I want: scene start/end, participants,
   scene type (combat/exploration/social/rest), escalation/de-escalation,
   and context-aware generators.
   Questions:
   - How do existing solo RPG tools (Mythic GME, MUNE, Ironsworn) implement scenes?
   - What data model would support scene tracking with typed participants?
   - How can scene context influence random generator output?
   - Are there open-source solo RPG companion apps I can study?
   - What UI patterns work well for scene management in narrative apps?

3. TEXT EDITING / RICH JOURNAL
   Problem: Currently using <textarea> for journal entries. Want free-form
   rich text like Obsidian/Notion with inline mentions, images, and formatting.
   Questions:
   - What embeddable rich text editors work well with React? (Tiptap, Lexical,
     Slate, ProseMirror, BlockNote, etc.)
   - Which ones support @mentions out of the box?
   - How do collaborative editors (Google Docs, Notion) handle real-time sync
     of rich text content?
   - What's the storage format for rich text that's also searchable and exportable?
   - Can I incrementally migrate from textarea to rich text without losing data?
   - Which editor has the smallest bundle size for CDN usage (no bundler)?

4. GENERATOR ARCHITECTURE
   Problem: ~50 generators with 3 different logging patterns, duplicated functions,
   inconsistent entry types, no unified interface.
   Questions:
   - What design pattern unifies random generators with optional journal logging?
   - How do tabletop RPG apps typically structure their random table systems?
   - What's a good data format for random tables that supports weighted results,
     sub-tables, and cross-references?
   - Are there existing open-source random table engines I can use or adapt?
   - How should generator output types be standardized for consistent journal rendering?

5. MULTIPLAYER ARCHITECTURE
   Problem: Full-state replacement on every change, no field-level merging,
   500ms timing guard, PINs in plaintext, no chat separate from journal.
   Questions:
   - How do lightweight multiplayer tabletop apps handle state sync?
     (e.g., Owlbear Rodeo, Foundry VTT, Roll20)
   - What's the minimum viable approach for operational transforms or CRDTs
     in a Firebase-based app?
   - How should I separate chat messages from game state in Firebase?
   - What authentication patterns work for casual multiplayer without user accounts?
   - How do VTTs handle "GM sees different data than players"?

6. MAP / DRAWING SYSTEM
   Problem: No map support. Want: upload images, draw on maps, place tokens.
   Questions:
   - What embeddable canvas/drawing libraries work with React?
     (tldraw, Excalidraw, Konva, Fabric.js, etc.)
   - How do VTTs store and sync map data?
   - What's the simplest approach for a basic map with fog of war?
   - Can tldraw or Excalidraw be embedded as a React component?
   - How do these libraries handle image layers + drawing layers?

7. CODE ARCHITECTURE / MODERNIZATION
   Problem: 17,460-line single file, 51 useState hooks, no bundler, no types.
   Questions:
   - What's the gentlest migration path from a single JSX file to a proper
     project structure? (Vite? Create React App? Next.js?)
   - How do I split 51 useState hooks into logical groups?
     (useReducer? Zustand? Jotai? custom hooks?)
   - What state management approach has the lowest learning curve for a hobbyist?
   - How do I add TypeScript incrementally to an existing JSX project?
   - What testing strategy makes sense for a solo developer? (Vitest? Playwright?)
   - Are there tools that can auto-extract components from a monolithic file?

CONSTRAINTS:
- I'm a hobbyist developer, not a professional
- The app works right now — I don't want to break it with a full rewrite
- Incremental migration is strongly preferred over big-bang rewrites
- I have no budget for paid services (Firebase free tier, free hosting)
- The app must work offline (PWA-like behavior desired)
- Target browsers: modern Chrome/Edge (File System API support)
- Czech language UI (but code/docs can be English)

Please provide:
1. Specific library/framework recommendations with trade-offs
2. Links to relevant documentation or tutorials
3. Examples of similar projects I can study
4. Suggested migration order (what to tackle first for maximum impact)
5. Architecture patterns that scale from solo hobby to small team
```

---

*Dokument vytvořen 2026-02-06. Založen na kódu z větve `master`, commit `5e6288d`.*

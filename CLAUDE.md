# Mausritter Solo Companion

Webová aplikace pro sólo hraní stolní RPG hry Mausritter. Mluv na mě česky.

## Jak pracovat s kódem

```bash
# 1. Edituj zdrojový kód v src/
#    Panely:    src/components/panels/*.tsx
#    UI:        src/components/ui/*.tsx
#    Store:     src/stores/*.ts
#    Typy:      src/types/index.ts
#    Helpers:   src/utils/helpers.ts
#    Konstanty: src/data/constants.ts

# 2. Dev server (Vite, hot reload)
npm run dev           # http://localhost:8081

# 3. TESTUJ (DŮLEŽITÉ!)
npm test              # Unit testy (Vitest) — před každým commitem
npm run test:e2e      # E2E testy (Playwright)
npm run test:watch    # Watch mode pro vývoj

# 4. Build pro produkci
npm run build         # Výstup: dist/
```

**WORKFLOW PŘED COMMITEM:**
1. Edit kód v `src/`
2. **`npm test`** — VŽDY před commitem!
3. Pokud zelené → commit
4. Pokud červené → oprav a znovu test

## Testování

**Unit testy (Vitest)** — 82 testů:
- `src/utils/helpers.test.ts` — dice rolling, generateId, formatTimestamp
- `src/data/constants.test.ts` — migrace dat v1→v6, defaulty
- `src/stores/gameStore.test.ts` — party/character CRUD, world, serialization, scény, mapy

**E2E testy (Playwright)** — 13 testů:
- `e2e/app.spec.ts` — title, navigace, deník
- `e2e/oracle.spec.ts` — orákulum, kostky
- `e2e/party-character.spec.ts` — vytvoření družiny a postavy
- `e2e/maps.spec.ts` — mapy (tldraw)
- `e2e/save-load.spec.ts` — localStorage, JSON export/import s migrací

## Struktura projektu

```
src/
├── App.tsx                          # Hlavní komponenta
├── main.tsx                         # Entry point
├── app.css                          # Globální styly
├── components/
│   ├── panels/                      # 16 panelů aplikace
│   │   ├── OraclePanel.tsx          # Orákulum (2d6, Ano/Ne)
│   │   ├── CombatPanel.tsx          # Souboje
│   │   ├── CharacterPanel.tsx       # Editace postav
│   │   ├── PartyPanel.tsx           # Správa družin
│   │   ├── WorldPanel.tsx           # Osady, NPC
│   │   ├── SmallWorldPanel.tsx      # Hex crawl
│   │   ├── FactionPanel.tsx         # Frakce
│   │   ├── TimePanel.tsx            # Kalendář
│   │   ├── TimeBar.tsx              # Časová lišta
│   │   ├── JournalPanel.tsx         # Deník (Tiptap)
│   │   ├── SceneManager.tsx         # Scény (Mythic GME)
│   │   ├── MapPanel.tsx             # Mapy (tldraw v4)
│   │   ├── LexikonPanel.tsx         # Lexikon
│   │   ├── EventsPanel.tsx          # Časované eventy
│   │   ├── ItemCardStudio.tsx       # Kartičky předmětů
│   │   └── FloatingDice.tsx         # Plovoucí kostky
│   └── ui/
│       ├── common.tsx               # Button, Input, Select, SectionHeader...
│       ├── TiptapEditor.tsx         # Rich text editor
│       └── MentionList.tsx          # @mention dropdown
├── stores/
│   ├── gameStore.ts                 # Hlavní stav (Zustand) — parties, journal, world...
│   ├── uiStore.ts                   # UI stav — activePanel, modály
│   ├── syncStore.ts                 # Google Drive / File System sync
│   └── multiplayerStore.ts         # Firebase multiplayer
├── data/
│   └── constants.ts                 # 72+ herních konstant + migrace
├── types/
│   └── index.ts                     # TypeScript typy
└── utils/
    └── helpers.ts                   # rollDice, generateId, formatTimestamp...

e2e/                                 # Playwright E2E testy
saves/                               # Lokální save soubory
pravidla/                            # Pravidla Mausritter CZ
kampaně/                             # Materiály pro kampaně

.serena/memories/
├── lore/ → ../Mausritter-Zámeček/  # LORE světa (symlink)
└── *.md                             # Technické memories
```

## LORE (Herní svět)

Symlinkované z `Mausritter-Zámeček` - 29 souborů s postavami a lokacemi.

```
read_memory("lore/SESSION-HANDOFF.md")     # Stav kampaně
read_memory("lore/sabrina-hlavni-antagonista.md")
read_memory("lore/kralovna-madriga.md")
read_memory("lore/alkoun-carodej.md")
read_memory("lore/cihlin-a-starostka.md")
```

## Technologie

| Co | Jak |
|----|-----|
| UI | React 18 + Tailwind CSS v4 |
| State management | Zustand 5 |
| Jazyk | TypeScript 5 |
| Build | Vite 7 |
| Rich editor | Tiptap 3 (@mentions) |
| Mapy | tldraw v4 |
| Multiplayer | Firebase Realtime Database |
| Cloud sync | Google Drive API v3 + Picker API |
| Lokální sync | File System Access API |
| Data | localStorage + JSON export/import |
| Unit testy | Vitest 4 |
| E2E testy | Playwright |
| Deploy | GitHub Pages (GitHub Actions) |

## Architektura aplikace

**State management (Zustand stores):**
- `gameStore` — hlavní herní stav: parties, characters, journal, world, factions, scenes, maps, lexicon, events
- `uiStore` — UI: activePanel, modály, toasty
- `syncStore` — Google Drive sync, File System sync, export/import
- `multiplayerStore` — Firebase: lobby, host/join, real-time sync

**Migrační systém:**
- Aktuální verze dat: **v6**
- Migrace: v1→v2 (parties), v2→v3 (world), v3→v4 (gameTime), v4→v5 (sceneState), v5→v6 (maps)
- Zachovává `_extra` pole pro dopřednou kompatibilitu

**Sync:**
- Google Drive — OAuth + conflict dialog + folder picker
- Lokální soubor — File System API (Chrome/Edge)
- Export/Import — ruční JSON zálohy
- Firebase multiplayer — PIN auth, real-time sync

## GCP

Projekt: `mausritter-solo-companion`
- OAuth Client ID pro localhost:8081
- API Key pro Picker
- Drive API + Picker API povoleno

## Workflow: Pull Request a Testování

Když uživatel řekne "vytvoř PR" nebo "udělej PR":

1. **Pushni větev** pokud ještě není pushnutá
2. **Vygeneruj URL s předvyplněnými parametry** - title a body zakódované v URL
3. **Dej uživateli klikací odkaz** - stačí kliknout a pak "Create pull request"

### URL formát (base je MASTER, ne main!)

```
https://github.com/Brux-cz/mausritter-solo-companion/compare/master...[BRANCH]?expand=1&title=[URL_ENCODED_TITLE]&body=[URL_ENCODED_BODY]
```

### Body formát

```
## Summary
- [hlavní změny jako odrážky]

## Test plan
- [ ] Test 1
- [ ] Test 2
```

### Příklad kompletní URL

```
https://github.com/Brux-cz/mausritter-solo-companion/compare/master...claude/feature-branch?expand=1&title=feat%3A%20N%C3%A1zev&body=%23%23%20Summary%0A-%20Zm%C4%9Bna%201%0A%0A%23%23%20Test%20plan%0A-%20%5B%20%5D%20Test
```

Uživatel klikne na odkaz → GitHub předvyplní formulář → klikne "Create pull request" → hotovo.

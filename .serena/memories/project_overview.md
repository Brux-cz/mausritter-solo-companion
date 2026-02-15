# Mausritter Solo Companion - Přehled projektu

## Účel
Webová aplikace pro sólo hraní stolní RPG hry Mausritter. Obsahuje správu postav, orákulum pro rozhodování, sledování soubojů, tvorbu světa, frakce, kalendář, deník sezení, scény (Mythic GME), interaktivní mapy a multiplayer.

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS v4
- **State management**: Zustand 5
- **Jazyk**: TypeScript 5
- **Build**: Vite 7
- **Rich editor**: Tiptap 3 (s @mentions)
- **Mapy**: tldraw v4
- **Multiplayer**: Firebase Realtime Database
- **Testy**: Vitest (unit), Playwright (E2E)
- **Deploy**: GitHub Pages (GitHub Actions)
- **Bez vlastního backendu** - čistě klientská aplikace

## Struktura projektu
```
src/
├── App.tsx                     # Hlavní komponenta
├── main.tsx                    # Entry point
├── components/panels/          # 16 panelů (Oracle, Combat, Character, Party, World, ...)
├── components/ui/              # common.tsx, TiptapEditor, MentionList
├── stores/                     # gameStore, uiStore, syncStore, multiplayerStore
├── data/constants.ts           # 72+ herních konstant + migrace
├── types/index.ts              # TypeScript typy
└── utils/helpers.ts            # rollDice, generateId, formatTimestamp...

e2e/                            # Playwright E2E testy (5 souborů, 13 testů)
```

## Hlavní komponenty (panely)
- `OraclePanel` - Orákulum pro rozhodování (2d6)
- `CombatPanel` - Soubojový tracker (iniciativa, útoky, morálka)
- `CharacterPanel` - Editor postav
- `PartyPanel` - Správa družin
- `WorldPanel` - Osady, NPC
- `SmallWorldPanel` - Hex crawl
- `FactionPanel` - Frakce a vztahy
- `TimePanel` - Herní kalendář (hlídky, dny, roční období)
- `TimeBar` - Časová lišta
- `JournalPanel` - Deník sezení (Tiptap rich editor)
- `SceneManager` - Scény s Mythic GME mechanikou (Chaos Factor, d10 check)
- `MapPanel` - Interaktivní mapy (tldraw v4)
- `LexikonPanel` - Lexikon pojmů
- `EventsPanel` - Časované eventy
- `ItemCardStudio` - Kartičky předmětů
- `FloatingDice` - Plovoucí kostky

## Správa stavu (Zustand)
- `gameStore` — parties, characters, journal, factions, settlements, worldNPCs, timedEvents, lexicon, sceneState, maps
- `uiStore` — activePanel, modály, toasty
- `syncStore` — Google Drive sync, File System sync, export/import
- `multiplayerStore` — Firebase lobby, host/join, real-time sync
- Migrační systém: v1→v6 (s `_extra` pole pro dopřednou kompatibilitu)

## Klíčové utility funkce
- `generateId()` - unikátní ID (formát `[a-z0-9]{9}`)
- `rollDice(count, sides)` - hod kostkou
- `randomFrom(array)` - náhodný výběr
- `roll2D6()`, `rollD6()`, `rollD10()`, `rollD12()`, `rollD20()`, `rollK66()` - specifické hody
- `formatTimestamp()` - cs-CZ locale

## Herní data (konstanty)
72+ konstant definuje herní mechaniky:
- `ORACLE_TABLE` - unlikely/even/likely
- `HIT_TABLE`, `FAILURE_CONSEQUENCES` - souboj
- `BESTIARY` - 28 bytostí s detaily
- `BIRTHSIGNS`, `ORIGINS`, `DISTINCTIVE_FEATURES` - generování postav
- `SPELLS`, `STARTING_WEAPONS` - vybavení
- `WEATHER_TABLE`, `SEASONS`, `WATCHES` - kalendář
- `SETTLEMENTS`, `LANDMARKS`, `NPC_*` - tvorba světa
- `SCENE_ALTERATION_TABLE`, `INTERRUPTED_SCENE_FOCUS` - Mythic GME scény

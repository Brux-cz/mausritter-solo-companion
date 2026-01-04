# Mausritter Solo Companion - Přehled projektu

## Účel
Webová aplikace pro sólo hraní stolní RPG hry Mausritter. Obsahuje správu postav, orákulum pro rozhodování, sledování soubojů, tvorbu světa, frakce, kalendář a deník sezení.

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS (načítáno z CDN)
- **Transpilace**: Babel pro in-browser JSX transpilaci
- **Build**: Node.js skript (build-html.js)
- **Bez backendu** - čistě klientská aplikace

## Struktura projektu
```
mausritter-project/
├── mausritter-solo-companion.jsx   # Hlavní zdrojový kód (~6000+ řádků)
└── build-html.js                    # Build skript pro generování HTML

mausritter-solo-companion.html       # Výstupní HTML soubor
```

## Hlavní komponenty (navigační panely)
- `OraclePanel` - Orákulum pro rozhodování (2d6)
- `CombatPanel` - Soubojový tracker (iniciativa, útoky, morálka)
- `CharacterPanel` - Editor postav a správa družiny
- `WorldPanel` - Osady, orientační body, NPC generátor
- `FactionPanel` - Frakce a vztahy
- `TimePanel` - Herní kalendář (hlídky, dny, roční období)
- `JournalPanel` - Deník sezení a export

## Správa stavu
- Hlavní komponenta `MausritterSoloCompanion` spravuje globální stav
- React hooks (useState, useEffect, useCallback, useRef)
- LocalStorage pro persistenci dat
- Migrační systém (aktuální verze: 3, konstanta SAVE_VERSION)

## Klíčové utility funkce
- `generateId()` - unikátní ID
- `rollDice(count, sides)` - hod kostkou
- `randomFrom(array)` - náhodný výběr
- `roll2D6()`, `rollD6()`, `rollD20()` - specifické hody

## Herní data (konstanty)
72+ konstant definuje herní mechaniky:
- `ORACLE_TABLE` - unlikely/even/likely
- `HIT_TABLE`, `FAILURE_CONSEQUENCES` - souboj
- `BESTIARY` - 28 bytostí s detaily
- `CREATURE_CATEGORIES` - kategorie stvoření
- `BIRTHSIGNS`, `ORIGINS`, `DISTINCTIVE_FEATURES` - generování postav
- `SPELLS`, `STARTING_WEAPONS` - vybavení
- `WEATHER_TABLE`, `SEASONS`, `WATCHES` - kalendář
- `SETTLEMENTS`, `LANDMARKS`, `NPC_*` - tvorba světa

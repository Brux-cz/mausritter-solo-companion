# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. mluv na mě česky.

Vždy používej Serena MCP nástroje pro navigaci kódu.
   
Preferuj find_symbol a find_referencing_symbols před grepem.

## Přehled projektu

Mausritter Solo Companion je webová aplikace pro sólo hraní stolní RPG hry Mausritter. Obsahuje správu postav, orákulum pro rozhodování, sledování soubojů, tvorbu světa, frakce, kalendář a deník sezení.

## Technologie

- React 18 + Tailwind CSS (z CDN)
- Babel pro in-browser JSX transpilaci
- Čistý frontend bez serveru

## Struktura projektu

```
mausritter-project/
├── mausritter-solo-companion.jsx   # Zdrojový kód (upravovat zde!)
└── build-html.js                    # Build skript
```

## Vývoj

```bash
# Upravovat zdrojový JSX soubor
mausritter-project/mausritter-solo-companion.jsx

# Build do HTML (vyžaduje Node.js, upravit cesty v build-html.js)
node mausritter-project/build-html.js
```

## Spuštění

```bash
xdg-open mausritter-solo-companion.html
```

## Architektura

### Hlavní komponenty (navigační panely)
- `OraclePanel` - Orákulum pro rozhodování (2d6)
- `CombatPanel` - Soubojový tracker (iniciativa, útoky, morálka)
- `CharacterPanel` - Editor postav a správa družiny
- `WorldPanel` - Osady, orientační body, NPC generátor
- `FactionPanel` - Frakce a vztahy
- `TimePanel` - Herní kalendář (hlídky, dny, roční období)
- `JournalPanel` - Deník sezení a export

### Správa stavu
- Hlavní komponenta `MausritterSoloCompanion` spravuje globální stav
- React hooks (useState, useEffect, useCallback, useRef)
- LocalStorage pro persistenci dat
- Migrační systém (aktuální verze: 3)

### Klíčové utility funkce
- `generateId()` - unikátní ID
- `rollDice(count, sides)` - hod kostkou
- `randomFrom(array)` - náhodný výběr

### Herní data (konstanty)
72 konstant definuje herní mechaniky:
- Orákulum (ORACLE_TABLE - unlikely/even/likely)
- Souboj (HIT_TABLE, FAILURE_CONSEQUENCES)
- Generování postav (jména, vlastnosti, původy, kouzla)
- Generování světa (bestie BESTIARY, osady, NPC)
- Kalendář (počasí WEATHER_TABLE, podmínky)

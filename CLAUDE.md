# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. mluv na mě česky.

Vždy používej Serena MCP nástroje pro navigaci kódu.

Preferuj find_symbol a find_referencing_symbols před grepem.

## Přehled projektu

Mausritter Solo Companion je webová aplikace pro sólo hraní stolní RPG hry Mausritter. Obsahuje správu postav, orákulum pro rozhodování, sledování soubojů, tvorbu světa, frakce, kalendář a deník sezení.

## Technologie

- React 18 + Tailwind CSS (z CDN)
- Babel pro in-browser JSX transpilaci
- Google Drive API pro cloud sync
- File System Access API pro lokální sync
- Čistý frontend bez serveru

## Struktura projektu

```
mausritter-project/
├── mausritter-solo-companion.jsx   # Zdrojový kód (upravovat zde!)
└── build-html.js                    # Build skript

saves/                               # Složka pro lokální save soubory
pravidla/                            # Pravidla Mausritter CZ
kampaně/                             # Materiály pro kampaně

.serena/
├── memories/
│   ├── code_style.md               # Styl kódu projektu
│   ├── project_overview.md         # Přehled projektu
│   └── lore/ -> symlink            # LORE ze Zámeček kampaně
└── project.yml                      # Konfigurace Serena
```

## LORE (Herní svět)

LORE je symlinkované z projektu `Mausritter-Zámeček`:
- `.serena/memories/lore/` -> `../Mausritter-Zámeček/.serena/memories/`
- Obsahuje 29+ souborů s postavami, lokacemi, příběhy
- Pro čtení: `read_memory("lore/nazev-souboru.md")`

Klíčové LORE soubory:
- `sabrina-hlavni-antagonista.md` - hlavní záporná postava
- `kralovna-madriga.md` - královna včel
- `alkoun-carodej.md` - čaroděj Alkoun
- `cihlin-a-starostka.md` - osada Cihlín
- `SESSION-HANDOFF.md` - stav kampaně

## Vývoj

```bash
# Upravovat zdrojový JSX soubor
mausritter-project/mausritter-solo-companion.jsx

# Build do HTML
node mausritter-project/build-html.js

# Spustit dev server (port 8081)
python3 -m http.server 8081
```

## Spuštění

```bash
xdg-open mausritter-solo-companion.html
# nebo
firefox http://localhost:8081/mausritter-solo-companion.html
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

### Sync systém
- **Google Drive**: OAuth 2.0 + Drive API v3 + Picker API
  - Conflict dialog při rozdílu verzí
  - Persistence vybrané složky v localStorage
- **Lokální soubor**: File System Access API (Chrome/Edge)
- **Export/Import**: Ruční JSON zálohy

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
72+ konstant definuje herní mechaniky:
- Orákulum (ORACLE_TABLE - unlikely/even/likely)
- Souboj (HIT_TABLE, FAILURE_CONSEQUENCES)
- Generování postav (jména, vlastnosti, původy, kouzla)
- Generování světa (bestie BESTIARY, osady, NPC)
- Kalendář (počasí WEATHER_TABLE, podmínky)

## GCP Konfigurace

Projekt: `mausritter-solo-companion`
- OAuth Client ID: nakonfigurováno pro localhost:8081
- API Key: pro Google Picker
- Povolená API: Drive API, Picker API

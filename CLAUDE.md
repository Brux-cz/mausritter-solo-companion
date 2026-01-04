# Mausritter Solo Companion

Webová aplikace pro sólo hraní stolní RPG hry Mausritter. Mluv na mě česky.

## Jak pracovat s kódem

```bash
# 1. Edituj zdrojový kód
mausritter-project/mausritter-solo-companion.jsx

# 2. Buildni HTML
node mausritter-project/build-html.js

# 3. Spusť dev server
python3 -m http.server 8081

# 4. Otevři v Chrome (pro Claude in Chrome extension)
google-chrome http://localhost:8081/mausritter-solo-companion.html
```

Používej Serena MCP nástroje (find_symbol, find_referencing_symbols) místo grepu.

## Struktura projektu

```
mausritter-project/
├── mausritter-solo-companion.jsx    # HLAVNÍ ZDROJOVÝ KÓD
└── build-html.js                     # Build skript

saves/                                # Lokální save soubory
pravidla/                             # Pravidla Mausritter CZ
kampaně/                              # Materiály pro kampaně

.serena/memories/
├── lore/ → ../Mausritter-Zámeček/   # LORE světa (symlink)
└── *.md                              # Technické memories
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
| UI | React 18 + Tailwind CSS (z CDN) |
| Transpilace | Babel in-browser |
| Cloud sync | Google Drive API v3 + Picker API |
| Lokální sync | File System Access API |
| Data | localStorage + JSON export/import |

## Architektura aplikace

**Panely:**
- `OraclePanel` - Orákulum (2d6)
- `CombatPanel` - Souboje
- `CharacterPanel` - Postavy a družiny
- `WorldPanel` - Osady, NPC
- `FactionPanel` - Frakce
- `TimePanel` - Kalendář
- `JournalPanel` - Deník

**Sync:**
- Google Drive - OAuth + conflict dialog + folder picker
- Lokální soubor - File System API (Chrome/Edge)
- Export/Import - ruční JSON zálohy

**Stav:**
- Hlavní komponenta `MausritterSoloCompanion`
- localStorage persistence
- Migrační systém v3

## GCP

Projekt: `mausritter-solo-companion`
- OAuth Client ID pro localhost:8081
- API Key pro Picker
- Drive API + Picker API povoleno

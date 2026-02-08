# Mausritter Solo Companion

Webová aplikace pro sólo hraní stolní RPG hry Mausritter. Mluv na mě česky.

## Jak pracovat s kódem

```bash
# 1. Edituj zdrojový kód
mausritter-project/mausritter-solo-companion.jsx

# 2. Buildni HTML
node mausritter-project/build-html.js

# 3. TESTUJ (DŮLEŽITÉ!)
npm test                # Před každým commitem
npm run test:headed     # Debug mode s viditelným browserem

# 4. Spusť dev server
python3 -m http.server 8081

# 5. Otevři v Chrome (pro Claude in Chrome extension)
google-chrome http://localhost:8081/mausritter-solo-companion.html
```

**WORKFLOW PŘED COMMITEM:**
1. Edit kód
2. Build
3. **`npm test`** ← VŽDY před commitem!
4. Pokud zelené ✅ → commit
5. Pokud červené ❌ → oprav a znovu test

Používej Serena MCP nástroje (find_symbol, find_referencing_symbols) místo grepu.

## Testování

**Dokumentace:** `README-TESTING.md` - kompletní návod

**Kdy testovat:**
- ✅ Před každým commitem
- ✅ Po každé změně kódu
- ✅ Po přidání nové funkce

**Test suite:**
- `tests/data-persistence.spec.ts` - localStorage + slot system
- `tests/migration.spec.ts` - migrace v1→v4
- `tests/import-export.spec.ts` - JSON import/export + K1 oprava
- `tests/edge-cases.spec.ts` - české znaky, XSS, emoji
- `tests/slot-system.spec.ts` - CRUD + F1 bug (skip)

**Stav:**
- ⚠️ Testy vyžadují doladění UI selektorů
- ✅ Playwright infrastruktura funkční
- ✅ F1 bug test připravený k verify po opravě

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

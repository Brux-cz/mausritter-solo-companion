# Výzkum modernizace — Mausritter Solo Companion

> Deep Search výzkum provedený 2026-02-06. Referenční dokument pro budoucí rozhodování.
> Kód v době výzkumu: commit `5e6288d`, 17 460 řádků JSX.

---

## 1. Sync / Offline-First architektura

### Problém
4 storage backendy s nekonzistentními daty, žádné řešení konfliktů, last-write-wins multiplayer, ztráta dat na Google Drive/FileSystem saves.

### Doporučení

**Krátkodobě (okamžitá oprava):**
- Sjednotit `getGameState()` a `getSaveData()` — obě musí serializovat stejná pole (včetně timedEvents, lexicon)
- Jediný zdroj pravdy pro serializaci hry

**Střednědobě:**
- V Firebase přejít na dílčí aktualizace (`update()` místo `set()`) nebo event sourcing (každou akci přidávat jako novou položku přes `push()`)
- Firestore + transakce pro částečné update operace (field merge)

**Dlouhodobě (CRDT/offline-first):**
- **Yjs** — rychlý, modulární, vhodný pro hobby projekt
- **Automerge** — výchozí JSON API, dobré pro offline scénář
- **PouchDB / RxDB** — offline-first databáze s automatickým synchonem
- Gun.js — built-in CRDT, ale menší komunita

### Jak to dělají velcí
| Aplikace | Přístup |
|----------|---------|
| Google Docs | Operational Transform (OT) |
| Figma | CRDT principy, offline → sync po připojení |
| Notion | Slučování offline edicí, vyžaduje občasné připojení |
| Obsidian | Lokální soubory (Markdown), sync přes git/Dropbox/Obsidian Sync |

### Zdroje
- [Offline-First Databases for JS](https://sourceforge.net/software/offline-first-databases/integrates-with-javascript/)
- [Best CRDT Libraries 2025](https://velt.dev/blog/best-crdt-libraries-real-time-data-sync)
- [How Figma's multiplayer works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- [Google Docs OT](https://dev.to/dhanush___b/how-google-docs-uses-operational-transformation-for-real-time-collaboration-119)
- [Firebase conflict resolution](https://stackoverflow.com/questions/48822264/understanding-conflict-resolution-in-firebase)

---

## 2. Správa scén

### Inspirace z existujících systémů
- **Mythic GME** — explicitní `scene start`, `scene note`, `scene end` s Chaos Factor
- **Ironsworn** — progress trackery a kroky hráče jako události (méně explicitních scén)

### Navrhovaný datový model

```javascript
scenes: [
  {
    id: 123,
    type: 'boj',          // boj, průzkum, sociální, odpočinek
    participants: [charId1, npcId3, npcId5],
    startedAt: 'day 2, turn 5',
    events: [...],         // odkazy na záznamy v deníku
    outcome: 'in_control', // nebo 'out_of_control'
    tension: 0.8,
    tags: ['boj', 'podzemí', 'vysoké napětí']
  }
]
```

### UI vzory
- Časová osa (timeline) nebo modulární sekce (aktuální scéna + historie)
- Tlačítka Start/Konec scény
- Automatické vyhodnocení při ukončení (výhoda PC → snížit chaos)
- Generátory filtrované podle tagů scény

### Zdroje
- [MCP Mythic](https://www.val.town/x/dcm31/mcp-mythic)

---

## 3. Rich Text Editor pro deník

### Srovnání knihoven

| Knihovna | Velikost | @Mentions | Poznámka |
|---------|----------|-----------|----------|
| **Tiptap** | ~50-70KB gzip | Vestavěné rozšíření | Doporučená volba — bohaté funkce + flexibilita |
| **Lexical** | ~22KB core | Plugin (lexical-beautiful-mentions) | Malý core, víc vlastního kódu |
| **Slate** | středně velký | Ukázkový příklad | Framework, hodně vlastní logiky |
| **BlockNote** | postavený na Tiptap | Grid menu na "@" | Lehce embednutelný, UI komponenty |
| Quill | větší | Plugin (quill-mention) | Těžší pro CDN |

### Doporučení
- **Tiptap** nebo **BlockNote** pro @mentions a moderní UI
- Formát uložení: JSON (pro editor) + export do Markdown/HTML
- Postupná migrace: nové záznamy v RTE, staré konvertovat postupně

### Zdroje
- [Tiptap vs Lexical](https://medium.com/@faisalmujtaba/tiptap-vs-lexical-which-rich-text-editor-should-you-pick-for-your-next-project-17a1817efcd9)
- [RTE framework comparison 2025](https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025)
- [Tiptap Mentions](https://tiptap.dev/docs/examples/advanced/mentions)
- [Slate Mentions](https://www.slatejs.org/examples/mentions)
- [BlockNote Grid Mentions](https://www.blocknotejs.org/examples/ui-components/suggestion-menus-grid-mentions)

---

## 4. Architektura generátorů

### Doporučení
- Sjednotit pod jedno rozhraní: `generate(type, options)` → standardizovaný objekt
- Jednotný callback: `onLogEntry(entry, {silent: boolean})`
- Odstranit duplikace (sloučit dva `generateSettlementEvent` do jednoho)
- Definovat fixní sadu typů položek v deníku

### Datový formát tabulek

```javascript
"settlementEvents": [
  { text: "V osadě vidíte...", weight: 1 },
  { text: "Potkáte úředníka...", weight: 2, table: "consequence" }
]
```

### Zdroje
- [Random Tables MCP](https://github.com/MikeORed/random-tables-mcp) — vnořené šablony, váhy, hexagonální architektura

---

## 5. Multiplayer architektura

### Doporučení

**Oddělení dat v Firebase:**
```
rooms/{code}/state/public    // vidí všichni
rooms/{code}/state/private   // vidí jen GM
rooms/{code}/chat/messages   // OOC komunikace
```

**Autentizace:** Firebase Anonymous Auth (každý hráč dostane UID zdarma, bez registrace)

**Konflikty:** Event sourcing (append, ne set) nebo přechod na Firestore + transakce

### Jak to dělají VTT
- **Foundry VTT** — server je autoritativní, klienti přes WebSocket
- **Roll20** — proprietární backend
- **Owlbear Rodeo** — jednodušší, sdílí pozice a stav tokenů

---

## 6. Systém map a kreslení

### Knihovny

| Knihovna | Vlastnosti |
|---------|-----------|
| **tldraw** | React `<Tldraw>` komponenta, vrstvy, Fog of War příklad |
| **Excalidraw** | Jednoduchý whiteboard, styl ručního kreslení |
| **Konva** (react-konva) | Canvas, vrstvení obrázků, drag&drop |
| **Fabric.js** | Canvas engine pro základní mapování |

### Datový model mapy

```javascript
maps: [
  {
    id: 10,
    image: 'maps/forest.png',
    tokens: [
      {id: 1, x: 100, y: 200, sprite: 'mouse_soldier'},
      {id: 2, x: 250, y: 300, sprite: 'mouse_archer', hidden: true}
    ],
    fogOfWar: [/* mask data */]
  }
]
```

### Zdroje
- [tldraw examples](https://tldraw.dev/examples/basic)

---

## 7. Modernizace kódu

### Doporučený stack
| Oblast | Nástroj | Proč |
|--------|---------|------|
| Bundler | **Vite** | Rychlé HMR, podpora React+TS+Tailwind |
| State | **Zustand** | Lehký (~pár KB), hook-based, bez boilerplate |
| Typy | **TypeScript** | Postupně: allowJs → přejmenování .jsx → .tsx |
| Testy | **Vitest** + **Playwright** | Vitest pro unit/component, Playwright pro E2E |

### Migrace — doporučené pořadí

1. **Opravit serializační bug** (sjednotit getSaveData/getGameState) ← HOTOVO
2. **Zustand store** — přesunout 51 useState do centrálního store
3. **Vite + modularizace** — rozdělit monolitický soubor na komponenty
4. **TypeScript** — přidat typy postupně (začít s datovým modelem)
5. **Testy** — začít s kritickými moduly (export/import, generátory)
6. **Rich Text Editor** — Tiptap pro deník
7. **Scény** — nový systém s datovým modelem
8. **Mapy** — tldraw nebo Excalidraw

### Struktura projektu (cíl)

```
src/
├── components/     # JournalPanel, MapPanel, OraclePanel...
├── state/          # Zustand store, typy
├── utils/          # Generátory, serializace, helpery
└── data/           # Náhodné tabulky, konstanty
```

### Zdroje
- [Zustand](https://medium.com/@chorniy315/zustand-a-lightweight-state-management-solution-for-react-fce07dfd7a56)
- [Vitest Component Testing](https://vitest.dev/guide/browser/component-testing)

---

*Dokument vytvořen 2026-02-06 na základě Deep Search výzkumu.*

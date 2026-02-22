# Analýza projektu Mausritter Solo Companion

Datum: 2026-02-21
Metodologie: The Lone Toad + O.R.A.C.L.E. + Ironsworn Flow of Play + Solo RPG best practices

---

## A) MYŠLENKOVÁ MAPA

```
                        ┌─────────────────────────┐
                        │   MAUSRITTER SOLO        │
                        │   COMPANION              │
                        │   (React+Zustand+Vite)   │
                        └────────────┬────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
   ┌──────┴──────┐          ┌───────┴───────┐          ┌───────┴───────┐
   │  JÁDRO HRY  │          │  SVĚT & NPC   │          │ INFRASTRUKTURA│
   │  (Core Loop)│          │  (World)      │          │ (Persistence) │
   └──────┬──────┘          └───────┬───────┘          └───────┬───────┘
          │                         │                          │
    ┌─────┼─────┐            ┌──────┼──────┐           ┌───────┼──────┐
    │     │     │            │      │      │           │       │      │
 Oracle Combat Time      World  Faction Events     localStorage Cloud Export
 Panel  Panel  Panel     Panel  Panel   Panel      (slots)   GDrive  JSON
    │     │     │            │      │      │           │       │      │
 6 typů  HIT   Watch     Osady  Cíle   Timed      Autosave  OAuth  Import
 věštění table  system   NPC    Pokrok  events               Picker
 Ano/Ne  Dmg    Weather  Vztahy Vztahy                File System API
 Akce+T  Init   Season                               Firebase(MP)
 Karty   Morale Travel
 Setkání Usage
 Tvorové
 Události
          │
   ┌──────┴──────┐       ┌──────────────┐       ┌─────────────┐
   │  POSTAVY    │       │  DENÍK       │       │  MAPY       │
   │  (Characters)│      │  (Journal)   │       │  (tldraw)   │
   └──────┬──────┘       └──────┬───────┘       └─────────────┘
          │                     │
    ┌─────┼─────┐        15+ typů záznamů
    │     │     │        @mentions, Filtry
   PC  Hireling Inventář   Auto-log hodů
   Stats Skills  Slot-based
   Cond. Cost   2+2+6 slotů
   XP    HP     Drag-drop
   Spells        Usage dots
```

### Velikost komponent (problém přebujelosti)

| Soubor | Velikost | Řádky |
|--------|----------|-------|
| CharacterPanel.tsx | 98 KB | ~2194 |
| JournalPanel.tsx | 87 KB | ~1789 |
| WorldPanel.tsx | 69 KB | ~1441 |
| OraclePanel.tsx | 50 KB | ~1190 |
| ItemCardStudio.tsx | 38 KB | ~939 |
| TimePanel.tsx | 30 KB | ~745 |
| SceneManager.tsx | 23 KB | ~573 |
| PartyPanel.tsx | 20 KB | ~467 |
| CombatPanel.tsx | 17 KB | ~466 |
| SmallWorldPanel.tsx | 14 KB | ~347 |
| LexikonPanel.tsx | 13 KB | ~365 |
| FactionPanel.tsx | 11 KB | ~290 |
| FloatingDice.tsx | 11 KB | ~285 |
| App.tsx | ~100 KB | ~2729 |
| **Celkem** | **~580 KB** | **~12 800+** |

---

## B) SKEPTICKÁ ANALÝZA

### Problém 1: PŘEBUJELOST
Aplikace je spíš **plnohodnotný VTT** než kompaktní solo companion. Pro jednoho hráče, který chce hrát 15-30 minut, je to jako řídit letadlo.

### Problém 2: 13+ PANELŮ = kognitivní přetížení
Text "The Lone Toad" říká: *"Hlavní příčinou vyhoření u solo hráčů je kognitivní přetížení."* 17 komponent v navigaci je přesně ten anti-pattern.

### Problém 3: CHYBÍ JÁDRO solo zážitku

| Co chybí | Proč je to kritické |
|----------|-------------------|
| Session Start workflow | Hráč otevře app a neví kde začít |
| "Kde jsem skončil?" summary | Micro-session killer |
| Hexcrawlová mapa | Mausritter JE hexcrawl |
| Scene flow integrace | SceneManager oddělený od Oracle |
| Fail Forward integrace do combatu | Po selhání žádný prompt "co dál?" |
| End Goal / Progress tracker | Kampaň bez cíle = vyhoření |

### Problém 4: DUPLICITA architektury
Existují DVĚ paralelní struktury:
- `mausritter-project/` (legacy monolith, 18 243 řádků)
- `src/` (moderní Vite+Zustand+TypeScript)

### Problém 5: OVER-ENGINEERING pro solo

| Feature | Solo hráč to potřebuje? |
|---------|------------------------|
| Firebase Multiplayer | Ne |
| ItemCardStudio (939 ř.) | Marginálně |
| SmallWorldPanel | Duplicita s WorldPanel |

---

## C) CO JE DOBRÉ (zachovat!)

| Feature | Hodnocení |
|---------|----------|
| Oracle (6 typů věštění) | Výborné - odpovídá "The Conversation" |
| Časový systém (Watch/Turn/Season) | Výborné - přesně podle pravidel |
| Slot-based inventář | Výborné - vizuální grid s drag-drop |
| Auto-log do deníku | Výborné - "Point Form" princip |
| Data persistence (localStorage + cloud + export) | Výborné - vícevrstvá záloha |
| Mausritter-specifické tabulky | Výborné - ne generický nástroj |

---

## D) NÁVRHY VYLEPŠENÍ

### D1: KONSOLIDACE PANELŮ (13+ → 5)

```
AKTUÁLNÍ (13+ panelů):                NAVRHOVANÉ (5 obrazovek):
┌──────────────┐                      ┌──────────────────────┐
│ Oracle       │                      │ 1. HRACÍ PLOCHA      │
│ Combat       │  ──sloučit──►        │    (Oracle + Scene +  │
│ SceneManager │                      │     Combat v jednom)  │
│ FloatingDice │                      │    = "The Conversation"│
├──────────────┤                      ├──────────────────────┤
│ Character    │                      │ 2. DRUŽINA           │
│ Party        │  ──sloučit──►        │    (Party + Characters│
│ ItemCardStudio│                     │     + Inventář)       │
├──────────────┤                      ├──────────────────────┤
│ World        │                      │ 3. SVĚT              │
│ Faction      │  ──sloučit──►        │    (Osady + NPC +    │
│ SmallWorld   │                      │     Frakce + Hex mapa)│
│ Lexikon      │                      ├──────────────────────┤
│              │                      │ 4. DENÍK             │
│ Journal      │  ──sloučit──►        │    (Journal + Events) │
│ Events       │                      ├──────────────────────┤
│ Time         │                      │ 5. ČAS & NASTAVENÍ   │
│ TimeBar      │  ──sloučit──►        │    (Time + Sync +    │
│ Maps         │                      │     Mapy + Settings)  │
│ HowToPlay   │                      └──────────────────────┘
└──────────────┘
```

**Princip:** "Hrací plocha" je DEFAULT obrazovka. Oracle + Scene + Combat na jednom místě = hráč nikdy nepřepíná během "The Conversation".

### D2: SESSION FLOW

**Při otevření:**
- "Vítej zpět! Naposledy jsi hrál [datum]."
- "Kde jsi skončil: [auto-summary z posledních deníkových zápisů]"
- "Otevřená otázka: [cliffhanger z minulé session]"
- [Pokračovat v kampani] / [Nová scéna]

**Při ukončení:**
- Auto-shrnutí session (počet hodů, bojů, přesunů)
- Volitelné textové pole pro cliffhanger
- [Uložit & zavřít]

### D3: INTEGROVANÝ SCENE FLOW na Hrací ploše

```
┌─ HRACÍ PLOCHA ──────────────────────────────────┐
│                                                   │
│ SCÉNA #7: "Podzemí pod Cihlinským mlýnem"        │
│ Typ: Průzkum | Chaos: 7 | Watch: Poledne         │
│                                                   │
│ ┌─ Oracle ─────────────────────────────────┐     │
│ │  [Ano/Ne]  [Akce+Téma]  [Setkání]  [d6] │     │
│ │  "Čeká mě nebezpečí?"                   │     │
│ │  → ANO, ALE... (2d6 = 8)                │     │
│ └───────────────────────────────────────────┘     │
│                                                   │
│ ┌─ Rychlé akce ───────────────────────────┐     │
│ │ [⚔️ Souboj] [🔍 Průzkum] [💬 Sociální]  │     │
│ │ [⏩ Skip/Střih] [🎬 Konec scény]         │     │
│ └──────────────────────────────────────────┘     │
│                                                   │
│ 📜 Log: • Oracle: Ano, ale...                     │
│         • Setkání: 2 krysy, nepřátelské          │
└──────────────────────────────────────────────────┘
```

### D4: "BORING = SKIP" + FAIL FORWARD
- Skip tlačítko u generovaného obsahu (filmový střih)
- Auto-posun času + weather check + zápis do deníku
- Po selhání v combatu/savu automatický prompt z FAILURE_CONSEQUENCES

### D5: HEX GRID
- Minimální hex mapa (7-19 hexů, rozšiřitelná)
- Klik na hex = poznámka + stav (neprozkoumáno/prozkoumáno/nebezpečné)
- Propojení s TimePanel (cestování = 1 Watch na hex)

### D6: END GOAL TRACKER
- Textové pole "Cíl kampaně" při vytvoření
- Seznam milníků (checkbox)
- Vizuální progress bar

---

## E) IMPLEMENTAČNÍ PLÁN

### Rozhodnutí uživatele:
- **Konsolidace:** ANO, 13+ → 5 obrazovek
- **Priorita:** Všechny fáze postupně (1→6)
- **Čištění:** Zachovat kód, ale skrýt z UI

### Fáze 1: SESSION FLOW (nejvyšší dopad, nejnižší effort)
- [ ] `SessionStartScreen` - "Vítej zpět" + resume summary + "Zahaj scénu"
- [ ] `SessionEndDialog` - shrnutí + cliffhanger otázka
- [ ] Uložit `lastSessionSummary` do gameStore
- [ ] Auto-generování summary z posledních journal entries

### Fáze 2: KONSOLIDACE "HRACÍ PLOCHA"
- [ ] Nová komponenta `PlayArea` sloučí Oracle + SceneManager + Combat
- [ ] Scene flow: Zahájení → Oracle otázky → Combat (pokud nastane) → Konec scény
- [ ] Inline combat mode (souboj na stejné obrazovce, ne přepnutí panelu)
- [ ] Quick-action tlačítka (Průzkum, Sociální, Skip)

### Fáze 3: NAVIGAČNÍ ZJEDNODUŠENÍ
- [ ] 5 hlavních záložek: Hrací plocha | Družina | Svět | Deník | Čas
- [ ] Party + Character do `PartyScreen`
- [ ] World + Faction + Lexikon do `WorldScreen`
- [ ] Journal + Events do `JournalScreen`
- [ ] Time + Maps + Settings do `SettingsScreen`
- [ ] Skrýt (ne smazat): Multiplayer UI, ItemCardStudio (dostupné přes Settings)
- [ ] Progressive disclosure (detaily na klik)

### Fáze 4: "BORING = SKIP" + FAIL FORWARD
- [ ] Skip/filmový střih tlačítko
- [ ] Auto-posun času při skipu
- [ ] Fail Forward prompty po selhání v combatu
- [ ] Integrace FAILURE_CONSEQUENCES do combat flow

### Fáze 5: HEX GRID
- [ ] Minimální hex grid komponenta (SVG/Canvas)
- [ ] Klikatelné hexy s poznámkami
- [ ] Stavy hexů (neprozkoumáno/prozkoumáno/nebezpečné/zajímavé)
- [ ] Propojení s časovým systémem

### Fáze 6: END GOAL TRACKER
- [ ] UI pro definici cíle kampaně
- [ ] Milníky (checkbox list)
- [ ] Progress bar
- [ ] Zobrazení na Session Start screenu

---

## F) POROVNÁNÍ S LONE TOAD POŽADAVKY

| Požadavek z Lone Toad | Stav PŘED | Stav PO | Fáze |
|----------------------|-----------|---------|------|
| Oracle ("The Conversation") | ✅ | ✅ | - |
| Fiction-Mechanics Oscillation | ⚠️ | ✅ | F2 |
| Externalizace kognitivní zátěže | ❌ (13+ panelů) | ✅ (5 obrazovek) | F3 |
| Micro-session (15-30 min) | ⚠️ | ✅ | F1 |
| "Kde jsem skončil?" | ❌ | ✅ | F1 |
| Point Form zápis | ✅ | ✅ | - |
| Fail Forward | ⚠️ | ✅ | F4 |
| Boring = Skip | ❌ | ✅ | F4 |
| Hexcrawl mapa | ❌ | ✅ | F5 |
| End Goal tracker | ❌ | ✅ | F6 |
| Cliffhanger helper (Zeigarnik) | ❌ | ✅ | F1 |
| Minimum Viable Character | ✅ | ✅ | - |
| Slot-based inventář | ✅ | ✅ | - |
| Combat tracker | ✅ | ✅ | - |
| Čas (Watch/Turn) | ✅ | ✅ | - |
| Cloud sync | ✅ | ✅ | - |

---

## Zdroje a inspirace

- [The Lone Toad / Croaker RPGs](https://croakerrpgs.substack.com/) - metodologie solo RPG
- [O.R.A.C.L.E. System](https://croakerrpgs.substack.com/p/oracle-system-a-procedure-for-playing) - oracle procedura
- [Einzelmaus](https://manadawnttg.itch.io/einzelmaus-solo-mausritter) - solo Mausritter supplement
- [Iron Journal](https://nboughton.uk/apps/ironsworn-campaign/) - vzor kompaktní solo app
- [Mausritter SRD](https://mausritter.com/srd/) - oficiální pravidla

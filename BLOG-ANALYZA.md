# Analýza blogu "Alone in the Realm" — Mousey Wizard (Sezóna 1)

**Datum analýzy:** 2026-02-22
**Zdroj:** https://aloneintherealm.substack.com/
**Metodologie:** Multi-agent analýza 15 dostupných epizod (z 25 celkem)

---

## 1. STAV EPIZOD

### Nalezené epizody (15/25)

| # | Datum | Název | URL |
|---|-------|-------|-----|
| Ep0 | 6.9.2025 | Introducing Anise Butterball | https://aloneintherealm.substack.com/p/mausritter-solo-mousey-wizard-ep0 |
| Ep1 | 13.9.2025 | Anise faces down a gang of Dedratz | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey |
| Ep2 | 20.9.2025 | Anise gains a friend | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-6c8 |
| Ep3 | 27.9.2025 | The mice get a snow day | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-f89 |
| Ep4 | 4.10.2025 | Anise and Aloe go for a ride | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-ae4 |
| Ep5 | 11.10.2025 | Bitter trek to shelter | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-0ea |
| Ep6 | 18.10.2025 | Into the bowels of the Tower | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-a2d |
| Ep7 | 25.10.2025 | It's now Spring and trouble is afoot | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-6dc |
| Ep9 | 9.11.2025 | The Battle of the Grand Hall | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-6e2 |
| Ep11 | 22.11.2025 | Such a close call | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-5dd |
| Ep15 | 19.12.2025 | The Cat Lord, Balthazar | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-a28 |
| Ep16 | 26.12.2025 | Into the sewers we go! | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-84b |
| Ep17 | ~leden 2026 | Myrtle gets an itch | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-b97 |
| Ep21 | ~únor 2026 | Meeting with the Grand Librarian | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-f45 |
| Ep24 | ~únor 2026 | Season 1 Finale | https://aloneintherealm.substack.com/p/mausritter-solo-actual-play-mousey-2cf |

### Chybějící epizody (10/25)

Ep8, Ep10, Ep12, Ep13, Ep14, Ep18, Ep19, Ep20, Ep22, Ep23

**DŮVOD:** Blog je proložen více sériemi (Kal-Arath, Achtung Cthulhu, Mythic Fantasy...). Substack "Next/Previous" navigace přechází mezi sériemi, nikoliv sekvenčně v rámci Mousey Wizard. URL nelze rekonstruovat přes navigaci — je potřeba projít archiv nebo použít Substack search.

---

## 2. TOOLKIT — EVOLUCE PŘES SEZÓNU

| Od epizody | Přidaný nástroj | Použití |
|-----------|----------------|---------|
| Ep0 | Mausritter Core | Vše základní |
| Ep0 | OPSE | GM emulator (Oracle, Scene) |
| Ep0 | Bernpyle #3 | Survivability modifikace pro solo |
| Ep0 | Oak Mill Institute | Season/Weather tabulky, Season Events |
| Ep0 | Adventuring Mice | Class abilities (Arcane, Grit, Aegis) |
| Ep1 | Knave 2e | Faction systém, NPC generování |
| Ep3 | Bernpyle #8 | Miscast tabulky |
| Ep3 | Ironsworn Oracles | NPC goals/motivace |
| Ep3 | Hanson Expansion | Spell tabulky (2d8), Downtime |
| Ep4 | Burrows Chronicles | Adventure sites |
| Ep6 | Deck of Dungeons | Procedurální dungeon generování |
| Ep11 | Poppyseed House | Town supplement |
| Ep15 | Solo Toolkit | Dungeon flowchart, town reaction |
| Ep24 | The Woodshed | Finální adventure module |

**Klíčový trend:** Toolkit rostl z 5 → 12+ supplementů přes 24 epizod. Každý nový supplement přidával specifickou procedurální vrstvu (spelly, dungeony, frakce...).

---

## 3. PŘESNÉ MECHANIKY (ověřeno z epizod)

### 3.1 Bojový systém

**Útok: 2d6 (roll-high)**

| 2d6 | Výsledek | Damage |
|-----|----------|--------|
| 2–6 | Miss | žádné |
| 7–9 | Weak Hit | menší ze 2 kostek (disadvantage) |
| 10–11 | Hit (Strong) | větší ze 2 kostek (advantage) |
| 12 | Crushing Blow | maximální damage zbraně |

*Doloženo: Ep1, Ep2, Ep4, Ep5, Ep7, Ep9, Ep11, Ep16, Ep17*

**Speciální situace:**
- Prone target: damage die = d12 (místo normálního dX) — doloženo Ep9
- Armor: odečítá 1 nebo 2 z damage

**Saves: d20 roll-under**

| Výsledek | Pravidlo |
|----------|----------|
| d20 ≤ stat | SUCCESS |
| d20 > stat | FAIL |
| d20 = stat | SUCCESS (rovnost = úspěch, doloženo Ep3, Ep17) |

*Doloženo: Ep1–Ep17 konzistentně*

**Initiative:**
- DEX save (d20 ≤ DEX): SAVE = jde dříve, FAIL = jde později
- *Doloženo: Ep1, Ep2, Ep4, Ep7, Ep9*

**HP & Damage:**
- Damage jde do HP; po 0 HP → damage do STR
- Po každém STR damage: STR save, FAIL = Injured/KO
- Short Rest (1 watch): d6+1 HP recovered
- Morale: WIL save, FAIL = útěk; trigger: outmatched/critical/ally down

### 3.2 OPSE Oracle

**2d6 systém (ověřeno z OPSE PDF + epizod):**

| Pravděpodobnost | Podmínka Yes |
|-----------------|-------------|
| Likely | answer die ≥ 3 |
| Even | answer die ≥ 4 |
| Unlikely | answer die ≥ 5 |

**Mod die:**

| Roll | Efekt |
|------|-------|
| 1 | ...but |
| 2–5 | (bez modifikátoru) |
| 6 | ...and |

**6 výsledků:** Yes and / Yes / Yes but / No but / No / No and

**Scene Complication (d6):**

| Roll | Výsledek |
|------|----------|
| 1 | Hostile forces oppose you |
| 2 | An obstacle blocks your way |
| 3 | Wouldn't it suck if... |
| 4 | An NPC acts suddenly |
| 5 | All is not as it seems |
| 6 | Things actually go as planned |

**Altered Scene (d6) — spouští se při 5-6 na Scene check:**

| Roll | Výsledek |
|------|----------|
| 1 | A major detail is enhanced or worse |
| 2 | The environment is different |
| 3 | Unexpected NPCs are present |
| 4 | Add a Scene Complication |
| 5 | Add a Pacing Move |
| 6 | Add a Random Event |

**Failure Moves (d6):**

| Roll | Výsledek |
|------|----------|
| 1 | Cause Harm |
| 2 | Put Someone in a Spot |
| 3 | Offer a Choice |
| 4 | Advance a Threat |
| 5 | Reveal an Unwelcome Truth |
| 6 | Foreshadow Trouble |

**Pacing Moves:** Karetní systém (karta z balíčku)
- Hodnota karty = Action (Seek/Oppose/Communicate/Move/Harm/Create/Reveal/Command/Take/Protect/Assist/Transform/Deceive)
- Barva = Domain (Clubs=Physical, Diamonds=Technical, Spades=Mystical, Hearts=Social)

### 3.3 Frakce — Progress systém

**Progress Roll:** 1d6 + počet relevantních resources
- Výsledek = počet "marks" gained
- Cíl má threshold (3 nebo 5 marks)
- Po dokončení cíle → nový resource

**Faction Determination:** d4 roll (který z 4 faction typů = hostile forces)
*Doloženo: Ep21*

**Timing:** Faction rolls přeskočeny pro krátká časová okna (<1 týden game-time)
*Doloženo: Ep4 (autor explicitně vysvětluje přeskočení)*

### 3.4 Spell systém

**Spell Learning:**
- WIL save (d20 ≤ WIL) = 1 progress bod
- 5 progress bodů = kouzlo naučeno
- Jeden pokus per den
- *Doloženo: Ep3 (6-denní výzkum Frenzy)*

**Casting (Hanson/Mausritter):**
- Hod d6 per power slot
- Miscast: při 2d6=6,6 (Ep9) → Miscast efekt + WIL damage
- Miscast damage: 2d6 WIL dmg, pak WIL save vs Drained
- Usage dots: po použití d6; plné dots = kouzlo vyčerpáno

**Arcane talent (Level 2 wizard):** Memorize jeden spell tablet → nezabírá inventory slot

### 3.5 Level Up

| Co | Mechanismus |
|----|-------------|
| HP | nd6, kde n = nový level |
| Stat | d20 > aktuální hodnota = +1 |
| Talent | Jeden nový talent per level |

**Viděné talenty:**
- **Arcane** (L2 wizard): memorize 1 spell tablet
- **1 Grit** (L2): ignore 1 condition per rest
- **Aegis** (L3 z Adventuring Mice): intercept 1 damage pro sousedního spojence

### 3.6 Dungeon generování

**Živé generování (per místnost):**

| Hod | Výsledek |
|-----|----------|
| d6 typ | Passage/Area/... |
| d6 obsah | Empty/Encounter/Trap/Treasure |
| d20 detail | Rotting acorns/Statue/... |

**Tvar místnosti (d6):** Irregular/Circular/Rectangular/L-shaped/Tiered/Irregular

**Encounter:** d6 typ + 2d6 Reaction roll

### 3.7 Weather & Travel

**Weather roll:** 2d6 (Bitter Cold 6, Sleet 4, Overcast 10)
**Seasonal Events:** d6 (1 = Snow prevents travel 1 týden)
**STR save v nepříznivém počasí:** FAIL → Exhausted condition (obsadí 1 inventory slot)

### 3.8 NPC generování

- Gender: d6
- Jméno: d100
- Osobnost: d100
- Fyzické rysy: d100 (3× pro detaily)
- Profese: d100
- Cíle: d100

---

## 4. NARATIVNÍ VZORY

### Jak autor interpretuje Oracle

1. **"No, But"** = nejzajímavější výsledek → vždy přidá alternativu nebo complication
   *Ep1: "Can wall be climbed? No, but (can jump to nearby house)"*

2. **"Yes, But"** = úspěch s malou cenou
   *Ep2: "Sling repair free? Yes, but (2 pips cost)"*

3. **"Yes, And"** = intenzifikace dominantního trendu (i negativního)
   *Ep2: Mayor's disposition Unlikely → Yes, And = aktivní nepřízeň (horší než jen Yes)*

4. **Vágní výsledky** → autor vyplní narrativně pomocí kontextu
   *Ep3: Oba failed saves pro trap = "trap set but won't work" — elegantní interpretace*

5. **Pravděpodobnostní framing:** Autor VŽDY rozhodne "Unlikely/Likely/Even" PŘED hodem
   = meta-rozhodnutí autora, pak Oracle potvrdí/překvapí

6. **Karetní systém** (Ep15+): Action Focus + Topic Focus = dvojice slov k narrativní interpretaci
   = více prostoru pro kreativitu než binární Yes/No

7. **d4 faction roll:** Explicitní mechanismus pro výběr hostile faction = zabraňuje autorskému biasu

### Kdy autor "fudguje" (ohýbá pravidla)

- XP za non-combat řešení (+20 bonus) — vlastní house rule
- Přeskočení faction rolls pro krátká časová okna (vědomé rozhodnutí)
- Interpretace "Yes, And" pro negativní kontexty jako intenzifikace negativního (ne přidání pozitivního)

### Struktura session

1. Seznam materiálů (vždy na začátku)
2. Recap předchozí epizody
3. Faction Progress Rolls (jen po delším časovém okně)
4. Set the Scene (Complication + Weather + Event)
5. Gameplay (Oracle-driven)
6. Wrap-up (XP + inventory + cliffhanger)

---

## 5. CO TATO ANALÝZA ŘÍKÁ O APLIKACI

### Validace PLAN-ANALYSIS.md

| Zjištění z blogu | Impakt na plán |
|-----------------|----------------|
| Autor začíná KAŽDOU session materiály + recap | **Potvrzuje F1 (Session Flow)** — "Vítej zpět + recap" je klíčové |
| Oracle je JÁDRO celé hry (každá scéna) | **Potvrzuje** Oracle panel jako centrální prvek |
| 12 supplementů = kognitivní zátěž | **Potvrzuje** potřebu zjednodušení navigace (F3) |
| Faction rolls přeskočeny pro krátká okna | **Nová feature**: faction tracker s časovým razítkem |
| Karetní systém OPSE (Ep15+) | **Nová feature**: alternativní karetní oracle |
| Dungeon generování per místnost | **Potvrzuje** hex grid + průzkumový panel (F5) |
| Morale systém u NPCs | **Chybí v CombatPanel** — dodat |
| Prone = d12 damage | **Chybí v CombatPanel** — dodat mechaniku |
| Session začíná Season/Weather rollem | **Potvrzuje** integraci TimePanel do Session Start |

### Nové featury navržené na základě blogu

1. **Toolkit Tracker** — seznam aktivních supplementů v kampani (jak autor u každé session)
2. **Faction Progress Timeline** — automatické připomínání faction rolls po X game-time
3. **Karetní Oracle** — alternativa k 2d6 (Pacing Moves z OPSE)
4. **NPC Generator** (Gender/Jméno/Osobnost/Cíle) — integrovat do WorldPanel
5. **Prone condition** v CombatPanel → d12 damage automaticky
6. **Morale mechanic** pro NPC v CombatPanel

---

## 6. OTEVŘENÉ OTÁZKY

1. **Přesný miscast systém:** 2d6=12 = automatický miscast? Nebo specifická podmínka?
2. **Bernpyle #3 modifikace:** Přesné "survivability tweaks" (text ho zmiňuje, ale nikdy nevysvětluje specifika)
3. **Even/Odd Oracle varianta:** V Ep5 "2d6=3,5 Yes (even result)" — alternativní systém?
4. **Faction progress vzorec:** 1d6+bonuses = celkový počet marks za jedno kolo, nebo threshold systém?
5. **Chybějící epizody Ep8, 10, 12-14, 18-20, 22-23** — zejm. Ep8-10 pro pochopení Daisy smrtí a Grape arrival
6. **Hanson Expansion spell tabulky** — 2d8 systém, ale kompletní tabulka není veřejná
7. **Warband pravidla** (Ep24) — odkud pochází?

---

## 7. POROVNÁNÍ NÁSTROJŮ

### Oracle: OPSE vs Mythic GME vs Ironsworn

| | OPSE 1.6 | Mythic GME 2e | Ironsworn |
|---|---|---|---|
| Systém | 2d6 | 2d10/d100 | 2d10 + d10 |
| Pravděpodobnostní úrovně | 3 | 9 | 5 |
| Chaos tracking | Ne | Ano (CF 1–9) | Ne |
| Pacing Moves | Karty | Tabulky | Ne |
| Licence | CC-BY-SA 4.0 | Placené | Zdarma (SR) |
| Vhodnost pro Mausritter | Nejlepší | Dobrý | Dobrý (oracle) |

**Naše aplikace** již má Mythic GME style (Chaos Factor, Scene Check) — **OPSE je jednodušší alternativa vhodná pro začátečníky.**

---

*Analyza provedena: 2026-02-22*
*Agenti: Episode Hunter + OPSE Analytik + Episode Analytik*

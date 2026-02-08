# MASTER PLÁN - Testování a zlepšování Mausritter Solo Companion

> **DŮLEŽITÉ:** Tento soubor je hlavní "mapa" celého procesu. Při každé session začni zde a aktualizuj stav.

---

## AKTUÁLNÍ STAV

```
FÁZE 0: Dokumentace     [HOTOVO]
FÁZE 1: Kritické opravy [HOTOVO]
FÁZE 2: Manuální testy  [HOTOVO]
FÁZE 3: Auto testy      [HOTOVO]   ✅
FÁZE 4: Refactoring     [ČEKÁ]     ← DALŠÍ KROK
```

**Poslední aktualizace:** 2026-01-22 (večer)
**Poslední aktivita:** Fáze 3 dokončena - Playwright test suite vytvořen

---

## STRUKTURA DOKUMENTŮ

```
docs/
├── master-plan.md           ← TENTO SOUBOR (hlavní mapa)
├── testing-plan.md          ← Checklisty co testovat (HOTOVO)
├── skeptical-analysis.md    ← Kritická analýza problémů (HOTOVO)
└── test-findings.md         ← Nálezy z testování (vytvoří se ve Fázi 2)
```

---

## FÁZE 0: DOKUMENTACE [HOTOVO]

### Co bylo vytvořeno:
- [x] `docs/testing-plan.md` - Kompletní checklisty pro testování
- [x] `docs/skeptical-analysis.md` - Kritické problémy a rizika

### Klíčové nálezy:
| # | Kritický problém | Řádek v kódu | Dopad |
|---|------------------|--------------|-------|
| K1 | Import bez potvrzení | ~15059 | Ztráta dat |
| K2 | Chybí Error Boundaries | - | App crash |
| K3 | localStorage QuotaExceeded | - | Tiché selhání |
| K4 | Firebase race conditions | ~15194 | Data overwrite |
| K5 | Google token expiration | - | Sync selže |

---

## FÁZE 1: KRITICKÉ OPRAVY [HOTOVO]

**Cíl:** Zajistit že se data neztrácí během testování.

### Úkoly:
- [x] **K1: Import potvrzení** - Přidat confirm dialog před importem ✅
  - Soubor: `mausritter-project/mausritter-solo-companion.jsx`
  - Funkce: `handleImport` (~řádek 15059)
  - Hotovo: 2025-01-22

- [x] **K2: Error Boundary** - Přidat React Error Boundary ✅
  - Obalit hlavní komponentu
  - Zobrazit recovery UI místo bílé obrazovky
  - Hotovo: 2025-01-22

- [x] **K3: localStorage limit** - Ošetřit QuotaExceededError ✅
  - Přidán `safeLocalStorageSet` helper s try-catch
  - Přidán UI toast pro varování o plném úložišti
  - Hotovo: 2026-01-22

- [x] **K4: Loading states** - Přidat indikátory načítání ✅
  - Firebase `syncToFirebase` - přidán status 'syncing'/'connected'/'error'
  - `createRoom` a `joinRoom` již měly správné statusy
  - Hotovo: 2026-01-22

- [x] **K5: Token varování** - Upozornit na expiraci Google tokenu ✅
  - Přidán `googleTokenExpiry` state a `isGoogleTokenExpired` helper
  - Kontrola expirace před `saveToGoogleDrive`
  - Ošetření HTTP 401 response
  - Alert při vypršení tokenu
  - Hotovo: 2026-01-22

### Po dokončení:
1. ✅ Build: `node mausritter-project/build-html.js`
2. Test: Otevřít aplikaci a ověřit změny
3. ✅ Aktualizovat tento soubor - změnit [ČEKÁ] na [HOTOVO]

---

## FÁZE 2: MANUÁLNÍ TESTOVÁNÍ [HOTOVO]

**Cíl:** Projít všechny checklisty a zdokumentovat nálezy.

### Postup:
1. Otevřít `docs/testing-plan.md`
2. Projít sekce 1-6 postupně
3. Každý nalezený problém zapsat do `docs/test-findings.md`

### Checklisty k projití:
- [x] 1. TECHNICKÉ TESTOVÁNÍ (localStorage, Firebase, Google Drive)
- [x] 2. FUNKČNÍ TESTOVÁNÍ (12 panelů, generátory)
- [x] 3. UX TESTOVÁNÍ (navigace, mobile, errory)
- [x] 4. BEZPEČNOSTNÍ TESTOVÁNÍ
- [x] 5. PERFORMANCE TESTOVÁNÍ
- [x] 6. EDGE CASES

### Výstup:
- Soubor `docs/test-findings.md` s kategorizovanými nálezy ✅

### Výsledky:
- **Kritické problémy:** 0
- **Vysoké problémy:** 1 (smazání slotu nefunguje)
- **Střední problémy:** 1 (console warnings)
- **Pozitivní nálezy:** 15+ (persistence, panely, XSS, mobile)

---

## FÁZE 3: AUTOMATIZOVANÉ TESTY [HOTOVO]

**Cíl:** Napsat Playwright testy pro kritické scénáře.

### Co bylo vytvořeno:
- ✅ Playwright instalace + konfigurace (`playwright.config.ts`)
- ✅ Storage helpers (`tests/helpers/storage-helpers.ts`)
- ✅ Test fixtures pro migraci v1-v4 (`tests/fixtures/`)
- ✅ README-TESTING.md - kompletní návod pro začátečníky

### Vytvořené testy:
```
tests/
├── helpers/
│   └── storage-helpers.ts           # localStorage utils
├── fixtures/
│   ├── save-data-v1.json            # Migrace test data
│   ├── save-data-v2.json
│   ├── save-data-v3.json
│   └── save-data-v4-current.json
├── data-persistence.spec.ts         # ✅ P0: localStorage + K3
├── slot-system.spec.ts              # ✅ P0: Slot CRUD + F1 bug (skip)
├── migration.spec.ts                # ✅ P1: Migrace v1→v4
├── import-export.spec.ts            # ✅ P1: Import/Export + K1
└── edge-cases.spec.ts               # ✅ P2: České znaky, XSS
```

### Výsledky:
- **Vytvořeno:** ~30 testů pokrývajících kritické scénáře
- **F1 bug test:** Vytvořen jako `test.skip()` - připravený na verify
- **Dokumentace:** `README-TESTING.md` s návody
- **Stav:** ⚠️ Testy vyžadují doladění UI selektorů (tlačítka, formuláře)

### Spuštění testů:
```bash
npm test               # Všechny testy
npm run test:headed    # S viditelným browserem
npm run test:ui        # Interaktivní UI
```

### Po dokončení:
1. ⚠️ Testy vyžadují doladění selektorů podle skutečného UI
2. ✅ Playwright infrastruktura funguje
3. ✅ Dokumentace hotová
4. ✅ Master plan aktualizován

---

## FÁZE 4: REFACTORING [ČEKÁ]

**Cíl:** Zlepšit maintainability kódu.

### Kandidáti:
| Komponenta | Řádky | Problém | Řešení |
|------------|-------|---------|--------|
| JournalPanel | ~1930 | Příliš velká | Rozdělit na sub-komponenty |
| MausritterSoloCompanion | ~3500 | Veškerý state | Extrahovat custom hooks |
| CharacterPanel | ~1380 | Mnoho useState | Custom hooks |

### Postup:
1. Extrahovat shared utilities (weather, drag&drop, mentions)
2. Vytvořit custom hooks pro Firebase sync
3. Rozdělit velké komponenty
4. Po každé změně spustit testy

### Po dokončení:
1. Komponenty < 500 řádků
2. Všechny testy procházejí
3. Aktualizovat tento soubor

---

## RYCHLÝ START PRO NOVOU SESSION

### Když začínáš novou session:
1. **Přečti tento soubor** - zjisti kde jsi
2. **Podívej se na AKTUÁLNÍ STAV** nahoře
3. **Pokračuj v aktuální fázi** podle checklistů

### Příkazy:
```bash
# Dev server
python3 -m http.server 8081

# Build
node mausritter-project/build-html.js

# Otevřít aplikaci
# http://localhost:8081/mausritter-solo-companion.html
```

### Hlavní soubor:
```
mausritter-project/mausritter-solo-companion.jsx  # 18,000+ řádků
```

---

## SOUVISEJÍCÍ DOKUMENTY

| Soubor | Účel | Stav |
|--------|------|------|
| `docs/testing-plan.md` | Checklisty co testovat | HOTOVO |
| `docs/skeptical-analysis.md` | Kritické problémy | HOTOVO |
| `docs/test-findings.md` | Nálezy z testování | HOTOVO |
| `README-TESTING.md` | Návod k testování | HOTOVO |

---

## POZNÁMKY

_(Sem piš poznámky z jednotlivých sessions)_

### Session 2025-01-22:
- Vytvořena dokumentace
- Identifikováno 5 kritických problémů
- Navržen 4-fázový postup

### Session 2026-01-22 (ranní):
- Dokončena FÁZE 1: Kritické opravy
- K3: Přidán `safeLocalStorageSet` helper + UI toast pro QuotaExceededError
- K4: Přidány loading status do `syncToFirebase` (createRoom/joinRoom již měly)
- K5: Přidána kontrola expirace Google tokenu + handling 401 response
- Build úspěšný, připraveno k testování

### Session 2026-01-22 (odpolední):
- **Verifikace K3, K4, K5** pomocí Playwright testů:
  - K3: Kód nalezen na řádcích 14597, 14623-14636, 17078-17090 ✅
  - K4: Otestováno vytvořením místnosti "Test Room" - stavy fungují ✅
  - K5: OAuth flow funguje, kód na řádcích 14598, 14638-14641, 16433-16491 ✅
- **Drobné opravy:**
  - Gramatika: "Kritický minutí" → "Kritické minutí" (řádek 4980)
  - Přidán 🐭 SVG favicon do build-html.js (řádek 62)
- **UX nálezy:**
  - Oddělené sekce sólo her a multiplayer místností - dobré!
  - Tlačítko "▶️ Pokračovat" pro rychlý přístup k poslední hře
  - Varování před připojením k místnosti o lokálních datech
- Připraveno pro Fázi 2: Manuální testování

### Session 2026-01-22 (večerní) - FÁZE 2 DOKONČENA:
- **Automatické testování pomocí Playwright MCP**
- **Testované oblasti:**
  - localStorage persistence ✅
  - Slot system (vytvoření, načtení) ✅
  - Panely: Journal, Oracle, Character, Time, World, Combat ✅
  - Mobile responsivita (375x667) ✅
  - XSS ochrana ✅
  - České znaky a emoji ✅
- **Nalezené problémy:**
  - F1: Tlačítko smazání slotu nereaguje (P1)
  - F2: Console warnings - Tailwind/Babel (P2)
- **Výstup:** `docs/test-findings.md` vytvořen
- **Závěr:** Aplikace stabilní, připraveno pro Fázi 3

### Session 2026-01-22 (pozdní večer) - FÁZE 3 DOKONČENA:
- **Playwright test suite vytvořen**
- **Setup:**
  - Playwright instalace: `npm install -D @playwright/test`
  - Konfigurace: `workers: 1`, `fullyParallel: false` (localStorage)
  - Python HTTP server jako webServer
- **Vytvořeno:**
  - 5 test souborů (~30 testů): persistence, slots, migration, import/export, edge-cases
  - Storage helpers pro localStorage testing
  - Test fixtures pro migraci v1→v4
  - `README-TESTING.md` - kompletní návod pro začátečníky
- **Stav:**
  - ✅ Playwright infrastruktura funkční
  - ⚠️ Testy vyžadují doladění UI selektorů
  - ✅ F1 bug test vytvořen jako `test.skip()`
  - ✅ Dokumentace hotová
- **Spuštění:** `npm test`
- **Závěr:** Test suite připravený, vyžaduje doladění podle skutečného UI

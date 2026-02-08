# Testovací plán - Mausritter Solo Companion

Tento dokument definuje systematický přístup k testování aplikace. Každá sekce obsahuje:
- Co testovat
- Jak testovat
- Checklist položek
- **SKEPTICKÝ POHLED** - kritické otázky hledající chyby

---

## 1. TECHNICKÉ TESTOVÁNÍ

### 1.1 Data persistence (localStorage, slot system)

**Co testovat:**
- Ukládání dat do localStorage
- Slot system (vytvoření, načtení, smazání, přejmenování)
- Auto-save při změnách
- Integrita dat po reload stránky

**Jak testovat:**
- Chrome DevTools → Application → Local Storage
- Manuální testování CRUD operací
- Playwright E2E testy

**Checklist:**
- [ ] Vytvořit nový slot → data se uloží do `mausritter-slot-{id}`
- [ ] Přidat postavu → slot se aktualizuje
- [ ] Reload stránky → data zůstanou
- [ ] Smazat slot → data zmizí z localStorage
- [ ] Přejmenovat slot → metadata se aktualizují
- [ ] Ověřit `mausritter-slots-index` obsahuje všechny sloty

**SKEPTICKÝ POHLED:**
- Co když localStorage je plný? (limit ~5-10MB) - aplikace neošetřuje `QuotaExceededError`
- Co když uživatel má 50 slotů s velkými deníky?
- Co když dva taby zapisují současně do stejného slotu?
- Co když `JSON.parse` selže na corrupted datech?
- Kde je validace struktury dat před uložením?

---

### 1.2 Migrace dat (v1→v4)

**Co testovat:**
- Automatická migrace starých savů
- Zachování všech dat při migraci
- Forward compatibility

**Jak testovat:**
- Inject starý formát do localStorage
- Reload a ověřit migraci
- Playwright test s prepared fixtures

**Checklist:**
- [ ] v1 save (single character) → migruje na v4 (parties array)
- [ ] v2 save → migruje správně
- [ ] v3 save → migruje správně
- [ ] Neznámá pole se zachovají v `_extra`
- [ ] Corrupted JSON → graceful error handling

**Test data pro v1:**
```json
{
  "version": 1,
  "character": {"name": "TestMouse", "hp": 3},
  "journal": [{"id": "1", "text": "Test"}]
}
```

**SKEPTICKÝ POHLED:**
- Co když migrace selže uprostřed? Data jsou ztracena?
- `migrateSaveData` (řádek ~2085) neprovádí validaci vstupu
- Neexistuje rollback mechanismus při selhání migrace
- Co když nová verze přidá povinné pole které ve starém save chybí?
- Testuje se migrace automaticky při každém releasu?

---

### 1.3 Firebase multiplayer sync

**Co testovat:**
- Vytvoření místnosti (createRoom)
- Připojení do místnosti (joinRoom)
- Real-time synchronizace stavu
- Presence system (online/offline)
- Reconnect po výpadku
- Kick player funkcionalita

**Jak testovat:**
- Dva prohlížeče/zařízení
- Firebase Emulator Suite
- Network throttling v DevTools

**Checklist:**
- [ ] GM vytvoří místnost → 6-znakový kód
- [ ] Hráč se připojí s kódem + jméno + PIN
- [ ] GM změní data → hráč vidí změnu do 1s
- [ ] Hráč změní data → GM vidí změnu
- [ ] Hráč zavře prohlížeč → presence se aktualizuje
- [ ] Hráč se znovu připojí → stav se obnoví
- [ ] Dva hráči stejné jméno → error handling
- [ ] Neplatný kód místnosti → error message
- [ ] Výpadek internetu → graceful degradation

**SKEPTICKÝ POHLED:**
- `syncToFirebase` (řádek ~15194) má debounce 500ms - co když 10 změn za 500ms?
- Race condition: dva hráči mění současně → poslední `.set()` vyhraje, první změny ztraceny
- `generatePlayerId` (řádek ~15100) je jednoduchý hash - možné kolize
- PIN má jen 4 číslice (10000 možností) - brute-force vulnerability
- Firebase security rules - kdo je může vidět? Audit?
- `onDisconnect` handler - funguje při náhlém crash prohlížeče?
- Memory leak: Firebase listeners se registrují ale odregistrovávají se při leave?
- Co když Firebase má výpadek? Žádný offline queue

---

### 1.4 Google Drive sync

**Co testovat:**
- OAuth přihlášení
- Výběr složky (Picker API)
- Upload/download souborů
- Conflict detection a resolution
- Token refresh

**Jak testovat:**
- Manuální testování s Google účtem
- Google OAuth Playground
- Simulace konfliktů (editace z jiného zařízení)

**Checklist:**
- [ ] Přihlásit se přes Google → token uložen
- [ ] Vybrat složku → `googleDriveFolderId` v localStorage
- [ ] Uložit data → soubor na Drive
- [ ] Změnit data → auto-sync po 3s
- [ ] Odhlásit se → token revoked
- [ ] Konflikt (cloud novější) → dialog s výběrem
- [ ] Token expired po 1h → ?

**SKEPTICKÝ POHLED:**
- Token expiration není explicitně ošetřena - `googleAccessToken` může být expired
- `saveToGoogleDrive` (řádek ~16372) nekontroluje `response.ok`
- `loadFromGoogleDrive` (řádek ~16482) neprovádí validaci dat
- Co když uživatel smaže složku na Drive během session?
- Conflict resolution (řádek ~15902) není atomická operace
- API rate limits - co při častých změnách?
- Co když Google změní API verzi?

---

### 1.5 File System Access API sync

**Co testovat:**
- Výběr souboru
- Auto-save
- Load existujícího souboru
- Browser compatibility

**Jak testovat:**
- Chrome/Edge (podporováno)
- Firefox/Safari (nepodporováno - fallback?)

**Checklist:**
- [ ] Vybrat/vytvořit soubor → `fileHandle` uložen
- [ ] Změnit data → auto-save po 2s
- [ ] Reload → nutno znovu vybrat soubor (security)
- [ ] Soubor zamčený jiným programem → error handling
- [ ] Firefox → UI pro tuto funkci skryté/disabled?

**SKEPTICKÝ POHLED:**
- Co když uživatel přesune/smaže soubor během session?
- `connectToFile` (řádek ~15625) neprovádí verifikaci obsahu
- Debounce 1000ms (řádek ~15691) - co při velkém save?
- Žádný fallback pro Firefox/Safari - uživatel neví proč funkce chybí
- File handle se neuloží přes reload (browser security) - UX matoucí?

---

### 1.6 Import/Export JSON

**Co testovat:**
- Export všech dat
- Import a migrace
- Encoding (české znaky, emoji)
- Velké soubory

**Jak testovat:**
- Manuální export/import
- Prepared test files s různým obsahem

**Checklist:**
- [ ] Export → JSON soubor se stáhne
- [ ] Import v1 save → migruje na v4
- [ ] Import s českými znaky → správné zobrazení
- [ ] Import s emoji → správné zobrazení
- [ ] Import nevalidní JSON → error message
- [ ] Import 10MB soubor → performance

**SKEPTICKÝ POHLED:**
- **KRITICKÉ:** Import OKAMŽITĚ PŘEPÍŠE data bez potvrzení! (řádek ~15059)
- Žádná validace struktury - co když uživatel importuje úplně jiný JSON?
- Chybí progress indicator pro velké soubory
- `event.target.value = ''` reset až na konci (řádek ~15077) - proč?
- Co když export selže uprostřed? Partial file?
- Filename obsahuje `activeParty.name` - co když je `null`?

---

## 2. FUNKČNÍ TESTOVÁNÍ

### 2.1 Panely (12 panelů)

**Oracle Panel:**
- [ ] Yes/No oracle (2d6) - všechny 3 módy (unlikely/even/likely)
- [ ] Complication generator
- [ ] Action + Theme oracle
- [ ] Event generator (5 typů)
- [ ] Creature generator
- [ ] Card draw

**SKEPTICKÝ POHLED:** OraclePanel má ~3500 řádků - příliš komplexní, těžko testovatelný

**Combat Panel:**
- [ ] Iniciativa tracking
- [ ] Damage resolution (Hit Table)
- [ ] HP/STR tracking
- [ ] Combat log

**SKEPTICKÝ POHLED:** Formulace útoku zjednodušená - odpovídá pravidlům Mausritter?

**Character Panel:**
- [ ] Vytvoření nové postavy (generátor)
- [ ] Editace atributů
- [ ] Inventory management (drag & drop)
- [ ] Hireling recruitment
- [ ] Treasury management

**SKEPTICKÝ POHLED:** 15+ useState v jedné komponentě - state management chaos?

**World Panel:**
- [ ] CRUD settlements
- [ ] CRUD NPCs
- [ ] NPC behavior generators
- [ ] Bestiary browser

**SKEPTICKÝ POHLED:** NPC behaviors se generují ale nepersistují do deníku automaticky

**Faction Panel:**
- [ ] CRUD factions
- [ ] Progress tracking
- [ ] Goals management

**SKEPTICKÝ POHLED:** Minimální UI - chybí vizualizace vztahů mezi frakcemi

**Time Panel:**
- [ ] Day/Season/Watch/Turn tracking
- [ ] Weather generation
- [ ] Dungeon vs Wilderness context

**SKEPTICKÝ POHLED:** Weather generování duplicitní na více místech v kódu

**Journal Panel:**
- [ ] CRUD entries (12 typů)
- [ ] Mention system (@NPC, @Settlement)
- [ ] Drag & drop reordering
- [ ] Party filtering
- [ ] Multi-select mode

**SKEPTICKÝ POHLED:** JournalPanel má 1930+ řádků - kandidát na refactoring

**Ostatní panely:**
- [ ] Lexikon Panel - CRUD lore entries
- [ ] SmallWorld Panel - exploration generators
- [ ] ItemCardStudio - card generation
- [ ] Events Panel - timed events
- [ ] HowToPlay Panel - static content

---

### 2.2 Generátory

**Checklist:**
- [ ] Character generator - jména, znamení, atributy
- [ ] NPC generator - mood, action, motivation, secret
- [ ] Weather generator - 4 sezóny × 2d6
- [ ] Encounter generator - creatures, activities
- [ ] Loot generator - complications

**SKEPTICKÝ POHLED:**
- Jsou tabulky kompletní podle pravidel Mausritter?
- Jsou pravděpodobnosti správné (2d6 distribuce)?
- Generátory používají `Math.random()` - je to dostatečně náhodné?

---

### 2.3 Inventář a vybavení

**Checklist:**
- [ ] 4 sloty (2 body, 2 pack)
- [ ] Drag & drop mezi sloty
- [ ] Item popup s detaily
- [ ] Encumbrance pravidla

**SKEPTICKÝ POHLED:**
- Odpovídá slot system pravidlům Mausritter?
- Co když item překračuje kapacitu slotu?
- Jsou všechny předměty z pravidel implementovány?

---

### 2.4 Časový systém

**Checklist:**
- [ ] Inkrementace turn/watch/day/season
- [ ] Cyklický kalendář (4 sezóny)
- [ ] Odpočinek a vyčerpání
- [ ] Encounter reminders

**SKEPTICKÝ POHLED:**
- Odpovídá časový systém pravidlům?
- Co se stane při přechodu sezón?
- Jsou encounter checkpointy správně nastavené?

---

### 2.5 Mention system

**Checklist:**
- [ ] @NPC funguje v deníku
- [ ] @Settlement funguje
- [ ] @Character funguje
- [ ] Autocomplete nabízí správné entity
- [ ] Kliknutí na mention → navigace

**SKEPTICKÝ POHLED:**
- 3 různé formáty mention (`@[Jméno](typ:id)`, `@Jméno`, `@kategorie:název`) - zbytečná komplexita
- Co když entita je smazána ale mention zůstane?
- Performance při mnoha entitách v autocomplete?

---

## 3. UX TESTOVÁNÍ

### 3.1 Navigace mezi panely

**Checklist:**
- [ ] Klik na tab → přepnutí panelu
- [ ] Stav panelu se zachová při přepnutí
- [ ] Mobile menu toggle funguje
- [ ] Keyboard navigation (Tab, Enter)

**SKEPTICKÝ POHLED:**
- Žádné URL routing - nelze bookmarkovat konkrétní panel
- History API nepoužito - Back button nefunguje
- 12 panelů v hlavní navigaci - příliš mnoho?

---

### 3.2 Responzivita (mobile/desktop)

**Checklist:**
- [ ] Desktop (1920×1080) - 3 sloupce
- [ ] Tablet (768×1024) - 2 sloupce
- [ ] Mobile (375×667) - 1 sloupec
- [ ] Touch interactions (long press, swipe)

**Testovací viewporty:**
```javascript
// Playwright
await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
await page.setViewportSize({ width: 768, height: 1024 }); // iPad
await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
```

**SKEPTICKÝ POHLED:**
- Touch targets menší než 44×44px na některých místech
- Overflow-x problémy v inventory na malých displejích
- Font sizes nečitelné na malých zařízeních
- Fixed dialogy se necentrují správně na mobile

---

### 3.3 Error feedback

**Checklist:**
- [ ] Nevalidní vstup → error message
- [ ] Network error → user-friendly message
- [ ] Firebase error → toast notification
- [ ] Google Drive error → dialog

**SKEPTICKÝ POHLED:**
- Hodně `console.error` ale málo user-facing errors
- `alert()` používán na mnoha místech - nemodení UX
- Chybí error boundaries pro React errors
- Toast zmizí po 3s - stačí pro přečtení?
- Žádný retry mechanismus pro selhané operace

---

### 3.4 Onboarding a discoverability

**Checklist:**
- [ ] HowToPlay panel je přístupný
- [ ] Nový uživatel ví kde začít
- [ ] Tooltips na ikonách
- [ ] Help texty u komplexních funkcí

**SKEPTICKÝ POHLED:**
- Žádný guided tour nebo tutorial
- @ mention system není nikde vysvětlen
- Slot system může být matoucí
- Multiplayer setup je komplexní (GM PIN, room code)

---

### 3.5 Komplexita UI

**Checklist:**
- [ ] Každá akce vyžaduje max 3 kliky
- [ ] Nejčastější akce jsou snadno dostupné
- [ ] Destruktivní akce mají potvrzení

**SKEPTICKÝ POHLED:**
- 14 panelů - cognitive overload?
- Některé funkce schované v sub-menu
- Chybí klávesové zkratky (Ctrl+S, Ctrl+Z)
- **Chybí Undo/Redo** - základní UX expectation!

---

## 4. BEZPEČNOSTNÍ TESTOVÁNÍ

### 4.1 Firebase security rules

**Checklist:**
- [ ] Přístup pouze k vlastní místnosti
- [ ] Nelze číst cizí data
- [ ] Nelze mazat cizí místnosti
- [ ] Rate limiting

**Jak testovat:**
- Firebase Console → Rules Playground
- Pokus o přístup k cizí místnosti přes API

**SKEPTICKÝ POHLED:**
- Kde jsou rules definovány? Jsou v repo?
- Kdo je může měnit?
- Existuje audit log?
- Jsou rules testovány automaticky?

---

### 4.2 API klíče

**Checklist:**
- [ ] Google API Key má domain restrictions
- [ ] Firebase config je public (by design) ale s rules

**SKEPTICKÝ POHLED:**
- `GOOGLE_API_KEY` a `FIREBASE_CONFIG` hardcoded v klientu (řádky 10, 14-22)
- API key restrictions nastaveny v GCP console?
- Co když někdo key zneužije?

---

### 4.3 XSS v uživatelských vstupech

**Checklist:**
- [ ] Journal entry s `<script>` → escaped
- [ ] NPC jméno s HTML → escaped
- [ ] Mention s injection → escaped

**Test vstupy:**
```
<script>alert('xss')</script>
<img src=x onerror=alert('xss')>
{{constructor.constructor('alert(1)')()}}
```

**SKEPTICKÝ POHLED:**
- React escapuje by default, ale jsou někde `dangerouslySetInnerHTML`?
- Mention parsing - jsou regex safe?
- Export JSON - je sanitized?

---

## 5. PERFORMANCE TESTOVÁNÍ

### 5.1 Velké datasety

**Checklist:**
- [ ] 100 journal entries → <1s render
- [ ] 500 journal entries → <2s render
- [ ] 1000 journal entries → acceptable
- [ ] 50 NPCs → smooth scrolling

**Jak testovat:**
- Inject test data do localStorage
- Lighthouse performance audit
- React DevTools Profiler

**SKEPTICKÝ POHLED:**
- Žádná virtualizace dlouhých seznamů
- Všechny entries renderovány najednou
- Filter/search přepočítává při každém renderue

---

### 5.2 Memory leaks

**Checklist:**
- [ ] Heap size stabilní po 1h používání
- [ ] Firebase listeners cleanup při leave
- [ ] useEffect cleanup functions implementovány

**Jak testovat:**
- Chrome DevTools → Memory → Heap snapshot
- Porovnat snapshoty před/po operacích

**SKEPTICKÝ POHLED:**
- 212+ `useState` hooks - memory overhead?
- Firebase `on()` listeners - jsou `off()` při cleanup?
- `setInterval`/`setTimeout` - jsou cleared?

---

### 5.3 Re-renders

**Checklist:**
- [ ] Změna v jednom panelu neovlivní jiné
- [ ] useMemo/useCallback použito kde potřeba
- [ ] React.memo na velkých komponentách

**SKEPTICKÝ POHLED:**
- Hlavní state v jedné komponentě → cascade re-renders?
- Jsou props stabilní (referenční rovnost)?
- Žádný state management library (Redux/Zustand)

---

## 6. EDGE CASES

### 6.1 Concurrent tabs

**Checklist:**
- [ ] Otevřít 2 taby se stejným slotem
- [ ] Změnit data v tab 1
- [ ] Tab 2 → ?

**SKEPTICKÝ POHLED:**
- localStorage nemá locking - race conditions
- Žádná detekce concurrent access
- Žádný merge strategie

---

### 6.2 Offline mode

**Checklist:**
- [ ] Odpojit internet → lokální změny fungují
- [ ] Připojit internet → sync?
- [ ] Firebase offline persistence?

**SKEPTICKÝ POHLED:**
- Žádný Service Worker pro offline support
- Firebase changes se nequeueují
- Google Drive sync selže tiše

---

### 6.3 Speciální znaky

**Checklist:**
- [ ] České znaky (ěščřžýáíé) v názvech
- [ ] Emoji v textu
- [ ] Dlouhé texty (10000+ znaků)
- [ ] Empty strings

**SKEPTICKÝ POHLED:**
- UTF-8 encoding konzistentní?
- JSON stringify/parse zachová emoji?
- Overflow text v UI?

---

### 6.4 Prázdné/null stavy

**Checklist:**
- [ ] Žádná party → empty state UI
- [ ] Prázdný deník → empty state UI
- [ ] `activePartyId` null → handled
- [ ] `parties` je `[]` ne `null`

**SKEPTICKÝ POHLED:**
- Kód používá `parties || []` ale ne všude konzistentně
- Co když `activePartyId` ukazuje na smazanou party?
- Null checks na všech místech?

---

## Testovací nástroje

| Nástroj | Účel | Setup |
|---------|------|-------|
| Playwright | E2E testy | `npm init playwright@latest` |
| Chrome DevTools | Manual inspection | Built-in |
| Lighthouse | Performance audit | DevTools → Lighthouse |
| React DevTools | Component profiling | Extension |
| axe-core | Accessibility | `npm install @axe-core/playwright` |
| Firebase Emulator | Local Firebase | `firebase emulators:start` |

---

## Prioritizace testů

### P0 - Kritické (testovat ihned)
1. Data persistence a migrace
2. Import bez potvrzení (data loss risk)
3. Firebase race conditions

### P1 - Vysoké (testovat brzy)
4. Google Drive token expiration
5. Error handling
6. Mobile responsiveness

### P2 - Střední (testovat průběžně)
7. Performance s velkými daty
8. Edge cases
9. Accessibility

### P3 - Nízké (nice to have)
10. Keyboard shortcuts
11. Advanced UX polish

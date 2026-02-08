# Skeptická analýza - Mausritter Solo Companion

Tento dokument obsahuje hloubkovou kritickou analýzu aplikace. Každý problém je kategorizován podle závažnosti a obsahuje konkrétní reference na kód.

---

## KRITICKÉ PROBLÉMY (MUSÍ SE OPRAVIT)

Tyto problémy mohou vést ke ztrátě dat nebo vážným bezpečnostním rizikům.

### K1: Import bez potvrzení přepíše všechna data

**Lokace:** `mausritter-solo-companion.jsx` řádek ~15059-15065

**Popis:**
Funkce `handleImport` okamžitě přepíše všechna lokální data bez jakéhokoliv potvrzovacího dialogu.

**Scénář selhání:**
1. Uživatel má rozehranou hru s 50 záznamy v deníku
2. Omylem klikne na Import místo Export
3. Vybere starý soubor
4. **Všechna data jsou nenávratně ztracena**

**Dopad:** Nenávratná ztráta dat

**Doporučené řešení:**
```javascript
// Před importem zobrazit dialog
if (!confirm(`Opravdu chcete importovat? Všechna současná data budou přepsána!\n\nAktuální stav:\n- ${parties.length} družin\n- ${journal.length} záznamů v deníku`)) {
  return;
}
```

---

### K2: Chybějící Error Boundaries

**Lokace:** Celá aplikace

**Popis:**
Aplikace nepoužívá React Error Boundaries. Jakákoliv neošetřená chyba v renderování způsobí bílou obrazovku.

**Scénář selhání:**
1. Corrupted data v localStorage (např. `parties[0].members` je `null` místo `[]`)
2. Komponenta se pokusí mapovat přes `null`
3. **Celá aplikace spadne s bílou obrazovkou**
4. Uživatel neví co se stalo, nemůže pokračovat

**Dopad:** Aplikace se stane nepoužitelnou

**Doporučené řešení:**
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorRecoveryScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

### K3: Race Condition při Firebase Sync

**Lokace:** `mausritter-solo-companion.jsx` řádek ~15194

**Popis:**
Funkce `syncToFirebase` používá `.set()` který přepíše celý stav. Při simultánním zápisu od dvou hráčů poslední zápis vyhraje.

**Scénář selhání:**
1. Hráč A a Hráč B mají otevřenou stejnou místnost
2. Ve stejnou vteřinu: A přidá záznam do deníku, B změní HP postavy
3. Oba `.set()` se pošlou na Firebase
4. **Jeden ze zápisů je ztracen** (pravděpodobně Aův záznam)

**Dopad:** Ztráta dat při multiplayer

**Doporučené řešení:**
```javascript
// Místo .set() použít .update() nebo transakce
const updates = {};
updates[`rooms/${roomCode}/state/journal`] = journal;
db.ref().update(updates);

// Nebo Firebase transakce pro atomické operace
db.ref(`rooms/${roomCode}/state`).transaction((currentState) => {
  // Merge změny
  return mergedState;
});
```

---

### K4: Token Expiration u Google Drive

**Lokace:** `mausritter-solo-companion.jsx` - Google OAuth handling

**Popis:**
OAuth access token má životnost ~1 hodinu. Aplikace neošetřuje expiraci tokenu.

**Scénář selhání:**
1. Uživatel se přihlásí k Google Drive
2. Hraje 2 hodiny
3. Token tiše expiruje
4. Auto-save selže bez varování
5. **Uživatel si myslí že data jsou uložena, ale nejsou**

**Dopad:** Ztráta dat bez vědomí uživatele

**Doporučené řešení:**
```javascript
// Před každou operací zkontrolovat token
const isTokenValid = () => {
  const tokenExpiry = localStorage.getItem('googleTokenExpiry');
  return tokenExpiry && Date.now() < parseInt(tokenExpiry);
};

// Refresh token před expirací
if (!isTokenValid()) {
  await refreshGoogleToken();
}
```

---

### K5: PIN má jen 4 číslice

**Lokace:** `mausritter-solo-companion.jsx` řádek ~15095

**Popis:**
Multiplayer PIN používá jen 4 číslice = 10,000 možností. Triviální brute-force.

**Scénář selhání:**
1. Útočník zná room code (6 znaků, viditelný)
2. Zkouší PINy od 0000 do 9999
3. Firebase nemá rate limiting
4. **Za ~30 minut získá přístup do místnosti**

**Dopad:** Neoprávněný přístup k herním datům

**Doporučené řešení:**
```javascript
// Delší PIN (6+ číslic) nebo alfanumerický
const pin = generateSecurePin(6); // 1,000,000 možností

// Rate limiting na Firebase
// V Firebase Rules:
".write": "!data.exists() || data.child('lastAttempt').val() < now - 60000"
```

---

## VYSOKÉ RIZIKO (MĚLO BY SE OPRAVIT)

### V1: Validace dat při importu chybí

**Lokace:** `handleImport` funkce

**Popis:**
Import přijme jakýkoliv JSON bez validace struktury.

**Scénář:**
```json
// Uživatel omylem importuje package.json
{"name": "my-project", "version": "1.0.0"}
```
Výsledek: Aplikace se pokusí použít `name` jako `parties`, crash nebo corrupted state.

**Doporučení:** JSON Schema validace nebo Zod/Yup

---

### V2: localStorage nemá limit checking

**Lokace:** Auto-save useEffect

**Popis:**
localStorage má limit ~5-10MB. Aplikace neošetřuje `QuotaExceededError`.

**Scénář:**
1. Uživatel má 20 slotů s velkými deníky
2. localStorage se zaplní
3. `setItem` vyhodí exception
4. **Data se neuloží, uživatel neví**

**Doporučení:**
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    alert('Úložiště je plné! Exportujte nebo smažte staré sloty.');
  }
}
```

---

### V3: Firebase listeners se možná neodregistrovávají

**Lokace:** Firebase setup v useEffect

**Popis:**
`stateRef.on('value', ...)` registruje listener. Při odchodu z místnosti se musí volat `.off()`.

**Scénář:**
1. Uživatel se 10× připojí a odpojí z místnosti
2. 10 listeners naslouchá
3. **Memory leak, zbytečný network traffic**

**Doporučení:** Audit všech `.on()` a zajistit `.off()` v cleanup

---

### V4: Concurrent tabs způsobí data corruption

**Lokace:** localStorage auto-save

**Popis:**
Dva taby mohou současně zapisovat do stejného slotu.

**Scénář:**
1. Tab A načte slot, má `journal: [1,2,3]`
2. Tab B načte slot, má `journal: [1,2,3]`
3. Tab A přidá entry → `journal: [1,2,3,4]` → uloží
4. Tab B přidá entry → `journal: [1,2,3,5]` → uloží
5. **Entry 4 je ztracena**

**Doporučení:** Detekce concurrent access pomocí `storage` eventu:
```javascript
window.addEventListener('storage', (e) => {
  if (e.key === currentSlotKey) {
    alert('Data byla změněna v jiném okně!');
  }
});
```

---

### V5: Chybí Undo/Redo

**Lokace:** Celá aplikace

**Popis:**
Žádná možnost vrátit zpět akci. Základní UX expectation.

**Scénář:**
1. Uživatel omylem smaže postavu
2. **Není cesta zpět**

**Doporučení:** Command pattern nebo history stack

---

## STŘEDNÍ RIZIKO (ZVÁŽIT OPRAVU)

### S1: Velké komponenty (maintainability)

| Komponenta | Řádky | Problém |
|------------|-------|---------|
| JournalPanel | ~1930 | Příliš mnoho zodpovědností |
| MausritterSoloCompanion | ~3500 | Veškerý state, těžké testování |
| OraclePanel | ~1200 | Mnoho generátorů v jednom |
| CharacterPanel | ~1380 | 15+ useState hooks |

**Doporučení:** Rozdělit na menší komponenty, custom hooks pro logiku

---

### S2: Duplicitní kód

**Příklady:**
- Weather generation na 3 místech
- Touch drag a Desktop drag jsou separátní implementace
- Mention parsing v několika komponentách

**Doporučení:** Extrahovat do shared utilities

---

### S3: 3 různé formáty mention

```
@[Jméno](typ:id)  // Starý formát
@Jméno            // Jednoduchý formát
@kategorie:název  // Lore tag formát
```

**Problém:** Komplexní parsing, matoucí pro uživatele

**Doporučení:** Sjednotit na jeden formát

---

### S4: Hardcoded API keys v klientu

**Lokace:** Řádky 10, 14-22

```javascript
const GOOGLE_API_KEY = 'AIzaSy...';
const FIREBASE_CONFIG = { apiKey: '...' };
```

**Poznámka:** Firebase config je by design public, ale Google API Key by měl mít domain restrictions v GCP Console.

---

### S5: Žádné loading states

**Popis:** Firebase operace běží bez vizuální indikace.

**Scénář:**
1. Uživatel klikne "Připojit k místnosti"
2. Nic se neděje 2 sekundy (network latency)
3. Uživatel klikne znovu
4. **Duplicitní requesty, možné race conditions**

**Doporučení:** Spinner/loading overlay při async operacích

---

## SKEPTICKÉ OTÁZKY PRO KAŽDOU OBLAST

### Synchronizace

| Otázka | Odpověď | Riziko |
|--------|---------|--------|
| Co když vypadne internet uprostřed Firebase save? | Změna se ztratí | Vysoké |
| Co když dva hráči uloží současně? | Poslední vyhraje | Vysoké |
| Co když Google Drive folder je smazán? | Save selže tiše | Střední |
| Co když File System soubor je přesunut? | Handle invalid | Střední |
| Co když localStorage je plný? | QuotaExceededError | Vysoké |

### Data Integrity

| Otázka | Odpověď | Riziko |
|--------|---------|--------|
| Co když migrace selže uprostřed? | Data corrupted | Kritické |
| Co když `parties` je `null` místo `[]`? | Crash | Vysoké |
| Co když `activePartyId` ukazuje na smazanou party? | Undefined behavior | Střední |
| Co když JSON v localStorage je corrupted? | Parse error, crash | Vysoké |

### Bezpečnost

| Otázka | Odpověď | Riziko |
|--------|---------|--------|
| Může útočník číst cizí místnosti? | Záleží na Firebase rules | Kritické |
| Je PIN dostatečně silný? | Ne (4 číslice) | Vysoké |
| Jsou API keys chráněny? | Částečně (domain restrictions) | Střední |
| Je XSS možné? | React escapuje, ale audit nutný | Střední |

### UX

| Otázka | Odpověď | Riziko |
|--------|---------|--------|
| Jak se uživatel dozví o chybě? | Většinou nedozví | Vysoké |
| Jak vrátí zpět omyl? | Nemůže | Vysoké |
| Je 12 panelů příliš? | Možná, potřeba user testing | Střední |
| Je mention system pochopitelný? | Ne bez dokumentace | Střední |

---

## FAILURE MODES - ANALÝZA

### FM1: Network Failure během kritické operace

```
[Uživatel] → [Akce: Uložit na Google Drive]
                    ↓
            [Network Request]
                    ↓
            [Internet vypadne]
                    ↓
            [Request timeout]
                    ↓
            [catch block: console.error()]
                    ↓
            [Uživatel neví že save selhal]
                    ↓
            [Zavře prohlížeč]
                    ↓
            [DATA ZTRACENA]
```

**Mitigace:** Toast notification při selhání, retry mechanismus

---

### FM2: Corrupted State Recovery

```
[Corrupted localStorage]
        ↓
[JSON.parse() selže]
        ↓
[catch block: prázdný stav]
        ↓
[Uživatel vidí prázdnou hru]
        ↓
[Auto-save přepíše corrupted data prázdnými]
        ↓
[ORIGINÁLNÍ DATA NENÁVRATNĚ ZTRACENA]
```

**Mitigace:** Backup před přepsáním, recovery mode

---

### FM3: Multiplayer Desync

```
[Hráč A]                    [Hráč B]
    |                           |
[Změní HP na 5]           [Změní HP na 3]
    |                           |
[.set({hp:5})]            [.set({hp:3})]
    |                           |
    +-----→ [Firebase] ←--------+
                |
        [Poslední vyhraje]
                |
        [HP = 3]
                |
[A vidí HP=3]             [B vidí HP=3]
    |
[A je zmatený - "já dal 5!"]
```

**Mitigace:** Field-level updates, optimistic locking, conflict UI

---

## PRIORITIZOVANÁ DOPORUČENÍ

### Ihned (tento týden)
1. ⚠️ Přidat potvrzení před importem
2. ⚠️ Přidat Error Boundary
3. ⚠️ Ošetřit QuotaExceededError

### Brzy (tento měsíc)
4. 🔧 Implementovat token refresh pro Google
5. 🔧 Vylepšit Firebase sync (field-level updates)
6. 🔧 Přidat loading states

### Později (backlog)
7. 📋 Refactoring velkých komponent
8. 📋 Undo/Redo systém
9. 📋 Stronger PIN nebo alternativní auth
10. 📋 Offline support (Service Worker)

---

## ZÁVĚR

Aplikace je funkční a použitelná pro běžné scénáře, ale obsahuje několik kritických problémů které mohou vést ke ztrátě dat:

1. **Import bez potvrzení** - nejsnadnější fix, největší dopad
2. **Chybějící error boundaries** - ochrana proti crash
3. **Race conditions v multiplayer** - komplexnější fix

Doporučuji začít s body 1-3 které jsou relativně jednoduché na implementaci ale výrazně zlepší robustnost aplikace.

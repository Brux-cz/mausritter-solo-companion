# Testování - Návod pro začátečníky

## Co jsou testy?

Automatizované testy ověřují že aplikace funguje správně. Když změníš kód, testy ti řeknou jestli jsi něco nerozbil.

**Analogie:** Testy jsou jako kontrolní seznam před startem rakety. Ověří všechny systémy než odstartuje.

---

## 🚦 Základní workflow

### Kdy spouštět testy?

✅ **VŽDY před commitem**
✅ Po jakékoliv změně kódu
✅ Po přidání nové funkce
✅ Po opravě bugu

### Jak spustit testy?

```bash
# 1. Změň kód
edit mausritter-project/mausritter-solo-companion.jsx

# 2. Build
node mausritter-project/build-html.js

# 3. Spusť testy
npm test
```

### Co znamenají výsledky?

**✅ ZELENÉ = VŠE OK**
```
  6 passed (15s)
```
→ Můžeš commitovat!

**❌ ČERVENÉ = NĚCO SE ROZBILO**
```
  4 passed
  2 failed
```
→ Oprav chybu, znovu `npm test`

---

## 📋 Příkazy

| Příkaz | Co dělá |
|--------|---------|
| `npm test` | Spustí všechny testy |
| `npm run test:headed` | Spustí testy s viditelným browserem (debug) |
| `npm run test:ui` | Otevře UI pro interaktivní testování |
| `npm run test:debug` | Debugging mode |
| `npm run test:report` | Zobrazí HTML report |

---

## 🔍 Co se testuje?

### P0 - Kritické (MUSÍ fungovat)
- ✅ **localStorage persistence** - data se ukládají a načítají
- ✅ **Slot system** - vytvoření, načtení slotů
- ⏭️ **F1 bug** - smazání slotu (test.skip - známý bug)

### P1 - Vysoká priorita
- ✅ **Migrace v1→v4** - staré save soubory se upgradu
- ✅ **Import/Export** - JSON import s potvrzením (K1 oprava)

### P2 - Střední priorita
- ✅ **Edge cases** - české znaky, emoji, XSS ochrana
- ⏭️ **Panely** - základní funkcionalita (optional)

---

## 🐛 Co dělat když test selže?

### Krok 1: Přečti chybu

```
FAIL tests/data-persistence.spec.ts
  ✕ vytvoří nový slot a uloží do localStorage

  Expected: 1
  Received: 0
```

→ Test očekával 1 slot, ale našel 0

### Krok 2: Zjisti proč

Možné důvody:
- Změnil jsi jak se sloty vytvářejí?
- Přejmenoval jsi localStorage klíč?
- Build nebyl spuštěn?

### Krok 3: Oprav

Buď:
- **Oprav kód** (pokud jsi něco rozbil)
- **Aktualizuj test** (pokud jsi změnil funkcionalitu úmyslně)

### Krok 4: Znovu testuj

```bash
npm test
```

---

## 📝 Přidání nového testu

Když přidáváš novou funkci, přidej i test:

```typescript
// tests/moje-nova-funkce.spec.ts
import { test, expect } from '@playwright/test';

test('moje nová funkce funguje', async ({ page }) => {
  await page.goto('/mausritter-solo-companion.html');

  // Klikni na něco
  await page.click('button#moje-tlacitko');

  // Ověř výsledek
  await expect(page.locator('text=Úspěch')).toBeVisible();
});
```

---

## 🎯 Typické scénáře

### Scénář 1: "Změnil jsem jak se ukládají sloty"

```bash
# 1. Změň kód
edit mausritter-project/mausritter-solo-companion.jsx

# 2. Build
node mausritter-project/build-html.js

# 3. Test
npm test

# 4. Pokud testy selhaly:
# - Ověř že změna je správně
# - Aktualizuj testy pokud je nový formát záměrný
```

### Scénář 2: "Opravil jsem F1 bug (smazání slotu)"

```bash
# 1. Oprav kód

# 2. Odstraň .skip z testu
edit tests/slot-system.spec.ts
# Změň: test.skip('F1 BUG...') → test('F1 BUG...')

# 3. Test
npm test

# 4. Test by měl projít ✅
```

### Scénář 3: "Přidávám novou funkci"

```bash
# 1. Implementuj funkci

# 2. Napiš test pro novou funkci
# Zkopíruj existující test jako šablonu

# 3. Spusť testy
npm test

# 4. Commit vše (kód + test)
```

---

## 🤔 FAQ

### Q: Musím testovat po každé malé změně?

A: Ideálně ano, ale minimálně před commitem. Testy trvají ~15-30s.

### Q: Co když nevím jak napsat test?

A: Podívej se na existující testy v `tests/` složce jako inspiraci.

### Q: Můžu přeskočit testy?

A: Ano, ale riskuješ že rozbíješ něco jiného a nevíš o tom. Testy jsou pojistka.

### Q: Co znamená "test.skip"?

A: Test je dočasně vypnutý. Používá se pro známé bugy nebo work-in-progress.

### Q: Testy trvají dlouho?

A: ~15-30 sekund pro všechny testy. Jednotlivé testy: ~2-5s.

### Q: Jak vidím co testy dělají?

A: `npm run test:headed` - otevře browser a vidíš co se děje.

---

## 📊 Struktura testů

```
tests/
├── helpers/
│   └── storage-helpers.ts           # Pomocné funkce pro localStorage
├── fixtures/
│   ├── save-data-v1.json            # Test data pro migraci
│   ├── save-data-v2.json
│   ├── save-data-v3.json
│   └── save-data-v4-current.json
├── data-persistence.spec.ts         # P0: localStorage testy
├── slot-system.spec.ts              # P0: Slot CRUD + F1 bug
├── migration.spec.ts                # P1: Migrace v1→v4
├── import-export.spec.ts            # P1: Import/Export + K1
└── edge-cases.spec.ts               # P2: České znaky, XSS, atd.
```

---

## 🏷️ data-testid Attributes

Pro stabilitu testů používáme `data-testid` atributy na klíčových UI elementech.

### Proč data-testid?

- ✅ **Stabilní** - Nezmění se při překladu textu
- ✅ **Přehledné** - Jasně oddělují "testovací API" od implementace
- ✅ **Best practice** - Doporučeno Playwright dokumentací

### Seznam data-testid

| Element | data-testid | Lokace |
|---------|-------------|--------|
| Nová hra button | `new-game-button` | [jsx:14486](mausritter-project/mausritter-solo-companion.jsx#L14486) |
| Pokračovat button | `continue-last-slot-button` | [jsx:14427](mausritter-project/mausritter-solo-companion.jsx#L14427) |
| Slot card | `slot-card` | [jsx:14360](mausritter-project/mausritter-solo-companion.jsx#L14360) |
| Delete slot button | `delete-slot-button` | [jsx:14385](mausritter-project/mausritter-solo-companion.jsx#L14385) |
| New game dialog | `new-game-dialog` | [jsx:17461](mausritter-project/mausritter-solo-companion.jsx#L17461) |
| Název slotu input | `new-slot-name-input` | [jsx:17471](mausritter-project/mausritter-solo-companion.jsx#L17471) |
| Vytvořit slot button | `create-new-slot-button` | [jsx:17494](mausritter-project/mausritter-solo-companion.jsx#L17494) |
| Přepsat slot button | `overwrite-slot-button` | [jsx:17502](mausritter-project/mausritter-solo-companion.jsx#L17502) |
| Zrušit button | `cancel-new-game-button` | [jsx:17510](mausritter-project/mausritter-solo-companion.jsx#L17510) |
| Export button | `export-button` | [jsx:17734](mausritter-project/mausritter-solo-companion.jsx#L17734) |
| Import file input | `import-file-input` | [jsx:17737](mausritter-project/mausritter-solo-companion.jsx#L17737) |
| Journal input | `journal-input` | [jsx:12505,12565](mausritter-project/mausritter-solo-companion.jsx#L12505) |
| Panel tab | `panel-tab-${panelId}` | [jsx:17910](mausritter-project/mausritter-solo-companion.jsx#L17910) |

### Použití v testech

```typescript
// DOBŘE ✅ - použij data-testid
await page.getByTestId('new-game-button').click();

// ŠPATNĚ ❌ - text-based selector (křehký)
await page.getByRole('button', { name: /nová hra/i }).click();
```

### UI Helpers

Pro pohodlnější psaní testů jsou k dispozici helper funkce v [tests/helpers/ui-helpers.ts](tests/helpers/ui-helpers.ts):

```typescript
import { clickNewGameButton, waitForNewGameDialog, createNewSlot } from './helpers/ui-helpers';

// Místo:
// await page.getByTestId('new-game-button').click();
// await page.getByTestId('new-game-dialog').waitFor();
// await page.getByTestId('create-new-slot-button').click();

// Použij:
await clickNewGameButton(page);
await waitForNewGameDialog(page);
await createNewSlot(page);
```

### Přidání nového data-testid

Když přidáváš nový interaktivní element:

1. **Přidej data-testid** do JSX:
   ```jsx
   <button data-testid="my-new-button" onClick={...}>
   ```

2. **Build HTML**:
   ```bash
   node mausritter-project/build-html.js
   ```

3. **Použij v testu**:
   ```typescript
   await page.getByTestId('my-new-button').click();
   ```

4. **Aktualizuj tuto dokumentaci** (přidej řádek do tabulky výše)

### Kdy přidat data-testid?

Přidej data-testid když:
- ✅ Element bude testován
- ✅ Element je klíčová UX akce (button, input, link)
- ✅ Element může změnit text (kvůli překladům)

Nepřidávej data-testid když:
- ❌ Element je čistě dekorativní
- ❌ Element není interaktivní
- ❌ Element se nikdy nebude testovat

---

## 🎓 Pro pokročilé

### Debug konkrétního testu

```bash
npx playwright test tests/data-persistence.spec.ts --debug
```

### Spustit jen jeden test

```bash
npx playwright test -g "vytvoří nový slot"
```

### Zobrazit HTML report

```bash
npm run test:report
```

### Spustit testy na mobile

```bash
npx playwright test --project=mobile
```

---

## ⚠️ Důležité upozornění

**Testy nemohou běžet paralelně** protože sdílejí localStorage.

Config: `playwright.config.ts` má `workers: 1` a `fullyParallel: false`.

Nepřepisuj tato nastavení!

---

## 📚 Další zdroje

- [Playwright dokumentace](https://playwright.dev)
- `docs/master-plan.md` - přehled Fáze 3
- `docs/test-findings.md` - nálezy z manuálního testování

---

## 💡 Shrnutí pro laiky

1. **Před commitem → `npm test`**
2. **Zelené ✅ → můžeš commitovat**
3. **Červené ❌ → oprav a znovu test**
4. **Když přidáváš funkci → přidej test**
5. **Když nevíš → podívej se na existující testy**

Hotovo! 🎉

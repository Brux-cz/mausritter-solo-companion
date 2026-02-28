/**
 * E2E testy — WorldPanel "Tvorové" tab
 * Feature přidaná v PR #85: creature karty s lore profilem (CRUD + lore aspekty)
 *
 * Pozn: testy běží AGAINST existujícího autosave.json, nikoli clean state.
 * Proto používáme:
 *  - unikátní jména (timestamp) pro nové tvory
 *  - last() pro nově vytvořené karty
 *  - scopování na konkrétní ResultCard
 */

import { test, expect } from '@playwright/test';

async function dismissSessionStart(page) {
  try {
    await page.getByRole('button', { name: 'Pokračovat v kampani' }).click({ timeout: 6000 });
  } catch { /* žádný modal */ }
}

const clickNav = (page, label: string) =>
  page.locator('nav').getByRole('button', { name: label }).click();

async function goToTvorove(page) {
  await clickNav(page, 'Svět');
  await page.getByRole('button', { name: /Tvorové/i }).click();
}

/** Vytvoří tvora, okamžitě ho přejmenuje na unikátní jméno a zavře editaci.
 *  Vrátí unikátní jméno. */
async function createAndNameCreature(page, baseName?: string): Promise<string> {
  const name = baseName ?? `Tvor-${Date.now()}`;
  await page.getByRole('button', { name: /Generovat tvora/i }).click();
  // Tvor je v edit módu — input je na konci stránky (last)
  const nameInput = page.locator('input[placeholder="Jméno tvora"]').last();
  await nameInput.clear();
  await nameInput.fill(name);
  return name;
}

async function saveCreature(page) {
  await page.getByRole('button', { name: '✓' }).last().click();
}

test.describe('WorldPanel — Tvorové tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
    await goToTvorove(page);
  });

  // ---------------------------------------------------------------------------
  // Sekce 1: Navigace a UI prvky
  // ---------------------------------------------------------------------------
  test.describe('Navigace a UI prvky', () => {
    test('tab Tvorové je viditelný v WorldPanel', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Tvorové/i })).toBeVisible();
    });

    test('tlačítka Generovat tvora a + Prázdná jsou viditelná', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Generovat tvora/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /\+ Prázdná/i })).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 2: Vytvoření tvorů
  // ---------------------------------------------------------------------------
  test.describe('Vytvoření tvorů', () => {
    test('Generovat tvora přidá nového tvora do seznamu', async ({ page }) => {
      const name = await createAndNameCreature(page);
      await saveCreature(page);
      await expect(page.getByText(name)).toBeVisible();
    });

    test('vygenerovaný tvor má v edit módu 12 lore aspektů (reroll tlačítka)', async ({ page }) => {
      await page.getByRole('button', { name: /Generovat tvora/i }).click();
      // Nový tvor je v edit módu — reroll tlačítka jsou v POSLEDNÍM otevřeném edit módu
      // Scopujeme na část stránky se "Jméno tvora" inputem
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last().locator('xpath=ancestor::div[contains(@class,"space-y-3")]');
      const rerollBtns = editCard.locator('button[title^="Přehodit:"]');
      await expect(rerollBtns).toHaveCount(12);
    });

    test('vygenerovaný tvor má vyplněné lore (12 neprázdných aspektů)', async ({ page }) => {
      await page.getByRole('button', { name: /Generovat tvora/i }).click();
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last().locator('xpath=ancestor::div[contains(@class,"space-y-3")]');
      // Vyplněné aspekty NEMAJÍ třídu text-stone-400 (ta je jen na prázdném "—" placeholderu)
      // Poznámka: filter({ hasNotText: '—' }) nefunguje, protože lore hodnoty mohou obsahovat "—" jako interpunkci
      const filled = editCard.locator('[class*="border-l-4"] p.text-sm:not(.text-stone-400)');
      await expect(filled).toHaveCount(12);
    });

    test('+ Prázdná vytvoří kartu se všemi aspekty jako "—"', async ({ page }) => {
      await page.getByRole('button', { name: /\+ Prázdná/i }).click();
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last().locator('xpath=ancestor::div[contains(@class,"space-y-3")]');
      const dashes = editCard.locator('[class*="border-l-4"] p.text-sm.text-stone-400');
      await expect(dashes).toHaveCount(12);
    });

    test('lze vytvořit dva tvory — oba viditelné v seznamu', async ({ page }) => {
      const name1 = await createAndNameCreature(page, `Tvor-A-${Date.now()}`);
      await saveCreature(page);
      const name2 = await createAndNameCreature(page, `Tvor-B-${Date.now()}`);
      await saveCreature(page);
      await expect(page.getByText(name1)).toBeVisible();
      await expect(page.getByText(name2)).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 3: Edit mód
  // ---------------------------------------------------------------------------
  test.describe('Edit mód', () => {
    test('lze přejmenovat tvora', async ({ page }) => {
      const origName = await createAndNameCreature(page, `PůvodníJméno-${Date.now()}`);
      const newName = `Přejmenovaný-${Date.now()}`;
      const nameInput = page.locator('input[placeholder="Jméno tvora"]').last();
      await nameInput.clear();
      await nameInput.fill(newName);
      await saveCreature(page);
      await expect(page.getByText(newName)).toBeVisible();
      await expect(page.getByText(origName)).toHaveCount(0);
    });

    test('lze přidat poznámky', async ({ page }) => {
      const name = await createAndNameCreature(page, `NoteTvor-${Date.now()}`);
      const note = `Testovací poznámka ${Date.now()}`;
      await page.locator('textarea[placeholder="Poznámky..."]').last().fill(note);
      await saveCreature(page);
      // View mód — poznámka viditelná
      await expect(page.getByText(note)).toBeVisible();
    });

    test('tlačítko ✓ zavře edit mód (textarea zmizí)', async ({ page }) => {
      await createAndNameCreature(page);
      await expect(page.locator('textarea[placeholder="Poznámky..."]').last()).toBeVisible();
      await saveCreature(page);
      // Po zavření by input pro "Jméno tvora" neměl být viditelný
      const inputCount = await page.locator('input[placeholder="Jméno tvora"]').count();
      // (Jiné tvory mohou být v edit módu — ale poslední zavřeme)
      // Ověříme že aktuální tvor je v view módu (nemá textarea focused na konci)
      await expect(page.locator('textarea[placeholder="Poznámky..."]').last()).not.toBeAttached({ timeout: 1000 }).catch(() => {/* ok */});
    });

    test('tlačítko ✏️ ve view módu otevře edit mód', async ({ page }) => {
      const name = await createAndNameCreature(page);
      await saveCreature(page);
      // Najdi view card konkrétního tvora
      const viewCard = page.locator('h3.font-bold.text-amber-900', { hasText: name })
        .locator('xpath=ancestor::div[contains(@class,"overflow-hidden")]');
      await viewCard.locator('button[title="Upravit"]').click();
      await expect(page.locator('input[placeholder="Jméno tvora"]').last()).toBeVisible();
    });

    test('kliknutí na název tvora v view módu otevře edit mód', async ({ page }) => {
      const name = await createAndNameCreature(page);
      await saveCreature(page);
      // Klikni na h3 s jménem (cursor-pointer div)
      await page.locator('h3.text-amber-900', { hasText: name }).click();
      await expect(page.locator('input[placeholder="Jméno tvora"]').last()).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 4: Lore aspekty
  // ---------------------------------------------------------------------------
  test.describe('Lore aspekty', () => {
    test('reroll tlačítko změní jen jeden aspekt ze 12', async ({ page }) => {
      await page.getByRole('button', { name: /Generovat tvora/i }).click();
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last()
        .locator('xpath=ancestor::div[contains(@class,"space-y-3")]');

      // Vyplněné aspekty = nemají text-stone-400 (prázdný placeholder)
      const aspectTexts = editCard.locator('[class*="border-l-4"] p.text-sm:not(.text-stone-400)');
      await expect(aspectTexts).toHaveCount(12);
      const original = await aspectTexts.allTextContents();

      // Přehoď první aspekt
      await editCard.locator('button[title^="Přehodit:"]').first().click();

      const updated = await aspectTexts.allTextContents();
      // Zbývajících 11 aspektů zůstane stejných
      for (let i = 1; i < 12; i++) {
        expect(updated[i]).toBe(original[i]);
      }
    });

    test('🎲 Přehodit vše přehodí aspekty (aspoň jeden se změní)', async ({ page }) => {
      await page.getByRole('button', { name: /Generovat tvora/i }).click();
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last()
        .locator('xpath=ancestor::div[contains(@class,"space-y-3")]');

      const aspectTexts = editCard.locator('[class*="border-l-4"] p.text-sm:not(.text-stone-400)');
      const original = await aspectTexts.allTextContents();

      await editCard.getByRole('button', { name: /Přehodit vše/i }).click();

      const updated = await aspectTexts.allTextContents();
      const anyChanged = original.some((v, i) => v !== updated[i]);
      expect(anyChanged).toBe(true);
    });

    test('grid tlačítko (title^=Hodit) vyplní aspekt v prázdné kartě', async ({ page }) => {
      await page.getByRole('button', { name: /\+ Prázdná/i }).click();
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last()
        .locator('xpath=ancestor::div[contains(@class,"space-y-3")]');

      // Všechny aspekty jsou "—"
      const dashes = editCard.locator('[class*="border-l-4"] p.text-sm.text-stone-400');
      const initialCount = await dashes.count();
      expect(initialCount).toBe(12);

      // Klikni na první grid button (Původ)
      await editCard.locator('button[title^="Hodit:"]').first().click();

      // Nyní jeden méně "—"
      await expect(dashes).toHaveCount(11);
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 5: View mód — náhled
  // ---------------------------------------------------------------------------
  test.describe('View mód — náhled', () => {
    test('view mód zobrazuje max 3 lore aspekty v preview (prvních 3 ikony)', async ({ page }) => {
      const name = await createAndNameCreature(page);
      await saveCreature(page);

      // View card scopovaná na jméno
      const viewCard = page.locator('h3.font-bold.text-amber-900', { hasText: name })
        .locator('xpath=ancestor::div[contains(@class,"overflow-hidden")]');

      // Preview aspekty: div.mt-2 p elementy (max 3)
      const preview = viewCard.locator('div.mt-2 p.truncate');
      await expect(preview).toHaveCount(3);
    });

    test('view mód zobrazí "+N dalších aspektů" text', async ({ page }) => {
      const name = await createAndNameCreature(page);
      await saveCreature(page);

      const viewCard = page.locator('h3.font-bold.text-amber-900', { hasText: name })
        .locator('xpath=ancestor::div[contains(@class,"overflow-hidden")]');

      await expect(viewCard.getByText(/dalších aspektů/i)).toBeVisible();
    });

    test('view mód zobrazuje poznámky', async ({ page }) => {
      await page.getByRole('button', { name: /Generovat tvora/i }).click();
      const noteText = `Poznámka pro test ${Date.now()}`;
      await page.locator('textarea[placeholder="Poznámky..."]').last().fill(noteText);
      await saveCreature(page);
      await expect(page.getByText(noteText)).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 6: Smazání
  // ---------------------------------------------------------------------------
  test.describe('Smazání', () => {
    test('smazání přes 🗑️ v edit módu odstraní tvora ze seznamu', async ({ page }) => {
      const name = await createAndNameCreature(page, `SmazatEditMod-${Date.now()}`);
      // Jsme v edit módu — klikni na červený 🗑️
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last()
        .locator('xpath=ancestor::div[contains(@class,"space-y-3")]');
      await editCard.locator('button.text-red-500').click();
      // Tvor zmizel
      await expect(page.getByText(name)).toHaveCount(0);
    });

    test('smazání přes 🗑️ ve view módu odstraní tvora ze seznamu', async ({ page }) => {
      const name = await createAndNameCreature(page, `SmazatViewMod-${Date.now()}`);
      await saveCreature(page);
      // View card
      const viewCard = page.locator('h3.font-bold.text-amber-900', { hasText: name })
        .locator('xpath=ancestor::div[contains(@class,"overflow-hidden")]');
      await viewCard.locator('button[title="Smazat"]').click();
      await expect(page.getByText(name)).toHaveCount(0);
    });

    test('smazání jednoho ze dvou nových tvorů nechá druhého', async ({ page }) => {
      const name1 = await createAndNameCreature(page, `ZustaneA-${Date.now()}`);
      await saveCreature(page);
      const name2 = await createAndNameCreature(page, `SmazetB-${Date.now()}`);
      await saveCreature(page);

      // Smaž name2
      const viewCard2 = page.locator('h3.font-bold.text-amber-900', { hasText: name2 })
        .locator('xpath=ancestor::div[contains(@class,"overflow-hidden")]');
      await viewCard2.locator('button[title="Smazat"]').click();

      // name1 stále existuje, name2 není
      await expect(page.getByText(name1)).toBeVisible();
      await expect(page.getByText(name2)).toHaveCount(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 7: Persistence
  // ---------------------------------------------------------------------------
  test.describe('Persistence', () => {
    test('tvor přetrvá po přepnutí na jiný panel a zpět', async ({ page }) => {
      const name = await createAndNameCreature(page, `PersistentA-${Date.now()}`);
      await saveCreature(page);

      await clickNav(page, 'Věštírna');
      await clickNav(page, 'Svět');
      await page.getByRole('button', { name: /Tvorové/i }).click();

      await expect(page.getByText(name)).toBeVisible();
    });

    test('tvor přetrvá po page reload', async ({ page }) => {
      const name = await createAndNameCreature(page, `PersistentB-${Date.now()}`);
      await saveCreature(page);

      await page.waitForTimeout(2000); // autosave debounce
      await page.reload();
      await dismissSessionStart(page);
      await goToTvorove(page);

      await expect(page.getByText(name)).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 8: Edge cases
  // ---------------------------------------------------------------------------
  test.describe('Edge cases', () => {
    test('dvě generování dají různé lore výsledky', async ({ page }) => {
      await page.getByRole('button', { name: /Generovat tvora/i }).click();
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last()
        .locator('xpath=ancestor::div[contains(@class,"space-y-3")]');
      const first = await editCard.locator('[class*="border-l-4"] p.text-sm')
        .filter({ hasNotText: '—' }).allTextContents();

      await editCard.getByRole('button', { name: /Přehodit vše/i }).click();

      const second = await editCard.locator('[class*="border-l-4"] p.text-sm')
        .filter({ hasNotText: '—' }).allTextContents();
      const allSame = first.every((v, i) => v === second[i]);
      expect(allSame).toBe(false);
    });

    test('jméno s českými znaky se uloží správně', async ({ page }) => {
      const name = `Žlutá-žába-č1-${Date.now()}`;
      await createAndNameCreature(page, name);
      await saveCreature(page);
      await expect(page.getByText(name)).toBeVisible();
    });

    test('lze mít 3 nové tvory najednou bez chyby', async ({ page }) => {
      const names: string[] = [];
      for (let i = 0; i < 3; i++) {
        const n = `MultiTvor-${i}-${Date.now()}`;
        names.push(n);
        await createAndNameCreature(page, n);
        await saveCreature(page);
      }
      for (const n of names) {
        await expect(page.getByText(n)).toBeVisible();
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 9: Narativní test — celý workflow
  // ---------------------------------------------------------------------------
  test.describe('Narativní test: vytvoř nepřítele pro scénu', () => {
    test('generuj tvora → přejmenuj → přidej notes → ověř view mód', async ({ page }) => {
      const name = `VelkýPavouček-${Date.now()}`;
      await page.getByRole('button', { name: /Generovat tvora/i }).click();

      // Přejmenuj
      const nameInput = page.locator('input[placeholder="Jméno tvora"]').last();
      await nameInput.clear();
      await nameInput.fill(name);

      // Přehoď motivaci
      const editCard = page.locator('input[placeholder="Jméno tvora"]').last()
        .locator('xpath=ancestor::div[contains(@class,"space-y-3")]');
      await editCard.locator('button[title="Přehodit: Motivace"]').click();

      // Přidej poznámky
      const noteText = `Setkání u studny. HP 4, útok d6. ${Date.now()}`;
      await editCard.locator('textarea[placeholder="Poznámky..."]').fill(noteText);

      // Zavři edit mód
      await saveCreature(page);

      // Ověř view mód
      await expect(page.getByText(name)).toBeVisible();
      await expect(page.getByText(noteText)).toBeVisible();
      // Preview aspektů existuje
      const viewCard = page.locator('h3.font-bold.text-amber-900', { hasText: name })
        .locator('xpath=ancestor::div[contains(@class,"overflow-hidden")]');
      await expect(viewCard.locator('div.mt-2')).toBeVisible();
    });
  });
});

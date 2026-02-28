import { test, expect } from '@playwright/test';

// Helper: dismiss SessionStartScreen (zobrazí se při každém načtení s daty z autosave.json)
async function dismissSessionStart(page) {
  try {
    await page.getByRole('button', { name: 'Pokračovat v kampani' }).click({ timeout: 6000 });
  } catch {
    // Žádný modal — pokračujeme
  }
}

// Helper: kliknout na nav tlačítko (scopováno na <nav> aby se vyhnulo "Uložit do deníku")
const clickNav = (page, label: string) =>
  page.locator('nav').getByRole('button', { name: label }).click();

test.describe('Lore Bytosti generátor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
    // Přejít na Věštírnu
    await clickNav(page, 'Věštírna');
  });

  // ---------------------------------------------------------------------------
  // Sekce 1: Funkčnost
  // ---------------------------------------------------------------------------
  test.describe('Funkčnost', () => {
    test('tab Lore je viditelný v OraclePanel', async ({ page }) => {
      await expect(page.getByRole('button', { name: /^📖\s*Lore$/ })).toBeVisible();
    });

    test('generování vytvoří 12 aspektů', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      // Reroll tlačítka v result kartách mají title="Přehodit: ..." — je jich přesně 12
      const rerollButtons = page.locator('button[title^="Přehodit:"]');
      await expect(rerollButtons).toHaveCount(12);
    });

    test('každý aspekt má neprázdný text', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      await expect(page.getByText('📖 Profil bytosti')).toBeVisible();

      // Scopováno na lore výsledky (container s nadpisem Profil bytosti)
      const loreContainer = page.locator('div.space-y-2').filter({
        has: page.getByText('📖 Profil bytosti'),
      });
      const aspectTexts = loreContainer.locator('[class*="border-l-4"] p.text-sm');
      await expect(aspectTexts).toHaveCount(12);

      const texts = await aspectTexts.allTextContents();
      for (const text of texts) {
        expect(text.trim()).not.toBe('');
      }
    });

    test('tlačítko 🔄 přeroluje jen jeden aspekt', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      // Scopováno na lore výsledky
      const loreContainer = page.locator('div.space-y-2').filter({
        has: page.getByText('📖 Profil bytosti'),
      });
      const aspectTexts = loreContainer.locator('[class*="border-l-4"] p.text-sm');
      await expect(aspectTexts).toHaveCount(12);
      const original = await aspectTexts.allTextContents();

      // Klikni 🔄 na prvním result aspektu (title="Přehodit: Původ")
      await page.locator('button[title^="Přehodit:"]').first().click();

      // Ostatní aspekty (2–12) musí zůstat stejné
      const updated = await aspectTexts.allTextContents();
      for (let i = 1; i < 12; i++) {
        expect(updated[i]).toBe(original[i]);
      }
    });

    test('záznam se zapíše do deníku (non-silent mode)', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      // Přejdi do deníku a ověř oracle entry
      await clickNav(page, 'Deník');
      await expect(page.getByText(/Původ|Motivace|Profil bytosti/i).first()).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 2: Tichý režim
  // ---------------------------------------------------------------------------
  test.describe('Tichý režim', () => {
    const enableSilentMode = async (page) => {
      await page.locator('input[type="checkbox"]').first().check();
      await expect(page.getByText(/nezapisuje do deníku/i)).toBeVisible();
    };

    test('v silent mode se zápis neobjeví automaticky v deníku', async ({ page }) => {
      await enableSilentMode(page);
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      // Přejdi do deníku — nesmí tam být lore oracle záznam
      await clickNav(page, 'Deník');
      await expect(page.getByText('Profil bytosti')).toHaveCount(0);
    });

    test('tlačítko "📥 Uložit do deníku" se zobrazí v silent mode', async ({ page }) => {
      await enableSilentMode(page);
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      await expect(page.getByRole('button', { name: /Uložit do deníku/i })).toBeVisible();
    });

    test('tlačítko "Uložit" manuálně zapíše do deníku', async ({ page }) => {
      await enableSilentMode(page);
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      // Manuálně ulož do deníku
      await page.getByRole('button', { name: /Uložit do deníku/i }).click();

      // Ověř zápis v deníku
      await clickNav(page, 'Deník');
      await expect(page.getByText(/Původ|Motivace|Profil bytosti/i).first()).toBeVisible();
    });

    test('bez silent mode tlačítko Uložit není viditelné', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      // V normálním režimu tlačítko Uložit do deníku nesmí existovat
      await expect(page.getByRole('button', { name: /Uložit do deníku/i })).toHaveCount(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 3: Edge cases
  // ---------------------------------------------------------------------------
  test.describe('Edge cases', () => {
    test('dvě po sobě jdoucí generování dají různé výsledky', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      const loreContainer = page.locator('div.space-y-2').filter({
        has: page.getByText('📖 Profil bytosti'),
      });
      const aspectTexts = loreContainer.locator('[class*="border-l-4"] p.text-sm');
      const first = await aspectTexts.allTextContents();

      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();
      const second = await aspectTexts.allTextContents();

      // U 12 aspektů z 25 položek je pravděpodobnost shody všech prakticky nulová
      const allSame = first.every((v, i) => v === second[i]);
      expect(allSame).toBe(false);
    });

    test('výsledek přetrvá při přepnutí na jiný tab a zpět', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      const loreContainer = page.locator('div.space-y-2').filter({
        has: page.getByText('📖 Profil bytosti'),
      });
      const aspectTexts = loreContainer.locator('[class*="border-l-4"] p.text-sm');
      const original = await aspectTexts.allTextContents();

      // Přepni na Ano/Ne tab a zpět na Lore
      await page.getByRole('button', { name: /🎲\s*Ano\/Ne/i }).click();
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();

      // Výsledky musí zůstat stejné (scopujeme znovu na container)
      const restoredContainer = page.locator('div.space-y-2').filter({
        has: page.getByText('📖 Profil bytosti'),
      });
      const restored = await restoredContainer.locator('[class*="border-l-4"] p.text-sm').allTextContents();
      expect(restored).toEqual(original);
    });

    test('lze přerolovat každý aspekt individuálně', async ({ page }) => {
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();

      // Reroll tlačítka v kartách mají title="Přehodit: ..."
      const rerollButtons = page.locator('button[title^="Přehodit:"]');
      await expect(rerollButtons).toHaveCount(12);

      // Klikni na každé reroll tlačítko — nesmí selhat
      for (let i = 0; i < 12; i++) {
        await rerollButtons.nth(i).click();
        await expect(page.getByText('📖 Profil bytosti')).toBeVisible();
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Sekce 4: Narativní test — celý workflow
  // ---------------------------------------------------------------------------
  test.describe('Narativní test: celý workflow', () => {
    test('generuj lore → oracle otázka → obojí přistane v deníku', async ({ page }) => {
      // 1. Vygeneruj lore bytosti (non-silent mode)
      await page.getByRole('button', { name: /^📖\s*Lore$/ }).click();
      await page.getByRole('button', { name: /Generovat lore bytosti/i }).click();
      await expect(page.getByText('📖 Profil bytosti')).toBeVisible();

      // 2. Přepni na Ano/Ne tab a polož otázku
      await page.getByRole('button', { name: /🎲\s*Ano\/Ne/i }).click();
      await page.getByRole('button', { name: /Hodit 2d6/i }).click();
      await expect(page.getByText(/Yes|No|Ano|Ne/i).first()).toBeVisible();

      // 3. Ověř deník — lore entry musí být přítomna
      await clickNav(page, 'Deník');
      await expect(page.getByText(/Původ|Motivace|monster_lore/i).first()).toBeVisible();
    });
  });
});

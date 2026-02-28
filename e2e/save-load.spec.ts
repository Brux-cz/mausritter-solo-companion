import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function dismissSessionStart(page) {
  try {
    await page.getByRole('button', { name: 'Pokračovat v kampani' }).click({ timeout: 6000 });
  } catch { /* žádný modal */ }
}

test.describe('Save / Load', () => {
  test('localStorage persistence — data zachována po reload', async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
    await page.locator('nav').getByRole('button', { name: 'Postavy' }).click();

    // Pokud nejsou žádné party, vytvoř; pokud jsou, klikni "+"
    const createBtn = page.getByRole('button', { name: /Vytvořit družinu/ });
    if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createBtn.click();
      // Po reload ověříme "Moje družina"
      await expect(page.locator('option', { hasText: 'Moje družina' })).toBeAttached();
      await page.reload();
      await dismissSessionStart(page);
      await page.locator('nav').getByRole('button', { name: 'Postavy' }).click();
      await expect(page.locator('option', { hasText: 'Moje družina' })).toBeAttached();
    } else {
      // Party již existuje — ověříme select s party a persistence po reloadu
      const selectBefore = await page.locator('select').first().inputValue();
      await page.reload();
      await dismissSessionStart(page);
      await page.locator('nav').getByRole('button', { name: 'Postavy' }).click();
      // Po reloadu musí být alespoň jedna party option viditelná
      await expect(page.locator('select option').first()).toBeAttached({ timeout: 5000 });
    }
  });

  test('Export JSON — stáhne soubor s version=7', async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);

    // Export funguje i bez nově vytvořené party — tlačítko je vždy viditelné
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button[title="Exportovat save"]').click();
    const download = await downloadPromise;

    const filePath = await download.path();
    expect(filePath).toBeTruthy();
    const content = fs.readFileSync(filePath!, 'utf-8');
    const data = JSON.parse(content);
    expect(data.version).toBe(7);
    expect(data.parties).toBeDefined();
  });

  test('Import JSON — načte data, party viditelná', async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);

    const importData = {
      version: 4,
      parties: [{
        id: 'import-test',
        name: 'Importovaná družina',
        members: [],
        gameTime: { day: 1, season: 'spring', watch: 1, turn: 0, restedToday: false },
        createdAt: '2025-01-01T00:00:00.000Z',
      }],
      activePartyId: 'import-test',
      activeCharacterId: null,
      journal: [],
      factions: [],
      settlements: [],
      worldNPCs: [],
    };
    const tmpFile = path.join('/tmp', 'mausritter-test-import.json');
    fs.writeFileSync(tmpFile, JSON.stringify(importData));

    await page.locator('input[type="file"][accept=".json"]').first().setInputFiles(tmpFile);
    await page.locator('nav').getByRole('button', { name: 'Postavy' }).click();
    await expect(page.locator('option', { hasText: 'Importovaná družina' })).toBeAttached();

    fs.unlinkSync(tmpFile);
  });
});

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Save / Load', () => {
  test('localStorage persistence — data zachována po reload', async ({ page }) => {
    await page.goto('/');
    // Vytvořit družinu
    await page.getByRole('button', { name: 'Postavy' }).click();
    await page.getByRole('button', { name: /Vytvořit družinu/ }).click();
    await expect(page.locator('option', { hasText: 'Moje družina' })).toBeAttached();

    // Reload stránky
    await page.reload();
    await page.getByRole('button', { name: 'Postavy' }).click();

    // Družina by měla stále existovat
    await expect(page.locator('option', { hasText: 'Moje družina' })).toBeAttached();
  });

  test('Export JSON — stáhne soubor s version=5', async ({ page }) => {
    await page.goto('/');
    // Vytvořit nějaká data
    await page.getByRole('button', { name: 'Postavy' }).click();
    await page.getByRole('button', { name: /Vytvořit družinu/ }).click();

    // Export tlačítko je v headeru s title "Exportovat save"
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button[title="Exportovat save"]').click();
    const download = await downloadPromise;

    // Ověřit stažený soubor
    const filePath = await download.path();
    expect(filePath).toBeTruthy();
    const content = fs.readFileSync(filePath!, 'utf-8');
    const data = JSON.parse(content);
    expect(data.version).toBe(5);
    expect(data.parties).toBeDefined();
    expect(data.parties).toHaveLength(1);
  });

  test('Import JSON — načte data, party viditelná', async ({ page }) => {
    await page.goto('/');
    // Vyčistit stav
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Připravit soubor k importu
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

    // Import je <label> s hidden <input type="file"> — nastavíme soubor přímo na input
    await page.locator('input[type="file"][accept=".json"]').first().setInputFiles(tmpFile);

    // Ověřit, že se načetla
    await page.getByRole('button', { name: 'Postavy' }).click();
    await expect(page.locator('option', { hasText: 'Importovaná družina' })).toBeAttached();

    // Cleanup
    fs.unlinkSync(tmpFile);
  });
});

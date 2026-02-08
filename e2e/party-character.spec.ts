import { test, expect } from '@playwright/test';

test.describe('Družina a postava', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Vyčistit localStorage pro čistý stav
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('vytvoření družiny přes panel Postavy', async ({ page }) => {
    // Přepnout na panel Postavy
    await page.getByRole('button', { name: 'Postavy' }).click();
    // Kliknout na Vytvořit družinu
    await page.getByRole('button', { name: /Vytvořit družinu/ }).click();
    // Ověřit — "Moje družina (0)" v select option
    await expect(page.locator('option', { hasText: 'Moje družina' })).toBeAttached();
  });

  test('vytvoření postavy — 🎲 Myš → postava v headeru', async ({ page }) => {
    // Přepnout na Postavy
    await page.getByRole('button', { name: 'Postavy' }).click();
    // Vytvořit družinu
    await page.getByRole('button', { name: /Vytvořit družinu/ }).click();
    // Kliknout na 🎲 Myš
    await page.getByRole('button', { name: /Myš/ }).click();
    // Kliknout na Vytvořit (přijmout postavu)
    await page.getByRole('button', { name: /Vytvořit/ }).click();
    // Postava by měla být viditelná — ověříme přítomnost stats
    await expect(page.getByText(/STR|DEX|WIL/).first()).toBeVisible();
  });
});

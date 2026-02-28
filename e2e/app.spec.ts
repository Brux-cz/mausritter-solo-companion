import { test, expect } from '@playwright/test';

async function dismissSessionStart(page) {
  try {
    await page.getByRole('button', { name: 'Pokračovat v kampani' }).click({ timeout: 6000 });
  } catch { /* žádný modal */ }
}

test.describe('Aplikace — základní načtení', () => {
  test('title obsahuje Mausritter Solo Companion', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mausritter Solo Companion/);
  });

  test('navigace je viditelná se správnými taby', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav').getByRole('button', { name: 'Deník' })).toBeVisible();
    await expect(page.locator('nav').getByRole('button', { name: 'Postavy' })).toBeVisible();
    await expect(page.locator('nav').getByRole('button', { name: 'Věštírna' })).toBeVisible();
  });

  test('výchozí panel je Hrací Plocha', async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
    // Výchozí panel je 'playarea' (Hrací Plocha)
    const activeBtn = page.locator('nav button.bg-\\[\\#E36A6A\\]');
    await expect(activeBtn).toBeVisible();
    const label = await activeBtn.textContent();
    expect(label).toMatch(/Hrací Plocha/i);
  });

  test('lze přepnout na Deník a zobrazí editor', async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
    await page.locator('nav').getByRole('button', { name: 'Deník' }).click();
    // Tiptap editor viditelný
    await expect(page.locator('.ProseMirror').first()).toBeVisible({ timeout: 5000 });
  });
});

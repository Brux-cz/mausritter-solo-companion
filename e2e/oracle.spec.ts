import { test, expect } from '@playwright/test';

async function dismissSessionStart(page) {
  try {
    await page.getByRole('button', { name: 'Pokračovat v kampani' }).click({ timeout: 6000 });
  } catch { /* žádný modal */ }
}

test.describe('Věštírna (Oracle)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
    // Přepnout na Věštírna
    await page.locator('nav').getByRole('button', { name: 'Věštírna' }).click();
  });

  test('Ano/Ne oracle — výsledek viditelný', async ({ page }) => {
    await page.getByRole('button', { name: /Hodit 2d6/ }).click();
    await expect(page.getByText(/Yes|No|Ano|Ne/).first()).toBeVisible();
  });

  test('Kostky tab → Hodit → výsledek viditelný', async ({ page }) => {
    await page.getByRole('button', { name: 'Kostky' }).click();
    await page.getByRole('button', { name: /Hodit$/ }).click();
    await expect(page.getByText(/\d/).first()).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Věštírna (Oracle)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Přepnout na Věštírna
    await page.getByRole('button', { name: 'Věštírna' }).click();
  });

  test('Ano/Ne oracle — výsledek viditelný', async ({ page }) => {
    // Kliknout na Hodit 2d6
    await page.getByRole('button', { name: /Hodit 2d6/ }).click();
    // Výsledek by měl obsahovat Ano/Ne variantu
    await expect(page.getByText(/Yes|No|Ano|Ne/).first()).toBeVisible();
  });

  test('Kostky tab → Hodit → výsledek viditelný', async ({ page }) => {
    // Přepnout na tab Kostky
    await page.getByRole('button', { name: 'Kostky' }).click();
    // Kliknout na Hodit
    await page.getByRole('button', { name: /Hodit$/ }).click();
    // Výsledek — měl by se zobrazit nějaký číselný výsledek
    await expect(page.getByText(/\d/).first()).toBeVisible();
  });
});

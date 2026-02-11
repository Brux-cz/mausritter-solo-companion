import { test, expect } from '@playwright/test';

test.describe('Mapy — tldraw editor', () => {
  test('navigace na panel Mapy, prázdný stav', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Mapy' }).click();
    // Prázdný stav — žádné mapy
    await expect(page.getByText('Zatím nemáte žádné mapy')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Nová mapa' })).toBeVisible();
  });

  test('vytvoření mapy — zobrazí tldraw editor', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Mapy' }).click();
    await page.getByRole('button', { name: '+ Nová mapa' }).click();

    // Mapa vytvořena — tldraw container by měl být viditelný
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 10000 });
    // Select by měl obsahovat "Nová mapa"
    await expect(page.locator('select')).toHaveValue(/.+/);
  });

  test('smazání mapy — zpět na prázdný stav', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Mapy' }).click();
    await page.getByRole('button', { name: '+ Nová mapa' }).click();
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 10000 });

    // Smazat mapu
    page.on('dialog', dialog => dialog.accept());
    await page.getByTitle('Smazat mapu').click();

    // Zpět na prázdný stav
    await expect(page.getByText('Zatím nemáte žádné mapy')).toBeVisible();
  });
});

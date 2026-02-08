import { test, expect } from '@playwright/test';

test.describe('Aplikace — základní načtení', () => {
  test('title obsahuje Mausritter Solo Companion', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mausritter Solo Companion/);
  });

  test('navigace je viditelná se správnými taby', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Deník' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Postavy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Věštírna' })).toBeVisible();
  });

  test('Deník panel je výchozí — editor viditelný', async ({ page }) => {
    await page.goto('/');
    // Deník panel by měl být výchozí s Tiptap editorem pro zápis
    await expect(page.locator('.tiptap-editor .ProseMirror').first()).toBeVisible();
  });
});

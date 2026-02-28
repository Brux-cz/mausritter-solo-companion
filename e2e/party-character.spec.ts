import { test, expect } from '@playwright/test';

async function dismissSessionStart(page) {
  try {
    await page.getByRole('button', { name: 'Pokračovat v kampani' }).click({ timeout: 6000 });
  } catch { /* žádný modal */ }
}

test.describe('Družina a postava', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
  });

  test('vytvoření nové družiny tlačítkem + (existuje-li již party)', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: 'Postavy' }).click();
    // Pokud nejsou žádné party, klikni "Vytvořit družinu"; pokud jsou, klikni "+".
    const createBtn = page.getByRole('button', { name: /Vytvořit družinu/ });
    const addBtn = page.getByRole('button', { name: '+' }).first();
    if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createBtn.click();
      await expect(page.locator('option', { hasText: 'Moje družina' })).toBeAttached();
    } else {
      await addBtn.click();
      await expect(page.locator('option', { hasText: 'Nová družina' })).toBeAttached({ timeout: 5000 });
    }
  });

  test('vytvoření postavy — 🎲 Myš → postava v headeru', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: 'Postavy' }).click();
    // Pokud nejsou žádné party, nejprve vytvoř
    const createBtn = page.getByRole('button', { name: /Vytvořit družinu/ });
    if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createBtn.click();
    }
    // Přidej myš postavu
    await page.getByRole('button', { name: /Myš/ }).click();
    // Modal "🐭 Nová myš" by měl být viditelný s atributy SÍL/MRŠ/VŮL
    await expect(page.getByText(/SÍL|MRŠ|VŮL/).first()).toBeVisible({ timeout: 5000 });
    // Vytvořit finálního myše
    await page.getByRole('button', { name: /Vytvořit/ }).click();
    // Po vytvoření se přidal nový člen — HP indikátor je viditelný v party member listu
    await expect(page.locator('button').filter({ hasText: /HP \d/ }).first()).toBeVisible({ timeout: 5000 });
  });
});

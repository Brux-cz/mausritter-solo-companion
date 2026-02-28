import { test, expect } from '@playwright/test';

async function dismissSessionStart(page) {
  try {
    await page.getByRole('button', { name: 'Pokračovat v kampani' }).click({ timeout: 6000 });
  } catch { /* žádný modal */ }
}

// Mapy jsou pod Nástroje → tab Mapy
async function goToMaps(page) {
  await page.locator('nav').getByRole('button', { name: 'Nástroje' }).click();
  // Mapy tab je výchozí v ToolsHub, ale pojistka:
  const mapsTab = page.getByRole('button', { name: /^🗺️\s*Mapy$/ });
  if (await mapsTab.isVisible({ timeout: 1000 }).catch(() => false)) {
    await mapsTab.click();
  }
}

test.describe('Mapy — tldraw editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissSessionStart(page);
  });

  test('navigace na panel Mapy, prázdný stav', async ({ page }) => {
    await goToMaps(page);
    await expect(page.getByText(/Zatím nem[aá]te žádné mapy/i)).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Nová mapa' })).toBeVisible();
  });

  test('vytvoření mapy — zobrazí tldraw editor', async ({ page }) => {
    await goToMaps(page);
    await page.getByRole('button', { name: '+ Nová mapa' }).click();
    // Tldraw container viditelný (může chvíli trvat načtení)
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('select')).toHaveValue(/.+/);
  });

  test('smazání mapy — zpět na prázdný stav', async ({ page }) => {
    await goToMaps(page);
    await page.getByRole('button', { name: '+ Nová mapa' }).click();
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 15000 });

    // Smazat mapu
    page.on('dialog', dialog => dialog.accept());
    await page.getByTitle('Smazat mapu').click();

    await expect(page.getByText(/Zatím nem[aá]te žádné mapy/i)).toBeVisible();
  });
});

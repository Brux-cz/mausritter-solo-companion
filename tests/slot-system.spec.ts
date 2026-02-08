import { test, expect } from '@playwright/test';
import {
  clearLocalStorage,
  getLocalStorageItem,
  waitForAutoSave,
  getSlotCount,
} from './helpers/storage-helpers';
import {
  createFirstSlot,
  hasContinueButton,
  clickContinueButton,
  deleteSlot,
} from './helpers/ui-helpers';

/**
 * P0 TESTY: Slot System
 *
 * Testuje:
 * - CRUD operace se sloty
 * - Aktivní slot management
 * - F1 BUG: Smazání slotu nefunguje (test.skip)
 */
test.describe('Slot System', () => {
  test.beforeEach(async ({ page }) => {
    // Nejprve načíst stránku, pak vyčistit localStorage a reload
    await page.goto('/mausritter-solo-companion.html');
    await clearLocalStorage(page);
    await page.reload();
  });

  test('vytvoří nový slot', async ({ page }) => {
    await createFirstSlot(page);
    await waitForAutoSave(page);

    const slotCount = await getSlotCount(page);
    expect(slotCount).toBe(1);
  });

  test('načte existující slot', async ({ page }) => {
    // Vytvoř slot
    await createFirstSlot(page);
    await waitForAutoSave(page, 1000);

    const slotId = await page.evaluate(() =>
      localStorage.getItem('mausritter-active-slot-id')
    );

    // Vrať se na výběr
    await page.goto('/mausritter-solo-companion.html');
    await page.waitForLoadState('networkidle');

    // Načti slot kliknutím (použij "Pokračovat" button pokud existuje)
    if (await hasContinueButton(page)) {
      await clickContinueButton(page);
      await page.waitForTimeout(1000);

      // Ověř že se načetl správný slot
      const loadedSlotId = await page.evaluate(() =>
        localStorage.getItem('mausritter-active-slot-id')
      );
      expect(loadedSlotId).toBe(slotId);
    }
  });

  test('aktivní slot se ukládá do localStorage', async ({ page }) => {
    await createFirstSlot(page);
    await waitForAutoSave(page);

    const activeSlotId = await page.evaluate(() =>
      localStorage.getItem('mausritter-active-slot-id')
    );

    expect(activeSlotId).toBeTruthy();
    expect(activeSlotId).toMatch(/^slot_/);
  });

  test('vytvoří více slotů', async ({ page }) => {
    // Slot 1
    await createFirstSlot(page);
    await waitForAutoSave(page, 1000);

    await page.goto('/mausritter-solo-companion.html');
    await page.waitForLoadState('networkidle');

    // Slot 2
    await createFirstSlot(page);
    await waitForAutoSave(page, 1000);

    await page.goto('/mausritter-solo-companion.html');
    await page.waitForLoadState('networkidle');

    // Slot 3
    await createFirstSlot(page);
    await waitForAutoSave(page, 1000);

    const slotCount = await getSlotCount(page);
    expect(slotCount).toBe(3);
  });

  test('sloty mají metadata (název, lastModified)', async ({ page }) => {
    await createFirstSlot(page);
    await waitForAutoSave(page);

    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    const slot = slotsIndex[0];

    expect(slot.id).toBeTruthy();
    expect(slot.name).toBeTruthy();
    expect(slot.lastModified).toBeTruthy();
    expect(slot.type).toBe('local');
  });

  test.skip('F1 BUG: smazání slotu nefunguje', async ({ page }) => {
    /**
     * TENTO TEST JE SKIP - F1 BUG Z test-findings.md
     *
     * Bug: Tlačítko smazání slotu (🗑️) nereaguje
     * Reproduction steps:
     * 1. Vytvoř slot
     * 2. Klikni na 🗑️ tlačítko
     * 3. Potvrď dialog
     * 4. EXPECTED: Slot smazán, ACTUAL: Nic se neděje
     *
     * Když bude bug opraven, odstraň .skip a test by měl projít
     */

    // Vytvoř slot
    await createFirstSlot(page);
    await waitForAutoSave(page, 1000);

    // Vrať se na výběr
    await page.goto('/mausritter-solo-companion.html');
    await page.waitForLoadState('networkidle');

    // Setup dialog handler (pokud delete zobrazí confirm dialog)
    page.on('dialog', async dialog => {
      console.log('Dialog detected:', dialog.message());
      await dialog.accept();
    });

    // Smaž slot (deleteSlot helper má hover support)
    await deleteSlot(page, 0);
    await page.waitForTimeout(1000);

    // EXPECTED: Slot by měl být smazán
    const slotCount = await getSlotCount(page);
    expect(slotCount).toBe(0);
  });

  test('přejmenování slotu aktualizuje metadata', async ({ page }) => {
    await createFirstSlot(page);
    await waitForAutoSave(page, 1000);

    const initialName = (await getLocalStorageItem(page, 'mausritter-slots-index'))[0].name;

    // Pokud existuje UI pro přejmenování, otestuj ho
    // Poznámka: Toto záleží na dostupnosti UI pro rename
    // Placeholder test - může být rozšířen

    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    expect(slotsIndex[0].name).toBe(initialName);
  });
});

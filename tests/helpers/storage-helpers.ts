import { Page } from '@playwright/test';

/**
 * Helper funkce pro práci s localStorage v Playwright testech
 */

/**
 * Vyčistí localStorage před testem
 * POZNÁMKA: Stránka MUSÍ být načtená před voláním
 */
export async function clearLocalStorage(page: Page) {
  try {
    await page.evaluate(() => localStorage.clear());
  } catch (e) {
    // Ignore - stránka není načtená nebo nemá localStorage
    console.log('clearLocalStorage failed:', e);
  }
}

/**
 * Získá všechny klíče z localStorage
 */
export async function getLocalStorageKeys(page: Page): Promise<string[]> {
  return await page.evaluate(() => Object.keys(localStorage));
}

/**
 * Načte data z localStorage a parsuje jako JSON
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<any> {
  const value = await page.evaluate((k) => localStorage.getItem(k), key);
  return value ? JSON.parse(value) : null;
}

/**
 * Nastaví data do localStorage jako JSON string
 */
export async function setLocalStorageItem(page: Page, key: string, value: any) {
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, JSON.stringify(v)),
    { k: key, v: value }
  );
}

/**
 * Simuluje QuotaExceededError přepsáním localStorage.setItem
 * Použití pro testování K3 opravy
 */
export async function simulateQuotaExceeded(page: Page) {
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    let callCount = 0;
    Storage.prototype.setItem = function(key: string, value: string) {
      callCount++;
      if (callCount > 5) { // První volání projdou, pak quota exceeded
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      }
      return original.apply(this, [key, value]);
    };
  });
}

/**
 * Počká na auto-save aplikace
 * Aplikace ukládá data asynchronně po změnách
 */
export async function waitForAutoSave(page: Page, timeout = 2000) {
  await page.waitForTimeout(timeout);
}

/**
 * Ověří že localStorage obsahuje specifický klíč
 */
export async function hasLocalStorageKey(page: Page, key: string): Promise<boolean> {
  const keys = await getLocalStorageKeys(page);
  return keys.includes(key);
}

/**
 * Získá počet slotů v indexu
 */
export async function getSlotCount(page: Page): Promise<number> {
  const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
  return slotsIndex ? slotsIndex.length : 0;
}

import { Page, Locator } from '@playwright/test';

/**
 * UI interaction helpers for Playwright tests
 *
 * These helpers provide stable, data-testid-based selectors
 * for common UI interactions in the Mausritter Solo Companion.
 */

/**
 * Click the "New Game" button on the slot selection screen
 * Note: On SlotSelectionScreen this directly creates a slot (no dialog)
 */
export async function clickNewGameButton(page: Page): Promise<void> {
  await page.getByTestId('new-game-button').click();
}

/**
 * Create a new slot from SlotSelectionScreen (first slot scenario)
 * This directly creates a slot - click the button and wait for main UI to appear
 *
 * IMPORTANT: Use this when creating the FIRST slot. For additional slots from
 * the main UI, use the dialog-based flow (showNewGameDialog).
 */
export async function createFirstSlot(page: Page): Promise<void> {
  // Click "Nová sólo hra" button on SlotSelectionScreen
  await page.getByTestId('new-game-button').click();
  // Wait for main UI to appear (journal input is always visible)
  await page.getByTestId('journal-input').waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Wait for the New Game Dialog to appear
 * Note: This dialog only appears from the main UI, not from SlotSelectionScreen
 * @returns Locator for the dialog element
 */
export async function waitForNewGameDialog(page: Page): Promise<Locator> {
  const dialog = page.getByTestId('new-game-dialog');
  await dialog.waitFor({ state: 'visible', timeout: 3000 });
  return dialog;
}

/**
 * Fill in the new slot name input field
 */
export async function fillNewSlotName(page: Page, name: string): Promise<void> {
  const input = page.getByTestId('new-slot-name-input');
  await input.fill(name);
}

/**
 * Click the "Create New Slot" button in the New Game Dialog
 * Note: Only use this with the dialog from main UI
 */
export async function createNewSlot(page: Page): Promise<void> {
  await page.getByTestId('create-new-slot-button').click();
}

/**
 * Click the "Overwrite Current Slot" button in the New Game Dialog
 */
export async function overwriteSlot(page: Page): Promise<void> {
  await page.getByTestId('overwrite-slot-button').click();
}

/**
 * Click the "Cancel" button in the New Game Dialog
 */
export async function cancelNewGameDialog(page: Page): Promise<void> {
  await page.getByTestId('cancel-new-game-button').click();
}

/**
 * Check if the "Continue Last Slot" button is visible
 * @returns true if the button exists and is visible, false otherwise
 */
export async function hasContinueButton(page: Page): Promise<boolean> {
  const button = page.getByTestId('continue-last-slot-button');
  try {
    return await button.isVisible();
  } catch {
    return false;
  }
}

/**
 * Click the "Continue Last Slot" button if it exists
 * @throws Error if the button is not visible
 */
export async function clickContinueButton(page: Page): Promise<void> {
  const button = page.getByTestId('continue-last-slot-button');
  await button.click();
}

/**
 * Delete a slot by index
 *
 * This function handles the hover interaction needed to reveal the delete button,
 * which has `opacity-0` by default and only appears on `group-hover`.
 *
 * @param page Playwright page
 * @param index Index of the slot card to delete (0-based)
 */
export async function deleteSlot(page: Page, index: number = 0): Promise<void> {
  const slotCards = page.getByTestId('slot-card');
  const targetCard = slotCards.nth(index);

  // Hover over the card to reveal the delete button
  await targetCard.hover();

  // Wait a moment for the opacity transition
  await page.waitForTimeout(200);

  // Click the delete button within this card
  const deleteBtn = targetCard.getByTestId('delete-slot-button');
  await deleteBtn.click();
}

/**
 * Get the count of visible slot cards
 */
export async function getSlotCount(page: Page): Promise<number> {
  const slotCards = page.getByTestId('slot-card');
  return await slotCards.count();
}

/**
 * Switch to the Journal tab/panel
 */
export async function switchToJournalTab(page: Page): Promise<void> {
  await page.getByTestId('panel-tab-journal').click();
}

/**
 * Switch to a specific panel by ID
 * @param panelId The panel ID (e.g., 'journal', 'combat', 'character', etc.)
 */
export async function switchToPanel(page: Page, panelId: string): Promise<void> {
  await page.getByTestId(`panel-tab-${panelId}`).click();
}

/**
 * Type text into the journal input and optionally submit with Enter
 *
 * @param page Playwright page
 * @param text Text to type
 * @param submit If true, press Enter after typing (default: true)
 */
export async function typeInJournal(page: Page, text: string, submit: boolean = true): Promise<void> {
  const input = page.getByTestId('journal-input');
  await input.fill(text);

  if (submit) {
    await page.keyboard.press('Enter');
  }
}

/**
 * Click the Export button to download save data
 *
 * Note: This triggers a file download. Use Playwright's download handling
 * if you need to capture the downloaded file.
 */
export async function exportSave(page: Page): Promise<void> {
  await page.getByTestId('export-button').click();
}

/**
 * Import a save file
 *
 * @param page Playwright page
 * @param filePath Absolute path to the JSON file to import
 *
 * Note: This will trigger a browser confirm() dialog. Make sure to set up
 * a dialog handler with page.on('dialog') before calling this function.
 */
export async function importSave(page: Page, filePath: string): Promise<void> {
  const fileInput = page.getByTestId('import-file-input');
  await fileInput.setInputFiles(filePath);
}

/**
 * Wait for auto-save to complete
 *
 * The app auto-saves to localStorage. This helper adds a delay
 * to ensure save operations have completed before proceeding.
 *
 * @param page Playwright page
 * @param ms Milliseconds to wait (default: 500)
 */
export async function waitForAutoSave(page: Page, ms: number = 500): Promise<void> {
  await page.waitForTimeout(ms);
}

/**
 * Get a localStorage item value
 *
 * @param page Playwright page
 * @param key localStorage key
 * @returns Parsed JSON object or null if not found
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<any> {
  return await page.evaluate((k) => {
    const value = localStorage.getItem(k);
    return value ? JSON.parse(value) : null;
  }, key);
}

/**
 * Set a localStorage item value
 *
 * @param page Playwright page
 * @param key localStorage key
 * @param value Value to store (will be JSON stringified)
 */
export async function setLocalStorageItem(page: Page, key: string, value: any): Promise<void> {
  await page.evaluate(
    ({ k, v }) => {
      localStorage.setItem(k, JSON.stringify(v));
    },
    { k: key, v: value }
  );
}

/**
 * Clear all localStorage data
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

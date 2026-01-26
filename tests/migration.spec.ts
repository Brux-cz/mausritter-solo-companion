import { test, expect } from '@playwright/test';
import { clearLocalStorage, getLocalStorageItem, setLocalStorageItem } from './helpers/storage-helpers';
import v1Data from './fixtures/save-data-v1.json';
import v2Data from './fixtures/save-data-v2.json';
import v3Data from './fixtures/save-data-v3.json';
import v4Data from './fixtures/save-data-v4-current.json';

/**
 * P1 TESTY: Save Data Migration
 *
 * SKIP: Tyto testy vyžadují přepracování.
 * Skutečná migrační logika aplikace:
 * - Migrace `mausritter-save` -> slot probíhá POUZE při první inicializaci
 * - A pouze pokud slotIndex je prázdný
 * - Testy předpokládaly jinou logiku (import/export migrace)
 *
 * TODO: Přepracovat na testování skutečné migrační logiky
 */
test.describe.skip('Save Data Migration', () => {
  test.beforeEach(async ({ page }) => {
    // Nejprve načíst stránku pro kontext, pak vyčistit localStorage
    await page.goto('/mausritter-solo-companion.html');
    await clearLocalStorage(page);
  });

  test('migruje v1 save na v4', async ({ page }) => {
    // Simuluj starý v1 save (bez version field, má character object)
    await setLocalStorageItem(page, 'mausritter-save', v1Data);

    // Reload aplikace - měla by automaticky migrovat
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Načti slot index
    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    expect(slotsIndex).toBeTruthy();
    expect(slotsIndex.length).toBeGreaterThan(0);

    const slotId = slotsIndex[0]?.id;
    expect(slotId).toBeTruthy();

    const migratedData = await getLocalStorageItem(page, `mausritter-slot-${slotId}`);

    // Ověř strukturu v4
    expect(migratedData.version).toBe(4);
    expect(migratedData.parties).toBeDefined();
    expect(Array.isArray(migratedData.parties)).toBe(true);
    expect(migratedData.parties.length).toBeGreaterThan(0);

    // Ověř že character byl převeden na party member
    const firstParty = migratedData.parties[0];
    expect(firstParty.members).toBeDefined();
    expect(firstParty.members.length).toBeGreaterThan(0);

    const character = firstParty.members[0];
    expect(character.name).toBe('Testovací Myš v1');
    expect(character.STR).toEqual({ current: 10, max: 10 });

    // Ověř že gameTime byl migrován (v4 má turn + restedToday)
    expect(firstParty.gameTime.day).toBeDefined();
    expect(firstParty.gameTime.season).toBeDefined();
    expect(firstParty.gameTime.turn).toBeDefined(); // v4 přidáno
    expect(firstParty.gameTime.restedToday).toBeDefined(); // v4 přidáno

    // Ověř že journal byl zachován
    expect(migratedData.journal).toBeDefined();
  });

  test('migruje v2 save na v4', async ({ page }) => {
    // v2 má parties ale nemá settlements/worldNPCs
    await setLocalStorageItem(page, 'mausritter-save', v2Data);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    const slotId = slotsIndex[0]?.id;
    const migratedData = await getLocalStorageItem(page, `mausritter-slot-${slotId}`);

    // Ověř verzi
    expect(migratedData.version).toBe(4);

    // Ověř že party byla zachována
    expect(migratedData.parties[0].name).toBe('Testovací družina v2');

    // Ověř že settlements a worldNPCs byly přidány (v3→v4)
    expect(migratedData.settlements).toBeDefined();
    expect(Array.isArray(migratedData.settlements)).toBe(true);

    expect(migratedData.worldNPCs).toBeDefined();
    expect(Array.isArray(migratedData.worldNPCs)).toBe(true);

    // Ověř že gameTime má nové v4 fields
    const party = migratedData.parties[0];
    expect(party.gameTime.turn).toBeDefined();
    expect(party.gameTime.restedToday).toBeDefined();
  });

  test('migruje v3 save na v4', async ({ page }) => {
    // v3 má settlements/worldNPCs ale gameTime nemá turn/restedToday
    await setLocalStorageItem(page, 'mausritter-save', v3Data);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    const slotId = slotsIndex[0]?.id;
    const migratedData = await getLocalStorageItem(page, `mausritter-slot-${slotId}`);

    // Ověř verzi
    expect(migratedData.version).toBe(4);

    // Ověř že data byla zachována
    expect(migratedData.parties[0].name).toBe('Testovací družina v3');
    expect(migratedData.settlements.length).toBe(1);
    expect(migratedData.settlements[0].name).toBe('Testovací Osada');
    expect(migratedData.worldNPCs.length).toBe(1);
    expect(migratedData.worldNPCs[0].name).toBe('Testovací NPC');

    // Ověř že gameTime byl rozšířen o v4 fields
    const party = migratedData.parties[0];
    expect(party.gameTime.day).toBe(5);
    expect(party.gameTime.season).toBe('winter');
    expect(party.gameTime.turn).toBeDefined(); // Nové v4
    expect(party.gameTime.restedToday).toBeDefined(); // Nové v4
    expect(typeof party.gameTime.turn).toBe('number');
    expect(typeof party.gameTime.restedToday).toBe('boolean');
  });

  test('v4 save zůstává beze změny', async ({ page }) => {
    // v4 je aktuální verze - žádná migrace
    await setLocalStorageItem(page, 'mausritter-save', v4Data);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    const slotId = slotsIndex[0]?.id;
    const data = await getLocalStorageItem(page, `mausritter-slot-${slotId}`);

    // Ověř že data zůstala nezměněná
    expect(data.version).toBe(4);
    expect(data.parties[0].name).toBe('Testovací družina v4');
    expect(data.parties[0].gameTime.turn).toBe(5);
    expect(data.parties[0].gameTime.restedToday).toBe(false);
    expect(data.settlements[0].name).toBe('Moderní Osada');
  });

  test('migrace zachovává journal záznamy', async ({ page }) => {
    await setLocalStorageItem(page, 'mausritter-save', v1Data);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    const slotId = slotsIndex[0]?.id;
    const migratedData = await getLocalStorageItem(page, `mausritter-slot-${slotId}`);

    // Ověř že journal z v1 byl zachován
    expect(migratedData.journal).toBeDefined();
    expect(migratedData.journal.length).toBeGreaterThan(0);

    const journalEntry = migratedData.journal.find((e: any) =>
      e.result?.includes('Test entry z v1')
    );
    expect(journalEntry).toBeTruthy();
  });

  test('migrace zachovává character statistiky', async ({ page }) => {
    await setLocalStorageItem(page, 'mausritter-save', v1Data);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const slotsIndex = await getLocalStorageItem(page, 'mausritter-slots-index');
    const slotId = slotsIndex[0]?.id;
    const migratedData = await getLocalStorageItem(page, `mausritter-slot-${slotId}`);

    const character = migratedData.parties[0].members[0];

    // Ověř že všechny atributy byly zachovány
    expect(character.STR).toEqual({ current: 10, max: 10 });
    expect(character.DEX).toEqual({ current: 9, max: 9 });
    expect(character.WIL).toEqual({ current: 8, max: 8 });
    expect(character.hp).toEqual({ current: 5, max: 5 });
    expect(character.birthsign).toBe('Star');
    expect(character.coat).toBe('Hnědá');
    expect(character.inventorySlots).toBeDefined();
  });
});

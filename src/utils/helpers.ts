// ============================================
// UTILITY FUNCTIONS
// ============================================

export const rollDice = (count: number, sides: number): number[] => {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * sides) + 1);
  }
  return results;
};

export const rollD6 = (): number => rollDice(1, 6)[0];
export const rollD10 = (): number => rollDice(1, 10)[0];
export const rollD12 = (): number => rollDice(1, 12)[0];
export const rollD20 = (): number => rollDice(1, 20)[0];
export const roll2D6 = (): { dice: number[]; total: number } => { const r = rollDice(2, 6); return { dice: r, total: r[0] + r[1] }; };
// k66 = první d6 jako desítky, druhá jako jednotky (rozsah 11-66)
export const rollK66 = (): { dice: [number, number]; result: number } => {
  const tens = rollD6();
  const units = rollD6();
  return { dice: [tens, units], result: tens * 10 + units };
};

export const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const formatTimestamp = (): string => new Date().toLocaleString('cs-CZ');

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  rollDice, rollD6, rollD12, rollD20, roll2D6, rollK66,
  randomFrom, generateId, formatTimestamp
} from './helpers';

describe('rollDice', () => {
  it('vrátí pole správné délky', () => {
    const result = rollDice(3, 6);
    expect(result).toHaveLength(3);
  });

  it('hodnoty jsou v rozsahu 1–sides', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollDice(5, 6);
      result.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6);
      });
    }
  });

  it('deterministic s mock Math.random', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = rollDice(2, 6);
    // Math.floor(0.5 * 6) + 1 = 4
    expect(result).toEqual([4, 4]);
    spy.mockRestore();
  });
});

describe('rollD6 / rollD12 / rollD20', () => {
  it('rollD6 vrací 1–6', () => {
    for (let i = 0; i < 50; i++) {
      const v = rollD6();
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  it('rollD12 vrací 1–12', () => {
    for (let i = 0; i < 50; i++) {
      const v = rollD12();
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(12);
    }
  });

  it('rollD20 vrací 1–20', () => {
    for (let i = 0; i < 50; i++) {
      const v = rollD20();
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(20);
    }
  });
});

describe('roll2D6', () => {
  it('vrátí dice pole délky 2 a total = dice[0] + dice[1]', () => {
    for (let i = 0; i < 50; i++) {
      const { dice, total } = roll2D6();
      expect(dice).toHaveLength(2);
      expect(total).toBe(dice[0] + dice[1]);
    }
  });

  it('total je v rozsahu 2–12', () => {
    for (let i = 0; i < 50; i++) {
      const { total } = roll2D6();
      expect(total).toBeGreaterThanOrEqual(2);
      expect(total).toBeLessThanOrEqual(12);
    }
  });
});

describe('rollK66', () => {
  it('result = tens*10 + units, obě 1–6', () => {
    for (let i = 0; i < 50; i++) {
      const { dice, result } = rollK66();
      const [tens, units] = dice;
      expect(tens).toBeGreaterThanOrEqual(1);
      expect(tens).toBeLessThanOrEqual(6);
      expect(units).toBeGreaterThanOrEqual(1);
      expect(units).toBeLessThanOrEqual(6);
      expect(result).toBe(tens * 10 + units);
    }
  });
});

describe('randomFrom', () => {
  it('vrací prvek z pole', () => {
    const arr = ['a', 'b', 'c'];
    for (let i = 0; i < 30; i++) {
      expect(arr).toContain(randomFrom(arr));
    }
  });

  it('deterministic s mock', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomFrom([10, 20, 30])).toBe(10);
    spy.mockRestore();
  });
});

describe('generateId', () => {
  it('vrací string délky 9', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBe(9);
  });

  it('obsahuje pouze [a-z0-9]', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateId()).toMatch(/^[a-z0-9]{9}$/);
    }
  });

  it('generuje unikátní ID', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));
    expect(ids.size).toBe(50);
  });
});

describe('formatTimestamp', () => {
  it('vrací string s cs-CZ formátem', () => {
    const ts = formatTimestamp();
    expect(typeof ts).toBe('string');
    expect(ts.length).toBeGreaterThan(0);
    // cs-CZ formát obsahuje tečky v datu (např. "8. 2. 2026")
    expect(ts).toMatch(/\d+\.\s*\d+\./);
  });
});

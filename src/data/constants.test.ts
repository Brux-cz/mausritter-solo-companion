import { describe, it, expect } from 'vitest';
import { SAVE_VERSION, migrations, migrateSaveData } from './constants';

describe('SAVE_VERSION', () => {
  it('je 4', () => {
    expect(SAVE_VERSION).toBe(4);
  });
});

describe('migrations', () => {
  describe('1→2: single character to parties', () => {
    it('migruje character na parties[0].members[0]', () => {
      const data = {
        version: 1,
        character: { name: 'Test Mouse', STR: { current: 10, max: 10 } },
        journal: [],
      };
      const result = migrations[1](data);
      expect(result.version).toBe(2);
      expect(result.parties).toHaveLength(1);
      expect(result.parties[0].members).toHaveLength(1);
      expect(result.parties[0].members[0].name).toBe('Test Mouse');
      expect(result.activePartyId).toBe(result.parties[0].id);
      expect(result.activeCharacterId).toBe(result.parties[0].members[0].id);
    });

    it('generuje id pro character bez id', () => {
      const data = {
        version: 1,
        character: { name: 'No ID Mouse' },
      };
      const result = migrations[1](data);
      expect(result.parties[0].members[0].id).toBeTruthy();
    });

    it('bez character jen bumplne verzi', () => {
      const data = { version: 1 };
      const result = migrations[1](data);
      expect(result.version).toBe(2);
      expect(result.parties).toBeUndefined();
    });
  });

  describe('2→3: přidá settlements a worldNPCs', () => {
    it('přidá prázdná pole', () => {
      const data = { version: 2, parties: [] };
      const result = migrations[2](data);
      expect(result.version).toBe(3);
      expect(result.settlements).toEqual([]);
      expect(result.worldNPCs).toEqual([]);
    });

    it('zachová existující settlements', () => {
      const existing = [{ id: 's1', name: 'Village' }];
      const result = migrations[2]({ version: 2, settlements: existing });
      expect(result.settlements).toEqual(existing);
    });
  });

  describe('3→4: gameTime format', () => {
    it('party s gameTime zachová validní hodnoty', () => {
      const data = {
        version: 3,
        parties: [{
          id: 'p1',
          gameTime: { day: 5, season: 'summer', watch: 2, turn: 3, restedToday: true }
        }]
      };
      const result = migrations[3](data);
      expect(result.version).toBe(4);
      expect(result.parties[0].gameTime).toEqual({
        day: 5,
        season: 'summer',
        watch: 2,
        turn: 3,
        restedToday: true,
      });
    });

    it('party bez gameTime dostane defaults', () => {
      const data = {
        version: 3,
        parties: [{ id: 'p1' }]
      };
      const result = migrations[3](data);
      expect(result.parties[0].gameTime).toEqual({
        day: 1,
        season: 'spring',
        watch: 0,
        turn: 0,
        restedToday: false,
      });
    });

    it('zachová watch=0 (nullish coalescing)', () => {
      const data = {
        version: 3,
        parties: [{ id: 'p1', gameTime: { day: 1, season: 'spring', watch: 0, turn: 0, restedToday: false } }]
      };
      const result = migrations[3](data);
      expect(result.parties[0].gameTime.watch).toBe(0);
    });
  });
});

describe('migrateSaveData', () => {
  it('migruje v1 → v4 kompletně', () => {
    const v1 = {
      version: 1,
      character: { name: 'Old Mouse', id: 'c1' },
      journal: [{ id: 'j1', type: 'narrative', content: 'test' }],
    };
    const result = migrateSaveData(v1);
    expect(result.version).toBe(4);
    expect(result.parties).toHaveLength(1);
    expect(result.parties[0].members[0].name).toBe('Old Mouse');
    expect(result.settlements).toEqual([]);
    expect(result.worldNPCs).toEqual([]);
    expect(result.parties[0].gameTime.turn).toBe(0);
  });

  it('prázdný objekt → defaults pro všechna pole', () => {
    const result = migrateSaveData({});
    expect(result.version).toBe(4);
    expect(result.parties).toEqual([]);
    expect(result.activePartyId).toBeNull();
    expect(result.activeCharacterId).toBeNull();
    expect(result.journal).toEqual([]);
    expect(result.factions).toEqual([]);
    expect(result.settlements).toEqual([]);
    expect(result.worldNPCs).toEqual([]);
  });

  it('v4 data projdou beze změn (passthrough)', () => {
    const v4 = {
      version: 4,
      parties: [{ id: 'p1', name: 'Party', members: [], gameTime: { day: 1, season: 'spring', watch: 1, turn: 0, restedToday: false }, createdAt: '2025-01-01' }],
      activePartyId: 'p1',
      activeCharacterId: null,
      journal: [],
      factions: [],
      settlements: [],
      worldNPCs: [],
    };
    const result = migrateSaveData(v4);
    expect(result.version).toBe(4);
    expect(result.parties).toEqual(v4.parties);
    expect(result.activePartyId).toBe('p1');
  });

  it('extra pole zachována v _extra', () => {
    const data = {
      version: 4,
      parties: [],
      customField: 'hello',
    };
    const result = migrateSaveData(data);
    expect(result._extra).toBeDefined();
    expect(result._extra.customField).toBe('hello');
  });

  it('known pole nejsou v _extra', () => {
    const data = {
      version: 4,
      parties: [{ id: 'p1' }],
      journal: [{ id: 'j1' }],
    };
    const result = migrateSaveData(data);
    expect(result._extra).not.toHaveProperty('parties');
    expect(result._extra).not.toHaveProperty('journal');
    expect(result._extra).not.toHaveProperty('version');
  });
});

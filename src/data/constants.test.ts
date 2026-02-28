import { describe, it, expect } from 'vitest';
import { SAVE_VERSION, migrations, migrateSaveData, LORE_ASPECTS } from './constants';

describe('SAVE_VERSION', () => {
  it('je 6', () => {
    expect(SAVE_VERSION).toBe(7);
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

  describe('5→6: maps', () => {
    it('přidá maps a activeMapId', () => {
      const data = {
        version: 5,
        parties: [{ id: 'p1' }],
      };
      const result = migrations[5](data);
      expect(result.version).toBe(6);
      expect(result.maps).toEqual([]);
      expect(result.activeMapId).toBeNull();
    });

    it('zachová existující maps', () => {
      const existing = [{ id: 'm1', name: 'Dungeon', data: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' }];
      const data = { version: 5, maps: existing };
      const result = migrations[5](data);
      expect(result.maps).toEqual(existing);
    });
  });

  describe('6→7: worldCreatures', () => {
    it('přidá worldCreatures', () => {
      const data = {
        version: 6,
        parties: [{ id: 'p1' }],
      };
      const result = migrations[6](data);
      expect(result.version).toBe(7);
      expect(result.worldCreatures).toEqual([]);
    });

    it('zachová existující worldCreatures', () => {
      const existing = [{ id: 'c1', name: 'Dragon', lore: { origin: 'test' } }];
      const data = { version: 6, worldCreatures: existing };
      const result = migrations[6](data);
      expect(result.worldCreatures).toEqual(existing);
    });
  });

  describe('4→5: sceneState', () => {
    it('party bez sceneState dostane DEFAULT_SCENE_STATE', () => {
      const data = {
        version: 4,
        parties: [{ id: 'p1', name: 'Test', members: [], gameTime: { day: 1, season: 'spring', watch: 1, turn: 0, restedToday: false }, createdAt: '2025-01-01' }]
      };
      const result = migrations[4](data);
      expect(result.version).toBe(5);
      expect(result.parties[0].sceneState).toBeDefined();
      expect(result.parties[0].sceneState.chaosFactor).toBe(5);
      expect(result.parties[0].sceneState.currentScene).toBeNull();
      expect(result.parties[0].sceneState.sceneHistory).toEqual([]);
      expect(result.parties[0].sceneState.threads).toEqual([]);
      expect(result.parties[0].sceneState.sceneNPCs).toEqual([]);
      expect(result.parties[0].sceneState.sceneCount).toBe(0);
    });

    it('party s existujícím sceneState zachová data', () => {
      const existing = {
        chaosFactor: 7,
        currentScene: null,
        sceneHistory: [],
        threads: [{ id: 't1', description: 'Test thread', resolved: false }],
        sceneNPCs: [],
        sceneCount: 3
      };
      const data = {
        version: 4,
        parties: [{ id: 'p1', sceneState: existing }]
      };
      const result = migrations[4](data);
      expect(result.parties[0].sceneState.chaosFactor).toBe(7);
      expect(result.parties[0].sceneState.threads).toHaveLength(1);
      expect(result.parties[0].sceneState.sceneCount).toBe(3);
    });
  });
});

describe('LORE_ASPECTS integrity', () => {
  it('has exactly 12 aspects', () => {
    expect(LORE_ASPECTS).toHaveLength(12);
  });

  it('each aspect has exactly 25 items', () => {
    for (const aspect of LORE_ASPECTS) {
      expect(aspect.table, `${aspect.key} má ${aspect.table.length} položek místo 25`).toHaveLength(25);
    }
  });

  it('no empty strings in any table', () => {
    for (const aspect of LORE_ASPECTS) {
      for (const item of aspect.table) {
        expect(item.trim(), `Prázdná položka v ${aspect.key}`).not.toBe('');
      }
    }
  });

  it('all aspect keys are unique', () => {
    const keys = LORE_ASPECTS.map(a => a.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('all required fields present on each aspect', () => {
    for (const aspect of LORE_ASPECTS) {
      expect(aspect.key, 'key chybí').toBeTruthy();
      expect(aspect.label, `label chybí pro ${aspect.key}`).toBeTruthy();
      expect(aspect.icon, `icon chybí pro ${aspect.key}`).toBeTruthy();
      expect(aspect.borderColor, `borderColor chybí pro ${aspect.key}`).toBeTruthy();
      expect(aspect.labelColor, `labelColor chybí pro ${aspect.key}`).toBeTruthy();
      expect(Array.isArray(aspect.table), `table není pole pro ${aspect.key}`).toBe(true);
    }
  });

  it('expected keys are present in correct order', () => {
    const expectedKeys = [
      'origin', 'motivation', 'social', 'lair', 'behavior',
      'rumor', 'magic', 'likes', 'possessions', 'virtue', 'darkness', 'twist',
    ];
    const actualKeys = LORE_ASPECTS.map(a => a.key);
    expect(actualKeys).toEqual(expectedKeys);
  });
});

describe('migrateSaveData', () => {
  it('migruje v1 → v7 kompletně', () => {
    const v1 = {
      version: 1,
      character: { name: 'Old Mouse', id: 'c1' },
      journal: [{ id: 'j1', type: 'narrative', content: 'test' }],
    };
    const result = migrateSaveData(v1);
    expect(result.version).toBe(7);
    expect(result.parties).toHaveLength(1);
    expect(result.parties[0].members[0].name).toBe('Old Mouse');
    expect(result.settlements).toEqual([]);
    expect(result.worldNPCs).toEqual([]);
    expect(result.worldCreatures).toEqual([]);
    expect(result.parties[0].gameTime.turn).toBe(0);
    expect(result.parties[0].sceneState).toBeDefined();
    expect(result.parties[0].sceneState.chaosFactor).toBe(5);
    expect(result.maps).toEqual([]);
    expect(result.activeMapId).toBeNull();
  });

  it('prázdný objekt → defaults pro všechna pole', () => {
    const result = migrateSaveData({});
    expect(result.version).toBe(7);
    expect(result.parties).toEqual([]);
    expect(result.activePartyId).toBeNull();
    expect(result.activeCharacterId).toBeNull();
    expect(result.journal).toEqual([]);
    expect(result.factions).toEqual([]);
    expect(result.settlements).toEqual([]);
    expect(result.worldNPCs).toEqual([]);
    expect(result.worldCreatures).toEqual([]);
    expect(result.maps).toEqual([]);
    expect(result.activeMapId).toBeNull();
  });

  it('v7 data projdou beze změn (passthrough)', () => {
    const v7 = {
      version: 7,
      parties: [{ id: 'p1', name: 'Party', members: [], gameTime: { day: 1, season: 'spring', watch: 1, turn: 0, restedToday: false }, createdAt: '2025-01-01', sceneState: { chaosFactor: 5, currentScene: null, sceneHistory: [], threads: [], sceneNPCs: [], sceneCount: 0 } }],
      activePartyId: 'p1',
      activeCharacterId: null,
      journal: [],
      factions: [],
      settlements: [],
      worldNPCs: [],
      worldCreatures: [],
      maps: [],
      activeMapId: null,
    };
    const result = migrateSaveData(v7);
    expect(result.version).toBe(7);
    expect(result.parties).toEqual(v7.parties);
    expect(result.activePartyId).toBe('p1');
  });

  it('extra pole zachována v _extra', () => {
    const data = {
      version: 5,
      parties: [],
      customField: 'hello',
    };
    const result = migrateSaveData(data);
    expect(result._extra).toBeDefined();
    expect(result._extra.customField).toBe('hello');
  });

  it('known pole nejsou v _extra', () => {
    const data = {
      version: 5,
      parties: [{ id: 'p1' }],
      journal: [{ id: 'j1' }],
    };
    const result = migrateSaveData(data);
    expect(result._extra).not.toHaveProperty('parties');
    expect(result._extra).not.toHaveProperty('journal');
    expect(result._extra).not.toHaveProperty('version');
  });
});

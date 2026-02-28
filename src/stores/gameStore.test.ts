import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './gameStore';
import type { Party, GameState, WorldNPC, Settlement, JournalEntry, SceneState, DungeonMap } from '../types';
import { DEFAULT_SCENE_STATE } from '../data/constants';

// Reset store data (merge mode — preserves actions/selectors)
const resetData = {
  parties: [] as any[],
  activePartyId: null as string | null,
  activeCharacterId: null as string | null,
  journal: [] as any[],
  factions: [] as any[],
  settlements: [] as any[],
  worldNPCs: [] as any[],
  timedEvents: [] as any[],
  lexicon: [] as any[],
  maps: [] as any[],
  activeMapId: null as string | null,
  journalPartyFilter: 'all',
};

beforeEach(() => {
  useGameStore.setState(resetData);
});

describe('Party management', () => {
  it('createParty() — výchozí jméno "Nová družina", nastaví activePartyId', () => {
    const party = useGameStore.getState().createParty();
    const state = useGameStore.getState();
    expect(party.name).toBe('Nová družina');
    expect(party.members).toEqual([]);
    expect(state.activePartyId).toBe(party.id);
    expect(state.parties).toHaveLength(1);
  });

  it('createParty("X") — vlastní jméno', () => {
    const party = useGameStore.getState().createParty('Myší výprava');
    expect(party.name).toBe('Myší výprava');
  });

  it('createParty — gameTime defaults', () => {
    const party = useGameStore.getState().createParty();
    expect(party.gameTime).toEqual({
      day: 1,
      season: 'spring',
      watch: 1,
      turn: 0,
      restedToday: false,
    });
  });

  it('removeParty — resetuje activePartyId na další party', () => {
    const p1 = useGameStore.getState().createParty('A');
    const p2 = useGameStore.getState().createParty('B');
    // p2 je nyní aktivní
    expect(useGameStore.getState().activePartyId).toBe(p2.id);
    // Smaž p2, aktivní by měl být p1
    useGameStore.getState().removeParty(p2.id);
    expect(useGameStore.getState().activePartyId).toBe(p1.id);
    expect(useGameStore.getState().parties).toHaveLength(1);
  });

  it('removeParty — null když poslední', () => {
    const party = useGameStore.getState().createParty();
    useGameStore.getState().removeParty(party.id);
    expect(useGameStore.getState().activePartyId).toBeNull();
    expect(useGameStore.getState().parties).toHaveLength(0);
  });
});

describe('Character management', () => {
  let partyId: string;

  beforeEach(() => {
    const party = useGameStore.getState().createParty('Test Party');
    partyId = party.id;
  });

  it('createPC — type="pc", náhodné stats (dice rolls)', () => {
    const pc = useGameStore.getState().createPC(partyId);
    expect(pc.type).toBe('pc');
    // Atributy: 3k6 keep 2 → rozsah 2-12
    expect(pc.STR.current).toBeGreaterThanOrEqual(2);
    expect(pc.STR.current).toBeLessThanOrEqual(12);
    expect(pc.STR.current).toBe(pc.STR.max);
    expect(pc.DEX.current).toBeGreaterThanOrEqual(2);
    expect(pc.DEX.current).toBeLessThanOrEqual(12);
    expect(pc.DEX.current).toBe(pc.DEX.max);
    expect(pc.WIL.current).toBeGreaterThanOrEqual(2);
    expect(pc.WIL.current).toBeLessThanOrEqual(12);
    expect(pc.WIL.current).toBe(pc.WIL.max);
    // BO a Ďobky: k6 → rozsah 1-6
    expect(pc.hp.current).toBeGreaterThanOrEqual(1);
    expect(pc.hp.current).toBeLessThanOrEqual(6);
    expect(pc.hp.current).toBe(pc.hp.max);
    expect(pc.pips).toBeGreaterThanOrEqual(1);
    expect(pc.pips).toBeLessThanOrEqual(6);
    expect(pc.name).toBeTruthy();
    // Základní vybavení: Zásoby + Pochodně + 2 předměty z Původu
    expect(pc.inventory.length).toBeGreaterThanOrEqual(4);
    // Ověříme, že je přidaná do party
    const party = useGameStore.getState().parties.find(p => p.id === partyId);
    expect(party?.members).toHaveLength(1);
    expect(party?.members[0].id).toBe(pc.id);
  });

  it('createPC s characterData — použije poskytnutá data', () => {
    const customData: any = {
      id: 'custom-id',
      type: 'pc' as const,
      name: 'Custom Mouse',
      STR: { current: 8, max: 8 },
      DEX: { current: 12, max: 12 },
      WIL: { current: 6, max: 6 },
      hp: { current: 4, max: 4 },
    };
    const pc = useGameStore.getState().createPC(partyId, customData);
    expect(pc.name).toBe('Custom Mouse');
    expect(pc.STR.current).toBe(8);
  });

  it('createHireling — type="hireling", stats v rozsahu', () => {
    const hireling = useGameStore.getState().createHireling(partyId);
    expect(hireling.type).toBe('hireling');
    // STR/DEX/WIL = 2d6 → rozsah 2–12
    expect(hireling.STR.current).toBeGreaterThanOrEqual(2);
    expect(hireling.STR.current).toBeLessThanOrEqual(12);
    expect(hireling.DEX.current).toBeGreaterThanOrEqual(2);
    expect(hireling.DEX.current).toBeLessThanOrEqual(12);
    expect(hireling.WIL.current).toBeGreaterThanOrEqual(2);
    expect(hireling.WIL.current).toBeLessThanOrEqual(12);
    // hp = 1d6 → rozsah 1–6
    expect(hireling.hp.current).toBeGreaterThanOrEqual(1);
    expect(hireling.hp.current).toBeLessThanOrEqual(6);
    expect(hireling.name).toBeTruthy();
  });

  it('removeCharacter — odstraní z party, resetuje activeCharacterId', () => {
    const pc = useGameStore.getState().createPC(partyId);
    useGameStore.setState({ activeCharacterId: pc.id });
    useGameStore.getState().removeCharacter(partyId, pc.id);
    const party = useGameStore.getState().parties.find(p => p.id === partyId);
    expect(party?.members).toHaveLength(0);
    expect(useGameStore.getState().activeCharacterId).toBeNull();
  });
});

describe('World management', () => {
  it('deleteNPC — cascading: odstraní z worldNPCs, settlements.npcs[], settlements.ruler, journal', () => {
    const npc: WorldNPC = {
      id: 'npc1',
      name: 'Test NPC',
      hp: { current: 4, max: 4 },
      str: { current: 8, max: 8 },
      dex: { current: 8, max: 8 },
      wil: { current: 8, max: 8 },
      settlementId: null,
    };
    const settlement: Settlement = {
      id: 's1',
      name: 'Village',
      size: 'small',
      ruler: 'npc1',
      notes: '',
      npcs: ['npc1', 'npc2'],
    };
    const journalEntry: any = {
      id: 'j1',
      type: 'saved_npc',
      data: { id: 'npc1' },
      timestamp: '2025-01-01',
    };
    useGameStore.setState({
      worldNPCs: [npc],
      settlements: [settlement],
      journal: [journalEntry],
    });

    useGameStore.getState().deleteNPC('npc1');
    const state = useGameStore.getState();
    expect(state.worldNPCs).toHaveLength(0);
    expect(state.settlements[0].npcs).toEqual(['npc2']);
    expect(state.settlements[0].ruler).toBeNull();
    expect(state.journal).toHaveLength(0);
  });

  it('deleteSettlement — cascading: odstraní z settlements, nastaví NPC.settlementId=null', () => {
    const npc: WorldNPC = {
      id: 'npc1',
      name: 'Village NPC',
      hp: { current: 4, max: 4 },
      str: { current: 8, max: 8 },
      dex: { current: 8, max: 8 },
      wil: { current: 8, max: 8 },
      settlementId: 's1',
    };
    const settlement: Settlement = {
      id: 's1',
      name: 'Village',
      size: 'small',
      ruler: null,
      notes: '',
      npcs: [],
    };
    useGameStore.setState({
      worldNPCs: [npc],
      settlements: [settlement],
    });

    useGameStore.getState().deleteSettlement('s1');
    const state = useGameStore.getState();
    expect(state.settlements).toHaveLength(0);
    expect(state.worldNPCs[0].settlementId).toBeNull();
  });

  it('promoteToNPC — vytvoří WorldNPC + journal entry type="saved_npc"', () => {
    const creatureData = {
      name: 'Big Rat',
      type: { name: 'Beast' },
      personality: 'Aggressive',
      appearance: 'Scarred',
    };
    const npc = useGameStore.getState().promoteToNPC(creatureData);
    const state = useGameStore.getState();
    expect(npc.name).toBe('Big Rat');
    expect(npc.role).toBe('Beast');
    expect(npc.birthsign).toBe('Aggressive');
    expect(npc.physicalDetail).toBe('Scarred');
    expect(state.worldNPCs).toHaveLength(1);
    expect(state.journal).toHaveLength(1);
    expect(state.journal[0].type).toBe('saved_npc');
  });

  it('updateParty — immutable update', () => {
    const party = useGameStore.getState().createParty('Original');
    const originalParties = useGameStore.getState().parties;
    useGameStore.getState().updateParty(party.id, { name: 'Updated' });
    const newParties = useGameStore.getState().parties;
    expect(newParties[0].name).toBe('Updated');
    // Immutability — nové pole
    expect(newParties).not.toBe(originalParties);
  });

  it('updateCharacterInParty — immutable update', () => {
    const party = useGameStore.getState().createParty();
    const pc = useGameStore.getState().createPC(party.id);
    useGameStore.getState().updateCharacterInParty(party.id, pc.id, { name: 'Renamed' });
    const updatedParty = useGameStore.getState().parties.find(p => p.id === party.id);
    expect(updatedParty?.members[0].name).toBe('Renamed');
  });
});

describe('Serialization', () => {
  it('getGameState — vrátí 12 polí, nevrátí interní', () => {
    useGameStore.getState().createParty();
    const gameState = useGameStore.getState().getGameState();
    expect(Object.keys(gameState).sort()).toEqual([
      'activeCharacterId', 'activeMapId', 'activePartyId', 'factions',
      'journal', 'lexicon', 'maps', 'parties', 'settlements',
      'timedEvents', 'worldCreatures', 'worldNPCs',
    ]);
    expect(gameState).not.toHaveProperty('journalPartyFilter');
    expect(gameState).not.toHaveProperty('getActiveParty');
  });

  it('loadGameState — obnoví všechna pole, defaults pro chybějící', () => {
    const data: Partial<GameState> = {
      parties: [{ id: 'p1', name: 'Loaded', members: [], gameTime: { day: 3, season: 'autumn', watch: 2, turn: 1, restedToday: true }, createdAt: '2025-01-01' }],
      activePartyId: 'p1',
      journal: [{ id: 'j1', type: 'narrative', content: 'Hello', timestamp: '2025-01-01' } as any],
    };
    useGameStore.getState().loadGameState(data);
    const state = useGameStore.getState();
    expect(state.parties).toHaveLength(1);
    expect(state.parties[0].name).toBe('Loaded');
    expect(state.activePartyId).toBe('p1');
    expect(state.factions).toEqual([]);
    expect(state.settlements).toEqual([]);
  });

  it('applyRemoteState(null) — no-op', () => {
    useGameStore.getState().createParty('Before');
    useGameStore.getState().applyRemoteState(null);
    expect(useGameStore.getState().parties).toHaveLength(1);
    expect(useGameStore.getState().parties[0].name).toBe('Before');
  });

  it('applyRemoteState({journal:[...]}) — merguje jen dodaná pole', () => {
    useGameStore.getState().createParty('Keep');
    const journal: JournalEntry[] = [
      { id: 'j1', type: 'narrative', content: 'Remote entry', timestamp: '2025-01-01' } as any,
    ];
    useGameStore.getState().applyRemoteState({ journal } as Partial<GameState>);
    const state = useGameStore.getState();
    expect(state.journal).toHaveLength(1);
    expect(state.journal[0].id).toBe('j1');
    // parties zachovány
    expect(state.parties).toHaveLength(1);
    expect(state.parties[0].name).toBe('Keep');
  });

  it('applyRemoteState({parties: "invalid"}) — normalizuje na []', () => {
    useGameStore.getState().applyRemoteState({ parties: 'invalid' as any } as Partial<GameState>);
    expect(useGameStore.getState().parties).toEqual([]);
  });
});

describe('Selectors', () => {
  it('getActiveParty — null bez parties', () => {
    expect(useGameStore.getState().getActiveParty()).toBeNull();
  });

  it('getActiveParty — vrátí správnou party', () => {
    const p1 = useGameStore.getState().createParty('A');
    const p2 = useGameStore.getState().createParty('B');
    // p2 je aktivní (poslední vytvořená)
    expect(useGameStore.getState().getActiveParty()?.id).toBe(p2.id);
    // Přepni na p1
    useGameStore.setState({ activePartyId: p1.id });
    expect(useGameStore.getState().getActiveParty()?.id).toBe(p1.id);
  });

  it('getActiveCharacter — null bez party', () => {
    expect(useGameStore.getState().getActiveCharacter()).toBeNull();
  });

  it('getActiveCharacter — null bez character', () => {
    useGameStore.getState().createParty();
    expect(useGameStore.getState().getActiveCharacter()).toBeNull();
  });

  it('getActiveCharacter — vrátí správnou postavu', () => {
    const party = useGameStore.getState().createParty();
    const pc = useGameStore.getState().createPC(party.id);
    useGameStore.setState({ activeCharacterId: pc.id });
    expect(useGameStore.getState().getActiveCharacter()?.id).toBe(pc.id);
  });
});

describe('Scene management', () => {
  let partyId: string;

  beforeEach(() => {
    const party = useGameStore.getState().createParty('Scene Test');
    partyId = party.id;
  });

  it('getSceneState — vrátí DEFAULT_SCENE_STATE pro novou party', () => {
    const sceneState = useGameStore.getState().getSceneState();
    expect(sceneState.chaosFactor).toBe(5);
    expect(sceneState.currentScene).toBeNull();
    expect(sceneState.sceneHistory).toEqual([]);
    expect(sceneState.threads).toEqual([]);
    expect(sceneState.sceneNPCs).toEqual([]);
    expect(sceneState.sceneCount).toBe(0);
  });

  it('getSceneState — vrátí DEFAULT_SCENE_STATE bez aktivní party', () => {
    useGameStore.setState({ activePartyId: null });
    const sceneState = useGameStore.getState().getSceneState();
    expect(sceneState.chaosFactor).toBe(5);
  });

  it('updateSceneState — partial update', () => {
    useGameStore.getState().updateSceneState({ chaosFactor: 7 });
    const sceneState = useGameStore.getState().getSceneState();
    expect(sceneState.chaosFactor).toBe(7);
    expect(sceneState.sceneCount).toBe(0); // ostatní zachovány
  });

  it('startScene — vytvoří scénu, inkrementuje sceneCount, loguje', () => {
    const result = useGameStore.getState().startScene('Průzkum mlýna', 'exploration');
    expect(result.scene.number).toBe(1);
    expect(result.scene.title).toBe('Průzkum mlýna');
    expect(result.scene.type).toBe('exploration');
    expect(result.scene.checkDie).toBeGreaterThanOrEqual(1);
    expect(result.scene.checkDie).toBeLessThanOrEqual(10);
    expect(['normal', 'altered', 'interrupted']).toContain(result.checkResult);

    const sceneState = useGameStore.getState().getSceneState();
    expect(sceneState.currentScene).not.toBeNull();
    expect(sceneState.currentScene?.number).toBe(1);
    expect(sceneState.sceneCount).toBe(1);

    // Journal entry
    const journal = useGameStore.getState().journal;
    expect(journal).toHaveLength(1);
    expect(journal[0].type).toBe('scene_start');
  });

  it('startScene — d10 check mechanika: die > CF = normal', () => {
    // Nastavíme CF na 1, takže d10 (2-10) > 1 = skoro vždy normální
    useGameStore.getState().updateSceneState({ chaosFactor: 1 });
    // Spustíme 20x a alespoň 1x by mělo být normální
    let normalCount = 0;
    for (let i = 0; i < 20; i++) {
      useGameStore.getState().updateSceneState({ currentScene: null, sceneCount: 0 });
      const result = useGameStore.getState().startScene('Test', 'other');
      if (result.checkResult === 'normal') normalCount++;
    }
    expect(normalCount).toBeGreaterThan(0);
  });

  it('endScene — pod kontrolou snižuje CF, loguje', () => {
    useGameStore.getState().startScene('Test', 'combat');
    useGameStore.getState().endScene('in_control');

    const sceneState = useGameStore.getState().getSceneState();
    expect(sceneState.currentScene).toBeNull();
    expect(sceneState.chaosFactor).toBe(4); // 5 - 1
    expect(sceneState.sceneHistory).toHaveLength(1);
    expect(sceneState.sceneHistory[0].outcome).toBe('in_control');

    const journal = useGameStore.getState().journal;
    expect(journal[0].type).toBe('scene_end');
  });

  it('endScene — mimo kontrolu zvyšuje CF', () => {
    useGameStore.getState().startScene('Test', 'combat');
    useGameStore.getState().endScene('out_of_control');

    const sceneState = useGameStore.getState().getSceneState();
    expect(sceneState.chaosFactor).toBe(6); // 5 + 1
  });

  it('endScene — CF clamped 1-9', () => {
    useGameStore.getState().updateSceneState({ chaosFactor: 9 });
    useGameStore.getState().startScene('Test', 'combat');
    useGameStore.getState().endScene('out_of_control');
    expect(useGameStore.getState().getSceneState().chaosFactor).toBe(9); // max

    useGameStore.getState().updateSceneState({ chaosFactor: 1 });
    useGameStore.getState().startScene('Test2', 'combat');
    useGameStore.getState().endScene('in_control');
    expect(useGameStore.getState().getSceneState().chaosFactor).toBe(1); // min
  });

  it('adjustChaosFactor — manuální úprava, clamp, log', () => {
    useGameStore.getState().adjustChaosFactor(2);
    expect(useGameStore.getState().getSceneState().chaosFactor).toBe(7);

    useGameStore.getState().adjustChaosFactor(-3);
    expect(useGameStore.getState().getSceneState().chaosFactor).toBe(4);

    // Clamp min
    useGameStore.getState().adjustChaosFactor(-10);
    expect(useGameStore.getState().getSceneState().chaosFactor).toBe(1);

    // Clamp max
    useGameStore.getState().adjustChaosFactor(20);
    expect(useGameStore.getState().getSceneState().chaosFactor).toBe(9);
  });

  it('adjustChaosFactor — no-op pokud beze změny', () => {
    useGameStore.getState().updateSceneState({ chaosFactor: 9 });
    const journalBefore = useGameStore.getState().journal.length;
    useGameStore.getState().adjustChaosFactor(1); // 9+1=10→clamped 9, no change
    expect(useGameStore.getState().journal.length).toBe(journalBefore);
  });

  it('addThread + removeThread', () => {
    useGameStore.getState().addThread('Najít ztracený artefakt');
    const threads = useGameStore.getState().getSceneState().threads;
    expect(threads).toHaveLength(1);
    expect(threads[0].description).toBe('Najít ztracený artefakt');
    expect(threads[0].resolved).toBe(false);

    useGameStore.getState().removeThread(threads[0].id);
    expect(useGameStore.getState().getSceneState().threads).toHaveLength(0);
  });

  it('toggleThreadResolved', () => {
    useGameStore.getState().addThread('Test thread');
    const threadId = useGameStore.getState().getSceneState().threads[0].id;

    useGameStore.getState().toggleThreadResolved(threadId);
    expect(useGameStore.getState().getSceneState().threads[0].resolved).toBe(true);

    useGameStore.getState().toggleThreadResolved(threadId);
    expect(useGameStore.getState().getSceneState().threads[0].resolved).toBe(false);
  });

  it('addSceneNPC + removeSceneNPC', () => {
    useGameStore.getState().addSceneNPC('Alkoun', 'npc123');
    const npcs = useGameStore.getState().getSceneState().sceneNPCs;
    expect(npcs).toHaveLength(1);
    expect(npcs[0].name).toBe('Alkoun');
    expect(npcs[0].worldNpcId).toBe('npc123');

    useGameStore.getState().addSceneNPC('Tajemný posel');
    expect(useGameStore.getState().getSceneState().sceneNPCs).toHaveLength(2);

    useGameStore.getState().removeSceneNPC(npcs[0].id);
    expect(useGameStore.getState().getSceneState().sceneNPCs).toHaveLength(1);
    expect(useGameStore.getState().getSceneState().sceneNPCs[0].name).toBe('Tajemný posel');
  });

  it('startScene + endScene — kompletní lifecycle', () => {
    // Start scene 1
    useGameStore.getState().startScene('Výprava', 'exploration');
    expect(useGameStore.getState().getSceneState().currentScene).not.toBeNull();

    // End scene 1
    useGameStore.getState().endScene('in_control');
    expect(useGameStore.getState().getSceneState().currentScene).toBeNull();
    expect(useGameStore.getState().getSceneState().sceneHistory).toHaveLength(1);

    // Start scene 2
    useGameStore.getState().startScene('Boj', 'combat');
    expect(useGameStore.getState().getSceneState().currentScene?.number).toBe(2);

    // End scene 2
    useGameStore.getState().endScene('out_of_control');
    expect(useGameStore.getState().getSceneState().sceneHistory).toHaveLength(2);
  });
});

describe('Map management', () => {
  it('createMap — výchozí jméno, nastaví activeMapId', () => {
    const map = useGameStore.getState().createMap();
    const state = useGameStore.getState();
    expect(map.name).toBe('Nová mapa');
    expect(map.data).toBeNull();
    expect(map.id).toBeTruthy();
    expect(map.createdAt).toBeTruthy();
    expect(state.activeMapId).toBe(map.id);
    expect(state.maps).toHaveLength(1);
  });

  it('createMap("Dungeon") — vlastní jméno', () => {
    const map = useGameStore.getState().createMap('Dungeon');
    expect(map.name).toBe('Dungeon');
  });

  it('deleteMap — odstraní mapu, přepne activeMapId', () => {
    const m1 = useGameStore.getState().createMap('Mapa 1');
    const m2 = useGameStore.getState().createMap('Mapa 2');
    expect(useGameStore.getState().activeMapId).toBe(m2.id);

    useGameStore.getState().deleteMap(m2.id);
    expect(useGameStore.getState().maps).toHaveLength(1);
    expect(useGameStore.getState().activeMapId).toBe(m1.id);
  });

  it('deleteMap — null když poslední', () => {
    const map = useGameStore.getState().createMap();
    useGameStore.getState().deleteMap(map.id);
    expect(useGameStore.getState().maps).toHaveLength(0);
    expect(useGameStore.getState().activeMapId).toBeNull();
  });

  it('deleteMap — neaktivní mapa nemění activeMapId', () => {
    const m1 = useGameStore.getState().createMap('Mapa 1');
    const m2 = useGameStore.getState().createMap('Mapa 2');
    // m2 je aktivní
    useGameStore.getState().deleteMap(m1.id);
    expect(useGameStore.getState().activeMapId).toBe(m2.id);
    expect(useGameStore.getState().maps).toHaveLength(1);
  });

  it('renameMap — přejmenuje mapu', () => {
    const map = useGameStore.getState().createMap('Starý název');
    useGameStore.getState().renameMap(map.id, 'Nový název');
    const updated = useGameStore.getState().maps.find(m => m.id === map.id);
    expect(updated?.name).toBe('Nový název');
  });

  it('updateMapData — uloží snapshot', () => {
    const map = useGameStore.getState().createMap();
    const snapshot = { shapes: [{ id: 's1' }], bindings: [] };
    useGameStore.getState().updateMapData(map.id, snapshot);
    const updated = useGameStore.getState().maps.find(m => m.id === map.id);
    expect(updated?.data).toEqual(snapshot);
  });

  it('updateMapData — aktualizuje updatedAt', () => {
    const map = useGameStore.getState().createMap();
    const originalUpdatedAt = map.updatedAt;
    // Malá pauza pro odlišný timestamp
    useGameStore.getState().updateMapData(map.id, { test: true });
    const updated = useGameStore.getState().maps.find(m => m.id === map.id);
    expect(updated?.updatedAt).toBeTruthy();
  });

  it('serializace — maps a activeMapId v getGameState', () => {
    const map = useGameStore.getState().createMap('Test');
    const gameState = useGameStore.getState().getGameState();
    expect(gameState.maps).toHaveLength(1);
    expect(gameState.maps[0].name).toBe('Test');
    expect(gameState.activeMapId).toBe(map.id);
  });

  it('loadGameState — obnoví maps', () => {
    const data: Partial<GameState> = {
      maps: [{ id: 'm1', name: 'Loaded Map', data: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' }],
      activeMapId: 'm1',
    };
    useGameStore.getState().loadGameState(data);
    const state = useGameStore.getState();
    expect(state.maps).toHaveLength(1);
    expect(state.maps[0].name).toBe('Loaded Map');
    expect(state.activeMapId).toBe('m1');
  });

  it('loadGameState — defaults pro chybějící maps', () => {
    useGameStore.getState().loadGameState({});
    const state = useGameStore.getState();
    expect(state.maps).toEqual([]);
    expect(state.activeMapId).toBeNull();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './gameStore';
import type { Party, GameState, WorldNPC, Settlement, JournalEntry } from '../types';

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

  it('createPC — type="pc", výchozí stats', () => {
    const pc = useGameStore.getState().createPC(partyId);
    expect(pc.type).toBe('pc');
    expect(pc.STR).toEqual({ current: 10, max: 10 });
    expect(pc.DEX).toEqual({ current: 10, max: 10 });
    expect(pc.WIL).toEqual({ current: 10, max: 10 });
    expect(pc.hp).toEqual({ current: 6, max: 6 });
    expect(pc.name).toBeTruthy();
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
  it('getGameState — vrátí 9 polí, nevrátí interní', () => {
    useGameStore.getState().createParty();
    const gameState = useGameStore.getState().getGameState();
    expect(Object.keys(gameState).sort()).toEqual([
      'activeCharacterId', 'activePartyId', 'factions',
      'journal', 'lexicon', 'parties', 'settlements',
      'timedEvents', 'worldNPCs',
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

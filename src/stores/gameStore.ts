import { create } from 'zustand';
import { generateId, formatTimestamp, rollD6, randomFrom } from '../utils/helpers';
import {
  FIRST_NAMES, LAST_NAMES, BIRTHSIGNS, PHYSICAL_DETAILS, HIRELING_TYPES
} from '../data/constants';
import type {
  Party, Character, PC, Hireling, GameTime, GameState,
  JournalEntry, Faction, Settlement, WorldNPC, TimedEvent, LexiconEntry
} from '../types';

interface CreatureData {
  name: string;
  type?: { name: string };
  personality?: string;
  appearance?: string;
  quirk?: string;
  goal?: string;
  secret?: string;
}

interface GameStoreState extends GameState {
  journalPartyFilter: string;

  // --- Derived ---
  getActiveParty: () => Party | null;
  getActiveCharacter: () => Character | null;

  // --- Setters ---
  setParties: (parties: Party[]) => void;
  setActivePartyId: (activePartyId: string | null) => void;
  setActiveCharacterId: (activeCharacterId: string | null) => void;
  setJournal: (journal: JournalEntry[]) => void;
  setFactions: (factions: Faction[]) => void;
  setSettlements: (settlements: Settlement[]) => void;
  setWorldNPCs: (worldNPCs: WorldNPC[]) => void;
  setTimedEvents: (timedEvents: TimedEvent[]) => void;
  setLexicon: (lexicon: LexiconEntry[]) => void;
  setJournalPartyFilter: (journalPartyFilter: string) => void;

  // --- Actions ---
  updateParty: (partyId: string, updates: Partial<Party>) => void;
  updateCharacterInParty: (partyId: string, charId: string, updates: Partial<Character>) => void;
  updateGameTime: (newGameTime: GameTime) => void;
  addParty: (party: Party) => void;
  removeParty: (partyId: string) => void;
  addCharacterToParty: (partyId: string, character: Character) => void;
  addHirelingsToParty: (partyId: string, hirelings: Hireling[]) => void;
  removeCharacter: (partyId: string, charId: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;

  // --- High-level actions ---
  handleLogEntry: (entry: Partial<JournalEntry>) => void;
  createParty: (name?: string) => Party;
  createPC: (partyId: string, characterData?: PC | null) => PC;
  createHireling: (partyId: string, hirelingTypeKey?: string | null) => Hireling;
  deleteNPC: (npcId: string) => void;
  deleteSettlement: (settlementId: string) => void;
  promoteToNPC: (creatureData: CreatureData) => WorldNPC;
  updateNPC: (npcId: string, updates: Partial<WorldNPC>) => WorldNPC | undefined;

  // --- Serialization ---
  getGameState: () => GameState;
  loadGameState: (data: Partial<GameState>) => void;
  applyRemoteState: (state: Partial<GameState> | null) => void;
}

// Game data store — persisted state (parties, journal, factions, settlements, NPCs, events, lexicon)
export const useGameStore = create<GameStoreState>((set, get) => ({
  // --- Data ---
  parties: [],
  activePartyId: null,
  activeCharacterId: null,
  journal: [],
  factions: [],
  settlements: [],
  worldNPCs: [],
  timedEvents: [],
  lexicon: [],
  journalPartyFilter: 'all',

  // --- Derived (computed via selectors, not stored) ---
  // Use: const activeParty = useGameStore(s => s.getActiveParty())

  getActiveParty: () => {
    const { parties, activePartyId } = get();
    return (parties || []).find(p => p.id === activePartyId) || null;
  },

  getActiveCharacter: () => {
    const party = get().getActiveParty();
    const { activeCharacterId } = get();
    return party?.members?.find(m => m.id === activeCharacterId) || null;
  },

  // --- Setters (simple) ---
  setParties: (parties) => set({ parties }),
  setActivePartyId: (activePartyId) => set({ activePartyId }),
  setActiveCharacterId: (activeCharacterId) => set({ activeCharacterId }),
  setJournal: (journal) => set({ journal }),
  setFactions: (factions) => set({ factions }),
  setSettlements: (settlements) => set({ settlements }),
  setWorldNPCs: (worldNPCs) => set({ worldNPCs }),
  setTimedEvents: (timedEvents) => set({ timedEvents }),
  setLexicon: (lexicon) => set({ lexicon }),
  setJournalPartyFilter: (journalPartyFilter) => set({ journalPartyFilter }),

  // --- Actions ---
  updateParty: (partyId, updates) => {
    set(s => ({
      parties: s.parties.map(p => p.id === partyId ? { ...p, ...updates } : p)
    }));
  },

  updateCharacterInParty: (partyId, charId, updates) => {
    set(s => ({
      parties: (s.parties || []).map(p => {
        if (p.id !== partyId) return p;
        return {
          ...p,
          members: (p.members || []).map(m => m.id === charId ? { ...m, ...updates } : m)
        };
      })
    }));
  },

  updateGameTime: (newGameTime) => {
    const { activePartyId } = get();
    if (!activePartyId) return;
    set(s => ({
      parties: (s.parties || []).map(p =>
        p.id === activePartyId ? { ...p, gameTime: newGameTime } : p
      )
    }));
  },

  addParty: (party) => {
    set(s => ({ parties: [...(s.parties || []), party] }));
  },

  removeParty: (partyId) => {
    const { activePartyId, parties } = get();
    set(s => ({
      parties: (s.parties || []).filter(p => p.id !== partyId),
      ...(activePartyId === partyId ? {
        activePartyId: (parties || []).filter(p => p.id !== partyId)[0]?.id || null,
        activeCharacterId: null,
      } : {})
    }));
  },

  addCharacterToParty: (partyId, character) => {
    set(s => ({
      parties: (s.parties || []).map(p => {
        if (p.id !== partyId) return p;
        return { ...p, members: [...(p.members || []), character] };
      })
    }));
  },

  addHirelingsToParty: (partyId, hirelings) => {
    if (!hirelings || hirelings.length === 0) return;
    set(s => ({
      parties: (s.parties || []).map(p => {
        if (p.id !== partyId) return p;
        return { ...p, members: [...(p.members || []), ...hirelings] };
      })
    }));
  },

  removeCharacter: (partyId, charId) => {
    const { activeCharacterId } = get();
    set(s => ({
      parties: (s.parties || []).map(p => {
        if (p.id !== partyId) return p;
        return { ...p, members: (p.members || []).filter(m => m.id !== charId) };
      }),
      ...(activeCharacterId === charId ? { activeCharacterId: null } : {})
    }));
  },

  addJournalEntry: (entry) => {
    set(s => ({ journal: [entry, ...s.journal] }));
  },

  // --- High-level actions (used by panels directly) ---

  handleLogEntry: (entry) => {
    const { activePartyId } = get();
    set(s => ({
      journal: [{
        ...entry,
        id: generateId(),
        partyId: activePartyId
      } as JournalEntry, ...s.journal]
    }));
  },

  createParty: (name = 'Nová družina') => {
    const newParty: Party = {
      id: generateId(),
      name,
      members: [],
      gameTime: { day: 1, season: 'spring', watch: 1, turn: 0, restedToday: false },
      createdAt: new Date().toISOString()
    };
    set(s => ({
      parties: [...(s.parties || []), newParty],
      activePartyId: newParty.id
    }));
    return newParty;
  },

  createPC: (partyId, characterData = null) => {
    const newChar: any = characterData || {
      id: generateId(),
      type: 'pc',
      name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
      pronouns: '',
      level: 1,
      STR: { current: 10, max: 10 },
      DEX: { current: 10, max: 10 },
      WIL: { current: 10, max: 10 },
      hp: { current: 6, max: 6 },
      pips: 0,
      xp: 0,
      birthsign: randomFrom(BIRTHSIGNS),
      physicalDetail: randomFrom(PHYSICAL_DETAILS),
      conditions: [],
      inventory: [],
      spells: []
    };
    if (!newChar.id) newChar.id = generateId();
    if (!newChar.type) newChar.type = 'pc';
    get().addCharacterToParty(partyId, newChar);
    return newChar;
  },

  createHireling: (partyId, hirelingTypeKey = null) => {
    const hirelingType = hirelingTypeKey
      ? HIRELING_TYPES.find(t => t.type === hirelingTypeKey)
      : null;
    const roll2k6 = () => rollD6() + rollD6();
    const str = roll2k6();
    const dex = roll2k6();
    const wil = roll2k6();
    const hp = rollD6();
    const newHireling: Hireling = {
      id: generateId(),
      type: 'hireling',
      hirelingType: hirelingType?.type || 'generic',
      name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
      STR: { current: str, max: str },
      DEX: { current: dex, max: dex },
      WIL: { current: wil, max: wil },
      hp: { current: hp, max: hp },
      cost: hirelingType?.cost || '1 ď',
      skill: hirelingType?.skill || null,
      inventorySlots: {
        strongPaw1: null, strongPaw2: null,
        weakPaw1: null, weakPaw2: null
      },
      physicalDetail: randomFrom(PHYSICAL_DETAILS)
    };
    get().addCharacterToParty(partyId, newHireling);
    return newHireling;
  },

  deleteNPC: (npcId) => {
    set(s => ({
      worldNPCs: (s.worldNPCs || []).filter(n => n.id !== npcId),
      settlements: (s.settlements || []).map(st => ({
        ...st,
        npcs: st.npcs?.filter(id => id !== npcId) || [],
        ruler: st.ruler === npcId ? null : st.ruler
      })),
      journal: (s.journal || []).filter(e => (e as any).npcId !== npcId && (e as any).data?.id !== npcId)
    }));
  },

  deleteSettlement: (settlementId) => {
    set(s => ({
      settlements: (s.settlements || []).filter(st => st.id !== settlementId),
      worldNPCs: (s.worldNPCs || []).map(n =>
        n.settlementId === settlementId ? { ...n, settlementId: null } : n
      ),
      journal: (s.journal || []).filter(e =>
        (e as any).settlementId !== settlementId && (e as any).data?.id !== settlementId
      )
    }));
  },

  promoteToNPC: (creatureData) => {
    const roll = () => Math.floor(Math.random() * 6) + 1;
    const newNPC: WorldNPC = {
      id: generateId(),
      name: creatureData.name,
      role: creatureData.type?.name || '',
      birthsign: creatureData.personality || '',
      physicalDetail: creatureData.appearance || '',
      quirk: creatureData.quirk || '',
      goal: creatureData.goal || '',
      notes: creatureData.secret ? `Tajemství: ${creatureData.secret}` : '',
      hp: { current: roll() + roll(), max: roll() + roll() },
      str: { current: roll() + roll() + roll(), max: roll() + roll() + roll() },
      dex: { current: roll() + roll() + roll(), max: roll() + roll() + roll() },
      wil: { current: roll() + roll() + roll(), max: roll() + roll() + roll() },
      settlementId: null,
      createdAt: new Date().toISOString()
    };
    set(s => ({
      worldNPCs: [...(s.worldNPCs || []), newNPC],
      journal: [{
        id: generateId(),
        type: 'saved_npc' as const,
        timestamp: formatTimestamp(),
        data: newNPC
      } as JournalEntry, ...s.journal]
    }));
    return newNPC;
  },

  updateNPC: (npcId, updates) => {
    set(s => ({
      worldNPCs: (s.worldNPCs || []).map(n => n.id === npcId ? { ...n, ...updates } : n)
    }));
    return get().worldNPCs.find(n => n.id === npcId);
  },

  // --- Serialization ---
  getGameState: () => {
    const { parties, activePartyId, activeCharacterId, journal,
      factions, settlements, worldNPCs, timedEvents, lexicon } = get();
    return {
      parties, activePartyId, activeCharacterId,
      journal, factions, settlements, worldNPCs, timedEvents, lexicon
    };
  },

  loadGameState: (data) => {
    set({
      parties: data.parties || [],
      activePartyId: data.activePartyId || null,
      activeCharacterId: data.activeCharacterId || null,
      journal: data.journal || [],
      factions: data.factions || [],
      settlements: data.settlements || [],
      worldNPCs: data.worldNPCs || [],
      timedEvents: data.timedEvents || [],
      lexicon: data.lexicon || [],
    });
  },

  // Apply state from Firebase (partial updates, skip own changes)
  applyRemoteState: (state) => {
    if (!state) return;
    const updates: Partial<GameState> = {};
    if (state.parties !== undefined) updates.parties = Array.isArray(state.parties) ? state.parties : [];
    if (state.activePartyId !== undefined) updates.activePartyId = state.activePartyId;
    if (state.activeCharacterId !== undefined) updates.activeCharacterId = state.activeCharacterId;
    if (state.journal) updates.journal = state.journal;
    if (state.factions) updates.factions = state.factions;
    if (state.settlements) updates.settlements = state.settlements;
    if (state.worldNPCs) updates.worldNPCs = state.worldNPCs;
    if (state.timedEvents) updates.timedEvents = state.timedEvents;
    if (state.lexicon) updates.lexicon = state.lexicon;
    set(updates);
  },
}));

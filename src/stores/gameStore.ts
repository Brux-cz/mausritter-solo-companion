import { create } from 'zustand';
import { generateId, formatTimestamp, rollD6, rollD10, randomFrom } from '../utils/helpers';
import {
  FIRST_NAMES, LAST_NAMES, BIRTHSIGNS, PHYSICAL_DETAILS, HIRELING_TYPES,
  ORIGINS, FUR_COLORS, FUR_PATTERNS, DISTINCTIVE_FEATURES,
  DEFAULT_SCENE_STATE, SCENE_ALTERATION_TABLE, INTERRUPTED_SCENE_FOCUS, SCENE_TYPE_LABELS
} from '../data/constants';
import type {
  Party, Character, PC, Hireling, GameTime, GameState,
  JournalEntry, Faction, Settlement, WorldNPC, WorldCreature, TimedEvent, LexiconEntry,
  SceneState, SceneType, SceneCheckResult, SceneOutcome, Scene, DungeonMap
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
  setWorldCreatures: (worldCreatures: WorldCreature[]) => void;
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
  propagateNameChange: (oldName: string, newName: string) => void;

  // --- Creature actions ---
  createCreature: (name?: string, lore?: Record<string, string>) => WorldCreature;
  updateCreature: (id: string, updates: Partial<WorldCreature>) => void;
  deleteCreature: (id: string) => void;

  // --- Scene actions ---
  getSceneState: () => SceneState;
  updateSceneState: (updates: Partial<SceneState>) => void;
  startScene: (title: string, type: SceneType) => { scene: Scene; checkResult: SceneCheckResult; alteration?: string; focus?: string };
  endScene: (outcome: SceneOutcome) => void;
  cancelScene: () => void;
  adjustChaosFactor: (delta: number) => void;
  addThread: (description: string) => void;
  removeThread: (threadId: string) => void;
  toggleThreadResolved: (threadId: string) => void;
  addSceneNPC: (name: string, worldNpcId?: string | null) => void;
  removeSceneNPC: (npcId: string) => void;

  // --- Map actions ---
  setMaps: (maps: DungeonMap[]) => void;
  setActiveMapId: (activeMapId: string | null) => void;
  createMap: (name?: string) => DungeonMap;
  deleteMap: (mapId: string) => void;
  renameMap: (mapId: string, name: string) => void;
  updateMapData: (mapId: string, data: Record<string, unknown> | null) => void;

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
  worldCreatures: [],
  timedEvents: [],
  lexicon: [],
  maps: [],
  activeMapId: null,
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
  setWorldCreatures: (worldCreatures) => set({ worldCreatures }),
  setTimedEvents: (timedEvents) => set({ timedEvents }),
  setLexicon: (lexicon) => set({ lexicon }),
  setMaps: (maps) => set({ maps }),
  setActiveMapId: (activeMapId) => set({ activeMapId }),
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
    let newChar: any = characterData;
    if (!newChar) {
      // Roll attributes: 3k6 keep two highest
      const roll3k6keep2 = () => {
        const rolls = [rollD6(), rollD6(), rollD6()].sort((a, b) => b - a);
        return rolls[0] + rolls[1];
      };
      const str = roll3k6keep2();
      const dex = roll3k6keep2();
      const wil = roll3k6keep2();
      const hp = rollD6();
      const pips = rollD6();

      // Origin lookup (HP × Pips table)
      const originKey = `${hp}-${pips}`;
      const origin = (ORIGINS as any)[originKey] || ORIGINS['1-1'];

      // Physical details
      const furColor = randomFrom(FUR_COLORS);
      const furPattern = randomFrom(FUR_PATTERNS);
      const featureKey = `${rollD6()}-${rollD6()}`;
      const distinctiveFeature = (DISTINCTIVE_FEATURES as any)[featureKey] || 'Běžný vzhled';
      const birthsign = randomFrom(BIRTHSIGNS);

      // Bonus items: maxAttr ≤9 → 1 bonus item; ≤7 → 2 bonus items
      const maxAttr = Math.max(str, dex, wil);
      const bonusItemCount = maxAttr <= 7 ? 2 : maxAttr <= 9 ? 1 : 0;

      newChar = {
        id: generateId(),
        type: 'pc',
        name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
        pronouns: '',
        level: 1,
        STR: { current: str, max: str },
        DEX: { current: dex, max: dex },
        WIL: { current: wil, max: wil },
        hp: { current: hp, max: hp },
        pips,
        xp: 0,
        origin,
        birthsign,
        fur: { color: furColor, pattern: furPattern },
        distinctiveFeature,
        physicalDetail: distinctiveFeature,
        bonusItemCount,
        conditions: [],
        inventory: [
          { id: generateId(), name: 'Zásoby', slots: 1, usageDots: 0, maxUsage: 3 },
          { id: generateId(), name: 'Pochodně', slots: 1, usageDots: 0, maxUsage: 3 },
          { id: generateId(), name: origin.itemA, slots: 1, usageDots: 0, maxUsage: 3 },
          { id: generateId(), name: origin.itemB, slots: 1, usageDots: 0, maxUsage: 3 },
        ],
        spells: []
      };
    }
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

  propagateNameChange: (oldName, newName) => {
    if (!oldName || !newName || oldName === newName || !oldName.trim() || !newName.trim()) return;

    set(s => ({
      // 1. Journal entries
      journal: s.journal.map(entry => {
        let updated = { ...entry } as any;
        let changed = false;

        // Exact match on structured fields
        for (const field of ['attacker', 'target', 'character', 'faction', 'hireling', 'npcName', 'settlementName']) {
          if (updated[field] === oldName) {
            updated[field] = newName;
            changed = true;
          }
        }

        // data object fields
        if (updated.data) {
          const newData = { ...updated.data };
          let dc = false;
          if (newData.name === oldName) { newData.name = newName; dc = true; }
          if (newData.npc === oldName) { newData.npc = newName; dc = true; }
          if (newData.settlement === oldName) { newData.settlement = newName; dc = true; }
          if (dc) { updated.data = newData; changed = true; }
        }

        // content string - interpolated names in narrative text
        if (typeof updated.content === 'string' && updated.content.includes(oldName)) {
          updated.content = updated.content.replaceAll(oldName, newName);
          changed = true;
        }

        return changed ? updated : entry;
      }),

      // 2. Lexicon
      lexicon: s.lexicon.map(item =>
        item.name === oldName ? { ...item, name: newName } : item
      ),

      // 3. SceneNPCs in parties
      parties: s.parties.map(p => {
        if (!p.sceneState?.sceneNPCs) return p;
        const hasMatch = p.sceneState.sceneNPCs.some(sn => sn.name === oldName);
        if (!hasMatch) return p;
        return {
          ...p,
          sceneState: {
            ...p.sceneState,
            sceneNPCs: p.sceneState.sceneNPCs.map(sn =>
              sn.name === oldName ? { ...sn, name: newName } : sn
            )
          }
        };
      })
    }));
  },

  // --- Creature actions ---

  createCreature: (name = 'Nový tvor', lore = {}) => {
    const creature: WorldCreature = {
      id: generateId(),
      name,
      lore,
      notes: '',
      createdAt: new Date().toISOString(),
    };
    set(s => ({ worldCreatures: [...(s.worldCreatures || []), creature] }));
    return creature;
  },

  updateCreature: (id, updates) => {
    set(s => ({
      worldCreatures: (s.worldCreatures || []).map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  },

  deleteCreature: (id) => {
    set(s => ({
      worldCreatures: (s.worldCreatures || []).filter(c => c.id !== id)
    }));
  },

  // --- Map actions ---

  createMap: (name = 'Nová mapa') => {
    const newMap: DungeonMap = {
      id: generateId(),
      name,
      data: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set(s => ({
      maps: [...(s.maps || []), newMap],
      activeMapId: newMap.id
    }));
    return newMap;
  },

  deleteMap: (mapId) => {
    const { activeMapId, maps } = get();
    const remaining = (maps || []).filter(m => m.id !== mapId);
    set({
      maps: remaining,
      activeMapId: activeMapId === mapId
        ? (remaining[0]?.id || null)
        : activeMapId
    });
  },

  renameMap: (mapId, name) => {
    set(s => ({
      maps: (s.maps || []).map(m =>
        m.id === mapId ? { ...m, name, updatedAt: new Date().toISOString() } : m
      )
    }));
  },

  updateMapData: (mapId, data) => {
    set(s => ({
      maps: (s.maps || []).map(m =>
        m.id === mapId ? { ...m, data, updatedAt: new Date().toISOString() } : m
      )
    }));
  },

  // --- Scene actions ---

  getSceneState: () => {
    const party = get().getActiveParty();
    return party?.sceneState || { ...DEFAULT_SCENE_STATE };
  },

  updateSceneState: (updates) => {
    const { activePartyId } = get();
    if (!activePartyId) return;
    set(s => ({
      parties: (s.parties || []).map(p => {
        if (p.id !== activePartyId) return p;
        const currentScene = p.sceneState || { ...DEFAULT_SCENE_STATE };
        return { ...p, sceneState: { ...currentScene, ...updates } };
      })
    }));
  },

  startScene: (title, type) => {
    const sceneState = get().getSceneState();
    const cf = sceneState.chaosFactor;
    const die = rollD10();

    let checkResult: SceneCheckResult = 'normal';
    let alteration: string | undefined;
    let focus: string | undefined;

    if (die <= cf) {
      if (die % 2 === 1) {
        checkResult = 'altered';
        alteration = randomFrom(SCENE_ALTERATION_TABLE);
      } else {
        checkResult = 'interrupted';
        focus = randomFrom(INTERRUPTED_SCENE_FOCUS);
      }
    }

    const newScene: Scene = {
      id: generateId(),
      number: sceneState.sceneCount + 1,
      title,
      type,
      checkResult,
      checkDie: die,
      chaosAtStart: cf,
      startedAt: new Date().toISOString()
    };

    get().updateSceneState({
      currentScene: newScene,
      sceneCount: sceneState.sceneCount + 1
    });

    const checkLabels: Record<SceneCheckResult, string> = {
      normal: 'Normalni',
      altered: 'Pozmenena',
      interrupted: 'Prerusena'
    };
    let content = `Scena #${newScene.number}: ${title} (${SCENE_TYPE_LABELS[type] || type})`;
    content += ` | Check: [${die}] vs CF ${cf} = ${checkLabels[checkResult]}`;
    if (alteration) content += ` | ${alteration}`;
    if (focus) content += ` | ${focus}`;

    get().handleLogEntry({
      type: 'scene_start',
      timestamp: formatTimestamp(),
      sceneNumber: newScene.number,
      sceneTitle: title,
      sceneType: type,
      checkResult,
      checkDie: die,
      chaosFactor: cf,
      content
    } as any);

    return { scene: newScene, checkResult, alteration, focus };
  },

  endScene: (outcome) => {
    const sceneState = get().getSceneState();
    if (!sceneState.currentScene) return;

    const scene = sceneState.currentScene;
    const cfBefore = sceneState.chaosFactor;
    const delta = outcome === 'in_control' ? -1 : 1;
    const cfAfter = Math.max(1, Math.min(9, cfBefore + delta));

    const endedScene: Scene = {
      ...scene,
      outcome,
      endedAt: new Date().toISOString()
    };

    get().updateSceneState({
      currentScene: null,
      chaosFactor: cfAfter,
      sceneHistory: [...sceneState.sceneHistory, endedScene]
    });

    const outcomeLabel = outcome === 'in_control' ? 'Pod kontrolou' : 'Mimo kontrolu';
    const content = `Scena #${scene.number} ukoncena: ${outcomeLabel} | Chaos: ${cfBefore} → ${cfAfter}`;

    get().handleLogEntry({
      type: 'scene_end',
      timestamp: formatTimestamp(),
      sceneNumber: scene.number,
      sceneTitle: scene.title,
      outcome,
      chaosChange: delta,
      chaosBefore: cfBefore,
      chaosAfter: cfAfter,
      content
    } as any);
  },

  cancelScene: () => {
    const sceneState = get().getSceneState();
    if (!sceneState.currentScene) return;
    const sceneNumber = sceneState.currentScene.number;
    // Smaž scene_start entry a vše co přišlo po něm (patří k této scéně)
    const journal = get().journal;
    const sceneStartIdx = journal.findIndex(e => e.type === 'scene_start' && (e as any).sceneNumber === sceneNumber);
    const newJournal = sceneStartIdx >= 0 ? journal.slice(0, sceneStartIdx) : journal;
    set({ journal: newJournal });
    get().updateSceneState({ currentScene: null, sceneCount: sceneState.sceneCount - 1 });
  },

  adjustChaosFactor: (delta) => {
    const sceneState = get().getSceneState();
    const cfBefore = sceneState.chaosFactor;
    const cfAfter = Math.max(1, Math.min(9, cfBefore + delta));
    if (cfBefore === cfAfter) return;

    get().updateSceneState({ chaosFactor: cfAfter });

    get().handleLogEntry({
      type: 'chaos_adjust',
      timestamp: formatTimestamp(),
      chaosBefore: cfBefore,
      chaosAfter: cfAfter,
      content: `Chaos: ${cfBefore} → ${cfAfter}`
    } as any);
  },

  addThread: (description) => {
    const sceneState = get().getSceneState();
    const newThread = { id: generateId(), description, resolved: false };
    get().updateSceneState({
      threads: [...sceneState.threads, newThread]
    });
  },

  removeThread: (threadId) => {
    const sceneState = get().getSceneState();
    get().updateSceneState({
      threads: sceneState.threads.filter(t => t.id !== threadId)
    });
  },

  toggleThreadResolved: (threadId) => {
    const sceneState = get().getSceneState();
    get().updateSceneState({
      threads: sceneState.threads.map(t =>
        t.id === threadId ? { ...t, resolved: !t.resolved } : t
      )
    });
  },

  addSceneNPC: (name, worldNpcId = null) => {
    const sceneState = get().getSceneState();
    const newNPC = { id: generateId(), name, worldNpcId: worldNpcId || null };
    get().updateSceneState({
      sceneNPCs: [...sceneState.sceneNPCs, newNPC]
    });
  },

  removeSceneNPC: (npcId) => {
    const sceneState = get().getSceneState();
    get().updateSceneState({
      sceneNPCs: sceneState.sceneNPCs.filter(n => n.id !== npcId)
    });
  },

  // --- Serialization ---
  getGameState: () => {
    const { parties, activePartyId, activeCharacterId, journal,
      factions, settlements, worldNPCs, worldCreatures, timedEvents, lexicon,
      maps, activeMapId } = get();
    return {
      parties, activePartyId, activeCharacterId,
      journal, factions, settlements, worldNPCs, worldCreatures, timedEvents, lexicon,
      maps, activeMapId
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
      worldCreatures: data.worldCreatures || [],
      timedEvents: data.timedEvents || [],
      lexicon: data.lexicon || [],
      maps: data.maps || [],
      activeMapId: data.activeMapId || null,
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
    if (state.worldCreatures) updates.worldCreatures = state.worldCreatures;
    if (state.timedEvents) updates.timedEvents = state.timedEvents;
    if (state.lexicon) updates.lexicon = state.lexicon;
    if (state.maps) updates.maps = state.maps;
    if (state.activeMapId !== undefined) updates.activeMapId = state.activeMapId;
    set(updates);
  },
}));

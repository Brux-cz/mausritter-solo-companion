// ============================================
// MAIN GAME DATA TYPES
// ============================================

// --- Primitive patterns ---

export interface AbilityStat {
  current: number;
  max: number;
}

// --- Inventory ---

export interface InventoryItem {
  id: string;
  name: string;
  type?: 'item' | 'weapon' | 'armor' | 'condition' | 'spell';
  slots?: number;
  width?: number;
  height?: number;
  usageDots: number;
  maxUsage: number;
  isWeapon?: boolean;
  isCondition?: boolean;
  conditionId?: string;
  damage?: string;
  damageDef?: string;
  defense?: string;
  weaponClass?: string;
  mechanic?: string;
  clear?: string;
  bgColor?: string;
  icon?: string;
}

export interface PCInventorySlots {
  mainPaw: InventoryItem | null;
  offPaw: InventoryItem | null;
  body1: InventoryItem | null;
  body2: InventoryItem | null;
  pack1: InventoryItem | null;
  pack2: InventoryItem | null;
  pack3: InventoryItem | null;
  pack4: InventoryItem | null;
  pack5: InventoryItem | null;
  pack6: InventoryItem | null;
  grit1?: InventoryItem | null;  // Kuráž slot 1 (level 2+)
  grit2?: InventoryItem | null;  // Kuráž slot 2 (level 4+)
  grit3?: InventoryItem | null;  // Kuráž slot 3 (level 5+)
  [key: string]: InventoryItem | null | undefined;
}

export interface HirelingInventorySlots {
  strongPaw1: InventoryItem | null;
  strongPaw2: InventoryItem | null;
  weakPaw1: InventoryItem | null;
  weakPaw2: InventoryItem | null;
  [key: string]: InventoryItem | null;
}

// --- Characters ---

export interface PC {
  id: string;
  type: 'pc';
  name: string;
  pronouns?: string;
  gender?: 'male' | 'female';
  level: number;
  STR: AbilityStat;
  DEX: AbilityStat;
  WIL: AbilityStat;
  hp: AbilityStat;
  pips: number;
  xp: number;
  birthsign: string;
  physicalDetail: string;
  background?: string;
  origin?: {
    name: string;
    itemA: string;
    itemB: string;
  };
  fur?: {
    color: string;
    pattern: string;
  };
  distinctiveFeature?: string;
  conditions: string[];
  inventory: InventoryItem[];
  inventorySlots?: PCInventorySlots;
  spells: string[];
  bonusItemCount?: number;
  selectedWeaponIndex?: number;
  createdAt?: string;
}

export interface Hireling {
  id: string;
  type: 'hireling';
  hirelingType: string;
  name: string;
  STR: AbilityStat;
  DEX: AbilityStat;
  WIL: AbilityStat;
  hp: AbilityStat;
  cost: string;
  skill: string | null;
  inventorySlots: HirelingInventorySlots;
  physicalDetail: string;
}

export type Character = PC | Hireling;

// --- Game Time ---

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeContext = 'wilderness' | 'settlement' | 'dungeon';

export interface Weather {
  type: string;
  roll: number;
  dice: [number, number];
  icon: string;
  danger: boolean;
  travelMod: number;
  effect: string | null;
}

export interface GameTime {
  day: number;
  season: Season;
  watch: number;
  turn: number;
  restedToday: boolean;
  context?: TimeContext;
  weather?: Weather | null;
}

// --- Scenes (Mythic GME style) ---

export type SceneType = 'combat' | 'exploration' | 'social' | 'rest' | 'other';
export type SceneCheckResult = 'normal' | 'altered' | 'interrupted';
export type SceneOutcome = 'in_control' | 'out_of_control';

export interface SceneThread {
  id: string;
  description: string;
  resolved: boolean;
}

export interface SceneNPC {
  id: string;
  name: string;
  worldNpcId?: string | null;
}

export interface Scene {
  id: string;
  number: number;
  title: string;
  type: SceneType;
  checkResult: SceneCheckResult;
  checkDie: number;
  chaosAtStart: number;
  outcome?: SceneOutcome;
  startedAt: string;
  endedAt?: string;
}

export interface SceneState {
  chaosFactor: number;
  currentScene: Scene | null;
  sceneHistory: Scene[];
  threads: SceneThread[];
  sceneNPCs: SceneNPC[];
  sceneCount: number;
}

// --- Party ---

export interface TreasuryItem {
  id: string;
  name: string;
  amount: number;
}

export interface Party {
  id: string;
  name: string;
  members: Character[];
  gameTime: GameTime;
  createdAt: string;
  treasuryItems?: TreasuryItem[];
  sceneState?: SceneState;
}

// --- World ---

export interface WorldNPC {
  id: string;
  name: string;
  role?: string;
  birthsign?: string;
  physicalDetail?: string;
  quirk?: string;
  goal?: string;
  reaction?: number;
  notes?: string;
  hp: AbilityStat;
  str: AbilityStat;
  dex: AbilityStat;
  wil: AbilityStat;
  settlementId: string | null;
  createdAt?: string;
}

export interface SettlementInn {
  name: string;
  specialty: string;
}

export interface Settlement {
  id: string;
  name: string;
  size: string;
  population?: string;
  governance?: string;
  trades?: string[];
  event?: string;
  landmark?: string;
  feature?: string;
  inn?: SettlementInn | null;
  ruler: string | null;
  notes: string;
  npcs: string[];
  rolls?: {
    size: [number, number];
    sizeResult: number;
  };
}

// --- Factions ---

export interface FactionGoal {
  id: string;
  description: string;
  progress: number;
  maxProgress: number;
}

export interface Faction {
  id: string;
  name: string;
  type: string;
  leader?: string;
  base?: string;
  trait?: string;
  resources: string[];
  goals: FactionGoal[];
  relationships?: Array<{ factionId: string; type: string }>;
}

// --- Events ---

export interface TimedEvent {
  id: string;
  title: string;
  targetDay: number;
  notes: string;
  completed: boolean;
  createdDay: number;
}

// --- Lexicon ---

export type LexiconCategory = 'lokace' | 'npc' | 'stvoreni' | 'predmet' | 'frakce' | 'pravidlo' | 'udalost';

export interface LexiconEntry {
  id: string;
  name: string;
  category: LexiconCategory;
  description: string;
  imageData: string | null;
  createdAt: string;
  sourceEntryId: string | null;
}

// --- Journal ---

export interface BaseJournalEntry {
  id: string;
  timestamp: string;
  partyId?: string | null;
  authorId?: string | null;
  authorName?: string | null;
  edited?: boolean;
  note?: string;
}

export interface NarrativeEntry extends BaseJournalEntry {
  type: 'narrative';
  content: string;
  isAnnotation?: boolean;
}

export interface CharacterCreatedEntry extends BaseJournalEntry {
  type: 'character_created';
  character: string;
}

export interface SavedNPCEntry extends BaseJournalEntry {
  type: 'saved_npc';
  npcId?: string;
  data: WorldNPC;
}

export interface SavedSettlementEntry extends BaseJournalEntry {
  type: 'saved_settlement';
  settlementId?: string;
  data: Settlement;
}

export interface DiscoveryEntry extends BaseJournalEntry {
  type: 'discovery';
  subtype: 'creature' | 'dungeon';
  data: Record<string, unknown>;
}

export interface WorldEventEntry extends BaseJournalEntry {
  type: 'world_event';
  subtype: 'npc_behavior' | 'npc_event' | 'settlement_event' | 'settlement_rumor' | 'weather';
  npcId?: string;
  npcName?: string;
  settlementId?: string;
  settlementName?: string;
  content: string;
  data: Record<string, unknown>;
}

export interface FactionProgressEntry extends BaseJournalEntry {
  type: 'faction_progress';
  faction: string;
  roll: number;
  bonus: number;
  total: number;
  success: boolean;
}

export interface TreasuryEntry extends BaseJournalEntry {
  type: 'treasury';
  subtype: 'payment';
  description: string;
}

export interface OracleEntry extends BaseJournalEntry {
  type: 'oracle';
  subtype: string;
  result: string;
}

export interface SceneStartEntry extends BaseJournalEntry {
  type: 'scene_start';
  sceneNumber: number;
  sceneTitle: string;
  sceneType: SceneType;
  checkResult: SceneCheckResult;
  checkDie: number;
  chaosFactor: number;
  content: string;
}

export interface SceneEndEntry extends BaseJournalEntry {
  type: 'scene_end';
  sceneNumber: number;
  sceneTitle: string;
  outcome: SceneOutcome;
  chaosChange: number;
  chaosBefore: number;
  chaosAfter: number;
  content: string;
}

export interface ChaosAdjustEntry extends BaseJournalEntry {
  type: 'chaos_adjust';
  chaosBefore: number;
  chaosAfter: number;
  content: string;
}

export interface HookEntry extends BaseJournalEntry {
  type: 'hook';
  content: string;
  resolved: boolean;
}

export type JournalEntry =
  | NarrativeEntry
  | HookEntry
  | CharacterCreatedEntry
  | SavedNPCEntry
  | SavedSettlementEntry
  | DiscoveryEntry
  | WorldEventEntry
  | FactionProgressEntry
  | TreasuryEntry
  | OracleEntry
  | SceneStartEntry
  | SceneEndEntry
  | ChaosAdjustEntry
  | (BaseJournalEntry & { type: string; [key: string]: unknown });

// --- Maps ---

export interface DungeonMap {
  id: string;
  name: string;
  data: Record<string, unknown> | null; // tldraw document snapshot
  createdAt: string;
  updatedAt: string;
}

// --- Game State ---

export interface GameState {
  parties: Party[];
  activePartyId: string | null;
  activeCharacterId: string | null;
  journal: JournalEntry[];
  factions: Faction[];
  settlements: Settlement[];
  worldNPCs: WorldNPC[];
  timedEvents: TimedEvent[];
  lexicon: LexiconEntry[];
  maps: DungeonMap[];
  activeMapId: string | null;
}

export interface SaveData extends GameState {
  version?: number;
  savedAt?: string;
}

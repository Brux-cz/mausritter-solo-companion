import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { WEATHER_TABLE, CREATURE_CATEGORIES, BESTIARY, LANDMARKS, SETTLEMENT_FEATURES, SETTLEMENT_SIZES, SETTLEMENT_GOVERNANCE, SETTLEMENT_TRADES, SETTLEMENT_EVENTS, SETTLEMENT_NAME_STARTS, SETTLEMENT_NAME_ENDS, INN_NAME_FIRST, INN_NAME_SECOND, INN_SPECIALTIES, MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, FAMILY_NAMES, BIRTHSIGNS, NPC_BEHAVIOR_MOODS, NPC_BEHAVIOR_ACTIONS, NPC_BEHAVIOR_MOTIVATIONS, NPC_SECRETS, NPC_REACTIONS, NPC_ROLES, EVENT_FOCUS, EVENT_ACTIONS, EVENT_SUBJECTS, EVENT_COMPLICATIONS, SETTLEMENT_RUMORS, SETTLEMENT_HAPPENINGS, PHYSICAL_DETAILS, NPC_QUIRKS, NPC_GOALS, DUNGEON_THEMES, DUNGEON_DENIZENS } from '../../data/constants';
import { rollDice, rollD6, roll2D6, randomFrom, generateId, formatTimestamp } from '../../utils/helpers';
import { DiceDisplay, SectionHeader, ResultCard, Button, HelpHeader, Input, Select, TabNav } from '../ui/common';
import { WEATHER_EFFECTS } from './TimePanel';

const WorldPanel = () => {
  const {
    settlements, setSettlements, worldNPCs, setWorldNPCs,
    parties, activePartyId, getActiveParty, updateParty,
    handleLogEntry, deleteNPC, deleteSettlement, propagateNameChange,
  } = useGameStore();
  const { pendingMentionOpen, setPendingMentionOpen } = useUIStore();
  const activeParty = getActiveParty();
  const onLogEntry = handleLogEntry;
  const [generated, setGenerated] = useState(null);
  const [activeGen, setActiveGen] = useState('mySettlements');
  const [season, setSeason] = useState('spring');
  const [creatureCategory, setCreatureCategory] = useState('all');
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [editingSettlement, setEditingSettlement] = useState(null);
  const [editingNPC, setEditingNPC] = useState(null);
  const [viewingSettlement, setViewingSettlement] = useState(null);
  const [expandedNPCs, setExpandedNPCs] = useState({});
  const [npcBehaviors, setNpcBehaviors] = useState({});
  const [settlementEvents, setSettlementEvents] = useState({}); // Pro zobrazení událostí osad
  const [npcSearch, setNpcSearch] = useState('');
  const [npcSettlementFilter, setNpcSettlementFilter] = useState<string | null>(null); // null = všechny, 'homeless' = bez domova, string = settlementId
  const [showDeadNPCs, setShowDeadNPCs] = useState(false);

  const filteredNPCs = useMemo(() => {
    let result = worldNPCs;
    if (!showDeadNPCs) {
      result = result.filter(npc => !(npc as any).isDead);
    }
    if (npcSettlementFilter === 'homeless') {
      result = result.filter(npc => !npc.settlementId);
    } else if (npcSettlementFilter) {
      result = result.filter(npc => npc.settlementId === npcSettlementFilter);
    }
    if (npcSearch.trim()) {
      const q = npcSearch.trim().toLowerCase();
      result = result.filter(npc =>
        npc.name?.toLowerCase().includes(q) ||
        npc.role?.toLowerCase().includes(q) ||
        npc.notes?.toLowerCase().includes(q) ||
        npc.quirk?.toLowerCase().includes(q) ||
        npc.goal?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [worldNPCs, npcSearch, npcSettlementFilter, showDeadNPCs]);

  // Handle pending mention open from journal
  useEffect(() => {
    if (pendingMentionOpen) {
      if (pendingMentionOpen.type === 'npc') {
        setActiveGen('myNPCs');
        setEditingNPC(pendingMentionOpen.id);
      } else if (pendingMentionOpen.type === 'settlement') {
        setActiveGen('mySettlements');
        setEditingSettlement(pendingMentionOpen.id);
      }
      setPendingMentionOpen(null);
    }
  }, [pendingMentionOpen, setPendingMentionOpen]);

  // ========== SETTLEMENT MANAGEMENT ==========
  const createEmptySettlement = () => {
    const newSettlement = {
      id: generateId(),
      name: 'Nová osada',
      size: 'Osada',
      population: '',
      landmark: '',
      feature: '',
      event: '',
      ruler: null, // NPC id
      notes: '',
      npcs: [] // NPC ids
    };
    setSettlements([...settlements, newSettlement]);
    setEditingSettlement(newSettlement.id);
  };

  const saveSettlementToWorld = (settlementData) => {
    const newSettlement = {
      id: generateId(),
      ...settlementData,
      npcs: []
    };
    setSettlements([...settlements, newSettlement]);
    // Log to journal
    if (onLogEntry) {
      onLogEntry({
        type: 'saved_settlement',
        settlementId: newSettlement.id,
        data: newSettlement
      });
    }
    setGenerated(null);
  };

  const updateSettlement = (id, updates) => {
    setSettlements(settlements.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // deleteSettlement is imported from gameStore (handles settlements, NPCs, and journal cleanup)

  // ========== NPC MANAGEMENT ==========
  const createEmptyNPC = (settlementId = null) => {
    // Staty pomocníka podle pravidel: k6 BO, 2k6 síla/mrštnost/vůle
    const hp = rollDice(1, 6)[0];
    const str = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const dex = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const wil = rollDice(2, 6).reduce((a, b) => a + b, 0);

    const newNPC = {
      id: generateId(),
      name: 'Nová postava',
      birthsign: '',
      physicalDetail: '',
      quirk: '',
      goal: '',
      role: '',
      settlementId,
      notes: '',
      hp: { current: hp, max: hp },
      str: { current: str, max: str },
      dex: { current: dex, max: dex },
      wil: { current: wil, max: wil }
    };
    setWorldNPCs([...worldNPCs, newNPC]);
    setEditingNPC(newNPC.id);
    return newNPC;
  };

  const saveNPCToWorld = (npcData, settlementId = null) => {
    const newNPC = {
      id: generateId(),
      ...npcData,
      settlementId
    };
    setWorldNPCs([...worldNPCs, newNPC]);
    if (settlementId) {
      updateSettlement(settlementId, {
        npcs: [...(settlements.find(s => s.id === settlementId)?.npcs || []), newNPC.id]
      });
    }
    // Log to journal
    if (onLogEntry) {
      onLogEntry({
        type: 'saved_npc',
        npcId: newNPC.id,
        data: newNPC
      });
    }
    setGenerated(null);
  };

  const updateNPC = (id, updates) => {
    setWorldNPCs(worldNPCs.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  // deleteNPC is imported from gameStore (handles NPCs, settlements, and journal cleanup)

  const generateNPCBehavior = (npcId) => {
    const npc = worldNPCs.find(n => n.id === npcId);
    const mood = randomFrom(NPC_BEHAVIOR_MOODS);
    const action = randomFrom(NPC_BEHAVIOR_ACTIONS);
    const motivation = randomFrom(NPC_BEHAVIOR_MOTIVATIONS);
    const behavior = `🎭 Chová se ${mood}, ${action}, protože ${motivation}.`;
    setNpcBehaviors({ ...npcBehaviors, [npcId]: behavior });

    // Zápis do deníku
    if (npc) {
      onLogEntry({
        type: 'world_event',
        subtype: 'npc_behavior',
        timestamp: formatTimestamp(),
        npcId: npc.id,
        npcName: npc.name,
        content: `**${npc.name}:** ${behavior}`,
        data: { npc: npc.name, mood, action, motivation }
      });
    }
  };

  const generateNPCMood = (npcId) => {
    const mood = randomFrom(NPC_BEHAVIOR_MOODS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `😊 Nálada: ${mood}` });
  };

  const generateNPCAction = (npcId) => {
    const action = randomFrom(NPC_BEHAVIOR_ACTIONS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `🏃 Právě teď: ${action}` });
  };

  const generateNPCMotivation = (npcId) => {
    const motivation = randomFrom(NPC_BEHAVIOR_MOTIVATIONS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `💭 Motivace: ${motivation}` });
  };

  const generateNPCSecret = (npcId) => {
    const secret = randomFrom(NPC_SECRETS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `🤫 Tajemství: ${secret}` });
  };

  const generateNPCReaction = (npcId) => {
    const reaction = randomFrom(NPC_REACTIONS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `⚡ Reakce: ${reaction}` });
  };

  const generateNPCRole = (npcId) => {
    const role = randomFrom(NPC_ROLES);
    updateNPC(npcId, { role });
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `🔧 Povolání: ${role}` });
  };

  // Generátor události pro konkrétní NPC (propojení s Event Generator tabulkami)
  const generateNPCEvent = (npcId) => {
    const npc = worldNPCs.find(n => n.id === npcId);
    if (!npc) return;

    const settlement = settlements.find(s => s.id === npc.settlementId);
    const focus = randomFrom(EVENT_FOCUS);
    const action = randomFrom(EVENT_ACTIONS);
    const subject = randomFrom(EVENT_SUBJECTS);
    const complication = Math.random() > 0.7 ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = `⚡ **${npc.name}**`;
    if (npc.role) narrative += ` (${npc.role})`;
    if (settlement) narrative += ` z **${settlement.name}**`;
    narrative += `\n\n`;
    narrative += `**${focus.label}:** ${focus.description}\n`;
    narrative += `🎯 ${action} ${subject}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    setNpcBehaviors({ ...npcBehaviors, [npcId]: narrative });

    // Zápis do deníku
    onLogEntry({
      type: 'world_event',
      subtype: 'npc_event',
      timestamp: formatTimestamp(),
      npcId: npc.id,
      npcName: npc.name,
      settlementId: settlement?.id,
      settlementName: settlement?.name,
      content: narrative,
      data: {
        npc: npc.name,
        role: npc.role,
        settlement: settlement?.name,
        focus: focus.label,
        action,
        subject,
        complication
      }
    });
  };

  // Generátor události pro konkrétní osadu
  const generateSettlementEvent = (settlementId) => {
    const settlement = settlements.find(s => s.id === settlementId);
    if (!settlement) return;

    const happening = randomFrom(SETTLEMENT_HAPPENINGS);
    const complication = Math.random() > 0.7 ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = `🏘️ **${settlement.name}**\n\n`;
    narrative += `${happening}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    // Uložit pro zobrazení v UI
    setSettlementEvents({ ...settlementEvents, [settlementId]: narrative });

    // Zápis do deníku
    onLogEntry({
      type: 'world_event',
      subtype: 'settlement_event',
      timestamp: formatTimestamp(),
      settlementId: settlement.id,
      settlementName: settlement.name,
      content: narrative,
      data: {
        settlement: settlement.name,
        happening,
        complication
      }
    });
  };

  // Generátor zvěsti pro konkrétní osadu
  const generateSettlementRumor = (settlementId) => {
    const settlement = settlements.find(s => s.id === settlementId);
    if (!settlement) return;

    const rumor = randomFrom(SETTLEMENT_RUMORS);

    const narrative = `💬 **Zvěst z ${settlement.name}:**\n\n"${rumor}"`;

    // Uložit pro zobrazení v UI
    setSettlementEvents({ ...settlementEvents, [settlementId]: narrative });

    // Zápis do deníku
    onLogEntry({
      type: 'world_event',
      subtype: 'settlement_rumor',
      timestamp: formatTimestamp(),
      settlementId: settlement.id,
      settlementName: settlement.name,
      content: narrative,
      data: {
        settlement: settlement.name,
        rumor
      }
    });
  };

  const assignNPCToSettlement = (npcId, settlementId) => {
    // Remove from old settlement
    const oldNPC = worldNPCs.find(n => n.id === npcId);
    if (oldNPC?.settlementId) {
      const oldSettlement = settlements.find(s => s.id === oldNPC.settlementId);
      if (oldSettlement) {
        updateSettlement(oldSettlement.id, { 
          npcs: oldSettlement.npcs?.filter(id => id !== npcId) || [] 
        });
      }
    }
    // Add to new settlement
    if (settlementId) {
      const newSettlement = settlements.find(s => s.id === settlementId);
      if (newSettlement) {
        updateSettlement(settlementId, { 
          npcs: [...(newSettlement.npcs || []), npcId] 
        });
      }
    }
    // Update NPC
    updateNPC(npcId, { settlementId });
  };

  // Generate random creature
  const generateCreature = (category = 'all') => {
    let pool = BESTIARY;
    if (category !== 'all') {
      pool = BESTIARY.filter(c => c.category === category);
    }
    const creature = randomFrom(pool);
    setSelectedCreature(creature);
    
    onLogEntry({
      type: 'discovery',
      subtype: 'creature',
      timestamp: formatTimestamp(),
      data: creature
    });
  };

  // Generátor jména osady podle pravidel (2x k12)
  const generateSettlementName = () => {
    const startPair = randomFrom(SETTLEMENT_NAME_STARTS);
    const endPair = randomFrom(SETTLEMENT_NAME_ENDS);
    const start = randomFrom(startPair);
    const end = randomFrom(endPair);
    // Kombinace - pokud konec začíná malým písmenem, připoj přímo
    if (end[0] === end[0].toLowerCase()) {
      return start + end;
    }
    return start + ' ' + end;
  };

  // Generátor zřízení podle velikosti
  const getGovernance = (sizeIndex) => {
    const roll = rollD6() + sizeIndex;
    if (roll <= 3) return SETTLEMENT_GOVERNANCE[0].name;
    if (roll <= 5) return SETTLEMENT_GOVERNANCE[1].name;
    if (roll <= 7) return SETTLEMENT_GOVERNANCE[2].name;
    if (roll <= 9) return SETTLEMENT_GOVERNANCE[3].name;
    if (roll <= 11) return SETTLEMENT_GOVERNANCE[4].name;
    return SETTLEMENT_GOVERNANCE[5].name;
  };

  // Generátor hostince
  const generateInn = () => {
    const first = randomFrom(INN_NAME_FIRST);
    const second = randomFrom(INN_NAME_SECOND);
    const specialty = randomFrom(INN_SPECIALTIES);
    return { name: `U ${first}ho ${second}a`, specialty };
  };

  const generateSettlement = () => {
    // Velikost: 2k6, použij nižší hodnotu
    const roll1 = rollD6();
    const roll2 = rollD6();
    const sizeRoll = Math.min(roll1, roll2);
    const sizeData = SETTLEMENT_SIZES[sizeRoll - 1];

    // Zřízení: k6 + velikost
    const governance = getGovernance(sizeData.sizeIndex);

    // Živnost: k20 (města a velkoměsta hoď dvakrát)
    const trades = [randomFrom(SETTLEMENT_TRADES)];
    if (sizeData.sizeIndex >= 5) {
      const second = randomFrom(SETTLEMENT_TRADES);
      if (second !== trades[0]) trades.push(second);
    }

    // Událost: k20
    const event = randomFrom(SETTLEMENT_EVENTS);

    // Jméno podle pravidel
    const name = generateSettlementName();

    // Landmark a feature jako bonus
    const landmark = randomFrom(LANDMARKS);
    const feature = randomFrom(SETTLEMENT_FEATURES);

    // Hostinec (pro vísky a větší)
    const inn = sizeData.sizeIndex >= 3 ? generateInn() : null;

    const settlement = {
      type: 'settlement',
      name,
      size: sizeData.name,
      population: sizeData.population,
      governance,
      trades,
      event,
      landmark,
      feature,
      inn,
      npcs: [],
      // Hody pro referenci
      rolls: {
        size: [roll1, roll2],
        sizeResult: sizeRoll
      }
    };

    setGenerated(settlement);
    // Poznámka: Nezapisujeme do deníku při generování - záznam se vytvoří až při uložení (saved_settlement)
  };

  const generateNPC = () => {
    // Náhodně vybrat pohlaví pro správný rod jména
    const isFemale = Math.random() < 0.5;
    const firstName = isFemale
      ? randomFrom(FEMALE_FIRST_NAMES)
      : randomFrom(MALE_FIRST_NAMES);
    const familyName = randomFrom(FAMILY_NAMES);
    const lastName = isFemale ? familyName.female : familyName.male;

    // Staty pomocníka podle pravidel: k6 BO, 2k6 síla/mrštnost/vůle
    const hp = rollDice(1, 6)[0];
    const str = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const dex = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const wil = rollDice(2, 6).reduce((a, b) => a + b, 0);

    const npc = {
      type: 'npc',
      name: `${firstName} ${lastName}`,
      role: randomFrom(NPC_ROLES),
      birthsign: randomFrom(BIRTHSIGNS),
      physicalDetail: randomFrom(PHYSICAL_DETAILS),
      quirk: randomFrom(NPC_QUIRKS),
      goal: randomFrom(NPC_GOALS),
      reaction: roll2D6(),
      hp: { current: hp, max: hp },
      str: { current: str, max: str },
      dex: { current: dex, max: dex },
      wil: { current: wil, max: wil }
    };

    setGenerated(npc);
    // Poznámka: Nezapisujeme do deníku při generování - záznam se vytvoří až při uložení (saved_npc)
  };

  const generateDungeon = () => {
    const theme = randomFrom(DUNGEON_THEMES);
    const denizens = randomFrom(DUNGEON_DENIZENS);
    const rooms = [];
    
    // Generate 5 rooms
    for (let i = 0; i < 5; i++) {
      const exits = rollD6();
      const contents = ['Prázdno', 'Past/Nebezpečí', 'Poklad', 'Malé setkání', 'Velké setkání', 'Speciální'][rollD6() - 1];
      rooms.push({
        number: i + 1,
        type: exits <= 2 ? 'Chodba' : exits <= 4 ? 'Malá místnost' : 'Velká místnost',
        exits: exits <= 1 ? 'Slepá ulička' : exits <= 3 ? '1 východ' : exits <= 5 ? '2 východy' : '3+ východy',
        contents
      });
    }
    
    const dungeon = {
      type: 'dungeon',
      theme,
      denizens,
      rooms
    };
    
    setGenerated(dungeon);
    onLogEntry({
      type: 'discovery',
      subtype: 'dungeon',
      timestamp: formatTimestamp(),
      data: dungeon
    });
  };

  const generateWeather = () => {
    const { dice, total } = roll2D6();
    const weather = WEATHER_TABLE[season][total];
    
    const result = {
      type: 'weather',
      season,
      dice,
      total,
      weather
    };
    
    setGenerated(result);
    onLogEntry({
      type: 'world_event',
      subtype: 'weather',
      timestamp: formatTimestamp(),
      data: result
    });
  };

  const genTabs = [
    { id: 'mySettlements', label: 'Osady', icon: '🏘️' },
    { id: 'myNPCs', label: 'NPC', icon: '🐭' },
    { id: 'dungeon', label: 'Dungeon', icon: '🗝️' },
    { id: 'bestiary', label: 'Bestiář', icon: '🐛' },
    { id: 'weather', label: 'Počasí', icon: '☀️' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="🌍" 
        title="Generátor světa" 
        subtitle="Vytvoř místa, postavy a události"
      />

      <TabNav tabs={genTabs} activeTab={activeGen} onTabChange={setActiveGen} />

      {/* ========== MY SETTLEMENTS ========== */}
      {activeGen === 'mySettlements' && (
        <div className="space-y-4">
          {/* Generátor osady */}
          <ResultCard>
            <HelpHeader
              title="Generátor osady"
              icon="🎲"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 Generování podle pravidel Mausritter</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>📏 <b>Velikost</b> - 2k6 (nižší hodnota): Farma → Velkoměsto</li>
                    <li>👑 <b>Zřízení</b> - k6 + velikost: stařešinové → šlechta</li>
                    <li>🔧 <b>Živnost</b> - k20 (města hoď 2×)</li>
                    <li>⚡ <b>Událost</b> - co se děje při příchodu</li>
                    <li>🏷️ <b>Jméno</b> - 2× k12 z tabulky semínek</li>
                    <li>🍺 <b>Hostinec</b> - pro vísky a větší</li>
                  </ul>
                </div>
              }
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={generateSettlement} size="large" className="flex-1">
                🎲 Generovat osadu
              </Button>
              <Button onClick={createEmptySettlement} variant="secondary">
                + Prázdná
              </Button>
            </div>
          </ResultCard>

          {/* Vygenerovaná osada */}
          {generated && generated.type === 'settlement' && (
            <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-amber-900 truncate">{generated.name}</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Velikost</span>
                    <p className="font-bold truncate">{generated.size}</p>
                    <p className="text-xs text-stone-500">{generated.population}</p>
                  </div>
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Zřízení</span>
                    <p className="font-bold text-sm">{generated.governance}</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-100 rounded overflow-hidden">
                  <span className="text-sm text-blue-700">Živnost</span>
                  {generated.trades?.map((trade, i) => (
                    <p key={i} className="font-bold text-blue-900">{trade}</p>
                  ))}
                </div>

                <div className="p-3 bg-orange-100 rounded overflow-hidden">
                  <span className="text-sm text-orange-700">Co se děje při příchodu</span>
                  <p className="font-bold text-orange-900">{generated.event}</p>
                </div>

                {generated.inn && (
                  <div className="p-3 bg-purple-100 rounded overflow-hidden">
                    <span className="text-sm text-purple-700">Hostinec</span>
                    <p className="font-bold text-purple-900">{generated.inn.name}</p>
                    <p className="text-sm text-purple-700">Specialita: {generated.inn.specialty}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-100 rounded overflow-hidden">
                    <span className="text-sm text-green-700">Landmark</span>
                    <p className="font-bold text-green-900 text-sm">{generated.landmark}</p>
                  </div>
                  <div className="p-3 bg-stone-100 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Zajímavost</span>
                    <p className="font-bold text-stone-700 text-sm">{generated.feature}</p>
                  </div>
                </div>

                <Button onClick={() => saveSettlementToWorld(generated)} className="w-full">
                  📥 Uložit do seznamu
                </Button>
              </div>
            </ResultCard>
          )}

          {/* Seznam osad */}
          {settlements.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-4">
                Zatím nemáš žádné uložené osady.<br/>
                <span className="text-sm">Vygeneruj novou pomocí tlačítka výše.</span>
              </p>
            </ResultCard>
          ) : (
            <div className="space-y-3">
              {settlements.map(settlement => (
                <ResultCard key={settlement.id}>
                  {editingSettlement === settlement.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <Input
                        value={settlement.name}
                        onChange={(v) => updateSettlement(settlement.id, { name: v })}
                        onFocus={(e) => { e.target.dataset.originalName = e.target.value; }}
                        onBlur={(e) => {
                          const orig = e.target.dataset.originalName;
                          if (orig && orig !== e.target.value && e.target.value.trim()) {
                            propagateNameChange(orig, e.target.value);
                          }
                        }}
                        placeholder="Jméno osady"
                        className="font-bold"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Select
                          value={settlement.size}
                          onChange={(v) => updateSettlement(settlement.id, { size: v })}
                          options={SETTLEMENT_SIZES.map(s => ({ value: s.name, label: `${s.name} (${s.population})` }))}
                        />
                        <Input
                          value={settlement.population || ''}
                          onChange={(v) => updateSettlement(settlement.id, { population: v })}
                          placeholder="Populace"
                        />
                      </div>
                      <Input
                        value={settlement.governance || ''}
                        onChange={(v) => updateSettlement(settlement.id, { governance: v })}
                        placeholder="Zřízení (kdo vládne)"
                      />
                      <Input
                        value={Array.isArray(settlement.trades) ? settlement.trades.join(', ') : (settlement.trades || '')}
                        onChange={(v) => updateSettlement(settlement.id, { trades: v.split(',').map(t => t.trim()).filter(Boolean) })}
                        placeholder="Živnosti (oddělené čárkou)"
                      />
                      <Input
                        value={settlement.event || ''}
                        onChange={(v) => updateSettlement(settlement.id, { event: v })}
                        placeholder="Aktuální událost/problém"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={settlement.landmark || ''}
                          onChange={(v) => updateSettlement(settlement.id, { landmark: v })}
                          placeholder="Landmark"
                        />
                        <Input
                          value={settlement.feature || ''}
                          onChange={(v) => updateSettlement(settlement.id, { feature: v })}
                          placeholder="Zajímavost"
                        />
                      </div>
                      <Input
                        value={settlement.inn?.name || ''}
                        onChange={(v) => updateSettlement(settlement.id, { inn: { ...settlement.inn, name: v } })}
                        placeholder="Hostinec (jméno)"
                      />
                      <Select
                        value={settlement.ruler || ''}
                        onChange={(v) => updateSettlement(settlement.id, { ruler: v || null })}
                        options={[
                          { value: '', label: '— Vládce (vybrat NPC) —' },
                          ...worldNPCs.map(n => ({ value: n.id, label: n.name }))
                        ]}
                      />
                      <textarea
                        value={settlement.notes || ''}
                        onChange={(e) => updateSettlement(settlement.id, { notes: e.target.value })}
                        placeholder="Poznámky..."
                        className="w-full h-20 px-3 py-2 border border-stone-300 rounded-lg resize-none"
                      />
                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setEditingSettlement(null)}>✓ Hotovo</Button>
                        <Button variant="ghost" className="text-red-500" onClick={() => deleteSettlement(settlement.id)}>Smazat</Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div
                      className="cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors overflow-hidden"
                      onClick={() => setViewingSettlement(viewingSettlement === settlement.id ? null : settlement.id)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-lg text-amber-900 truncate">{settlement.name}</h3>
                          <p className="text-sm text-stone-600 truncate">
                            {settlement.size}
                            {settlement.population && ` • ${settlement.population}`}
                            {settlement.governance && ` • ${settlement.governance}`}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className="text-xs text-stone-400">{settlement.npcs?.length || 0} NPC</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingSettlement(settlement.id); }}
                            className="text-stone-400 hover:text-stone-600"
                          >✏️</button>
                        </div>
                      </div>

                      {viewingSettlement === settlement.id && (
                        <div className="mt-3 pt-3 border-t border-amber-200 space-y-2 text-sm">
                          {settlement.trades?.length > 0 && (
                            <p><span className="text-stone-500">Živnost:</span> {settlement.trades.join(', ')}</p>
                          )}
                          {settlement.event && <p><span className="text-stone-500">Událost:</span> {settlement.event}</p>}
                          {settlement.inn?.name && (
                            <p><span className="text-stone-500">Hostinec:</span> {settlement.inn.name}{settlement.inn.specialty && ` (${settlement.inn.specialty})`}</p>
                          )}
                          {settlement.landmark && <p><span className="text-stone-500">Landmark:</span> {settlement.landmark}</p>}
                          {settlement.feature && <p><span className="text-stone-500">Zajímavost:</span> {settlement.feature}</p>}
                          {settlement.ruler && (
                            <p><span className="text-stone-500">Vládce:</span> {worldNPCs.find(n => n.id === settlement.ruler)?.name || '?'}</p>
                          )}
                          {settlement.notes && <p className="italic text-stone-600">{settlement.notes}</p>}
                          
                          {/* NPCs in this settlement */}
                          <div className="mt-3">
                            <p className="text-sm font-bold text-stone-700 mb-2">Obyvatelé:</p>
                            {(settlement.npcs?.length || 0) === 0 ? (
                              <p className="text-sm text-stone-400">Žádní NPC</p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {settlement.npcs?.map(npcId => {
                                  const npc = worldNPCs.find(n => n.id === npcId);
                                  return npc ? (
                                    <span 
                                      key={npcId} 
                                      className="px-2 py-1 bg-amber-100 rounded text-sm cursor-pointer hover:bg-amber-200"
                                      onClick={(e) => { e.stopPropagation(); setActiveGen('myNPCs'); setEditingNPC(npcId); }}
                                    >
                                      🐭 {npc.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="small"
                              className="mt-2"
                              onClick={(e) => { e.stopPropagation(); createEmptyNPC(settlement.id); setActiveGen('myNPCs'); }}
                            >
                              + Přidat NPC
                            </Button>
                          </div>

                          {/* Generátory událostí osady */}
                          <div className="mt-3 pt-3 border-t border-amber-200">
                            <p className="text-sm font-bold text-stone-700 mb-2">⚡ Generátory:</p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); generateSettlementEvent(settlement.id); }}
                                className="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors font-medium"
                              >
                                ⚡ Událost
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); generateSettlementRumor(settlement.id); }}
                                className="px-3 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition-colors font-medium"
                              >
                                💬 Zvěst
                              </button>
                            </div>
                            {/* Zobrazení výsledku */}
                            {settlementEvents[settlement.id] && (
                              <div className="mt-3 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border-2 border-orange-300 shadow-inner">
                                <div className="text-sm text-stone-800 whitespace-pre-line">
                                  {settlementEvents[settlement.id].split('\n').map((line, i) => {
                                    const formatted = line
                                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                      .replace(/\*(.+?)\*/g, '<em class="text-stone-600">$1</em>');
                                    return <p key={i} className="mb-1" dangerouslySetInnerHTML={{__html: formatted}} />;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ResultCard>
              ))}
            </div>
          )}

          {/* Party location */}
          {activeParty && activePartyId && updateParty && (
            <ResultCard>
              <h4 className="font-bold text-amber-900 mb-2">📍 Pozice družiny: {activeParty.name}</h4>
              <Select
                value={activeParty.currentSettlement || ''}
                onChange={(v) => {
                  updateParty(activePartyId, { currentSettlement: v || null });
                  const settlementName = v ? settlements.find(s => s.id === v)?.name : 'na cestě';
                  onLogEntry && onLogEntry({ type: 'note', content: `Družina ${activeParty.name} se přesunula do: ${settlementName}` });
                }}
                options={[
                  { value: '', label: '— Na cestě / neznámo —' },
                  ...settlements.map(s => ({ value: s.id, label: s.name }))
                ]}
              />
            </ResultCard>
          )}
        </div>
      )}

      {/* ========== MY NPCs ========== */}
      {activeGen === 'myNPCs' && (
        <div className="space-y-4">
          {/* Generátor NPC */}
          <ResultCard>
            <HelpHeader
              title="Generátor NPC"
              icon="🎲"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 Generování NPC</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>🏷️ <b>Jméno</b> - české myší jméno</li>
                    <li>⭐ <b>Znamení</b> - osobnostní archetyp</li>
                    <li>👁️ <b>Vzhled</b> - fyzický detail</li>
                    <li>🎭 <b>Zvláštnost</b> - jak se chová</li>
                    <li>🎯 <b>Cíl</b> - co právě teď chce</li>
                    <li>🎲 <b>Reakce (2d6)</b> - jak reaguje na hráče</li>
                  </ul>
                </div>
              }
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={generateNPC} size="large" className="flex-1">
                🎲 Generovat NPC
              </Button>
              <Button onClick={() => createEmptyNPC()} variant="secondary">
                + Prázdná
              </Button>
            </div>
          </ResultCard>

          {/* Vygenerované NPC */}
          {generated && generated.type === 'npc' && (
            <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-amber-900 truncate">{generated.name}</h3>
                {generated.role && (
                  <p className="text-center text-stone-600 font-medium truncate">🔧 {generated.role}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm font-mono bg-stone-100 rounded px-3 py-2 justify-center">
                  <span>BO: <b>{generated.hp?.max}</b></span>
                  <span>SÍL: <b>{generated.str?.max}</b></span>
                  <span>MRŠ: <b>{generated.dex?.max}</b></span>
                  <span>VŮL: <b>{generated.wil?.max}</b></span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Znamení</span>
                    <p className="font-bold truncate">{generated.birthsign?.sign}</p>
                    <p className="text-sm text-stone-600 truncate">{generated.birthsign?.trait}</p>
                  </div>
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Vzhled</span>
                    <p className="font-bold truncate">{generated.physicalDetail}</p>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded overflow-hidden">
                  <span className="text-sm text-purple-700">Zvláštnost</span>
                  <p className="font-bold text-purple-900">{generated.quirk}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded overflow-hidden">
                  <span className="text-sm text-blue-700">Cíl</span>
                  <p className="font-bold text-blue-900">{generated.goal}</p>
                </div>
                <div className="p-3 bg-stone-100 rounded">
                  <span className="text-sm text-stone-600">Reakce (2d6)</span>
                  <p className="mt-1 font-bold text-center">
                    [{generated.reaction?.dice?.join(', ')}] = {generated.reaction?.total} →{' '}
                    {generated.reaction?.total <= 3 ? '😠 Nepřátelský' :
                     generated.reaction?.total <= 5 ? '😒 Nevlídný' :
                     generated.reaction?.total <= 8 ? '😐 Neutrální' :
                     generated.reaction?.total <= 10 ? '😊 Přátelský' : '🤝 Nápomocný'}
                  </p>
                </div>
                <Button onClick={() => saveNPCToWorld({
                  ...generated,
                  birthsign: `${generated.birthsign?.sign} (${generated.birthsign?.trait})`
                })} className="w-full">
                  📥 Uložit do seznamu
                </Button>
              </div>
            </ResultCard>
          )}

          {/* Hledání a filtry NPC */}
          {worldNPCs.length > 0 && (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={npcSearch}
                  onChange={(e) => setNpcSearch(e.target.value)}
                  placeholder="Hledat NPC..."
                  className="w-full pl-8 pr-8 py-2 border border-stone-300 rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <span className="absolute left-2.5 top-2.5 text-stone-400 text-sm pointer-events-none">🔍</span>
                {npcSearch && (
                  <button onClick={() => setNpcSearch('')} className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 text-sm">✕</button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setNpcSettlementFilter(null)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    !npcSettlementFilter ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400'
                  }`}
                >
                  Všechny ({worldNPCs.filter(n => !(n as any).isDead || showDeadNPCs).length})
                </button>
                {settlements.map(s => {
                  const count = worldNPCs.filter(n => n.settlementId === s.id && (!(n as any).isDead || showDeadNPCs)).length;
                  if (count === 0) return null;
                  return (
                    <button key={s.id}
                      onClick={() => setNpcSettlementFilter(npcSettlementFilter === s.id ? null : s.id)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        npcSettlementFilter === s.id ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400'
                      }`}
                    >
                      {s.name} ({count})
                    </button>
                  );
                })}
                {worldNPCs.some(n => !n.settlementId) && (
                  <button
                    onClick={() => setNpcSettlementFilter(npcSettlementFilter === 'homeless' ? null : 'homeless')}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      npcSettlementFilter === 'homeless' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400'
                    }`}
                  >
                    Bez domova ({worldNPCs.filter(n => !n.settlementId && (!(n as any).isDead || showDeadNPCs)).length})
                  </button>
                )}
                {worldNPCs.some(n => (n as any).isDead) && (
                  <button
                    onClick={() => setShowDeadNPCs(!showDeadNPCs)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      showDeadNPCs ? 'bg-stone-500 text-white border-stone-500' : 'bg-white text-stone-400 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    💀 Mrtvé ({worldNPCs.filter(n => (n as any).isDead).length})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Seznam NPC */}
          {worldNPCs.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-4">
                Zatím nemáš žádné uložené NPC.<br/>
                <span className="text-sm">Vygeneruj novou pomocí tlačítka výše.</span>
              </p>
            </ResultCard>
          ) : filteredNPCs.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-4">
                Žádné NPC neodpovídá filtru.<br/>
                <button onClick={() => { setNpcSearch(''); setNpcSettlementFilter(null); }} className="text-amber-600 underline text-sm">Zrušit filtry</button>
              </p>
            </ResultCard>
          ) : (
            <div className="space-y-3">
              {filteredNPCs.map(npc => (
                <ResultCard key={npc.id}>
                  {editingNPC === npc.id ? (
                    // Edit mode - karta jako v generátoru
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <input
                          value={npc.name}
                          onChange={(e) => updateNPC(npc.id, { name: e.target.value })}
                          onFocus={(e) => { e.target.dataset.originalName = e.target.value; }}
                          onBlur={(e) => {
                            const orig = e.target.dataset.originalName;
                            if (orig && orig !== e.target.value && e.target.value.trim()) {
                              propagateNameChange(orig, e.target.value);
                            }
                          }}
                          className="text-2xl font-bold text-amber-900 bg-transparent border-b-2 border-amber-300 focus:border-amber-500 outline-none"
                        />
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingNPC(null)}>✓</Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNPC(npc.id)}>🗑️</Button>
                        </div>
                      </div>

                      {/* Staty - editovatelné */}
                      <div className="flex flex-wrap gap-2 text-sm font-mono bg-stone-100 rounded px-3 py-2 justify-center items-center">
                        <span className="font-bold">BO:</span>
                        <input type="text" inputMode="numeric" value={npc.hp?.current || 0} onChange={(e) => updateNPC(npc.id, { hp: { ...npc.hp, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.hp?.max || 0} onChange={(e) => updateNPC(npc.id, { hp: { ...npc.hp, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span className="ml-3 font-bold">SÍL:</span>
                        <input type="text" inputMode="numeric" value={npc.str?.current || 0} onChange={(e) => updateNPC(npc.id, { str: { ...npc.str, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.str?.max || 0} onChange={(e) => updateNPC(npc.id, { str: { ...npc.str, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span className="ml-3 font-bold">MRŠ:</span>
                        <input type="text" inputMode="numeric" value={npc.dex?.current || 0} onChange={(e) => updateNPC(npc.id, { dex: { ...npc.dex, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.dex?.max || 0} onChange={(e) => updateNPC(npc.id, { dex: { ...npc.dex, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span className="ml-3 font-bold">VŮL:</span>
                        <input type="text" inputMode="numeric" value={npc.wil?.current || 0} onChange={(e) => updateNPC(npc.id, { wil: { ...npc.wil, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.wil?.max || 0} onChange={(e) => updateNPC(npc.id, { wil: { ...npc.wil, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                          <span className="text-sm text-stone-500">Znamení</span>
                          <input value={npc.birthsign || ''} onChange={(e) => updateNPC(npc.id, { birthsign: e.target.value })} placeholder="Znamení" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none truncate" />
                        </div>
                        <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                          <span className="text-sm text-stone-500">Vzhled</span>
                          <input value={npc.physicalDetail || ''} onChange={(e) => updateNPC(npc.id, { physicalDetail: e.target.value })} placeholder="Vzhled" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none truncate" />
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100 rounded overflow-hidden">
                        <span className="text-sm text-purple-700">Zvláštnost</span>
                        <input value={npc.quirk || ''} onChange={(e) => updateNPC(npc.id, { quirk: e.target.value })} placeholder="Zvláštnost" className="w-full font-bold text-purple-900 bg-transparent border-b border-purple-300 focus:border-purple-500 outline-none truncate" />
                      </div>
                      <div className="p-3 bg-blue-100 rounded overflow-hidden">
                        <span className="text-sm text-blue-700">Cíl</span>
                        <input value={npc.goal || ''} onChange={(e) => updateNPC(npc.id, { goal: e.target.value })} placeholder="Cíl" className="w-full font-bold text-blue-900 bg-transparent border-b border-blue-300 focus:border-blue-500 outline-none truncate" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-stone-100 rounded overflow-hidden">
                          <span className="text-sm text-stone-500">Role</span>
                          <input value={npc.role || ''} onChange={(e) => updateNPC(npc.id, { role: e.target.value })} placeholder="Role/povolání" className="w-full font-bold bg-transparent border-b border-stone-300 focus:border-stone-500 outline-none truncate" />
                        </div>
                        <div className="p-3 bg-stone-100 rounded overflow-hidden">
                          <span className="text-sm text-stone-500">Osada</span>
                          <Select value={npc.settlementId || ''} onChange={(v) => assignNPCToSettlement(npc.id, v || null)} options={[{ value: '', label: '— Bez domova —' }, ...settlements.map(s => ({ value: s.id, label: s.name }))]} />
                        </div>
                      </div>
                      <textarea value={npc.notes || ''} onChange={(e) => updateNPC(npc.id, { notes: e.target.value })} placeholder="Poznámky..." className="w-full h-16 px-3 py-2 border border-stone-300 rounded-lg resize-none text-sm" />

                      {/* Generátory chování */}
                      <div className="border-t pt-3 space-y-3">
                        <p className="text-sm font-medium text-stone-600">🎲 Generátory:</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => generateNPCBehavior(npc.id)} className="px-3 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition-colors font-medium">
                            🎭 Chování
                          </button>
                          <button onClick={() => generateNPCMood(npc.id)} className="px-3 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow transition-colors font-medium">
                            😊 Nálada
                          </button>
                          <button onClick={() => generateNPCAction(npc.id)} className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors font-medium">
                            🏃 Co dělá
                          </button>
                          <button onClick={() => generateNPCMotivation(npc.id)} className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors font-medium">
                            💭 Motivace
                          </button>
                          <button onClick={() => generateNPCSecret(npc.id)} className="px-3 py-2 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow transition-colors font-medium">
                            🤫 Tajemství
                          </button>
                          <button onClick={() => generateNPCReaction(npc.id)} className="px-3 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow transition-colors font-medium">
                            ⚡ Reakce
                          </button>
                          <button onClick={() => generateNPCRole(npc.id)} className="px-3 py-2 text-sm bg-stone-500 hover:bg-stone-600 text-white rounded-lg shadow transition-colors font-medium">
                            🔧 Povolání
                          </button>
                          <button onClick={() => generateNPCEvent(npc.id)} className="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors font-medium">
                            ⚡ Událost
                          </button>
                        </div>
                        {npcBehaviors[npc.id] && (
                          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 shadow-inner animate-pulse-once">
                            <p className="text-lg font-bold text-purple-900">{npcBehaviors[npc.id]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // View mode - kompaktní
                    <div className="overflow-hidden">
                      <div className="flex justify-between items-start gap-2">
                        <div
                          className="min-w-0 flex-1 cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors"
                          onClick={() => setEditingNPC(npc.id)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-amber-900 truncate">{npc.name}</h3>
                              <p className="text-sm text-stone-600 truncate">{npc.role && `${npc.role} • `}{npc.settlementId ? settlements.find(s => s.id === npc.settlementId)?.name : 'Bez domova'}</p>
                            </div>
                            {(npc.hp || npc.str) && (
                              <div className="text-xs font-mono text-stone-500 flex-shrink-0 whitespace-nowrap hidden sm:block">
                                BO:{npc.hp?.current}/{npc.hp?.max} SÍL:{npc.str?.max}
                              </div>
                            )}
                          </div>
                          {(npc.birthsign || npc.physicalDetail || npc.quirk || npc.goal) && (
                            <div className="mt-2 text-sm text-stone-600 space-y-1">
                              {npc.birthsign && <p className="truncate">⭐ {npc.birthsign}</p>}
                              {npc.physicalDetail && <p className="truncate">👁️ {npc.physicalDetail}</p>}
                              {npc.quirk && <p className="truncate">🎭 {npc.quirk}</p>}
                              {npc.goal && <p className="truncate">🎯 {npc.goal}</p>}
                            </div>
                          )}
                          {npc.notes && <p className="mt-2 text-sm italic text-stone-500 line-clamp-2">{npc.notes}</p>}
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => setEditingNPC(npc.id)}
                            className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-colors"
                            title="Upravit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteNPC(npc.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Smazat"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </ResultCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeGen === 'dungeon' && (
        <ResultCard>
          <HelpHeader 
            title="Generátor dungeonu" 
            icon="🗝️"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Rychle vytvoří základ pro průzkum nebezpečného místa - opuštěného doupěte, staré skrýše, nebo mystického podzemí.</p>
                
                <p className="font-bold mb-1">📝 Co vygeneruje:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>🏛️ <b>Téma</b> - typ místa (hnízdo, sklep, svatyně...)</li>
                  <li>👹 <b>Obyvatelé</b> - kdo tu žije nebo hlídá</li>
                  <li>🚪 <b>5 místností</b> - základní layout s obsahem</li>
                </ul>
                
                <p className="font-bold mb-1">💡 Jak používat:</p>
                <ol className="list-decimal list-inside text-xs space-y-1 text-stone-300">
                  <li>Vygeneruj základ dungeonu</li>
                  <li>Nakresli si mapu podle místností</li>
                  <li>Přidávej detaily jak prozkoumáváš</li>
                  <li>Použij bestiář pro nepřátele</li>
                </ol>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  Tip: Není to kompletní mapa - je to kostra. Doplň vlastní nápady!
                </p>
              </div>
            }
          />
          <p className="text-stone-600 mb-4">Vygeneruj dungeon s tématem a mapou místností.</p>
          <Button onClick={generateDungeon} size="large" className="w-full">
            🗝️ Generovat dungeon
          </Button>
        </ResultCard>
      )}

      {activeGen === 'bestiary' && (
        <div className="space-y-4">
          <ResultCard>
            <HelpHeader 
              title="Bestiář" 
              icon="🐛"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 K čemu to je?</p>
                  <p className="text-xs mb-2">Kompletní seznam všech tvorů pro Mausritter - od hmyzu po nadpřirozené bytosti. Obsahuje 28 tvorů!</p>
                  
                  <p className="font-bold mb-1">📝 Jak používat:</p>
                  <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                    <li>Vyber kategorii (hmyz, savci...) nebo nech "Všechny"</li>
                    <li>Klikni "Náhodný nepřítel" pro random setkání</li>
                    <li>Nebo procházej seznam a vyber konkrétního tvora</li>
                    <li>Detail tvora ukazuje staty, útoky a taktiku</li>
                  </ol>
                  
                  <p className="font-bold mb-1">⚠️ WARBAND:</p>
                  <p className="text-xs text-stone-300 mb-2">
                    Tvorové označení "Warband" jsou tak velcí, že je může efektivně porazit jen skupina 20+ myší. Jediná myš nemá šanci!
                  </p>
                  
                  <p className="font-bold mb-1">📚 Zdroje:</p>
                  <ul className="text-xs text-stone-300">
                    <li>• Official = základní pravidla a rozšíření</li>
                    <li>• Homebrew = komunitní tvorba</li>
                  </ul>
                </div>
              }
            />
            
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setCreatureCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  creatureCategory === 'all' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                🎲 Všechny
              </button>
              {CREATURE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCreatureCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    creatureCategory === cat.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <Button onClick={() => generateCreature(creatureCategory)} size="large" className="w-full">
              🎲 Náhodný nepřítel {creatureCategory !== 'all' && `(${CREATURE_CATEGORIES.find(c => c.id === creatureCategory)?.name})`}
            </Button>
          </ResultCard>

          {/* Selected creature detail */}
          {selectedCreature && (
            <ResultCard className="border-2 border-red-400">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-red-900">{selectedCreature.name}</h3>
                  {selectedCreature.nameEn && <p className="text-sm text-stone-400 italic">{selectedCreature.nameEn}</p>}
                  <p className="text-stone-500">
                    {CREATURE_CATEGORIES.find(c => c.id === selectedCreature.category)?.icon}{' '}
                    {CREATURE_CATEGORIES.find(c => c.id === selectedCreature.category)?.name}
                    {selectedCreature.scale === 'Warband' && <span className="ml-2 bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs font-bold">WARBAND</span>}
                  </p>
                </div>
                <span className="text-4xl">
                  {CREATURE_CATEGORIES.find(c => c.id === selectedCreature.category)?.icon || '❓'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="p-2 bg-red-100 rounded text-center">
                  <div className="text-xs text-stone-500">HP</div>
                  <div className="text-xl font-bold text-red-700">{selectedCreature.hp}</div>
                </div>
                <div className="p-2 bg-amber-100 rounded text-center">
                  <div className="text-xs text-stone-500">STR</div>
                  <div className="text-xl font-bold text-amber-700">{selectedCreature.str}</div>
                </div>
                <div className="p-2 bg-green-100 rounded text-center">
                  <div className="text-xs text-stone-500">DEX</div>
                  <div className="text-xl font-bold text-green-700">{selectedCreature.dex}</div>
                </div>
                <div className="p-2 bg-purple-100 rounded text-center">
                  <div className="text-xs text-stone-500">WIL</div>
                  <div className="text-xl font-bold text-purple-700">{selectedCreature.wil}</div>
                </div>
                <div className="p-2 bg-blue-100 rounded text-center">
                  <div className="text-xs text-stone-500">Armor</div>
                  <div className="text-xl font-bold text-blue-700">{selectedCreature.armor}</div>
                </div>
              </div>

              {/* Attacks */}
              <div className="mb-4">
                <div className="text-sm font-bold text-stone-600 mb-2">⚔️ Útoky</div>
                <div className="space-y-1">
                  {selectedCreature.attacks?.map((atk, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-stone-100 rounded">
                      <span className="font-bold text-stone-800">{atk.name}</span>
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-sm font-mono">{atk.damage}</span>
                      {atk.special && <span className="text-xs text-stone-500 italic">({atk.special})</span>}
                    </div>
                  ))}
                </div>
                {selectedCreature.criticalDamage && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <span className="text-sm font-bold text-red-700">💀 Critical:</span>
                    <span className="text-sm text-red-600 ml-2">{selectedCreature.criticalDamage}</span>
                  </div>
                )}
              </div>

              {/* Abilities */}
              {selectedCreature.abilities?.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm font-bold text-yellow-800 mb-1">⚡ Schopnosti</div>
                  <ul className="text-sm text-stone-700 list-disc list-inside">
                    {selectedCreature.abilities.map((ab, i) => <li key={i}>{ab}</li>)}
                  </ul>
                </div>
              )}

              {/* Description, Tactics, Wants */}
              <div className="space-y-3">
                {selectedCreature.description && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="text-sm font-bold text-stone-600 mb-1">📖 Popis</div>
                    <p className="text-stone-700 text-sm">{selectedCreature.description}</p>
                  </div>
                )}
                {selectedCreature.tactics && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-bold text-blue-800 mb-1">🎯 Taktika</div>
                    <p className="text-stone-700 text-sm">{selectedCreature.tactics}</p>
                  </div>
                )}
                {selectedCreature.wants && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-bold text-purple-800 mb-1">💭 Chce</div>
                    <p className="text-stone-700 text-sm">{selectedCreature.wants}</p>
                  </div>
                )}
                {selectedCreature.variants?.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-sm font-bold text-amber-800 mb-1">🎲 Varianty</div>
                    <div className="text-xs text-stone-600 space-y-0.5">
                      {selectedCreature.variants.map((v, i) => <div key={i}>• {v}</div>)}
                    </div>
                  </div>
                )}
                {selectedCreature.source && (
                  <div className="text-xs text-stone-400 text-right">{selectedCreature.source}</div>
                )}
              </div>
            </ResultCard>
          )}

          {/* Creature list */}
          <ResultCard title="📖 Seznam tvorů">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {BESTIARY
                .filter(c => creatureCategory === 'all' || c.category === creatureCategory)
                .map((creature, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCreature(creature)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                      selectedCreature?.name === creature.name
                        ? 'bg-amber-200 border-2 border-amber-500'
                        : 'bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {CREATURE_CATEGORIES.find(c => c.id === creature.category)?.icon || '❓'}
                      </span>
                      <div>
                        <span className="font-bold text-stone-800">{creature.name}</span>
                        {creature.scale === 'Warband' && <span className="ml-2 text-xs bg-red-200 text-red-800 px-1 rounded">Warband</span>}
                        <div className="text-xs text-stone-500">
                          HP {creature.hp} • STR {creature.str} • {creature.attacks?.[0]?.damage || '?'}
                        </div>
                      </div>
                    </div>
                    <span className="text-stone-400">→</span>
                  </button>
                ))
              }
            </div>
          </ResultCard>
        </div>
      )}

      {activeGen === 'weather' && (
        <ResultCard>
          <HelpHeader 
            title="Počasí" 
            icon="☀️"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Počasí ovlivňuje cestování a přežití. Hoď na začátku každého dne nebo když se počasí může změnit.</p>
                
                <p className="font-bold mb-1">📝 Jak používat:</p>
                <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                  <li>Vyber aktuální roční období</li>
                  <li>Hoď 2d6 na počasí</li>
                  <li>Interpretuj vliv na hru</li>
                </ol>
                
                <p className="font-bold mb-1">⚡ Efekty počasí:</p>
                <ul className="text-xs space-y-1 text-stone-300">
                  <li><b>Bouře/Vánice (2)</b> = nebezpečné, těžké cestovat</li>
                  <li><b>Déšť/Sníh (3-4)</b> = pomalé cestování</li>
                  <li><b>Zataženo (5-6)</b> = normální podmínky</li>
                  <li><b>Příjemné (7-9)</b> = ideální pro cestování</li>
                  <li><b>Krásné (10-12)</b> = bonusy k aktivitám venku</li>
                </ul>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  💡 Extrémní počasí může být háček pro dobrodružství!
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['spring', 'summer', 'autumn', 'winter'].map(s => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    season === s ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {s === 'spring' ? '🌸 Jaro' : s === 'summer' ? '☀️ Léto' : s === 'autumn' ? '🍂 Podzim' : '❄️ Zima'}
                </button>
              ))}
            </div>
            <Button onClick={generateWeather} size="large" className="w-full">
              🎲 Hodit na počasí
            </Button>
          </div>
        </ResultCard>
      )}

      {/* Generated Result (dungeon, weather, bestiary) */}
      {generated && generated.type !== 'settlement' && generated.type !== 'npc' && (
        <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
          {generated.type === 'dungeon' && (
            <div className="space-y-3">
              <div className="p-3 bg-stone-800 text-stone-100 rounded">
                <span className="text-sm text-stone-400">Téma</span>
                <p className="font-bold text-xl">{generated.theme}</p>
              </div>
              <div className="p-3 bg-red-100 rounded">
                <span className="text-sm text-red-700">Obyvatelé</span>
                <p className="font-bold text-red-900">{generated.denizens}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-700">Místnosti:</h4>
                {generated.rooms.map(room => (
                  <div key={room.number} className="p-3 bg-amber-100/50 rounded flex justify-between items-center">
                    <div>
                      <span className="font-bold">#{room.number}</span>
                      <span className="ml-2 text-stone-600">{room.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-stone-500">{room.exits}</span>
                      <p className="font-medium text-amber-900">{room.contents}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generated.type === 'weather' && (
            <div className="text-center space-y-4">
              <DiceDisplay dice={generated.dice} size="large" />
              <div className="text-5xl">
                {WEATHER_EFFECTS[generated.weather]?.icon || '🌤️'}
              </div>
              <p className="text-3xl font-bold text-amber-900">{generated.weather}</p>
              {WEATHER_EFFECTS[generated.weather]?.danger && (
                <p className="text-red-600 font-medium">⚠️ {WEATHER_EFFECTS[generated.weather]?.effect}</p>
              )}
              <p className="text-stone-600 capitalize">{
                generated.season === 'spring' ? 'Jaro' :
                generated.season === 'summer' ? 'Léto' :
                generated.season === 'autumn' ? 'Podzim' : 'Zima'
              }</p>
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
};



export { WorldPanel };

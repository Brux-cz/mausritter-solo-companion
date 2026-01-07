const WorldPanel = ({ onLogEntry, settlements, setSettlements, worldNPCs, setWorldNPCs, parties, activeParty, activePartyId, updateParty }) => {
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
    setGenerated(null);
  };

  const updateSettlement = (id, updates) => {
    setSettlements(settlements.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSettlement = (id) => {
    setSettlements(settlements.filter(s => s.id !== id));
    // Remove settlement reference from NPCs
    setWorldNPCs(worldNPCs.map(n => n.settlementId === id ? { ...n, settlementId: null } : n));
  };

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
    setGenerated(null);
  };

  const updateNPC = (id, updates) => {
    setWorldNPCs(worldNPCs.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNPC = (id) => {
    setWorldNPCs(worldNPCs.filter(n => n.id !== id));
    // Remove NPC from settlements
    setSettlements(settlements.map(s => ({
      ...s,
      npcs: s.npcs?.filter(npcId => npcId !== id) || [],
      ruler: s.ruler === id ? null : s.ruler
    })));
  };

  const generateNPCBehavior = (npcId) => {
    const mood = randomFrom(NPC_BEHAVIOR_MOODS);
    const action = randomFrom(NPC_BEHAVIOR_ACTIONS);
    const motivation = randomFrom(NPC_BEHAVIOR_MOTIVATIONS);
    const behavior = `🎭 Chová se ${mood}, ${action}, protože ${motivation}.`;
    setNpcBehaviors({ ...npcBehaviors, [npcId]: behavior });
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

  const generateSettlement = () => {
    const landmark = randomFrom(LANDMARKS);
    const size = ['Osada', 'Vesnice', 'Město'][rollD6() <= 2 ? 0 : rollD6() <= 5 ? 1 : 2];
    const feature = randomFrom(SETTLEMENT_FEATURES);
    const event = randomFrom(SETTLEMENT_EVENTS);
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES).split(/(?=[A-Z])/)[0]; // First part of compound name
    
    const settlement = {
      type: 'settlement',
      name: `${firstName} ${lastName}`,
      landmark,
      size,
      feature,
      event,
      npcs: []
    };
    
    setGenerated(settlement);
    onLogEntry({
      type: 'discovery',
      subtype: 'settlement',
      timestamp: formatTimestamp(),
      data: settlement
    });
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
    onLogEntry({
      type: 'discovery',
      subtype: 'npc',
      timestamp: formatTimestamp(),
      data: npc
    });
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
    { id: 'mySettlements', label: 'Moje osady', icon: '🗺️' },
    { id: 'myNPCs', label: 'Moji NPC', icon: '👥' },
    { id: 'settlement', label: '+ Osada', icon: '🏘️' },
    { id: 'npc', label: '+ NPC', icon: '🐭' },
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
          <div className="flex justify-between items-center">
            <p className="text-stone-600">Správa osad a měst ve tvém světě</p>
            <Button onClick={createEmptySettlement}>+ Nová osada</Button>
          </div>

          {settlements.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-8">
                Zatím nemáš žádné osady.<br/>
                <span className="text-sm">Vytvoř novou nebo vygeneruj pomocí "+ Osada"</span>
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
                        placeholder="Jméno osady"
                        className="font-bold"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Select
                          value={settlement.size}
                          onChange={(v) => updateSettlement(settlement.id, { size: v })}
                          options={[
                            { value: 'Osada', label: 'Osada (do 20 myší)' },
                            { value: 'Vesnice', label: 'Vesnice (20-100 myší)' },
                            { value: 'Město', label: 'Město (100+ myší)' }
                          ]}
                        />
                        <Input 
                          value={settlement.population || ''} 
                          onChange={(v) => updateSettlement(settlement.id, { population: v })}
                          placeholder="Populace (číslo)"
                        />
                      </div>
                      <Input 
                        value={settlement.landmark || ''} 
                        onChange={(v) => updateSettlement(settlement.id, { landmark: v })}
                        placeholder="Landmark (co je poblíž)"
                      />
                      <Input 
                        value={settlement.feature || ''} 
                        onChange={(v) => updateSettlement(settlement.id, { feature: v })}
                        placeholder="Zajímavost (čím je známá)"
                      />
                      <Input 
                        value={settlement.event || ''} 
                        onChange={(v) => updateSettlement(settlement.id, { event: v })}
                        placeholder="Aktuální událost/problém"
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
                      className="cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors"
                      onClick={() => setViewingSettlement(viewingSettlement === settlement.id ? null : settlement.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-amber-900">{settlement.name}</h3>
                          <p className="text-sm text-stone-600">
                            {settlement.size}
                            {settlement.population && ` • ${settlement.population} myší`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs text-stone-400">{settlement.npcs?.length || 0} NPC</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingSettlement(settlement.id); }}
                            className="text-stone-400 hover:text-stone-600"
                          >✏️</button>
                        </div>
                      </div>
                      
                      {viewingSettlement === settlement.id && (
                        <div className="mt-3 pt-3 border-t border-amber-200 space-y-2">
                          {settlement.landmark && <p><span className="text-stone-500">Landmark:</span> {settlement.landmark}</p>}
                          {settlement.feature && <p><span className="text-stone-500">Zajímavost:</span> {settlement.feature}</p>}
                          {settlement.event && <p><span className="text-stone-500">Událost:</span> {settlement.event}</p>}
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
                  onLogEntry && onLogEntry(`Družina ${activeParty.name} se přesunula do: ${settlementName}`);
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
          <div className="flex justify-between items-center">
            <p className="text-stone-600">Všechny postavy ve tvém světě</p>
            <Button onClick={() => createEmptyNPC()}>+ Nová postava</Button>
          </div>

          {worldNPCs.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-8">
                Zatím nemáš žádné NPC.<br/>
                <span className="text-sm">Vytvoř novou nebo vygeneruj pomocí "+ NPC"</span>
              </p>
            </ResultCard>
          ) : (
            <div className="space-y-3">
              {worldNPCs.map(npc => (
                <ResultCard key={npc.id}>
                  {editingNPC === npc.id ? (
                    // Edit mode - karta jako v generátoru
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <input
                          value={npc.name}
                          onChange={(e) => updateNPC(npc.id, { name: e.target.value })}
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
                        <div className="p-3 bg-amber-100/50 rounded">
                          <span className="text-sm text-stone-500">Znamení</span>
                          <input value={npc.birthsign || ''} onChange={(e) => updateNPC(npc.id, { birthsign: e.target.value })} placeholder="Znamení" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none" />
                        </div>
                        <div className="p-3 bg-amber-100/50 rounded">
                          <span className="text-sm text-stone-500">Vzhled</span>
                          <input value={npc.physicalDetail || ''} onChange={(e) => updateNPC(npc.id, { physicalDetail: e.target.value })} placeholder="Vzhled" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none" />
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100 rounded">
                        <span className="text-sm text-purple-700">Zvláštnost</span>
                        <input value={npc.quirk || ''} onChange={(e) => updateNPC(npc.id, { quirk: e.target.value })} placeholder="Zvláštnost" className="w-full font-bold text-purple-900 bg-transparent border-b border-purple-300 focus:border-purple-500 outline-none" />
                      </div>
                      <div className="p-3 bg-blue-100 rounded">
                        <span className="text-sm text-blue-700">Cíl</span>
                        <input value={npc.goal || ''} onChange={(e) => updateNPC(npc.id, { goal: e.target.value })} placeholder="Cíl" className="w-full font-bold text-blue-900 bg-transparent border-b border-blue-300 focus:border-blue-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-stone-100 rounded">
                          <span className="text-sm text-stone-500">Role</span>
                          <input value={npc.role || ''} onChange={(e) => updateNPC(npc.id, { role: e.target.value })} placeholder="Role/povolání" className="w-full font-bold bg-transparent border-b border-stone-300 focus:border-stone-500 outline-none" />
                        </div>
                        <div className="p-3 bg-stone-100 rounded">
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
                    <div className="cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors" onClick={() => setEditingNPC(npc.id)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-amber-900">{npc.name}</h3>
                          <p className="text-sm text-stone-600">{npc.role && `${npc.role} • `}{npc.settlementId ? settlements.find(s => s.id === npc.settlementId)?.name : 'Bez domova'}</p>
                        </div>
                        {(npc.hp || npc.str) && (
                          <div className="text-xs font-mono text-stone-500">
                            BO:{npc.hp?.current}/{npc.hp?.max} SÍL:{npc.str?.max} MRŠ:{npc.dex?.max} VŮL:{npc.wil?.max}
                          </div>
                        )}
                      </div>
                      {(npc.birthsign || npc.physicalDetail || npc.quirk || npc.goal) && (
                        <div className="mt-2 text-sm text-stone-600 space-y-1">
                          {npc.birthsign && <p>⭐ {npc.birthsign}</p>}
                          {npc.physicalDetail && <p>👁️ {npc.physicalDetail}</p>}
                          {npc.quirk && <p>🎭 {npc.quirk}</p>}
                          {npc.goal && <p>🎯 {npc.goal}</p>}
                        </div>
                      )}
                      {npc.notes && <p className="mt-2 text-sm italic text-stone-500">{npc.notes}</p>}
                    </div>
                  )}
                </ResultCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeGen === 'settlement' && (
        <ResultCard>
          <HelpHeader 
            title="Generátor osady" 
            icon="🏘️"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Rychle vytvoří zajímavou myší osadu, kam mohou tví hrdinové přijít - s hotovým problémem k řešení!</p>
                
                <p className="font-bold mb-1">📝 Co vygeneruje:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>🏷️ <b>Jméno</b> - náhodné myší jméno osady</li>
                  <li>📏 <b>Velikost</b> - osada / vesnice / město</li>
                  <li>🌳 <b>Landmark</b> - co je poblíž (starý dub, studna...)</li>
                  <li>✨ <b>Zajímavý rys</b> - čím je osada zvláštní</li>
                  <li>⚡ <b>Událost</b> - aktuální problém nebo situace</li>
                </ul>
                
                <p className="text-xs text-stone-300 italic">
                  💡 Tip: Událost je skvělý háček pro dobrodružství! "Relikvie ukradena" = quest!
                </p>
              </div>
            }
          />
          <p className="text-stone-600 mb-4">Vygeneruj náhodnou myší osadu s landmarkem, rysem a aktuální událostí.</p>
          <Button onClick={generateSettlement} size="large" className="w-full">
            🏘️ Generovat osadu
          </Button>
        </ResultCard>
      )}

      {activeGen === 'npc' && (
        <ResultCard>
          <HelpHeader 
            title="Generátor NPC" 
            icon="🐭"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Vytvoří okamžitě zapamatovatelnou postavu, když tví hrdinové potkají někoho nového.</p>
                
                <p className="font-bold mb-1">📝 Co vygeneruje:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>🏷️ <b>Jméno</b> - české myší jméno</li>
                  <li>⭐ <b>Znamení</b> - osobnostní archetyp</li>
                  <li>👁️ <b>Fyzický detail</b> - co si na ní všimneš</li>
                  <li>🎭 <b>Zvláštnost</b> - jak se chová</li>
                  <li>🎯 <b>Cíl</b> - co právě teď chce</li>
                  <li>🎲 <b>Reakce (2d6)</b> - jak reaguje na hráče</li>
                </ul>
                
                <p className="font-bold mb-1">🎲 Reakce:</p>
                <ul className="text-xs space-y-0.5 text-stone-300">
                  <li>2-3 = Nepřátelská</li>
                  <li>4-5 = Nedůvěřivá</li>
                  <li>6-8 = Neutrální</li>
                  <li>9-10 = Přátelská</li>
                  <li>11-12 = Nadšená/pomocná</li>
                </ul>
              </div>
            }
          />
          <p className="text-stone-600 mb-4">Vygeneruj náhodnou myší postavu s osobností a cílem.</p>
          <Button onClick={generateNPC} size="large" className="w-full">
            🐭 Generovat NPC
          </Button>
        </ResultCard>
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

      {/* Generated Result */}
      {generated && (
        <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
          {generated.type === 'settlement' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-amber-900">{generated.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Velikost</span>
                  <p className="font-bold">{generated.size}</p>
                </div>
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Landmark</span>
                  <p className="font-bold">{generated.landmark}</p>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded">
                <span className="text-sm text-green-700">Zajímavý rys</span>
                <p className="font-bold text-green-900">{generated.feature}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded">
                <span className="text-sm text-orange-700">Aktuální událost</span>
                <p className="font-bold text-orange-900">{generated.event}</p>
              </div>
              <Button onClick={() => saveSettlementToWorld(generated)} className="w-full">
                📥 Uložit do Moje osady
              </Button>
            </div>
          )}

          {generated.type === 'npc' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-amber-900">{generated.name}</h3>
              {generated.role && (
                <p className="text-center text-stone-600 font-medium">🔧 {generated.role}</p>
              )}
              {/* Staty NPC */}
              <div className="flex gap-4 text-sm font-mono bg-stone-100 rounded px-3 py-2 justify-center">
                <span>BO: <b>{generated.hp?.max}</b></span>
                <span>SÍL: <b>{generated.str?.max}</b></span>
                <span>MRŠ: <b>{generated.dex?.max}</b></span>
                <span>VŮL: <b>{generated.wil?.max}</b></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Znamení</span>
                  <p className="font-bold">{generated.birthsign?.sign}</p>
                  <p className="text-sm text-stone-600">{generated.birthsign?.trait}</p>
                </div>
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Vzhled</span>
                  <p className="font-bold">{generated.physicalDetail}</p>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded">
                <span className="text-sm text-purple-700">Zvláštnost</span>
                <p className="font-bold text-purple-900">{generated.quirk}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded">
                <span className="text-sm text-blue-700">Cíl</span>
                <p className="font-bold text-blue-900">{generated.goal}</p>
              </div>
              <div className="p-3 bg-stone-100 rounded">
                <span className="text-sm text-stone-600">Reakce (2d6)</span>
                <DiceDisplay dice={generated.reaction.dice} />
                <p className="mt-2 font-bold text-center">
                  {generated.reaction.total <= 3 ? '😠 Nepřátelský' :
                   generated.reaction.total <= 5 ? '😒 Nevlídný' :
                   generated.reaction.total <= 8 ? '😐 Neutrální' :
                   generated.reaction.total <= 10 ? '😊 Přátelský' : '🤝 Nápomocný'}
                </p>
              </div>
              <Button onClick={() => saveNPCToWorld({
                ...generated,
                birthsign: `${generated.birthsign?.sign} (${generated.birthsign?.trait})`
              })} className="w-full">
                📥 Uložit do Moji NPC
              </Button>
            </div>
          )}

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
                {generated.weather.includes('Bouře') || generated.weather.includes('Vánice') ? '⛈️' :
                 generated.weather.includes('Déšť') || generated.weather.includes('Sněžení') ? '🌧️' :
                 generated.weather.includes('Zataženo') || generated.weather.includes('Mlha') ? '☁️' :
                 generated.weather.includes('Slunečno') || generated.weather.includes('Jasno') ? '☀️' :
                 generated.weather.includes('Perfektní') || generated.weather.includes('Nádherné') ? '🌈' : '🌤️'}
              </div>
              <p className="text-3xl font-bold text-amber-900">{generated.weather}</p>
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

// ============================================
// FACTION PANEL
// ============================================


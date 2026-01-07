const PartyPanel = ({ 
  parties, 
  activePartyId, 
  setActivePartyId,
  activeCharacterId,
  setActiveCharacterId,
  createParty,
  createPC,
  createHireling,
  updateParty,
  updateCharacterInParty,
  removeCharacter,
  removeParty,
  onLogEntry 
}) => {
  const [editingPartyId, setEditingPartyId] = useState(null);
  const [editingCharId, setEditingCharId] = useState(null);
  const [expandedParties, setExpandedParties] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'party'|'character', partyId, charId?, name }

  const toggleExpand = (partyId) => {
    setExpandedParties(prev => ({ ...prev, [partyId]: !prev[partyId] }));
  };

  const activeParty = parties.find(p => p.id === activePartyId);

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'party') {
      removeParty(deleteConfirm.partyId);
    } else if (deleteConfirm.type === 'character') {
      removeCharacter(deleteConfirm.partyId, deleteConfirm.charId);
    }
    setDeleteConfirm(null);
  };

  // Generate random PC
  const generateRandomPC = (partyId) => {
    // Roll attributes (3k6, take two highest for each)
    const roll3k6TwoHighest = () => {
      const rolls = [rollD6(), rollD6(), rollD6()];
      rolls.sort((a, b) => b - a);
      return rolls[0] + rolls[1];
    };
    
    const rollK66 = () => `${rollD6()}-${rollD6()}`;
    
    const str = roll3k6TwoHighest();
    const dex = roll3k6TwoHighest();
    const wil = roll3k6TwoHighest();
    const hp = rollD6();
    const pips = rollD6();
    
    // Get origin from HP × Pips table
    const originKey = `${hp}-${pips}`;
    const origin = ORIGINS[originKey] || ORIGINS['1-1'];
    
    // Gender and name
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const firstNames = gender === 'male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
    const familyName = randomFrom(FAMILY_NAMES);
    const firstName = randomFrom(firstNames);
    const lastName = gender === 'male' ? familyName.male : familyName.female;
    
    // Fur
    const furColor = randomFrom(FUR_COLORS);
    const furPattern = randomFrom(FUR_PATTERNS);
    
    // Distinctive feature (k66)
    const distinctiveFeature = DISTINCTIVE_FEATURES[rollK66()] || 'Běžný vzhled';
    
    // Weapon
    const weapon = randomFrom(STARTING_WEAPONS);
    
    // Build inventorySlots from origin
    const inventorySlots = {
      mainPaw: { id: generateId(), name: `${weapon.name} (${weapon.damage})`, slots: weapon.slots, usageDots: 0, maxUsage: 3, isWeapon: true },
      offPaw: null,
      body1: null,
      body2: null,
      pack1: { id: generateId(), name: 'Zásoby', slots: 1, usageDots: 0, maxUsage: 3 },
      pack2: { id: generateId(), name: 'Pochodně', slots: 1, usageDots: 0, maxUsage: 3 },
      pack3: { id: generateId(), name: origin.itemA, slots: 1, usageDots: 0, maxUsage: 3 },
      pack4: { id: generateId(), name: origin.itemB, slots: 1, usageDots: 0, maxUsage: 3 },
      pack5: null,
      pack6: null
    };
    
    const newChar = {
      id: generateId(),
      type: 'pc',
      name: `${firstName} ${lastName}`,
      gender,
      level: 1,
      STR: { current: str, max: str },
      DEX: { current: dex, max: dex },
      WIL: { current: wil, max: wil },
      hp: { current: hp, max: hp },
      pips,
      xp: 0,
      origin,
      birthsign: randomFrom(BIRTHSIGNS),
      fur: { color: furColor, pattern: furPattern },
      distinctiveFeature,
      conditions: [],
      inventorySlots,
      inventory: [],
      spells: []
    };
    
    createPC(partyId, newChar);
    onLogEntry({
      type: 'character_created',
      timestamp: formatTimestamp(),
      character: newChar.name,
      partyId
    });
  };

  const HIRELING_SKILLS = [
    'Boj', 'Průzkum', 'Léčení', 'Plížení', 'Jezdectví', 
    'Vaření', 'Opravy', 'Magie', 'Obchod', 'Navigace'
  ];

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-amber-900 mb-3">
              ⚠️ Potvrdit smazání
            </h3>
            <p className="text-stone-700 mb-4">
              {deleteConfirm.type === 'party' 
                ? `Opravdu chceš smazat družinu "${deleteConfirm.name}" a všechny její členy?`
                : `Opravdu chceš odstranit "${deleteConfirm.name}" z družiny?`
              }
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
                Zrušit
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                🗑️ Smazat
              </Button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader 
        icon="🏕️" 
        title="Družiny a postavy" 
        subtitle={`${parties.length} družin, ${parties.reduce((acc, p) => acc + p.members.length, 0)} postav celkem`}
      />

      {/* Create new party */}
      <ResultCard>
        <HelpHeader 
          title="Správa družin" 
          icon="➕"
          tooltip={
            <div>
              <p className="mb-1">Družina = skupina postav cestující spolu</p>
              <ul className="text-xs space-y-1">
                <li>• Každá družina má vlastní čas</li>
                <li>• PC = plná postava s XP a levely</li>
                <li>• Hireling = pomocník s Loyalty</li>
              </ul>
            </div>
          }
        />
        <Button onClick={() => createParty()} className="w-full">
          🏕️ Vytvořit novou družinu
        </Button>
      </ResultCard>

      {/* Party list */}
      {parties.length === 0 ? (
        <ResultCard>
          <div className="text-center py-8 text-stone-500">
            <p className="text-4xl mb-3">🐭</p>
            <p>Zatím nemáš žádnou družinu.</p>
            <p className="text-sm mt-2">Vytvoř první družinu a přidej do ní postavy!</p>
          </div>
        </ResultCard>
      ) : (
        <div className="space-y-4">
          {parties.map(party => {
            const isActive = party.id === activePartyId;
            const isExpanded = expandedParties[party.id] !== false; // Default expanded
            const isEditing = editingPartyId === party.id;
            
            return (
              <ResultCard 
                key={party.id} 
                className={`${isActive ? 'border-2 border-amber-500 shadow-lg' : ''}`}
              >
                {/* Party Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <button 
                      onClick={() => toggleExpand(party.id)}
                      className="text-xl hover:bg-amber-100 rounded p-1"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={party.name}
                        onChange={(e) => updateParty(party.id, { name: e.target.value })}
                        onBlur={() => setEditingPartyId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingPartyId(null)}
                        autoFocus
                        className="flex-1 px-2 py-1 border-2 border-amber-500 rounded font-bold text-lg"
                      />
                    ) : (
                      <h3 
                        className="font-bold text-lg text-amber-900 cursor-pointer hover:text-amber-700"
                        onClick={() => setEditingPartyId(party.id)}
                        title="Klikni pro přejmenování"
                      >
                        {party.name}
                        <span className="text-sm font-normal text-stone-500 ml-2">
                          ({party.members.length} členů)
                        </span>
                      </h3>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                        AKTIVNÍ
                      </span>
                    ) : (
                      <Button 
                        size="small" 
                        variant="secondary"
                        onClick={() => {
                          setActivePartyId(party.id);
                          if (party.members.length > 0) {
                            setActiveCharacterId(party.members[0].id);
                          }
                        }}
                      >
                        Aktivovat
                      </Button>
                    )}
                    <Button 
                      size="small" 
                      variant="ghost"
                      onClick={() => setEditingPartyId(isEditing ? null : party.id)}
                    >
                      ✏️
                    </Button>
                    <Button 
                      size="small" 
                      variant="danger"
                      onClick={() => setDeleteConfirm({ 
                        type: 'party', 
                        partyId: party.id, 
                        name: party.name 
                      })}
                      title={`Smazat družinu ${party.name}`}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>

                {/* Party Time Info */}
                {isExpanded && (
                  <div className="mb-3 p-2 bg-amber-50 rounded text-sm flex flex-wrap gap-4">
                    <span>
                      {['🌅', '☀️', '🌆', '🌙'][party.gameTime?.watch || 0]} 
                      {' '}{WATCHES[party.gameTime?.watch || 0]?.name}
                    </span>
                    <span>📆 Den {party.gameTime?.day || 1}, Týden {party.gameTime?.week || 1}</span>
                    <span>
                      {SEASONS.find(s => s.id === (party.gameTime?.season || 'spring'))?.icon}
                      {' '}{SEASONS.find(s => s.id === (party.gameTime?.season || 'spring'))?.name}
                    </span>
                  </div>
                )}

                {/* Members List */}
                {isExpanded && (
                  <div className="space-y-2">
                    {party.members.length === 0 ? (
                      <p className="text-stone-400 text-sm text-center py-3">
                        Družina je prázdná. Přidej postavy níže.
                      </p>
                    ) : (
                      party.members.map(member => {
                        const isPC = member.type === 'pc';
                        const isCharEditing = editingCharId === member.id;
                        const isSelected = activeCharacterId === member.id && isActive;
                        
                        return (
                          <div 
                            key={member.id}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-amber-100 border-amber-500' 
                                : isPC 
                                  ? 'bg-green-50 border-green-200 hover:border-green-400'
                                  : 'bg-blue-50 border-blue-200 hover:border-blue-400'
                            }`}
                            onClick={() => {
                              if (isActive && !isCharEditing) {
                                setActiveCharacterId(member.id);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{isPC ? '🐭' : '🐿️'}</span>
                                <div>
                                  {isCharEditing ? (
                                    <input
                                      type="text"
                                      value={member.name}
                                      onChange={(e) => updateCharacterInParty(party.id, member.id, { name: e.target.value })}
                                      onBlur={() => setEditingCharId(null)}
                                      onKeyDown={(e) => e.key === 'Enter' && setEditingCharId(null)}
                                      onClick={(e) => e.stopPropagation()}
                                      autoFocus
                                      className="px-2 py-1 border-2 border-amber-500 rounded font-bold"
                                    />
                                  ) : (
                                    <span 
                                      className="font-bold text-stone-800 hover:text-amber-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCharId(member.id);
                                      }}
                                      title="Klikni pro přejmenování"
                                    >
                                      {member.name}
                                    </span>
                                  )}
                                  <div className="flex gap-3 text-sm text-stone-600">
                                    {isPC ? (
                                      <>
                                        <span>Level {member.level || 1}</span>
                                        <span className={member.hp?.current < member.hp?.max ? 'text-red-600 font-bold' : ''}>
                                          HP {member.hp?.current || 0}/{member.hp?.max || 6}
                                        </span>
                                        <span>{member.pips || 0} pips</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className={member.hp?.current < member.hp?.max ? 'text-red-600 font-bold' : ''}>
                                          HP {member.hp?.current || 0}/{member.hp?.max || 3}
                                        </span>
                                        <span>Loyalty: {member.loyalty || 7}</span>
                                        <span>{member.cost || '1 pip/den'}</span>
                                      </>
                                    )}
                                  </div>
                                  {!isPC && member.skills?.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {member.skills.map((skill, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <span className="text-xs text-amber-600 font-bold">VYBRÁN</span>
                                )}
                                <Button 
                                  size="small" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm({
                                      type: 'character',
                                      partyId: party.id,
                                      charId: member.id,
                                      name: member.name
                                    });
                                  }}
                                  title={`Odstranit ${member.name}`}
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Add buttons */}
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-amber-200">
                      <Button 
                        size="small" 
                        onClick={() => generateRandomPC(party.id)}
                      >
                        🎲 Náhodná PC
                      </Button>
                      <Button 
                        size="small" 
                        variant="secondary"
                        onClick={() => createPC(party.id)}
                      >
                        🐭 Prázdná PC
                      </Button>
                      <Button 
                        size="small" 
                        variant="ghost"
                        onClick={() => createHireling(party.id)}
                      >
                        🐿️ Hireling
                      </Button>
                    </div>
                  </div>
                )}
              </ResultCard>
            );
          })}
        </div>
      )}

      {/* Quick reference */}
      <ResultCard title="📋 Rychlá reference">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">🐭 PC (Player Character)</h4>
            <ul className="space-y-1 text-stone-700">
              <li>• Plný character sheet</li>
              <li>• STR, DEX, WIL atributy</li>
              <li>• XP a levelování</li>
              <li>• Inventář a kouzla</li>
            </ul>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">🐿️ Hireling (Pomocník)</h4>
            <ul className="space-y-1 text-stone-700">
              <li>• Zjednodušený sheet</li>
              <li>• HP + Loyalty (loajalita)</li>
              <li>• Cena (obvykle 1 pip/den)</li>
              <li>• Může zradit při selhání Loyalty!</li>
            </ul>
          </div>
        </div>
      </ResultCard>
    </div>
  );
};

// ============================================
// TIME TRACKER PANEL
// ============================================

const WATCHES = [
  { id: 'morning', name: 'Ráno', icon: '🌅', hours: '6:00-12:00' },
  { id: 'afternoon', name: 'Odpoledne', icon: '☀️', hours: '12:00-18:00' },
  { id: 'evening', name: 'Večer', icon: '🌆', hours: '18:00-24:00' },
  { id: 'night', name: 'Noc', icon: '🌙', hours: '0:00-6:00' }
];

const SEASONS = [
  { id: 'spring', name: 'Jaro', icon: '🌸', months: 'Březen-Květen' },
  { id: 'summer', name: 'Léto', icon: '☀️', months: 'Červen-Srpen' },
  { id: 'autumn', name: 'Podzim', icon: '🍂', months: 'Září-Listopad' },
  { id: 'winter', name: 'Zima', icon: '❄️', months: 'Prosinec-Únor' }
];

// Simplified time constants for TimePanel and TimeBar
const TIMEBAR_SEASONS = [
  { id: 'spring', name: 'Jaro', icon: '🌱' },
  { id: 'summer', name: 'Léto', icon: '☀️' },
  { id: 'autumn', name: 'Podzim', icon: '🍂' },
  { id: 'winter', name: 'Zima', icon: '❄️' }
];

const TIMEBAR_WATCHES = [
  { id: 0, name: 'Ráno', icon: '🌅' },
  { id: 1, name: 'Den', icon: '☀️' },
  { id: 2, name: 'Večer', icon: '🌆' },
  { id: 3, name: 'Noc', icon: '🌙' }
];

// Efekty počasí podle typu a sezóny
const WEATHER_EFFECTS = {
  // Extrémní počasí (hod 2)
  'Bouře': { icon: '⛈️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání. Cestování ×2.' },
  'Vánice': { icon: '🌨️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání. Cestování ×2.' },
  'Sucho': { icon: '🏜️', danger: true, travelMod: 1, effect: 'STR save bez vody nebo Vyčerpání.' },
  'Vichřice': { icon: '🌪️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání. Cestování ×2.' },
  // Špatné počasí (hod 3-4)
  'Déšť': { icon: '🌧️', danger: false, travelMod: 1.5, effect: 'Pomalé cestování (×1.5 hlídky).' },
  'Sněžení': { icon: '❄️', danger: false, travelMod: 1.5, effect: 'Pomalé cestování (×1.5 hlídky).' },
  'Horko': { icon: '🥵', danger: true, travelMod: 1, effect: 'STR save bez vody nebo Vyčerpání.' },
  'Mlha': { icon: '🌫️', danger: false, travelMod: 1.5, effect: 'Snížená viditelnost. Cestování ×1.5.' },
  // Průměrné počasí (hod 5-6)
  'Zataženo': { icon: '☁️', danger: false, travelMod: 1, effect: null },
  'Zima': { icon: '🥶', danger: false, travelMod: 1, effect: 'Potřeba přístřeší v noci.' },
  'Teplo': { icon: '🌤️', danger: false, travelMod: 1, effect: null },
  // Normální počasí (hod 7-9)
  'Mírné': { icon: '🌤️', danger: false, travelMod: 1, effect: null },
  'Příjemné': { icon: '😊', danger: false, travelMod: 1, effect: null },
  'Chladno': { icon: '🍃', danger: false, travelMod: 1, effect: null },
  'Mráz': { icon: '🥶', danger: true, travelMod: 1, effect: 'STR save každou hlídku venku nebo Vyčerpání.' },
  // Dobré počasí (hod 10-12)
  'Slunečno': { icon: '☀️', danger: false, travelMod: 1, effect: null },
  'Svěží': { icon: '🍂', danger: false, travelMod: 1, effect: null },
  'Jasno': { icon: '✨', danger: false, travelMod: 1, effect: null },
  'Nádherné': { icon: '🌈', danger: false, travelMod: 1, effect: null },
  'Perfektní': { icon: '🌅', danger: false, travelMod: 1, effect: null },
  'Zlaté': { icon: '🍁', danger: false, travelMod: 1, effect: null },
  'Klidné': { icon: '❄️', danger: false, travelMod: 1, effect: null }
};

// Generování počasí s efekty
const generateWeather = (season) => {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const total = d1 + d2;
  const type = WEATHER_TABLE[season]?.[total] || 'Mírné';
  const effects = WEATHER_EFFECTS[type] || { icon: '🌤️', danger: false, travelMod: 1, effect: null };

  return {
    type,
    roll: total,
    dice: [d1, d2],
    ...effects
  };
};

// Kalkulačka cestování
const TravelCalculator = ({ weather }) => {
  const [hexCount, setHexCount] = React.useState(1);
  const [difficultTerrain, setDifficultTerrain] = React.useState(false);
  const [badWeather, setBadWeather] = React.useState(false);

  // Modifikátor počasí z aktuálního stavu nebo ruční volby
  const weatherMod = badWeather ? 1.5 : (weather?.travelMod || 1);
  const weatherLabel = weather?.type || (badWeather ? 'Špatné' : 'Normální');

  const baseWatches = hexCount * (difficultTerrain ? 2 : 1);
  const watches = Math.ceil(baseWatches * weatherMod);
  const days = Math.ceil(watches / 3); // 3 hlídky aktivní + 1 odpočinek
  const encounterRolls = days * 2; // ráno + večer
  const avgEncounters = (encounterRolls / 6).toFixed(1);

  return (
    <ResultCard title="🗺️ Kalkulačka cestování">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-stone-600">Hexů:</label>
            <Input
              type="number"
              min="1"
              max="100"
              value={hexCount}
              onChange={(v) => setHexCount(Math.max(1, parseInt(v) || 1))}
              className="w-20"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={difficultTerrain}
              onChange={(e) => setDifficultTerrain(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300"
            />
            <span className="text-sm text-stone-600">Náročný terén (×2)</span>
          </label>
          {!weather && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={badWeather}
                onChange={(e) => setBadWeather(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300"
              />
              <span className="text-sm text-stone-600">Špatné počasí (×1.5)</span>
            </label>
          )}
        </div>

        {/* Aktuální počasí */}
        {weather && weatherMod > 1 && (
          <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
            {weather.icon} Počasí "{weather.type}" zpomaluje cestování (×{weatherMod})
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-600">{watches}</div>
            <div className="text-xs text-stone-600">Hlídek</div>
            {weatherMod > 1 && <div className="text-xs text-amber-500">({baseWatches} × {weatherMod})</div>}
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{days}</div>
            <div className="text-xs text-stone-600">Dnů</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">~{avgEncounters}</div>
            <div className="text-xs text-stone-600">Setkání</div>
          </div>
        </div>

        <p className="text-xs text-stone-500 text-center">
          {encounterRolls} hodů na d6 (1 = setkání, 2 = omen) • {days} {days === 1 ? 'den' : days < 5 ? 'dny' : 'dnů'} s odpočinkem
        </p>
      </div>
    </ResultCard>
  );
};


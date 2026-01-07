const CharacterPanel = ({ 
  character, 
  updateCharacter, 
  party, 
  parties,
  activePartyId,
  setActivePartyId,
  activeCharacterId, 
  setActiveCharacterId, 
  createParty,
  createPC,
  createHireling,
  addHirelingsToParty,
  updateParty,
  updateCharacterInParty,
  removeCharacter,
  removeParty,
  onLogEntry 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [openSection, setOpenSection] = useState('inventory');
  const [selectedSlot, setSelectedSlot] = useState(null); // For tap-to-move inventory
  const [popupItem, setPopupItem] = useState(null); // For item detail popup
  const inventoryRef = useRef(null);
  const slotSize = useSlotSize(inventoryRef); // Responsive slot size

  // Generate random PC
  // State for character generator modal
  const [showGenerator, setShowGenerator] = useState(false);
  const [pendingChar, setPendingChar] = useState(null);
  const [bonusOrigin, setBonusOrigin] = useState(null);
  const [selectedBonusItems, setSelectedBonusItems] = useState([]);

  // State for hireling recruitment picker
  const [showHirelingPicker, setShowHirelingPicker] = useState(false);
  const [hirelingAvailability, setHirelingAvailability] = useState({});
  const [hirelingCandidates, setHirelingCandidates] = useState([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [currentRecruitType, setCurrentRecruitType] = useState(null);

  // State for treasury
  const [showTreasury, setShowTreasury] = useState(false);
  const [newTreasuryItem, setNewTreasuryItem] = useState({ name: '', amount: '' });

  // Treasury functions
  const treasuryItems = party?.treasuryItems || [];
  const treasuryTotal = treasuryItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const addTreasuryItem = () => {
    const amount = parseInt(newTreasuryItem.amount);
    if (!newTreasuryItem.name.trim() || isNaN(amount)) return;
    const newItem = {
      id: generateId(),
      name: newTreasuryItem.name.trim(),
      amount: amount
    };
    updateParty(activePartyId, { treasuryItems: [...treasuryItems, newItem] });
    setNewTreasuryItem({ name: '', amount: '' });
  };

  const removeTreasuryItem = (itemId) => {
    updateParty(activePartyId, { treasuryItems: treasuryItems.filter(i => i.id !== itemId) });
  };

  // Pay hireling from treasury
  const payHireling = (hirelingCharacter) => {
    const hirelingTypeInfo = HIRELING_TYPES.find(t => t.type === hirelingCharacter.hirelingType);
    const wageStr = hirelingTypeInfo?.cost || hirelingCharacter.cost || '1 ď';
    const wageAmount = parseInt(wageStr) || 1;

    if (treasuryTotal < wageAmount) {
      alert(`Nedostatek peněz v pokladně! Potřeba: ${wageAmount} ď, k dispozici: ${treasuryTotal} ď`);
      return;
    }

    const newTreasuryItem = {
      id: generateId(),
      name: `Výplata: ${hirelingCharacter.name}`,
      amount: -wageAmount
    };

    updateParty(activePartyId, { treasuryItems: [...treasuryItems, newTreasuryItem] });

    onLogEntry({
      type: 'treasury',
      subtype: 'payment',
      timestamp: formatTimestamp(),
      description: `Vyplacen ${hirelingCharacter.name}: -${wageAmount} ď`
    });
  };

  // Hireling recruitment functions
  const rollHirelingDice = (diceStr) => {
    const match = diceStr.match(/d(\d+)/);
    if (!match) return 1;
    return Math.floor(Math.random() * parseInt(match[1])) + 1;
  };

  const rollAvailability = (typeKey) => {
    const type = HIRELING_TYPES.find(t => t.type === typeKey);
    if (!type) return 0;
    const count = rollHirelingDice(type.dice);
    setHirelingAvailability(prev => ({ ...prev, [typeKey]: count }));
    return count;
  };

  const hireHireling = (typeKey) => {
    if (!activePartyId) return;
    const available = hirelingAvailability[typeKey] || 0;
    if (available <= 0) return;
    const hireling = createHireling(activePartyId, typeKey);
    setHirelingAvailability(prev => ({ ...prev, [typeKey]: prev[typeKey] - 1 }));
    setActiveCharacterId(hireling.id);
    setShowHirelingPicker(false);
  };

  const openHirelingPicker = () => {
    if (!activePartyId) return;
    setHirelingAvailability({});
    setHirelingCandidates([]);
    setSelectedCandidateIds([]);
    setCurrentRecruitType(null);
    setShowHirelingPicker(true);
  };

  // Generate candidates with stats for a hireling type
  const generateCandidates = (typeKey) => {
    const hirelingType = HIRELING_TYPES.find(t => t.type === typeKey);
    if (!hirelingType) return;

    const count = rollHirelingDice(hirelingType.dice);

    const candidates = [];
    for (let i = 0; i < count; i++) {
      const roll2k6 = () => rollD6() + rollD6();
      candidates.push({
        tempId: generateId(),
        name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
        STR: roll2k6(),
        DEX: roll2k6(),
        WIL: roll2k6(),
        HP: rollD6(),
        physicalDetail: randomFrom(PHYSICAL_DETAILS)
      });
    }

    setCurrentRecruitType(typeKey);
    setHirelingCandidates(candidates);
    setSelectedCandidateIds([]);
    setHirelingAvailability(prev => ({ ...prev, [typeKey]: count }));
  };

  // Toggle candidate selection
  const toggleCandidate = (tempId) => {
    setSelectedCandidateIds(prev => {
      if (prev.includes(tempId)) {
        return prev.filter(id => id !== tempId);
      } else {
        return [...prev, tempId];
      }
    });
  };

  // Hire selected candidates
  const hireSelectedCandidates = () => {
    if (!activePartyId || !currentRecruitType || selectedCandidateIds.length === 0) return;
    const hirelingType = HIRELING_TYPES.find(t => t.type === currentRecruitType);

    // Create all new hirelings first
    const newHirelings = hirelingCandidates
      .filter(c => selectedCandidateIds.includes(c.tempId))
      .map(candidate => ({
        id: generateId(),
        type: 'hireling',
        hirelingType: currentRecruitType,
        name: candidate.name,
        STR: { current: candidate.STR, max: candidate.STR },
        DEX: { current: candidate.DEX, max: candidate.DEX },
        WIL: { current: candidate.WIL, max: candidate.WIL },
        hp: { current: candidate.HP, max: candidate.HP },
        cost: hirelingType?.cost || '1 ď',
        skill: hirelingType?.skill || null,
        inventorySlots: {
          strongPaw1: null, strongPaw2: null,
          weakPaw1: null, weakPaw2: null
        },
        physicalDetail: candidate.physicalDetail
      }));

    // Add all hirelings to party
    addHirelingsToParty(activePartyId, newHirelings);

    // Switch to last hired character
    if (newHirelings.length > 0) {
      setActiveCharacterId(newHirelings[newHirelings.length - 1].id);
    }

    // Clear and close
    setHirelingCandidates([]);
    setSelectedCandidateIds([]);
    setCurrentRecruitType(null);
    setShowHirelingPicker(false);
  };

  // Roll new character for generator
  const rollNewCharacter = (preferredGender = null) => {
    // Reset bonus origin and selected items
    setBonusOrigin(null);
    setSelectedBonusItems([]);
    
    // Roll attributes (3k6, take two highest for each)
    const roll3k6TwoHighest = () => {
      const rolls = [rollD6(), rollD6(), rollD6()];
      rolls.sort((a, b) => b - a);
      return rolls[0] + rolls[1];
    };
    
    // Roll k66 for distinctive feature
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
    const gender = preferredGender || (Math.random() < 0.5 ? 'male' : 'female');
    const firstNames = gender === 'male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
    const familyName = randomFrom(FAMILY_NAMES);
    const firstName = randomFrom(firstNames);
    const lastName = gender === 'male' ? familyName.male : familyName.female;
    
    // Fur
    const furColor = randomFrom(FUR_COLORS);
    const furPattern = randomFrom(FUR_PATTERNS);
    
    // Distinctive feature (k66)
    const distinctiveFeature = DISTINCTIVE_FEATURES[rollK66()] || 'Běžný vzhled';
    
    // Birthsign
    const birthsign = randomFrom(BIRTHSIGNS);
    
    // Bonus items check (max attr ≤9 = +1 item, ≤7 = +2 items)
    const maxAttr = Math.max(str, dex, wil);
    const bonusItemCount = maxAttr <= 7 ? 2 : maxAttr <= 9 ? 1 : 0;
    
    // Build inventory from origin
    const inventory = [
      { id: generateId(), name: 'Zásoby', slots: 1, usageDots: 0, maxUsage: 3 },
      { id: generateId(), name: 'Pochodně', slots: 1, usageDots: 0, maxUsage: 3 },
      { id: generateId(), name: origin.itemA, slots: 1, usageDots: 0, maxUsage: 3 },
      { id: generateId(), name: origin.itemB, slots: 1, usageDots: 0, maxUsage: 3 }
    ];
    
    setPendingChar({
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
      birthsign,
      fur: { color: furColor, pattern: furPattern },
      distinctiveFeature,
      bonusItemCount,
      selectedWeaponIndex: 0,
      conditions: [],
      inventory,
      spells: []
    });
  };

  // Swap two attributes
  const swapAttributes = (attr1, attr2) => {
    if (!pendingChar) return;
    setPendingChar({
      ...pendingChar,
      [attr1]: pendingChar[attr2],
      [attr2]: pendingChar[attr1]
    });
  };

  // Change weapon selection
  const selectWeapon = (index) => {
    if (!pendingChar) return;
    setPendingChar({ ...pendingChar, selectedWeaponIndex: index });
  };

  // Confirm and create character
  const confirmCharacter = () => {
    if (!pendingChar || !activePartyId) return;
    
    // Add selected weapon to inventory slots
    const weapon = STARTING_WEAPONS[pendingChar.selectedWeaponIndex || 0];
    
    // Build inventorySlots from origin items + weapon
    const inventorySlots = {
      mainPaw: { id: generateId(), name: `${weapon.name} (${weapon.damage})`, slots: weapon.slots, usageDots: 0, maxUsage: 3, isWeapon: true },
      offPaw: null,
      body1: null,
      body2: null,
      pack1: { id: generateId(), name: 'Zásoby', slots: 1, usageDots: 0, maxUsage: 3 },
      pack2: { id: generateId(), name: 'Pochodně', slots: 1, usageDots: 0, maxUsage: 3 },
      pack3: pendingChar.origin?.itemA ? { id: generateId(), name: pendingChar.origin.itemA, slots: 1, usageDots: 0, maxUsage: 3 } : null,
      pack4: pendingChar.origin?.itemB ? { id: generateId(), name: pendingChar.origin.itemB, slots: 1, usageDots: 0, maxUsage: 3 } : null,
      pack5: null,
      pack6: null
    };
    
    // Add bonus items if selected
    if (bonusOrigin && selectedBonusItems.length > 0) {
      const bonusSlots = ['pack5', 'pack6', 'body1', 'body2']; // Try these slots in order
      let slotIndex = 0;
      
      selectedBonusItems.forEach(itemKey => {
        const itemName = itemKey === 'A' ? bonusOrigin.origin.itemA : bonusOrigin.origin.itemB;
        // Find next empty slot
        while (slotIndex < bonusSlots.length && inventorySlots[bonusSlots[slotIndex]] !== null) {
          slotIndex++;
        }
        if (slotIndex < bonusSlots.length) {
          inventorySlots[bonusSlots[slotIndex]] = { 
            id: generateId(), 
            name: itemName, 
            slots: 1, 
            usageDots: 0, 
            maxUsage: 3 
          };
          slotIndex++;
        }
      });
    }
    
    const finalChar = {
      ...pendingChar,
      inventorySlots,
      inventory: [], // Keep empty for backwards compatibility
      conditions: []
    };
    delete finalChar.selectedWeaponIndex;
    delete finalChar.bonusItemCount;
    
    createPC(activePartyId, finalChar);
    setActiveCharacterId(finalChar.id);
    onLogEntry({ type: 'character_created', timestamp: formatTimestamp(), character: finalChar.name });
    setPendingChar(null);
    setBonusOrigin(null);
    setSelectedBonusItems([]);
    setShowGenerator(false);
  };

  // Open generator
  const openGenerator = () => {
    setShowGenerator(true);
    rollNewCharacter();
  };

  const addHireling = () => {
    if (!activePartyId) return;
    const hireling = createHireling(activePartyId);
    setActiveCharacterId(hireling.id);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'party') {
      removeParty(deleteConfirm.id);
    } else {
      removeCharacter(activePartyId, deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  // Helper functions
  const updateHP = (delta) => {
    if (!character) return;
    const newHP = Math.max(0, Math.min(character.hp?.max || 6, (character.hp?.current || 0) + delta));
    updateCharacter({ hp: { ...character.hp, current: newHP } });
  };

  const updatePips = (delta) => {
    if (!character) return;
    updateCharacter({ pips: Math.max(0, (character.pips || 0) + delta) });
  };

  const updateAttribute = (attr, field, value) => {
    if (!character) return;
    const parsed = parseInt(value) || 0;
    updateCharacter({
      [attr]: { ...character[attr], [field]: Math.max(1, Math.min(18, parsed)) }
    });
  };

  const toggleCondition = (condId) => {
    if (!character) return;
    const has = character.conditions?.includes(condId);
    updateCharacter({
      conditions: has ? character.conditions.filter(c => c !== condId) : [...(character.conditions || []), condId]
    });
  };

  const addInventoryItem = () => {
    if (!character) return;
    updateCharacter({
      inventory: [...(character.inventory || []), { id: generateId(), name: 'Nový předmět', usageDots: 0, maxUsage: 3 }]
    });
  };

  const updateInventoryItem = (id, field, value) => {
    if (!character) return;
    updateCharacter({
      inventory: character.inventory.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeInventoryItem = (id) => {
    if (!character) return;
    updateCharacter({ inventory: character.inventory.filter(item => item.id !== id) });
  };

  // Slot-based inventory functions
  const SLOT_IDS = ['mainPaw', 'offPaw', 'body1', 'body2', 'pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'];
  
  const moveInventoryItem = (fromSlot, toSlot) => {
    if (!character || fromSlot === toSlot) return;
    const slots = { ...(character.inventorySlots || {}) };
    const item = slots[fromSlot];
    if (!item) return;
    
    // Pairs for 2-height validation
    const belowMap = { mainPaw: 'offPaw', body1: 'body2', pack1: 'pack4', pack2: 'pack5', pack3: 'pack6' };
    const aboveMap = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };
    
    // Check if target is blocked by 2H item above
    const aboveSlot = aboveMap[toSlot];
    if (aboveSlot && slots[aboveSlot]?.height === 2) {
      return; // Can't drop here, blocked
    }
    
    // Check if dropping 2H item - need empty slot below
    if (item.height === 2) {
      const belowSlot = belowMap[toSlot];
      if (!belowSlot) return; // No slot below, can't place 2H
      if (slots[belowSlot] && belowSlot !== fromSlot) {
        alert('Potřebuješ 2 volné sloty pod sebou!');
        return;
      }
    }
    
    // Swap if target has item
    const targetItem = slots[toSlot];
    slots[toSlot] = item;
    slots[fromSlot] = targetItem || null;
    
    updateCharacter({ inventorySlots: slots });
  };

  const updateSlotItem = (slotId, field, value) => {
    if (!character) return;
    const slots = { ...(character.inventorySlots || {}) };
    if (slots[slotId]) {
      slots[slotId] = { ...slots[slotId], [field]: value };
      updateCharacter({ inventorySlots: slots });
    }
  };

  const removeSlotItem = (slotId) => {
    if (!character) return;
    const slots = { ...(character.inventorySlots || {}) };
    
    // If it's a condition, also remove from conditions array
    if (slots[slotId]?.isCondition && slots[slotId]?.conditionId) {
      updateCharacter({ 
        inventorySlots: { ...slots, [slotId]: null },
        conditions: (character.conditions || []).filter(c => c !== slots[slotId].conditionId)
      });
    } else {
      slots[slotId] = null;
      updateCharacter({ inventorySlots: slots });
    }
  };

  const addConditionToSlot = (slotId, condId, condName) => {
    if (!character) return;
    // Don't add if already has this condition
    if (character.conditions?.includes(condId)) return;
    
    const slots = { ...(character.inventorySlots || {}) };
    // Only add to empty slot
    if (slots[slotId]) return;
    
    slots[slotId] = {
      id: generateId(),
      name: condName,
      isCondition: true,
      conditionId: condId,
      usageDots: 0,
      maxUsage: 0
    };
    
    updateCharacter({ 
      inventorySlots: slots,
      conditions: [...(character.conditions || []), condId]
    });
  };

  const addNewItemToFirstEmpty = () => {
    if (!character) return;
    const slots = { ...(character.inventorySlots || {}) };
    
    // Find first empty pack slot
    const emptySlot = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'].find(s => !slots[s]);
    if (!emptySlot) {
      alert('Batoh je plný!');
      return;
    }
    
    slots[emptySlot] = {
      id: generateId(),
      name: 'Nový předmět',
      usageDots: 0,
      maxUsage: 3,
      slots: 1
    };
    
    updateCharacter({ inventorySlots: slots });
  };

  // Migrate old inventory format to new slots format
  React.useEffect(() => {
    if (character && character.inventory && !character.inventorySlots) {
      const slots = {};
      character.inventory.forEach((item, idx) => {
        const slotId = SLOT_IDS[idx + 4] || `pack${idx + 1}`; // Start at pack slots
        if (idx < 6) slots[slotId] = { ...item };
      });
      updateCharacter({ inventorySlots: slots });
    }
  }, [character?.id]);

  // ========== NO PARTIES ==========
  if (!parties || parties.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader icon="🐭" title="Postavy" subtitle="Začni vytvořením družiny" />
        <ResultCard>
          <div className="text-center py-8">
            <p className="text-6xl mb-4">🏕️</p>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Vítej v Mausritteru!</h3>
            <p className="text-stone-600 mb-6">Vytvoř první družinu a přidej postavy.</p>
            <Button onClick={() => createParty('Moje družina')} size="large">
              🏕️ Vytvořit družinu
            </Button>
          </div>
        </ResultCard>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="space-y-4">
      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-amber-900 mb-2">⚠️ Smazat?</h3>
            <p className="text-stone-600 mb-4">{deleteConfirm.name}</p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1">Zrušit</Button>
              <Button variant="danger" onClick={handleDelete} className="flex-1">Smazat</Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename modal */}
      {editingName === 'party' && party && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-amber-900 mb-4">Přejmenovat družinu</h3>
            <input
              value={party.name}
              onChange={(e) => updateParty(party.id, { name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg mb-4"
              autoFocus
            />
            <Button onClick={() => setEditingName(null)} className="w-full">Hotovo</Button>
          </div>
        </div>
      )}

      {/* Character Generator Modal */}
      {showGenerator && pendingChar && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-4 md:p-6 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-amber-900">🐭 Nová myš</h3>
              <button onClick={() => { setShowGenerator(false); setBonusOrigin(null); setSelectedBonusItems([]); }} className="text-stone-400 hover:text-stone-600 text-2xl">✕</button>
            </div>

            {/* Name with gender buttons */}
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-1">Jméno</label>
              <div className="flex gap-2">
                <input
                  value={pendingChar.name}
                  onChange={(e) => setPendingChar({ ...pendingChar, name: e.target.value })}
                  className="flex-1 px-3 py-2 border-2 border-amber-300 rounded-lg font-bold"
                />
                <button
                  onClick={() => rollNewCharacter('male')}
                  className={`w-10 h-10 rounded-lg font-bold ${pendingChar.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}
                  title="Mužské jméno"
                >♂</button>
                <button
                  onClick={() => rollNewCharacter('female')}
                  className={`w-10 h-10 rounded-lg font-bold ${pendingChar.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}
                  title="Ženské jméno"
                >♀</button>
              </div>
            </div>

            {/* Origin (from HP × Pips) */}
            <div className="bg-amber-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-bold text-amber-700 mb-1">📜 Původ</div>
              <div className="font-bold text-lg text-amber-900">{pendingChar.origin?.name}</div>
            </div>

            {/* Attributes with swap */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-stone-500">Atributy</label>
                <span className="text-xs text-stone-400">Klikni pro prohození</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['STR', 'DEX', 'WIL'].map((attr, idx) => (
                  <div key={attr} className="text-center">
                    <div className="bg-amber-100 rounded-lg p-3">
                      <div className="text-xs font-bold text-amber-700 mb-1">{attr === 'STR' ? 'SÍL' : attr === 'DEX' ? 'MRŠ' : 'VŮL'}</div>
                      <div className="text-3xl font-bold text-amber-900">{pendingChar[attr]?.current}</div>
                    </div>
                    {idx < 2 && (
                      <button
                        onClick={() => swapAttributes(
                          ['STR', 'DEX', 'WIL'][idx], 
                          ['STR', 'DEX', 'WIL'][idx + 1]
                        )}
                        className="mt-1 px-2 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                      >
                        ↔️ {['SÍL', 'MRŠ', 'VŮL'][idx + 1]}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* HP & Pips */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-red-700">❤️ BO (Body odolnosti)</div>
                <div className="text-2xl font-bold text-red-900">{pendingChar.hp?.current}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-amber-700">💰 Ďobky</div>
                <div className="text-2xl font-bold text-amber-900">{pendingChar.pips}</div>
              </div>
            </div>

            {/* Bonus items warning */}
            {pendingChar.bonusItemCount > 0 && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                <div className="font-bold text-green-800 mb-2">
                  🎁 Bonus za slabé atributy!
                </div>
                <div className="text-sm text-green-700 space-y-2">
                  <p>
                    Tvůj nejvyšší atribut je pouze <strong>{Math.max(pendingChar.STR?.current, pendingChar.DEX?.current, pendingChar.WIL?.current)}</strong>, 
                    což ti dává nárok na bonus.
                  </p>
                  <p className="font-medium">
                    Hoď znovu na tabulku Původ a vezmi si <strong>{pendingChar.bonusItemCount === 2 ? 'oba předměty' : 'jeden předmět'}</strong>:
                  </p>
                  
                  {/* Bonus origin roller */}
                  <div className="bg-white rounded-lg p-3 mt-2">
                    <button
                      onClick={() => {
                        const hp = Math.floor(Math.random() * 6) + 1;
                        const pips = Math.floor(Math.random() * 6) + 1;
                        const key = `${hp}-${pips}`;
                        setBonusOrigin({ key, origin: ORIGINS[key], hp, pips });
                        setSelectedBonusItems([]);
                      }}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold mb-2"
                    >
                      🎲 Hodit na bonus původ
                    </button>
                    {bonusOrigin && (
                      <div className="text-center">
                        <div className="text-xs text-stone-500">HP {bonusOrigin.hp} × Pips {bonusOrigin.pips}</div>
                        <div className="font-bold text-green-800 text-lg mb-2">{bonusOrigin.origin.name}</div>
                        <div className="space-y-2">
                          {/* Item A */}
                          <button
                            onClick={() => {
                              if (selectedBonusItems.includes('A')) {
                                setSelectedBonusItems(selectedBonusItems.filter(i => i !== 'A'));
                              } else if (selectedBonusItems.length < pendingChar.bonusItemCount) {
                                setSelectedBonusItems([...selectedBonusItems, 'A']);
                              }
                            }}
                            className={`w-full p-2 rounded-lg text-left text-sm transition-all border-2 ${
                              selectedBonusItems.includes('A') 
                                ? 'bg-green-200 border-green-500 text-green-800' 
                                : 'bg-white border-stone-200 hover:border-green-300'
                            }`}
                          >
                            {selectedBonusItems.includes('A') ? '✓' : '○'} {bonusOrigin.origin.itemA}
                          </button>
                          {/* Item B */}
                          <button
                            onClick={() => {
                              if (selectedBonusItems.includes('B')) {
                                setSelectedBonusItems(selectedBonusItems.filter(i => i !== 'B'));
                              } else if (selectedBonusItems.length < pendingChar.bonusItemCount) {
                                setSelectedBonusItems([...selectedBonusItems, 'B']);
                              }
                            }}
                            className={`w-full p-2 rounded-lg text-left text-sm transition-all border-2 ${
                              selectedBonusItems.includes('B') 
                                ? 'bg-green-200 border-green-500 text-green-800' 
                                : 'bg-white border-stone-200 hover:border-green-300'
                            }`}
                          >
                            {selectedBonusItems.includes('B') ? '✓' : '○'} {bonusOrigin.origin.itemB}
                          </button>
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          {selectedBonusItems.length === 0 
                            ? `Klikni pro výběr ${pendingChar.bonusItemCount === 2 ? 'předmětů' : 'předmětu'}`
                            : `Vybráno: ${selectedBonusItems.length}/${pendingChar.bonusItemCount}`
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Birthsign & Fur */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="text-xs font-bold text-stone-500 mb-1">⭐ Rodné znamení</div>
                <div className="font-medium text-stone-800">{pendingChar.birthsign?.sign}</div>
                <div className="text-xs text-stone-500">{pendingChar.birthsign?.trait}</div>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="text-xs font-bold text-stone-500 mb-1">🐾 Srst</div>
                <div className="font-medium text-stone-800">{pendingChar.fur?.color}</div>
                <div className="text-xs text-stone-500">{pendingChar.fur?.pattern}</div>
              </div>
            </div>

            {/* Distinctive feature */}
            <div className="bg-stone-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-bold text-stone-500 mb-1">👁️ Výrazný rys</div>
              <div className="font-medium text-stone-800">{pendingChar.distinctiveFeature}</div>
            </div>

            {/* Weapon selector */}
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-2">⚔️ Počáteční zbraň</label>
              <select
                value={pendingChar.selectedWeaponIndex || 0}
                onChange={(e) => selectWeapon(parseInt(e.target.value))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                {STARTING_WEAPONS.map((weapon, i) => (
                  <option key={i} value={i}>
                    {weapon.name} ({weapon.damage}, {weapon.weight === 'light' ? 'lehká' : weapon.weight === 'medium' ? 'střední' : 'těžká'})
                  </option>
                ))}
              </select>
            </div>

            {/* Starting Inventory from Origin */}
            <div className="bg-amber-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-bold text-amber-700 mb-2">🎒 Počáteční výbava</div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">{STARTING_WEAPONS[pendingChar.selectedWeaponIndex || 0]?.name} ({STARTING_WEAPONS[pendingChar.selectedWeaponIndex || 0]?.damage})</span>
                  <span className="text-xs text-stone-400">⚔️</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">Zásoby</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">Pochodně</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">{pendingChar.origin?.itemA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">{pendingChar.origin?.itemB}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => rollNewCharacter()} className="flex-1">
                🎲 Přehodit
              </Button>
              <Button onClick={confirmCharacter} className="flex-1">
                ✓ Vytvořit
              </Button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Treasury Modal */}
      {showTreasury && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-900">💰 Pokladna družiny</h3>
              <button onClick={() => setShowTreasury(false)} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
            </div>

            {/* Total */}
            <div className={`text-center py-3 mb-4 rounded-lg ${treasuryTotal >= 0 ? 'bg-amber-50' : 'bg-red-50'}`}>
              <div className="text-xs text-stone-500">Celkem</div>
              <div className={`text-3xl font-bold ${treasuryTotal >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {treasuryTotal} ď
              </div>
            </div>

            {/* Add new item */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Popis..."
                value={newTreasuryItem.name}
                onChange={(e) => setNewTreasuryItem(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addTreasuryItem()}
                className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="±"
                value={newTreasuryItem.amount}
                onChange={(e) => setNewTreasuryItem(prev => ({ ...prev, amount: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addTreasuryItem()}
                className="w-20 px-2 py-2 text-sm border border-stone-300 rounded-lg text-center"
              />
              <Button onClick={addTreasuryItem}>+</Button>
            </div>

            {/* Items list */}
            <div className="max-h-60 overflow-y-auto space-y-1">
              {treasuryItems.length === 0 ? (
                <p className="text-center text-stone-400 py-4">Prázdná pokladna</p>
              ) : (
                treasuryItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-700">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </span>
                      <button
                        onClick={() => removeTreasuryItem(item.id)}
                        className="text-stone-400 hover:text-red-500"
                      >✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hireling Recruitment Picker Modal */}
      {showHirelingPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-4 md:p-6 max-w-2xl w-full shadow-2xl my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-amber-900">🐿️ Verbování pomocníků</h3>
                <button onClick={() => setShowHirelingPicker(false)} className="text-stone-400 hover:text-stone-600 text-2xl">✕</button>
              </div>

              <p className="text-sm text-stone-600 mb-4">
                Klikni na typ pro vygenerování dostupných kandidátů. Vyber které chceš naverbovat.
              </p>

              {/* Hireling type list */}
              <div className="space-y-2 mb-4">
                {HIRELING_TYPES.map(ht => {
                  const isSelected = currentRecruitType === ht.type;

                  return (
                    <div
                      key={ht.type}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-200 ring-2 ring-amber-400' : 'bg-amber-50 hover:bg-amber-100'
                      }`}
                      onClick={() => generateCandidates(ht.type)}
                    >
                      <div className="flex-1">
                        <div className="font-bold text-amber-900">{ht.name}</div>
                        <div className="text-xs text-stone-500">{ht.skill}</div>
                      </div>
                      <div className="text-center w-16">
                        <div className="text-xs text-stone-400">Počet</div>
                        <div className="font-bold">{ht.dice}</div>
                      </div>
                      <div className="text-center w-16">
                        <div className="text-xs text-stone-400">Mzda</div>
                        <div className="font-bold text-amber-700">{ht.cost}</div>
                      </div>
                      <div className="w-20 text-center">
                        <Button size="small" variant={isSelected ? 'primary' : 'ghost'}>
                          🎲 {ht.dice}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Candidates list */}
              {hirelingCandidates.length > 0 && currentRecruitType && (
                <div className="border-t border-stone-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-amber-900">
                        Dostupní kandidáti ({hirelingCandidates.length})
                        {' '}<span className="text-stone-500 font-normal">
                          - {HIRELING_TYPES.find(t => t.type === currentRecruitType)?.name}
                        </span>
                      </h4>
                      <p className="text-sm text-amber-700 mt-1">
                        🎯 {HIRELING_TYPES.find(t => t.type === currentRecruitType)?.skill}
                      </p>
                    </div>
                    {selectedCandidateIds.length > 0 && (
                      <Button onClick={hireSelectedCandidates}>
                        Najmout vybrané ({selectedCandidateIds.length})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {hirelingCandidates.map(c => (
                      <div
                        key={c.tempId}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                          selectedCandidateIds.includes(c.tempId)
                            ? 'border-green-500 bg-green-50'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        }`}
                        onClick={() => toggleCandidate(c.tempId)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCandidateIds.includes(c.tempId)}
                          onChange={() => toggleCandidate(c.tempId)}
                          className="w-5 h-5 text-green-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-stone-800">{c.name}</div>
                          <div className="text-xs text-stone-500 italic">{c.physicalDetail}</div>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                            SÍL {c.STR}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            MRŠ {c.DEX}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            VŮL {c.WIL}
                          </span>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">
                            BO {c.HP}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hirelingCandidates.length === 0 && (
                    <div className="text-center py-4 text-stone-500">
                      Žádní kandidáti nejsou k dispozici
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-stone-500">
                <strong>Morálka:</strong> Test záchranou na Vůli (2d6 ≤ VŮL) když ve stresu
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PARTY & MEMBER SELECTOR ===== */}
      <ResultCard>
        {/* Party row */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-stone-200">
          <span className="text-sm font-bold text-stone-500">🏕️</span>
          <select
            value={activePartyId || ''}
            onChange={(e) => {
              setActivePartyId(e.target.value);
              const p = parties.find(p => p.id === e.target.value);
              if (p?.members?.length > 0) setActiveCharacterId(p.members[0].id);
              else setActiveCharacterId(null);
            }}
            className="flex-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg font-medium"
          >
            {parties.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.members?.length || 0})</option>
            ))}
          </select>
          <Button size="small" variant="ghost" onClick={() => createParty()}>+</Button>
          <Button size="small" variant="ghost" onClick={() => setEditingName('party')}>✏️</Button>
          <Button size="small" variant="ghost" onClick={() => party && setDeleteConfirm({ type: 'party', id: party.id, name: party.name })}>🗑️</Button>
        </div>

        {/* Treasury button */}
        {party && (
          <div className="mb-4 pb-4 border-b border-stone-200">
            <button
              onClick={() => setShowTreasury(true)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                treasuryTotal >= 0 ? 'bg-amber-50 hover:bg-amber-100' : 'bg-red-50 hover:bg-red-100'
              }`}
            >
              <span className="text-sm font-bold text-stone-600">💰 Pokladna</span>
              <span className={`font-bold ${treasuryTotal >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {treasuryTotal} ď
              </span>
            </button>
          </div>
        )}

        {/* Members row */}
        {party && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-stone-500">👥 Členové</span>
              <div className="flex gap-1">
                <Button size="small" onClick={openGenerator}>🎲 Myš</Button>
                <Button size="small" variant="ghost" onClick={openHirelingPicker}>🐿️ Verbovat</Button>
              </div>
            </div>
            
            {party.members?.length === 0 ? (
              <p className="text-stone-400 text-center py-4">Prázdná družina - přidej postavu!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {party.members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => setActiveCharacterId(member.id)}
                    className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                      activeCharacterId === member.id
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span className="text-xl">{member.type === 'pc' ? '🐭' : '🐿️'}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm">{member.name.split(' ')[0]}</div>
                      <div className={`text-xs ${activeCharacterId === member.id ? 'text-amber-200' : 'text-stone-400'}`}>
                        HP {member.hp?.current}/{member.hp?.max}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </ResultCard>

      {/* ===== CHARACTER SHEET ===== */}
      {!character ? (
        <ResultCard>
          <div className="text-center py-8 text-stone-400">
            <p className="text-4xl mb-3">👆</p>
            <p>Vyber nebo vytvoř postavu</p>
          </div>
        </ResultCard>
      ) : (
        <>
          {/* Character Header */}
          <ResultCard className="bg-gradient-to-r from-amber-100 to-amber-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{character.type === 'pc' ? '🐭' : '🐿️'}</span>
                <div>
                  <h2 
                    className="text-xl font-bold text-amber-900 cursor-pointer hover:text-amber-700"
                    onClick={() => setEditingName(character.id)}
                  >
                    {character.name}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {character.type === 'pc'
                      ? `${character.origin?.name || character.background || 'Level ' + (character.level || 1)}`
                      : (() => {
                          const ht = HIRELING_TYPES.find(t => t.type === character.hirelingType);
                          return ht ? `${ht.name} • ${ht.cost}` : 'Pomocník';
                        })()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteConfirm({ type: 'character', id: character.id, name: character.name })}
                className="p-2 text-stone-400 hover:text-red-500 rounded"
              >
                🗑️
              </button>
            </div>

            {/* HP & Pips - only for PC (hirelings have their own in HirelingSheet) */}
            {character.type === 'pc' && (
              <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xs text-stone-500 mb-1">❤️ HP</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => updateHP(-1)} className="w-10 h-10 bg-red-100 text-red-700 rounded-lg font-bold text-xl">-</button>
                    <span className="text-2xl font-bold text-red-700 min-w-[60px]">
                      {character.hp?.current || 0}/{character.hp?.max || 6}
                    </span>
                    <button onClick={() => updateHP(1)} className="w-10 h-10 bg-green-100 text-green-700 rounded-lg font-bold text-xl">+</button>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xs text-stone-500 mb-1">💰 Pips</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => updatePips(-1)} className="w-10 h-10 bg-stone-100 text-stone-700 rounded-lg font-bold text-xl">-</button>
                    <span className="text-2xl font-bold text-amber-600 min-w-[60px]">{character.pips || 0}</span>
                    <button onClick={() => updatePips(1)} className="w-10 h-10 bg-stone-100 text-stone-700 rounded-lg font-bold text-xl">+</button>
                  </div>
                </div>
              </div>
            )}
          </ResultCard>

          {/* PC-only sections */}
          {character.type === 'pc' && (
            <>
              {/* Attributes */}
              <ResultCard title="💪 Atributy">
                <div className="grid grid-cols-3 gap-3">
                  {['STR', 'DEX', 'WIL'].map(attr => (
                    <div key={attr} className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-xs font-bold text-amber-700 mb-1">{attr}</div>
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={character[attr]?.current || 10}
                          onChange={(e) => updateAttribute(attr, 'current', e.target.value)}
                          className="w-12 text-center text-xl font-bold text-amber-900 bg-white border border-amber-300 rounded"
                          min="1"
                          max="18"
                        />
                        <span className="text-stone-400">/</span>
                        <input
                          type="number"
                          value={character[attr]?.max || 10}
                          onChange={(e) => updateAttribute(attr, 'max', e.target.value)}
                          className="w-12 text-center text-sm font-medium text-stone-500 bg-white border border-stone-200 rounded"
                          min="1"
                          max="18"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ResultCard>

              {/* Inventory Grid - Mausritter Original Layout */}
              <ResultCard title="🎒 Inventář">
                {/* Item detail popup */}
                {popupItem && character.inventorySlots?.[popupItem.slotId] && (
                  <ItemPopup
                    key={`${popupItem.slotId}-${character.inventorySlots[popupItem.slotId]?.usageDots}`}
                    item={character.inventorySlots[popupItem.slotId]}
                    slotId={popupItem.slotId}
                    onUpdate={updateSlotItem}
                    onRemove={removeSlotItem}
                    onMove={(slotId) => setSelectedSlot(slotId)}
                    onClose={() => setPopupItem(null)}
                  />
                )}
                {selectedSlot && (
                  <div className="mb-2 p-1 bg-amber-100 rounded text-xs text-amber-800 flex justify-between items-center">
                    <span>Vyber cílový slot</span>
                    <button onClick={() => setSelectedSlot(null)} className="text-amber-600 hover:text-amber-800">✕ Zrušit</button>
                  </div>
                )}
                <div className="space-y-3">
                  {/* Main Grid FIRST - Paws | Body | Pack */}
                  <div ref={inventoryRef} className="flex gap-2 md:gap-3 items-start justify-center">
                    {/* Paws */}
                    <div className="text-center">
                      <div style={{ fontSize: Math.max(12, slotSize * 0.2) }} className="text-amber-600 font-bold mb-1">🐾</div>
                      <div className="flex flex-col gap-1" style={{ position: 'relative' }}>
                        <InvSlot id="mainPaw" slots={character.inventorySlots} color="amber" 
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem} 
                          updateChar={updateCharacter} belowId="offPaw" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="offPaw" slots={character.inventorySlots} color="amber"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="mainPaw" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                      </div>
                    </div>
                    
                    {/* Body */}
                    <div className="text-center">
                      <div style={{ fontSize: Math.max(12, slotSize * 0.2) }} className="text-blue-600 font-bold mb-1">👕</div>
                      <div className="flex flex-col gap-1" style={{ position: 'relative' }}>
                        <InvSlot id="body1" slots={character.inventorySlots} color="blue"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="body2" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="body2" slots={character.inventorySlots} color="blue"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="body1" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                      </div>
                    </div>
                    
                    {/* Pack 3x2 */}
                    <div className="text-center flex-1">
                      <div style={{ fontSize: Math.max(12, slotSize * 0.2) }} className="text-stone-500 font-bold mb-1">🎒</div>
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, ${slotSize}px)`, gridTemplateRows: `repeat(2, ${slotSize}px)`, gap: 4, position: 'relative' }}>
                        <InvSlot id="pack1" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="pack4" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack2" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="pack5" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack3" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="pack6" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack4" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="pack1" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack5" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="pack2" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack6" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="pack3" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick add items - below grid */}
                  <details className="border-t border-stone-200 pt-2">
                    <summary className="text-xs font-bold text-stone-500 cursor-pointer hover:text-stone-700">▼ Přidat předmět</summary>
                    <div className="mt-2 flex flex-wrap gap-1">
                    {[
                      { name: 'Zásoby', type: 'item', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Pochodeň', type: 'item', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Jehla', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Meč', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Kopí↕', type: 'weapon', damageDef: 'k10', weaponClass: 'Heavy', maxUsage: 3, width: 1, height: 2 },
                      { name: 'Zbroj↕', type: 'armor', damageDef: '1', weaponClass: 'Heavy', maxUsage: 3, width: 1, height: 2 },
                    ].map((item, i) => (
                      <button key={i} onClick={() => {
                        const slots = character.inventorySlots || {};
                        const pairs = [['mainPaw', 'offPaw'],['body1', 'body2'],['pack1', 'pack4'],['pack2', 'pack5'],['pack3', 'pack6']];
                        let targetSlot = null;
                        if (item.height === 2) {
                          for (const [top, bottom] of pairs) {
                            if (!slots[top] && !slots[bottom]) { targetSlot = top; break; }
                          }
                          if (!targetSlot) { alert('Potřebuješ 2 volné sloty pod sebou!'); return; }
                        } else {
                          const allSlots = ['mainPaw','offPaw','body1','body2','pack1','pack2','pack3','pack4','pack5','pack6'];
                          const blockedByAbove = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };
                          targetSlot = allSlots.find(s => !slots[s] && !(blockedByAbove[s] && slots[blockedByAbove[s]]?.height === 2));
                        }
                        if (targetSlot) updateCharacter({ inventorySlots: { ...slots, [targetSlot]: { id: Math.random().toString(36).substr(2,9), ...item, usageDots: 0 }}});
                      }}
                        className={`px-2 py-1 rounded text-xs border ${
                          item.type === 'weapon' ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 
                          item.type === 'armor' ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' : 
                          'bg-amber-50 border-amber-200 hover:bg-amber-100'
                        }`}
                      >{item.name}</button>
                    ))}
                    {CONDITIONS.slice(0, 3).map(c => (
                      <button key={c.id} onClick={() => {
                        const slots = character.inventorySlots || {};
                        const allSlots = ['mainPaw','offPaw','body1','body2','pack1','pack2','pack3','pack4','pack5','pack6'];
                        const blockedByAbove = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };
                        const empty = allSlots.find(s => !slots[s] && !(blockedByAbove[s] && slots[blockedByAbove[s]]?.height === 2));
                        if (empty) updateCharacter({ inventorySlots: { ...slots, [empty]: { 
                          id: Math.random().toString(36).substr(2,9), name: c.name, type: 'condition', isCondition: true,
                          conditionId: c.id, mechanic: c.effect, clear: c.clear, bgColor: '#fecaca', width: 1, height: 1, maxUsage: 0, usageDots: 0
                        }}});
                      }}
                        className="px-2 py-1 rounded text-xs bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                      >{c.name}</button>
                    ))}
                    </div>
                  </details>
                </div>
              </ResultCard>

              {/* Info */}
              <ResultCard title="📋 Info">
                <div className="space-y-2 text-sm">
                  <p><strong>Původ:</strong> {character.origin?.name || character.background || '—'}</p>
                  <p><strong>Znamení:</strong> {character.birthsign?.sign || character.birthsign?.name} <span className="text-stone-500">({character.birthsign?.trait || character.birthsign?.traits})</span></p>
                  {character.fur && (
                    <p><strong>Srst:</strong> {character.fur.color}, {character.fur.pattern?.toLowerCase()}</p>
                  )}
                  <p><strong>Výrazný rys:</strong> {character.distinctiveFeature || character.physicalDetail || '—'}</p>
                  <p><strong>XP:</strong> {character.xp || 0}</p>
                </div>
              </ResultCard>
            </>
          )}

          {/* Hireling-only sections */}
          {character.type === 'hireling' && (
            <HirelingSheet
              character={character}
              updateCharacter={updateCharacter}
              editMode={editMode}
              setEditMode={setEditMode}
              onLogEntry={onLogEntry}
              treasuryTotal={treasuryTotal}
              onPayHireling={() => payHireling(character)}
            />
          )}
        </>
      )}
    </div>
  );
};

// ========== HIRELING SHEET COMPONENT ==========
const HirelingSheet = ({ character, updateCharacter, editMode, setEditMode, onLogEntry, treasuryTotal, onPayHireling }) => {
  // Get hireling type info if available
  const hirelingTypeInfo = character.hirelingType && character.hirelingType !== 'generic'
    ? HIRELING_TYPES.find(t => t.type === character.hirelingType)
    : null;

  // Migrate old hirelings that don't have stats
  React.useEffect(() => {
    if (!character.STR) {
      const roll2k6 = () => Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      const str = roll2k6();
      const dex = roll2k6();
      const wil = roll2k6();
      const hp = character.hp?.max || Math.floor(Math.random() * 6) + 1;
      updateCharacter({
        STR: { current: str, max: str },
        DEX: { current: dex, max: dex },
        WIL: { current: wil, max: wil },
        hp: { current: hp, max: hp },
        inventorySlots: character.inventorySlots || {
          strongPaw1: null, strongPaw2: null,
          weakPaw1: null, weakPaw2: null
        }
      });
    }
  }, [character.id]);

  const updateStat = (stat, field, delta) => {
    const current = character[stat]?.[field] || 0;
    const max = field === 'current' ? (character[stat]?.max || 12) : 12;
    const newVal = Math.max(0, Math.min(max, current + delta));
    updateCharacter({ [stat]: { ...character[stat], [field]: newVal } });
  };

  // Hireling inventory slots
  const HIRELING_SLOTS = ['strongPaw1', 'strongPaw2', 'weakPaw1', 'weakPaw2'];

  return (
    <ResultCard>
      {/* Header with skill */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-stone-600">
          {hirelingTypeInfo && <span className="font-medium text-amber-800">{hirelingTypeInfo.skill}</span>}
          {!hirelingTypeInfo && character.physicalDetail && <span className="italic">{character.physicalDetail}</span>}
        </div>
        <Button size="small" variant="ghost" onClick={() => {
          const { dice, total } = roll2D6();
          const threshold = character.WIL?.current || 7;
          const success = total <= threshold;
          alert(`Morálka: [${dice.join(', ')}] = ${total} vs VŮL ${threshold}\n${success ? '✓ Zůstává!' : '✗ UTEČE!'}`);
        }}>
          🎲 Morálka
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 mb-3">
        {[
          { key: 'STR', label: 'SÍL', color: 'red' },
          { key: 'DEX', label: 'MRŠ', color: 'green' },
          { key: 'WIL', label: 'VŮL', color: 'blue' },
          { key: 'hp', label: 'BO', color: 'amber' }
        ].map(({ key, label, color }) => (
          <div key={key} className={`flex-1 text-center p-2 bg-${color}-50 rounded`}>
            <div className={`text-xs text-${color}-600`}>{label}</div>
            <div className="flex items-center justify-center gap-1">
              <button className="w-5 h-5 text-xs bg-stone-200 rounded hover:bg-stone-300" onClick={() => updateStat(key, 'current', -1)}>-</button>
              <span className={`font-bold text-${color}-700`}>{character[key]?.current || '?'}/{character[key]?.max || '?'}</span>
              <button className="w-5 h-5 text-xs bg-stone-200 rounded hover:bg-stone-300" onClick={() => updateStat(key, 'current', 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory + Money row */}
      <div className="flex gap-2">
        <div className="flex-1 grid grid-cols-4 gap-1">
          {['strongPaw1', 'strongPaw2', 'weakPaw1', 'weakPaw2'].map(slotId => {
            const item = character.inventorySlots?.[slotId];
            return (
              <div key={slotId} className="h-10 border border-dashed border-stone-300 rounded flex items-center justify-center bg-stone-50 text-xs">
                {item ? (
                  <span className="truncate px-1" title={item.name}>{item.name}</span>
                ) : (
                  <span className="text-stone-300">—</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <div className="text-xs text-stone-500 mb-1">💰 Mzda: {hirelingTypeInfo?.cost || character.cost || '1 ď'}</div>
          <button
            onClick={onPayHireling}
            className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Vyplatit
          </button>
        </div>
      </div>
    </ResultCard>
  );
};

// ========== PC SHEET COMPONENT ==========
const PCSheet = ({ character, updateCharacter, editMode, setEditMode, onLogEntry }) => {
  
  const updateAttribute = (attr, field, value) => {
    const parsed = parseInt(value) || 0;
    updateCharacter({
      [attr]: {
        ...character[attr],
        [field]: Math.max(0, Math.min(18, parsed))
      }
    });
  };

  const updateHP = (delta) => {
    const newHP = Math.max(0, Math.min(character.hp.max, character.hp.current + delta));
    updateCharacter({ hp: { ...character.hp, current: newHP } });
    onLogEntry({
      type: 'state_change',
      subtype: 'hp',
      timestamp: formatTimestamp(),
      change: delta,
      newValue: newHP
    });
  };

  const updatePips = (delta) => {
    updateCharacter({ pips: Math.max(0, (character.pips || 0) + delta) });
  };

  const toggleCondition = (condId) => {
    const hasCondition = character.conditions?.includes(condId);
    updateCharacter({
      conditions: hasCondition
        ? character.conditions.filter(c => c !== condId)
        : [...(character.conditions || []), condId]
    });
  };

  const addInventoryItem = () => {
    updateCharacter({
      inventory: [...(character.inventory || []), {
        id: generateId(),
        name: 'Nový předmět',
        slot: 1,
        usageDots: 0,
        maxUsage: 3
      }]
    });
  };

  const updateInventoryItem = (id, field, value) => {
    updateCharacter({
      inventory: character.inventory.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const removeInventoryItem = (id) => {
    updateCharacter({
      inventory: character.inventory.filter(item => item.id !== id)
    });
  };

  return (
    <>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setEditMode(!editMode)} variant="ghost">
          {editMode ? '✓ Hotovo' : '✏️ Upravit'}
        </Button>
      </div>

      {/* Basic Info */}
      <ResultCard title="📋 Základní údaje">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-stone-500 block">Level</label>
            <p className="font-bold text-lg text-amber-900">{character.level || 1}</p>
          </div>
          <div>
            <label className="text-sm text-stone-500 block">Znamení</label>
            <p className="font-bold text-amber-900">
              {character.birthsign?.name || '—'}
              {character.birthsign?.traits && (
                <span className="font-normal text-sm text-stone-600 block">{character.birthsign.traits}</span>
              )}
            </p>
          </div>
          <div>
            <label className="text-sm text-stone-500 block">Fyzický detail</label>
            <p className="text-stone-700">{character.physicalDetail || '—'}</p>
          </div>
          <div>
            <label className="text-sm text-stone-500 block">Zájmena</label>
            {editMode ? (
              <Input value={character.pronouns || ''} onChange={(v) => updateCharacter({ pronouns: v })} />
            ) : (
              <p className="text-stone-700">{character.pronouns || '—'}</p>
            )}
          </div>
        </div>
      </ResultCard>

      {/* Attributes */}
      <ResultCard>
        <HelpHeader 
          title="Atributy" 
          icon="💪"
          tooltip={
            <div>
              <p className="font-bold mb-2">🎯 Atributy postavy</p>
              
              <p className="font-bold mb-1">📊 Co znamenají:</p>
              <ul className="text-xs space-y-1 mb-2">
                <li><b>STR (Síla)</b> = fyzická síla, zdraví, odolnost</li>
                <li><b>DEX (Mrštnost)</b> = rychlost, obratnost, reflexy</li>
                <li><b>WIL (Vůle)</b> = odvaha, vůle, magie</li>
              </ul>
              
              <p className="font-bold mb-1">🎲 Jak házet Save:</p>
              <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                <li>Hoď d20</li>
                <li>Musíš hodit <b>≤ current hodnota</b> atributu</li>
                <li>Čím nižší hod, tím lepší (1 = vždy úspěch)</li>
              </ol>
              
              <p className="font-bold mb-1">💔 Poškození atributů:</p>
              <p className="text-xs text-stone-300">
                Když HP klesne na 0, poškození jde do STR. Kritické zásahy mohou poškodit DEX nebo WIL. Pokud atribut klesne na 0, postava je mimo hru.
              </p>
            </div>
          }
        />
        <div className="grid grid-cols-3 gap-4">
          {['STR', 'DEX', 'WIL'].map(attr => (
            <div key={attr} className="text-center p-4 bg-amber-100 rounded-lg">
              <div className="text-sm font-bold text-amber-800 mb-2">{attr}</div>
              {editMode ? (
                <div className="space-y-2">
                  <Input 
                    type="number" value={character[attr]?.current || 10}
                    onChange={(v) => updateAttribute(attr, 'current', v)}
                    className="text-center"
                  />
                  <Input 
                    type="number" value={character[attr]?.max || 10}
                    onChange={(v) => updateAttribute(attr, 'max', v)}
                    className="text-center text-sm"
                  />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-amber-900">{character[attr]?.current || 10}</div>
                  <div className="text-sm text-stone-500">max: {character[attr]?.max || 10}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </ResultCard>

      {/* HP, Pips, XP */}
      <ResultCard>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <label className="text-sm text-stone-500 block mb-1">❤️ HP</label>
            <div className="text-3xl font-bold text-red-700">
              {character.hp?.current || 0}
              <span className="text-xl text-stone-500">/{character.hp?.max || 6}</span>
            </div>
            <div className="flex justify-center gap-1 mt-2">
              <Button size="small" variant="danger" onClick={() => updateHP(-1)}>-1</Button>
              <Button size="small" variant="success" onClick={() => updateHP(1)}>+1</Button>
              <Button size="small" variant="ghost" onClick={() => updateHP(character.hp?.max - character.hp?.current)}>Full</Button>
            </div>
          </div>
          <div className="text-center">
            <label className="text-sm text-stone-500 block mb-1">💰 Pips</label>
            <div className="text-3xl font-bold text-amber-600">{character.pips || 0}</div>
            <div className="flex justify-center gap-1 mt-2">
              <Button size="small" variant="ghost" onClick={() => updatePips(-1)}>-1</Button>
              <Button size="small" variant="ghost" onClick={() => updatePips(1)}>+1</Button>
            </div>
          </div>
          <div className="text-center">
            <label className="text-sm text-stone-500 block mb-1">⭐ XP</label>
            <div className="text-2xl font-bold text-purple-700">{character.xp || 0}</div>
            <div className="flex justify-center gap-1 mt-2">
              <Button size="small" onClick={() => updateCharacter({ xp: (character.xp || 0) + 10 })}>+10</Button>
              <Button size="small" onClick={() => updateCharacter({ xp: (character.xp || 0) + 50 })}>+50</Button>
            </div>
          </div>
        </div>
      </ResultCard>

      {/* Conditions */}
      <ResultCard>
        <HelpHeader title="Stavy" icon="🩹" tooltip={
          <div>
            <p className="font-bold mb-2">🎯 Stavy postavy</p>
            <p className="text-xs mb-2">Klikni na stav pro aktivaci/deaktivaci. Aktivní stavy zabírají slot v inventáři!</p>
            
            <p className="font-bold mb-1">📋 Stavy:</p>
            <ul className="text-xs space-y-1">
              <li>😰 <b>Vyděšený</b> = -1 na WIL saves, z boje uteč nebo bojuj s nevýhodou</li>
              <li>😵 <b>Vyčerpaný</b> = -1 na všechny saves, potřebuješ odpočinek</li>
              <li>🤢 <b>Otrávený</b> = -1 na STR saves, hoď d6 po každém odpočinku (6 = vyléčen)</li>
              <li>😫 <b>Hladový</b> = nemůžeš léčit HP, zabírá 2 sloty</li>
            </ul>
            
            <p className="text-xs text-stone-300 mt-2 italic">
              💡 Stavy se léčí odpočinkem, jídlem, nebo speciálními předměty.
            </p>
          </div>
        } />
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map(cond => (
            <button
              key={cond.id}
              onClick={() => toggleCondition(cond.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                character.conditions?.includes(cond.id)
                  ? 'bg-red-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
              title={cond.effect}
            >
              {cond.name}
            </button>
          ))}
        </div>
      </ResultCard>

      {/* Inventory */}
      <ResultCard>
        <HelpHeader title="Inventář" icon="🎒" tooltip={
          <div>
            <p className="font-bold mb-2">🎯 Systém inventáře</p>
            <p className="text-xs mb-2">Myš má omezený prostor - každý předmět zabírá sloty. Přetížení = pomalost!</p>
            
            <p className="font-bold mb-1">📦 Typy slotů:</p>
            <ul className="text-xs space-y-1 mb-2">
              <li>🖐️ <b>Ruce (2)</b> = zbraně a štíty pro boj</li>
              <li>🎒 <b>Tělo (6)</b> = hlavní inventář</li>
              <li>📦 <b>Balení</b> = rozšíření přes batoh/vak</li>
            </ul>
            
            <p className="font-bold mb-1">⚙️ Opotřebení (Usage Die):</p>
            <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
              <li>Po použití předmětu (pochodeň, lano, jídlo...) hoď d6</li>
              <li>Na <b>1-3</b> = označ tečku (●) na předmětu</li>
              <li>Když jsou všechny tečky označeny = předmět je spotřebován</li>
            </ol>
            
            <p className="text-xs text-stone-300 italic">
              💡 Klikni na předmět pro jeho použití/označení.
            </p>
          </div>
        } />
        <div className="space-y-2">
          {character.inventory?.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
              <Input 
                value={item.name}
                onChange={(v) => updateInventoryItem(item.id, 'name', v)}
                className="flex-1"
              />
              <div className="flex gap-1">
                {[0, 1, 2].map(dot => (
                  <button
                    key={dot}
                    onClick={() => updateInventoryItem(item.id, 'usageDots', dot < item.usageDots ? dot : dot + 1)}
                    className={`w-4 h-4 rounded-full border-2 ${
                      dot < item.usageDots ? 'bg-amber-600 border-amber-600' : 'border-amber-400'
                    }`}
                  />
                ))}
              </div>
              <Button size="small" variant="ghost" onClick={() => removeInventoryItem(item.id)}>✕</Button>
            </div>
          ))}
          <Button size="small" variant="ghost" onClick={addInventoryItem} className="w-full">
            + Přidat předmět
          </Button>
        </div>
      </ResultCard>
    </>
  );
};


// ============================================
// INVENTORY SLOT COMPONENT - Mausritter Style
// ============================================

// Responsive slot size hook - fills available width
const useSlotSize = (containerRef) => {
  const [size, setSize] = useState(44);
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef?.current) {
        // Calculate slot size based on container width
        // Layout: paw(1 slot) + body(1 slot) + pack(3 slots) = 5 columns + gaps
        const containerWidth = containerRef.current.offsetWidth;
        // 5 columns + 4 gaps (~12px each)
        const calculatedSize = Math.floor((containerWidth - 60) / 5);
        // Clamp between 44 and 120
        const newSize = Math.min(120, Math.max(44, calculatedSize));
        if (newSize !== size) setSize(newSize);
      }
    };
    
    // Initial update after render
    const timer = setTimeout(updateSize, 50);
    
    window.addEventListener('resize', updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
    };
  }, [containerRef, size]);
  
  return size;
};

const SLOT_SIZE = 44; // Default fallback

// Item detail popup
const ItemPopup = ({ item, slotId, onUpdate, onRemove, onMove, onClose }) => {
  const isCond = item.type === 'condition' || item.isCondition;
  const bg = item.bgColor || (isCond ? '#fecaca' : item.type === 'weapon' ? '#f1f5f9' : item.type === 'armor' ? '#e0e7ff' : '#fef3c7');
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: bg, border: '3px solid #292524', borderRadius: 8,
          width: '100%', maxWidth: 200, padding: 0, overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ background: isCond ? bg : '#fff', borderBottom: '2px solid #292524', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#78716c' }}>×</button>
        </div>
        
        {/* Stats */}
        <div style={{ padding: 12 }}>
          {/* Damage/Defense */}
          {(item.damageDef || item.damage || item.defense) && (
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#57534e' }}>{item.type === 'armor' ? 'Obrana:' : 'Poškození:'}</span>
              <span style={{ background: '#fff', border: '2px solid #292524', borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>
                {item.damageDef || item.damage || item.defense}
              </span>
            </div>
          )}
          
          {/* Weapon class */}
          {item.weaponClass && (
            <div style={{ marginBottom: 8, fontSize: 12, color: '#57534e' }}>
              Třída: <strong>{item.weaponClass}</strong>
            </div>
          )}
          
          {/* Usage dots */}
          {!isCond && item.maxUsage > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#57534e', marginBottom: 4 }}>Použití:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0,1,2].map(i => (
                  <button
                    key={i}
                    onClick={() => onUpdate(slotId, 'usageDots', i < (item.usageDots||0) ? i : i+1)}
                    className="active:scale-90 hover:scale-110 transition-transform duration-100"
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      border: '3px solid #292524',
                      background: i < (item.usageDots||0) ? '#292524' : 'transparent',
                      cursor: 'pointer',
                      boxShadow: i < (item.usageDots||0) ? 'inset 0 2px 4px rgba(0,0,0,0.3)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Condition info */}
          {isCond && (
            <div style={{ fontSize: 12 }}>
              {item.mechanic && <div style={{ marginBottom: 4, fontStyle: 'italic' }}>{item.mechanic}</div>}
              {item.clear && <div><strong>Odstranění:</strong> {item.clear}</div>}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div style={{ borderTop: '2px solid #292524', padding: 8, display: 'flex', gap: 8 }}>
          <button
            onClick={() => { onMove(slotId); onClose(); }}
            style={{ flex: 1, padding: '8px', background: '#fef3c7', border: '2px solid #292524', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}
          >
            ↔ Přesunout
          </button>
          <button
            onClick={() => { onRemove(slotId); onClose(); }}
            style={{ flex: 1, padding: '8px', background: '#fecaca', border: '2px solid #292524', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}
          >
            🗑 Smazat
          </button>
        </div>
      </div>
    </div>
  );
};

// Inventory slot
const InvSlot = ({ id, slots, color, onMove, onUpdate, onRemove, updateChar, aboveId, belowId, selectedSlot, setSelectedSlot, setPopupItem, slotSize = 44 }) => {
  const slot = slots?.[id];
  const aboveSlot = aboveId ? slots?.[aboveId] : null;
  
  const isBlocked = aboveSlot?.height === 2;
  const isSelected = selectedSlot === id;
  const isTarget = selectedSlot && selectedSlot !== id;
  
  const colors = {
    amber: { bg: '#fef3c7', border: '#fcd34d', ring: '#f59e0b' },
    blue: { bg: '#dbeafe', border: '#93c5fd', ring: '#3b82f6' },
    stone: { bg: '#f5f5f4', border: '#d6d3d1', ring: '#78716c' }
  };
  const c = colors[color] || colors.stone;
  
  const is2H = slot?.height === 2;
  
  if (isBlocked) {
    return <div style={{ width: slotSize, height: slotSize }} />;
  }
  
  const handleClick = () => {
    if (selectedSlot && selectedSlot !== id) {
      // Move from selected slot to this slot
      onMove(selectedSlot, id);
      setSelectedSlot(null);
    } else if (slot) {
      // Open popup for this item
      setPopupItem({ item: slot, slotId: id });
    }
  };
  
  return (
    <div
      onClick={handleClick}
      style={{
        width: slotSize,
        height: slotSize,
        background: slot ? 'transparent' : c.bg,
        border: slot ? 'none' : `2px dashed ${c.border}`,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        overflow: is2H ? 'visible' : 'hidden',
        outline: isSelected ? `3px solid ${c.ring}` : (isTarget && !slot ? `2px solid ${c.ring}` : 'none'),
        cursor: 'pointer'
      }}
    >
      {slot && <MiniCard item={slot} is2H={is2H} isSelected={isSelected} slotSize={slotSize} />}
    </div>
  );
};

// Ultra-minimal card (just name + color)
const MiniCard = ({ item, is2H, isSelected, slotSize = 44 }) => {
  const isCond = item.type === 'condition' || item.isCondition;
  const cardSize = slotSize - 4;
  const bg = item.bgColor || (isCond ? '#fecaca' : item.type === 'weapon' ? '#f1f5f9' : item.type === 'armor' ? '#e0e7ff' : '#fef3c7');

  // Dynamic font size based on slot size
  const fontSize = Math.max(8, Math.floor(slotSize * 0.18));
  const fontSize2H = Math.max(9, Math.floor(slotSize * 0.16));
  const dotSize = Math.max(4, Math.floor(slotSize * 0.08));

  return (
    <div
      className="active:scale-95 active:brightness-90 transition-transform duration-100"
      style={{
        width: cardSize,
        height: is2H ? cardSize * 2 + 8 : cardSize,
        background: bg,
        border: isSelected ? '2px solid #f59e0b' : '1.5px solid #292524',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: is2H ? 'absolute' : 'relative',
        top: 0, left: 2, zIndex: is2H ? 10 : 1,
        boxShadow: isSelected ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none',
        padding: 2,
        textAlign: 'center',
        cursor: 'pointer'
      }}>
      <span style={{
        fontWeight: 700,
        fontSize: is2H ? fontSize2H : fontSize,
        lineHeight: 1.1,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: is2H ? 4 : 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {item.name}
      </span>
      {/* Small indicator for usage */}
      {!isCond && item.maxUsage > 0 && item.usageDots > 0 && (
        <div style={{ display: 'flex', gap: 1, marginTop: 2 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: i < item.usageDots ? '#292524' : '#d6d3d1' }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// ITEM CARD STUDIO PANEL
// ============================================

const ItemCardStudio = ({ parties, activePartyId, activeCharacterId, updateCharacterInParty }) => {
  const [template, setTemplate] = useState('item');
  const [cardData, setCardData] = useState({
    name: 'Nový předmět',
    type: 'item',
    // Dimensions
    width: 1,
    height: 1,
    // Weapon/Armor specific
    damageDef: '',
    weaponClass: '',
    // Item/Weapon/Armor/Spell specific
    usageDots: 0,
    maxUsage: 3,
    // Condition specific
    mechanic: '',
    clear: '',
    // Freeform only
    star: false,
    // Visual
    icon: 'generic',
    bgColor: '#fef3c7',
    textColor: '#1c1917',
    showDivider: true,
    showBorder: true
  });
  const [libraryFilter, setLibraryFilter] = useState('all');

  // Get active character
  const activeParty = parties?.find(p => p.id === activePartyId);
  const activeCharacter = activeParty?.members?.find(m => m.id === activeCharacterId);

  // Template presets with category-specific defaults
  const templates = {
    item: { 
      type: 'item', 
      bgColor: '#fef3c7', // amber
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: '', weaponClass: '', mechanic: '', clear: '', star: false
    },
    weapon: { 
      type: 'weapon', 
      bgColor: '#f8fafc', // white
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: 'k6/k8',
      weaponClass: 'Medium',
      mechanic: '', clear: '', star: false
    },
    armor: { 
      type: 'armor', 
      bgColor: '#f8fafc',
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 2,
      damageDef: '1 def',
      weaponClass: 'Heavy',
      mechanic: '', clear: '', star: false
    },
    spell: { 
      type: 'spell', 
      bgColor: '#f8fafc',
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: '', weaponClass: '',
      mechanic: '', clear: '', star: false
    },
    condition: { 
      type: 'condition', 
      bgColor: '#ff4444', // rgb(255, 68, 68)
      textColor: '#1c1917',
      maxUsage: 0,
      width: 1, height: 1,
      damageDef: '', weaponClass: '',
      mechanic: 'Nevýhoda na záchranu síly a obratnosti',
      clear: 'After full rest',
      star: false
    },
    freeform: { 
      type: 'freeform', 
      bgColor: '#f5f5f4',
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: '', weaponClass: '', mechanic: '', clear: '', star: false
    }
  };

  // Weapon class options
  const weaponClasses = [
    { value: '', label: '---' },
    { value: 'Light', label: 'Light' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Heavy', label: 'Heavy' }
  ];

  // Image/icon options - matching original exactly
  const iconOptions = [
    { value: 'generic', label: 'Nic' },
    { value: 'custom', label: 'Vlastní...' },
    { value: 'divider1', label: '──────────', disabled: true },
    { value: 'torch', label: 'Pochodeň' },
    { value: 'lantern', label: 'Lucerna' },
    { value: 'flashlight', label: 'Elektrická svítilna' },
    { value: 'pouch', label: 'Váček na ďobky' },
    { value: 'quiver', label: 'Toulec' },
    { value: 'rations', label: 'Zásoby' },
    { value: 'stones', label: 'Kameny' },
    { value: 'divider2', label: '──────────', disabled: true },
    { value: 'branch', label: 'Větev' },
    { value: 'dagger', label: 'Dýka' },
    { value: 'needle', label: 'Jehla' },
    { value: 'axe', label: 'Sekera' },
    { value: 'sword', label: 'Meč' },
    { value: 'mace', label: 'Palcát' },
    { value: 'warhammer', label: 'Válečné kladivo' },
    { value: 'spear', label: 'Kopí' },
    { value: 'hook', label: 'Hákopí' },
    { value: 'bow', label: '"Luk"' },
    { value: 'sling', label: 'Prak' },
    { value: 'divider3', label: '──────────', disabled: true },
    { value: 'heavyarmor', label: 'Těžká zbroj' },
    { value: 'lightarmor', label: 'Lehká zbroj' },
    { value: 'divider4', label: '──────────', disabled: true },
    { value: 'spell1', label: 'Kouzlo 1' },
    { value: 'spell2', label: 'Kouzlo 2' },
    { value: 'spell3', label: 'Kouzlo 3' },
    { value: 'spell4', label: 'Kouzlo 4' },
    { value: 'spell5', label: 'Kouzlo 5' },
    { value: 'spellempty', label: 'Kouzlo (prázdné)' }
  ];

  // Handle template change
  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    const preset = templates[newTemplate];
    setCardData(prev => ({
      ...prev,
      ...preset,
      name: newTemplate === 'condition' ? 'Nový stav' : 
            newTemplate === 'weapon' ? 'Nová zbraň' :
            newTemplate === 'armor' ? 'Nová zbroj' :
            newTemplate === 'spell' ? 'Nové kouzlo' : 'Nový předmět'
    }));
  };

  // Calculate slots from width × height
  const calculateSlots = () => cardData.width * cardData.height;

  // Add to character inventory
  const addToInventory = () => {
    if (!activeCharacter || !activePartyId) {
      alert('Nejprve vyber postavu v záložce Postavy');
      return;
    }

    const slots = activeCharacter.inventorySlots || {};
    const packSlots = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'];
    const emptySlot = packSlots.find(s => !slots[s]);
    
    if (!emptySlot) {
      alert('Batoh je plný!');
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...cardData,
      slots: calculateSlots()
    };

    updateCharacterInParty(activePartyId, activeCharacterId, {
      inventorySlots: { ...slots, [emptySlot]: newItem }
    });

    alert(`"${cardData.name}" přidáno do inventáře ${activeCharacter.name}!`);
  };

  // Add from library
  const addFromLibrary = (libraryItem) => {
    if (!activeCharacter || !activePartyId) {
      alert('Nejprve vyber postavu v záložce Postavy');
      return;
    }

    const slots = activeCharacter.inventorySlots || {};
    const packSlots = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'];
    const emptySlot = packSlots.find(s => !slots[s]);
    
    if (!emptySlot) {
      alert('Batoh je plný!');
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...libraryItem,
      usageDots: 0
    };

    updateCharacterInParty(activePartyId, activeCharacterId, {
      inventorySlots: { ...slots, [emptySlot]: newItem }
    });

    alert(`"${libraryItem.name}" přidáno do inventáře ${activeCharacter.name}!`);
  };

  // Updated library with proper Mausritter data
  const itemLibrary = {
    weapons: [
      { name: 'Jehla', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'needle' },
      { name: 'Dýka', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'dagger' },
      { name: 'Větev', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'branch' },
      { name: 'Meč', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'sword' },
      { name: 'Sekera', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'axe' },
      { name: 'Palcát', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'mace' },
      { name: 'Válečné kladivo', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'warhammer' },
      { name: 'Kopí', type: 'weapon', damageDef: 'k10', weaponClass: 'Heavy', width: 1, height: 2, maxUsage: 3, icon: 'spear' },
      { name: 'Hákopí', type: 'weapon', damageDef: 'k10', weaponClass: 'Heavy', width: 1, height: 2, maxUsage: 3, icon: 'hook' },
      { name: '"Luk"', type: 'weapon', damageDef: 'k6', weaponClass: 'Medium', width: 2, height: 1, maxUsage: 3, icon: 'bow' },
      { name: 'Prak', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'sling' },
    ],
    armor: [
      { name: 'Lehká zbroj', type: 'armor', damageDef: '1 def', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'lightarmor' },
      { name: 'Těžká zbroj', type: 'armor', damageDef: '1 def', weaponClass: 'Heavy', width: 1, height: 2, maxUsage: 3, icon: 'heavyarmor' },
    ],
    items: [
      { name: 'Pochodeň', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'torch' },
      { name: 'Lucerna', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'lantern' },
      { name: 'Elektrická svítilna', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'flashlight' },
      { name: 'Váček na ďobky', type: 'item', width: 1, height: 1, maxUsage: 0, icon: 'pouch' },
      { name: 'Toulec', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'quiver' },
      { name: 'Zásoby', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'rations' },
      { name: 'Kameny', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'stones' },
    ],
    conditions: [
      { name: 'Vyčerpaný', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Nevýhoda na fyzické hody', clear: 'After full rest' },
      { name: 'Vystrašený', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Musí prchat od zdroje strachu', clear: 'After safe rest' },
      { name: 'Zraněný', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Nevýhoda na záchranu SÍL a MRŠ', clear: 'After full rest' },
      { name: 'Hladový', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: '-1 na všechny hody', clear: 'After eating' },
      { name: 'Nemocný', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Nemůže se léčit přirozeně', clear: 'After treatment or week' },
      { name: 'Otrávený', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: '1 poškození za směnu', clear: 'After antidote' },
    ],
    spells: [
      { name: 'Kouzlo 1', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell1' },
      { name: 'Kouzlo 2', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell2' },
      { name: 'Kouzlo 3', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell3' },
      { name: 'Kouzlo 4', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell4' },
      { name: 'Kouzlo 5', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell5' },
    ]
  };

  // Filter library items
  const getFilteredLibrary = () => {
    if (libraryFilter === 'all') {
      return [
        ...itemLibrary.weapons,
        ...itemLibrary.armor,
        ...itemLibrary.items,
        ...itemLibrary.conditions,
        ...itemLibrary.spells
      ];
    }
    return itemLibrary[libraryFilter] || [];
  };

  // Visual Card Preview - compact professional style
  const CardPreview = () => {
    const isCond = cardData.type === 'condition';
    const isWA = cardData.type === 'weapon' || cardData.type === 'armor';
    
    // 70px base for consistency with inventory
    const w = cardData.width * 70;
    const h = cardData.height * 70;
    
    return (
      <div style={{
        width: w, height: h,
        background: cardData.bgColor,
        border: '2px solid #292524',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: isCond ? cardData.bgColor : '#fff',
          borderBottom: '2px solid #292524',
          padding: '3px 6px',
          fontWeight: 700,
          fontSize: 11,
          color: cardData.textColor
        }}>
          {cardData.name}
        </div>
        
        {/* Stats row */}
        {!isCond && (
          <div style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d6d3d1' }}>
            {cardData.maxUsage > 0 ? (
              <div style={{ display: 'flex', gap: 3 }}>
                {Array(Math.min(cardData.maxUsage, 6)).fill(0).map((_, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #292524', background: i < cardData.usageDots ? '#292524' : 'transparent' }} />
                ))}
              </div>
            ) : <span />}
            {cardData.damageDef && (
              <span style={{ background: '#fff', border: '1px solid #292524', borderRadius: 2, padding: '0 4px', fontSize: 10, fontWeight: 700 }}>
                {cardData.damageDef}
              </span>
            )}
          </div>
        )}
        
        {/* Content */}
        {isCond ? (
          <div style={{ flex: 1, padding: 6, fontSize: 10, color: cardData.textColor, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, fontStyle: 'italic' }}>{cardData.mechanic}</div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.2)', paddingTop: 4, marginTop: 4 }}>
              <strong>Clear:</strong> {cardData.clear}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        
        {/* Footer */}
        {isWA && cardData.weaponClass && (
          <div style={{ borderTop: '1px solid #d6d3d1', padding: '2px 6px', fontSize: 10, color: cardData.textColor }}>
            {cardData.weaponClass}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="🎴" 
        title="Item Card Studio" 
        subtitle="Vytvoř vlastní kartičky jako v originále"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <ResultCard title="📝 Editor kartičky">
          {/* Template selector */}
          <div className="mb-4">
            <label className="text-sm font-bold text-stone-500 block mb-2">Šablona</label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
            >
              <option value="item">Předmět</option>
              <option value="weapon">Zbraň</option>
              <option value="armor">Zbroj</option>
              <option value="spell">Kouzlo</option>
              <option value="condition">Stav</option>
              <option value="freeform">Freeform</option>
            </select>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-bold text-stone-500 block mb-2">Název:</label>
            <input
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
            />
          </div>

          {/* WEAPON FIELDS: Damage/Def, Class, Použití, Obrázek */}
          {template === 'weapon' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Damage/Def:</label>
                  <input
                    value={cardData.damageDef}
                    onChange={(e) => setCardData(prev => ({ ...prev, damageDef: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                    placeholder="k6/k8"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Class:</label>
                  <select
                    value={cardData.weaponClass}
                    onChange={(e) => setCardData(prev => ({ ...prev, weaponClass: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
                  >
                    {weaponClasses.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ARMOR FIELDS: Damage/Def, Class, Použití, Obrázek */}
          {template === 'armor' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Damage/Def:</label>
                  <input
                    value={cardData.damageDef}
                    onChange={(e) => setCardData(prev => ({ ...prev, damageDef: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                    placeholder="1 def"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Class:</label>
                  <select
                    value={cardData.weaponClass}
                    onChange={(e) => setCardData(prev => ({ ...prev, weaponClass: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
                  >
                    <option value="Light">Light</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* CONDITION FIELDS: Mechanic, Clear (NO Použití, NO Obrázek) */}
          {template === 'condition' && (
            <>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Mechanic:</label>
                <input
                  value={cardData.mechanic}
                  onChange={(e) => setCardData(prev => ({ ...prev, mechanic: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                  placeholder="Nevýhoda na záchranu síly a obratnosti"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Clear:</label>
                <input
                  value={cardData.clear}
                  onChange={(e) => setCardData(prev => ({ ...prev, clear: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                  placeholder="After full rest"
                />
              </div>
            </>
          )}

          {/* FREEFORM FIELDS: ALL fields */}
          {template === 'freeform' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Damage/Def:</label>
                  <input
                    value={cardData.damageDef}
                    onChange={(e) => setCardData(prev => ({ ...prev, damageDef: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Class:</label>
                  <select
                    value={cardData.weaponClass}
                    onChange={(e) => setCardData(prev => ({ ...prev, weaponClass: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
                  >
                    {weaponClasses.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Mechanic:</label>
                <input
                  value={cardData.mechanic}
                  onChange={(e) => setCardData(prev => ({ ...prev, mechanic: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Clear:</label>
                <input
                  value={cardData.clear}
                  onChange={(e) => setCardData(prev => ({ ...prev, clear: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardData.star}
                    onChange={(e) => setCardData(prev => ({ ...prev, star: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-bold text-stone-500">Star:</span>
                </label>
              </div>
            </>
          )}

          {/* POUŽITÍ - for all except condition */}
          {template !== 'condition' && (
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-2">Použití:</label>
              <input
                type="number"
                min="0"
                max="6"
                value={cardData.maxUsage}
                onChange={(e) => setCardData(prev => ({ ...prev, maxUsage: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
              />
            </div>
          )}

          {/* OBRÁZEK - for all except condition */}
          {template !== 'condition' && (
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-2">Obrázek:</label>
              <select
                value={cardData.icon}
                onChange={(e) => setCardData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                {iconOptions.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* DIMENSIONS - Width × Height */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Šířka</label>
              <select
                value={cardData.width}
                onChange={(e) => setCardData(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Výška</label>
              <select
                value={cardData.height}
                onChange={(e) => setCardData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

          {/* COLORS */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Pozadí</label>
              <input
                type="color"
                value={cardData.bgColor}
                onChange={(e) => setCardData(prev => ({ ...prev, bgColor: e.target.value }))}
                className="w-full h-10 rounded-lg cursor-pointer border-2 border-amber-300"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Text</label>
              <input
                type="color"
                value={cardData.textColor}
                onChange={(e) => setCardData(prev => ({ ...prev, textColor: e.target.value }))}
                className="w-full h-10 rounded-lg cursor-pointer border-2 border-amber-300"
              />
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.showDivider}
                onChange={(e) => setCardData(prev => ({ ...prev, showDivider: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm">Oddělovač</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.showBorder}
                onChange={(e) => setCardData(prev => ({ ...prev, showBorder: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm">Okraj</span>
            </label>
          </div>

          {/* ADD BUTTON */}
          <Button onClick={addToInventory} className="w-full">
            ➕ Přidat do inventáře {activeCharacter?.name || '(vyber postavu)'}
          </Button>
        </ResultCard>

        {/* Preview & Library */}
        <div className="space-y-6">
          {/* Preview */}
          <ResultCard title="👁️ Náhled">
            <div className="flex items-center justify-center py-3 bg-stone-100 rounded">
              <CardPreview />
            </div>
            <p className="text-xs text-stone-400 text-center mt-1">
              {cardData.width}×{cardData.height}
            </p>
          </ResultCard>

          {/* Library */}
          <ResultCard title="📚 Knihovna předmětů">
            <div className="mb-4">
              <select
                value={libraryFilter}
                onChange={(e) => setLibraryFilter(e.target.value)}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                <option value="all">Vše</option>
                <option value="weapons">⚔️ Zbraně</option>
                <option value="armor">🛡️ Zbroje</option>
                <option value="items">📦 Předměty</option>
                <option value="conditions">🩹 Stavy</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {getFilteredLibrary().map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => addFromLibrary(item)}
                  className={`p-2 rounded-lg text-left text-sm transition-all hover:shadow-md border-2 ${
                    item.type === 'condition' ? 'bg-red-100 hover:bg-red-200 border-red-300' :
                    item.type === 'weapon' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' :
                    item.type === 'armor' ? 'bg-blue-100 hover:bg-blue-200 border-blue-300' :
                    'bg-amber-100 hover:bg-amber-200 border-amber-300'
                  }`}
                >
                  <div className="font-bold truncate text-xs">
                    {item.name}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    {item.damage && <span className="bg-white px-1 rounded">{item.damage}</span>}
                    {item.defense && <span className="bg-white px-1 rounded">{item.defense}</span>}
                    {item.weaponClass && <span>{item.weaponClass}</span>}
                    <span className="ml-auto">{item.width}×{item.height}</span>
                  </div>
                  {item.mechanic && <div className="text-xs text-red-600 truncate">{item.mechanic}</div>}
                </button>
              ))}
            </div>
          </ResultCard>
        </div>
      </div>
    </div>
  );
};

// ============================================
// WORLD GENERATOR PANEL
// ============================================


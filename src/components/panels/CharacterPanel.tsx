import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, FAMILY_NAMES, BIRTHSIGNS, FUR_COLORS, FUR_PATTERNS, DISTINCTIVE_FEATURES, ORIGINS, STARTING_WEAPONS, FIRST_NAMES, LAST_NAMES, PHYSICAL_DETAILS, HIRELING_TYPES, CONDITIONS } from '../../data/constants';
import { rollD6, roll2D6, rollK66, randomFrom, generateId, formatTimestamp } from '../../utils/helpers';
import { SectionHeader, ResultCard, Button, HelpHeader, Input } from '../ui/common';
import { useSlotSize, InvSlot, ItemPopup } from './ItemCardStudio';

// ============================================
// LEVEL UP — konstanty a helper funkce
// ============================================
// XP thresholds: index = cílová úroveň (level 2 = 1000 zk., atd.)
const XP_THRESHOLDS: number[] = [0, 0, 1000, 3000, 6000, 11000, 16000, 21000];
const getNextLevelXP = (level: number): number => {
  if (level + 1 < XP_THRESHOLDS.length) return XP_THRESHOLDS[level + 1];
  return XP_THRESHOLDS[XP_THRESHOLDS.length - 1] + (level - 5) * 5000;
};
const getGrit = (level: number): number => level <= 1 ? 0 : level <= 2 ? 1 : level <= 4 ? 2 : 3;

// ============================================
// LEVEL UP MODAL
// ============================================
const LevelUpModal = ({ character, onConfirm, onCancel }) => {
  const newLevel = (character.level || 1) + 1;
  const [phase, setPhase] = useState<'attrs' | 'hp' | 'done'>('attrs');
  const [attrRolls, setAttrRolls] = useState<{ STR: number; DEX: number; WIL: number } | null>(null);
  const [hpRolls, setHpRolls] = useState<{ dice: number[]; total: number; newMax: number } | null>(null);

  const rollAttributes = () => {
    const strRoll = Math.ceil(Math.random() * 20);
    const dexRoll = Math.ceil(Math.random() * 20);
    const wilRoll = Math.ceil(Math.random() * 20);
    setAttrRolls({ STR: strRoll, DEX: dexRoll, WIL: wilRoll });
    setPhase('hp');
  };

  const rollHP = () => {
    const dice: number[] = Array.from({ length: newLevel }, () => Math.ceil(Math.random() * 6));
    const total = dice.reduce((a, b) => a + b, 0);
    const currentMax = character.hp?.max || 6;
    const newMax = total > currentMax ? total : currentMax + 1;
    setHpRolls({ dice, total, newMax });
    setPhase('done');
  };

  const confirm = () => {
    if (!attrRolls || !hpRolls) return;
    const updates: Record<string, unknown> = { level: newLevel };
    const attrs = [
      { key: 'STR', roll: attrRolls.STR, current: character.STR?.max || 10, stat: character.STR },
      { key: 'DEX', roll: attrRolls.DEX, current: character.DEX?.max || 10, stat: character.DEX },
      { key: 'WIL', roll: attrRolls.WIL, current: character.WIL?.max || 10, stat: character.WIL },
    ];
    attrs.forEach(({ key, roll, current, stat }) => {
      if (roll > current) {
        updates[key] = { current: (stat?.current || current), max: current + 1 };
      }
    });
    updates['hp'] = {
      current: Math.min(character.hp?.current || hpRolls.newMax, hpRolls.newMax),
      max: hpRolls.newMax,
    };
    onConfirm(updates);
  };

  const attrLabel = { STR: 'SÍL', DEX: 'MRŠ', WIL: 'VŮL' };
  const attrMax = { STR: character.STR?.max || 10, DEX: character.DEX?.max || 10, WIL: character.WIL?.max || 10 };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-900 mb-1">🎉 Level Up!</h2>
        <p className="text-stone-600 mb-4">
          <strong>{character.name}</strong> postupuje na <strong>{newLevel}. úroveň</strong>
          {getGrit(newLevel) > getGrit(newLevel - 1) && (
            <span className="ml-2 text-sm text-blue-600 font-semibold">
              +Kuráž (celkem {getGrit(newLevel)})
            </span>
          )}
        </p>

        {/* Fáze 1: Atributy */}
        {phase === 'attrs' && (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">
              Hoď k20 pro každý atribut. Pokud je výsledek <strong>vyšší</strong> než aktuální max → +1.
            </p>
            <button
              onClick={rollAttributes}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg"
            >
              🎲 Hodit k20 pro SÍL / MRŠ / VŮL
            </button>
          </div>
        )}

        {/* Výsledky atributů + Fáze 2: HP */}
        {phase === 'hp' && attrRolls && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {(['STR', 'DEX', 'WIL'] as const).map(attr => {
                const roll = attrRolls[attr];
                const max = attrMax[attr];
                const improved = roll > max;
                return (
                  <div key={attr} className={`text-center p-3 rounded-xl ${improved ? 'bg-green-50 border-2 border-green-400' : 'bg-stone-50 border border-stone-200'}`}>
                    <div className="text-xs font-bold text-stone-500 mb-1">{attrLabel[attr]}</div>
                    <div className="text-xl font-black text-stone-800">k20={roll}</div>
                    <div className="text-xs text-stone-400">vs max={max}</div>
                    {improved
                      ? <div className="text-green-600 font-bold text-sm mt-1">✅ +1 → {max + 1}</div>
                      : <div className="text-stone-400 text-sm mt-1">— beze změny</div>
                    }
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-stone-500">
              Teď hoď {newLevel}k6 pro Body ochrany.
              Pokud je výsledek vyšší než aktuální max BO → nahradit.
            </p>
            <button
              onClick={rollHP}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg"
            >
              🎲 Hodit {newLevel}k6 pro BO
            </button>
          </div>
        )}

        {/* Fáze 3: Výsledky + Potvrzení */}
        {phase === 'done' && attrRolls && hpRolls && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {(['STR', 'DEX', 'WIL'] as const).map(attr => {
                const roll = attrRolls[attr];
                const max = attrMax[attr];
                const improved = roll > max;
                return (
                  <div key={attr} className={`text-center p-2 rounded-xl ${improved ? 'bg-green-50 border-2 border-green-400' : 'bg-stone-50 border border-stone-200'}`}>
                    <div className="text-xs font-bold text-stone-500">{attrLabel[attr]}</div>
                    <div className="text-sm text-stone-600">k20={roll}</div>
                    {improved
                      ? <div className="text-green-600 font-bold text-sm">✅ {max}→{max + 1}</div>
                      : <div className="text-stone-400 text-xs">beze změny</div>
                    }
                  </div>
                );
              })}
            </div>
            <div className={`p-3 rounded-xl ${hpRolls.total > (character.hp?.max || 6) ? 'bg-green-50 border-2 border-green-400' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="text-sm font-bold text-stone-700">❤️ Body ochrany ({newLevel}k6)</div>
              <div className="text-sm text-stone-500">
                Kostky: [{hpRolls.dice.join(', ')}] = {hpRolls.total}
                {' '}vs max={character.hp?.max || 6}
              </div>
              {hpRolls.total > (character.hp?.max || 6)
                ? <div className="text-green-600 font-bold text-sm mt-1">✅ Nahrazeno: {character.hp?.max || 6} → {hpRolls.newMax}</div>
                : <div className="text-blue-600 font-bold text-sm mt-1">+1: {character.hp?.max || 6} → {hpRolls.newMax}</div>
              }
            </div>
            <div className="flex gap-2">
              <button onClick={onCancel} className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl font-semibold">
                Zrušit
              </button>
              <button onClick={confirm} className="flex-2 flex-grow py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold">
                ✅ Potvrdit Level {newLevel}!
              </button>
            </div>
          </div>
        )}

        {phase !== 'done' && (
          <button onClick={onCancel} className="mt-3 w-full py-2 text-sm text-stone-400 hover:text-stone-600">
            Zrušit
          </button>
        )}
      </div>
    </div>
  );
};

const CharacterSheet = ({
  character,
  updateCharacter,
  onClose,
  compact = false,
  showInventory = true
}) => {
  const [openSection, setOpenSection] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [popupItem, setPopupItem] = useState(null);
  const inventoryRef = useRef(null);
  const slotSize = useSlotSize(inventoryRef);

  // Early return pokud není character
  if (!character) return null;

  // Bezpečné helper funkce
  const safeUpdateCharacter = (updates) => {
    try {
      if (updateCharacter && typeof updateCharacter === 'function') {
        updateCharacter(updates);
      }
    } catch (e) {
      console.error('Error updating character:', e);
    }
  };

  const updateHP = (delta) => {
    const currentHP = character?.hp?.current ?? 0;
    const maxHP = character?.hp?.max ?? 6;
    const newHP = Math.max(0, Math.min(maxHP, currentHP + delta));
    safeUpdateCharacter({ hp: { current: newHP, max: maxHP } });
  };

  const updatePips = (delta) => {
    const currentPips = character?.pips ?? 0;
    safeUpdateCharacter({ pips: Math.max(0, currentPips + delta) });
  };

  const updateAttribute = (attr, field, value) => {
    const parsed = parseInt(value) || 0;
    const currentAttr = character?.[attr] || { current: 10, max: 10 };
    safeUpdateCharacter({
      [attr]: { ...currentAttr, [field]: Math.max(1, Math.min(18, parsed)) }
    });
  };

  const moveInventoryItem = (fromSlot, toSlot) => {
    if (fromSlot === toSlot) return;
    const slots = { ...(character?.inventorySlots || {}) };
    const item = slots[fromSlot];
    if (!item) return;

    const belowMap = { mainPaw: 'offPaw', body1: 'body2', pack1: 'pack4', pack2: 'pack5', pack3: 'pack6' };
    const aboveMap = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };

    const aboveSlot = aboveMap[toSlot];
    if (aboveSlot && slots[aboveSlot]?.height === 2) return;

    if (item.height === 2) {
      const belowSlot = belowMap[toSlot];
      if (!belowSlot) return;
      if (slots[belowSlot] && belowSlot !== fromSlot) {
        alert('Potřebuješ 2 volné sloty pod sebou!');
        return;
      }
    }

    const targetItem = slots[toSlot];
    slots[toSlot] = item;
    slots[fromSlot] = targetItem || null;

    safeUpdateCharacter({ inventorySlots: slots });
  };

  const updateSlotItem = (slotId, field, value) => {
    const slots = { ...(character?.inventorySlots || {}) };
    if (slots[slotId]) {
      slots[slotId] = { ...slots[slotId], [field]: value };
      safeUpdateCharacter({ inventorySlots: slots });
    }
  };

  const removeSlotItem = (slotId) => {
    const slots = { ...(character?.inventorySlots || {}) };
    if (slots[slotId]?.isCondition && slots[slotId]?.conditionId) {
      safeUpdateCharacter({
        inventorySlots: { ...slots, [slotId]: null },
        conditions: (character?.conditions || []).filter(c => c !== slots[slotId].conditionId)
      });
    } else {
      slots[slotId] = null;
      safeUpdateCharacter({ inventorySlots: slots });
    }
  };

  // Bezpečné hodnoty pro HP bar
  const currentHP = character?.hp?.current ?? 0;
  const maxHP = character?.hp?.max ?? 1; // min 1 aby se předešlo dělení nulou
  const hpPercent = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  // Toggle sekce "O postavě"
  const handleAboutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSection(current => current === 'about' ? null : 'about');
  };

  return (
    <div className="flex flex-col h-full bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{character.type === 'pc' ? '🐭' : '🐿️'}</span>
            <div>
              <h2 className="text-xl font-bold">{character.name}</h2>
              <p className="text-amber-200 text-sm">
                {character.type === 'pc'
                  ? (character.background || `Level ${character.level || 1}`)
                  : 'Pomocník'}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-amber-600 rounded-lg text-xl">✕</button>
          )}
        </div>
        {/* HP Bar pod jménem */}
        <div className="mt-3 bg-amber-800/50 rounded-full h-2 overflow-hidden">
          <div className={`h-full ${hpColor} transition-all`} style={{ width: `${hpPercent}%` }} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* HP & Pips Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-xs text-stone-500 text-center mb-1">❤️ HP</div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => updateHP(-1)} className="w-8 h-8 bg-red-100 text-red-700 rounded-lg font-bold">−</button>
              <span className="text-xl font-bold text-red-700 min-w-[50px] text-center">
                {character.hp?.current || 0}/{character.hp?.max || 6}
              </span>
              <button onClick={() => updateHP(1)} className="w-8 h-8 bg-green-100 text-green-700 rounded-lg font-bold">+</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-xs text-stone-500 text-center mb-1">💰 Pips</div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => updatePips(-1)} className="w-8 h-8 bg-stone-100 text-stone-700 rounded-lg font-bold">−</button>
              <span className="text-xl font-bold text-amber-600 min-w-[50px] text-center">{character.pips || 0}</span>
              <button onClick={() => updatePips(1)} className="w-8 h-8 bg-stone-100 text-stone-700 rounded-lg font-bold">+</button>
            </div>
          </div>
        </div>

        {/* Attributes - jen pro PC */}
        {character.type === 'pc' && (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { key: 'STR', label: 'SÍL', color: 'red' },
                { key: 'DEX', label: 'MRŠ', color: 'green' },
                { key: 'WIL', label: 'VŮL', color: 'purple' }
              ].map(attr => (
                <div key={attr.key} className={`p-2 bg-${attr.color}-50 rounded-lg`}>
                  <div className={`text-xs font-bold text-${attr.color}-700 mb-1`}>{attr.label}</div>
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-lg font-bold text-${attr.color}-900`}>
                      {character[attr.key]?.current || 10}
                    </span>
                    <span className="text-stone-400 text-sm">/{character[attr.key]?.max || 10}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory */}
        {showInventory && (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-xs font-bold text-stone-600 mb-2">🎒 Inventář</div>

            {popupItem && (
              <ItemPopup
                item={popupItem.item}
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
                <button onClick={() => setSelectedSlot(null)} className="text-amber-600 hover:text-amber-800">✕</button>
              </div>
            )}

            <div ref={inventoryRef} className="flex gap-2 items-start justify-center">
              {/* Paws */}
              <div className="text-center">
                <div className="text-amber-600 text-xs mb-1">🐾</div>
                <div className="flex flex-col gap-1">
                  <InvSlot id="mainPaw" slots={character.inventorySlots} color="amber"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} belowId="offPaw" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                  <InvSlot id="offPaw" slots={character.inventorySlots} color="amber"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} aboveId="mainPaw" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                </div>
              </div>

              {/* Body */}
              <div className="text-center">
                <div className="text-blue-600 text-xs mb-1">👕</div>
                <div className="flex flex-col gap-1">
                  <InvSlot id="body1" slots={character.inventorySlots} color="blue"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} belowId="body2" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                  <InvSlot id="body2" slots={character.inventorySlots} color="blue"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} aboveId="body1" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                </div>
              </div>

              {/* Pack */}
              <div className="text-center flex-1">
                <div className="text-stone-500 text-xs mb-1">🎒</div>
                <div className="grid grid-cols-3 gap-1">
                  {['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'].map(packId => (
                    <InvSlot key={packId} id={packId} slots={character.inventorySlots} color="stone"
                      onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                      updateChar={updateCharacter}
                      belowId={packId.endsWith('1') ? 'pack4' : packId.endsWith('2') ? 'pack5' : packId.endsWith('3') ? 'pack6' : null}
                      aboveId={packId.endsWith('4') ? 'pack1' : packId.endsWith('5') ? 'pack2' : packId.endsWith('6') ? 'pack3' : null}
                      slotSize={Math.min(slotSize, 50)}
                      selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* O postavě - collapsible */}
        {character?.type === 'pc' && (character?.birthsign || character?.physicalDetail) && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={handleAboutClick}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-stone-50"
            >
              <span className="text-sm font-bold text-stone-600">📜 O postavě</span>
              <span className="text-stone-400">{openSection === 'about' ? '▼' : '▶'}</span>
            </button>
            {openSection === 'about' && character && (
              <div className="px-3 pb-3 space-y-2 text-sm">
                {character.birthsign && (
                  <div className="flex gap-2">
                    <span className="text-stone-500">⭐ Znamení:</span>
                    <span className="text-stone-700">{String(character.birthsign)}</span>
                  </div>
                )}
                {character.physicalDetail && (
                  <div className="flex gap-2">
                    <span className="text-stone-500">👁️ Vzhled:</span>
                    <span className="text-stone-700">{String(character.physicalDetail)}</span>
                  </div>
                )}
                {character.background && (
                  <div className="flex gap-2">
                    <span className="text-stone-500">📖 Původ:</span>
                    <span className="text-stone-700">{String(character.background)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CHARACTER SIDE PANEL - Vysouvací panel zleva
// ============================================

const CharacterSidePanel = ({
  isOpen,
  onClose,
  character,
  updateCharacter
}) => {
  const panelRef = useRef(null);

  // Zavření Escape klávesou
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Kliknutí na overlay zavře panel
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay - kliknutí zavře panel */}
      <div
        onClick={handleOverlayClick}
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel - vysouvá se zprava */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-md bg-amber-50 shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {character && (
          <CharacterSheet
            character={character}
            updateCharacter={updateCharacter}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
};

// ============================================
// CHARACTER TABS - Záložky na pravé straně (mobil)
// ============================================

const CharacterTabs = ({
  party,
  activeCharacterId,
  onCharacterClick
}) => {
  if (!party?.members || party.members.length === 0) return null;

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1 lg:hidden">
      {party.members.map((member) => {
        const isActive = member.id === activeCharacterId;
        const hpPercent = member.hp ? (member.hp.current / member.hp.max) * 100 : 100;
        const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

        return (
          <button
            key={member.id}
            onClick={() => onCharacterClick(member)}
            className={`relative w-12 h-14 rounded-l-lg shadow-lg flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'bg-amber-500 text-white -translate-x-1'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <span className="text-lg">{member.type === 'pc' ? '🐭' : '🐿️'}</span>
            <span className="text-[10px] font-bold truncate w-full text-center px-1">
              {member.name.split(' ')[0].slice(0, 4)}
            </span>
            {/* HP indikátor */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-200 rounded-b-lg overflow-hidden">
              <div className={`h-full ${hpColor}`} style={{ width: `${hpPercent}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ============================================
// CHARACTER PANEL
// ============================================

const CharacterPanel = () => {
  const {
    parties, activePartyId, setActivePartyId,
    activeCharacterId, setActiveCharacterId,
    getActiveParty, getActiveCharacter,
    createParty, createPC, createHireling,
    addHirelingsToParty, updateParty,
    updateCharacterInParty, removeCharacter, removeParty,
    handleLogEntry, propagateNameChange,
  } = useGameStore();
  const party = getActiveParty();
  const character = getActiveCharacter();
  const updateCharacter = (updates) =>
    activePartyId && activeCharacterId &&
    updateCharacterInParty(activePartyId, activeCharacterId, updates);
  const onLogEntry = handleLogEntry;

  const performLevelUp = (updates: Record<string, unknown>) => {
    if (!character || character.type !== 'pc') return;
    updateCharacter(updates);
    const newLevel = updates['level'] as number;
    onLogEntry({
      type: 'oracle',
      content: `🎉 Level Up! ${character.name} postupuje na ${newLevel}. úroveň. Kuráž: ${getGrit(newLevel)}.`,
    });
    setShowLevelUp(false);
  };

  // Defensive null checks for props that may be undefined from Firebase
  const safeParties = parties || [];
  const safeParty = party || null;

  const [editMode, setEditMode] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
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

  // State for level up modal
  const [showLevelUp, setShowLevelUp] = useState(false);

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
    if (!character?.inventory) return;
    updateCharacter({
      inventory: (character.inventory || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeInventoryItem = (id) => {
    if (!character?.inventory) return;
    updateCharacter({ inventory: (character.inventory || []).filter(item => item.id !== id) });
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

  const addConditionToFirstFreeSlot = (condId: string, condName: string) => {
    if (!character || character.conditions?.includes(condId)) return;
    const packSlots = ['pack1','pack2','pack3','pack4','pack5','pack6'];
    const slots = character.inventorySlots || {};
    const freeSlot = packSlots.find(s => !slots[s]);
    if (!freeSlot) {
      // Přetížen — přidat do conditions[] jako "pending" (bez slotu)
      updateCharacter({ conditions: [...(character.conditions || []), condId] });
      return;
    }
    addConditionToSlot(freeSlot, condId, condName);
  };

  const removeConditionFromSlots = (condId: string) => {
    if (!character) return;
    const slots = { ...(character.inventorySlots || {}) };
    let changed = false;
    Object.keys(slots).forEach(slotId => {
      if (slots[slotId]?.isCondition && slots[slotId]?.conditionId === condId) {
        slots[slotId] = null;
        changed = true;
      }
    });
    updateCharacter({
      inventorySlots: changed ? slots : character.inventorySlots,
      conditions: (character.conditions || []).filter(c => c !== condId)
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
  if (!safeParties || safeParties.length === 0) {
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
              onFocus={(e) => { e.target.dataset.originalName = e.target.value; }}
              onBlur={(e) => {
                const orig = e.target.dataset.originalName;
                if (orig && orig !== e.target.value && e.target.value.trim()) {
                  propagateNameChange(orig, e.target.value);
                }
              }}
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
                    {!bonusOrigin && (
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
                    )}
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
                    {weapon.name} ({weapon.damage}, {weapon.weight === 'improvised' ? 'improvizovaná' : weapon.weight === 'light' ? 'lehká' : weapon.weight === 'medium' ? 'střední' : weapon.weight === 'ranged_light' ? 'lehká střelná' : weapon.weight === 'ranged_heavy' ? 'těžká střelná' : 'těžká'})
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
              const p = safeParties.find(p => p.id === e.target.value);
              if (p?.members?.length > 0) setActiveCharacterId(p.members[0].id);
              else setActiveCharacterId(null);
            }}
            className="flex-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg font-medium"
          >
            {safeParties.map(p => (
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
            
            {!party?.members || party.members.length === 0 ? (
              <p className="text-stone-400 text-center py-4">Prázdná družina - přidej postavu!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(party.members || []).map(member => (
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

            {/* HP, Pips & XP - only for PC (hirelings have their own in HirelingSheet) */}
            {character.type === 'pc' && (
              <div className="flex gap-3">
                <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xs text-stone-500 mb-1">❤️ HP</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => updateHP(-1)} className="w-8 h-8 bg-red-100 text-red-700 rounded-lg font-bold text-lg">-</button>
                    <span className="text-xl font-bold text-red-700 min-w-[48px]">
                      {character.hp?.current || 0}/{character.hp?.max || 6}
                    </span>
                    <button onClick={() => updateHP(1)} className="w-8 h-8 bg-green-100 text-green-700 rounded-lg font-bold text-lg">+</button>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xs text-stone-500 mb-1">💰 Pips</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => updatePips(-1)} className="w-8 h-8 bg-stone-100 text-stone-700 rounded-lg font-bold text-lg">-</button>
                    <span className="text-xl font-bold text-amber-600 min-w-[32px]">{character.pips || 0}</span>
                    <button onClick={() => updatePips(1)} className="w-8 h-8 bg-stone-100 text-stone-700 rounded-lg font-bold text-lg">+</button>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xs text-stone-500 mb-1">⭐ XP · Úroveň {character.level || 1}</div>
                  <div className="text-xl font-bold text-purple-700">{character.xp || 0}</div>
                  {(() => {
                    const lvl = character.level || 1;
                    const xp = character.xp || 0;
                    const nextXP = getNextLevelXP(lvl);
                    const prevXP = XP_THRESHOLDS[lvl] || 0;
                    const canLevelUp = xp >= nextXP;
                    const progress = Math.min(100, Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100));
                    return canLevelUp ? (
                      <button
                        onClick={() => setShowLevelUp(true)}
                        className="mt-1 w-full py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded animate-pulse"
                      >
                        🎉 Level Up! → Úroveň {lvl + 1}
                      </button>
                    ) : (
                      <div className="mt-1">
                        <div className="text-[10px] text-stone-400">{xp}/{nextXP} zk.</div>
                        <div className="h-1.5 bg-stone-100 rounded-full mt-0.5 overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex justify-center gap-1 mt-1">
                    <button onClick={() => updateCharacter({ xp: (character.xp || 0) + 10 })}
                      className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200">+10</button>
                    <button onClick={() => updateCharacter({ xp: (character.xp || 0) + 50 })}
                      className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200">+50</button>
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'STR', label: 'SÍL', bg: 'bg-red-50', textColor: 'text-red-900', labelColor: 'text-red-600' },
                    { key: 'DEX', label: 'MRŠ', bg: 'bg-green-50', textColor: 'text-green-900', labelColor: 'text-green-600' },
                    { key: 'WIL', label: 'VŮL', bg: 'bg-purple-50', textColor: 'text-purple-900', labelColor: 'text-purple-600' },
                  ].map(({ key: attr, label, bg, textColor, labelColor }) => (
                    <div key={attr} className={`text-center p-3 ${bg} rounded-xl`}>
                      <div className={`text-xs font-bold ${labelColor} mb-1`}>{label}</div>
                      <div className={`text-5xl font-black ${textColor} leading-none`}>
                        {character[attr]?.current ?? 10}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">/{character[attr]?.max || 10}</div>
                      <div className="flex justify-center gap-1 mt-2">
                        <button
                          onClick={() => updateAttribute(attr, 'current', Math.max(1, (character[attr]?.current || 10) - 1))}
                          className="w-7 h-7 rounded bg-white/80 hover:bg-red-100 text-red-700 font-bold text-sm border border-red-200"
                        >−</button>
                        <button
                          onClick={() => updateAttribute(attr, 'current', Math.min(character[attr]?.max || 10, (character[attr]?.current || 10) + 1))}
                          className="w-7 h-7 rounded bg-white/80 hover:bg-green-100 text-green-700 font-bold text-sm border border-green-200"
                        >+</button>
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-[10px] text-stone-400">max:</span>
                        <input
                          type="number"
                          value={character[attr]?.max || 10}
                          onChange={(e) => updateAttribute(attr, 'max', e.target.value)}
                          className="w-10 text-center text-[10px] text-stone-400 bg-white/60 border border-stone-200 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                {popupItem && (
                  <ItemPopup 
                    item={popupItem.item} 
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
                  {/* Encumbrance indicator */}
                  {(() => {
                    const stdSlots = ['mainPaw','offPaw','body1','body2','pack1','pack2','pack3','pack4','pack5','pack6'];
                    const usedSlots = stdSlots.filter(s => character.inventorySlots?.[s]).length;
                    const pendingConditions = (character.conditions || []).filter(condId =>
                      !Object.values(character.inventorySlots || {}).some(
                        item => item?.isCondition && item?.conditionId === condId
                      )
                    );
                    return (
                      <div className={`flex items-center justify-between text-xs px-1 ${usedSlots >= 10 ? 'text-red-600 font-bold' : 'text-stone-500'}`}>
                        <span>🎒 {usedSlots}/10 slotů{usedSlots >= 10 ? ' — přetížen!' : ''}</span>
                        {pendingConditions.length > 0 && (
                          <span className="text-red-600 font-bold">⚠️ {pendingConditions.length} stav bez slotu</span>
                        )}
                      </div>
                    );
                  })()}

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
                  
                  {/* Kuráž (Grit) slots - level 2+ */}
                  {(() => {
                    const gritCount = getGrit(character.level || 1);
                    if (gritCount === 0) return null;
                    return (
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xs font-bold text-blue-600 mb-1">
                          ⚡ Kuráž — {gritCount} {gritCount === 1 ? 'slot' : 'sloty'} (stavy zde nezabírají inventář)
                        </div>
                        <div className="flex gap-1 justify-center">
                          {Array.from({ length: gritCount }, (_, i) => `grit${i + 1}`).map(gritId => (
                            <InvSlot key={gritId} id={gritId} slots={character.inventorySlots} color="blue"
                              onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                              updateChar={updateCharacter} slotSize={Math.min(slotSize, 50)}
                              selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

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
                    {CONDITIONS.map(c => {
                      const hasIt = character.conditions?.includes(c.id);
                      const inSlot = Object.values(character.inventorySlots || {}).some(
                        item => item?.isCondition && item?.conditionId === c.id
                      );
                      return (
                        <button key={c.id}
                          onClick={() => hasIt ? removeConditionFromSlots(c.id) : addConditionToFirstFreeSlot(c.id, c.name)}
                          className={`px-2 py-1 rounded text-xs border transition-colors ${
                            hasIt
                              ? 'bg-red-200 border-red-400 text-red-800 hover:bg-red-300'
                              : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                          }`}
                          title={c.effect}
                        >
                          {c.name}{hasIt && !inSlot ? ' ⚠️' : ''}
                        </button>
                      );
                    })}
                    </div>
                  </details>
                </div>
              </ResultCard>

              {/* Info — collapsible, defaultně zavřeno */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenSection(s => s === 'info' ? null : 'info')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-stone-50"
                >
                  <span className="text-sm font-bold text-stone-600">📋 Info o postavě</span>
                  <span className="text-stone-400 text-xs">{openSection === 'info' ? '▼' : '▶'}</span>
                </button>
                {openSection === 'info' && (
                  <div className="px-4 pb-3 space-y-1.5 text-sm border-t border-stone-100">
                    <p className="pt-2"><strong>Původ:</strong> {character.origin?.name || character.background || '—'}</p>
                    <p><strong>Znamení:</strong> {character.birthsign?.sign || character.birthsign?.name} <span className="text-stone-500">({character.birthsign?.trait || character.birthsign?.traits})</span></p>
                    {character.fur && (
                      <p><strong>Srst:</strong> {character.fur.color}, {character.fur.pattern?.toLowerCase()}</p>
                    )}
                    <p><strong>Výrazný rys:</strong> {character.distinctiveFeature || character.physicalDetail || '—'}</p>
                  </div>
                )}
              </div>
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

      {/* Level Up Modal */}
      {showLevelUp && character && character.type === 'pc' && (
        <LevelUpModal
          character={character}
          onConfirm={performLevelUp}
          onCancel={() => setShowLevelUp(false)}
        />
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
    if (!character?.inventory) return;
    updateCharacter({
      inventory: (character.inventory || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const removeInventoryItem = (id) => {
    if (!character?.inventory) return;
    updateCharacter({
      inventory: (character.inventory || []).filter(item => item.id !== id)
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
          <div className="overflow-hidden">
            <label className="text-sm text-stone-500 block">Znamení</label>
            <p className="font-bold text-amber-900 truncate">
              {character.birthsign?.name || '—'}
              {character.birthsign?.traits && (
                <span className="font-normal text-sm text-stone-600 block truncate">{character.birthsign.traits}</span>
              )}
            </p>
          </div>
          <div className="overflow-hidden">
            <label className="text-sm text-stone-500 block">Fyzický detail</label>
            <p className="text-stone-700 truncate">{character.physicalDetail || '—'}</p>
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




export { CharacterSheet, CharacterSidePanel, CharacterTabs, CharacterPanel };

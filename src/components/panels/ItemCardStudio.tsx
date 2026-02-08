import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { SectionHeader, ResultCard, Button } from '../ui/common';

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

const ItemCardStudio = () => {
  const { parties, activePartyId, activeCharacterId, updateCharacterInParty } = useGameStore();
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



export { useSlotSize, ItemPopup, InvSlot, ItemCardStudio };

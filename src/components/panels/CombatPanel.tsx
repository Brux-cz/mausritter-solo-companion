import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { HIT_TABLE } from '../../data/constants';
import { rollDice, rollD6, rollD20, roll2D6, generateId, formatTimestamp } from '../../utils/helpers';
import { DiceDisplay, SectionHeader, ResultCard, Button, HelpHeader, Input, Select } from '../ui/common';

const CombatPanel = () => {
  const { activePartyId, getActiveParty, updateCharacterInParty: storeUpdateChar, handleLogEntry } = useGameStore();
  const party = getActiveParty();
  const onLogEntry = handleLogEntry;
  const updateCharacterInParty = (charId, updates) => activePartyId && storeUpdateChar(activePartyId, charId, updates);
  const [combatants, setCombatants] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [attackResult, setAttackResult] = useState(null);
  const [newCombatantName, setNewCombatantName] = useState('');
  const [newCombatantHP, setNewCombatantHP] = useState(4);
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [selectedAttackerId, setSelectedAttackerId] = useState('');

  // Add single combatant
  const addCombatant = (isEnemy = true) => {
    if (!newCombatantName) return;
    const newCombatant = {
      id: generateId(),
      name: newCombatantName,
      hp: newCombatantHP,
      maxHp: newCombatantHP,
      str: 6,
      maxStr: 6,
      isEnemy,
      isPartyMember: false,
      conditions: [],
      prone: false,
      actedThisRound: false
    };
    setCombatants([...combatants, newCombatant]);
    setNewCombatantName('');
    setNewCombatantHP(4);
  };

  // Add all party members to combat
  const addPartyToCombat = () => {
    if (!party?.members) return;
    
    const partyMembers = party.members.map(member => ({
      id: member.id,
      name: member.name,
      hp: member.hp?.current || 3,
      maxHp: member.hp?.max || 6,
      str: member.STR?.current || member.str || 6,
      maxStr: member.STR?.max || member.maxStr || 6,
      isEnemy: false,
      isPartyMember: true,
      memberId: member.id, // Link back to party member
      conditions: member.conditions || [],
      actedThisRound: false
    }));
    
    // Filter out members already in combat
    const newMembers = partyMembers.filter(pm => 
      !combatants.some(c => c.memberId === pm.memberId)
    );
    
    setCombatants([...combatants, ...newMembers]);
  };

  const removeCombatant = (id) => {
    setCombatants(combatants.filter(c => c.id !== id));
  };

  const startCombat = () => {
    setCurrentRound(1);
    setCombatLog([{ round: 1, message: '⚔️ Boj začíná!' }]);
    // Roll initiative
    const withInitiative = combatants.map(c => ({
      ...c,
      initiative: rollD20(),
      actedThisRound: false
    })).sort((a, b) => b.initiative - a.initiative);
    setCombatants(withInitiative);
  };

  const nextRound = () => {
    const newRound = currentRound + 1;
    setCurrentRound(newRound);
    setCombatants(combatants.map(c => ({ ...c, actedThisRound: false })));
    setCombatLog([...combatLog, { round: newRound, message: `🔄 Kolo ${newRound}` }]);
  };

  const endCombat = () => {
    setCurrentRound(0);
    
    // Sync HP back to party members
    combatants.forEach(c => {
      if (c.isPartyMember && c.memberId) {
        updateCharacterInParty(c.memberId, {
          hp: { current: c.hp, max: c.maxHp }
        });
      }
    });
    
    // Roll usage for items
    const usageLog = [];
    if (party?.members) {
      party.members.forEach(member => {
        if (member.inventory) {
          member.inventory.forEach(item => {
            if (item.usageDots !== undefined && (item.name.toLowerCase().includes('zbraň') || item.name.toLowerCase().includes('sword') || item.name.toLowerCase().includes('armor') || item.name.toLowerCase().includes('zbroj') || item.name.toLowerCase().includes('štít'))) {
              const roll = rollD6();
              if (roll >= 4) {
                usageLog.push(`${member.name} - ${item.name}: Hod ${roll} - Označ použití!`);
              }
            }
          });
        }
      });
    }
    
    if (usageLog.length > 0) {
      setCombatLog([...combatLog, { round: currentRound, message: '📦 Usage rolls:', details: usageLog }]);
    }
    
    onLogEntry({
      type: 'combat_end',
      timestamp: formatTimestamp(),
      rounds: currentRound,
      log: combatLog
    });
    
    // Clear combatants
    setCombatants([]);
  };

  const toggleProne = (id: string) => {
    setCombatants(combatants.map(c => c.id === id ? { ...c, prone: !c.prone } : c));
  };

  const shortRest = (combatantId: string) => {
    const combatant = combatants.find(c => c.id === combatantId);
    if (!combatant) return;
    const roll = rollD6();
    const healing = roll + 1;
    const newHp = Math.min(combatant.maxHp, combatant.hp + healing);
    setCombatants(combatants.map(c => c.id === combatantId ? { ...c, hp: newHp } : c));
    // Sync back to character sheet immediately
    if (combatant.isPartyMember && combatant.memberId) {
      updateCharacterInParty(combatant.memberId, {
        hp: { current: newHp, max: combatant.maxHp }
      });
    }
    setCombatLog([...combatLog, {
      round: currentRound,
      message: `💤 Short Rest ${combatant.name}: d6=${roll}+1 = +${healing} HP → ${newHp}/${combatant.maxHp}`
    }]);
  };

  const rollAttack = (attackerId: string, targetId: string, weaponDice = 6) => {
    const target = combatants.find(c => c.id === targetId);
    const effectiveDice = target?.prone ? 12 : weaponDice; // Prone = d12
    const { dice, total } = roll2D6();
    const hitResult = HIT_TABLE[total];

    let damage = 0;
    let damageRolls = [];

    switch (hitResult.damageType) {
      case 'none':
        damage = 0;
        break;
      case 'disadvantage':
        damageRolls = rollDice(2, effectiveDice);
        damage = Math.min(...damageRolls);
        break;
      case 'normal':
        damageRolls = rollDice(1, effectiveDice);
        damage = damageRolls[0];
        break;
      case 'advantage':
        damageRolls = rollDice(2, effectiveDice);
        damage = Math.max(...damageRolls);
        break;
      case 'advantage+1':
        damageRolls = rollDice(2, effectiveDice);
        damage = Math.max(...damageRolls) + 1;
        break;
      case 'max':
        damage = effectiveDice;
        break;
    }

    const attacker = combatants.find(c => c.id === attackerId) || { name: 'Útočník' };

    // Calculate HP/STR damage and STR save
    let strSave: { roll: number; target: number; passed: boolean } | null = null;
    let finalHp = target ? target.hp : 0;
    let finalStr = target ? target.str : 0;

    if (target && damage > 0) {
      const rawHp = target.hp - damage;
      if (rawHp < 0) {
        const overflow = Math.abs(rawHp);
        finalHp = 0;
        finalStr = Math.max(0, target.str - overflow);
        // STR save: roll d20 ≤ remaining STR = success (only if not dead)
        if (finalStr > 0) {
          const saveRoll = rollD20();
          strSave = { roll: saveRoll, target: finalStr, passed: saveRoll <= finalStr };
        }
      } else {
        finalHp = rawHp;
      }

      const newCombatants = combatants.map(c => {
        if (c.id === targetId) {
          const updated = { ...c, hp: finalHp, str: finalStr };
          // Failed STR save → add Poranění condition
          if (strSave && !strSave.passed) {
            const conditions = [...(c.conditions || [])];
            if (!conditions.includes('Poranění')) conditions.push('Poranění');
            return { ...updated, conditions };
          }
          return updated;
        }
        return c;
      });
      setCombatants(newCombatants);

      // Sync STR back to party member sheet
      const targetCombatant = combatants.find(c => c.id === targetId);
      if (targetCombatant?.isPartyMember && targetCombatant.memberId && finalStr !== target.str) {
        updateCharacterInParty(targetCombatant.memberId, {
          STR: { current: finalStr, max: targetCombatant.maxStr }
        });
      }
    }

    const result = {
      attacker: attacker.name,
      target: target?.name || 'Cíl',
      hitDice: dice,
      hitTotal: total,
      hitResult: hitResult.result,
      effect: hitResult.effect,
      damageRolls,
      damage,
      prone: target?.prone || false,
      strSave,
    };

    setAttackResult(result);

    let logMsg = `${result.attacker} útočí na ${result.target}: ${result.hitResult} (${total}) → ${damage} poškození`;
    if (strSave) {
      logMsg += ` | 🎯 STR save: d20=${strSave.roll} vs STR=${strSave.target} → ${strSave.passed ? '✅ úspěch' : '❌ SELHÁNÍ! Poranění!'}`;
    }

    setCombatLog([...combatLog, { round: currentRound, message: logMsg }]);

    onLogEntry({
      type: 'combat_action',
      subtype: 'attack',
      timestamp: formatTimestamp(),
      ...result
    });
  };

  const rollMorale = (combatantId) => {
    const target = combatants.find(c => c.id === combatantId);
    if (!target) return;
    
    const roll = rollD20();
    const success = roll <= (target.wil || 7);
    
    setCombatLog([...combatLog, {
      round: currentRound,
      message: `🏃 Morálka ${target.name}: d20=${roll} vs WIL=${target.wil || 7} → ${success ? 'Drží pozici' : 'PRCHÁ!'}`
    }]);
  };

  const updateCombatantHP = (id, delta) => {
    const combatant = combatants.find(c => c.id === id);
    if (!combatant) return;
    const newHp = Math.max(0, Math.min(combatant.maxHp, combatant.hp + delta));
    setCombatants(combatants.map(c => c.id === id ? { ...c, hp: newHp } : c));
    // Sync back to character sheet for party members
    if (combatant.isPartyMember && combatant.memberId) {
      updateCharacterInParty(combatant.memberId, {
        hp: { current: newHp, max: combatant.maxHp }
      });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="⚔️" 
        title="Bojový tracker" 
        subtitle={currentRound > 0 ? `Kolo ${currentRound}` : 'Připrav bojovníky'}
      />

      {/* Add Combatant */}
      <ResultCard>
        <HelpHeader 
          title="Přidat bojovníka" 
          icon="➕"
          tooltip={
            <div>
              <p className="font-bold mb-2">🎯 K čemu to je?</p>
              <p className="text-xs mb-2">Přidej všechny účastníky boje - myši, nepřátele i spojence - předtím než začneš bojovat.</p>
              
              <p className="font-bold mb-1">📝 Jak na to:</p>
              <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                <li>Napiš jméno (např. "Krysa #1" nebo "Oříšek")</li>
                <li>Nastav HP a případně Armor</li>
                <li>Vyber typ:</li>
              </ol>
              
              <ul className="text-xs space-y-1 mb-2 ml-4">
                <li>🐭 <b>Hráč</b> = tvá postava (zelený pruh)</li>
                <li>🐀 <b>Nepřítel</b> = proti tobě (červený pruh)</li>
                <li>🐿️ <b>Spojenec</b> = NPC na tvé straně (modrý pruh)</li>
              </ul>
              
              <p className="text-xs text-stone-300 italic">
                💡 Tip: Pro více nepřátel stejného typu je přidej jednotlivě s čísly (Mravenec #1, #2...)
              </p>
            </div>
          }
        />
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-stone-600 block mb-1">Jméno</label>
            <Input 
              value={newCombatantName}
              onChange={setNewCombatantName}
              placeholder="Jméno nepřítele..."
            />
          </div>
          <div className="w-24">
            <label className="text-sm text-stone-600 block mb-1">HP</label>
            <Input 
              type="number"
              value={newCombatantHP}
              onChange={(v) => setNewCombatantHP(parseInt(v) || 1)}
            />
          </div>
          <Button onClick={() => addCombatant(true)}>🐀 Nepřítel</Button>
          <Button onClick={() => addCombatant(false)} variant="secondary">🐭 Spojenec</Button>
          {party?.members?.length > 0 && (
            <Button onClick={addPartyToCombat} variant="success">
              🏕️ Celá družina ({party.members.length})
            </Button>
          )}
        </div>
      </ResultCard>

      {/* Combatants List */}
      <ResultCard title="👥 Bojovníci">
        {combatants.length === 0 ? (
          <p className="text-stone-500 text-center py-4">Žádní bojovníci. Přidej někoho výše.</p>
        ) : (
          <div className="space-y-3">
            {combatants.map(c => (
              <div key={c.id} className={`p-4 rounded-lg border-2 ${c.isEnemy ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.isEnemy ? '🐀' : '🐭'}</span>
                    <div>
                      <h4 className="font-bold text-stone-800">{c.name}</h4>
                      <div className="flex gap-3 text-sm">
                        <span className={c.hp === 0 ? 'text-red-600 font-bold' : 'text-stone-600'}>
                          HP: {c.hp}/{c.maxHp}
                        </span>
                        <span className={c.str < c.maxStr ? 'text-orange-600 font-bold' : 'text-stone-600'}>
                          STR: {c.str}/{c.maxStr}
                        </span>
                        {c.initiative && <span className="text-blue-600">Init: {c.initiative}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="small" variant="success" onClick={() => updateCombatantHP(c.id, 1)}>+HP</Button>
                    <Button size="small" variant="danger" onClick={() => updateCombatantHP(c.id, -1)}>-HP</Button>
                    {!c.isEnemy && (
                      <Button size="small" variant="secondary" onClick={() => shortRest(c.id)}>💤 Rest (d6+1)</Button>
                    )}
                    {currentRound > 0 && c.isEnemy && (
                      <Button size="small" variant="ghost" onClick={() => rollMorale(c.id)}>🏃 Morálka</Button>
                    )}
                    {currentRound > 0 && (
                      <button
                        onClick={() => toggleProne(c.id)}
                        title="Prone: damage die = d12"
                        className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                          c.prone
                            ? 'bg-orange-200 border-orange-400 text-orange-800'
                            : 'bg-stone-100 border-stone-300 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {c.prone ? '🤸 Prone' : 'Prone'}
                      </button>
                    )}
                    <Button size="small" variant="ghost" onClick={() => removeCombatant(c.id)}>✕</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ResultCard>

      {/* Combat Controls */}
      <ResultCard title="🎮 Ovládání">
        <div className="flex flex-wrap gap-3">
          {currentRound === 0 ? (
            <Button onClick={startCombat} size="large" disabled={combatants.length === 0}>
              ⚔️ Zahájit boj
            </Button>
          ) : (
            <>
              <Button onClick={nextRound}>🔄 Další kolo</Button>
              <Button onClick={endCombat} variant="danger">🏁 Ukončit boj</Button>
            </>
          )}
        </div>
      </ResultCard>

      {/* Attack Roll */}
      {currentRound > 0 && (
        <ResultCard>
          <HelpHeader 
            title="Útok (Bernpyle 2d6)" 
            icon="🗡️"
            tooltip={
              <div>
                <p className="font-bold mb-1">Jak útočit:</p>
                <ol className="list-decimal list-inside text-xs space-y-1">
                  <li>Vyber cíl útoku</li>
                  <li>Hoď 2d6 na zásah</li>
                  <li>Výsledek určí sílu zásahu</li>
                  <li>Hoď damage podle zbraně</li>
                </ol>
                <p className="mt-2 text-xs text-stone-300">
                  Poškození jde nejdřív do HP, pak do STR. Při STR damage hoď STR save!
                </p>
              </div>
            }
          />
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Útočník</label>
                <Select
                  value={selectedAttackerId}
                  onChange={(id) => setSelectedAttackerId(id)}
                  options={[
                    { value: '', label: 'Vybrat útočníka...' },
                    ...combatants.filter(c => !c.isEnemy && c.hp > 0).map(c => ({
                      value: c.id,
                      label: c.name
                    }))
                  ]}
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">
                  Cíl {selectedTargetId && combatants.find(c => c.id === selectedTargetId)?.prone && <span className="text-orange-600 font-bold">🤸 Prone → d12!</span>}
                </label>
                <Select
                  value={selectedTargetId}
                  onChange={(id) => setSelectedTargetId(id)}
                  options={[
                    { value: '', label: 'Vybrat cíl...' },
                    ...combatants.filter(c => c.isEnemy && c.hp > 0).map(c => ({
                      value: c.id,
                      label: `${c.name} (HP: ${c.hp})${c.prone ? ' 🤸' : ''}`
                    }))
                  ]}
                />
              </div>
            </div>

            <Button
              onClick={() => {
                if (!selectedTargetId) return;
                const attackerId = selectedAttackerId || combatants.find(c => !c.isEnemy && c.hp > 0)?.id || '';
                if (attackerId) rollAttack(attackerId, selectedTargetId);
              }}
              disabled={!selectedTargetId}
              className="w-full"
            >
              🎲 Hodit útok
            </Button>
            
            {attackResult && (
              <div className="mt-4 p-4 bg-amber-100 rounded-lg">
                <DiceDisplay dice={attackResult.hitDice} size="large" />
                <div className="mt-3 text-center space-y-2">
                  <p className="text-xl font-bold text-amber-900">{attackResult.hitResult}</p>
                  <p className="text-stone-600">{attackResult.effect}</p>
                  {attackResult.damage > 0 && (
                    <p className="text-2xl font-bold text-red-700">💥 {attackResult.damage} poškození</p>
                  )}
                  {attackResult.damageRolls.length > 0 && (
                    <p className="text-sm text-stone-500">
                      Damage roll: [{attackResult.damageRolls.join(', ')}]
                      {attackResult.prone && <span className="text-orange-600 ml-1">(🤸 Prone → d12)</span>}
                    </p>
                  )}
                  {attackResult.strSave && (
                    <div className={`mt-2 p-3 rounded-lg border-2 ${attackResult.strSave.passed ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-500'}`}>
                      <p className="font-bold text-sm">
                        🎯 Záchrana SÍL: d20={attackResult.strSave.roll} vs SÍL={attackResult.strSave.target}
                      </p>
                      {attackResult.strSave.passed
                        ? <p className="text-green-700 font-bold">✅ Úspěch — odolává!</p>
                        : <p className="text-red-700 font-bold">❌ Selhání — Poranění! Postava je vyřazena z boje.</p>
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ResultCard>
      )}

      {/* Combat Log */}
      {combatLog.length > 0 && (
        <ResultCard title="📜 Bojový log">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {combatLog.map((log, i) => (
              <div key={i} className="text-sm p-2 bg-stone-100 rounded">
                <span className="text-amber-700 font-bold">[K{log.round}]</span> {log.message}
                {log.details && (
                  <ul className="ml-4 mt-1 text-stone-600">
                    {log.details.map((d, j) => <li key={j}>• {d}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {/* Hit Table Reference */}
      <ResultCard title="📊 Tabulka zásahů (2d6)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="p-2 bg-red-100 rounded text-center">
            <span className="font-bold">2</span><br/>Kritický minutí
          </div>
          <div className="p-2 bg-orange-100 rounded text-center">
            <span className="font-bold">3-4</span><br/>Slabý zásah
          </div>
          <div className="p-2 bg-yellow-100 rounded text-center">
            <span className="font-bold">5-8</span><br/>Zásah
          </div>
          <div className="p-2 bg-green-100 rounded text-center">
            <span className="font-bold">9-10</span><br/>Silný zásah
          </div>
          <div className="p-2 bg-green-200 rounded text-center">
            <span className="font-bold">11</span><br/>Silný +1
          </div>
          <div className="p-2 bg-green-300 rounded text-center col-span-2">
            <span className="font-bold">12</span><br/>DRTIVÝ ÚDER (max dmg)
          </div>
        </div>
      </ResultCard>
    </div>
  );
};



export { CombatPanel };

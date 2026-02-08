import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { SENSORY_PRIMING_TABLE, MEGA_STRUCTURE_SHAPE, MEGA_STRUCTURE_MATERIAL, MEGA_STRUCTURE_STATE, LOOT_COMPLICATIONS, PHYSICAL_TRAPS, WHAT_IS_IT_VERB, WHAT_IS_IT_NOUN } from '../../data/constants';
import { rollD6, rollD12, rollD20, rollK66, formatTimestamp } from '../../utils/helpers';
import { DiceDisplay, SectionHeader } from '../ui/common';

const SmallWorldPanel = () => {
  const handleLogEntry = useGameStore(s => s.handleLogEntry);
  const [activeGenerator, setActiveGenerator] = useState('sensory');
  const [lastResult, setLastResult] = useState(null);
  const [logToJournal, setLogToJournal] = useState(true);

  const generators = [
    { id: 'sensory', label: 'Smysly', icon: '👃' },
    { id: 'megastructure', label: 'Mega-Struktura', icon: '🏗️' },
    { id: 'loot', label: 'Kořist', icon: '💎' },
    { id: 'traps', label: 'Pasti', icon: '⚠️' },
    { id: 'whatis', label: 'Co je to?', icon: '❓' }
  ];

  const logEntry = (entry) => {
    if (logToJournal && handleLogEntry) {
      handleLogEntry(entry);
    }
  };

  // 1. Senzorický Priming (k66)
  const rollSensory = () => {
    const { dice, result } = rollK66();
    const data = SENSORY_PRIMING_TABLE[result];
    const entry = {
      type: 'smallworld',
      subtype: 'sensory_priming',
      timestamp: formatTimestamp(),
      dice,
      diceResult: result,
      result: data
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 2. Mega-Struktura (3×d6)
  const rollMegaStructure = () => {
    const shapeRoll = rollD6();
    const materialRoll = rollD6();
    const stateRoll = rollD6();

    const shape = MEGA_STRUCTURE_SHAPE.find(s => s.roll === shapeRoll);
    const material = MEGA_STRUCTURE_MATERIAL.find(m => m.roll === materialRoll);
    const state = MEGA_STRUCTURE_STATE.find(s => s.roll === stateRoll);

    const entry = {
      type: 'smallworld',
      subtype: 'mega_structure',
      timestamp: formatTimestamp(),
      dice: [shapeRoll, materialRoll, stateRoll],
      result: { shape, material, state }
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 3. Komplikace Kořisti (d20)
  const rollLootComplication = () => {
    const results = [];
    let roll = rollD20();
    results.push(roll);

    // Dvojitá komplikace na 20
    if (roll === 20) {
      let roll1 = rollD20();
      while (roll1 === 20) roll1 = rollD20();
      let roll2 = rollD20();
      while (roll2 === 20) roll2 = rollD20();
      results.push(roll1, roll2);
    }

    const complications = results.map(r =>
      LOOT_COMPLICATIONS.find(c => c.roll === r)
    ).filter(c => c && c.roll !== 20);

    const entry = {
      type: 'smallworld',
      subtype: 'loot_complication',
      timestamp: formatTimestamp(),
      dice: results,
      result: complications,
      isDouble: results[0] === 20
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 4. Fyzikální Pasti (d12)
  const rollTrap = () => {
    const roll = rollD12();
    const trap = PHYSICAL_TRAPS.find(t => t.roll === roll);
    const entry = {
      type: 'smallworld',
      subtype: 'physical_trap',
      timestamp: formatTimestamp(),
      dice: [roll],
      result: trap
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 5. Co je to? (2×d6)
  const rollWhatIsIt = () => {
    const verbRoll = rollD6();
    const nounRoll = rollD6();
    const verb = WHAT_IS_IT_VERB.find(v => v.roll === verbRoll);
    const noun = WHAT_IS_IT_NOUN.find(n => n.roll === nounRoll);
    const entry = {
      type: 'smallworld',
      subtype: 'what_is_it',
      timestamp: formatTimestamp(),
      dice: [verbRoll, nounRoll],
      result: { verb, noun }
    };
    setLastResult(entry);
    logEntry(entry);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon="🏠"
        title="Malý Svět"
        subtitle="Generátory pro průzkum a detaily prostředí z pohledu myši"
      />

      {/* Tab navigace */}
      <div className="flex flex-wrap gap-2 border-b border-amber-200 pb-3">
        {generators.map(gen => (
          <button
            key={gen.id}
            onClick={() => setActiveGenerator(gen.id)}
            className={`px-3 py-2 rounded-t-lg font-medium transition-colors ${
              activeGenerator === gen.id
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
          >
            {gen.icon} {gen.label}
          </button>
        ))}
      </div>

      {/* Toggle pro logování */}
      <div className="flex items-center justify-end gap-2 -mt-2 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800 transition-colors">
          <input
            type="checkbox"
            checked={logToJournal}
            onChange={(e) => setLogToJournal(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span className={!logToJournal ? 'text-amber-700 font-medium' : ''}>
            📝 Zapisovat do deníku {!logToJournal && '(vypnuto)'}
          </span>
        </label>
      </div>

      {/* SENZORICKÝ PRIMING */}
      {activeGenerator === 'sensory' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">👃 Senzorický Priming (k66)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Generuje smyslové detaily prostředí - vůně, hmatové vjemy a jejich herní implikace. Použij na začátku scény.
          </p>
          <button
            onClick={rollSensory}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit k66
          </button>
          {lastResult?.subtype === 'sensory_priming' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="text-center text-sm text-stone-400 mt-1 mb-3">
                k66 = {lastResult.diceResult}
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">👃 Vůně:</span>
                  <span>{lastResult.result.smell}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">🖐️ Hmat:</span>
                  <span>{lastResult.result.tactile}</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-stone-700 rounded">
                  <span className="text-amber-400 font-bold">{lastResult.result.icon}</span>
                  <span>{lastResult.result.hint}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MEGA-STRUKTURA */}
      {activeGenerator === 'megastructure' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">🏗️ Generátor Mega-Struktur (3×k6)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Vytvoří náhodný velký lidský předmět jako "dungeon" - kombinace tvaru, materiálu a stavu.
          </p>
          <button
            onClick={rollMegaStructure}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit 3×k6
          </button>
          {lastResult?.subtype === 'mega_structure' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="text-center text-sm text-stone-400 mt-1 mb-3">
                Tvar: {lastResult.dice[0]} | Materiál: {lastResult.dice[1]} | Stav: {lastResult.dice[2]}
              </div>
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">🔷 Tvar: {lastResult.result.shape.name}</div>
                  <div className="text-sm text-stone-300">{lastResult.result.shape.desc}</div>
                  <div className="text-xs text-stone-400 mt-1">{lastResult.result.shape.examples}</div>
                </div>
                <div className="p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">🧱 Materiál: {lastResult.result.material.name}</div>
                  <div className="text-sm text-stone-300">{lastResult.result.material.desc}</div>
                  <div className="text-xs text-stone-400 mt-1">{lastResult.result.material.hint}</div>
                </div>
                <div className="p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">⚡ Stav: {lastResult.result.state.name}</div>
                  <div className="text-sm text-stone-300">{lastResult.result.state.desc}</div>
                  <div className="text-xs text-amber-300 mt-1">⚠️ {lastResult.result.state.hint}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KOMPLIKACE KOŘISTI */}
      {activeGenerator === 'loot' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">💎 Komplikace Kořisti (k20)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Když myši najdou kořist větší než mince - co komplikuje její transport? Hod 20 = dvojitá komplikace!
          </p>
          <button
            onClick={rollLootComplication}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit k20
          </button>
          {lastResult?.subtype === 'loot_complication' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              {lastResult.isDouble && (
                <div className="text-center text-amber-400 font-bold mt-2 mb-2">
                  ⚠️ DVOJITÁ KOMPLIKACE! ⚠️
                </div>
              )}
              {lastResult.result.map((comp, i) => (
                <div key={i} className="mt-4 p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">
                    {comp.property} <span className="text-stone-400 font-normal">({comp.desc})</span>
                  </div>
                  <div className="text-sm text-stone-300 mt-2">{comp.impact}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FYZIKÁLNÍ PASTI */}
      {activeGenerator === 'traps' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">⚠️ Fyzikální Pasti (k12)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Prostředí, které je smrtící svou fyzikou - ne mechanickými pastmi. Věci nebezpečné pro malé tvory.
          </p>
          <button
            onClick={rollTrap}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit k12
          </button>
          {lastResult?.subtype === 'physical_trap' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="mt-4 p-3 bg-stone-700 rounded">
                <div className="text-amber-400 font-bold text-lg mb-2">
                  {lastResult.result.object}
                </div>
                <div className="text-stone-300">{lastResult.result.effect}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CO JE TO? */}
      {activeGenerator === 'whatis' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">❓ Orákulum: Co je to? (2×k6)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Když se ztratíte v abstrakci - co "doopravdy" je ten neznámý lidský předmět? Kombinace funkce + formy.
          </p>
          <button
            onClick={rollWhatIsIt}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit 2×k6
          </button>
          {lastResult?.subtype === 'what_is_it' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="text-center text-sm text-stone-400 mt-1 mb-3">
                Sloveso: {lastResult.dice[0]} | Podst. jméno: {lastResult.dice[1]}
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-amber-400 mb-2">
                  "{lastResult.result.verb.verb}" + "{lastResult.result.noun.noun}"
                </div>
                <div className="text-stone-300 mb-4">
                  {lastResult.result.verb.desc} → {lastResult.result.noun.desc}
                </div>
                <div className="p-3 bg-stone-700 rounded text-left">
                  <div className="text-amber-300 font-bold mb-1">💡 Příklady:</div>
                  <div className="text-stone-300 text-sm">{lastResult.result.noun.example}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export { SmallWorldPanel };

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { ORACLE_TABLE, SCENE_COMPLICATIONS, FAILURE_CONSEQUENCES, ACTION_ORACLE, THEME_ORACLE, CARD_SUITS, CARD_VALUES, CARD_VALUE_MEANINGS } from '../../data/constants';
import { rollDice, rollD6, roll2D6, randomFrom } from '../../utils/helpers';

const FloatingDice = () => {
  const handleLogEntry = useGameStore(s => s.handleLogEntry);
  const [isOpen, setIsOpen] = useState(false);
  const [activeGenerator, setActiveGenerator] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);
  const [isHidden, setIsHidden] = useState(true); // Na mobilu schované

  // Generátory - vertikální seznam
  const generators = [
    { id: 'dice', icon: '🎲', label: 'Kostky', color: 'bg-amber-500' },
    { id: 'yesno', icon: '❓', label: 'Ano/Ne', color: 'bg-blue-500' },
    { id: 'action', icon: '💡', label: 'Akce', color: 'bg-purple-500' },
    { id: 'complication', icon: '⚡', label: 'Komplikace', color: 'bg-orange-500' },
    { id: 'consequence', icon: '💀', label: 'Důsledek', color: 'bg-red-500' },
    { id: 'card', icon: '🃏', label: 'Karta', color: 'bg-green-500' },
  ];

  // Roll funkce
  const quickRoll = (count, sides) => {
    const results = rollDice(count, sides);
    const total = results.reduce((a, b) => a + b, 0);
    setLastRoll({ type: 'dice', dice: results, total, sides, count });
  };

  const quickYesNo = (probability = 'even') => {
    const { dice, total } = roll2D6();
    const result = ORACLE_TABLE[probability][total];
    setLastRoll({ type: 'yesno', dice, total, result, probability });
  };

  const rollActionTheme = () => {
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    setLastRoll({ type: 'action', action, theme, result: `${action} + ${theme}` });
  };

  const rollComplication = () => {
    const die = rollD6();
    const result = SCENE_COMPLICATIONS[die - 1];
    setLastRoll({ type: 'complication', dice: [die], result });
  };

  const rollConsequence = () => {
    const die = rollD6();
    const result = FAILURE_CONSEQUENCES[die - 1];
    setLastRoll({ type: 'consequence', dice: [die], result });
  };

  const drawCard = () => {
    const suit = randomFrom(CARD_SUITS);
    const value = randomFrom(CARD_VALUES);
    setLastRoll({
      type: 'card',
      suit,
      value,
      meaning: CARD_VALUE_MEANINGS[value],
      result: `${value}${suit.symbol}`
    });
  };

  const handleGeneratorClick = (genId) => {
    if (activeGenerator === genId) {
      setActiveGenerator(null);
    } else {
      setActiveGenerator(genId);
      setLastRoll(null);
    }
  };

  const closeAll = () => {
    setIsOpen(false);
    setActiveGenerator(null);
    setLastRoll(null);
    setIsHidden(true); // Schovat na mobilu
  };

  // Zapsat hod do deníku
  const logRollToJournal = () => {
    if (!lastRoll || !handleLogEntry) return;

    let title = '';
    let content = '';

    switch (lastRoll.type) {
      case 'dice':
        title = `Hod kostkou: ${lastRoll.count}d${lastRoll.sides}`;
        content = `Výsledek: **${lastRoll.total}** [${lastRoll.dice.join(', ')}]`;
        break;
      case 'yesno': {
        const probLabel = { unlikely: 'Sotva', even: '50/50', likely: 'Asi ano' }[lastRoll.probability];
        title = `Orákulum (${probLabel})`;
        content = `**${lastRoll.result}** [${lastRoll.dice.join(', ')}] = ${lastRoll.total}`;
        break;
      }
      case 'action':
        title = 'Akce + Téma';
        content = `**${lastRoll.action}** + **${lastRoll.theme}**`;
        break;
      case 'complication':
        title = 'Komplikace';
        content = `**${lastRoll.result}**`;
        break;
      case 'consequence':
        title = 'Důsledek neúspěchu';
        content = `**${lastRoll.result}**`;
        break;
      case 'card':
        title = `Karta: ${lastRoll.value}${lastRoll.suit.symbol}`;
        content = `${lastRoll.suit.domain} - ${lastRoll.meaning}`;
        break;
    }

    handleLogEntry({ title, content });
    setLastRoll(null); // Vymazat po zapsání
  };

  return (
    <>
      {/* Záložka na pravém okraji - jen na mobilu když je schované */}
      {isHidden && !isOpen && (
        <button
          onClick={() => {
            setIsHidden(false);
            setIsOpen(true);
          }}
          className="sm:hidden fixed bottom-32 right-0 z-50 bg-amber-500/90 text-white px-1 py-2 rounded-l-md shadow-lg text-lg"
        >
          🎲
        </button>
      )}

      {/* Hlavní panel - na mobilu jen když je otevřený, na desktopu vždy */}
      <div className={`fixed bottom-24 right-4 z-50 flex flex-col-reverse items-end gap-2 transition-all duration-300 ${
        isHidden && !isOpen ? 'hidden sm:flex' : 'flex'
      }`}>
        {/* Hlavní plovoucí tlačítko */}
        <button
          onClick={() => {
            if (isOpen) {
              closeAll();
            } else {
              setIsOpen(true);
            }
          }}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-amber-600 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-110'
          }`}
          title="Rychlé generátory"
        >
          {isOpen ? '✕' : '🎲'}
        </button>

      {/* Vertikální menu generátorů */}
      {isOpen && (
        <div className="flex flex-col gap-2 items-end">
          {generators.map((gen) => (
            <button
              key={gen.id}
              onClick={() => handleGeneratorClick(gen.id)}
              className={`h-10 px-3 rounded-full shadow-lg flex items-center gap-2 text-sm transition-all duration-200 ${
                activeGenerator === gen.id
                  ? `${gen.color} text-white`
                  : 'bg-white hover:bg-stone-50 border border-stone-200'
              }`}
              title={gen.label}
            >
              <span className="text-lg">{gen.icon}</span>
              <span className="font-medium">{gen.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Panel pro vybraný generátor */}
      {isOpen && activeGenerator && (
        <div className="bg-white rounded-xl shadow-2xl border border-amber-200 p-3 w-72 mr-2">
          {/* Kostky */}
          {activeGenerator === 'dice' && (
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => quickRoll(1, 6)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">1d6</button>
              <button onClick={() => quickRoll(2, 6)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">2d6</button>
              <button onClick={() => quickRoll(1, 20)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">d20</button>
              <button onClick={() => quickRoll(1, 100)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">d100</button>
            </div>
          )}

          {/* Ano/Ne Oracle */}
          {activeGenerator === 'yesno' && (
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => quickYesNo('unlikely')} className="px-2 py-2 bg-red-100 hover:bg-red-200 rounded text-xs font-medium">Sotva</button>
              <button onClick={() => quickYesNo('even')} className="px-2 py-2 bg-yellow-100 hover:bg-yellow-200 rounded text-xs font-medium">50/50</button>
              <button onClick={() => quickYesNo('likely')} className="px-2 py-2 bg-green-100 hover:bg-green-200 rounded text-xs font-medium">Asi ano</button>
            </div>
          )}

          {/* Akce + Téma */}
          {activeGenerator === 'action' && (
            <button onClick={rollActionTheme} className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded font-medium text-purple-900">
              🎯 Generovat Akci + Téma
            </button>
          )}

          {/* Komplikace */}
          {activeGenerator === 'complication' && (
            <button onClick={rollComplication} className="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 rounded font-medium text-orange-900">
              ⚡ Co se komplikuje?
            </button>
          )}

          {/* Důsledek */}
          {activeGenerator === 'consequence' && (
            <button onClick={rollConsequence} className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 rounded font-medium text-red-900">
              💀 Jaký důsledek?
            </button>
          )}

          {/* Karta */}
          {activeGenerator === 'card' && (
            <button onClick={drawCard} className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 rounded font-medium text-green-900">
              🃏 Táhnout kartu
            </button>
          )}

          {/* Výsledek */}
          {lastRoll && (
            <div className="mt-3 bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
              {lastRoll.type === 'dice' && (
                <>
                  <div className="text-3xl font-bold text-amber-900">{lastRoll.total}</div>
                  <div className="text-xs text-stone-500">{lastRoll.count}d{lastRoll.sides}: [{lastRoll.dice.join(', ')}]</div>
                </>
              )}
              {lastRoll.type === 'yesno' && (
                <>
                  <div className="text-2xl font-bold text-amber-900">{lastRoll.result}</div>
                  <div className="text-xs text-stone-500">[{lastRoll.dice.join(', ')}] = {lastRoll.total}</div>
                </>
              )}
              {lastRoll.type === 'action' && (
                <>
                  <div className="text-lg font-bold text-purple-900">{lastRoll.action}</div>
                  <div className="text-lg font-bold text-purple-700">+ {lastRoll.theme}</div>
                </>
              )}
              {lastRoll.type === 'complication' && (
                <div className="text-sm font-medium text-orange-900">{lastRoll.result}</div>
              )}
              {lastRoll.type === 'consequence' && (
                <div className="text-sm font-medium text-red-900">{lastRoll.result}</div>
              )}
              {lastRoll.type === 'card' && (
                <>
                  <div className="text-4xl mb-1">{lastRoll.value}{lastRoll.suit.symbol}</div>
                  <div className="text-xs text-stone-600">{lastRoll.suit.domain}</div>
                  <div className="text-xs text-stone-500 mt-1">{lastRoll.meaning}</div>
                </>
              )}

              {/* Tlačítko pro zápis do deníku */}
              {handleLogEntry && (
                <button
                  onClick={logRollToJournal}
                  className="mt-3 w-full px-3 py-1.5 bg-stone-700 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center justify-center gap-1"
                >
                  📝 Zapsat do deníku
                </button>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
};


export { FloatingDice };

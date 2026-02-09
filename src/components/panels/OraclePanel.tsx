import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { ORACLE_TABLE, ACTION_ORACLE, THEME_ORACLE, CARD_SUITS, CARD_VALUES, CARD_VALUE_MEANINGS, ENCOUNTER_CREATURES, ENCOUNTER_ACTIVITIES, ENCOUNTER_LOCATIONS, ENCOUNTER_MOODS, ENCOUNTER_DETAILS, ENCOUNTER_MOTIVATIONS, ENCOUNTER_COMPLICATIONS, CREATURE_TYPES, CREATURE_PERSONALITIES, CREATURE_APPEARANCES, CREATURE_GOALS, CREATURE_DOING, CREATURE_MOODS, CREATURE_SECRETS, CREATURE_QUIRKS, NARRATIVE_OPENINGS, NARRATIVE_SETTINGS, EVENT_FOCUS, EVENT_ACTIONS, EVENT_SUBJECTS, EVENT_COMPLICATIONS, SETTLEMENT_RUMORS, SETTLEMENT_HAPPENINGS, NATURE_EVENTS, WILDERNESS_THREATS, DISCOVERIES } from '../../data/constants';
import { rollDice, rollD6, roll2D6, randomFrom, formatTimestamp } from '../../utils/helpers';
import { DiceDisplay, ResultBadge, SectionHeader, ResultCard, Button, HelpHeader, Input, TabNav } from '../ui/common';
import SceneManager from './SceneManager';

const OraclePanel = () => {
  const handleLogEntry = useGameStore(s => s.handleLogEntry);
  const [question, setQuestion] = useState('');
  const [probability, setProbability] = useState('even');
  const [lastResult, setLastResult] = useState(null);
  const [activeOracle, setActiveOracle] = useState('yesno');
  const [customDice, setCustomDice] = useState({ count: 1, sides: 6 });
  const [customDiceResult, setCustomDiceResult] = useState(null);
  const [diceReason, setDiceReason] = useState('');
  const [silentMode, setSilentMode] = useState(false); // Tichý režim - nezapisuje do deníku

  // Helper pro logování (respektuje silentMode)
  const logEntry = (entry) => {
    if (!silentMode && handleLogEntry) {
      handleLogEntry(entry);
    }
  };

  // Custom dice roller
  const rollCustomDice = () => {
    const results = rollDice(customDice.count, customDice.sides);
    const total = results.reduce((a, b) => a + b, 0);
    const entry = {
      type: 'oracle',
      subtype: 'custom_dice',
      timestamp: formatTimestamp(),
      dice: results,
      sides: customDice.sides,
      count: customDice.count,
      total,
      reason: diceReason || null
    };
    setCustomDiceResult(entry);
    setLastResult(entry);
    logEntry(entry);
    setDiceReason(''); // Clear after roll
  };

  const rollYesNo = () => {
    const { dice, total } = roll2D6();
    const result = ORACLE_TABLE[probability][total];
    const entry = {
      type: 'oracle',
      subtype: 'yes_no',
      timestamp: formatTimestamp(),
      question: question || '(Bez otázky)',
      probability,
      dice,
      total,
      result
    };
    setLastResult(entry);
    logEntry(entry);
    setQuestion('');
  };

  const rollActionTheme = () => {
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    const entry = {
      type: 'oracle',
      subtype: 'action_theme',
      timestamp: formatTimestamp(),
      result: `${action} + ${theme}`,
      action,
      theme
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const drawCard = () => {
    const suit = randomFrom(CARD_SUITS);
    const value = randomFrom(CARD_VALUES);
    const entry = {
      type: 'oracle',
      subtype: 'card',
      timestamp: formatTimestamp(),
      suit,
      value,
      meaning: CARD_VALUE_MEANINGS[value],
      result: `${value}${suit.symbol} - ${suit.domain}`
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // State pro generátor setkání
  const [encounterResult, setEncounterResult] = useState(null);
  const [encounterOptions, setEncounterOptions] = useState({
    includeMotivation: true,
    includeComplication: false,
    dangerLevel: 'any' // 'any', 'safe', 'dangerous'
  });

  // State pro generátor tvorů/NPC
  const [creatureResult, setCreatureResult] = useState(null);
  const [creatureOptions, setCreatureOptions] = useState({
    includeSecret: true,
    includeQuirk: true,
    categoryFilter: 'any' // 'any', 'mouse', 'rat', 'insect', 'spirit', 'fae', 'creature', 'construct', 'predator'
  });

  // State pro čistě narativní generátor - abstraktní slova
  const [narrativeResult, setNarrativeResult] = useState(null);
  const [narrativeOptions, setNarrativeOptions] = useState({
    wordCount: 3
  });

  // State pro generátor událostí (Event Generator)
  const [eventResult, setEventResult] = useState(null);
  const [eventOptions, setEventOptions] = useState({
    mode: 'full', // 'full', 'action', 'settlement', 'wilderness', 'rumor'
    includeComplication: false,
    includeFocus: true
  });

  // Abstraktní koncepty pro inspiraci
  const INSPIRE_WORDS = [
    'strach', 'naděje', 'ztráta', 'radost', 'smutek', 'hněv', 'klid', 'úzkost', 'odvaha', 'zoufalství',
    'láska', 'nenávist', 'lítost', 'vděčnost', 'osamělost', 'touha', 'pochyby', 'jistota', 'zmatenost', 'úleva',
    'útěk', 'hledání', 'skrývání', 'čekání', 'sledování', 'volba', 'oběť', 'zrada', 'pomoc', 'boj',
    'odpuštění', 'odmítnutí', 'přijetí', 'vzdání', 'návrat', 'odchod', 'setkání', 'rozloučení', 'prozrazení', 'záchrana',
    'stín', 'světlo', 'ticho', 'zvuk', 'cesta', 'hranice', 'práh', 'konec', 'začátek', 'změna',
    'tajemství', 'pravda', 'lež', 'iluze', 'vzpomínka', 'sen', 'osud', 'náhoda', 'čas', 'minulost',
    'přítel', 'nepřítel', 'cizinec', 'domov', 'rodina', 'samota', 'společenství', 'spojenectví', 'rivalita', 'důvěra',
    'nebezpečí', 'bezpečí', 'chaos', 'řád', 'temnota', 'úsvit', 'soumrak', 'bouře', 'pohyb', 'pokoj',
    'prázdnota', 'plnost', 'chlad', 'teplo', 'hlad', 'hojnost', 'nedostatek', 'růst', 'úpadek', 'proměna',
    'dar', 'dluh', 'slib', 'přísaha', 'kletba', 'požehnání', 'znamení', 'varování', 'volání', 'echo'
  ];

  // Generátor abstraktních slov
  const generateNarrative = () => {
    const count = narrativeOptions.wordCount;
    const selected = [];
    const available = [...INSPIRE_WORDS];

    for (let i = 0; i < count && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      selected.push(available[idx]);
      available.splice(idx, 1);
    }

    setNarrativeResult(selected);

    const entry = {
      type: 'oracle',
      subtype: 'narrative',
      timestamp: formatTimestamp(),
      result: selected.join(' · ')
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor setkání - kombinuje tabulky pro narativní výstup
  const generateEncounter = () => {
    // Filtruj tvory podle nebezpečí pokud je nastaveno
    let creatures = ENCOUNTER_CREATURES;
    if (encounterOptions.dangerLevel === 'safe') {
      creatures = ENCOUNTER_CREATURES.filter(c => !c.danger);
    } else if (encounterOptions.dangerLevel === 'dangerous') {
      creatures = ENCOUNTER_CREATURES.filter(c => c.danger);
    }

    const creature = randomFrom(creatures);
    const activity = randomFrom(ENCOUNTER_ACTIVITIES);
    const location = randomFrom(ENCOUNTER_LOCATIONS);
    const mood = randomFrom(ENCOUNTER_MOODS);
    const detail = randomFrom(ENCOUNTER_DETAILS);
    const motivation = encounterOptions.includeMotivation ? randomFrom(ENCOUNTER_MOTIVATIONS) : null;
    const complication = encounterOptions.includeComplication ? randomFrom(ENCOUNTER_COMPLICATIONS) : null;

    // Sestav narativní text
    let narrative = `${mood}\n\n`;
    narrative += `${location.charAt(0).toUpperCase() + location.slice(1)} spatříš **${creature.name}**. `;
    narrative += `${creature.name.charAt(0).toUpperCase() + creature.name.slice(1)} ${activity}. `;
    narrative += `${detail}`;

    if (motivation) {
      narrative += `\n\n*${motivation}*`;
    }

    if (complication) {
      narrative += `\n\n⚠️ **${complication}**`;
    }

    const result = {
      creature,
      activity,
      location,
      mood,
      detail,
      motivation,
      complication,
      narrative,
      danger: creature.danger
    };

    setEncounterResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'encounter',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor tvorů/NPC - bohatý narativní popis
  const generateCreature = () => {
    // Filtruj typy podle kategorie
    let types = CREATURE_TYPES;
    if (creatureOptions.categoryFilter !== 'any') {
      types = CREATURE_TYPES.filter(t => t.category === creatureOptions.categoryFilter);
    }
    if (types.length === 0) types = CREATURE_TYPES; // fallback

    const type = randomFrom(types);
    const personality = randomFrom(CREATURE_PERSONALITIES);
    const appearance = randomFrom(CREATURE_APPEARANCES);
    const goal = randomFrom(CREATURE_GOALS);
    const doing = randomFrom(CREATURE_DOING);
    const mood = randomFrom(CREATURE_MOODS);
    const secret = creatureOptions.includeSecret ? randomFrom(CREATURE_SECRETS) : null;
    const quirk = creatureOptions.includeQuirk ? randomFrom(CREATURE_QUIRKS) : null;

    // Generuj jméno (české myší jméno)
    const firstNames = ['Křemílek', 'Lístek', 'Proutek', 'Bělouš', 'Stínek', 'Chlupáč', 'Tichošlap', 'Bystrozrak',
      'Šedivka', 'Ořech', 'Zrnko', 'Kapka', 'Mech', 'Korál', 'Jiskra', 'Pírko', 'Hvězdička', 'Kvítek',
      'Bobek', 'Kamínek', 'Vánek', 'Stéblo', 'Rosa', 'Luna', 'Šero', 'Úsvit', 'Mraka', 'Blesk',
      'Rámus', 'Tichoun', 'Hbitec', 'Kulička', 'Pecka', 'Šiška', 'Vločka', 'Prach', 'Drobek'];
    const name = randomFrom(firstNames);

    // Sestav narativní popis
    let narrative = `**${name}** - ${type.name} ${type.icon}\n\n`;
    narrative += `${name} ${doing}. `;
    narrative += `Je ${personality}. `;
    narrative += `${mood.charAt(0).toUpperCase() + mood.slice(1)}.\n\n`;
    narrative += `**Vzhled:** ${appearance.charAt(0).toUpperCase() + appearance.slice(1)}.\n`;
    narrative += `**Cíl:** ${goal.charAt(0).toUpperCase() + goal.slice(1)}.`;

    if (quirk) {
      narrative += `\n**Zvláštnost:** ${quirk.charAt(0).toUpperCase() + quirk.slice(1)}.`;
    }

    if (secret) {
      narrative += `\n\n🔒 *Tajemství (pouze GM): ${secret}.*`;
    }

    const result = {
      name,
      type,
      personality,
      appearance,
      goal,
      doing,
      mood,
      secret,
      quirk,
      narrative
    };

    setCreatureResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'creature',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // ========== GENERÁTOR UDÁLOSTÍ ==========

  // Plný generátor událostí (Focus + Akce + Subjekt + volitelně Komplikace)
  const generateFullEvent = () => {
    const focus = eventOptions.includeFocus ? EVENT_FOCUS[Math.floor(Math.random() * EVENT_FOCUS.length)] : null;
    const action = randomFrom(EVENT_ACTIONS);
    const subject = randomFrom(EVENT_SUBJECTS);
    const complication = eventOptions.includeComplication ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = '';
    if (focus) {
      narrative += `**${focus.label}:** ${focus.description}\n\n`;
    }
    narrative += `⚡ **${action}** ${subject}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    const result = { focus, action, subject, complication, narrative, type: 'full' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor události v osadě
  const generateSettlementEvent = () => {
    const happening = randomFrom(SETTLEMENT_HAPPENINGS);
    const complication = eventOptions.includeComplication ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = `🏘️ **V osadě:** ${happening}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    const result = { happening, complication, narrative, type: 'settlement' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_settlement',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor zvěsti
  const generateRumor = () => {
    const rumor = randomFrom(SETTLEMENT_RUMORS);

    const narrative = `💬 **Zvěst:** "${rumor}"`;
    const result = { rumor, narrative, type: 'rumor' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_rumor',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor události v divočině
  const generateWildernessEvent = () => {
    // 50% hrozba, 50% objev
    const isDiscovery = Math.random() > 0.5;
    const event = isDiscovery ? randomFrom(DISCOVERIES) : randomFrom(WILDERNESS_THREATS);
    const nature = randomFrom(NATURE_EVENTS);
    const complication = eventOptions.includeComplication ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = isDiscovery
      ? `🔍 **Objev:** ${event}`
      : `⚠️ **Hrozba:** ${event}`;
    narrative += `\n🌿 **Počasí/prostředí:** ${nature}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    const result = { event, nature, complication, isDiscovery, narrative, type: 'wilderness' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_wilderness',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Jednoduchý generátor akce (jen Akce + Subjekt)
  const generateSimpleAction = () => {
    const action = randomFrom(EVENT_ACTIONS);
    const subject = randomFrom(EVENT_SUBJECTS);

    const narrative = `⚡ **${action}** ${subject}`;
    const result = { action, subject, narrative, type: 'action' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_action',
      timestamp: formatTimestamp(),
      result: `${action} ${subject}`,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const oracleTabs = [
    { id: 'yesno', label: 'Ano/Ne', icon: '🎲' },
    { id: 'event', label: 'Události', icon: '⚡' },
    { id: 'narrative', label: 'Inspirace', icon: '💭' },
    { id: 'encounter', label: 'Setkání', icon: '👁️' },
    { id: 'creature', label: 'Tvor', icon: '🐭' },
    { id: 'dice', label: 'Kostky', icon: '🎯' },
    { id: 'scene', label: 'Scéna', icon: '🎭' },
    { id: 'prompt', label: 'Prompt', icon: '💡' },
    { id: 'cards', label: 'Karty', icon: '🃏' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="🔮" 
        title="Věštírna Oracle" 
        subtitle="Nech kostky vyprávět příběh"
      />
      
      <TabNav tabs={oracleTabs} activeTab={activeOracle} onTabChange={setActiveOracle} />

      {/* Tichý režim toggle */}
      <div className="flex items-center justify-end gap-2 -mt-2 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800 transition-colors">
          <input
            type="checkbox"
            checked={silentMode}
            onChange={(e) => setSilentMode(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span className={silentMode ? 'text-amber-700 font-medium' : ''}>
            🤫 Tichý hod {silentMode && '(nezapisuje do deníku)'}
          </span>
        </label>
      </div>

      {activeOracle === 'yesno' && (
        <ResultCard>
          <HelpHeader 
            title="Yes/No Oracle" 
            icon="🎲"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Když si nejsi jistý, co se stane, zeptej se Oracle! Funguje jako neutrální rozhodčí, který ti pomůže vyprávět příběh.</p>
                
                <p className="font-bold mb-1">📝 Jak na to:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs mb-2">
                  <li><b>Polož otázku</b> - musí jít odpovědět ano/ne (např. "Je stráž vzhůru?")</li>
                  <li><b>Vyber pravděpodobnost</b> - podle toho co dává smysl v příběhu</li>
                  <li><b>Hoď</b> - a interpretuj výsledek</li>
                </ol>
                
                <p className="font-bold mb-1">🎲 Výsledky:</p>
                <ul className="text-xs space-y-1">
                  <li><b>Ne</b> = prostě ne</li>
                  <li><b>Ne, ale...</b> = ne, ale něco pozitivního (např. stráž spí, ale chrupe)</li>
                  <li><b>Ano</b> = prostě ano</li>
                  <li><b>Ano, a...</b> = ano a něco extra (např. stráž spí A má u sebe klíč)</li>
                </ul>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  💡 Tip: Když dostaneš "ale/a", hoď na Komplikace nebo Prompt pro inspiraci!
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <Input 
              value={question}
              onChange={setQuestion}
              placeholder="Zadej otázku pro oracle..."
            />
            
            <div className="flex flex-wrap gap-2">
              {['unlikely', 'even', 'likely'].map(prob => (
                <button
                  key={prob}
                  onClick={() => setProbability(prob)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    probability === prob
                      ? 'bg-amber-700 text-amber-50'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {prob === 'unlikely' ? '⬇️ Nepravděpodobné' : prob === 'likely' ? '⬆️ Pravděpodobné' : '➡️ Rovné šance'}
                </button>
              ))}
            </div>
            
            <Button onClick={rollYesNo} size="large" className="w-full">
              🎲 Hodit 2d6
            </Button>
          </div>
        </ResultCard>
      )}

      {/* ========== EVENT GENERATOR - GENERÁTOR UDÁLOSTÍ ========== */}
      {activeOracle === 'event' && (
        <ResultCard>
          <HelpHeader
            title="Generátor událostí"
            icon="⚡"
            tooltip={
              <div>
                <p className="font-bold mb-2">⚡ Co se děje?</p>
                <p className="text-xs mb-2">
                  Generátor pro náhodné události ve světě Mausritter.
                  Inspirováno systémem Mythic GME s tabulkami přizpůsobenými myšímu světu.
                </p>

                <p className="font-bold mb-1">🎯 Typy generátorů:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>• <b>Plná událost</b> - Focus + Akce + Subjekt (kdo, co, proč)</li>
                  <li>• <b>Jen akce</b> - rychlé Akce + Subjekt</li>
                  <li>• <b>V osadě</b> - co se děje v městě/vesnici</li>
                  <li>• <b>Divočina</b> - hrozby a objevy v přírodě</li>
                  <li>• <b>Zvěst</b> - drby a fámy</li>
                </ul>

                <p className="text-xs text-stone-300 italic">
                  💡 Tip: Přidej komplikaci pro dramatičtější události!
                </p>
              </div>
            }
          />

          {/* Tlačítka pro různé typy generátorů */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            <Button onClick={generateFullEvent} variant="primary" className="flex-1">
              ⚡ Plná událost
            </Button>
            <Button onClick={generateSimpleAction} variant="secondary" className="flex-1">
              🎯 Jen akce
            </Button>
            <Button onClick={generateSettlementEvent} variant="secondary" className="flex-1">
              🏘️ V osadě
            </Button>
            <Button onClick={generateWildernessEvent} variant="secondary" className="flex-1">
              🌲 Divočina
            </Button>
            <Button onClick={generateRumor} variant="secondary" className="flex-1">
              💬 Zvěst
            </Button>
          </div>

          {/* Možnosti */}
          <div className="flex flex-wrap gap-4 justify-center mb-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eventOptions.includeFocus}
                onChange={(e) => setEventOptions({...eventOptions, includeFocus: e.target.checked})}
                className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>🎯 Focus (koho se týká)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eventOptions.includeComplication}
                onChange={(e) => setEventOptions({...eventOptions, includeComplication: e.target.checked})}
                className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>⚠️ Přidat komplikaci</span>
            </label>
          </div>

          {/* Výsledek */}
          {eventResult && (
            <div className="p-4 rounded-lg bg-stone-800 text-stone-100">
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line">
                {eventResult.narrative.split('\n').map((line, i) => {
                  // Parse markdown-like formatting
                  const formatted = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em class="text-stone-400">$1</em>');
                  return <p key={i} className="mb-1" dangerouslySetInnerHTML={{__html: formatted}} />;
                })}
              </div>
            </div>
          )}

          {/* Info o tabulkách */}
          <div className="mt-4 text-center text-xs text-stone-500">
            <p>📊 20 fokusů · 20 akcí · 20 subjektů · 12 komplikací</p>
            <p>🏘️ 20 osadních událostí · 20 zvěstí · 12 hrozeb · 12 objevů · 12 počasí</p>
          </div>
        </ResultCard>
      )}

      {/* ========== NARRATIVE GENERATOR - ABSTRAKTNÍ SLOVA ========== */}
      {activeOracle === 'narrative' && (
        <ResultCard>
          <HelpHeader
            title="Inspirace"
            icon="💭"
            tooltip={
              <div>
                <p className="font-bold mb-2">💭 Abstraktní inspirace</p>
                <p className="text-xs">
                  Jen obecná slova. Ty si je poskládáš podle situace.
                </p>
              </div>
            }
          />

          {/* Počet slov */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-sm text-stone-600">Počet slov:</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setNarrativeOptions({ wordCount: n })}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    narrativeOptions.wordCount === n
                      ? 'bg-amber-700 text-amber-50'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={generateNarrative} variant="primary" size="large" className="w-full mb-4">
            💭 Inspiruj mě
          </Button>

          {/* Výsledek - slova */}
          {narrativeResult && (
            <div className="p-6 rounded-lg bg-stone-800 text-center">
              <div className="flex flex-wrap justify-center gap-3">
                {narrativeResult.map((word, i) => (
                  <span key={i} className="text-2xl font-light text-amber-100 tracking-wide">
                    {word}
                    {i < narrativeResult.length - 1 && <span className="text-stone-500 ml-3">·</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <p className="text-center text-xs text-stone-400 mt-4">
            100 abstraktních konceptů
          </p>
        </ResultCard>
      )}

      {/* ========== ENCOUNTER GENERATOR ========== */}
      {activeOracle === 'encounter' && (
        <ResultCard>
          <HelpHeader
            title="Generátor setkání"
            icon="👁️"
            tooltip={
              <div>
                <p className="font-bold mb-2">👁️ Co je tohle?</p>
                <p className="text-xs mb-2">
                  Narativní generátor náhodných setkání v duchu Mausritter.
                  Kombinuje 40+ tvorů, 35 aktivit, 30 lokací, 25 nálad, 40 detailů,
                  30 motivací a 25 komplikací = více než 5 milionů unikátních kombinací!
                </p>

                <p className="font-bold mb-1">🎭 Výstup:</p>
                <p className="text-xs text-stone-300 mb-2">
                  Plně narativní popis setkání, který můžeš rovnou použít ve hře.
                </p>

                <p className="font-bold mb-1">⚙️ Možnosti:</p>
                <ul className="text-xs space-y-1">
                  <li>• <b>Motivace</b> - přidá důvod proč tvor jedná</li>
                  <li>• <b>Komplikace</b> - přidá twist nebo nebezpečí</li>
                  <li>• <b>Nebezpečí</b> - filtruj bezpečné/nebezpečné tvory</li>
                </ul>
              </div>
            }
          />

          {/* Možnosti generátoru */}
          <div className="mb-4 p-3 bg-stone-100 rounded-lg space-y-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encounterOptions.includeMotivation}
                  onChange={(e) => setEncounterOptions(prev => ({ ...prev, includeMotivation: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Zahrnout motivaci</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encounterOptions.includeComplication}
                  onChange={(e) => setEncounterOptions(prev => ({ ...prev, includeComplication: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Přidat komplikaci</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Nebezpečí:</span>
              <select
                value={encounterOptions.dangerLevel}
                onChange={(e) => setEncounterOptions(prev => ({ ...prev, dangerLevel: e.target.value }))}
                className="text-sm border border-stone-300 rounded px-2 py-1"
              >
                <option value="any">Jakékoliv</option>
                <option value="safe">Bezpečné</option>
                <option value="dangerous">Nebezpečné</option>
              </select>
            </div>
          </div>

          <Button onClick={generateEncounter} variant="primary" size="large" className="w-full mb-4">
            👁️ Generovat setkání
          </Button>

          {/* Výsledek */}
          {encounterResult && (
            <div className={`p-4 rounded-lg border-2 ${encounterResult.danger ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
              {encounterResult.danger && (
                <div className="flex items-center gap-2 mb-3 text-red-700 font-bold">
                  <span>⚠️</span>
                  <span>NEBEZPEČNÉ SETKÁNÍ</span>
                </div>
              )}

              {/* Nálada */}
              <p className="text-stone-500 italic mb-3">{encounterResult.mood}</p>

              {/* Hlavní popis */}
              <div className="text-stone-800 leading-relaxed mb-3">
                <span className="text-stone-500">{encounterResult.location.charAt(0).toUpperCase() + encounterResult.location.slice(1)} spatříš </span>
                <span className="font-bold text-amber-800">{encounterResult.creature.name}</span>
                <span className="text-stone-500">. </span>
                <span>{encounterResult.creature.name.charAt(0).toUpperCase() + encounterResult.creature.name.slice(1)} {encounterResult.activity}. </span>
                <span className="text-stone-700">{encounterResult.detail}</span>
              </div>

              {/* Motivace */}
              {encounterResult.motivation && (
                <div className="mb-3 p-2 bg-white/50 rounded border-l-4 border-blue-400">
                  <span className="text-xs text-blue-600 font-medium block mb-1">💭 MOTIVACE</span>
                  <p className="text-stone-700 italic">{encounterResult.motivation}</p>
                </div>
              )}

              {/* Komplikace */}
              {encounterResult.complication && (
                <div className="p-2 bg-red-100 rounded border-l-4 border-red-500">
                  <span className="text-xs text-red-600 font-medium block mb-1">⚠️ KOMPLIKACE</span>
                  <p className="text-red-800 font-medium">{encounterResult.complication}</p>
                </div>
              )}

              {/* Meta info */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap gap-2 text-xs text-stone-500">
                <span className="px-2 py-1 bg-stone-100 rounded">
                  {encounterResult.creature.type === 'npc' ? '🐭 NPC' :
                   encounterResult.creature.type === 'predator' ? '🦅 Predátor' :
                   encounterResult.creature.type === 'supernatural' ? '✨ Nadpřirozené' : '🐛 Tvor'}
                </span>
                {encounterResult.danger && <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Nebezpečné</span>}
              </div>
            </div>
          )}

          {/* Statistiky */}
          <p className="text-center text-xs text-stone-400 mt-4">
            41 × 35 × 30 × 25 × 40 × 30 × 25 = ~5,400,000,000 kombinací
          </p>
        </ResultCard>
      )}

      {/* ========== CREATURE GENERATOR ========== */}
      {activeOracle === 'creature' && (
        <ResultCard>
          <HelpHeader
            title="Generátor tvorů & NPC"
            icon="🐭"
            tooltip={
              <div>
                <p className="font-bold mb-2">🐭 Co je tohle?</p>
                <p className="text-xs mb-2">
                  Narativní generátor postav a tvorů pro Mausritter.
                  Kombinuje 50 typů, 40 osobností, 45 vzhledů, 50 cílů,
                  40 aktivit, 35 nálad, 35 tajemství a 40 zvláštností.
                </p>

                <p className="font-bold mb-1">🎭 Výstup:</p>
                <p className="text-xs text-stone-300 mb-2">
                  Kompletní NPC s jménem, osobností, vzhledem, cílem a tajemstvím.
                </p>

                <p className="font-bold mb-1">⚙️ Možnosti:</p>
                <ul className="text-xs space-y-1">
                  <li>• <b>Tajemství</b> - skryté informace pro GM</li>
                  <li>• <b>Zvláštnost</b> - unikátní vlastnost nebo obsese</li>
                  <li>• <b>Kategorie</b> - filtruj typ tvora</li>
                </ul>
              </div>
            }
          />

          {/* Možnosti generátoru */}
          <div className="mb-4 p-3 bg-stone-100 rounded-lg space-y-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={creatureOptions.includeSecret}
                  onChange={(e) => setCreatureOptions(prev => ({ ...prev, includeSecret: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Zahrnout tajemství</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={creatureOptions.includeQuirk}
                  onChange={(e) => setCreatureOptions(prev => ({ ...prev, includeQuirk: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Přidat zvláštnost</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Kategorie:</span>
              <select
                value={creatureOptions.categoryFilter}
                onChange={(e) => setCreatureOptions(prev => ({ ...prev, categoryFilter: e.target.value }))}
                className="text-sm border border-stone-300 rounded px-2 py-1"
              >
                <option value="any">Jakákoliv</option>
                <option value="mouse">🐭 Myš</option>
                <option value="rat">🐀 Krysa</option>
                <option value="insect">🐛 Hmyz</option>
                <option value="creature">🐸 Tvor</option>
                <option value="spirit">👻 Duch</option>
                <option value="fae">🧚 Víla/Skřítek</option>
                <option value="construct">⚙️ Konstrukt</option>
                <option value="predator">🦉 Predátor</option>
              </select>
            </div>
          </div>

          <Button onClick={generateCreature} variant="primary" size="large" className="w-full mb-4">
            🐭 Generovat tvora
          </Button>

          {/* Výsledek */}
          {creatureResult && (
            <div className="p-4 rounded-lg border-2 bg-amber-50 border-amber-300">
              {/* Hlavička s jménem a typem */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{creatureResult.type.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-amber-900">{creatureResult.name}</h3>
                  <p className="text-sm text-stone-600">{creatureResult.type.name}</p>
                </div>
              </div>

              {/* Aktivita a nálada */}
              <p className="text-stone-700 mb-3">
                {creatureResult.name} {creatureResult.doing}.
                <span className="text-stone-600"> Je {creatureResult.personality}. </span>
                <span className="italic text-stone-500">{creatureResult.mood.charAt(0).toUpperCase() + creatureResult.mood.slice(1)}.</span>
              </p>

              {/* Vzhled */}
              <div className="mb-2 p-2 bg-white/50 rounded border-l-4 border-amber-400">
                <span className="text-xs text-amber-700 font-medium block mb-1">👁️ VZHLED</span>
                <p className="text-stone-700">{creatureResult.appearance.charAt(0).toUpperCase() + creatureResult.appearance.slice(1)}.</p>
              </div>

              {/* Cíl */}
              <div className="mb-2 p-2 bg-white/50 rounded border-l-4 border-blue-400">
                <span className="text-xs text-blue-600 font-medium block mb-1">🎯 CÍL</span>
                <p className="text-stone-700">{creatureResult.goal.charAt(0).toUpperCase() + creatureResult.goal.slice(1)}.</p>
              </div>

              {/* Zvláštnost */}
              {creatureResult.quirk && (
                <div className="mb-2 p-2 bg-white/50 rounded border-l-4 border-purple-400">
                  <span className="text-xs text-purple-600 font-medium block mb-1">✨ ZVLÁŠTNOST</span>
                  <p className="text-stone-700">{creatureResult.quirk.charAt(0).toUpperCase() + creatureResult.quirk.slice(1)}.</p>
                </div>
              )}

              {/* Tajemství - pouze pro GM */}
              {creatureResult.secret && (
                <div className="mt-3 p-2 bg-stone-800 rounded border-l-4 border-stone-600">
                  <span className="text-xs text-stone-400 font-medium block mb-1">🔒 TAJEMSTVÍ (pouze GM)</span>
                  <p className="text-stone-300 italic">{creatureResult.secret.charAt(0).toUpperCase() + creatureResult.secret.slice(1)}.</p>
                </div>
              )}

              {/* Meta info + Save button */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-500">
                  {creatureResult.type.category === 'mouse' ? '🐭 Myš' :
                   creatureResult.type.category === 'rat' ? '🐀 Krysa' :
                   creatureResult.type.category === 'insect' ? '🐛 Hmyz' :
                   creatureResult.type.category === 'spirit' ? '👻 Duch' :
                   creatureResult.type.category === 'fae' ? '🧚 Víla' :
                   creatureResult.type.category === 'construct' ? '⚙️ Konstrukt' :
                   creatureResult.type.category === 'predator' ? '🦉 Predátor' : '🐸 Tvor'}
                </span>
                {silentMode && (
                  <button
                    onClick={() => {
                      const entry = {
                        type: 'oracle',
                        subtype: 'creature',
                        timestamp: formatTimestamp(),
                        result: creatureResult.narrative,
                        data: creatureResult
                      };
                      handleLogEntry(entry);
                    }}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    📥 Uložit do deníku
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Statistiky */}
          <p className="text-center text-xs text-stone-400 mt-4">
            50 × 40 × 45 × 50 × 40 × 35 × 35 × 40 = ~25,200,000,000,000 kombinací
          </p>
        </ResultCard>
      )}

      {activeOracle === 'dice' && (
        <ResultCard>
          <HelpHeader 
            title="Hod kostkou" 
            icon="🎯"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Univerzální kostky pro cokoliv! Používej když hraješ připravené dobrodružství s vlastními tabulkami.</p>
                
                <p className="font-bold mb-1">📝 Příklady použití:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>• <b>Random encounter</b> - dobrodružství říká "hoď d8 na tabulku setkání"</li>
                  <li>• <b>Loot/poklad</b> - "hoď d6 co najdeš v truhle"</li>
                  <li>• <b>NPC reakce</b> - 2d6 na reakční tabulku</li>
                  <li>• <b>Dungeon room</b> - d20 na obsah místnosti</li>
                </ul>
                
                <p className="font-bold mb-1">⚡ Rychlé tlačítka:</p>
                <p className="text-xs text-stone-300">Klikni na d4/d6/d8/d10/d12/d20 pro okamžitý hod jednou kostkou.</p>
                
                <p className="font-bold mb-1 mt-2">🎲 Vlastní hod:</p>
                <p className="text-xs text-stone-300">Vyber počet kostek a typ (např. 3d6, 2d10, 1d100) pro složitější hody.</p>
              </div>
            }
          />
          
          {/* Quick dice buttons */}
          <div className="mb-4">
            <div className="text-sm text-stone-600 mb-2">Rychlý hod:</div>
            <div className="flex flex-wrap gap-2">
              {[4, 6, 8, 10, 12, 20].map(sides => (
                <button
                  key={sides}
                  onClick={() => {
                    const result = rollDice(1, sides)[0];
                    const entry = {
                      type: 'oracle', subtype: 'custom_dice', timestamp: formatTimestamp(),
                      dice: [result], sides, count: 1, total: result
                    };
                    setCustomDiceResult(entry);
                    setLastResult(entry);
                    handleLogEntry(entry);
                  }}
                  className="px-4 py-3 bg-amber-100 hover:bg-amber-200 rounded-lg font-bold text-amber-900 transition-colors min-w-[60px]"
                >
                  d{sides}
                </button>
              ))}
            </div>
          </div>

          {/* Custom dice config */}
          <div className="p-3 bg-stone-100 rounded-lg mb-4">
            <div className="text-sm text-stone-600 mb-2">Vlastní hod:</div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <select
                value={customDice.count}
                onChange={(e) => setCustomDice({ ...customDice, count: parseInt(e.target.value) })}
                className="px-3 py-2 rounded border border-stone-300 bg-white font-bold"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="font-bold text-stone-600">d</span>
              <input
                type="number"
                min="2"
                max="1000"
                value={customDice.sides}
                onChange={(e) => setCustomDice({ ...customDice, sides: parseInt(e.target.value) || 6 })}
                className="px-3 py-2 rounded border border-stone-300 bg-white font-bold w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={diceReason}
                onChange={(e) => setDiceReason(e.target.value)}
                placeholder="Na co házíš? (např. test SÍL, útok...)"
                className="flex-1 px-3 py-2 rounded border border-stone-300 bg-white"
                onKeyDown={(e) => e.key === 'Enter' && rollCustomDice()}
              />
              <Button onClick={rollCustomDice}>
                🎲 Hodit
              </Button>
            </div>
          </div>

          {/* Result */}
          {customDiceResult && (
            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-stone-600">{customDiceResult.count}d{customDiceResult.sides}</span>
                <span className="text-xs text-stone-400">{customDiceResult.timestamp}</span>
              </div>
              {customDiceResult.reason && (
                <p className="text-stone-700 font-medium mb-2">{customDiceResult.reason}</p>
              )}
              <div className="flex items-center gap-3">
                <DiceDisplay dice={customDiceResult.dice} size="large" />
                {customDiceResult.count > 1 && (
                  <div className="text-3xl font-bold text-amber-700">= {customDiceResult.total}</div>
                )}
              </div>
            </div>
          )}
        </ResultCard>
      )}

      {activeOracle === 'scene' && <SceneManager />}

      {activeOracle === 'prompt' && (
        <ResultCard>
          <HelpHeader 
            title="Akce + Téma generátor" 
            icon="💡"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Náhodně vygeneruje dvojici slov (sloveso + téma), která ti dá inspiraci když nevíš co dál.</p>
                
                <p className="font-bold mb-1">📝 Kdy použít:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>• <b>Co chce NPC?</b> → "Protect + Family" = chrání svou rodinu</li>
                  <li>• <b>Co je v místnosti?</b> → "Hide + Treasure" = ukrytý poklad</li>
                  <li>• <b>Proč se to děje?</b> → "Seek + Revenge" = někdo chce pomstu</li>
                  <li>• <b>Co se stalo?</b> → "Destroy + Bond" = zničené přátelství</li>
                  <li>• <b>Co dál?</b> → "Discover + Secret" = je třeba najít tajemství</li>
                </ul>
                
                <p className="font-bold mb-1">💡 Jak interpretovat:</p>
                <p className="text-xs text-stone-300">
                  Spoj obě slova do věty nebo myšlenky. Buď kreativní! Výsledek nemusí dávat smysl doslova - hledej asociace a nápady.
                </p>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  Tip: Pokud první hod nedává smysl, hoď znovu nebo kombinuj s předchozím.
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <p className="text-stone-600">Generuj náhodnou inspiraci kombinací Akce + Tématu z Ironsworn oracle tabulek.</p>
            <Button onClick={rollActionTheme} size="large" className="w-full">
              💡 Generovat Prompt
            </Button>
          </div>
        </ResultCard>
      )}

      {activeOracle === 'cards' && (
        <ResultCard>
          <HelpHeader 
            title="Karetní Oracle" 
            icon="🃏"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Alternativa k Oracle - místo ano/ne dostaneš symbolickou odpověď, kterou interpretuješ.</p>
                
                <p className="font-bold mb-1">🎴 Barvy (oblast života):</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>♥️ <b>Srdce</b> = vztahy, emoce, láska, podvod</li>
                  <li>♦️ <b>Káry</b> = peníze, obchod, praktické věci</li>
                  <li>♣️ <b>Kříže</b> = akce, boj, fyzické, pohyb</li>
                  <li>♠️ <b>Piky</b> = magie, tajemství, smrt, duchovní</li>
                </ul>
                
                <p className="font-bold mb-1">🔢 Hodnoty (rozsah):</p>
                <ul className="text-xs space-y-1">
                  <li><b>2-4:</b> Malé, osobní</li>
                  <li><b>5-7:</b> Střední, skupinové</li>
                  <li><b>8-10:</b> Velké, důležité</li>
                  <li><b>J:</b> Osoba, agent změny</li>
                  <li><b>Q:</b> Autorita, instituce</li>
                  <li><b>K:</b> Moc, vrchol, vláda</li>
                  <li><b>A:</b> Čistá esence, podstata</li>
                </ul>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  💡 Příklad: 7♠ = "Velké tajemství" nebo "Významná magie"
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {CARD_SUITS.map(suit => (
                <div key={suit.symbol} className="p-3 bg-amber-100/50 rounded-lg">
                  <span className="text-2xl">{suit.symbol}</span>
                  <span className="font-bold ml-2">{suit.name}</span>
                  <p className="text-stone-600 mt-1">{suit.domain}</p>
                </div>
              ))}
            </div>
            <Button onClick={drawCard} size="large" className="w-full">
              🃏 Vytáhnout kartu
            </Button>
          </div>
        </ResultCard>
      )}

      {/* Last Result Display */}
      {lastResult && (
        <ResultCard title="📋 Poslední výsledek" className="border-amber-500 border-2">
          {lastResult.dice && <DiceDisplay dice={lastResult.dice} size="large" />}
          
          <div className="mt-4 text-center space-y-2">
            {lastResult.question && (
              <p className="text-stone-600 italic">"{lastResult.question}"</p>
            )}
            
            {lastResult.suit && (
              <div className="text-5xl my-4">
                {lastResult.value}{lastResult.suit.symbol}
              </div>
            )}
            
            <ResultBadge result={lastResult.result} />
            
            {lastResult.meaning && (
              <p className="text-stone-600 mt-2">{lastResult.meaning}</p>
            )}
            {lastResult.suit && (
              <p className="text-amber-700 font-medium">{lastResult.suit.keywords}</p>
            )}
          </div>
        </ResultCard>
      )}
    </div>
  );
};


export { OraclePanel };

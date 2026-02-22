import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import {
  ORACLE_TABLE, ACTION_ORACLE, THEME_ORACLE, SCENE_TYPE_LABELS,
  ENCOUNTER_CREATURES, ENCOUNTER_ACTIVITIES, ENCOUNTER_LOCATIONS,
  ENCOUNTER_MOODS, ENCOUNTER_DETAILS, ENCOUNTER_MOTIVATIONS,
} from '../../data/constants';
import { roll2D6, rollDice, randomFrom, formatTimestamp } from '../../utils/helpers';
import { Button } from '../ui/common';
import { CombatPanel } from './CombatPanel';
import type { SceneType, SceneThread, SceneOutcome } from '../../types';

// ────────────────────────────────────────────────────────────────
// SceneStrip — vždy viditelný pruh scény
// ────────────────────────────────────────────────────────────────

const SceneStrip = () => {
  const getSceneState = useGameStore(s => s.getSceneState);
  const startScene = useGameStore(s => s.startScene);
  const endScene = useGameStore(s => s.endScene);
  const adjustChaosFactor = useGameStore(s => s.adjustChaosFactor);
  const addThread = useGameStore(s => s.addThread);
  const removeThread = useGameStore(s => s.removeThread);
  const toggleThreadResolved = useGameStore(s => s.toggleThreadResolved);
  const activeParty = useGameStore(s => s.getActiveParty());

  const [sceneTitle, setSceneTitle] = useState('');
  const [sceneType, setSceneType] = useState<SceneType>('exploration');
  const [showThreads, setShowThreads] = useState(false);
  const [newThread, setNewThread] = useState('');

  if (!activeParty) {
    return (
      <div className="bg-stone-100 border border-stone-300 rounded-xl p-4 text-center text-stone-500 text-sm">
        🐭 Vyber nebo vytvoř družinu v panelu Postavy
      </div>
    );
  }

  const { chaosFactor, currentScene, threads, sceneCount } = getSceneState();

  const handleStart = () => {
    if (!sceneTitle.trim()) return;
    startScene(sceneTitle.trim(), sceneType);
    setSceneTitle('');
  };

  const handleAddThread = () => {
    if (!newThread.trim()) return;
    addThread(newThread.trim());
    setNewThread('');
  };

  // ── Žádná scéna: formulář ──────────────────────────────────
  if (!currentScene) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <span>🎬</span>
          <span>Zahájit novou scénu</span>
          {sceneCount > 0 && (
            <span className="ml-auto text-xs text-amber-600 font-normal">Scény: {sceneCount}</span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            value={sceneTitle}
            onChange={(e) => setSceneTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Název scény..."
            className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-amber-300 bg-white text-sm"
          />
          <select
            value={sceneType}
            onChange={(e) => setSceneType(e.target.value as SceneType)}
            className="px-3 py-2 rounded-lg border border-amber-300 bg-white text-sm font-medium"
          >
            {Object.entries(SCENE_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <Button onClick={handleStart} variant="primary">
            Zahájit →
          </Button>
        </div>

        {/* Threads (zapletky) i bez scény */}
        {threads.length > 0 && (
          <button
            onClick={() => setShowThreads(!showThreads)}
            className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            {showThreads ? '▲' : '▾'} Zapletky ({threads.filter(t => !t.resolved).length} aktivní)
          </button>
        )}
        {showThreads && <ThreadList threads={threads} onToggle={toggleThreadResolved} onRemove={removeThread} />}
      </div>
    );
  }

  // ── Aktivní scéna ─────────────────────────────────────────
  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl overflow-hidden">
      {/* Hlavní pruh */}
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
        <span className="text-amber-700 font-bold text-sm shrink-0">
          🎬 #{currentScene.number}: {currentScene.title}
        </span>
        <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
          {SCENE_TYPE_LABELS[currentScene.type] || currentScene.type}
        </span>

        {/* Chaos Factor */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <span className="text-xs text-stone-500">CF:</span>
          <button
            onClick={() => adjustChaosFactor(-1)}
            disabled={chaosFactor <= 1}
            className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-700 font-bold text-sm flex items-center justify-center"
          >–</button>
          <span className="w-6 text-center font-bold text-amber-800">{chaosFactor}</span>
          <button
            onClick={() => adjustChaosFactor(1)}
            disabled={chaosFactor >= 9}
            className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-700 font-bold text-sm flex items-center justify-center"
          >+</button>
        </div>

        <button
          onClick={() => setShowThreads(!showThreads)}
          className="text-xs text-amber-700 hover:text-amber-900 shrink-0"
        >
          {showThreads ? '▲' : '▾'} Zapletky ({threads.filter(t => !t.resolved).length})
        </button>

        <Button onClick={() => endScene('in_control')} variant="secondary" size="small" className="shrink-0">
          🏁 Konec scény
        </Button>
      </div>

      {/* Zapletky (collapsible) */}
      {showThreads && (
        <div className="border-t border-amber-200 px-4 py-3 bg-amber-50/80 space-y-2">
          <ThreadList threads={threads} onToggle={toggleThreadResolved} onRemove={removeThread} />
          <div className="flex gap-2 mt-2">
            <input
              value={newThread}
              onChange={(e) => setNewThread(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddThread()}
              placeholder="Nová zápletka..."
              className="flex-1 px-3 py-1.5 text-sm rounded border border-amber-300 bg-white"
            />
            <button
              onClick={handleAddThread}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// ThreadList — seznam zápletek
// ────────────────────────────────────────────────────────────────

const ThreadList = ({ threads, onToggle, onRemove }: {
  threads: SceneThread[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) => (
  <ul className="space-y-1">
    {threads.map(t => (
      <li key={t.id} className="flex items-center gap-2 text-sm">
        <button
          onClick={() => onToggle(t.id)}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            t.resolved
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-amber-400 bg-white'
          }`}
        >
          {t.resolved && '✓'}
        </button>
        <span className={t.resolved ? 'line-through text-stone-400' : 'text-stone-700'}>
          {t.description}
        </span>
        <button
          onClick={() => onRemove(t.id)}
          className="ml-auto text-stone-400 hover:text-red-500 text-xs shrink-0"
        >
          ✕
        </button>
      </li>
    ))}
  </ul>
);

// ────────────────────────────────────────────────────────────────
// OracleQuick — 4 zjednodušené oracle taby
// ────────────────────────────────────────────────────────────────

const OracleQuick = () => {
  const handleLogEntry = useGameStore(s => s.handleLogEntry);
  const [activeTab, setActiveTab] = useState('yesno');
  const [lastResult, setLastResult] = useState<string | null>(null);

  // Ano/Ne state
  const [question, setQuestion] = useState('');
  const [probability, setProbability] = useState<'unlikely' | 'even' | 'likely'>('even');

  // Kostky state
  const [diceCount, setDiceCount] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [diceReason, setDiceReason] = useState('');
  const [diceResult, setDiceResult] = useState<{ dice: number[]; total: number } | null>(null);

  const log = (entry: Record<string, unknown>) => handleLogEntry(entry);

  // ── Ano/Ne ────────────────────────────────────────────────
  const rollYesNo = () => {
    const { dice, total } = roll2D6();
    const result = ORACLE_TABLE[probability][total as keyof typeof ORACLE_TABLE[typeof probability]];
    const entry = {
      type: 'oracle',
      subtype: 'yes_no',
      timestamp: formatTimestamp(),
      question: question || '(Bez otázky)',
      probability,
      dice,
      total,
      result,
    };
    setLastResult(`${question ? `"${question}" → ` : ''}**${result}** (2d6: ${total})`);
    log(entry);
    setQuestion('');
  };

  // ── Akce+Téma ─────────────────────────────────────────────
  const rollActionTheme = () => {
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    const entry = {
      type: 'oracle',
      subtype: 'action_theme',
      timestamp: formatTimestamp(),
      result: `${action} + ${theme}`,
      action,
      theme,
    };
    setLastResult(`**${action}** + **${theme}**`);
    log(entry);
  };

  // ── Setkání ───────────────────────────────────────────────
  const rollEncounter = () => {
    const creature = randomFrom(ENCOUNTER_CREATURES);
    const activity = randomFrom(ENCOUNTER_ACTIVITIES);
    const location = randomFrom(ENCOUNTER_LOCATIONS);
    const mood = randomFrom(ENCOUNTER_MOODS);
    const detail = randomFrom(ENCOUNTER_DETAILS);
    const motivation = randomFrom(ENCOUNTER_MOTIVATIONS);
    const narrative = `${mood}. ${location.charAt(0).toUpperCase() + location.slice(1)} spatříš **${creature.name}**. ${creature.name} ${activity}. ${detail} *${motivation}*`;
    const entry = {
      type: 'oracle',
      subtype: 'encounter',
      timestamp: formatTimestamp(),
      result: narrative,
    };
    setLastResult(narrative);
    log(entry);
  };

  // ── Kostky ────────────────────────────────────────────────
  const rollCustomDice = () => {
    const dice = rollDice(diceCount, diceSides);
    const total = dice.reduce((a, b) => a + b, 0);
    setDiceResult({ dice, total });
    const entry = {
      type: 'oracle',
      subtype: 'custom_dice',
      timestamp: formatTimestamp(),
      dice,
      sides: diceSides,
      count: diceCount,
      total,
      reason: diceReason || null,
    };
    setLastResult(`${diceCount}d${diceSides}: [${dice.join(', ')}]${diceCount > 1 ? ` = ${total}` : ''}${diceReason ? ` (${diceReason})` : ''}`);
    log(entry);
    setDiceReason('');
  };

  const oracleTabs = [
    { id: 'yesno', label: 'Ano/Ne', icon: '🎲' },
    { id: 'action', label: 'Akce+Téma', icon: '💡' },
    { id: 'encounter', label: 'Setkání', icon: '👁️' },
    { id: 'dice', label: 'Kostky', icon: '🎯' },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      {/* Taby */}
      <div className="border-b border-stone-200">
        <div className="flex overflow-x-auto">
          {oracleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-50 text-amber-900 border-b-2 border-amber-500'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* ── ANO/NE ── */}
        {activeTab === 'yesno' && (
          <div className="space-y-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && rollYesNo()}
              placeholder="Zadej otázku pro oracle..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {(['unlikely', 'even', 'likely'] as const).map(prob => (
                <button
                  key={prob}
                  onClick={() => setProbability(prob)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                    probability === prob
                      ? 'bg-amber-700 text-amber-50'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {prob === 'unlikely' ? '⬇️ Nepravděpodobné' : prob === 'likely' ? '⬆️ Pravděpodobné' : '➡️ Rovné šance'}
                </button>
              ))}
            </div>
            <Button onClick={rollYesNo} variant="primary" className="w-full">
              🎲 Hodit 2d6
            </Button>
          </div>
        )}

        {/* ── AKCE+TÉMA ── */}
        {activeTab === 'action' && (
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              Náhodná kombinace Akce + Tématu z Ironsworn oracle tabulek. Použij pro inspiraci když nevíš co dál.
            </p>
            <Button onClick={rollActionTheme} variant="primary" className="w-full">
              💡 Generovat Akce + Téma
            </Button>
          </div>
        )}

        {/* ── SETKÁNÍ ── */}
        {activeTab === 'encounter' && (
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              Narativní setkání s náhodným tvorem, aktivitou a motivací.
            </p>
            <Button onClick={rollEncounter} variant="primary" className="w-full">
              👁️ Generovat setkání
            </Button>
          </div>
        )}

        {/* ── KOSTKY ── */}
        {activeTab === 'dice' && (
          <div className="space-y-3">
            {/* Rychlé kostky */}
            <div className="flex flex-wrap gap-2">
              {[4, 6, 8, 10, 12, 20].map(sides => (
                <button
                  key={sides}
                  onClick={() => {
                    const result = rollDice(1, sides)[0];
                    setDiceResult({ dice: [result], total: result });
                    const entry = {
                      type: 'oracle', subtype: 'custom_dice', timestamp: formatTimestamp(),
                      dice: [result], sides, count: 1, total: result,
                    };
                    setLastResult(`d${sides}: **${result}**`);
                    log(entry);
                  }}
                  className="px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg font-bold text-amber-900 text-sm transition-colors"
                >
                  d{sides}
                </button>
              ))}
            </div>
            {/* Vlastní hod */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={diceCount}
                onChange={(e) => setDiceCount(parseInt(e.target.value))}
                className="px-2 py-1.5 rounded border border-stone-300 bg-white font-bold text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="font-bold text-stone-600">d</span>
              <input
                type="number"
                min="2"
                max="1000"
                value={diceSides}
                onChange={(e) => setDiceSides(parseInt(e.target.value) || 6)}
                className="w-16 px-2 py-1.5 rounded border border-stone-300 bg-white font-bold text-sm"
              />
              <input
                type="text"
                value={diceReason}
                onChange={(e) => setDiceReason(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && rollCustomDice()}
                placeholder="Proč? (volitelné)"
                className="flex-1 min-w-[120px] px-2 py-1.5 text-sm rounded border border-stone-300 bg-white"
              />
              <Button onClick={rollCustomDice} variant="primary">
                Hodit
              </Button>
            </div>
            {/* Výsledek kostek */}
            {diceResult && activeTab === 'dice' && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex gap-1 flex-wrap">
                  {diceResult.dice.map((d, i) => (
                    <span key={i} className="w-8 h-8 flex items-center justify-center bg-amber-700 text-amber-50 rounded font-bold text-sm">
                      {d}
                    </span>
                  ))}
                </div>
                {diceResult.dice.length > 1 && (
                  <span className="text-xl font-bold text-amber-800 ml-2">= {diceResult.total}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Výsledek */}
        {lastResult && (
          <div className="p-3 bg-stone-800 text-stone-100 rounded-lg text-sm">
            <span className="text-stone-400 text-xs block mb-1">Výsledek:</span>
            <span
              dangerouslySetInnerHTML={{
                __html: lastResult
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em class="text-stone-400">$1</em>'),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// CombatArea — toggle pro CombatPanel
// ────────────────────────────────────────────────────────────────

const CombatArea = () => {
  const [showCombat, setShowCombat] = useState(false);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setShowCombat(!showCombat)}
        className={`w-full flex items-center justify-between px-4 py-3 font-medium text-sm transition-colors ${
          showCombat
            ? 'bg-red-50 text-red-800 border-b border-red-200'
            : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
        }`}
      >
        <span>⚔️ Souboj</span>
        <span className="text-xs text-stone-500">{showCombat ? '▲ Skrýt' : '▼ Zahájit souboj'}</span>
      </button>
      {showCombat && (
        <div className="p-4 bg-white">
          <CombatPanel />
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// PlayArea — hlavní komponenta
// ────────────────────────────────────────────────────────────────

export const PlayArea = () => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Nadpis */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎲</span>
        <div>
          <h2 className="text-xl font-bold text-stone-800">Hrací Plocha</h2>
          <p className="text-xs text-stone-500">Scéna · Oracle · Souboj na jednom místě</p>
        </div>
      </div>

      {/* 1. Scéna */}
      <SceneStrip />

      {/* 2. Oracle */}
      <OracleQuick />

      {/* 3. Souboj */}
      <CombatArea />
    </div>
  );
};

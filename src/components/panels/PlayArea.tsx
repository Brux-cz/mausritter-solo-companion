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
import type { SceneType, SceneThread, SceneCheckResult, SceneOutcome } from '../../types';

// ────────────────────────────────────────────────────────────────
// HowToPlay — dočasný hint pro testování workflow (TODO: smazat)
// ────────────────────────────────────────────────────────────────

const HowToPlay = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-blue-200 rounded-xl overflow-hidden text-xs">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
      >
        <span>📖 Jak hrát (workflow)</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-3 py-3 bg-blue-50/40 space-y-3 text-stone-700">
          <div>
            <p className="font-bold text-blue-800 mb-1">🟣 Začátek session</p>
            <ol className="list-decimal ml-4 space-y-0.5">
              <li>Čas → zkontroluj sezónu, hoď počasí</li>
              <li>Deník → napiš 1 větu recap</li>
              <li>Pokud uplynul &gt;1 týden: Svět → Frakce → Progress Roll</li>
            </ol>
          </div>
          <div>
            <p className="font-bold text-blue-800 mb-1">🟡 Každá scéna</p>
            <ol className="list-decimal ml-4 space-y-0.5">
              <li>IDLE: napiš název scény → Zahájit</li>
              <li>SCENE SETUP: přečti check kartu (normální/pozměněná/přerušená)</li>
              <li>PLAYING — The Conversation smyčka:
                <ul className="list-disc ml-4 mt-0.5">
                  <li>Ptej se konkrétně: "Je strážce u dveří?"</li>
                  <li>Rozhodní PŘED hodem: Likely/Rovné/Unlikely</li>
                  <li>Yes,and = intenzifikuj · No,but = přidej alternativu</li>
                  <li>Z výsledku plyne další otázka → opakuj</li>
                </ul>
              </li>
              <li>Souboj jen když to dává smysl → ⚔️ rozbalit inline</li>
              <li>Konec: V kontrole (CF−1) nebo Mimo kontrolu (CF+1)</li>
            </ol>
          </div>
          <div>
            <p className="font-bold text-blue-800 mb-1">🟢 Konec session</p>
            <ol className="list-decimal ml-4 space-y-0.5">
              <li>Deník → zapiš XP + co se stalo</li>
              <li>Postavy → zkontroluj inventory (rations, torch, armor)</li>
              <li>Deník → cliffhanger (1 věta kam příště začít)</li>
            </ol>
          </div>
          <div className="border-t border-blue-200 pt-2 text-stone-500">
            <p className="font-bold text-blue-700 mb-1">⚡ Oracle pravidla</p>
            <ul className="list-disc ml-4 space-y-0.5">
              <li>2d6 útok: 2–6 miss · 7–9 slabý · 10–11 silný · 12 drtivý</li>
              <li>Save: d20 ≤ stat = úspěch (rovnost = úspěch)</li>
              <li>Prone = d12 damage die (hoď ručně)</li>
              <li>Morale: outmatched → WIL save, fail = útěk</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Typy
// ────────────────────────────────────────────────────────────────

type StartSceneResult = {
  checkResult: SceneCheckResult;
  alteration?: string;
  focus?: string;
  checkDie: number;
  chaosFactor: number;
};

type QuickAction = 'action' | 'encounter' | 'dice' | null;

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
// IdleState — žádná aktivní scéna
// ────────────────────────────────────────────────────────────────

const IdleState = ({ sceneCount, onStart }: {
  sceneCount: number;
  onStart: (title: string, type: SceneType) => void;
}) => {
  const [sceneTitle, setSceneTitle] = useState('');
  const [sceneType, setSceneType] = useState<SceneType>('exploration');

  const handleStart = () => {
    if (!sceneTitle.trim()) return;
    onStart(sceneTitle.trim(), sceneType);
    setSceneTitle('');
  };

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 space-y-4">
      <div className="text-center">
        <span className="text-3xl">🎬</span>
        <p className="text-amber-800 font-bold mt-2">Žádná aktivní scéna</p>
        {sceneCount > 0 && (
          <p className="text-xs text-amber-600 mt-1">Celkem scén: {sceneCount}</p>
        )}
      </div>
      <div className="space-y-2">
        <input
          value={sceneTitle}
          onChange={(e) => setSceneTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Název scény..."
          className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-sm"
          autoFocus
        />
        <select
          value={sceneType}
          onChange={(e) => setSceneType(e.target.value as SceneType)}
          className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-sm font-medium"
        >
          {Object.entries(SCENE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <Button onClick={handleStart} variant="primary" className="w-full">
          ▶ Zahájit scénu
        </Button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// SceneCheckCard — výsledek scene check
// ────────────────────────────────────────────────────────────────

const SceneCheckCard = ({ result, onContinue }: {
  result: StartSceneResult;
  onContinue: () => void;
}) => {
  const { checkResult, alteration, focus, checkDie, chaosFactor } = result;

  const configs: Record<SceneCheckResult, { emoji: string; label: string; bg: string; text: string; desc: string; hint?: string }> = {
    normal: {
      emoji: '✅',
      label: 'NORMÁLNÍ SCÉNA',
      bg: 'bg-green-50 border-green-400',
      text: 'text-green-800',
      desc: 'Scéna probíhá jak jsi plánoval.',
    },
    altered: {
      emoji: '⚡',
      label: 'POZMĚNĚNÁ SCÉNA',
      bg: 'bg-yellow-50 border-yellow-400',
      text: 'text-yellow-800',
      desc: alteration || '',
    },
    interrupted: {
      emoji: '🔀',
      label: 'PŘERUŠENÁ SCÉNA',
      bg: 'bg-red-50 border-red-400',
      text: 'text-red-800',
      desc: focus || '',
      hint: '→ Hoď 💡 Akce+Téma níže pro inspiraci co se místo toho stane.',
    },
  };

  const cfg = configs[checkResult];

  return (
    <div className={`border-2 rounded-xl p-5 space-y-3 ${cfg.bg}`}>
      <div className={`flex items-center gap-2 font-bold ${cfg.text}`}>
        <span className="text-2xl">{cfg.emoji}</span>
        <span>{cfg.label}</span>
        <span className="ml-auto text-xs font-normal opacity-70">
          d10: {checkDie} vs CF {chaosFactor}
        </span>
      </div>
      {cfg.desc && (
        <p className={`text-sm ${cfg.text} opacity-90`}>{cfg.desc}</p>
      )}
      {'hint' in cfg && cfg.hint && (
        <p className="text-xs text-red-700 bg-red-100 rounded-lg px-3 py-2 border border-red-200">
          {cfg.hint}
        </p>
      )}
      <Button onClick={onContinue} variant="primary" className="w-full">
        Pokračovat →
      </Button>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// StatusBar — vždy viditelný pruh v PLAYING
// ────────────────────────────────────────────────────────────────

const StatusBar = ({ sceneNumber, sceneTitle, sceneType, chaosFactor, onCFChange, onEndScene }: {
  sceneNumber: number;
  sceneTitle: string;
  sceneType: SceneType;
  chaosFactor: number;
  onCFChange: (delta: number) => void;
  onEndScene: (outcome: SceneOutcome) => void;
}) => (
  <div className="bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-3 space-y-2">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-amber-700 font-bold text-sm shrink-0">
        🎬 #{sceneNumber}: {sceneTitle}
      </span>
      <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
        {SCENE_TYPE_LABELS[sceneType] || sceneType}
      </span>
      <div className="flex items-center gap-1 ml-auto shrink-0">
        <span
          className="text-xs text-stone-500 cursor-help border-b border-dotted border-stone-400"
          title="Chaos Factor (1–9): čím vyšší, tím pravděpodobnější přerušení nebo pozměnění scény. Po vyhrané scéně −1, po prohře +1."
        >CF</span>
        <button
          onClick={() => onCFChange(-1)}
          disabled={chaosFactor <= 1}
          className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-700 font-bold text-sm flex items-center justify-center"
        >–</button>
        <span
          className={`w-6 text-center font-bold ${chaosFactor >= 7 ? 'text-red-700' : chaosFactor >= 5 ? 'text-amber-800' : 'text-green-700'}`}
          title={`CF ${chaosFactor}: ${chaosFactor <= 3 ? 'Nízké — situace pod kontrolou' : chaosFactor <= 6 ? 'Střední — nejistota roste' : 'Vysoké — chaos hrozí!'}`}
        >{chaosFactor}</span>
        <button
          onClick={() => onCFChange(1)}
          disabled={chaosFactor >= 9}
          className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-700 font-bold text-sm flex items-center justify-center"
        >+</button>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onEndScene('in_control')}
        className="flex-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-xs font-medium transition-colors"
      >
        ✅ V kontrole (CF−1)
      </button>
      <button
        onClick={() => onEndScene('out_of_control')}
        className="flex-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition-colors"
      >
        ❌ Mimo kontrolu (CF+1)
      </button>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────
// ConversationCore — Oracle + quick actions
// ────────────────────────────────────────────────────────────────

const ConversationCore = () => {
  const handleLogEntry = useGameStore(s => s.handleLogEntry);
  const log = (entry: Record<string, unknown>) => handleLogEntry(entry);

  const [question, setQuestion] = useState('');
  const [probability, setProbability] = useState<'unlikely' | 'even' | 'likely'>('even');
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [openAction, setOpenAction] = useState<QuickAction>(null);

  // Dice state
  const [diceCount, setDiceCount] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [diceReason, setDiceReason] = useState('');
  const [diceResult, setDiceResult] = useState<{ dice: number[]; total: number } | null>(null);

  const rollYesNo = () => {
    const { dice, total } = roll2D6();
    const result = ORACLE_TABLE[probability][total as keyof typeof ORACLE_TABLE[typeof probability]];
    log({
      type: 'oracle', subtype: 'yes_no', timestamp: formatTimestamp(),
      question: question || '(Bez otázky)', probability, dice, total, result,
    });
    setLastResult(`${question ? `"${question}" → ` : ''}**${result}** (2d6: ${total})`);
    setQuestion('');
  };

  const rollActionTheme = () => {
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    log({ type: 'oracle', subtype: 'action_theme', timestamp: formatTimestamp(), result: `${action} + ${theme}`, action, theme });
    setLastResult(`**${action}** + **${theme}**`);
  };

  const rollEncounter = () => {
    const creature = randomFrom(ENCOUNTER_CREATURES);
    const activity = randomFrom(ENCOUNTER_ACTIVITIES);
    const location = randomFrom(ENCOUNTER_LOCATIONS);
    const mood = randomFrom(ENCOUNTER_MOODS);
    const detail = randomFrom(ENCOUNTER_DETAILS);
    const motivation = randomFrom(ENCOUNTER_MOTIVATIONS);
    const narrative = `${mood}. ${location.charAt(0).toUpperCase() + location.slice(1)} spatříš **${creature.name}**. ${creature.name} ${activity}. ${detail} *${motivation}*`;
    log({ type: 'oracle', subtype: 'encounter', timestamp: formatTimestamp(), result: narrative });
    setLastResult(narrative);
  };

  const rollCustomDice = () => {
    const dice = rollDice(diceCount, diceSides);
    const total = dice.reduce((a, b) => a + b, 0);
    setDiceResult({ dice, total });
    log({ type: 'oracle', subtype: 'custom_dice', timestamp: formatTimestamp(), dice, sides: diceSides, count: diceCount, total, reason: diceReason || null });
    setLastResult(`${diceCount}d${diceSides}: [${dice.join(', ')}]${diceCount > 1 ? ` = ${total}` : ''}${diceReason ? ` (${diceReason})` : ''}`);
    setDiceReason('');
  };

  const renderMarkdown = (text: string) => (
    <span
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
          .replace(/\*(.+?)\*/g, '<em class="text-stone-400">$1</em>'),
      }}
    />
  );

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
      <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">The Conversation</p>

      {/* Oracle input */}
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && rollYesNo()}
        placeholder="Co se děje? Zadej otázku pro Oracle..."
        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm"
      />

      {/* Pravděpodobnost */}
      <div className="flex flex-wrap gap-2">
        {(['unlikely', 'even', 'likely'] as const).map(prob => (
          <button
            key={prob}
            onClick={() => setProbability(prob)}
            className={`flex-1 px-2 py-1.5 rounded-lg font-medium text-xs transition-all ${
              probability === prob
                ? 'bg-amber-700 text-amber-50'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            {prob === 'unlikely' ? '⬇️ Nepravděpodobné' : prob === 'likely' ? '⬆️ Pravděpodobné' : '➡️ Rovné šance'}
          </button>
        ))}
      </div>

      {/* Hlavní tlačítko Oracle */}
      <Button onClick={rollYesNo} variant="primary" className="w-full">
        🎲 Hodit Oracle (2d6)
      </Button>

      {/* Výsledek */}
      {lastResult && (
        <div className="p-3 bg-stone-800 text-stone-100 rounded-lg text-sm">
          <span className="text-stone-400 text-xs block mb-1">Výsledek:</span>
          {renderMarkdown(lastResult)}
        </div>
      )}

      {/* Quick action tlačítka */}
      <div className="flex flex-wrap gap-2">
        {([
          { id: 'action' as QuickAction, label: '💡 Akce+Téma' },
          { id: 'encounter' as QuickAction, label: '👁️ Setkání' },
          { id: 'dice' as QuickAction, label: '🎯 Kostky' },
        ]).map(btn => (
          <button
            key={btn.id as string}
            onClick={() => setOpenAction(openAction === btn.id ? null : btn.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              openAction === btn.id
                ? 'bg-stone-700 text-stone-100'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Akce+Téma panel */}
      {openAction === 'action' && (
        <div className="bg-stone-50 rounded-lg p-3 space-y-2 border border-stone-200">
          <p className="text-xs text-stone-500">Náhodná kombinace Akce + Tématu pro inspiraci.</p>
          <Button onClick={rollActionTheme} variant="secondary" className="w-full">
            💡 Generovat Akce + Téma
          </Button>
        </div>
      )}

      {/* Setkání panel */}
      {openAction === 'encounter' && (
        <div className="bg-stone-50 rounded-lg p-3 space-y-2 border border-stone-200">
          <p className="text-xs text-stone-500">Narativní setkání s náhodným tvorem, aktivitou a motivací.</p>
          <Button onClick={rollEncounter} variant="secondary" className="w-full">
            👁️ Generovat setkání
          </Button>
        </div>
      )}

      {/* Kostky panel */}
      {openAction === 'dice' && (
        <div className="bg-stone-50 rounded-lg p-3 space-y-3 border border-stone-200">
          {/* Rychlé kostky */}
          <div className="flex flex-wrap gap-2">
            {[4, 6, 8, 10, 12, 20].map(sides => (
              <button
                key={sides}
                onClick={() => {
                  const result = rollDice(1, sides)[0];
                  setDiceResult({ dice: [result], total: result });
                  log({ type: 'oracle', subtype: 'custom_dice', timestamp: formatTimestamp(), dice: [result], sides, count: 1, total: result });
                  setLastResult(`d${sides}: **${result}**`);
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
              type="number" min="2" max="1000" value={diceSides}
              onChange={(e) => setDiceSides(parseInt(e.target.value) || 6)}
              className="w-16 px-2 py-1.5 rounded border border-stone-300 bg-white font-bold text-sm"
            />
            <input
              type="text" value={diceReason}
              onChange={(e) => setDiceReason(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && rollCustomDice()}
              placeholder="Proč? (volitelné)"
              className="flex-1 min-w-[100px] px-2 py-1.5 text-sm rounded border border-stone-300 bg-white"
            />
            <Button onClick={rollCustomDice} variant="primary" size="small">Hodit</Button>
          </div>
          {/* Výsledek kostek */}
          {diceResult && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
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
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// CombatInline — wrapper kolem CombatPanel
// ────────────────────────────────────────────────────────────────

const CombatInline = () => {
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
// ThreadsSection — zapletky (collapsible, výchozí: skryté)
// ────────────────────────────────────────────────────────────────

const ThreadsSection = () => {
  const threads = useGameStore(s => s.getSceneState().threads);
  const addThread = useGameStore(s => s.addThread);
  const removeThread = useGameStore(s => s.removeThread);
  const toggleThreadResolved = useGameStore(s => s.toggleThreadResolved);

  const [showThreads, setShowThreads] = useState(false);
  const [newThread, setNewThread] = useState('');

  const handleAddThread = () => {
    if (!newThread.trim()) return;
    addThread(newThread.trim());
    setNewThread('');
  };

  const activeCount = threads.filter(t => !t.resolved).length;

  return (
    <div className="border border-amber-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setShowThreads(!showThreads)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
          showThreads
            ? 'bg-amber-50 text-amber-800 border-b border-amber-200'
            : 'bg-amber-50/50 text-amber-700 hover:bg-amber-50'
        }`}
      >
        <span className="font-medium">
          🧵 Zapletky {threads.length > 0 && `(${activeCount} aktivní)`}
        </span>
        <span className="text-xs text-stone-500">{showThreads ? '▲ Skrýt' : '▼ Zobrazit'}</span>
      </button>
      {showThreads && (
        <div className="px-4 py-3 bg-amber-50/30 space-y-3">
          {threads.length > 0 ? (
            <ThreadList threads={threads} onToggle={toggleThreadResolved} onRemove={removeThread} />
          ) : (
            <p className="text-xs text-stone-400 text-center">Žádné zapletky.</p>
          )}
          <div className="flex gap-2">
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
// PlayArea — orchestrátor flow-based rozhraní
// ────────────────────────────────────────────────────────────────

export const PlayArea = () => {
  const getSceneState = useGameStore(s => s.getSceneState);
  const startScene = useGameStore(s => s.startScene);
  const endScene = useGameStore(s => s.endScene);
  const adjustChaosFactor = useGameStore(s => s.adjustChaosFactor);
  const activeParty = useGameStore(s => s.getActiveParty());

  // Lokální stav flow
  const [sceneSetupResult, setSceneSetupResult] = useState<StartSceneResult | null>(null);
  const [sceneSetupDone, setSceneSetupDone] = useState(false);

  const { chaosFactor, currentScene, sceneCount } = getSceneState();
  const hasScene = !!currentScene;

  if (!activeParty) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-stone-100 border border-stone-300 rounded-xl p-6 text-center text-stone-500">
          🐭 Vyber nebo vytvoř družinu v panelu Postavy
        </div>
      </div>
    );
  }

  const handleStartScene = (title: string, type: SceneType) => {
    const result = startScene(title, type);
    setSceneSetupResult({
      checkResult: result.checkResult,
      alteration: result.alteration,
      focus: result.focus,
      checkDie: result.scene.checkDie,
      chaosFactor: result.scene.chaosAtStart,
    });
    setSceneSetupDone(false);
  };

  const handleEndScene = (outcome: SceneOutcome) => {
    endScene(outcome);
    setSceneSetupResult(null);
    setSceneSetupDone(false);
  };

  // ── IDLE: žádná aktivní scéna ────────────────────────────────
  if (!hasScene) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <HowToPlay />
        <IdleState sceneCount={sceneCount} onStart={handleStartScene} />
      </div>
    );
  }

  // ── SCENE SETUP: scene check karta (jen po právě zahájeném startu) ──
  if (!sceneSetupDone && sceneSetupResult) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <HowToPlay />
        <SceneCheckCard result={sceneSetupResult} onContinue={() => setSceneSetupDone(true)} />
      </div>
    );
  }

  // ── PLAYING: hlavní layout ───────────────────────────────────
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <HowToPlay />
      <StatusBar
        sceneNumber={currentScene!.number}
        sceneTitle={currentScene!.title}
        sceneType={currentScene!.type}
        chaosFactor={chaosFactor}
        onCFChange={adjustChaosFactor}
        onEndScene={handleEndScene}
      />
      <ConversationCore />
      <CombatInline />
      <ThreadsSection />
    </div>
  );
};

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
    <div className="border border-[#FFD8A8] overflow-hidden text-xs" style={{ borderRadius:10 }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#FFF5DC] text-[#8A5A4A] hover:bg-[#FFD8A8] font-medium"
      >
        <span>📖 Jak hrát (workflow)</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-3 py-3 bg-[#FFFBF1] space-y-3 text-[#2A1810]">
          <div>
            <p className="font-bold text-[#2A1810] mb-1">🟣 Začátek session</p>
            <ol className="list-decimal ml-4 space-y-0.5">
              <li>Čas → zkontroluj sezónu, hoď počasí</li>
              <li>Deník → napiš 1 větu recap</li>
              <li>Pokud uplynul &gt;1 týden: Svět → Frakce → Progress Roll</li>
            </ol>
          </div>
          <div>
            <p className="font-bold text-[#2A1810] mb-1">🟡 Každá scéna</p>
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
            <p className="font-bold text-[#2A1810] mb-1">🟢 Konec session</p>
            <ol className="list-decimal ml-4 space-y-0.5">
              <li>Deník → zapiš XP + co se stalo</li>
              <li>Postavy → zkontroluj inventory (rations, torch, armor)</li>
              <li>Deník → cliffhanger (1 věta kam příště začít)</li>
            </ol>
          </div>
          <div className="border-t border-[#FFD8A8] pt-2 text-[#C09A80]">
            <p className="font-bold text-[#E36A6A] mb-1">⚡ Oracle pravidla</p>
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
              : 'border-[#FFD8A8] bg-white'
          }`}
        >
          {t.resolved && '✓'}
        </button>
        <span className={t.resolved ? 'line-through text-[#C09A80]' : 'text-[#2A1810]'}>
          {t.description}
        </span>
        <button
          onClick={() => onRemove(t.id)}
          className="ml-auto text-[#C09A80] hover:text-red-500 text-xs shrink-0"
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
    <div className="border border-[#FFD8A8] p-5 space-y-4" style={{ borderRadius:10, background:'#FFF5DC' }}>
      <div className="text-center">
        <span className="text-3xl">🎬</span>
        <p className="font-bold mt-2" style={{ color:'#2A1810' }}>Žádná aktivní scéna</p>
        {sceneCount > 0 && (
          <p className="text-xs mt-1" style={{ color:'#8A5A4A' }}>Celkem scén: {sceneCount}</p>
        )}
      </div>
      <div className="space-y-2">
        <input
          value={sceneTitle}
          onChange={(e) => setSceneTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Název scény..."
          className="w-full px-3 py-2 text-sm focus:outline-none focus:border-[#E36A6A]"
          style={{ borderRadius:7, border:'1px solid #FFD8A8', background:'#FFFBF1', color:'#2A1810' }}
          autoFocus
        />
        <select
          value={sceneType}
          onChange={(e) => setSceneType(e.target.value as SceneType)}
          className="w-full px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#E36A6A]"
          style={{ borderRadius:7, border:'1px solid #FFD8A8', background:'#FFFBF1', color:'#2A1810' }}
        >
          {Object.entries(SCENE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button
          onClick={handleStart}
          className="w-full py-2 bg-[#E36A6A] hover:bg-[#C84848] text-white font-bold text-sm transition-colors"
          style={{ borderRadius:8 }}
        >
          ▶ Zahájit scénu
        </button>
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

  const configs: Record<SceneCheckResult, { emoji: string; label: string; color: string; border: string; bg: string; desc: string; hint?: string }> = {
    normal: {
      emoji: '✅',
      label: 'NORMÁLNÍ SCÉNA',
      color: '#5A8A5A',
      border: '#5A8A5A50',
      bg: '#5A8A5A08',
      desc: 'Scéna probíhá jak jsi plánoval.',
    },
    altered: {
      emoji: '⚡',
      label: 'POZMĚNĚNÁ SCÉNA',
      color: '#B07820',
      border: '#B0782048',
      bg: '#B0782008',
      desc: alteration || '',
    },
    interrupted: {
      emoji: '🔀',
      label: 'PŘERUŠENÁ SCÉNA',
      color: '#C83838',
      border: '#C8383850',
      bg: '#C8383808',
      desc: focus || '',
      hint: '→ Hoď 💡 Akce+Téma níže pro inspiraci co se místo toho stane.',
    },
  };

  const cfg = configs[checkResult];

  return (
    <div style={{ border:`1px solid ${cfg.border}`, borderRadius:10, padding:'20px', background:cfg.bg }} className="space-y-3">
      <div className="flex items-center gap-2 font-bold">
        <span className="text-2xl">{cfg.emoji}</span>
        <span style={{ color: cfg.color }}>{cfg.label}</span>
        <span className="ml-auto text-xs font-normal" style={{ color:'#C09A80' }}>
          d10: {checkDie} vs CF {chaosFactor}
        </span>
      </div>
      {cfg.desc && (
        <p className="text-sm" style={{ color: cfg.color, opacity: 0.9 }}>{cfg.desc}</p>
      )}
      {'hint' in cfg && cfg.hint && (
        <p className="text-xs px-3 py-2" style={{ color:'#C83838', background:'#C8383812', borderRadius:6, border:'1px solid #C8383850' }}>
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

const StatusBar = ({ sceneNumber, sceneTitle, sceneType, chaosFactor, onCFChange, onEndScene, onCancel }: {
  sceneNumber: number;
  sceneTitle: string;
  sceneType: SceneType;
  chaosFactor: number;
  onCFChange: (delta: number) => void;
  onEndScene: (outcome: SceneOutcome) => void;
  onCancel: () => void;
}) => (
  <div className="bg-[#FFF5DC] border border-[#FFD8A8] rounded-xl px-4 py-3 space-y-2">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[#2A1810] font-bold text-sm shrink-0">
        🎬 #{sceneNumber}: {sceneTitle}
      </span>
      <span className="text-xs text-[#8A5A4A] bg-[#FFD8A8]/40 px-2 py-0.5 rounded-full shrink-0">
        {SCENE_TYPE_LABELS[sceneType] || sceneType}
      </span>
      <div className="flex items-center gap-1 ml-auto shrink-0">
        <span
          className="text-xs text-[#C09A80] cursor-help border-b border-dotted border-[#C09A80]"
          title="Chaos Factor (1–9): čím vyšší, tím pravděpodobnější přerušení nebo pozměnění scény. Po vyhrané scéně −1, po prohře +1."
        >CF</span>
        <button
          onClick={() => onCFChange(-1)}
          disabled={chaosFactor <= 1}
          className="w-6 h-6 rounded bg-[#FFD8A8] hover:bg-[#FFC090] disabled:opacity-40 text-[#2A1810] font-bold text-sm flex items-center justify-center"
        >–</button>
        <span
          className={`w-6 text-center font-bold ${chaosFactor >= 7 ? 'text-red-700' : chaosFactor >= 5 ? 'text-[#E36A6A]' : 'text-green-700'}`}
          title={`CF ${chaosFactor}: ${chaosFactor <= 3 ? 'Nízké — situace pod kontrolou' : chaosFactor <= 6 ? 'Střední — nejistota roste' : 'Vysoké — chaos hrozí!'}`}
        >{chaosFactor}</span>
        <button
          onClick={() => onCFChange(1)}
          disabled={chaosFactor >= 9}
          className="w-6 h-6 rounded bg-[#FFD8A8] hover:bg-[#FFC090] disabled:opacity-40 text-[#2A1810] font-bold text-sm flex items-center justify-center"
        >+</button>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onEndScene('in_control')}
        className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
        style={{ background:'#5A8A5A12', color:'#5A8A5A', border:'1px solid #5A8A5A50' }}
      >
        ✓ V kontrole (CF−1)
      </button>
      <button
        onClick={() => onEndScene('out_of_control')}
        className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
        style={{ background:'#C8383812', color:'#C83838', border:'1px solid #C8383850' }}
      >
        ✕ Mimo kontrolu (CF+1)
      </button>
      <button
        onClick={() => { if (window.confirm('Zrušit scénu a smazat všechny její záznamy?')) onCancel(); }}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
        style={{ background:'transparent', color:'#C09A80', border:'1px solid #FFD8A8' }}
        title="Zrušit scénu bez uložení (smaže záznamy)"
      >
        × Zrušit
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
  type LastOracleResult =
    | { kind: 'yes_no'; question: string; result: string; dice: number[]; total: number; probability: string }
    | { kind: 'text'; text: string }
    | null;
  const [lastResult, setLastResult] = useState<LastOracleResult>(null);
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
    setLastResult({ kind: 'yes_no', question, result, dice, total, probability });
    setQuestion('');
  };

  const rollActionTheme = () => {
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    log({ type: 'oracle', subtype: 'action_theme', timestamp: formatTimestamp(), result: `${action} + ${theme}`, action, theme });
    setLastResult({ kind: 'text', text: `**${action}** + **${theme}**` });
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
    setLastResult({ kind: 'text', text: narrative });
  };

  const rollCustomDice = () => {
    const dice = rollDice(diceCount, diceSides);
    const total = dice.reduce((a, b) => a + b, 0);
    setDiceResult({ dice, total });
    log({ type: 'oracle', subtype: 'custom_dice', timestamp: formatTimestamp(), dice, sides: diceSides, count: diceCount, total, reason: diceReason || null });
    setLastResult({ kind: 'text', text: `${diceCount}d${diceSides}: [${dice.join(', ')}]${diceCount > 1 ? ` = ${total}` : ''}${diceReason ? ` (${diceReason})` : ''}` });
    setDiceReason('');
  };

  const oracleResultColor = (result: string) => {
    const r = result.toLowerCase();
    if (r.startsWith('yes, and')) return '#5A8A5A';
    if (r.startsWith('yes, but') || r.startsWith('no, but')) return '#B07820';
    if (r.startsWith('no, and') || r.startsWith('no')) return '#C83838';
    if (r.startsWith('yes')) return '#5A8A5A';
    return '#2A1810';
  };

  const renderMarkdown = (text: string) => (
    <span
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em style="color:#8A5A4A">$1</em>'),
      }}
    />
  );

  return (
    <div className="bg-[#FFF5DC] border border-[#FFD8A8] rounded-xl p-4 space-y-3">
      <p className="text-xs text-[#C09A80] font-medium uppercase tracking-wide">The Conversation</p>

      {/* Oracle input */}
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && rollYesNo()}
        placeholder="Co se děje? Zadej otázku pro Oracle..."
        className="w-full px-3 py-2 rounded-lg border border-[#FFD8A8] bg-white text-sm text-[#2A1810] focus:outline-none focus:border-[#E36A6A]"
      />

      {/* Pravděpodobnost — Pravd./Rovné/Nepravd. */}
      <div className="flex gap-1">
        {([
          { key: 'likely' as const, label: 'Pravd.' },
          { key: 'even' as const, label: 'Stejně' },
          { key: 'unlikely' as const, label: 'Nepravd.' },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setProbability(key)}
            className={`flex-1 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all border text-[10px] ${
              probability === key
                ? 'bg-[#E36A6A] text-white border-[#E36A6A]'
                : 'text-[#8A5A4A] border-[#FFD8A8] hover:bg-[#E36A6A14] hover:text-[#2A1810]'
            }`}
            style={{ background: probability === key ? undefined : 'transparent' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hlavní tlačítko Oracle */}
      <button
        onClick={rollYesNo}
        className="w-full py-2 bg-[#E36A6A] hover:bg-[#C84848] text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
        style={{ borderRadius:8 }}
      >
        🎲 Hodit Oracle (2d6)
      </button>

      {/* Výsledek */}
      {lastResult && (
        <div style={{ background:'#FFFBF1', border:'1px solid #B0782048', borderRadius:7, padding:'10px 14px' }}>
          {lastResult.kind === 'yes_no' ? (
            <>
              {lastResult.question && (
                <p className="italic mb-1" style={{ fontSize:11, color:'#8A5A4A' }}>„{lastResult.question}"</p>
              )}
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono" style={{ fontSize:11, color:'#C09A80' }}>[{lastResult.dice.join(', ')}]</span>
                <span className="font-bold" style={{ fontSize:22, color: oracleResultColor(lastResult.result) }}>{lastResult.result}</span>
                <span className="ml-auto" style={{ fontSize:10, color:'#C09A80' }}>
                  {lastResult.probability === 'likely' ? 'Pravděpodobné' : lastResult.probability === 'unlikely' ? 'Nepravděpodobné' : 'Stejně možné'}
                </span>
              </div>
            </>
          ) : (
            <div style={{ fontSize:14, color:'#2A1810' }}>{renderMarkdown(lastResult.text)}</div>
          )}
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
                ? 'bg-[#E36A6A] text-white'
                : 'bg-[#FFD8A8]/40 text-[#8A5A4A] hover:bg-[#FFD8A8]'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Akce+Téma panel */}
      {openAction === 'action' && (
        <div className="bg-[#FFFBF1] rounded-lg p-3 space-y-2 border border-[#FFD8A8]">
          <p className="text-xs text-[#C09A80]">Náhodná kombinace Akce + Tématu pro inspiraci.</p>
          <Button onClick={rollActionTheme} variant="secondary" className="w-full">
            💡 Generovat Akce + Téma
          </Button>
        </div>
      )}

      {/* Setkání panel */}
      {openAction === 'encounter' && (
        <div className="bg-[#FFFBF1] rounded-lg p-3 space-y-2 border border-[#FFD8A8]">
          <p className="text-xs text-[#C09A80]">Narativní setkání s náhodným tvorem, aktivitou a motivací.</p>
          <Button onClick={rollEncounter} variant="secondary" className="w-full">
            👁️ Generovat setkání
          </Button>
        </div>
      )}

      {/* Kostky panel */}
      {openAction === 'dice' && (
        <div className="bg-[#FFFBF1] rounded-lg p-3 space-y-3 border border-[#FFD8A8]">
          {/* Rychlé kostky */}
          <div className="flex flex-wrap gap-2">
            {[4, 6, 8, 10, 12, 20].map(sides => (
              <button
                key={sides}
                onClick={() => {
                  const result = rollDice(1, sides)[0];
                  setDiceResult({ dice: [result], total: result });
                  log({ type: 'oracle', subtype: 'custom_dice', timestamp: formatTimestamp(), dice: [result], sides, count: 1, total: result });
                  setLastResult({ kind: 'text', text: `d${sides}: **${result}**` });
                }}
                className="px-3 py-2 bg-[#FFD8A8]/60 hover:bg-[#FFD8A8] rounded-lg font-bold text-[#2A1810] text-sm transition-colors"
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
              className="px-2 py-1.5 rounded border border-[#FFD8A8] bg-white font-bold text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="font-bold text-[#8A5A4A]">d</span>
            <input
              type="number" min="2" max="1000" value={diceSides}
              onChange={(e) => setDiceSides(parseInt(e.target.value) || 6)}
              className="w-16 px-2 py-1.5 rounded border border-[#FFD8A8] bg-white font-bold text-sm"
            />
            <input
              type="text" value={diceReason}
              onChange={(e) => setDiceReason(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && rollCustomDice()}
              placeholder="Proč? (volitelné)"
              className="flex-1 min-w-[100px] px-2 py-1.5 text-sm rounded border border-[#FFD8A8] bg-white"
            />
            <Button onClick={rollCustomDice} variant="primary" size="small">Hodit</Button>
          </div>
          {/* Výsledek kostek */}
          {diceResult && (
            <div className="flex items-center gap-2 p-2 bg-[#FFF5DC] rounded-lg border border-[#FFD8A8]">
              <div className="flex gap-1 flex-wrap">
                {diceResult.dice.map((d, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-[#E36A6A] text-white rounded font-bold text-sm">
                    {d}
                  </span>
                ))}
              </div>
              {diceResult.dice.length > 1 && (
                <span className="text-xl font-bold text-[#2A1810] ml-2">= {diceResult.total}</span>
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
    <div className="border border-[#FFD8A8] rounded-xl overflow-hidden">
      <button
        onClick={() => setShowCombat(!showCombat)}
        className={`w-full flex items-center justify-between px-4 py-3 font-medium text-sm transition-colors ${
          showCombat
            ? 'bg-[#C8383812] text-[#C83838] border-b border-[#C8383850]'
            : 'bg-[#FFF5DC] text-[#8A5A4A] hover:bg-[#FFD8A8]'
        }`}
      >
        <span>⚔️ Souboj</span>
        <span className="text-xs text-[#C09A80]">{showCombat ? '▲ Skrýt' : '▼ Zahájit souboj'}</span>
      </button>
      {showCombat && (
        <div className="p-4 bg-[#FFFBF1]">
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
    <div className="border border-[#FFD8A8] rounded-xl overflow-hidden">
      <button
        onClick={() => setShowThreads(!showThreads)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
          showThreads
            ? 'bg-[#FFF5DC] text-[#2A1810] border-b border-[#FFD8A8]'
            : 'bg-[#FFF5DC]/60 text-[#8A5A4A] hover:bg-[#FFF5DC]'
        }`}
      >
        <span className="font-medium">
          🧵 Zapletky {threads.length > 0 && `(${activeCount} aktivní)`}
        </span>
        <span className="text-xs text-[#C09A80]">{showThreads ? '▲ Skrýt' : '▼ Zobrazit'}</span>
      </button>
      {showThreads && (
        <div className="px-4 py-3 bg-[#FFF5DC]/30 space-y-3">
          {threads.length > 0 ? (
            <ThreadList threads={threads} onToggle={toggleThreadResolved} onRemove={removeThread} />
          ) : (
            <p className="text-xs text-[#C09A80] text-center">Žádné zapletky.</p>
          )}
          <div className="flex gap-2">
            <input
              value={newThread}
              onChange={(e) => setNewThread(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddThread()}
              placeholder="Nová zápletka..."
              className="flex-1 px-3 py-1.5 text-sm rounded border border-[#FFD8A8] bg-white"
            />
            <button
              onClick={handleAddThread}
              className="px-3 py-1.5 bg-[#E36A6A] hover:bg-[#C83838] text-white rounded text-sm font-medium"
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
  const cancelScene = useGameStore(s => s.cancelScene);
  const adjustChaosFactor = useGameStore(s => s.adjustChaosFactor);
  const activeParty = useGameStore(s => s.getActiveParty());

  // Lokální stav flow
  const [sceneSetupResult, setSceneSetupResult] = useState<StartSceneResult | null>(null);
  const [sceneSetupDone, setSceneSetupDone] = useState(false);

  const { chaosFactor, currentScene, sceneCount } = getSceneState();
  const hasScene = !!currentScene;

  if (!activeParty) {
    return (
      <div className="border border-[#FFD8A8] p-6 text-center text-[#8A5A4A]" style={{ borderRadius:10, background:'#FFF5DC' }}>
        🐭 Vyber nebo vytvoř družinu v panelu Postavy
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

  const handleCancelScene = () => {
    cancelScene();
    setSceneSetupResult(null);
    setSceneSetupDone(false);
  };

  // ── IDLE: žádná aktivní scéna ────────────────────────────────
  if (!hasScene) {
    return (
      <div className="space-y-3">
        <HowToPlay />
        <IdleState sceneCount={sceneCount} onStart={handleStartScene} />
      </div>
    );
  }

  // ── SCENE SETUP: scene check karta (jen po právě zahájeném startu) ──
  if (!sceneSetupDone && sceneSetupResult) {
    return (
      <div className="space-y-3">
        <HowToPlay />
        <SceneCheckCard result={sceneSetupResult} onContinue={() => setSceneSetupDone(true)} />
      </div>
    );
  }

  // ── PLAYING: hlavní layout ───────────────────────────────────
  return (
    <div className="space-y-3">
      <HowToPlay />
      <StatusBar
        sceneNumber={currentScene!.number}
        sceneTitle={currentScene!.title}
        sceneType={currentScene!.type}
        chaosFactor={chaosFactor}
        onCFChange={adjustChaosFactor}
        onEndScene={handleEndScene}
        onCancel={handleCancelScene}
      />
      <ConversationCore />
      <CombatInline />
      <ThreadsSection />
    </div>
  );
};

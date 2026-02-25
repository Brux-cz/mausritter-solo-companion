import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { ORACLE_TABLE, CONDITIONS } from '../../data/constants';
import { roll2D6, formatTimestamp } from '../../utils/helpers';

// Barva výsledku Oracle
const oracleResultColor = (result: string) => {
  if (!result) return '#2A1810';
  const r = result.toLowerCase();
  if (r.startsWith('yes, and')) return '#5A8A5A';
  if (r.startsWith('yes, but') || r.startsWith('no, but')) return '#B07820';
  if (r.startsWith('no, and') || r.startsWith('no')) return '#C83838';
  if (r.startsWith('yes')) return '#5A8A5A';
  return '#B07820';
};

// ────────────────────────────────────────────────────────────────
// CharSwitcher — kompaktní vertikální chipy postav
// ────────────────────────────────────────────────────────────────

const CharSwitcher = () => {
  const parties = useGameStore(s => s.parties);
  const activePartyId = useGameStore(s => s.activePartyId);
  const activeCharacterId = useGameStore(s => s.activeCharacterId);
  const setActiveCharacterId = useGameStore(s => s.setActiveCharacterId);

  const party = (parties || []).find(p => p.id === activePartyId) || null;
  if (!party?.members?.length) return null;

  return (
    <div className="flex gap-1 px-3 py-2 border-b border-[#FFD8A8] overflow-x-auto bg-[#FFF5DC]">
      {party.members.map(char => {
        const hpPct = char.hp.max > 0 ? char.hp.current / char.hp.max : 0;
        const isActive = char.id === activeCharacterId;
        const hpColor = hpPct > 0.5 ? '#5A8A5A' : hpPct > 0.25 ? '#B07820' : '#C83838';
        return (
          <button
            key={char.id}
            onClick={() => setActiveCharacterId(char.id)}
            style={{ minWidth: 60 }}
            className={`flex flex-col items-center px-2 py-1.5 rounded-lg border transition-all ${
              isActive
                ? 'bg-[#E36A6A] border-[#E36A6A]'
                : 'bg-[#FFFBF1] border-[#FFD8A8] hover:border-[#E36A6A]/50'
            }`}
          >
            <span className="text-sm leading-none">{char.type === 'pc' ? '🐭' : '🐿️'}</span>
            <span className={`text-[9px] font-bold uppercase mt-0.5 leading-none truncate max-w-[56px] ${isActive ? 'text-white' : 'text-[#8A5A4A]'}`}>
              {char.name}
            </span>
            <span
              className="text-[9px] mt-0.5 leading-none font-mono"
              style={{ color: isActive ? '#ffc' : hpColor }}
            >
              {char.hp.current}/{char.hp.max} HP
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// CharMiniStats — sekce POSTAVA · MINI STATS
// ────────────────────────────────────────────────────────────────

const CharMiniStats = () => {
  const parties = useGameStore(s => s.parties);
  const activePartyId = useGameStore(s => s.activePartyId);
  const activeCharacterId = useGameStore(s => s.activeCharacterId);
  const setActivePanel = useGameStore(s => s.setActivePanel as any);

  const party = (parties || []).find(p => p.id === activePartyId) || null;
  const char = party?.members?.find(m => m.id === activeCharacterId) || null;

  if (!char) return (
    <div className="px-3 py-3 border-b border-[#FFD8A8] text-[11px] text-[#C09A80] text-center">
      Žádná aktivní postava
    </div>
  );

  const hpPct = char.hp.max > 0 ? char.hp.current / char.hp.max : 0;
  const boColor = hpPct > 0.5 ? '#2A1810' : hpPct > 0.25 ? '#B07820' : '#C83838';
  const xpThreshold = char.type === 'pc' ? (char as any).level * 1000 : 1000;
  const xpPct = Math.min(1, char.xp / xpThreshold);

  const stats = [
    { label: 'BO', value: char.hp.current, sub: `/${char.hp.max}`, color: boColor },
    { label: 'STR', value: char.STR.current, sub: char.STR.current < char.STR.max ? `/${char.STR.max}` : null },
    { label: 'MRŠ', value: char.DEX.current, sub: char.DEX.current < char.DEX.max ? `/${char.DEX.max}` : null },
    { label: 'VŮLE', value: char.WIL.current, sub: char.WIL.current < char.WIL.max ? `/${char.WIL.max}` : null },
  ];

  return (
    <div className="px-3 py-2.5 border-b border-[#FFD8A8]">
      {/* Section label */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#C09A80] mb-2">
        Postava · mini stats
      </div>

      {/* 2×2 Stats grid */}
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className="bg-[#FFFBF1] rounded-lg p-2.5 border border-[#FFD8A8] text-center">
            <div className="text-[9px] font-bold uppercase tracking-wider leading-none mb-1" style={{ color: '#E36A6A' }}>
              {label}
            </div>
            <div className="font-bold leading-none" style={{ fontSize: 22, color: color || '#2A1810' }}>
              {value}
              {sub && <span className="font-normal" style={{ fontSize: 13, color: '#8A5A4A' }}>{sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Podmínky */}
      {char.type === 'pc' && (char as any).conditions?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {(char as any).conditions.map((condId: string) => {
            const condDef = CONDITIONS.find(c => c.id === condId);
            return (
              <span
                key={condId}
                className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border"
                style={{ background: '#C8383812', color: '#C83838', borderColor: '#C8383850' }}
                title={condDef?.effect}
              >
                {condDef?.name || condId}
              </span>
            );
          })}
        </div>
      )}

      {/* XP progress bar */}
      {char.type === 'pc' && (
        <>
          <div className="h-1 rounded-full mb-1 overflow-hidden" style={{ background: '#FFD8A8' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${xpPct * 100}%`, background: '#E36A6A' }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#C09A80] font-mono mb-2">
            <span>XP {char.xp} / {xpThreshold}</span>
            <span>Úr.{(char as any).level}</span>
          </div>
        </>
      )}

      {/* Inventář button */}
      <button
        className="w-full py-1.5 text-[11px] text-[#8A5A4A] text-center rounded-lg border border-[#FFD8A8] transition-colors hover:border-[#FFC090] hover:bg-[#FFF5DC]"
        style={{ background: '#FFFBF1' }}
      >
        📦 Inventář →
      </button>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// OracleQuick — VĚŠTÍRNA sekce s widget strukturou
// ────────────────────────────────────────────────────────────────

const OracleQuick = () => {
  const handleLogEntry = useGameStore(s => s.handleLogEntry);
  const [question, setQuestion] = useState('');
  const [probability, setProbability] = useState<'unlikely' | 'even' | 'likely'>('even');
  const [lastResult, setLastResult] = useState<{ result: string; dice: number[] } | null>(null);

  const rollYesNo = () => {
    const { dice, total } = roll2D6();
    const result = ORACLE_TABLE[probability][total as keyof typeof ORACLE_TABLE[typeof probability]];
    handleLogEntry({
      type: 'oracle', subtype: 'yes_no', timestamp: formatTimestamp(),
      question: question || '(Bez otázky)', probability, dice, total, result,
    });
    setLastResult({ result, dice });
    setQuestion('');
  };

  // Pořadí dle wireframu: Pravd. / Stejně / Nepravd.
  const probOptions = [
    { key: 'likely' as const, label: 'Pravd.' },
    { key: 'even' as const, label: 'Stejně' },
    { key: 'unlikely' as const, label: 'Nepravd.' },
  ];

  return (
    <div className="px-3 py-2.5 border-b border-[#FFD8A8]">
      {/* Section label */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#C09A80] mb-2">
        Věštírna
      </div>

      {/* Widget */}
      <div className="rounded-xl overflow-hidden border border-[#FFD8A8]" style={{ background: '#FFF5DC' }}>
        {/* Widget header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#FFD8A8]">
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#E36A6A' }}>
            Oracle
          </span>
        </div>

        {/* Widget body */}
        <div className="p-3 space-y-2">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && rollYesNo()}
            placeholder="Je velitel naživu?"
            className="w-full px-2.5 py-2 rounded-lg border border-[#FFD8A8] text-[13px] text-[#2A1810] placeholder-[#C09A80] focus:outline-none focus:border-[#E36A6A] transition-colors"
            style={{ background: '#FFFBF1' }}
          />

          {/* Prob buttons: Pravd. / Stejně / Nepravd. */}
          <div className="flex gap-1">
            {probOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setProbability(key)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
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

          <button
            onClick={rollYesNo}
            className="w-full py-2 bg-[#E36A6A] hover:bg-[#C84848] text-white rounded-lg text-[12px] font-bold uppercase tracking-wide transition-colors"
          >
            🎲 Hodit Oracle
          </button>

          {/* Oracle výsledek */}
          {lastResult && (
            <div
              className="text-center p-2.5 rounded-lg border"
              style={{ background: '#FFFBF1', borderColor: '#B0782048' }}
            >
              <div className="text-[11px] font-mono mb-1" style={{ color: '#C09A80' }}>
                [{lastResult.dice[0]}, {lastResult.dice[1]}]
              </div>
              <div className="font-bold" style={{ fontSize: 22, color: oracleResultColor(lastResult.result) }}>
                {lastResult.result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// CFWidget — Chaos Factor s widget strukturou
// ────────────────────────────────────────────────────────────────

const CFWidget = () => {
  const chaosFactor = useGameStore(s => s.getSceneState().chaosFactor);
  const adjustChaosFactor = useGameStore(s => s.adjustChaosFactor);

  const cfColor = chaosFactor >= 7 ? '#C83838' : chaosFactor >= 5 ? '#E36A6A' : '#5A8A5A';

  return (
    <div className="px-3 py-2.5">
      {/* Section label */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#C09A80] mb-2">
        Chaos Factor
      </div>

      {/* Widget */}
      <div className="rounded-xl overflow-hidden border border-[#FFD8A8]" style={{ background: '#FFF5DC' }}>
        {/* Widget header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#FFD8A8]">
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#E36A6A' }}>
            Chaos Factor
          </span>
          <span className="font-bold text-[18px] leading-none" style={{ color: cfColor }}>
            {chaosFactor}
          </span>
        </div>

        {/* CF strip */}
        <div className="flex gap-0.5 justify-center px-3 py-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => adjustChaosFactor(n - chaosFactor)}
              className="flex items-center justify-center text-[10px] font-bold rounded border transition-all"
              style={{
                width: 22, height: 22,
                borderRadius: 5,
                background: n === chaosFactor ? '#E36A6A' : '#FFFBF1',
                borderColor: n === chaosFactor ? '#E36A6A' : '#FFD8A8',
                color: n === chaosFactor ? 'white' : '#C09A80',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// RightSidebar — hlavní export
// ────────────────────────────────────────────────────────────────

export const RightSidebar = ({ activePanel }: { activePanel: string }) => {
  const parties = useGameStore(s => s.parties);
  const activePartyId = useGameStore(s => s.activePartyId);
  const party = (parties || []).find(p => p.id === activePartyId) || null;

  if (['character', 'tools'].includes(activePanel)) return null;
  if (!party) return null;

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-[#FFF5DC] border border-[#FFD8A8] rounded-xl overflow-hidden sticky top-[88px] self-start max-h-[calc(100vh-88px)] overflow-y-auto shadow-sm">
      <CharSwitcher />
      <CharMiniStats />
      <OracleQuick />
      <CFWidget />
    </aside>
  );
};

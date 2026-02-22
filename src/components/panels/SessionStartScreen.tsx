import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { JournalEntry } from '../../types';

export interface SessionMeta {
  lastDate: string;
  cliffhanger?: string;
}

function getEntryText(entry: JournalEntry): string | null {
  if (entry.type === 'narrative' && 'content' in entry) {
    const content = (entry as any).content as string;
    return content.replace(/<[^>]*>/g, '').trim().slice(0, 120) || null;
  }
  if (entry.type === 'oracle' && 'result' in entry) {
    return `Oracle: ${(entry as any).result}`;
  }
  if (entry.type === 'scene_start' && 'sceneTitle' in entry) {
    return `Scéna: ${(entry as any).sceneTitle}`;
  }
  if (entry.type === 'scene_end' && 'content' in entry) {
    const c = (entry as any).content as string;
    return c?.replace(/<[^>]*>/g, '').trim().slice(0, 120) || null;
  }
  return null;
}

function formatDaysAgo(dateStr: string): string {
  const then = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'dnes';
  if (diffDays === 1) return 'včera';
  if (diffDays < 7) return `před ${diffDays} dny`;
  if (diffDays < 30) return `před ${Math.floor(diffDays / 7)} týdny`;
  return `před ${Math.floor(diffDays / 30)} měsíci`;
}

interface Props {
  onContinue: () => void;
}

export function SessionStartScreen({ onContinue }: Props) {
  const journal = useGameStore(s => s.journal);

  const meta: SessionMeta | null = (() => {
    try {
      const raw = localStorage.getItem('mausritter-session-meta');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const recentEntries = journal
    .slice()
    .reverse()
    .map(e => getEntryText(e))
    .filter(Boolean)
    .slice(0, 3) as string[];

  return (
    <div className="fixed inset-0 bg-stone-950/95 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-amber-950 border border-amber-800 rounded-xl max-w-lg w-full shadow-2xl p-6">

        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🐭</div>
          <h1 className="text-2xl font-bold text-amber-100">Vítej zpět!</h1>
          {meta?.lastDate && (
            <p className="text-amber-400 mt-1 text-sm">
              Naposledy sis hrál {formatDaysAgo(meta.lastDate)}
            </p>
          )}
        </div>

        {meta?.cliffhanger && (
          <div className="mb-4 bg-amber-900/50 border border-amber-700 rounded-lg p-4">
            <p className="text-amber-300 text-xs font-bold uppercase tracking-wide mb-2">
              Kde jsi skončil
            </p>
            <p className="text-amber-100 italic">"{meta.cliffhanger}"</p>
          </div>
        )}

        {recentEntries.length > 0 && (
          <div className="mb-6 bg-stone-900/50 border border-stone-700 rounded-lg p-4">
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wide mb-2">
              Poslední záznamy v deníku
            </p>
            <ul className="space-y-1">
              {recentEntries.map((text, i) => (
                <li key={i} className="text-stone-300 text-sm flex gap-2">
                  <span className="text-stone-500 shrink-0">•</span>
                  <span className="line-clamp-2">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold rounded-lg transition-colors text-lg"
        >
          Pokračovat v kampani
        </button>
      </div>
    </div>
  );
}

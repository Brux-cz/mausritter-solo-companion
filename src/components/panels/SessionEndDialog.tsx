import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { SessionMeta } from './SessionStartScreen';

interface Props {
  onClose: () => void;
}

export function SessionEndDialog({ onClose }: Props) {
  const [cliffhanger, setCliffhanger] = useState('');
  const journal = useGameStore(s => s.journal);

  const today = new Date().toDateString();
  const todayEntries = journal.filter(e =>
    new Date(e.timestamp).toDateString() === today
  ).length;

  const handleSave = () => {
    const meta: SessionMeta = {
      lastDate: new Date().toISOString(),
      ...(cliffhanger.trim() ? { cliffhanger: cliffhanger.trim() } : {}),
    };
    localStorage.setItem('mausritter-session-meta', JSON.stringify(meta));
    onClose();
  };

  const handleSkip = () => {
    // Save date even without cliffhanger
    const existing: SessionMeta | null = (() => {
      try { return JSON.parse(localStorage.getItem('mausritter-session-meta') || 'null'); }
      catch { return null; }
    })();
    const meta: SessionMeta = { ...existing, lastDate: new Date().toISOString() };
    localStorage.setItem('mausritter-session-meta', JSON.stringify(meta));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
      <div className="bg-stone-800 border border-stone-600 rounded-xl max-w-md w-full shadow-2xl p-6 text-stone-100">

        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span>🌙</span> Ukončit session
        </h2>

        {todayEntries > 0 && (
          <p className="text-stone-400 text-sm mb-4">
            Dnes sis zapsal{' '}
            {todayEntries === 1 ? '1 záznam' : `${todayEntries} záznamy`} do deníku.
          </p>
        )}

        <label className="block text-sm font-medium text-stone-300 mb-2">
          Kde jsi skončil? <span className="text-stone-500 font-normal">(cliffhanger pro příští session)</span>
        </label>
        <textarea
          value={cliffhanger}
          onChange={e => setCliffhanger(e.target.value)}
          placeholder="Anise stojí u zavřených dveří a za nimi slyší podivné zvuky..."
          className="w-full bg-stone-700 text-stone-100 rounded-lg p-3 text-sm resize-none h-24 border border-stone-600 focus:border-amber-500 focus:outline-none placeholder-stone-500"
          autoFocus
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-600 rounded-lg font-bold transition-colors"
          >
            Uložit & zavřít
          </button>
          <button
            onClick={handleSkip}
            className="px-4 py-2.5 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors text-sm"
          >
            Přeskočit
          </button>
        </div>
      </div>
    </div>
  );
}

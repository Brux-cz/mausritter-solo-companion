import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import {
  SCENE_COMPLICATIONS, FAILURE_CONSEQUENCES, SCENE_ALTERATION_TABLE,
  INTERRUPTED_SCENE_FOCUS, SCENE_TYPE_LABELS, NARRATIVE_OPENINGS, NARRATIVE_SETTINGS,
  ACTION_ORACLE, THEME_ORACLE
} from '../../data/constants';
import { rollD6, randomFrom, formatTimestamp } from '../../utils/helpers';
import { ResultCard, Button, HelpHeader, Input } from '../ui/common';
import type { SceneType, SceneCheckResult } from '../../types';

const SceneManager = () => {
  const activeParty = useGameStore(s => s.getActiveParty());
  const getSceneState = useGameStore(s => s.getSceneState);
  const startScene = useGameStore(s => s.startScene);
  const endScene = useGameStore(s => s.endScene);
  const adjustChaosFactor = useGameStore(s => s.adjustChaosFactor);
  const addThread = useGameStore(s => s.addThread);
  const removeThread = useGameStore(s => s.removeThread);
  const toggleThreadResolved = useGameStore(s => s.toggleThreadResolved);
  const addSceneNPC = useGameStore(s => s.addSceneNPC);
  const removeSceneNPC = useGameStore(s => s.removeSceneNPC);
  const handleLogEntry = useGameStore(s => s.handleLogEntry);
  const worldNPCs = useGameStore(s => s.worldNPCs);

  const [sceneTitle, setSceneTitle] = useState('');
  const [sceneType, setSceneType] = useState<SceneType>('exploration');
  const [newThread, setNewThread] = useState('');
  const [newNPCName, setNewNPCName] = useState('');
  const [selectedWorldNPC, setSelectedWorldNPC] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [lastStartResult, setLastStartResult] = useState<{
    checkResult: SceneCheckResult;
    alteration?: string;
    focus?: string;
  } | null>(null);

  // Frame Scene state (přesunuto z OraclePanel)
  const [frameSceneResult, setFrameSceneResult] = useState<any>(null);

  if (!activeParty) {
    return (
      <ResultCard className="bg-stone-50 border-stone-300">
        <div className="text-center py-8">
          <p className="text-2xl mb-2">🎭</p>
          <p className="text-stone-600 font-medium">Vyber druzinu pro spravu scen</p>
          <p className="text-stone-400 text-sm mt-1">Prepni na panel Postavy a vytvor nebo vyber druzinu.</p>
        </div>
      </ResultCard>
    );
  }

  const sceneState = getSceneState();
  const { chaosFactor, currentScene, sceneHistory, threads, sceneNPCs, sceneCount } = sceneState;

  const handleStartScene = () => {
    if (!sceneTitle.trim()) return;
    const result = startScene(sceneTitle.trim(), sceneType);
    setLastStartResult({
      checkResult: result.checkResult,
      alteration: result.alteration,
      focus: result.focus
    });
    setSceneTitle('');
  };

  const handleAddThread = () => {
    if (!newThread.trim()) return;
    addThread(newThread.trim());
    setNewThread('');
  };

  const handleAddNPC = () => {
    if (selectedWorldNPC) {
      const npc = worldNPCs.find(n => n.id === selectedWorldNPC);
      if (npc) {
        addSceneNPC(npc.name, npc.id);
        setSelectedWorldNPC('');
        return;
      }
    }
    if (!newNPCName.trim()) return;
    addSceneNPC(newNPCName.trim());
    setNewNPCName('');
  };

  // Frame Scene (přesunuto z OraclePanel)
  const rollFrameScene = () => {
    const alteredDie = rollD6();
    const isAltered = alteredDie >= 5;
    const opening = randomFrom(NARRATIVE_OPENINGS);
    const setting = randomFrom(NARRATIVE_SETTINGS);
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    const complication = isAltered ? SCENE_COMPLICATIONS[rollD6() - 1] : null;

    const result = { alteredDie, isAltered, opening, setting, action, theme, complication };
    setFrameSceneResult(result);

    let narrativeText = `**${opening}** ${setting}`;
    narrativeText += `\n\n*${action} + ${theme}*`;
    if (isAltered && complication) {
      narrativeText += `\n\nKomplikace: ${complication}`;
    }

    handleLogEntry({
      type: 'oracle',
      subtype: 'frame_scene',
      timestamp: formatTimestamp(),
      dice: [alteredDie],
      result: isAltered ? 'Pozmenena scena' : 'Scena dle ocekavani',
      narrative: narrativeText,
      details: result
    } as any);
  };

  const rollComplication = () => {
    const die = rollD6();
    const result = SCENE_COMPLICATIONS[die - 1];
    handleLogEntry({
      type: 'oracle',
      subtype: 'complication',
      timestamp: formatTimestamp(),
      dice: [die],
      result
    } as any);
  };

  const rollConsequence = () => {
    const die = rollD6();
    const result = FAILURE_CONSEQUENCES[die - 1];
    handleLogEntry({
      type: 'oracle',
      subtype: 'consequence',
      timestamp: formatTimestamp(),
      dice: [die],
      result
    } as any);
  };

  const checkBadgeClass = (result: SceneCheckResult) => {
    switch (result) {
      case 'normal': return 'bg-green-100 text-green-700 border-green-300';
      case 'altered': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'interrupted': return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const checkLabel = (result: SceneCheckResult) => {
    switch (result) {
      case 'normal': return 'Normalni';
      case 'altered': return 'Pozmenena';
      case 'interrupted': return 'Prerusena';
    }
  };

  return (
    <div className="space-y-4">
      {/* CHAOS FACTOR */}
      <ResultCard className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300">
        <div className="flex items-center justify-between mb-2">
          <HelpHeader
            title="Chaos Factor"
            icon="⚡"
            tooltip={
              <div>
                <p className="font-bold mb-2">Chaos Factor (1-9)</p>
                <p className="text-xs mb-2">Meri jak chaoticky je pribeh. Vyssi CF = vetsi sance na pozmenene nebo prerusene sceny.</p>
                <p className="font-bold mb-1">Jak funguje:</p>
                <ul className="text-xs space-y-1">
                  <li>Na zacatku kazde sceny hod d10 vs CF</li>
                  <li><b>d10 &gt; CF</b> = Normalni scena</li>
                  <li><b>d10 ≤ CF, lichy</b> = Pozmenena scena</li>
                  <li><b>d10 ≤ CF, sudy</b> = Prerusena scena</li>
                </ul>
                <p className="text-xs mt-2 italic">CF se meni po kazde scene: Pod kontrolou = CF-1, Mimo kontrolu = CF+1</p>
              </div>
            }
          />
        </div>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => adjustChaosFactor(n - chaosFactor)}
              className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                n === chaosFactor
                  ? 'bg-purple-600 text-white shadow-lg scale-110 ring-2 ring-purple-400'
                  : n < chaosFactor
                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-stone-400 mt-1 px-1">
          <span>klidnejsi</span>
          <span>dramatictejsi</span>
        </div>
      </ResultCard>

      {/* AKTUALNI SCENA */}
      <ResultCard className={currentScene
        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'
        : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
      }>
        <HelpHeader
          title={currentScene ? 'Aktualni scena' : 'Nova scena'}
          icon="🎬"
          tooltip={
            <div>
              <p className="font-bold mb-2">Zivotni cyklus sceny</p>
              <ol className="text-xs space-y-1 list-decimal pl-3">
                <li>Zadej nazev a typ sceny</li>
                <li>Klikni Zahajit — automaticky d10 check vs Chaos Factor</li>
                <li>Hraj scenu (oracle, souboje, denik...)</li>
                <li>Ukonci scenu — Pod kontrolou (CF-1) nebo Mimo kontrolu (CF+1)</li>
              </ol>
            </div>
          }
        />

        {!currentScene ? (
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Nazev sceny</label>
              <input
                type="text"
                value={sceneTitle}
                onChange={e => setSceneTitle(e.target.value)}
                placeholder="Vyprava do mlyna..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                onKeyDown={e => e.key === 'Enter' && handleStartScene()}
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Typ</label>
              <select
                value={sceneType}
                onChange={e => setSceneType(e.target.value as SceneType)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                {Object.entries(SCENE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleStartScene}
              size="large"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={!sceneTitle.trim()}
            >
              🎬 Zahajit scenu
            </Button>

            {/* Výsledek posledního check */}
            {lastStartResult && (
              <div className={`p-3 rounded-lg border ${
                lastStartResult.checkResult === 'normal' ? 'bg-green-50 border-green-200' :
                lastStartResult.checkResult === 'altered' ? 'bg-orange-50 border-orange-200' :
                'bg-red-50 border-red-200'
              }`}>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold border ${checkBadgeClass(lastStartResult.checkResult)}`}>
                  {checkLabel(lastStartResult.checkResult)}
                </span>
                {lastStartResult.alteration && (
                  <p className="text-sm text-orange-700 mt-2">{lastStartResult.alteration}</p>
                )}
                {lastStartResult.focus && (
                  <p className="text-sm text-red-700 mt-2">{lastStartResult.focus}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-blue-900">Scena #{currentScene.number}:</span>
                <span className="text-stone-800">{currentScene.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {SCENE_TYPE_LABELS[currentScene.type] || currentScene.type}
                </span>
                <span className="text-xs text-stone-500">Chaos: {currentScene.chaosAtStart}</span>
                <span className="text-xs text-stone-500">Check: [{currentScene.checkDie}]</span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold border ${checkBadgeClass(currentScene.checkResult)}`}>
                  {checkLabel(currentScene.checkResult)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => endScene('in_control')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                ✅ Pod kontrolou
              </Button>
              <Button
                onClick={() => endScene('out_of_control')}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                💀 Mimo kontrolu
              </Button>
            </div>
          </div>
        )}
      </ResultCard>

      {/* ZAPLETKY (Threads) */}
      <ResultCard>
        <div className="flex items-center justify-between mb-2">
          <HelpHeader
            title="Zapletky"
            icon="📋"
            tooltip={
              <div>
                <p className="text-xs">Seznam aktivnich zapletkových linek. Pri prerusene scene se nahodne vybere zapletka jako focus.</p>
              </div>
            }
          />
        </div>
        <div className="space-y-1 mb-2">
          {threads.length === 0 && (
            <p className="text-xs text-stone-400 italic">Zatim zadne zapletky.</p>
          )}
          {threads.map(thread => (
            <div key={thread.id} className="flex items-center gap-2 group">
              <button
                onClick={() => toggleThreadResolved(thread.id)}
                className={`text-sm ${thread.resolved ? 'text-green-500' : 'text-stone-300 hover:text-stone-500'}`}
              >
                {thread.resolved ? '☑' : '☐'}
              </button>
              <span className={`flex-1 text-sm ${thread.resolved ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                {thread.description}
              </span>
              <button
                onClick={() => removeThread(thread.id)}
                className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newThread}
            onChange={e => setNewThread(e.target.value)}
            placeholder="Nova zapletka..."
            className="flex-1 px-2 py-1 border border-stone-300 rounded text-sm"
            onKeyDown={e => e.key === 'Enter' && handleAddThread()}
          />
          <Button onClick={handleAddThread} variant="secondary" disabled={!newThread.trim()}>+</Button>
        </div>
      </ResultCard>

      {/* OBSAZENI (NPC Cast) */}
      <ResultCard>
        <div className="flex items-center justify-between mb-2">
          <HelpHeader
            title="Obsazeni"
            icon="🎭"
            tooltip={
              <div>
                <p className="text-xs">NPC zapojene do aktualniho pribehoveho oblouku. Mohou byt propojene s World NPC.</p>
              </div>
            }
          />
        </div>
        <div className="space-y-1 mb-2">
          {sceneNPCs.length === 0 && (
            <p className="text-xs text-stone-400 italic">Zatim zadne NPC v obsazeni.</p>
          )}
          {sceneNPCs.map(npc => (
            <div key={npc.id} className="flex items-center gap-2 group">
              <span className="text-sm text-stone-700 flex-1">
                {npc.name}
                {npc.worldNpcId && <span className="text-xs text-purple-500 ml-1">→ World NPC</span>}
              </span>
              <button
                onClick={() => removeSceneNPC(npc.id)}
                className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {worldNPCs.length > 0 && (
            <select
              value={selectedWorldNPC}
              onChange={e => {
                setSelectedWorldNPC(e.target.value);
                if (e.target.value) setNewNPCName('');
              }}
              className="px-2 py-1 border border-stone-300 rounded text-sm bg-white"
            >
              <option value="">Z World NPC...</option>
              {worldNPCs
                .filter(n => !sceneNPCs.some(sn => sn.worldNpcId === n.id))
                .map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
            </select>
          )}
          <input
            type="text"
            value={newNPCName}
            onChange={e => { setNewNPCName(e.target.value); setSelectedWorldNPC(''); }}
            placeholder="Jmeno NPC..."
            className="flex-1 px-2 py-1 border border-stone-300 rounded text-sm"
            onKeyDown={e => e.key === 'Enter' && handleAddNPC()}
          />
          <Button
            onClick={handleAddNPC}
            variant="secondary"
            disabled={!newNPCName.trim() && !selectedWorldNPC}
          >+</Button>
        </div>
      </ResultCard>

      {/* HISTORIE SCEN (collapsible) */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors w-full"
        >
          <span>{showHistory ? '▼' : '▶'}</span>
          <span>📜 Historie scen ({sceneHistory.length})</span>
        </button>
        {showHistory && sceneHistory.length > 0 && (
          <div className="mt-2 space-y-1 pl-4">
            {[...sceneHistory].reverse().map(scene => {
              const outcomeLabel = scene.outcome === 'in_control' ? 'Pod kontrolou' : 'Mimo kontrolu';
              const cfChange = scene.outcome === 'in_control' ? -1 : 1;
              const cfAfter = Math.max(1, Math.min(9, scene.chaosAtStart + cfChange));
              return (
                <div key={scene.id} className="text-xs text-stone-600 py-1 border-b border-stone-100">
                  <span className="font-medium">#{scene.number}</span>{' '}
                  <span>{scene.title}</span>{' '}
                  <span className="text-stone-400">|</span>{' '}
                  <span>CF {scene.chaosAtStart}→{cfAfter}</span>{' '}
                  <span className="text-stone-400">|</span>{' '}
                  <span className={scene.outcome === 'in_control' ? 'text-green-600' : 'text-red-600'}>
                    {outcomeLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {showHistory && sceneHistory.length === 0 && (
          <p className="text-xs text-stone-400 italic mt-1 pl-4">Zatim zadna dokoncena scena.</p>
        )}
      </div>

      {/* NASTROJE SCENY (collapsible) */}
      <div>
        <button
          onClick={() => setShowTools(!showTools)}
          className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors w-full"
        >
          <span>{showTools ? '▼' : '▶'}</span>
          <span>🎲 Nastroje sceny</span>
        </button>
        {showTools && (
          <div className="mt-2 space-y-4">
            {/* Zarámuj scénu */}
            <ResultCard className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300">
              <HelpHeader
                title="Zaramuj scenu"
                icon="🎬"
                tooltip={
                  <div>
                    <p className="font-bold mb-2">Kombinovany generator</p>
                    <p className="text-xs mb-2">Vygeneruje kompletni ramec pro novou scenu jednim kliknutim.</p>
                    <ul className="text-xs space-y-1">
                      <li><b>Altered Scene</b> — je neco jinak? (d6)</li>
                      <li><b>Otevreni</b> — jak scena zacina</li>
                      <li><b>Prostredi</b> — kde se to odehrava</li>
                      <li><b>Akce + Tema</b> — co se deje</li>
                      <li><b>Komplikace</b> — pokud je scena pozmenena</li>
                    </ul>
                  </div>
                }
              />
              <p className="text-sm text-stone-600 mb-3">Vygeneruj kompletni ramec pro novou scenu.</p>
              <Button onClick={rollFrameScene} size="large" className="w-full bg-amber-600 hover:bg-amber-700">
                🎬 Zaramuj scenu
              </Button>

              {frameSceneResult && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-lg font-bold ${frameSceneResult.isAltered ? 'text-orange-600' : 'text-green-600'}`}>
                      🎲 {frameSceneResult.alteredDie}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${frameSceneResult.isAltered ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {frameSceneResult.isAltered ? 'POZMENENA SCENA!' : 'Dle ocekavani'}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-stone-500 text-xs">📖 Otevreni:</span>
                      <p className="font-medium text-stone-800">{frameSceneResult.opening}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 text-xs">📍 Prostredi:</span>
                      <p className="text-stone-700">{frameSceneResult.setting}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 text-xs">💡 Inspirace:</span>
                      <p className="text-purple-700 font-medium">{frameSceneResult.action} + {frameSceneResult.theme}</p>
                    </div>
                    {frameSceneResult.isAltered && frameSceneResult.complication && (
                      <div className="p-2 bg-orange-50 rounded border border-orange-200">
                        <span className="text-orange-600 text-xs">⚡ Komplikace:</span>
                        <p className="text-orange-800 font-medium">{frameSceneResult.complication}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ResultCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard>
                <HelpHeader
                  title="Komplikace"
                  icon="⚡"
                  tooltip={
                    <div>
                      <p className="text-xs">Generuje necekane zvraty a prekazky.</p>
                    </div>
                  }
                />
                <p className="text-sm text-stone-600 mb-3">Co se pokazilo?</p>
                <Button onClick={rollComplication} className="w-full">Hodit d6</Button>
              </ResultCard>

              <ResultCard>
                <HelpHeader
                  title="Dusledek selhani"
                  icon="💀"
                  tooltip={
                    <div>
                      <p className="text-xs">Pomaha vytvorit zajimave nasledky selhani.</p>
                    </div>
                  }
                />
                <p className="text-sm text-stone-600 mb-3">Co se stane pri neuspechu?</p>
                <Button onClick={rollConsequence} className="w-full">Hodit d6</Button>
              </ResultCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneManager;

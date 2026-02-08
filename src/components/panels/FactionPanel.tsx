import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { rollD6, generateId, formatTimestamp } from '../../utils/helpers';
import { SectionHeader, ResultCard, Button, HelpHeader, Input } from '../ui/common';

const FactionPanel = () => {
  const { factions, setFactions, handleLogEntry } = useGameStore();
  const onLogEntry = handleLogEntry;
  const [editingFaction, setEditingFaction] = useState(null);

  const addFaction = () => {
    const newFaction = {
      id: generateId(),
      name: 'Nová frakce',
      type: 'gang',
      leader: '',
      base: '',
      trait: '',
      resources: [],
      goals: [{ id: generateId(), description: 'Hlavní cíl', progress: 0, maxProgress: 3 }],
      relationships: []
    };
    setFactions([...factions, newFaction]);
    setEditingFaction(newFaction.id);
  };

  const updateFaction = (id, updates) => {
    setFactions(factions.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFaction = (id) => {
    setFactions(factions.filter(f => f.id !== id));
  };

  const rollFactionProgress = (faction) => {
    const die = rollD6();
    const resourceBonus = faction.resources?.length || 0;
    const total = die + resourceBonus;
    const success = total >= 6;
    
    if (success && faction.goals?.length > 0) {
      const currentGoal = faction.goals.find(g => g.progress < g.maxProgress);
      if (currentGoal) {
        updateFaction(faction.id, {
          goals: faction.goals.map(g => 
            g.id === currentGoal.id 
              ? { ...g, progress: Math.min(g.maxProgress, g.progress + 2) }
              : g
          )
        });
      }
    }
    
    onLogEntry({
      type: 'faction_progress',
      timestamp: formatTimestamp(),
      faction: faction.name,
      roll: die,
      bonus: resourceBonus,
      total,
      success
    });
    
    return { die, resourceBonus, total, success };
  };

  const addGoal = (factionId) => {
    const faction = factions.find(f => f.id === factionId);
    if (!faction) return;
    
    updateFaction(factionId, {
      goals: [...(faction.goals || []), {
        id: generateId(),
        description: 'Nový cíl',
        progress: 0,
        maxProgress: 3
      }]
    });
  };

  const addResource = (factionId) => {
    const faction = factions.find(f => f.id === factionId);
    if (!faction) return;
    
    updateFaction(factionId, {
      resources: [...(faction.resources || []), 'Nový zdroj']
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="⚔️" 
        title="Frakce" 
        subtitle="Sleduj síly pohybující se ve světě"
      />

      <ResultCard>
        <HelpHeader 
          title="Přidat frakci" 
          icon="➕"
          tooltip={
            <div>
              <p className="mb-1">Frakce jsou skupiny s vlastními cíli:</p>
              <ul className="text-xs space-y-1">
                <li>• Gangy, cechy, kulty, šlechta</li>
                <li>• Sleduj jejich zdroje a cíle</li>
                <li>• Každý týden hoď na pokrok</li>
              </ul>
              <p className="mt-1 text-xs text-stone-300">
                d6 + počet zdrojů ≥ 6 = +2 pokrok k cíli
              </p>
            </div>
          }
        />
        <Button onClick={addFaction} className="w-full">
          ➕ Přidat frakci
        </Button>
      </ResultCard>

      {factions.length === 0 ? (
        <ResultCard>
          <p className="text-center text-stone-500 py-8">
            Žádné frakce. Přidej první frakci pro sledování jejich cílů a pokroku.
          </p>
        </ResultCard>
      ) : (
        <div className="space-y-4">
          {factions.map(faction => (
            <ResultCard key={faction.id} className={editingFaction === faction.id ? 'border-amber-500 border-2' : ''}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    {editingFaction === faction.id ? (
                      <Input
                        value={faction.name}
                        onChange={(v) => updateFaction(faction.id, { name: v })}
                        className="text-xl font-bold"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-amber-900 truncate">{faction.name}</h3>
                    )}
                    {faction.trait && <p className="text-stone-600 italic truncate">{faction.trait}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="small" 
                      variant="ghost" 
                      onClick={() => setEditingFaction(editingFaction === faction.id ? null : faction.id)}
                    >
                      {editingFaction === faction.id ? '✓' : '✏️'}
                    </Button>
                    <Button size="small" variant="danger" onClick={() => removeFaction(faction.id)}>✕</Button>
                  </div>
                </div>

                {/* Details */}
                {editingFaction === faction.id && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-stone-500">Vůdce</label>
                      <Input 
                        value={faction.leader || ''}
                        onChange={(v) => updateFaction(faction.id, { leader: v })}
                        placeholder="Jméno vůdce..."
                      />
                    </div>
                    <div>
                      <label className="text-sm text-stone-500">Základna</label>
                      <Input 
                        value={faction.base || ''}
                        onChange={(v) => updateFaction(faction.id, { base: v })}
                        placeholder="Místo základny..."
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-stone-500">Charakteristika</label>
                      <Input 
                        value={faction.trait || ''}
                        onChange={(v) => updateFaction(faction.id, { trait: v })}
                        placeholder="Popis frakce..."
                      />
                    </div>
                  </div>
                )}

                {/* Resources */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-stone-700">📦 Zdroje ({faction.resources?.length || 0})</span>
                    {editingFaction === faction.id && (
                      <Button size="small" variant="ghost" onClick={() => addResource(faction.id)}>+</Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(faction.resources || []).map((res, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-100 rounded-full text-sm">
                        {editingFaction === faction.id ? (
                          <input
                            type="text"
                            value={res}
                            onChange={(e) => {
                              const newResources = [...faction.resources];
                              newResources[i] = e.target.value;
                              updateFaction(faction.id, { resources: newResources });
                            }}
                            className="bg-transparent border-none outline-none w-24"
                          />
                        ) : res}
                      </span>
                    ))}
                    {(!faction.resources || faction.resources.length === 0) && (
                      <span className="text-stone-400 text-sm">Žádné zdroje</span>
                    )}
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-stone-700">🎯 Cíle</span>
                    {editingFaction === faction.id && (
                      <Button size="small" variant="ghost" onClick={() => addGoal(faction.id)}>+</Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(faction.goals || []).map(goal => (
                      <div key={goal.id} className="p-3 bg-stone-100 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          {editingFaction === faction.id ? (
                            <Input 
                              value={goal.description}
                              onChange={(v) => updateFaction(faction.id, {
                                goals: faction.goals.map(g => 
                                  g.id === goal.id ? { ...g, description: v } : g
                                )
                              })}
                              className="flex-1 mr-2"
                            />
                          ) : (
                            <span className="font-medium">{goal.description}</span>
                          )}
                          <span className={`font-bold ${goal.progress >= goal.maxProgress ? 'text-green-600' : 'text-amber-700'}`}>
                            {goal.progress}/{goal.maxProgress}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: goal.maxProgress }).map((_, i) => (
                            <div
                              key={i}
                              onClick={() => editingFaction === faction.id && updateFaction(faction.id, {
                                goals: faction.goals.map(g => 
                                  g.id === goal.id ? { ...g, progress: i < goal.progress ? i : i + 1 } : g
                                )
                              })}
                              className={`flex-1 h-3 rounded ${
                                i < goal.progress ? 'bg-amber-600' : 'bg-amber-200'
                              } ${editingFaction === faction.id ? 'cursor-pointer hover:bg-amber-400' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Roll Progress */}
                <Button 
                  onClick={() => {
                    const result = rollFactionProgress(faction);
                    alert(`${faction.name}: d6=${result.die} + ${result.resourceBonus} zdrojů = ${result.total}\n${result.success ? '✓ Úspěch! +2 pokrok' : '✗ Bez pokroku'}`);
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  🎲 Hodit na pokrok (d6 + zdroje ≥ 6)
                </Button>
              </div>
            </ResultCard>
          ))}
        </div>
      )}
    </div>
  );
};



export { FactionPanel };

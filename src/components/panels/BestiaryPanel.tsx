import React, { useState, useMemo } from 'react';
import {
  MAUS_MENAGERIE_CREATURES,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  CreatureCategory,
  CreatureStatBlock,
} from '../../data/mausmenagerie';

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as CreatureCategory[];

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="inline-flex flex-col items-center leading-tight mr-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/70">{label}</span>
      <span className="text-sm font-bold text-amber-900">{value}</span>
    </span>
  );
}

function CreatureCard({
  creature,
  expanded,
  onToggle,
}: {
  creature: CreatureStatBlock;
  expanded: boolean;
  onToggle: () => void;
}) {
  const categoryIcon = CATEGORY_ICONS[creature.category];
  const categoryLabel = CATEGORY_LABELS[creature.category];
  const dexDisplay = typeof creature.dex === 'string' ? creature.dex : creature.dex;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        expanded
          ? 'border-amber-400 bg-amber-50 shadow-md'
          : 'border-amber-200 bg-white hover:border-amber-300 hover:shadow-sm'
      }`}
    >
      {/* Summary row — always visible */}
      <button
        className="w-full text-left p-3 flex items-start gap-2"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className="text-xl mt-0.5 shrink-0">{categoryIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-bold text-amber-900 text-sm">{creature.name}</span>
            <span className="text-xs text-amber-600 italic">{creature.nameEn}</span>
            {creature.warband && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold">
                Válečný oddíl
              </span>
            )}
          </div>
          <div className="text-xs text-amber-700/80 mt-0.5">{categoryLabel}</div>
          {/* Mini stat line */}
          <div className="flex flex-wrap gap-x-2 mt-1 text-xs text-amber-800">
            <span>HP {creature.hp}</span>
            <span>·</span>
            <span>STR {creature.str}</span>
            <span>·</span>
            <span>DEX {dexDisplay}</span>
            <span>·</span>
            <span>WIL {creature.wil}</span>
            {creature.armor !== undefined && (
              <>
                <span>·</span>
                <span>Zbroj {creature.armor}</span>
              </>
            )}
          </div>
        </div>
        <span className="text-amber-500 text-xs mt-1 shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-amber-200 pt-3 space-y-2">
          {/* Full stats */}
          <div className="flex flex-wrap items-center gap-1 bg-amber-100 rounded-lg px-3 py-2">
            <StatPill label="HP" value={creature.hp} />
            <StatPill label="STR" value={creature.str} />
            <StatPill label="DEX" value={dexDisplay} />
            <StatPill label="WIL" value={creature.wil} />
            {creature.armor !== undefined && <StatPill label="Zbroj" value={creature.armor} />}
          </div>

          {/* Attacks */}
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Útoky</div>
            {creature.attacks.map((atk, i) => (
              <div key={i} className="text-sm text-amber-900">
                <span className="font-medium">{atk.name}</span>{' '}
                <span className="font-bold text-red-700">{atk.dice}</span>
                {atk.note && <span className="text-xs text-amber-700 ml-1">({atk.note})</span>}
              </div>
            ))}
          </div>

          {/* Crit damage */}
          {creature.critDamage && (
            <div>
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Kritické poškození</div>
              <div className="text-sm text-amber-900">{creature.critDamage}</div>
            </div>
          )}

          {/* Special abilities */}
          {creature.special && creature.special.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Schopnosti</div>
              {creature.special.map((s, i) => (
                <div key={i} className="text-sm text-amber-900">{s}</div>
              ))}
            </div>
          )}

          {/* Motivation */}
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Motivace</div>
            <div className="text-sm text-amber-900 italic">{creature.motivation}</div>
          </div>

          {/* Variants */}
          {creature.variants && creature.variants.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Varianty</div>
              <div className="space-y-1">
                {creature.variants.map((v, i) => (
                  <div key={i} className="text-xs text-amber-900 bg-amber-50 rounded px-2 py-1 border border-amber-200">
                    <span className="font-semibold">{i + 1}. {v.name}</span>
                    {' — '}
                    <span>{v.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source badge */}
          <div className="flex justify-end">
            {creature.source === 'maus-menagerie' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium">
                📖 Maus Menagerie
              </span>
            )}
            {creature.source === 'srd' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-medium">
                📜 Pravidla Mausritter
              </span>
            )}
            {creature.source === 'community' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                🌲 Komunita
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function BestiaryPanel() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CreatureCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const usedCategories = useMemo(() => {
    const cats = new Set(MAUS_MENAGERIE_CREATURES.map(c => c.category));
    return ALL_CATEGORIES.filter(c => cats.has(c));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return MAUS_MENAGERIE_CREATURES.filter(c => {
      const matchCat = activeCategory === 'all' || c.category === activeCategory;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.motivation.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="flex flex-col h-full bg-amber-50/30">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-amber-200 bg-amber-50">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🐉</span>
          <h2 className="text-lg font-bold text-amber-900">Bestiář</h2>
          <span className="text-xs text-amber-600 ml-1">{MAUS_MENAGERIE_CREATURES.length} tvorů</span>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Hledat tvora…"
          className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-300"
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              activeCategory === 'all'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-amber-700 border-amber-300 hover:border-amber-500'
            }`}
          >
            Vše ({MAUS_MENAGERIE_CREATURES.length})
          </button>
          {usedCategories.map(cat => {
            const count = MAUS_MENAGERIE_CREATURES.filter(c => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-amber-700 border-amber-300 hover:border-amber-500'
                }`}
              >
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Creature list */}
      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <div className="text-center text-amber-500 py-12 text-sm">
            Žádný tvor nenalezen
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {filtered.map(c => (
              <CreatureCard
                key={c.id}
                creature={c}
                expanded={expandedId === c.id}
                onToggle={() => toggle(c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

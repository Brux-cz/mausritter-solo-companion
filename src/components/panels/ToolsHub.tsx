import React, { useState, Suspense, lazy } from 'react';
import { LexikonPanel } from './LexikonPanel';
import { SmallWorldPanel } from './SmallWorldPanel';
import { ItemCardStudio } from './ItemCardStudio';
import { HowToPlayPanel } from '../ui/common';

const MapPanel = lazy(() => import('./MapPanel'));

type ToolsTab = 'maps' | 'lexicon' | 'smallworld' | 'studio' | 'howto';

const tabs: { id: ToolsTab; label: string; icon: string }[] = [
  { id: 'maps',       label: 'Mapy',      icon: '🗺️' },
  { id: 'lexicon',    label: 'Lexikon',   icon: '📚' },
  { id: 'smallworld', label: 'Malý Svět', icon: '🏠' },
  { id: 'studio',     label: 'Kartičky',  icon: '🎴' },
  { id: 'howto',      label: 'Jak hrát',  icon: '📖' },
];

export const ToolsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolsTab>('maps');

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap border-b border-amber-200 bg-amber-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-900 bg-amber-50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {activeTab === 'maps' && (
          <Suspense fallback={<div className="text-center py-8 text-stone-500">Načítám editor map...</div>}>
            <MapPanel />
          </Suspense>
        )}
        {activeTab === 'lexicon'    && <LexikonPanel />}
        {activeTab === 'smallworld' && <SmallWorldPanel />}
        {activeTab === 'studio'     && <ItemCardStudio />}
        {activeTab === 'howto'      && <HowToPlayPanel />}
      </div>
    </div>
  );
};

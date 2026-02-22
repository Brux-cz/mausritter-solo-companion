import React, { useState } from 'react';
import { TimePanel } from './TimePanel';
import { EventsPanel } from './EventsPanel';

type TimeTab = 'time' | 'events';

const tabs: { id: TimeTab; label: string; icon: string }[] = [
  { id: 'time',   label: 'Čas',      icon: '⏰' },
  { id: 'events', label: 'Události', icon: '📅' },
];

export const TimeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TimeTab>('time');

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-amber-200 bg-amber-50">
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
        {activeTab === 'time'   && <TimePanel />}
        {activeTab === 'events' && <EventsPanel />}
      </div>
    </div>
  );
};

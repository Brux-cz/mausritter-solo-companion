import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { SectionHeader, ResultCard, Button, Input } from '../ui/common';

const EventsPanel = () => {
  const { timedEvents, setTimedEvents, getActiveParty } = useGameStore();
  const gameTime = getActiveParty()?.gameTime;
  const [newEvent, setNewEvent] = useState({ title: '', daysFromNow: 1, notes: '' });
  const [showForm, setShowForm] = useState(false);

  const currentDay = gameTime?.day || 1;

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    const event = {
      id: Date.now().toString(),
      title: newEvent.title.trim(),
      targetDay: currentDay + parseInt(newEvent.daysFromNow || 1),
      notes: newEvent.notes.trim(),
      completed: false,
      createdDay: currentDay
    };
    setTimedEvents([...timedEvents, event]);
    setNewEvent({ title: '', daysFromNow: 1, notes: '' });
    setShowForm(false);
  };

  const toggleComplete = (id) => {
    setTimedEvents(timedEvents.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const deleteEvent = (id) => {
    setTimedEvents(timedEvents.filter(e => e.id !== id));
  };

  // Seřadit podle targetDay, aktivní první
  const sortedEvents = [...timedEvents].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.targetDay - b.targetDay;
  });

  const getDaysRemaining = (targetDay) => {
    const remaining = targetDay - currentDay;
    if (remaining < 0) return { text: `${Math.abs(remaining)} dní po`, urgent: true, past: true };
    if (remaining === 0) return { text: 'DNES!', urgent: true, past: false };
    if (remaining === 1) return { text: 'Zítra', urgent: true, past: false };
    return { text: `Za ${remaining} dní`, urgent: remaining <= 3, past: false };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <SectionHeader icon="⏰" title="Časované události" subtitle="Nadcházející události v kampani" />

      {/* Přidat novou událost */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full">
          + Přidat událost
        </Button>
      ) : (
        <ResultCard>
          <div className="space-y-3">
            <Input
              value={newEvent.title}
              onChange={(v) => setNewEvent({ ...newEvent, title: v })}
              placeholder="Co se stane? (např. Bandité zaútočí)"
            />
            <div className="flex gap-2 items-center">
              <span className="text-sm text-stone-600">Za</span>
              <input
                type="number"
                min="1"
                value={newEvent.daysFromNow}
                onChange={(e) => setNewEvent({ ...newEvent, daysFromNow: e.target.value })}
                className="w-16 px-2 py-1 border border-stone-300 rounded text-center"
              />
              <span className="text-sm text-stone-600">dní (den {currentDay + parseInt(newEvent.daysFromNow || 1)})</span>
            </div>
            <Input
              value={newEvent.notes}
              onChange={(v) => setNewEvent({ ...newEvent, notes: v })}
              placeholder="Poznámky (volitelné)"
            />
            <div className="flex gap-2">
              <Button onClick={addEvent} className="flex-1">✓ Přidat</Button>
              <Button onClick={() => setShowForm(false)} variant="secondary" className="flex-1">✕ Zrušit</Button>
            </div>
          </div>
        </ResultCard>
      )}

      {/* Seznam událostí */}
      {sortedEvents.length === 0 ? (
        <ResultCard>
          <p className="text-center text-stone-500 py-4">
            Žádné naplánované události.<br/>
            <span className="text-sm">Přidej první událost tlačítkem výše.</span>
          </p>
        </ResultCard>
      ) : (
        <div className="space-y-2">
          {sortedEvents.map(event => {
            const remaining = getDaysRemaining(event.targetDay);
            return (
              <ResultCard key={event.id} className={event.completed ? 'opacity-50' : ''}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(event.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      event.completed ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 hover:border-amber-500'
                    }`}
                  >
                    {event.completed && '✓'}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${event.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {event.title}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.completed ? 'bg-green-100 text-green-700' :
                        remaining.past ? 'bg-red-100 text-red-700' :
                        remaining.urgent ? 'bg-orange-100 text-orange-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {remaining.text}
                      </span>
                    </div>
                    {event.notes && <p className="text-sm text-stone-500 mt-1">{event.notes}</p>}
                    <p className="text-xs text-stone-400 mt-1">Den {event.targetDay}</p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-stone-400 hover:text-red-500 p-1"
                  >
                    🗑️
                  </button>
                </div>
              </ResultCard>
            );
          })}
        </div>
      )}
    </div>
  );
};



export { EventsPanel };

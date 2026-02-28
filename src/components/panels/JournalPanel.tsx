import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { useMultiplayerStore } from '../../stores/multiplayerStore';
import { NPC_BEHAVIOR_MOODS, NPC_BEHAVIOR_ACTIONS, NPC_BEHAVIOR_MOTIVATIONS, NPC_SECRETS, NPC_REACTIONS, SETTLEMENT_RUMORS, SETTLEMENT_HAPPENINGS, NATURE_EVENTS, WILDERNESS_THREATS, DISCOVERIES, ENCOUNTER_ACTIVITIES, ENCOUNTER_DETAILS, ENCOUNTER_MOODS, ENCOUNTER_MOTIVATIONS, LORE_ASPECTS, CREATURE_STATES, CREATURE_ACTIONS_ANIMAL, CREATURE_REACTIONS_ANIMAL, LORE_MOTIVATION, LORE_RUMOR, LORE_DARKNESS } from '../../data/constants';
const LORE_ASPECTS_MAP = Object.fromEntries(LORE_ASPECTS.map(a => [a.key, a]));
import { randomFrom, generateId, formatTimestamp } from '../../utils/helpers';
import { parseMentions, Select } from '../ui/common';
import { TiptapEditor } from '../ui/TiptapEditor';

const JournalPanel = ({ onExport }) => {
  const {
    journal, setJournal, parties, journalPartyFilter: partyFilter, setJournalPartyFilter: setPartyFilter,
    worldNPCs, worldCreatures, settlements, timedEvents, lexicon, setLexicon,
    getActiveParty, deleteNPC, deleteSettlement, promoteToNPC, updateNPC, createCreature, updateCreature,
  } = useGameStore();
  const { setActivePanel, setPendingMentionOpen } = useUIStore();
  const { myUserId, roomPlayers, roomConnected } = useMultiplayerStore();
  const gameTime = getActiveParty()?.gameTime;
  const onMentionClick = (type, id) => { setPendingMentionOpen({ type, id }); setActivePanel('worldhub'); };
  const onOpenEvents = () => setActivePanel('events');
  const onDeleteNPC = deleteNPC;
  const onDeleteSettlement = deleteSettlement;
  const onPromoteToNPC = promoteToNPC;
  const onUpdateNPC = (npcId, updates) => updateNPC(npcId, updates);
  // Get current player name for authoring entries
  const myPlayer = roomPlayers.find(p => p.oderId === myUserId);
  const myAuthorName = myPlayer?.name || null;
  const [newEntry, setNewEntry] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedScenes, setCollapsedScenes] = useState<Set<string>>(new Set());
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const toggleNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Modal pro zobrazení detailu NPC/osady
  const [detailModal, setDetailModal] = useState(null); // { type: 'npc'|'settlement', data: ... }
  const [generatedBehavior, setGeneratedBehavior] = useState(null); // Dočasné vygenerované chování pro modal
  const [weatherModal, setWeatherModal] = useState(null); // Modal pro detail počasí/období

  // Multi-select mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const longPressTimer = useRef(null);

  // Drag & drop pro přesouvání záznamů
  const [draggedId, setDraggedId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  // Touch drag & drop pro mobilní zařízení
  const [touchDragId, setTouchDragId] = useState(null);

  // Editace poznámky připnuté k záznamu (idx = index do notes[], 'new' = přidat novou)
  const [editingNote, setEditingNote] = useState<{ entryId: string; idx: number | 'new' } | null>(null);

  // Hooksy — otevřené otázky
  const [hookingEntryId, setHookingEntryId] = useState<string | null>(null);

  const createHook = (afterEntryId: string, content: string) => {
    if (!content.trim()) { setHookingEntryId(null); return; }
    const targetIndex = journal.findIndex(e => e.id === afterEntryId);
    if (targetIndex === -1) return;
    const targetEntry = journal[targetIndex];
    const newHook = {
      id: generateId(),
      type: 'hook' as const,
      content,
      resolved: false,
      timestamp: targetEntry.timestamp,
      partyId: partyFilter !== 'all' ? partyFilter : targetEntry.partyId,
    };
    const newJournal = [...journal];
    newJournal.splice(targetIndex + 1, 0, newHook);
    setJournal(newJournal);
    setHookingEntryId(null);
  };

  const resolveHook = (id: string) => {
    setJournal(journal.map(e => e.id === id ? { ...e, resolved: true } : e));
  };

  const saveNote = (entryId: string, html: string, idx: number | 'new') => {
    const trimmed = html.replace(/<[^>]*>/g, '').trim();
    setJournal(journal.map(e => {
      if (e.id !== entryId) return e;
      // Sluč legacy note + notes[] do jednoho pole
      const existing: string[] = e.notes ?? (e.note ? [e.note] : []);
      let updated: string[];
      if (idx === 'new') {
        updated = trimmed ? [...existing, html] : existing;
      } else {
        updated = trimmed
          ? existing.map((n, i) => i === idx ? html : n)
          : existing.filter((_, i) => i !== idx);
      }
      return { ...e, notes: updated, note: undefined, edited: true };
    }));
    if (trimmed) setExpandedNotes(prev => { const next = new Set(prev); next.add(entryId); return next; });
    setEditingNote(null);
  };

  // Mention items pro TiptapEditor
  const allMentions = [
    ...worldNPCs.map(n => ({ type: 'npc', id: n.id, name: n.name, icon: '🐭' })),
    ...settlements.map(s => ({ type: 'settlement', id: s.id, name: s.name, icon: '🏘️' })),
    ...(parties?.flatMap(p => p.characters?.map(c => ({ type: 'character', id: c.id, name: c.name, icon: '⚔️' })) || []) || [])
  ];

  // Render content: HTML (nové záznamy) nebo plain text (staré záznamy)
  const renderContent = (text: string | Record<string, string>) => {
    // Oprava broken serializace: objekt s char indexy {"0":"D","1":"r",...}
    if (text && typeof text === 'object') {
      const numericKeys = Object.keys(text).filter(k => !isNaN(Number(k))).sort((a, b) => Number(a) - Number(b));
      text = numericKeys.map(k => (text as Record<string, string>)[k]).join('');
    }
    if (!text) return null;
    const isHtml = /<[a-z][\s\S]*>/i.test(text);
    if (isHtml) {
      return (
        <span
          className="journal-html-content"
          dangerouslySetInnerHTML={{ __html: text }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('mention') || target.closest('.mention')) {
              e.stopPropagation();
              e.preventDefault();
              const mention = target.classList.contains('mention') ? target : target.closest('.mention') as HTMLElement;
              const mentionType = mention?.getAttribute('data-mention-type');
              const mentionId = mention?.getAttribute('data-id');
              if (mentionType && mentionId) {
                onMentionClick(mentionType, mentionId);
              }
            }
          }}
        />
      );
    }
    return parseMentions(text, onMentionClick, worldNPCs, settlements, lexicon);
  };

  // Long press handler
  const handleTouchStart = (entryId) => {
    longPressTimer.current = setTimeout(() => {
      setSelectionMode(true);
      setSelectedIds(new Set([entryId]));
    }, 500); // 500ms pro long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Toggle selection
  const toggleSelect = (entryId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
    } else {
      newSelected.add(entryId);
    }
    setSelectedIds(newSelected);

    // Exit selection mode if nothing selected
    if (newSelected.size === 0) {
      setSelectionMode(false);
    }
  };

  // Delete selected entries
  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    setJournal(journal.filter(e => !selectedIds.has(e.id)));
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  // Cancel selection mode
  const cancelSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  // Extrakce a vytvoření lore tagů z textu
  const extractAndCreateLoreTags = (text, sourceEntryId = null) => {
    if (!text || !setLexicon || !lexicon) return;

    // Regex pro @kategorie:název
    const loreTagRegex = /@(lokace|npc|stvoreni|predmet|frakce|pravidlo|udalost):([^\s@.,!?;:]+(?:\s+[^\s@.,!?;:]+)*)/gi;
    let match;
    const newItems = [];

    while ((match = loreTagRegex.exec(text)) !== null) {
      const category = match[1].toLowerCase();
      const name = match[2];

      // Kontrola zda položka již existuje
      const exists = lexicon.some(l =>
        l.category === category &&
        l.name.toLowerCase() === name.toLowerCase()
      );

      if (!exists) {
        // Vytvoř novou položku
        newItems.push({
          id: generateId(),
          name: name,
          category: category,
          description: '',
          imageData: null,
          createdAt: new Date().toISOString(),
          sourceEntryId: sourceEntryId
        });
      }
    }

    // Přidej nové položky do lexikonu
    if (newItems.length > 0) {
      setLexicon([...newItems, ...lexicon]);
    }
  };

  // Přidání narativního záznamu s extrakcí lore tagů
  const addNarrativeEntryWithScene = (html: string) => {
    if (!html.trim()) return;

    const entryId = generateId();
    const entry = {
      id: entryId,
      type: 'narrative',
      timestamp: formatTimestamp(),
      content: html,
      partyId: partyFilter !== 'all' ? partyFilter : null,
      // Author info for multiplayer
      authorId: roomConnected ? myUserId : null,
      authorName: roomConnected ? myAuthorName : null
    };

    // Extrahuj a vytvoř lore tagy z plain text verze HTML
    const plainText = html.replace(/<[^>]*>/g, '');
    extractAndCreateLoreTags(plainText, entryId);

    setJournal([entry, ...journal]);
    setNewEntry('');
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Esc pro zavření modalů a editace
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (detailModal) {
          setDetailModal(null);
          setGeneratedBehavior(null);
        } else if (weatherModal) {
          setWeatherModal(null);
        } else if (editingId) {
          setEditingId(null);
          setConfirmDeleteId(null);
        } else if (selectionMode) {
          setSelectionMode(false);
          setSelectedIds(new Set());
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [detailModal, weatherModal, editingId, selectionMode]);

  const deleteEntry = (id) => {
    setJournal(journal.filter(e => e.id !== id));
    setEditingId(null);
    setConfirmDeleteId(null);
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    // For narrative entries, edit the content. For others, edit/add a note.
    if (entry.type === 'narrative') {
      setEditText(entry.content || '');
    } else {
      setEditText(entry.note || '');
    }
  };

  const saveEdit = (id, html?: string) => {
    const text = html ?? editText;
    setJournal(journal.map(e => {
      if (e.id !== id) return e;

      if (e.type === 'narrative') {
        // For narrative, replace content
        return { ...e, content: text, edited: true };
      } else {
        // For other types, add/edit note
        return { ...e, note: text, edited: true };
      }
    }));
    setEditingId(null);
    setEditText('');
  };

  // Drag & drop handlers
  const handleDragStart = (e, entryId) => {
    setDraggedId(entryId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', entryId);
  };

  const handleDragOver = (e, entryId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (entryId !== draggedId) {
      setDropTargetId(entryId);
    }
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e, targetEntryId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetEntryId) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    // Najdi indexy v původním (nefiltrovaném) journalu
    const draggedIndex = journal.findIndex(e => e.id === draggedId);
    const targetIndex = journal.findIndex(e => e.id === targetEntryId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    // Přesuň záznam
    const newJournal = [...journal];
    const [draggedEntry] = newJournal.splice(draggedIndex, 1);

    // Vloží ZA cílový záznam
    const insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
    newJournal.splice(insertIndex, 0, draggedEntry);

    setJournal(newJournal);
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  // Touch drag handlers pro mobilní zařízení
  const handleTouchDragStart = (e, entryId) => {
    e.preventDefault();
    e.stopPropagation();
    setTouchDragId(entryId);
    setDropTargetId(null);
    // Zruš long press timer pokud běží
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchDragMove = (e) => {
    if (!touchDragId) return;
    e.preventDefault();
    const touch = e.touches[0];

    // Najdi element pod prstem
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const entryElement = elements.find(el => el.dataset && el.dataset.entryId);

    if (entryElement && entryElement.dataset.entryId !== touchDragId) {
      setDropTargetId(entryElement.dataset.entryId);
    }
  };

  const handleTouchDragEnd = () => {
    if (!touchDragId) return;

    if (dropTargetId && dropTargetId !== touchDragId) {
      // Proveď přesun
      const draggedIndex = journal.findIndex(j => j.id === touchDragId);
      const targetIndex = journal.findIndex(j => j.id === dropTargetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newJournal = [...journal];
        const [draggedEntry] = newJournal.splice(draggedIndex, 1);
        const insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
        newJournal.splice(insertIndex, 0, draggedEntry);
        setJournal(newJournal);
      }
    }

    setTouchDragId(null);
    setDropTargetId(null);
  };


  const filteredJournal = journal.filter(entry => {
    if (partyFilter !== 'all' && entry.partyId && entry.partyId !== partyFilter) return false;
    if (filter === 'hook_open') return entry.type === 'hook' && !(entry as any).resolved;
    if (filter !== 'all' && entry.type !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const content = JSON.stringify(entry).toLowerCase();
      return content.includes(searchLower);
    }
    return true;
  });

  // Group entries by date
  const groupedByDate = {};
  filteredJournal.forEach(entry => {
    // Parse Czech date format "31. 12. 2024 14:30:25" -> "31. 12. 2024"
    const ts = typeof entry.timestamp === 'number' ? new Date(entry.timestamp).toLocaleString('cs-CZ') : entry.timestamp;
    const parts = ts?.split(' ') || [];
    const date = parts.length >= 3 ? `${parts[0]} ${parts[1]} ${parts[2]}` : (ts || 'Neznámé datum');
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(entry);
  });

  // Format entry based on type - book style
  const formatEntry = (entry) => {
    if (editingId === entry.id) {
      return (
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <TiptapEditor
              content={editText}
              onSubmit={(html) => saveEdit(entry.id, html)}
              placeholder={entry.type === 'narrative' ? 'Tvůj příběh... (@ pro zmínku)' : '(@ pro zmínku)'}
              mentionItems={allMentions}
              autoFocus
              compact
              onCancel={() => { setEditingId(null); setConfirmDeleteId(null); }}
            />
          </div>
          <div className="flex items-center gap-1">
            {confirmDeleteId === entry.id ? (
              <div className="flex gap-1 text-xs whitespace-nowrap">
                <button onMouseDown={(e) => { e.preventDefault(); deleteEntry(entry.id); }} className="text-red-500 hover:text-red-700">Smazat?</button>
                <button onMouseDown={(e) => { e.preventDefault(); setConfirmDeleteId(null); }} className="text-amber-400 hover:text-amber-600">Ne</button>
              </div>
            ) : (
              <button
                onMouseDown={(e) => { e.preventDefault(); setConfirmDeleteId(entry.id); }}
                className="text-amber-300 hover:text-red-400 text-sm"
                title="Smazat"
              >
                ×
              </button>
            )}
          </div>
        </div>
      );
    }

    // Poznámky k záznamu — collapsible, více poznámek
    const EntryNote = ({ entry }: { entry: { id: string; note?: string; notes?: string[] } }) => {
      const allNotes: string[] = entry.notes ?? (entry.note ? [entry.note] : []);
      if (allNotes.length === 0) return null;
      const entryId = entry.id;
      const isExpanded = expandedNotes.has(entryId);
      const preview = allNotes[0].replace(/<[^>]*>/g, '').slice(0, 60);
      return (
        <div className="mt-1.5" onClick={(e) => { e.stopPropagation(); toggleNote(entryId, e); }}>
          <div className="flex items-center gap-1 text-[11px] select-none cursor-pointer" style={{ color: '#C09A8090' }}>
            <span className="font-mono text-[10px]">{isExpanded ? '▾' : '▸'}</span>
            {!isExpanded && <span className="italic truncate opacity-80">{preview}{preview.length >= 60 ? '…' : ''}</span>}
            {allNotes.length > 1 && <span className="text-[10px] opacity-60 ml-1">({allNotes.length})</span>}
          </div>
          {isExpanded && (
            <div className="mt-0.5 space-y-1" style={{ borderLeft: '2px solid #C09A8050', paddingLeft: 8, paddingTop: 2 }}>
              {allNotes.map((note, idx) => (
                <p
                  key={idx}
                  className="italic whitespace-pre-wrap cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: '#8A5A4A', fontSize: 12, lineHeight: 1.55 }}
                  onClick={(e) => { e.stopPropagation(); setEditingNote({ entryId, idx }); }}
                  title="Klikni pro úpravu"
                >
                  {renderContent(note)}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    };

    switch (entry.type) {
      case 'narrative':
        if (entry.isAnnotation) {
          return (
            <div
              className="my-1 ml-1 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ borderLeft: '2px solid #C09A8050', paddingLeft: 8, paddingTop: 2, paddingBottom: 2 }}
              onClick={() => startEdit(entry)}
              title="Klikni pro úpravu"
            >
              <p className="italic whitespace-pre-wrap" style={{ color: '#8A5A4A', fontSize: 12, lineHeight: 1.55 }}>
                {renderContent(entry.content)}
                {entry.edited && <span className="text-xs ml-1" style={{ color:'#C09A80' }}>✎</span>}
              </p>
              <EntryNote entry={entry} />
            </div>
          );
        }
        return (
          <div
            className="my-2 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ padding:'10px 14px', borderRadius:6, background:'#FFFCF7', fontSize:14, lineHeight:1.7, color:'#5A3830', fontFamily:'ui-serif, Georgia, serif' }}
            onClick={() => startEdit(entry)}
            title="Klikni pro úpravu"
          >
            {entry.authorName && (
              <span className="text-xs font-medium px-1.5 py-0.5 rounded mr-2" style={{ color:'#8A5A4A', background:'#FFD8A8' }}>
                {entry.authorName}
              </span>
            )}
            {renderContent(entry.content)}
            {entry.edited && <span className="text-xs ml-1" style={{ color:'#C09A80' }}>✎</span>}
            <EntryNote entry={entry} />
          </div>
        );

      case 'oracle':
        // Handle creature subtype - kratší zobrazení (+ fallback pro staré záznamy bez subtype)
        if ((entry.subtype === 'creature' || (entry.data?.type?.name && entry.data?.personality)) && entry.data) {
          const c = entry.data;
          return (
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden"
                 onClick={() => setDetailModal({ type: 'creature', data: c, note: entry.note })}
                 title="Klikni pro detail">
              <p className="font-bold text-amber-900 truncate">
                {c.type?.icon || '🐭'} {c.name} <span className="font-normal text-amber-800/60">— {c.type?.name}</span>
              </p>
              <p className="text-amber-800/70 text-sm truncate">Je {c.personality}</p>
              <EntryNote entry={entry} />
            </div>
          );
        }
        // Fallback pro starší textové záznamy tvorů (markdown formát)
        if (entry.result && typeof entry.result === 'string' && entry.result.includes('**Vzhled:**')) {
          // Parse: **Jméno** - typ emoji Jméno dělá... Je osobnost.
          const nameMatch = entry.result.match(/^\*\*([^*]+)\*\*/);
          const name = nameMatch ? nameMatch[1].trim() : 'Tvor';

          // Type je mezi " - " a opakováním jména
          const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const typeRegex = new RegExp(`\\s-\\s(.+?)\\s+${escapedName}`);
          const typeMatch = entry.result.match(typeRegex);
          const typePart = typeMatch ? typeMatch[1].trim() : '';

          // Personality - "Je ..." věta
          const personalityMatch = entry.result.match(/\.\s*(Je [^.]+\.)/);
          const personality = personalityMatch ? personalityMatch[1] : '';

          return (
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-bold text-amber-900 truncate">
                🐭 {name} {typePart && <span className="font-normal text-amber-800/60">— {typePart}</span>}
              </p>
              {personality && <p className="text-amber-800/70 text-sm truncate">{personality}</p>}
              <EntryNote entry={entry} />
            </div>
          );
        }
        // Handle encounter subtype - kratší zobrazení (+ fallback pro staré záznamy)
        if (entry.subtype === 'encounter' || (entry.data?.creature && entry.data?.activity)) {
          const e = entry.data;
          if (e) {
            const creatureName = e.creature?.name || e.creature || '???';
            return (
              <div className="my-2 pl-4 border-l-2 border-red-400 cursor-pointer hover:bg-red-50 rounded transition-colors overflow-hidden"
                   onClick={() => setDetailModal({ type: 'encounter', data: e, entryId: entry.id, editName: creatureName, note: entry.note })}
                   title="Klikni pro detail">
                <p className="font-bold text-amber-900 truncate">
                  {(e.danger || e.creature?.danger) ? '⚠️' : '👁️'} {creatureName}
                </p>
                <p className="text-amber-800/70 text-sm truncate">{e.activity}</p>
                <EntryNote entry={entry} />
              </div>
            );
          }
          // Staré záznamy bez data — zobraz styled text bez surového markdownu
          return (
            <div className="my-2 pl-4 border-l-2 border-red-400 rounded overflow-hidden cursor-pointer hover:bg-red-50 transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="text-xs text-red-600 font-medium mb-1">👁️ Setkání</p>
              <p className="text-sm text-amber-900/80 line-clamp-2">{entry.result?.replace(/\*\*/g, '').replace(/\*/g, '')}</p>
              <EntryNote entry={entry} />
            </div>
          );
        }
        // Handle narrative subtype - abstraktní slova
        if (entry.subtype === 'narrative') {
          return (
            <div className="my-2 pl-4 border-l-2 border-amber-400 cursor-pointer hover:bg-amber-50/50 rounded transition-colors overflow-hidden"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-medium text-amber-800 truncate">{entry.result}</p>
              <EntryNote entry={entry} />
            </div>
          );
        }
        // Handle frame_scene subtype - zarámování scény
        if (entry.subtype === 'frame_scene') {
          const d = entry.details;
          // Pokud máme details, zobrazíme strukturovaně
          if (d) {
            return (
              <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors"
                   onClick={() => setDetailModal({ type: 'frame_scene', data: d, note: entry.note })}
                   title="Klikni pro detail">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎬</span>
                  <span className={`text-sm font-bold ${d.isAltered ? 'text-amber-700' : 'text-green-700'}`}>
                    [{d.alteredDie}] {d.isAltered ? 'Pozměněná scéna!' : 'Scéna dle očekávání'}
                  </span>
                </div>
                <p className="text-amber-900 text-sm"><span className="text-amber-600">📖</span> {d.opening}</p>
                <p className="text-amber-900/80 text-sm"><span className="text-amber-600">📍</span> {d.setting}</p>
                <p className="text-amber-800 text-sm font-medium"><span className="text-amber-600">💡</span> {d.action} + {d.theme}</p>
                {d.isAltered && d.complication && (
                  <p className="text-amber-700 text-sm font-medium"><span className="text-amber-600">⚡</span> {d.complication}</p>
                )}
                <EntryNote entry={entry} />
              </div>
            );
          }
          // Fallback pro starší záznamy bez details - jen editace
          return (
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu (starý formát)">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🎬</span>
                <span className="text-sm font-bold text-amber-700">
                  {entry.dice && `[${entry.dice[0]}] `}{entry.result}
                </span>
              </div>
              {entry.narrative && (
                <div className="text-amber-900/80 text-sm whitespace-pre-line">{entry.narrative}</div>
              )}
              <EntryNote entry={entry} />
            </div>
          );
        }
        // Handle custom_dice subtype differently
        if (entry.subtype === 'custom_dice') {
          return (
            <div className="my-2 pl-4 border-l-2 border-amber-200 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              {entry.reason && <p className="text-amber-900 font-medium truncate">{entry.reason}</p>}
              <p className="text-amber-900 truncate">
                <span className="text-amber-600/70 text-sm">{entry.count}d{entry.sides}: </span>
                <span className="font-bold">[{entry.dice?.join(', ')}]</span>
                {entry.count > 1 && <span className="font-bold"> = {entry.total}</span>}
              </p>
              <EntryNote entry={entry} />
            </div>
          );
        }
        // Standard oracle (yes/no, etc.)
        return (
          <div
            className="my-2 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
            style={{ padding:'10px 12px', borderRadius:7, border:'1px solid #B0782048', background:'#FFFBF1' }}
            onClick={() => startEdit(entry)}
            title="Klikni pro úpravu"
          >
            {entry.question && <p className="italic truncate mb-1" style={{ fontSize:11, color:'#8A5A4A' }}>„{entry.question}"</p>}
            <div className="flex items-baseline gap-2.5">
              {entry.dice && <span className="font-mono" style={{ fontSize:11, color:'#C09A80' }}>[{entry.dice.join(', ')}]</span>}
              <span className="font-bold" style={{ fontSize:18, color: oracleEntryColor(entry.result) }}>
                {entry.result}
              </span>
              {entry.probability && (
                <span className="ml-auto" style={{ fontSize:10, color:'#C09A80' }}>{probLabel(entry.probability)}</span>
              )}
            </div>
            <EntryNote entry={entry} />
            {entry.edited && <span className="text-xs" style={{ color:'#C09A80' }}>✎</span>}
          </div>
        );

      case 'scene_start': {
        const checkColors: Record<string, string> = {
          normal: 'border-green-400 bg-green-50',
          altered: 'border-amber-400 bg-amber-50',
          interrupted: 'border-red-400 bg-red-50'
        };
        const checkLabels: Record<string, string> = {
          normal: 'Normalni',
          altered: 'Pozmenena',
          interrupted: 'Prerusena'
        };
        const checkBadge: Record<string, string> = {
          normal: 'bg-green-100 text-green-700',
          altered: 'bg-amber-100 text-amber-700',
          interrupted: 'bg-red-100 text-red-700'
        };
        const isCollapsed = collapsedScenes.has(entry.id);
        return (
          <div
            className={`my-2 pl-3 border-l-4 ${checkColors[entry.checkResult] || 'border-amber-300 bg-amber-50'} rounded-r py-2 pr-2 cursor-pointer hover:brightness-95 transition-all select-none`}
            onClick={() => setCollapsedScenes(prev => {
              const next = new Set(prev);
              if (next.has(entry.id)) next.delete(entry.id); else next.add(entry.id);
              return next;
            })}
            title={isCollapsed ? 'Rozvinout scénu' : 'Sbalit scénu'}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-amber-400 text-xs">{isCollapsed ? '▶' : '▼'}</span>
              <span className="text-lg">🎬</span>
              <span className="font-bold text-amber-900">Scena #{entry.sceneNumber}: {entry.sceneTitle}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${checkBadge[entry.checkResult] || ''}`}>
                [{entry.checkDie}] {checkLabels[entry.checkResult] || entry.checkResult}
              </span>
              <span className="text-xs text-amber-600">CF {entry.chaosFactor}</span>
              {isCollapsed && <span className="text-xs text-amber-600 ml-auto italic">— sbaleno</span>}
            </div>
          </div>
        );
      }

      case 'scene_end': {
        const outcomeColor = entry.outcome === 'in_control' ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50';
        const outcomeLabel = entry.outcome === 'in_control' ? '✅ Pod kontrolou' : '💀 Mimo kontrolu';
        return (
          <div className={`my-2 pl-4 border-l-4 ${outcomeColor} rounded-r py-2 pr-2`}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-900">Scena #{entry.sceneNumber} ukoncena</span>
              <span className="text-sm">{outcomeLabel}</span>
              <span className="text-xs text-amber-700">Chaos: {entry.chaosBefore} → {entry.chaosAfter}</span>
            </div>
            {entry.note
              ? <EntryNote entry={entry} />
              : (
                <button
                  className="mt-1.5 block text-[11px] italic transition-colors cursor-pointer"
                  style={{ color: '#A0875060' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#8A5A4A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#A0875060')}
                  onClick={(e) => { e.stopPropagation(); setEditingNote({ entryId: entry.id, idx: 'new' }); }}
                >
                  ✎ Zapsat shrnutí scény...
                </button>
              )
            }
          </div>
        );
      }

      case 'chaos_adjust':
        return (
          <p className="my-1 text-xs text-amber-700 font-medium">
            ⚡ Chaos: {entry.chaosBefore} → {entry.chaosAfter}
          </p>
        );

      case 'combat_action':
        return (
          <div>
            <div
              className="my-1 flex items-center justify-between gap-2"
              style={{ padding:'7px 11px', borderRadius:6, border:'1px solid #C8383850', background:'#C8383812', fontSize:12 }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="flex-shrink-0" style={{ color:'#C09A80' }}>×</span>
                <span className="truncate" style={{ color:'#2A1810' }}>
                  <strong>{entry.attacker}</strong> → <strong>{entry.target}</strong>
                  {entry.hitResult && <span className="font-normal ml-1" style={{ color:'#8A5A4A' }}>{entry.hitResult}</span>}
                </span>
              </div>
              <span className="flex-shrink-0 font-bold text-white" style={{ fontSize:10, padding:'2px 7px', borderRadius:4, background:'#C83838' }}>
                {entry.damage} dmg
              </span>
            </div>
            <EntryNote entry={entry} />
          </div>
        );

      case 'combat_end':
        return (
          <div>
            <p className="my-2 text-sm font-bold text-amber-800 border-t border-b border-amber-200 py-1">
              🏁 Boj skončil
            </p>
            <EntryNote entry={entry} />
          </div>
        );
      
      case 'discovery':
        return (
          <div className="my-2 bg-amber-100/50 rounded px-3 py-2 cursor-pointer hover:bg-amber-100 transition-colors overflow-hidden"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="font-bold text-amber-900 truncate">{entry.subtype}: {entry.data?.name}</p>
            {entry.data?.trait && <p className="text-amber-800/70 text-sm italic truncate">{entry.data.trait}</p>}
            {entry.data?.appearance && <p className="text-amber-800/70 text-sm truncate">{entry.data.appearance}</p>}
            <EntryNote entry={entry} />
          </div>
        );
      
      case 'faction_progress':
        return (
          <div>
            <p className="my-1 text-xs text-amber-700">
              <span className="font-medium text-amber-900">{entry.faction}</span>: {entry.success ? '✓ pokrok' : '– beze změny'}
              <span className="opacity-60"> (d6={entry.roll}+{entry.bonus})</span>
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'time_advance':
        return (
          <div>
            <p className="my-2 text-xs text-amber-700 font-medium tracking-wide uppercase">
              ☀️ {['Ráno', 'Odpoledne', 'Večer', 'Noc'][entry.to?.watch || 0]}
              {entry.events?.includes('new_day') && ' — Nový den'}
              {entry.events?.includes('new_week') && ' — Nový týden'}
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'season_weather':
        // Období + počasí (začátek hry)
        return (
          <div
            className="my-2 p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg cursor-pointer hover:from-amber-100 hover:to-amber-200 transition-colors border border-amber-200"
            onClick={() => setWeatherModal(entry.data)}
            title="Klikni pro detail"
          >
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <span className="text-xl">{entry.data?.seasonIcon}</span>
              <span>{entry.data?.seasonName}</span>
              <span className="text-amber-400">•</span>
              <span className="text-xl">{entry.data?.weather?.icon}</span>
              <span>{entry.data?.weather?.type}</span>
              {entry.data?.weather?.danger && <span className="text-red-600">⚠️</span>}
            </div>
          </div>
        );

      case 'weather':
        // Jen počasí (při novém dni)
        return (
          <div
            className="my-1 p-2 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors border border-amber-200"
            onClick={() => setWeatherModal({ weather: entry.data })}
            title="Klikni pro detail"
          >
            <div className="flex items-center gap-2 text-amber-800">
              <span className="text-xl">{entry.data?.icon || '☁️'}</span>
              <span className="font-medium">{entry.data?.type || entry.weather || 'neznámé'}</span>
              {entry.data?.danger && <span className="text-red-600">⚠️</span>}
            </div>
          </div>
        );

      case 'world_event':
        // Handle world_event with subtypes
        if (entry.subtype === 'weather' || entry.data?.type === 'weather') {
          return (
            <div>
              <p className="my-1 text-sm text-amber-800">
                <span className="text-amber-600">{entry.data?.icon || '☁️'}</span> Počasí: <em>{entry.data?.type || entry.data?.weather || entry.weather || 'neznámé'}</em>
              </p>
              <EntryNote entry={entry} />
            </div>
          );
        }
        // Generic world event
        return (
          <div>
            <p className="my-1 text-sm text-amber-800">
              🌍 {entry.data?.name || entry.content || JSON.stringify(entry.data)}
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'rest':
        return (
          <div>
            <p className="my-1 text-sm text-green-700">
              {entry.subtype === 'short' ? '☕ Krátký odpočinek' : '🏕️ Dlouhý odpočinek v bezpečí'}
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'usage_roll':
        return (
          <div>
            <p className="my-1 text-xs text-amber-700">
              📦 {entry.item}: {entry.consumed ? <span className="text-red-600">spotřebováno!</span> : <span className="text-green-600">OK</span>}
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'random_encounter':
        return (
          <div className="my-2 cursor-pointer hover:bg-red-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="text-red-700 font-bold">⚠️ Náhodné setkání!</p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'dungeon_turn':
        return (
          <div>
            <p className="my-1 text-xs text-amber-600 uppercase tracking-wider">
              ⛏️ Tah {entry.turn} — pochodeň: {6 - entry.torchTurns}/6
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'wandering_monster_check':
        if (!entry.encounter) return null; // Don't show "nothing happens"
        return (
          <div className="my-2 cursor-pointer hover:bg-red-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="text-red-700 font-bold">👹 Něco se blíží!</p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'torch_lit':
        return (
          <div>
            <p className="my-1 text-xs text-amber-600">🔥 Nová pochodeň</p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'loyalty_check':
        return (
          <div>
            <p className="my-1 text-sm">
              🤝 Test loajality ({entry.hireling}): {entry.success
                ? <span className="text-green-700">zůstává věrný</span>
                : <span className="text-red-700 font-bold">ZRADA!</span>}
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'character_created':
        return (
          <div>
            <p className="my-2 text-amber-800 font-medium">
              🐭 Na scénu vstupuje <strong>{entry.character}</strong>
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'state_change':
        // HP/stat changes - very subtle, or hide completely
        if (entry.subtype === 'hp') {
          const sign = entry.change > 0 ? '+' : '';
          return (
            <div>
              <span className="text-xs text-amber-600">
                {entry.change > 0 ? '💚' : '💔'} {sign}{entry.change} HP
              </span>
              <EntryNote entry={entry} />
            </div>
          );
        }
        return null; // Hide other state changes

      case 'weather_warning':
        return (
          <p className="my-1 text-sm text-red-700 bg-red-50 rounded px-2 py-1 cursor-pointer hover:bg-red-100 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            {entry.message || '⚠️ Varování počasí'}
          </p>
        );

      case 'encounter_reminder':
        return (
          <p className="my-1 text-sm text-green-700 bg-green-50 rounded px-2 py-1 cursor-pointer hover:bg-green-100 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            {entry.message || '🎲 Připomínka setkání'}
          </p>
        );

      case 'treasury':
        return (
          <div>
            <p className="my-1 text-sm text-amber-700">💰 {entry.description}</p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'saved_npc':
        // Získej aktuální stav NPC z worldNPCs (pro isDead atd.)
        const currentNPC = worldNPCs.find(n => n.id === entry.data?.id) || entry.data;
        const npcIsDead = currentNPC?.isDead;
        return (
          <div
            className={`my-2 pl-4 border-l-2 cursor-pointer hover:bg-amber-50 rounded transition-colors ${
              npcIsDead ? 'border-amber-300 bg-amber-100/30' : 'border-amber-500'
            }`}
            onClick={() => setDetailModal({ type: 'npc', data: currentNPC })}
            title="Klikni pro detail"
          >
            <p className={`font-bold truncate ${npcIsDead ? 'text-amber-400 line-through' : 'text-amber-900'}`}>
              {npcIsDead ? '💀' : '🐭'} {currentNPC?.name || entry.data?.name} {(currentNPC?.role || entry.data?.role) && <span className="font-normal text-amber-700">— {currentNPC?.role || entry.data?.role}</span>}
              {npcIsDead && <span className="ml-2 text-xs text-red-600 font-normal no-underline">† mrtvý</span>}
            </p>
            {!npcIsDead && (currentNPC?.birthsign || entry.data?.birthsign) && <p className="text-amber-800/70 text-sm truncate">{currentNPC?.birthsign || entry.data?.birthsign}</p>}
            {!npcIsDead && (currentNPC?.physicalDetail || entry.data?.physicalDetail) && <p className="text-amber-700 text-sm truncate">{currentNPC?.physicalDetail || entry.data?.physicalDetail}</p>}
            <EntryNote entry={entry} />
          </div>
        );

      case 'saved_settlement': {
        const currentSettlement = settlements.find(s => s.id === entry.data?.id) || entry.data;
        return (
          <div className="my-2 pl-4 border-l-2 border-teal-400 rounded overflow-hidden">
            <p
              className="text-sm cursor-pointer hover:text-teal-700 transition-colors truncate text-teal-900"
              onClick={() => setDetailModal({ type: 'settlement', data: currentSettlement })}
              title="Klikni pro detail"
            >
              🏘️ <span className="font-medium">{currentSettlement?.name || entry.data?.name}</span>
              <span className="text-teal-700 ml-1">— {currentSettlement?.size || entry.data?.size}</span>
            </p>
            <EntryNote entry={entry} />
          </div>
        );
      }

      case 'creature_lore': {
        const d = entry.data;
        const filledAspects = d?.lore ? Object.entries(d.lore).filter(([, v]) => v) : [];
        const creature = worldCreatures?.find(c => c.id === d?.creatureId);
        const name = creature?.name || d?.name || '???';
        return (
          <div
            className="my-2 pl-3 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded-r transition-colors"
            onClick={() => setDetailModal({ type: 'creature_lore', data: creature || { id: d?.creatureId, name, lore: d?.lore || {} } })}
            title="Klikni pro detail"
          >
            <p className="text-sm font-bold text-amber-900">📖 {name}</p>
            {filledAspects.slice(0, 3).map(([key, val]) => {
              const aspect = LORE_ASPECTS_MAP[key];
              return (
                <p key={key} className="text-xs text-amber-800/80 truncate">
                  {aspect?.icon || '·'} {val as string}
                </p>
              );
            })}
            {filledAspects.length > 3 && (
              <p className="text-xs text-amber-500">+{filledAspects.length - 3} dalších aspektů</p>
            )}
            <EntryNote entry={entry} />
          </div>
        );
      }

      default:
        // For any other type, show as mechanical note
        let content = entry.content || entry.data || entry;
        // Oprava broken char-index serializace: {"0":"D","1":"r",...}
        if (content && typeof content === 'object' && !Array.isArray(content)) {
          const numericKeys = Object.keys(content as object).filter(k => !isNaN(Number(k)));
          if (numericKeys.length > 0) {
            content = numericKeys.sort((a, b) => Number(a) - Number(b)).map(k => (content as Record<string, string>)[k]).join('');
          }
        }
        return (
          <div className="my-1">
            <p className="text-xs text-amber-700 font-mono">
              {typeof content === 'string' ? content : JSON.stringify(content)}
            </p>
            <EntryNote entry={entry} />
          </div>
        );

      case 'hook':
        return (
          <div
            className={`my-2 pl-3 pr-2 py-2 border-l-4 rounded-r transition-all ${
              entry.resolved
                ? 'border-l-amber-200 bg-amber-50/40 opacity-50'
                : 'border-l-yellow-400 bg-yellow-50'
            }`}
            onClick={() => !entry.resolved && startEdit(entry)}
            title={entry.resolved ? 'Vyřešeno' : 'Klikni pro úpravu'}
          >
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 text-base">{entry.resolved ? '✅' : '❓'}</span>
              <p className={`text-sm flex-1 font-medium leading-snug ${entry.resolved ? 'line-through text-amber-400' : 'text-amber-900'}`}>
                {renderContent(entry.content)}
              </p>
              {!entry.resolved && (
                <button
                  onClick={(e) => { e.stopPropagation(); resolveHook(entry.id); }}
                  className="flex-shrink-0 text-xs text-amber-400 hover:text-green-600 transition-colors px-1"
                  title="Označit jako vyřešeno"
                >✓</button>
              )}
            </div>
          </div>
        );
    }
  };

  // Oracle entry color helper
  const oracleEntryColor = (result: string | undefined) => {
    if (!result) return '#2A1810';
    const r = result.toLowerCase();
    if (r.startsWith('yes, and')) return '#5A8A5A';
    if (r.startsWith('yes, but') || r.startsWith('no, but')) return '#B07820';
    if (r.startsWith('no, and') || r.startsWith('no')) return '#C83838';
    if (r.startsWith('yes')) return '#5A8A5A';
    return '#2A1810';
  };
  const probLabel = (prob: string) => {
    if (prob === 'likely') return 'Pravděpodobné';
    if (prob === 'unlikely') return 'Nepravděpodobné';
    return 'Stejně možné';
  };
  const getCheckBadgeStyle = (result: string) => {
    if (result === 'normal') return { color:'#5A8A5A', borderColor:'#5A8A5A50', background:'#5A8A5A12' };
    if (result === 'altered') return { color:'#B07820', borderColor:'#B0782048', background:'#B0782012' };
    if (result === 'interrupted') return { color:'#C83838', borderColor:'#C8383850', background:'#C8383812' };
    return { color:'#8A5A4A', borderColor:'#FFD8A8', background:'#FFF5DC' };
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-3 pt-2">
        <h1 className="text-2xl font-serif text-[#2A1810] mb-1">Kronika dobrodružství</h1>
        <p className="text-[#C09A80] text-xs">
          {journal.length} záznamů
          {(() => {
            const openHooks = journal.filter(e => e.type === 'hook' && !(e as any).resolved).length;
            return openHooks > 0 ? (
              <button
                onClick={() => setFilter(filter === 'hook_open' ? 'all' : 'hook_open')}
                className="ml-2 text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
                title="Zobrazit jen otevřené otázky"
              >
                · {openHooks} ❓
              </button>
            ) : null;
          })()}
        </p>
      </div>

      {/* Widget nadcházejících událostí */}
      {timedEvents && timedEvents.filter(e => !e.completed).length > 0 && (() => {
        const currentDay = gameTime?.day || 1;
        const activeEvents = timedEvents.filter(e => !e.completed).sort((a, b) => a.targetDay - b.targetDay).slice(0, 3);
        return (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-800">📅 Nadcházející události</span>
              <button onClick={onOpenEvents} className="text-xs text-amber-600 hover:text-amber-800">Zobrazit vše →</button>
            </div>
            <div className="space-y-1">
              {activeEvents.map(event => {
                const daysLeft = event.targetDay - currentDay;
                return (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${daysLeft <= 0 ? 'bg-red-200 text-red-800' : daysLeft <= 1 ? 'bg-amber-200 text-amber-800' : 'bg-amber-100 text-amber-700'}`}>
                      {daysLeft <= 0 ? 'DNES!' : daysLeft === 1 ? 'Zítra' : `${daysLeft}d`}
                    </span>
                    <span className="text-amber-900 truncate">{event.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Filters - Collapsible */}
      <div className="mb-3 border-b border-[#FFD8A8] pb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-amber-700 hover:text-amber-900 flex items-center gap-1"
        >
          <span>{showFilters ? '▼' : '▶'}</span> Filtry a nástroje
        </button>
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-3 items-center">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hledat..."
              className="px-3 py-1 border border-amber-200 rounded text-sm w-40 bg-amber-50"
            />
            {parties?.length > 1 && (
              <select 
                value={partyFilter}
                onChange={(e) => setPartyFilter(e.target.value)}
                className="px-2 py-1 border border-amber-200 rounded text-sm bg-amber-50"
              >
                <option value="all">Všechny družiny</option>
                {(parties || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-2 py-1 border border-amber-200 rounded text-sm bg-amber-50"
            >
              <option value="all">Vše</option>
              <option value="hook_open">❓ Otevřené otázky</option>
              <option value="narrative">Příběh</option>
              <option value="oracle">Oracle</option>
              <option value="combat_action">Boj</option>
              <option value="discovery">Objevy</option>
            </select>
            <button onClick={onExport} className="px-3 py-1 text-sm text-amber-700 hover:text-amber-900">
              📤 Export
            </button>
          </div>
        )}
      </div>

      {/* Journal Content */}
      <div>
        {filteredJournal.length === 0 ? (
          <div className="font-serif">
            {journal.length === 0 ? (
              <TiptapEditor
                content=""
                onSubmit={addNarrativeEntryWithScene}
                placeholder="Začni psát příběh... (@ pro zmínku, Shift+Enter = nový řádek)"
                mentionItems={allMentions}
                submitOnEnter
                clearOnSubmit
              />
            ) : (
              <div className="text-center py-8 text-[#C09A80] italic text-sm">
                Žádné záznamy neodpovídají filtru
              </div>
            )}
          </div>
        ) : (
          <div className="font-serif">
            {/* Vstup pro nový záznam nahoře */}
            <div className="mb-3">
              <TiptapEditor
                content=""
                onSubmit={addNarrativeEntryWithScene}
                placeholder="Pokračuj v příběhu... (@ pro zmínku, Shift+Enter = nový řádek)"
                mentionItems={allMentions}
                submitOnEnter
                clearOnSubmit
              />
            </div>

            {/* Chapter Book — scény jako karty, volné záznamy inline */}
            {(() => {
              // Seskup záznamy do scén a volných záznamů
              type Seg =
                | { type: 'loose'; entry: any }
                | { type: 'scene'; sceneEntry: any; entries: any[]; endEntry: any | null };
              const segments: Seg[] = [];
              let curScene: { sceneEntry: any; entries: any[]; endEntry: any | null } | null = null;

              // Journal je newest-first — skenujeme od nejstaršího k nejnovějšímu pro správné groupování
              const oldestFirst = [...filteredJournal].reverse();
              for (const entry of oldestFirst) {
                if (entry.type === 'scene_start') {
                  curScene = { sceneEntry: entry, entries: [], endEntry: null };
                  segments.push({ type: 'scene', ...curScene });
                } else if (entry.type === 'scene_end') {
                  if (curScene) { curScene.endEntry = entry; curScene = null; }
                  else segments.push({ type: 'loose', entry });
                } else if (curScene) {
                  curScene.entries.push(entry);
                } else {
                  segments.push({ type: 'loose', entry });
                }
              }
              // Zobraz newest-first — obrátíme segmenty i záznamy uvnitř scén
              segments.reverse();
              for (const seg of segments) {
                if (seg.type === 'scene') (seg as any).entries.reverse();
              }

              const checkLabel: Record<string, string> = {
                normal: 'Normální', altered: 'Pozměněná', interrupted: 'Přerušená',
              };

              const renderEntryRow = (entry: any) => {
                const content = formatEntry(entry);
                if (!content) return null;
                const isSelected = selectedIds.has(entry.id);
                const isDragging = draggedId === entry.id;
                const isDropTarget = dropTargetId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    {draggedId && draggedId !== entry.id && (
                      <div
                        className={`h-1 rounded my-0.5 transition-all ${dropTargetId === `before-${entry.id}` ? 'bg-amber-500 h-2' : 'bg-transparent hover:bg-amber-300'}`}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDropTargetId(`before-${entry.id}`); }}
                        onDragLeave={() => setDropTargetId(null)}
                        onDrop={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          const di = journal.findIndex(j => j.id === draggedId);
                          const ti = journal.findIndex(j => j.id === entry.id);
                          if (di !== -1 && ti !== -1 && di !== ti) {
                            const nj = [...journal];
                            const [de] = nj.splice(di, 1);
                            nj.splice(di < ti ? ti - 1 : ti, 0, de);
                            setJournal(nj);
                          }
                          setDraggedId(null); setDropTargetId(null);
                        }}
                      />
                    )}
                    <div
                      data-entry-id={entry.id}
                      className={`group flex items-start gap-1 transition-all ${isSelected ? 'bg-amber-100 rounded' : ''} ${isDragging || touchDragId === entry.id ? 'opacity-50 bg-amber-50' : ''} ${isDropTarget ? 'border-b-2 border-amber-500' : ''}`}
                      draggable={!selectionMode && editingId !== entry.id}
                      onDragStart={(e) => handleDragStart(e, entry.id)}
                      onDragOver={(e) => handleDragOver(e, entry.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, entry.id)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={() => !selectionMode && !touchDragId && handleTouchStart(entry.id)}
                      onTouchEnd={handleTouchEnd}
                      onTouchMove={handleTouchEnd}
                      onContextMenu={(e) => { e.preventDefault(); setSelectionMode(true); setSelectedIds(new Set([entry.id])); }}
                    >
                      {!selectionMode && editingId !== entry.id && (
                        <div
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-grab active:cursor-grabbing text-amber-400 hover:text-amber-600 pt-2 px-1 select-none transition-opacity touch-none"
                          title="Přetáhni pro přesun"
                          onTouchStart={(e) => handleTouchDragStart(e, entry.id)}
                          onTouchMove={handleTouchDragMove}
                          onTouchEnd={handleTouchDragEnd}
                        >⋮⋮</div>
                      )}
                      {selectionMode && (
                        <button
                          onClick={() => toggleSelect(entry.id)}
                          className={`mt-2 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-amber-300 hover:border-amber-400'}`}
                        >{isSelected && '✓'}</button>
                      )}
                      <div className="flex-1 min-w-0">{content}</div>
                      {!selectionMode && editingId !== entry.id && (
                        <div className="flex flex-col items-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingNote(editingNote?.entryId === entry.id && editingNote.idx === 'new' ? null : { entryId: entry.id, idx: 'new' }); }}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-amber-400 hover:text-amber-600 pt-2 px-1 transition-opacity"
                            title="Přidat poznámku"
                          >+</button>
                          <button
                            onClick={() => setHookingEntryId(hookingEntryId === entry.id ? null : entry.id)}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-yellow-500 hover:text-yellow-700 pb-2 px-1 transition-opacity text-base font-bold"
                            title="Přidat otevřenou otázku"
                          >?</button>
                        </div>
                      )}
                    </div>
                    {editingNote?.entryId === entry.id && (
                      <div className="ml-5 mt-0.5 flex items-start gap-1" onClick={(e) => e.stopPropagation()}>
                        <div className="flex-1">
                          <TiptapEditor
                            content={editingNote.idx === 'new' ? '' : ((entry.notes ?? (entry.note ? [entry.note] : []))[editingNote.idx as number] || '')}
                            onSubmit={(html) => saveNote(entry.id, html, editingNote.idx)}
                            placeholder="(@ pro zmínku, Enter ↵)"
                            mentionItems={allMentions}
                            autoFocus compact submitOnEnter
                            onCancel={() => setEditingNote(null)}
                          />
                        </div>
                        <button type="button" onClick={() => setEditingNote(null)} className="text-amber-400 hover:text-amber-600 p-2 text-lg" title="Zrušit">×</button>
                      </div>
                    )}
                    {hookingEntryId === entry.id && (
                      <div className="ml-5 mt-1 flex items-start gap-1">
                        <div className="flex-1">
                          <TiptapEditor
                            content=""
                            onSubmit={(html) => createHook(entry.id, html)}
                            placeholder="❓ Otevřená otázka... (Enter ↵)"
                            mentionItems={allMentions}
                            autoFocus compact submitOnEnter
                            onCancel={() => setHookingEntryId(null)}
                          />
                        </div>
                        <button type="button" onClick={() => setHookingEntryId(null)} className="text-yellow-400 hover:text-yellow-600 p-2 text-lg" title="Zrušit">×</button>
                      </div>
                    )}
                  </React.Fragment>
                );
              };

              return segments.map((segment, segIdx) => {
                if (segment.type === 'loose') {
                  const entry = (segment as any).entry;
                  const tsE = typeof entry.timestamp === 'number' ? new Date(entry.timestamp).toLocaleString('cs-CZ') : entry.timestamp;
                  const parts = tsE?.split(' ') || [];
                  const entryDate = parts.length >= 3 ? `${parts[0]} ${parts[1]} ${parts[2]}` : (tsE || 'Neznámé datum');
                  const prevSeg = segments[segIdx - 1];
                  let prevDate = '';
                  if (prevSeg?.type === 'loose') {
                    const prevTs = (prevSeg as any).entry.timestamp;
                    const prevTsStr = typeof prevTs === 'number' ? new Date(prevTs).toLocaleString('cs-CZ') : prevTs;
                    const pp = prevTsStr?.split(' ') || [];
                    prevDate = pp.length >= 3 ? `${pp[0]} ${pp[1]} ${pp[2]}` : '';
                  }
                  const showDateHeader = segIdx > 0 && entryDate !== prevDate;
                  return (
                    <React.Fragment key={entry.id}>
                      {showDateHeader && (
                        <div className="group flex items-center justify-center my-3 gap-2" title={entryDate}>
                          <div className="flex-1 h-px bg-amber-200/60"></div>
                          <span className="text-[10px] text-amber-300/60 group-hover:text-amber-600 transition-colors cursor-default">{entryDate}</span>
                          <div className="flex-1 h-px bg-amber-200/60"></div>
                        </div>
                      )}
                      {renderEntryRow(entry)}
                    </React.Fragment>
                  );
                }

                // Scene box — L6 style
                const { sceneEntry, entries, endEntry } = segment as any;
                const isCollapsed = collapsedScenes.has(sceneEntry.id);
                return (
                  <div key={sceneEntry.id} className="mb-2.5 overflow-hidden" style={{ border:'1px solid #FFD8A8', borderRadius:10, background:'#FFF5DC' }}>
                    {/* Scene header */}
                    <div
                      className="flex items-center gap-2 flex-wrap cursor-pointer select-none transition-colors hover:bg-[#FFD8A8]/30"
                      style={{ padding:'10px 14px' }}
                      onClick={() => setCollapsedScenes(prev => {
                        const next = new Set(prev);
                        if (next.has(sceneEntry.id)) next.delete(sceneEntry.id); else next.add(sceneEntry.id);
                        return next;
                      })}
                    >
                      <span className="text-[10px]" style={{ color:'#C09A80' }}>{isCollapsed ? '▶' : '▼'}</span>
                      <span className="flex-shrink-0 flex items-center justify-center font-bold text-white" style={{ width:26, height:26, borderRadius:6, background:'#E36A6A', fontSize:12 }}>
                        {sceneEntry.sceneNumber}
                      </span>
                      <span className="font-bold text-sm" style={{ color:'#2A1810' }}>{sceneEntry.sceneTitle}</span>
                      <span className="font-bold uppercase tracking-wide border rounded" style={{ fontSize:10, padding:'2px 7px', borderRadius:4, letterSpacing:'0.04em', ...getCheckBadgeStyle(sceneEntry.checkResult) }}>
                        {checkLabel[sceneEntry.checkResult] || sceneEntry.checkResult} [{sceneEntry.checkDie}]
                      </span>
                      <span className="font-mono" style={{ fontSize:10, color:'#C09A80' }}>CF {sceneEntry.chaosFactor}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Smazat celou scénu „${sceneEntry.sceneTitle}" a všechny její záznamy?`)) {
                            const idsToDelete = new Set([sceneEntry.id, ...entries.map((e: any) => e.id), ...(endEntry ? [endEntry.id] : [])]);
                            setJournal(journal.filter(e => !idsToDelete.has(e.id)));
                          }
                        }}
                        className="ml-auto flex-shrink-0 flex items-center justify-center rounded transition-colors hover:bg-[#C8383820]"
                        style={{ width:20, height:20, fontSize:12, color:'#C09A80' }}
                        title="Smazat celou scénu"
                      >×</button>
                    </div>
                    {/* Scene body */}
                    {!isCollapsed && entries.length > 0 && (
                      <div className="space-y-1" style={{ padding:'8px 14px 10px' }}>
                        {entries.map((entry: any) => renderEntryRow(entry))}
                      </div>
                    )}
                    {/* Scene footer */}
                    {endEntry && !isCollapsed && (
                      <div className="flex items-center justify-center gap-2.5" style={{ padding:'8px 14px', borderTop:'1px solid #FFD8A8', fontSize:12, color:'#8A5A4A' }}>
                        <span className="font-semibold" style={{ color: endEntry.outcome === 'in_control' ? '#5A8A5A' : '#C83838' }}>
                          {endEntry.outcome === 'in_control' ? '✓ Pod kontrolou' : '✕ Mimo kontrolu'}
                        </span>
                        <span className="font-mono" style={{ color:'#C09A80' }}>CF {endEntry.chaosBefore} → {endEntry.chaosAfter}</span>
                      </div>
                    )}
                    {isCollapsed && (
                      <div className="text-center" style={{ padding:'6px 14px', borderTop:'1px solid #FFD8A8', fontSize:11, color:'#C09A80' }}>
                        {entries.length} {entries.length === 1 ? 'záznam' : entries.length < 5 ? 'záznamy' : 'záznamů'}
                      </div>
                    )}
                  </div>
                );
              });
            })()}

          </div>
        )}
      </div>

      {/* Reading tip */}
      {!selectionMode && (
        <p className="text-center text-xs text-amber-400 mt-6 font-sans">
          💡 Klikni pro úpravu • Přetáhni ⋮⋮ pro přesun • + vloží poznámku • Dlouze podrž pro výběr více
        </p>
      )}

      {/* Selection toolbar */}
      {selectionMode && (
        <div className="fixed bottom-16 left-0 right-0 bg-[#2A1810] text-white p-3 shadow-lg z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={cancelSelection}
              className="p-2 hover:bg-stone-700 rounded"
            >
              ✕
            </button>
            <span className="font-medium">{selectedIds.size} vybráno</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Select all visible
                const allIds = new Set(filteredJournal.map(e => e.id));
                setSelectedIds(allIds);
              }}
              className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded text-sm"
            >
              Vybrat vše
            </button>
            <button
              onClick={deleteSelected}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm font-medium"
            >
              🗑️ Smazat ({selectedIds.size})
            </button>
          </div>
        </div>
      )}

      {/* Detail modal pro NPC/osady */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }}>
          <div className="bg-amber-50 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {detailModal.type === 'npc' && detailModal.data && (
              <div className={`p-4 space-y-3 ${detailModal.data.isDead ? 'bg-amber-100/60' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-2xl font-bold ${detailModal.data.isDead ? 'text-amber-400 line-through' : 'text-amber-900'}`}>
                      {detailModal.data.isDead ? '💀' : '🐭'} {detailModal.data.name}
                    </h3>
                    {detailModal.data.isDead && (
                      <span className="text-sm text-red-600 font-medium">† Mrtvý</span>
                    )}
                  </div>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-amber-400 hover:text-amber-600 text-xl">✕</button>
                </div>
                {detailModal.data.role && (
                  <p className={`font-medium ${detailModal.data.isDead ? 'text-amber-400' : 'text-amber-700'}`}>🔧 {detailModal.data.role}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm font-mono bg-amber-100 rounded px-3 py-2 justify-center">
                  <span>BO: <b>{detailModal.data.hp?.max || detailModal.data.hp}</b></span>
                  <span>SÍL: <b>{detailModal.data.str?.max || detailModal.data.str}</b></span>
                  <span>MRŠ: <b>{detailModal.data.dex?.max || detailModal.data.dex}</b></span>
                  <span>VŮL: <b>{detailModal.data.wil?.max || detailModal.data.wil}</b></span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Znamení</span>
                    <p className="font-bold truncate text-amber-900">{detailModal.data.birthsign}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Vzhled</span>
                    <p className="font-bold truncate text-amber-900">{detailModal.data.physicalDetail}</p>
                  </div>
                </div>
                {detailModal.data.quirk && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Zvláštnost</span>
                    <p className="font-bold text-amber-900">{detailModal.data.quirk}</p>
                  </div>
                )}
                {detailModal.data.goal && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Cíl</span>
                    <p className="font-bold text-amber-900">{detailModal.data.goal}</p>
                  </div>
                )}
                {detailModal.data.notes && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Poznámky</span>
                    <p className="text-amber-900">{detailModal.data.notes}</p>
                  </div>
                )}

                {/* Generátory chování */}
                <div className="border-t border-amber-200 pt-3">
                  <p className="text-xs text-amber-700 mb-2">🎲 Generátory (nezapisuje se)</p>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => setGeneratedBehavior(`🎭 ${randomFrom(NPC_BEHAVIOR_MOODS)}, ${randomFrom(NPC_BEHAVIOR_ACTIONS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Chování</button>
                    <button onClick={() => setGeneratedBehavior(`😊 ${randomFrom(NPC_BEHAVIOR_MOODS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Nálada</button>
                    <button onClick={() => setGeneratedBehavior(`🏃 ${randomFrom(NPC_BEHAVIOR_ACTIONS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Akce</button>
                    <button onClick={() => setGeneratedBehavior(`💭 ${randomFrom(NPC_BEHAVIOR_MOTIVATIONS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Motivace</button>
                    <button onClick={() => setGeneratedBehavior(`🤫 ${randomFrom(NPC_SECRETS)}`)} className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded">Tajemství</button>
                    <button onClick={() => setGeneratedBehavior(`⚡ ${randomFrom(NPC_REACTIONS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Reakce</button>
                  </div>
                  {generatedBehavior && (
                    <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                      <p className="font-medium text-amber-900">{generatedBehavior}</p>
                    </div>
                  )}
                </div>

                {/* Historie událostí NPC z deníku */}
                {(() => {
                  const npcEvents = journal.filter(e => e.npcId === detailModal.data.id && e.subtype === 'npc_event');
                  if (npcEvents.length === 0) return null;
                  return (
                    <div className="border-t border-amber-200 pt-3">
                      <p className="text-xs text-amber-700 mb-2">📜 Historie událostí ({npcEvents.length})</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {npcEvents.slice(-5).reverse().map((event, i) => (
                          <div key={i} className="p-2 bg-amber-50 rounded border border-amber-200 text-sm">
                            <p className="text-amber-900">{event.content}</p>
                            <p className="text-xs text-amber-600 mt-1">{event.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onMentionClick && onMentionClick('npc', detailModal.data.id);
                      setDetailModal(null);
                      setGeneratedBehavior(null);
                    }}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium"
                  >
                    ✏️ Upravit
                  </button>
                  {onUpdateNPC && (
                    <button
                      onClick={() => {
                        const newDeadState = !detailModal.data.isDead;
                        onUpdateNPC(detailModal.data.id, { isDead: newDeadState });
                        setDetailModal({ ...detailModal, data: { ...detailModal.data, isDead: newDeadState } });
                      }}
                      className={`px-4 py-2 rounded font-medium ${
                        detailModal.data.isDead
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-amber-400 hover:bg-amber-500 text-white'
                      }`}
                      title={detailModal.data.isDead ? 'Oživit NPC' : 'Označit jako mrtvého'}
                    >
                      {detailModal.data.isDead ? '💚' : '💀'}
                    </button>
                  )}
                  {onDeleteNPC && (
                    <button
                      onClick={() => {
                        if (confirm(`Opravdu smazat ${detailModal.data.name}? Toto smaže NPC i všechny záznamy v deníku.`)) {
                          onDeleteNPC(detailModal.data.id);
                          setDetailModal(null);
                          setGeneratedBehavior(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            )}

            {detailModal.type === 'settlement' && detailModal.data && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-amber-900">🏘️ {detailModal.data.name}</h3>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-amber-400 hover:text-amber-600 text-xl">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Velikost</span>
                    <p className="font-bold text-amber-900">{detailModal.data.size}</p>
                    {detailModal.data.population && <p className="text-sm text-amber-700">{detailModal.data.population}</p>}
                  </div>
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Zřízení</span>
                    <p className="font-bold text-amber-900 text-sm">{detailModal.data.governance}</p>
                  </div>
                </div>
                {detailModal.data.trades?.length > 0 && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Živnost</span>
                    {detailModal.data.trades.map((trade, i) => (
                      <p key={i} className="font-bold text-amber-900">{trade}</p>
                    ))}
                  </div>
                )}
                {detailModal.data.event && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Co se děje při příchodu</span>
                    <p className="font-bold text-amber-900">{detailModal.data.event}</p>
                  </div>
                )}
                {detailModal.data.inn && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Hostinec</span>
                    <p className="font-bold text-amber-900">{detailModal.data.inn.name || detailModal.data.inn}</p>
                    {detailModal.data.inn.specialty && <p className="text-sm text-amber-700">Specialita: {detailModal.data.inn.specialty}</p>}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {detailModal.data.landmark && (
                    <div className="p-3 bg-amber-100 rounded">
                      <span className="text-sm text-amber-700">Landmark</span>
                      <p className="font-bold text-amber-900 text-sm">{detailModal.data.landmark}</p>
                    </div>
                  )}
                  {detailModal.data.feature && (
                    <div className="p-3 bg-amber-100 rounded">
                      <span className="text-sm text-amber-700">Zajímavost</span>
                      <p className="font-bold text-amber-900 text-sm">{detailModal.data.feature}</p>
                    </div>
                  )}
                </div>
                {detailModal.data.notes && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">Poznámky</span>
                    <p className="text-amber-900">{detailModal.data.notes}</p>
                  </div>
                )}

                {/* Generátory pro osadu */}
                <div className="border-t border-amber-200 pt-3">
                  <p className="text-xs text-amber-700 mb-2">🎲 Generátory (nezapisuje se)</p>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => setGeneratedBehavior(`⚡ ${randomFrom(SETTLEMENT_HAPPENINGS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Událost</button>
                    <button onClick={() => setGeneratedBehavior(`💬 ${randomFrom(SETTLEMENT_RUMORS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Zvěst</button>
                    <button onClick={() => setGeneratedBehavior(`🌤️ ${randomFrom(NATURE_EVENTS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Počasí</button>
                    <button onClick={() => setGeneratedBehavior(`⚠️ ${randomFrom(WILDERNESS_THREATS)}`)} className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded">Hrozba</button>
                    <button onClick={() => setGeneratedBehavior(`🔍 ${randomFrom(DISCOVERIES)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Objev</button>
                  </div>
                  {generatedBehavior && (
                    <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                      <p className="font-medium text-amber-900">{generatedBehavior}</p>
                    </div>
                  )}
                </div>

                {/* Historie událostí a zvěstí osady z deníku */}
                {(() => {
                  const settlementLogs = journal.filter(e =>
                    e.settlementId === detailModal.data.id &&
                    (e.subtype === 'settlement_event' || e.subtype === 'settlement_rumor')
                  );
                  if (settlementLogs.length === 0) return null;
                  return (
                    <div className="border-t border-amber-200 pt-3">
                      <p className="text-xs text-amber-700 mb-2">📜 Historie ({settlementLogs.length})</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {settlementLogs.slice(-5).reverse().map((event, i) => (
                          <div key={i} className="p-2 rounded border text-sm bg-amber-50 border-amber-200">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs">{event.subtype === 'settlement_rumor' ? '💬 Zvěst' : '⚡ Událost'}</span>
                            </div>
                            <p className="text-amber-900">{event.content}</p>
                            <p className="text-xs text-amber-600 mt-1">{event.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onMentionClick && onMentionClick('settlement', detailModal.data.id);
                      setDetailModal(null);
                      setGeneratedBehavior(null);
                    }}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium"
                  >
                    ✏️ Upravit
                  </button>
                  {onDeleteSettlement && (
                    <button
                      onClick={() => {
                        if (confirm(`Opravdu smazat ${detailModal.data.name}? Toto smaže osadu i všechny záznamy v deníku.`)) {
                          onDeleteSettlement(detailModal.data.id);
                          setDetailModal(null);
                          setGeneratedBehavior(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Modal pro detail tvora */}
            {detailModal.type === 'creature' && detailModal.data && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{detailModal.data.type?.icon || '🐭'}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-900">{detailModal.data.name}</h3>
                      <p className="text-sm text-amber-700">{detailModal.data.type?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-amber-400 hover:text-amber-600 text-xl">✕</button>
                </div>

                {/* Bojové statistiky */}
                {detailModal.data.hp !== undefined && (
                  <div className="space-y-1">
                    <div className="grid grid-cols-5 gap-1 text-center text-xs font-mono bg-amber-100 rounded px-2 py-2">
                      <div><div className="text-amber-500 text-[10px]">BO</div><div className="font-bold text-amber-900">{detailModal.data.hp}</div></div>
                      <div><div className="text-amber-500 text-[10px]">SÍL</div><div className="font-bold text-amber-900">{detailModal.data.str ?? '—'}</div></div>
                      <div><div className="text-amber-500 text-[10px]">MRŠ</div><div className="font-bold text-amber-900">{detailModal.data.dex ?? '—'}</div></div>
                      <div><div className="text-amber-500 text-[10px]">VŮL</div><div className="font-bold text-amber-900">{detailModal.data.wil ?? '—'}</div></div>
                      <div><div className="text-amber-500 text-[10px]">ZBR</div><div className="font-bold text-amber-900">{detailModal.data.armor ?? 0}</div></div>
                    </div>
                    <div className="text-xs text-center text-amber-700 bg-amber-50 rounded px-2 py-1 font-mono">⚔️ {detailModal.data.attack}</div>
                  </div>
                )}

                {/* Aktivita a nálada */}
                <div className="p-3 bg-amber-100 rounded">
                  <p className="text-amber-900">
                    {detailModal.data.name} {detailModal.data.doing}.
                    <span className="text-amber-800 ml-1">Je {detailModal.data.personality}.</span>
                  </p>
                  {detailModal.data.mood && (
                    <p className="text-amber-700 italic mt-1">{detailModal.data.mood.charAt(0).toUpperCase() + detailModal.data.mood.slice(1)}.</p>
                  )}
                </div>

                {/* Vzhled */}
                <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                  <span className="text-xs text-amber-700 font-medium block mb-1">👁️ VZHLED</span>
                  <p className="text-amber-900">{detailModal.data.appearance?.charAt(0).toUpperCase() + detailModal.data.appearance?.slice(1)}.</p>
                </div>

                {/* Cíl */}
                <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                  <span className="text-xs text-amber-700 font-medium block mb-1">🎯 CÍL</span>
                  <p className="text-amber-900">{detailModal.data.goal?.charAt(0).toUpperCase() + detailModal.data.goal?.slice(1)}.</p>
                </div>

                {/* Zvláštnost */}
                {detailModal.data.quirk && (
                  <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                    <span className="text-xs text-amber-700 font-medium block mb-1">✨ ZVLÁŠTNOST</span>
                    <p className="text-amber-900">{detailModal.data.quirk.charAt(0).toUpperCase() + detailModal.data.quirk.slice(1)}.</p>
                  </div>
                )}

                {/* Zvláštní vlastnost */}
                {detailModal.data.specialTrait && (
                  <div className="p-3 bg-teal-50 rounded border-l-4 border-teal-400">
                    <span className="text-xs text-teal-600 font-medium block mb-1">⚡ ZVLÁŠTNÍ VLASTNOST</span>
                    <p className="text-amber-900">{detailModal.data.specialTrait}</p>
                  </div>
                )}

                {/* Kritické zranění */}
                {detailModal.data.criticalDamage && (
                  <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                    <span className="text-xs text-red-600 font-medium block mb-1">💀 KRITICKÉ ZRANĚNÍ</span>
                    <p className="text-amber-900">{detailModal.data.criticalDamage}</p>
                  </div>
                )}

                {/* Tajemství - pouze pro GM */}
                {detailModal.data.secret && (
                  <div className="p-3 bg-stone-800 rounded border-l-4 border-stone-600">
                    <span className="text-xs text-stone-400 font-medium block mb-1">🔒 TAJEMSTVÍ (pouze GM)</span>
                    <p className="text-stone-300 italic">{detailModal.data.secret.charAt(0).toUpperCase() + detailModal.data.secret.slice(1)}.</p>
                  </div>
                )}

                {/* Kategorie */}
                <div className="pt-3 border-t border-amber-200">
                  <span className="px-2 py-1 bg-amber-100 rounded text-xs text-amber-700">
                    {detailModal.data.type?.category === 'mouse' ? '🐭 Myš' :
                     detailModal.data.type?.category === 'rat' ? '🐀 Krysa' :
                     detailModal.data.type?.category === 'insect' ? '🐛 Hmyz' :
                     detailModal.data.type?.category === 'spirit' ? '👻 Duch' :
                     detailModal.data.type?.category === 'fae' ? '🧚 Víla' :
                     detailModal.data.type?.category === 'construct' ? '⚙️ Konstrukt' :
                     detailModal.data.type?.category === 'predator' ? '🦉 Predátor' : '🐸 Tvor'}
                  </span>
                </div>

                {/* Poznámka ze záznamu */}
                {detailModal.note && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">——</span>
                    <p className="text-amber-900 italic">{detailModal.note}</p>
                  </div>
                )}

                {/* Generátory setkání pro tvory */}
                <div className="border-t border-amber-200 pt-3">
                  <p className="text-xs text-amber-700 mb-2">🎲 Generátory setkání (nezapisuje se)</p>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => setGeneratedBehavior(`🌡️ ${randomFrom(CREATURE_STATES)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Stav</button>
                    <button onClick={() => setGeneratedBehavior(`🏃 ${randomFrom(CREATURE_ACTIONS_ANIMAL)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Akce</button>
                    <button onClick={() => setGeneratedBehavior(`⚡ ${randomFrom(CREATURE_REACTIONS_ANIMAL)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Reakce</button>
                    <button onClick={() => setGeneratedBehavior(`🎯 ${randomFrom(LORE_MOTIVATION)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Motivace</button>
                    <button onClick={() => setGeneratedBehavior(`💬 ${randomFrom(LORE_RUMOR)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Zvěst</button>
                    <button onClick={() => setGeneratedBehavior(`🌑 ${randomFrom(LORE_DARKNESS)}`)} className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded">Temno</button>
                  </div>
                  {generatedBehavior && (
                    <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                      <p className="font-medium text-amber-900">{generatedBehavior}</p>
                    </div>
                  )}
                </div>

                {/* Tlačítka akcí */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      const saved = createCreature(detailModal.data.name, {});
                      updateCreature(saved.id, {
                        hp: detailModal.data.hp,
                        str: detailModal.data.str,
                        dex: detailModal.data.dex,
                        wil: detailModal.data.wil,
                        armor: detailModal.data.armor,
                        attack: detailModal.data.attack,
                        notes: detailModal.data.narrative || '',
                      });
                      setDetailModal(null);
                      setGeneratedBehavior(null);
                      setActivePanel('worldhub');
                    }}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors text-sm"
                  >
                    💾 Uložit do Bestiáře
                  </button>
                  {onPromoteToNPC && (
                    <button
                      onClick={() => {
                        const newNPC = onPromoteToNPC(detailModal.data);
                        if (newNPC) {
                          setDetailModal({ type: 'npc', data: newNPC });
                          setGeneratedBehavior(null);
                        }
                      }}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors text-sm"
                    >
                      ⭐ Povýšit na NPC
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Modal pro creature_lore — lore profil uloženého tvora */}
            {detailModal.type === 'creature_lore' && detailModal.data && (() => {
              const wc = worldCreatures?.find(c => c.id === detailModal.data.id);
              const hp = wc?.hp ?? detailModal.data.hp;
              const str = wc?.str ?? detailModal.data.str;
              const dex = wc?.dex ?? detailModal.data.dex;
              const wil = wc?.wil ?? detailModal.data.wil;
              const armor = wc?.armor ?? detailModal.data.armor;
              const attack = wc?.attack ?? detailModal.data.attack;
              return (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-amber-900">🐾 {detailModal.data.name}</h3>
                      <p className="text-sm text-amber-600">Lore profil bytosti</p>
                    </div>
                    <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-amber-400 hover:text-amber-600 text-xl">✕</button>
                  </div>

                  {/* Bojové statistiky */}
                  {hp !== undefined && (
                    <div className="space-y-1">
                      <div className="grid grid-cols-5 gap-1 text-center text-xs font-mono bg-amber-100 rounded px-2 py-2">
                        <div><div className="text-amber-500 text-[10px]">BO</div><div className="font-bold text-amber-900">{hp}</div></div>
                        <div><div className="text-amber-500 text-[10px]">SÍL</div><div className="font-bold text-amber-900">{str ?? '—'}</div></div>
                        <div><div className="text-amber-500 text-[10px]">MRŠ</div><div className="font-bold text-amber-900">{dex ?? '—'}</div></div>
                        <div><div className="text-amber-500 text-[10px]">VŮL</div><div className="font-bold text-amber-900">{wil ?? '—'}</div></div>
                        <div><div className="text-amber-500 text-[10px]">ZBR</div><div className="font-bold text-amber-900">{armor ?? 0}</div></div>
                      </div>
                      {attack && <div className="text-xs text-center text-amber-700 bg-amber-50 rounded px-2 py-1 font-mono">⚔️ {attack}</div>}
                    </div>
                  )}

                  {/* Lore aspekty */}
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                    {LORE_ASPECTS.map(aspect => {
                      const value = detailModal.data.lore?.[aspect.key];
                      if (!value) return null;
                      return (
                        <div key={aspect.key} className="p-2.5 rounded-lg border-l-4" style={{ borderColor: aspect.borderColor, background: '#FFFCF7' }}>
                          <span className="text-xs font-semibold uppercase tracking-wide block mb-0.5" style={{ color: aspect.labelColor }}>
                            {aspect.icon} {aspect.label}
                          </span>
                          <p className="text-sm text-amber-900">{value}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Generátory setkání */}
                  <div className="border-t border-amber-200 pt-3">
                    <p className="text-xs text-amber-700 mb-2">🎲 Generátory setkání (nezapisuje se)</p>
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => setGeneratedBehavior(`🌡️ ${randomFrom(CREATURE_STATES)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Stav</button>
                      <button onClick={() => setGeneratedBehavior(`🏃 ${randomFrom(CREATURE_ACTIONS_ANIMAL)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Akce</button>
                      <button onClick={() => setGeneratedBehavior(`⚡ ${randomFrom(CREATURE_REACTIONS_ANIMAL)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Reakce</button>
                      <button onClick={() => setGeneratedBehavior(`🎯 ${randomFrom(LORE_MOTIVATION)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Motivace</button>
                      <button onClick={() => setGeneratedBehavior(`💬 ${randomFrom(LORE_RUMOR)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Zvěst</button>
                      <button onClick={() => setGeneratedBehavior(`🌑 ${randomFrom(LORE_DARKNESS)}`)} className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded">Temno</button>
                    </div>
                    {generatedBehavior && (
                      <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                        <p className="font-medium text-amber-900">{generatedBehavior}</p>
                      </div>
                    )}
                  </div>

                  {/* Akční tlačítka */}
                  <div className="flex gap-2 pt-1">
                    {wc ? (
                      <button
                        onClick={() => {
                          setDetailModal(null);
                          setGeneratedBehavior(null);
                          setActivePanel('worldhub');
                        }}
                        className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-sm"
                      >
                        ✏️ Upravit v Bestiáři
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const saved = createCreature(detailModal.data.name, detailModal.data.lore || {});
                          if (hp !== undefined) updateCreature(saved.id, { hp, str, dex, wil, armor, attack });
                          setDetailModal(null);
                          setGeneratedBehavior(null);
                          setActivePanel('worldhub');
                        }}
                        className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-sm"
                      >
                        💾 Uložit do Bestiáře
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Modal pro detail scény (frame_scene) */}
            {detailModal.type === 'frame_scene' && detailModal.data && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🎬</span>
                    <div>
                      <h3 className={`text-xl font-bold ${detailModal.data.isAltered ? 'text-amber-700' : 'text-green-700'}`}>
                        [{detailModal.data.alteredDie}] {detailModal.data.isAltered ? 'Pozměněná scéna!' : 'Scéna dle očekávání'}
                      </h3>
                    </div>
                  </div>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-amber-400 hover:text-amber-600 text-xl">✕</button>
                </div>

                {/* Úvodní situace */}
                <div className="p-3 bg-amber-100 rounded border-l-4 border-amber-400">
                  <span className="text-xs text-amber-700 font-medium block mb-1">📖 ÚVOD</span>
                  <p className="text-amber-900">{detailModal.data.opening}</p>
                </div>

                {/* Místo */}
                <div className="p-3 bg-amber-100 rounded border-l-4 border-amber-400">
                  <span className="text-xs text-amber-700 font-medium block mb-1">📍 MÍSTO</span>
                  <p className="text-amber-900">{detailModal.data.setting}</p>
                </div>

                {/* Akce + Téma */}
                <div className="p-3 bg-amber-100 rounded border-l-4 border-amber-500">
                  <span className="text-xs text-amber-800 font-medium block mb-1">💡 AKCE + TÉMA</span>
                  <p className="text-amber-900 font-medium">{detailModal.data.action} + {detailModal.data.theme}</p>
                </div>

                {/* Komplikace (pokud je pozměněná) */}
                {detailModal.data.isAltered && detailModal.data.complication && (
                  <div className="p-3 bg-amber-200 rounded border-l-4 border-amber-500">
                    <span className="text-xs text-amber-800 font-medium block mb-1">⚡ KOMPLIKACE</span>
                    <p className="text-amber-900 font-medium">{detailModal.data.complication}</p>
                  </div>
                )}

                {/* Poznámka */}
                {detailModal.note && (
                  <div className="p-3 bg-amber-100 rounded">
                    <span className="text-sm text-amber-700">——</span>
                    <p className="text-amber-900 italic">{detailModal.note}</p>
                  </div>
                )}
              </div>
            )}

            {/* Modal pro detail setkání (encounter) */}
            {detailModal.type === 'encounter' && detailModal.data && (() => {
              const e = detailModal.data;
              const danger = e.danger || e.creature?.danger;
              return (
                <div className="p-4 space-y-3">
                  {/* Header - editable creature name */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-2">
                      <input
                        value={detailModal.editName ?? (e.creature?.name || e.creature || '')}
                        onChange={(ev) => setDetailModal(prev => ({ ...prev, editName: ev.target.value }))}
                        className="text-2xl font-bold text-amber-900 bg-transparent border-b-2 border-amber-300 focus:border-amber-500 outline-none w-full"
                        placeholder="Jméno tvora"
                      />
                      {danger && <p className="text-sm text-red-600 font-medium mt-1">⚠️ Nebezpečné setkání</p>}
                    </div>
                    <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-amber-400 hover:text-amber-600 text-xl flex-shrink-0">✕</button>
                  </div>

                  {/* Aktivita */}
                  <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                    <span className="text-xs text-red-700 font-medium block mb-1">🎬 AKTIVITA</span>
                    <p className="text-amber-900">{e.activity}</p>
                  </div>

                  {/* Detail */}
                  {e.detail && (
                    <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                      <span className="text-xs text-amber-700 font-medium block mb-1">👁️ DETAIL</span>
                      <p className="text-amber-900">{e.detail}</p>
                    </div>
                  )}

                  {/* Atmosféra/Nálada */}
                  {e.mood && (
                    <div className="p-3 bg-stone-50 rounded border-l-4 border-stone-300">
                      <span className="text-xs text-stone-500 font-medium block mb-1">🌫️ ATMOSFÉRA</span>
                      <p className="text-stone-700 italic">{e.mood}</p>
                    </div>
                  )}

                  {/* Místo */}
                  {e.location && (
                    <div className="p-3 bg-green-50 rounded border-l-4 border-green-300">
                      <span className="text-xs text-green-700 font-medium block mb-1">📍 MÍSTO</span>
                      <p className="text-green-900">{e.location}</p>
                    </div>
                  )}

                  {/* Motivace */}
                  {e.motivation && (
                    <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-300">
                      <span className="text-xs text-blue-700 font-medium block mb-1">💭 MOTIVACE</span>
                      <p className="text-blue-900">{e.motivation}</p>
                    </div>
                  )}

                  {/* Komplikace */}
                  {e.complication && (
                    <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-400">
                      <span className="text-xs text-orange-700 font-medium block mb-1">⚠️ KOMPLIKACE</span>
                      <p className="text-orange-900 font-medium">{e.complication}</p>
                    </div>
                  )}

                  {/* Poznámka */}
                  {detailModal.note && (
                    <div className="p-3 bg-amber-100 rounded">
                      <span className="text-sm text-amber-700">——</span>
                      <p className="text-amber-900 italic">{detailModal.note}</p>
                    </div>
                  )}

                  {/* Generátory */}
                  <div className="border-t border-amber-200 pt-3 space-y-3">
                    <p className="text-sm font-medium text-stone-600">🎲 Generátory:</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setGeneratedBehavior(`🎬 ${randomFrom(ENCOUNTER_ACTIVITIES)}`)} className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-colors font-medium">
                        🎲 Aktivita
                      </button>
                      <button onClick={() => setGeneratedBehavior(`👁️ ${randomFrom(ENCOUNTER_DETAILS)}`)} className="px-3 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow transition-colors font-medium">
                        👁️ Detail
                      </button>
                      <button onClick={() => setGeneratedBehavior(`💭 ${randomFrom(ENCOUNTER_MOTIVATIONS)}`)} className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors font-medium">
                        💭 Motivace
                      </button>
                      <button onClick={() => setGeneratedBehavior(`⚡ ${randomFrom(NPC_REACTIONS)}`)} className="px-3 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow transition-colors font-medium">
                        ⚡ Reakce
                      </button>
                      <button onClick={() => setGeneratedBehavior(`🌫️ ${randomFrom(ENCOUNTER_MOODS)}`)} className="px-3 py-2 text-sm bg-stone-500 hover:bg-stone-600 text-white rounded-lg shadow transition-colors font-medium">
                        🌫️ Nálada
                      </button>
                    </div>
                    {generatedBehavior && (
                      <div className="p-4 bg-gradient-to-r from-red-100 to-amber-100 rounded-lg border-2 border-red-300 shadow-inner">
                        <p className="text-base font-bold text-red-900">{generatedBehavior}</p>
                      </div>
                    )}
                  </div>

                  {/* Akce */}
                  <div className="flex gap-2">
                    {detailModal.entryId && (
                      <button
                        onClick={() => {
                          const editedName = detailModal.editName ?? (e.creature?.name || e.creature || '');
                          setJournal(journal.map(j => j.id === detailModal.entryId ? {
                            ...j,
                            data: j.data ? {
                              ...j.data,
                              creature: typeof j.data.creature === 'object'
                                ? { ...(j.data.creature as any), name: editedName }
                                : editedName
                            } : j.data
                          } : j));
                          setDetailModal(null);
                          setGeneratedBehavior(null);
                        }}
                        className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors"
                      >
                        💾 Uložit
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const editedName = detailModal.editName ?? (e.creature?.name || e.creature || 'Nový tvor');
                        createCreature(editedName, {});
                        setActivePanel('worldhub');
                        setDetailModal(null);
                        setGeneratedBehavior(null);
                      }}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                    >
                      📌 Uložit jako Tvor
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* Modal pro detail počasí */}
      {weatherModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setWeatherModal(null)}>
          <div className={`rounded-xl shadow-xl max-w-sm w-full p-6 ${
            weatherModal.weather?.danger
              ? 'bg-gradient-to-b from-red-100 to-red-200'
              : 'bg-gradient-to-b from-amber-50 to-amber-100'
          }`} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setWeatherModal(null)}
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 text-xl"
            >
              ✕
            </button>

            {/* Období (pokud je) */}
            {weatherModal.seasonName && (
              <div className="text-center mb-4 pb-4 border-b border-amber-300">
                <div className="text-5xl mb-2">{weatherModal.seasonIcon}</div>
                <div className="text-2xl font-bold text-amber-900">{weatherModal.seasonName}</div>
                <div className="text-sm text-amber-700">🎲 k4 = {weatherModal.seasonRoll}</div>
              </div>
            )}

            {/* Počasí */}
            {weatherModal.weather && (
              <div className="text-center">
                <div className="text-5xl mb-2">{weatherModal.weather.icon}</div>
                <div className="text-2xl font-bold text-amber-900">{weatherModal.weather.type}</div>
                <div className="text-sm text-amber-700 mb-3">
                  🎲 2k6 = {weatherModal.weather.dice?.[0]} + {weatherModal.weather.dice?.[1]} = {weatherModal.weather.roll}
                </div>

                {weatherModal.weather.danger && weatherModal.weather.effect && (
                  <div className="bg-red-200 rounded-lg p-3 text-red-800 text-sm">
                    ⚠️ <strong>Nepříznivé podmínky:</strong><br/>
                    {weatherModal.weather.effect}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setWeatherModal(null)}
              className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
            >
              Zavřít
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export { JournalPanel };

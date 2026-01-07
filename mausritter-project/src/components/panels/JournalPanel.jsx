const JournalPanel = ({ journal, setJournal, parties, partyFilter, setPartyFilter, onExport }) => {
  const [newEntry, setNewEntry] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Multi-select mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const longPressTimer = useRef(null);

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

  const addNarrativeEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry = {
      id: generateId(),
      type: 'narrative',
      timestamp: formatTimestamp(),
      content: newEntry,
      partyId: partyFilter !== 'all' ? partyFilter : null
    };
    
    setJournal([entry, ...journal]);
    setNewEntry('');
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

  const saveEdit = (id) => {
    setJournal(journal.map(e => {
      if (e.id !== id) return e;
      
      if (e.type === 'narrative') {
        // For narrative, replace content
        return { ...e, content: editText, edited: true };
      } else {
        // For other types, add/edit note
        return { ...e, note: editText, edited: true };
      }
    }));
    setEditingId(null);
    setEditText('');
  };

  const filteredJournal = journal.filter(entry => {
    if (partyFilter !== 'all' && entry.partyId && entry.partyId !== partyFilter) return false;
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
    const parts = entry.timestamp?.split(' ') || [];
    const date = parts.length >= 3 ? `${parts[0]} ${parts[1]} ${parts[2]}` : (entry.timestamp || 'Neznámé datum');
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(entry);
  });

  // Format entry based on type - book style
  const formatEntry = (entry) => {
    if (editingId === entry.id) {
      return (
        <div className="my-2 bg-white rounded-lg border border-amber-300 p-3">
          <p className="text-xs text-stone-500 mb-2">
            {entry.type === 'narrative' ? '📝 Upravit text:' : '📝 Přidat/upravit poznámku:'}
          </p>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-24 p-3 border border-stone-200 rounded-lg bg-amber-50/50 focus:outline-none focus:border-amber-400 font-serif text-stone-800"
            placeholder={entry.type === 'narrative' ? 'Tvůj příběh...' : 'Přidej poznámku k tomuto záznamu...'}
            autoFocus
          />
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <button onClick={() => saveEdit(entry.id)} className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">
                ✓ Uložit
              </button>
              <button onClick={() => { setEditingId(null); setConfirmDeleteId(null); }} className="px-3 py-1 text-stone-500 hover:text-stone-700 text-sm">
                Zrušit
              </button>
            </div>
            {confirmDeleteId === entry.id ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => deleteEntry(entry.id)} 
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Ano, smazat
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(null)} 
                  className="px-3 py-1 text-stone-500 hover:text-stone-700 text-sm"
                >
                  Ne
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmDeleteId(entry.id)} 
                className="px-3 py-1 text-red-400 hover:text-red-600 text-sm"
              >
                Smazat
              </button>
            )}
          </div>
        </div>
      );
    }

    switch (entry.type) {
      case 'narrative':
        return (
          <p className="text-stone-800 italic leading-relaxed my-3 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors" 
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            {entry.content}
            {entry.edited && <span className="text-xs text-stone-400 ml-1">✎</span>}
          </p>
        );
      
      case 'oracle':
        // Handle creature subtype - kratší zobrazení (+ fallback pro staré záznamy bez subtype)
        if ((entry.subtype === 'creature' || (entry.data?.type?.name && entry.data?.personality)) && entry.data) {
          const c = entry.data;
          return (
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-bold text-amber-900">
                {c.type?.icon || '🐭'} {c.name} <span className="font-normal text-stone-500">— {c.type?.name}</span>
              </p>
              <p className="text-stone-600 text-sm">{c.personality}</p>
              {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1">{entry.note}</p>}
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
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-bold text-amber-900">
                🐭 {name} {typePart && <span className="font-normal text-stone-500">— {typePart}</span>}
              </p>
              {personality && <p className="text-stone-600 text-sm">{personality}</p>}
              {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1">{entry.note}</p>}
            </div>
          );
        }
        // Handle encounter subtype - kratší zobrazení (+ fallback pro staré záznamy)
        if ((entry.subtype === 'encounter' || (entry.data?.creature && entry.data?.activity)) && entry.data) {
          const e = entry.data;
          return (
            <div className="my-2 pl-4 border-l-2 border-red-400 cursor-pointer hover:bg-red-50 rounded transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-bold text-stone-800">
                {e.danger ? '⚠️' : '👁️'} {e.creature?.name}
              </p>
              <p className="text-stone-600 text-sm">{e.activity}</p>
              {entry.note && <p className="text-stone-700 italic text-sm mt-1">{entry.note}</p>}
            </div>
          );
        }
        // Handle narrative subtype - abstraktní slova
        if (entry.subtype === 'narrative') {
          return (
            <div className="my-2 pl-4 border-l-2 border-purple-400 cursor-pointer hover:bg-purple-50 rounded transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-medium text-purple-900">{entry.result}</p>
              {entry.note && <p className="text-stone-700 italic text-sm mt-1">{entry.note}</p>}
            </div>
          );
        }
        // Handle custom_dice subtype differently
        if (entry.subtype === 'custom_dice') {
          return (
            <div className="my-2 pl-4 border-l-2 border-stone-300 cursor-pointer hover:bg-amber-50 rounded transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              {entry.reason && <p className="text-stone-700 font-medium">{entry.reason}</p>}
              <p className="text-amber-900">
                <span className="text-stone-500 text-sm">{entry.count}d{entry.sides}: </span>
                <span className="font-bold">[{entry.dice?.join(', ')}]</span>
                {entry.count > 1 && <span className="font-bold"> = {entry.total}</span>}
              </p>
              {entry.note && <p className="text-stone-600 italic text-sm mt-1">{entry.note}</p>}
            </div>
          );
        }
        // Standard oracle (yes/no, etc.)
        return (
          <div className="my-2 pl-4 border-l-2 border-amber-400 cursor-pointer hover:bg-amber-50 rounded transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            {entry.question && <p className="text-stone-600 text-sm">„{entry.question}"</p>}
            <p className="font-bold text-amber-900">
              {entry.dice && <span className="font-normal text-stone-500 text-xs">[{entry.dice.join(', ')}] </span>}
              {entry.result}
            </p>
            {entry.note && <p className="text-stone-700 italic text-sm mt-1">{entry.note}</p>}
            {entry.edited && <span className="text-xs text-stone-400">✎</span>}
          </div>
        );
      
      case 'combat_action':
        return (
          <p className="my-1 text-sm text-stone-700 font-medium cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            ⚔️ <strong>{entry.attacker}</strong> → <strong>{entry.target}</strong>: {entry.hitResult}, {entry.damage} dmg
            {entry.note && <span className="font-normal italic text-stone-600 ml-2">{entry.note}</span>}
          </p>
        );

      case 'combat_end':
        return (
          <p className="my-2 text-sm font-bold text-amber-800 border-t border-b border-amber-200 py-1 cursor-pointer hover:bg-amber-50 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🏁 Boj skončil
            {entry.note && <span className="font-normal italic ml-2">{entry.note}</span>}
          </p>
        );
      
      case 'discovery':
        return (
          <div className="my-2 bg-amber-100/50 rounded px-3 py-2 cursor-pointer hover:bg-amber-100 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="font-bold text-amber-900">{entry.subtype}: {entry.data?.name}</p>
            {entry.data?.trait && <p className="text-stone-600 text-sm italic">{entry.data.trait}</p>}
            {entry.data?.appearance && <p className="text-stone-600 text-sm">{entry.data.appearance}</p>}
            {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1">{entry.note}</p>}
          </div>
        );
      
      case 'faction_progress':
        return (
          <p className="my-1 text-xs text-stone-500 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            <span className="font-medium text-stone-700">{entry.faction}</span>: {entry.success ? '✓ pokrok' : '– beze změny'} 
            <span className="opacity-60"> (d6={entry.roll}+{entry.bonus})</span>
            {entry.note && <span className="italic text-stone-600 ml-2">{entry.note}</span>}
          </p>
        );

      case 'time_advance':
        return (
          <p className="my-2 text-xs text-amber-700 font-medium tracking-wide uppercase cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            ☀️ {['Ráno', 'Odpoledne', 'Večer', 'Noc'][entry.to?.watch || 0]}
            {entry.events?.includes('new_day') && ' — Nový den'}
            {entry.events?.includes('new_week') && ' — Nový týden'}
            {entry.note && <span className="normal-case font-normal text-stone-600 ml-2">• {entry.note}</span>}
          </p>
        );

      case 'weather':
        return (
          <p className="my-1 text-sm text-stone-600 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            <span className="text-blue-600">☁️</span> Počasí: <em>{entry.weather}</em>
            {entry.note && <span className="italic ml-2">— {entry.note}</span>}
          </p>
        );

      case 'world_event':
        // Handle world_event with subtypes
        if (entry.subtype === 'weather' || entry.data?.type === 'weather') {
          return (
            <p className="my-1 text-sm text-stone-600 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
              <span className="text-blue-600">☁️</span> Počasí: <em>{entry.data?.weather || entry.weather}</em>
              {entry.note && <span className="italic ml-2">— {entry.note}</span>}
            </p>
          );
        }
        // Generic world event
        return (
          <p className="my-1 text-sm text-stone-600 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🌍 {entry.data?.name || entry.content || JSON.stringify(entry.data)}
            {entry.note && <span className="italic ml-2">— {entry.note}</span>}
          </p>
        );

      case 'rest':
        return (
          <p className="my-1 text-sm text-green-700 cursor-pointer hover:bg-green-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            {entry.subtype === 'short' ? '☕ Krátký odpočinek' : '🏕️ Dlouhý odpočinek v bezpečí'}
            {entry.note && <span className="italic text-stone-600 ml-2">— {entry.note}</span>}
          </p>
        );

      case 'usage_roll':
        return (
          <p className="my-1 text-xs text-stone-500 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            📦 {entry.item}: {entry.consumed ? <span className="text-orange-600">spotřebováno!</span> : <span className="text-green-600">OK</span>}
            {entry.note && <span className="italic text-stone-600 ml-2">— {entry.note}</span>}
          </p>
        );

      case 'random_encounter':
        return (
          <div className="my-2 cursor-pointer hover:bg-red-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="text-red-700 font-bold">⚠️ Náhodné setkání!</p>
            {entry.note && <p className="italic text-stone-700 text-sm">{entry.note}</p>}
          </div>
        );

      case 'dungeon_turn':
        return (
          <p className="my-1 text-xs text-stone-500 uppercase tracking-wider cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            ⛏️ Tah {entry.turn} — pochodeň: {6 - entry.torchTurns}/6
            {entry.note && <span className="normal-case ml-2">• {entry.note}</span>}
          </p>
        );

      case 'wandering_monster_check':
        if (!entry.encounter) return null; // Don't show "nothing happens"
        return (
          <div className="my-2 cursor-pointer hover:bg-red-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="text-red-700 font-bold">👹 Něco se blíží!</p>
            {entry.note && <p className="italic text-stone-700 text-sm">{entry.note}</p>}
          </div>
        );

      case 'torch_lit':
        return (
          <p className="my-1 text-xs text-orange-600 cursor-pointer hover:bg-orange-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🔥 Nová pochodeň
            {entry.note && <span className="text-stone-600 ml-2">— {entry.note}</span>}
          </p>
        );

      case 'loyalty_check':
        return (
          <p className="my-1 text-sm cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🤝 Test loajality ({entry.hireling}): {entry.success 
              ? <span className="text-green-700">zůstává věrný</span> 
              : <span className="text-red-700 font-bold">ZRADA!</span>}
            {entry.note && <span className="italic text-stone-600 ml-2">— {entry.note}</span>}
          </p>
        );

      case 'character_created':
        return (
          <p className="my-2 text-amber-800 font-medium cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🐭 Na scénu vstupuje <strong>{entry.character}</strong>
            {entry.note && <span className="font-normal italic text-stone-600 ml-2">— {entry.note}</span>}
          </p>
        );

      case 'state_change':
        // HP/stat changes - very subtle, or hide completely
        if (entry.subtype === 'hp') {
          const sign = entry.change > 0 ? '+' : '';
          return (
            <span className="text-xs text-stone-400 cursor-pointer hover:bg-amber-50 rounded px-1 transition-colors"
                  onClick={() => startEdit(entry)}
                  title="Klikni pro úpravu">
              {entry.change > 0 ? '💚' : '💔'} {sign}{entry.change} HP
              {entry.note && <span className="italic ml-1">({entry.note})</span>}
            </span>
          );
        }
        return null; // Hide other state changes

      case 'weather':
        return (
          <p className="my-1 text-sm text-blue-700 cursor-pointer hover:bg-blue-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            {entry.message || `☁️ Počasí: ${entry.data?.type || 'neznámé'}`}
          </p>
        );

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
          <p className="my-1 text-sm text-amber-700 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            💰 {entry.description}
            {entry.note && <span className="italic ml-1">({entry.note})</span>}
          </p>
        );

      default:
        // For any other type, show as mechanical note
        const content = entry.content || entry.data || entry;
        return (
          <div className="my-1 cursor-pointer hover:bg-stone-100 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="text-xs text-stone-500 font-mono">
              {typeof content === 'string' ? content : JSON.stringify(content)}
            </p>
            {entry.note && <p className="text-sm text-stone-700 italic mt-1">{entry.note}</p>}
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 pt-4">
        <h1 className="text-3xl font-serif text-amber-900 mb-2">Kronika dobrodružství</h1>
        <p className="text-stone-500 text-sm">{journal.length} záznamů</p>
      </div>

      {/* New Entry - Expandable */}
      <div className="mb-8">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Pokračuj v příběhu... (piš kurzívou pro vyprávění)"
          className="w-full h-24 px-4 py-3 bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-800 font-serif italic resize-none shadow-sm"
        />
        {newEntry.trim() && (
          <div className="flex justify-end mt-2">
            <button 
              onClick={addNarrativeEntry}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm"
            >
              Přidat zápis
            </button>
          </div>
        )}
      </div>

      {/* Filters - Collapsible */}
      <div className="mb-6 border-b border-amber-200 pb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
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
              className="px-3 py-1 border border-stone-200 rounded text-sm w-40"
            />
            {parties?.length > 1 && (
              <select 
                value={partyFilter}
                onChange={(e) => setPartyFilter(e.target.value)}
                className="px-2 py-1 border border-stone-200 rounded text-sm"
              >
                <option value="all">Všechny družiny</option>
                {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-2 py-1 border border-stone-200 rounded text-sm"
            >
              <option value="all">Vše</option>
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

      {/* Journal Content - Book Style */}
      <div className="bg-gradient-to-b from-amber-50/50 to-white rounded-lg shadow-sm border border-amber-100">
        {filteredJournal.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-serif italic">
            {journal.length === 0 
              ? 'Příběh ještě nezačal...'
              : 'Žádné záznamy neodpovídají filtru'}
          </div>
        ) : (
          <div className="px-6 py-8 font-serif">
            {Object.entries(groupedByDate).map(([date, entries], dateIndex) => (
              <div key={date} className={dateIndex > 0 ? 'mt-8 pt-6 border-t border-amber-100' : ''}>
                {/* Date header - subtle */}
                <p className="text-xs text-stone-400 mb-4 font-sans tracking-wider uppercase">{date}</p>
                
                {/* Entries for this date */}
                {entries.map((entry, i) => {
                  const content = formatEntry(entry);
                  if (!content) return null; // Skip entries that return null
                  const isSelected = selectedIds.has(entry.id);

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-2 ${isSelected ? 'bg-amber-100 rounded -mx-2 px-2' : ''}`}
                      onTouchStart={() => !selectionMode && handleTouchStart(entry.id)}
                      onTouchEnd={handleTouchEnd}
                      onTouchMove={handleTouchEnd}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectionMode(true);
                        setSelectedIds(new Set([entry.id]));
                      }}
                    >
                      {selectionMode && (
                        <button
                          onClick={() => toggleSelect(entry.id)}
                          className={`mt-2 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'border-stone-300 hover:border-amber-400'
                          }`}
                        >
                          {isSelected && '✓'}
                        </button>
                      )}
                      <div className="flex-1">
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reading tip */}
      {!selectionMode && (
        <p className="text-center text-xs text-stone-400 mt-6 font-sans">
          💡 Klikni pro úpravu • Dlouze podrž pro výběr více
        </p>
      )}

      {/* Selection toolbar */}
      {selectionMode && (
        <div className="fixed bottom-16 left-0 right-0 bg-stone-800 text-white p-3 shadow-lg z-50 flex items-center justify-between">
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
    </div>
  );
};

// ============================================
// TIME BAR - Sledování času
// ============================================


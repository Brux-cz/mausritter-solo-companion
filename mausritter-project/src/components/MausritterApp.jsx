              <span className="text-lg">{gen.icon}</span>
              <span className="font-medium">{gen.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Panel pro vybraný generátor */}
      {isOpen && activeGenerator && (
        <div className="bg-white rounded-xl shadow-2xl border border-amber-200 p-3 w-72 mr-2">
          {/* Kostky */}
          {activeGenerator === 'dice' && (
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => quickRoll(1, 6)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">1d6</button>
              <button onClick={() => quickRoll(2, 6)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">2d6</button>
              <button onClick={() => quickRoll(1, 20)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">d20</button>
              <button onClick={() => quickRoll(1, 100)} className="px-2 py-2 bg-amber-100 hover:bg-amber-200 rounded text-sm font-medium">d100</button>
            </div>
          )}

          {/* Ano/Ne Oracle */}
          {activeGenerator === 'yesno' && (
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => quickYesNo('unlikely')} className="px-2 py-2 bg-red-100 hover:bg-red-200 rounded text-xs font-medium">Sotva</button>
              <button onClick={() => quickYesNo('even')} className="px-2 py-2 bg-yellow-100 hover:bg-yellow-200 rounded text-xs font-medium">50/50</button>
              <button onClick={() => quickYesNo('likely')} className="px-2 py-2 bg-green-100 hover:bg-green-200 rounded text-xs font-medium">Asi ano</button>
            </div>
          )}

          {/* Akce + Téma */}
          {activeGenerator === 'action' && (
            <button onClick={rollActionTheme} className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded font-medium text-purple-900">
              🎯 Generovat Akci + Téma
            </button>
          )}

          {/* Komplikace */}
          {activeGenerator === 'complication' && (
            <button onClick={rollComplication} className="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 rounded font-medium text-orange-900">
              ⚡ Co se komplikuje?
            </button>
          )}

          {/* Důsledek */}
          {activeGenerator === 'consequence' && (
            <button onClick={rollConsequence} className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 rounded font-medium text-red-900">
              💀 Jaký důsledek?
            </button>
          )}

          {/* Karta */}
          {activeGenerator === 'card' && (
            <button onClick={drawCard} className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 rounded font-medium text-green-900">
              🃏 Táhnout kartu
            </button>
          )}

          {/* Výsledek */}
          {lastRoll && (
            <div className="mt-3 bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
              {lastRoll.type === 'dice' && (
                <>
                  <div className="text-3xl font-bold text-amber-900">{lastRoll.total}</div>
                  <div className="text-xs text-stone-500">{lastRoll.count}d{lastRoll.sides}: [{lastRoll.dice.join(', ')}]</div>
                </>
              )}
              {lastRoll.type === 'yesno' && (
                <>
                  <div className="text-2xl font-bold text-amber-900">{lastRoll.result}</div>
                  <div className="text-xs text-stone-500">[{lastRoll.dice.join(', ')}] = {lastRoll.total}</div>
                </>
              )}
              {lastRoll.type === 'action' && (
                <>
                  <div className="text-lg font-bold text-purple-900">{lastRoll.action}</div>
                  <div className="text-lg font-bold text-purple-700">+ {lastRoll.theme}</div>
                </>
              )}
              {lastRoll.type === 'complication' && (
                <div className="text-sm font-medium text-orange-900">{lastRoll.result}</div>
              )}
              {lastRoll.type === 'consequence' && (
                <div className="text-sm font-medium text-red-900">{lastRoll.result}</div>
              )}
              {lastRoll.type === 'card' && (
                <>
                  <div className="text-4xl mb-1">{lastRoll.value}{lastRoll.suit.symbol}</div>
                  <div className="text-xs text-stone-600">{lastRoll.suit.domain}</div>
                  <div className="text-xs text-stone-500 mt-1">{lastRoll.meaning}</div>
                </>
              )}

              {/* Tlačítko pro zápis do deníku */}
              {onLogEntry && (
                <button
                  onClick={logRollToJournal}
                  className="mt-3 w-full px-3 py-1.5 bg-stone-700 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center justify-center gap-1"
                >
                  📝 Zapsat do deníku
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

function MausritterSoloCompanion() {
  const [activePanel, setActivePanel] = useState('journal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cloud sync state (File System API)
  const [fileHandle, setFileHandle] = useState(null);
  const [syncStatus, setSyncStatus] = useState('disconnected'); // 'disconnected' | 'connected' | 'saving' | 'error'
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Google Drive sync state
  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const [googleDriveFileId, setGoogleDriveFileId] = useState(null);
  const [googleDriveFileName, setGoogleDriveFileName] = useState(null); // Name of current save file
  const [googleSyncStatus, setGoogleSyncStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'saving' | 'error'
  const [googleLastSync, setGoogleLastSync] = useState(null);
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState(null);
  const [googleDriveFolderName, setGoogleDriveFolderName] = useState(null);
  const [syncConflict, setSyncConflict] = useState(null); // { localDate, cloudDate, cloudFileId, cloudModifiedTime, token, folderId }
  const [showFolderChoice, setShowFolderChoice] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false); // Dialog for save options
  const [showLoadDialog, setShowLoadDialog] = useState(false); // Dialog for loading files
  const [driveFiles, setDriveFiles] = useState([]); // List of files in current folder
  const [driveFolders, setDriveFolders] = useState([]); // List of folders for navigation
  const [driveLoading, setDriveLoading] = useState(false); // Loading state for Drive operations
  const [saveFileName, setSaveFileName] = useState(''); // Editable file name for save dialog
  const [showFolderPicker, setShowFolderPicker] = useState(false); // Folder picker within dialogs
  const [showNewGameDialog, setShowNewGameDialog] = useState(false); // Confirm new game dialog
  const [pendingToken, setPendingToken] = useState(null); // Token for pending folder choice
  const googleTokenClientRef = useRef(null);

  // NEW: Parties system - replaces single character
  const [parties, setParties] = useState([]);
  const [activePartyId, setActivePartyId] = useState(null);
  const [activeCharacterId, setActiveCharacterId] = useState(null);
  
  const [journal, setJournal] = useState([]);
  const [factions, setFactions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [worldNPCs, setWorldNPCs] = useState([]);
  const [journalPartyFilter, setJournalPartyFilter] = useState('all');

  // Helper: Get active party
  const activeParty = parties.find(p => p.id === activePartyId) || null;
  
  // Helper: Get active character (for detail view)
  const activeCharacter = activeParty?.members?.find(m => m.id === activeCharacterId) || null;

  // Helper: Update party
  const updateParty = (partyId, updates) => {
    setParties(prevParties => prevParties.map(p => p.id === partyId ? { ...p, ...updates } : p));
  };

  // Helper: Update character within party
  const updateCharacterInParty = (partyId, charId, updates) => {
    setParties(parties.map(p => {
      if (p.id !== partyId) return p;
      return {
        ...p,
        members: p.members.map(m => m.id === charId ? { ...m, ...updates } : m)
      };
    }));
  };

  // Helper: Update gameTime for active party
  const updateGameTime = (newGameTime) => {
    if (!activePartyId) return;
    setParties(parties.map(p =>
      p.id === activePartyId ? { ...p, gameTime: newGameTime } : p
    ));
  };

  // Helper: Create new party
  const createParty = (name = 'Nová družina') => {
    const newParty = {
      id: generateId(),
      name,
      members: [],
      gameTime: {
        day: 1,
        season: 'spring',
        watch: 1,
        turn: 0,
        restedToday: false
      },
      createdAt: new Date().toISOString()
    };
    setParties([...parties, newParty]);
    setActivePartyId(newParty.id);
    return newParty;
  };

  // Helper: Create new PC
  const createPC = (partyId, characterData = null) => {
    const newChar = characterData || {
      id: generateId(),
      type: 'pc',
      name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
      pronouns: '',
      level: 1,
      STR: { current: 10, max: 10 },
      DEX: { current: 10, max: 10 },
      WIL: { current: 10, max: 10 },
      hp: { current: 6, max: 6 },
      pips: 0,
      xp: 0,
      birthsign: randomFrom(BIRTHSIGNS),
      physicalDetail: randomFrom(PHYSICAL_DETAILS),
      conditions: [],
      inventory: [],
      spells: []
    };
    if (!newChar.id) newChar.id = generateId();
    if (!newChar.type) newChar.type = 'pc';
    
    setParties(parties.map(p => {
      if (p.id !== partyId) return p;
      return { ...p, members: [...p.members, newChar] };
    }));
    return newChar;
  };

  // Helper: Create new Hireling
  const createHireling = (partyId, hirelingTypeKey = null) => {
    const hirelingType = hirelingTypeKey
      ? HIRELING_TYPES.find(t => t.type === hirelingTypeKey)
      : null;

    // Roll stats: 2k6 for STR/DEX/WIL, k6 for HP
    const roll2k6 = () => rollD6() + rollD6();
    const str = roll2k6();
    const dex = roll2k6();
    const wil = roll2k6();
    const hp = rollD6();

    const newHireling = {
      id: generateId(),
      type: 'hireling',
      hirelingType: hirelingType?.type || 'generic',
      name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
      // Stats podle pravidel
      STR: { current: str, max: str },
      DEX: { current: dex, max: dex },
      WIL: { current: wil, max: wil },
      hp: { current: hp, max: hp },
      // Type-specific
      cost: hirelingType?.cost || '1 ď',
      skill: hirelingType?.skill || null,
      // Inventory: 4 sloty (2 v silnější pacce, 2 ve slabší)
      inventorySlots: {
        strongPaw1: null, strongPaw2: null,
        weakPaw1: null, weakPaw2: null
      },
      physicalDetail: randomFrom(PHYSICAL_DETAILS)
    };

    setParties(parties.map(p => {
      if (p.id !== partyId) return p;
      return { ...p, members: [...p.members, newHireling] };
    }));
    return newHireling;
  };

  // Helper: Add multiple pre-created hirelings to party
  const addHirelingsToParty = (partyId, hirelings) => {
    if (!hirelings || hirelings.length === 0) return;
    setParties(parties.map(p => {
      if (p.id !== partyId) return p;
      return { ...p, members: [...p.members, ...hirelings] };
    }));
  };

  // Helper: Remove character from party
  const removeCharacter = (partyId, charId) => {
    setParties(parties.map(p => {
      if (p.id !== partyId) return p;
      return { ...p, members: p.members.filter(m => m.id !== charId) };
    }));
    if (activeCharacterId === charId) {
      setActiveCharacterId(null);
    }
  };

  // Helper: Remove party
  const removeParty = (partyId) => {
    setParties(parties.filter(p => p.id !== partyId));
    if (activePartyId === partyId) {
      const remaining = parties.filter(p => p.id !== partyId);
      setActivePartyId(remaining.length > 0 ? remaining[0].id : null);
      setActiveCharacterId(null);
    }
  };

  // Load saved data with migration
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mausritter-save');
      if (saved) {
        const rawData = JSON.parse(saved);
        
        // Use migration system to upgrade old saves
        const data = migrateSaveData(rawData);
        
        // Load migrated data
        setParties(data.parties);
        if (data.activePartyId) setActivePartyId(data.activePartyId);
        if (data.activeCharacterId) setActiveCharacterId(data.activeCharacterId);
        setJournal(data.journal);
        setFactions(data.factions);
        setSettlements(data.settlements);
        setWorldNPCs(data.worldNPCs);
        
        // Log if migration happened
        const oldVersion = rawData.version || 1;
        if (oldVersion < SAVE_VERSION) {
          console.log(`Save migrated from v${oldVersion} to v${SAVE_VERSION}`);
        }
      }
    } catch (e) {
      console.error('Failed to load save:', e);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const saveData = { 
      version: SAVE_VERSION,
      parties, 
      activePartyId, 
      activeCharacterId,
      journal, 
      factions,
      settlements,
      worldNPCs
    };
    localStorage.setItem('mausritter-save', JSON.stringify(saveData));
  }, [parties, activePartyId, activeCharacterId, journal, factions, settlements, worldNPCs]);

  const handleLogEntry = useCallback((entry) => {
    setJournal(prev => [{ 
      ...entry, 
      id: generateId(),
      partyId: activePartyId // Tag entry with current party
    }, ...prev]);
  }, [activePartyId]);

  const handleExport = () => {
    const exportData = {
      version: SAVE_VERSION,
      parties,
      activePartyId,
      activeCharacterId,
      journal,
      factions,
      settlements,
      worldNPCs,
      exportDate: new Date().toISOString()
    };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const partyName = activeParty?.name || 'adventure';
    a.download = `mausritter-${partyName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawData = JSON.parse(e.target.result);
        const oldVersion = rawData.version || 1;
        
        // Migrate to current version
        const data = migrateSaveData(rawData);
        
        // Load migrated data
        setParties(data.parties);
        setActivePartyId(data.activePartyId);
        setActiveCharacterId(data.activeCharacterId);
        setJournal(data.journal);
        setFactions(data.factions);
        setSettlements(data.settlements);
        setWorldNPCs(data.worldNPCs);
        
        if (oldVersion < SAVE_VERSION) {
          alert(`✅ Save úspěšně nahrán!\n\n📦 Save byl automaticky aktualizován z verze ${oldVersion} na ${SAVE_VERSION}.`);
        } else {
          alert('✅ Save úspěšně nahrán!');
        }
      } catch (err) {
        alert('❌ Chyba při načítání souboru: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // ============================================
  // CLOUD SYNC (File System Access API)
  // ============================================
  
  // Check if File System Access API is supported
  const isFileSystemSupported = typeof window !== 'undefined' && 'showSaveFilePicker' in window;

  // Get current save data
  const getSaveData = useCallback(() => ({
    version: SAVE_VERSION,
    parties,
    activePartyId,
    activeCharacterId,
    journal,
    factions,
    settlements,
    worldNPCs,
    lastModified: new Date().toISOString()
  }), [parties, activePartyId, activeCharacterId, journal, factions, settlements, worldNPCs]);

  // Save to connected file
  const saveToFile = useCallback(async () => {
    if (!fileHandle) return;
    
    try {
      setSyncStatus('saving');
      const writable = await fileHandle.createWritable();
      const data = getSaveData();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      setLastSyncTime(new Date());
      setSyncStatus('connected');
    } catch (err) {
      console.error('Failed to save to file:', err);
      setSyncStatus('error');
    }
  }, [fileHandle, getSaveData]);

  // Load from connected file
  const loadFromFile = useCallback(async (handle) => {
    try {
      const file = await handle.getFile();
      const text = await file.text();
      const rawData = JSON.parse(text);
      const data = migrateSaveData(rawData);
      
      setParties(data.parties);
      setActivePartyId(data.activePartyId);
      setActiveCharacterId(data.activeCharacterId);
      setJournal(data.journal);
      setFactions(data.factions);
      setSettlements(data.settlements);
      setWorldNPCs(data.worldNPCs);
      
      return true;
    } catch (err) {
      console.error('Failed to load from file:', err);
      return false;
    }
  }, []);

  // Connect to a file (pick or create)
  const connectToFile = async () => {
    if (!isFileSystemSupported) {
      alert('Tvůj prohlížeč nepodporuje File System API. Použij Chrome nebo Edge.');
      return;
    }
    
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'mausritter-save.json',
        types: [{
          description: 'JSON Save File',
          accept: { 'application/json': ['.json'] }
        }]
      });
      
      setFileHandle(handle);
      setSyncStatus('connected');
      
      // Try to load existing data from file
      try {
        const file = await handle.getFile();
        if (file.size > 0) {
          const loaded = await loadFromFile(handle);
          if (loaded) {
            alert('✅ Soubor připojen a data načtena!');
          }
        } else {
          // New file - save current data
          const writable = await handle.createWritable();
          await writable.write(JSON.stringify(getSaveData(), null, 2));
          await writable.close();
          alert('✅ Nový soubor vytvořen a data uložena!');
        }
      } catch (e) {
        // File might be new/empty, save current data
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(getSaveData(), null, 2));
        await writable.close();
      }
      
      setLastSyncTime(new Date());
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to connect to file:', err);
        alert('Nepodařilo se připojit k souboru: ' + err.message);
      }
    }
  };

  // Disconnect from file
  const disconnectFile = () => {
    setFileHandle(null);
    setSyncStatus('disconnected');
    setLastSyncTime(null);
  };

  // Auto-save to file when data changes (debounced)
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    if (!fileHandle || syncStatus !== 'connected') return;
    
    // Debounce: wait 2 seconds after last change before saving
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveToFile();
    }, 2000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [parties, journal, factions, settlements, worldNPCs, fileHandle, syncStatus, saveToFile]);

  // Manual sync button
  const handleManualSync = async () => {
    if (fileHandle) {
      await saveToFile();
    }
  };

  // ============================================
  // GOOGLE DRIVE SYNC
  // ============================================

  // Initialize Google Identity Services
  useEffect(() => {
    if (typeof google === 'undefined' || !google.accounts) return;

    googleTokenClientRef.current = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      callback: async (response) => {
        if (response.error) {
          console.error('Google OAuth error:', response);
          setGoogleSyncStatus('error');
          return;
        }
        setGoogleAccessToken(response.access_token);
        // Check if we have a saved folder in localStorage
        const savedFolderId = localStorage.getItem('googleDriveFolderId');
        const savedFolderName = localStorage.getItem('googleDriveFolderName');
        console.log('Saved folder from localStorage:', savedFolderId, savedFolderName);

        if (savedFolderId) {
          // Verify folder still exists on Drive
          try {
            const verifyRes = await fetch(
              `https://www.googleapis.com/drive/v3/files/${savedFolderId}?fields=id,name,trashed`,
              { headers: { Authorization: `Bearer ${response.access_token}` } }
            );
            const folderData = await verifyRes.json();
            console.log('Folder verification:', folderData);

            if (folderData.id && !folderData.trashed) {
              // Folder exists - use it
              setGoogleDriveFolderId(savedFolderId);
              setGoogleDriveFolderName(folderData.name || savedFolderName);
              setGoogleSyncStatus('connected');
              findOrCreateGoogleDriveFile(response.access_token, savedFolderId);
            } else {
              // Folder was deleted or trashed - clear localStorage and open picker
              console.warn('Saved folder no longer exists, opening picker');
              localStorage.removeItem('googleDriveFolderId');
              localStorage.removeItem('googleDriveFolderName');
              openFolderPicker(response.access_token);
            }
          } catch (err) {
            console.error('Folder verification failed:', err);
            localStorage.removeItem('googleDriveFolderId');
            localStorage.removeItem('googleDriveFolderName');
            openFolderPicker(response.access_token);
          }
        } else {
          // No saved folder - show folder choice dialog
          setPendingToken(response.access_token);
          setShowFolderChoice(true);
        }
      }
    });
  }, []);

  // Folder choice dialog handlers
  const handleChooseExistingFolder = () => {
    setShowFolderChoice(false);
    if (pendingToken) {
      openFolderPicker(pendingToken);
    }
  };

  const handleCreateNewFolder = async () => {
    if (!pendingToken) return;

    const folderName = prompt('Název nové složky:');
    if (!folderName) return;

    setShowFolderChoice(false);

    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pendingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });
      const folder = await response.json();

      if (folder.id) {
        setGoogleDriveFolderId(folder.id);
        setGoogleDriveFolderName(folder.name);
        localStorage.setItem('googleDriveFolderId', folder.id);
        localStorage.setItem('googleDriveFolderName', folder.name);
        setGoogleSyncStatus('connected');
        findOrCreateGoogleDriveFile(pendingToken, folder.id);
        setPendingToken(null);
      }
    } catch (err) {
      console.error('Failed to create folder:', err);
      alert('Nepodařilo se vytvořit složku.');
      setGoogleSyncStatus('disconnected');
    }
  };

  const handleCancelFolderChoice = () => {
    setShowFolderChoice(false);
    setPendingToken(null);
    setGoogleSyncStatus('disconnected');
    setGoogleAccessToken(null);
  };

  // Open Google Picker to select folder
  const openFolderPicker = (token) => {
    gapi.load('picker', () => {
      const picker = new google.picker.PickerBuilder()
        .setTitle('Vyber složku pro ukládání')
        .addView(new google.picker.DocsView()
          .setIncludeFolders(true)
          .setSelectFolderEnabled(true)
          .setMimeTypes('application/vnd.google-apps.folder'))
        .setOAuthToken(token)
        .setDeveloperKey(GOOGLE_API_KEY)
        .setCallback((data) => {
          if (data.action === google.picker.Action.PICKED) {
            const folder = data.docs[0];
            setGoogleDriveFolderId(folder.id);
            setGoogleDriveFolderName(folder.name);
            // Save to localStorage for next time
            localStorage.setItem('googleDriveFolderId', folder.id);
            localStorage.setItem('googleDriveFolderName', folder.name);
            setGoogleSyncStatus('connected');
            // Find or create save file in selected folder
            findOrCreateGoogleDriveFile(token, folder.id);
          } else if (data.action === google.picker.Action.CANCEL) {
            setGoogleSyncStatus('disconnected');
            setGoogleAccessToken(null);
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  // Find existing save file or create new one in selected folder
  const findOrCreateGoogleDriveFile = async (token, folderId = googleDriveFolderId) => {
    try {
      // Search for existing file in folder
      const query = folderId
        ? `name='mausritter-save.json' and '${folderId}' in parents and trashed=false`
        : `name='mausritter-save.json' and trashed=false`;
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,modifiedTime)`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const searchData = await searchResponse.json();

      if (searchData.files && searchData.files.length > 0) {
        // Existing file found - check for conflicts
        const cloudFile = searchData.files[0];
        const cloudModifiedTime = cloudFile.modifiedTime;

        // Get local data to compare
        const localSave = localStorage.getItem('mausritter-save');
        if (localSave) {
          try {
            const localData = JSON.parse(localSave);
            const localDate = new Date(localData.lastModified);
            const cloudDate = new Date(cloudModifiedTime);

            // If difference is more than 1 minute, show conflict dialog
            if (Math.abs(localDate - cloudDate) > 60000) {
              setSyncConflict({
                localDate: localData.lastModified,
                cloudDate: cloudModifiedTime,
                cloudFileId: cloudFile.id,
                token,
                folderId
              });
              return; // Wait for user decision
            }
          } catch (e) {
            console.warn('Failed to parse local save for conflict check:', e);
          }
        }

        // No conflict or no local data - just load from cloud
        setGoogleDriveFileId(cloudFile.id);
        setGoogleDriveFileName(cloudFile.name);
        await loadFromGoogleDrive(token, cloudFile.id);
        setGoogleLastSync(new Date());
      } else {
        // Create new file in selected folder
        await saveToGoogleDrive(token, null, folderId);
      }
    } catch (err) {
      console.error('Google Drive file search failed:', err);
      setGoogleSyncStatus('error');
    }
  };

  // Resolve sync conflict - use local data (upload to cloud)
  const resolveConflictUseLocal = async () => {
    if (!syncConflict) return;
    const { token, folderId, cloudFileId } = syncConflict;
    setSyncConflict(null);
    setGoogleDriveFileId(cloudFileId);
    await saveToGoogleDrive(token, cloudFileId, folderId);
    setGoogleLastSync(new Date());
  };

  // Resolve sync conflict - use cloud data (overwrite local)
  const resolveConflictUseCloud = async () => {
    if (!syncConflict) return;
    const { token, cloudFileId } = syncConflict;
    setSyncConflict(null);
    setGoogleDriveFileId(cloudFileId);
    await loadFromGoogleDrive(token, cloudFileId);
    setGoogleLastSync(new Date());
  };

  // Cancel sync conflict - disconnect
  const resolveConflictCancel = () => {
    setSyncConflict(null);
    setGoogleSyncStatus('disconnected');
    setGoogleAccessToken(null);
  };

  // Connect to Google Drive
  const connectGoogleDrive = () => {
    if (!googleTokenClientRef.current) {
      alert('Google API není načtené. Zkus obnovit stránku.');
      return;
    }
    setGoogleSyncStatus('connecting');
    googleTokenClientRef.current.requestAccessToken();
  };

  // Disconnect from Google Drive
  const disconnectGoogleDrive = () => {
    if (googleAccessToken) {
      google.accounts.oauth2.revoke(googleAccessToken);
    }
    setGoogleAccessToken(null);
    setGoogleDriveFileId(null);
    setGoogleDriveFileName(null);
    setGoogleDriveFolderId(null);
    setGoogleDriveFolderName(null);
    setGoogleSyncStatus('disconnected');
    setGoogleLastSync(null);
    // Clear localStorage
    localStorage.removeItem('googleDriveFolderId');
    localStorage.removeItem('googleDriveFolderName');
  };

  // Open file picker to load existing save from Google Drive
  const openGoogleDriveFilePicker = () => {
    if (!googleAccessToken || !googleDriveFolderId) return;

    gapi.load('picker', () => {
      const picker = new google.picker.PickerBuilder()
        .setOAuthToken(googleAccessToken)
        .addView(
          new google.picker.DocsView()
            .setParent(googleDriveFolderId)
            .setMimeTypes('application/json')
        )
        .setTitle('Vyber save soubor')
        .setCallback(async (data) => {
          if (data.action === google.picker.Action.PICKED) {
            const file = data.docs[0];
            setGoogleDriveFileId(file.id);
            setGoogleDriveFileName(file.name);
            await loadFromGoogleDrive(googleAccessToken, file.id);
            setGoogleLastSync(new Date());
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  // Save as new file on Google Drive
  const saveAsNewGoogleDriveFile = async () => {
    if (!googleAccessToken || !googleDriveFolderId) return;

    const defaultName = `mausritter-save-${new Date().toISOString().slice(0, 10)}.json`;
    const fileName = prompt('Název nového souboru:', defaultName);
    if (!fileName) return;

    try {
      setGoogleSyncStatus('saving');
      const data = getSaveData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

      const metadata = {
        name: fileName.endsWith('.json') ? fileName : `${fileName}.json`,
        mimeType: 'application/json',
        parents: [googleDriveFolderId]
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', blob);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
        method: 'POST',
        headers: { Authorization: `Bearer ${googleAccessToken}` },
        body: form
      });
      const result = await response.json();

      if (result.id) {
        setGoogleDriveFileId(result.id);
        setGoogleDriveFileName(result.name);
        setGoogleLastSync(new Date());
        setGoogleSyncStatus('connected');
        alert(`Uloženo jako "${result.name}"`);
      }
    } catch (err) {
      console.error('Save as new file failed:', err);
      setGoogleSyncStatus('error');
      alert('Nepodařilo se uložit soubor.');
    }
  };

  // Change Google Drive folder
  const changeGoogleDriveFolder = () => {
    if (googleAccessToken) {
      // Clear current folder from localStorage
      localStorage.removeItem('googleDriveFolderId');
      localStorage.removeItem('googleDriveFolderName');
      setGoogleDriveFileId(null);
      // Open picker to select new folder
      openFolderPicker(googleAccessToken);
    }
  };

  // Create new folder on Google Drive
  const createGoogleDriveFolder = async () => {
    if (!googleAccessToken) return;
    
    const folderName = prompt('Název nové složky:');
    if (!folderName) return;

    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });
      const folder = await response.json();
      
      if (folder.id) {
        setGoogleDriveFolderId(folder.id);
        setGoogleDriveFolderName(folder.name);
        localStorage.setItem('googleDriveFolderId', folder.id);
        localStorage.setItem('googleDriveFolderName', folder.name);
        setGoogleDriveFileId(null); // Reset file ID for new folder
        setGoogleSyncStatus('connected');
        findOrCreateGoogleDriveFile(googleAccessToken, folder.id);
        alert(`Složka "${folderName}" vytvořena!`);
      }
    } catch (err) {
      console.error('Failed to create folder:', err);
      alert('Nepodařilo se vytvořit složku.');
    }
  };

  // Fetch list of JSON files from a folder
  const fetchDriveFiles = async (folderId = googleDriveFolderId, token = googleAccessToken) => {
    if (!token || !folderId) return [];

    setDriveLoading(true);
    try {
      const query = `'${folderId}' in parents and mimeType='application/json' and trashed=false`;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setDriveFiles(data.files || []);
      return data.files || [];
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setDriveFiles([]);
      return [];
    } finally {
      setDriveLoading(false);
    }
  };

  // Fetch list of folders from Google Drive
  const fetchDriveFolders = async (parentId = 'root', token = googleAccessToken) => {
    if (!token) return [];

    setDriveLoading(true);
    try {
      const query = parentId === 'root'
        ? `mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false`
        : `mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&orderBy=name`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setDriveFolders(data.files || []);
      return data.files || [];
    } catch (err) {
      console.error('Failed to fetch folders:', err);
      setDriveFolders([]);
      return [];
    } finally {
      setDriveLoading(false);
    }
  };

  // Open Save dialog
  const openSaveDialog = async () => {
    if (!googleAccessToken) {
      connectGoogleDrive();
      return;
    }
    // Default filename based on current file or generate new
    const defaultName = googleDriveFileName
      ? googleDriveFileName.replace('.json', '')
      : `mausritter-save-${new Date().toISOString().slice(0, 10)}`;
    setSaveFileName(defaultName);
    setShowSaveDialog(true);

    // Fetch existing files to show in dialog
    if (googleDriveFolderId) {
      await fetchDriveFiles();
    }
  };

  // Open Load dialog
  const openLoadDialog = async () => {
    if (!googleAccessToken) {
      connectGoogleDrive();
      return;
    }
    setShowLoadDialog(true);

    // Fetch files from current folder
    if (googleDriveFolderId) {
      await fetchDriveFiles();
    } else {
      // No folder selected - show folder picker first
      setShowFolderPicker(true);
      await fetchDriveFolders();
    }
  };

  // Save with custom filename
  const saveWithFileName = async (fileName) => {
    if (!googleAccessToken || !googleDriveFolderId) return;

    const fullName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

    // Check if file with this name already exists
    const existingFile = driveFiles.find(f => f.name === fullName);

    try {
      setGoogleSyncStatus('saving');
      const data = getSaveData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

      if (existingFile) {
        // Update existing file
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: blob
        });
        setGoogleDriveFileId(existingFile.id);
        setGoogleDriveFileName(fullName);
      } else {
        // Create new file
        const metadata = {
          name: fullName,
          mimeType: 'application/json',
          parents: [googleDriveFolderId]
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
          method: 'POST',
          headers: { Authorization: `Bearer ${googleAccessToken}` },
          body: form
        });
        const result = await response.json();

        if (result.id) {
          setGoogleDriveFileId(result.id);
          setGoogleDriveFileName(result.name);
        }
      }

      setGoogleLastSync(new Date());
      setGoogleSyncStatus('connected');
      setShowSaveDialog(false);
    } catch (err) {
      console.error('Save failed:', err);
      setGoogleSyncStatus('error');
    }
  };

  // Load selected file
  const loadSelectedFile = async (file) => {
    if (!googleAccessToken || !file) return;

    try {
      setGoogleSyncStatus('saving');
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
        headers: { Authorization: `Bearer ${googleAccessToken}` }
      });
      const rawData = await response.json();
      const data = migrateSaveData(rawData);

      // Apply data
      if (data.parties) setParties(data.parties);
      if (data.activePartyId) setActivePartyId(data.activePartyId);
      if (data.activeCharacterId) setActiveCharacterId(data.activeCharacterId);
      if (data.journal) setJournal(data.journal);
      if (data.factions) setFactions(data.factions);
      if (data.settlements) setSettlements(data.settlements);
      if (data.worldNPCs) setWorldNPCs(data.worldNPCs);

      setGoogleDriveFileId(file.id);
      setGoogleDriveFileName(file.name);
      setGoogleLastSync(new Date());
      setGoogleSyncStatus('connected');
      setShowLoadDialog(false);
    } catch (err) {
      console.error('Load failed:', err);
      setGoogleSyncStatus('error');
    }
  };

  // Select folder for save/load
  const selectDriveFolder = async (folder) => {
    setGoogleDriveFolderId(folder.id);
    setGoogleDriveFolderName(folder.name);
    localStorage.setItem('googleDriveFolderId', folder.id);
    localStorage.setItem('googleDriveFolderName', folder.name);
    setShowFolderPicker(false);

    // Refresh files list for new folder
    await fetchDriveFiles(folder.id);
  };

  // Start new game - reset all data
  const startNewGame = () => {
    // Reset all game data
    setParties([]);
    setActivePartyId(null);
    setActiveCharacterId(null);
    setJournal([]);
    setFactions([]);
    setSettlements([]);
    setWorldNPCs([]);

    // Clear current file reference (but keep folder)
    setGoogleDriveFileId(null);
    setGoogleDriveFileName(null);

    // Save to localStorage
    localStorage.removeItem('mausritter-parties');
    localStorage.removeItem('mausritter-journal');
    localStorage.removeItem('mausritter-factions');
    localStorage.removeItem('mausritter-settlements');
    localStorage.removeItem('mausritter-worldNPCs');
    localStorage.removeItem('googleDriveFileId');
    localStorage.removeItem('googleDriveFileName');

    setShowNewGameDialog(false);
  };

  // Save to Google Drive
  const saveToGoogleDrive = async (token = googleAccessToken, fileId = googleDriveFileId, folderId = googleDriveFolderId) => {
    if (!token) return;

    try {
      setGoogleSyncStatus('saving');
      const data = getSaveData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

      if (fileId) {
        // Update existing file
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: blob
        });
      } else {
        // Create new file in selected folder
        const metadata = {
          name: 'mausritter-save.json',
          mimeType: 'application/json',
          ...(folderId && { parents: [folderId] })
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
        const result = await response.json();
        setGoogleDriveFileId(result.id);
        setGoogleDriveFileName(result.name);
      }

      setGoogleLastSync(new Date());
      setGoogleSyncStatus('connected');
    } catch (err) {
      console.error('Google Drive save failed:', err);
      setGoogleSyncStatus('error');
    }
  };

  // Load from Google Drive
  const loadFromGoogleDrive = async (token = googleAccessToken, fileId = googleDriveFileId) => {
    if (!token || !fileId) return false;

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawData = await response.json();
      const data = migrateSaveData(rawData);

      setParties(data.parties);
      setActivePartyId(data.activePartyId);
      setActiveCharacterId(data.activeCharacterId);
      setJournal(data.journal);
      setFactions(data.factions);
      setSettlements(data.settlements);
      setWorldNPCs(data.worldNPCs);

      return true;
    } catch (err) {
      console.error('Google Drive load failed:', err);
      return false;
    }
  };

  // Auto-save to Google Drive when data changes (debounced)
  const googleSaveTimeoutRef = useRef(null);
  useEffect(() => {
    if (!googleAccessToken || googleSyncStatus !== 'connected' || !googleDriveFileId) return;

    if (googleSaveTimeoutRef.current) {
      clearTimeout(googleSaveTimeoutRef.current);
    }

    googleSaveTimeoutRef.current = setTimeout(() => {
      saveToGoogleDrive();
    }, 3000); // 3 second debounce for Google Drive

    return () => {
      if (googleSaveTimeoutRef.current) {
        clearTimeout(googleSaveTimeoutRef.current);
      }
    };
  }, [parties, journal, factions, settlements, worldNPCs, googleAccessToken, googleSyncStatus, googleDriveFileId]);

  // Manual Google Drive sync
  const handleGoogleDriveSync = async () => {
    if (googleAccessToken && googleDriveFileId) {
      await saveToGoogleDrive();
    }
  };

  const panels = [
    { id: 'journal', label: 'Deník', icon: '📖' },
    { id: 'character', label: 'Postavy', icon: '🐭' },
    { id: 'oracle', label: 'Věštírna', icon: '🔮' },
    { id: 'combat', label: 'Boj', icon: '⚔️' },
    { id: 'time', label: 'Čas', icon: '⏰' },
    { id: 'world', label: 'Svět', icon: '🌍' },
    { id: 'factions', label: 'Frakce', icon: '🏰' },
    { id: 'studio', label: 'Kartičky', icon: '🎴' },
    { id: 'howto', label: 'Jak hrát', icon: '📚' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Sync Conflict Dialog */}
      {syncConflict && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>⚠️</span> Nalezen konflikt verzí
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center bg-stone-700 p-3 rounded">
                <span className="text-stone-300">💾 Lokální data:</span>
                <span className="font-mono text-amber-400">
                  {new Date(syncConflict.localDate).toLocaleString('cs-CZ')}
                </span>
              </div>
              <div className="flex justify-between items-center bg-stone-700 p-3 rounded">
                <span className="text-stone-300">☁️ Cloud data:</span>
                <span className="font-mono text-blue-400">
                  {new Date(syncConflict.cloudDate).toLocaleString('cs-CZ')}
                </span>
              </div>
              <p className="text-stone-400 text-sm">
                Kterou verzi chceš použít? Druhá bude přepsána.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={resolveConflictUseLocal}
                className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-600 rounded font-medium transition-colors"
              >
                💾 Použít lokální (nahrát na cloud)
              </button>
              <button
                onClick={resolveConflictUseCloud}
                className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded font-medium transition-colors"
              >
                ☁️ Použít cloud (přepsat lokální)
              </button>
              <button
                onClick={resolveConflictCancel}
                className="w-full px-4 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
              >
                Zrušit připojení
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Choice Dialog */}
      {showFolderChoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📁</span> Kam ukládat data?
            </h3>
            <p className="text-stone-400 text-sm mb-6">
              Vyber složku na Google Drive nebo vytvoř novou.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleChooseExistingFolder}
                className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>📂</span> Vybrat existující složku
              </button>
              <button
                onClick={handleCreateNewFolder}
                className="w-full px-4 py-3 bg-green-700 hover:bg-green-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>➕</span> Vytvořit novou složku
              </button>
              <button
                onClick={handleCancelFolderChoice}
                className="w-full px-4 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && googleAccessToken && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>💾</span> Uložit hru
            </h3>

            {/* Folder selection */}
            <div className="mb-4">
              <label className="text-stone-400 text-sm block mb-1">Složka:</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-stone-700 px-3 py-2 rounded text-amber-400 font-mono text-sm truncate">
                  {googleDriveFolderName || 'Nevybráno'}
                </div>
                <button
                  onClick={async () => {
                    setShowFolderPicker(true);
                    await fetchDriveFolders();
                  }}
                  className="px-3 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
                >
                  Změnit
                </button>
              </div>
            </div>

            {/* Folder picker inline */}
            {showFolderPicker && (
              <div className="mb-4 bg-stone-700 rounded p-3 max-h-40 overflow-y-auto">
                {driveLoading ? (
                  <div className="text-center text-stone-400 py-2">Načítám složky...</div>
                ) : driveFolders.length === 0 ? (
                  <div className="text-center text-stone-400 py-2">Žádné složky</div>
                ) : (
                  driveFolders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => selectDriveFolder(folder)}
                      className="w-full text-left px-3 py-2 hover:bg-stone-600 rounded flex items-center gap-2 transition-colors"
                    >
                      <span>📁</span> {folder.name}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* File name input */}
            <div className="mb-4">
              <label className="text-stone-400 text-sm block mb-1">Název souboru:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saveFileName}
                  onChange={(e) => setSaveFileName(e.target.value)}
                  className="flex-1 bg-stone-700 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="mausritter-save"
                />
                <span className="bg-stone-600 px-3 py-2 rounded text-stone-400">.json</span>
              </div>
            </div>

            {/* Existing files in folder */}
            {driveFiles.length > 0 && !showFolderPicker && (
              <div className="mb-4">
                <label className="text-stone-400 text-sm block mb-1">Existující soubory (klikni pro přepsání):</label>
                <div className="bg-stone-700 rounded p-2 max-h-32 overflow-y-auto">
                  {driveFiles.map(file => (
                    <button
                      key={file.id}
                      onClick={() => setSaveFileName(file.name.replace('.json', ''))}
                      className={`w-full text-left px-3 py-1.5 rounded flex items-center justify-between transition-colors ${
                        saveFileName + '.json' === file.name ? 'bg-amber-700' : 'hover:bg-stone-600'
                      }`}
                    >
                      <span className="truncate">{file.name}</span>
                      <span className="text-stone-400 text-xs ml-2">{new Date(file.modifiedTime).toLocaleDateString('cs-CZ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowSaveDialog(false); setShowFolderPicker(false); }}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => { saveWithFileName(saveFileName); setShowFolderPicker(false); }}
                disabled={!saveFileName.trim() || !googleDriveFolderId}
                className="flex-1 px-4 py-3 bg-green-700 hover:bg-green-600 disabled:bg-stone-600 disabled:cursor-not-allowed rounded font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>💾</span> Uložit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && googleAccessToken && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📂</span> Načíst hru
            </h3>

            {/* Folder selection */}
            <div className="mb-4">
              <label className="text-stone-400 text-sm block mb-1">Složka:</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-stone-700 px-3 py-2 rounded text-amber-400 font-mono text-sm truncate">
                  {googleDriveFolderName || 'Nevybráno'}
                </div>
                <button
                  onClick={async () => {
                    setShowFolderPicker(true);
                    await fetchDriveFolders();
                  }}
                  className="px-3 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
                >
                  Změnit
                </button>
              </div>
            </div>

            {/* Folder picker inline */}
            {showFolderPicker && (
              <div className="mb-4 bg-stone-700 rounded p-3 max-h-40 overflow-y-auto">
                {driveLoading ? (
                  <div className="text-center text-stone-400 py-2">Načítám složky...</div>
                ) : driveFolders.length === 0 ? (
                  <div className="text-center text-stone-400 py-2">Žádné složky</div>
                ) : (
                  driveFolders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => selectDriveFolder(folder)}
                      className="w-full text-left px-3 py-2 hover:bg-stone-600 rounded flex items-center gap-2 transition-colors"
                    >
                      <span>📁</span> {folder.name}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Files list */}
            {!showFolderPicker && (
              <div className="mb-4">
                <label className="text-stone-400 text-sm block mb-1">Uložené hry:</label>
                <div className="bg-stone-700 rounded p-2 max-h-64 overflow-y-auto">
                  {driveLoading ? (
                    <div className="text-center text-stone-400 py-4">Načítám soubory...</div>
                  ) : driveFiles.length === 0 ? (
                    <div className="text-center text-stone-400 py-4">Žádné uložené hry</div>
                  ) : (
                    driveFiles.map(file => (
                      <button
                        key={file.id}
                        onClick={() => loadSelectedFile(file)}
                        className="w-full text-left px-3 py-2 hover:bg-stone-600 rounded flex items-center justify-between transition-colors"
                      >
                        <span className="truncate flex items-center gap-2">
                          <span>🎮</span> {file.name.replace('.json', '')}
                        </span>
                        <span className="text-stone-400 text-xs ml-2">{new Date(file.modifiedTime).toLocaleDateString('cs-CZ')}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowLoadDialog(false); setShowFolderPicker(false); }}
                className="w-full px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Game Confirmation Dialog */}
      {showNewGameDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🆕</span> Nová hra
            </h3>
            <p className="text-stone-300 mb-6">
              Opravdu chceš začít novou hru? Všechna neuložená data budou ztracena.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewGameDialog(false)}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={startNewGame}
                className="flex-1 px-4 py-3 bg-red-700 hover:bg-red-600 rounded font-medium transition-colors"
              >
                Nová hra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-50 shadow-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Logo and title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl md:text-4xl flex-shrink-0">🐭</span>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                  Mausritter
                </h1>
                {activeParty && (
                  <p className="text-amber-200 text-xs md:text-sm truncate">
                    {activeParty.name}
                    {activeCharacter && <span> • {activeCharacter.name}</span>}
                    {activeCharacter?.hp && (
                      <span className="hidden md:inline"> • HP {activeCharacter.hp.current}/{activeCharacter.hp.max}</span>
                    )}
                    {activeParty.gameTime && <span> • D{activeParty.gameTime.day}</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Desktop: Full toolbar */}
            <div className="hidden md:flex items-center gap-2">
              {/* Local File Sync */}
              <div className="flex items-center gap-1">
                {fileHandle ? (
                  <>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        syncStatus === 'saving' ? 'bg-yellow-600 text-yellow-100' :
                        syncStatus === 'error' ? 'bg-red-600 text-red-100' :
                        'bg-green-700 text-green-100'
                      }`}
                      title={lastSyncTime ? `Lokální soubor\nPoslední sync: ${lastSyncTime.toLocaleTimeString('cs-CZ')}` : 'Lokální soubor'}
                    >
                      {syncStatus === 'saving' ? '⏳' : syncStatus === 'error' ? '❌' : '📄'} Lokální
                    </span>
                    <button
                      onClick={disconnectFile}
                      className="px-1.5 py-1 bg-green-700/50 hover:bg-red-600 rounded text-xs transition-colors"
                      title="Odpojit lokální soubor"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isFileSystemSupported) {
                        alert('⚠️ Lokální sync vyžaduje Chrome nebo Edge.\n\nPro cloud sync použij Google Drive.');
                        return;
                      }
                      connectToFile();
                    }}
                    className="px-2 py-1.5 bg-green-700/70 hover:bg-green-600 rounded text-xs font-medium transition-colors cursor-pointer"
                    title="Sync do lokálního souboru (pouze Chrome/Edge)"
                  >
                    📄 Lokální
                  </button>
                )}
              </div>

              {/* Google Drive Save/Load */}
              <div className="flex items-center gap-1">
                {googleAccessToken ? (
                  <>
                    <button
                      onClick={openSaveDialog}
                      className={`text-xs px-2 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                        googleSyncStatus === 'saving' ? 'bg-yellow-600 text-yellow-100 hover:bg-yellow-500' :
                        googleSyncStatus === 'error' ? 'bg-red-600 text-red-100 hover:bg-red-500' :
                        'bg-blue-600 text-blue-100 hover:bg-blue-500'
                      }`}
                      title={googleLastSync ? `Uložit na Google Drive\n${googleDriveFileName || 'Nový soubor'}\nPoslední sync: ${googleLastSync.toLocaleTimeString('cs-CZ')}` : 'Uložit na Google Drive'}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={openLoadDialog}
                      className="text-xs px-2 py-1.5 rounded bg-blue-600 text-blue-100 hover:bg-blue-500 cursor-pointer transition-colors"
                      title="Načíst z Google Drive"
                    >
                      📂 Load
                    </button>
                    <button
                      onClick={() => setShowNewGameDialog(true)}
                      className="text-xs px-2 py-1.5 rounded bg-amber-600 text-amber-100 hover:bg-amber-500 cursor-pointer transition-colors"
                      title="Nová hra"
                    >
                      🆕 New
                    </button>
                    <button onClick={disconnectGoogleDrive} className="px-1.5 py-1 bg-blue-600/50 hover:bg-red-600 rounded text-xs transition-colors" title="Odpojit Google Drive">✕</button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={connectGoogleDrive}
                    className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium transition-colors cursor-pointer"
                    title="Připojit Google Drive"
                  >
                    ☁️ Připojit Drive
                  </button>
                )}
              </div>

              <button onClick={handleExport} className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 rounded text-sm font-medium transition-colors" title="Exportovat save">📤</button>
              <label className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 rounded text-sm font-medium cursor-pointer transition-colors" title="Importovat save">
                📥
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>

            {/* Mobile: Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded hover:bg-amber-700 transition-colors"
              title="Menu"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-amber-700 space-y-2">
              {/* Local sync */}
              <div className="flex items-center justify-between">
                <span className="text-sm">📄 Lokální soubor</span>
                {fileHandle ? (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      syncStatus === 'saving' ? 'bg-yellow-600' : syncStatus === 'error' ? 'bg-red-600' : 'bg-green-700'
                    }`}>
                      {syncStatus === 'saving' ? '⏳ Ukládám' : syncStatus === 'error' ? '❌ Chyba' : '✓ Připojeno'}
                    </span>
                    <button onClick={() => { disconnectFile(); setMobileMenuOpen(false); }} className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs">Odpojit</button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!isFileSystemSupported) {
                        alert('⚠️ Lokální sync vyžaduje Chrome nebo Edge.');
                        return;
                      }
                      connectToFile();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded text-xs font-medium"
                  >
                    Připojit
                  </button>
                )}
              </div>

              {/* Google Drive Save/Load */}
              <div className="flex items-center justify-between">
                <span className="text-sm">☁️ Google Drive</span>
                {googleAccessToken ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { openSaveDialog(); setMobileMenuOpen(false); }}
                      className={`text-xs px-2 py-1.5 rounded ${
                        googleSyncStatus === 'saving' ? 'bg-yellow-600' : googleSyncStatus === 'error' ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => { openLoadDialog(); setMobileMenuOpen(false); }}
                      className="text-xs px-2 py-1.5 rounded bg-blue-600"
                    >
                      📂 Load
                    </button>
                    <button
                      onClick={() => { setShowNewGameDialog(true); setMobileMenuOpen(false); }}
                      className="text-xs px-2 py-1.5 rounded bg-amber-600"
                    >
                      🆕 New
                    </button>
                    <button onClick={() => { disconnectGoogleDrive(); setMobileMenuOpen(false); }} className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { connectGoogleDrive(); setMobileMenuOpen(false); }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium"
                  >
                    Připojit
                  </button>
                )}
              </div>

              {/* Export/Import */}
              <div className="flex gap-2 pt-2 border-t border-amber-700">
                <button onClick={() => { handleExport(); setMobileMenuOpen(false); }} className="flex-1 px-3 py-2 bg-amber-700 hover:bg-amber-600 rounded text-sm font-medium">
                  📤 Export
                </button>
                <label className="flex-1 px-3 py-2 bg-amber-700 hover:bg-amber-600 rounded text-sm font-medium cursor-pointer text-center">
                  📥 Import
                  <input type="file" accept=".json" onChange={(e) => { handleImport(e); setMobileMenuOpen(false); }} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-amber-800/90 backdrop-blur-sm shadow-lg sticky top-[76px] z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {panels.map(panel => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id)}
                className={`px-4 py-2.5 rounded-lg font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  activePanel === panel.id
                    ? 'bg-amber-50 text-amber-900 shadow-lg'
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
              >
                <span className="text-lg">{panel.icon}</span>
                <span className="hidden sm:inline">{panel.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activePanel === 'howto' && (
          <HowToPlayPanel />
        )}

        {activePanel === 'oracle' && (
          <OraclePanel onLogEntry={handleLogEntry} />
        )}
        
        {activePanel === 'studio' && (
          <ItemCardStudio 
            parties={parties}
            activePartyId={activePartyId}
            activeCharacterId={activeCharacterId}
            updateCharacterInParty={updateCharacterInParty}
          />
        )}
        
        {activePanel === 'combat' && (
          <CombatPanel
            party={activeParty}
            updateCharacterInParty={(charId, updates) =>
              activePartyId && updateCharacterInParty(activePartyId, charId, updates)
            }
            onLogEntry={handleLogEntry}
          />
        )}

        {activePanel === 'time' && (
          <TimePanel
            party={activeParty}
            updateParty={(updates) => activePartyId && updateParty(activePartyId, updates)}
            onLogEntry={handleLogEntry}
          />
        )}

        {activePanel === 'character' && (
          <CharacterPanel 
            character={activeCharacter}
            updateCharacter={(updates) => 
              activePartyId && activeCharacterId && 
              updateCharacterInParty(activePartyId, activeCharacterId, updates)
            }
            party={activeParty}
            parties={parties}
            activePartyId={activePartyId}
            setActivePartyId={setActivePartyId}
            activeCharacterId={activeCharacterId}
            setActiveCharacterId={setActiveCharacterId}
            createParty={createParty}
            createPC={createPC}
            createHireling={createHireling}
            addHirelingsToParty={addHirelingsToParty}
            updateParty={updateParty}
            updateCharacterInParty={updateCharacterInParty}
            removeCharacter={removeCharacter}
            removeParty={removeParty}
            onLogEntry={handleLogEntry}
          />
        )}

        {activePanel === 'world' && (
          <WorldPanel
            onLogEntry={handleLogEntry}
            settlements={settlements}
            setSettlements={setSettlements}
            worldNPCs={worldNPCs}
            setWorldNPCs={setWorldNPCs}
            parties={parties}
            activeParty={activeParty}
            activePartyId={activePartyId}
            updateParty={updateParty}
          />
        )}
        
        {activePanel === 'factions' && (
          <FactionPanel 
            factions={factions}
            setFactions={setFactions}
            onLogEntry={handleLogEntry}
          />
        )}
        
        {activePanel === 'journal' && (
          <JournalPanel 
            journal={journal}
            setJournal={setJournal}
            parties={parties}
            partyFilter={journalPartyFilter}
            setPartyFilter={setJournalPartyFilter}
            onExport={handleExport}
          />
        )}
      </main>

      {/* TimeBar - sledování času (jen pokud je aktivní družina) */}
      {activeParty && (
        <TimeBar
          gameTime={activeParty.gameTime}
          updateGameTime={updateGameTime}
          partyName={activeParty.name}
        />
      )}

      {/* Plovoucí kostky - vždy viditelné */}
      <FloatingDice onLogEntry={handleLogEntry} />

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-200 text-center py-4 mt-8">
        <p className="text-sm">
          🐭 Mausritter Solo Companion • Pro sólo hráče Mausritter RPG
        </p>
      </footer>
    </div>
  );
}


// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MausritterSoloCompanion />);

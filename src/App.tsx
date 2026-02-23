import React, { useState, useEffect, useCallback, useRef } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useGameStore } from './stores/gameStore';
import { useUIStore } from './stores/uiStore';
import { useSyncStore } from './stores/syncStore';
import { useMultiplayerStore } from './stores/multiplayerStore';


// --- Data Constants (only what App.jsx needs) ---
import {
  GOOGLE_CLIENT_ID, GOOGLE_API_KEY, GOOGLE_SCOPES, FIREBASE_CONFIG,
  SAVE_VERSION, migrateSaveData,
} from './data/constants';

// --- Utility Functions ---
import { generateId } from './utils/helpers';

// --- UI Components ---
import { Select } from './components/ui/common';


// --- Panel Components ---
import { OraclePanel } from './components/panels/OraclePanel';
import { CharacterSheet, CharacterSidePanel, CharacterTabs, CharacterPanel } from './components/panels/CharacterPanel';
import { PartyPanel } from './components/panels/PartyPanel';
import { JournalPanel } from './components/panels/JournalPanel';
import { TimeBar } from './components/panels/TimeBar';
import { FloatingDice } from './components/panels/FloatingDice';
import { SessionStartScreen } from './components/panels/SessionStartScreen';
import { SessionEndDialog } from './components/panels/SessionEndDialog';
import { PlayArea } from './components/panels/PlayArea';
import { TimeHub } from './components/panels/TimeHub';
import { WorldHub } from './components/panels/WorldHub';
import { ToolsHub } from './components/panels/ToolsHub';


// ============================================
// MAIN APP
// ============================================

function MausritterSoloCompanion() {
  // === ZUSTAND STORES ===
  // Game data store
  const {
    parties, setParties, activePartyId, setActivePartyId,
    activeCharacterId, setActiveCharacterId,
    journal, setJournal, factions, setFactions,
    settlements, setSettlements, worldNPCs, setWorldNPCs,
    timedEvents, setTimedEvents, lexicon, setLexicon,
    maps, activeMapId,
    journalPartyFilter, setJournalPartyFilter,
    getActiveParty, getActiveCharacter,
    getGameState, loadGameState, applyRemoteState,
  } = useGameStore();

  // UI store
  const {
    activePanel, setActivePanel,
    mobileMenuOpen, setMobileMenuOpen,
    pendingMentionOpen, setPendingMentionOpen,
    sidePanelCharacter, setSidePanelCharacter,
  } = useUIStore();

  // Sync store (File System + Google Drive)
  const {
    fileHandle, setFileHandle, syncStatus, setSyncStatus, lastSyncTime, setLastSyncTime,
    googleAccessToken, setGoogleAccessToken,
    googleDriveFileId, setGoogleDriveFileId,
    googleDriveFileName, setGoogleDriveFileName,
    googleSyncStatus, setGoogleSyncStatus,
    googleLastSync, setGoogleLastSync,
    googleDriveFolderId, setGoogleDriveFolderId,
    googleDriveFolderName, setGoogleDriveFolderName,
    syncConflict, setSyncConflict,
    showFolderChoice, setShowFolderChoice,
    showSyncDirectionChoice, setShowSyncDirectionChoice,
    syncSaveFileName, setSyncSaveFileName,
    showSyncConfirm, setShowSyncConfirm,
    showSaveDialog, setShowSaveDialog,
    showLoadDialog, setShowLoadDialog,
    driveFiles, setDriveFiles,
    driveFolders, setDriveFolders,
    driveLoading, setDriveLoading,
    saveFileName, setSaveFileName,
    showFolderPicker, setShowFolderPicker,
    showNewGameDialog, setShowNewGameDialog,
    pendingToken, setPendingToken,
  } = useSyncStore();
  const googleTokenClientRef = useRef(null);

  // Multiplayer store (Firebase)
  const {
    roomCode, setRoomCode,
    roomName, setRoomName,
    roomConnected, setRoomConnected,
    roomPlayers, setRoomPlayers,
    isGM, setIsGM,
    myUserId, setMyUserId,
    multiplayerStatus, setMultiplayerStatus,
    showCreateRoomDialog, setShowCreateRoomDialog,
    showJoinRoomDialog, setShowJoinRoomDialog,
    showRoomCreatedDialog, setShowRoomCreatedDialog,
    showPlayersDialog, setShowPlayersDialog,
    currentGmPin, setCurrentGmPin,
    multiplayerToast, setMultiplayerToast,
  } = useMultiplayerStore();
  const firebaseDbRef = useRef(null);
  const roomListenerRef = useRef(null);
  const playersListenerRef = useRef(null);
  const presenceRef = useRef(null);
  const lastSyncTimestampRef = useRef(null);
  const isLoadingFromFirebaseRef = useRef(false);
  const isSyncingFromRemoteRef = useRef(false);

  // Session flow
  const [showSessionStart, setShowSessionStart] = useState(false);
  const [showSessionEnd, setShowSessionEnd] = useState(false);

  // Derived values
  const activeParty = getActiveParty();
  const activeCharacter = getActiveCharacter();

  // Helper: Update character within party (for CharacterSidePanel)
  const updateCharacterInParty = useGameStore.getState().updateCharacterInParty;


  // Load saved data with migration
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mausritter-save');
      if (saved) {
        const rawData = JSON.parse(saved);
        const data = migrateSaveData(rawData);
        loadGameState(data);

        const oldVersion = rawData.version || 1;
        if (oldVersion < SAVE_VERSION) {
          console.log(`Save migrated from v${oldVersion} to v${SAVE_VERSION}`);
        }

        // Show session start screen for returning players
        const hasData = (data.journal?.length ?? 0) > 0 || (data.parties?.length ?? 0) > 0;
        if (hasData) {
          setShowSessionStart(true);
        }
      }
    } catch (e) {
      console.error('Failed to load save:', e);
    }
  }, []);

  // Auto-save - separate localStorage key per room
  useEffect(() => {
    if (isLoadingFromFirebaseRef.current) return;

    const saveData = { version: SAVE_VERSION, ...getGameState() };
    const saveKey = roomConnected && roomCode
      ? `mausritter-save-${roomCode}`
      : 'mausritter-save';
    localStorage.setItem(saveKey, JSON.stringify(saveData));
  }, [parties, activePartyId, activeCharacterId, journal, factions, settlements, worldNPCs, timedEvents, lexicon, maps, activeMapId, roomConnected, roomCode]);

  const handleLogEntry = useCallback((entry) => {
    useGameStore.getState().addJournalEntry({
      ...entry,
      id: generateId(),
      partyId: activePartyId
    });
  }, [activePartyId]);

  const handleExport = () => {
    const exportData = {
      version: SAVE_VERSION,
      ...getGameState(),
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
        const data = migrateSaveData(rawData);
        loadGameState(data);

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
    event.target.value = '';
  };

  // ============================================
  // MULTIPLAYER (Firebase Realtime Database)
  // ============================================

  // Generate 6-character room code (no confusing chars like 0/O, 1/I)
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  // Generate 4-digit GM PIN
  const generateGMPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Generate player ID from name+PIN (unique per player, not per device)
  const generatePlayerId = (name, pin) => {
    // Create a simple hash to avoid special characters in Firebase paths
    const str = `${name}_${pin}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `p_${Math.abs(hash).toString(36)}`;
  };

  // Generate unique user ID (stored in localStorage for persistence)
  const getOrCreateUserId = () => {
    // Migrate from sessionStorage to localStorage
    let oderId = localStorage.getItem('mausritter-user-id');
    if (!oderId) {
      oderId = sessionStorage.getItem('mausritter-user-id');
      if (oderId) {
        localStorage.setItem('mausritter-user-id', oderId);
        sessionStorage.removeItem('mausritter-user-id');
      }
    }
    if (!oderId) {
      oderId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('mausritter-user-id', oderId);
    }
    return oderId;
  };

  // Initialize Firebase
  const initFirebase = () => {
    if (firebaseDbRef.current) return firebaseDbRef.current;

    try {
      if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return null;
      }

      // Check if already initialized
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }

      firebaseDbRef.current = firebase.database();
      return firebaseDbRef.current;
    } catch (err) {
      console.error('Firebase init error:', err);
      return null;
    }
  };

  // Show toast notification (delegates to store)
  const showMultiplayerToast = useMultiplayerStore.getState().showToast;

  // Get current game state for sync (wrapper around store)
  const getGameStateForSync = () => ({
    version: SAVE_VERSION,
    ...getGameState()
  });

  // Apply game state from Firebase
  const applyGameState = (state, fromUserId) => {
    if (!state) return;
    if (fromUserId === myUserId) return;
    applyRemoteState(state);
  };

  // Upload state to Firebase (debounced)
  const syncToFirebaseRef = useRef(null);
  const syncToFirebase = useCallback(() => {
    if (!roomConnected || !roomCode || !firebaseDbRef.current) return;
    if (isSyncingFromRemoteRef.current) return; // Prevent echo

    // Cancel previous timeout
    if (syncToFirebaseRef.current) {
      clearTimeout(syncToFirebaseRef.current);
    }

    // Debounce: wait 500ms before syncing
    syncToFirebaseRef.current = setTimeout(() => {
      const db = firebaseDbRef.current;
      const stateRef = db.ref(`rooms/${roomCode}/state`);

      const state = getGameStateForSync();
      state._lastModified = firebase.database.ServerValue.TIMESTAMP;
      state._lastModifiedBy = myUserId;

      stateRef.update(state).catch(err => {
        console.error('Sync to Firebase failed:', err);
      });
    }, 500);
  }, [roomConnected, roomCode, myUserId, parties, activePartyId, activeCharacterId, journal, factions, settlements, worldNPCs, timedEvents, lexicon]);

  // Create a new room as GM
  const createRoom = async (playerName, playerPin, roomTitle = '') => {
    const db = initFirebase();
    if (!db) {
      showMultiplayerToast('Firebase není dostupný', 'error');
      return null;
    }

    setMultiplayerStatus('connecting');

    const code = generateRoomCode();
    const oderId = getOrCreateUserId();
    const playerId = generatePlayerId(playerName, playerPin);
    setMyUserId(playerId);

    try {
      const roomRef = db.ref(`rooms/${code}`);

      // Create room with current state
      await roomRef.set({
        meta: {
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          createdBy: playerId,
          name: roomTitle || null, // Custom room name
          players: {
            [playerId]: {
              name: playerName,
              pin: playerPin,
              isGM: true,
              deviceId: oderId,
              joinedAt: firebase.database.ServerValue.TIMESTAMP
            }
          }
        },
        state: {
          ...getGameStateForSync(),
          _lastModified: firebase.database.ServerValue.TIMESTAMP,
          _lastModifiedBy: playerId
        }
      });

      // Setup presence
      const presenceRefPath = db.ref(`rooms/${code}/presence/${playerId}`);
      presenceRefPath.set({ online: true, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRefPath.onDisconnect().set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRef.current = presenceRefPath;

      // Listen for state changes from others
      const stateRef = db.ref(`rooms/${code}/state`);
      lastSyncTimestampRef.current = Date.now(); // Initialize timestamp
      stateRef.on('value', (snapshot) => {
        const state = snapshot.val();
        if (state && state._lastModifiedBy !== playerId) {
          // Only show toast if timestamp actually changed (not duplicate event)
          if (state._lastModified && state._lastModified !== lastSyncTimestampRef.current) {
            lastSyncTimestampRef.current = state._lastModified;
            isSyncingFromRemoteRef.current = true;
            applyGameState(state, state._lastModifiedBy);
            setTimeout(() => { isSyncingFromRemoteRef.current = false; }, 500);
            // Don't show toast - it's annoying. Just silently sync.
          }
        }
      });
      roomListenerRef.current = stateRef;

      // Listen for players
      const playersRef = db.ref(`rooms/${code}/meta/players`);
      playersRef.on('value', (snapshot) => {
        const players = snapshot.val() || {};
        const playerList = Object.entries(players).map(([id, p]) => ({
          oderId: id,
          ...p
        }));
        setRoomPlayers(playerList);
      });
      playersListenerRef.current = playersRef;

      setRoomCode(code);
      setRoomName(roomTitle || null);
      setCurrentGmPin(playerPin);
      setRoomConnected(true);
      setIsGM(true);
      setMultiplayerStatus('connected');
      setShowCreateRoomDialog(false);
      setShowRoomCreatedDialog(true); // Show dialog with code

      // Save credentials for auto-reconnect
      localStorage.setItem('mausritter-room-credentials', JSON.stringify({
        roomCode: code,
        roomName: roomTitle || null,
        playerName,
        playerPin,
        isGM: true
      }));

      return code;
    } catch (err) {
      console.error('Create room error:', err);
      setMultiplayerStatus('disconnected');
      showMultiplayerToast('Chyba při vytváření místnosti', 'error');
      return null;
    }
  };

  // Join existing room - find player by name+PIN or create new
  const joinRoom = async (code, playerName, playerPin) => {
    const db = initFirebase();
    if (!db) {
      showMultiplayerToast('Firebase není dostupný', 'error');
      return false;
    }

    setMultiplayerStatus('connecting');
    const normalizedCode = code.toUpperCase().trim();
    const oderId = getOrCreateUserId();
    const playerId = generatePlayerId(playerName, playerPin);
    setMyUserId(playerId);

    try {
      const roomRef = db.ref(`rooms/${normalizedCode}`);
      const snapshot = await roomRef.get();

      if (!snapshot.exists()) {
        setMultiplayerStatus('disconnected');
        showMultiplayerToast('Místnost neexistuje', 'error');
        return false;
      }

      const roomData = snapshot.val();
      const players = roomData.meta?.players || {};

      // Find existing player with same name+PIN (should match our generated playerId)
      const existingPlayer = players[playerId];

      // Check if name is taken with different PIN
      const nameTaken = Object.entries(players).some(([id, p]) =>
        p.name === playerName && id !== playerId
      );
      if (nameTaken && !existingPlayer) {
        setMultiplayerStatus('disconnected');
        showMultiplayerToast('Toto jméno je již použito s jiným PINem!', 'error');
        return false;
      }

      const amIGM = existingPlayer?.isGM || false;

      // Update or create player record
      await db.ref(`rooms/${normalizedCode}/meta/players/${playerId}`).update({
        name: playerName,
        pin: playerPin,
        isGM: amIGM,
        deviceId: oderId,
        joinedAt: existingPlayer?.joinedAt || firebase.database.ServerValue.TIMESTAMP
      });

      // Setup presence
      const presenceRefPath = db.ref(`rooms/${normalizedCode}/presence/${playerId}`);
      presenceRefPath.set({ online: true, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRefPath.onDisconnect().set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRef.current = presenceRefPath;

      // Load current state from Firebase (prevent auto-save during load)
      isLoadingFromFirebaseRef.current = true;
      if (roomData.state) {
        // Pass 'initial' as fromUserId to ensure it's never equal to myUserId
        applyGameState(roomData.state, 'initial');
      }
      // Use timeout to ensure React state updates are applied before re-enabling auto-save
      setTimeout(() => {
        isLoadingFromFirebaseRef.current = false;
      }, 500);

      // Listen for state changes
      const stateRef = db.ref(`rooms/${normalizedCode}/state`);
      lastSyncTimestampRef.current = roomData.state?._lastModified || Date.now();
      stateRef.on('value', (snapshot) => {
        const state = snapshot.val();
        if (state && state._lastModifiedBy !== playerId) {
          // Only sync if timestamp actually changed (not duplicate event)
          if (state._lastModified && state._lastModified !== lastSyncTimestampRef.current) {
            lastSyncTimestampRef.current = state._lastModified;
            isSyncingFromRemoteRef.current = true;
            applyGameState(state, state._lastModifiedBy);
            setTimeout(() => { isSyncingFromRemoteRef.current = false; }, 500);
            // Don't show toast - it's annoying. Just silently sync.
          }
        }
      });
      roomListenerRef.current = stateRef;

      // Listen for players
      const playersRef = db.ref(`rooms/${normalizedCode}/meta/players`);
      playersRef.on('value', (snapshot) => {
        const playersData = snapshot.val() || {};
        const playerList = Object.entries(playersData).map(([id, p]) => ({
          oderId: id,
          ...p
        }));
        setRoomPlayers(playerList);
      });
      playersListenerRef.current = playersRef;

      const fetchedRoomName = roomData.meta?.name || null;
      setRoomCode(normalizedCode);
      setRoomName(fetchedRoomName);
      setCurrentGmPin(playerPin);
      setRoomConnected(true);
      setIsGM(amIGM);
      setMultiplayerStatus('connected');
      setShowJoinRoomDialog(false);

      // Save credentials for auto-reconnect
      localStorage.setItem('mausritter-room-credentials', JSON.stringify({
        roomCode: normalizedCode,
        roomName: fetchedRoomName,
        playerName,
        playerPin,
        isGM: amIGM
      }));

      const statusMsg = existingPlayer
        ? (amIGM ? 'Připojeno jako GM!' : `Vítej zpět, ${playerName}!`)
        : `Připojeno jako nový hráč!`;
      showMultiplayerToast(statusMsg, 'success');

      return true;
    } catch (err) {
      console.error('Join room error:', err);
      setMultiplayerStatus('disconnected');
      showMultiplayerToast('Chyba při připojování', 'error');
      return false;
    }
  };

  // Leave room
  const leaveRoom = () => {
    if (roomListenerRef.current) {
      roomListenerRef.current.off();
      roomListenerRef.current = null;
    }

    if (playersListenerRef.current) {
      playersListenerRef.current.off();
      playersListenerRef.current = null;
    }

    if (presenceRef.current) {
      presenceRef.current.set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRef.current = null;
    }

    useMultiplayerStore.getState().leaveRoom();
    setMyUserId(null);
    lastSyncTimestampRef.current = null;
    localStorage.removeItem('mausritter-room-credentials');

    // Restore local data from default localStorage slot
    try {
      const localSave = localStorage.getItem('mausritter-save');
      if (localSave) {
        const data = JSON.parse(localSave);
        const migrated = migrateSaveData(data);
        loadGameState(migrated);
      }
    } catch (e) {
      console.error('Failed to restore local save:', e);
    }

    showMultiplayerToast('Odpojeno z místnosti', 'info');
  };

  // Kick player from room (GM only)
  const kickPlayer = async (playerId, playerName) => {
    if (!isGM || !roomCode) return;

    const db = initFirebase();
    if (!db) return;

    try {
      // Remove player from players list
      await db.ref(`rooms/${roomCode}/meta/players/${playerId}`).remove();
      // Remove player presence
      await db.ref(`rooms/${roomCode}/presence/${playerId}`).remove();
      showMultiplayerToast(`${playerName} byl vyhozen z místnosti`, 'success');
    } catch (err) {
      console.error('Kick player error:', err);
      showMultiplayerToast('Chyba při vyhazování hráče', 'error');
    }
  };

  // Copy room link to clipboard
  const copyRoomLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#room=${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      showMultiplayerToast('Odkaz zkopírován!', 'success');
    });
  };

  // Copy room code to clipboard
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      showMultiplayerToast('Kód zkopírován!', 'success');
    });
  };

  // Sync to Firebase when state changes
  useEffect(() => {
    if (roomConnected) {
      syncToFirebase();
    }
  }, [roomConnected, parties, activePartyId, journal, factions, settlements, worldNPCs, timedEvents, lexicon]);

  // Check URL for room code on mount
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/room=([A-Z0-9]{6})/i);
    if (match) {
      const code = match[1].toUpperCase();
      // Show join dialog with pre-filled code
      setShowJoinRoomDialog(true);
      // Store code for the dialog
      window._pendingRoomCode = code;
    }
  }, []);

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
    timedEvents,
    lexicon,
    lastModified: new Date().toISOString()
  }), [parties, activePartyId, activeCharacterId, journal, factions, settlements, worldNPCs, timedEvents, lexicon]);

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
      loadGameState(data);
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
              // Folder was deleted or trashed - clear localStorage and show dialog
              console.warn('Saved folder no longer exists, showing folder choice');
              localStorage.removeItem('googleDriveFolderId');
              localStorage.removeItem('googleDriveFolderName');
              setPendingToken(response.access_token);
              setShowFolderChoice(true);
            }
          } catch (err) {
            console.error('Folder verification failed:', err);
            localStorage.removeItem('googleDriveFolderId');
            localStorage.removeItem('googleDriveFolderName');
            setPendingToken(response.access_token);
            setShowFolderChoice(true);
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
        .setOrigin(window.location.origin)
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
      // Search for all JSON files in folder
      const query = folderId
        ? `mimeType='application/json' and '${folderId}' in parents and trashed=false`
        : `mimeType='application/json' and trashed=false`;
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const searchData = await searchResponse.json();

      const cloudFiles = searchData.files || [];
      const mainSaveFile = cloudFiles.find(f => f.name === 'mausritter-save.json');
      const hasCloudFile = !!mainSaveFile;
      const localSave = localStorage.getItem('mausritter-save');
      const hasLocalData = localSave && localSave.length > 10; // More than just empty object

      // Always show direction choice dialog when connecting
      if (hasCloudFile || hasLocalData || cloudFiles.length > 0) {
        setShowSyncDirectionChoice({
          token,
          folderId,
          cloudFileId: mainSaveFile?.id || null,
          cloudModifiedTime: mainSaveFile?.modifiedTime || null,
          hasCloudFile,
          hasLocalData,
          cloudFiles // All JSON files in folder
        });
        return; // Wait for user decision
      }

      // Neither cloud nor local data - just create new empty file
      await saveToGoogleDrive(token, null, folderId);
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

  // Sync direction choice handlers
  const handleSyncUpload = async () => {
    if (!showSyncDirectionChoice) return;
    const { token, folderId, cloudFiles } = showSyncDirectionChoice;

    // Check if file with this name already exists
    const existingFile = cloudFiles?.find(f => f.name === syncSaveFileName);

    if (existingFile) {
      // Show confirmation dialog
      setShowSyncConfirm({
        token,
        folderId,
        existingFileId: existingFile.id,
        existingFileName: existingFile.name,
        existingModifiedTime: existingFile.modifiedTime
      });
    } else {
      // No existing file - save directly with custom name
      setShowSyncDirectionChoice(null);
      await saveToGoogleDriveWithName(token, null, folderId, syncSaveFileName);
    }
  };

  // Confirm overwrite
  const handleSyncConfirmOverwrite = async () => {
    if (!showSyncConfirm) return;
    const { token, folderId, existingFileId } = showSyncConfirm;
    setShowSyncConfirm(null);
    setShowSyncDirectionChoice(null);
    await saveToGoogleDriveWithName(token, existingFileId, folderId, syncSaveFileName);
  };

  const handleSyncConfirmCancel = () => {
    setShowSyncConfirm(null);
    // Go back to direction choice dialog
  };

  const handleSyncDownload = async () => {
    if (!showSyncDirectionChoice) return;
    const { token, cloudFileId } = showSyncDirectionChoice;
    setShowSyncDirectionChoice(null);
    if (cloudFileId) {
      // Download from cloud (overwrite local)
      setGoogleDriveFileId(cloudFileId);
      await loadFromGoogleDrive(token, cloudFileId);
      setGoogleLastSync(new Date());
    } else {
      // No cloud file - nothing to download
      alert('Na Google Drive není žádný uložený soubor.');
    }
  };

  const handleSyncCancel = () => {
    setShowSyncDirectionChoice(null);
    setSyncSaveFileName('mausritter-save.json'); // Reset filename
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
    useSyncStore.getState().disconnectGoogleDrive();
    localStorage.removeItem('googleDriveFolderId');
    localStorage.removeItem('googleDriveFolderName');
  };

  // Open file picker to load existing save from Google Drive
  const openGoogleDriveFilePicker = () => {
    if (!googleAccessToken || !googleDriveFolderId) return;

    gapi.load('picker', () => {
      const picker = new google.picker.PickerBuilder()
        .setOAuthToken(googleAccessToken)
        .setDeveloperKey(GOOGLE_API_KEY)
        .setOrigin(window.location.origin)
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
      loadGameState(data);

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
    loadGameState({});

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

  // Save to Google Drive with custom filename
  const saveToGoogleDriveWithName = async (token, fileId, folderId, fileName) => {
    if (!token) return;

    try {
      setGoogleSyncStatus('saving');
      const data = getSaveData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

      if (fileId) {
        // Update existing file (also update name if different)
        const updateMetadata = { name: fileName };
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateMetadata)
        });
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: blob
        });
        setGoogleDriveFileId(fileId);
        setGoogleDriveFileName(fileName);
      } else {
        // Create new file with custom name
        const metadata = {
          name: fileName,
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
      setSyncSaveFileName('mausritter-save.json'); // Reset for next time
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
      loadGameState(data);
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
    { id: 'playarea',  label: 'Hrací Plocha', icon: '🎲' },
    { id: 'journal',   label: 'Deník',         icon: '📖' },
    { id: 'character', label: 'Postavy',        icon: '🐭' },
    { id: 'oracle',    label: 'Věštírna',       icon: '🔮' },
    { id: 'timehub',   label: 'Čas',            icon: '🗓️' },
    { id: 'worldhub',  label: 'Svět',           icon: '🌍' },
    { id: 'tools',     label: 'Nástroje',       icon: '🗺️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Session Start Screen */}
      {showSessionStart && (
        <SessionStartScreen onContinue={() => setShowSessionStart(false)} />
      )}

      {/* Session End Dialog */}
      {showSessionEnd && (
        <SessionEndDialog onClose={() => setShowSessionEnd(false)} />
      )}

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

      {/* Sync Direction Choice Dialog */}
      {showSyncDirectionChoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🔄</span> Co chceš udělat?
            </h3>
            <div className="space-y-3 mb-6">
              {showSyncDirectionChoice.hasLocalData && (
                <div className="flex items-center gap-2 bg-stone-700 p-3 rounded">
                  <span className="text-amber-400">💾</span>
                  <span className="text-stone-300">Máš lokální data v prohlížeči</span>
                </div>
              )}
              {showSyncDirectionChoice.cloudFiles && showSyncDirectionChoice.cloudFiles.length > 0 && (
                <div className="bg-stone-700 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400">☁️</span>
                    <span className="text-stone-300">Soubory na Drive:</span>
                  </div>
                  <div className="ml-6 space-y-1 max-h-32 overflow-y-auto">
                    {showSyncDirectionChoice.cloudFiles.map((file, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className={file.name === 'mausritter-save.json' ? 'text-amber-400 font-medium' : 'text-stone-400'}>
                          {file.name}
                        </span>
                        <span className="text-stone-500">
                          {new Date(file.modifiedTime).toLocaleString('cs-CZ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showSyncDirectionChoice.cloudFiles && showSyncDirectionChoice.cloudFiles.length === 0 && (
                <div className="flex items-center gap-2 bg-stone-700 p-3 rounded">
                  <span className="text-stone-500">☁️</span>
                  <span className="text-stone-400">Složka na Drive je prázdná</span>
                </div>
              )}
              {showSyncDirectionChoice.hasLocalData && (
                <div className="bg-stone-700/50 p-3 rounded">
                  <label className="text-stone-400 text-sm block mb-1">Uloží se jako:</label>
                  <input
                    type="text"
                    value={syncSaveFileName}
                    onChange={(e) => setSyncSaveFileName(e.target.value.endsWith('.json') ? e.target.value : e.target.value + '.json')}
                    className="w-full bg-stone-700 text-amber-400 font-mono px-3 py-2 rounded border border-stone-600 focus:border-amber-500 focus:outline-none"
                  />
                  {showSyncDirectionChoice.cloudFiles?.some(f => f.name === syncSaveFileName) && (
                    <span className="text-red-400 text-sm mt-1 block">⚠️ Soubor s tímto názvem již existuje</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {showSyncDirectionChoice.hasLocalData && (
                <button
                  onClick={handleSyncUpload}
                  className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>💾</span> Uložit na Drive
                </button>
              )}
              {showSyncDirectionChoice.hasCloudFile && (
                <button
                  onClick={handleSyncDownload}
                  className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>📂</span> Načíst z Drive
                </button>
              )}
              <button
                onClick={handleSyncCancel}
                className="w-full px-4 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
              >
                Zrušit připojení
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Confirm Overwrite Dialog */}
      {showSyncConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm mx-4 shadow-2xl border border-red-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
              <span>⚠️</span> Přepsat soubor?
            </h3>
            <div className="space-y-3 mb-6">
              <p className="text-stone-300">
                Soubor <span className="text-amber-400 font-mono">{showSyncConfirm.existingFileName}</span> už existuje.
              </p>
              <div className="bg-stone-700 p-3 rounded text-sm">
                <span className="text-stone-400">Naposledy upraven: </span>
                <span className="text-stone-300">
                  {new Date(showSyncConfirm.existingModifiedTime).toLocaleString('cs-CZ')}
                </span>
              </div>
              <p className="text-red-400 text-sm">
                Tato akce je nevratná!
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSyncConfirmOverwrite}
                className="w-full px-4 py-3 bg-red-700 hover:bg-red-600 rounded font-medium transition-colors"
              >
                Ano, přepsat
              </button>
              <button
                onClick={handleSyncConfirmCancel}
                className="w-full px-4 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
              >
                Zpět
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

      {/* Multiplayer Toast */}
      {multiplayerToast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-[200] animate-pulse ${
          multiplayerToast.type === 'success' ? 'bg-green-600 text-green-100' :
          multiplayerToast.type === 'error' ? 'bg-red-600 text-red-100' :
          'bg-purple-600 text-purple-100'
        }`}>
          {multiplayerToast.message}
        </div>
      )}

      {/* Create Room Dialog */}
      {showCreateRoomDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl border border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🎮</span> Vytvořit místnost
            </h3>
            <p className="text-stone-300 mb-4 text-sm">
              Vytvoř multiplayer místnost a pozvi kamaráda.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Název místnosti</label>
              <input
                type="text"
                id="create-room-title"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none"
                placeholder="např. Sobotní sešlost"
              />
              <p className="text-stone-400 text-xs mt-1">Pro lepší zapamatování</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvoje jméno</label>
              <input
                type="text"
                id="create-room-name"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none"
                placeholder="Zadej své jméno..."
                defaultValue={activeParty?.name || 'GM'}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvůj PIN (4 číslice)</label>
              <input
                type="text"
                id="create-room-pin"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none tracking-widest text-center text-lg font-mono"
                placeholder="1234"
                maxLength={4}
              />
              <p className="text-stone-400 text-xs mt-1">Pro přihlášení z jiného zařízení</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateRoomDialog(false)}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => {
                  const titleInput = document.getElementById('create-room-title');
                  const nameInput = document.getElementById('create-room-name');
                  const pinInput = document.getElementById('create-room-pin');
                  const title = titleInput?.value?.trim() || '';
                  const name = nameInput?.value?.trim() || 'GM';
                  const pin = pinInput?.value?.trim() || '';
                  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                    showMultiplayerToast('PIN musí být 4 číslice!', 'error');
                    return;
                  }
                  createRoom(name, pin, title);
                }}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded font-medium transition-colors"
              >
                Vytvořit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Dialog */}
      {showJoinRoomDialog && (() => {
        const savedCreds = JSON.parse(localStorage.getItem('mausritter-room-credentials') || 'null');
        return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl border border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🚪</span> Připojit se k místnosti
            </h3>
            <p className="text-stone-300 mb-4 text-sm">
              Zadej kód místnosti a svoje přihlašovací údaje.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Kód místnosti</label>
              <input
                type="text"
                id="join-room-code"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none uppercase tracking-widest text-center text-lg font-mono"
                placeholder="ABC123"
                maxLength={6}
                defaultValue={window._pendingRoomCode || savedCreds?.roomCode || ''}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvoje jméno</label>
              <input
                type="text"
                id="join-room-name"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none"
                placeholder="Zadej své jméno..."
                defaultValue={savedCreds?.playerName || ''}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvůj PIN (4 číslice)</label>
              <input
                type="text"
                id="join-room-pin"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none tracking-widest text-center text-lg font-mono"
                placeholder="1234"
                maxLength={4}
                defaultValue={savedCreds?.playerPin || ''}
              />
              <p className="text-stone-400 text-xs mt-1">Zvol si nebo zadej stejný jako minule</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinRoomDialog(false);
                  window._pendingRoomCode = null;
                }}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => {
                  const codeInput = document.getElementById('join-room-code');
                  const nameInput = document.getElementById('join-room-name');
                  const pinInput = document.getElementById('join-room-pin');
                  const code = codeInput?.value?.trim() || '';
                  const name = nameInput?.value?.trim() || '';
                  const pin = pinInput?.value?.trim() || '';
                  if (code.length !== 6) {
                    showMultiplayerToast('Kód místnosti musí mít 6 znaků!', 'error');
                    return;
                  }
                  if (!name) {
                    showMultiplayerToast('Zadej svoje jméno!', 'error');
                    return;
                  }
                  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                    showMultiplayerToast('PIN musí být 4 číslice!', 'error');
                    return;
                  }
                  if (code.length === 6) {
                    joinRoom(code, name, pin);
                    window._pendingRoomCode = null;
                  }
                }}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded font-medium transition-colors"
              >
                Připojit
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Room Created Dialog - shows room code */}
      {showRoomCreatedDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl border border-green-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
              <span>✓</span> {roomName ? `"${roomName}" vytvořena!` : 'Místnost vytvořena!'}
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-stone-400">Kód pro připojení</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-stone-700 rounded text-2xl font-mono tracking-widest text-center">
                  {roomCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    showMultiplayerToast('Kód zkopírován!', 'success');
                  }}
                  className="px-3 py-3 bg-stone-600 hover:bg-stone-500 rounded transition-colors"
                  title="Kopírovat"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="bg-stone-700/50 rounded p-3 mb-4 text-sm text-stone-300">
              <strong>💡 Tip:</strong> Pošli tento kód hráčům. Každý si zvolí svoje jméno a PIN pro přihlášení.
            </div>
            <button
              onClick={() => setShowRoomCreatedDialog(false)}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 rounded font-medium transition-colors"
            >
              Rozumím, zavřít
            </button>
          </div>
        </div>
      )}

      {/* Players List Dialog */}
      {showPlayersDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👥</span> {roomName ? roomName : 'Hráči v místnosti'}
              <span className="ml-auto text-sm font-normal text-purple-300" title={`Kód: ${roomCode}`}>
                🎮 {roomCode}
              </span>
            </h3>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {roomPlayers.map((player) => {
                const isMe = player.oderId === myUserId;
                return (
                <div
                  key={player.oderId}
                  className={`flex items-center gap-3 p-3 rounded ${
                    isMe
                      ? 'bg-green-900/40 border-2 border-green-500'
                      : player.isGM
                        ? 'bg-purple-900/40 border border-purple-500'
                        : 'bg-stone-700'
                  }`}
                >
                  <span className="text-2xl">
                    {player.isGM ? '👑' : '🐭'}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {player.name}
                      {isMe && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-600 rounded text-green-100">ty</span>
                      )}
                      {player.isGM && (
                        <span className="text-xs px-1.5 py-0.5 bg-purple-600 rounded text-purple-100">GM</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400">
                      PIN: ****
                    </div>
                  </div>
                  {/* Kick button - only for GM, not for self */}
                  {isGM && !player.isGM && (
                    <button
                      onClick={() => kickPlayer(player.oderId, player.name)}
                      className="px-2 py-1 bg-red-600/50 hover:bg-red-600 rounded text-xs transition-colors"
                      title="Vyhodit hráče"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
              })}
              {roomPlayers.length === 0 && (
                <div className="text-center text-stone-400 py-4">
                  Žádní hráči
                </div>
              )}
            </div>
            <div className="bg-stone-700/50 rounded p-3 mb-4 text-sm text-stone-300">
              <strong>💡</strong> Kód místnosti: <span className="font-mono text-purple-300">{roomCode}</span>
              <br />
              Hráči se připojí zadáním kódu + svého jména a PINu.
            </div>
            <button
              onClick={() => setShowPlayersDialog(false)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded font-medium transition-colors"
            >
              Zavřít
            </button>
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
                  <>
                    <button
                      type="button"
                      onClick={connectGoogleDrive}
                      className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium transition-colors cursor-pointer"
                      title="Připojit Google Drive"
                    >
                      ☁️ Připojit Drive
                    </button>
                    <button
                      onClick={() => setShowNewGameDialog(true)}
                      className="text-xs px-2 py-1.5 rounded bg-amber-600 text-amber-100 hover:bg-amber-500 cursor-pointer transition-colors"
                      title="Nová hra - vymazat vše"
                    >
                      🆕 New
                    </button>
                  </>
                )}
              </div>

              {/* Multiplayer */}
              <div className="flex items-center gap-1 border-l border-amber-700 pl-2 ml-1">
                {roomConnected ? (() => {
                  const myPlayer = roomPlayers.find(p => p.oderId === myUserId);
                  return (
                  <>
                    <span
                      className={`text-xs px-2 py-1 rounded ${isGM ? 'bg-purple-600 text-purple-100' : 'bg-green-600 text-green-100'}`}
                      title={myPlayer ? `Přihlášen jako: ${myPlayer.name} (${isGM ? 'GM' : 'hráč'})` : ''}
                    >
                      {isGM ? '👑' : '🐭'} {myPlayer?.name || (isGM ? 'GM' : 'Hráč')}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-stone-600 text-stone-300" title={`Kód: ${roomCode}`}>
                      🎮 {roomName || roomCode}
                    </span>
                    <button
                      onClick={() => setShowPlayersDialog(true)}
                      className="text-xs px-1.5 py-1 bg-purple-600/70 hover:bg-purple-500 rounded transition-colors"
                      title="Zobrazit hráče"
                    >
                      👥{roomPlayers.length}
                    </button>
                    <button
                      onClick={copyRoomLink}
                      className="px-1.5 py-1 bg-purple-600/70 hover:bg-purple-500 rounded text-xs transition-colors"
                      title="Kopírovat odkaz na místnost"
                    >
                      📋
                    </button>
                    <button
                      onClick={leaveRoom}
                      className="px-1.5 py-1 bg-purple-600/50 hover:bg-red-600 rounded text-xs transition-colors"
                      title="Opustit místnost"
                    >
                      ✕
                    </button>
                  </>
                );})() : (
                  <>
                    {/* Quick reconnect button if credentials saved */}
                    {(() => {
                      const saved = localStorage.getItem('mausritter-room-credentials');
                      if (saved) {
                        const creds = JSON.parse(saved);
                        return (
                          <button
                            onClick={() => joinRoom(creds.roomCode, creds.playerName, creds.playerPin)}
                            className="px-2 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs font-medium transition-colors"
                            title={`Rychlé připojení: ${creds.roomCode} jako ${creds.playerName}`}
                          >
                            ⚡ {creds.roomName || creds.roomCode}
                          </button>
                        );
                      }
                      return null;
                    })()}
                    <button
                      onClick={() => setShowCreateRoomDialog(true)}
                      className="px-2 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-xs font-medium transition-colors"
                      title="Vytvořit multiplayer místnost (jako GM)"
                    >
                      🎮 Místnost
                    </button>
                    <button
                      onClick={() => setShowJoinRoomDialog(true)}
                      className="px-2 py-1.5 bg-purple-600/70 hover:bg-purple-500 rounded text-xs font-medium transition-colors"
                      title="Připojit se k místnosti (jako hráč)"
                    >
                      🚪
                    </button>
                  </>
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

              {/* Multiplayer */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-700">
                <span className="text-sm">🎮 Multiplayer</span>
                {roomConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-purple-600">
                      {roomCode} • 👥{roomPlayers.length}
                    </span>
                    <button
                      onClick={() => { copyRoomLink(); setMobileMenuOpen(false); }}
                      className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => { leaveRoom(); setMobileMenuOpen(false); }}
                      className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setShowCreateRoomDialog(true); setMobileMenuOpen(false); }}
                      className="px-2 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-xs font-medium"
                    >
                      Vytvořit
                    </button>
                    <button
                      onClick={() => { setShowJoinRoomDialog(true); setMobileMenuOpen(false); }}
                      className="px-2 py-1.5 bg-purple-600/70 hover:bg-purple-500 rounded text-xs font-medium"
                    >
                      Připojit
                    </button>
                  </div>
                )}
              </div>

              {/* New Game button - always visible */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-700">
                <span className="text-sm">🆕 Nová hra</span>
                <button
                  onClick={() => { setShowNewGameDialog(true); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium"
                >
                  Vymazat vše
                </button>
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
          <div className="flex gap-1 overflow-x-auto lg:overflow-visible py-2 scrollbar-hide">
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

      {/* Character Tabs - Mobile only */}
      {activeParty && (
        <CharacterTabs
          party={activeParty}
          activeCharacterId={sidePanelCharacter?.id}
          onCharacterClick={(character) => setSidePanelCharacter(character)}
        />
      )}

      {/* Character Side Panel - Mobile slide-out */}
      <CharacterSidePanel
        isOpen={!!sidePanelCharacter}
        onClose={() => setSidePanelCharacter(null)}
        character={sidePanelCharacter}
        updateCharacter={(updates) => {
          if (sidePanelCharacter && activePartyId) {
            updateCharacterInParty(activePartyId, sidePanelCharacter.id, updates);
            // Update local state to reflect changes
            setSidePanelCharacter(sidePanelCharacter ? { ...sidePanelCharacter, ...updates } : null);
          }
        }}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 overflow-hidden">
        {activePanel === 'playarea'  && <PlayArea />}
        {activePanel === 'journal'   && <JournalPanel onExport={handleExport} />}
        {activePanel === 'character' && <CharacterPanel />}
        {activePanel === 'oracle'    && <OraclePanel />}
        {activePanel === 'timehub'   && <TimeHub />}
        {activePanel === 'worldhub'  && <WorldHub />}
        {activePanel === 'tools'     && <ToolsHub />}
      </main>

      {/* TimeBar - sledování času (jen pokud je aktivní družina) */}
      {activeParty && <TimeBar />}

      {/* Plovoucí kostky - vždy viditelné */}
      <FloatingDice />

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-200 text-center py-4 mt-8">
        <p className="text-sm">
          🐭 Mausritter Solo Companion • Pro sólo hráče Mausritter RPG
        </p>
        <button
          onClick={() => setShowSessionEnd(true)}
          className="mt-2 text-xs text-amber-400 hover:text-amber-200 underline transition-colors"
        >
          🌙 Ukončit session
        </button>
      </footer>
    </div>
  );
}


export { MausritterSoloCompanion };

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useGameStore } from '../../stores/gameStore';
import { Button, SectionHeader } from '../ui/common';

// Inner component that has access to tldraw's useEditor hook
const MapEditorInner = ({ mapId }: { mapId: string }) => {
  const editor = useEditor();
  const updateMapData = useGameStore(s => s.updateMapData);
  const maps = useGameStore(s => s.maps);
  const isLoadingRef = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load snapshot on mount
  useEffect(() => {
    const map = maps.find(m => m.id === mapId);
    if (map?.data && editor) {
      try {
        editor.store.loadStoreSnapshot(map.data as any);
      } catch (e) {
        console.warn('Failed to load map snapshot:', e);
      }
    }
    // Mark loading complete after a tick
    requestAnimationFrame(() => {
      isLoadingRef.current = false;
    });
  }, [editor, mapId]);

  // Listen to store changes and debounce save
  useEffect(() => {
    if (!editor) return;

    const cleanup = editor.store.listen(
      () => {
        if (isLoadingRef.current) return;

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          const snapshot = editor.store.getStoreSnapshot();
          updateMapData(mapId, snapshot as any);
        }, 2000);
      },
      { scope: 'document', source: 'user' }
    );

    return () => {
      cleanup();
      if (saveTimeoutRef.current) {
        // Save immediately on unmount
        clearTimeout(saveTimeoutRef.current);
        const snapshot = editor.store.getStoreSnapshot();
        updateMapData(mapId, snapshot as any);
      }
    };
  }, [editor, mapId, updateMapData]);

  return null;
};

const MapPanel = () => {
  const { maps, activeMapId, setActiveMapId, createMap, deleteMap, renameMap } = useGameStore();
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const activeMap = maps.find(m => m.id === activeMapId);

  const handleCreate = () => {
    createMap();
  };

  const handleDelete = (mapId: string) => {
    const map = maps.find(m => m.id === mapId);
    if (map && confirm(`Smazat mapu "${map.name}"?`)) {
      deleteMap(mapId);
    }
  };

  const startRename = (mapId: string, currentName: string) => {
    setEditingName(mapId);
    setNameValue(currentName);
    setTimeout(() => nameInputRef.current?.select(), 50);
  };

  const finishRename = () => {
    if (editingName && nameValue.trim()) {
      renameMap(editingName, nameValue.trim());
    }
    setEditingName(null);
  };

  // Empty state
  if (maps.length === 0) {
    return (
      <div className="space-y-4">
        <SectionHeader title="Mapy" />
        <div className="text-center py-12 text-stone-500">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="mb-4">Zatím nemáte žádné mapy.</p>
          <Button onClick={handleCreate}>+ Nová mapa</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SectionHeader title="Mapy" />

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={activeMapId || ''}
          onChange={(e) => setActiveMapId(e.target.value || null)}
          className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-stone-300 rounded-lg bg-white"
        >
          {maps.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <Button onClick={handleCreate}>+ Nová</Button>
      </div>

      {/* Active map controls */}
      {activeMap && (
        <>
          <div className="flex items-center gap-2">
            {editingName === activeMap.id ? (
              <input
                ref={nameInputRef}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={finishRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishRename();
                  if (e.key === 'Escape') setEditingName(null);
                }}
                className="flex-1 px-2 py-1 text-sm border border-amber-400 rounded focus:outline-none"
                autoFocus
              />
            ) : (
              <span
                className="flex-1 text-sm font-medium text-stone-700 cursor-pointer hover:text-amber-700"
                onClick={() => startRename(activeMap.id, activeMap.name)}
                title="Klikni pro přejmenování"
              >
                {activeMap.name}
              </span>
            )}
            <button
              onClick={() => handleDelete(activeMap.id)}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
              title="Smazat mapu"
            >
              🗑️
            </button>
          </div>

          {/* tldraw editor */}
          <div
            className="border border-stone-300 rounded-lg overflow-hidden"
            style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}
          >
            <Tldraw key={activeMap.id}>
              <MapEditorInner mapId={activeMap.id} />
            </Tldraw>
          </div>
        </>
      )}
    </div>
  );
};

export default MapPanel;

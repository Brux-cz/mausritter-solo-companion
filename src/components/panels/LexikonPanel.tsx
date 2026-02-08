import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { LEXICON_CATEGORIES } from '../../data/constants';
import { generateId } from '../../utils/helpers';
import { SectionHeader, ResultCard, Button, HelpHeader, Input } from '../ui/common';

const LexikonPanel = () => {
  const { lexicon, setLexicon, journal } = useGameStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);

  // Přidání nové položky
  const addItem = (category = 'lokace') => {
    const newItem = {
      id: generateId(),
      name: 'Nová položka',
      category,
      description: '',
      imageData: null,
      createdAt: new Date().toISOString(),
      sourceEntryId: null
    };
    setLexicon([newItem, ...lexicon]);
    setSelectedItem(newItem.id);
    setEditingItem(newItem.id);
  };

  // Aktualizace položky
  const updateItem = (id, updates) => {
    setLexicon(lexicon.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // Smazání položky
  const removeItem = (id) => {
    setLexicon(lexicon.filter(item => item.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  // Nahrání obrázku
  const handleImageUpload = (itemId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Limit velikosti na 500KB pro localStorage
    if (file.size > 500 * 1024) {
      alert('Obrázek je příliš velký. Maximum je 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      updateItem(itemId, { imageData: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Filtrované položky
  const filteredItems = lexicon.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Seskupení podle kategorií
  const groupedItems = LEXICON_CATEGORIES.map(cat => ({
    ...cat,
    items: filteredItems.filter(item => item.category === cat.id)
  })).filter(cat => filter === 'all' ? cat.items.length > 0 : cat.id === filter);

  // Najdi zdrojový záznam v deníku
  const getSourceEntry = (sourceEntryId) => {
    if (!sourceEntryId || !journal) return null;
    return journal.find(e => e.id === sourceEntryId);
  };

  const selectedItemData = selectedItem ? lexicon.find(i => i.id === selectedItem) : null;

  return (
    <div className="space-y-4">
      <SectionHeader
        icon="📚"
        title="Lexikon"
        subtitle="Encyklopedie tvého světa"
      />

      {/* Vyhledávání a filtry */}
      <ResultCard>
        <div className="space-y-3">
          <Input
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="🔍 Hledat v lexikonu..."
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              Vše ({lexicon.length})
            </button>
            {LEXICON_CATEGORIES.map(cat => {
              const count = lexicon.filter(i => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filter === cat.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {cat.icon} {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </ResultCard>

      {/* Přidat novou položku */}
      <ResultCard>
        <HelpHeader
          title="Přidat položku"
          icon="➕"
          tooltip={
            <div>
              <p className="mb-1">Vytvoř nový záznam v lexikonu:</p>
              <ul className="text-xs space-y-1">
                <li>• Lokace, NPC, stvoření, předměty</li>
                <li>• Pravidla světa, události</li>
                <li>• Přidej popis a obrázek</li>
              </ul>
              <p className="mt-1 text-xs text-stone-300">
                Použij @kategorie:název v deníku pro rychlé vytvoření
              </p>
            </div>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LEXICON_CATEGORIES.slice(0, 4).map(cat => (
            <Button
              key={cat.id}
              onClick={() => addItem(cat.id)}
              size="small"
              className="text-xs"
            >
              {cat.icon} {cat.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {LEXICON_CATEGORIES.slice(4).map(cat => (
            <Button
              key={cat.id}
              onClick={() => addItem(cat.id)}
              size="small"
              variant="secondary"
              className="text-xs"
            >
              {cat.icon} {cat.label}
            </Button>
          ))}
        </div>
      </ResultCard>

      {/* Detail vybrané položky */}
      {selectedItemData && (
        <ResultCard className="border-2 border-amber-500">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
              <button
                onClick={() => { setSelectedItem(null); setEditingItem(null); }}
                className="text-stone-500 hover:text-stone-700"
              >
                ← Zpět
              </button>
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => setEditingItem(editingItem === selectedItem ? null : selectedItem)}
                >
                  {editingItem === selectedItem ? '✓ Hotovo' : '✏️ Upravit'}
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => removeItem(selectedItem)}
                >
                  🗑️
                </Button>
              </div>
            </div>

            {/* Obrázek */}
            <div className="flex justify-center">
              {selectedItemData.imageData ? (
                <div className="relative">
                  <img
                    src={selectedItemData.imageData}
                    alt={selectedItemData.name}
                    className="max-w-full max-h-48 rounded-lg object-contain"
                  />
                  {editingItem === selectedItem && (
                    <button
                      onClick={() => updateItem(selectedItem, { imageData: null })}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ) : editingItem === selectedItem ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(selectedItem, e)}
                    className="hidden"
                  />
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 Nahrát obrázek
                  </Button>
                  <p className="text-xs text-stone-500 mt-1">Max 500KB</p>
                </div>
              ) : null}
            </div>

            {/* Název a kategorie */}
            {editingItem === selectedItem ? (
              <div className="space-y-2">
                <Input
                  value={selectedItemData.name}
                  onChange={(v) => updateItem(selectedItem, { name: v })}
                  placeholder="Název"
                  className="text-xl font-bold"
                />
                <select
                  value={selectedItemData.category}
                  onChange={(e) => updateItem(selectedItem, { category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  {LEXICON_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-amber-900">{selectedItemData.name}</h2>
                <p className="text-stone-500">
                  {LEXICON_CATEGORIES.find(c => c.id === selectedItemData.category)?.icon}{' '}
                  {LEXICON_CATEGORIES.find(c => c.id === selectedItemData.category)?.label}
                </p>
              </div>
            )}

            {/* Popis */}
            {editingItem === selectedItem ? (
              <textarea
                value={selectedItemData.description || ''}
                onChange={(e) => updateItem(selectedItem, { description: e.target.value })}
                placeholder="Popis..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 min-h-[120px] resize-y"
              />
            ) : selectedItemData.description ? (
              <p className="text-stone-700 whitespace-pre-wrap">{selectedItemData.description}</p>
            ) : (
              <p className="text-stone-400 italic">Bez popisu</p>
            )}

            {/* Metadata */}
            <div className="text-xs text-stone-500 border-t pt-2 space-y-1">
              <p>📅 Vytvořeno: {new Date(selectedItemData.createdAt).toLocaleDateString('cs-CZ')}</p>
              {selectedItemData.sourceEntryId && (
                <p>📖 Vzniklo v deníku</p>
              )}
            </div>
          </div>
        </ResultCard>
      )}

      {/* Seznam položek */}
      {!selectedItem && (
        <>
          {lexicon.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-8">
                Lexikon je prázdný. Přidej první položku nebo použij @kategorie:název v deníku.
              </p>
            </ResultCard>
          ) : filteredItems.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-4">
                Žádné výsledky pro "{searchQuery}"
              </p>
            </ResultCard>
          ) : (
            <div className="space-y-4">
              {groupedItems.map(group => (
                <ResultCard key={group.id}>
                  <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">{group.icon}</span>
                    {group.label}
                    <span className="text-stone-400 font-normal">({group.items.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors"
                      >
                        {item.imageData ? (
                          <img
                            src={item.imageData}
                            alt=""
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-stone-200 flex items-center justify-center text-lg">
                            {group.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-800 truncate">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-stone-500 truncate">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};



export { LexikonPanel };

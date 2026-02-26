import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LEXICON_CATEGORIES } from '../../data/constants';

export const DiceDisplay = ({ dice, size = 'normal' }) => {
  const sizeClass = size === 'large' ? 'text-3xl w-14 h-14' : 'text-xl w-10 h-10';
  return (
    <div className="flex gap-2 justify-center">
      {dice.map((d, i) => (
        <div key={i} className={`${sizeClass} bg-amber-100 border-2 border-amber-900 rounded-lg flex items-center justify-center font-bold text-amber-900 shadow-md transform rotate-${Math.floor(Math.random() * 6) - 3}`}>
          {d}
        </div>
      ))}
    </div>
  );
};

export const ResultBadge = ({ result, variant = 'default' }) => {
  const variants = {
    yes: 'bg-green-700 text-green-100',
    no: 'bg-red-800 text-red-100',
    mixed: 'bg-amber-600 text-amber-100',
    default: 'bg-stone-700 text-stone-100'
  };

  let v = variant;
  if (result?.toLowerCase().includes('yes')) v = 'yes';
  else if (result?.toLowerCase().includes('no')) v = 'no';
  else if (result?.includes('...') || result?.includes('but')) v = 'mixed';

  return (
    <span className={`px-4 py-2 rounded-full font-bold text-lg ${variants[v]} shadow-lg`}>
      {result}
    </span>
  );
};

export const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="mb-6 border-b-2 border-amber-900/30 pb-4">
    <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-3">
      <span className="text-3xl">{icon}</span>
      {title}
    </h2>
    {subtitle && <p className="text-stone-600 mt-1 ml-11">{subtitle}</p>}
  </div>
);

export const ResultCard = ({ title, children, className = '' }) => (
  <div className={`bg-amber-50/80 border-2 border-amber-900/20 rounded-xl p-5 shadow-lg overflow-hidden ${className}`}>
    {title && <h3 className="font-bold text-amber-900 mb-3 text-lg border-b border-amber-900/20 pb-2 truncate">{title}</h3>}
    {children}
  </div>
);

export const Button = ({ onClick, children, variant = 'primary', size = 'normal', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-[#E36A6A] hover:bg-[#C84848] text-white border-[#C84848]',
    secondary: 'bg-[#FFD8A8] hover:bg-[#FFC090] text-[#2A1810] border-[#FFC090]',
    danger: 'bg-red-700 hover:bg-red-800 text-white border-red-900',
    success: 'bg-[#5A8A5A] hover:bg-[#4A7A4A] text-white border-[#4A7A4A]',
    ghost: 'bg-transparent hover:bg-amber-100 text-amber-900 border-amber-300'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    normal: 'px-5 py-2.5',
    large: 'px-7 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} font-bold rounded-lg border-2 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
};

export const Tooltip = ({ children }) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setShow(!show)}
        className="w-5 h-5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-800 text-xs font-bold flex items-center justify-center transition-colors cursor-help"
      >
        ?
      </button>
      {show && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShow(false)} />
      )}
      {show && (
        <div
          className="fixed left-2 right-2 sm:absolute sm:left-auto sm:right-0 top-auto sm:top-full mt-2 z-50 sm:w-72 bg-stone-800 text-stone-100 text-sm rounded-lg shadow-xl border border-stone-600"
          style={{ maxHeight: '70vh', overflow: 'hidden' }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div
            className="p-3 overflow-y-auto"
            style={{
              maxHeight: '70vh'
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const HelpHeader = ({ title, tooltip, icon }) => (
  <div className="flex items-center gap-2 mb-2">
    {icon && <span>{icon}</span>}
    <span className="font-bold text-amber-900">{title}</span>
    {tooltip && <Tooltip>{tooltip}</Tooltip>}
  </div>
);

/**
 * MentionInput - textarea s @mentions autocomplete
 * Podporuje NPC a osady jako mentionovatelne entity.
 */
export const MentionInput = ({
  value,
  onChange,
  placeholder,
  npcs = [],
  settlements = [],
  onNPCClick,
  className = '',
  rows = 3
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Kombinovane suggestions - NPC a osady
  const allSuggestions = [
    ...npcs.map(n => ({ type: 'npc', id: n.id, name: n.name, icon: '🐭', subtitle: n.role || n.settlementId ? settlements.find(s => s.id === n.settlementId)?.name : 'Bez domova' })),
    ...settlements.map(s => ({ type: 'settlement', id: s.id, name: s.name, icon: '🏘️', subtitle: s.size }))
  ];

  // Filtrovane suggestions podle toho co uzivatel pise
  const filteredSuggestions = suggestionFilter
    ? allSuggestions.filter(s =>
        s.name.toLowerCase().includes(suggestionFilter.toLowerCase())
      ).slice(0, 8)
    : allSuggestions.slice(0, 8);

  // Detekce @ v textu
  const handleInput = (e) => {
    const newValue = e.target.value;
    const pos = e.target.selectionStart;
    setCursorPosition(pos);
    onChange(newValue);

    // Najdi @ pred kurzorem
    const textBeforeCursor = newValue.slice(0, pos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (atMatch) {
      setSuggestionFilter(atMatch[1]);
      setShowSuggestions(true);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
      setSuggestionFilter('');
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault();
      if (filteredSuggestions[selectedIndex]) {
        insertMention(filteredSuggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Vlozeni mention do textu
  const insertMention = (suggestion) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);

    // Najdi kde zacina @
    const atIndex = textBeforeCursor.lastIndexOf('@');
    const beforeAt = textBeforeCursor.slice(0, atIndex);

    // Format: @[Jmeno](typ:id)
    const mention = `@[${suggestion.name}](${suggestion.type}:${suggestion.id})`;

    const newValue = beforeAt + mention + ' ' + textAfterCursor;
    onChange(newValue);
    setShowSuggestions(false);
    setSuggestionFilter('');

    // Nastav kurzor za mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = beforeAt.length + mention.length + 1;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-stone-300 rounded-lg resize-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none ${className}`}
      />

      <p className="text-xs text-stone-400 mt-1">💡 Napiš @ pro vložení NPC nebo osady</p>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              type="button"
              onClick={() => insertMention(suggestion)}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-amber-50 transition-colors ${
                index === selectedIndex ? 'bg-amber-100' : ''
              }`}
            >
              <span className="text-lg">{suggestion.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-stone-800 truncate">{suggestion.name}</p>
                {suggestion.subtitle && (
                  <p className="text-xs text-stone-500 truncate">{suggestion.subtitle}</p>
                )}
              </div>
              <span className="text-xs text-stone-400 flex-shrink-0">
                {suggestion.type === 'npc' ? 'NPC' : 'Osada'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Prazdny stav */}
      {showSuggestions && filteredSuggestions.length === 0 && suggestionFilter && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg z-50 p-3 text-center text-stone-500">
          Žádné výsledky pro "{suggestionFilter}"
        </div>
      )}
    </div>
  );
};

/**
 * Parsovani textu s mentions - vraci React elementy.
 * Podporuje dva formaty:
 * 1. Stary: @[Jmeno](typ:id) - prime ID
 * 2. Novy: @Jmeno - vyhleda podle jmena v worldNPCs/settlements
 *
 * POZOR: Pouziva LEXICON_CATEGORIES z App.jsx - pri importu je treba predat nebo importovat.
 */
export const parseMentions = (text, onMentionClick, worldNPCs = [], settlements = [], lexicon = [], onLoreClick = null) => {
  if (!text) return null;

  // Helper pro prevod textu s newliny na React elementy
  const textWithBreaks = (str, keyPrefix) => {
    if (!str.includes('\n')) return str;
    return str.split('\n').map((line, i, arr) => (
      <React.Fragment key={`${keyPrefix}-${i}`}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Kombinovany regex pro oba formaty + lore tagy
  // 1. @[Jmeno](typ:id) - skupina 1=name, 2=type, 3=id
  // 2. @kategorie:nazev (lore tag) - skupina 4=category, 5=name
  // 3. @Jmeno (slovo bez mezer, nebo s diakritikou) - skupina 6=name
  const mentionRegex = /@\[([^\]]+)\]\((\w+):([^)]+)\)|@(lokace|npc|stvoreni|predmet|frakce|pravidlo|udalost):([^\s@.,!?;:]+(?:\s+[^\s@.,!?;:]+)*)|@([\wáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+(?:\s+[\wáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+)?)/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Text pred mention
    if (match.index > lastIndex) {
      parts.push(textWithBreaks(text.slice(lastIndex, match.index), `pre-${match.index}`));
    }

    let name, type, id, found = false;

    if (match[1]) {
      // Stary format @[Jmeno](typ:id)
      name = match[1];
      type = match[2];
      id = match[3];
      found = true;
    } else if (match[4] && match[5]) {
      // Lore tag format @kategorie:nazev
      const loreCategory = match[4];
      const loreName = match[5];

      // Hledej v lexikonu
      const loreItem = lexicon.find(l =>
        l.category === loreCategory &&
        l.name.toLowerCase() === loreName.toLowerCase()
      );

      // Zobraz jako lore tag (i kdyz polozka neexistuje - vytvori se pri ukladani)
      const categoryInfo = LEXICON_CATEGORIES.find(c => c.id === loreCategory);
      parts.push(
        <span
          key={`lore-${loreCategory}-${loreName}-${match.index}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (loreItem && onLoreClick) {
              onLoreClick(loreItem.id);
            }
          }}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium transition-colors cursor-pointer select-none ${
            loreItem
              ? 'bg-purple-100 hover:bg-purple-200 text-purple-800'
              : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border border-dashed border-purple-300'
          }`}
          title={loreItem ? `Klikni pro detail` : `Nová položka lexikonu`}
        >
          {categoryInfo?.icon || '📚'}
          {loreName}
        </span>
      );
      lastIndex = match.index + match[0].length;
      continue;
    } else if (match[6]) {
      // Novy format @Jmeno - vyhledej podle jmena
      const searchName = match[6];

      // Hledej v NPC
      const npc = worldNPCs.find(n => n.name.toLowerCase() === searchName.toLowerCase());
      if (npc) {
        name = npc.name;
        type = 'npc';
        id = npc.id;
        found = true;
      } else {
        // Hledej v osadach
        const settlement = settlements.find(s => s.name.toLowerCase() === searchName.toLowerCase());
        if (settlement) {
          name = settlement.name;
          type = 'settlement';
          id = settlement.id;
          found = true;
        }
      }

      // Pokud nenalezeno, zobraz jen jako text
      if (!found) {
        parts.push(text.slice(match.index, match.index + match[0].length));
        lastIndex = match.index + match[0].length;
        continue;
      }
    }

    if (found) {
      // Mention jako klikatelny element
      parts.push(
        <span
          key={`${type}-${id}-${match.index}`}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onMentionClick) onMentionClick(type, id);
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          role="button"
          tabIndex={0}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-medium transition-colors cursor-pointer select-none"
        >
          {type === 'npc' ? '🐭' : '🏘️'}
          {name}
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Zbytek textu
  if (lastIndex < text.length) {
    parts.push(textWithBreaks(text.slice(lastIndex), `post-${lastIndex}`));
  }

  // Pokud nejsou zadne mentions, zpracuj cely text pro newliny
  if (parts.length === 0) {
    return textWithBreaks(text, 'full');
  }

  return parts;
};

export const Input = ({ value, onChange, placeholder, type = 'text', className = '', onFocus, onBlur }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onFocus={onFocus}
    onBlur={onBlur}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 bg-amber-50 border-2 border-amber-900/30 rounded-lg focus:outline-none focus:border-amber-700 text-stone-800 placeholder-stone-400 ${className}`}
  />
);

export const Select = ({ value, onChange, options, className = '' }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-4 py-2.5 bg-amber-50 border-2 border-amber-900/30 rounded-lg focus:outline-none focus:border-amber-700 text-stone-800 ${className}`}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export const TabNav = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 flex items-center gap-2 ${
          activeTab === tab.id
            ? 'bg-amber-800 text-amber-50 shadow-lg'
            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
        }`}
      >
        <span>{tab.icon}</span>
        <span className="hidden sm:inline">{tab.label}</span>
      </button>
    ))}
  </div>
);

export const HowToPlayPanel = () => {
  const [activeSection, setActiveSection] = useState('basics');

  const sections = [
    { id: 'basics', label: 'Základy', icon: '📖' },
    { id: 'workflow', label: 'Workflow', icon: '🔄' },
    { id: 'example', label: 'Příklad hry', icon: '🎮' },
    { id: 'tools', label: 'Nástroje', icon: '🧰' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon="📚"
        title="Jak hrát solo Mausritter"
        subtitle="Průvodce pro začátečníky i pokročilé"
      />

      <TabNav tabs={sections} activeTab={activeSection} onTabChange={setActiveSection} />

      {activeSection === 'basics' && (
        <div className="space-y-4">
          <ResultCard title="🐭 Co je Mausritter?">
            <p className="text-stone-700 mb-3">
              Mausritter je stolní RPG, kde hraješ za malou myšku v nebezpečném světě.
              Prozkoumáváš opuštěné lidské domy, bojuješ s hmyzem a krysy, hledáš poklady a buduješ myší civilizaci.
            </p>
            <p className="text-stone-700">
              <strong>Solo hraní</strong> znamená, že hraješ sám bez Game Mastera.
              Místo GM používáš <strong>Oracle</strong> (věštírnu) - systém náhodných tabulek,
              které ti pomohou odpovídat na otázky a generovat příběh.
            </p>
          </ResultCard>

          <ResultCard title="🎯 Základní princip solo hraní">
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <p className="font-bold text-amber-900">Polož otázku</p>
                  <p className="text-stone-600 text-sm">"Jsou v této místnosti nepřátelé?"</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <p className="font-bold text-amber-900">Hoď na Oracle</p>
                  <p className="text-stone-600 text-sm">Vyber pravděpodobnost a hoď 2d6</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <p className="font-bold text-amber-900">Interpretuj výsledek</p>
                  <p className="text-stone-600 text-sm">"Yes, and..." → Ano, a navíc je jich víc než čekal!</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <p className="font-bold text-amber-900">Vyprávěj a hraj</p>
                  <p className="text-stone-600 text-sm">Popiš, co se děje, a reaguj jako tvá postava</p>
                </div>
              </div>
            </div>
          </ResultCard>

          <ResultCard title="💡 Klíčové tipy">
            <ul className="space-y-2 text-stone-700">
              <li className="flex gap-2">
                <span>✓</span>
                <span><strong>Buď upřímný</strong> - pokud je něco pravděpodobné, nastav "Likely"</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span><strong>Přijmi překvapení</strong> - nečekané výsledky dělají příběh zajímavým</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span><strong>Piš si deník</strong> - pomáhá udržet konzistenci příběhu</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span><strong>Používej generátory</strong> - když nevíš co dál, hoď na tabulky</span>
              </li>
            </ul>
          </ResultCard>
        </div>
      )}

      {activeSection === 'workflow' && (
        <div className="space-y-4">
          <ResultCard title="🔄 Typický herní cyklus">
            <div className="space-y-4">
              <div className="p-4 bg-amber-100 rounded-lg border-l-4 border-amber-600">
                <h4 className="font-bold text-amber-900 mb-2">📍 Začátek session</h4>
                <ol className="list-decimal list-inside text-stone-700 space-y-1 text-sm">
                  <li>Zkontroluj stav postavy (HP, inventář, stavy)</li>
                  <li>Připomeň si, kde jsi skončil (přečti poslední zápis)</li>
                  <li>Hoď na počasí (pokud je nový den)</li>
                  <li>Hoď na Altered Scene (scéna se může změnit)</li>
                </ol>
              </div>

              <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-600">
                <h4 className="font-bold text-green-900 mb-2">🎭 Během hraní</h4>
                <ol className="list-decimal list-inside text-stone-700 space-y-1 text-sm">
                  <li>Popiš, co tvá postava dělá</li>
                  <li>Když potřebuješ odpověď → Oracle (Ano/Ne)</li>
                  <li>Když potřebuješ inspiraci → Akce+Téma nebo karty</li>
                  <li>Když je boj → Bojový tracker</li>
                  <li>Sleduj čas (směny na povrchu, turny v dungeonu)</li>
                </ol>
              </div>

              <div className="p-4 bg-blue-100 rounded-lg border-l-4 border-blue-600">
                <h4 className="font-bold text-blue-900 mb-2">🏁 Konec session</h4>
                <ol className="list-decimal list-inside text-stone-700 space-y-1 text-sm">
                  <li>Zapiš shrnutí do deníku</li>
                  <li>Aktualizuj XP a pips</li>
                  <li>Hoď na faction progress (pokud uplynul týden)</li>
                  <li>Poznač si "cliffhanger" - kde příběh skončil</li>
                </ol>
              </div>
            </div>
          </ResultCard>

          <ResultCard title="❓ Kdy používat který nástroj?">
            <div className="grid gap-3 text-sm">
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="font-bold text-amber-900">🔮 Oracle Ano/Ne</p>
                <p className="text-stone-600">"Jsou tu stráže?" "Věří mi?" "Je dveře zamčené?"</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="font-bold text-amber-900">💡 Akce + Téma</p>
                <p className="text-stone-600">"Co NPC chce?" "Co najdu v truhle?" "Proč je tu ticho?"</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="font-bold text-amber-900">🃏 Karty</p>
                <p className="text-stone-600">"Jaká je nálada scény?" "Co motivuje tohoto nepřítele?"</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="font-bold text-amber-900">⚡ Komplikace</p>
                <p className="text-stone-600">Když hodíš "No, but..." nebo potřebuješ twist</p>
              </div>
            </div>
          </ResultCard>
        </div>
      )}

      {activeSection === 'example' && (
        <div className="space-y-4">
          <ResultCard title="🎮 Ukázka solo hraní">
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-stone-100 rounded-lg">
                <p className="text-stone-500 text-xs mb-1">SITUACE</p>
                <p className="italic text-stone-700">
                  Anise Butterball stojí před vchodem do starého lidského domu.
                  Slyšela, že uvnitř je ztracený artefakt myší osady.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                <p className="text-amber-800 font-medium mb-1">🎲 Hráč se ptá Oracle:</p>
                <p className="italic">"Je vchod hlídaný?" (Even odds)</p>
                <p className="font-bold mt-1">Hod: [4, 3] = 7 → "Yes"</p>
              </div>

              <div className="p-3 bg-stone-100 rounded-lg">
                <p className="text-stone-500 text-xs mb-1">INTERPRETACE</p>
                <p className="italic text-stone-700">
                  Ano, u vchodu sedí velký brouk. Vypadá ospalý, ale blokuje cestu.
                </p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-medium mb-1">💡 Hráč potřebuje detail - Akce+Téma:</p>
                <p className="font-bold">"Protect + Food"</p>
                <p className="text-sm mt-1">Brouk hlídá zásoby jídla! To dává smysl.</p>
              </div>

              <div className="p-3 bg-stone-100 rounded-lg">
                <p className="text-stone-500 text-xs mb-1">ROZHODNUTÍ</p>
                <p className="italic text-stone-700">
                  Anise se rozhodne brouka obejít. Zkusí se proplížit kolem...
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-medium mb-1">🎯 DEX save k proplížení:</p>
                <p>Hod d20 vs DEX defense (14)</p>
                <p className="font-bold mt-1">Hod: 11 → Úspěch! Anise se proplíží.</p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800 font-medium mb-1">⏱️ Čas plyne:</p>
                <p className="text-sm">Vstup do dungeonu → Zapni Dungeon Mode, +1 turn</p>
              </div>
            </div>
          </ResultCard>

          <ResultCard title="📝 Jak by vypadal zápis v deníku">
            <div className="p-4 bg-amber-50 rounded-lg font-serif italic text-stone-700">
              <p className="mb-2">
                <strong>Session 1 - Starý lidský dům</strong>
              </p>
              <p className="mb-2">
                Dorazila jsem k domu za soumraku. U vchodu hlídkoval velký brouk -
                zřejmě střežil zásoby uvnitř. Podařilo se mi ho obejít nepozorovaně.
              </p>
              <p>
                Uvnitř je tma a zatuchlý vzduch. Zapálila jsem pochodeň.
                Co mě čeká v hlubinách?
              </p>
            </div>
          </ResultCard>
        </div>
      )}

      {activeSection === 'tools' && (
        <div className="space-y-4">
          <ResultCard title="🧰 Přehled nástrojů">
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🔮</span>
                  <span className="font-bold text-amber-900">Věštírna (Oracle)</span>
                </div>
                <p className="text-stone-600 text-sm">
                  Hlavní nástroj pro odpovědi na otázky. Ano/Ne oracle,
                  generátor komplikací, Akce+Téma pro inspiraci.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">⚔️</span>
                  <span className="font-bold text-amber-900">Boj</span>
                </div>
                <p className="text-stone-600 text-sm">
                  Tracker pro boje. Přidej nepřátele, sleduj HP, házej na útok
                  pomocí Bernpyle 2d6 systému.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🐭</span>
                  <span className="font-bold text-amber-900">Postava</span>
                </div>
                <p className="text-stone-600 text-sm">
                  Character sheet - atributy, HP, inventář, kouzla, stavy.
                  Můžeš vygenerovat náhodnou postavu.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">⏰</span>
                  <span className="font-bold text-amber-900">Čas</span>
                </div>
                <p className="text-stone-600 text-sm">
                  Sledování směn (na povrchu) a turnů (v dungeonu).
                  Automatické připomínky na pochodně, jídlo, wandering monsters.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🌍</span>
                  <span className="font-bold text-amber-900">Svět</span>
                </div>
                <p className="text-stone-600 text-sm">
                  Generátory pro osady, NPC, dungeony a počasí.
                  Když potřebuješ rychle vytvořit obsah.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🏰</span>
                  <span className="font-bold text-amber-900">Frakce</span>
                </div>
                <p className="text-stone-600 text-sm">
                  Sledování skupin ve světě - jejich cíle, zdroje, pokrok.
                  Svět žije, i když postava spí.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📖</span>
                  <span className="font-bold text-amber-900">Deník</span>
                </div>
                <p className="text-stone-600 text-sm">
                  Všechny hody a události se automaticky logují.
                  Přidávej vlastní narativní zápisy.
                </p>
              </div>
            </div>
          </ResultCard>

          <ResultCard title="⌨️ Rychlé tipy">
            <ul className="space-y-2 text-sm text-stone-700">
              <li>• Všechna data se <strong>automaticky ukládají</strong> v prohlížeči</li>
              <li>• <strong>Export</strong> do JSON najdeš v Deníku</li>
              <li>• U každého nástroje je <strong>? ikonka</strong> s nápovědou</li>
              <li>• V dungeonu přepni na <strong>Dungeon Mode</strong> pro počítání turnů</li>
            </ul>
          </ResultCard>
        </div>
      )}
    </div>
  );
};

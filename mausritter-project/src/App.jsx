// ============================================
// HOW TO PLAY PANEL
// ============================================

const HowToPlayPanel = () => {
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

// Input Component
const Input = ({ value, onChange, placeholder, type = 'text', className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 bg-amber-50 border-2 border-amber-900/30 rounded-lg focus:outline-none focus:border-amber-700 text-stone-800 placeholder-stone-400 ${className}`}
  />
);

// Select Component
const Select = ({ value, onChange, options, className = '' }) => (
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

// Tab Navigation
const TabNav = ({ tabs, activeTab, onTabChange }) => (
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

// ============================================
// ORACLE PANEL
// ============================================

const OraclePanel = ({ onLogEntry }) => {
  const [question, setQuestion] = useState('');
  const [probability, setProbability] = useState('even');
  const [lastResult, setLastResult] = useState(null);
  const [activeOracle, setActiveOracle] = useState('yesno');
  const [customDice, setCustomDice] = useState({ count: 1, sides: 6 });
  const [customDiceResult, setCustomDiceResult] = useState(null);
  const [diceReason, setDiceReason] = useState('');
  const [silentMode, setSilentMode] = useState(false); // Tichý režim - nezapisuje do deníku

  // Helper pro logování (respektuje silentMode)
  const logEntry = (entry) => {
    if (!silentMode && onLogEntry) {
      onLogEntry(entry);
    }
  };

  // Custom dice roller
  const rollCustomDice = () => {
    const results = rollDice(customDice.count, customDice.sides);
    const total = results.reduce((a, b) => a + b, 0);
    const entry = {
      type: 'oracle',
      subtype: 'custom_dice',
      timestamp: formatTimestamp(),
      dice: results,
      sides: customDice.sides,
      count: customDice.count,
      total,
      reason: diceReason || null
    };
    setCustomDiceResult(entry);
    setLastResult(entry);
    logEntry(entry);
    setDiceReason(''); // Clear after roll
  };

  const rollYesNo = () => {
    const { dice, total } = roll2D6();
    const result = ORACLE_TABLE[probability][total];
    const entry = {
      type: 'oracle',
      subtype: 'yes_no',
      timestamp: formatTimestamp(),
      question: question || '(Bez otázky)',
      probability,
      dice,
      total,
      result
    };
    setLastResult(entry);
    logEntry(entry);
    setQuestion('');
  };

  const rollComplication = () => {
    const die = rollD6();
    const result = SCENE_COMPLICATIONS[die - 1];
    const entry = {
      type: 'oracle',
      subtype: 'complication',
      timestamp: formatTimestamp(),
      dice: [die],
      result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const rollConsequence = () => {
    const die = rollD6();
    const result = FAILURE_CONSEQUENCES[die - 1];
    const entry = {
      type: 'oracle',
      subtype: 'consequence',
      timestamp: formatTimestamp(),
      dice: [die],
      result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const rollAlteredScene = () => {
    const die = rollD6();
    const altered = die >= 5;
    const entry = {
      type: 'oracle',
      subtype: 'altered_scene',
      timestamp: formatTimestamp(),
      dice: [die],
      result: altered ? 'Scéna je POZMĚNĚNA!' : 'Scéna probíhá podle očekávání'
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const rollActionTheme = () => {
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    const entry = {
      type: 'oracle',
      subtype: 'action_theme',
      timestamp: formatTimestamp(),
      result: `${action} + ${theme}`,
      action,
      theme
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const drawCard = () => {
    const suit = randomFrom(CARD_SUITS);
    const value = randomFrom(CARD_VALUES);
    const entry = {
      type: 'oracle',
      subtype: 'card',
      timestamp: formatTimestamp(),
      suit,
      value,
      meaning: CARD_VALUE_MEANINGS[value],
      result: `${value}${suit.symbol} - ${suit.domain}`
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // State pro generátor setkání
  const [encounterResult, setEncounterResult] = useState(null);
  const [encounterOptions, setEncounterOptions] = useState({
    includeMotivation: true,
    includeComplication: false,
    dangerLevel: 'any' // 'any', 'safe', 'dangerous'
  });

  // State pro generátor tvorů/NPC
  const [creatureResult, setCreatureResult] = useState(null);
  const [creatureOptions, setCreatureOptions] = useState({
    includeSecret: true,
    includeQuirk: true,
    categoryFilter: 'any' // 'any', 'mouse', 'rat', 'insect', 'spirit', 'fae', 'creature', 'construct', 'predator'
  });

  // State pro čistě narativní generátor - abstraktní slova
  const [narrativeResult, setNarrativeResult] = useState(null);
  const [narrativeOptions, setNarrativeOptions] = useState({
    wordCount: 3
  });

  // Abstraktní koncepty pro inspiraci
  const INSPIRE_WORDS = [
    'strach', 'naděje', 'ztráta', 'radost', 'smutek', 'hněv', 'klid', 'úzkost', 'odvaha', 'zoufalství',
    'láska', 'nenávist', 'lítost', 'vděčnost', 'osamělost', 'touha', 'pochyby', 'jistota', 'zmatenost', 'úleva',
    'útěk', 'hledání', 'skrývání', 'čekání', 'sledování', 'volba', 'oběť', 'zrada', 'pomoc', 'boj',
    'odpuštění', 'odmítnutí', 'přijetí', 'vzdání', 'návrat', 'odchod', 'setkání', 'rozloučení', 'prozrazení', 'záchrana',
    'stín', 'světlo', 'ticho', 'zvuk', 'cesta', 'hranice', 'práh', 'konec', 'začátek', 'změna',
    'tajemství', 'pravda', 'lež', 'iluze', 'vzpomínka', 'sen', 'osud', 'náhoda', 'čas', 'minulost',
    'přítel', 'nepřítel', 'cizinec', 'domov', 'rodina', 'samota', 'společenství', 'spojenectví', 'rivalita', 'důvěra',
    'nebezpečí', 'bezpečí', 'chaos', 'řád', 'temnota', 'úsvit', 'soumrak', 'bouře', 'pohyb', 'pokoj',
    'prázdnota', 'plnost', 'chlad', 'teplo', 'hlad', 'hojnost', 'nedostatek', 'růst', 'úpadek', 'proměna',
    'dar', 'dluh', 'slib', 'přísaha', 'kletba', 'požehnání', 'znamení', 'varování', 'volání', 'echo'
  ];

  // Generátor abstraktních slov
  const generateNarrative = () => {
    const count = narrativeOptions.wordCount;
    const selected = [];
    const available = [...INSPIRE_WORDS];

    for (let i = 0; i < count && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      selected.push(available[idx]);
      available.splice(idx, 1);
    }

    setNarrativeResult(selected);

    const entry = {
      type: 'oracle',
      subtype: 'narrative',
      timestamp: formatTimestamp(),
      result: selected.join(' · ')
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor setkání - kombinuje tabulky pro narativní výstup
  const generateEncounter = () => {
    // Filtruj tvory podle nebezpečí pokud je nastaveno
    let creatures = ENCOUNTER_CREATURES;
    if (encounterOptions.dangerLevel === 'safe') {
      creatures = ENCOUNTER_CREATURES.filter(c => !c.danger);
    } else if (encounterOptions.dangerLevel === 'dangerous') {
      creatures = ENCOUNTER_CREATURES.filter(c => c.danger);
    }

    const creature = randomFrom(creatures);
    const activity = randomFrom(ENCOUNTER_ACTIVITIES);
    const location = randomFrom(ENCOUNTER_LOCATIONS);
    const mood = randomFrom(ENCOUNTER_MOODS);
    const detail = randomFrom(ENCOUNTER_DETAILS);
    const motivation = encounterOptions.includeMotivation ? randomFrom(ENCOUNTER_MOTIVATIONS) : null;
    const complication = encounterOptions.includeComplication ? randomFrom(ENCOUNTER_COMPLICATIONS) : null;

    // Sestav narativní text
    let narrative = `${mood}\n\n`;
    narrative += `${location.charAt(0).toUpperCase() + location.slice(1)} spatříš **${creature.name}**. `;
    narrative += `${creature.name.charAt(0).toUpperCase() + creature.name.slice(1)} ${activity}. `;
    narrative += `${detail}`;

    if (motivation) {
      narrative += `\n\n*${motivation}*`;
    }

    if (complication) {
      narrative += `\n\n⚠️ **${complication}**`;
    }

    const result = {
      creature,
      activity,
      location,
      mood,
      detail,
      motivation,
      complication,
      narrative,
      danger: creature.danger
    };

    setEncounterResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'encounter',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor tvorů/NPC - bohatý narativní popis
  const generateCreature = () => {
    // Filtruj typy podle kategorie
    let types = CREATURE_TYPES;
    if (creatureOptions.categoryFilter !== 'any') {
      types = CREATURE_TYPES.filter(t => t.category === creatureOptions.categoryFilter);
    }
    if (types.length === 0) types = CREATURE_TYPES; // fallback

    const type = randomFrom(types);
    const personality = randomFrom(CREATURE_PERSONALITIES);
    const appearance = randomFrom(CREATURE_APPEARANCES);
    const goal = randomFrom(CREATURE_GOALS);
    const doing = randomFrom(CREATURE_DOING);
    const mood = randomFrom(CREATURE_MOODS);
    const secret = creatureOptions.includeSecret ? randomFrom(CREATURE_SECRETS) : null;
    const quirk = creatureOptions.includeQuirk ? randomFrom(CREATURE_QUIRKS) : null;

    // Generuj jméno (české myší jméno)
    const firstNames = ['Křemílek', 'Lístek', 'Proutek', 'Bělouš', 'Stínek', 'Chlupáč', 'Tichošlap', 'Bystrozrak',
      'Šedivka', 'Ořech', 'Zrnko', 'Kapka', 'Mech', 'Korál', 'Jiskra', 'Pírko', 'Hvězdička', 'Kvítek',
      'Bobek', 'Kamínek', 'Vánek', 'Stéblo', 'Rosa', 'Luna', 'Šero', 'Úsvit', 'Mraka', 'Blesk',
      'Rámus', 'Tichoun', 'Hbitec', 'Kulička', 'Pecka', 'Šiška', 'Vločka', 'Prach', 'Drobek'];
    const name = randomFrom(firstNames);

    // Sestav narativní popis
    let narrative = `**${name}** - ${type.name} ${type.icon}\n\n`;
    narrative += `${name} ${doing}. `;
    narrative += `Je ${personality}. `;
    narrative += `${mood.charAt(0).toUpperCase() + mood.slice(1)}.\n\n`;
    narrative += `**Vzhled:** ${appearance.charAt(0).toUpperCase() + appearance.slice(1)}.\n`;
    narrative += `**Cíl:** ${goal.charAt(0).toUpperCase() + goal.slice(1)}.`;

    if (quirk) {
      narrative += `\n**Zvláštnost:** ${quirk.charAt(0).toUpperCase() + quirk.slice(1)}.`;
    }

    if (secret) {
      narrative += `\n\n🔒 *Tajemství (pouze GM): ${secret}.*`;
    }

    const result = {
      name,
      type,
      personality,
      appearance,
      goal,
      doing,
      mood,
      secret,
      quirk,
      narrative
    };

    setCreatureResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'creature',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const oracleTabs = [
    { id: 'yesno', label: 'Ano/Ne', icon: '🎲' },
    { id: 'narrative', label: 'Inspirace', icon: '💭' },
    { id: 'encounter', label: 'Setkání', icon: '👁️' },
    { id: 'creature', label: 'Tvor', icon: '🐭' },
    { id: 'dice', label: 'Kostky', icon: '🎯' },
    { id: 'scene', label: 'Scéna', icon: '🎭' },
    { id: 'prompt', label: 'Prompt', icon: '💡' },
    { id: 'cards', label: 'Karty', icon: '🃏' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="🔮" 
        title="Věštírna Oracle" 
        subtitle="Nech kostky vyprávět příběh"
      />
      
      <TabNav tabs={oracleTabs} activeTab={activeOracle} onTabChange={setActiveOracle} />

      {/* Tichý režim toggle */}
      <div className="flex items-center justify-end gap-2 -mt-2 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800 transition-colors">
          <input
            type="checkbox"
            checked={silentMode}
            onChange={(e) => setSilentMode(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span className={silentMode ? 'text-amber-700 font-medium' : ''}>
            🤫 Tichý hod {silentMode && '(nezapisuje do deníku)'}
          </span>
        </label>
      </div>

      {activeOracle === 'yesno' && (
        <ResultCard>
          <HelpHeader 
            title="Yes/No Oracle" 
            icon="🎲"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Když si nejsi jistý, co se stane, zeptej se Oracle! Funguje jako neutrální rozhodčí, který ti pomůže vyprávět příběh.</p>
                
                <p className="font-bold mb-1">📝 Jak na to:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs mb-2">
                  <li><b>Polož otázku</b> - musí jít odpovědět ano/ne (např. "Je stráž vzhůru?")</li>
                  <li><b>Vyber pravděpodobnost</b> - podle toho co dává smysl v příběhu</li>
                  <li><b>Hoď</b> - a interpretuj výsledek</li>
                </ol>
                
                <p className="font-bold mb-1">🎲 Výsledky:</p>
                <ul className="text-xs space-y-1">
                  <li><b>Ne</b> = prostě ne</li>
                  <li><b>Ne, ale...</b> = ne, ale něco pozitivního (např. stráž spí, ale chrupe)</li>
                  <li><b>Ano</b> = prostě ano</li>
                  <li><b>Ano, a...</b> = ano a něco extra (např. stráž spí A má u sebe klíč)</li>
                </ul>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  💡 Tip: Když dostaneš "ale/a", hoď na Komplikace nebo Prompt pro inspiraci!
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <Input 
              value={question}
              onChange={setQuestion}
              placeholder="Zadej otázku pro oracle..."
            />
            
            <div className="flex flex-wrap gap-2">
              {['unlikely', 'even', 'likely'].map(prob => (
                <button
                  key={prob}
                  onClick={() => setProbability(prob)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    probability === prob
                      ? 'bg-amber-700 text-amber-50'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {prob === 'unlikely' ? '⬇️ Nepravděpodobné' : prob === 'likely' ? '⬆️ Pravděpodobné' : '➡️ Rovné šance'}
                </button>
              ))}
            </div>
            
            <Button onClick={rollYesNo} size="large" className="w-full">
              🎲 Hodit 2d6
            </Button>
          </div>
        </ResultCard>
      )}

      {/* ========== NARRATIVE GENERATOR - ABSTRAKTNÍ SLOVA ========== */}
      {activeOracle === 'narrative' && (
        <ResultCard>
          <HelpHeader
            title="Inspirace"
            icon="💭"
            tooltip={
              <div>
                <p className="font-bold mb-2">💭 Abstraktní inspirace</p>
                <p className="text-xs">
                  Jen obecná slova. Ty si je poskládáš podle situace.
                </p>
              </div>
            }
          />

          {/* Počet slov */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-sm text-stone-600">Počet slov:</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setNarrativeOptions({ wordCount: n })}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    narrativeOptions.wordCount === n
                      ? 'bg-amber-700 text-amber-50'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={generateNarrative} variant="primary" size="large" className="w-full mb-4">
            💭 Inspiruj mě
          </Button>

          {/* Výsledek - slova */}
          {narrativeResult && (
            <div className="p-6 rounded-lg bg-stone-800 text-center">
              <div className="flex flex-wrap justify-center gap-3">
                {narrativeResult.map((word, i) => (
                  <span key={i} className="text-2xl font-light text-amber-100 tracking-wide">
                    {word}
                    {i < narrativeResult.length - 1 && <span className="text-stone-500 ml-3">·</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <p className="text-center text-xs text-stone-400 mt-4">
            100 abstraktních konceptů
          </p>
        </ResultCard>
      )}

      {/* ========== ENCOUNTER GENERATOR ========== */}
      {activeOracle === 'encounter' && (
        <ResultCard>
          <HelpHeader
            title="Generátor setkání"
            icon="👁️"
            tooltip={
              <div>
                <p className="font-bold mb-2">👁️ Co je tohle?</p>
                <p className="text-xs mb-2">
                  Narativní generátor náhodných setkání v duchu Mausritter.
                  Kombinuje 40+ tvorů, 35 aktivit, 30 lokací, 25 nálad, 40 detailů,
                  30 motivací a 25 komplikací = více než 5 milionů unikátních kombinací!
                </p>

                <p className="font-bold mb-1">🎭 Výstup:</p>
                <p className="text-xs text-stone-300 mb-2">
                  Plně narativní popis setkání, který můžeš rovnou použít ve hře.
                </p>

                <p className="font-bold mb-1">⚙️ Možnosti:</p>
                <ul className="text-xs space-y-1">
                  <li>• <b>Motivace</b> - přidá důvod proč tvor jedná</li>
                  <li>• <b>Komplikace</b> - přidá twist nebo nebezpečí</li>
                  <li>• <b>Nebezpečí</b> - filtruj bezpečné/nebezpečné tvory</li>
                </ul>
              </div>
            }
          />

          {/* Možnosti generátoru */}
          <div className="mb-4 p-3 bg-stone-100 rounded-lg space-y-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encounterOptions.includeMotivation}
                  onChange={(e) => setEncounterOptions(prev => ({ ...prev, includeMotivation: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Zahrnout motivaci</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encounterOptions.includeComplication}
                  onChange={(e) => setEncounterOptions(prev => ({ ...prev, includeComplication: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Přidat komplikaci</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Nebezpečí:</span>
              <select
                value={encounterOptions.dangerLevel}
                onChange={(e) => setEncounterOptions(prev => ({ ...prev, dangerLevel: e.target.value }))}
                className="text-sm border border-stone-300 rounded px-2 py-1"
              >
                <option value="any">Jakékoliv</option>
                <option value="safe">Bezpečné</option>
                <option value="dangerous">Nebezpečné</option>
              </select>
            </div>
          </div>

          <Button onClick={generateEncounter} variant="primary" size="large" className="w-full mb-4">
            👁️ Generovat setkání
          </Button>

          {/* Výsledek */}
          {encounterResult && (
            <div className={`p-4 rounded-lg border-2 ${encounterResult.danger ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
              {encounterResult.danger && (
                <div className="flex items-center gap-2 mb-3 text-red-700 font-bold">
                  <span>⚠️</span>
                  <span>NEBEZPEČNÉ SETKÁNÍ</span>
                </div>
              )}

              {/* Nálada */}
              <p className="text-stone-500 italic mb-3">{encounterResult.mood}</p>

              {/* Hlavní popis */}
              <div className="text-stone-800 leading-relaxed mb-3">
                <span className="text-stone-500">{encounterResult.location.charAt(0).toUpperCase() + encounterResult.location.slice(1)} spatříš </span>
                <span className="font-bold text-amber-800">{encounterResult.creature.name}</span>
                <span className="text-stone-500">. </span>
                <span>{encounterResult.creature.name.charAt(0).toUpperCase() + encounterResult.creature.name.slice(1)} {encounterResult.activity}. </span>
                <span className="text-stone-700">{encounterResult.detail}</span>
              </div>

              {/* Motivace */}
              {encounterResult.motivation && (
                <div className="mb-3 p-2 bg-white/50 rounded border-l-4 border-blue-400">
                  <span className="text-xs text-blue-600 font-medium block mb-1">💭 MOTIVACE</span>
                  <p className="text-stone-700 italic">{encounterResult.motivation}</p>
                </div>
              )}

              {/* Komplikace */}
              {encounterResult.complication && (
                <div className="p-2 bg-red-100 rounded border-l-4 border-red-500">
                  <span className="text-xs text-red-600 font-medium block mb-1">⚠️ KOMPLIKACE</span>
                  <p className="text-red-800 font-medium">{encounterResult.complication}</p>
                </div>
              )}

              {/* Meta info */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap gap-2 text-xs text-stone-500">
                <span className="px-2 py-1 bg-stone-100 rounded">
                  {encounterResult.creature.type === 'npc' ? '🐭 NPC' :
                   encounterResult.creature.type === 'predator' ? '🦅 Predátor' :
                   encounterResult.creature.type === 'supernatural' ? '✨ Nadpřirozené' : '🐛 Tvor'}
                </span>
                {encounterResult.danger && <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Nebezpečné</span>}
              </div>
            </div>
          )}

          {/* Statistiky */}
          <p className="text-center text-xs text-stone-400 mt-4">
            41 × 35 × 30 × 25 × 40 × 30 × 25 = ~5,400,000,000 kombinací
          </p>
        </ResultCard>
      )}

      {/* ========== CREATURE GENERATOR ========== */}
      {activeOracle === 'creature' && (
        <ResultCard>
          <HelpHeader
            title="Generátor tvorů & NPC"
            icon="🐭"
            tooltip={
              <div>
                <p className="font-bold mb-2">🐭 Co je tohle?</p>
                <p className="text-xs mb-2">
                  Narativní generátor postav a tvorů pro Mausritter.
                  Kombinuje 50 typů, 40 osobností, 45 vzhledů, 50 cílů,
                  40 aktivit, 35 nálad, 35 tajemství a 40 zvláštností.
                </p>

                <p className="font-bold mb-1">🎭 Výstup:</p>
                <p className="text-xs text-stone-300 mb-2">
                  Kompletní NPC s jménem, osobností, vzhledem, cílem a tajemstvím.
                </p>

                <p className="font-bold mb-1">⚙️ Možnosti:</p>
                <ul className="text-xs space-y-1">
                  <li>• <b>Tajemství</b> - skryté informace pro GM</li>
                  <li>• <b>Zvláštnost</b> - unikátní vlastnost nebo obsese</li>
                  <li>• <b>Kategorie</b> - filtruj typ tvora</li>
                </ul>
              </div>
            }
          />

          {/* Možnosti generátoru */}
          <div className="mb-4 p-3 bg-stone-100 rounded-lg space-y-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={creatureOptions.includeSecret}
                  onChange={(e) => setCreatureOptions(prev => ({ ...prev, includeSecret: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Zahrnout tajemství</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={creatureOptions.includeQuirk}
                  onChange={(e) => setCreatureOptions(prev => ({ ...prev, includeQuirk: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">Přidat zvláštnost</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Kategorie:</span>
              <select
                value={creatureOptions.categoryFilter}
                onChange={(e) => setCreatureOptions(prev => ({ ...prev, categoryFilter: e.target.value }))}
                className="text-sm border border-stone-300 rounded px-2 py-1"
              >
                <option value="any">Jakákoliv</option>
                <option value="mouse">🐭 Myš</option>
                <option value="rat">🐀 Krysa</option>
                <option value="insect">🐛 Hmyz</option>
                <option value="creature">🐸 Tvor</option>
                <option value="spirit">👻 Duch</option>
                <option value="fae">🧚 Víla/Skřítek</option>
                <option value="construct">⚙️ Konstrukt</option>
                <option value="predator">🦉 Predátor</option>
              </select>
            </div>
          </div>

          <Button onClick={generateCreature} variant="primary" size="large" className="w-full mb-4">
            🐭 Generovat tvora
          </Button>

          {/* Výsledek */}
          {creatureResult && (
            <div className="p-4 rounded-lg border-2 bg-amber-50 border-amber-300">
              {/* Hlavička s jménem a typem */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{creatureResult.type.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-amber-900">{creatureResult.name}</h3>
                  <p className="text-sm text-stone-600">{creatureResult.type.name}</p>
                </div>
              </div>

              {/* Aktivita a nálada */}
              <p className="text-stone-700 mb-3">
                {creatureResult.name} {creatureResult.doing}.
                <span className="text-stone-600"> Je {creatureResult.personality}. </span>
                <span className="italic text-stone-500">{creatureResult.mood.charAt(0).toUpperCase() + creatureResult.mood.slice(1)}.</span>
              </p>

              {/* Vzhled */}
              <div className="mb-2 p-2 bg-white/50 rounded border-l-4 border-amber-400">
                <span className="text-xs text-amber-700 font-medium block mb-1">👁️ VZHLED</span>
                <p className="text-stone-700">{creatureResult.appearance.charAt(0).toUpperCase() + creatureResult.appearance.slice(1)}.</p>
              </div>

              {/* Cíl */}
              <div className="mb-2 p-2 bg-white/50 rounded border-l-4 border-blue-400">
                <span className="text-xs text-blue-600 font-medium block mb-1">🎯 CÍL</span>
                <p className="text-stone-700">{creatureResult.goal.charAt(0).toUpperCase() + creatureResult.goal.slice(1)}.</p>
              </div>

              {/* Zvláštnost */}
              {creatureResult.quirk && (
                <div className="mb-2 p-2 bg-white/50 rounded border-l-4 border-purple-400">
                  <span className="text-xs text-purple-600 font-medium block mb-1">✨ ZVLÁŠTNOST</span>
                  <p className="text-stone-700">{creatureResult.quirk.charAt(0).toUpperCase() + creatureResult.quirk.slice(1)}.</p>
                </div>
              )}

              {/* Tajemství - pouze pro GM */}
              {creatureResult.secret && (
                <div className="mt-3 p-2 bg-stone-800 rounded border-l-4 border-stone-600">
                  <span className="text-xs text-stone-400 font-medium block mb-1">🔒 TAJEMSTVÍ (pouze GM)</span>
                  <p className="text-stone-300 italic">{creatureResult.secret.charAt(0).toUpperCase() + creatureResult.secret.slice(1)}.</p>
                </div>
              )}

              {/* Meta info */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap gap-2 text-xs text-stone-500">
                <span className="px-2 py-1 bg-stone-100 rounded">
                  {creatureResult.type.category === 'mouse' ? '🐭 Myš' :
                   creatureResult.type.category === 'rat' ? '🐀 Krysa' :
                   creatureResult.type.category === 'insect' ? '🐛 Hmyz' :
                   creatureResult.type.category === 'spirit' ? '👻 Duch' :
                   creatureResult.type.category === 'fae' ? '🧚 Víla' :
                   creatureResult.type.category === 'construct' ? '⚙️ Konstrukt' :
                   creatureResult.type.category === 'predator' ? '🦉 Predátor' : '🐸 Tvor'}
                </span>
              </div>
            </div>
          )}

          {/* Statistiky */}
          <p className="text-center text-xs text-stone-400 mt-4">
            50 × 40 × 45 × 50 × 40 × 35 × 35 × 40 = ~25,200,000,000,000 kombinací
          </p>
        </ResultCard>
      )}

      {activeOracle === 'dice' && (
        <ResultCard>
          <HelpHeader 
            title="Hod kostkou" 
            icon="🎯"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Univerzální kostky pro cokoliv! Používej když hraješ připravené dobrodružství s vlastními tabulkami.</p>
                
                <p className="font-bold mb-1">📝 Příklady použití:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>• <b>Random encounter</b> - dobrodružství říká "hoď d8 na tabulku setkání"</li>
                  <li>• <b>Loot/poklad</b> - "hoď d6 co najdeš v truhle"</li>
                  <li>• <b>NPC reakce</b> - 2d6 na reakční tabulku</li>
                  <li>• <b>Dungeon room</b> - d20 na obsah místnosti</li>
                </ul>
                
                <p className="font-bold mb-1">⚡ Rychlé tlačítka:</p>
                <p className="text-xs text-stone-300">Klikni na d4/d6/d8/d10/d12/d20 pro okamžitý hod jednou kostkou.</p>
                
                <p className="font-bold mb-1 mt-2">🎲 Vlastní hod:</p>
                <p className="text-xs text-stone-300">Vyber počet kostek a typ (např. 3d6, 2d10, 1d100) pro složitější hody.</p>
              </div>
            }
          />
          
          {/* Quick dice buttons */}
          <div className="mb-4">
            <div className="text-sm text-stone-600 mb-2">Rychlý hod:</div>
            <div className="flex flex-wrap gap-2">
              {[4, 6, 8, 10, 12, 20].map(sides => (
                <button
                  key={sides}
                  onClick={() => {
                    const result = rollDice(1, sides)[0];
                    const entry = {
                      type: 'oracle', subtype: 'custom_dice', timestamp: formatTimestamp(),
                      dice: [result], sides, count: 1, total: result
                    };
                    setCustomDiceResult(entry);
                    setLastResult(entry);
                    onLogEntry(entry);
                  }}
                  className="px-4 py-3 bg-amber-100 hover:bg-amber-200 rounded-lg font-bold text-amber-900 transition-colors min-w-[60px]"
                >
                  d{sides}
                </button>
              ))}
            </div>
          </div>

          {/* Custom dice config */}
          <div className="p-3 bg-stone-100 rounded-lg mb-4">
            <div className="text-sm text-stone-600 mb-2">Vlastní hod:</div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <select
                value={customDice.count}
                onChange={(e) => setCustomDice({ ...customDice, count: parseInt(e.target.value) })}
                className="px-3 py-2 rounded border border-stone-300 bg-white font-bold"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="font-bold text-stone-600">d</span>
              <input
                type="number"
                min="2"
                max="1000"
                value={customDice.sides}
                onChange={(e) => setCustomDice({ ...customDice, sides: parseInt(e.target.value) || 6 })}
                className="px-3 py-2 rounded border border-stone-300 bg-white font-bold w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={diceReason}
                onChange={(e) => setDiceReason(e.target.value)}
                placeholder="Na co házíš? (např. test SÍL, útok...)"
                className="flex-1 px-3 py-2 rounded border border-stone-300 bg-white"
                onKeyDown={(e) => e.key === 'Enter' && rollCustomDice()}
              />
              <Button onClick={rollCustomDice}>
                🎲 Hodit
              </Button>
            </div>
          </div>

          {/* Result */}
          {customDiceResult && (
            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-stone-600">{customDiceResult.count}d{customDiceResult.sides}</span>
                <span className="text-xs text-stone-400">{customDiceResult.timestamp}</span>
              </div>
              {customDiceResult.reason && (
                <p className="text-stone-700 font-medium mb-2">{customDiceResult.reason}</p>
              )}
              <div className="flex items-center gap-3">
                <DiceDisplay dice={customDiceResult.dice} size="large" />
                {customDiceResult.count > 1 && (
                  <div className="text-3xl font-bold text-amber-700">= {customDiceResult.total}</div>
                )}
              </div>
            </div>
          )}
        </ResultCard>
      )}

      {activeOracle === 'scene' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard>
            <HelpHeader 
              title="Altered Scene" 
              icon="📜"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 K čemu to je?</p>
                  <p className="text-xs mb-2">Zabraňuje předvídatelnosti! Než začneš novou scénu, hoď a zjisti, jestli se věci vyvinuly jinak, než jsi čekal.</p>
                  
                  <p className="font-bold mb-1">📝 Kdy házet:</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>• Na začátku každé nové scény</li>
                    <li>• Když se přesuneš na nové místo</li>
                    <li>• Když uplyne čas a vracíš se někam</li>
                  </ul>
                  
                  <p className="font-bold mb-1">🎲 Výsledky:</p>
                  <ul className="text-xs space-y-1">
                    <li><b>1-4:</b> Scéna probíhá jak jsi očekával</li>
                    <li><b>5-6:</b> Něco je jinak! Hoď na Komplikace pro inspiraci</li>
                  </ul>
                  
                  <p className="text-xs text-stone-300 mt-2 italic">
                    💡 Příklad: Jdeš do hostince pro info → hodíš 6 → hostinec hoří! Co se stalo?
                  </p>
                </div>
              }
            />
            <p className="text-sm text-stone-600 mb-3">Hoď na začátku scény (5-6 = změna)</p>
            <Button onClick={rollAlteredScene} className="w-full">Hodit d6</Button>
          </ResultCard>
          
          <ResultCard>
            <HelpHeader 
              title="Komplikace" 
              icon="⚡"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 K čemu to je?</p>
                  <p className="text-xs mb-2">Generuje nečekané zvraty a překážky. Dělá příběh zajímavější!</p>
                  
                  <p className="font-bold mb-1">📝 Kdy házet:</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>• Po "Ne, ale..." nebo "Ano, ale..." z Oracle</li>
                    <li>• Když Altered Scene ukáže změnu (5-6)</li>
                    <li>• Kdykoliv chceš přidat drama</li>
                    <li>• Když nevíš, co by se mělo pokazit</li>
                  </ul>
                  
                  <p className="font-bold mb-1">🎲 Možné výsledky:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Nepřátelé se objeví</li>
                    <li>• Překážka v cestě</li>
                    <li>• NPC udělá něco nečekaného</li>
                    <li>• Nová příležitost</li>
                  </ul>
                  
                  <p className="text-xs text-stone-300 mt-2 italic">
                    💡 Interpretuj výsledek kreativně podle situace!
                  </p>
                </div>
              }
            />
            <p className="text-sm text-stone-600 mb-3">Co se pokazilo?</p>
            <Button onClick={rollComplication} className="w-full">Hodit d6</Button>
          </ResultCard>
          
          <ResultCard>
            <HelpHeader 
              title="Důsledek selhání" 
              icon="💀"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 K čemu to je?</p>
                  <p className="text-xs mb-2">Pomáhá vytvořit zajímavé následky selhání místo nudného "nepovedlo se, zkus znovu".</p>
                  
                  <p className="font-bold mb-1">📝 Kdy házet:</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>• Když postava neuspěje v důležitém hodu</li>
                    <li>• Když selže save</li>
                    <li>• Když nevíš, jaký trest dát za neúspěch</li>
                  </ul>
                  
                  <p className="font-bold mb-1">🎲 Možné důsledky:</p>
                  <ul className="text-xs space-y-1">
                    <li>• <b>Poškození</b> - fyzické nebo mentální zranění</li>
                    <li>• <b>Někdo v úzkých</b> - spojenec v nebezpečí</li>
                    <li>• <b>Těžká volba</b> - musíš něco obětovat</li>
                    <li>• <b>Nepřítel reaguje</b> - dostane výhodu</li>
                    <li>• <b>Odhalení pravdy</b> - zjistíš něco nepříjemného</li>
                    <li>• <b>Rozdělení</b> - skupina se rozptýlí</li>
                  </ul>
                </div>
              }
            />
            <p className="text-sm text-stone-600 mb-3">Co se stane při neúspěchu?</p>
            <Button onClick={rollConsequence} className="w-full">Hodit d6</Button>
          </ResultCard>
        </div>
      )}

      {activeOracle === 'prompt' && (
        <ResultCard>
          <HelpHeader 
            title="Akce + Téma generátor" 
            icon="💡"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Náhodně vygeneruje dvojici slov (sloveso + téma), která ti dá inspiraci když nevíš co dál.</p>
                
                <p className="font-bold mb-1">📝 Kdy použít:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>• <b>Co chce NPC?</b> → "Protect + Family" = chrání svou rodinu</li>
                  <li>• <b>Co je v místnosti?</b> → "Hide + Treasure" = ukrytý poklad</li>
                  <li>• <b>Proč se to děje?</b> → "Seek + Revenge" = někdo chce pomstu</li>
                  <li>• <b>Co se stalo?</b> → "Destroy + Bond" = zničené přátelství</li>
                  <li>• <b>Co dál?</b> → "Discover + Secret" = je třeba najít tajemství</li>
                </ul>
                
                <p className="font-bold mb-1">💡 Jak interpretovat:</p>
                <p className="text-xs text-stone-300">
                  Spoj obě slova do věty nebo myšlenky. Buď kreativní! Výsledek nemusí dávat smysl doslova - hledej asociace a nápady.
                </p>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  Tip: Pokud první hod nedává smysl, hoď znovu nebo kombinuj s předchozím.
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <p className="text-stone-600">Generuj náhodnou inspiraci kombinací Akce + Tématu z Ironsworn oracle tabulek.</p>
            <Button onClick={rollActionTheme} size="large" className="w-full">
              💡 Generovat Prompt
            </Button>
          </div>
        </ResultCard>
      )}

      {activeOracle === 'cards' && (
        <ResultCard>
          <HelpHeader 
            title="Karetní Oracle" 
            icon="🃏"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Alternativa k Oracle - místo ano/ne dostaneš symbolickou odpověď, kterou interpretuješ.</p>
                
                <p className="font-bold mb-1">🎴 Barvy (oblast života):</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>♥️ <b>Srdce</b> = vztahy, emoce, láska, podvod</li>
                  <li>♦️ <b>Káry</b> = peníze, obchod, praktické věci</li>
                  <li>♣️ <b>Kříže</b> = akce, boj, fyzické, pohyb</li>
                  <li>♠️ <b>Piky</b> = magie, tajemství, smrt, duchovní</li>
                </ul>
                
                <p className="font-bold mb-1">🔢 Hodnoty (rozsah):</p>
                <ul className="text-xs space-y-1">
                  <li><b>2-4:</b> Malé, osobní</li>
                  <li><b>5-7:</b> Střední, skupinové</li>
                  <li><b>8-10:</b> Velké, důležité</li>
                  <li><b>J:</b> Osoba, agent změny</li>
                  <li><b>Q:</b> Autorita, instituce</li>
                  <li><b>K:</b> Moc, vrchol, vláda</li>
                  <li><b>A:</b> Čistá esence, podstata</li>
                </ul>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  💡 Příklad: 7♠ = "Velké tajemství" nebo "Významná magie"
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {CARD_SUITS.map(suit => (
                <div key={suit.symbol} className="p-3 bg-amber-100/50 rounded-lg">
                  <span className="text-2xl">{suit.symbol}</span>
                  <span className="font-bold ml-2">{suit.name}</span>
                  <p className="text-stone-600 mt-1">{suit.domain}</p>
                </div>
              ))}
            </div>
            <Button onClick={drawCard} size="large" className="w-full">
              🃏 Vytáhnout kartu
            </Button>
          </div>
        </ResultCard>
      )}

      {/* Last Result Display */}
      {lastResult && (
        <ResultCard title="📋 Poslední výsledek" className="border-amber-500 border-2">
          {lastResult.dice && <DiceDisplay dice={lastResult.dice} size="large" />}
          
          <div className="mt-4 text-center space-y-2">
            {lastResult.question && (
              <p className="text-stone-600 italic">"{lastResult.question}"</p>
            )}
            
            {lastResult.suit && (
              <div className="text-5xl my-4">
                {lastResult.value}{lastResult.suit.symbol}
              </div>
            )}
            
            <ResultBadge result={lastResult.result} />
            
            {lastResult.meaning && (
              <p className="text-stone-600 mt-2">{lastResult.meaning}</p>
            )}
            {lastResult.suit && (
              <p className="text-amber-700 font-medium">{lastResult.suit.keywords}</p>
            )}
          </div>
        </ResultCard>
      )}
    </div>
  );
};

// ============================================
// COMBAT PANEL
// ============================================

const CombatPanel = ({ party, updateCharacterInParty, onLogEntry }) => {
  const [combatants, setCombatants] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [attackResult, setAttackResult] = useState(null);
  const [newCombatantName, setNewCombatantName] = useState('');
  const [newCombatantHP, setNewCombatantHP] = useState(4);

  // Add single combatant
  const addCombatant = (isEnemy = true) => {
    if (!newCombatantName) return;
    const newCombatant = {
      id: generateId(),
      name: newCombatantName,
      hp: newCombatantHP,
      maxHp: newCombatantHP,
      str: 6,
      maxStr: 6,
      isEnemy,
      isPartyMember: false,
      conditions: [],
      actedThisRound: false
    };
    setCombatants([...combatants, newCombatant]);
    setNewCombatantName('');
    setNewCombatantHP(4);
  };

  // Add all party members to combat
  const addPartyToCombat = () => {
    if (!party?.members) return;
    
    const partyMembers = party.members.map(member => ({
      id: member.id,
      name: member.name,
      hp: member.hp?.current || 3,
      maxHp: member.hp?.max || 6,
      str: member.STR?.current || member.str || 6,
      maxStr: member.STR?.max || member.maxStr || 6,
      isEnemy: false,
      isPartyMember: true,
      memberId: member.id, // Link back to party member
      conditions: member.conditions || [],
      actedThisRound: false
    }));
    
    // Filter out members already in combat
    const newMembers = partyMembers.filter(pm => 
      !combatants.some(c => c.memberId === pm.memberId)
    );
    
    setCombatants([...combatants, ...newMembers]);
  };

  const removeCombatant = (id) => {
    setCombatants(combatants.filter(c => c.id !== id));
  };

  const startCombat = () => {
    setCurrentRound(1);
    setCombatLog([{ round: 1, message: '⚔️ Boj začíná!' }]);
    // Roll initiative
    const withInitiative = combatants.map(c => ({
      ...c,
      initiative: rollD20(),
      actedThisRound: false
    })).sort((a, b) => b.initiative - a.initiative);
    setCombatants(withInitiative);
  };

  const nextRound = () => {
    const newRound = currentRound + 1;
    setCurrentRound(newRound);
    setCombatants(combatants.map(c => ({ ...c, actedThisRound: false })));
    setCombatLog([...combatLog, { round: newRound, message: `🔄 Kolo ${newRound}` }]);
  };

  const endCombat = () => {
    setCurrentRound(0);
    
    // Sync HP back to party members
    combatants.forEach(c => {
      if (c.isPartyMember && c.memberId) {
        updateCharacterInParty(c.memberId, {
          hp: { current: c.hp, max: c.maxHp }
        });
      }
    });
    
    // Roll usage for items
    const usageLog = [];
    if (party?.members) {
      party.members.forEach(member => {
        if (member.inventory) {
          member.inventory.forEach(item => {
            if (item.usageDots !== undefined && (item.name.toLowerCase().includes('zbraň') || item.name.toLowerCase().includes('sword') || item.name.toLowerCase().includes('armor') || item.name.toLowerCase().includes('zbroj') || item.name.toLowerCase().includes('štít'))) {
              const roll = rollD6();
              if (roll >= 4) {
                usageLog.push(`${member.name} - ${item.name}: Hod ${roll} - Označ použití!`);
              }
            }
          });
        }
      });
    }
    
    if (usageLog.length > 0) {
      setCombatLog([...combatLog, { round: currentRound, message: '📦 Usage rolls:', details: usageLog }]);
    }
    
    onLogEntry({
      type: 'combat_end',
      timestamp: formatTimestamp(),
      rounds: currentRound,
      log: combatLog
    });
    
    // Clear combatants
    setCombatants([]);
  };

  const rollAttack = (attackerId, targetId, weaponDice = 6) => {
    const { dice, total } = roll2D6();
    const hitResult = HIT_TABLE[total];
    
    let damage = 0;
    let damageRolls = [];
    
    switch (hitResult.damageType) {
      case 'none':
        damage = 0;
        break;
      case 'disadvantage':
        damageRolls = rollDice(2, weaponDice);
        damage = Math.min(...damageRolls);
        break;
      case 'normal':
        damageRolls = rollDice(1, weaponDice);
        damage = damageRolls[0];
        break;
      case 'advantage':
        damageRolls = rollDice(2, weaponDice);
        damage = Math.max(...damageRolls);
        break;
      case 'advantage+1':
        damageRolls = rollDice(2, weaponDice);
        damage = Math.max(...damageRolls) + 1;
        break;
      case 'max':
        damage = weaponDice;
        break;
    }

    const attacker = combatants.find(c => c.id === attackerId) || { name: 'Hráč' };
    const target = combatants.find(c => c.id === targetId);
    
    const result = {
      attacker: attacker.name,
      target: target?.name || 'Cíl',
      hitDice: dice,
      hitTotal: total,
      hitResult: hitResult.result,
      effect: hitResult.effect,
      damageRolls,
      damage
    };
    
    setAttackResult(result);
    
    // Apply damage to target
    if (target && damage > 0) {
      const newCombatants = combatants.map(c => {
        if (c.id === targetId) {
          let newHp = c.hp - damage;
          let newStr = c.str;
          let overflow = 0;
          
          if (newHp < 0) {
            overflow = Math.abs(newHp);
            newHp = 0;
            newStr = Math.max(0, c.str - overflow);
          }
          
          return { ...c, hp: newHp, str: newStr };
        }
        return c;
      });
      setCombatants(newCombatants);
    }
    
    setCombatLog([...combatLog, {
      round: currentRound,
      message: `${result.attacker} útočí na ${result.target}: ${result.hitResult} (${total}) → ${damage} poškození`
    }]);
    
    onLogEntry({
      type: 'combat_action',
      subtype: 'attack',
      timestamp: formatTimestamp(),
      ...result
    });
  };

  const rollMorale = (combatantId) => {
    const target = combatants.find(c => c.id === combatantId);
    if (!target) return;
    
    const roll = rollD20();
    const success = roll <= (target.wil || 7);
    
    setCombatLog([...combatLog, {
      round: currentRound,
      message: `🏃 Morálka ${target.name}: d20=${roll} vs WIL=${target.wil || 7} → ${success ? 'Drží pozici' : 'PRCHÁ!'}`
    }]);
  };

  const updateCombatantHP = (id, delta) => {
    setCombatants(combatants.map(c => 
      c.id === id ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) } : c
    ));
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="⚔️" 
        title="Bojový tracker" 
        subtitle={currentRound > 0 ? `Kolo ${currentRound}` : 'Připrav bojovníky'}
      />

      {/* Add Combatant */}
      <ResultCard>
        <HelpHeader 
          title="Přidat bojovníka" 
          icon="➕"
          tooltip={
            <div>
              <p className="font-bold mb-2">🎯 K čemu to je?</p>
              <p className="text-xs mb-2">Přidej všechny účastníky boje - myši, nepřátele i spojence - předtím než začneš bojovat.</p>
              
              <p className="font-bold mb-1">📝 Jak na to:</p>
              <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                <li>Napiš jméno (např. "Krysa #1" nebo "Oříšek")</li>
                <li>Nastav HP a případně Armor</li>
                <li>Vyber typ:</li>
              </ol>
              
              <ul className="text-xs space-y-1 mb-2 ml-4">
                <li>🐭 <b>Hráč</b> = tvá postava (zelený pruh)</li>
                <li>🐀 <b>Nepřítel</b> = proti tobě (červený pruh)</li>
                <li>🐿️ <b>Spojenec</b> = NPC na tvé straně (modrý pruh)</li>
              </ul>
              
              <p className="text-xs text-stone-300 italic">
                💡 Tip: Pro více nepřátel stejného typu je přidej jednotlivě s čísly (Mravenec #1, #2...)
              </p>
            </div>
          }
        />
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-stone-600 block mb-1">Jméno</label>
            <Input 
              value={newCombatantName}
              onChange={setNewCombatantName}
              placeholder="Jméno nepřítele..."
            />
          </div>
          <div className="w-24">
            <label className="text-sm text-stone-600 block mb-1">HP</label>
            <Input 
              type="number"
              value={newCombatantHP}
              onChange={(v) => setNewCombatantHP(parseInt(v) || 1)}
            />
          </div>
          <Button onClick={() => addCombatant(true)}>🐀 Nepřítel</Button>
          <Button onClick={() => addCombatant(false)} variant="secondary">🐭 Spojenec</Button>
          {party?.members?.length > 0 && (
            <Button onClick={addPartyToCombat} variant="success">
              🏕️ Celá družina ({party.members.length})
            </Button>
          )}
        </div>
      </ResultCard>

      {/* Combatants List */}
      <ResultCard title="👥 Bojovníci">
        {combatants.length === 0 ? (
          <p className="text-stone-500 text-center py-4">Žádní bojovníci. Přidej někoho výše.</p>
        ) : (
          <div className="space-y-3">
            {combatants.map(c => (
              <div key={c.id} className={`p-4 rounded-lg border-2 ${c.isEnemy ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.isEnemy ? '🐀' : '🐭'}</span>
                    <div>
                      <h4 className="font-bold text-stone-800">{c.name}</h4>
                      <div className="flex gap-3 text-sm">
                        <span className={c.hp === 0 ? 'text-red-600 font-bold' : 'text-stone-600'}>
                          HP: {c.hp}/{c.maxHp}
                        </span>
                        <span className={c.str < c.maxStr ? 'text-orange-600 font-bold' : 'text-stone-600'}>
                          STR: {c.str}/{c.maxStr}
                        </span>
                        {c.initiative && <span className="text-blue-600">Init: {c.initiative}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="small" variant="success" onClick={() => updateCombatantHP(c.id, 1)}>+HP</Button>
                    <Button size="small" variant="danger" onClick={() => updateCombatantHP(c.id, -1)}>-HP</Button>
                    {currentRound > 0 && c.isEnemy && (
                      <Button size="small" variant="ghost" onClick={() => rollMorale(c.id)}>🏃 Morálka</Button>
                    )}
                    <Button size="small" variant="ghost" onClick={() => removeCombatant(c.id)}>✕</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ResultCard>

      {/* Combat Controls */}
      <ResultCard title="🎮 Ovládání">
        <div className="flex flex-wrap gap-3">
          {currentRound === 0 ? (
            <Button onClick={startCombat} size="large" disabled={combatants.length === 0}>
              ⚔️ Zahájit boj
            </Button>
          ) : (
            <>
              <Button onClick={nextRound}>🔄 Další kolo</Button>
              <Button onClick={endCombat} variant="danger">🏁 Ukončit boj</Button>
            </>
          )}
        </div>
      </ResultCard>

      {/* Attack Roll */}
      {currentRound > 0 && (
        <ResultCard>
          <HelpHeader 
            title="Útok (Bernpyle 2d6)" 
            icon="🗡️"
            tooltip={
              <div>
                <p className="font-bold mb-1">Jak útočit:</p>
                <ol className="list-decimal list-inside text-xs space-y-1">
                  <li>Vyber cíl útoku</li>
                  <li>Hoď 2d6 na zásah</li>
                  <li>Výsledek určí sílu zásahu</li>
                  <li>Hoď damage podle zbraně</li>
                </ol>
                <p className="mt-2 text-xs text-stone-300">
                  Poškození jde nejdřív do HP, pak do STR. Při STR damage hoď STR save!
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                value=""
                onChange={(id) => {
                  if (id && combatants.filter(c => c.isEnemy).length > 0) {
                    const target = combatants.filter(c => c.isEnemy)[0];
                    rollAttack('player', target.id);
                  }
                }}
                options={[
                  { value: '', label: 'Vybrat cíl...' },
                  ...combatants.filter(c => c.isEnemy && c.hp > 0).map(c => ({
                    value: c.id,
                    label: `${c.name} (HP: ${c.hp})`
                  }))
                ]}
              />
            </div>
            
            <Button onClick={() => {
              const enemies = combatants.filter(c => c.isEnemy && c.hp > 0);
              if (enemies.length > 0) rollAttack('player', enemies[0].id);
            }} className="w-full">
              🎲 Hodit útok
            </Button>
            
            {attackResult && (
              <div className="mt-4 p-4 bg-amber-100 rounded-lg">
                <DiceDisplay dice={attackResult.hitDice} size="large" />
                <div className="mt-3 text-center space-y-2">
                  <p className="text-xl font-bold text-amber-900">{attackResult.hitResult}</p>
                  <p className="text-stone-600">{attackResult.effect}</p>
                  {attackResult.damage > 0 && (
                    <p className="text-2xl font-bold text-red-700">💥 {attackResult.damage} poškození</p>
                  )}
                  {attackResult.damageRolls.length > 0 && (
                    <p className="text-sm text-stone-500">Damage roll: [{attackResult.damageRolls.join(', ')}]</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </ResultCard>
      )}

      {/* Combat Log */}
      {combatLog.length > 0 && (
        <ResultCard title="📜 Bojový log">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {combatLog.map((log, i) => (
              <div key={i} className="text-sm p-2 bg-stone-100 rounded">
                <span className="text-amber-700 font-bold">[K{log.round}]</span> {log.message}
                {log.details && (
                  <ul className="ml-4 mt-1 text-stone-600">
                    {log.details.map((d, j) => <li key={j}>• {d}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {/* Hit Table Reference */}
      <ResultCard title="📊 Tabulka zásahů (2d6)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="p-2 bg-red-100 rounded text-center">
            <span className="font-bold">2</span><br/>Kritický minutí
          </div>
          <div className="p-2 bg-orange-100 rounded text-center">
            <span className="font-bold">3-4</span><br/>Slabý zásah
          </div>
          <div className="p-2 bg-yellow-100 rounded text-center">
            <span className="font-bold">5-8</span><br/>Zásah
          </div>
          <div className="p-2 bg-green-100 rounded text-center">
            <span className="font-bold">9-10</span><br/>Silný zásah
          </div>
          <div className="p-2 bg-green-200 rounded text-center">
            <span className="font-bold">11</span><br/>Silný +1
          </div>
          <div className="p-2 bg-green-300 rounded text-center col-span-2">
            <span className="font-bold">12</span><br/>DRTIVÝ ÚDER (max dmg)
          </div>
        </div>
      </ResultCard>
    </div>
  );
};

// ============================================
// CHARACTER PANEL
// ============================================

const CharacterPanel = ({ 
  character, 
  updateCharacter, 
  party, 
  parties,
  activePartyId,
  setActivePartyId,
  activeCharacterId, 
  setActiveCharacterId, 
  createParty,
  createPC,
  createHireling,
  addHirelingsToParty,
  updateParty,
  updateCharacterInParty,
  removeCharacter,
  removeParty,
  onLogEntry 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [openSection, setOpenSection] = useState('inventory');
  const [selectedSlot, setSelectedSlot] = useState(null); // For tap-to-move inventory
  const [popupItem, setPopupItem] = useState(null); // For item detail popup
  const inventoryRef = useRef(null);
  const slotSize = useSlotSize(inventoryRef); // Responsive slot size

  // Generate random PC
  // State for character generator modal
  const [showGenerator, setShowGenerator] = useState(false);
  const [pendingChar, setPendingChar] = useState(null);
  const [bonusOrigin, setBonusOrigin] = useState(null);
  const [selectedBonusItems, setSelectedBonusItems] = useState([]);

  // State for hireling recruitment picker
  const [showHirelingPicker, setShowHirelingPicker] = useState(false);
  const [hirelingAvailability, setHirelingAvailability] = useState({});
  const [hirelingCandidates, setHirelingCandidates] = useState([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [currentRecruitType, setCurrentRecruitType] = useState(null);

  // State for treasury
  const [showTreasury, setShowTreasury] = useState(false);
  const [newTreasuryItem, setNewTreasuryItem] = useState({ name: '', amount: '' });

  // Treasury functions
  const treasuryItems = party?.treasuryItems || [];
  const treasuryTotal = treasuryItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const addTreasuryItem = () => {
    const amount = parseInt(newTreasuryItem.amount);
    if (!newTreasuryItem.name.trim() || isNaN(amount)) return;
    const newItem = {
      id: generateId(),
      name: newTreasuryItem.name.trim(),
      amount: amount
    };
    updateParty(activePartyId, { treasuryItems: [...treasuryItems, newItem] });
    setNewTreasuryItem({ name: '', amount: '' });
  };

  const removeTreasuryItem = (itemId) => {
    updateParty(activePartyId, { treasuryItems: treasuryItems.filter(i => i.id !== itemId) });
  };

  // Pay hireling from treasury
  const payHireling = (hirelingCharacter) => {
    const hirelingTypeInfo = HIRELING_TYPES.find(t => t.type === hirelingCharacter.hirelingType);
    const wageStr = hirelingTypeInfo?.cost || hirelingCharacter.cost || '1 ď';
    const wageAmount = parseInt(wageStr) || 1;

    if (treasuryTotal < wageAmount) {
      alert(`Nedostatek peněz v pokladně! Potřeba: ${wageAmount} ď, k dispozici: ${treasuryTotal} ď`);
      return;
    }

    const newTreasuryItem = {
      id: generateId(),
      name: `Výplata: ${hirelingCharacter.name}`,
      amount: -wageAmount
    };

    updateParty(activePartyId, { treasuryItems: [...treasuryItems, newTreasuryItem] });

    onLogEntry({
      type: 'treasury',
      subtype: 'payment',
      timestamp: formatTimestamp(),
      description: `Vyplacen ${hirelingCharacter.name}: -${wageAmount} ď`
    });
  };

  // Hireling recruitment functions
  const rollHirelingDice = (diceStr) => {
    const match = diceStr.match(/d(\d+)/);
    if (!match) return 1;
    return Math.floor(Math.random() * parseInt(match[1])) + 1;
  };

  const rollAvailability = (typeKey) => {
    const type = HIRELING_TYPES.find(t => t.type === typeKey);
    if (!type) return 0;
    const count = rollHirelingDice(type.dice);
    setHirelingAvailability(prev => ({ ...prev, [typeKey]: count }));
    return count;
  };

  const hireHireling = (typeKey) => {
    if (!activePartyId) return;
    const available = hirelingAvailability[typeKey] || 0;
    if (available <= 0) return;
    const hireling = createHireling(activePartyId, typeKey);
    setHirelingAvailability(prev => ({ ...prev, [typeKey]: prev[typeKey] - 1 }));
    setActiveCharacterId(hireling.id);
    setShowHirelingPicker(false);
  };

  const openHirelingPicker = () => {
    if (!activePartyId) return;
    setHirelingAvailability({});
    setHirelingCandidates([]);
    setSelectedCandidateIds([]);
    setCurrentRecruitType(null);
    setShowHirelingPicker(true);
  };

  // Generate candidates with stats for a hireling type
  const generateCandidates = (typeKey) => {
    const hirelingType = HIRELING_TYPES.find(t => t.type === typeKey);
    if (!hirelingType) return;

    const count = rollHirelingDice(hirelingType.dice);

    const candidates = [];
    for (let i = 0; i < count; i++) {
      const roll2k6 = () => rollD6() + rollD6();
      candidates.push({
        tempId: generateId(),
        name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
        STR: roll2k6(),
        DEX: roll2k6(),
        WIL: roll2k6(),
        HP: rollD6(),
        physicalDetail: randomFrom(PHYSICAL_DETAILS)
      });
    }

    setCurrentRecruitType(typeKey);
    setHirelingCandidates(candidates);
    setSelectedCandidateIds([]);
    setHirelingAvailability(prev => ({ ...prev, [typeKey]: count }));
  };

  // Toggle candidate selection
  const toggleCandidate = (tempId) => {
    setSelectedCandidateIds(prev => {
      if (prev.includes(tempId)) {
        return prev.filter(id => id !== tempId);
      } else {
        return [...prev, tempId];
      }
    });
  };

  // Hire selected candidates
  const hireSelectedCandidates = () => {
    if (!activePartyId || !currentRecruitType || selectedCandidateIds.length === 0) return;
    const hirelingType = HIRELING_TYPES.find(t => t.type === currentRecruitType);

    // Create all new hirelings first
    const newHirelings = hirelingCandidates
      .filter(c => selectedCandidateIds.includes(c.tempId))
      .map(candidate => ({
        id: generateId(),
        type: 'hireling',
        hirelingType: currentRecruitType,
        name: candidate.name,
        STR: { current: candidate.STR, max: candidate.STR },
        DEX: { current: candidate.DEX, max: candidate.DEX },
        WIL: { current: candidate.WIL, max: candidate.WIL },
        hp: { current: candidate.HP, max: candidate.HP },
        cost: hirelingType?.cost || '1 ď',
        skill: hirelingType?.skill || null,
        inventorySlots: {
          strongPaw1: null, strongPaw2: null,
          weakPaw1: null, weakPaw2: null
        },
        physicalDetail: candidate.physicalDetail
      }));

    // Add all hirelings to party
    addHirelingsToParty(activePartyId, newHirelings);

    // Switch to last hired character
    if (newHirelings.length > 0) {
      setActiveCharacterId(newHirelings[newHirelings.length - 1].id);
    }

    // Clear and close
    setHirelingCandidates([]);
    setSelectedCandidateIds([]);
    setCurrentRecruitType(null);
    setShowHirelingPicker(false);
  };

  // Roll new character for generator
  const rollNewCharacter = (preferredGender = null) => {
    // Reset bonus origin and selected items
    setBonusOrigin(null);
    setSelectedBonusItems([]);
    
    // Roll attributes (3k6, take two highest for each)
    const roll3k6TwoHighest = () => {
      const rolls = [rollD6(), rollD6(), rollD6()];
      rolls.sort((a, b) => b - a);
      return rolls[0] + rolls[1];
    };
    
    // Roll k66 for distinctive feature
    const rollK66 = () => `${rollD6()}-${rollD6()}`;
    
    const str = roll3k6TwoHighest();
    const dex = roll3k6TwoHighest();
    const wil = roll3k6TwoHighest();
    const hp = rollD6();
    const pips = rollD6();
    
    // Get origin from HP × Pips table
    const originKey = `${hp}-${pips}`;
    const origin = ORIGINS[originKey] || ORIGINS['1-1'];
    
    // Gender and name
    const gender = preferredGender || (Math.random() < 0.5 ? 'male' : 'female');
    const firstNames = gender === 'male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
    const familyName = randomFrom(FAMILY_NAMES);
    const firstName = randomFrom(firstNames);
    const lastName = gender === 'male' ? familyName.male : familyName.female;
    
    // Fur
    const furColor = randomFrom(FUR_COLORS);
    const furPattern = randomFrom(FUR_PATTERNS);
    
    // Distinctive feature (k66)
    const distinctiveFeature = DISTINCTIVE_FEATURES[rollK66()] || 'Běžný vzhled';
    
    // Birthsign
    const birthsign = randomFrom(BIRTHSIGNS);
    
    // Bonus items check (max attr ≤9 = +1 item, ≤7 = +2 items)
    const maxAttr = Math.max(str, dex, wil);
    const bonusItemCount = maxAttr <= 7 ? 2 : maxAttr <= 9 ? 1 : 0;
    
    // Build inventory from origin
    const inventory = [
      { id: generateId(), name: 'Zásoby', slots: 1, usageDots: 0, maxUsage: 3 },
      { id: generateId(), name: 'Pochodně', slots: 1, usageDots: 0, maxUsage: 3 },
      { id: generateId(), name: origin.itemA, slots: 1, usageDots: 0, maxUsage: 3 },
      { id: generateId(), name: origin.itemB, slots: 1, usageDots: 0, maxUsage: 3 }
    ];
    
    setPendingChar({
      id: generateId(),
      type: 'pc',
      name: `${firstName} ${lastName}`,
      gender,
      level: 1,
      STR: { current: str, max: str },
      DEX: { current: dex, max: dex },
      WIL: { current: wil, max: wil },
      hp: { current: hp, max: hp },
      pips,
      xp: 0,
      origin,
      birthsign,
      fur: { color: furColor, pattern: furPattern },
      distinctiveFeature,
      bonusItemCount,
      selectedWeaponIndex: 0,
      conditions: [],
      inventory,
      spells: []
    });
  };

  // Swap two attributes
  const swapAttributes = (attr1, attr2) => {
    if (!pendingChar) return;
    setPendingChar({
      ...pendingChar,
      [attr1]: pendingChar[attr2],
      [attr2]: pendingChar[attr1]
    });
  };

  // Change weapon selection
  const selectWeapon = (index) => {
    if (!pendingChar) return;
    setPendingChar({ ...pendingChar, selectedWeaponIndex: index });
  };

  // Confirm and create character
  const confirmCharacter = () => {
    if (!pendingChar || !activePartyId) return;
    
    // Add selected weapon to inventory slots
    const weapon = STARTING_WEAPONS[pendingChar.selectedWeaponIndex || 0];
    
    // Build inventorySlots from origin items + weapon
    const inventorySlots = {
      mainPaw: { id: generateId(), name: `${weapon.name} (${weapon.damage})`, slots: weapon.slots, usageDots: 0, maxUsage: 3, isWeapon: true },
      offPaw: null,
      body1: null,
      body2: null,
      pack1: { id: generateId(), name: 'Zásoby', slots: 1, usageDots: 0, maxUsage: 3 },
      pack2: { id: generateId(), name: 'Pochodně', slots: 1, usageDots: 0, maxUsage: 3 },
      pack3: pendingChar.origin?.itemA ? { id: generateId(), name: pendingChar.origin.itemA, slots: 1, usageDots: 0, maxUsage: 3 } : null,
      pack4: pendingChar.origin?.itemB ? { id: generateId(), name: pendingChar.origin.itemB, slots: 1, usageDots: 0, maxUsage: 3 } : null,
      pack5: null,
      pack6: null
    };
    
    // Add bonus items if selected
    if (bonusOrigin && selectedBonusItems.length > 0) {
      const bonusSlots = ['pack5', 'pack6', 'body1', 'body2']; // Try these slots in order
      let slotIndex = 0;
      
      selectedBonusItems.forEach(itemKey => {
        const itemName = itemKey === 'A' ? bonusOrigin.origin.itemA : bonusOrigin.origin.itemB;
        // Find next empty slot
        while (slotIndex < bonusSlots.length && inventorySlots[bonusSlots[slotIndex]] !== null) {
          slotIndex++;
        }
        if (slotIndex < bonusSlots.length) {
          inventorySlots[bonusSlots[slotIndex]] = { 
            id: generateId(), 
            name: itemName, 
            slots: 1, 
            usageDots: 0, 
            maxUsage: 3 
          };
          slotIndex++;
        }
      });
    }
    
    const finalChar = {
      ...pendingChar,
      inventorySlots,
      inventory: [], // Keep empty for backwards compatibility
      conditions: []
    };
    delete finalChar.selectedWeaponIndex;
    delete finalChar.bonusItemCount;
    
    createPC(activePartyId, finalChar);
    setActiveCharacterId(finalChar.id);
    onLogEntry({ type: 'character_created', timestamp: formatTimestamp(), character: finalChar.name });
    setPendingChar(null);
    setBonusOrigin(null);
    setSelectedBonusItems([]);
    setShowGenerator(false);
  };

  // Open generator
  const openGenerator = () => {
    setShowGenerator(true);
    rollNewCharacter();
  };

  const addHireling = () => {
    if (!activePartyId) return;
    const hireling = createHireling(activePartyId);
    setActiveCharacterId(hireling.id);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'party') {
      removeParty(deleteConfirm.id);
    } else {
      removeCharacter(activePartyId, deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  // Helper functions
  const updateHP = (delta) => {
    if (!character) return;
    const newHP = Math.max(0, Math.min(character.hp?.max || 6, (character.hp?.current || 0) + delta));
    updateCharacter({ hp: { ...character.hp, current: newHP } });
  };

  const updatePips = (delta) => {
    if (!character) return;
    updateCharacter({ pips: Math.max(0, (character.pips || 0) + delta) });
  };

  const updateAttribute = (attr, field, value) => {
    if (!character) return;
    const parsed = parseInt(value) || 0;
    updateCharacter({
      [attr]: { ...character[attr], [field]: Math.max(1, Math.min(18, parsed)) }
    });
  };

  const toggleCondition = (condId) => {
    if (!character) return;
    const has = character.conditions?.includes(condId);
    updateCharacter({
      conditions: has ? character.conditions.filter(c => c !== condId) : [...(character.conditions || []), condId]
    });
  };

  const addInventoryItem = () => {
    if (!character) return;
    updateCharacter({
      inventory: [...(character.inventory || []), { id: generateId(), name: 'Nový předmět', usageDots: 0, maxUsage: 3 }]
    });
  };

  const updateInventoryItem = (id, field, value) => {
    if (!character) return;
    updateCharacter({
      inventory: character.inventory.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeInventoryItem = (id) => {
    if (!character) return;
    updateCharacter({ inventory: character.inventory.filter(item => item.id !== id) });
  };

  // Slot-based inventory functions
  const SLOT_IDS = ['mainPaw', 'offPaw', 'body1', 'body2', 'pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'];
  
  const moveInventoryItem = (fromSlot, toSlot) => {
    if (!character || fromSlot === toSlot) return;
    const slots = { ...(character.inventorySlots || {}) };
    const item = slots[fromSlot];
    if (!item) return;
    
    // Pairs for 2-height validation
    const belowMap = { mainPaw: 'offPaw', body1: 'body2', pack1: 'pack4', pack2: 'pack5', pack3: 'pack6' };
    const aboveMap = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };
    
    // Check if target is blocked by 2H item above
    const aboveSlot = aboveMap[toSlot];
    if (aboveSlot && slots[aboveSlot]?.height === 2) {
      return; // Can't drop here, blocked
    }
    
    // Check if dropping 2H item - need empty slot below
    if (item.height === 2) {
      const belowSlot = belowMap[toSlot];
      if (!belowSlot) return; // No slot below, can't place 2H
      if (slots[belowSlot] && belowSlot !== fromSlot) {
        alert('Potřebuješ 2 volné sloty pod sebou!');
        return;
      }
    }
    
    // Swap if target has item
    const targetItem = slots[toSlot];
    slots[toSlot] = item;
    slots[fromSlot] = targetItem || null;
    
    updateCharacter({ inventorySlots: slots });
  };

  const updateSlotItem = (slotId, field, value) => {
    if (!character) return;
    const slots = { ...(character.inventorySlots || {}) };
    if (slots[slotId]) {
      slots[slotId] = { ...slots[slotId], [field]: value };
      updateCharacter({ inventorySlots: slots });
    }
  };

  const removeSlotItem = (slotId) => {
    if (!character) return;
    const slots = { ...(character.inventorySlots || {}) };
    
    // If it's a condition, also remove from conditions array
    if (slots[slotId]?.isCondition && slots[slotId]?.conditionId) {
      updateCharacter({ 
        inventorySlots: { ...slots, [slotId]: null },
        conditions: (character.conditions || []).filter(c => c !== slots[slotId].conditionId)
      });
    } else {
      slots[slotId] = null;
      updateCharacter({ inventorySlots: slots });
    }
  };

  const addConditionToSlot = (slotId, condId, condName) => {
    if (!character) return;
    // Don't add if already has this condition
    if (character.conditions?.includes(condId)) return;
    
    const slots = { ...(character.inventorySlots || {}) };
    // Only add to empty slot
    if (slots[slotId]) return;
    
    slots[slotId] = {
      id: generateId(),
      name: condName,
      isCondition: true,
      conditionId: condId,
      usageDots: 0,
      maxUsage: 0
    };
    
    updateCharacter({ 
      inventorySlots: slots,
      conditions: [...(character.conditions || []), condId]
    });
  };

  const addNewItemToFirstEmpty = () => {
    if (!character) return;
    const slots = { ...(character.inventorySlots || {}) };
    
    // Find first empty pack slot
    const emptySlot = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'].find(s => !slots[s]);
    if (!emptySlot) {
      alert('Batoh je plný!');
      return;
    }
    
    slots[emptySlot] = {
      id: generateId(),
      name: 'Nový předmět',
      usageDots: 0,
      maxUsage: 3,
      slots: 1
    };
    
    updateCharacter({ inventorySlots: slots });
  };

  // Migrate old inventory format to new slots format
  React.useEffect(() => {
    if (character && character.inventory && !character.inventorySlots) {
      const slots = {};
      character.inventory.forEach((item, idx) => {
        const slotId = SLOT_IDS[idx + 4] || `pack${idx + 1}`; // Start at pack slots
        if (idx < 6) slots[slotId] = { ...item };
      });
      updateCharacter({ inventorySlots: slots });
    }
  }, [character?.id]);

  // ========== NO PARTIES ==========
  if (!parties || parties.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader icon="🐭" title="Postavy" subtitle="Začni vytvořením družiny" />
        <ResultCard>
          <div className="text-center py-8">
            <p className="text-6xl mb-4">🏕️</p>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Vítej v Mausritteru!</h3>
            <p className="text-stone-600 mb-6">Vytvoř první družinu a přidej postavy.</p>
            <Button onClick={() => createParty('Moje družina')} size="large">
              🏕️ Vytvořit družinu
            </Button>
          </div>
        </ResultCard>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="space-y-4">
      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-amber-900 mb-2">⚠️ Smazat?</h3>
            <p className="text-stone-600 mb-4">{deleteConfirm.name}</p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1">Zrušit</Button>
              <Button variant="danger" onClick={handleDelete} className="flex-1">Smazat</Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename modal */}
      {editingName === 'party' && party && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-amber-900 mb-4">Přejmenovat družinu</h3>
            <input
              value={party.name}
              onChange={(e) => updateParty(party.id, { name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg mb-4"
              autoFocus
            />
            <Button onClick={() => setEditingName(null)} className="w-full">Hotovo</Button>
          </div>
        </div>
      )}

      {/* Character Generator Modal */}
      {showGenerator && pendingChar && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-4 md:p-6 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-amber-900">🐭 Nová myš</h3>
              <button onClick={() => { setShowGenerator(false); setBonusOrigin(null); setSelectedBonusItems([]); }} className="text-stone-400 hover:text-stone-600 text-2xl">✕</button>
            </div>

            {/* Name with gender buttons */}
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-1">Jméno</label>
              <div className="flex gap-2">
                <input
                  value={pendingChar.name}
                  onChange={(e) => setPendingChar({ ...pendingChar, name: e.target.value })}
                  className="flex-1 px-3 py-2 border-2 border-amber-300 rounded-lg font-bold"
                />
                <button
                  onClick={() => rollNewCharacter('male')}
                  className={`w-10 h-10 rounded-lg font-bold ${pendingChar.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}
                  title="Mužské jméno"
                >♂</button>
                <button
                  onClick={() => rollNewCharacter('female')}
                  className={`w-10 h-10 rounded-lg font-bold ${pendingChar.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}
                  title="Ženské jméno"
                >♀</button>
              </div>
            </div>

            {/* Origin (from HP × Pips) */}
            <div className="bg-amber-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-bold text-amber-700 mb-1">📜 Původ</div>
              <div className="font-bold text-lg text-amber-900">{pendingChar.origin?.name}</div>
            </div>

            {/* Attributes with swap */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-stone-500">Atributy</label>
                <span className="text-xs text-stone-400">Klikni pro prohození</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['STR', 'DEX', 'WIL'].map((attr, idx) => (
                  <div key={attr} className="text-center">
                    <div className="bg-amber-100 rounded-lg p-3">
                      <div className="text-xs font-bold text-amber-700 mb-1">{attr === 'STR' ? 'SÍL' : attr === 'DEX' ? 'MRŠ' : 'VŮL'}</div>
                      <div className="text-3xl font-bold text-amber-900">{pendingChar[attr]?.current}</div>
                    </div>
                    {idx < 2 && (
                      <button
                        onClick={() => swapAttributes(
                          ['STR', 'DEX', 'WIL'][idx], 
                          ['STR', 'DEX', 'WIL'][idx + 1]
                        )}
                        className="mt-1 px-2 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                      >
                        ↔️ {['SÍL', 'MRŠ', 'VŮL'][idx + 1]}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* HP & Pips */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-red-700">❤️ BO (Body odolnosti)</div>
                <div className="text-2xl font-bold text-red-900">{pendingChar.hp?.current}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-amber-700">💰 Ďobky</div>
                <div className="text-2xl font-bold text-amber-900">{pendingChar.pips}</div>
              </div>
            </div>

            {/* Bonus items warning */}
            {pendingChar.bonusItemCount > 0 && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                <div className="font-bold text-green-800 mb-2">
                  🎁 Bonus za slabé atributy!
                </div>
                <div className="text-sm text-green-700 space-y-2">
                  <p>
                    Tvůj nejvyšší atribut je pouze <strong>{Math.max(pendingChar.STR?.current, pendingChar.DEX?.current, pendingChar.WIL?.current)}</strong>, 
                    což ti dává nárok na bonus.
                  </p>
                  <p className="font-medium">
                    Hoď znovu na tabulku Původ a vezmi si <strong>{pendingChar.bonusItemCount === 2 ? 'oba předměty' : 'jeden předmět'}</strong>:
                  </p>
                  
                  {/* Bonus origin roller */}
                  <div className="bg-white rounded-lg p-3 mt-2">
                    <button
                      onClick={() => {
                        const hp = Math.floor(Math.random() * 6) + 1;
                        const pips = Math.floor(Math.random() * 6) + 1;
                        const key = `${hp}-${pips}`;
                        setBonusOrigin({ key, origin: ORIGINS[key], hp, pips });
                        setSelectedBonusItems([]);
                      }}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold mb-2"
                    >
                      🎲 Hodit na bonus původ
                    </button>
                    {bonusOrigin && (
                      <div className="text-center">
                        <div className="text-xs text-stone-500">HP {bonusOrigin.hp} × Pips {bonusOrigin.pips}</div>
                        <div className="font-bold text-green-800 text-lg mb-2">{bonusOrigin.origin.name}</div>
                        <div className="space-y-2">
                          {/* Item A */}
                          <button
                            onClick={() => {
                              if (selectedBonusItems.includes('A')) {
                                setSelectedBonusItems(selectedBonusItems.filter(i => i !== 'A'));
                              } else if (selectedBonusItems.length < pendingChar.bonusItemCount) {
                                setSelectedBonusItems([...selectedBonusItems, 'A']);
                              }
                            }}
                            className={`w-full p-2 rounded-lg text-left text-sm transition-all border-2 ${
                              selectedBonusItems.includes('A') 
                                ? 'bg-green-200 border-green-500 text-green-800' 
                                : 'bg-white border-stone-200 hover:border-green-300'
                            }`}
                          >
                            {selectedBonusItems.includes('A') ? '✓' : '○'} {bonusOrigin.origin.itemA}
                          </button>
                          {/* Item B */}
                          <button
                            onClick={() => {
                              if (selectedBonusItems.includes('B')) {
                                setSelectedBonusItems(selectedBonusItems.filter(i => i !== 'B'));
                              } else if (selectedBonusItems.length < pendingChar.bonusItemCount) {
                                setSelectedBonusItems([...selectedBonusItems, 'B']);
                              }
                            }}
                            className={`w-full p-2 rounded-lg text-left text-sm transition-all border-2 ${
                              selectedBonusItems.includes('B') 
                                ? 'bg-green-200 border-green-500 text-green-800' 
                                : 'bg-white border-stone-200 hover:border-green-300'
                            }`}
                          >
                            {selectedBonusItems.includes('B') ? '✓' : '○'} {bonusOrigin.origin.itemB}
                          </button>
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          {selectedBonusItems.length === 0 
                            ? `Klikni pro výběr ${pendingChar.bonusItemCount === 2 ? 'předmětů' : 'předmětu'}`
                            : `Vybráno: ${selectedBonusItems.length}/${pendingChar.bonusItemCount}`
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Birthsign & Fur */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="text-xs font-bold text-stone-500 mb-1">⭐ Rodné znamení</div>
                <div className="font-medium text-stone-800">{pendingChar.birthsign?.sign}</div>
                <div className="text-xs text-stone-500">{pendingChar.birthsign?.trait}</div>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="text-xs font-bold text-stone-500 mb-1">🐾 Srst</div>
                <div className="font-medium text-stone-800">{pendingChar.fur?.color}</div>
                <div className="text-xs text-stone-500">{pendingChar.fur?.pattern}</div>
              </div>
            </div>

            {/* Distinctive feature */}
            <div className="bg-stone-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-bold text-stone-500 mb-1">👁️ Výrazný rys</div>
              <div className="font-medium text-stone-800">{pendingChar.distinctiveFeature}</div>
            </div>

            {/* Weapon selector */}
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-2">⚔️ Počáteční zbraň</label>
              <select
                value={pendingChar.selectedWeaponIndex || 0}
                onChange={(e) => selectWeapon(parseInt(e.target.value))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                {STARTING_WEAPONS.map((weapon, i) => (
                  <option key={i} value={i}>
                    {weapon.name} ({weapon.damage}, {weapon.weight === 'light' ? 'lehká' : weapon.weight === 'medium' ? 'střední' : 'těžká'})
                  </option>
                ))}
              </select>
            </div>

            {/* Starting Inventory from Origin */}
            <div className="bg-amber-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-bold text-amber-700 mb-2">🎒 Počáteční výbava</div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">{STARTING_WEAPONS[pendingChar.selectedWeaponIndex || 0]?.name} ({STARTING_WEAPONS[pendingChar.selectedWeaponIndex || 0]?.damage})</span>
                  <span className="text-xs text-stone-400">⚔️</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">Zásoby</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">Pochodně</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">{pendingChar.origin?.itemA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="font-medium">{pendingChar.origin?.itemB}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => rollNewCharacter()} className="flex-1">
                🎲 Přehodit
              </Button>
              <Button onClick={confirmCharacter} className="flex-1">
                ✓ Vytvořit
              </Button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Treasury Modal */}
      {showTreasury && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-900">💰 Pokladna družiny</h3>
              <button onClick={() => setShowTreasury(false)} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
            </div>

            {/* Total */}
            <div className={`text-center py-3 mb-4 rounded-lg ${treasuryTotal >= 0 ? 'bg-amber-50' : 'bg-red-50'}`}>
              <div className="text-xs text-stone-500">Celkem</div>
              <div className={`text-3xl font-bold ${treasuryTotal >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {treasuryTotal} ď
              </div>
            </div>

            {/* Add new item */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Popis..."
                value={newTreasuryItem.name}
                onChange={(e) => setNewTreasuryItem(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addTreasuryItem()}
                className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="±"
                value={newTreasuryItem.amount}
                onChange={(e) => setNewTreasuryItem(prev => ({ ...prev, amount: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addTreasuryItem()}
                className="w-20 px-2 py-2 text-sm border border-stone-300 rounded-lg text-center"
              />
              <Button onClick={addTreasuryItem}>+</Button>
            </div>

            {/* Items list */}
            <div className="max-h-60 overflow-y-auto space-y-1">
              {treasuryItems.length === 0 ? (
                <p className="text-center text-stone-400 py-4">Prázdná pokladna</p>
              ) : (
                treasuryItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-700">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </span>
                      <button
                        onClick={() => removeTreasuryItem(item.id)}
                        className="text-stone-400 hover:text-red-500"
                      >✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hireling Recruitment Picker Modal */}
      {showHirelingPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-4 md:p-6 max-w-2xl w-full shadow-2xl my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-amber-900">🐿️ Verbování pomocníků</h3>
                <button onClick={() => setShowHirelingPicker(false)} className="text-stone-400 hover:text-stone-600 text-2xl">✕</button>
              </div>

              <p className="text-sm text-stone-600 mb-4">
                Klikni na typ pro vygenerování dostupných kandidátů. Vyber které chceš naverbovat.
              </p>

              {/* Hireling type list */}
              <div className="space-y-2 mb-4">
                {HIRELING_TYPES.map(ht => {
                  const isSelected = currentRecruitType === ht.type;

                  return (
                    <div
                      key={ht.type}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-200 ring-2 ring-amber-400' : 'bg-amber-50 hover:bg-amber-100'
                      }`}
                      onClick={() => generateCandidates(ht.type)}
                    >
                      <div className="flex-1">
                        <div className="font-bold text-amber-900">{ht.name}</div>
                        <div className="text-xs text-stone-500">{ht.skill}</div>
                      </div>
                      <div className="text-center w-16">
                        <div className="text-xs text-stone-400">Počet</div>
                        <div className="font-bold">{ht.dice}</div>
                      </div>
                      <div className="text-center w-16">
                        <div className="text-xs text-stone-400">Mzda</div>
                        <div className="font-bold text-amber-700">{ht.cost}</div>
                      </div>
                      <div className="w-20 text-center">
                        <Button size="small" variant={isSelected ? 'primary' : 'ghost'}>
                          🎲 {ht.dice}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Candidates list */}
              {hirelingCandidates.length > 0 && currentRecruitType && (
                <div className="border-t border-stone-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-amber-900">
                        Dostupní kandidáti ({hirelingCandidates.length})
                        {' '}<span className="text-stone-500 font-normal">
                          - {HIRELING_TYPES.find(t => t.type === currentRecruitType)?.name}
                        </span>
                      </h4>
                      <p className="text-sm text-amber-700 mt-1">
                        🎯 {HIRELING_TYPES.find(t => t.type === currentRecruitType)?.skill}
                      </p>
                    </div>
                    {selectedCandidateIds.length > 0 && (
                      <Button onClick={hireSelectedCandidates}>
                        Najmout vybrané ({selectedCandidateIds.length})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {hirelingCandidates.map(c => (
                      <div
                        key={c.tempId}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                          selectedCandidateIds.includes(c.tempId)
                            ? 'border-green-500 bg-green-50'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        }`}
                        onClick={() => toggleCandidate(c.tempId)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCandidateIds.includes(c.tempId)}
                          onChange={() => toggleCandidate(c.tempId)}
                          className="w-5 h-5 text-green-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-stone-800">{c.name}</div>
                          <div className="text-xs text-stone-500 italic">{c.physicalDetail}</div>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                            SÍL {c.STR}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            MRŠ {c.DEX}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            VŮL {c.WIL}
                          </span>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">
                            BO {c.HP}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hirelingCandidates.length === 0 && (
                    <div className="text-center py-4 text-stone-500">
                      Žádní kandidáti nejsou k dispozici
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-stone-500">
                <strong>Morálka:</strong> Test záchranou na Vůli (2d6 ≤ VŮL) když ve stresu
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PARTY & MEMBER SELECTOR ===== */}
      <ResultCard>
        {/* Party row */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-stone-200">
          <span className="text-sm font-bold text-stone-500">🏕️</span>
          <select
            value={activePartyId || ''}
            onChange={(e) => {
              setActivePartyId(e.target.value);
              const p = parties.find(p => p.id === e.target.value);
              if (p?.members?.length > 0) setActiveCharacterId(p.members[0].id);
              else setActiveCharacterId(null);
            }}
            className="flex-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg font-medium"
          >
            {parties.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.members?.length || 0})</option>
            ))}
          </select>
          <Button size="small" variant="ghost" onClick={() => createParty()}>+</Button>
          <Button size="small" variant="ghost" onClick={() => setEditingName('party')}>✏️</Button>
          <Button size="small" variant="ghost" onClick={() => party && setDeleteConfirm({ type: 'party', id: party.id, name: party.name })}>🗑️</Button>
        </div>

        {/* Treasury button */}
        {party && (
          <div className="mb-4 pb-4 border-b border-stone-200">
            <button
              onClick={() => setShowTreasury(true)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                treasuryTotal >= 0 ? 'bg-amber-50 hover:bg-amber-100' : 'bg-red-50 hover:bg-red-100'
              }`}
            >
              <span className="text-sm font-bold text-stone-600">💰 Pokladna</span>
              <span className={`font-bold ${treasuryTotal >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {treasuryTotal} ď
              </span>
            </button>
          </div>
        )}

        {/* Members row */}
        {party && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-stone-500">👥 Členové</span>
              <div className="flex gap-1">
                <Button size="small" onClick={openGenerator}>🎲 Myš</Button>
                <Button size="small" variant="ghost" onClick={openHirelingPicker}>🐿️ Verbovat</Button>
              </div>
            </div>
            
            {party.members?.length === 0 ? (
              <p className="text-stone-400 text-center py-4">Prázdná družina - přidej postavu!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {party.members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => setActiveCharacterId(member.id)}
                    className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                      activeCharacterId === member.id
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span className="text-xl">{member.type === 'pc' ? '🐭' : '🐿️'}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm">{member.name.split(' ')[0]}</div>
                      <div className={`text-xs ${activeCharacterId === member.id ? 'text-amber-200' : 'text-stone-400'}`}>
                        HP {member.hp?.current}/{member.hp?.max}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </ResultCard>

      {/* ===== CHARACTER SHEET ===== */}
      {!character ? (
        <ResultCard>
          <div className="text-center py-8 text-stone-400">
            <p className="text-4xl mb-3">👆</p>
            <p>Vyber nebo vytvoř postavu</p>
          </div>
        </ResultCard>
      ) : (
        <>
          {/* Character Header */}
          <ResultCard className="bg-gradient-to-r from-amber-100 to-amber-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{character.type === 'pc' ? '🐭' : '🐿️'}</span>
                <div>
                  <h2 
                    className="text-xl font-bold text-amber-900 cursor-pointer hover:text-amber-700"
                    onClick={() => setEditingName(character.id)}
                  >
                    {character.name}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {character.type === 'pc'
                      ? `${character.origin?.name || character.background || 'Level ' + (character.level || 1)}`
                      : (() => {
                          const ht = HIRELING_TYPES.find(t => t.type === character.hirelingType);
                          return ht ? `${ht.name} • ${ht.cost}` : 'Pomocník';
                        })()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteConfirm({ type: 'character', id: character.id, name: character.name })}
                className="p-2 text-stone-400 hover:text-red-500 rounded"
              >
                🗑️
              </button>
            </div>

            {/* HP & Pips - only for PC (hirelings have their own in HirelingSheet) */}
            {character.type === 'pc' && (
              <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xs text-stone-500 mb-1">❤️ HP</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => updateHP(-1)} className="w-10 h-10 bg-red-100 text-red-700 rounded-lg font-bold text-xl">-</button>
                    <span className="text-2xl font-bold text-red-700 min-w-[60px]">
                      {character.hp?.current || 0}/{character.hp?.max || 6}
                    </span>
                    <button onClick={() => updateHP(1)} className="w-10 h-10 bg-green-100 text-green-700 rounded-lg font-bold text-xl">+</button>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xs text-stone-500 mb-1">💰 Pips</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => updatePips(-1)} className="w-10 h-10 bg-stone-100 text-stone-700 rounded-lg font-bold text-xl">-</button>
                    <span className="text-2xl font-bold text-amber-600 min-w-[60px]">{character.pips || 0}</span>
                    <button onClick={() => updatePips(1)} className="w-10 h-10 bg-stone-100 text-stone-700 rounded-lg font-bold text-xl">+</button>
                  </div>
                </div>
              </div>
            )}
          </ResultCard>

          {/* PC-only sections */}
          {character.type === 'pc' && (
            <>
              {/* Attributes */}
              <ResultCard title="💪 Atributy">
                <div className="grid grid-cols-3 gap-3">
                  {['STR', 'DEX', 'WIL'].map(attr => (
                    <div key={attr} className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-xs font-bold text-amber-700 mb-1">{attr}</div>
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={character[attr]?.current || 10}
                          onChange={(e) => updateAttribute(attr, 'current', e.target.value)}
                          className="w-12 text-center text-xl font-bold text-amber-900 bg-white border border-amber-300 rounded"
                          min="1"
                          max="18"
                        />
                        <span className="text-stone-400">/</span>
                        <input
                          type="number"
                          value={character[attr]?.max || 10}
                          onChange={(e) => updateAttribute(attr, 'max', e.target.value)}
                          className="w-12 text-center text-sm font-medium text-stone-500 bg-white border border-stone-200 rounded"
                          min="1"
                          max="18"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ResultCard>

              {/* Inventory Grid - Mausritter Original Layout */}
              <ResultCard title="🎒 Inventář">
                {/* Item detail popup */}
                {popupItem && character.inventorySlots?.[popupItem.slotId] && (
                  <ItemPopup
                    key={`${popupItem.slotId}-${character.inventorySlots[popupItem.slotId]?.usageDots}`}
                    item={character.inventorySlots[popupItem.slotId]}
                    slotId={popupItem.slotId}
                    onUpdate={updateSlotItem}
                    onRemove={removeSlotItem}
                    onMove={(slotId) => setSelectedSlot(slotId)}
                    onClose={() => setPopupItem(null)}
                  />
                )}
                {selectedSlot && (
                  <div className="mb-2 p-1 bg-amber-100 rounded text-xs text-amber-800 flex justify-between items-center">
                    <span>Vyber cílový slot</span>
                    <button onClick={() => setSelectedSlot(null)} className="text-amber-600 hover:text-amber-800">✕ Zrušit</button>
                  </div>
                )}
                <div className="space-y-3">
                  {/* Main Grid FIRST - Paws | Body | Pack */}
                  <div ref={inventoryRef} className="flex gap-2 md:gap-3 items-start justify-center">
                    {/* Paws */}
                    <div className="text-center">
                      <div style={{ fontSize: Math.max(12, slotSize * 0.2) }} className="text-amber-600 font-bold mb-1">🐾</div>
                      <div className="flex flex-col gap-1" style={{ position: 'relative' }}>
                        <InvSlot id="mainPaw" slots={character.inventorySlots} color="amber" 
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem} 
                          updateChar={updateCharacter} belowId="offPaw" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="offPaw" slots={character.inventorySlots} color="amber"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="mainPaw" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                      </div>
                    </div>
                    
                    {/* Body */}
                    <div className="text-center">
                      <div style={{ fontSize: Math.max(12, slotSize * 0.2) }} className="text-blue-600 font-bold mb-1">👕</div>
                      <div className="flex flex-col gap-1" style={{ position: 'relative' }}>
                        <InvSlot id="body1" slots={character.inventorySlots} color="blue"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="body2" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="body2" slots={character.inventorySlots} color="blue"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="body1" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                      </div>
                    </div>
                    
                    {/* Pack 3x2 */}
                    <div className="text-center flex-1">
                      <div style={{ fontSize: Math.max(12, slotSize * 0.2) }} className="text-stone-500 font-bold mb-1">🎒</div>
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, ${slotSize}px)`, gridTemplateRows: `repeat(2, ${slotSize}px)`, gap: 4, position: 'relative' }}>
                        <InvSlot id="pack1" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="pack4" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack2" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="pack5" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack3" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} belowId="pack6" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack4" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="pack1" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack5" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="pack2" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                        <InvSlot id="pack6" slots={character.inventorySlots} color="stone"
                          onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                          updateChar={updateCharacter} aboveId="pack3" slotSize={slotSize}
                          selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick add items - below grid */}
                  <details className="border-t border-stone-200 pt-2">
                    <summary className="text-xs font-bold text-stone-500 cursor-pointer hover:text-stone-700">▼ Přidat předmět</summary>
                    <div className="mt-2 flex flex-wrap gap-1">
                    {[
                      { name: 'Zásoby', type: 'item', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Pochodeň', type: 'item', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Jehla', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Meč', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', maxUsage: 3, width: 1, height: 1 },
                      { name: 'Kopí↕', type: 'weapon', damageDef: 'k10', weaponClass: 'Heavy', maxUsage: 3, width: 1, height: 2 },
                      { name: 'Zbroj↕', type: 'armor', damageDef: '1', weaponClass: 'Heavy', maxUsage: 3, width: 1, height: 2 },
                    ].map((item, i) => (
                      <button key={i} onClick={() => {
                        const slots = character.inventorySlots || {};
                        const pairs = [['mainPaw', 'offPaw'],['body1', 'body2'],['pack1', 'pack4'],['pack2', 'pack5'],['pack3', 'pack6']];
                        let targetSlot = null;
                        if (item.height === 2) {
                          for (const [top, bottom] of pairs) {
                            if (!slots[top] && !slots[bottom]) { targetSlot = top; break; }
                          }
                          if (!targetSlot) { alert('Potřebuješ 2 volné sloty pod sebou!'); return; }
                        } else {
                          const allSlots = ['mainPaw','offPaw','body1','body2','pack1','pack2','pack3','pack4','pack5','pack6'];
                          const blockedByAbove = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };
                          targetSlot = allSlots.find(s => !slots[s] && !(blockedByAbove[s] && slots[blockedByAbove[s]]?.height === 2));
                        }
                        if (targetSlot) updateCharacter({ inventorySlots: { ...slots, [targetSlot]: { id: Math.random().toString(36).substr(2,9), ...item, usageDots: 0 }}});
                      }}
                        className={`px-2 py-1 rounded text-xs border ${
                          item.type === 'weapon' ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 
                          item.type === 'armor' ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' : 
                          'bg-amber-50 border-amber-200 hover:bg-amber-100'
                        }`}
                      >{item.name}</button>
                    ))}
                    {CONDITIONS.slice(0, 3).map(c => (
                      <button key={c.id} onClick={() => {
                        const slots = character.inventorySlots || {};
                        const allSlots = ['mainPaw','offPaw','body1','body2','pack1','pack2','pack3','pack4','pack5','pack6'];
                        const blockedByAbove = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };
                        const empty = allSlots.find(s => !slots[s] && !(blockedByAbove[s] && slots[blockedByAbove[s]]?.height === 2));
                        if (empty) updateCharacter({ inventorySlots: { ...slots, [empty]: { 
                          id: Math.random().toString(36).substr(2,9), name: c.name, type: 'condition', isCondition: true,
                          conditionId: c.id, mechanic: c.effect, clear: c.clear, bgColor: '#fecaca', width: 1, height: 1, maxUsage: 0, usageDots: 0
                        }}});
                      }}
                        className="px-2 py-1 rounded text-xs bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                      >{c.name}</button>
                    ))}
                    </div>
                  </details>
                </div>
              </ResultCard>

              {/* Info */}
              <ResultCard title="📋 Info">
                <div className="space-y-2 text-sm">
                  <p><strong>Původ:</strong> {character.origin?.name || character.background || '—'}</p>
                  <p><strong>Znamení:</strong> {character.birthsign?.sign || character.birthsign?.name} <span className="text-stone-500">({character.birthsign?.trait || character.birthsign?.traits})</span></p>
                  {character.fur && (
                    <p><strong>Srst:</strong> {character.fur.color}, {character.fur.pattern?.toLowerCase()}</p>
                  )}
                  <p><strong>Výrazný rys:</strong> {character.distinctiveFeature || character.physicalDetail || '—'}</p>
                  <p><strong>XP:</strong> {character.xp || 0}</p>
                </div>
              </ResultCard>
            </>
          )}

          {/* Hireling-only sections */}
          {character.type === 'hireling' && (
            <HirelingSheet
              character={character}
              updateCharacter={updateCharacter}
              editMode={editMode}
              setEditMode={setEditMode}
              onLogEntry={onLogEntry}
              treasuryTotal={treasuryTotal}
              onPayHireling={() => payHireling(character)}
            />
          )}
        </>
      )}
    </div>
  );
};

// ========== HIRELING SHEET COMPONENT ==========
const HirelingSheet = ({ character, updateCharacter, editMode, setEditMode, onLogEntry, treasuryTotal, onPayHireling }) => {
  // Get hireling type info if available
  const hirelingTypeInfo = character.hirelingType && character.hirelingType !== 'generic'
    ? HIRELING_TYPES.find(t => t.type === character.hirelingType)
    : null;

  // Migrate old hirelings that don't have stats
  React.useEffect(() => {
    if (!character.STR) {
      const roll2k6 = () => Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      const str = roll2k6();
      const dex = roll2k6();
      const wil = roll2k6();
      const hp = character.hp?.max || Math.floor(Math.random() * 6) + 1;
      updateCharacter({
        STR: { current: str, max: str },
        DEX: { current: dex, max: dex },
        WIL: { current: wil, max: wil },
        hp: { current: hp, max: hp },
        inventorySlots: character.inventorySlots || {
          strongPaw1: null, strongPaw2: null,
          weakPaw1: null, weakPaw2: null
        }
      });
    }
  }, [character.id]);

  const updateStat = (stat, field, delta) => {
    const current = character[stat]?.[field] || 0;
    const max = field === 'current' ? (character[stat]?.max || 12) : 12;
    const newVal = Math.max(0, Math.min(max, current + delta));
    updateCharacter({ [stat]: { ...character[stat], [field]: newVal } });
  };

  // Hireling inventory slots
  const HIRELING_SLOTS = ['strongPaw1', 'strongPaw2', 'weakPaw1', 'weakPaw2'];

  return (
    <ResultCard>
      {/* Header with skill */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-stone-600">
          {hirelingTypeInfo && <span className="font-medium text-amber-800">{hirelingTypeInfo.skill}</span>}
          {!hirelingTypeInfo && character.physicalDetail && <span className="italic">{character.physicalDetail}</span>}
        </div>
        <Button size="small" variant="ghost" onClick={() => {
          const { dice, total } = roll2D6();
          const threshold = character.WIL?.current || 7;
          const success = total <= threshold;
          alert(`Morálka: [${dice.join(', ')}] = ${total} vs VŮL ${threshold}\n${success ? '✓ Zůstává!' : '✗ UTEČE!'}`);
        }}>
          🎲 Morálka
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 mb-3">
        {[
          { key: 'STR', label: 'SÍL', color: 'red' },
          { key: 'DEX', label: 'MRŠ', color: 'green' },
          { key: 'WIL', label: 'VŮL', color: 'blue' },
          { key: 'hp', label: 'BO', color: 'amber' }
        ].map(({ key, label, color }) => (
          <div key={key} className={`flex-1 text-center p-2 bg-${color}-50 rounded`}>
            <div className={`text-xs text-${color}-600`}>{label}</div>
            <div className="flex items-center justify-center gap-1">
              <button className="w-5 h-5 text-xs bg-stone-200 rounded hover:bg-stone-300" onClick={() => updateStat(key, 'current', -1)}>-</button>
              <span className={`font-bold text-${color}-700`}>{character[key]?.current || '?'}/{character[key]?.max || '?'}</span>
              <button className="w-5 h-5 text-xs bg-stone-200 rounded hover:bg-stone-300" onClick={() => updateStat(key, 'current', 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory + Money row */}
      <div className="flex gap-2">
        <div className="flex-1 grid grid-cols-4 gap-1">
          {['strongPaw1', 'strongPaw2', 'weakPaw1', 'weakPaw2'].map(slotId => {
            const item = character.inventorySlots?.[slotId];
            return (
              <div key={slotId} className="h-10 border border-dashed border-stone-300 rounded flex items-center justify-center bg-stone-50 text-xs">
                {item ? (
                  <span className="truncate px-1" title={item.name}>{item.name}</span>
                ) : (
                  <span className="text-stone-300">—</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <div className="text-xs text-stone-500 mb-1">💰 Mzda: {hirelingTypeInfo?.cost || character.cost || '1 ď'}</div>
          <button
            onClick={onPayHireling}
            className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Vyplatit
          </button>
        </div>
      </div>
    </ResultCard>
  );
};

// ========== PC SHEET COMPONENT ==========
const PCSheet = ({ character, updateCharacter, editMode, setEditMode, onLogEntry }) => {
  
  const updateAttribute = (attr, field, value) => {
    const parsed = parseInt(value) || 0;
    updateCharacter({
      [attr]: {
        ...character[attr],
        [field]: Math.max(0, Math.min(18, parsed))
      }
    });
  };

  const updateHP = (delta) => {
    const newHP = Math.max(0, Math.min(character.hp.max, character.hp.current + delta));
    updateCharacter({ hp: { ...character.hp, current: newHP } });
    onLogEntry({
      type: 'state_change',
      subtype: 'hp',
      timestamp: formatTimestamp(),
      change: delta,
      newValue: newHP
    });
  };

  const updatePips = (delta) => {
    updateCharacter({ pips: Math.max(0, (character.pips || 0) + delta) });
  };

  const toggleCondition = (condId) => {
    const hasCondition = character.conditions?.includes(condId);
    updateCharacter({
      conditions: hasCondition
        ? character.conditions.filter(c => c !== condId)
        : [...(character.conditions || []), condId]
    });
  };

  const addInventoryItem = () => {
    updateCharacter({
      inventory: [...(character.inventory || []), {
        id: generateId(),
        name: 'Nový předmět',
        slot: 1,
        usageDots: 0,
        maxUsage: 3
      }]
    });
  };

  const updateInventoryItem = (id, field, value) => {
    updateCharacter({
      inventory: character.inventory.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const removeInventoryItem = (id) => {
    updateCharacter({
      inventory: character.inventory.filter(item => item.id !== id)
    });
  };

  return (
    <>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setEditMode(!editMode)} variant="ghost">
          {editMode ? '✓ Hotovo' : '✏️ Upravit'}
        </Button>
      </div>

      {/* Basic Info */}
      <ResultCard title="📋 Základní údaje">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-stone-500 block">Level</label>
            <p className="font-bold text-lg text-amber-900">{character.level || 1}</p>
          </div>
          <div>
            <label className="text-sm text-stone-500 block">Znamení</label>
            <p className="font-bold text-amber-900">
              {character.birthsign?.name || '—'}
              {character.birthsign?.traits && (
                <span className="font-normal text-sm text-stone-600 block">{character.birthsign.traits}</span>
              )}
            </p>
          </div>
          <div>
            <label className="text-sm text-stone-500 block">Fyzický detail</label>
            <p className="text-stone-700">{character.physicalDetail || '—'}</p>
          </div>
          <div>
            <label className="text-sm text-stone-500 block">Zájmena</label>
            {editMode ? (
              <Input value={character.pronouns || ''} onChange={(v) => updateCharacter({ pronouns: v })} />
            ) : (
              <p className="text-stone-700">{character.pronouns || '—'}</p>
            )}
          </div>
        </div>
      </ResultCard>

      {/* Attributes */}
      <ResultCard>
        <HelpHeader 
          title="Atributy" 
          icon="💪"
          tooltip={
            <div>
              <p className="font-bold mb-2">🎯 Atributy postavy</p>
              
              <p className="font-bold mb-1">📊 Co znamenají:</p>
              <ul className="text-xs space-y-1 mb-2">
                <li><b>STR (Síla)</b> = fyzická síla, zdraví, odolnost</li>
                <li><b>DEX (Mrštnost)</b> = rychlost, obratnost, reflexy</li>
                <li><b>WIL (Vůle)</b> = odvaha, vůle, magie</li>
              </ul>
              
              <p className="font-bold mb-1">🎲 Jak házet Save:</p>
              <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                <li>Hoď d20</li>
                <li>Musíš hodit <b>≤ current hodnota</b> atributu</li>
                <li>Čím nižší hod, tím lepší (1 = vždy úspěch)</li>
              </ol>
              
              <p className="font-bold mb-1">💔 Poškození atributů:</p>
              <p className="text-xs text-stone-300">
                Když HP klesne na 0, poškození jde do STR. Kritické zásahy mohou poškodit DEX nebo WIL. Pokud atribut klesne na 0, postava je mimo hru.
              </p>
            </div>
          }
        />
        <div className="grid grid-cols-3 gap-4">
          {['STR', 'DEX', 'WIL'].map(attr => (
            <div key={attr} className="text-center p-4 bg-amber-100 rounded-lg">
              <div className="text-sm font-bold text-amber-800 mb-2">{attr}</div>
              {editMode ? (
                <div className="space-y-2">
                  <Input 
                    type="number" value={character[attr]?.current || 10}
                    onChange={(v) => updateAttribute(attr, 'current', v)}
                    className="text-center"
                  />
                  <Input 
                    type="number" value={character[attr]?.max || 10}
                    onChange={(v) => updateAttribute(attr, 'max', v)}
                    className="text-center text-sm"
                  />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-amber-900">{character[attr]?.current || 10}</div>
                  <div className="text-sm text-stone-500">max: {character[attr]?.max || 10}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </ResultCard>

      {/* HP, Pips, XP */}
      <ResultCard>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <label className="text-sm text-stone-500 block mb-1">❤️ HP</label>
            <div className="text-3xl font-bold text-red-700">
              {character.hp?.current || 0}
              <span className="text-xl text-stone-500">/{character.hp?.max || 6}</span>
            </div>
            <div className="flex justify-center gap-1 mt-2">
              <Button size="small" variant="danger" onClick={() => updateHP(-1)}>-1</Button>
              <Button size="small" variant="success" onClick={() => updateHP(1)}>+1</Button>
              <Button size="small" variant="ghost" onClick={() => updateHP(character.hp?.max - character.hp?.current)}>Full</Button>
            </div>
          </div>
          <div className="text-center">
            <label className="text-sm text-stone-500 block mb-1">💰 Pips</label>
            <div className="text-3xl font-bold text-amber-600">{character.pips || 0}</div>
            <div className="flex justify-center gap-1 mt-2">
              <Button size="small" variant="ghost" onClick={() => updatePips(-1)}>-1</Button>
              <Button size="small" variant="ghost" onClick={() => updatePips(1)}>+1</Button>
            </div>
          </div>
          <div className="text-center">
            <label className="text-sm text-stone-500 block mb-1">⭐ XP</label>
            <div className="text-2xl font-bold text-purple-700">{character.xp || 0}</div>
            <div className="flex justify-center gap-1 mt-2">
              <Button size="small" onClick={() => updateCharacter({ xp: (character.xp || 0) + 10 })}>+10</Button>
              <Button size="small" onClick={() => updateCharacter({ xp: (character.xp || 0) + 50 })}>+50</Button>
            </div>
          </div>
        </div>
      </ResultCard>

      {/* Conditions */}
      <ResultCard>
        <HelpHeader title="Stavy" icon="🩹" tooltip={
          <div>
            <p className="font-bold mb-2">🎯 Stavy postavy</p>
            <p className="text-xs mb-2">Klikni na stav pro aktivaci/deaktivaci. Aktivní stavy zabírají slot v inventáři!</p>
            
            <p className="font-bold mb-1">📋 Stavy:</p>
            <ul className="text-xs space-y-1">
              <li>😰 <b>Vyděšený</b> = -1 na WIL saves, z boje uteč nebo bojuj s nevýhodou</li>
              <li>😵 <b>Vyčerpaný</b> = -1 na všechny saves, potřebuješ odpočinek</li>
              <li>🤢 <b>Otrávený</b> = -1 na STR saves, hoď d6 po každém odpočinku (6 = vyléčen)</li>
              <li>😫 <b>Hladový</b> = nemůžeš léčit HP, zabírá 2 sloty</li>
            </ul>
            
            <p className="text-xs text-stone-300 mt-2 italic">
              💡 Stavy se léčí odpočinkem, jídlem, nebo speciálními předměty.
            </p>
          </div>
        } />
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map(cond => (
            <button
              key={cond.id}
              onClick={() => toggleCondition(cond.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                character.conditions?.includes(cond.id)
                  ? 'bg-red-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
              title={cond.effect}
            >
              {cond.name}
            </button>
          ))}
        </div>
      </ResultCard>

      {/* Inventory */}
      <ResultCard>
        <HelpHeader title="Inventář" icon="🎒" tooltip={
          <div>
            <p className="font-bold mb-2">🎯 Systém inventáře</p>
            <p className="text-xs mb-2">Myš má omezený prostor - každý předmět zabírá sloty. Přetížení = pomalost!</p>
            
            <p className="font-bold mb-1">📦 Typy slotů:</p>
            <ul className="text-xs space-y-1 mb-2">
              <li>🖐️ <b>Ruce (2)</b> = zbraně a štíty pro boj</li>
              <li>🎒 <b>Tělo (6)</b> = hlavní inventář</li>
              <li>📦 <b>Balení</b> = rozšíření přes batoh/vak</li>
            </ul>
            
            <p className="font-bold mb-1">⚙️ Opotřebení (Usage Die):</p>
            <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
              <li>Po použití předmětu (pochodeň, lano, jídlo...) hoď d6</li>
              <li>Na <b>1-3</b> = označ tečku (●) na předmětu</li>
              <li>Když jsou všechny tečky označeny = předmět je spotřebován</li>
            </ol>
            
            <p className="text-xs text-stone-300 italic">
              💡 Klikni na předmět pro jeho použití/označení.
            </p>
          </div>
        } />
        <div className="space-y-2">
          {character.inventory?.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
              <Input 
                value={item.name}
                onChange={(v) => updateInventoryItem(item.id, 'name', v)}
                className="flex-1"
              />
              <div className="flex gap-1">
                {[0, 1, 2].map(dot => (
                  <button
                    key={dot}
                    onClick={() => updateInventoryItem(item.id, 'usageDots', dot < item.usageDots ? dot : dot + 1)}
                    className={`w-4 h-4 rounded-full border-2 ${
                      dot < item.usageDots ? 'bg-amber-600 border-amber-600' : 'border-amber-400'
                    }`}
                  />
                ))}
              </div>
              <Button size="small" variant="ghost" onClick={() => removeInventoryItem(item.id)}>✕</Button>
            </div>
          ))}
          <Button size="small" variant="ghost" onClick={addInventoryItem} className="w-full">
            + Přidat předmět
          </Button>
        </div>
      </ResultCard>
    </>
  );
};


// ============================================
// INVENTORY SLOT COMPONENT - Mausritter Style
// ============================================

// Responsive slot size hook - fills available width
const useSlotSize = (containerRef) => {
  const [size, setSize] = useState(44);
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef?.current) {
        // Calculate slot size based on container width
        // Layout: paw(1 slot) + body(1 slot) + pack(3 slots) = 5 columns + gaps
        const containerWidth = containerRef.current.offsetWidth;
        // 5 columns + 4 gaps (~12px each)
        const calculatedSize = Math.floor((containerWidth - 60) / 5);
        // Clamp between 44 and 120
        const newSize = Math.min(120, Math.max(44, calculatedSize));
        if (newSize !== size) setSize(newSize);
      }
    };
    
    // Initial update after render
    const timer = setTimeout(updateSize, 50);
    
    window.addEventListener('resize', updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
    };
  }, [containerRef, size]);
  
  return size;
};

const SLOT_SIZE = 44; // Default fallback

// Item detail popup
const ItemPopup = ({ item, slotId, onUpdate, onRemove, onMove, onClose }) => {
  const isCond = item.type === 'condition' || item.isCondition;
  const bg = item.bgColor || (isCond ? '#fecaca' : item.type === 'weapon' ? '#f1f5f9' : item.type === 'armor' ? '#e0e7ff' : '#fef3c7');
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: bg, border: '3px solid #292524', borderRadius: 8,
          width: '100%', maxWidth: 200, padding: 0, overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ background: isCond ? bg : '#fff', borderBottom: '2px solid #292524', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#78716c' }}>×</button>
        </div>
        
        {/* Stats */}
        <div style={{ padding: 12 }}>
          {/* Damage/Defense */}
          {(item.damageDef || item.damage || item.defense) && (
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#57534e' }}>{item.type === 'armor' ? 'Obrana:' : 'Poškození:'}</span>
              <span style={{ background: '#fff', border: '2px solid #292524', borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>
                {item.damageDef || item.damage || item.defense}
              </span>
            </div>
          )}
          
          {/* Weapon class */}
          {item.weaponClass && (
            <div style={{ marginBottom: 8, fontSize: 12, color: '#57534e' }}>
              Třída: <strong>{item.weaponClass}</strong>
            </div>
          )}
          
          {/* Usage dots */}
          {!isCond && item.maxUsage > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#57534e', marginBottom: 4 }}>Použití:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0,1,2].map(i => (
                  <button
                    key={i}
                    onClick={() => onUpdate(slotId, 'usageDots', i < (item.usageDots||0) ? i : i+1)}
                    className="active:scale-90 hover:scale-110 transition-transform duration-100"
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      border: '3px solid #292524',
                      background: i < (item.usageDots||0) ? '#292524' : 'transparent',
                      cursor: 'pointer',
                      boxShadow: i < (item.usageDots||0) ? 'inset 0 2px 4px rgba(0,0,0,0.3)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Condition info */}
          {isCond && (
            <div style={{ fontSize: 12 }}>
              {item.mechanic && <div style={{ marginBottom: 4, fontStyle: 'italic' }}>{item.mechanic}</div>}
              {item.clear && <div><strong>Odstranění:</strong> {item.clear}</div>}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div style={{ borderTop: '2px solid #292524', padding: 8, display: 'flex', gap: 8 }}>
          <button
            onClick={() => { onMove(slotId); onClose(); }}
            style={{ flex: 1, padding: '8px', background: '#fef3c7', border: '2px solid #292524', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}
          >
            ↔ Přesunout
          </button>
          <button
            onClick={() => { onRemove(slotId); onClose(); }}
            style={{ flex: 1, padding: '8px', background: '#fecaca', border: '2px solid #292524', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}
          >
            🗑 Smazat
          </button>
        </div>
      </div>
    </div>
  );
};

// Inventory slot
const InvSlot = ({ id, slots, color, onMove, onUpdate, onRemove, updateChar, aboveId, belowId, selectedSlot, setSelectedSlot, setPopupItem, slotSize = 44 }) => {
  const slot = slots?.[id];
  const aboveSlot = aboveId ? slots?.[aboveId] : null;
  
  const isBlocked = aboveSlot?.height === 2;
  const isSelected = selectedSlot === id;
  const isTarget = selectedSlot && selectedSlot !== id;
  
  const colors = {
    amber: { bg: '#fef3c7', border: '#fcd34d', ring: '#f59e0b' },
    blue: { bg: '#dbeafe', border: '#93c5fd', ring: '#3b82f6' },
    stone: { bg: '#f5f5f4', border: '#d6d3d1', ring: '#78716c' }
  };
  const c = colors[color] || colors.stone;
  
  const is2H = slot?.height === 2;
  
  if (isBlocked) {
    return <div style={{ width: slotSize, height: slotSize }} />;
  }
  
  const handleClick = () => {
    if (selectedSlot && selectedSlot !== id) {
      // Move from selected slot to this slot
      onMove(selectedSlot, id);
      setSelectedSlot(null);
    } else if (slot) {
      // Open popup for this item
      setPopupItem({ item: slot, slotId: id });
    }
  };
  
  return (
    <div
      onClick={handleClick}
      style={{
        width: slotSize,
        height: slotSize,
        background: slot ? 'transparent' : c.bg,
        border: slot ? 'none' : `2px dashed ${c.border}`,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        overflow: is2H ? 'visible' : 'hidden',
        outline: isSelected ? `3px solid ${c.ring}` : (isTarget && !slot ? `2px solid ${c.ring}` : 'none'),
        cursor: 'pointer'
      }}
    >
      {slot && <MiniCard item={slot} is2H={is2H} isSelected={isSelected} slotSize={slotSize} />}
    </div>
  );
};

// Ultra-minimal card (just name + color)
const MiniCard = ({ item, is2H, isSelected, slotSize = 44 }) => {
  const isCond = item.type === 'condition' || item.isCondition;
  const cardSize = slotSize - 4;
  const bg = item.bgColor || (isCond ? '#fecaca' : item.type === 'weapon' ? '#f1f5f9' : item.type === 'armor' ? '#e0e7ff' : '#fef3c7');

  // Dynamic font size based on slot size
  const fontSize = Math.max(8, Math.floor(slotSize * 0.18));
  const fontSize2H = Math.max(9, Math.floor(slotSize * 0.16));
  const dotSize = Math.max(4, Math.floor(slotSize * 0.08));

  return (
    <div
      className="active:scale-95 active:brightness-90 transition-transform duration-100"
      style={{
        width: cardSize,
        height: is2H ? cardSize * 2 + 8 : cardSize,
        background: bg,
        border: isSelected ? '2px solid #f59e0b' : '1.5px solid #292524',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: is2H ? 'absolute' : 'relative',
        top: 0, left: 2, zIndex: is2H ? 10 : 1,
        boxShadow: isSelected ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none',
        padding: 2,
        textAlign: 'center',
        cursor: 'pointer'
      }}>
      <span style={{
        fontWeight: 700,
        fontSize: is2H ? fontSize2H : fontSize,
        lineHeight: 1.1,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: is2H ? 4 : 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {item.name}
      </span>
      {/* Small indicator for usage */}
      {!isCond && item.maxUsage > 0 && item.usageDots > 0 && (
        <div style={{ display: 'flex', gap: 1, marginTop: 2 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: i < item.usageDots ? '#292524' : '#d6d3d1' }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// ITEM CARD STUDIO PANEL
// ============================================

const ItemCardStudio = ({ parties, activePartyId, activeCharacterId, updateCharacterInParty }) => {
  const [template, setTemplate] = useState('item');
  const [cardData, setCardData] = useState({
    name: 'Nový předmět',
    type: 'item',
    // Dimensions
    width: 1,
    height: 1,
    // Weapon/Armor specific
    damageDef: '',
    weaponClass: '',
    // Item/Weapon/Armor/Spell specific
    usageDots: 0,
    maxUsage: 3,
    // Condition specific
    mechanic: '',
    clear: '',
    // Freeform only
    star: false,
    // Visual
    icon: 'generic',
    bgColor: '#fef3c7',
    textColor: '#1c1917',
    showDivider: true,
    showBorder: true
  });
  const [libraryFilter, setLibraryFilter] = useState('all');

  // Get active character
  const activeParty = parties?.find(p => p.id === activePartyId);
  const activeCharacter = activeParty?.members?.find(m => m.id === activeCharacterId);

  // Template presets with category-specific defaults
  const templates = {
    item: { 
      type: 'item', 
      bgColor: '#fef3c7', // amber
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: '', weaponClass: '', mechanic: '', clear: '', star: false
    },
    weapon: { 
      type: 'weapon', 
      bgColor: '#f8fafc', // white
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: 'k6/k8',
      weaponClass: 'Medium',
      mechanic: '', clear: '', star: false
    },
    armor: { 
      type: 'armor', 
      bgColor: '#f8fafc',
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 2,
      damageDef: '1 def',
      weaponClass: 'Heavy',
      mechanic: '', clear: '', star: false
    },
    spell: { 
      type: 'spell', 
      bgColor: '#f8fafc',
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: '', weaponClass: '',
      mechanic: '', clear: '', star: false
    },
    condition: { 
      type: 'condition', 
      bgColor: '#ff4444', // rgb(255, 68, 68)
      textColor: '#1c1917',
      maxUsage: 0,
      width: 1, height: 1,
      damageDef: '', weaponClass: '',
      mechanic: 'Nevýhoda na záchranu síly a obratnosti',
      clear: 'After full rest',
      star: false
    },
    freeform: { 
      type: 'freeform', 
      bgColor: '#f5f5f4',
      textColor: '#1c1917',
      maxUsage: 3,
      width: 1, height: 1,
      damageDef: '', weaponClass: '', mechanic: '', clear: '', star: false
    }
  };

  // Weapon class options
  const weaponClasses = [
    { value: '', label: '---' },
    { value: 'Light', label: 'Light' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Heavy', label: 'Heavy' }
  ];

  // Image/icon options - matching original exactly
  const iconOptions = [
    { value: 'generic', label: 'Nic' },
    { value: 'custom', label: 'Vlastní...' },
    { value: 'divider1', label: '──────────', disabled: true },
    { value: 'torch', label: 'Pochodeň' },
    { value: 'lantern', label: 'Lucerna' },
    { value: 'flashlight', label: 'Elektrická svítilna' },
    { value: 'pouch', label: 'Váček na ďobky' },
    { value: 'quiver', label: 'Toulec' },
    { value: 'rations', label: 'Zásoby' },
    { value: 'stones', label: 'Kameny' },
    { value: 'divider2', label: '──────────', disabled: true },
    { value: 'branch', label: 'Větev' },
    { value: 'dagger', label: 'Dýka' },
    { value: 'needle', label: 'Jehla' },
    { value: 'axe', label: 'Sekera' },
    { value: 'sword', label: 'Meč' },
    { value: 'mace', label: 'Palcát' },
    { value: 'warhammer', label: 'Válečné kladivo' },
    { value: 'spear', label: 'Kopí' },
    { value: 'hook', label: 'Hákopí' },
    { value: 'bow', label: '"Luk"' },
    { value: 'sling', label: 'Prak' },
    { value: 'divider3', label: '──────────', disabled: true },
    { value: 'heavyarmor', label: 'Těžká zbroj' },
    { value: 'lightarmor', label: 'Lehká zbroj' },
    { value: 'divider4', label: '──────────', disabled: true },
    { value: 'spell1', label: 'Kouzlo 1' },
    { value: 'spell2', label: 'Kouzlo 2' },
    { value: 'spell3', label: 'Kouzlo 3' },
    { value: 'spell4', label: 'Kouzlo 4' },
    { value: 'spell5', label: 'Kouzlo 5' },
    { value: 'spellempty', label: 'Kouzlo (prázdné)' }
  ];

  // Handle template change
  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    const preset = templates[newTemplate];
    setCardData(prev => ({
      ...prev,
      ...preset,
      name: newTemplate === 'condition' ? 'Nový stav' : 
            newTemplate === 'weapon' ? 'Nová zbraň' :
            newTemplate === 'armor' ? 'Nová zbroj' :
            newTemplate === 'spell' ? 'Nové kouzlo' : 'Nový předmět'
    }));
  };

  // Calculate slots from width × height
  const calculateSlots = () => cardData.width * cardData.height;

  // Add to character inventory
  const addToInventory = () => {
    if (!activeCharacter || !activePartyId) {
      alert('Nejprve vyber postavu v záložce Postavy');
      return;
    }

    const slots = activeCharacter.inventorySlots || {};
    const packSlots = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'];
    const emptySlot = packSlots.find(s => !slots[s]);
    
    if (!emptySlot) {
      alert('Batoh je plný!');
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...cardData,
      slots: calculateSlots()
    };

    updateCharacterInParty(activePartyId, activeCharacterId, {
      inventorySlots: { ...slots, [emptySlot]: newItem }
    });

    alert(`"${cardData.name}" přidáno do inventáře ${activeCharacter.name}!`);
  };

  // Add from library
  const addFromLibrary = (libraryItem) => {
    if (!activeCharacter || !activePartyId) {
      alert('Nejprve vyber postavu v záložce Postavy');
      return;
    }

    const slots = activeCharacter.inventorySlots || {};
    const packSlots = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'];
    const emptySlot = packSlots.find(s => !slots[s]);
    
    if (!emptySlot) {
      alert('Batoh je plný!');
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...libraryItem,
      usageDots: 0
    };

    updateCharacterInParty(activePartyId, activeCharacterId, {
      inventorySlots: { ...slots, [emptySlot]: newItem }
    });

    alert(`"${libraryItem.name}" přidáno do inventáře ${activeCharacter.name}!`);
  };

  // Updated library with proper Mausritter data
  const itemLibrary = {
    weapons: [
      { name: 'Jehla', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'needle' },
      { name: 'Dýka', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'dagger' },
      { name: 'Větev', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'branch' },
      { name: 'Meč', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'sword' },
      { name: 'Sekera', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'axe' },
      { name: 'Palcát', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'mace' },
      { name: 'Válečné kladivo', type: 'weapon', damageDef: 'k6/k8', weaponClass: 'Medium', width: 1, height: 1, maxUsage: 3, icon: 'warhammer' },
      { name: 'Kopí', type: 'weapon', damageDef: 'k10', weaponClass: 'Heavy', width: 1, height: 2, maxUsage: 3, icon: 'spear' },
      { name: 'Hákopí', type: 'weapon', damageDef: 'k10', weaponClass: 'Heavy', width: 1, height: 2, maxUsage: 3, icon: 'hook' },
      { name: '"Luk"', type: 'weapon', damageDef: 'k6', weaponClass: 'Medium', width: 2, height: 1, maxUsage: 3, icon: 'bow' },
      { name: 'Prak', type: 'weapon', damageDef: 'k6', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'sling' },
    ],
    armor: [
      { name: 'Lehká zbroj', type: 'armor', damageDef: '1 def', weaponClass: 'Light', width: 1, height: 1, maxUsage: 3, icon: 'lightarmor' },
      { name: 'Těžká zbroj', type: 'armor', damageDef: '1 def', weaponClass: 'Heavy', width: 1, height: 2, maxUsage: 3, icon: 'heavyarmor' },
    ],
    items: [
      { name: 'Pochodeň', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'torch' },
      { name: 'Lucerna', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'lantern' },
      { name: 'Elektrická svítilna', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'flashlight' },
      { name: 'Váček na ďobky', type: 'item', width: 1, height: 1, maxUsage: 0, icon: 'pouch' },
      { name: 'Toulec', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'quiver' },
      { name: 'Zásoby', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'rations' },
      { name: 'Kameny', type: 'item', width: 1, height: 1, maxUsage: 3, icon: 'stones' },
    ],
    conditions: [
      { name: 'Vyčerpaný', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Nevýhoda na fyzické hody', clear: 'After full rest' },
      { name: 'Vystrašený', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Musí prchat od zdroje strachu', clear: 'After safe rest' },
      { name: 'Zraněný', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Nevýhoda na záchranu SÍL a MRŠ', clear: 'After full rest' },
      { name: 'Hladový', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: '-1 na všechny hody', clear: 'After eating' },
      { name: 'Nemocný', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: 'Nemůže se léčit přirozeně', clear: 'After treatment or week' },
      { name: 'Otrávený', type: 'condition', width: 1, height: 1, maxUsage: 0, icon: 'generic', bgColor: '#ff4444', mechanic: '1 poškození za směnu', clear: 'After antidote' },
    ],
    spells: [
      { name: 'Kouzlo 1', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell1' },
      { name: 'Kouzlo 2', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell2' },
      { name: 'Kouzlo 3', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell3' },
      { name: 'Kouzlo 4', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell4' },
      { name: 'Kouzlo 5', type: 'spell', width: 1, height: 1, maxUsage: 3, icon: 'spell5' },
    ]
  };

  // Filter library items
  const getFilteredLibrary = () => {
    if (libraryFilter === 'all') {
      return [
        ...itemLibrary.weapons,
        ...itemLibrary.armor,
        ...itemLibrary.items,
        ...itemLibrary.conditions,
        ...itemLibrary.spells
      ];
    }
    return itemLibrary[libraryFilter] || [];
  };

  // Visual Card Preview - compact professional style
  const CardPreview = () => {
    const isCond = cardData.type === 'condition';
    const isWA = cardData.type === 'weapon' || cardData.type === 'armor';
    
    // 70px base for consistency with inventory
    const w = cardData.width * 70;
    const h = cardData.height * 70;
    
    return (
      <div style={{
        width: w, height: h,
        background: cardData.bgColor,
        border: '2px solid #292524',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: isCond ? cardData.bgColor : '#fff',
          borderBottom: '2px solid #292524',
          padding: '3px 6px',
          fontWeight: 700,
          fontSize: 11,
          color: cardData.textColor
        }}>
          {cardData.name}
        </div>
        
        {/* Stats row */}
        {!isCond && (
          <div style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d6d3d1' }}>
            {cardData.maxUsage > 0 ? (
              <div style={{ display: 'flex', gap: 3 }}>
                {Array(Math.min(cardData.maxUsage, 6)).fill(0).map((_, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #292524', background: i < cardData.usageDots ? '#292524' : 'transparent' }} />
                ))}
              </div>
            ) : <span />}
            {cardData.damageDef && (
              <span style={{ background: '#fff', border: '1px solid #292524', borderRadius: 2, padding: '0 4px', fontSize: 10, fontWeight: 700 }}>
                {cardData.damageDef}
              </span>
            )}
          </div>
        )}
        
        {/* Content */}
        {isCond ? (
          <div style={{ flex: 1, padding: 6, fontSize: 10, color: cardData.textColor, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, fontStyle: 'italic' }}>{cardData.mechanic}</div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.2)', paddingTop: 4, marginTop: 4 }}>
              <strong>Clear:</strong> {cardData.clear}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        
        {/* Footer */}
        {isWA && cardData.weaponClass && (
          <div style={{ borderTop: '1px solid #d6d3d1', padding: '2px 6px', fontSize: 10, color: cardData.textColor }}>
            {cardData.weaponClass}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="🎴" 
        title="Item Card Studio" 
        subtitle="Vytvoř vlastní kartičky jako v originále"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <ResultCard title="📝 Editor kartičky">
          {/* Template selector */}
          <div className="mb-4">
            <label className="text-sm font-bold text-stone-500 block mb-2">Šablona</label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
            >
              <option value="item">Předmět</option>
              <option value="weapon">Zbraň</option>
              <option value="armor">Zbroj</option>
              <option value="spell">Kouzlo</option>
              <option value="condition">Stav</option>
              <option value="freeform">Freeform</option>
            </select>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-bold text-stone-500 block mb-2">Název:</label>
            <input
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
            />
          </div>

          {/* WEAPON FIELDS: Damage/Def, Class, Použití, Obrázek */}
          {template === 'weapon' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Damage/Def:</label>
                  <input
                    value={cardData.damageDef}
                    onChange={(e) => setCardData(prev => ({ ...prev, damageDef: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                    placeholder="k6/k8"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Class:</label>
                  <select
                    value={cardData.weaponClass}
                    onChange={(e) => setCardData(prev => ({ ...prev, weaponClass: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
                  >
                    {weaponClasses.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ARMOR FIELDS: Damage/Def, Class, Použití, Obrázek */}
          {template === 'armor' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Damage/Def:</label>
                  <input
                    value={cardData.damageDef}
                    onChange={(e) => setCardData(prev => ({ ...prev, damageDef: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                    placeholder="1 def"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Class:</label>
                  <select
                    value={cardData.weaponClass}
                    onChange={(e) => setCardData(prev => ({ ...prev, weaponClass: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
                  >
                    <option value="Light">Light</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* CONDITION FIELDS: Mechanic, Clear (NO Použití, NO Obrázek) */}
          {template === 'condition' && (
            <>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Mechanic:</label>
                <input
                  value={cardData.mechanic}
                  onChange={(e) => setCardData(prev => ({ ...prev, mechanic: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                  placeholder="Nevýhoda na záchranu síly a obratnosti"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Clear:</label>
                <input
                  value={cardData.clear}
                  onChange={(e) => setCardData(prev => ({ ...prev, clear: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                  placeholder="After full rest"
                />
              </div>
            </>
          )}

          {/* FREEFORM FIELDS: ALL fields */}
          {template === 'freeform' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Damage/Def:</label>
                  <input
                    value={cardData.damageDef}
                    onChange={(e) => setCardData(prev => ({ ...prev, damageDef: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-500 block mb-2">Class:</label>
                  <select
                    value={cardData.weaponClass}
                    onChange={(e) => setCardData(prev => ({ ...prev, weaponClass: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
                  >
                    {weaponClasses.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Mechanic:</label>
                <input
                  value={cardData.mechanic}
                  onChange={(e) => setCardData(prev => ({ ...prev, mechanic: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-stone-500 block mb-2">Clear:</label>
                <input
                  value={cardData.clear}
                  onChange={(e) => setCardData(prev => ({ ...prev, clear: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardData.star}
                    onChange={(e) => setCardData(prev => ({ ...prev, star: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-bold text-stone-500">Star:</span>
                </label>
              </div>
            </>
          )}

          {/* POUŽITÍ - for all except condition */}
          {template !== 'condition' && (
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-2">Použití:</label>
              <input
                type="number"
                min="0"
                max="6"
                value={cardData.maxUsage}
                onChange={(e) => setCardData(prev => ({ ...prev, maxUsage: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg"
              />
            </div>
          )}

          {/* OBRÁZEK - for all except condition */}
          {template !== 'condition' && (
            <div className="mb-4">
              <label className="text-sm font-bold text-stone-500 block mb-2">Obrázek:</label>
              <select
                value={cardData.icon}
                onChange={(e) => setCardData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                {iconOptions.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* DIMENSIONS - Width × Height */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Šířka</label>
              <select
                value={cardData.width}
                onChange={(e) => setCardData(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Výška</label>
              <select
                value={cardData.height}
                onChange={(e) => setCardData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

          {/* COLORS */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Pozadí</label>
              <input
                type="color"
                value={cardData.bgColor}
                onChange={(e) => setCardData(prev => ({ ...prev, bgColor: e.target.value }))}
                className="w-full h-10 rounded-lg cursor-pointer border-2 border-amber-300"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-stone-500 block mb-2">Text</label>
              <input
                type="color"
                value={cardData.textColor}
                onChange={(e) => setCardData(prev => ({ ...prev, textColor: e.target.value }))}
                className="w-full h-10 rounded-lg cursor-pointer border-2 border-amber-300"
              />
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.showDivider}
                onChange={(e) => setCardData(prev => ({ ...prev, showDivider: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm">Oddělovač</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.showBorder}
                onChange={(e) => setCardData(prev => ({ ...prev, showBorder: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm">Okraj</span>
            </label>
          </div>

          {/* ADD BUTTON */}
          <Button onClick={addToInventory} className="w-full">
            ➕ Přidat do inventáře {activeCharacter?.name || '(vyber postavu)'}
          </Button>
        </ResultCard>

        {/* Preview & Library */}
        <div className="space-y-6">
          {/* Preview */}
          <ResultCard title="👁️ Náhled">
            <div className="flex items-center justify-center py-3 bg-stone-100 rounded">
              <CardPreview />
            </div>
            <p className="text-xs text-stone-400 text-center mt-1">
              {cardData.width}×{cardData.height}
            </p>
          </ResultCard>

          {/* Library */}
          <ResultCard title="📚 Knihovna předmětů">
            <div className="mb-4">
              <select
                value={libraryFilter}
                onChange={(e) => setLibraryFilter(e.target.value)}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-white"
              >
                <option value="all">Vše</option>
                <option value="weapons">⚔️ Zbraně</option>
                <option value="armor">🛡️ Zbroje</option>
                <option value="items">📦 Předměty</option>
                <option value="conditions">🩹 Stavy</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {getFilteredLibrary().map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => addFromLibrary(item)}
                  className={`p-2 rounded-lg text-left text-sm transition-all hover:shadow-md border-2 ${
                    item.type === 'condition' ? 'bg-red-100 hover:bg-red-200 border-red-300' :
                    item.type === 'weapon' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' :
                    item.type === 'armor' ? 'bg-blue-100 hover:bg-blue-200 border-blue-300' :
                    'bg-amber-100 hover:bg-amber-200 border-amber-300'
                  }`}
                >
                  <div className="font-bold truncate text-xs">
                    {item.name}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    {item.damage && <span className="bg-white px-1 rounded">{item.damage}</span>}
                    {item.defense && <span className="bg-white px-1 rounded">{item.defense}</span>}
                    {item.weaponClass && <span>{item.weaponClass}</span>}
                    <span className="ml-auto">{item.width}×{item.height}</span>
                  </div>
                  {item.mechanic && <div className="text-xs text-red-600 truncate">{item.mechanic}</div>}
                </button>
              ))}
            </div>
          </ResultCard>
        </div>
      </div>
    </div>
  );
};

// ============================================
// WORLD GENERATOR PANEL
// ============================================

const WorldPanel = ({ onLogEntry, settlements, setSettlements, worldNPCs, setWorldNPCs, parties, activeParty, activePartyId, updateParty }) => {
  const [generated, setGenerated] = useState(null);
  const [activeGen, setActiveGen] = useState('mySettlements');
  const [season, setSeason] = useState('spring');
  const [creatureCategory, setCreatureCategory] = useState('all');
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [editingSettlement, setEditingSettlement] = useState(null);
  const [editingNPC, setEditingNPC] = useState(null);
  const [viewingSettlement, setViewingSettlement] = useState(null);
  const [expandedNPCs, setExpandedNPCs] = useState({});
  const [npcBehaviors, setNpcBehaviors] = useState({});

  // ========== SETTLEMENT MANAGEMENT ==========
  const createEmptySettlement = () => {
    const newSettlement = {
      id: generateId(),
      name: 'Nová osada',
      size: 'Osada',
      population: '',
      landmark: '',
      feature: '',
      event: '',
      ruler: null, // NPC id
      notes: '',
      npcs: [] // NPC ids
    };
    setSettlements([...settlements, newSettlement]);
    setEditingSettlement(newSettlement.id);
  };

  const saveSettlementToWorld = (settlementData) => {
    const newSettlement = {
      id: generateId(),
      ...settlementData,
      npcs: []
    };
    setSettlements([...settlements, newSettlement]);
    setGenerated(null);
  };

  const updateSettlement = (id, updates) => {
    setSettlements(settlements.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSettlement = (id) => {
    setSettlements(settlements.filter(s => s.id !== id));
    // Remove settlement reference from NPCs
    setWorldNPCs(worldNPCs.map(n => n.settlementId === id ? { ...n, settlementId: null } : n));
  };

  // ========== NPC MANAGEMENT ==========
  const createEmptyNPC = (settlementId = null) => {
    // Staty pomocníka podle pravidel: k6 BO, 2k6 síla/mrštnost/vůle
    const hp = rollDice(1, 6)[0];
    const str = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const dex = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const wil = rollDice(2, 6).reduce((a, b) => a + b, 0);

    const newNPC = {
      id: generateId(),
      name: 'Nová postava',
      birthsign: '',
      physicalDetail: '',
      quirk: '',
      goal: '',
      role: '',
      settlementId,
      notes: '',
      hp: { current: hp, max: hp },
      str: { current: str, max: str },
      dex: { current: dex, max: dex },
      wil: { current: wil, max: wil }
    };
    setWorldNPCs([...worldNPCs, newNPC]);
    setEditingNPC(newNPC.id);
    return newNPC;
  };

  const saveNPCToWorld = (npcData, settlementId = null) => {
    const newNPC = {
      id: generateId(),
      ...npcData,
      settlementId
    };
    setWorldNPCs([...worldNPCs, newNPC]);
    if (settlementId) {
      updateSettlement(settlementId, { 
        npcs: [...(settlements.find(s => s.id === settlementId)?.npcs || []), newNPC.id] 
      });
    }
    setGenerated(null);
  };

  const updateNPC = (id, updates) => {
    setWorldNPCs(worldNPCs.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNPC = (id) => {
    setWorldNPCs(worldNPCs.filter(n => n.id !== id));
    // Remove NPC from settlements
    setSettlements(settlements.map(s => ({
      ...s,
      npcs: s.npcs?.filter(npcId => npcId !== id) || [],
      ruler: s.ruler === id ? null : s.ruler
    })));
  };

  const generateNPCBehavior = (npcId) => {
    const mood = randomFrom(NPC_BEHAVIOR_MOODS);
    const action = randomFrom(NPC_BEHAVIOR_ACTIONS);
    const motivation = randomFrom(NPC_BEHAVIOR_MOTIVATIONS);
    const behavior = `🎭 Chová se ${mood}, ${action}, protože ${motivation}.`;
    setNpcBehaviors({ ...npcBehaviors, [npcId]: behavior });
  };

  const generateNPCMood = (npcId) => {
    const mood = randomFrom(NPC_BEHAVIOR_MOODS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `😊 Nálada: ${mood}` });
  };

  const generateNPCAction = (npcId) => {
    const action = randomFrom(NPC_BEHAVIOR_ACTIONS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `🏃 Právě teď: ${action}` });
  };

  const generateNPCMotivation = (npcId) => {
    const motivation = randomFrom(NPC_BEHAVIOR_MOTIVATIONS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `💭 Motivace: ${motivation}` });
  };

  const generateNPCSecret = (npcId) => {
    const secret = randomFrom(NPC_SECRETS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `🤫 Tajemství: ${secret}` });
  };

  const generateNPCReaction = (npcId) => {
    const reaction = randomFrom(NPC_REACTIONS);
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `⚡ Reakce: ${reaction}` });
  };

  const generateNPCRole = (npcId) => {
    const role = randomFrom(NPC_ROLES);
    updateNPC(npcId, { role });
    setNpcBehaviors({ ...npcBehaviors, [npcId]: `🔧 Povolání: ${role}` });
  };

  const assignNPCToSettlement = (npcId, settlementId) => {
    // Remove from old settlement
    const oldNPC = worldNPCs.find(n => n.id === npcId);
    if (oldNPC?.settlementId) {
      const oldSettlement = settlements.find(s => s.id === oldNPC.settlementId);
      if (oldSettlement) {
        updateSettlement(oldSettlement.id, { 
          npcs: oldSettlement.npcs?.filter(id => id !== npcId) || [] 
        });
      }
    }
    // Add to new settlement
    if (settlementId) {
      const newSettlement = settlements.find(s => s.id === settlementId);
      if (newSettlement) {
        updateSettlement(settlementId, { 
          npcs: [...(newSettlement.npcs || []), npcId] 
        });
      }
    }
    // Update NPC
    updateNPC(npcId, { settlementId });
  };

  // Generate random creature
  const generateCreature = (category = 'all') => {
    let pool = BESTIARY;
    if (category !== 'all') {
      pool = BESTIARY.filter(c => c.category === category);
    }
    const creature = randomFrom(pool);
    setSelectedCreature(creature);
    
    onLogEntry({
      type: 'discovery',
      subtype: 'creature',
      timestamp: formatTimestamp(),
      data: creature
    });
  };

  const generateSettlement = () => {
    const landmark = randomFrom(LANDMARKS);
    const size = ['Osada', 'Vesnice', 'Město'][rollD6() <= 2 ? 0 : rollD6() <= 5 ? 1 : 2];
    const feature = randomFrom(SETTLEMENT_FEATURES);
    const event = randomFrom(SETTLEMENT_EVENTS);
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES).split(/(?=[A-Z])/)[0]; // First part of compound name
    
    const settlement = {
      type: 'settlement',
      name: `${firstName} ${lastName}`,
      landmark,
      size,
      feature,
      event,
      npcs: []
    };
    
    setGenerated(settlement);
    onLogEntry({
      type: 'discovery',
      subtype: 'settlement',
      timestamp: formatTimestamp(),
      data: settlement
    });
  };

  const generateNPC = () => {
    // Náhodně vybrat pohlaví pro správný rod jména
    const isFemale = Math.random() < 0.5;
    const firstName = isFemale
      ? randomFrom(FEMALE_FIRST_NAMES)
      : randomFrom(MALE_FIRST_NAMES);
    const familyName = randomFrom(FAMILY_NAMES);
    const lastName = isFemale ? familyName.female : familyName.male;

    // Staty pomocníka podle pravidel: k6 BO, 2k6 síla/mrštnost/vůle
    const hp = rollDice(1, 6)[0];
    const str = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const dex = rollDice(2, 6).reduce((a, b) => a + b, 0);
    const wil = rollDice(2, 6).reduce((a, b) => a + b, 0);

    const npc = {
      type: 'npc',
      name: `${firstName} ${lastName}`,
      role: randomFrom(NPC_ROLES),
      birthsign: randomFrom(BIRTHSIGNS),
      physicalDetail: randomFrom(PHYSICAL_DETAILS),
      quirk: randomFrom(NPC_QUIRKS),
      goal: randomFrom(NPC_GOALS),
      reaction: roll2D6(),
      hp: { current: hp, max: hp },
      str: { current: str, max: str },
      dex: { current: dex, max: dex },
      wil: { current: wil, max: wil }
    };

    setGenerated(npc);
    onLogEntry({
      type: 'discovery',
      subtype: 'npc',
      timestamp: formatTimestamp(),
      data: npc
    });
  };

  const generateDungeon = () => {
    const theme = randomFrom(DUNGEON_THEMES);
    const denizens = randomFrom(DUNGEON_DENIZENS);
    const rooms = [];
    
    // Generate 5 rooms
    for (let i = 0; i < 5; i++) {
      const exits = rollD6();
      const contents = ['Prázdno', 'Past/Nebezpečí', 'Poklad', 'Malé setkání', 'Velké setkání', 'Speciální'][rollD6() - 1];
      rooms.push({
        number: i + 1,
        type: exits <= 2 ? 'Chodba' : exits <= 4 ? 'Malá místnost' : 'Velká místnost',
        exits: exits <= 1 ? 'Slepá ulička' : exits <= 3 ? '1 východ' : exits <= 5 ? '2 východy' : '3+ východy',
        contents
      });
    }
    
    const dungeon = {
      type: 'dungeon',
      theme,
      denizens,
      rooms
    };
    
    setGenerated(dungeon);
    onLogEntry({
      type: 'discovery',
      subtype: 'dungeon',
      timestamp: formatTimestamp(),
      data: dungeon
    });
  };

  const generateWeather = () => {
    const { dice, total } = roll2D6();
    const weather = WEATHER_TABLE[season][total];
    
    const result = {
      type: 'weather',
      season,
      dice,
      total,
      weather
    };
    
    setGenerated(result);
    onLogEntry({
      type: 'world_event',
      subtype: 'weather',
      timestamp: formatTimestamp(),
      data: result
    });
  };

  const genTabs = [
    { id: 'mySettlements', label: 'Moje osady', icon: '🗺️' },
    { id: 'myNPCs', label: 'Moji NPC', icon: '👥' },
    { id: 'settlement', label: '+ Osada', icon: '🏘️' },
    { id: 'npc', label: '+ NPC', icon: '🐭' },
    { id: 'dungeon', label: 'Dungeon', icon: '🗝️' },
    { id: 'bestiary', label: 'Bestiář', icon: '🐛' },
    { id: 'weather', label: 'Počasí', icon: '☀️' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="🌍" 
        title="Generátor světa" 
        subtitle="Vytvoř místa, postavy a události"
      />

      <TabNav tabs={genTabs} activeTab={activeGen} onTabChange={setActiveGen} />

      {/* ========== MY SETTLEMENTS ========== */}
      {activeGen === 'mySettlements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-stone-600">Správa osad a měst ve tvém světě</p>
            <Button onClick={createEmptySettlement}>+ Nová osada</Button>
          </div>

          {settlements.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-8">
                Zatím nemáš žádné osady.<br/>
                <span className="text-sm">Vytvoř novou nebo vygeneruj pomocí "+ Osada"</span>
              </p>
            </ResultCard>
          ) : (
            <div className="space-y-3">
              {settlements.map(settlement => (
                <ResultCard key={settlement.id}>
                  {editingSettlement === settlement.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <Input 
                        value={settlement.name} 
                        onChange={(v) => updateSettlement(settlement.id, { name: v })}
                        placeholder="Jméno osady"
                        className="font-bold"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Select
                          value={settlement.size}
                          onChange={(v) => updateSettlement(settlement.id, { size: v })}
                          options={[
                            { value: 'Osada', label: 'Osada (do 20 myší)' },
                            { value: 'Vesnice', label: 'Vesnice (20-100 myší)' },
                            { value: 'Město', label: 'Město (100+ myší)' }
                          ]}
                        />
                        <Input 
                          value={settlement.population || ''} 
                          onChange={(v) => updateSettlement(settlement.id, { population: v })}
                          placeholder="Populace (číslo)"
                        />
                      </div>
                      <Input 
                        value={settlement.landmark || ''} 
                        onChange={(v) => updateSettlement(settlement.id, { landmark: v })}
                        placeholder="Landmark (co je poblíž)"
                      />
                      <Input 
                        value={settlement.feature || ''} 
                        onChange={(v) => updateSettlement(settlement.id, { feature: v })}
                        placeholder="Zajímavost (čím je známá)"
                      />
                      <Input 
                        value={settlement.event || ''} 
                        onChange={(v) => updateSettlement(settlement.id, { event: v })}
                        placeholder="Aktuální událost/problém"
                      />
                      <Select
                        value={settlement.ruler || ''}
                        onChange={(v) => updateSettlement(settlement.id, { ruler: v || null })}
                        options={[
                          { value: '', label: '— Vládce (vybrat NPC) —' },
                          ...worldNPCs.map(n => ({ value: n.id, label: n.name }))
                        ]}
                      />
                      <textarea
                        value={settlement.notes || ''}
                        onChange={(e) => updateSettlement(settlement.id, { notes: e.target.value })}
                        placeholder="Poznámky..."
                        className="w-full h-20 px-3 py-2 border border-stone-300 rounded-lg resize-none"
                      />
                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setEditingSettlement(null)}>✓ Hotovo</Button>
                        <Button variant="ghost" className="text-red-500" onClick={() => deleteSettlement(settlement.id)}>Smazat</Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div 
                      className="cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors"
                      onClick={() => setViewingSettlement(viewingSettlement === settlement.id ? null : settlement.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-amber-900">{settlement.name}</h3>
                          <p className="text-sm text-stone-600">
                            {settlement.size}
                            {settlement.population && ` • ${settlement.population} myší`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs text-stone-400">{settlement.npcs?.length || 0} NPC</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingSettlement(settlement.id); }}
                            className="text-stone-400 hover:text-stone-600"
                          >✏️</button>
                        </div>
                      </div>
                      
                      {viewingSettlement === settlement.id && (
                        <div className="mt-3 pt-3 border-t border-amber-200 space-y-2">
                          {settlement.landmark && <p><span className="text-stone-500">Landmark:</span> {settlement.landmark}</p>}
                          {settlement.feature && <p><span className="text-stone-500">Zajímavost:</span> {settlement.feature}</p>}
                          {settlement.event && <p><span className="text-stone-500">Událost:</span> {settlement.event}</p>}
                          {settlement.ruler && (
                            <p><span className="text-stone-500">Vládce:</span> {worldNPCs.find(n => n.id === settlement.ruler)?.name || '?'}</p>
                          )}
                          {settlement.notes && <p className="italic text-stone-600">{settlement.notes}</p>}
                          
                          {/* NPCs in this settlement */}
                          <div className="mt-3">
                            <p className="text-sm font-bold text-stone-700 mb-2">Obyvatelé:</p>
                            {(settlement.npcs?.length || 0) === 0 ? (
                              <p className="text-sm text-stone-400">Žádní NPC</p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {settlement.npcs?.map(npcId => {
                                  const npc = worldNPCs.find(n => n.id === npcId);
                                  return npc ? (
                                    <span 
                                      key={npcId} 
                                      className="px-2 py-1 bg-amber-100 rounded text-sm cursor-pointer hover:bg-amber-200"
                                      onClick={(e) => { e.stopPropagation(); setActiveGen('myNPCs'); setEditingNPC(npcId); }}
                                    >
                                      🐭 {npc.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                            <Button 
                              variant="ghost" 
                              size="small" 
                              className="mt-2"
                              onClick={(e) => { e.stopPropagation(); createEmptyNPC(settlement.id); setActiveGen('myNPCs'); }}
                            >
                              + Přidat NPC
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ResultCard>
              ))}
            </div>
          )}

          {/* Party location */}
          {activeParty && activePartyId && updateParty && (
            <ResultCard>
              <h4 className="font-bold text-amber-900 mb-2">📍 Pozice družiny: {activeParty.name}</h4>
              <Select
                value={activeParty.currentSettlement || ''}
                onChange={(v) => {
                  updateParty(activePartyId, { currentSettlement: v || null });
                  const settlementName = v ? settlements.find(s => s.id === v)?.name : 'na cestě';
                  onLogEntry && onLogEntry(`Družina ${activeParty.name} se přesunula do: ${settlementName}`);
                }}
                options={[
                  { value: '', label: '— Na cestě / neznámo —' },
                  ...settlements.map(s => ({ value: s.id, label: s.name }))
                ]}
              />
            </ResultCard>
          )}
        </div>
      )}

      {/* ========== MY NPCs ========== */}
      {activeGen === 'myNPCs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-stone-600">Všechny postavy ve tvém světě</p>
            <Button onClick={() => createEmptyNPC()}>+ Nová postava</Button>
          </div>

          {worldNPCs.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-8">
                Zatím nemáš žádné NPC.<br/>
                <span className="text-sm">Vytvoř novou nebo vygeneruj pomocí "+ NPC"</span>
              </p>
            </ResultCard>
          ) : (
            <div className="space-y-3">
              {worldNPCs.map(npc => (
                <ResultCard key={npc.id}>
                  {editingNPC === npc.id ? (
                    // Edit mode - karta jako v generátoru
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <input
                          value={npc.name}
                          onChange={(e) => updateNPC(npc.id, { name: e.target.value })}
                          className="text-2xl font-bold text-amber-900 bg-transparent border-b-2 border-amber-300 focus:border-amber-500 outline-none"
                        />
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingNPC(null)}>✓</Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNPC(npc.id)}>🗑️</Button>
                        </div>
                      </div>

                      {/* Staty - editovatelné */}
                      <div className="flex flex-wrap gap-2 text-sm font-mono bg-stone-100 rounded px-3 py-2 justify-center items-center">
                        <span className="font-bold">BO:</span>
                        <input type="text" inputMode="numeric" value={npc.hp?.current || 0} onChange={(e) => updateNPC(npc.id, { hp: { ...npc.hp, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.hp?.max || 0} onChange={(e) => updateNPC(npc.id, { hp: { ...npc.hp, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span className="ml-3 font-bold">SÍL:</span>
                        <input type="text" inputMode="numeric" value={npc.str?.current || 0} onChange={(e) => updateNPC(npc.id, { str: { ...npc.str, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.str?.max || 0} onChange={(e) => updateNPC(npc.id, { str: { ...npc.str, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span className="ml-3 font-bold">MRŠ:</span>
                        <input type="text" inputMode="numeric" value={npc.dex?.current || 0} onChange={(e) => updateNPC(npc.id, { dex: { ...npc.dex, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.dex?.max || 0} onChange={(e) => updateNPC(npc.id, { dex: { ...npc.dex, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span className="ml-3 font-bold">VŮL:</span>
                        <input type="text" inputMode="numeric" value={npc.wil?.current || 0} onChange={(e) => updateNPC(npc.id, { wil: { ...npc.wil, current: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                        <span>/</span>
                        <input type="text" inputMode="numeric" value={npc.wil?.max || 0} onChange={(e) => updateNPC(npc.id, { wil: { ...npc.wil, max: parseInt(e.target.value) || 0 } })} className="w-12 h-8 text-center border rounded bg-white font-bold" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-amber-100/50 rounded">
                          <span className="text-sm text-stone-500">Znamení</span>
                          <input value={npc.birthsign || ''} onChange={(e) => updateNPC(npc.id, { birthsign: e.target.value })} placeholder="Znamení" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none" />
                        </div>
                        <div className="p-3 bg-amber-100/50 rounded">
                          <span className="text-sm text-stone-500">Vzhled</span>
                          <input value={npc.physicalDetail || ''} onChange={(e) => updateNPC(npc.id, { physicalDetail: e.target.value })} placeholder="Vzhled" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none" />
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100 rounded">
                        <span className="text-sm text-purple-700">Zvláštnost</span>
                        <input value={npc.quirk || ''} onChange={(e) => updateNPC(npc.id, { quirk: e.target.value })} placeholder="Zvláštnost" className="w-full font-bold text-purple-900 bg-transparent border-b border-purple-300 focus:border-purple-500 outline-none" />
                      </div>
                      <div className="p-3 bg-blue-100 rounded">
                        <span className="text-sm text-blue-700">Cíl</span>
                        <input value={npc.goal || ''} onChange={(e) => updateNPC(npc.id, { goal: e.target.value })} placeholder="Cíl" className="w-full font-bold text-blue-900 bg-transparent border-b border-blue-300 focus:border-blue-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-stone-100 rounded">
                          <span className="text-sm text-stone-500">Role</span>
                          <input value={npc.role || ''} onChange={(e) => updateNPC(npc.id, { role: e.target.value })} placeholder="Role/povolání" className="w-full font-bold bg-transparent border-b border-stone-300 focus:border-stone-500 outline-none" />
                        </div>
                        <div className="p-3 bg-stone-100 rounded">
                          <span className="text-sm text-stone-500">Osada</span>
                          <Select value={npc.settlementId || ''} onChange={(v) => assignNPCToSettlement(npc.id, v || null)} options={[{ value: '', label: '— Bez domova —' }, ...settlements.map(s => ({ value: s.id, label: s.name }))]} />
                        </div>
                      </div>
                      <textarea value={npc.notes || ''} onChange={(e) => updateNPC(npc.id, { notes: e.target.value })} placeholder="Poznámky..." className="w-full h-16 px-3 py-2 border border-stone-300 rounded-lg resize-none text-sm" />

                      {/* Generátory chování */}
                      <div className="border-t pt-3 space-y-3">
                        <p className="text-sm font-medium text-stone-600">🎲 Generátory:</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => generateNPCBehavior(npc.id)} className="px-3 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition-colors font-medium">
                            🎭 Chování
                          </button>
                          <button onClick={() => generateNPCMood(npc.id)} className="px-3 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow transition-colors font-medium">
                            😊 Nálada
                          </button>
                          <button onClick={() => generateNPCAction(npc.id)} className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors font-medium">
                            🏃 Co dělá
                          </button>
                          <button onClick={() => generateNPCMotivation(npc.id)} className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors font-medium">
                            💭 Motivace
                          </button>
                          <button onClick={() => generateNPCSecret(npc.id)} className="px-3 py-2 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow transition-colors font-medium">
                            🤫 Tajemství
                          </button>
                          <button onClick={() => generateNPCReaction(npc.id)} className="px-3 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow transition-colors font-medium">
                            ⚡ Reakce
                          </button>
                          <button onClick={() => generateNPCRole(npc.id)} className="px-3 py-2 text-sm bg-stone-500 hover:bg-stone-600 text-white rounded-lg shadow transition-colors font-medium">
                            🔧 Povolání
                          </button>
                        </div>
                        {npcBehaviors[npc.id] && (
                          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 shadow-inner animate-pulse-once">
                            <p className="text-lg font-bold text-purple-900">{npcBehaviors[npc.id]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // View mode - kompaktní
                    <div className="cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors" onClick={() => setEditingNPC(npc.id)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-amber-900">{npc.name}</h3>
                          <p className="text-sm text-stone-600">{npc.role && `${npc.role} • `}{npc.settlementId ? settlements.find(s => s.id === npc.settlementId)?.name : 'Bez domova'}</p>
                        </div>
                        {(npc.hp || npc.str) && (
                          <div className="text-xs font-mono text-stone-500">
                            BO:{npc.hp?.current}/{npc.hp?.max} SÍL:{npc.str?.max} MRŠ:{npc.dex?.max} VŮL:{npc.wil?.max}
                          </div>
                        )}
                      </div>
                      {(npc.birthsign || npc.physicalDetail || npc.quirk || npc.goal) && (
                        <div className="mt-2 text-sm text-stone-600 space-y-1">
                          {npc.birthsign && <p>⭐ {npc.birthsign}</p>}
                          {npc.physicalDetail && <p>👁️ {npc.physicalDetail}</p>}
                          {npc.quirk && <p>🎭 {npc.quirk}</p>}
                          {npc.goal && <p>🎯 {npc.goal}</p>}
                        </div>
                      )}
                      {npc.notes && <p className="mt-2 text-sm italic text-stone-500">{npc.notes}</p>}
                    </div>
                  )}
                </ResultCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeGen === 'settlement' && (
        <ResultCard>
          <HelpHeader 
            title="Generátor osady" 
            icon="🏘️"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Rychle vytvoří zajímavou myší osadu, kam mohou tví hrdinové přijít - s hotovým problémem k řešení!</p>
                
                <p className="font-bold mb-1">📝 Co vygeneruje:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>🏷️ <b>Jméno</b> - náhodné myší jméno osady</li>
                  <li>📏 <b>Velikost</b> - osada / vesnice / město</li>
                  <li>🌳 <b>Landmark</b> - co je poblíž (starý dub, studna...)</li>
                  <li>✨ <b>Zajímavý rys</b> - čím je osada zvláštní</li>
                  <li>⚡ <b>Událost</b> - aktuální problém nebo situace</li>
                </ul>
                
                <p className="text-xs text-stone-300 italic">
                  💡 Tip: Událost je skvělý háček pro dobrodružství! "Relikvie ukradena" = quest!
                </p>
              </div>
            }
          />
          <p className="text-stone-600 mb-4">Vygeneruj náhodnou myší osadu s landmarkem, rysem a aktuální událostí.</p>
          <Button onClick={generateSettlement} size="large" className="w-full">
            🏘️ Generovat osadu
          </Button>
        </ResultCard>
      )}

      {activeGen === 'npc' && (
        <ResultCard>
          <HelpHeader 
            title="Generátor NPC" 
            icon="🐭"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Vytvoří okamžitě zapamatovatelnou postavu, když tví hrdinové potkají někoho nového.</p>
                
                <p className="font-bold mb-1">📝 Co vygeneruje:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>🏷️ <b>Jméno</b> - české myší jméno</li>
                  <li>⭐ <b>Znamení</b> - osobnostní archetyp</li>
                  <li>👁️ <b>Fyzický detail</b> - co si na ní všimneš</li>
                  <li>🎭 <b>Zvláštnost</b> - jak se chová</li>
                  <li>🎯 <b>Cíl</b> - co právě teď chce</li>
                  <li>🎲 <b>Reakce (2d6)</b> - jak reaguje na hráče</li>
                </ul>
                
                <p className="font-bold mb-1">🎲 Reakce:</p>
                <ul className="text-xs space-y-0.5 text-stone-300">
                  <li>2-3 = Nepřátelská</li>
                  <li>4-5 = Nedůvěřivá</li>
                  <li>6-8 = Neutrální</li>
                  <li>9-10 = Přátelská</li>
                  <li>11-12 = Nadšená/pomocná</li>
                </ul>
              </div>
            }
          />
          <p className="text-stone-600 mb-4">Vygeneruj náhodnou myší postavu s osobností a cílem.</p>
          <Button onClick={generateNPC} size="large" className="w-full">
            🐭 Generovat NPC
          </Button>
        </ResultCard>
      )}

      {activeGen === 'dungeon' && (
        <ResultCard>
          <HelpHeader 
            title="Generátor dungeonu" 
            icon="🗝️"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Rychle vytvoří základ pro průzkum nebezpečného místa - opuštěného doupěte, staré skrýše, nebo mystického podzemí.</p>
                
                <p className="font-bold mb-1">📝 Co vygeneruje:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>🏛️ <b>Téma</b> - typ místa (hnízdo, sklep, svatyně...)</li>
                  <li>👹 <b>Obyvatelé</b> - kdo tu žije nebo hlídá</li>
                  <li>🚪 <b>5 místností</b> - základní layout s obsahem</li>
                </ul>
                
                <p className="font-bold mb-1">💡 Jak používat:</p>
                <ol className="list-decimal list-inside text-xs space-y-1 text-stone-300">
                  <li>Vygeneruj základ dungeonu</li>
                  <li>Nakresli si mapu podle místností</li>
                  <li>Přidávej detaily jak prozkoumáváš</li>
                  <li>Použij bestiář pro nepřátele</li>
                </ol>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  Tip: Není to kompletní mapa - je to kostra. Doplň vlastní nápady!
                </p>
              </div>
            }
          />
          <p className="text-stone-600 mb-4">Vygeneruj dungeon s tématem a mapou místností.</p>
          <Button onClick={generateDungeon} size="large" className="w-full">
            🗝️ Generovat dungeon
          </Button>
        </ResultCard>
      )}

      {activeGen === 'bestiary' && (
        <div className="space-y-4">
          <ResultCard>
            <HelpHeader 
              title="Bestiář" 
              icon="🐛"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 K čemu to je?</p>
                  <p className="text-xs mb-2">Kompletní seznam všech tvorů pro Mausritter - od hmyzu po nadpřirozené bytosti. Obsahuje 28 tvorů!</p>
                  
                  <p className="font-bold mb-1">📝 Jak používat:</p>
                  <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                    <li>Vyber kategorii (hmyz, savci...) nebo nech "Všechny"</li>
                    <li>Klikni "Náhodný nepřítel" pro random setkání</li>
                    <li>Nebo procházej seznam a vyber konkrétního tvora</li>
                    <li>Detail tvora ukazuje staty, útoky a taktiku</li>
                  </ol>
                  
                  <p className="font-bold mb-1">⚠️ WARBAND:</p>
                  <p className="text-xs text-stone-300 mb-2">
                    Tvorové označení "Warband" jsou tak velcí, že je může efektivně porazit jen skupina 20+ myší. Jediná myš nemá šanci!
                  </p>
                  
                  <p className="font-bold mb-1">📚 Zdroje:</p>
                  <ul className="text-xs text-stone-300">
                    <li>• Official = základní pravidla a rozšíření</li>
                    <li>• Homebrew = komunitní tvorba</li>
                  </ul>
                </div>
              }
            />
            
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setCreatureCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  creatureCategory === 'all' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                🎲 Všechny
              </button>
              {CREATURE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCreatureCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    creatureCategory === cat.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <Button onClick={() => generateCreature(creatureCategory)} size="large" className="w-full">
              🎲 Náhodný nepřítel {creatureCategory !== 'all' && `(${CREATURE_CATEGORIES.find(c => c.id === creatureCategory)?.name})`}
            </Button>
          </ResultCard>

          {/* Selected creature detail */}
          {selectedCreature && (
            <ResultCard className="border-2 border-red-400">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-red-900">{selectedCreature.name}</h3>
                  {selectedCreature.nameEn && <p className="text-sm text-stone-400 italic">{selectedCreature.nameEn}</p>}
                  <p className="text-stone-500">
                    {CREATURE_CATEGORIES.find(c => c.id === selectedCreature.category)?.icon}{' '}
                    {CREATURE_CATEGORIES.find(c => c.id === selectedCreature.category)?.name}
                    {selectedCreature.scale === 'Warband' && <span className="ml-2 bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs font-bold">WARBAND</span>}
                  </p>
                </div>
                <span className="text-4xl">
                  {CREATURE_CATEGORIES.find(c => c.id === selectedCreature.category)?.icon || '❓'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="p-2 bg-red-100 rounded text-center">
                  <div className="text-xs text-stone-500">HP</div>
                  <div className="text-xl font-bold text-red-700">{selectedCreature.hp}</div>
                </div>
                <div className="p-2 bg-amber-100 rounded text-center">
                  <div className="text-xs text-stone-500">STR</div>
                  <div className="text-xl font-bold text-amber-700">{selectedCreature.str}</div>
                </div>
                <div className="p-2 bg-green-100 rounded text-center">
                  <div className="text-xs text-stone-500">DEX</div>
                  <div className="text-xl font-bold text-green-700">{selectedCreature.dex}</div>
                </div>
                <div className="p-2 bg-purple-100 rounded text-center">
                  <div className="text-xs text-stone-500">WIL</div>
                  <div className="text-xl font-bold text-purple-700">{selectedCreature.wil}</div>
                </div>
                <div className="p-2 bg-blue-100 rounded text-center">
                  <div className="text-xs text-stone-500">Armor</div>
                  <div className="text-xl font-bold text-blue-700">{selectedCreature.armor}</div>
                </div>
              </div>

              {/* Attacks */}
              <div className="mb-4">
                <div className="text-sm font-bold text-stone-600 mb-2">⚔️ Útoky</div>
                <div className="space-y-1">
                  {selectedCreature.attacks?.map((atk, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-stone-100 rounded">
                      <span className="font-bold text-stone-800">{atk.name}</span>
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-sm font-mono">{atk.damage}</span>
                      {atk.special && <span className="text-xs text-stone-500 italic">({atk.special})</span>}
                    </div>
                  ))}
                </div>
                {selectedCreature.criticalDamage && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <span className="text-sm font-bold text-red-700">💀 Critical:</span>
                    <span className="text-sm text-red-600 ml-2">{selectedCreature.criticalDamage}</span>
                  </div>
                )}
              </div>

              {/* Abilities */}
              {selectedCreature.abilities?.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm font-bold text-yellow-800 mb-1">⚡ Schopnosti</div>
                  <ul className="text-sm text-stone-700 list-disc list-inside">
                    {selectedCreature.abilities.map((ab, i) => <li key={i}>{ab}</li>)}
                  </ul>
                </div>
              )}

              {/* Description, Tactics, Wants */}
              <div className="space-y-3">
                {selectedCreature.description && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="text-sm font-bold text-stone-600 mb-1">📖 Popis</div>
                    <p className="text-stone-700 text-sm">{selectedCreature.description}</p>
                  </div>
                )}
                {selectedCreature.tactics && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-bold text-blue-800 mb-1">🎯 Taktika</div>
                    <p className="text-stone-700 text-sm">{selectedCreature.tactics}</p>
                  </div>
                )}
                {selectedCreature.wants && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-bold text-purple-800 mb-1">💭 Chce</div>
                    <p className="text-stone-700 text-sm">{selectedCreature.wants}</p>
                  </div>
                )}
                {selectedCreature.variants?.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-sm font-bold text-amber-800 mb-1">🎲 Varianty</div>
                    <div className="text-xs text-stone-600 space-y-0.5">
                      {selectedCreature.variants.map((v, i) => <div key={i}>• {v}</div>)}
                    </div>
                  </div>
                )}
                {selectedCreature.source && (
                  <div className="text-xs text-stone-400 text-right">{selectedCreature.source}</div>
                )}
              </div>
            </ResultCard>
          )}

          {/* Creature list */}
          <ResultCard title="📖 Seznam tvorů">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {BESTIARY
                .filter(c => creatureCategory === 'all' || c.category === creatureCategory)
                .map((creature, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCreature(creature)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                      selectedCreature?.name === creature.name
                        ? 'bg-amber-200 border-2 border-amber-500'
                        : 'bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {CREATURE_CATEGORIES.find(c => c.id === creature.category)?.icon || '❓'}
                      </span>
                      <div>
                        <span className="font-bold text-stone-800">{creature.name}</span>
                        {creature.scale === 'Warband' && <span className="ml-2 text-xs bg-red-200 text-red-800 px-1 rounded">Warband</span>}
                        <div className="text-xs text-stone-500">
                          HP {creature.hp} • STR {creature.str} • {creature.attacks?.[0]?.damage || '?'}
                        </div>
                      </div>
                    </div>
                    <span className="text-stone-400">→</span>
                  </button>
                ))
              }
            </div>
          </ResultCard>
        </div>
      )}

      {activeGen === 'weather' && (
        <ResultCard>
          <HelpHeader 
            title="Počasí" 
            icon="☀️"
            tooltip={
              <div>
                <p className="font-bold mb-2">🎯 K čemu to je?</p>
                <p className="text-xs mb-2">Počasí ovlivňuje cestování a přežití. Hoď na začátku každého dne nebo když se počasí může změnit.</p>
                
                <p className="font-bold mb-1">📝 Jak používat:</p>
                <ol className="list-decimal list-inside text-xs space-y-1 mb-2">
                  <li>Vyber aktuální roční období</li>
                  <li>Hoď 2d6 na počasí</li>
                  <li>Interpretuj vliv na hru</li>
                </ol>
                
                <p className="font-bold mb-1">⚡ Efekty počasí:</p>
                <ul className="text-xs space-y-1 text-stone-300">
                  <li><b>Bouře/Vánice (2)</b> = nebezpečné, těžké cestovat</li>
                  <li><b>Déšť/Sníh (3-4)</b> = pomalé cestování</li>
                  <li><b>Zataženo (5-6)</b> = normální podmínky</li>
                  <li><b>Příjemné (7-9)</b> = ideální pro cestování</li>
                  <li><b>Krásné (10-12)</b> = bonusy k aktivitám venku</li>
                </ul>
                
                <p className="text-xs text-stone-300 mt-2 italic">
                  💡 Extrémní počasí může být háček pro dobrodružství!
                </p>
              </div>
            }
          />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['spring', 'summer', 'autumn', 'winter'].map(s => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    season === s ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {s === 'spring' ? '🌸 Jaro' : s === 'summer' ? '☀️ Léto' : s === 'autumn' ? '🍂 Podzim' : '❄️ Zima'}
                </button>
              ))}
            </div>
            <Button onClick={generateWeather} size="large" className="w-full">
              🎲 Hodit na počasí
            </Button>
          </div>
        </ResultCard>
      )}

      {/* Generated Result */}
      {generated && (
        <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
          {generated.type === 'settlement' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-amber-900">{generated.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Velikost</span>
                  <p className="font-bold">{generated.size}</p>
                </div>
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Landmark</span>
                  <p className="font-bold">{generated.landmark}</p>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded">
                <span className="text-sm text-green-700">Zajímavý rys</span>
                <p className="font-bold text-green-900">{generated.feature}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded">
                <span className="text-sm text-orange-700">Aktuální událost</span>
                <p className="font-bold text-orange-900">{generated.event}</p>
              </div>
              <Button onClick={() => saveSettlementToWorld(generated)} className="w-full">
                📥 Uložit do Moje osady
              </Button>
            </div>
          )}

          {generated.type === 'npc' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-amber-900">{generated.name}</h3>
              {generated.role && (
                <p className="text-center text-stone-600 font-medium">🔧 {generated.role}</p>
              )}
              {/* Staty NPC */}
              <div className="flex gap-4 text-sm font-mono bg-stone-100 rounded px-3 py-2 justify-center">
                <span>BO: <b>{generated.hp?.max}</b></span>
                <span>SÍL: <b>{generated.str?.max}</b></span>
                <span>MRŠ: <b>{generated.dex?.max}</b></span>
                <span>VŮL: <b>{generated.wil?.max}</b></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Znamení</span>
                  <p className="font-bold">{generated.birthsign?.sign}</p>
                  <p className="text-sm text-stone-600">{generated.birthsign?.trait}</p>
                </div>
                <div className="p-3 bg-amber-100/50 rounded">
                  <span className="text-sm text-stone-500">Vzhled</span>
                  <p className="font-bold">{generated.physicalDetail}</p>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded">
                <span className="text-sm text-purple-700">Zvláštnost</span>
                <p className="font-bold text-purple-900">{generated.quirk}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded">
                <span className="text-sm text-blue-700">Cíl</span>
                <p className="font-bold text-blue-900">{generated.goal}</p>
              </div>
              <div className="p-3 bg-stone-100 rounded">
                <span className="text-sm text-stone-600">Reakce (2d6)</span>
                <DiceDisplay dice={generated.reaction.dice} />
                <p className="mt-2 font-bold text-center">
                  {generated.reaction.total <= 3 ? '😠 Nepřátelský' :
                   generated.reaction.total <= 5 ? '😒 Nevlídný' :
                   generated.reaction.total <= 8 ? '😐 Neutrální' :
                   generated.reaction.total <= 10 ? '😊 Přátelský' : '🤝 Nápomocný'}
                </p>
              </div>
              <Button onClick={() => saveNPCToWorld({
                ...generated,
                birthsign: `${generated.birthsign?.sign} (${generated.birthsign?.trait})`
              })} className="w-full">
                📥 Uložit do Moji NPC
              </Button>
            </div>
          )}

          {generated.type === 'dungeon' && (
            <div className="space-y-3">
              <div className="p-3 bg-stone-800 text-stone-100 rounded">
                <span className="text-sm text-stone-400">Téma</span>
                <p className="font-bold text-xl">{generated.theme}</p>
              </div>
              <div className="p-3 bg-red-100 rounded">
                <span className="text-sm text-red-700">Obyvatelé</span>
                <p className="font-bold text-red-900">{generated.denizens}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-700">Místnosti:</h4>
                {generated.rooms.map(room => (
                  <div key={room.number} className="p-3 bg-amber-100/50 rounded flex justify-between items-center">
                    <div>
                      <span className="font-bold">#{room.number}</span>
                      <span className="ml-2 text-stone-600">{room.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-stone-500">{room.exits}</span>
                      <p className="font-medium text-amber-900">{room.contents}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generated.type === 'weather' && (
            <div className="text-center space-y-4">
              <DiceDisplay dice={generated.dice} size="large" />
              <div className="text-5xl">
                {generated.weather.includes('Bouře') || generated.weather.includes('Vánice') ? '⛈️' :
                 generated.weather.includes('Déšť') || generated.weather.includes('Sněžení') ? '🌧️' :
                 generated.weather.includes('Zataženo') || generated.weather.includes('Mlha') ? '☁️' :
                 generated.weather.includes('Slunečno') || generated.weather.includes('Jasno') ? '☀️' :
                 generated.weather.includes('Perfektní') || generated.weather.includes('Nádherné') ? '🌈' : '🌤️'}
              </div>
              <p className="text-3xl font-bold text-amber-900">{generated.weather}</p>
              <p className="text-stone-600 capitalize">{
                generated.season === 'spring' ? 'Jaro' :
                generated.season === 'summer' ? 'Léto' :
                generated.season === 'autumn' ? 'Podzim' : 'Zima'
              }</p>
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
};

// ============================================
// FACTION PANEL
// ============================================

const FactionPanel = ({ factions, setFactions, onLogEntry }) => {
  const [editingFaction, setEditingFaction] = useState(null);

  const addFaction = () => {
    const newFaction = {
      id: generateId(),
      name: 'Nová frakce',
      type: 'gang',
      leader: '',
      base: '',
      trait: '',
      resources: [],
      goals: [{ id: generateId(), description: 'Hlavní cíl', progress: 0, maxProgress: 3 }],
      relationships: []
    };
    setFactions([...factions, newFaction]);
    setEditingFaction(newFaction.id);
  };

  const updateFaction = (id, updates) => {
    setFactions(factions.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFaction = (id) => {
    setFactions(factions.filter(f => f.id !== id));
  };

  const rollFactionProgress = (faction) => {
    const die = rollD6();
    const resourceBonus = faction.resources?.length || 0;
    const total = die + resourceBonus;
    const success = total >= 6;
    
    if (success && faction.goals?.length > 0) {
      const currentGoal = faction.goals.find(g => g.progress < g.maxProgress);
      if (currentGoal) {
        updateFaction(faction.id, {
          goals: faction.goals.map(g => 
            g.id === currentGoal.id 
              ? { ...g, progress: Math.min(g.maxProgress, g.progress + 2) }
              : g
          )
        });
      }
    }
    
    onLogEntry({
      type: 'faction_progress',
      timestamp: formatTimestamp(),
      faction: faction.name,
      roll: die,
      bonus: resourceBonus,
      total,
      success
    });
    
    return { die, resourceBonus, total, success };
  };

  const addGoal = (factionId) => {
    const faction = factions.find(f => f.id === factionId);
    if (!faction) return;
    
    updateFaction(factionId, {
      goals: [...(faction.goals || []), {
        id: generateId(),
        description: 'Nový cíl',
        progress: 0,
        maxProgress: 3
      }]
    });
  };

  const addResource = (factionId) => {
    const faction = factions.find(f => f.id === factionId);
    if (!faction) return;
    
    updateFaction(factionId, {
      resources: [...(faction.resources || []), 'Nový zdroj']
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon="⚔️" 
        title="Frakce" 
        subtitle="Sleduj síly pohybující se ve světě"
      />

      <ResultCard>
        <HelpHeader 
          title="Přidat frakci" 
          icon="➕"
          tooltip={
            <div>
              <p className="mb-1">Frakce jsou skupiny s vlastními cíli:</p>
              <ul className="text-xs space-y-1">
                <li>• Gangy, cechy, kulty, šlechta</li>
                <li>• Sleduj jejich zdroje a cíle</li>
                <li>• Každý týden hoď na pokrok</li>
              </ul>
              <p className="mt-1 text-xs text-stone-300">
                d6 + počet zdrojů ≥ 6 = +2 pokrok k cíli
              </p>
            </div>
          }
        />
        <Button onClick={addFaction} className="w-full">
          ➕ Přidat frakci
        </Button>
      </ResultCard>

      {factions.length === 0 ? (
        <ResultCard>
          <p className="text-center text-stone-500 py-8">
            Žádné frakce. Přidej první frakci pro sledování jejich cílů a pokroku.
          </p>
        </ResultCard>
      ) : (
        <div className="space-y-4">
          {factions.map(faction => (
            <ResultCard key={faction.id} className={editingFaction === faction.id ? 'border-amber-500 border-2' : ''}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingFaction === faction.id ? (
                      <Input 
                        value={faction.name}
                        onChange={(v) => updateFaction(faction.id, { name: v })}
                        className="text-xl font-bold"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-amber-900">{faction.name}</h3>
                    )}
                    {faction.trait && <p className="text-stone-600 italic">{faction.trait}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="small" 
                      variant="ghost" 
                      onClick={() => setEditingFaction(editingFaction === faction.id ? null : faction.id)}
                    >
                      {editingFaction === faction.id ? '✓' : '✏️'}
                    </Button>
                    <Button size="small" variant="danger" onClick={() => removeFaction(faction.id)}>✕</Button>
                  </div>
                </div>

                {/* Details */}
                {editingFaction === faction.id && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-stone-500">Vůdce</label>
                      <Input 
                        value={faction.leader || ''}
                        onChange={(v) => updateFaction(faction.id, { leader: v })}
                        placeholder="Jméno vůdce..."
                      />
                    </div>
                    <div>
                      <label className="text-sm text-stone-500">Základna</label>
                      <Input 
                        value={faction.base || ''}
                        onChange={(v) => updateFaction(faction.id, { base: v })}
                        placeholder="Místo základny..."
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-stone-500">Charakteristika</label>
                      <Input 
                        value={faction.trait || ''}
                        onChange={(v) => updateFaction(faction.id, { trait: v })}
                        placeholder="Popis frakce..."
                      />
                    </div>
                  </div>
                )}

                {/* Resources */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-stone-700">📦 Zdroje ({faction.resources?.length || 0})</span>
                    {editingFaction === faction.id && (
                      <Button size="small" variant="ghost" onClick={() => addResource(faction.id)}>+</Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(faction.resources || []).map((res, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-100 rounded-full text-sm">
                        {editingFaction === faction.id ? (
                          <input
                            type="text"
                            value={res}
                            onChange={(e) => {
                              const newResources = [...faction.resources];
                              newResources[i] = e.target.value;
                              updateFaction(faction.id, { resources: newResources });
                            }}
                            className="bg-transparent border-none outline-none w-24"
                          />
                        ) : res}
                      </span>
                    ))}
                    {(!faction.resources || faction.resources.length === 0) && (
                      <span className="text-stone-400 text-sm">Žádné zdroje</span>
                    )}
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-stone-700">🎯 Cíle</span>
                    {editingFaction === faction.id && (
                      <Button size="small" variant="ghost" onClick={() => addGoal(faction.id)}>+</Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(faction.goals || []).map(goal => (
                      <div key={goal.id} className="p-3 bg-stone-100 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          {editingFaction === faction.id ? (
                            <Input 
                              value={goal.description}
                              onChange={(v) => updateFaction(faction.id, {
                                goals: faction.goals.map(g => 
                                  g.id === goal.id ? { ...g, description: v } : g
                                )
                              })}
                              className="flex-1 mr-2"
                            />
                          ) : (
                            <span className="font-medium">{goal.description}</span>
                          )}
                          <span className={`font-bold ${goal.progress >= goal.maxProgress ? 'text-green-600' : 'text-amber-700'}`}>
                            {goal.progress}/{goal.maxProgress}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: goal.maxProgress }).map((_, i) => (
                            <div
                              key={i}
                              onClick={() => editingFaction === faction.id && updateFaction(faction.id, {
                                goals: faction.goals.map(g => 
                                  g.id === goal.id ? { ...g, progress: i < goal.progress ? i : i + 1 } : g
                                )
                              })}
                              className={`flex-1 h-3 rounded ${
                                i < goal.progress ? 'bg-amber-600' : 'bg-amber-200'
                              } ${editingFaction === faction.id ? 'cursor-pointer hover:bg-amber-400' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Roll Progress */}
                <Button 
                  onClick={() => {
                    const result = rollFactionProgress(faction);
                    alert(`${faction.name}: d6=${result.die} + ${result.resourceBonus} zdrojů = ${result.total}\n${result.success ? '✓ Úspěch! +2 pokrok' : '✗ Bez pokroku'}`);
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  🎲 Hodit na pokrok (d6 + zdroje ≥ 6)
                </Button>
              </div>
            </ResultCard>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// PARTY PANEL
// ============================================

const PartyPanel = ({ 
  parties, 
  activePartyId, 
  setActivePartyId,
  activeCharacterId,
  setActiveCharacterId,
  createParty,
  createPC,
  createHireling,
  updateParty,
  updateCharacterInParty,
  removeCharacter,
  removeParty,
  onLogEntry 
}) => {
  const [editingPartyId, setEditingPartyId] = useState(null);
  const [editingCharId, setEditingCharId] = useState(null);
  const [expandedParties, setExpandedParties] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'party'|'character', partyId, charId?, name }

  const toggleExpand = (partyId) => {
    setExpandedParties(prev => ({ ...prev, [partyId]: !prev[partyId] }));
  };

  const activeParty = parties.find(p => p.id === activePartyId);

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'party') {
      removeParty(deleteConfirm.partyId);
    } else if (deleteConfirm.type === 'character') {
      removeCharacter(deleteConfirm.partyId, deleteConfirm.charId);
    }
    setDeleteConfirm(null);
  };

  // Generate random PC
  const generateRandomPC = (partyId) => {
    // Roll attributes (3k6, take two highest for each)
    const roll3k6TwoHighest = () => {
      const rolls = [rollD6(), rollD6(), rollD6()];
      rolls.sort((a, b) => b - a);
      return rolls[0] + rolls[1];
    };
    
    const rollK66 = () => `${rollD6()}-${rollD6()}`;
    
    const str = roll3k6TwoHighest();
    const dex = roll3k6TwoHighest();
    const wil = roll3k6TwoHighest();
    const hp = rollD6();
    const pips = rollD6();
    
    // Get origin from HP × Pips table
    const originKey = `${hp}-${pips}`;
    const origin = ORIGINS[originKey] || ORIGINS['1-1'];
    
    // Gender and name
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const firstNames = gender === 'male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
    const familyName = randomFrom(FAMILY_NAMES);
    const firstName = randomFrom(firstNames);
    const lastName = gender === 'male' ? familyName.male : familyName.female;
    
    // Fur
    const furColor = randomFrom(FUR_COLORS);
    const furPattern = randomFrom(FUR_PATTERNS);
    
    // Distinctive feature (k66)
    const distinctiveFeature = DISTINCTIVE_FEATURES[rollK66()] || 'Běžný vzhled';
    
    // Weapon
    const weapon = randomFrom(STARTING_WEAPONS);
    
    // Build inventorySlots from origin
    const inventorySlots = {
      mainPaw: { id: generateId(), name: `${weapon.name} (${weapon.damage})`, slots: weapon.slots, usageDots: 0, maxUsage: 3, isWeapon: true },
      offPaw: null,
      body1: null,
      body2: null,
      pack1: { id: generateId(), name: 'Zásoby', slots: 1, usageDots: 0, maxUsage: 3 },
      pack2: { id: generateId(), name: 'Pochodně', slots: 1, usageDots: 0, maxUsage: 3 },
      pack3: { id: generateId(), name: origin.itemA, slots: 1, usageDots: 0, maxUsage: 3 },
      pack4: { id: generateId(), name: origin.itemB, slots: 1, usageDots: 0, maxUsage: 3 },
      pack5: null,
      pack6: null
    };
    
    const newChar = {
      id: generateId(),
      type: 'pc',
      name: `${firstName} ${lastName}`,
      gender,
      level: 1,
      STR: { current: str, max: str },
      DEX: { current: dex, max: dex },
      WIL: { current: wil, max: wil },
      hp: { current: hp, max: hp },
      pips,
      xp: 0,
      origin,
      birthsign: randomFrom(BIRTHSIGNS),
      fur: { color: furColor, pattern: furPattern },
      distinctiveFeature,
      conditions: [],
      inventorySlots,
      inventory: [],
      spells: []
    };
    
    createPC(partyId, newChar);
    onLogEntry({
      type: 'character_created',
      timestamp: formatTimestamp(),
      character: newChar.name,
      partyId
    });
  };

  const HIRELING_SKILLS = [
    'Boj', 'Průzkum', 'Léčení', 'Plížení', 'Jezdectví', 
    'Vaření', 'Opravy', 'Magie', 'Obchod', 'Navigace'
  ];

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-amber-900 mb-3">
              ⚠️ Potvrdit smazání
            </h3>
            <p className="text-stone-700 mb-4">
              {deleteConfirm.type === 'party' 
                ? `Opravdu chceš smazat družinu "${deleteConfirm.name}" a všechny její členy?`
                : `Opravdu chceš odstranit "${deleteConfirm.name}" z družiny?`
              }
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
                Zrušit
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                🗑️ Smazat
              </Button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader 
        icon="🏕️" 
        title="Družiny a postavy" 
        subtitle={`${parties.length} družin, ${parties.reduce((acc, p) => acc + p.members.length, 0)} postav celkem`}
      />

      {/* Create new party */}
      <ResultCard>
        <HelpHeader 
          title="Správa družin" 
          icon="➕"
          tooltip={
            <div>
              <p className="mb-1">Družina = skupina postav cestující spolu</p>
              <ul className="text-xs space-y-1">
                <li>• Každá družina má vlastní čas</li>
                <li>• PC = plná postava s XP a levely</li>
                <li>• Hireling = pomocník s Loyalty</li>
              </ul>
            </div>
          }
        />
        <Button onClick={() => createParty()} className="w-full">
          🏕️ Vytvořit novou družinu
        </Button>
      </ResultCard>

      {/* Party list */}
      {parties.length === 0 ? (
        <ResultCard>
          <div className="text-center py-8 text-stone-500">
            <p className="text-4xl mb-3">🐭</p>
            <p>Zatím nemáš žádnou družinu.</p>
            <p className="text-sm mt-2">Vytvoř první družinu a přidej do ní postavy!</p>
          </div>
        </ResultCard>
      ) : (
        <div className="space-y-4">
          {parties.map(party => {
            const isActive = party.id === activePartyId;
            const isExpanded = expandedParties[party.id] !== false; // Default expanded
            const isEditing = editingPartyId === party.id;
            
            return (
              <ResultCard 
                key={party.id} 
                className={`${isActive ? 'border-2 border-amber-500 shadow-lg' : ''}`}
              >
                {/* Party Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <button 
                      onClick={() => toggleExpand(party.id)}
                      className="text-xl hover:bg-amber-100 rounded p-1"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={party.name}
                        onChange={(e) => updateParty(party.id, { name: e.target.value })}
                        onBlur={() => setEditingPartyId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingPartyId(null)}
                        autoFocus
                        className="flex-1 px-2 py-1 border-2 border-amber-500 rounded font-bold text-lg"
                      />
                    ) : (
                      <h3 
                        className="font-bold text-lg text-amber-900 cursor-pointer hover:text-amber-700"
                        onClick={() => setEditingPartyId(party.id)}
                        title="Klikni pro přejmenování"
                      >
                        {party.name}
                        <span className="text-sm font-normal text-stone-500 ml-2">
                          ({party.members.length} členů)
                        </span>
                      </h3>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                        AKTIVNÍ
                      </span>
                    ) : (
                      <Button 
                        size="small" 
                        variant="secondary"
                        onClick={() => {
                          setActivePartyId(party.id);
                          if (party.members.length > 0) {
                            setActiveCharacterId(party.members[0].id);
                          }
                        }}
                      >
                        Aktivovat
                      </Button>
                    )}
                    <Button 
                      size="small" 
                      variant="ghost"
                      onClick={() => setEditingPartyId(isEditing ? null : party.id)}
                    >
                      ✏️
                    </Button>
                    <Button 
                      size="small" 
                      variant="danger"
                      onClick={() => setDeleteConfirm({ 
                        type: 'party', 
                        partyId: party.id, 
                        name: party.name 
                      })}
                      title={`Smazat družinu ${party.name}`}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>

                {/* Party Time Info */}
                {isExpanded && (
                  <div className="mb-3 p-2 bg-amber-50 rounded text-sm flex flex-wrap gap-4">
                    <span>
                      {['🌅', '☀️', '🌆', '🌙'][party.gameTime?.watch || 0]} 
                      {' '}{WATCHES[party.gameTime?.watch || 0]?.name}
                    </span>
                    <span>📆 Den {party.gameTime?.day || 1}, Týden {party.gameTime?.week || 1}</span>
                    <span>
                      {SEASONS.find(s => s.id === (party.gameTime?.season || 'spring'))?.icon}
                      {' '}{SEASONS.find(s => s.id === (party.gameTime?.season || 'spring'))?.name}
                    </span>
                  </div>
                )}

                {/* Members List */}
                {isExpanded && (
                  <div className="space-y-2">
                    {party.members.length === 0 ? (
                      <p className="text-stone-400 text-sm text-center py-3">
                        Družina je prázdná. Přidej postavy níže.
                      </p>
                    ) : (
                      party.members.map(member => {
                        const isPC = member.type === 'pc';
                        const isCharEditing = editingCharId === member.id;
                        const isSelected = activeCharacterId === member.id && isActive;
                        
                        return (
                          <div 
                            key={member.id}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-amber-100 border-amber-500' 
                                : isPC 
                                  ? 'bg-green-50 border-green-200 hover:border-green-400'
                                  : 'bg-blue-50 border-blue-200 hover:border-blue-400'
                            }`}
                            onClick={() => {
                              if (isActive && !isCharEditing) {
                                setActiveCharacterId(member.id);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{isPC ? '🐭' : '🐿️'}</span>
                                <div>
                                  {isCharEditing ? (
                                    <input
                                      type="text"
                                      value={member.name}
                                      onChange={(e) => updateCharacterInParty(party.id, member.id, { name: e.target.value })}
                                      onBlur={() => setEditingCharId(null)}
                                      onKeyDown={(e) => e.key === 'Enter' && setEditingCharId(null)}
                                      onClick={(e) => e.stopPropagation()}
                                      autoFocus
                                      className="px-2 py-1 border-2 border-amber-500 rounded font-bold"
                                    />
                                  ) : (
                                    <span 
                                      className="font-bold text-stone-800 hover:text-amber-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCharId(member.id);
                                      }}
                                      title="Klikni pro přejmenování"
                                    >
                                      {member.name}
                                    </span>
                                  )}
                                  <div className="flex gap-3 text-sm text-stone-600">
                                    {isPC ? (
                                      <>
                                        <span>Level {member.level || 1}</span>
                                        <span className={member.hp?.current < member.hp?.max ? 'text-red-600 font-bold' : ''}>
                                          HP {member.hp?.current || 0}/{member.hp?.max || 6}
                                        </span>
                                        <span>{member.pips || 0} pips</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className={member.hp?.current < member.hp?.max ? 'text-red-600 font-bold' : ''}>
                                          HP {member.hp?.current || 0}/{member.hp?.max || 3}
                                        </span>
                                        <span>Loyalty: {member.loyalty || 7}</span>
                                        <span>{member.cost || '1 pip/den'}</span>
                                      </>
                                    )}
                                  </div>
                                  {!isPC && member.skills?.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {member.skills.map((skill, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <span className="text-xs text-amber-600 font-bold">VYBRÁN</span>
                                )}
                                <Button 
                                  size="small" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm({
                                      type: 'character',
                                      partyId: party.id,
                                      charId: member.id,
                                      name: member.name
                                    });
                                  }}
                                  title={`Odstranit ${member.name}`}
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Add buttons */}
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-amber-200">
                      <Button 
                        size="small" 
                        onClick={() => generateRandomPC(party.id)}
                      >
                        🎲 Náhodná PC
                      </Button>
                      <Button 
                        size="small" 
                        variant="secondary"
                        onClick={() => createPC(party.id)}
                      >
                        🐭 Prázdná PC
                      </Button>
                      <Button 
                        size="small" 
                        variant="ghost"
                        onClick={() => createHireling(party.id)}
                      >
                        🐿️ Hireling
                      </Button>
                    </div>
                  </div>
                )}
              </ResultCard>
            );
          })}
        </div>
      )}

      {/* Quick reference */}
      <ResultCard title="📋 Rychlá reference">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">🐭 PC (Player Character)</h4>
            <ul className="space-y-1 text-stone-700">
              <li>• Plný character sheet</li>
              <li>• STR, DEX, WIL atributy</li>
              <li>• XP a levelování</li>
              <li>• Inventář a kouzla</li>
            </ul>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">🐿️ Hireling (Pomocník)</h4>
            <ul className="space-y-1 text-stone-700">
              <li>• Zjednodušený sheet</li>
              <li>• HP + Loyalty (loajalita)</li>
              <li>• Cena (obvykle 1 pip/den)</li>
              <li>• Může zradit při selhání Loyalty!</li>
            </ul>
          </div>
        </div>
      </ResultCard>
    </div>
  );
};

// ============================================
// TIME TRACKER PANEL
// ============================================

const WATCHES = [
  { id: 'morning', name: 'Ráno', icon: '🌅', hours: '6:00-12:00' },
  { id: 'afternoon', name: 'Odpoledne', icon: '☀️', hours: '12:00-18:00' },
  { id: 'evening', name: 'Večer', icon: '🌆', hours: '18:00-24:00' },
  { id: 'night', name: 'Noc', icon: '🌙', hours: '0:00-6:00' }
];

const SEASONS = [
  { id: 'spring', name: 'Jaro', icon: '🌸', months: 'Březen-Květen' },
  { id: 'summer', name: 'Léto', icon: '☀️', months: 'Červen-Srpen' },
  { id: 'autumn', name: 'Podzim', icon: '🍂', months: 'Září-Listopad' },
  { id: 'winter', name: 'Zima', icon: '❄️', months: 'Prosinec-Únor' }
];

// Simplified time constants for TimePanel and TimeBar
const TIMEBAR_SEASONS = [
  { id: 'spring', name: 'Jaro', icon: '🌱' },
  { id: 'summer', name: 'Léto', icon: '☀️' },
  { id: 'autumn', name: 'Podzim', icon: '🍂' },
  { id: 'winter', name: 'Zima', icon: '❄️' }
];

const TIMEBAR_WATCHES = [
  { id: 0, name: 'Ráno', icon: '🌅' },
  { id: 1, name: 'Den', icon: '☀️' },
  { id: 2, name: 'Večer', icon: '🌆' },
  { id: 3, name: 'Noc', icon: '🌙' }
];

// Efekty počasí podle typu a sezóny
const WEATHER_EFFECTS = {
  // Extrémní počasí (hod 2)
  'Bouře': { icon: '⛈️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání. Cestování ×2.' },
  'Vánice': { icon: '🌨️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání. Cestování ×2.' },
  'Sucho': { icon: '🏜️', danger: true, travelMod: 1, effect: 'STR save bez vody nebo Vyčerpání.' },
  'Vichřice': { icon: '🌪️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání. Cestování ×2.' },
  // Špatné počasí (hod 3-4)
  'Déšť': { icon: '🌧️', danger: false, travelMod: 1.5, effect: 'Pomalé cestování (×1.5 hlídky).' },
  'Sněžení': { icon: '❄️', danger: false, travelMod: 1.5, effect: 'Pomalé cestování (×1.5 hlídky).' },
  'Horko': { icon: '🥵', danger: true, travelMod: 1, effect: 'STR save bez vody nebo Vyčerpání.' },
  'Mlha': { icon: '🌫️', danger: false, travelMod: 1.5, effect: 'Snížená viditelnost. Cestování ×1.5.' },
  // Průměrné počasí (hod 5-6)
  'Zataženo': { icon: '☁️', danger: false, travelMod: 1, effect: null },
  'Zima': { icon: '🥶', danger: false, travelMod: 1, effect: 'Potřeba přístřeší v noci.' },
  'Teplo': { icon: '🌤️', danger: false, travelMod: 1, effect: null },
  // Normální počasí (hod 7-9)
  'Mírné': { icon: '🌤️', danger: false, travelMod: 1, effect: null },
  'Příjemné': { icon: '😊', danger: false, travelMod: 1, effect: null },
  'Chladno': { icon: '🍃', danger: false, travelMod: 1, effect: null },
  'Mráz': { icon: '🥶', danger: true, travelMod: 1, effect: 'STR save každou hlídku venku nebo Vyčerpání.' },
  // Dobré počasí (hod 10-12)
  'Slunečno': { icon: '☀️', danger: false, travelMod: 1, effect: null },
  'Svěží': { icon: '🍂', danger: false, travelMod: 1, effect: null },
  'Jasno': { icon: '✨', danger: false, travelMod: 1, effect: null },
  'Nádherné': { icon: '🌈', danger: false, travelMod: 1, effect: null },
  'Perfektní': { icon: '🌅', danger: false, travelMod: 1, effect: null },
  'Zlaté': { icon: '🍁', danger: false, travelMod: 1, effect: null },
  'Klidné': { icon: '❄️', danger: false, travelMod: 1, effect: null }
};

// Generování počasí s efekty
const generateWeather = (season) => {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const total = d1 + d2;
  const type = WEATHER_TABLE[season]?.[total] || 'Mírné';
  const effects = WEATHER_EFFECTS[type] || { icon: '🌤️', danger: false, travelMod: 1, effect: null };

  return {
    type,
    roll: total,
    dice: [d1, d2],
    ...effects
  };
};

// Kalkulačka cestování
const TravelCalculator = ({ weather }) => {
  const [hexCount, setHexCount] = React.useState(1);
  const [difficultTerrain, setDifficultTerrain] = React.useState(false);
  const [badWeather, setBadWeather] = React.useState(false);

  // Modifikátor počasí z aktuálního stavu nebo ruční volby
  const weatherMod = badWeather ? 1.5 : (weather?.travelMod || 1);
  const weatherLabel = weather?.type || (badWeather ? 'Špatné' : 'Normální');

  const baseWatches = hexCount * (difficultTerrain ? 2 : 1);
  const watches = Math.ceil(baseWatches * weatherMod);
  const days = Math.ceil(watches / 3); // 3 hlídky aktivní + 1 odpočinek
  const encounterRolls = days * 2; // ráno + večer
  const avgEncounters = (encounterRolls / 6).toFixed(1);

  return (
    <ResultCard title="🗺️ Kalkulačka cestování">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-stone-600">Hexů:</label>
            <Input
              type="number"
              min="1"
              max="100"
              value={hexCount}
              onChange={(v) => setHexCount(Math.max(1, parseInt(v) || 1))}
              className="w-20"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={difficultTerrain}
              onChange={(e) => setDifficultTerrain(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300"
            />
            <span className="text-sm text-stone-600">Náročný terén (×2)</span>
          </label>
          {!weather && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={badWeather}
                onChange={(e) => setBadWeather(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300"
              />
              <span className="text-sm text-stone-600">Špatné počasí (×1.5)</span>
            </label>
          )}
        </div>

        {/* Aktuální počasí */}
        {weather && weatherMod > 1 && (
          <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
            {weather.icon} Počasí "{weather.type}" zpomaluje cestování (×{weatherMod})
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-600">{watches}</div>
            <div className="text-xs text-stone-600">Hlídek</div>
            {weatherMod > 1 && <div className="text-xs text-amber-500">({baseWatches} × {weatherMod})</div>}
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{days}</div>
            <div className="text-xs text-stone-600">Dnů</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">~{avgEncounters}</div>
            <div className="text-xs text-stone-600">Setkání</div>
          </div>
        </div>

        <p className="text-xs text-stone-500 text-center">
          {encounterRolls} hodů na d6 (1 = setkání, 2 = omen) • {days} {days === 1 ? 'den' : days < 5 ? 'dny' : 'dnů'} s odpočinkem
        </p>
      </div>
    </ResultCard>
  );
};

const TimePanel = ({ party, updateParty, onLogEntry }) => {
  // Extract gameTime from party
  const gameTime = party?.gameTime || { watch: 0, day: 1, season: 'spring', turn: 0, restedToday: false, context: 'wilderness', weather: null };

  const setGameTime = (newTime) => {
    if (party) {
      updateParty({ gameTime: typeof newTime === 'function' ? newTime(gameTime) : newTime });
    }
  };

  const { day = 1, season = 'spring', watch = 0, turn = 0, restedToday = false, context = 'wilderness', weather = null } = gameTime;
  const [showRules, setShowRules] = React.useState(false);
  const [showEncounterReminder, setShowEncounterReminder] = React.useState(false);
  const [encounterRollResult, setEncounterRollResult] = React.useState(null);

  const currentSeason = TIMEBAR_SEASONS.find(s => s.id === season) || TIMEBAR_SEASONS[0];
  const currentWatch = TIMEBAR_WATCHES.find(w => w.id === watch) || TIMEBAR_WATCHES[0];

  // Check if party exists
  if (!party) {
    return (
      <div className="space-y-6">
        <SectionHeader icon="⏰" title="Sledování času" subtitle="Nejprve vyber aktivní družinu" />
        <ResultCard>
          <div className="text-center py-8 text-stone-500">
            <p className="text-4xl mb-3">🏕️</p>
            <p>Žádná aktivní družina.</p>
            <p className="text-sm mt-2">Přejdi do panelu "Postavy" a vytvoř nebo aktivuj družinu.</p>
          </div>
        </ResultCard>
      </div>
    );
  }

  // Přidat směnu
  const addTurn = () => {
    const newTurn = turn + 1;
    if (newTurn >= 36) {
      nextWatch();
    } else {
      setGameTime({ ...gameTime, turn: newTurn });
    }

    // Připomínka setkání každé 3 směny - JEN V DUNGEONU
    if (context === 'dungeon' && newTurn % 3 === 0 && newTurn > 0) {
      // Automatický hod na setkání
      const result = rollD6();
      setEncounterRollResult(result);
      setShowEncounterReminder(true);
      // Log do deníku
      onLogEntry({
        type: 'encounter_reminder',
        timestamp: formatTimestamp(),
        turn: newTurn,
        message: `⚔️ Dungeon: Směna ${newTurn} - hoď na setkání!`
      });
    }
  };

  // Další hlídka
  const nextWatch = () => {
    const nextWatchId = watch >= 3 ? 0 : watch + 1;
    const isNewDay = watch >= 3;
    const newDay = isNewDay ? day + 1 : day;

    // Generovat počasí při novém dni (v divočině)
    let newWeather = weather;
    if (isNewDay && context === 'wilderness') {
      newWeather = generateWeather(season);
      onLogEntry({
        type: 'weather',
        timestamp: formatTimestamp(),
        message: `${newWeather.icon} Počasí: ${newWeather.type} (${newWeather.dice[0]}+${newWeather.dice[1]}=${newWeather.roll})`,
        data: newWeather
      });
      // Varování při nebezpečném počasí
      if (newWeather.danger && newWeather.effect) {
        onLogEntry({
          type: 'weather_warning',
          timestamp: formatTimestamp(),
          message: `⚠️ ${newWeather.effect}`
        });
      }
    }

    // Aktualizovat čas
    if (isNewDay) {
      setGameTime({
        ...gameTime,
        day: newDay,
        watch: 0,
        turn: 0,
        restedToday: false,
        weather: newWeather
      });
      onLogEntry({
        type: 'time_advance',
        timestamp: formatTimestamp(),
        message: `Nový den ${newDay}`
      });
    } else {
      setGameTime({
        ...gameTime,
        watch: nextWatchId,
        turn: 0
      });
      onLogEntry({
        type: 'time_advance',
        timestamp: formatTimestamp(),
        message: `${TIMEBAR_WATCHES[nextWatchId]?.name || 'Další hlídka'}`
      });
    }

    // Upozornění na setkání v DIVOČINĚ - ráno (0) a večer (2)
    if (context === 'wilderness' && (nextWatchId === 0 || nextWatchId === 2)) {
      const watchName = nextWatchId === 0 ? 'Ranní' : 'Večerní';
      // Automatický hod na setkání
      const result = rollD6();
      setEncounterRollResult(result);
      setShowEncounterReminder(true);
      // Log do deníku
      onLogEntry({
        type: 'encounter_reminder',
        timestamp: formatTimestamp(),
        message: `🌲 ${watchName} hlídka - hoď d6 na setkání (1 = setkání, 2 = omen)`
      });
    }
  };

  // Ruční přehození počasí
  const rerollWeather = () => {
    const newWeather = generateWeather(season);
    setGameTime({ ...gameTime, weather: newWeather });
    onLogEntry({
      type: 'weather',
      timestamp: formatTimestamp(),
      message: `${newWeather.icon} Počasí přehozeno: ${newWeather.type} (${newWeather.dice[0]}+${newWeather.dice[1]}=${newWeather.roll})`,
      data: newWeather
    });
    if (newWeather.danger && newWeather.effect) {
      onLogEntry({
        type: 'weather_warning',
        timestamp: formatTimestamp(),
        message: `⚠️ ${newWeather.effect}`
      });
    }
  };

  // Označit odpočinek
  const markRest = () => {
    setGameTime({ ...gameTime, restedToday: true });
    onLogEntry({
      type: 'rest',
      timestamp: formatTimestamp(),
      message: 'Odpočinek'
    });
    nextWatch();
  };

  // Změna sezóny
  const cycleSeason = () => {
    const currentIndex = TIMEBAR_SEASONS.findIndex(s => s.id === season);
    const nextIndex = (currentIndex + 1) % TIMEBAR_SEASONS.length;
    setGameTime({ ...gameTime, season: TIMEBAR_SEASONS[nextIndex].id });
  };

  // Progress bar pro směny
  const renderTurnProgress = () => {
    const segments = [];
    for (let i = 0; i < 12; i++) {
      const segmentStart = i * 3;
      const filled = turn > segmentStart;
      const isThird = (i + 1) % 4 === 0;
      segments.push(
        <div
          key={i}
          className={`h-4 flex-1 rounded ${
            filled ? 'bg-amber-500' : 'bg-stone-200'
          } ${isThird ? 'mr-2' : 'mr-1'}`}
        />
      );
    }
    return segments;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon="⏰"
        title="Sledování času"
        subtitle={`${party.name} • ${currentSeason.icon} ${currentSeason.name}`}
      />

      {/* Přepínač kontextu */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setGameTime({ ...gameTime, context: 'dungeon' })}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            context === 'dungeon'
              ? 'bg-stone-700 text-white shadow-lg'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🏚️ Dungeon
        </button>
        <button
          onClick={() => setGameTime({ ...gameTime, context: 'wilderness' })}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            context === 'wilderness'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🌲 Divočina
        </button>
      </div>

      {/* Hlavní přehled */}
      <ResultCard>
        <div className="space-y-6">
          {/* Den, sezóna a počasí */}
          <div className="flex items-center justify-center gap-6 text-center flex-wrap">
            <div>
              <div className="text-4xl mb-1">{currentSeason.icon}</div>
              <div className="text-sm font-bold text-amber-900">{currentSeason.name}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600">{day}</div>
              <div className="text-sm text-stone-600">Den</div>
            </div>
            {/* Počasí - jen v divočině */}
            {context === 'wilderness' && (
              <div
                onClick={rerollWeather}
                className="cursor-pointer hover:scale-105 transition-transform"
                title="Klikni pro přehození počasí"
              >
                <div className="text-4xl mb-1">{weather?.icon || '🌤️'}</div>
                <div className="text-sm text-stone-600">{weather?.type || 'Neznámé'}</div>
                {weather?.roll && (
                  <div className="text-xs text-stone-400">({weather.roll})</div>
                )}
              </div>
            )}
          </div>

          {/* Varování při špatném počasí */}
          {context === 'wilderness' && weather?.danger && weather?.effect && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center text-red-800">
              ⚠️ <strong>{weather.type}:</strong> {weather.effect}
            </div>
          )}

          {/* Hlídky */}
          <div className="flex justify-center gap-3">
            {TIMEBAR_WATCHES.map((w) => (
              <div
                key={w.id}
                className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg text-2xl transition-all ${
                  w.id === watch
                    ? 'bg-amber-500 text-white shadow-lg scale-110'
                    : w.id < watch
                    ? 'bg-stone-300 text-stone-500'
                    : 'bg-stone-100 text-stone-400'
                } ${restedToday && w.id < watch ? 'ring-2 ring-green-400' : ''}`}
              >
                <span>{w.icon}</span>
                <span className="text-xs mt-1">{w.name}</span>
              </div>
            ))}
          </div>

          {/* Směny */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Směny v hlídce</span>
              <span className="font-bold">{turn}/36</span>
            </div>
            <div className="flex items-center">
              {renderTurnProgress()}
            </div>
            <p className="text-xs text-stone-500 text-center">
              {context === 'dungeon'
                ? '🏚️ Dungeon: Setkání každé 3 směny'
                : '🌲 Divočina: Setkání ráno + večer (d6)'
              } • 36 směn = 1 hlídka
            </p>
          </div>

          {/* Tlačítka */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={addTurn} variant="primary" size="large">
              +1 Směna
            </Button>
            <Button onClick={markRest} variant="secondary" size="large">
              💤 Odpočinek
            </Button>
            <Button onClick={nextWatch} variant="ghost" size="large">
              → Další hlídka
            </Button>
          </div>

          {/* Varování */}
          {!restedToday && watch >= 3 && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center text-red-800">
              ⚠️ Žádný odpočinek dnes! Hrozí vyčerpání.
            </div>
          )}
        </div>
      </ResultCard>

      {/* Nápověda pravidel */}
      <div className="border border-amber-200 rounded-lg p-3 bg-amber-50/50">
        <button
          onClick={() => setShowRules(!showRules)}
          className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1 w-full"
        >
          <span>{showRules ? '▼' : '▶'}</span> 📖 Pravidla času
        </button>
        {showRules && (
          <div className="mt-3 text-xs text-stone-600 space-y-3">
            <table className="w-full">
              <thead><tr className="text-left border-b border-amber-200">
                <th className="pb-1">Měřítko</th><th className="pb-1">Délka</th><th className="pb-1">Použití</th>
              </tr></thead>
              <tbody>
                <tr><td className="py-1">Kolo</td><td>~1 min</td><td>Boj</td></tr>
                <tr><td className="py-1">Směna</td><td>10 min</td><td>Průzkum (1 místnost)</td></tr>
                <tr><td className="py-1">Hlídka</td><td>6 hod (36 směn)</td><td>Cestování (1 hex)</td></tr>
              </tbody>
            </table>

            {/* Kompaktní přehled podle kontextu */}
            {context === 'dungeon' ? (
              <div className="border-t border-amber-200 pt-2">
                <p className="font-bold mb-2">🏚️ CHECKLIST DUNGEON</p>
                <div className="space-y-1 text-stone-700">
                  <p>☐ <strong>Každé 3 směny:</strong> Hoď na setkání</p>
                  <p>☐ <strong>Směna = 10 min:</strong> Průzkum 1 místnosti</p>
                  <p>☐ <strong>Odpočinek:</strong> Krátký (1 směna) = k6+1 BO</p>
                </div>
              </div>
            ) : (
              <div className="border-t border-amber-200 pt-2">
                <p className="font-bold mb-2">🌲 CHECKLIST DIVOČINA</p>
                <div className="space-y-2">
                  <div className="bg-amber-50 p-2 rounded">
                    <p className="font-medium text-amber-800">☀️ KAŽDÝ DEN:</p>
                    <p>☐ Počasí (automaticky při novém dni)</p>
                    <p>☐ Min. 1 hlídka odpočinku</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="font-medium text-green-800">🌅 RÁNO + 🌆 VEČER:</p>
                    <p>☐ Hoď d6 na setkání</p>
                    <p className="text-xs text-stone-500">1 = setkání, 2 = omen</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="font-medium text-blue-800">🗺️ CESTOVÁNÍ:</p>
                    <p>☐ 1 hex = 1 hlídka</p>
                    <p>☐ Náročný terén = 2 hlídky</p>
                    <p>☐ Špatné počasí = ×1.5 nebo ×2</p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-amber-200 pt-2 space-y-1">
              <p><strong>💤 Odpočinek:</strong> Krátký = k6+1 BO • Dlouhý (1 hlídka) = všechny BO</p>
              <p><strong>🍖 Hledání:</strong> 1 hlídka = k3 zásob</p>
            </div>
          </div>
        )}
      </div>

      {/* Kalkulačka cestování - jen v divočině */}
      {context === 'wilderness' && (
        <TravelCalculator weather={weather} />
      )}

      {/* Nastavení */}
      <ResultCard title="⚙️ Ruční nastavení">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-stone-600 block mb-1">Den</label>
            <div className="flex items-center gap-2">
              <Button size="small" onClick={() => setGameTime({ ...gameTime, day: Math.max(1, day - 1) })}>-</Button>
              <span className="font-bold text-xl w-12 text-center">{day}</span>
              <Button size="small" onClick={() => setGameTime({ ...gameTime, day: day + 1 })}>+</Button>
            </div>
          </div>
          <div>
            <label className="text-sm text-stone-600 block mb-1">Sezóna</label>
            <Button onClick={cycleSeason} variant="secondary" className="w-full">
              {currentSeason.icon} {currentSeason.name}
            </Button>
          </div>
          <div>
            <label className="text-sm text-stone-600 block mb-1">Hlídka</label>
            <Select
              value={watch}
              onChange={(v) => setGameTime({ ...gameTime, watch: parseInt(v), turn: 0 })}
              options={TIMEBAR_WATCHES.map(w => ({ value: w.id, label: `${w.icon} ${w.name}` }))}
            />
          </div>
          <div>
            <label className="text-sm text-stone-600 block mb-1">Směna</label>
            <Input
              type="number"
              value={turn}
              onChange={(v) => setGameTime({ ...gameTime, turn: Math.max(0, Math.min(36, parseInt(v) || 0)) })}
            />
          </div>
        </div>
      </ResultCard>
      {/* Vizuální upozornění na setkání - modální okno s automatickým hodem */}
      {showEncounterReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`px-8 py-6 rounded-xl shadow-2xl text-center max-w-sm text-white ${
            encounterRollResult === 1 ? 'bg-red-600' :
            encounterRollResult === 2 ? 'bg-orange-500' :
            'bg-green-600'
          }`}>
            <div className="text-lg mb-2 opacity-80">
              {context === 'dungeon'
                ? `🎲 Směna ${turn}`
                : `🌲 ${watch === 0 ? 'Ranní' : 'Večerní'} hlídka`
              }
            </div>
            <div className="text-6xl font-bold mb-2">
              {encounterRollResult}
            </div>
            <div className="text-4xl font-bold mb-4">
              {encounterRollResult === 1 ? '⚔️ SETKÁNÍ!' :
               encounterRollResult === 2 ? '👁️ OMEN' :
               '✓ NIC'}
            </div>
            <button
              onClick={() => setShowEncounterReminder(false)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// JOURNAL PANEL
// ============================================

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

const TimeBar = ({ gameTime, updateGameTime, partyName }) => {
  const [showEncounterReminder, setShowEncounterReminder] = useState(false);
  const [showExhaustionWarning, setShowExhaustionWarning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!gameTime) return null;

  const { day = 1, season = 'spring', watch = 0, turn = 0, restedToday = false } = gameTime;

  const currentSeason = TIMEBAR_SEASONS.find(s => s.id === season) || TIMEBAR_SEASONS[0];
  const currentWatch = TIMEBAR_WATCHES.find(w => w.id === watch) || TIMEBAR_WATCHES[0];

  // Přidat směnu
  const addTurn = () => {
    const newTurn = turn + 1;

    // Připomínka setkání každé 3 směny
    if (newTurn % 3 === 0 && newTurn > 0) {
      setShowEncounterReminder(true);
      setTimeout(() => setShowEncounterReminder(false), 3000);
    }

    // Pokud dosáhneme 36 směn, automaticky další hlídka
    if (newTurn >= 36) {
      nextWatch();
    } else {
      updateGameTime({ ...gameTime, turn: newTurn });
    }
  };

  // Další hlídka
  const nextWatch = () => {
    if (watch >= 3) {
      // Konec dne (watch 3 = noc, poslední hlídka)
      if (!restedToday) {
        setShowExhaustionWarning(true);
        setTimeout(() => setShowExhaustionWarning(false), 5000);
      }
      updateGameTime({
        ...gameTime,
        day: day + 1,
        watch: 0,
        turn: 0,
        restedToday: false
      });
    } else {
      updateGameTime({
        ...gameTime,
        watch: watch + 1,
        turn: 0
      });
    }
  };

  // Označit odpočinek
  const markRest = () => {
    updateGameTime({ ...gameTime, restedToday: true });
    nextWatch();
  };

  // Změna sezóny
  const cycleSeason = () => {
    const currentIndex = TIMEBAR_SEASONS.findIndex(s => s.id === season);
    const nextIndex = (currentIndex + 1) % TIMEBAR_SEASONS.length;
    updateGameTime({ ...gameTime, season: TIMEBAR_SEASONS[nextIndex].id });
  };

  // Ruční úprava dne
  const adjustDay = (delta) => {
    const newDay = Math.max(1, day + delta);
    updateGameTime({ ...gameTime, day: newDay });
  };

  // Progress bar pro směny (zvýrazněné třetiny)
  const renderTurnProgress = () => {
    const segments = [];
    for (let i = 0; i < 12; i++) {
      const segmentStart = i * 3;
      const filled = turn > segmentStart;
      const isThird = (i + 1) % 4 === 0; // každá 4. skupina = třetina hlídky
      segments.push(
        <div
          key={i}
          className={`h-2 flex-1 rounded-sm ${
            filled ? 'bg-amber-500' : 'bg-stone-300'
          } ${isThird ? 'mr-1' : 'mr-px'}`}
        />
      );
    }
    return segments;
  };

  return (
    <>
      {/* Hlavní TimeBar */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-800 text-stone-100 z-40 shadow-lg border-t border-stone-700">
        <div className="max-w-4xl mx-auto px-2 py-2">
          {/* Kompaktní layout pro mobil */}
          <div className="flex items-center gap-2 text-sm">
            {/* Den a sezóna */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1 px-2 py-1 bg-stone-700 rounded hover:bg-stone-600 transition-colors"
            >
              <span className="text-base">{currentSeason.icon}</span>
              <span className="font-medium">D{day}</span>
            </button>

            {/* Hlídky */}
            <div className="flex gap-1">
              {TIMEBAR_WATCHES.map((w) => (
                <div
                  key={w.id}
                  className={`w-7 h-7 flex items-center justify-center rounded text-base ${
                    w.id === watch
                      ? 'bg-amber-500 text-white'
                      : w.id < watch
                      ? 'bg-stone-600 text-stone-400'
                      : 'bg-stone-700 text-stone-500'
                  } ${restedToday && w.id < watch ? 'ring-1 ring-green-400' : ''}`}
                  title={w.name}
                >
                  {w.icon}
                </div>
              ))}
            </div>

            {/* Směny */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs text-stone-400 whitespace-nowrap">{turn}/36</span>
              <div className="flex-1 flex items-center gap-px">
                {renderTurnProgress()}
              </div>
            </div>

            {/* Tlačítka */}
            <div className="flex gap-1">
              <button
                onClick={addTurn}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-500 rounded text-xs font-medium transition-colors"
                title="Přidat směnu"
              >
                +1
              </button>
              <button
                onClick={markRest}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
                title="Odpočinek (celá hlídka)"
              >
                💤
              </button>
              <button
                onClick={nextWatch}
                className="px-2 py-1 bg-stone-600 hover:bg-stone-500 rounded text-xs transition-colors"
                title="Další hlídka"
              >
                →
              </button>
            </div>
          </div>

          {/* Rozšířené nastavení */}
          {showSettings && (
            <div className="mt-2 pt-2 border-t border-stone-700 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400">Den:</span>
              <button onClick={() => adjustDay(-1)} className="px-2 py-1 bg-stone-700 rounded hover:bg-stone-600">-</button>
              <span className="font-medium w-8 text-center">{day}</span>
              <button onClick={() => adjustDay(1)} className="px-2 py-1 bg-stone-700 rounded hover:bg-stone-600">+</button>

              <span className="text-stone-400 ml-2">Sezóna:</span>
              <button onClick={cycleSeason} className="px-2 py-1 bg-stone-700 rounded hover:bg-stone-600">
                {currentSeason.icon} {currentSeason.name}
              </button>

              {partyName && (
                <span className="ml-auto text-stone-500">🐭 {partyName}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Připomínka setkání */}
      {showEncounterReminder && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          🎲 Hoď na setkání! (každé 3 směny)
        </div>
      )}

      {/* Varování vyčerpání */}
      {showExhaustionWarning && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ⚠️ Žádný odpočinek! Stav: Vyčerpání
        </div>
      )}
    </>
  );
};

// ============================================
// FLOATING DICE - Plovoucí kostky s radiálním menu
// ============================================

const FloatingDice = ({ onLogEntry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGenerator, setActiveGenerator] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);

  // Generátory - vertikální seznam
  const generators = [
    { id: 'dice', icon: '🎲', label: 'Kostky', color: 'bg-amber-500' },
    { id: 'yesno', icon: '❓', label: 'Ano/Ne', color: 'bg-blue-500' },
    { id: 'action', icon: '💡', label: 'Akce', color: 'bg-purple-500' },
    { id: 'complication', icon: '⚡', label: 'Komplikace', color: 'bg-orange-500' },
    { id: 'consequence', icon: '💀', label: 'Důsledek', color: 'bg-red-500' },
    { id: 'card', icon: '🃏', label: 'Karta', color: 'bg-green-500' },
  ];

  // Roll funkce
  const quickRoll = (count, sides) => {
    const results = rollDice(count, sides);
    const total = results.reduce((a, b) => a + b, 0);
    setLastRoll({ type: 'dice', dice: results, total, sides, count });
  };

  const quickYesNo = (probability = 'even') => {
    const { dice, total } = roll2D6();
    const result = ORACLE_TABLE[probability][total];
    setLastRoll({ type: 'yesno', dice, total, result, probability });
  };

  const rollActionTheme = () => {
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);
    setLastRoll({ type: 'action', action, theme, result: `${action} + ${theme}` });
  };

  const rollComplication = () => {
    const die = rollD6();
    const result = SCENE_COMPLICATIONS[die - 1];
    setLastRoll({ type: 'complication', dice: [die], result });
  };

  const rollConsequence = () => {
    const die = rollD6();
    const result = FAILURE_CONSEQUENCES[die - 1];
    setLastRoll({ type: 'consequence', dice: [die], result });
  };

  const drawCard = () => {
    const suit = randomFrom(CARD_SUITS);
    const value = randomFrom(CARD_VALUES);
    setLastRoll({
      type: 'card',
      suit,
      value,
      meaning: CARD_VALUE_MEANINGS[value],
      result: `${value}${suit.symbol}`
    });
  };

  const handleGeneratorClick = (genId) => {
    if (activeGenerator === genId) {
      setActiveGenerator(null);
    } else {
      setActiveGenerator(genId);
      setLastRoll(null);
    }
  };

  const closeAll = () => {
    setIsOpen(false);
    setActiveGenerator(null);
    setLastRoll(null);
  };

  // Zapsat hod do deníku
  const logRollToJournal = () => {
    if (!lastRoll || !onLogEntry) return;

    let title = '';
    let content = '';

    switch (lastRoll.type) {
      case 'dice':
        title = `Hod kostkou: ${lastRoll.count}d${lastRoll.sides}`;
        content = `Výsledek: **${lastRoll.total}** [${lastRoll.dice.join(', ')}]`;
        break;
      case 'yesno': {
        const probLabel = { unlikely: 'Sotva', even: '50/50', likely: 'Asi ano' }[lastRoll.probability];
        title = `Orákulum (${probLabel})`;
        content = `**${lastRoll.result}** [${lastRoll.dice.join(', ')}] = ${lastRoll.total}`;
        break;
      }
      case 'action':
        title = 'Akce + Téma';
        content = `**${lastRoll.action}** + **${lastRoll.theme}**`;
        break;
      case 'complication':
        title = 'Komplikace';
        content = `**${lastRoll.result}**`;
        break;
      case 'consequence':
        title = 'Důsledek neúspěchu';
        content = `**${lastRoll.result}**`;
        break;
      case 'card':
        title = `Karta: ${lastRoll.value}${lastRoll.suit.symbol}`;
        content = `${lastRoll.suit.domain} - ${lastRoll.meaning}`;
        break;
    }

    onLogEntry({ title, content });
    setLastRoll(null); // Vymazat po zapsání
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col-reverse items-end gap-2">
      {/* Hlavní plovoucí tlačítko */}
      <button
        onClick={() => {
          if (isOpen) {
            closeAll();
          } else {
            setIsOpen(true);
          }
        }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-amber-600 text-white'
            : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-110'
        }`}
        title="Rychlé generátory"
      >
        {isOpen ? '✕' : '🎲'}
      </button>

      {/* Vertikální menu generátorů */}
      {isOpen && (
        <div className="flex flex-col gap-2 items-end">
          {generators.map((gen) => (
            <button
              key={gen.id}
              onClick={() => handleGeneratorClick(gen.id)}
              className={`h-10 px-3 rounded-full shadow-lg flex items-center gap-2 text-sm transition-all duration-200 ${
                activeGenerator === gen.id
                  ? `${gen.color} text-white`
                  : 'bg-white hover:bg-stone-50 border border-stone-200'
              }`}
              title={gen.label}
            >
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

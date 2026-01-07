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


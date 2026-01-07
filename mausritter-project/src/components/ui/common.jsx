
const formatTimestamp = () => new Date().toLocaleString('cs-CZ');

// --- COMPONENTS ---

// Dice Display Component
const DiceDisplay = ({ dice, size = 'normal' }) => {
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

// Result Badge Component  
const ResultBadge = ({ result, variant = 'default' }) => {
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

// Section Header Component
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="mb-6 border-b-2 border-amber-900/30 pb-4">
    <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-3">
      <span className="text-3xl">{icon}</span>
      {title}
    </h2>
    {subtitle && <p className="text-stone-600 mt-1 ml-11">{subtitle}</p>}
  </div>
);

// Card Component for results
const ResultCard = ({ title, children, className = '' }) => (
  <div className={`bg-amber-50/80 border-2 border-amber-900/20 rounded-xl p-5 shadow-lg ${className}`}>
    {title && <h3 className="font-bold text-amber-900 mb-3 text-lg border-b border-amber-900/20 pb-2">{title}</h3>}
    {children}
  </div>
);

// Button Component
const Button = ({ onClick, children, variant = 'primary', size = 'normal', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-amber-800 hover:bg-amber-900 text-amber-50 border-amber-950',
    secondary: 'bg-stone-600 hover:bg-stone-700 text-stone-50 border-stone-800',
    danger: 'bg-red-800 hover:bg-red-900 text-red-50 border-red-950',
    success: 'bg-green-700 hover:bg-green-800 text-green-50 border-green-900',
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


// Tooltip Component - shows help on hover/click
const Tooltip = ({ children }) => {
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
          className="absolute left-0 top-full mt-2 z-50 w-72 bg-stone-800 text-stone-100 text-sm rounded-lg shadow-xl border border-stone-600"
          style={{ maxHeight: '24rem', overflow: 'hidden' }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {/* Scrollable content - scrollbar pushed outside visible area */}
          <div 
            className="p-3 overflow-y-scroll"
            style={{ 
              maxHeight: '24rem',
              marginRight: '-20px',
              paddingRight: '20px'
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Help Section Header with tooltip
const HelpHeader = ({ title, tooltip, icon }) => (
  <div className="flex items-center gap-2 mb-2">
    {icon && <span>{icon}</span>}
    <span className="font-bold text-amber-900">{title}</span>
    {tooltip && <Tooltip>{tooltip}</Tooltip>}
  </div>
);

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


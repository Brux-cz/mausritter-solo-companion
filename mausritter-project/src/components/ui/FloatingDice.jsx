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

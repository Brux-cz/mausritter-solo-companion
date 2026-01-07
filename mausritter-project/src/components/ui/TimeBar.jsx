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


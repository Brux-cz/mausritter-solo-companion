import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { WEATHER_TABLE } from '../../data/constants';
import { rollD6, formatTimestamp } from '../../utils/helpers';
import { SectionHeader, ResultCard, Button, Input, Select } from '../ui/common';

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

// Efekty počasí podle pravidel Mausritter CZ
// Nepříznivé podmínky (danger: true) = při cestování STR save nebo stav Vyčerpání
export const WEATHER_EFFECTS = {
  // === JARO ===
  'Přívalové deště': { icon: '🌧️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání při cestování.' },
  'Mrholení': { icon: '🌦️', danger: false, travelMod: 1, effect: null },
  // === LÉTO ===
  'Bouřka': { icon: '⛈️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání při cestování.' },
  'Úmorné vedro': { icon: '🥵', danger: true, travelMod: 1, effect: 'STR save nebo Vyčerpání při cestování.' },
  'Jasno a teplo': { icon: '☀️', danger: false, travelMod: 1, effect: null },
  'Příjemně slunečno': { icon: '🌤️', danger: false, travelMod: 1, effect: null },
  'Krásně teplo': { icon: '😊', danger: false, travelMod: 1, effect: null },
  // === PODZIM ===
  'Silný vítr': { icon: '🌪️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání při cestování.' },
  'Slejvák': { icon: '🌧️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání při cestování.' },
  'Chladno': { icon: '🍃', danger: false, travelMod: 1, effect: null },
  'Přeháňky': { icon: '🌦️', danger: false, travelMod: 1, effect: null },
  'Jasno a chladno': { icon: '✨', danger: false, travelMod: 1, effect: null },
  // === ZIMA ===
  'Vánice': { icon: '🌨️', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání při cestování.' },
  'Mrznoucí déšť': { icon: '🧊', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání při cestování.' },
  'Třeskutá zima': { icon: '🥶', danger: true, travelMod: 2, effect: 'STR save nebo Vyčerpání při cestování.' },
  // === SDÍLENÉ (více sezón) ===
  'Zataženo': { icon: '☁️', danger: false, travelMod: 1, effect: null },
  'Jasno a slunečno': { icon: '☀️', danger: false, travelMod: 1, effect: null }
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

const TimePanel = () => {
  const { activePartyId, getActiveParty, updateParty: storeUpdateParty, handleLogEntry } = useGameStore();
  const party = getActiveParty();
  const onLogEntry = handleLogEntry;
  const updateParty = (updates) => activePartyId && storeUpdateParty(activePartyId, updates);
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
  const [weatherNotification, setWeatherNotification] = React.useState(null); // Notifikace o změně počasí

  // Funkce pro hod na období (k4) + počasí (2k6) - na začátku hry
  const rollSeasonAndWeather = () => {
    // Hod k4 na období
    const seasonRoll = Math.floor(Math.random() * 4) + 1;
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    const seasonNames = ['Jaro', 'Léto', 'Podzim', 'Zima'];
    const seasonIcons = ['🌸', '☀️', '🍂', '❄️'];
    const newSeason = seasons[seasonRoll - 1];

    // Hod 2k6 na počasí podle nového období
    const newWeather = generateWeather(newSeason);

    setGameTime({ ...gameTime, season: newSeason, weather: newWeather });
    setWeatherNotification({
      weather: newWeather,
      day: day,
      isInitial: true,
      seasonRoll: seasonRoll,
      seasonName: seasonNames[seasonRoll - 1],
      seasonIcon: seasonIcons[seasonRoll - 1]
    });

    // Jeden záznam pro období + počasí
    onLogEntry({
      type: 'season_weather',
      timestamp: formatTimestamp(),
      data: {
        seasonRoll,
        seasonName: seasonNames[seasonRoll - 1],
        seasonIcon: seasonIcons[seasonRoll - 1],
        seasonId: newSeason,
        weather: newWeather
      }
    });
  };

  // Funkce pro ruční vygenerování počasí (při novém dni)
  const rollWeatherManually = () => {
    const newWeather = generateWeather(season);
    setGameTime({ ...gameTime, weather: newWeather });
    setWeatherNotification({ weather: newWeather, day: day, isInitial: true });
    onLogEntry({
      type: 'weather',
      timestamp: formatTimestamp(),
      message: `${newWeather.icon} Počasí dne ${day}: ${newWeather.type} (${newWeather.dice[0]}+${newWeather.dice[1]}=${newWeather.roll})`,
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
      // Zobrazit notifikaci o novém počasí
      setWeatherNotification({ weather: newWeather, day: newDay, isInitial: false });
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
            {context === 'wilderness' && weather && (
              <div
                onClick={rerollWeather}
                className="cursor-pointer hover:scale-105 transition-transform"
                title="Klikni pro přehození počasí"
              >
                <div className="text-4xl mb-1">{weather.icon}</div>
                <div className="text-sm text-stone-600">{weather.type}</div>
                <div className="text-xs text-stone-400">({weather.roll})</div>
              </div>
            )}
          </div>

          {/* Upozornění - počasí není nastavené */}
          {context === 'wilderness' && !weather && (
            <div className="bg-amber-100 border-2 border-amber-400 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎲❓</div>
              <p className="text-amber-800 font-medium mb-3">Počasí pro dnešek není nastavené</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={rollSeasonAndWeather}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-3 rounded-lg transition-colors"
                >
                  🎲 Hodit na období (k4) + počasí (2k6)
                </button>
                <button
                  onClick={rollWeatherManually}
                  className="bg-stone-400 hover:bg-stone-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Jen počasí (už mám období)
                </button>
              </div>
            </div>
          )}

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

      {/* Notifikace o změně počasí - musí se odkliknout */}
      {weatherNotification && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className={`px-8 py-6 rounded-xl shadow-2xl text-center max-w-sm ${
            weatherNotification.weather.danger
              ? 'bg-gradient-to-b from-red-600 to-red-800 text-white'
              : 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900'
          }`}>
            {/* Pokud se hodilo i na období */}
            {weatherNotification.seasonRoll && (
              <div className="mb-4 pb-4 border-b border-current/20">
                <div className="text-lg mb-1 opacity-80">🎲 Období (k4 = {weatherNotification.seasonRoll})</div>
                <div className="text-5xl mb-1">{weatherNotification.seasonIcon}</div>
                <div className="text-2xl font-bold">{weatherNotification.seasonName}</div>
              </div>
            )}
            <div className="text-lg mb-2 opacity-80">
              {weatherNotification.seasonRoll ? '🎲 Počasí (2k6)' : weatherNotification.isInitial ? '🌅 Počasí dne' : `🌅 Nový den ${weatherNotification.day}`}
            </div>
            <div className="text-6xl mb-3">
              {weatherNotification.weather.icon}
            </div>
            <div className="text-3xl font-bold mb-2">
              {weatherNotification.weather.type}
            </div>
            <div className="text-sm mb-1 opacity-80">
              🎲 {weatherNotification.weather.dice[0]} + {weatherNotification.weather.dice[1]} = {weatherNotification.weather.roll}
            </div>
            {weatherNotification.weather.danger && weatherNotification.weather.effect && (
              <div className="bg-white/20 rounded-lg p-3 my-3 text-sm">
                ⚠️ <strong>Nepříznivé podmínky:</strong><br/>
                {weatherNotification.weather.effect}
              </div>
            )}
            <button
              onClick={() => setWeatherNotification(null)}
              className={`font-bold px-6 py-2 rounded-lg transition-colors mt-2 ${
                weatherNotification.weather.danger
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              ✓ Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export { TimePanel };

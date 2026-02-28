// ============================================
// DATA CONSTANTS
// Extracted from monolith for modular imports
// ============================================

import type { SceneState } from '../types';

export const GOOGLE_CLIENT_ID = '948855876248-acfbvk4k4ud5fmciocfk5o8qldfcdi29.apps.googleusercontent.com';
export const GOOGLE_API_KEY = 'AIzaSyDorqiiGhrfkdg_fO6dqjjHsnpeioNSL-s';
export const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/drive.file';

// --- FIREBASE MULTIPLAYER CONFIG ---
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxk-SZtGHH4-TvKN9lhcS7pyqr93uGmGQ",
  authDomain: "mausritter-solo-companio-e766c.firebaseapp.com",
  databaseURL: "https://mausritter-solo-companio-e766c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mausritter-solo-companio-e766c",
  storageBucket: "mausritter-solo-companio-e766c.firebasestorage.app",
  messagingSenderId: "120737105348",
  appId: "1:120737105348:web:5c57b811d446d19020d091"
};

// --- DATA CONSTANTS ---

export const ORACLE_TABLE = {
  unlikely: { 2: 'No', 3: 'No', 4: 'No, but...', 5: 'No, but...', 6: 'No, but...', 7: 'Yes', 8: 'Yes', 9: 'Yes', 10: 'Yes, and...', 11: 'Yes, and...', 12: 'Yes, and...' },
  even: { 2: 'No', 3: 'No', 4: 'No', 5: 'No, but...', 6: 'Yes', 7: 'Yes', 8: 'Yes', 9: 'Yes, and...', 10: 'Yes, and...', 11: 'Yes, and...', 12: 'Yes, and...' },
  likely: { 2: 'No, but...', 3: 'No, but...', 4: 'Yes', 5: 'Yes', 6: 'Yes', 7: 'Yes', 8: 'Yes', 9: 'Yes, and...', 10: 'Yes, and...', 11: 'Yes, and...', 12: 'Yes, and...' }
};

export const SCENE_COMPLICATIONS = [
  'Nepřátelské síly se staví do cesty',
  'Překážka blokuje postup',
  '"Nebylo by otravné, kdyby..." (vymysli komplikaci)',
  'NPC náhle jedná (hoď na Adventure Seeds)',
  'Objeví se nečekaná příležitost',
  'Věci jdou podle plánu (žádná komplikace)'
];

export const FAILURE_CONSEQUENCES = [
  'Způsob poškození',
  'Dej někoho do úzkých',
  'Nabídni těžkou volbu',
  'Použij nepřítelův tah',
  'Odhal nepříjemnou pravdu',
  'Odděl skupinu'
];

// --- SCENE MANAGEMENT (Mythic GME style) ---

export const DEFAULT_SCENE_STATE: SceneState = {
  chaosFactor: 5,
  currentScene: null,
  sceneHistory: [],
  threads: [],
  sceneNPCs: [],
  sceneCount: 0
};

export const SCENE_ALTERATION_TABLE = [
  'Pozměněné prostředí — místo vypadá jinak, než jsi čekal',
  'Pozměněný cíl — důvod proč jsi tu, se změnil',
  'Pozměněné NPC — někdo tu chybí nebo tu je někdo navíc',
  'Pozměněná akce — něco se tu děje, co jsi nečekal',
  'Pozměněný čas — přišel jsi moc brzy nebo pozdě',
  'Pozměněná nálada — atmosféra je jiná, než jsi předpokládal'
];

export const INTERRUPTED_SCENE_FOCUS = [
  'Nový NPC se zapojí do příběhu',
  'Nová zápletková linka se objeví',
  'Stávající zápletka eskaluje',
  'Stávající NPC udělá něco nečekaného',
  'Hráčská postava je konfrontována s minulostí',
  'Vnější síla zasáhne do situace'
];

export const SCENE_TYPE_LABELS: Record<string, string> = {
  combat: 'Souboj',
  exploration: 'Průzkum',
  social: 'Sociální',
  rest: 'Odpočinek',
  other: 'Jiné'
};

export const ACTION_ORACLE = [
  'Opustit', 'Získat', 'Postoupit', 'Ovlivnit', 'Pomoci', 'Přijít', 'Útočit', 'Pomstít', 'Začít', 'Zradit',
  'Blokovat', 'Posílit', 'Prolomit', 'Zlomit', 'Zajmout', 'Vyzvat', 'Změnit', 'Zaútočit', 'Střetnout se', 'Velet',
  'Komunikovat', 'Soutěžit', 'Ukrýt', 'Konfrontovat', 'Spojit', 'Ovládnout', 'Zkazit', 'Vytvořit', 'Oklamat', 'Bránit',
  'Odrazit', 'Zdržet', 'Doručit', 'Požadovat', 'Odejít', 'Zničit', 'Objevit', 'Zpochybnit', 'Rozptýlit', 'Rozdělit',
  'Upustit', 'Eskalovat', 'Uniknout', 'Vyhnout se', 'Prozkoumat', 'Vyčerpat', 'Prozkoumávat', 'Odhalit', 'Padnout', 'Najít',
  'Dokončit', 'Soustředit', 'Následovat', 'Opevnit', 'Shromáždit', 'Hlídat', 'Vést', 'Ublížit', 'Léčit', 'Schovat se',
  'Držet', 'Lovit', 'Zapůsobit', 'Infiltrovat', 'Informovat', 'Zahájit', 'Kontrolovat', 'Vyšetřovat', 'Cestovat', 'Učit se',
  'Opustit', 'Lokalizovat', 'Ztratit', 'Vyrobit', 'Manipulovat', 'Pohybovat', 'Otevřít', 'Postavit se', 'Přemoci', 'Vytrvat',
  'Zachovat', 'Chránit', 'Pronásledovat', 'Přepadnout', 'Snížit', 'Odmítnout', 'Zavrhnout', 'Osvobodit', 'Odstranit', 'Odolat',
  'Obnovit', 'Prozradit', 'Riskovat', 'Plánovat', 'Hledat', 'Zabezpečit', 'Pátrat', 'Sloužit', 'Sdílet', 'Zesílit'
];

export const THEME_ORACLE = [
  'Schopnost', 'Výhoda', 'Spojenec', 'Rovnováha', 'Překážka', 'Bitva', 'Bestie', 'Krev', 'Pouto', 'Břemeno',
  'Obchod', 'Komunita', 'Zkáza', 'Odvaha', 'Tvorba', 'Nebezpečí', 'Smrt', 'Dluh', 'Úpadek', 'Podvod',
  'Obrana', 'Osud', 'Objev', 'Nemoc', 'Sen', 'Povinnost', 'Nepřítel', 'Útěk', 'Frakce', 'Sláva',
  'Rodina', 'Strach', 'Přátelství', 'Štěstí', 'Svoboda', 'Chamtivost', 'Vina', 'Zdraví', 'Historie', 'Domov',
  'Čest', 'Naděje', 'Nápad', 'Nevinnost', 'Instinkt', 'Cesta', 'Radost', 'Spravedlnost', 'Znalost', 'Práce',
  'Jazyk', 'Zákon', 'Vůdcovství', 'Odkaz', 'Život', 'Láska', 'Věrnost', 'Magie', 'Vzpomínka', 'Posel',
  'Neštěstí', 'Záhada', 'Příroda', 'Příležitost', 'Řád', 'Stezka', 'Mír', 'Riziko', 'Portál', 'Majetek',
  'Moc', 'Pýcha', 'Cena', 'Slib', 'Ochrana', 'Výprava', 'Zuřivost', 'Realita', 'Útočiště', 'Víra',
  'Pověst', 'Zdroj', 'Pomsta', 'Rival', 'Zvěst', 'Bezpečí', 'Tajemství', 'Duch', 'Cizinec', 'Pověra',
  'Zásoby', 'Přežití', 'Technologie', 'Čas', 'Směna', 'Smlouva', 'Pravda', 'Vendeta', 'Přísaha', 'Varování'
];

export const CARD_SUITS = [
  { symbol: '♥', name: 'Srdce', domain: 'Sociální/Emocionální', keywords: 'Vztahy, city, spojení, podvod' },
  { symbol: '♦', name: 'Káry', domain: 'Materiální/Praktické', keywords: 'Bohatství, obchod, technologie, plány' },
  { symbol: '♣', name: 'Kříže', domain: 'Fyzické/Akční', keywords: 'Síla, boj, pohyb, tělesné' },
  { symbol: '♠', name: 'Piky', domain: 'Mystické/Mentální', keywords: 'Magie, tajemství, znalosti, duchovní' }
];

export const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const CARD_VALUE_MEANINGS = {
  'A': 'Podstata, čistá forma',
  '2': 'Malé, osobní', '3': 'Malé, aktuální',
  '4': 'Střední', '5': 'Střední, skupinové', '6': 'Střední',
  '7': 'Velké', '8': 'Velké, komunitní', '9': 'Velké',
  '10': 'Specializované, expertní',
  'J': 'Osoba, agent změny',
  'Q': 'Autorita, instituce',
  'K': 'Moc, vláda, vrchol'
};

export const HIT_TABLE = {
  2: { result: 'KRITICKÝ MINUTÍ', effect: 'Ztráta příštího tahu', damageType: 'none' },
  3: { result: 'Slabý zásah', effect: 'Poškození s NEVÝHODOU', damageType: 'disadvantage' },
  4: { result: 'Slabý zásah', effect: 'Poškození s NEVÝHODOU', damageType: 'disadvantage' },
  5: { result: 'Zásah', effect: 'Normální poškození', damageType: 'normal' },
  6: { result: 'Zásah', effect: 'Normální poškození', damageType: 'normal' },
  7: { result: 'Zásah', effect: 'Normální poškození', damageType: 'normal' },
  8: { result: 'Zásah', effect: 'Normální poškození', damageType: 'normal' },
  9: { result: 'Silný zásah', effect: 'Poškození s VÝHODOU', damageType: 'advantage' },
  10: { result: 'Silný zásah', effect: 'Poškození s VÝHODOU', damageType: 'advantage' },
  11: { result: 'Silný zásah +1', effect: 'Poškození s VÝHODOU +1', damageType: 'advantage+1' },
  12: { result: 'DRTIVÝ ÚDER', effect: 'Maximum poškození', damageType: 'max' }
};

// Tabulka počasí podle pravidel Mausritter CZ (2k6)
// Tučné položky = nepříznivé podmínky (STR save nebo Vyčerpání při cestování)
export const WEATHER_TABLE = {
  // Jaro: 2=Přívalové deště*, 3-5=Mrholení, 6-8=Zataženo, 9-11=Jasno a slunečno, 12=Jasno a teplo
  spring: { 2: 'Přívalové deště', 3: 'Mrholení', 4: 'Mrholení', 5: 'Mrholení', 6: 'Zataženo', 7: 'Zataženo', 8: 'Zataženo', 9: 'Jasno a slunečno', 10: 'Jasno a slunečno', 11: 'Jasno a slunečno', 12: 'Jasno a teplo' },
  // Léto: 2=Bouřka*, 3-5=Úmorné vedro*, 6-8=Jasno a teplo, 9-11=Příjemně slunečno, 12=Krásně teplo
  summer: { 2: 'Bouřka', 3: 'Úmorné vedro', 4: 'Úmorné vedro', 5: 'Úmorné vedro', 6: 'Jasno a teplo', 7: 'Jasno a teplo', 8: 'Jasno a teplo', 9: 'Příjemně slunečno', 10: 'Příjemně slunečno', 11: 'Příjemně slunečno', 12: 'Krásně teplo' },
  // Podzim: 2=Silný vítr*, 3-5=Slejvák*, 6-8=Chladno, 9-11=Přeháňky, 12=Jasno a chladno
  autumn: { 2: 'Silný vítr', 3: 'Slejvák', 4: 'Slejvák', 5: 'Slejvák', 6: 'Chladno', 7: 'Chladno', 8: 'Chladno', 9: 'Přeháňky', 10: 'Přeháňky', 11: 'Přeháňky', 12: 'Jasno a chladno' },
  // Zima: 2=Vánice*, 3-5=Mrznoucí déšť*, 6-8=Třeskutá zima*, 9-11=Zataženo, 12=Jasno a chladno
  winter: { 2: 'Vánice', 3: 'Mrznoucí déšť', 4: 'Mrznoucí déšť', 5: 'Mrznoucí déšť', 6: 'Třeskutá zima', 7: 'Třeskutá zima', 8: 'Třeskutá zima', 9: 'Zataženo', 10: 'Zataženo', 11: 'Zataženo', 12: 'Jasno a chladno' }
};

// ============================================
// LEXIKON CATEGORIES
// Kategorie pro světostavbu (Lore)
// ============================================

export const LEXICON_CATEGORIES = [
  { id: 'lokace', label: 'Lokace', icon: '📍', description: 'Místa, oblasti, budovy' },
  { id: 'npc', label: 'NPC', icon: '🐭', description: 'Postavy které potkáš' },
  { id: 'stvoreni', label: 'Stvoření', icon: '🐾', description: 'Monstra, zvířata, bytosti' },
  { id: 'predmet', label: 'Předměty', icon: '🎒', description: 'Artefakty, vybavení, poklady' },
  { id: 'frakce', label: 'Frakce', icon: '⚔️', description: 'Skupiny, organizace, klany' },
  { id: 'pravidlo', label: 'Pravidla světa', icon: '📜', description: 'Fakta o fungování světa' },
  { id: 'udalost', label: 'Události', icon: '⭐', description: 'Historické události, svátky' },
];

// ============================================
// ENCOUNTER GENERATOR TABLES
// Pro ~5,000,000+ unikátních kombinací
// ============================================

// Kdo/Co potkáš (40 možností)
export const ENCOUNTER_CREATURES = [
  // Myši a přátelé
  { name: 'stará myš poustevnice', type: 'npc', danger: false },
  { name: 'mladý myší kupec', type: 'npc', danger: false },
  { name: 'unavený myší poutník', type: 'npc', danger: false },
  { name: 'myší lovec s lukem', type: 'npc', danger: false },
  { name: 'myší stráž z blízké osady', type: 'npc', danger: false },
  { name: 'myší bylinkářka', type: 'npc', danger: false },
  { name: 'myší kovář hledající materiál', type: 'npc', danger: false },
  { name: 'myší bard s malou loutnou', type: 'npc', danger: false },
  { name: 'myší zloděj ve stínech', type: 'npc', danger: true },
  { name: 'skupinka myších dětí', type: 'npc', danger: false },
  { name: 'myší kurýr s naléhavou zprávou', type: 'npc', danger: false },
  { name: 'starý myší veterán', type: 'npc', danger: false },
  { name: 'myší alchymista', type: 'npc', danger: false },
  { name: 'myší šlechtic na cestách', type: 'npc', danger: false },
  { name: 'band myších lupičů', type: 'npc', danger: true },

  // Malí tvorové
  { name: 'rejsek pozorovatel', type: 'creature', danger: false },
  { name: 'přátelská žába', type: 'creature', danger: false },
  { name: 'čmelák sbírající pyl', type: 'creature', danger: false },
  { name: 'hlemýžď nesoucí svůj dům', type: 'creature', danger: false },
  { name: 'cvrček muzikant', type: 'creature', danger: false },
  { name: 'moucha špehující', type: 'creature', danger: false },
  { name: 'mravenčí hlídka', type: 'creature', danger: true },
  { name: 'vosa hledající potravu', type: 'creature', danger: true },
  { name: 'kudlanka číhající', type: 'creature', danger: true },
  { name: 'motýl s potrhanými křídly', type: 'creature', danger: false },
  { name: 'chroust bzučící', type: 'creature', danger: false },
  { name: 'stonožka plazící se', type: 'creature', danger: true },
  { name: 'pavouk ve své síti', type: 'creature', danger: true },
  { name: 'světluška blikající', type: 'creature', danger: false },

  // Nebezpeční predátoři
  { name: 'lasička lovící', type: 'predator', danger: true },
  { name: 'had sunící se', type: 'predator', danger: true },
  { name: 'sova tiše letící', type: 'predator', danger: true },
  { name: 'jestřáb kroužící', type: 'predator', danger: true },
  { name: 'liška čenichající', type: 'predator', danger: true },
  { name: 'toulavá kočka', type: 'predator', danger: true },
  { name: 'tchoř ve stínech', type: 'predator', danger: true },
  { name: 'vrána krákorající', type: 'predator', danger: true },

  // Nadpřirozené
  { name: 'bludička tančící', type: 'supernatural', danger: true },
  { name: 'duch mrtvé myši', type: 'supernatural', danger: false },
  { name: 'lesní skřítek', type: 'supernatural', danger: false }
];

// Co dělá / v jakém je stavu (35 možností)
export const ENCOUNTER_ACTIVITIES = [
  'hledá něco v listí',
  'odpočívá ve stínu',
  'jí nalezené jídlo',
  'pozorně naslouchá',
  'utíká před něčím',
  'číhá v úkrytu',
  'nese těžký náklad',
  'zpívá si pro sebe',
  'hádá se s někým',
  'pláče tiše',
  'sbírá zásoby na zimu',
  'hledí do dálky',
  'čistí si srst',
  'staví si úkryt',
  'označuje teritorium',
  'volá na své druhy',
  'kope díru do země',
  'šplhá po stonku',
  'pije z kapky rosy',
  'třese se zimou',
  'schovává něco cenného',
  'čeká na někoho',
  'bloudí ztracený/á',
  'sleduje tvé kroky',
  'předstírá smrt',
  'tančí podivný tanec',
  'šeptá zaklínadlo',
  'váhá na rozcestí',
  'ošetřuje si zranění',
  'brousí si zuby',
  'staví past',
  'zdobí se květinami',
  'počítá své poklady',
  'kreslí do hlíny',
  'medituje v tichu'
];

// Kde přesně (30 možností)
export const ENCOUNTER_LOCATIONS = [
  'pod obřím listem lopuchu',
  'u kořenů starého dubu',
  'na okraji lidské pěšiny',
  'v trhlině rozbitého hrnce',
  'mezi kameny potoka',
  'na větvi spadlého stromu',
  'u vchodu do opuštěné nory',
  'pod záhybem staré látky',
  'v dutině pařezu',
  'na okraji muchomůrkového kruhu',
  'vedle rezavého hřebíku',
  'pod stříškou houby',
  'v trávě vysoké jako les',
  'na břehu malé kaluže',
  'u zbytků lidského pikniku',
  'v prasklině kamenné zdi',
  'mezi kořeny ostružiní',
  'pod spadaným listím',
  'na slunném místě u skály',
  'v opuštěném ptačím hnízdě',
  'u kapající vody z listu',
  'mezi plevelem zahrady',
  'pod kůrou mrtvého stromu',
  've stínu lebky drobného zvířete',
  'u starého myšího ukazatele',
  'v houští černého bezu',
  'na prahu staré liščí nory',
  'u ztracené lidské mince',
  'mezi hromadou žaludů',
  'pod obloukem bramborové natě'
];

// Nálada / atmosféra (25 možností)
export const ENCOUNTER_MOODS = [
  'Vzduch voní po dešti.',
  'Padá jemná mlha.',
  'Slunce právě zapadá.',
  'V dálce hřmí bouřka.',
  'Listí šustí ve větru.',
  'Je nepříjemné ticho.',
  'Slyšíš vzdálené zpěvavé ptáky.',
  'Světlo prosvítá mezi listy.',
  'Cítíš pach kouře.',
  'Země je mokrá po dešti.',
  'Fouká ledový vítr.',
  'Bzučí roj much poblíž.',
  'V trávě cvrlikají cvrčci.',
  'Vidíš blesk na obzoru.',
  'Je zvláštní klid před bouří.',
  'Voní tu silně květiny.',
  'Cítíš pach predátora.',
  'Slyšíš kroky něčeho velkého.',
  'Měsíc vychází nad obzor.',
  'První hvězdy se objevují.',
  'Rosa se třpytí všude kolem.',
  'Pavučiny se lesknou v ranním světle.',
  'Někde v dálce štěká pes.',
  'Cítíš blížící se změnu počasí.',
  'Je tu divná nadpřirozená aura.'
];

// Zajímavý detail / twist (40 možností)
export const ENCOUNTER_DETAILS = [
  'U sebe má podivný amulet.',
  'Je zjevně zraněný/á.',
  'Za sebou zanechává krvavou stopu.',
  'Mluví sám/sama se sebou.',
  'Má jedovatě zelené oči.',
  'Nese zprávu v malé tašce.',
  'Schovává pod pláštěm zbraň.',
  'Je pokrytý/á podivným pylem.',
  'Má starou jizvu přes oko.',
  'Třese se strachem.',
  'Je zjevně nemocný/á.',
  'Má u sebe mapu.',
  'Je svázaný/á provazem.',
  'Nese klíč od neznámého zámku.',
  'Zanechává za sebou magickou záři.',
  'Je němý/á - jen ukazuje.',
  'Má tetování podivných symbolů.',
  'Je slepý/á, ale všechno slyší.',
  'Za ním/ní letí světluška.',
  'Má u sebe vzácný krystal.',
  'Voní po lektvarech.',
  'Je očividně v přestrojení.',
  'Neustále se ohlíží za sebe.',
  'Má čerstvou krev na tlapkách.',
  'Nese mrtvého hmyz.',
  'Je starší, než vypadá.',
  'Jeho/její stín se hýbe divně.',
  'U sebe má lidskou tretku.',
  'Kulhá na zadní nohu.',
  'Má zlomený vous.',
  'Šeptá jméno někoho mrtvého.',
  'Je pokrytý/á blátem z bažiny.',
  'U sebe má jedovatou rostlinu.',
  'Nese varování pro osadu.',
  'Je pod vlivem kouzla.',
  'Schovává vejce vzácného tvora.',
  'Má spálený kus srsti.',
  'Zjevně něco hledá.',
  'Nese dar pro někoho důležitého.',
  'Je poslední ze své skupiny.'
];

// Motivace / co chtějí (30 možností)
export const ENCOUNTER_MOTIVATIONS = [
  'Hledá pomoc pro zraněného přítele.',
  'Utíká před nebezpečím z východu.',
  'Chce vyměnit informace za jídlo.',
  'Pátrá po ztraceném příbuzném.',
  'Nese důležitou zprávu.',
  'Hledá konkrétní rostlinu.',
  'Chce varovat před blížícím se nebezpečím.',
  'Sbírá dluh od někoho v osadě.',
  'Je na tajné misi.',
  'Hledá bezpečné místo k přenocování.',
  'Chce prodat vzácné zboží.',
  'Pátrá po starém příteli.',
  'Hledá cestu domů.',
  'Chce se pomstít za křivdu.',
  'Je na útěku před zákonem.',
  'Hledá místo z proroctví.',
  'Chce získat spojenec pro boj.',
  'Sbírá součástky pro vynález.',
  'Hledá léčivou bylinu.',
  'Chce předat prokletý předmět.',
  'Pátrá po starověkém pokladu.',
  'Je pověřen ochranou něčeho.',
  'Hledá svědka zločinu.',
  'Chce založit novou osadu.',
  'Sbírá příběhy pro kroniku.',
  'Hledá odpovědi na záhadu.',
  'Je na pouti ke svatému místu.',
  'Chce uniknout své minulosti.',
  'Hledá učedníka pro své řemeslo.',
  'Nese oběť pro lesního ducha.'
];

// Komplikace (25 možností)
export const ENCOUNTER_COMPLICATIONS = [
  'Ale něco se blíží - slyšíš to.',
  'Je to past - nejsi tu sám.',
  'Začíná pršet.',
  'Objevuje se třetí strana.',
  'Tvor je pod vlivem magie.',
  'Situace je jiná, než vypadá.',
  'Čas běží - něco se blíží.',
  'Je tu skrytý pozorovatel.',
  'Země se zachvěla.',
  'Ve vzduchu je pach nebezpečí.',
  'Právě ses dostal do teritoria.',
  'Někdo vás sledoval.',
  'Objevil ses v nevhodný čas.',
  'Cesta zpět je zablokovaná.',
  'Je tu více nepřátel, než jsi čekal.',
  'Padá tma rychleji než obvykle.',
  'Slyšíš volání o pomoc odjinud.',
  'Tvůj úkryt je prozrazen.',
  'Máš jen chvíli na rozhodnutí.',
  'Vzpomínáš si - tohle místo znáš.',
  'Cítíš, že jsi pozorován.',
  'Něco se tu změnilo od tvé poslední návštěvy.',
  'Je tu stopy boje.',
  'Vzduch houstne podivnou magií.',
  'Slyšíš známý hlas...'
];

// ============================================
// CREATURE GENERATOR TABLES
// Pro generování NPC a tvorů s narativem
// ============================================

// Typy tvorů (50 možností)
export const CREATURE_TYPES = [
  // Myší archetypry
  { name: 'myší poustevník', category: 'mouse', icon: '🐭' },
  { name: 'myší poutník', category: 'mouse', icon: '🐭' },
  { name: 'myší lovec', category: 'mouse', icon: '🐭' },
  { name: 'myší bylinkář', category: 'mouse', icon: '🐭' },
  { name: 'myší kovář', category: 'mouse', icon: '🐭' },
  { name: 'myší bard', category: 'mouse', icon: '🐭' },
  { name: 'myší stráž', category: 'mouse', icon: '🐭' },
  { name: 'myší zloděj', category: 'mouse', icon: '🐭' },
  { name: 'myší kupec', category: 'mouse', icon: '🐭' },
  { name: 'myší čaroděj', category: 'mouse', icon: '🐭' },
  { name: 'myší kněz', category: 'mouse', icon: '🐭' },
  { name: 'myší voják', category: 'mouse', icon: '🐭' },
  { name: 'myší šlechtic', category: 'mouse', icon: '🐭' },
  { name: 'myší sirotek', category: 'mouse', icon: '🐭' },
  { name: 'myší vynálezce', category: 'mouse', icon: '🐭' },
  { name: 'myší kartograf', category: 'mouse', icon: '🐭' },
  { name: 'myší léčitel', category: 'mouse', icon: '🐭' },
  { name: 'myší šaman', category: 'mouse', icon: '🐭' },

  // Krysy
  { name: 'krysí lupič', category: 'rat', icon: '🐀' },
  { name: 'krysí válečník', category: 'rat', icon: '🐀' },
  { name: 'krysí šmejd', category: 'rat', icon: '🐀' },
  { name: 'krysí vědma', category: 'rat', icon: '🐀' },
  { name: 'krysí žoldnéř', category: 'rat', icon: '🐀' },

  // Hmyz a malí tvorové
  { name: 'moudrý brouk', category: 'insect', icon: '🪲' },
  { name: 'včelí posel', category: 'insect', icon: '🐝' },
  { name: 'mravenčí voják', category: 'insect', icon: '🐜' },
  { name: 'cvrček básník', category: 'insect', icon: '🦗' },
  { name: 'světluška průvodce', category: 'insect', icon: '✨' },
  { name: 'motýl věštec', category: 'insect', icon: '🦋' },
  { name: 'šnek poustevník', category: 'creature', icon: '🐌' },
  { name: 'žabí rytíř', category: 'creature', icon: '🐸' },
  { name: 'žabí šašek', category: 'creature', icon: '🐸' },
  { name: 'rejsek stopař', category: 'creature', icon: '🐁' },

  // Nadpřirozené
  { name: 'lesní duch', category: 'spirit', icon: '👻' },
  { name: 'bludička', category: 'spirit', icon: '🔥' },
  { name: 'duch mrtvé myši', category: 'spirit', icon: '👻' },
  { name: 'skřítek', category: 'fae', icon: '🧚' },
  { name: 'víla', category: 'fae', icon: '🧚' },
  { name: 'domácí duch', category: 'spirit', icon: '✨' },
  { name: 'stínový tvor', category: 'spirit', icon: '🌑' },
  { name: 'duch stromu', category: 'spirit', icon: '🌳' },
  { name: 'vodní duch', category: 'spirit', icon: '💧' },

  // Konstrukty a zvláštní
  { name: 'oživlá loutka', category: 'construct', icon: '🎭' },
  { name: 'magický konstrukt', category: 'construct', icon: '⚙️' },
  { name: 'oživlý stín', category: 'spirit', icon: '🌑' },
  { name: 'služebník čaroděje', category: 'construct', icon: '🔮' },

  // Predátoři (mluvící)
  { name: 'mladá sova', category: 'predator', icon: '🦉' },
  { name: 'stará vrána', category: 'predator', icon: '🐦‍⬛' },
  { name: 'mluvící had', category: 'predator', icon: '🐍' }
];

// Osobnostní rysy (40 možností)
export const CREATURE_PERSONALITIES = [
  'mrzutý a nedůvěřivý',
  'přátelský a zvědavý',
  'paranoidní a ostražitý',
  'melanholický a tichý',
  'veselý a upovídaný',
  'vážný a důstojný',
  'nervózní a ustrašený',
  'arogantní a povýšený',
  'skromný a pokorný',
  'charismatický a okouzlující',
  'tajemný a uzavřený',
  'impulzivní a vznětlivý',
  'trpělivý a rozvážný',
  'podezřívavý a opatrný',
  'optimistický a nadějeplný',
  'pesimistický a cynický',
  'laskavý a starostlivý',
  'chamtivý a vypočítavý',
  'čestný a přímý',
  'lstivý a zákeřný',
  'naivní a důvěřivý',
  'moudrý a zkušený',
  'bláznivý a nepředvídatelný',
  'klidný a vyrovnaný',
  'zoufalý a beznadějný',
  'hrdý a neústupný',
  'zbabělý a vyhýbavý',
  'statečný a odvážný',
  'nostalgický a zasněný',
  'praktický a pragmatický',
  'snílkovský a romantický',
  'zahořklý a zatrpklý',
  'vděčný a pokorný',
  'neklidný a roztěkaný',
  'soustředěný a odhodlaný',
  'unavený životem',
  'plný energie a elánu',
  'osamělý a toužící po společnosti',
  'samotářský a nezávislý',
  'loajální a věrný'
];

// Vzhled a fyzické rysy (45 možností)
export const CREATURE_APPEARANCES = [
  'má zjizvený obličej',
  'chybí mu kus ucha',
  'má neobvykle lesklou srst',
  'je pokrytý tetováními',
  'nosí obnošený plášť',
  'má pronikavé zelené oči',
  'kulhá na jednu nohu',
  'je neobvykle velký',
  'je drobný a vychrtlý',
  'má stříbrnou srst',
  'je slepý na jedno oko',
  'má zlomený vous',
  'nosí podivný klobouk',
  'je pokrytý jizvami',
  'má elegantní oblečení',
  'je zahalený v hadrech',
  'nosí amulety a talismany',
  'má spálený kus srsti',
  'je pokrytý prachem z cest',
  'má neobvykle dlouhý ocas',
  'je bezzubý',
  'má kouzelnou záři v očích',
  'nosí zbraň z lidské jehly',
  'je pokrytý pylem',
  'má tetování na tlapce',
  'nosí zděděný medailon',
  'má nervózní tik',
  'je neobvykle čistý',
  'páchne bylinkami',
  'voní po kouři',
  'má hlas jako zvon',
  'šeptá neustále',
  'mluví s přízvukem',
  'koktá při stresu',
  'má nepřítomný pohled',
  'neustále si hraje s něčím v tlapkách',
  'má modřiny a odřeniny',
  'nosí vzácný kámen na krku',
  'má výrazné bílé chloupky',
  'je pokrytý blátem',
  'má mechanickou protézu',
  'nosí brýle z kapky rosy',
  'má viditelnou magickou auru',
  'je albín',
  'má neobvykle krátké vousy'
];

// Motivace a cíle (50 možností)
export const CREATURE_GOALS = [
  'hledá ztraceného příbuzného',
  'utíká před pronásledovateli',
  'sbírá ingredience pro rituál',
  'nese tajnou zprávu',
  'hledá bezpečné místo',
  'chce splatit starý dluh',
  'pátrá po ukrytém pokladu',
  'hledá pomstu za křivdu',
  'sbírá informace pro svého pána',
  'utíká před minulostí',
  'hledá léčivou bylinu',
  'chce varovat osadu před nebezpečím',
  'sbírá příběhy pro kroniku',
  'hledá učedníka',
  'chce založit nový domov',
  'pátrá po starověkém artefaktu',
  'plní slib mrtvému příteli',
  'hledá odpuštění za hřích',
  'sbírá součástky pro vynález',
  'utíká před zákonem',
  'hledá ztracené kouzlo',
  'chce překonat prokletí',
  'pátrá po pravdě o své minulosti',
  'hledá partnera na cestu',
  'chce dokázat svou hodnotu',
  'sbírá vzácné materiály',
  'hledá vstup do skrytého místa',
  'chce se pomstít nepříteli',
  'pátrá po zmizelé osadě',
  'nese oběť pro ducha',
  'hledá ztracený recept',
  'chce osvobodit zajatce',
  'sbírá důkazy zločinu',
  'hledá způsob jak odčinit minulost',
  'chce získat vzácnou znalost',
  'pátrá po legendárním místu',
  'hledá cestu domů',
  'chce varovat před blížící se hrozbou',
  'sbírá spojence pro boj',
  'hledá ztracené dědictví',
  'chce předat prokletý předmět',
  'pátrá po svém původu',
  'hledá místo z proroctví',
  'chce splnit poslední přání umírajícího',
  'sbírá staré dluhy',
  'hledá odpověď na záhadu',
  'chce dokončit nedokončenou práci',
  'pátrá po zmizele karavanně',
  'hledá ochranu před něčím',
  'chce získat magický předmět'
];

// Aktuální činnost (40 možností)
export const CREATURE_DOING = [
  'odpočívá ve stínu',
  'jí skromné jídlo',
  'opravuje své vybavení',
  'studuje starou mapu',
  'mluví sám se sebou',
  'zpívá tichou píseň',
  'ošetřuje si zranění',
  'hledá něco v pytli',
  'pozoruje okolí',
  'číhá ve stínu',
  'přemýšlí nad rozhodnutím',
  'počítá mince',
  'čte zvětralý svitek',
  'brousí zbraň',
  'připravuje lektvar',
  'kreslí do prachu',
  'šeptá zaklínadlo',
  'schovává něco',
  'následuje stopu',
  'staví malý přístřešek',
  'sbírá byliny',
  'naslouchá větru',
  'medituje',
  'pláče potichu',
  'směje se něčemu',
  'cvičí s zbraní',
  'vaří nad malým ohníčkem',
  'balí své věci',
  'čeká na někoho',
  'píše do deníku',
  'zkoumá podivný předmět',
  'léčí nemocného druha',
  'vyjednává s někým',
  'ukrývá se',
  'hádá se s neviditelným',
  'tančí podivný tanec',
  'sbírá rosu do lahvičky',
  'staví past',
  'ruší staré kouzlo',
  'volá do tmy'
];

// Nálada a emocionální stav (35 možností)
export const CREATURE_MOODS = [
  'je zjevně vyčerpaný',
  'působí podezřívavě',
  'je v dobré náladě',
  'vypadá nervózně',
  'je hluboce zamyšlený',
  'působí ztraceně',
  'je zjevně v šoku',
  'vypadá rozhodnutě',
  'je plný obav',
  'působí nostalgicky',
  'je evidentně zraněný',
  'vypadá hladově',
  'je v panice',
  'působí klidně a vyrovnaně',
  'je zjevně opilý',
  'vypadá jako by něco skrýval',
  'je plný naděje',
  'působí paranoidně',
  'je zjevně nemocný',
  'vypadá zoufalě',
  'je v transu',
  'působí jako by snil',
  'je evidentně vyděšený',
  'vypadá odhodlaně',
  'je zmatený a dezorientovaný',
  'působí tajemně',
  'je zjevně unavený životem',
  'vypadá jako by čekal na smrt',
  'je plný energie',
  'působí jako by něco věděl',
  'je zjevně pod vlivem magie',
  'vypadá jako by utíkal celou noc',
  'je zahloubán do vzpomínek',
  'působí jako by právě prožil trauma',
  'je překvapený že tě vidí'
];

// Tajemství (35 možností)
export const CREATURE_SECRETS = [
  'je ve skutečnosti špeh jiné frakce',
  'nese prokletý předmět, o kterém neví',
  'je poslední ze své rodiny',
  'byl kdysi někým důležitým',
  'zná cestu k ukrytému pokladu',
  'má dluhy u nebezpečných bytostí',
  'viděl něco, co neměl',
  'je pod vlivem kletby',
  'zná zapomenuté kouzlo',
  'skrývá svou pravou identitu',
  'je na útěku před spravedlností',
  'nese důležitou zprávu pro někoho mrtvého',
  'má spojení s nebezpečnou frakcí',
  'zná slabinu mocného nepřítele',
  'je vázán přísahou, kterou nemůže porušit',
  'byl svědkem zločinu',
  'zná tajnou cestu',
  'má v sobě ducha předka',
  'ví kde je ukrytý artefakt',
  'je pronásledován duchem',
  'zná pravdu o historické události',
  'má tajnou nemoc',
  'je agentem královny',
  'zná polohu ztracené osady',
  'nese semínko vzácné rostliny',
  'ví kdy přijde nebezpečí',
  'je potomkem legendární postavy',
  'zná recept na mocný lektvar',
  'má dluh vůči nadpřirozené bytosti',
  'skrývá magický dar',
  'je vázán smlouvou s vílou',
  'zná slabé místo v obraně osady',
  'viděl budoucnost',
  'nese vzpomínky mrtvého',
  'ví o zradě ve vysokých kruzích'
];

// Zvláštnosti a kvíry (40 možností)
export const CREATURE_QUIRKS = [
  'mluví ve třetí osobě',
  'neustále si něco mumlá',
  'sbírá bezvýznamné předměty',
  'má strach z vody',
  'nikdy neotočí záda ke dveřím',
  'jí pouze syrové jídlo',
  'nespí v noci',
  'má obsesi s čistotou',
  'věří v podivné pověry',
  'počítá neustále kroky',
  'mluví s neviditelnými přáteli',
  'odmítá vstoupit do stínu',
  'nikdy nelže (ani když by měl)',
  'má strach z ptáků',
  'sbírá kosti',
  'dělá poznámky o všem co vidí',
  'nikdy nejí maso',
  'mluví pouze v hádankách',
  'má rituál před každým jídlem',
  'odmítá nosit zbraně',
  'věří že je někdo jiný',
  'sbírá příběhy o smrti',
  'nikdy neprozradí své pravé jméno',
  'má strach z uzavřených prostor',
  'neustále kontroluje své věci',
  'mluví o sobě v množném čísle',
  'má obsesi s určitou barvou',
  'nikdy nespí na stejném místě dvakrát',
  'věří že ho někdo sleduje',
  'sbírá pyl z květin',
  'odmítá jít proti větru',
  'má rituál zdravení',
  'nikdy nepije z tekoucí vody',
  'sbírá kamínky specifického tvaru',
  'věří v osudová znamení',
  'má strach z hadů',
  'neustále si brousí zuby',
  'odmítá mluvit za tmy',
  'má posedlost se směry',
  'vždy má plán úniku'
];

// ============================================
// NARRATIVE GENERATOR TABLES
// Čistě narativní generátor scén a situací
// ============================================

// Úvodní věty - jak scéna začíná (40)
export const NARRATIVE_OPENINGS = [
  'Slunce právě zapadá za korunami stromů, když',
  'V tichu před úsvitem',
  'Uprostřed cesty se náhle',
  'Pod závojem mlhy',
  'Když se ohlédneš zpět,',
  'Vzduch zhoustne a',
  'Ze stínů se vynoří',
  'Praskot větve přeruší ticho a',
  'Vítr přinese podivnou vůni a',
  'Na okamžik se ti zdá, že',
  'Země se zachvěje a',
  'Světlo projde mezi listy a',
  'Ticho je náhle přerušeno',
  'V dálce se ozve',
  'Cesta před tebou se',
  'Stíny se prodlouží a',
  'Chlad projde tvou srstí, když',
  'Měsíc vyjde zpoza mraků a',
  'První kapky deště začnou padat, když',
  'Vůně kouře tě přivede k',
  'Podivný zvuk tě donutí zastavit -',
  'Na horizontu se objeví',
  'Instinkt tě varuje, že',
  'Vzpomínka se ti vynoří, když',
  'Srdce ti poskočí, protože',
  'V tom okamžiku si uvědomíš, že',
  'Tvůj stín se zachvěje a',
  'Vzduch se náhle ochladí a',
  'Pocit, že jsi pozorován, zesílí, když',
  'Známá melodie se ozve z',
  'Blesk osvětlí krajinu a ty vidíš',
  'Tiché kroky se blíží a',
  'Záblesk světla prozradí',
  'Rosa na trávě odráží',
  'Tvé vousy se napnou - někdo',
  'V tom tichu slyšíš jen',
  'Šepot větru přinese slova',
  'Na místě, kde jsi včera byl, teď',
  'Něco se změnilo - teď',
  'Čas jako by se zastavil, když'
];

// Prostředí a lokace (45)
export const NARRATIVE_SETTINGS = [
  'na rozcestí označeném ztracenými věcmi',
  'u vstupu do staré nory, odkud vane teplý vzduch',
  'pod obřím listem, který ukrývá tajemství',
  'na břehu louže, kde se zrcadlí obloha',
  'mezi kořeny, které tvoří přírodní bránu',
  'v trávě vysoké jako les, kde se skrývá',
  'pod pavučinou zdobenou rosou',
  'u zbytků lidského pikniku, kde',
  'na prahu opuštěné osady',
  'v dutině stromu, kde kdysi žil někdo',
  'pod kamennou římsou, kde se ukrývají',
  'na místě starého tábořiště',
  'u potoka, jehož voda zpívá podivnou melodii',
  'mezi hřiby, které tvoří kruh',
  'na vrcholu kopečku, odkud je vidět daleko',
  'v rozvalinách ptačího hnízda',
  'pod listem, kde kapky deště bubnují',
  'u ztracené lidské mince, kolem které',
  'na místě, kde se stýkají světlo a stín',
  'v houští, odkud není vidět obloha',
  'u staré studánky, jejíž voda',
  'na hranici dvou území',
  'pod hvězdami, které vyprávějí příběhy',
  'v místě, kde vítr mění směr',
  'u zbytků staré pasti',
  'na cestě, kterou už nikdo nechodí',
  'mezi kameny, které pamatují staré časy',
  'pod střechou z listí, která',
  'u vchodu do temnoty',
  'na místě, kde se něco stalo',
  'v tichu lesa, kde i šepot je hlasitý',
  'na okraji lidského světa',
  'u stromu, který byl zasažen bleskem',
  'pod nebem, které hrozí bouří',
  'v údolí mezi kořeny',
  'na místě, které bylo kdysi domovem',
  'u zbytků ohně, který už nevydává teplo',
  'pod závojem padajících listů',
  'na hranici mezi snem a bděním',
  'v místě, kde končí mapy',
  'u pomníku, který někdo postavil',
  'pod ochranou starého ducha',
  'na prahu neznámého',
  'v objetí stínů',
  'mezi ozvěnami minulosti'
];

// Atmosféra a nálada (40)
export const NARRATIVE_ATMOSPHERES = [
  'Vzduch je těžký očekáváním.',
  'Ticho je tak hluboké, že slyšíš vlastní srdce.',
  'Všude kolem je podivný klid.',
  'Něco visí ve vzduchu - něco nevyřčeného.',
  'Svět se zdá neskutečný, jako ve snu.',
  'Cítíš, že nejsi sám.',
  'Čas plyne jinak na tomto místě.',
  'Stíny se zdají živé.',
  'Vzduch voní po dávných časech.',
  'Je tu smutek, starý jako kameny.',
  'Naděje se mísí se strachem.',
  'Místo dýchá historií.',
  'Je tu ticho, které předchází bouři.',
  'Vzduch se chvěje nevyřčenými slovy.',
  'Cítíš spojení s těmi, kdo tu byli před tebou.',
  'Svět kolem tebe čeká.',
  'Je tu bezpečí - ale na jak dlouho?',
  'Něco se blíží ke konci.',
  'Nový začátek je na dosah.',
  'Minulost a přítomnost se tu prolínají.',
  'Magie je tu hmatatelná.',
  'Je tu klid před bouří.',
  'Vzduch je nabitý možnostmi.',
  'Cítíš tíhu rozhodnutí.',
  'Osud se zdá být blízko.',
  'Je tu melancholie, ale i krása.',
  'Všechno se zdá být důležité.',
  'Okamžik je křehký jako rosa.',
  'Je tu divokost, která čeká.',
  'Cítíš, že jsi na správném místě.',
  'Něco se probouzí.',
  'Svět je plný tajemství.',
  'Je tu ticho po bouři.',
  'Vzduch chutná po dobrodružství.',
  'Cítíš volání do neznáma.',
  'Domov se zdá být daleko.',
  'Je tu posvátnost okamžiku.',
  'Všechno je možné.',
  'Něco končí, něco začíná.',
  'Svět čeká na tvé rozhodnutí.'
];

// Události a dění (50)
export const NARRATIVE_EVENTS = [
  'objevíš stopu, která vede do neznáma',
  'uslyšíš hlas, který ti připomíná někoho ztraceného',
  'najdeš předmět, který tu nepatří',
  'spatříš postavu na hranici viditelnosti',
  'ucítíš vůni, která evokuje vzpomínky',
  'objevíš zprávu určenou někomu jinému',
  'uslyšíš melodii, kterou nikdo nehraje',
  'najdeš místo, které odpovídá tvým snům',
  'spatříš světlo, které by tu nemělo být',
  'ucítíš, jak se země chvěje',
  'objevíš vstup, který tu včera nebyl',
  'uslyšíš své jméno šeptané větrem',
  'najdeš pozůstatek dávné bitvy',
  'spatříš stín bez majitele',
  'ucítíš přítomnost něčeho starého',
  'objevíš mapu vedoucí nikam',
  'uslyšíš tiché pláč',
  'najdeš dar od neznámého',
  'spatříš odraz něčeho, co tu není',
  'ucítíš, jak se tvůj osud mění',
  'objevíš znamení, které znáš',
  'uslyšíš varování v šumu listí',
  'najdeš důkaz, že tu byl někdo před tebou',
  'spatříš cestu, která se otevírá',
  'ucítíš naději tam, kde jsi čekal zoufalství',
  'objevíš odpověď na otázku, kterou jsi nepoložil',
  'uslyšíš ozvěnu dávného příběhu',
  'najdeš klíč k něčemu neznámému',
  'spatříš pravdu ukrytou v detailu',
  'ucítíš, že nejsi sám ve svém boji',
  'objevíš spojence tam, kde jsi čekal nepřítele',
  'uslyšíš tep země',
  'najdeš cestu domů tam, kde jsi ji nečekal',
  'spatříš budoucnost v kapce rosy',
  'ucítíš, že tohle je ten okamžik',
  'objevíš sílu, o které jsi nevěděl',
  'uslyšíš ticho, které mluví',
  'najdeš krásu v neočekávaném',
  'spatříš změnu, která právě nastává',
  'ucítíš, jak příběh pokračuje',
  'objevíš, že nic není, jak se zdálo',
  'uslyšíš volání do neznáma',
  'najdeš důvod pokračovat',
  'spatříš světlo na konci cesty',
  'ucítíš, že tohle je začátek něčeho',
  'objevíš, že máš víc, než jsi myslel',
  'uslyšíš odpověď ve svém srdci',
  'najdeš cestu tam, kde žádná nebyla',
  'spatříš možnost, která mizí',
  'ucítíš váhu své volby'
];

// Napětí a konflikt (40)
export const NARRATIVE_TENSIONS = [
  'Ale něco není v pořádku.',
  'Jenže čas se krátí.',
  'Však cesta zpět je uzavřena.',
  'Ale cena může být vysoká.',
  'Jenže nejsi jediný, kdo hledá.',
  'Však rozhodnutí musí padnout teď.',
  'Ale stíny se prodlužují.',
  'Jenže pravda může bolet.',
  'Však někdo tě sleduje.',
  'Ale tohle jsi nečekal.',
  'Jenže nic není zadarmo.',
  'Však minulost tě dohání.',
  'Ale volba je pouze tvá.',
  'Jenže důvěra byla zrazena.',
  'Však někde se stala chyba.',
  'Ale není cesty zpět.',
  'Jenže tohle mění všechno.',
  'Však odpověď přináší nové otázky.',
  'Ale čas na rozhodnutí vypršel.',
  'Jenže pravda je složitější.',
  'Však není všechno ztraceno.',
  'Ale někdo musí zaplatit.',
  'Jenže příběh nekončí.',
  'Však tohle je jen začátek.',
  'Ale co když se mýlíš?',
  'Jenže volba má následky.',
  'Však osud čeká.',
  'Ale strach je skutečný.',
  'Jenže naděje zůstává.',
  'Však někdo tě potřebuje.',
  'Ale čas běží.',
  'Jenže tohle není konec.',
  'Však pravda vyjde najevo.',
  'Ale jsi připraven?',
  'Jenže svět se mění.',
  'Však tvůj příběh pokračuje.',
  'Ale co když je pozdě?',
  'Jenže vzdát se nemůžeš.',
  'Však tohle je tvůj okamžik.',
  'Ale co přijde potom?'
];

// Smyslové detaily (45)
export const NARRATIVE_DETAILS = [
  'Vůně mokré země stoupá vzhůru.',
  'Světlo se láme v kapkách rosy.',
  'Vítr šeptá mezi listy.',
  'Tvé tlapky cítí chlad kamene.',
  'Vzduch chutná po dešti.',
  'Stíny tančí na zemi.',
  'Teplo slunce hladí tvou srst.',
  'Tiché bzučení hmyzu vyplňuje vzduch.',
  'Voda zurčí někde poblíž.',
  'Praskání větví zní jako kroky.',
  'Měsíční světlo stříbří krajinu.',
  'Pach kouře visí ve vzduchu.',
  'Chlad noci se blíží.',
  'Tvůj dech je vidět v chladném vzduchu.',
  'Listy šustí pod tvými kroky.',
  'Ptáci umlkli.',
  'Pavučiny se třpytí v ranním světle.',
  'Země je měkká a vlhká.',
  'Vzduch vibruje tichým napětím.',
  'Stíny jsou hlubší než obvykle.',
  'Světlo má zlatavý nádech.',
  'Vůně květin je omamná.',
  'Chlad proniká až ke kostem.',
  'Ticho je téměř hmatatelné.',
  'Barvy se zdají jasnější.',
  'Vzduch je hustý a nehybný.',
  'Hvězdy se třpytí jasněji než jindy.',
  'Země pod tebou se zdá nestabilní.',
  'Teplo ohně se dotýká tvé tváře.',
  'Vůně lesa je silná a živá.',
  'Světlo a stín hrají podivnou hru.',
  'Tvé srdce buší v uších.',
  'Vzduch voní po změně.',
  'Chlad se plíží po zádech.',
  'Ticho před bouří.',
  'Svět se zdá být zpomalený.',
  'Každý zvuk je zesílený.',
  'Barvy se mísí v soumraku.',
  'Vzduch je svěží a čistý.',
  'Prach tančí ve světelném paprsku.',
  'Voda odráží oblohu.',
  'Stíny vyprávějí vlastní příběh.',
  'Země voní po životě.',
  'Ticho zní hlasitěji než křik.',
  'Svět dýchá kolem tebe.'
];

// Náznaky a otázky (35)
export const NARRATIVE_HOOKS = [
  'Co se tu stalo?',
  'Kdo tu byl před tebou?',
  'Kam vede tato cesta?',
  'Co se skrývá ve stínech?',
  'Proč je tu takové ticho?',
  'Co znamená toto znamení?',
  'Kdo zanechal tuto stopu?',
  'Kam zmizel ten, koho hledáš?',
  'Co čeká za další zatáčkou?',
  'Proč máš pocit, že tě někdo sleduje?',
  'Co ti říká tvůj instinkt?',
  'Kdo by mohl vědět víc?',
  'Kam vede pravda?',
  'Co zůstalo nevyřčeno?',
  'Proč se to stalo právě teď?',
  'Co by udělal ten, koho obdivuješ?',
  'Kdo profituje z této situace?',
  'Kam zmizela naděje?',
  'Co bys dal za odpověď?',
  'Proč se bojíš pokračovat?',
  'Co tě drží zpátky?',
  'Kdo tě čeká na konci cesty?',
  'Kam vede tvé srdce?',
  'Co znamená tohle všechno?',
  'Proč právě ty?',
  'Co bys změnil, kdybys mohl?',
  'Kdo ti může pomoci?',
  'Kam zmizela odvaha?',
  'Co je důležitější - pravda nebo klid?',
  'Proč se svět zdá jiný?',
  'Co vidíš, když zavřeš oči?',
  'Kdo drží klíč k tajemství?',
  'Kam vede tato volba?',
  'Co říká ticho?',
  'Proč je tohle důležité?'
];

// Zakončení a pokračování (35)
export const NARRATIVE_CONCLUSIONS = [
  'A tak příběh pokračuje...',
  'Tohle je teprve začátek.',
  'Odpověď čeká za horizontem.',
  'Osud je ve tvých tlapkách.',
  'Cesta dál je nejistá, ale možná.',
  'Někde tam venku je pravda.',
  'Noc je ještě mladá.',
  'Svítání přinese odpovědi.',
  'Tohle změní všechno.',
  'A ty stojíš na rozcestí.',
  'Další kapitola se právě otevírá.',
  'Svět čeká na tvůj další krok.',
  'Ticho před dalším dobrodružstvím.',
  'Něco se probudilo.',
  'A někde se otevřely dveře.',
  'Příběh se zapsal do kamene.',
  'Budoucnost je nepsaná.',
  'A ty jsi součástí něčeho většího.',
  'Tohle není konec - je to pozvánka.',
  'Svět je větší, než jsi myslel.',
  'A tak jdeš dál, protože musíš.',
  'Odpovědi přijdou, až budeš připraven.',
  'Každý konec je novým začátkem.',
  'A příběh si tě našel.',
  'Osud má smysl pro načasování.',
  'Někde tam venku na tebe někdo čeká.',
  'A tohle je tvůj příběh.',
  'Svět se změnil - a ty s ním.',
  'Další dobrodružství klepe na dveře.',
  'A ty víš, co musíš udělat.',
  'Cesta pokračuje, dokud ty pokračuješ.',
  'Tohle je jen jedna z mnoha cest.',
  'A hvězdy sledují tvůj příběh.',
  'Svět dýchá a čeká.',
  'A tak to začíná znovu...'
];

// ============================================
// BESTIARY - CREATURE DATA
// ============================================

export const CREATURE_CATEGORIES = [
  { id: 'beast-mammal', name: 'Zvíře - Savec', icon: '🐀' },
  { id: 'beast-bird', name: 'Zvíře - Pták', icon: '🦅' },
  { id: 'beast-reptile', name: 'Zvíře - Plaz', icon: '🐍' },
  { id: 'insect', name: 'Hmyz', icon: '🐛' },
  { id: 'arachnid', name: 'Pavoukovec', icon: '🕷️' },
  { id: 'supernatural', name: 'Nadpřirozené', icon: '✨' },
  { id: 'mouse-rival', name: 'Myší protivník', icon: '🐭' },
  { id: 'amphibian', name: 'Obojživelník', icon: '🐸' }
];

export const BESTIARY = [
  // === OFFICIAL - CORE RULEBOOK ===
  {
    id: 1, name: 'Kočka', nameEn: 'Cat', category: 'beast-mammal', scale: 'Warband',
    hp: 15, str: 15, dex: 15, wil: 10, armor: 1,
    attacks: [{ name: 'Tlapnutí', damage: 'd6' }, { name: 'Kousnutí', damage: 'd8' }],
    abilities: ['Warband scale - pouze warband (20+ myší) může efektivně bojovat'],
    description: 'Obrovský predátor z pohledu myší. Kočky jsou feudální vládci, kteří požadují věrnost a úplatky.',
    tactics: 'Snaží se zastrašit a přinutit ke kapitulaci. V boji je devastující.',
    wants: 'Být obsluhována. Požaduje přísahy věrnosti.',
    variants: ['Baltazar - miluje pochoutky', 'Melichar - miluje zlato', 'Šalamoun - kruté hry', 'Chamurapi - přísná logika', 'Nefertiti - umění a poezie', 'Zenobia - dobyvatel'],
    source: 'Official'
  },
  {
    id: 2, name: 'Stonožka', nameEn: 'Centipede', category: 'insect', scale: 'Normal',
    hp: 8, str: 10, dex: 12, wil: 8, armor: 1,
    attacks: [{ name: 'Jedovaté kousnutí', damage: 'd6', special: 'Poškozuje DEX místo STR' }],
    criticalDamage: 'd12 poškození na STR',
    abilities: ['Jedovatý útok cílí na obratnost'],
    description: 'Mnohonohý predátor s jedovatými kusadly.',
    tactics: 'Útočí ze zálohy, snaží se ochromit jedem.',
    wants: 'Toulat se a požírat.',
    variants: ['Obří (HP 12, STR 15)', 'Plovoucí', 'Tygří (d8)', 'Žravá', 'Závodní', 'Opeřená'],
    source: 'Official'
  },
  {
    id: 3, name: 'Vrána', nameEn: 'Crow', category: 'beast-bird', scale: 'Normal',
    hp: 12, str: 12, dex: 15, wil: 15, armor: 1,
    attacks: [{ name: 'Klování', damage: 'd8' }],
    abilities: ['Létá 3× rychlostí', 'Zná dvě písně'],
    description: 'Inteligentní ptáci s mystickými schopnostmi a starými písněmi.',
    tactics: 'Používá písně k ovlivnění situace.',
    wants: 'Chránit posvátná místa.',
    variants: ['Píseň úsvitu - oslepí', 'Píseň smutku - Frightened', 'Píseň zraku - věštba', 'Píseň větru - sráží', 'Píseň minulosti', 'Píseň pravdy'],
    source: 'Official'
  },
  {
    id: 4, name: 'Víla', nameEn: 'Faerie', category: 'supernatural', scale: 'Normal',
    hp: 6, str: 10, dex: 15, wil: 15, armor: 0,
    attacks: [{ name: 'Stříbrný rapír', damage: 'd8' }],
    abilities: ['Zná jedno kouzlo', 'Může používat glamour (iluze)'],
    description: 'Záhadné bytosti z Vílí říše plnící rozkazy královny.',
    tactics: 'Preferují lest a manipulaci před bojem.',
    wants: 'Plnit úkoly Královny Víl.',
    variants: ['Únosce miminek', 'Dárce prokletých darů', 'Hudebník', 'Převlékač', 'Kazič jídla', 'Podvodník'],
    source: 'Official'
  },
  {
    id: 5, name: 'Žába', nameEn: 'Frog', category: 'amphibian', scale: 'Normal',
    hp: 6, str: 12, dex: 15, wil: 8, armor: 1,
    attacks: [{ name: 'Kopí', damage: 'd10' }, { name: 'Jazyk', damage: 'd6', special: 'Přitáhne cíl' }],
    criticalDamage: 'Odskočí z dosahu',
    abilities: ['Vždy jedná první', 'Skáče 2× rychlostí'],
    description: 'Galantní žabí rytíři na výpravách.',
    tactics: 'Využívá rychlost, jedná čestně podle kodexu.',
    wants: 'Dokončit svou výpravu.',
    variants: ['Gwal - silný, prostý', 'Filip - prokletý člověk', 'Lurf - ukvapený', 'Slup - lovec bestií', 'Uuu - turnajový', 'Puc - hledá Pohár'],
    source: 'Official'
  },
  {
    id: 6, name: 'Duch', nameEn: 'Ghost', category: 'supernatural', scale: 'Normal',
    hp: 9, str: 5, dex: 10, wil: 10, armor: 0,
    attacks: [{ name: 'Mrazivý dotyk', damage: 'd8', special: 'Poškozuje WIL místo STR' }],
    criticalDamage: 'Posedne cíl',
    abilities: ['Pouze zranitelný stříbrem/magií', 'Má duchařskou schopnost'],
    description: 'Nešťastné duše uvězněné mezi světy.',
    tactics: 'Útočí mrazivým dotykem, ničí vůli.',
    wants: 'Svobodu od bolesti.',
    variants: ['Záblesk - d3 iluzí', 'Poltergeist - hází věci', 'Lapač - vtahuje do říše', 'Zkáza - Frightened', 'Hnilobník - ničí zásoby', 'Nehmotný'],
    source: 'Official'
  },
  {
    id: 7, name: 'Myš (Rival)', nameEn: 'Mouse', category: 'mouse-rival', scale: 'Normal',
    hp: 3, str: 9, dex: 9, wil: 9, armor: 0,
    attacks: [{ name: 'Meč', damage: 'd6' }, { name: 'Luk', damage: 'd6', special: 'Na dálku' }],
    abilities: [],
    description: 'Rivalové, zločinci nebo jiní myší dobrodruzi.',
    tactics: 'Používají podobné taktiky jako hráči.',
    wants: 'Cítit se v bezpečí.',
    variants: ['Bodlák - zhanobený rytíř', 'Belladona - čaroděj', 'Slamák - zloděj', 'Mandragora - podvodník', 'Měsíček - pyroman', 'Leif - vyhnanec'],
    source: 'Official'
  },
  {
    id: 8, name: 'Sova', nameEn: 'Owl', category: 'beast-bird', scale: 'Normal',
    hp: 15, str: 15, dex: 15, wil: 15, armor: 1,
    attacks: [{ name: 'Kousnutí', damage: 'd10' }],
    abilities: ['Létá 3× rychlostí', 'Zná dvě kouzla'],
    description: 'Mocní ptačí čarodějové sbírající vzácné znalosti.',
    tactics: 'Kombinuje magii s fyzickými útoky.',
    wants: 'Sbírat vzácné znalosti a kouzla.',
    variants: ['Bezalel - staví mechaniky', 'Morgana - spolek s vílami', 'Prospero - chimérický', 'Krahujec - měnič', 'Crowley - váže duchy', 'Lechuza - uvězněná čarodějnice'],
    source: 'Official'
  },
  {
    id: 9, name: 'Krysa', nameEn: 'Rat', category: 'mouse-rival', scale: 'Normal',
    hp: 3, str: 12, dex: 8, wil: 8, armor: 0,
    attacks: [{ name: 'Sekáček', damage: 'd6' }],
    abilities: [],
    description: 'Větší a agresivnější příbuzní myší, organizovaní v gangech.',
    tactics: 'Útočí ve skupinách, zákeřné taktiky.',
    wants: 'Snadné bohatství, brát od slabých.',
    variants: ['Dedratz - pasťáci', 'Vodní krysy - lodníci', 'Laboratorní - magické', 'Plechoví rytíři (Armor 1)', 'Džentelkrysy', 'Králové (Rat King)'],
    source: 'Official'
  },
  {
    id: 10, name: 'Had', nameEn: 'Snake', category: 'beast-reptile', scale: 'Normal',
    hp: 12, str: 12, dex: 10, wil: 10, armor: 2,
    attacks: [{ name: 'Kousnutí', damage: 'd8' }],
    criticalDamage: 'Spolkne celého - d4 STR/kolo',
    abilities: ['Vysoký pancíř díky šupinám'],
    description: 'Plazivý predátor polykající kořist vcelku.',
    tactics: 'Útočí rychle ze zálohy, snaží se spolknout.',
    wants: 'Nerušeně spát.',
    variants: ['Dřevěný - očarovaný', 'Stínový - vždy mimo dohled', 'Kostěný - nemrtvý', 'Úhoř - vodní', 'Svitkový - kouzlo v šupinách', 'Dráček - křídla, oheň'],
    source: 'Official'
  },
  {
    id: 11, name: 'Pavouk', nameEn: 'Spider', category: 'arachnid', scale: 'Normal',
    hp: 6, str: 8, dex: 15, wil: 10, armor: 1,
    attacks: [{ name: 'Jedovaté kousnutí', damage: 'd6', special: 'Poškozuje DEX místo STR' }],
    criticalDamage: 'Odnese kořist v pavučině',
    abilities: ['Jedovatý útok', 'Tká pavučiny'],
    description: 'Osminozí lovci stavějící smrtící pasti.',
    tactics: 'Staví pavučiny a čeká, pak paralyzuje jedem.',
    wants: 'Nakrmit svá mláďata.',
    variants: ['Vdova (d10)', 'Vlčí - smečka d6', 'Sekáč - mírumilovný', 'Architekt - tunely', 'Blikající - teleport', 'Přízračný - nehmotný'],
    source: 'Official'
  },
  // === OFFICIAL - HONEY IN THE RAFTERS ===
  {
    id: 12, name: 'Skunk', nameEn: 'Skunk (Shig)', category: 'beast-mammal', scale: 'Warband',
    hp: 10, str: 12, dex: 10, wil: 8, armor: 1,
    attacks: [{ name: 'Kousnutí', damage: 'd8' }, { name: 'Pižmový sprej', damage: '0', special: 'Frightened d4 tvorům' }],
    abilities: ['Warband scale', 'Pižmový sprej'],
    description: 'Velký smrdutý savec hledající jídlo.',
    tactics: 'Nejprve sprej k zastrašení, pak útok.',
    wants: 'V klidu se najíst.',
    source: 'Official - Honey in the Rafters'
  },
  {
    id: 13, name: 'Prokletá včela', nameEn: 'Cursed Bee', category: 'insect', scale: 'Normal',
    hp: 2, str: 6, dex: 12, wil: 6, armor: 0,
    attacks: [{ name: 'Žihadlo', damage: 'd4', special: 'Může způsobit kletbu' }],
    criticalDamage: 'Náhodná kletba',
    abilities: ['Létá', 'Prokletý pyl'],
    description: 'Včely z prokletého úlu sloužící královně Esurit.',
    tactics: 'Útočí v rojích (d6 nebo 2d6).',
    wants: 'Sloužit královně a šířit prokletí.',
    encounterSize: 'd6 nebo 2d6',
    source: 'Official - Honey in the Rafters'
  },
  {
    id: 14, name: 'Lasice', nameEn: 'Weasel', category: 'beast-mammal', scale: 'Normal',
    hp: 6, str: 10, dex: 12, wil: 8, armor: 0,
    attacks: [{ name: 'Kousnutí', damage: 'd6' }],
    abilities: ['Rychlá a hbitá', 'Loví myši'],
    description: 'Štíhlý predátor lovící drobné hlodavce.',
    tactics: 'Rychlé útoky, využívá svou hbitost.',
    wants: 'Lovit a jíst.',
    source: 'Official - Honey in the Rafters'
  },
  {
    id: 15, name: 'Královna Esurit', nameEn: 'Queen Esurit', category: 'supernatural', scale: 'Normal',
    hp: 8, str: 8, dex: 12, wil: 15, armor: 0,
    attacks: [{ name: 'Prokletý dotyk', damage: 'd6', special: 'WIL save nebo kletba' }],
    abilities: ['Ovládá prokleté včely', 'Může sesílat kletby'],
    description: 'Prokletá včelí královna, kdysi normální, nyní zlomyslná.',
    tactics: 'Používá včely k obraně, sama sesílá kletby.',
    wants: 'Šířit prokletí a ovládat úl.',
    source: 'Official - Honey in the Rafters'
  },
  // === OFFICIAL - THE ESTATE ===
  {
    id: 16, name: 'Ježek', nameEn: 'Hedgehog', category: 'beast-mammal', scale: 'Normal',
    hp: 8, str: 12, dex: 8, wil: 10, armor: 2,
    attacks: [{ name: 'Bodliny', damage: 'd6', special: 'Poškození útočníkovi při zásahu zblízka' }],
    abilities: ['Bodliny chrání', 'Může se svinout do klubka'],
    description: 'Bodlinatý savec, obvykle mírumilovný ale nebezpečný.',
    tactics: 'Svine se do klubka při ohrožení.',
    wants: 'Hmyz a klid.',
    source: 'Official - The Estate'
  },
  {
    id: 17, name: 'Rejsek', nameEn: 'Shrew', category: 'beast-mammal', scale: 'Normal',
    hp: 4, str: 8, dex: 14, wil: 6, armor: 0,
    attacks: [{ name: 'Kousnutí', damage: 'd4', special: 'Jedovatý - DEX poškození' }],
    abilities: ['Jedovatý', 'Neustále hladový'],
    description: 'Malý, ale agresivní savec s jedovatým kousnutím.',
    tactics: 'Rychlé útoky, musí neustále jíst.',
    wants: 'Jídlo, hodně jídla.',
    source: 'Official - The Estate'
  },
  {
    id: 18, name: 'Krtek', nameEn: 'Mole', category: 'beast-mammal', scale: 'Normal',
    hp: 6, str: 14, dex: 6, wil: 8, armor: 1,
    attacks: [{ name: 'Drápy', damage: 'd6' }],
    abilities: ['Hrabání tunelů', 'Téměř slepý ale dobrý sluch'],
    description: 'Podzemní savec s mohutnými drápy.',
    tactics: 'Útočí ze země, překvapuje.',
    wants: 'Červy a larvy.',
    source: 'Official - The Estate'
  },
  // === HOMEBREW - VARIOUS SOURCES ===
  {
    id: 19, name: 'Svíčkář', nameEn: 'Candlekin', category: 'supernatural', scale: 'Normal',
    hp: 4, str: 6, dex: 10, wil: 12, armor: 0,
    attacks: [{ name: 'Hořící dotyk', damage: 'd4', special: 'Zapaluje hořlavé' }],
    abilities: ['Oživlá svíčka', 'Bojí se vody a větru'],
    description: 'Oživlá svíčka s vlastní vůlí.',
    tactics: 'Zapaluje okolí, bojí se uhasnutí.',
    wants: 'Hořet navěky.',
    source: 'Homebrew'
  },
  {
    id: 20, name: 'Muchomůrka', nameEn: 'Toadstool', category: 'supernatural', scale: 'Normal',
    hp: 6, str: 8, dex: 6, wil: 14, armor: 1,
    attacks: [{ name: 'Sporový oblak', damage: 'd6', special: 'WIL save nebo halucinace' }],
    abilities: ['Vypouští spory', 'Regeneruje ve vlhku'],
    description: 'Oživlá jedovatá houba.',
    tactics: 'Sporový oblak mate nepřátele.',
    wants: 'Šířit své spory.',
    source: 'Homebrew'
  },
  {
    id: 21, name: 'Mandelinka', nameEn: 'Beetle Knight', category: 'insect', scale: 'Normal',
    hp: 5, str: 12, dex: 8, wil: 10, armor: 2,
    attacks: [{ name: 'Kopí', damage: 'd8' }],
    abilities: ['Těžký krunýř', 'Může létat krátce'],
    description: 'Brouk vycvičený k boji jako rytíř.',
    tactics: 'Útočí jako kavalerie.',
    wants: 'Čest a slávu.',
    source: 'Homebrew'
  },
  {
    id: 22, name: 'Přízračná kočka', nameEn: 'Ghost Cat', category: 'supernatural', scale: 'Warband',
    hp: 12, str: 10, dex: 15, wil: 15, armor: 0,
    attacks: [{ name: 'Přízračné drápnutí', damage: 'd6', special: 'Poškozuje WIL místo STR' }],
    criticalDamage: 'Frightened',
    abilities: ['Warband scale', 'Pouze zranitelná stříbrem/magií', 'Prochází zdmi'],
    description: 'Duch mrtvé kočky, kombinuje hrozbu kočky s duchy.',
    tactics: 'Pronásleduje kořist procházením zdmi.',
    wants: 'Pokračovat v lovu i po smrti.',
    source: 'Homebrew'
  },
  {
    id: 23, name: 'Korgi', nameEn: 'Corgi', category: 'beast-mammal', scale: 'Warband',
    hp: 18, str: 16, dex: 10, wil: 8, armor: 1,
    attacks: [{ name: 'Kousnutí', damage: 'd10' }, { name: 'Dupnutí', damage: 'd8', special: 'Blast' }],
    abilities: ['Warband scale', 'Přátelský ale nebezpečný'],
    description: 'Malý pes z pohledu lidí, obrovská bestie pro myši.',
    tactics: 'Neútočí se zlým úmyslem - jen si hraje.',
    wants: 'Hrát si a dostat pamlsky.',
    source: 'Homebrew'
  },
  {
    id: 24, name: 'Nuno', nameEn: 'Nuno', category: 'supernatural', scale: 'Normal',
    hp: 5, str: 8, dex: 10, wil: 15, armor: 0,
    attacks: [{ name: 'Kletba', damage: '0', special: 'WIL save nebo kletba' }],
    abilities: ['Sesílá kletby', 'Žije v mraveništích', 'Lze usmířit dary'],
    description: 'Duchové sídlící v mraveništích (filipínský folklór).',
    tactics: 'Vyhýbá se boji, proklíná vetřelce.',
    wants: 'Být ponechán v klidu.',
    source: 'Homebrew - Spirited'
  },
  {
    id: 25, name: 'Tsukumogami', nameEn: 'Tsukumogami', category: 'supernatural', scale: 'Normal',
    hp: 4, str: 10, dex: 8, wil: 12, armor: 1,
    attacks: [{ name: 'Podle typu předmětu', damage: 'd6' }],
    abilities: ['Oživlý předmět', 'Loajální k majiteli', 'Různé schopnosti'],
    description: 'Oživlé předměty starší 100 let (japonský folklór).',
    tactics: 'Jedná podle své původní funkce.',
    wants: 'Sloužit nebo se pomstít.',
    source: 'Homebrew - Spirited'
  },
  {
    id: 26, name: 'Nac Mac Feegle', nameEn: 'Nac Mac Feegle', category: 'supernatural', scale: 'Normal',
    hp: 2, str: 12, dex: 14, wil: 6, armor: 0,
    attacks: [{ name: 'Hlavička', damage: 'd6' }, { name: 'Meč', damage: 'd4' }],
    abilities: ['Útočí v rojích (3d6)', 'Extrémně odvážní', 'Milují boj a alkohol'],
    description: 'Maličcí modří bojovníci (inspirace Pratchett).',
    tactics: 'Útočí v davech s bojovým pokřikem.',
    wants: 'Rvačku, whisky a slávu.',
    encounterSize: '3d6',
    source: 'Homebrew - Spirited'
  },
  {
    id: 27, name: 'Lutin', nameEn: 'Lutin', category: 'supernatural', scale: 'Normal',
    hp: 5, str: 8, dex: 15, wil: 12, armor: 0,
    attacks: [{ name: 'Podle zvířecí formy', damage: 'd6' }],
    abilities: ['Mění podobu na zvířata', 'Šprýmař a trickster'],
    description: 'Duchové z francouzského folklóru měnící podobu.',
    tactics: 'Předstírá obyčejné zvíře, pak překvapí.',
    wants: 'Bavit se na účet druhých.',
    source: 'Homebrew - Spirited'
  },
  {
    id: 28, name: 'Kapybara', nameEn: 'Capybara', category: 'beast-mammal', scale: 'Warband',
    hp: 14, str: 14, dex: 8, wil: 12, armor: 1,
    attacks: [{ name: 'Kousnutí', damage: 'd8' }],
    abilities: ['Warband scale', 'Výborný plavec', 'Obvykle mírumilovná'],
    description: 'Obří hlodavec z Amazonie, klidný ale nebezpečný.',
    tactics: 'Vyhýbá se konfliktu, uteče do vody.',
    wants: 'Klid a přístup k vodě.',
    source: 'Homebrew'
  }
];
export const LANDMARKS = [
  'Starý pokroucený dub', 'Opuštěná ptačí budka', 'Rozbitý hliněný květináč', 'Podmáčená louka', 'Hustý malinový keř',
  'Stará kamenná zeď', 'Potok s malým vodopádem', 'Vývrat mohutného stromu', 'Houbový háj', 'Opuštěné liščí doupě',
  'Starý most z klacíků', 'Vyschlá studna', 'Rozpadlý plot', 'Trnitý živý plot', 'Bahenní tůň',
  'Skála s jeskyní', 'Opuštěný včelí úl', 'Velký balvan', 'Louka divokých květin', 'Temný hvozd'
];

export const SETTLEMENT_FEATURES = [
  'Spirálové schodiště hluboko do země', 'Větrný mlýn z ořechové skořápky', 'Visutá lávka mezi větvemi',
  'Podzemní tržiště', 'Svatyně prastarého ducha', 'Věž z náprstku', 'Biblioteca v dutém kmeni',
  'Lázně z kapky rosy', 'Kovárna v železném hřebu', 'Hostinec "U Sýrového Měsíce"',
  'Aréna pro turnaje', 'Astronomická observatoř', 'Alchymistická dílna', 'Diplomatická hala',
  'Skleník vzácných bylin', 'Zbrojnice a cvičiště', 'Přístav na potoku', 'Hudební akademie',
  'Věštírna starého pána', 'Věznice a soudní síň'
];

// ===== TABULKY OSAD PODLE PRAVIDEL =====

// Velikost osady (k6, použij nižší z 2k6)
export const SETTLEMENT_SIZES = [
  { roll: 1, name: 'Farma/zámeček', population: '1–3 rodiny', sizeIndex: 1 },
  { roll: 2, name: 'Křižovatka', population: '3–5 rodin', sizeIndex: 2 },
  { roll: 3, name: 'Víska', population: '50–150 myší', sizeIndex: 3 },
  { roll: 4, name: 'Vesnice', population: '150–300 myší', sizeIndex: 4 },
  { roll: 5, name: 'Město', population: '300–1000 myší', sizeIndex: 5 },
  { roll: 6, name: 'Velkoměsto', population: '1000+ myší', sizeIndex: 6 }
];

// Společenské zřízení (k6 + velikost osady)
export const SETTLEMENT_GOVERNANCE = [
  { roll: '2–3', name: 'Vedená vesnickými stařešiny' },
  { roll: '4–5', name: 'Spravovaná rytířem nebo nižším šlechticem' },
  { roll: '6–7', name: 'Organizovaná cechovním výborem' },
  { roll: '8–9', name: 'Svobodná osada pod správou rady měšťanů' },
  { roll: '10–11', name: 'Domov významnějšího šlechtice' },
  { roll: '12', name: 'Hlavní sídlo šlechtické moci' }
];

// S čím myši obchodují? (k20)
export const SETTLEMENT_TRADES = [
  'Zemědělci pečující o tyčící se plodiny',
  'Dřevorubci s pilami a potahy',
  'Drsní a ošlehaní rybáři se sítěmi a vory',
  'Tmavá a zatuchlá houbová farma',
  'Na každém rovném povrchu se suší obilí',
  'Aromatický sýr, několik let uleželý',
  'Zahrádky vzácných bylin, střežené sušáky',
  'Včelí úly a včelaři v ochranných oděvech',
  'Kupci a obchodníci, často shánějí stráže',
  'Kameníci pracující v nedalekém lomu',
  'Mlýn poháněný velkým vodním kolem',
  'Hlubinný důl na železo, stříbro nebo cín',
  'Chovají bource a tkají jemné hedvábí',
  'Zkušení průzkumníci jeskyní a chodeb',
  'Keramika s pestrobarevnými glazurami',
  'Přádelna vlny ověšená jasnými látkami',
  'Vynikající škola s neukázněnými žáky',
  'Rušná, dobře zásobená tržnice',
  'Páchnoucí hora odpadků, pečlivě přebíraná',
  'Krásně vyřezávaný nábytek z leštěného dřeva'
];

// Co se děje při příchodu hráčských myší? (k20)
export const SETTLEMENT_EVENTS = [
  'Katastrofa, všichni se balí a odcházejí',
  'Svatba, ulice vyzdobené květinami',
  'Příprava na velkou sezónní hostinu',
  'Udeřila nemoc',
  'Hmyz spořádal obsah spižíren',
  'Koná se trh, do osady se sjíždějí kupci',
  'Myši si jdou po krku',
  'Formuje se tlupa na boj s velkým zvířetem',
  'Několik myší se ztratilo',
  'Myší šlechtic vznesl svévolný požadavek',
  'Dorazila potulná divadelní kumpanie',
  'Pohřeb, ulice plné kouře',
  'Podvodník spřádá vyšinuté plány',
  'Domácí brouk se pomátl a napadá myši',
  'Vílí velvyslanec s nemožným požadavkem',
  'V okolí se šíří zvláštní, rychle rostoucí rostlina',
  'Někdo ukradl drahocenné dědictví',
  'Kočičí pán si žádá nehoráznou daň',
  'Mladé myši slaví svátek dospělosti',
  'Na želvím hřbetě přijela čarodějova věž'
];

// Semínka názvů osad (2x k12)
export const SETTLEMENT_NAME_STARTS = [
  ['Dub', 'Bláto'], ['Bob', 'Sova'], ['Vrba', 'Liška'], ['Pařez', 'Žalud'],
  ['Smrk', 'Měď'], ['Měsíc', 'Lup'], ['Zelená', 'Sýr'], ['Černá', 'Mokro'],
  ['Kámen', 'Růže'], ['Vysoký', 'Cín'], ['Buk', 'Dobro'], ['Jablko', 'Kmen']
];
export const SETTLEMENT_NAME_ENDS = [
  ['ov', 'Luh'], ['ovec', 'Háj'], ['ová', 'Věž'], ['ice', 'Újezd'],
  ['iny', 'Most'], ['ín', 'Brod'], ['ec', 'Voda'], ['ník', 'Hora'],
  ['any', 'Nora'], ['ves', 'Lhota'], ['Hradec', 'Hrob'], ['Městec', 'Žďár']
];

// Hospody a hostince
export const INN_NAME_FIRST = [
  'Bílý', 'Zelený', 'Černý', 'Červený', 'Stříbrný', 'Křivý',
  'Přátelský', 'Schovaný', 'Lstivý', 'Skleněný', 'Trnitý', 'Rozbitý'
];
export const INN_NAME_SECOND = [
  'Brouk', 'Liška', 'Špalek', 'Semínko', 'Krysa', 'Sýr',
  'Orel', 'Červ', 'Včela', 'Lucerna', 'Růže', 'Rytíř'
];
export const INN_SPECIALTIES = [
  'Pečená kořeněná mrkev', 'Žížalí vývar', 'Ostružinový koláč', 'Uleželý aromatický sýr',
  'Ječmenná kaše', 'Tlustý rybí řízek', 'Pečené jablko', 'Smažené hmyzí nožičky',
  'Čerstvý máslový chléb', 'Ukořistěné sladkosti', 'Semínka pražená v medu', 'Houbový guláš'
];

// ===== MAUSRITTER CHARACTER TABLES =====

// Mužská křestní jména (40)
export const MALE_FIRST_NAMES = [
  'Mecháček', 'Lístek', 'Oříšek', 'Větvík', 'Klásek', 'Cvrček', 'Šípek', 'Bobek',
  'Brouček', 'Stéblo', 'Peříčko', 'Kamínek', 'Poupě', 'Pupík', 'Šiška', 'Kořínek',
  'Střízlík', 'Vrabčák', 'Sýček', 'Dudek', 'Bodlák', 'Jehlíček', 'Žaludek', 'Kaštánek',
  'Větrník', 'Motýlek', 'Červíček', 'Broučík', 'Pavouček', 'Čmeláček', 'Mraveneček',
  'Hlemýžďák', 'Slimáček', 'Šnečík', 'Ježeček', 'Krteček', 'Lumík', 'Hraboš', 'Plyšáček', 'Chlupatec'
];

// Ženská křestní jména (40)
export const FEMALE_FIRST_NAMES = [
  'Kopřivka', 'Sedmikráska', 'Kapradinka', 'Břečťanka', 'Vrbička', 'Jahodka',
  'Makovka', 'Fialka', 'Konvalinka', 'Pomněnka', 'Rosička', 'Jahůdka', 'Travička',
  'Chudobka', 'Sasanka', 'Chrpička', 'Slzička', 'Hvězdička', 'Perla', 'Mušelínka',
  'Kopreťka', 'Šípková', 'Růženka', 'Lněnka', 'Bledule', 'Sněženka', 'Jitřenka',
  'Večerka', 'Pampelíška', 'Měsíčenka', 'Slunečka', 'Hvězdulka', 'Včelka', 'Muška',
  'Beruška', 'Vážka', 'Kobylka', 'Mušinka', 'Ježurka', 'Myška'
];

// Příjmení s mužskou/ženskou variantou (40)
export const FAMILY_NAMES = [
  { male: 'Bílý', female: 'Bílá' },
  { male: 'Černý', female: 'Černá' },
  { male: 'Čihař', female: 'Čihařová' },
  { male: 'Darček', female: 'Darčková' },
  { male: 'Durman', female: 'Durmanová' },
  { male: 'Hrabal', female: 'Hrabalová' },
  { male: 'Chalva', female: 'Chalvová' },
  { male: 'Jařinka', female: 'Jařinková' },
  { male: 'Jeleňák', female: 'Jeleňáková' },
  { male: 'Jeseň', female: 'Jeseňová' },
  { male: 'Katzenreiser', female: 'Katzenreiserová' },
  { male: 'Máselník', female: 'Máselníková' },
  { male: 'Píp', female: 'Pípová' },
  { male: 'Řešetlák', female: 'Řešetláková' },
  { male: 'Semínko', female: 'Semínková' },
  { male: 'Sníh', female: 'Sněhová' },
  { male: 'Strážný', female: 'Strážná' },
  { male: 'Trnka', female: 'Trnková' },
  { male: 'Urobil', female: 'Urobilová' },
  { male: 'Žvanil', female: 'Žvanilová' },
  { male: 'Březina', female: 'Březinová' },
  { male: 'Kopřiva', female: 'Kopřivová' },
  { male: 'Žitný', female: 'Žitná' },
  { male: 'Medník', female: 'Medníková' },
  { male: 'Šípek', female: 'Šípková' },
  { male: 'Bodlák', female: 'Bodláková' },
  { male: 'Mech', female: 'Mechová' },
  { male: 'Kořen', female: 'Kořenová' },
  { male: 'Pěnkava', female: 'Pěnkavová' },
  { male: 'Vrabec', female: 'Vrabcová' },
  { male: 'Křeček', female: 'Křečková' },
  { male: 'Sýkorka', female: 'Sýkorková' },
  { male: 'Lesník', female: 'Lesníková' },
  { male: 'Polák', female: 'Poláková' },
  { male: 'Stodola', female: 'Stodolová' },
  { male: 'Mlynář', female: 'Mlynářová' },
  { male: 'Podzimek', female: 'Podzimková' },
  { male: 'Zimák', female: 'Zimáková' },
  { male: 'Jarník', female: 'Jarníková' },
  { male: 'Letník', female: 'Letníková' }
];

// Rodná znamení (k6)
export const BIRTHSIGNS = [
  { sign: 'Hvězda', trait: 'Statečná/zbrklá' },
  { sign: 'Kolo', trait: 'Pracovitá/nenápaditá' },
  { sign: 'Žalud', trait: 'Zvědavá/paličatá' },
  { sign: 'Bouřka', trait: 'Štědrá/popudlivá' },
  { sign: 'Měsíc', trait: 'Moudrá/záhadná' },
  { sign: 'Matka', trait: 'Pečující/ustaraná' }
];

// NPC chování - nálady
export const NPC_BEHAVIOR_MOODS = [
  'přátelsky', 'nepřátelsky', 'lhostejně', 'podezíravě', 'nervózně', 'vesele',
  'smutně', 'rozčíleně', 'klidně', 'vyděšeně', 'znuděně', 'nadšeně',
  'rezervovaně', 'důvěřivě', 'pohrdavě', 'úslužně', 'tajemně', 'vychytrale'
];

// NPC chování - akce
export const NPC_BEHAVIOR_ACTIONS = [
  'hledá něco', 'utíká před někým', 'sleduje někoho', 'čeká na něco',
  'opravuje věc', 'sbírá zásoby', 'obchoduje', 'odpočívá', 'hlídkuje',
  'vaří jídlo', 'uklízí', 'zpívá', 'bručí', 'krade', 'pomlouvá',
  'vypráví příběh', 'hádá se', 'prosí o pomoc', 'nabízí služby'
];

// NPC chování - motivace
export const NPC_BEHAVIOR_MOTIVATIONS = [
  'chce vydělat ďobky', 'hledá ztracenou věc', 'chrání někoho blízkého',
  'touží po dobrodružství', 'utíká před minulostí', 'chce pomstu',
  'hledá nový domov', 'sbírá informace', 'chce být nechán/a na pokoji',
  'hledá přátele', 'touží po moci', 'chce napravit křivdu',
  'chrání tajemství', 'hledá lásku', 'chce dokázat svou hodnotu'
];

// NPC tajemství
export const NPC_SECRETS = [
  'pracuje pro nepřátelskou frakci', 'má dluh u nebezpečné osoby',
  'je na útěku před zákonem', 'skrývá magickou schopnost',
  'ví o ukrytém pokladu', 'je členem tajného spolku',
  'má zakázanou lásku', 'spáchal/a zločin v minulosti',
  'zná cestu do nebezpečného místa', 'je ve skutečnosti šlechtic/šlechtična v přestrojení',
  'má smrtelnou nemoc', 'ukrývá někoho hledaného',
  'plánuje zradu', 'je špehem jiné osady',
  'má dědictví, o kterém neví', 'viděl/a něco, co neměl/a'
];

// NPC reakce na hráče
export const NPC_REACTIONS = [
  'nabídne pomoc za úplatu', 'chce něco výměnou',
  'bude varovat před nebezpečím', 'požádá o laskavost',
  'pokusí se oklamat', 'bude jednat agresivně',
  'nabídne informace', 'bude ignorovat',
  'požádá o ochranu', 'zkusí ukrást věc',
  'nabídne spojenectví', 'bude vyjednávat',
  'utíká pryč', 'zavolá na pomoc',
  'zve k jídlu/pití', 'vypráví příběh o sobě'
];

// NPC role/povolání
export const NPC_ROLES = [
  'Kovář', 'Kuchař', 'Sládek', 'Lékař', 'Léčitelka', 'Kupec', 'Stráž',
  'Rybář', 'Honák brouků', 'Horník', 'Pěstitel hub', 'Tkadlena', 'Švec',
  'Tesař', 'Kartograf', 'Učenec', 'Knihovník', 'Hospodský', 'Pekař',
  'Sběrač', 'Stopař', 'Kurýr', 'Zbrojíř', 'Průvodce', 'Kejklíř',
  'Hudebník', 'Vypravěč', 'Věštec', 'Kněz', 'Zloděj', 'Pašerák',
  'Dobrodruh', 'Žoldnéř', 'Rytíř', 'Podomní obchodník', 'Dráteník',
  'Bylinkář', 'Kožešník', 'Sladovník', 'Vorař', 'Kameník', 'Mlynář'
];

// ============================================
// GENERÁTOR UDÁLOSTÍ - Tabulky pro myší svět
// ============================================

// Focus události - koho/čeho se týká (d20)
export const EVENT_FOCUS = [
  { roll: 1, focus: 'pc_positive', label: 'Hráčská myš - pozitivní', description: 'Něco dobrého pro hráčskou postavu' },
  { roll: 2, focus: 'pc_positive', label: 'Hráčská myš - pozitivní', description: 'Příležitost nebo výhoda' },
  { roll: 3, focus: 'pc_negative', label: 'Hráčská myš - negativní', description: 'Problém nebo komplikace pro hráče' },
  { roll: 4, focus: 'pc_negative', label: 'Hráčská myš - negativní', description: 'Nebezpečí nebo ztráta' },
  { roll: 5, focus: 'npc_positive', label: 'NPC - pozitivní', description: 'Něco dobrého pro NPC' },
  { roll: 6, focus: 'npc_positive', label: 'NPC - pozitivní', description: 'NPC získává výhodu' },
  { roll: 7, focus: 'npc_negative', label: 'NPC - negativní', description: 'Problém pro NPC' },
  { roll: 8, focus: 'npc_negative', label: 'NPC - negativní', description: 'NPC v nesnázích' },
  { roll: 9, focus: 'npc_action', label: 'NPC jedná', description: 'NPC podniká významnou akci' },
  { roll: 10, focus: 'npc_action', label: 'NPC jedná', description: 'NPC mění situaci' },
  { roll: 11, focus: 'settlement', label: 'Osada', description: 'Událost ovlivňuje celou osadu' },
  { roll: 12, focus: 'settlement', label: 'Osada', description: 'Změna v komunitě' },
  { roll: 13, focus: 'faction', label: 'Frakce', description: 'Frakce podniká kroky' },
  { roll: 14, focus: 'faction', label: 'Frakce', description: 'Změna v mocenské rovnováze' },
  { roll: 15, focus: 'environment', label: 'Prostředí', description: 'Změna v přírodě nebo počasí' },
  { roll: 16, focus: 'threat', label: 'Hrozba', description: 'Objevuje se nebezpečí' },
  { roll: 17, focus: 'new_element', label: 'Nový prvek', description: 'Objeví se nová postava, místo nebo věc' },
  { roll: 18, focus: 'new_element', label: 'Nový prvek', description: 'Nečekaný objev' },
  { roll: 19, focus: 'remote', label: 'Vzdálená událost', description: 'Něco se děje jinde, ale má důsledky' },
  { roll: 20, focus: 'current_context', label: 'Aktuální kontext', description: 'Přímo souvisí s probíhající scénou' }
];

// Akce pro generátor událostí - myší svět (d20)
export const EVENT_ACTIONS = [
  'Hledá', 'Chrání', 'Ukrývá', 'Obchoduje', 'Opravuje',
  'Krade', 'Prozkoumává', 'Varuje', 'Slaví', 'Truchlí',
  'Bojuje', 'Léčí', 'Staví', 'Ničí', 'Doručuje',
  'Prchá', 'Vyjednává', 'Špehuje', 'Učí', 'Cestuje'
];

// Subjekty pro generátor událostí - myší svět (d20)
export const EVENT_SUBJECTS = [
  'potravu', 'úkryt', 'rodinu', 'poklad', 'tajemství',
  'nebezpečí', 'cestu', 'nástroj', 'zbraň', 'osadu',
  'predátora', 'artefakt', 'zprávu', 'spojence', 'nepřítele',
  'území', 'tradici', 'vzpomínku', 'magii', 'přežití'
];

// Komplikace událostí (d12)
export const EVENT_COMPLICATIONS = [
  'Ale je to past!',
  'Někdo sleduje z povzdálí.',
  'Čas se krátí - musí to být rychle.',
  'Je to prokleté nebo nebezpečné.',
  'Je tu konkurence - někdo jiný to chce taky.',
  'Špatné počasí komplikuje situaci.',
  'Zrada! Někdo není tím, za koho se vydává.',
  'Cena je příliš vysoká.',
  'Vyžaduje to oběť nebo těžké rozhodnutí.',
  'Informace jsou mylné nebo neúplné.',
  'Morální dilema - co je správné?',
  'Nečekaný svědek viděl, co se stalo.'
];

// Zvěsti a drby v osadě (d20)
export const SETTLEMENT_RUMORS = [
  'Prý se v lese objevil obří predátor...',
  'Slyšel/a jsem, že starosta něco tají.',
  'Kupec z východu prodává podivné zboží.',
  'Zmizela další myš - už třetí tento měsíc!',
  'V dolech prý našli něco zvláštního.',
  'Frakce z města plánuje rozšíření území.',
  'Stará věštkyně předpověděla neštěstí.',
  'Objevili starou mapu k zapomenutému místu.',
  'Ceny potravin stoupají - bude hlad?',
  'Tajný tunel vede přímo pod hradby.',
  'Šlechtic hledá někoho pro diskrétní práci.',
  'V hostinci se scházejí podezřelé postavy.',
  'Byla spatřena sova poblíž osady.',
  'Bylinkářka umí víc, než přiznává.',
  'Starý veterán zná cestu přes bažiny.',
  'Kdosi krade z obecních zásob.',
  'Přijde velká bouře - zásoby docházejí.',
  'Rivalská osada chystá něco nekalého.',
  'V ruinách na kopci straší.',
  'Cestující vypravěč zná příběhy o pokladech.'
];

// Co se děje v osadě právě teď (d20)
export const SETTLEMENT_HAPPENINGS = [
  'Trh je v plném proudu - ruch a shon.',
  'Probíhá soudní jednání na náměstí.',
  'Svatba! Celá osada slaví.',
  'Pohřeb významné osobnosti.',
  'Přijeli obchodníci z daleka.',
  'Stráže prohledávají domy - hledají někoho.',
  'Oprava hradeb - všichni musí pomáhat.',
  'Festival sklizně - jídlo a tanec.',
  'Požár! Část osady hoří.',
  'Tajná schůzka v temné uličce.',
  'Hádka mezi dvěma významnými rodinami.',
  'Verbování do armády nebo stráže.',
  'Příjezd šlechtice s doprovodem.',
  'Nemoc se šíří osadou.',
  'Zásoby dochází - napjatá atmosféra.',
  'Oslava narozenin starosty.',
  'Tajemný cizinec klade otázky.',
  'Děti si hrají - ale našly něco divného.',
  'Řemeslníci pracují na velkém projektu.',
  'Klidný den - možná až příliš klidný...'
];

// Přírodní události a počasí (d12)
export const NATURE_EVENTS = [
  'Prudký déšť - cesty jsou zatopené.',
  'Mlha zahaluje krajinu - snížená viditelnost.',
  'První mráz - zima přichází.',
  'Horko a sucho - zásoby vody docházejí.',
  'Silný vítr - létající úlomky jsou nebezpečné.',
  'Záplava! Voda stoupá.',
  'Krásný slunečný den - ideální pro cestování.',
  'Bouřka s blesky - myši se schovávají.',
  'Sněžení - cesty jsou neprůchodné.',
  'Podzimní listí padá - krajina se mění.',
  'Jarní tání - všude je bláto.',
  'Noční chlad - potřeba ohně a přístřeší.'
];

// Hrozby v divočině (d12)
export const WILDERNESS_THREATS = [
  'Stopy predátora vedou tímto směrem.',
  'Slyšet je štěkot - lišky jsou blízko!',
  'Pavučiny blokují cestu vpřed.',
  'Had se vyhřívá na slunci přímo v cestě.',
  'Ropucha číhá u potoka.',
  'Sršní hnízdo visí nad stezkou.',
  'Lasička prohledává okolí.',
  'Kočičí pach je ve vzduchu.',
  'Vrána kroužíš nad hlavou.',
  'Jezevčí nora - teritorium je obsazeno.',
  'Krtek vyhazuje hlínu - tunely se hroutí.',
  'Mravenci pochodují ve válečné formaci.'
];

// Nálezy a příležitosti (d12)
export const DISCOVERIES = [
  'Opuštěný tábor - kdo tu byl?',
  'Ztracený náklad - zboží leží na zemi.',
  'Vstup do neznámého tunelu.',
  'Mrtvá myš - co se jí stalo?',
  'Ukrytá skrýš s poklady.',
  'Zraněný tvor potřebuje pomoc.',
  'Zaniklá osada - jen ruiny zůstaly.',
  'Magický předmět září ve tmě.',
  'Mapa vyřezaná do kůry stromu.',
  'Studánka s čistou vodou.',
  'Houbová políčka - zásoba jídla!',
  'Podivný monument starověké civilizace.'
];

// Barva srsti (k6)
export const FUR_COLORS = ['Čokoládová', 'Černá', 'Bílá', 'Světle hnědá', 'Šedá', 'Namodralá'];

// Vzor srsti (k6)
export const FUR_PATTERNS = ['Jednolitá', 'Mourovatá', 'Strakatá', 'Pruhovaná', 'Tečkovaná', 'Skvrnitá'];

// Výrazné rysy (k66)
export const DISTINCTIVE_FEATURES = {
  '1-1': 'Tělo plné jizev', '1-2': 'Korpulentní tělo', '1-3': 'Vychrtlé tělo',
  '1-4': 'Klackovité tělo', '1-5': 'Drobné tělíčko', '1-6': 'Rozložité tělo',
  '2-1': 'Válečné malování', '2-2': 'Cizokrajné oblečení', '2-3': 'Elegantní oblečení',
  '2-4': 'Záplatované oblečení', '2-5': 'Módní oblečení', '2-6': 'Neprané oblečení',
  '3-1': 'Useknuté ucho', '3-2': 'Neforemný obličej', '3-3': 'Krásný obličej',
  '3-4': 'Baculatý obličej', '3-5': 'Jemné rysy v obličeji', '3-6': 'Protáhlý obličej',
  '4-1': 'Načesaná srst', '4-2': 'Dredy', '4-3': 'Nabarvená srst',
  '4-4': 'Oholená srst', '4-5': 'Kudrnatá srst', '4-6': 'Sametová srst',
  '5-1': 'Oči temné jako noc', '5-2': 'Páska přes oko', '5-3': 'Krvavě rudé oči',
  '5-4': 'Moudrý pohled', '5-5': 'Pronikavý pohled', '5-6': 'Blyštivé oči',
  '6-1': 'Zastřižený ocásek', '6-2': 'Ocásek jako bič', '6-3': 'Chocholatý ocásek',
  '6-4': 'Pahýl ocásku', '6-5': 'Chápavý ocásek', '6-6': 'Zakroucený ocásek'
};

// Tabulka původů - 36 kombinací (BO 1-6 × Ďobky 1-6)
export const ORIGINS = {
  '1-1': { name: 'Pokusná myš', itemA: 'Kouzlo: Kouzelná střela', itemB: 'Olověný plášť (těžká zbroj)' },
  '1-2': { name: 'Kuchyňský slídil', itemA: 'Štít a kabátec (lehká zbroj)', itemB: 'Hrnce' },
  '1-3': { name: 'Uprchlík z klece', itemA: 'Kouzlo: Srozumitelnost', itemB: 'Láhev mléka' },
  '1-4': { name: 'Čarodějnice', itemA: 'Kouzlo: Zahojení', itemB: 'Vonná tyčka' },
  '1-5': { name: 'Kožešník', itemA: 'Štít a kabátec (lehká zbroj)', itemB: 'Silné nůžky' },
  '1-6': { name: 'Pouliční rváč', itemA: 'Dýka (lehká, k6)', itemB: 'Láhev kávy' },
  '2-1': { name: 'Žebravý kněz', itemA: 'Kouzlo: Zotavení', itemB: 'Svatý symbol' },
  '2-2': { name: 'Honák brouků', itemA: 'Pomocník: věrný brouk', itemB: 'Tyč, 15 cm' },
  '2-3': { name: 'Sládek', itemA: 'Pomocník: opilý světlonoš', itemB: 'Soudek piva' },
  '2-4': { name: 'Rybář', itemA: 'Síť', itemB: 'Jehla (lehká, k6)' },
  '2-5': { name: 'Kovář', itemA: 'Kladivo (střední, k6/k8)', itemB: 'Pilník na železo' },
  '2-6': { name: 'Dráteník', itemA: 'Drát, klubko', itemB: 'Elektrická lampa' },
  '3-1': { name: 'Dřevorubec', itemA: 'Sekera (střední, k6/k8)', itemB: 'Motouz, klubko' },
  '3-2': { name: 'Člen netopýřího kultu', itemA: 'Kouzlo: Tma', itemB: 'Pytlík netopýřích zubů' },
  '3-3': { name: 'Horník v cínovém dole', itemA: 'Krumpáč (střední, k6/k8)', itemB: 'Lucerna' },
  '3-4': { name: 'Sběrač odpadků', itemA: 'Hák na odpadky (těžká, k10)', itemB: 'Zrcátko' },
  '3-5': { name: 'Stěnolezec', itemA: 'Rybářský háček', itemB: 'Nit, cívka' },
  '3-6': { name: 'Kupec', itemA: 'Pomocník: tažná krysa', itemB: 'Směnka od šlechtice na 20 ď' },
  '4-1': { name: 'Vorař', itemA: 'Kladivo (střední, k6/k8)', itemB: 'Dřevěné klíny' },
  '4-2': { name: 'Honák žížal', itemA: 'Tyč, 15 cm', itemB: 'Mýdlo' },
  '4-3': { name: 'Vlaštovkář', itemA: 'Rybářský háček', itemB: 'Ochranné brýle' },
  '4-4': { name: 'Kanálník', itemA: 'Pilník na železo', itemB: 'Nit, cívka' },
  '4-5': { name: 'Žalářník', itemA: 'Řetěz, 15 cm', itemB: 'Kopí (těžká, k10)' },
  '4-6': { name: 'Pěstitel hub', itemA: 'Sušené houby (zásoby)', itemB: 'Maska proti spórám' },
  '5-1': { name: 'Stavitel hrází', itemA: 'Lopata', itemB: 'Dřevěné klíny' },
  '5-2': { name: 'Kartograf', itemA: 'Brk a inkoust', itemB: 'Kompas' },
  '5-3': { name: 'Vykradač pastiček', itemA: 'Kus sýra', itemB: 'Lepidlo' },
  '5-4': { name: 'Tulák', itemA: 'Stan', itemB: 'Mapa k pokladu, pochybná' },
  '5-5': { name: 'Pěstitel obilí', itemA: 'Kopí (těžká, k10)', itemB: 'Píšťalka' },
  '5-6': { name: 'Poslíček', itemA: 'Deka', itemB: 'Dokumenty, zapečetěné' },
  '6-1': { name: 'Trubadúr', itemA: 'Hudební nástroj', itemB: 'Maskovací sada' },
  '6-2': { name: 'Hazardní hráč', itemA: 'Zatížené kostky', itemB: 'Zrcátko' },
  '6-3': { name: 'Sběrač mízy', itemA: 'Vědro', itemB: 'Dřevěné klíny' },
  '6-4': { name: 'Včelař', itemA: 'Sklenice medu', itemB: 'Síť' },
  '6-5': { name: 'Knihovník', itemA: 'Útržek ze starodávné knihy', itemB: 'Brk a inkoust' },
  '6-6': { name: 'Zchudlý šlechtic', itemA: 'Plstěný klobouk', itemB: 'Parfém' }
};

// Počáteční zbraně k výběru
export const STARTING_WEAPONS = [
  { name: 'Klacek', damage: 'k6', weight: 'improvised', slots: 1 },
  { name: 'Jehla', damage: 'k6', weight: 'light', slots: 1 },
  { name: 'Dýka', damage: 'k6', weight: 'light', slots: 1 },
  { name: 'Hůl', damage: 'k6', weight: 'light', slots: 1 },
  { name: 'Meč', damage: 'k6/k8', weight: 'medium', slots: 1 },
  { name: 'Sekera', damage: 'k6/k8', weight: 'medium', slots: 1 },
  { name: 'Kladivo', damage: 'k6/k8', weight: 'medium', slots: 1 },
  { name: 'Kopí', damage: 'k10', weight: 'heavy', slots: 2 },
  { name: 'Hák', damage: 'k10', weight: 'heavy', slots: 2 },
  { name: 'Prak', damage: 'k6', weight: 'ranged_light', slots: 1 },
  { name: 'Ruční kuše', damage: 'k6', weight: 'ranged_light', slots: 1 },
  { name: 'Luk', damage: 'k8', weight: 'ranged_heavy', slots: 2 },
];

// Backward compatibility aliases
export const FIRST_NAMES = [...MALE_FIRST_NAMES, ...FEMALE_FIRST_NAMES];
export const LAST_NAMES = FAMILY_NAMES.map(f => f.male);
export const PHYSICAL_DETAILS = Object.values(DISTINCTIVE_FEATURES);

// Typy pomocníků k verbování (podle pravidel Mausritter)
// HP se hází k6, staty 2k6 - stejné pro všechny typy
export const HIRELING_TYPES = [
  { type: 'torch', name: 'Světlonoš', dice: 'd6', cost: '1 ď', skill: 'Nosí pochodně, osvětluje cestu' },
  { type: 'laborer', name: 'Dělník', dice: 'd6', cost: '2 ď', skill: 'Nošení nákladu, jednoduché práce' },
  { type: 'tunneler', name: 'Kopáč chodeb', dice: 'd4', cost: '5 ď', skill: 'Kopání tunelů, odstraňování překážek' },
  { type: 'smith', name: 'Zbrojíř/kovář', dice: 'd2', cost: '8 ď', skill: 'Opravy zbraní a zbrojí v terénu' },
  { type: 'guide', name: 'Místní průvodce', dice: 'd4', cost: '10 ď', skill: 'Zná okolí, vyhne se nebezpečím' },
  { type: 'soldier', name: 'Zbrojmyš', dice: 'd6', cost: '10 ď', skill: 'Bojovník - umí bojovat!' },
  { type: 'scholar', name: 'Učenec', dice: 'd2', cost: '20 ď', skill: 'Čtení, magie, historie, záhady' },
  { type: 'knight', name: 'Rytíř', dice: 'd3', cost: '25 ď', skill: 'Elitní bojovník s vybavením' },
  { type: 'interpreter', name: 'Tlumočník', dice: 'd2', cost: '30 ď', skill: 'Mluví s jinými tvory/jazyky' },
];

export const NPC_QUIRKS = [
  'Mluví ve třetí osobě', 'Sbírá lesklé věci', 'Neustále si opakuje plány', 'Má tajného mazlíčka',
  'Věří v prastaré proroctví', 'Nikdy nemluví o minulosti', 'Je posedlý sýrem', 'Cituje básně',
  'Má strach z koček', 'Je přehnaně optimistický', 'Nedůvěřuje cizincům', 'Je závislý na hazardu',
  'Shromažďuje recepty', 'Je tajně zamilovaný', 'Hledá ztraceného příbuzného', 'Má tajnou identitu',
  'Je bývalý pirát', 'Slyší hlasy', 'Je mistr převleků', 'Neumí lhát'
];

export const NPC_GOALS = [
  'Najít vzácnou bylinu', 'Pomstít starou křivdu', 'Otevřít vlastní obchod', 'Osvobodit vězněného přítele',
  'Objevit ztracené město', 'Zničit nebezpečný artefakt', 'Najít léčbu nemoci', 'Doručit důležitou zprávu',
  'Uniknout pronásledovatelům', 'Získat uznání', 'Splatit dluh', 'Ochránit rodinu',
  'Odhalit pravdu o minulosti', 'Najít smysl života', 'Vytvořit mistrovské dílo', 'Získat moc',
  'Najít domov', 'Překonat strach', 'Vyléčit prokletí', 'Založit dynastii'
];

export const DUNGEON_THEMES = [
  'Opuštěný důl', 'Prastarý chrám', 'Kanalizační systém', 'Síť kořenů', 'Dutý strom',
  'Zdi lidského domu', 'Podzemní říční jeskyně', 'Hmyzí úl', 'Opuštěné ptačí hnízdo', 'Houbový les',
  'Zamrzlá dutina', 'Zatopený sklep', 'Staré hodinové ústrojí', 'Tunely v kompostu', 'Praskliny v kamenné zdi',
  'Kostnice', 'Zapomenutá spíž', 'Zahradní kůlna', 'Vílí mohyla', 'Prostor mezi světy'
];

export const DUNGEON_DENIZENS = [
  'Havěť (brouci, stonožky)', 'Nepřátelské krysy', 'Pavouci', 'Duchové', 'Nepřátelské víly',
  'Kultisté', 'Bandité', 'Divoká zvířata', 'Oživlé předměty', 'Unikátní stvoření'
];

export const CONDITIONS = [
  { id: 'hungry', name: 'Hlad', effect: 'Nenajíst se celý den. Odstraní se konzumací zásob.' },
  { id: 'exhausted', name: 'Vyčerpání', effect: 'Méně než 6h odpočinku nebo těžké cestování. Odstraní se dlouhým odpočinkem.' },
  { id: 'injured', name: 'Poranění', effect: 'Nevýhoda na hody SÍL a MRŠ. Odstraní se odpočinkem (týden) nebo kouzlem Zahojení.' },
  { id: 'frightened', name: 'Vystrašení', effect: 'Musí prchat od zdroje strachu. Odstraní se kouzlem Zotavení.' },
  { id: 'confused', name: 'Pomatení', effect: 'Při nezdařeném sesílání kouzla. Postih na volní hody.' },
];

export const SPELLS = [
  { id: 'invisibility', name: 'Neviditelnost', effect: 'Staň se neviditelným na 1 kolo', range: 'Dotyk' },
  { id: 'heal', name: 'Léčení', effect: 'Obnov 1d6 STR', range: 'Dotyk' },
  { id: 'light', name: 'Světlo', effect: 'Vytvoř světlo jako svíčka na 1 hodinu', range: 'Dotyk' },
  { id: 'darkness', name: 'Tma', effect: 'Vytvoř magickou tmu v oblasti', range: '10 stop' },
  { id: 'charm', name: 'Okouzlení', effect: 'Cíl tě považuje za přítele', range: '30 stop' },
  { id: 'sleep', name: 'Spánek', effect: 'Uspi 1d6 HD stvoření', range: '30 stop' },
  { id: 'fireball', name: 'Ohnivá koule', effect: '2d6 ohnivé poškození v oblasti', range: '60 stop' },
  { id: 'shield', name: 'Štít', effect: '+2 armor do konce boje', range: 'Sebe' },
  { id: 'fear', name: 'Strach', effect: 'Cíl musí utéct na 1d4 kol', range: '30 stop' },
  { id: 'illusion', name: 'Iluze', effect: 'Vytvoř přesvědčivý obraz', range: '60 stop' }
];

// --- UTILITY FUNCTIONS ---

// ============================================
// SAVE VERSION & MIGRATION SYSTEM
// ============================================
// Increment this when save format changes!
export const SAVE_VERSION = 6;

// Migration functions - each upgrades from version N to N+1
export const migrations = {
  // v1 -> v2: Single character to parties system
  1: (data) => {
    if (data.character && !data.parties) {
      const newId = Math.random().toString(36).substr(2, 9);
      const party = {
        id: newId,
        name: 'Družina',
        members: [{ ...data.character, id: data.character.id || Math.random().toString(36).substr(2, 9) }],
        gameTime: data.gameTime || { watch: 0, day: 1, week: 1, season: 'spring', totalWatches: 0 },
        createdAt: new Date().toISOString()
      };
      return {
        ...data,
        version: 2,
        parties: [party],
        activePartyId: party.id,
        activeCharacterId: party.members[0].id
      };
    }
    return { ...data, version: 2 };
  },
  
  // v2 -> v3: Added settlements and worldNPCs
  2: (data) => {
    return {
      ...data,
      version: 3,
      settlements: data.settlements || [],
      worldNPCs: data.worldNPCs || []
    };
  },

  // v3 -> v4: Ensure all parties have new gameTime format
  3: (data) => {
    const migratedParties = (data.parties || []).map(party => ({
      ...party,
      gameTime: {
        day: party.gameTime?.day || 1,
        season: party.gameTime?.season || 'spring',
        watch: party.gameTime?.watch ?? 0,  // 0-3 index, ?? protože 0 je validní hodnota
        turn: party.gameTime?.turn ?? 0,
        restedToday: party.gameTime?.restedToday ?? false
      }
    }));
    return {
      ...data,
      version: 4,
      parties: migratedParties
    };
  },

  // v4 -> v5: Added sceneState to parties (Mythic GME style scenes)
  4: (data) => {
    const migratedParties = (data.parties || []).map(party => ({
      ...party,
      sceneState: party.sceneState || { ...DEFAULT_SCENE_STATE }
    }));
    return {
      ...data,
      version: 5,
      parties: migratedParties
    };
  },

  // v5 -> v6: Added maps (tldraw dungeon/world maps)
  5: (data) => {
    return {
      ...data,
      version: 6,
      maps: data.maps || [],
      activeMapId: data.activeMapId || null
    };
  }
};

// Main migration function - applies all needed migrations
export const migrateSaveData = (data) => {
  let currentData = { ...data };
  let version = data.version || 1; // Old saves without version are v1
  
  // Apply migrations one by one until we reach current version
  while (version < SAVE_VERSION) {
    if (migrations[version]) {
      console.log(`Migrating save from v${version} to v${version + 1}`);
      currentData = migrations[version](currentData);
      version = currentData.version;
    } else {
      console.warn(`No migration found for v${version}, skipping to v${SAVE_VERSION}`);
      currentData.version = SAVE_VERSION;
      break;
    }
  }
  
  // Ensure all expected fields exist with defaults
  return {
    version: SAVE_VERSION,
    parties: currentData.parties || [],
    activePartyId: currentData.activePartyId || null,
    activeCharacterId: currentData.activeCharacterId || null,
    journal: currentData.journal || [],
    factions: currentData.factions || [],
    settlements: currentData.settlements || [],
    worldNPCs: currentData.worldNPCs || [],
    maps: currentData.maps || [],
    activeMapId: currentData.activeMapId || null,
    // Preserve any extra data for forward compatibility
    _extra: Object.keys(currentData)
      .filter(k => !['version', 'parties', 'activePartyId', 'activeCharacterId', 'journal', 'factions', 'settlements', 'worldNPCs', 'maps', 'activeMapId', 'exportDate', 'character', 'gameTime'].includes(k))
      .reduce((acc, k) => ({ ...acc, [k]: currentData[k] }), {})
  };
};

// ============================================
// MALÝ SVĚT - GENERÁTORY PRO PRŮZKUM
// ============================================

// 1. SENZORICKÝ PRIMING (k66)
export const SENSORY_PRIMING_TABLE = {
  11: { smell: 'Ostrý / Chemický (Savo, Baterie)', tactile: 'Vibrující (Jemné brnění v tlapkách)', hint: 'Toxicita: Riziko poškození plic (CON save) nebo koroze vybavení', icon: '⚠️' },
  12: { smell: 'Ostrý / Chemický (Savo, Baterie)', tactile: 'Vibrující (Jemné brnění v tlapkách)', hint: 'Toxicita: Riziko poškození plic (CON save) nebo koroze vybavení', icon: '⚠️' },
  13: { smell: 'Ostrý / Chemický (Savo, Baterie)', tactile: 'Vibrující (Jemné brnění v tlapkách)', hint: 'Toxicita: Riziko poškození plic (CON save) nebo koroze vybavení', icon: '⚠️' },
  14: { smell: 'Kvasící / Sladkokyselý (Ocet, Pivo)', tactile: 'Lepkavý (Zpomaluje pohyb)', hint: 'Zdroje: Pravděpodobně jídlo, ale také hmyz (mravenci)', icon: '🍔' },
  15: { smell: 'Kvasící / Sladkokyselý (Ocet, Pivo)', tactile: 'Lepkavý (Zpomaluje pohyb)', hint: 'Zdroje: Pravděpodobně jídlo, ale také hmyz (mravenci)', icon: '🍔' },
  16: { smell: 'Kvasící / Sladkokyselý (Ocet, Pivo)', tactile: 'Lepkavý (Zpomaluje pohyb)', hint: 'Zdroje: Pravděpodobně jídlo, ale také hmyz (mravenci)', icon: '🍔' },
  21: { smell: 'Pižmový / Močový (Zvíře, Hnízdo)', tactile: 'Teplý / Vlhký (Jako dech)', hint: 'Teritorium: Zvyšuje šanci na Náhodné setkání o 1 z 6', icon: '⚔️' },
  22: { smell: 'Pižmový / Močový (Zvíře, Hnízdo)', tactile: 'Teplý / Vlhký (Jako dech)', hint: 'Teritorium: Zvyšuje šanci na Náhodné setkání o 1 z 6', icon: '⚔️' },
  23: { smell: 'Pižmový / Močový (Zvíře, Hnízdo)', tactile: 'Teplý / Vlhký (Jako dech)', hint: 'Teritorium: Zvyšuje šanci na Náhodné setkání o 1 z 6', icon: '⚔️' },
  24: { smell: 'Zatuchlý / Prachový (Starý papír)', tactile: 'Měkký / Tlumící (Pohlcuje zvuk)', hint: 'Úkryt: Ideální pro Odpočinek, bonus k Plížení', icon: '⛺' },
  25: { smell: 'Zatuchlý / Prachový (Starý papír)', tactile: 'Měkký / Tlumící (Pohlcuje zvuk)', hint: 'Úkryt: Ideální pro Odpočinek, bonus k Plížení', icon: '⛺' },
  26: { smell: 'Zatuchlý / Prachový (Starý papír)', tactile: 'Měkký / Tlumící (Pohlcuje zvuk)', hint: 'Úkryt: Ideální pro Odpočinek, bonus k Plížení', icon: '⛺' },
  31: { smell: 'Mléčný / Žluklý (Starý tuk)', tactile: 'Kluzký / Mastný (Olejový film)', hint: 'Nebezpečí pádu: Nevýhoda na DEX testy při běhu/šplhání', icon: '❗' },
  32: { smell: 'Mléčný / Žluklý (Starý tuk)', tactile: 'Kluzký / Mastný (Olejový film)', hint: 'Nebezpečí pádu: Nevýhoda na DEX testy při běhu/šplhání', icon: '❗' },
  33: { smell: 'Mléčný / Žluklý (Starý tuk)', tactile: 'Kluzký / Mastný (Olejový film)', hint: 'Nebezpečí pádu: Nevýhoda na DEX testy při běhu/šplhání', icon: '❗' },
  34: { smell: 'Kovový / Krev (Rez, Měď)', tactile: 'Studený / Vodivý (Vysává teplo)', hint: 'Hazard: Elektrické výboje nebo ostré hrany (Tetanus)', icon: '⚡' },
  35: { smell: 'Kovový / Krev (Rez, Měď)', tactile: 'Studený / Vodivý (Vysává teplo)', hint: 'Hazard: Elektrické výboje nebo ostré hrany (Tetanus)', icon: '⚡' },
  36: { smell: 'Kovový / Krev (Rez, Měď)', tactile: 'Studený / Vodivý (Vysává teplo)', hint: 'Hazard: Elektrické výboje nebo ostré hrany (Tetanus)', icon: '⚡' },
  41: { smell: 'Spálený / Ozon (Zkrat, Popel)', tactile: 'Statický (Srst se ježí)', hint: 'Nestabilita: Místo může začít hořet nebo dát ránu', icon: '🔥' },
  42: { smell: 'Spálený / Ozon (Zkrat, Popel)', tactile: 'Statický (Srst se ježí)', hint: 'Nestabilita: Místo může začít hořet nebo dát ránu', icon: '🔥' },
  43: { smell: 'Spálený / Ozon (Zkrat, Popel)', tactile: 'Statický (Srst se ježí)', hint: 'Nestabilita: Místo může začít hořet nebo dát ránu', icon: '🔥' },
  44: { smell: 'Mýdlový / Syntetický (Prášek)', tactile: 'Práškový / Sypký (Jako sníh)', hint: 'Ztráta stopy: Zde nelze stopovat čichem. Prach dráždí oči', icon: '🌫️' },
  45: { smell: 'Mýdlový / Syntetický (Prášek)', tactile: 'Práškový / Sypký (Jako sníh)', hint: 'Ztráta stopy: Zde nelze stopovat čichem. Prach dráždí oči', icon: '🌫️' },
  46: { smell: 'Mýdlový / Syntetický (Prášek)', tactile: 'Práškový / Sypký (Jako sníh)', hint: 'Ztráta stopy: Zde nelze stopovat čichem. Prach dráždí oči', icon: '🌫️' },
  51: { smell: 'Hnilobný / Masitý (Mršina)', tactile: 'Houbovitý / Poddajný', hint: 'Nemoc: Vyžaduje CON save proti nákaze. Zdroj larev', icon: '🤢' },
  52: { smell: 'Hnilobný / Masitý (Mršina)', tactile: 'Houbovitý / Poddajný', hint: 'Nemoc: Vyžaduje CON save proti nákaze. Zdroj larev', icon: '🤢' },
  53: { smell: 'Hnilobný / Masitý (Mršina)', tactile: 'Houbovitý / Poddajný', hint: 'Nemoc: Vyžaduje CON save proti nákaze. Zdroj larev', icon: '🤢' },
  54: { smell: 'Dřevitý / Pryskyřičný', tactile: 'Drsný / Třískovitý', hint: 'Materiál: Dobré místo pro sběr surovin a crafting', icon: '🔨' },
  55: { smell: 'Dřevitý / Pryskyřičný', tactile: 'Drsný / Třískovitý', hint: 'Materiál: Dobré místo pro sběr surovin a crafting', icon: '🔨' },
  56: { smell: 'Dřevitý / Pryskyřičný', tactile: 'Drsný / Třískovitý', hint: 'Materiál: Dobré místo pro sběr surovin a crafting', icon: '🔨' },
  61: { smell: 'Slaný / Mořský (Pot, Slzy)', tactile: 'Vlhký / Orosený', hint: 'Voda: Povrchy jsou mokré, obtížné šplhání bez vybavení', icon: '💧' },
  62: { smell: 'Slaný / Mořský (Pot, Slzy)', tactile: 'Vlhký / Orosený', hint: 'Voda: Povrchy jsou mokré, obtížné šplhání bez vybavení', icon: '💧' },
  63: { smell: 'Slaný / Mořský (Pot, Slzy)', tactile: 'Vlhký / Orosený', hint: 'Voda: Povrchy jsou mokré, obtížné šplhání bez vybavení', icon: '💧' },
  64: { smell: 'Sterilní / Žádný (Sklo, Plast)', tactile: 'Hladký / Nepřilnavý', hint: 'Cizost: Nelze šplhat. Zvuky se nepřirozeně rozléhají', icon: '🧊' },
  65: { smell: 'Sterilní / Žádný (Sklo, Plast)', tactile: 'Hladký / Nepřilnavý', hint: 'Cizost: Nelze šplhat. Zvuky se nepřirozeně rozléhají', icon: '🧊' },
  66: { smell: 'Sterilní / Žádný (Sklo, Plast)', tactile: 'Hladký / Nepřilnavý', hint: 'Cizost: Nelze šplhat. Zvuky se nepřirozeně rozléhají', icon: '🧊' }
};

// 2. MEGA-STRUKTURY (3×k6)
export const MEGA_STRUCTURE_SHAPE = [
  { roll: 1, name: 'Válec / Tunel', desc: 'Trubka, nohavice, láhev', examples: 'Dlouhý, úzký prostor vedoucí někam' },
  { roll: 2, name: 'Plochá Pláň', desc: 'Stůl, kniha, podlaha', examples: 'Rozlehlá, otevřená plocha' },
  { roll: 3, name: 'Vertikální Věž', desc: 'Noha židle, lampa', examples: 'Vysoká struktura s více úrovněmi' },
  { roll: 4, name: 'Klenutý Dóm', desc: 'Miska, helma, vnitřek gauče', examples: 'Kupolovitý, obloukovitý prostor' },
  { roll: 5, name: 'Labyrint / Síť', desc: 'Kabely, vnitřek stroje', examples: 'Spletité chodby a křižovatky' },
  { roll: 6, name: 'Propast / Kráter', desc: 'Vana, krabice, bota', examples: 'Hluboká propadlina dolů' }
];

export const MEGA_STRUCTURE_MATERIAL = [
  { roll: 1, name: 'Organika / Dřevo', desc: 'Měkké, lze hlodat', hint: 'Přírodní materiál, kořeny, větve' },
  { roll: 2, name: 'Kov', desc: 'Tvrdý, studený, hlučný', hint: 'Rezavý, studený, možná magnetický' },
  { roll: 3, name: 'Plast / Syntetika', desc: 'Hladký, umělý', hint: 'Hladký, barevný, lidský odpad' },
  { roll: 4, name: 'Textil / Vlákna', desc: 'Nestabilní, hořlavý', hint: 'Látka, provazy, pavučiny' },
  { roll: 5, name: 'Sklo / Keramika', desc: 'Kluzké, křehké', hint: 'Křehké, ostré, průhledné' },
  { roll: 6, name: 'Kompozit / Odpad', desc: 'Nepředvídatelný mix', hint: 'Mix všeho možného' }
];

export const MEGA_STRUCTURE_STATE = [
  { roll: 1, name: 'Vibrující', desc: 'Stroj běží, motor, chlazení', hint: 'Možný pád (DEX save)' },
  { roll: 2, name: 'Zaplavený', desc: 'Voda/olej stoupá nebo klesá', hint: 'Plavání nebo obcházení' },
  { roll: 3, name: 'Hnijící / Rozpadlý', desc: 'Strukturálně nestabilní', hint: 'STR save nebo propadnutí' },
  { roll: 4, name: 'Hořící / Sálající', desc: 'Vysoká teplota', hint: 'd4 poškození za směnu' },
  { roll: 5, name: 'Obydlený', desc: 'Hmyzí hnízdo nebo jiná myš', hint: 'Setkání s obyvateli' },
  { roll: 6, name: 'Pohyblivý', desc: 'Objekt se hýbe nebo padá', hint: 'Orientace obtížná' }
];

// 3. KOMPLIKACE KOŘISTI (k20)
export const LOOT_COMPLICATIONS = [
  { roll: 1, property: 'Nestabilní / Měkký', desc: 'Přezrálé ovoce', impact: 'Nelze táhnout po zemi. Nutno vyrobit nosítka/sáňky. Každý náraz (fail DEX) zničí 20 % kořisti' },
  { roll: 2, property: 'Nestabilní / Měkký', desc: 'Přezrálé ovoce', impact: 'Nelze táhnout po zemi. Nutno vyrobit nosítka/sáňky. Každý náraz (fail DEX) zničí 20 % kořisti' },
  { roll: 3, property: 'Aromatický', desc: 'Sýr, Maso', impact: 'Silně voní. Šance na Náhodné setkání se hází každou směnu (místo každé 3.)' },
  { roll: 4, property: 'Aromatický', desc: 'Sýr, Maso', impact: 'Silně voní. Šance na Náhodné setkání se hází každou směnu (místo každé 3.)' },
  { roll: 5, property: 'Tekoucí / Sypký', desc: 'Mouka, Voda', impact: 'Nutná vodotěsná nádoba. Pokud se obal protrhne, zanechává stopu pro predátory' },
  { roll: 6, property: 'Tekoucí / Sypký', desc: 'Mouka, Voda', impact: 'Nutná vodotěsná nádoba. Pokud se obal protrhne, zanechává stopu pro predátory' },
  { roll: 7, property: 'Extrémně Těžký', desc: 'Kov, Kámen', impact: 'Vyžaduje sílu 2+ myší k posunu. Rychlost pohybu je 50 %' },
  { roll: 8, property: 'Extrémně Těžký', desc: 'Kov, Kámen', impact: 'Vyžaduje sílu 2+ myší k posunu. Rychlost pohybu je 50 %' },
  { roll: 9, property: 'Lepkavý / Přilnavý', desc: 'Med, Lepidlo', impact: 'Kdo to nese, má nevýhodu na DEX a nemůže použít zbraň' },
  { roll: 10, property: 'Lepkavý / Přilnavý', desc: 'Med, Lepidlo', impact: 'Kdo to nese, má nevýhodu na DEX a nemůže použít zbraň' },
  { roll: 11, property: 'Křehký', desc: 'Vejce, Sklo', impact: 'Jakýkoliv pád nebo útok na nosiče = předmět je zničen' },
  { roll: 12, property: 'Křehký', desc: 'Vejce, Sklo', impact: 'Jakýkoliv pád nebo útok na nosiče = předmět je zničen' },
  { roll: 13, property: 'Hlučný', desc: 'Rolnička, Celofán', impact: 'Cinká nebo šustí. Nelze se plížit (Stealth je nemožný)' },
  { roll: 14, property: 'Hlučný', desc: 'Rolnička, Celofán', impact: 'Cinká nebo šustí. Nelze se plížit (Stealth je nemožný)' },
  { roll: 15, property: 'Dlouhý / Neohrabaný', desc: 'Tužka, Drát', impact: 'Nevejde se do úzkých chodeb. V zatáčkách se zasekává (test STR k uvolnění)' },
  { roll: 16, property: 'Dlouhý / Neohrabaný', desc: 'Tužka, Drát', impact: 'Nevejde se do úzkých chodeb. V zatáčkách se zasekává (test STR k uvolnění)' },
  { roll: 17, property: 'Nebezpečný povrch', desc: 'Třísky, Rez', impact: 'Nosič dostává 1 DMG každou hodinu transportu bez ochranných rukavic' },
  { roll: 18, property: 'Nebezpečný povrch', desc: 'Třísky, Rez', impact: 'Nosič dostává 1 DMG každou hodinu transportu bez ochranných rukavic' },
  { roll: 19, property: 'Živý', desc: 'Larva, Zraněný brouk', impact: 'Kořist se hýbe, kroutí a může se pokusit utéct nebo kousnout' },
  { roll: 20, property: 'DVOJITÁ KOMPLIKACE', desc: 'Hoď dvakrát!', impact: 'Hoďte dvakrát a kombinujte oba výsledky' }
];

// 4. FYZIKÁLNÍ PASTI (k12)
export const PHYSICAL_TRAPS = [
  { roll: 1, object: 'Statická elektřina', effect: 'Dotyk kovu dává 1k4 poškození. Vlasy se ježí (varování)' },
  { roll: 2, object: 'Povrchové napětí vody', effect: 'Kapka vody působí jako lepidlo. Zásah vodou = sražení k zemi (Knockdown)' },
  { roll: 3, object: 'Průvan / Vítr', effect: 'Na římsách nutný test STR, jinak odfouknutí. Pachy se rychle ztrácejí' },
  { roll: 4, object: 'Koncentrované světlo', effect: 'Sklo/Lupa vytváří paprsek tepla. Vstup do světla = 1k6 Fire DMG' },
  { roll: 5, object: 'Vysavač / Roomba', effect: '"Putující dungeon". Hluk, sání táhne myši dovnitř (STR save proti vtažení)' },
  { roll: 6, object: 'Hladké stěny (Vana)', effect: 'Nelze vylézt ven bez vybavení (přísavky, lano). Smrtící past hladem' },
  { roll: 7, object: 'Lepidlo / Páska', effect: 'Okamžité znehybnění. Vyproštění stojí čas a často i "kus inventáře" (vytržená srst/zbroj)' },
  { roll: 8, object: 'Nestabilní hromada', effect: 'Hromada knih/krabic. Špatný krok (DEX fail) spustí lavinu (k6 DMG plošně)' },
  { roll: 9, object: 'Chemický výpar', effect: 'Oblak Sava. Nutné zadržet dech (max CON kol). Jinak poškození plic' },
  { roll: 10, object: 'Elastický povrch', effect: 'Guma. Při skoku odrazí myš náhodným směrem' },
  { roll: 11, object: 'Magnetické pole', effect: 'Kovové zbraně/zbroje jsou 2x těžší nebo přimáčknuté ke stěně' },
  { roll: 12, object: 'Extrémní teplota', effect: 'Mrazák nebo trouba. Každá směna = Exhaustion (vyčerpání), pokud nemají ochranu' }
];

// 5. ORÁKULUM "O CO JDE?" (2×k6)
export const WHAT_IS_IT_VERB = [
  { roll: 1, verb: 'Čistit / Mýt', desc: 'Slouží k odstraňování nečistot' },
  { roll: 2, verb: 'Hrát / Bavit', desc: 'Slouží pro zábavu nebo hru' },
  { roll: 3, verb: 'Ukládat / Skrývat', desc: 'Slouží k uchování nebo schování' },
  { roll: 4, verb: 'Osvětlovat / Hřát', desc: 'Produkuje světlo nebo teplo' },
  { roll: 5, verb: 'Spojovat / Vázat', desc: 'Slouží k propojení věcí' },
  { roll: 6, verb: 'Zaznamenávat', desc: 'Uchovává informace nebo vzpomínky' }
];

export const WHAT_IS_IT_NOUN = [
  { roll: 1, noun: 'Nádoba', desc: 'Láhev, Hrnec - něco, co drží obsah', example: 'Láhev, Hrnec, Krabice' },
  { roll: 2, noun: 'Stroj / Mechanismus', desc: 'Něco s pohyblivými částmi', example: 'Hodinky, Mixér, Tiskárna' },
  { roll: 3, noun: 'Textilie', desc: 'Oblečení, Koberec - látka nebo vláknitý materiál', example: 'Rukavice, Ponožka, Hadr' },
  { roll: 4, noun: 'Odpad / Zbytek', desc: 'Vyhozená nebo rozbitá věc', example: 'Obaly, Střepy, Zbytky' },
  { roll: 5, noun: 'Jídlo / Organika', desc: 'Biologický materiál', example: 'Ovoce, Kořeny, Kosti' },
  { roll: 6, noun: 'Nábytek / Konstrukce', desc: 'Velká strukturální věc', example: 'Židle, Skříň, Police' }
];

// ============================================
// MONSTER LORE GENERATOR — 12 aspektů bytosti
// ============================================

export const LORE_ORIGIN = [
  'Prostě tu žije — tady je voda, jídlo, bezpečí. Nic víc.',
  'Žije tu od nepaměti — starší než jakákoliv myší osada v okolí.',
  'Přišlo sem z daleka, vyhnáno z původního domova katastrofou.',
  'Přišlo po stopách kořisti a už neodešlo.',
  'Narodilo se tu — toto místo je jeho rodný domov.',
  'Je posledním přeživším svého druhu — sem uteklo ze zoufalství.',
  'Přišlo sem s karavanou, ale zůstalo když karavana odešla.',
  'Migrovalo sem spolu s ročním obdobím — ale tentokrát neodešlo.',
  'Spadlo sem — doslova — z ptačího hnízda vysoko nahoře.',
  'Bylo sem přineseno vichřicí, která tu řádila minulou sezónu.',
  'Přilezlo sem z Podzemí, ze sítě tunelů pod kořeny.',
  'Přišlo sem za vodou — starý zdroj vyschl.',
  'Vyhnáno z původního teritoria silnějším tvorem.',
  'Přitáhla ho hojnost potravy v okolí osady.',
  'Vylíhlo se tu z vajec, která sem nakladla matka.',
  'Přišlo sem po proudu řeky nebo potoka.',
  'Zabydlelo se tu po smrti předchozího alfa tvora v okolí.',
  'Přežilo požár nebo povodeň a toto bylo nejbližší útočiště.',
  'Vytlačeno lidskou aktivitou ze starého domova.',
  'Sledovalo kořist a zjistilo, že se tu loví snadno.',
  'Sem se uchýlilo po zradě blízkého společníka.',
  'Připlulo po podzemní řece, která tu ústí.',
  'Uprchlo z laboratoře sovího čaroděje.',
  'Přišlo sem jako strážce něčeho ukrytého.',
  'Přitáhl ho pach krve z dávné bitvy, která tu proběhla.',
];

export const LORE_MOTIVATION = [
  'Hlídá vstup do svého teritoria — nechce vetřelce.',
  'Hledá konkrétní druh potravy, který roste jen tady.',
  'Chrání svá mláďata ukrytá poblíž.',
  'Hromadí zásoby na blížící se zimu nebo pohromu.',
  'Touží po klidu — chce být prostě ponecháno na pokoji.',
  'Hledá partnera ke spáření — je v období námluv.',
  'Chce ovládnout toto území a vyhnat všechny ostatní.',
  'Hledá cestu zpět domů, ale neví kudy.',
  'Shromažďuje materiály na stavbu hnízda nebo doupěte.',
  'Touží po pomstě — někdo mu ublížil a ono to nezapomnělo.',
  'Chce komunikovat, ale neví jak — pokouší se předat zprávu.',
  'Hledá léčivou bylinu nebo vodu pro své nemocné mládě.',
  'Touží po společnosti — je osamělé a zoufalé.',
  'Plní příkaz mocnější bytosti, které se bojí.',
  'Chce být krmeno a obsluhováno — považuje se za šlechtu.',
  'Prostě loví — má hlad a tohle je jeho loviště.',
  'Brání si noru nebo hnízdo — je to jeho domov.',
  'Hledá bezpečné místo k přezimování.',
  'Vysedává na slunci a čeká na kořist.',
  'Střeží zásoby potravy, které nashromáždilo.',
  'Snaží se přežít zimu, sucho nebo povodeň.',
  'Rozšiřuje své teritorium na úkor sousedů.',
  'Učí svá mláďata lovit a přežít.',
  'Střeží průchod nebo stezku, o které myši nevědí.',
  'Touží po lidském artefaktu, který spatřilo — neví co to je, ale chce to.',
];

export const LORE_SOCIAL = [
  'Naprostý samotář — nesnáší společnost jakéhokoliv druhu.',
  'Vůdce malé skupiny 3–5 jedinců, které drží pohromadě strachem.',
  'Člen smečky, ale snaží se osamostatnit.',
  'Buduje si gang — aktivně rekrutuje spojence a poddané.',
  'Páreček — má partnera, se kterým se dělí o teritorium.',
  'Poslední ze svého druhu — nedobrovolný samotář.',
  'Alfa velké skupiny 10+ jedinců, kteří terorizují okolí.',
  'Žije v symbióze s jiným druhem tvora.',
  'Vyhnanec — byl vyhozen ze své skupiny za přestupek.',
  'Osamělý tulák — putuje sám od místa k místu.',
  'Matriarchát — samice vede skupinu, samci slouží.',
  'Má jednoho věrného společníka, se kterým je neoddělitelné.',
  'Hledá si skupinu — chce někam patřit, ale neumí to.',
  'Vůdce kultu — jeho následovníci ho uctívají jako božstvo.',
  'Žije v kolonii stovek jedinců, ale tahle skupina se odtrhla.',
  'Parazituje na jiném tvorovi — žije na jeho úkor.',
  'Rodič s mláďaty — chrání potomky za každou cenu.',
  'Rival jiného tvora — soupeří o stejné území.',
  'Spojenec myší osady — má s nimi tajnou dohodu.',
  'Žoldnéř — slouží tomu, kdo zaplatí nejlépe.',
  'Teritoriální — žije samo na přesně vymezeném území, které značkuje.',
  'Sezónní společník — v létě samotář, v zimě se sdružuje s ostatními.',
  'Toleruje ostatní tvory, pokud mu neberou potravu.',
  'Podřízený člen skupiny — dělá špinavou práci za ochranu.',
  'Rodina — žije s partnerem a letošními mláďaty, nic víc.',
];

export const LORE_LAIR = [
  'Prostá díra v zemi, nic zvláštního — funguje to.',
  'Propracovaný systém tunelů se zásobárnou a strážní místností.',
  'Staré myší obydlí, které si přivlastnilo a zdevastovalo.',
  'Mělká tůňka v bahně u potoka — vždy vlhká, vždy plná hmyzu.',
  'Hnízdo vysoko v korunách, dostupné jen pro létající tvory.',
  'Podmáčená nora u vody, napůl zaplavená.',
  'V doupěti má sbírku podivných předmětů z lidského světa.',
  'Skrýš pod plochým kamenem u vody — chladná a vlhká.',
  'Žádné stálé doupě — stěhuje se každých pár dní.',
  'Nora pod kořeny starého dubu, plná hub a mechu.',
  'Opuštěná lidská bota, přestavěná na pevnost.',
  'Jeskyně plná krápníků a podivného světla.',
  'Hnízdo utkané z pavučin, hedvábné a děsivé zároveň.',
  'Dutina ve starém pařezu, plná zásobáren a chodeb.',
  'Vybudovalo si doupě z kostí a lebek svých obětí.',
  'Doupě pod vodní hladinou — vstup je ponořený.',
  'Kamenná dutina s překvapivě příjemnou teplotou.',
  'V doupěti má primitivní oltář s podivnými obětinami.',
  'Opevněné místo s pastmi a hlídkami na přístupových cestách.',
  'Doupě v trhlině ve skále, téměř neviditelné.',
  'Opuštěný hmyzí úl, přebudovaný na pevnost.',
  'Doupě v koruně stromu, spojené můstky z větviček.',
  'Využívá starý lidský odpad jako stavební materiál — plechovka, lahev.',
  'Hnízdo z listí a trávy schované v hustém křoví.',
  'Doupě je prázdné a spartánské — žije asketicky.',
];

export const LORE_BEHAVIOR = [
  'Zcela mírumilovné — ignoruje kolemjdoucí, pokud ho neohrožují.',
  'Terorizuje okolí — pravidelně přepadá zásobovací cesty.',
  'Obchoduje s místními — nabízí vzácné byliny za jídlo.',
  'Vybírá „daň" od každého, kdo projde jeho územím.',
  'Nechá projít, ale sleduje — vždy ví, kdo prošel.',
  'Agresivní jen v noci — ve dne je klidné a přátelské.',
  'Nabízí služby za protislužby — má smysl pro obchod.',
  'Hlídá přístupovou cestu jako samozvaný strážce.',
  'Loví jen když má hlad — jinak nikoho neobtěžuje.',
  'Krade zásoby z osady, ale nikdy nikomu neublíží.',
  'Vyměňuje informace za jídlo — ví věci o okolí.',
  'Útočí na každého, kdo se přiblíží na dohled.',
  'Přátelské k dětem a mláďatům, agresivní k dospělým.',
  'Varuje vetřelce třikrát, pak útočí bez milosti.',
  'Nabízí ochranu za pravidelný tribut potravy.',
  'Ignoruje myši, ale útočí na jiné tvory.',
  'Loví za úsvitu a soumraku — ve dne i v noci spí.',
  'Obchoduje s předměty, které nachází v okolí.',
  'Pomáhá ztraceným cestovatelům najít cestu — za úplatu.',
  'Sabotuje pasti a nástrahy lovců v okolí.',
  'Zanechává výstražná znamení na hranicích svého území.',
  'Chodí na stejná místa ve stejný čas — má přísný rituál.',
  'Značkuje si teritorium a pravidelně ho obchází.',
  'Mění chování podle počasí — v dešti je zuřivé, za slunce klidné.',
  'Tiše pozoruje a sbírá informace — nikdo neví proč.',
];

export const LORE_RUMOR = [
  '„Prý kdokoliv, kdo na něj pohlédne přímo do očí, dostane horečku."',
  '„Starý Bodlák říkal, že to viděl před dvaceti lety — a vypadá to pořád stejně."',
  '„Nikdo, kdo šel blíž než na dohled, se nevrátil celý."',
  '„Říká se, že hlídá poklad z dob před Velkou bouří."',
  '„Prý ho můžeš uklidnit, když mu dáš med."',
  '„Moje babička říkala, že to dřív bývalo jiné — přátelské."',
  '„Jednou za měsíc vydává zvuky, ze kterých mrazí."',
  '„Ten starý mlynář tvrdí, že s ním jednou mluvil."',
  '„Prý žere třikrát denně — a ještě mu nestačí."',
  '„Kdosi viděl, jak nechalo koš hub u cesty — jako dar."',
  '„Prý je prokleté — a každý, kdo ho zabije, zdědí tu kletbu."',
  '„Objevuje se vždycky před neštěstím — jako zlé znamení."',
  '„Říkají, že zná tajné cesty, které myši dávno zapomněly."',
  '„Jedna stará myš přísahá, že ho viděla plakat."',
  '„Prý sežere cokoliv — i železo a kámen."',
  '„Říká se, že je starší než nejstarší dub v lese."',
  '„Kdosi tvrdí, že v jeho doupěti svítí podivné světlo."',
  '„Místní věří, že přináší déšť — a proto ho nechávají být."',
  '„Prý ho jednou porazil jediný myší válečník, ale nikdo neví kdo."',
  '„Říkají, že tu bylo dřív než osada — a přežije nás všechny."',
  '„Babička varovala: nikdy ho nekrm po setmění."',
  '„Prý zná jméno každého, kdo tu kdy žil."',
  '„Říkají, že je to vlastně strážný duch tohoto místa."',
  '„Kdosi viděl, jak tančí za úplňku na mýtině."',
  '„Prý má lidský předmět — říkají tomu \u201Azrcadlo\u2018."',
];

export const LORE_MAGIC = [
  'Nemá žádnou magii — čistě přírodní tvor bez nadpřirozených schopností.',
  'Žádná magie — je to prostě zvíře, silné a nebezpečné svou povahou.',
  'Žádná magie, ale má výjimečně vyvinutý čich — cítí myš na sto kroků.',
  'Žádná magie, ale je nezvykle chytré — učí se z chyb.',
  'Žádná magie — jeho síla je v rychlosti a překvapení.',
  'Žádná magie — spoléhá na jed, kousnutí nebo drápy.',
  'Žádná magie, ale má neuvěřitelnou výdrž — prostě se nevzdá.',
  'Žádná magie — je tiché jako stín, nikdy ho neslyšíš přicházet.',
  'Žádná magie, ale jeho krunýř, kůže nebo šupiny jsou tvrdé jako kámen.',
  'Žádná magie — zato má dokonalé maskování, splyne s okolím.',
  'Žádná magie, ale je tak staré, že se mu ostatní přirozeně vyhýbají.',
  'Žádná magie, ale má nadpřirozeně vyvinutý jeden smysl.',
  'Ovládá jedno kouzlo, které použije jen v krajní nouzi.',
  'Má magický předmět, který neumí plně ovládat.',
  'Přirozeně ruší magii v okolí — kouzelníci v jeho blízkosti selhávají.',
  'Dokáže mluvit myší řečí, i když by nemělo umět.',
  'Má hypnotický pohled — kdo se mu zadívá do očí, ztuhne.',
  'Má léčivé schopnosti — jeho sliny hojí rány.',
  'Dokáže měnit barvu a splynout s okolím.',
  'Jeho hlas má zvláštní moc — dokáže uklidnit nebo vyděsit.',
  'Je napojeno na Vílí říši — občas kolem něj poletují podivná světla.',
  'Ovládá jeden živel — vodu, vítr, oheň nebo zem — ale jen slabě.',
  'Dokáže přivolat mlhu nebo tmu ve svém okolí.',
  'Je prokleté — a kletba se přenáší na ty, kdo ho zraní.',
  'Vnímá magické předměty v okolí — cítí je jako vůni.',
];

export const LORE_LIKES = [
  'Miluje med a sladkosti — za med udělá cokoliv.',
  'Nesnáší hlasité zvuky — panikáří z hřmění a křiku.',
  'Zbožňuje lesklé předměty — krade vše co se leskne.',
  'Nenávidí oheň — hrůzu z něj má od malička.',
  'Miluje hudbu — písničkou ho lze uklidnit.',
  'Nesnáší myši — měl s nimi špatnou zkušenost.',
  'Zbožňuje děti a mláďata — nikdy jim neublíží.',
  'Nenávidí déšť — za deště je podrážděné a agresivní.',
  'Miluje tmu a stíny — světlo ho děsí.',
  'Nesnáší zápach kouře — uteče od ohniště.',
  'Zbožňuje květiny — jeho doupě je jimi vyzdobené.',
  'Nenávidí ptáky — reaguje panicky na křídla.',
  'Miluje vodu — tráví hodiny u potoka nebo louže.',
  'Nesnáší zimu — v chladnu je pomalé a zranitelné.',
  'Zbožňuje kameny — sbírá je a třídí podle tvaru.',
  'Nenávidí vetřelce ve svém teritoriu — jinak je klidné.',
  'Miluje hry a hádanky — lze ho zabavit hlavolamem.',
  'Nesnáší kočky — při zmínce o nich se roztřese.',
  'Zbožňuje stará místa — ruiny a zapomenutá obydlí.',
  'Nenávidí lži — pozná, když někdo klame.',
  'Miluje východ slunce — vždy ho sleduje.',
  'Nesnáší změnu — cokoliv nového ho znervózní.',
  'Zbožňuje vůně — přitahují ho byliny a koření.',
  'Nenávidí mravence — má s nimi dávný konflikt.',
  'Miluje příběhy — naslouchá každému, kdo vypráví.',
];

export const LORE_POSSESSIONS = [
  'Nemá nic — žije jako asketa, vlastnictví pohrdá.',
  'Hromadí lesklé kamínky a střepy skla v doupěti.',
  'Vlastní starý myší meč, který někde ukořistilo.',
  'Střeží tajnou zásobu vzácných léčivých bylin.',
  'Má lidský knoflík, který používá jako štít.',
  'Vlastní magický předmět, jehož sílu nechápe.',
  'Hromadí kosti svých obětí jako trofeje.',
  'Má sbírku peříček z různých ptáků.',
  'Střeží mapu — starou, otřepanou, ale cennou.',
  'Vlastní zrcátko z lidského světa — dívá se do něj denně.',
  'Hromadí jídlo obsesivně — mnohem víc než spotřebuje.',
  'Má korálkový náhrdelník, pravděpodobně ukradený.',
  'Vlastní klíč, ale neví k čemu je.',
  'Střeží vejce — možná vlastní, možná cizí.',
  'Má sbírku uzlíků z provázků — každý znamená něco.',
  'Vlastní kousek jantaru se zachyceným hmyzem uvnitř.',
  'Hromadí myší mince — má překvapivě velký poklad.',
  'Má podivnou sošku vyřezanou ze dřeva — připomíná sovu.',
  'Vlastní zvonček, který zvoní sám od sebe za úplňku.',
  'Střeží studánku nebo pramen s neobvykle čistou vodou.',
  'Má kus látky s vyšitým symbolem — erb neznámého rodu.',
  'Vlastní knihu — nemůže ji přečíst, ale odmítá se jí vzdát.',
  'Hromadí semínka všeho druhu — buduje podivnou zahradu.',
  'Má korálek z Vílí říše — září slabým světlem.',
  'Vlastní lidský náprstek, který používá jako helmu.',
];

export const LORE_VIRTUE = [
  'Jeho přítomnost odpuzuje mnohem nebezpečnější predátory z okolí.',
  'Varuje okolí před blížícím se nebezpečím svým chováním.',
  'Lze s ním obchodovat — má cenné věci a je férové.',
  'Čistí okolí od jedovatých rostlin a hub.',
  'Chrání malé a slabé tvory ve svém teritoriu.',
  'Je ochotné pomoci, pokud se k němu někdo chová s respektem.',
  'Jednou zachránilo skupinu myší před povodní.',
  'Má neuvěřitelné znalosti o lécích a bylinách.',
  'Udržuje rovnováhu v ekosystému — bez něj by se vše zhroutilo.',
  'Dokáže najít vodu i v tom nejsušším období.',
  'Nikdy nezaútočí jako první — vždy dá šanci k ústupu.',
  'Sdílí potravu s hladovými, pokud mu zbyde.',
  'Pamatuje si staré příběhy, které žádná myš nezná.',
  'Hlídá starou stezku, která je mnohem bezpečnější než hlavní cesta.',
  'Jeho doupě je bezpečné útočiště za bouřky.',
  'Zná tajný průchod, který zkracuje cestu o celý den.',
  'Je loajální k těm, kdo mu prokáží laskavost.',
  'Opyluje vzácné rostliny, které jinak vymírají.',
  'Dokáže předpovídat počasí s neuvěřitelnou přesností.',
  'Je živoucí památkou na staré časy — zná zapomenuté tradice.',
  'Loví škůdce — bez něj by se tu přemnožili.',
  'Upozorňuje svou přítomností na skryté nebezpečí v okolí.',
  'Respektuje hranice — nikdy neloví v blízkosti osady.',
  'Jeho nora stabilizuje břeh potoka a brání erozi.',
  'Je klidné a předvídatelné — když ho necháš, nechá tě na pokoji.',
];

export const LORE_DARKNESS = [
  'Má temnou minulost — bylo zodpovědné za zánik celé osady.',
  'Má neukojitelný hlad, který se s časem zhoršuje.',
  'Nenávidí všechny myši kvůli křivdě, která se mu stala.',
  'Šíří kolem sebe chorobu, o které samo neví.',
  'Postupně šílí — jeho chování je čím dál nepředvídatelnější.',
  'Zanechalo za sebou řadu obětí, které nikdo nenašel.',
  'Bylo kdysi dobré, ale kletba ho proměnila v něco děsivého.',
  'Loví pro zábavu, nejen z hladu — užívá si strach obětí.',
  'Otravuje vodní zdroje svou přítomností.',
  'Manipuluje slabšími tvory a nutí je pracovat pro sebe.',
  'Nese v sobě parazita, který ovládá jeho chování.',
  'Učí se od každého setkání — každým dnem je nebezpečnější.',
  'Má teritorium poseto pastmi, které zabíjí bez varování.',
  'Sbírá „suvenýry" ze svých obětí jako morbidní trofeje.',
  'Mstí se za křivdy, které si jen představuje.',
  'Jeho přítomnost kazí úrodu a plaší zvěř.',
  'Roste — pomalu ale jistě. A s velikostí roste i jeho nebezpečnost.',
  'Má schopnost, o které nikdo neví — a čeká na správný moment.',
  'Zabíjí víc než sežere — zbytek nechá hnít.',
  'Ničí zásoby a hnízda ostatních tvorů ze zlomyslnosti.',
  'Je nepředvídatelné — bez varování přepne z klidu do zuřivosti.',
  'Přenáší parazity, kteří napadají myší populaci.',
  'Vytlačuje ostatní tvory z jejich teritoria systematicky.',
  'Jeho přítomnost znečišťuje okolí — puch, zbytky kořisti, výkaly.',
  'Učí se otevírat myší obydlí — jednoho dne to zvládne.',
];

export const LORE_TWIST = [
  'Má tajnou dohodu se starostou nejbližší osady.',
  'Ve skutečnosti chrání osadu, ale nikdo to neví a myši ho nenávidí.',
  'Je smrtelně nemocné a jeho agresivita je projev zoufalství.',
  'Ve skutečnosti se bojí myší víc než ony jeho.',
  'Je dvojče — existují dva identické tvory, ale všichni si myslí, že je jeden.',
  'Bylo kdysi mazlíčkem lidského dítěte — a stýská se mu.',
  'Někdo ho sem záměrně přivedl, aby odlákal pozornost od něčeho jiného.',
  'Kdysi mělo rodinu — a celou ji ztratilo kvůli myší výpravě.',
  'Jeho příběh je propojen s příběhem hráčovy postavy — jen o tom ještě neví.',
  'Je samice — a právě teď je březí nebo sedí na vejcích.',
  'Ve skutečnosti je mladé — jeho velikost klame, je to jen teenager.',
  'Je slepé nebo hluché — kompenzuje to jinými smysly.',
  'Není agresivní — je vyděšené a útočí ze strachu.',
  'Má zranění, které si nikdo nevšiml — je zranitelné.',
  'Je zvyklé na myši — někdo ho v minulosti krmil a ochočil.',
  'Právě se probouzí ze zimního spánku — je hladové a zmatené.',
  'Za pár dní odtud odejde — je tu jen dočasně.',
  'Je starší než vypadá — pamatuje si časy před osadou.',
  'Patří někomu — má na sobě stopy po obojku nebo řemínku.',
  'Není tu samo — někde poblíž je další, větší exemplář.',
  'Tohle území ve skutečnosti nepatří jemu — ukradlo ho jinému tvorovi.',
  'Dřív bylo krotké a klidné — něco ho změnilo, ale nikdo neví co.',
  'Má v doupěti mláďata jiného druhu — adoptovalo je.',
  'Je albín nebo neobvykle zbarvené — proto je místní považují za zvláštní.',
  'Někdo ho pravidelně krmí — myš z osady, která to tají.',
];

export const LORE_ASPECTS = [
  { key: 'origin',      label: 'Původ',         icon: '🌱', borderColor: 'border-amber-400',   labelColor: 'text-amber-700',   table: LORE_ORIGIN },
  { key: 'motivation',  label: 'Motivace',       icon: '🎯', borderColor: 'border-blue-400',    labelColor: 'text-blue-600',    table: LORE_MOTIVATION },
  { key: 'social',      label: 'Společenství',   icon: '👥', borderColor: 'border-orange-400',  labelColor: 'text-orange-600',  table: LORE_SOCIAL },
  { key: 'lair',        label: 'Doupě',          icon: '🏚️', borderColor: 'border-stone-400',   labelColor: 'text-stone-600',   table: LORE_LAIR },
  { key: 'behavior',    label: 'Chování',        icon: '⚖️', borderColor: 'border-teal-400',    labelColor: 'text-teal-600',    table: LORE_BEHAVIOR },
  { key: 'rumor',       label: 'Zvěst',          icon: '💬', borderColor: 'border-violet-400',  labelColor: 'text-violet-600',  table: LORE_RUMOR },
  { key: 'magic',       label: 'Magie',          icon: '✨', borderColor: 'border-purple-400',  labelColor: 'text-purple-600',  table: LORE_MAGIC },
  { key: 'likes',       label: 'Záliby & Odpor', icon: '❤️‍🔥', borderColor: 'border-pink-400',  labelColor: 'text-pink-600',    table: LORE_LIKES },
  { key: 'possessions', label: 'Vlastnictví',    icon: '💎', borderColor: 'border-yellow-400',  labelColor: 'text-yellow-600',  table: LORE_POSSESSIONS },
  { key: 'virtue',      label: 'Skrytá ctnost',  icon: '🌿', borderColor: 'border-emerald-400', labelColor: 'text-emerald-600', table: LORE_VIRTUE },
  { key: 'darkness',    label: 'Temná stránka',  icon: '🌑', borderColor: 'border-red-400',     labelColor: 'text-red-600',     table: LORE_DARKNESS },
  { key: 'twist',       label: 'Zvrat',          icon: '🔄', borderColor: 'border-stone-600',   labelColor: 'text-stone-400',   table: LORE_TWIST },
];

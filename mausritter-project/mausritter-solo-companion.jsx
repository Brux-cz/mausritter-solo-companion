const { useState, useEffect, useCallback, useRef } = React;

// ============================================
// MAUSRITTER SOLO COMPANION APP
// A comprehensive tool for solo Mausritter play
// ============================================

// --- GOOGLE DRIVE SYNC CONFIG ---
const GOOGLE_CLIENT_ID = '948855876248-acfbvk4k4ud5fmciocfk5o8qldfcdi29.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'AIzaSyDorqiiGhrfkdg_fO6dqjjHsnpeioNSL-s';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/drive.file';

// --- FIREBASE MULTIPLAYER CONFIG ---
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxk-SZtGHH4-TvKN9lhcS7pyqr93uGmGQ",
  authDomain: "mausritter-solo-companio-e766c.firebaseapp.com",
  databaseURL: "https://mausritter-solo-companio-e766c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mausritter-solo-companio-e766c",
  storageBucket: "mausritter-solo-companio-e766c.firebasestorage.app",
  messagingSenderId: "120737105348",
  appId: "1:120737105348:web:5c57b811d446d19020d091"
};

// --- DATA CONSTANTS ---

const ORACLE_TABLE = {
  unlikely: { 2: 'No', 3: 'No', 4: 'No, but...', 5: 'No, but...', 6: 'No, but...', 7: 'Yes', 8: 'Yes', 9: 'Yes', 10: 'Yes, and...', 11: 'Yes, and...', 12: 'Yes, and...' },
  even: { 2: 'No', 3: 'No', 4: 'No', 5: 'No, but...', 6: 'Yes', 7: 'Yes', 8: 'Yes', 9: 'Yes, and...', 10: 'Yes, and...', 11: 'Yes, and...', 12: 'Yes, and...' },
  likely: { 2: 'No, but...', 3: 'No, but...', 4: 'Yes', 5: 'Yes', 6: 'Yes', 7: 'Yes', 8: 'Yes', 9: 'Yes, and...', 10: 'Yes, and...', 11: 'Yes, and...', 12: 'Yes, and...' }
};

const SCENE_COMPLICATIONS = [
  'Nepřátelské síly se staví do cesty',
  'Překážka blokuje postup',
  '"Nebylo by otravné, kdyby..." (vymysli komplikaci)',
  'NPC náhle jedná (hoď na Adventure Seeds)',
  'Objeví se nečekaná příležitost',
  'Věci jdou podle plánu (žádná komplikace)'
];

const FAILURE_CONSEQUENCES = [
  'Způsob poškození',
  'Dej někoho do úzkých',
  'Nabídni těžkou volbu',
  'Použij nepřítelův tah',
  'Odhal nepříjemnou pravdu',
  'Odděl skupinu'
];

const ACTION_ORACLE = [
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

const THEME_ORACLE = [
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

const CARD_SUITS = [
  { symbol: '♥', name: 'Srdce', domain: 'Sociální/Emocionální', keywords: 'Vztahy, city, spojení, podvod' },
  { symbol: '♦', name: 'Káry', domain: 'Materiální/Praktické', keywords: 'Bohatství, obchod, technologie, plány' },
  { symbol: '♣', name: 'Kříže', domain: 'Fyzické/Akční', keywords: 'Síla, boj, pohyb, tělesné' },
  { symbol: '♠', name: 'Piky', domain: 'Mystické/Mentální', keywords: 'Magie, tajemství, znalosti, duchovní' }
];

const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const CARD_VALUE_MEANINGS = {
  'A': 'Podstata, čistá forma',
  '2': 'Malé, osobní', '3': 'Malé, aktuální',
  '4': 'Střední', '5': 'Střední, skupinové', '6': 'Střední',
  '7': 'Velké', '8': 'Velké, komunitní', '9': 'Velké',
  '10': 'Specializované, expertní',
  'J': 'Osoba, agent změny',
  'Q': 'Autorita, instituce',
  'K': 'Moc, vláda, vrchol'
};

const HIT_TABLE = {
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
const WEATHER_TABLE = {
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

const LEXICON_CATEGORIES = [
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
const ENCOUNTER_CREATURES = [
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
const ENCOUNTER_ACTIVITIES = [
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
const ENCOUNTER_LOCATIONS = [
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
const ENCOUNTER_MOODS = [
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
const ENCOUNTER_DETAILS = [
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
const ENCOUNTER_MOTIVATIONS = [
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
const ENCOUNTER_COMPLICATIONS = [
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
const CREATURE_TYPES = [
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
const CREATURE_PERSONALITIES = [
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
const CREATURE_APPEARANCES = [
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
const CREATURE_GOALS = [
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
const CREATURE_DOING = [
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
const CREATURE_MOODS = [
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
const CREATURE_SECRETS = [
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
const CREATURE_QUIRKS = [
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
// MONSTER LORE GENERATOR TABLES
// Hloubkový profiler bytostí - 12 aspektů lore
// ============================================

const LORE_ORIGIN = [
  'Žije tu od nepaměti — starší než jakákoliv myší osada v okolí.',
  'Přišlo sem z daleka, vyhnáno z původního domova katastrofou.',
  'Bylo sem přivoláno starým kouzlem, které nikdo neumí zrušit.',
  'Uprchlo z laboratoře sovího čaroděje.',
  'Přišlo po stopách kořisti a už neodešlo.',
  'Narodilo se tu — toto místo je jeho rodný domov.',
  'Bylo prokleto a přesunuto sem proti své vůli.',
  'Následovalo tajemnou stezku, kterou vidí jen ono.',
  'Přilákala ho magie ukrytá hluboko pod zemí.',
  'Je posledním přeživším svého druhu — sem uteklo ze zoufalství.',
  'Přišlo sem s karavanou, ale zůstalo když karavana odešla.',
  'Probudilo se ze zimního spánku trvajícího celé generace.',
  'Dorazilo z Vílí říše průchodem, který se za ním zavřel.',
  'Bylo vytvořeno magií tohoto místa — je jeho projevem.',
  'Přišlo sem jako strážce něčeho ukrytého.',
  'Přitáhl ho pach krve z dávné bitvy, která tu proběhla.',
  'Připlulo po podzemní řece, která tu ústí.',
  'Přilétlo sem za zvukem, který slyší jen ono.',
  'Bylo sem posláno mocnou bytostí jako trest.',
  'Sem se uchýlilo po zradě blízkého společníka.',
  'Migrovalo sem spolu s ročním obdobím — ale tentokrát neodešlo.',
  'Spadlo sem — doslova — z ptačího hnízda vysoko nahoře.',
  'Vylíhlo se tu z vejce, které tu leželo celé věky.',
  'Bylo sem přineseno vichřicí, která tu řádila minulou sezónu.',
  'Přilezlo sem z Podzemí, ze sítě tunelů pod kořeny.'
];

const LORE_MOTIVATION = [
  'Hlídá vstup do svého teritoria — nechce vetřelce.',
  'Hledá konkrétní druh potravy, který roste jen tady.',
  'Chrání svá mláďata ukrytá poblíž.',
  'Hromadí zásoby na blížící se zimu nebo pohromu.',
  'Touží po klidu — chce být prostě ponecháno na pokoji.',
  'Hledá partnera ke spáření — je v období námluv.',
  'Střeží starobylý artefakt, o kterém samo neví, co je.',
  'Chce ovládnout toto území a vyhnat všechny ostatní.',
  'Hledá cestu zpět domů, ale neví kudy.',
  'Shromažďuje materiály na stavbu hnízda nebo doupěte.',
  'Touží po pomstě — někdo mu ublížil a ono to nezapomnělo.',
  'Chce komunikovat, ale neví jak — pokouší se předat zprávu.',
  'Sbírá magické předměty, které cítí v okolí.',
  'Hledá léčivou bylinu nebo vodu pro své nemocné mládě.',
  'Touží po společnosti — je osamělé a zoufalé.',
  'Plní příkaz mocnější bytosti, které se bojí.',
  'Střeží tajný průchod, o kterém myši nevědí.',
  'Snaží se přerušit magický rituál, který něco uvolní.',
  'Chce být krmeno a obsluhováno — považuje se za šlechtu.',
  'Hledá specifický zvuk nebo píseň, kterou kdysi slyšelo.',
  'Touží po lidském artefaktu, který spatřilo v dáli.',
  'Čeká na znamení — proroctví, které musí splnit.',
  'Chce zabránit probuzení něčeho strašlivého pod zemí.',
  'Sbírá kosti padlých tvorů pro neznámý účel.',
  'Hledá místo, kde se protínají dva proudy magie.'
];

const LORE_SOCIAL = [
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
  'Žoldnéř — slouží tomu, kdo zaplatí nejlépe.'
];

const LORE_LAIR = [
  'Prostá díra v zemi, nic zvláštního — funguje to.',
  'Propracovaný systém tunelů se zásobárnou a strážní místností.',
  'Staré myší obydlí, které si přivlastnilo a zdevastovalo.',
  'Magicky chráněné místo — kolem doupěte je ochranný kruh.',
  'Hnízdo vysoko v korunách, dostupné jen pro létající tvory.',
  'Podmáčená nora u vody, napůl zaplavená.',
  'V doupěti má sbírku podivných předmětů z lidského světa.',
  'Doupě je živé — stěny dýchají a reagují na vetřelce.',
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
  'V doupěti je podivný zdroj tepla, pravděpodobně magický.',
  'Doupě je prázdné a spartánské — žije asketicky.'
];

const LORE_BEHAVIOR = [
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
  'Aktivní jen za úplňku — zbytek měsíce spí.',
  'Obchoduje s předměty, které nachází v okolí.',
  'Pomáhá ztraceným cestovatelům najít cestu — za úplatu.',
  'Sabotuje pasti a nástrahy lovců v okolí.',
  'Zanechává výstražná znamení na hranicích svého území.',
  'Chodí na stejná místa ve stejný čas — má přísný rituál.',
  'Přináší „dary" k myším osadám — ale podivné a znepokojivé.',
  'Mění chování podle počasí — v dešti je zuřivé, za slunce klidné.',
  'Tiše pozoruje a sbírá informace — nikdo neví proč.'
];

const LORE_RUMOR = [
  '„Prý kdokoliv, kdo na něj pohlédne přímo do očí, dostane horečku."',
  '„Starý Bodlák říkal, že to viděl před dvaceti lety — a vypadá to pořád stejně."',
  '„Nikdo, kdo šel blíž než na dohled, se nevrátil celý."',
  '„Říká se, že hlídá poklad z dob před Velkou bouří."',
  '„Prý ho můžeš uklidnit, když mu dáš med."',
  '„Moje babička říkala, že to dřív bývalo jiné — přátelské."',
  '„Jednou za měsíc vydává zvuky, ze kterých mrazí."',
  '„Ten starý mlynář tvrdí, že s ním jednou mluvil."',
  '„Říká se, že má smlouvu s Královnou Víl."',
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
  '„Říká se, že sní o budoucnosti a někdy ji předpoví."',
  '„Babička varovala: nikdy ho nekrm po setmění."',
  '„Prý zná jméno každého, kdo tu kdy žil."',
  '„Říkají, že je to vlastně strážný duch tohoto místa."',
  '„Kdosi viděl, jak tančí za úplňku na mýtině."',
  '„Prý má lidský předmět — říkají tomu ‚zrcadlo'."'
];

const LORE_MAGIC = [
  'Nemá žádnou magii — čistě přírodní tvor bez nadpřirozených schopností.',
  'Slabá přirozená magie — cítí blížící se nebezpečí.',
  'Ovládá jedno kouzlo, které použije jen v krajní nouzi.',
  'Je magického původu — celé jeho tělo září slabou aurou.',
  'Má magický předmět, který neumí plně ovládat.',
  'Je imunní vůči jednomu druhu magie.',
  'Přirozeně ruší magii v okolí — kouzelníci v jeho blízkosti selhávají.',
  'Dokáže mluvit myší řečí, i když by nemělo umět.',
  'Má hypnotický pohled — kdo se mu zadívá do očí, ztuhne.',
  'Ovládá jeden živel — oheň, vodu, vítr nebo zem.',
  'Dokáže se na krátko stát neviditelným.',
  'Má léčivé schopnosti — jeho sliny hojí rány.',
  'Vidí do Vílí říše a občas s ní interaguje.',
  'Ovládá iluze — může vytvářet falešné obrazy.',
  'Žádná magie, ale má nadpřirozeně vyvinutý jeden smysl.',
  'Je napojeno na měsíční cykly — za úplňku má magické schopnosti.',
  'Dokáže měnit barvu a splynout s okolím.',
  'Jeho hlas má zvláštní moc — dokáže uklidnit nebo vyděsit.',
  'Nese v sobě zlomek staré magie, které nerozumí.',
  'Zanechává magické stopy — kdo je sleduje, najde zvláštní věci.'
];

const LORE_LIKES = [
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
  'Miluje příběhy — naslouchá každému, kdo vypráví.'
];

const LORE_POSSESSIONS = [
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
  'Vlastní lidský náprstek, který používá jako helmu.'
];

const LORE_VIRTUE = [
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
  'Sdílí potravu s hladovými, pokud mu zbude.',
  'Pamatuje si staré příběhy, které žádná myš nezná.',
  'Hlídá starou stezku, která je mnohem bezpečnější než hlavní cesta.',
  'Jeho doupě je bezpečné útočiště za bouřky.',
  'Zná tajný průchod, který zkracuje cestu o celý den.',
  'Je loajální k těm, kdo mu prokáží laskavost.',
  'Opyluje vzácné rostliny, které jinak vymírají.',
  'Dokáže předpovídat počasí s neuvěřitelnou přesností.',
  'Je živoucí památkou na staré časy — zná zapomenuté tradice.'
];

const LORE_DARKNESS = [
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
  'Vyvolává noční můry u těch, kdo spí v jeho blízkosti.',
  'Má teritorium poseto pastmi, které zabíjí bez varování.',
  'Je závislé na magii — a udělá cokoliv, aby ji získalo.',
  'Sbírá „suvenýry" ze svých obětí jako morbidní trofeje.',
  'Mstí se za křivdy, které si jen představuje.',
  'Jeho přítomnost kazí úrodu a plaší zvěř.',
  'Roste — pomalu ale jistě. A s velikostí roste i jeho nebezpečnost.',
  'Má schopnost, o které nikdo neví — a čeká na správný moment.'
];

const LORE_TWIST = [
  'Ve skutečnosti je to zakletá myš — původně to byl/a někdo z osady.',
  'Má tajnou dohodu se starostou nejbližší osady.',
  'Ve skutečnosti chrání osadu, ale nikdo to neví a myši ho nenávidí.',
  'Je smrtelně nemocné a jeho agresivita je projev zoufalství.',
  'Ve skutečnosti se bojí myší víc než ony jeho.',
  'Rozumí myší řeči, ale nemluví — jen tiše poslouchá.',
  'Je dvojče — existují dva identické tvory, ale všichni si myslí, že je jeden.',
  'Bylo kdysi mazlíčkem lidského dítěte — a stýská se mu.',
  'Střeží vstup do zapomenuté myší knihovny plné starých svitků.',
  'Je napojeno na starostku Madrigu — plní její tajný úkol.',
  'Někdo ho sem záměrně přivedl, aby odlákal pozornost od něčeho jiného.',
  'Má lidské povědomí — je to proměněný člověk zmenšený kouzlem.',
  'Pracuje jako špeh pro frakci, o které nikdo neví.',
  'Pamatuje si předchozí životy — žilo tu už mnohokrát předtím.',
  'Za úplňku se mění v něco úplně jiného — a nepamatuje si to.',
  'Je stroj — konstrukt vytvořený dávným myším vynálezcem.',
  'Živí se magií — a v okolí nějaká silná magie sílí.',
  'Kdysi mělo rodinu — a celou ji ztratilo kvůli myší výpravě.',
  'Není z tohoto světa — prošlo portálem, který se zavřel.',
  'Je prorokem — jeho podivné chování jsou ve skutečnosti varování.',
  'LEGENDÁRNÍ: Je poslední strážce zapomenuté myší civilizace z dob před Velkou bouří.',
  'LEGENDÁRNÍ: Nese v sobě duši prastarého čaroděje, který odmítá zemřít.',
  'LEGENDÁRNÍ: Je avatar lesa — fyzický projev vůle přírody v tomto kraji.',
  'LEGENDÁRNÍ: Zná cestu do Podsvětí a může tam někoho zavést — za cenu.',
  'Jeho příběh je propojen s příběhem hráčovy postavy — jen o tom ještě neví.'
];

const LORE_ASPECTS = [
  { key: 'origin', label: 'Původ', icon: '🌱', borderColor: 'border-amber-400', labelColor: 'text-amber-700', table: 'LORE_ORIGIN' },
  { key: 'motivation', label: 'Motivace', icon: '🎯', borderColor: 'border-blue-400', labelColor: 'text-blue-600', table: 'LORE_MOTIVATION' },
  { key: 'social', label: 'Společenství', icon: '👥', borderColor: 'border-orange-400', labelColor: 'text-orange-600', table: 'LORE_SOCIAL' },
  { key: 'lair', label: 'Doupě', icon: '🏚️', borderColor: 'border-stone-400', labelColor: 'text-stone-600', table: 'LORE_LAIR' },
  { key: 'behavior', label: 'Chování', icon: '⚖️', borderColor: 'border-teal-400', labelColor: 'text-teal-600', table: 'LORE_BEHAVIOR' },
  { key: 'rumor', label: 'Zvěst', icon: '💬', borderColor: 'border-violet-400', labelColor: 'text-violet-600', table: 'LORE_RUMOR' },
  { key: 'magic', label: 'Magie', icon: '✨', borderColor: 'border-purple-400', labelColor: 'text-purple-600', table: 'LORE_MAGIC' },
  { key: 'likes', label: 'Záliby & Odpor', icon: '❤️‍🔥', borderColor: 'border-pink-400', labelColor: 'text-pink-600', table: 'LORE_LIKES' },
  { key: 'possessions', label: 'Vlastnictví', icon: '💎', borderColor: 'border-yellow-400', labelColor: 'text-yellow-600', table: 'LORE_POSSESSIONS' },
  { key: 'virtue', label: 'Skrytá ctnost', icon: '🌿', borderColor: 'border-emerald-400', labelColor: 'text-emerald-600', table: 'LORE_VIRTUE' },
  { key: 'darkness', label: 'Temná stránka', icon: '🌑', borderColor: 'border-red-400', labelColor: 'text-red-600', table: 'LORE_DARKNESS' },
  { key: 'twist', label: 'Zvrat', icon: '🔄', borderColor: 'border-stone-600', labelColor: 'text-stone-400', table: 'LORE_TWIST' }
];

// ============================================
// NARRATIVE GENERATOR TABLES
// Čistě narativní generátor scén a situací
// ============================================

// Úvodní věty - jak scéna začíná (40)
const NARRATIVE_OPENINGS = [
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
const NARRATIVE_SETTINGS = [
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
const NARRATIVE_ATMOSPHERES = [
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
const NARRATIVE_EVENTS = [
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
const NARRATIVE_TENSIONS = [
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
const NARRATIVE_DETAILS = [
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
const NARRATIVE_HOOKS = [
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
const NARRATIVE_CONCLUSIONS = [
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

const CREATURE_CATEGORIES = [
  { id: 'beast-mammal', name: 'Zvíře - Savec', icon: '🐀' },
  { id: 'beast-bird', name: 'Zvíře - Pták', icon: '🦅' },
  { id: 'beast-reptile', name: 'Zvíře - Plaz', icon: '🐍' },
  { id: 'insect', name: 'Hmyz', icon: '🐛' },
  { id: 'arachnid', name: 'Pavoukovec', icon: '🕷️' },
  { id: 'supernatural', name: 'Nadpřirozené', icon: '✨' },
  { id: 'mouse-rival', name: 'Myší protivník', icon: '🐭' },
  { id: 'amphibian', name: 'Obojživelník', icon: '🐸' }
];

const BESTIARY = [
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
const LANDMARKS = [
  'Starý pokroucený dub', 'Opuštěná ptačí budka', 'Rozbitý hliněný květináč', 'Podmáčená louka', 'Hustý malinový keř',
  'Stará kamenná zeď', 'Potok s malým vodopádem', 'Vývrat mohutného stromu', 'Houbový háj', 'Opuštěné liščí doupě',
  'Starý most z klacíků', 'Vyschlá studna', 'Rozpadlý plot', 'Trnitý živý plot', 'Bahenní tůň',
  'Skála s jeskyní', 'Opuštěný včelí úl', 'Velký balvan', 'Louka divokých květin', 'Temný hvozd'
];

const SETTLEMENT_FEATURES = [
  'Spirálové schodiště hluboko do země', 'Větrný mlýn z ořechové skořápky', 'Visutá lávka mezi větvemi',
  'Podzemní tržiště', 'Svatyně prastarého ducha', 'Věž z náprstku', 'Biblioteca v dutém kmeni',
  'Lázně z kapky rosy', 'Kovárna v železném hřebu', 'Hostinec "U Sýrového Měsíce"',
  'Aréna pro turnaje', 'Astronomická observatoř', 'Alchymistická dílna', 'Diplomatická hala',
  'Skleník vzácných bylin', 'Zbrojnice a cvičiště', 'Přístav na potoku', 'Hudební akademie',
  'Věštírna starého pána', 'Věznice a soudní síň'
];

// ===== TABULKY OSAD PODLE PRAVIDEL =====

// Velikost osady (k6, použij nižší z 2k6)
const SETTLEMENT_SIZES = [
  { roll: 1, name: 'Farma/zámeček', population: '1–3 rodiny', sizeIndex: 1 },
  { roll: 2, name: 'Křižovatka', population: '3–5 rodin', sizeIndex: 2 },
  { roll: 3, name: 'Víska', population: '50–150 myší', sizeIndex: 3 },
  { roll: 4, name: 'Vesnice', population: '150–300 myší', sizeIndex: 4 },
  { roll: 5, name: 'Město', population: '300–1000 myší', sizeIndex: 5 },
  { roll: 6, name: 'Velkoměsto', population: '1000+ myší', sizeIndex: 6 }
];

// Společenské zřízení (k6 + velikost osady)
const SETTLEMENT_GOVERNANCE = [
  { roll: '2–3', name: 'Vedená vesnickými stařešiny' },
  { roll: '4–5', name: 'Spravovaná rytířem nebo nižším šlechticem' },
  { roll: '6–7', name: 'Organizovaná cechovním výborem' },
  { roll: '8–9', name: 'Svobodná osada pod správou rady měšťanů' },
  { roll: '10–11', name: 'Domov významnějšího šlechtice' },
  { roll: '12', name: 'Hlavní sídlo šlechtické moci' }
];

// S čím myši obchodují? (k20)
const SETTLEMENT_TRADES = [
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
const SETTLEMENT_EVENTS = [
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
const SETTLEMENT_NAME_STARTS = [
  ['Dub', 'Bláto'], ['Bob', 'Sova'], ['Vrba', 'Liška'], ['Pařez', 'Žalud'],
  ['Smrk', 'Měď'], ['Měsíc', 'Lup'], ['Zelená', 'Sýr'], ['Černá', 'Mokro'],
  ['Kámen', 'Růže'], ['Vysoký', 'Cín'], ['Buk', 'Dobro'], ['Jablko', 'Kmen']
];
const SETTLEMENT_NAME_ENDS = [
  ['ov', 'Luh'], ['ovec', 'Háj'], ['ová', 'Věž'], ['ice', 'Újezd'],
  ['iny', 'Most'], ['ín', 'Brod'], ['ec', 'Voda'], ['ník', 'Hora'],
  ['any', 'Nora'], ['ves', 'Lhota'], ['Hradec', 'Hrob'], ['Městec', 'Žďár']
];

// Hospody a hostince
const INN_NAME_FIRST = [
  'Bílý', 'Zelený', 'Černý', 'Červený', 'Stříbrný', 'Křivý',
  'Přátelský', 'Schovaný', 'Lstivý', 'Skleněný', 'Trnitý', 'Rozbitý'
];
const INN_NAME_SECOND = [
  'Brouk', 'Liška', 'Špalek', 'Semínko', 'Krysa', 'Sýr',
  'Orel', 'Červ', 'Včela', 'Lucerna', 'Růže', 'Rytíř'
];
const INN_SPECIALTIES = [
  'Pečená kořeněná mrkev', 'Žížalí vývar', 'Ostružinový koláč', 'Uleželý aromatický sýr',
  'Ječmenná kaše', 'Tlustý rybí řízek', 'Pečené jablko', 'Smažené hmyzí nožičky',
  'Čerstvý máslový chléb', 'Ukořistěné sladkosti', 'Semínka pražená v medu', 'Houbový guláš'
];

// ===== MAUSRITTER CHARACTER TABLES =====

// Mužská křestní jména (40)
const MALE_FIRST_NAMES = [
  'Mecháček', 'Lístek', 'Oříšek', 'Větvík', 'Klásek', 'Cvrček', 'Šípek', 'Bobek',
  'Brouček', 'Stéblo', 'Peříčko', 'Kamínek', 'Poupě', 'Pupík', 'Šiška', 'Kořínek',
  'Střízlík', 'Vrabčák', 'Sýček', 'Dudek', 'Bodlák', 'Jehlíček', 'Žaludek', 'Kaštánek',
  'Větrník', 'Motýlek', 'Červíček', 'Broučík', 'Pavouček', 'Čmeláček', 'Mraveneček',
  'Hlemýžďák', 'Slimáček', 'Šnečík', 'Ježeček', 'Krteček', 'Lumík', 'Hraboš', 'Plyšáček', 'Chlupatec'
];

// Ženská křestní jména (40)
const FEMALE_FIRST_NAMES = [
  'Kopřivka', 'Sedmikráska', 'Kapradinka', 'Břečťanka', 'Vrbička', 'Jahodka',
  'Makovka', 'Fialka', 'Konvalinka', 'Pomněnka', 'Rosička', 'Jahůdka', 'Travička',
  'Chudobka', 'Sasanka', 'Chrpička', 'Slzička', 'Hvězdička', 'Perla', 'Mušelínka',
  'Kopreťka', 'Šípková', 'Růženka', 'Lněnka', 'Bledule', 'Sněženka', 'Jitřenka',
  'Večerka', 'Pampelíška', 'Měsíčenka', 'Slunečka', 'Hvězdulka', 'Včelka', 'Muška',
  'Beruška', 'Vážka', 'Kobylka', 'Mušinka', 'Ježurka', 'Myška'
];

// Příjmení s mužskou/ženskou variantou (40)
const FAMILY_NAMES = [
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
const BIRTHSIGNS = [
  { sign: 'Hvězda', trait: 'Statečná/zbrklá' },
  { sign: 'Kolo', trait: 'Pracovitá/nenápaditá' },
  { sign: 'Žalud', trait: 'Zvědavá/paličatá' },
  { sign: 'Bouřka', trait: 'Štědrá/popudlivá' },
  { sign: 'Měsíc', trait: 'Moudrá/záhadná' },
  { sign: 'Matka', trait: 'Pečující/ustaraná' }
];

// NPC chování - nálady
const NPC_BEHAVIOR_MOODS = [
  'přátelsky', 'nepřátelsky', 'lhostejně', 'podezíravě', 'nervózně', 'vesele',
  'smutně', 'rozčíleně', 'klidně', 'vyděšeně', 'znuděně', 'nadšeně',
  'rezervovaně', 'důvěřivě', 'pohrdavě', 'úslužně', 'tajemně', 'vychytrale'
];

// NPC chování - akce
const NPC_BEHAVIOR_ACTIONS = [
  'hledá něco', 'utíká před někým', 'sleduje někoho', 'čeká na něco',
  'opravuje věc', 'sbírá zásoby', 'obchoduje', 'odpočívá', 'hlídkuje',
  'vaří jídlo', 'uklízí', 'zpívá', 'bručí', 'krade', 'pomlouvá',
  'vypráví příběh', 'hádá se', 'prosí o pomoc', 'nabízí služby'
];

// NPC chování - motivace
const NPC_BEHAVIOR_MOTIVATIONS = [
  'chce vydělat ďobky', 'hledá ztracenou věc', 'chrání někoho blízkého',
  'touží po dobrodružství', 'utíká před minulostí', 'chce pomstu',
  'hledá nový domov', 'sbírá informace', 'chce být nechán/a na pokoji',
  'hledá přátele', 'touží po moci', 'chce napravit křivdu',
  'chrání tajemství', 'hledá lásku', 'chce dokázat svou hodnotu'
];

// NPC tajemství
const NPC_SECRETS = [
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
const NPC_REACTIONS = [
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
const NPC_ROLES = [
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
const EVENT_FOCUS = [
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
const EVENT_ACTIONS = [
  'Hledá', 'Chrání', 'Ukrývá', 'Obchoduje', 'Opravuje',
  'Krade', 'Prozkoumává', 'Varuje', 'Slaví', 'Truchlí',
  'Bojuje', 'Léčí', 'Staví', 'Ničí', 'Doručuje',
  'Prchá', 'Vyjednává', 'Špehuje', 'Učí', 'Cestuje'
];

// Subjekty pro generátor událostí - myší svět (d20)
const EVENT_SUBJECTS = [
  'potravu', 'úkryt', 'rodinu', 'poklad', 'tajemství',
  'nebezpečí', 'cestu', 'nástroj', 'zbraň', 'osadu',
  'predátora', 'artefakt', 'zprávu', 'spojence', 'nepřítele',
  'území', 'tradici', 'vzpomínku', 'magii', 'přežití'
];

// Komplikace událostí (d12)
const EVENT_COMPLICATIONS = [
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
const SETTLEMENT_RUMORS = [
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
const SETTLEMENT_HAPPENINGS = [
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
const NATURE_EVENTS = [
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
const WILDERNESS_THREATS = [
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
const DISCOVERIES = [
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
const FUR_COLORS = ['Čokoládová', 'Černá', 'Bílá', 'Světle hnědá', 'Šedá', 'Namodralá'];

// Vzor srsti (k6)
const FUR_PATTERNS = ['Jednolitá', 'Mourovatá', 'Strakatá', 'Pruhovaná', 'Tečkovaná', 'Skvrnitá'];

// Výrazné rysy (k66)
const DISTINCTIVE_FEATURES = {
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
const ORIGINS = {
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
const STARTING_WEAPONS = [
  { name: 'Jehla', damage: 'k6', weight: 'light', slots: 1 },
  { name: 'Dýka', damage: 'k6', weight: 'light', slots: 1 },
  { name: 'Hůl', damage: 'k6', weight: 'light', slots: 1 },
  { name: 'Meč', damage: 'k6/k8', weight: 'medium', slots: 1 },
  { name: 'Sekera', damage: 'k6/k8', weight: 'medium', slots: 1 },
  { name: 'Kladivo', damage: 'k6/k8', weight: 'medium', slots: 1 },
  { name: 'Kopí', damage: 'k10', weight: 'heavy', slots: 2 },
  { name: 'Hák', damage: 'k10', weight: 'heavy', slots: 2 }
];

// Backward compatibility aliases
const FIRST_NAMES = [...MALE_FIRST_NAMES, ...FEMALE_FIRST_NAMES];
const LAST_NAMES = FAMILY_NAMES.map(f => f.male);
const PHYSICAL_DETAILS = Object.values(DISTINCTIVE_FEATURES);

// Typy pomocníků k verbování (podle pravidel Mausritter)
// HP se hází k6, staty 2k6 - stejné pro všechny typy
const HIRELING_TYPES = [
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

const NPC_QUIRKS = [
  'Mluví ve třetí osobě', 'Sbírá lesklé věci', 'Neustále si opakuje plány', 'Má tajného mazlíčka',
  'Věří v prastaré proroctví', 'Nikdy nemluví o minulosti', 'Je posedlý sýrem', 'Cituje básně',
  'Má strach z koček', 'Je přehnaně optimistický', 'Nedůvěřuje cizincům', 'Je závislý na hazardu',
  'Shromažďuje recepty', 'Je tajně zamilovaný', 'Hledá ztraceného příbuzného', 'Má tajnou identitu',
  'Je bývalý pirát', 'Slyší hlasy', 'Je mistr převleků', 'Neumí lhát'
];

const NPC_GOALS = [
  'Najít vzácnou bylinu', 'Pomstít starou křivdu', 'Otevřít vlastní obchod', 'Osvobodit vězněného přítele',
  'Objevit ztracené město', 'Zničit nebezpečný artefakt', 'Najít léčbu nemoci', 'Doručit důležitou zprávu',
  'Uniknout pronásledovatelům', 'Získat uznání', 'Splatit dluh', 'Ochránit rodinu',
  'Odhalit pravdu o minulosti', 'Najít smysl života', 'Vytvořit mistrovské dílo', 'Získat moc',
  'Najít domov', 'Překonat strach', 'Vyléčit prokletí', 'Založit dynastii'
];

const DUNGEON_THEMES = [
  'Opuštěný důl', 'Prastarý chrám', 'Kanalizační systém', 'Síť kořenů', 'Dutý strom',
  'Zdi lidského domu', 'Podzemní říční jeskyně', 'Hmyzí úl', 'Opuštěné ptačí hnízdo', 'Houbový les',
  'Zamrzlá dutina', 'Zatopený sklep', 'Staré hodinové ústrojí', 'Tunely v kompostu', 'Praskliny v kamenné zdi',
  'Kostnice', 'Zapomenutá spíž', 'Zahradní kůlna', 'Vílí mohyla', 'Prostor mezi světy'
];

const DUNGEON_DENIZENS = [
  'Havěť (brouci, stonožky)', 'Nepřátelské krysy', 'Pavouci', 'Duchové', 'Nepřátelské víly',
  'Kultisté', 'Bandité', 'Divoká zvířata', 'Oživlé předměty', 'Unikátní stvoření'
];

const CONDITIONS = [
  { id: 'exhausted', name: 'Vyčerpaný', effect: 'Nevýhoda na fyzické hody' },
  { id: 'frightened', name: 'Vystrašený', effect: 'Musí prchat od zdroje' },
  { id: 'poisoned', name: 'Otrávený', effect: '1 poškození za kolo, nelze léčit' },
  { id: 'drained', name: 'Vysátý', effect: 'Nemůže sesílat kouzla' },
  { id: 'stunned', name: 'Omráčený', effect: 'Přeskočí další akci' },
  { id: 'prone', name: 'Na zemi', effect: 'Nevýhoda na útoky, snadnější cíl' }
];

const SPELLS = [
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
const SAVE_VERSION = 4;

// Migration functions - each upgrades from version N to N+1
const migrations = {
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
  }

  // Future migrations go here:
  // 4: (data) => { ... return { ...data, version: 5, newField: [] }; }
};

// Main migration function - applies all needed migrations
const migrateSaveData = (data) => {
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
    // Preserve any extra data for forward compatibility
    _extra: Object.keys(currentData)
      .filter(k => !['version', 'parties', 'activePartyId', 'activeCharacterId', 'journal', 'factions', 'settlements', 'worldNPCs', 'exportDate', 'character', 'gameTime'].includes(k))
      .reduce((acc, k) => ({ ...acc, [k]: currentData[k] }), {})
  };
};

// ============================================
// MALÝ SVĚT - GENERÁTORY PRO PRŮZKUM
// ============================================

// 1. SENZORICKÝ PRIMING (k66)
const SENSORY_PRIMING_TABLE = {
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
const MEGA_STRUCTURE_SHAPE = [
  { roll: 1, name: 'Válec / Tunel', desc: 'Trubka, nohavice, láhev', examples: 'Dlouhý, úzký prostor vedoucí někam' },
  { roll: 2, name: 'Plochá Pláň', desc: 'Stůl, kniha, podlaha', examples: 'Rozlehlá, otevřená plocha' },
  { roll: 3, name: 'Vertikální Věž', desc: 'Noha židle, lampa', examples: 'Vysoká struktura s více úrovněmi' },
  { roll: 4, name: 'Klenutý Dóm', desc: 'Miska, helma, vnitřek gauče', examples: 'Kupolovitý, obloukovitý prostor' },
  { roll: 5, name: 'Labyrint / Síť', desc: 'Kabely, vnitřek stroje', examples: 'Spletité chodby a křižovatky' },
  { roll: 6, name: 'Propast / Kráter', desc: 'Vana, krabice, bota', examples: 'Hluboká propadlina dolů' }
];

const MEGA_STRUCTURE_MATERIAL = [
  { roll: 1, name: 'Organika / Dřevo', desc: 'Měkké, lze hlodat', hint: 'Přírodní materiál, kořeny, větve' },
  { roll: 2, name: 'Kov', desc: 'Tvrdý, studený, hlučný', hint: 'Rezavý, studený, možná magnetický' },
  { roll: 3, name: 'Plast / Syntetika', desc: 'Hladký, umělý', hint: 'Hladký, barevný, lidský odpad' },
  { roll: 4, name: 'Textil / Vlákna', desc: 'Nestabilní, hořlavý', hint: 'Látka, provazy, pavučiny' },
  { roll: 5, name: 'Sklo / Keramika', desc: 'Kluzké, křehké', hint: 'Křehké, ostré, průhledné' },
  { roll: 6, name: 'Kompozit / Odpad', desc: 'Nepředvídatelný mix', hint: 'Mix všeho možného' }
];

const MEGA_STRUCTURE_STATE = [
  { roll: 1, name: 'Vibrující', desc: 'Stroj běží, motor, chlazení', hint: 'Možný pád (DEX save)' },
  { roll: 2, name: 'Zaplavený', desc: 'Voda/olej stoupá nebo klesá', hint: 'Plavání nebo obcházení' },
  { roll: 3, name: 'Hnijící / Rozpadlý', desc: 'Strukturálně nestabilní', hint: 'STR save nebo propadnutí' },
  { roll: 4, name: 'Hořící / Sálající', desc: 'Vysoká teplota', hint: 'd4 poškození za směnu' },
  { roll: 5, name: 'Obydlený', desc: 'Hmyzí hnízdo nebo jiná myš', hint: 'Setkání s obyvateli' },
  { roll: 6, name: 'Pohyblivý', desc: 'Objekt se hýbe nebo padá', hint: 'Orientace obtížná' }
];

// 3. KOMPLIKACE KOŘISTI (k20)
const LOOT_COMPLICATIONS = [
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
const PHYSICAL_TRAPS = [
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
const WHAT_IS_IT_VERB = [
  { roll: 1, verb: 'Čistit / Mýt', desc: 'Slouží k odstraňování nečistot' },
  { roll: 2, verb: 'Hrát / Bavit', desc: 'Slouží pro zábavu nebo hru' },
  { roll: 3, verb: 'Ukládat / Skrývat', desc: 'Slouží k uchování nebo schování' },
  { roll: 4, verb: 'Osvětlovat / Hřát', desc: 'Produkuje světlo nebo teplo' },
  { roll: 5, verb: 'Spojovat / Vázat', desc: 'Slouží k propojení věcí' },
  { roll: 6, verb: 'Zaznamenávat', desc: 'Uchovává informace nebo vzpomínky' }
];

const WHAT_IS_IT_NOUN = [
  { roll: 1, noun: 'Nádoba', desc: 'Láhev, Hrnec - něco, co drží obsah', example: 'Láhev, Hrnec, Krabice' },
  { roll: 2, noun: 'Stroj / Mechanismus', desc: 'Něco s pohyblivými částmi', example: 'Hodinky, Mixér, Tiskárna' },
  { roll: 3, noun: 'Textilie', desc: 'Oblečení, Koberec - látka nebo vláknitý materiál', example: 'Rukavice, Ponožka, Hadr' },
  { roll: 4, noun: 'Odpad / Zbytek', desc: 'Vyhozená nebo rozbitá věc', example: 'Obaly, Střepy, Zbytky' },
  { roll: 5, noun: 'Jídlo / Organika', desc: 'Biologický materiál', example: 'Ovoce, Kořeny, Kosti' },
  { roll: 6, noun: 'Nábytek / Konstrukce', desc: 'Velká strukturální věc', example: 'Židle, Skříň, Police' }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const rollDice = (count, sides) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * sides) + 1);
  }
  return results;
};

const rollD6 = () => rollDice(1, 6)[0];
const rollD12 = () => rollDice(1, 12)[0];
const rollD20 = () => rollDice(1, 20)[0];
const roll2D6 = () => { const r = rollDice(2, 6); return { dice: r, total: r[0] + r[1] }; };
// k66 = první d6 jako desítky, druhá jako jednotky (rozsah 11-66)
const rollK66 = () => {
  const tens = rollD6();
  const units = rollD6();
  return { dice: [tens, units], result: tens * 10 + units };
};

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateId = () => Math.random().toString(36).substr(2, 9);

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
  <div className={`bg-amber-50/80 border-2 border-amber-900/20 rounded-xl p-5 shadow-lg overflow-hidden ${className}`}>
    {title && <h3 className="font-bold text-amber-900 mb-3 text-lg border-b border-amber-900/20 pb-2 truncate">{title}</h3>}
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
          className="fixed left-2 right-2 sm:absolute sm:left-auto sm:right-0 top-auto sm:top-full mt-2 z-50 sm:w-72 bg-stone-800 text-stone-100 text-sm rounded-lg shadow-xl border border-stone-600"
          style={{ maxHeight: '70vh', overflow: 'hidden' }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {/* Scrollable content - scrollbar pushed outside visible area */}
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

// Help Section Header with tooltip
const HelpHeader = ({ title, tooltip, icon }) => (
  <div className="flex items-center gap-2 mb-2">
    {icon && <span>{icon}</span>}
    <span className="font-bold text-amber-900">{title}</span>
    {tooltip && <Tooltip>{tooltip}</Tooltip>}
  </div>
);

// ============================================
// MENTION INPUT - textarea s @mentions autocomplete
// ============================================

const MentionInput = ({
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

  // Kombinované suggestions - NPC a osady
  const allSuggestions = [
    ...npcs.map(n => ({ type: 'npc', id: n.id, name: n.name, icon: '🐭', subtitle: n.role || n.settlementId ? settlements.find(s => s.id === n.settlementId)?.name : 'Bez domova' })),
    ...settlements.map(s => ({ type: 'settlement', id: s.id, name: s.name, icon: '🏘️', subtitle: s.size }))
  ];

  // Filtrované suggestions podle toho co uživatel píše
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

    // Najdi @ před kurzorem
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

  // Vložení mention do textu
  const insertMention = (suggestion) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);

    // Najdi kde začíná @
    const atIndex = textBeforeCursor.lastIndexOf('@');
    const beforeAt = textBeforeCursor.slice(0, atIndex);

    // Formát: @[Jméno](typ:id)
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

      {/* Nápověda */}
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

      {/* Prázdný stav */}
      {showSuggestions && filteredSuggestions.length === 0 && suggestionFilter && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg z-50 p-3 text-center text-stone-500">
          Žádné výsledky pro "{suggestionFilter}"
        </div>
      )}
    </div>
  );
};

// Parsování textu s mentions - vrací React elementy
// Podporuje dva formáty:
// 1. Starý: @[Jméno](typ:id) - přímé ID
// 2. Nový: @Jméno - vyhledá podle jména v worldNPCs/settlements
const parseMentions = (text, onMentionClick, worldNPCs = [], settlements = [], lexicon = [], onLoreClick = null) => {
  if (!text) return null;

  // Helper pro převod textu s newliny na React elementy
  const textWithBreaks = (str, keyPrefix) => {
    if (!str.includes('\n')) return str;
    return str.split('\n').map((line, i, arr) => (
      <React.Fragment key={`${keyPrefix}-${i}`}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Kombinovaný regex pro oba formáty + lore tagy
  // 1. @[Jméno](typ:id) - skupina 1=name, 2=type, 3=id
  // 2. @kategorie:název (lore tag) - skupina 4=category, 5=name
  // 3. @Jméno (slovo bez mezer, nebo s diakritikou) - skupina 6=name
  const mentionRegex = /@\[([^\]]+)\]\((\w+):([^)]+)\)|@(lokace|npc|stvoreni|predmet|frakce|pravidlo|udalost):([^\s@.,!?;:]+(?:\s+[^\s@.,!?;:]+)*)|@([\wáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+(?:\s+[\wáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+)?)/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Text před mention
    if (match.index > lastIndex) {
      parts.push(textWithBreaks(text.slice(lastIndex, match.index), `pre-${match.index}`));
    }

    let name, type, id, found = false;

    if (match[1]) {
      // Starý formát @[Jméno](typ:id)
      name = match[1];
      type = match[2];
      id = match[3];
      found = true;
    } else if (match[4] && match[5]) {
      // Lore tag formát @kategorie:název
      const loreCategory = match[4];
      const loreName = match[5];

      // Hledej v lexikonu
      const loreItem = lexicon.find(l =>
        l.category === loreCategory &&
        l.name.toLowerCase() === loreName.toLowerCase()
      );

      // Zobraz jako lore tag (i když položka neexistuje - vytvoří se při ukládání)
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
      // Nový formát @Jméno - vyhledej podle jména
      const searchName = match[6];

      // Hledej v NPC
      const npc = worldNPCs.find(n => n.name.toLowerCase() === searchName.toLowerCase());
      if (npc) {
        name = npc.name;
        type = 'npc';
        id = npc.id;
        found = true;
      } else {
        // Hledej v osadách
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
      // Mention jako klikatelný element
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

  // Pokud nejsou žádné mentions, zpracuj celý text pro newliny
  if (parts.length === 0) {
    return textWithBreaks(text, 'full');
  }

  return parts;
};

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
  const [frameSceneResult, setFrameSceneResult] = useState(null); // Zarámování scény

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

  // Frame Scene - kombinovaný generátor pro zarámování scény
  const rollFrameScene = () => {
    // 1. Altered Scene (d6)
    const alteredDie = rollD6();
    const isAltered = alteredDie >= 5;

    // 2. Narativní otevření
    const opening = randomFrom(NARRATIVE_OPENINGS);

    // 3. Prostředí
    const setting = randomFrom(NARRATIVE_SETTINGS);

    // 4. Akce + Téma pro inspiraci
    const action = randomFrom(ACTION_ORACLE);
    const theme = randomFrom(THEME_ORACLE);

    // 5. Komplikace (jen pokud je scéna pozměněná)
    const complication = isAltered ? SCENE_COMPLICATIONS[rollD6() - 1] : null;

    // Sestav výsledek
    const result = {
      alteredDie,
      isAltered,
      opening,
      setting,
      action,
      theme,
      complication
    };

    setFrameSceneResult(result);

    // Vytvoř entry pro deník
    let narrativeText = `**${opening}** ${setting}`;
    narrativeText += `\n\n💡 *${action} + ${theme}*`;
    if (isAltered && complication) {
      narrativeText += `\n\n⚡ Komplikace: ${complication}`;
    }

    const entry = {
      type: 'oracle',
      subtype: 'frame_scene',
      timestamp: formatTimestamp(),
      dice: [alteredDie],
      result: isAltered ? 'Scéna POZMĚNĚNA' : 'Scéna dle očekávání',
      narrative: narrativeText,
      details: result
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

  // State pro generátor událostí (Event Generator)
  const [eventResult, setEventResult] = useState(null);
  const [eventOptions, setEventOptions] = useState({
    mode: 'full', // 'full', 'action', 'settlement', 'wilderness', 'rumor'
    includeComplication: false,
    includeFocus: true
  });

  // State pro Monster Lore Profiler
  const [loreResult, setLoreResult] = useState(null);

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

  // ========== MONSTER LORE PROFILER ==========

  const LORE_TABLES = {
    origin: LORE_ORIGIN,
    motivation: LORE_MOTIVATION,
    social: LORE_SOCIAL,
    lair: LORE_LAIR,
    behavior: LORE_BEHAVIOR,
    rumor: LORE_RUMOR,
    magic: LORE_MAGIC,
    likes: LORE_LIKES,
    possessions: LORE_POSSESSIONS,
    virtue: LORE_VIRTUE,
    darkness: LORE_DARKNESS,
    twist: LORE_TWIST
  };

  const generateLore = (aspectKey = null) => {
    let newResult;

    if (aspectKey && loreResult) {
      // Přehoď jen jeden aspekt
      newResult = { ...loreResult, [aspectKey]: randomFrom(LORE_TABLES[aspectKey]) };
    } else {
      // Generuj vše
      newResult = {};
      for (const [key, table] of Object.entries(LORE_TABLES)) {
        newResult[key] = randomFrom(table);
      }
    }

    setLoreResult(newResult);

    // Sestav narativní text pro deník
    const narrative = LORE_ASPECTS.map(a =>
      `**${a.icon} ${a.label}:** ${newResult[a.key]}`
    ).join('\n');

    const entry = {
      type: 'oracle',
      subtype: 'monster_lore',
      timestamp: formatTimestamp(),
      result: narrative,
      data: newResult
    };
    setLastResult(entry);
    if (!silentMode) logEntry(entry);
  };

  // ========== GENERÁTOR UDÁLOSTÍ ==========

  // Plný generátor událostí (Focus + Akce + Subjekt + volitelně Komplikace)
  const generateFullEvent = () => {
    const focus = eventOptions.includeFocus ? EVENT_FOCUS[Math.floor(Math.random() * EVENT_FOCUS.length)] : null;
    const action = randomFrom(EVENT_ACTIONS);
    const subject = randomFrom(EVENT_SUBJECTS);
    const complication = eventOptions.includeComplication ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = '';
    if (focus) {
      narrative += `**${focus.label}:** ${focus.description}\n\n`;
    }
    narrative += `⚡ **${action}** ${subject}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    const result = { focus, action, subject, complication, narrative, type: 'full' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor události v osadě
  const generateSettlementEvent = () => {
    const happening = randomFrom(SETTLEMENT_HAPPENINGS);
    const complication = eventOptions.includeComplication ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = `🏘️ **V osadě:** ${happening}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    const result = { happening, complication, narrative, type: 'settlement' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_settlement',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor zvěsti
  const generateRumor = () => {
    const rumor = randomFrom(SETTLEMENT_RUMORS);

    const narrative = `💬 **Zvěst:** "${rumor}"`;
    const result = { rumor, narrative, type: 'rumor' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_rumor',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Generátor události v divočině
  const generateWildernessEvent = () => {
    // 50% hrozba, 50% objev
    const isDiscovery = Math.random() > 0.5;
    const event = isDiscovery ? randomFrom(DISCOVERIES) : randomFrom(WILDERNESS_THREATS);
    const nature = randomFrom(NATURE_EVENTS);
    const complication = eventOptions.includeComplication ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = isDiscovery
      ? `🔍 **Objev:** ${event}`
      : `⚠️ **Hrozba:** ${event}`;
    narrative += `\n🌿 **Počasí/prostředí:** ${nature}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    const result = { event, nature, complication, isDiscovery, narrative, type: 'wilderness' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_wilderness',
      timestamp: formatTimestamp(),
      result: narrative,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // Jednoduchý generátor akce (jen Akce + Subjekt)
  const generateSimpleAction = () => {
    const action = randomFrom(EVENT_ACTIONS);
    const subject = randomFrom(EVENT_SUBJECTS);

    const narrative = `⚡ **${action}** ${subject}`;
    const result = { action, subject, narrative, type: 'action' };
    setEventResult(result);

    const entry = {
      type: 'oracle',
      subtype: 'event_action',
      timestamp: formatTimestamp(),
      result: `${action} ${subject}`,
      data: result
    };
    setLastResult(entry);
    logEntry(entry);
  };

  const oracleTabs = [
    { id: 'yesno', label: 'Ano/Ne', icon: '🎲' },
    { id: 'event', label: 'Události', icon: '⚡' },
    { id: 'narrative', label: 'Inspirace', icon: '💭' },
    { id: 'encounter', label: 'Setkání', icon: '👁️' },
    { id: 'creature', label: 'Tvor', icon: '🐭' },
    { id: 'lore', label: 'Lore', icon: '📖' },
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

      {/* ========== EVENT GENERATOR - GENERÁTOR UDÁLOSTÍ ========== */}
      {activeOracle === 'event' && (
        <ResultCard>
          <HelpHeader
            title="Generátor událostí"
            icon="⚡"
            tooltip={
              <div>
                <p className="font-bold mb-2">⚡ Co se děje?</p>
                <p className="text-xs mb-2">
                  Generátor pro náhodné události ve světě Mausritter.
                  Inspirováno systémem Mythic GME s tabulkami přizpůsobenými myšímu světu.
                </p>

                <p className="font-bold mb-1">🎯 Typy generátorů:</p>
                <ul className="text-xs space-y-1 mb-2">
                  <li>• <b>Plná událost</b> - Focus + Akce + Subjekt (kdo, co, proč)</li>
                  <li>• <b>Jen akce</b> - rychlé Akce + Subjekt</li>
                  <li>• <b>V osadě</b> - co se děje v městě/vesnici</li>
                  <li>• <b>Divočina</b> - hrozby a objevy v přírodě</li>
                  <li>• <b>Zvěst</b> - drby a fámy</li>
                </ul>

                <p className="text-xs text-stone-300 italic">
                  💡 Tip: Přidej komplikaci pro dramatičtější události!
                </p>
              </div>
            }
          />

          {/* Tlačítka pro různé typy generátorů */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            <Button onClick={generateFullEvent} variant="primary" className="flex-1">
              ⚡ Plná událost
            </Button>
            <Button onClick={generateSimpleAction} variant="secondary" className="flex-1">
              🎯 Jen akce
            </Button>
            <Button onClick={generateSettlementEvent} variant="secondary" className="flex-1">
              🏘️ V osadě
            </Button>
            <Button onClick={generateWildernessEvent} variant="secondary" className="flex-1">
              🌲 Divočina
            </Button>
            <Button onClick={generateRumor} variant="secondary" className="flex-1">
              💬 Zvěst
            </Button>
          </div>

          {/* Možnosti */}
          <div className="flex flex-wrap gap-4 justify-center mb-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eventOptions.includeFocus}
                onChange={(e) => setEventOptions({...eventOptions, includeFocus: e.target.checked})}
                className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>🎯 Focus (koho se týká)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eventOptions.includeComplication}
                onChange={(e) => setEventOptions({...eventOptions, includeComplication: e.target.checked})}
                className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>⚠️ Přidat komplikaci</span>
            </label>
          </div>

          {/* Výsledek */}
          {eventResult && (
            <div className="p-4 rounded-lg bg-stone-800 text-stone-100">
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line">
                {eventResult.narrative.split('\n').map((line, i) => {
                  // Parse markdown-like formatting
                  const formatted = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em class="text-stone-400">$1</em>');
                  return <p key={i} className="mb-1" dangerouslySetInnerHTML={{__html: formatted}} />;
                })}
              </div>
            </div>
          )}

          {/* Info o tabulkách */}
          <div className="mt-4 text-center text-xs text-stone-500">
            <p>📊 20 fokusů · 20 akcí · 20 subjektů · 12 komplikací</p>
            <p>🏘️ 20 osadních událostí · 20 zvěstí · 12 hrozeb · 12 objevů · 12 počasí</p>
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

              {/* Meta info + Save button */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-500">
                  {creatureResult.type.category === 'mouse' ? '🐭 Myš' :
                   creatureResult.type.category === 'rat' ? '🐀 Krysa' :
                   creatureResult.type.category === 'insect' ? '🐛 Hmyz' :
                   creatureResult.type.category === 'spirit' ? '👻 Duch' :
                   creatureResult.type.category === 'fae' ? '🧚 Víla' :
                   creatureResult.type.category === 'construct' ? '⚙️ Konstrukt' :
                   creatureResult.type.category === 'predator' ? '🦉 Predátor' : '🐸 Tvor'}
                </span>
                {silentMode && (
                  <button
                    onClick={() => {
                      const entry = {
                        type: 'oracle',
                        subtype: 'creature',
                        timestamp: formatTimestamp(),
                        result: creatureResult.narrative,
                        data: creatureResult
                      };
                      onLogEntry(entry);
                    }}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    📥 Uložit do deníku
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Statistiky */}
          <p className="text-center text-xs text-stone-400 mt-4">
            50 × 40 × 45 × 50 × 40 × 35 × 35 × 40 = ~25,200,000,000,000 kombinací
          </p>
        </ResultCard>
      )}

      {/* ========== MONSTER LORE PROFILER ========== */}
      {activeOracle === 'lore' && (
        <ResultCard>
          <HelpHeader
            title="Generátor Lore Bytosti"
            icon="📖"
            tooltip={
              <div>
                <p className="font-bold mb-2">📖 Co je tohle?</p>
                <p className="text-xs mb-2">
                  Hloubkový profiler pro jakoukoliv bytost. Generuje 12 aspektů lore:
                  původ, motivaci, společenství, doupě, chování, zvěsti, magii,
                  záliby, vlastnictví, ctnosti, temné stránky a nečekané zvraty.
                </p>

                <p className="font-bold mb-1">🎲 Jak to funguje:</p>
                <ul className="text-xs space-y-1">
                  <li>• <b>Hodit vše</b> — vygeneruje všech 12 aspektů najednou</li>
                  <li>• <b>🔄</b> — přehodí jen jeden aspekt, zbytek zůstane</li>
                  <li>• <b>Individuální tlačítka</b> — hodí jen jeden konkrétní aspekt</li>
                  <li>• Postupně si sestav profil bytosti jak se ti líbí</li>
                </ul>

                <p className="font-bold mt-2 mb-1">📊 Rozsah:</p>
                <p className="text-xs text-stone-300">
                  280 položek ve 12 tabulkách. ~95 bilionů unikátních kombinací.
                </p>
              </div>
            }
          />

          {/* Hlavní tlačítko */}
          <Button onClick={() => generateLore()} variant="primary" size="large" className="w-full mb-4">
            📖 Generovat lore bytosti
          </Button>

          {/* Individuální tlačítka pro jednotlivé aspekty */}
          <div className="mb-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {LORE_ASPECTS.map(aspect => (
              <button
                key={aspect.key}
                onClick={() => generateLore(aspect.key)}
                className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs text-stone-600 hover:text-stone-800 transition-colors border border-stone-200 flex items-center gap-1 justify-center"
                title={`Hodit jen: ${aspect.label}`}
              >
                <span>{aspect.icon}</span>
                <span className="truncate">{aspect.label}</span>
              </button>
            ))}
          </div>

          {/* Výsledky */}
          {loreResult && (
            <div className="p-4 rounded-lg border-2 bg-amber-50 border-amber-300 space-y-2">
              <h3 className="font-bold text-lg text-amber-900 mb-3">📖 Profil bytosti</h3>

              {LORE_ASPECTS.map(aspect => {
                const isTwist = aspect.key === 'twist';
                const isDark = aspect.key === 'darkness';
                const value = loreResult[aspect.key];
                if (!value) return null;

                return (
                  <div
                    key={aspect.key}
                    className={`p-2 rounded border-l-4 flex items-start gap-2 ${
                      isTwist ? `bg-stone-800 ${aspect.borderColor}` :
                      isDark ? `bg-red-50 ${aspect.borderColor}` :
                      `bg-white/50 ${aspect.borderColor}`
                    }`}
                  >
                    <div className="flex-1">
                      <span className={`text-xs font-medium block mb-1 ${
                        isTwist ? 'text-stone-400' : aspect.labelColor
                      }`}>
                        {aspect.icon} {aspect.label.toUpperCase()}
                      </span>
                      <p className={`text-sm ${
                        isTwist ? 'text-stone-300 italic' :
                        isDark ? 'text-red-800' :
                        'text-stone-700'
                      }`}>
                        {value}
                      </p>
                    </div>
                    <button
                      onClick={() => generateLore(aspect.key)}
                      className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center transition-colors ${
                        isTwist ? 'bg-stone-700 hover:bg-stone-600 text-stone-300' :
                        'bg-stone-100 hover:bg-stone-200 text-stone-500'
                      }`}
                      title={`Přehodit: ${aspect.label}`}
                    >
                      🔄
                    </button>
                  </div>
                );
              })}

              {/* Meta info + Save */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-500">
                  12 aspektů lore
                </span>
                {silentMode && (
                  <button
                    onClick={() => {
                      const narrative = LORE_ASPECTS.map(a =>
                        loreResult[a.key] ? `**${a.icon} ${a.label}:** ${loreResult[a.key]}` : null
                      ).filter(Boolean).join('\n');
                      const entry = {
                        type: 'oracle',
                        subtype: 'monster_lore',
                        timestamp: formatTimestamp(),
                        result: narrative,
                        data: loreResult
                      };
                      onLogEntry(entry);
                    }}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    📥 Uložit do deníku
                  </button>
                )}
              </div>
            </div>
          )}

          <p className="text-center text-xs text-stone-400 mt-4">
            280 položek ve 12 tabulkách = ~95,000,000,000,000 kombinací
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
        <div className="space-y-4">
          {/* Hlavní tlačítko - Zarámuj scénu */}
          <ResultCard className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300">
            <HelpHeader
              title="Zarámuj scénu"
              icon="🎬"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 K čemu to je?</p>
                  <p className="text-xs mb-2">Kombinovaný generátor, který najednou vytvoří kompletní rámec pro novou scénu.</p>

                  <p className="font-bold mb-1">📦 Co vygeneruje:</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>• <b>Altered Scene</b> - je něco jinak? (d6)</li>
                    <li>• <b>Otevření</b> - jak scéna začíná</li>
                    <li>• <b>Prostředí</b> - kde se to odehrává</li>
                    <li>• <b>Akce + Téma</b> - co se děje</li>
                    <li>• <b>Komplikace</b> - pokud je scéna pozměněná</li>
                  </ul>

                  <p className="text-xs text-stone-300 mt-2 italic">
                    💡 Použij když začínáš novou scénu a nevíš, co se děje.
                  </p>
                </div>
              }
            />
            <p className="text-sm text-stone-600 mb-3">Vygeneruj kompletní rámec pro novou scénu jedním kliknutím.</p>
            <Button onClick={rollFrameScene} size="large" className="w-full bg-amber-600 hover:bg-amber-700">
              🎬 Zarámuj scénu
            </Button>

            {/* Výsledek Frame Scene */}
            {frameSceneResult && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${frameSceneResult.isAltered ? 'text-orange-600' : 'text-green-600'}`}>
                    🎲 {frameSceneResult.alteredDie}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${frameSceneResult.isAltered ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {frameSceneResult.isAltered ? 'POZMĚNĚNÁ SCÉNA!' : 'Dle očekávání'}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-stone-500 text-xs">📖 Otevření:</span>
                    <p className="font-medium text-stone-800">{frameSceneResult.opening}</p>
                  </div>

                  <div>
                    <span className="text-stone-500 text-xs">📍 Prostředí:</span>
                    <p className="text-stone-700">{frameSceneResult.setting}</p>
                  </div>

                  <div>
                    <span className="text-stone-500 text-xs">💡 Inspirace:</span>
                    <p className="text-purple-700 font-medium">{frameSceneResult.action} + {frameSceneResult.theme}</p>
                  </div>

                  {frameSceneResult.isAltered && frameSceneResult.complication && (
                    <div className="p-2 bg-orange-50 rounded border border-orange-200">
                      <span className="text-orange-600 text-xs">⚡ Komplikace:</span>
                      <p className="text-orange-800 font-medium">{frameSceneResult.complication}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ResultCard>

          {/* Původní grid s jednotlivými generátory */}
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
            <span className="font-bold">2</span><br/>Kritické minutí
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
// CHARACTER SHEET - Kompaktní zobrazení postavy
// Použito v bočním panelu i v hlavním menu
// ============================================

const CharacterSheet = ({
  character,
  updateCharacter,
  onClose,
  compact = false,
  showInventory = true
}) => {
  const [openSection, setOpenSection] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [popupItem, setPopupItem] = useState(null);
  const inventoryRef = useRef(null);
  const slotSize = useSlotSize(inventoryRef);

  // Early return pokud není character
  if (!character) return null;

  // Bezpečné helper funkce
  const safeUpdateCharacter = (updates) => {
    try {
      if (updateCharacter && typeof updateCharacter === 'function') {
        updateCharacter(updates);
      }
    } catch (e) {
      console.error('Error updating character:', e);
    }
  };

  const updateHP = (delta) => {
    const currentHP = character?.hp?.current ?? 0;
    const maxHP = character?.hp?.max ?? 6;
    const newHP = Math.max(0, Math.min(maxHP, currentHP + delta));
    safeUpdateCharacter({ hp: { current: newHP, max: maxHP } });
  };

  const updatePips = (delta) => {
    const currentPips = character?.pips ?? 0;
    safeUpdateCharacter({ pips: Math.max(0, currentPips + delta) });
  };

  const updateAttribute = (attr, field, value) => {
    const parsed = parseInt(value) || 0;
    const currentAttr = character?.[attr] || { current: 10, max: 10 };
    safeUpdateCharacter({
      [attr]: { ...currentAttr, [field]: Math.max(1, Math.min(18, parsed)) }
    });
  };

  const moveInventoryItem = (fromSlot, toSlot) => {
    if (fromSlot === toSlot) return;
    const slots = { ...(character?.inventorySlots || {}) };
    const item = slots[fromSlot];
    if (!item) return;

    const belowMap = { mainPaw: 'offPaw', body1: 'body2', pack1: 'pack4', pack2: 'pack5', pack3: 'pack6' };
    const aboveMap = { offPaw: 'mainPaw', body2: 'body1', pack4: 'pack1', pack5: 'pack2', pack6: 'pack3' };

    const aboveSlot = aboveMap[toSlot];
    if (aboveSlot && slots[aboveSlot]?.height === 2) return;

    if (item.height === 2) {
      const belowSlot = belowMap[toSlot];
      if (!belowSlot) return;
      if (slots[belowSlot] && belowSlot !== fromSlot) {
        alert('Potřebuješ 2 volné sloty pod sebou!');
        return;
      }
    }

    const targetItem = slots[toSlot];
    slots[toSlot] = item;
    slots[fromSlot] = targetItem || null;

    safeUpdateCharacter({ inventorySlots: slots });
  };

  const updateSlotItem = (slotId, field, value) => {
    const slots = { ...(character?.inventorySlots || {}) };
    if (slots[slotId]) {
      slots[slotId] = { ...slots[slotId], [field]: value };
      safeUpdateCharacter({ inventorySlots: slots });
    }
  };

  const removeSlotItem = (slotId) => {
    const slots = { ...(character?.inventorySlots || {}) };
    if (slots[slotId]?.isCondition && slots[slotId]?.conditionId) {
      safeUpdateCharacter({
        inventorySlots: { ...slots, [slotId]: null },
        conditions: (character?.conditions || []).filter(c => c !== slots[slotId].conditionId)
      });
    } else {
      slots[slotId] = null;
      safeUpdateCharacter({ inventorySlots: slots });
    }
  };

  // Bezpečné hodnoty pro HP bar
  const currentHP = character?.hp?.current ?? 0;
  const maxHP = character?.hp?.max ?? 1; // min 1 aby se předešlo dělení nulou
  const hpPercent = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  // Toggle sekce "O postavě"
  const handleAboutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSection(current => current === 'about' ? null : 'about');
  };

  return (
    <div className="flex flex-col h-full bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{character.type === 'pc' ? '🐭' : '🐿️'}</span>
            <div>
              <h2 className="text-xl font-bold">{character.name}</h2>
              <p className="text-amber-200 text-sm">
                {character.type === 'pc'
                  ? (character.background || `Level ${character.level || 1}`)
                  : 'Pomocník'}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-amber-600 rounded-lg text-xl">✕</button>
          )}
        </div>
        {/* HP Bar pod jménem */}
        <div className="mt-3 bg-amber-800/50 rounded-full h-2 overflow-hidden">
          <div className={`h-full ${hpColor} transition-all`} style={{ width: `${hpPercent}%` }} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* HP & Pips Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-xs text-stone-500 text-center mb-1">❤️ HP</div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => updateHP(-1)} className="w-8 h-8 bg-red-100 text-red-700 rounded-lg font-bold">−</button>
              <span className="text-xl font-bold text-red-700 min-w-[50px] text-center">
                {character.hp?.current || 0}/{character.hp?.max || 6}
              </span>
              <button onClick={() => updateHP(1)} className="w-8 h-8 bg-green-100 text-green-700 rounded-lg font-bold">+</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-xs text-stone-500 text-center mb-1">💰 Pips</div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => updatePips(-1)} className="w-8 h-8 bg-stone-100 text-stone-700 rounded-lg font-bold">−</button>
              <span className="text-xl font-bold text-amber-600 min-w-[50px] text-center">{character.pips || 0}</span>
              <button onClick={() => updatePips(1)} className="w-8 h-8 bg-stone-100 text-stone-700 rounded-lg font-bold">+</button>
            </div>
          </div>
        </div>

        {/* Attributes - jen pro PC */}
        {character.type === 'pc' && (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { key: 'STR', label: 'SÍL', color: 'red' },
                { key: 'DEX', label: 'MRŠ', color: 'green' },
                { key: 'WIL', label: 'VŮL', color: 'purple' }
              ].map(attr => (
                <div key={attr.key} className={`p-2 bg-${attr.color}-50 rounded-lg`}>
                  <div className={`text-xs font-bold text-${attr.color}-700 mb-1`}>{attr.label}</div>
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-lg font-bold text-${attr.color}-900`}>
                      {character[attr.key]?.current || 10}
                    </span>
                    <span className="text-stone-400 text-sm">/{character[attr.key]?.max || 10}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory */}
        {showInventory && (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-xs font-bold text-stone-600 mb-2">🎒 Inventář</div>

            {popupItem && (
              <ItemPopup
                item={popupItem.item}
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
                <button onClick={() => setSelectedSlot(null)} className="text-amber-600 hover:text-amber-800">✕</button>
              </div>
            )}

            <div ref={inventoryRef} className="flex gap-2 items-start justify-center">
              {/* Paws */}
              <div className="text-center">
                <div className="text-amber-600 text-xs mb-1">🐾</div>
                <div className="flex flex-col gap-1">
                  <InvSlot id="mainPaw" slots={character.inventorySlots} color="amber"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} belowId="offPaw" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                  <InvSlot id="offPaw" slots={character.inventorySlots} color="amber"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} aboveId="mainPaw" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                </div>
              </div>

              {/* Body */}
              <div className="text-center">
                <div className="text-blue-600 text-xs mb-1">👕</div>
                <div className="flex flex-col gap-1">
                  <InvSlot id="body1" slots={character.inventorySlots} color="blue"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} belowId="body2" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                  <InvSlot id="body2" slots={character.inventorySlots} color="blue"
                    onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                    updateChar={updateCharacter} aboveId="body1" slotSize={Math.min(slotSize, 50)}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                </div>
              </div>

              {/* Pack */}
              <div className="text-center flex-1">
                <div className="text-stone-500 text-xs mb-1">🎒</div>
                <div className="grid grid-cols-3 gap-1">
                  {['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6'].map(packId => (
                    <InvSlot key={packId} id={packId} slots={character.inventorySlots} color="stone"
                      onMove={moveInventoryItem} onUpdate={updateSlotItem} onRemove={removeSlotItem}
                      updateChar={updateCharacter}
                      belowId={packId.endsWith('1') ? 'pack4' : packId.endsWith('2') ? 'pack5' : packId.endsWith('3') ? 'pack6' : null}
                      aboveId={packId.endsWith('4') ? 'pack1' : packId.endsWith('5') ? 'pack2' : packId.endsWith('6') ? 'pack3' : null}
                      slotSize={Math.min(slotSize, 50)}
                      selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} setPopupItem={setPopupItem} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* O postavě - collapsible */}
        {character?.type === 'pc' && (character?.birthsign || character?.physicalDetail) && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={handleAboutClick}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-stone-50"
            >
              <span className="text-sm font-bold text-stone-600">📜 O postavě</span>
              <span className="text-stone-400">{openSection === 'about' ? '▼' : '▶'}</span>
            </button>
            {openSection === 'about' && character && (
              <div className="px-3 pb-3 space-y-2 text-sm">
                {character.birthsign && (
                  <div className="flex gap-2">
                    <span className="text-stone-500">⭐ Znamení:</span>
                    <span className="text-stone-700">{String(character.birthsign)}</span>
                  </div>
                )}
                {character.physicalDetail && (
                  <div className="flex gap-2">
                    <span className="text-stone-500">👁️ Vzhled:</span>
                    <span className="text-stone-700">{String(character.physicalDetail)}</span>
                  </div>
                )}
                {character.background && (
                  <div className="flex gap-2">
                    <span className="text-stone-500">📖 Původ:</span>
                    <span className="text-stone-700">{String(character.background)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CHARACTER SIDE PANEL - Vysouvací panel zleva
// ============================================

const CharacterSidePanel = ({
  isOpen,
  onClose,
  character,
  updateCharacter
}) => {
  const panelRef = useRef(null);

  // Zavření Escape klávesou
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Kliknutí na overlay zavře panel
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay - kliknutí zavře panel */}
      <div
        onClick={handleOverlayClick}
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel - vysouvá se zprava */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-md bg-amber-50 shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {character && (
          <CharacterSheet
            character={character}
            updateCharacter={updateCharacter}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
};

// ============================================
// CHARACTER TABS - Záložky na pravé straně (mobil)
// ============================================

const CharacterTabs = ({
  party,
  activeCharacterId,
  onCharacterClick
}) => {
  if (!party?.members || party.members.length === 0) return null;

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1 sm:hidden">
      {party.members.map((member) => {
        const isActive = member.id === activeCharacterId;
        const hpPercent = member.hp ? (member.hp.current / member.hp.max) * 100 : 100;
        const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

        return (
          <button
            key={member.id}
            onClick={() => onCharacterClick(member)}
            className={`relative w-12 h-14 rounded-l-lg shadow-lg flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'bg-amber-500 text-white -translate-x-1'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <span className="text-lg">{member.type === 'pc' ? '🐭' : '🐿️'}</span>
            <span className="text-[10px] font-bold truncate w-full text-center px-1">
              {member.name.split(' ')[0].slice(0, 4)}
            </span>
            {/* HP indikátor */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-200 rounded-b-lg overflow-hidden">
              <div className={`h-full ${hpColor}`} style={{ width: `${hpPercent}%` }} />
            </div>
          </button>
        );
      })}
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
  // Defensive null checks for props that may be undefined from Firebase
  const safeParties = parties || [];
  const safeParty = party || null;

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
    if (!character?.inventory) return;
    updateCharacter({
      inventory: (character.inventory || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeInventoryItem = (id) => {
    if (!character?.inventory) return;
    updateCharacter({ inventory: (character.inventory || []).filter(item => item.id !== id) });
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
  if (!safeParties || safeParties.length === 0) {
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
              const p = safeParties.find(p => p.id === e.target.value);
              if (p?.members?.length > 0) setActiveCharacterId(p.members[0].id);
              else setActiveCharacterId(null);
            }}
            className="flex-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg font-medium"
          >
            {safeParties.map(p => (
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
            
            {!party?.members || party.members.length === 0 ? (
              <p className="text-stone-400 text-center py-4">Prázdná družina - přidej postavu!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(party.members || []).map(member => (
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
                {popupItem && (
                  <ItemPopup 
                    item={popupItem.item} 
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
    if (!character?.inventory) return;
    updateCharacter({
      inventory: (character.inventory || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const removeInventoryItem = (id) => {
    if (!character?.inventory) return;
    updateCharacter({
      inventory: (character.inventory || []).filter(item => item.id !== id)
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
          <div className="overflow-hidden">
            <label className="text-sm text-stone-500 block">Znamení</label>
            <p className="font-bold text-amber-900 truncate">
              {character.birthsign?.name || '—'}
              {character.birthsign?.traits && (
                <span className="font-normal text-sm text-stone-600 block truncate">{character.birthsign.traits}</span>
              )}
            </p>
          </div>
          <div className="overflow-hidden">
            <label className="text-sm text-stone-500 block">Fyzický detail</label>
            <p className="text-stone-700 truncate">{character.physicalDetail || '—'}</p>
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

const WorldPanel = ({ onLogEntry, settlements, setSettlements, worldNPCs, setWorldNPCs, parties, activeParty, activePartyId, updateParty, pendingMentionOpen, setPendingMentionOpen, onDeleteNPC, onDeleteSettlement }) => {
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
  const [settlementEvents, setSettlementEvents] = useState({}); // Pro zobrazení událostí osad

  // Handle pending mention open from journal
  useEffect(() => {
    if (pendingMentionOpen) {
      if (pendingMentionOpen.type === 'npc') {
        setActiveGen('myNPCs');
        setEditingNPC(pendingMentionOpen.id);
      } else if (pendingMentionOpen.type === 'settlement') {
        setActiveGen('mySettlements');
        setEditingSettlement(pendingMentionOpen.id);
      }
      setPendingMentionOpen(null);
    }
  }, [pendingMentionOpen, setPendingMentionOpen]);

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
    // Log to journal
    if (onLogEntry) {
      onLogEntry({
        type: 'saved_settlement',
        settlementId: newSettlement.id,
        data: newSettlement
      });
    }
    setGenerated(null);
  };

  const updateSettlement = (id, updates) => {
    setSettlements(settlements.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSettlement = (id) => {
    // Pokud je dostupný callback, použij ho (maže i z deníku)
    if (onDeleteSettlement) {
      onDeleteSettlement(id);
    } else {
      setSettlements(settlements.filter(s => s.id !== id));
      // Remove settlement reference from NPCs
      setWorldNPCs(worldNPCs.map(n => n.settlementId === id ? { ...n, settlementId: null } : n));
    }
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
    // Log to journal
    if (onLogEntry) {
      onLogEntry({
        type: 'saved_npc',
        npcId: newNPC.id,
        data: newNPC
      });
    }
    setGenerated(null);
  };

  const updateNPC = (id, updates) => {
    setWorldNPCs(worldNPCs.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNPC = (id) => {
    // Pokud je dostupný callback, použij ho (maže i z deníku)
    if (onDeleteNPC) {
      onDeleteNPC(id);
    } else {
      setWorldNPCs(worldNPCs.filter(n => n.id !== id));
      // Remove NPC from settlements
      setSettlements(settlements.map(s => ({
        ...s,
        npcs: s.npcs?.filter(npcId => npcId !== id) || [],
        ruler: s.ruler === id ? null : s.ruler
      })));
    }
  };

  const generateNPCBehavior = (npcId) => {
    const npc = worldNPCs.find(n => n.id === npcId);
    const mood = randomFrom(NPC_BEHAVIOR_MOODS);
    const action = randomFrom(NPC_BEHAVIOR_ACTIONS);
    const motivation = randomFrom(NPC_BEHAVIOR_MOTIVATIONS);
    const behavior = `🎭 Chová se ${mood}, ${action}, protože ${motivation}.`;
    setNpcBehaviors({ ...npcBehaviors, [npcId]: behavior });

    // Zápis do deníku
    if (npc) {
      onLogEntry({
        type: 'world_event',
        subtype: 'npc_behavior',
        timestamp: formatTimestamp(),
        npcId: npc.id,
        npcName: npc.name,
        content: `**${npc.name}:** ${behavior}`,
        data: { npc: npc.name, mood, action, motivation }
      });
    }
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

  // Generátor události pro konkrétní NPC (propojení s Event Generator tabulkami)
  const generateNPCEvent = (npcId) => {
    const npc = worldNPCs.find(n => n.id === npcId);
    if (!npc) return;

    const settlement = settlements.find(s => s.id === npc.settlementId);
    const focus = randomFrom(EVENT_FOCUS);
    const action = randomFrom(EVENT_ACTIONS);
    const subject = randomFrom(EVENT_SUBJECTS);
    const complication = Math.random() > 0.7 ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = `⚡ **${npc.name}**`;
    if (npc.role) narrative += ` (${npc.role})`;
    if (settlement) narrative += ` z **${settlement.name}**`;
    narrative += `\n\n`;
    narrative += `**${focus.label}:** ${focus.description}\n`;
    narrative += `🎯 ${action} ${subject}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    setNpcBehaviors({ ...npcBehaviors, [npcId]: narrative });

    // Zápis do deníku
    onLogEntry({
      type: 'world_event',
      subtype: 'npc_event',
      timestamp: formatTimestamp(),
      npcId: npc.id,
      npcName: npc.name,
      settlementId: settlement?.id,
      settlementName: settlement?.name,
      content: narrative,
      data: {
        npc: npc.name,
        role: npc.role,
        settlement: settlement?.name,
        focus: focus.label,
        action,
        subject,
        complication
      }
    });
  };

  // Generátor události pro konkrétní osadu
  const generateSettlementEvent = (settlementId) => {
    const settlement = settlements.find(s => s.id === settlementId);
    if (!settlement) return;

    const happening = randomFrom(SETTLEMENT_HAPPENINGS);
    const complication = Math.random() > 0.7 ? randomFrom(EVENT_COMPLICATIONS) : null;

    let narrative = `🏘️ **${settlement.name}**\n\n`;
    narrative += `${happening}`;
    if (complication) {
      narrative += `\n\n⚠️ *${complication}*`;
    }

    // Uložit pro zobrazení v UI
    setSettlementEvents({ ...settlementEvents, [settlementId]: narrative });

    // Zápis do deníku
    onLogEntry({
      type: 'world_event',
      subtype: 'settlement_event',
      timestamp: formatTimestamp(),
      settlementId: settlement.id,
      settlementName: settlement.name,
      content: narrative,
      data: {
        settlement: settlement.name,
        happening,
        complication
      }
    });
  };

  // Generátor zvěsti pro konkrétní osadu
  const generateSettlementRumor = (settlementId) => {
    const settlement = settlements.find(s => s.id === settlementId);
    if (!settlement) return;

    const rumor = randomFrom(SETTLEMENT_RUMORS);

    const narrative = `💬 **Zvěst z ${settlement.name}:**\n\n"${rumor}"`;

    // Uložit pro zobrazení v UI
    setSettlementEvents({ ...settlementEvents, [settlementId]: narrative });

    // Zápis do deníku
    onLogEntry({
      type: 'world_event',
      subtype: 'settlement_rumor',
      timestamp: formatTimestamp(),
      settlementId: settlement.id,
      settlementName: settlement.name,
      content: narrative,
      data: {
        settlement: settlement.name,
        rumor
      }
    });
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

  // Generátor jména osady podle pravidel (2x k12)
  const generateSettlementName = () => {
    const startPair = randomFrom(SETTLEMENT_NAME_STARTS);
    const endPair = randomFrom(SETTLEMENT_NAME_ENDS);
    const start = randomFrom(startPair);
    const end = randomFrom(endPair);
    // Kombinace - pokud konec začíná malým písmenem, připoj přímo
    if (end[0] === end[0].toLowerCase()) {
      return start + end;
    }
    return start + ' ' + end;
  };

  // Generátor zřízení podle velikosti
  const getGovernance = (sizeIndex) => {
    const roll = rollD6() + sizeIndex;
    if (roll <= 3) return SETTLEMENT_GOVERNANCE[0].name;
    if (roll <= 5) return SETTLEMENT_GOVERNANCE[1].name;
    if (roll <= 7) return SETTLEMENT_GOVERNANCE[2].name;
    if (roll <= 9) return SETTLEMENT_GOVERNANCE[3].name;
    if (roll <= 11) return SETTLEMENT_GOVERNANCE[4].name;
    return SETTLEMENT_GOVERNANCE[5].name;
  };

  // Generátor hostince
  const generateInn = () => {
    const first = randomFrom(INN_NAME_FIRST);
    const second = randomFrom(INN_NAME_SECOND);
    const specialty = randomFrom(INN_SPECIALTIES);
    return { name: `U ${first}ho ${second}a`, specialty };
  };

  const generateSettlement = () => {
    // Velikost: 2k6, použij nižší hodnotu
    const roll1 = rollD6();
    const roll2 = rollD6();
    const sizeRoll = Math.min(roll1, roll2);
    const sizeData = SETTLEMENT_SIZES[sizeRoll - 1];

    // Zřízení: k6 + velikost
    const governance = getGovernance(sizeData.sizeIndex);

    // Živnost: k20 (města a velkoměsta hoď dvakrát)
    const trades = [randomFrom(SETTLEMENT_TRADES)];
    if (sizeData.sizeIndex >= 5) {
      const second = randomFrom(SETTLEMENT_TRADES);
      if (second !== trades[0]) trades.push(second);
    }

    // Událost: k20
    const event = randomFrom(SETTLEMENT_EVENTS);

    // Jméno podle pravidel
    const name = generateSettlementName();

    // Landmark a feature jako bonus
    const landmark = randomFrom(LANDMARKS);
    const feature = randomFrom(SETTLEMENT_FEATURES);

    // Hostinec (pro vísky a větší)
    const inn = sizeData.sizeIndex >= 3 ? generateInn() : null;

    const settlement = {
      type: 'settlement',
      name,
      size: sizeData.name,
      population: sizeData.population,
      governance,
      trades,
      event,
      landmark,
      feature,
      inn,
      npcs: [],
      // Hody pro referenci
      rolls: {
        size: [roll1, roll2],
        sizeResult: sizeRoll
      }
    };

    setGenerated(settlement);
    // Poznámka: Nezapisujeme do deníku při generování - záznam se vytvoří až při uložení (saved_settlement)
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
    // Poznámka: Nezapisujeme do deníku při generování - záznam se vytvoří až při uložení (saved_npc)
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
    { id: 'mySettlements', label: 'Osady', icon: '🏘️' },
    { id: 'myNPCs', label: 'NPC', icon: '🐭' },
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
          {/* Generátor osady */}
          <ResultCard>
            <HelpHeader
              title="Generátor osady"
              icon="🎲"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 Generování podle pravidel Mausritter</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>📏 <b>Velikost</b> - 2k6 (nižší hodnota): Farma → Velkoměsto</li>
                    <li>👑 <b>Zřízení</b> - k6 + velikost: stařešinové → šlechta</li>
                    <li>🔧 <b>Živnost</b> - k20 (města hoď 2×)</li>
                    <li>⚡ <b>Událost</b> - co se děje při příchodu</li>
                    <li>🏷️ <b>Jméno</b> - 2× k12 z tabulky semínek</li>
                    <li>🍺 <b>Hostinec</b> - pro vísky a větší</li>
                  </ul>
                </div>
              }
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={generateSettlement} size="large" className="flex-1">
                🎲 Generovat osadu
              </Button>
              <Button onClick={createEmptySettlement} variant="secondary">
                + Prázdná
              </Button>
            </div>
          </ResultCard>

          {/* Vygenerovaná osada */}
          {generated && generated.type === 'settlement' && (
            <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-amber-900 truncate">{generated.name}</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Velikost</span>
                    <p className="font-bold truncate">{generated.size}</p>
                    <p className="text-xs text-stone-500">{generated.population}</p>
                  </div>
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Zřízení</span>
                    <p className="font-bold text-sm">{generated.governance}</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-100 rounded overflow-hidden">
                  <span className="text-sm text-blue-700">Živnost</span>
                  {generated.trades?.map((trade, i) => (
                    <p key={i} className="font-bold text-blue-900">{trade}</p>
                  ))}
                </div>

                <div className="p-3 bg-orange-100 rounded overflow-hidden">
                  <span className="text-sm text-orange-700">Co se děje při příchodu</span>
                  <p className="font-bold text-orange-900">{generated.event}</p>
                </div>

                {generated.inn && (
                  <div className="p-3 bg-purple-100 rounded overflow-hidden">
                    <span className="text-sm text-purple-700">Hostinec</span>
                    <p className="font-bold text-purple-900">{generated.inn.name}</p>
                    <p className="text-sm text-purple-700">Specialita: {generated.inn.specialty}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-100 rounded overflow-hidden">
                    <span className="text-sm text-green-700">Landmark</span>
                    <p className="font-bold text-green-900 text-sm">{generated.landmark}</p>
                  </div>
                  <div className="p-3 bg-stone-100 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Zajímavost</span>
                    <p className="font-bold text-stone-700 text-sm">{generated.feature}</p>
                  </div>
                </div>

                <Button onClick={() => saveSettlementToWorld(generated)} className="w-full">
                  📥 Uložit do seznamu
                </Button>
              </div>
            </ResultCard>
          )}

          {/* Seznam osad */}
          {settlements.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-4">
                Zatím nemáš žádné uložené osady.<br/>
                <span className="text-sm">Vygeneruj novou pomocí tlačítka výše.</span>
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
                          options={SETTLEMENT_SIZES.map(s => ({ value: s.name, label: `${s.name} (${s.population})` }))}
                        />
                        <Input
                          value={settlement.population || ''}
                          onChange={(v) => updateSettlement(settlement.id, { population: v })}
                          placeholder="Populace"
                        />
                      </div>
                      <Input
                        value={settlement.governance || ''}
                        onChange={(v) => updateSettlement(settlement.id, { governance: v })}
                        placeholder="Zřízení (kdo vládne)"
                      />
                      <Input
                        value={Array.isArray(settlement.trades) ? settlement.trades.join(', ') : (settlement.trades || '')}
                        onChange={(v) => updateSettlement(settlement.id, { trades: v.split(',').map(t => t.trim()).filter(Boolean) })}
                        placeholder="Živnosti (oddělené čárkou)"
                      />
                      <Input
                        value={settlement.event || ''}
                        onChange={(v) => updateSettlement(settlement.id, { event: v })}
                        placeholder="Aktuální událost/problém"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={settlement.landmark || ''}
                          onChange={(v) => updateSettlement(settlement.id, { landmark: v })}
                          placeholder="Landmark"
                        />
                        <Input
                          value={settlement.feature || ''}
                          onChange={(v) => updateSettlement(settlement.id, { feature: v })}
                          placeholder="Zajímavost"
                        />
                      </div>
                      <Input
                        value={settlement.inn?.name || ''}
                        onChange={(v) => updateSettlement(settlement.id, { inn: { ...settlement.inn, name: v } })}
                        placeholder="Hostinec (jméno)"
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
                      className="cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors overflow-hidden"
                      onClick={() => setViewingSettlement(viewingSettlement === settlement.id ? null : settlement.id)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-lg text-amber-900 truncate">{settlement.name}</h3>
                          <p className="text-sm text-stone-600 truncate">
                            {settlement.size}
                            {settlement.population && ` • ${settlement.population}`}
                            {settlement.governance && ` • ${settlement.governance}`}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className="text-xs text-stone-400">{settlement.npcs?.length || 0} NPC</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingSettlement(settlement.id); }}
                            className="text-stone-400 hover:text-stone-600"
                          >✏️</button>
                        </div>
                      </div>

                      {viewingSettlement === settlement.id && (
                        <div className="mt-3 pt-3 border-t border-amber-200 space-y-2 text-sm">
                          {settlement.trades?.length > 0 && (
                            <p><span className="text-stone-500">Živnost:</span> {settlement.trades.join(', ')}</p>
                          )}
                          {settlement.event && <p><span className="text-stone-500">Událost:</span> {settlement.event}</p>}
                          {settlement.inn?.name && (
                            <p><span className="text-stone-500">Hostinec:</span> {settlement.inn.name}{settlement.inn.specialty && ` (${settlement.inn.specialty})`}</p>
                          )}
                          {settlement.landmark && <p><span className="text-stone-500">Landmark:</span> {settlement.landmark}</p>}
                          {settlement.feature && <p><span className="text-stone-500">Zajímavost:</span> {settlement.feature}</p>}
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

                          {/* Generátory událostí osady */}
                          <div className="mt-3 pt-3 border-t border-amber-200">
                            <p className="text-sm font-bold text-stone-700 mb-2">⚡ Generátory:</p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); generateSettlementEvent(settlement.id); }}
                                className="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors font-medium"
                              >
                                ⚡ Událost
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); generateSettlementRumor(settlement.id); }}
                                className="px-3 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition-colors font-medium"
                              >
                                💬 Zvěst
                              </button>
                            </div>
                            {/* Zobrazení výsledku */}
                            {settlementEvents[settlement.id] && (
                              <div className="mt-3 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border-2 border-orange-300 shadow-inner">
                                <div className="text-sm text-stone-800 whitespace-pre-line">
                                  {settlementEvents[settlement.id].split('\n').map((line, i) => {
                                    const formatted = line
                                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                      .replace(/\*(.+?)\*/g, '<em class="text-stone-600">$1</em>');
                                    return <p key={i} className="mb-1" dangerouslySetInnerHTML={{__html: formatted}} />;
                                  })}
                                </div>
                              </div>
                            )}
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
          {/* Generátor NPC */}
          <ResultCard>
            <HelpHeader
              title="Generátor NPC"
              icon="🎲"
              tooltip={
                <div>
                  <p className="font-bold mb-2">🎯 Generování NPC</p>
                  <ul className="text-xs space-y-1 mb-2">
                    <li>🏷️ <b>Jméno</b> - české myší jméno</li>
                    <li>⭐ <b>Znamení</b> - osobnostní archetyp</li>
                    <li>👁️ <b>Vzhled</b> - fyzický detail</li>
                    <li>🎭 <b>Zvláštnost</b> - jak se chová</li>
                    <li>🎯 <b>Cíl</b> - co právě teď chce</li>
                    <li>🎲 <b>Reakce (2d6)</b> - jak reaguje na hráče</li>
                  </ul>
                </div>
              }
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={generateNPC} size="large" className="flex-1">
                🎲 Generovat NPC
              </Button>
              <Button onClick={() => createEmptyNPC()} variant="secondary">
                + Prázdná
              </Button>
            </div>
          </ResultCard>

          {/* Vygenerované NPC */}
          {generated && generated.type === 'npc' && (
            <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-amber-900 truncate">{generated.name}</h3>
                {generated.role && (
                  <p className="text-center text-stone-600 font-medium truncate">🔧 {generated.role}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm font-mono bg-stone-100 rounded px-3 py-2 justify-center">
                  <span>BO: <b>{generated.hp?.max}</b></span>
                  <span>SÍL: <b>{generated.str?.max}</b></span>
                  <span>MRŠ: <b>{generated.dex?.max}</b></span>
                  <span>VŮL: <b>{generated.wil?.max}</b></span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Znamení</span>
                    <p className="font-bold truncate">{generated.birthsign?.sign}</p>
                    <p className="text-sm text-stone-600 truncate">{generated.birthsign?.trait}</p>
                  </div>
                  <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                    <span className="text-sm text-stone-500">Vzhled</span>
                    <p className="font-bold truncate">{generated.physicalDetail}</p>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded overflow-hidden">
                  <span className="text-sm text-purple-700">Zvláštnost</span>
                  <p className="font-bold text-purple-900">{generated.quirk}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded overflow-hidden">
                  <span className="text-sm text-blue-700">Cíl</span>
                  <p className="font-bold text-blue-900">{generated.goal}</p>
                </div>
                <div className="p-3 bg-stone-100 rounded">
                  <span className="text-sm text-stone-600">Reakce (2d6)</span>
                  <p className="mt-1 font-bold text-center">
                    [{generated.reaction?.dice?.join(', ')}] = {generated.reaction?.total} →{' '}
                    {generated.reaction?.total <= 3 ? '😠 Nepřátelský' :
                     generated.reaction?.total <= 5 ? '😒 Nevlídný' :
                     generated.reaction?.total <= 8 ? '😐 Neutrální' :
                     generated.reaction?.total <= 10 ? '😊 Přátelský' : '🤝 Nápomocný'}
                  </p>
                </div>
                <Button onClick={() => saveNPCToWorld({
                  ...generated,
                  birthsign: `${generated.birthsign?.sign} (${generated.birthsign?.trait})`
                })} className="w-full">
                  📥 Uložit do seznamu
                </Button>
              </div>
            </ResultCard>
          )}

          {/* Seznam NPC */}
          {worldNPCs.length === 0 ? (
            <ResultCard>
              <p className="text-center text-stone-500 py-4">
                Zatím nemáš žádné uložené NPC.<br/>
                <span className="text-sm">Vygeneruj novou pomocí tlačítka výše.</span>
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
                        <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                          <span className="text-sm text-stone-500">Znamení</span>
                          <input value={npc.birthsign || ''} onChange={(e) => updateNPC(npc.id, { birthsign: e.target.value })} placeholder="Znamení" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none truncate" />
                        </div>
                        <div className="p-3 bg-amber-100/50 rounded overflow-hidden">
                          <span className="text-sm text-stone-500">Vzhled</span>
                          <input value={npc.physicalDetail || ''} onChange={(e) => updateNPC(npc.id, { physicalDetail: e.target.value })} placeholder="Vzhled" className="w-full font-bold bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none truncate" />
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100 rounded overflow-hidden">
                        <span className="text-sm text-purple-700">Zvláštnost</span>
                        <input value={npc.quirk || ''} onChange={(e) => updateNPC(npc.id, { quirk: e.target.value })} placeholder="Zvláštnost" className="w-full font-bold text-purple-900 bg-transparent border-b border-purple-300 focus:border-purple-500 outline-none truncate" />
                      </div>
                      <div className="p-3 bg-blue-100 rounded overflow-hidden">
                        <span className="text-sm text-blue-700">Cíl</span>
                        <input value={npc.goal || ''} onChange={(e) => updateNPC(npc.id, { goal: e.target.value })} placeholder="Cíl" className="w-full font-bold text-blue-900 bg-transparent border-b border-blue-300 focus:border-blue-500 outline-none truncate" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-stone-100 rounded overflow-hidden">
                          <span className="text-sm text-stone-500">Role</span>
                          <input value={npc.role || ''} onChange={(e) => updateNPC(npc.id, { role: e.target.value })} placeholder="Role/povolání" className="w-full font-bold bg-transparent border-b border-stone-300 focus:border-stone-500 outline-none truncate" />
                        </div>
                        <div className="p-3 bg-stone-100 rounded overflow-hidden">
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
                          <button onClick={() => generateNPCEvent(npc.id)} className="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors font-medium">
                            ⚡ Událost
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
                    <div className="overflow-hidden">
                      <div className="flex justify-between items-start gap-2">
                        <div
                          className="min-w-0 flex-1 cursor-pointer hover:bg-amber-50 -m-3 p-3 rounded-lg transition-colors"
                          onClick={() => setEditingNPC(npc.id)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-amber-900 truncate">{npc.name}</h3>
                              <p className="text-sm text-stone-600 truncate">{npc.role && `${npc.role} • `}{npc.settlementId ? settlements.find(s => s.id === npc.settlementId)?.name : 'Bez domova'}</p>
                            </div>
                            {(npc.hp || npc.str) && (
                              <div className="text-xs font-mono text-stone-500 flex-shrink-0 whitespace-nowrap hidden sm:block">
                                BO:{npc.hp?.current}/{npc.hp?.max} SÍL:{npc.str?.max}
                              </div>
                            )}
                          </div>
                          {(npc.birthsign || npc.physicalDetail || npc.quirk || npc.goal) && (
                            <div className="mt-2 text-sm text-stone-600 space-y-1">
                              {npc.birthsign && <p className="truncate">⭐ {npc.birthsign}</p>}
                              {npc.physicalDetail && <p className="truncate">👁️ {npc.physicalDetail}</p>}
                              {npc.quirk && <p className="truncate">🎭 {npc.quirk}</p>}
                              {npc.goal && <p className="truncate">🎯 {npc.goal}</p>}
                            </div>
                          )}
                          {npc.notes && <p className="mt-2 text-sm italic text-stone-500 line-clamp-2">{npc.notes}</p>}
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => setEditingNPC(npc.id)}
                            className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-colors"
                            title="Upravit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteNPC(npc.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Smazat"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </ResultCard>
              ))}
            </div>
          )}
        </div>
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

      {/* Generated Result (dungeon, weather, bestiary) */}
      {generated && generated.type !== 'settlement' && generated.type !== 'npc' && (
        <ResultCard title="📋 Vygenerováno" className="border-amber-500 border-2">
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
                {WEATHER_EFFECTS[generated.weather]?.icon || '🌤️'}
              </div>
              <p className="text-3xl font-bold text-amber-900">{generated.weather}</p>
              {WEATHER_EFFECTS[generated.weather]?.danger && (
                <p className="text-red-600 font-medium">⚠️ {WEATHER_EFFECTS[generated.weather]?.effect}</p>
              )}
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
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    {editingFaction === faction.id ? (
                      <Input
                        value={faction.name}
                        onChange={(v) => updateFaction(faction.id, { name: v })}
                        className="text-xl font-bold"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-amber-900 truncate">{faction.name}</h3>
                    )}
                    {faction.trait && <p className="text-stone-600 italic truncate">{faction.trait}</p>}
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
// LEXIKON PANEL
// Encyklopedie světa - lore, lokace, NPC, předměty
// ============================================

const LexikonPanel = ({ lexicon, setLexicon, journal }) => {
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

  const activeParty = (parties || []).find(p => p.id === activePartyId);

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
        subtitle={`${(parties || []).length} družin, ${(parties || []).reduce((acc, p) => acc + (p.members || []).length, 0)} postav celkem`}
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
      {!parties || parties.length === 0 ? (
        <ResultCard>
          <div className="text-center py-8 text-stone-500">
            <p className="text-4xl mb-3">🐭</p>
            <p>Zatím nemáš žádnou družinu.</p>
            <p className="text-sm mt-2">Vytvoř první družinu a přidej do ní postavy!</p>
          </div>
        </ResultCard>
      ) : (
        <div className="space-y-4">
          {(parties || []).map(party => {
            const isActive = party.id === activePartyId;
            const isExpanded = expandedParties[party.id] !== false; // Default expanded
            const isEditing = editingPartyId === party.id;
            
            return (
              <ResultCard 
                key={party.id} 
                className={`${isActive ? 'border-2 border-amber-500 shadow-lg' : ''}`}
              >
                {/* Party Header */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleExpand(party.id)}
                      className="text-xl hover:bg-amber-100 rounded p-1 flex-shrink-0"
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
                        className="flex-1 min-w-0 px-2 py-1 border-2 border-amber-500 rounded font-bold text-lg"
                      />
                    ) : (
                      <h3
                        className="font-bold text-lg text-amber-900 cursor-pointer hover:text-amber-700 truncate min-w-0"
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
                    {!party.members || party.members.length === 0 ? (
                      <p className="text-stone-400 text-sm text-center py-3">
                        Družina je prázdná. Přidej postavy níže.
                      </p>
                    ) : (
                      (party.members || []).map(member => {
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
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="text-2xl flex-shrink-0">{isPC ? '🐭' : '🐿️'}</span>
                                <div className="min-w-0">
                                  {isCharEditing ? (
                                    <input
                                      type="text"
                                      value={member.name}
                                      onChange={(e) => updateCharacterInParty(party.id, member.id, { name: e.target.value })}
                                      onBlur={() => setEditingCharId(null)}
                                      onKeyDown={(e) => e.key === 'Enter' && setEditingCharId(null)}
                                      onClick={(e) => e.stopPropagation()}
                                      autoFocus
                                      className="px-2 py-1 border-2 border-amber-500 rounded font-bold w-full"
                                    />
                                  ) : (
                                    <span
                                      className="font-bold text-stone-800 hover:text-amber-700 block truncate"
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
                                      {(member.skills || []).map((skill, i) => (
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

// Efekty počasí podle pravidel Mausritter CZ
// Nepříznivé podmínky (danger: true) = při cestování STR save nebo stav Vyčerpání
const WEATHER_EFFECTS = {
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

// ============================================
// JOURNAL PANEL
// ============================================

const JournalPanel = ({ journal, setJournal, parties, partyFilter, setPartyFilter, onExport, worldNPCs = [], settlements = [], timedEvents = [], gameTime, onMentionClick, onOpenEvents, onDeleteNPC, onDeleteSettlement, onPromoteToNPC, onUpdateNPC, lexicon, setLexicon, myUserId, roomPlayers = [], roomConnected }) => {
  // Get current player name for authoring entries
  const myPlayer = roomPlayers.find(p => p.oderId === myUserId);
  const myAuthorName = myPlayer?.name || null;
  const [newEntry, setNewEntry] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal pro zobrazení detailu NPC/osady
  const [detailModal, setDetailModal] = useState(null); // { type: 'npc'|'settlement', data: ... }
  const [generatedBehavior, setGeneratedBehavior] = useState(null); // Dočasné vygenerované chování pro modal
  const [weatherModal, setWeatherModal] = useState(null); // Modal pro detail počasí/období

  // Multi-select mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const longPressTimer = useRef(null);

  // Drag & drop pro přesouvání záznamů
  const [draggedId, setDraggedId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  // Helper pro robustní parsing timestamp (string i number)
  const parseTimestamp = (ts) => {
    if (!ts) return 'Neznámé datum';
    if (typeof ts === 'string') return ts;
    if (typeof ts === 'number') {
      return new Date(ts).toLocaleString('cs-CZ');
    }
    return String(ts);
  };

  // Extrahuj datum z timestamp stringu
  const extractDate = (ts) => {
    const tsStr = parseTimestamp(ts);
    const parts = tsStr.split(' ');
    return parts.length >= 3 ? `${parts[0]} ${parts[1]} ${parts[2]}` : tsStr;
  };

  // Touch drag & drop pro mobilní zařízení
  const [touchDragId, setTouchDragId] = useState(null);

  // Vkládání poznámek mezi záznamy
  const [insertAfterIndex, setInsertAfterIndex] = useState(null); // Index záznamu, ZA který vložíme nový
  const [insertText, setInsertText] = useState('');

  // @ mentions
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionTarget, setMentionTarget] = useState(null); // 'newEntry' | 'insert'
  const newEntryRef = useRef(null);

  // Všechny dostupné zmínky
  const allMentions = [
    ...worldNPCs.map(n => ({ type: 'npc', id: n.id, name: n.name, icon: '🐭' })),
    ...settlements.map(s => ({ type: 'settlement', id: s.id, name: s.name, icon: '🏘️' })),
    ...(parties?.flatMap(p => p.characters?.map(c => ({ type: 'character', id: c.id, name: c.name, icon: '⚔️' })) || []) || [])
  ];

  const filteredMentions = mentionFilter
    ? allMentions.filter(m => m.name.toLowerCase().includes(mentionFilter.toLowerCase())).slice(0, 6)
    : allMentions.slice(0, 6);

  // Detekce @ v textu
  const handleMentionInput = (text, target, inputRef) => {
    const pos = inputRef?.selectionStart || text.length;
    const textBefore = text.slice(0, pos);
    const atMatch = textBefore.match(/@([\wáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*)$/i);

    if (atMatch) {
      setMentionFilter(atMatch[1]);
      setShowMentions(true);
      setMentionIndex(0);
      setMentionTarget(target);
    } else {
      setShowMentions(false);
    }
  };

  // Vložení mention ve formátu @Jméno (jednoduchý formát)
  const insertMention = (mention, text, setText, inputRef) => {
    const pos = inputRef?.selectionStart || text.length;
    const textBefore = text.slice(0, pos);
    const textAfter = text.slice(pos);
    const atIndex = textBefore.lastIndexOf('@');
    const before = textBefore.slice(0, atIndex);
    const mentionText = `@${mention.name}`;
    const newText = before + mentionText + ' ' + textAfter;
    setText(newText);
    setShowMentions(false);
    setMentionFilter('');
    setTimeout(() => {
      if (inputRef) {
        const newPos = before.length + mentionText.length + 1;
        inputRef.selectionStart = newPos;
        inputRef.selectionEnd = newPos;
        inputRef.focus();
      }
    }, 0);
  };

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
      partyId: partyFilter !== 'all' ? partyFilter : null,
      // Author info for multiplayer
      authorId: roomConnected ? myUserId : null,
      authorName: roomConnected ? myAuthorName : null
    };
    setJournal([...journal, entry]);
    setNewEntry('');
  };

  // Extrakce a vytvoření lore tagů z textu
  const extractAndCreateLoreTags = (text, sourceEntryId = null) => {
    if (!text || !setLexicon || !lexicon) return;

    // Regex pro @kategorie:název
    const loreTagRegex = /@(lokace|npc|stvoreni|predmet|frakce|pravidlo|udalost):([^\s@.,!?;:]+(?:\s+[^\s@.,!?;:]+)*)/gi;
    let match;
    const newItems = [];

    while ((match = loreTagRegex.exec(text)) !== null) {
      const category = match[1].toLowerCase();
      const name = match[2];

      // Kontrola zda položka již existuje
      const exists = lexicon.some(l =>
        l.category === category &&
        l.name.toLowerCase() === name.toLowerCase()
      );

      if (!exists) {
        // Vytvoř novou položku
        newItems.push({
          id: generateId(),
          name: name,
          category: category,
          description: '',
          imageData: null,
          createdAt: new Date().toISOString(),
          sourceEntryId: sourceEntryId
        });
      }
    }

    // Přidej nové položky do lexikonu
    if (newItems.length > 0) {
      setLexicon([...newItems, ...lexicon]);
    }
  };

  // Přidání narativního záznamu s extrakcí lore tagů
  const addNarrativeEntryWithScene = () => {
    if (!newEntry.trim()) return;

    const entryId = generateId();
    const entry = {
      id: entryId,
      type: 'narrative',
      timestamp: formatTimestamp(),
      content: newEntry,
      partyId: partyFilter !== 'all' ? partyFilter : null,
      // Author info for multiplayer
      authorId: roomConnected ? myUserId : null,
      authorName: roomConnected ? myAuthorName : null
    };

    // Extrahuj a vytvoř lore tagy z textu
    extractAndCreateLoreTags(newEntry, entryId);

    setJournal([...journal, entry]);
    setNewEntry('');
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Esc pro zavření modalů a editace
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (detailModal) {
          setDetailModal(null);
          setGeneratedBehavior(null);
        } else if (weatherModal) {
          setWeatherModal(null);
        } else if (editingId) {
          setEditingId(null);
          setConfirmDeleteId(null);
        } else if (selectionMode) {
          setSelectionMode(false);
          setSelectedIds(new Set());
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [detailModal, weatherModal, editingId, selectionMode]);

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

  // Drag & drop handlers
  const handleDragStart = (e, entryId) => {
    setDraggedId(entryId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', entryId);
  };

  const handleDragOver = (e, entryId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (entryId !== draggedId) {
      setDropTargetId(entryId);
    }
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e, targetEntryId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetEntryId) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    // Najdi indexy v původním (nefiltrovaném) journalu
    const draggedIndex = journal.findIndex(e => e.id === draggedId);
    const targetIndex = journal.findIndex(e => e.id === targetEntryId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    // Přesuň záznam
    const newJournal = [...journal];
    const [draggedEntry] = newJournal.splice(draggedIndex, 1);

    // Vloží ZA cílový záznam
    const insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
    newJournal.splice(insertIndex, 0, draggedEntry);

    setJournal(newJournal);
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  // Touch drag handlers pro mobilní zařízení
  const handleTouchDragStart = (e, entryId) => {
    e.preventDefault();
    e.stopPropagation();
    setTouchDragId(entryId);
    setDropTargetId(null);
    // Zruš long press timer pokud běží
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchDragMove = (e) => {
    if (!touchDragId) return;
    e.preventDefault();
    const touch = e.touches[0];

    // Najdi element pod prstem
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const entryElement = elements.find(el => el.dataset && el.dataset.entryId);

    if (entryElement && entryElement.dataset.entryId !== touchDragId) {
      setDropTargetId(entryElement.dataset.entryId);
    }
  };

  const handleTouchDragEnd = () => {
    if (!touchDragId) return;

    if (dropTargetId && dropTargetId !== touchDragId) {
      // Proveď přesun
      const draggedIndex = journal.findIndex(j => j.id === touchDragId);
      const targetIndex = journal.findIndex(j => j.id === dropTargetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newJournal = [...journal];
        const [draggedEntry] = newJournal.splice(draggedIndex, 1);
        const insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
        newJournal.splice(insertIndex, 0, draggedEntry);
        setJournal(newJournal);
      }
    }

    setTouchDragId(null);
    setDropTargetId(null);
  };

  // Vložení nové poznámky mezi záznamy
  const insertNoteAfter = (afterEntryId) => {
    if (!insertText.trim()) {
      setInsertAfterIndex(null);
      return;
    }

    const targetIndex = journal.findIndex(e => e.id === afterEntryId);
    if (targetIndex === -1) return;

    // Použij timestamp z cílového záznamu (aby zůstala ve stejné skupině)
    const targetEntry = journal[targetIndex];

    const newEntry = {
      id: generateId(),
      type: 'narrative',
      timestamp: targetEntry.timestamp,
      content: insertText,
      partyId: partyFilter !== 'all' ? partyFilter : targetEntry.partyId,
      // Author info for multiplayer
      authorId: roomConnected ? myUserId : null,
      authorName: roomConnected ? myAuthorName : null
    };

    const newJournal = [...journal];
    newJournal.splice(targetIndex + 1, 0, newEntry);

    setJournal(newJournal);
    setInsertText('');
    setInsertAfterIndex(null);
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
    const date = extractDate(entry.timestamp);
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(entry);
  });

  // Format entry based on type - book style
  const formatEntry = (entry) => {
    if (editingId === entry.id) {
      return (
        <div className="flex items-start gap-2">
          <div className="flex-1 relative">
            <textarea
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
                handleMentionInput(e.target.value, 'edit', e.target);
              }}
              onKeyDown={(e) => {
                if (showMentions && mentionTarget === 'edit') {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setMentionIndex(i => Math.min(i + 1, filteredMentions.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setMentionIndex(i => Math.max(i - 1, 0));
                  } else if (e.key === 'Enter' && filteredMentions[mentionIndex]) {
                    e.preventDefault();
                    insertMention(filteredMentions[mentionIndex], editText, setEditText, e.target);
                  } else if (e.key === 'Escape') {
                    setShowMentions(false);
                  }
                } else if (e.key === 'Escape') {
                  setEditingId(null);
                  setConfirmDeleteId(null);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (mentionTarget === 'edit') setShowMentions(false);
                  if (editText.trim()) {
                    saveEdit(entry.id);
                  }
                }, 150);
              }}
              className="w-full px-2 py-1 text-sm font-serif text-stone-700 bg-transparent border-b border-amber-400 focus:outline-none focus:border-amber-600 placeholder:text-stone-400 resize-none overflow-hidden"
              placeholder={entry.type === 'narrative' ? 'Tvůj příběh... (@ pro zmínku)' : 'Poznámka... (@ pro zmínku)'}
              autoFocus
              rows={1}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }
              }}
            />
            {/* Mention dropdown pro edit */}
            {showMentions && mentionTarget === 'edit' && filteredMentions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                {filteredMentions.map((m, i) => (
                  <button
                    key={`edit-${m.type}-${m.id}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertMention(m, editText, setEditText, document.activeElement);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-amber-50 ${i === mentionIndex ? 'bg-amber-100' : ''}`}
                  >
                    <span>{m.icon}</span>
                    <span className="font-medium">{m.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Tlačítko pro zavření editace */}
            <button
              onMouseDown={(e) => { e.preventDefault(); if (editText.trim()) saveEdit(entry.id); setEditingId(null); setConfirmDeleteId(null); }}
              className="text-stone-400 hover:text-stone-600 p-1 text-lg"
              title="Hotovo"
            >
              ✓
            </button>
            {confirmDeleteId === entry.id ? (
              <div className="flex gap-1 text-xs whitespace-nowrap">
                <button onMouseDown={(e) => { e.preventDefault(); deleteEntry(entry.id); }} className="text-red-500 hover:text-red-700">Smazat?</button>
                <button onMouseDown={(e) => { e.preventDefault(); setConfirmDeleteId(null); }} className="text-stone-400 hover:text-stone-600">Ne</button>
              </div>
            ) : (
              <button
                onMouseDown={(e) => { e.preventDefault(); setConfirmDeleteId(entry.id); }}
                className="text-stone-300 hover:text-red-400 text-sm"
                title="Smazat"
              >
                ×
              </button>
            )}
          </div>
        </div>
      );
    }

    switch (entry.type) {
      case 'narrative':
        return (
          <div className="my-3 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            {entry.authorName && (
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mr-2">
                {entry.authorName}
              </span>
            )}
            <span className="text-stone-800 italic leading-relaxed">
              {parseMentions(entry.content, onMentionClick, worldNPCs, settlements, lexicon)}
            </span>
            {entry.edited && <span className="text-xs text-stone-400 ml-1">✎</span>}
          </div>
        );

      case 'oracle':
        // Handle creature subtype - kratší zobrazení (+ fallback pro staré záznamy bez subtype)
        if ((entry.subtype === 'creature' || (entry.data?.type?.name && entry.data?.personality)) && entry.data) {
          const c = entry.data;
          return (
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden"
                 onClick={() => setDetailModal({ type: 'creature', data: c, note: entry.note })}
                 title="Klikni pro detail">
              <p className="font-bold text-amber-900 truncate">
                {c.type?.icon || '🐭'} {c.name} <span className="font-normal text-stone-500">— {c.type?.name}</span>
              </p>
              <p className="text-stone-600 text-sm truncate">Je {c.personality}</p>
              {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
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
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-bold text-amber-900 truncate">
                🐭 {name} {typePart && <span className="font-normal text-stone-500">— {typePart}</span>}
              </p>
              {personality && <p className="text-stone-600 text-sm truncate">{personality}</p>}
              {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
            </div>
          );
        }
        // Handle encounter subtype - kratší zobrazení (+ fallback pro staré záznamy)
        if ((entry.subtype === 'encounter' || (entry.data?.creature && entry.data?.activity)) && entry.data) {
          const e = entry.data;
          return (
            <div className="my-2 pl-4 border-l-2 border-red-400 cursor-pointer hover:bg-red-50 rounded transition-colors overflow-hidden"
                 onClick={() => setDetailModal({ type: 'encounter', data: { creature: e.creature?.name || e.creature, activity: e.activity, danger: e.danger }, note: entry.note })}
                 title="Klikni pro detail">
              <p className="font-bold text-stone-800 truncate">
                {e.danger ? '⚠️' : '👁️'} {e.creature?.name}
              </p>
              <p className="text-stone-600 text-sm truncate">{e.activity}</p>
              {entry.note && <p className="text-stone-700 italic text-sm mt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
            </div>
          );
        }
        // Handle narrative subtype - abstraktní slova
        if (entry.subtype === 'narrative') {
          return (
            <div className="my-2 pl-4 border-l-2 border-purple-400 cursor-pointer hover:bg-purple-50 rounded transition-colors overflow-hidden"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              <p className="font-medium text-purple-900 truncate">{entry.result}</p>
              {entry.note && <p className="text-stone-700 italic text-sm mt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
            </div>
          );
        }
        // Handle frame_scene subtype - zarámování scény
        if (entry.subtype === 'frame_scene') {
          const d = entry.details;
          // Pokud máme details, zobrazíme strukturovaně
          if (d) {
            return (
              <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors"
                   onClick={() => setDetailModal({ type: 'frame_scene', data: d, note: entry.note })}
                   title="Klikni pro detail">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎬</span>
                  <span className={`text-sm font-bold ${d.isAltered ? 'text-orange-600' : 'text-green-700'}`}>
                    [{d.alteredDie}] {d.isAltered ? 'Pozměněná scéna!' : 'Scéna dle očekávání'}
                  </span>
                </div>
                <p className="text-stone-800 text-sm"><span className="text-stone-500">📖</span> {d.opening}</p>
                <p className="text-stone-700 text-sm"><span className="text-stone-500">📍</span> {d.setting}</p>
                <p className="text-purple-700 text-sm font-medium"><span className="text-stone-500">💡</span> {d.action} + {d.theme}</p>
                {d.isAltered && d.complication && (
                  <p className="text-orange-700 text-sm font-medium"><span className="text-stone-500">⚡</span> {d.complication}</p>
                )}
                {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
              </div>
            );
          }
          // Fallback pro starší záznamy bez details - jen editace
          return (
            <div className="my-2 pl-4 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-50 rounded transition-colors"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu (starý formát)">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🎬</span>
                <span className="text-sm font-bold text-amber-700">
                  {entry.dice && `[${entry.dice[0]}] `}{entry.result}
                </span>
              </div>
              {entry.narrative && (
                <div className="text-stone-700 text-sm whitespace-pre-line">{entry.narrative}</div>
              )}
              {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
            </div>
          );
        }
        // Handle custom_dice subtype differently
        if (entry.subtype === 'custom_dice') {
          return (
            <div className="my-2 pl-4 border-l-2 border-stone-300 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden"
                 onClick={() => startEdit(entry)}
                 title="Klikni pro úpravu">
              {entry.reason && <p className="text-stone-700 font-medium truncate">{entry.reason}</p>}
              <p className="text-amber-900 truncate">
                <span className="text-stone-500 text-sm">{entry.count}d{entry.sides}: </span>
                <span className="font-bold">[{entry.dice?.join(', ')}]</span>
                {entry.count > 1 && <span className="font-bold"> = {entry.total}</span>}
              </p>
              {entry.note && <p className="text-stone-600 italic text-sm mt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
            </div>
          );
        }
        // Standard oracle (yes/no, etc.)
        return (
          <div className="my-2 pl-4 border-l-2 border-amber-400 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            {entry.question && <p className="text-stone-600 text-sm truncate">„{entry.question}"</p>}
            <p className="font-bold text-amber-900 truncate">
              {entry.dice && <span className="font-normal text-stone-500 text-xs">[{entry.dice.join(', ')}] </span>}
              {entry.result}
            </p>
            {entry.note && <p className="text-stone-700 italic text-sm mt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
            {entry.edited && <span className="text-xs text-stone-400">✎</span>}
          </div>
        );
      
      case 'combat_action':
        return (
          <p className="my-1 text-sm text-stone-700 font-medium cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            ⚔️ <strong>{entry.attacker}</strong> → <strong>{entry.target}</strong>: {entry.hitResult}, {entry.damage} dmg
            {entry.note && <span className="font-normal italic text-stone-600 ml-2">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );

      case 'combat_end':
        return (
          <p className="my-2 text-sm font-bold text-amber-800 border-t border-b border-amber-200 py-1 cursor-pointer hover:bg-amber-50 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🏁 Boj skončil
            {entry.note && <span className="font-normal italic ml-2">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );
      
      case 'discovery':
        return (
          <div className="my-2 bg-amber-100/50 rounded px-3 py-2 cursor-pointer hover:bg-amber-100 transition-colors overflow-hidden"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="font-bold text-amber-900 truncate">{entry.subtype}: {entry.data?.name}</p>
            {entry.data?.trait && <p className="text-stone-600 text-sm italic truncate">{entry.data.trait}</p>}
            {entry.data?.appearance && <p className="text-stone-600 text-sm truncate">{entry.data.appearance}</p>}
            {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
          </div>
        );
      
      case 'faction_progress':
        return (
          <p className="my-1 text-xs text-stone-500 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            <span className="font-medium text-stone-700">{entry.faction}</span>: {entry.success ? '✓ pokrok' : '– beze změny'} 
            <span className="opacity-60"> (d6={entry.roll}+{entry.bonus})</span>
            {entry.note && <span className="italic text-stone-600 ml-2">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
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
            {entry.note && <span className="normal-case font-normal text-stone-600 ml-2">• {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );

      case 'season_weather':
        // Období + počasí (začátek hry)
        return (
          <div
            className="my-2 p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg cursor-pointer hover:from-amber-100 hover:to-amber-200 transition-colors border border-amber-200"
            onClick={() => setWeatherModal(entry.data)}
            title="Klikni pro detail"
          >
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <span className="text-xl">{entry.data?.seasonIcon}</span>
              <span>{entry.data?.seasonName}</span>
              <span className="text-stone-400">•</span>
              <span className="text-xl">{entry.data?.weather?.icon}</span>
              <span>{entry.data?.weather?.type}</span>
              {entry.data?.weather?.danger && <span className="text-red-600">⚠️</span>}
            </div>
          </div>
        );

      case 'weather':
        // Jen počasí (při novém dni)
        return (
          <div
            className="my-1 p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
            onClick={() => setWeatherModal({ weather: entry.data })}
            title="Klikni pro detail"
          >
            <div className="flex items-center gap-2 text-blue-900">
              <span className="text-xl">{entry.data?.icon || '☁️'}</span>
              <span className="font-medium">{entry.data?.type || entry.weather || 'neznámé'}</span>
              {entry.data?.danger && <span className="text-red-600">⚠️</span>}
            </div>
          </div>
        );

      case 'world_event':
        // Handle world_event with subtypes
        if (entry.subtype === 'weather' || entry.data?.type === 'weather') {
          return (
            <p className="my-1 text-sm text-stone-600 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
              <span className="text-blue-600">{entry.data?.icon || '☁️'}</span> Počasí: <em>{entry.data?.type || entry.data?.weather || entry.weather || 'neznámé'}</em>
              {entry.note && <span className="italic ml-2">— {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
            </p>
          );
        }
        // Generic world event
        return (
          <p className="my-1 text-sm text-stone-600 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🌍 {entry.data?.name || entry.content || JSON.stringify(entry.data)}
            {entry.note && <span className="italic ml-2">— {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );

      case 'rest':
        return (
          <p className="my-1 text-sm text-green-700 cursor-pointer hover:bg-green-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            {entry.subtype === 'short' ? '☕ Krátký odpočinek' : '🏕️ Dlouhý odpočinek v bezpečí'}
            {entry.note && <span className="italic text-stone-600 ml-2">— {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );

      case 'usage_roll':
        return (
          <p className="my-1 text-xs text-stone-500 cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            📦 {entry.item}: {entry.consumed ? <span className="text-orange-600">spotřebováno!</span> : <span className="text-green-600">OK</span>}
            {entry.note && <span className="italic text-stone-600 ml-2">— {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );

      case 'random_encounter':
        return (
          <div className="my-2 cursor-pointer hover:bg-red-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="text-red-700 font-bold">⚠️ Náhodné setkání!</p>
            {entry.note && <p className="italic text-stone-700 text-sm whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
          </div>
        );

      case 'dungeon_turn':
        return (
          <p className="my-1 text-xs text-stone-500 uppercase tracking-wider cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            ⛏️ Tah {entry.turn} — pochodeň: {6 - entry.torchTurns}/6
            {entry.note && <span className="normal-case ml-2">• {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );

      case 'wandering_monster_check':
        if (!entry.encounter) return null; // Don't show "nothing happens"
        return (
          <div className="my-2 cursor-pointer hover:bg-red-50 rounded px-1 -mx-1 transition-colors"
               onClick={() => startEdit(entry)}
               title="Klikni pro úpravu">
            <p className="text-red-700 font-bold">👹 Něco se blíží!</p>
            {entry.note && <p className="italic text-stone-700 text-sm whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
          </div>
        );

      case 'torch_lit':
        return (
          <p className="my-1 text-xs text-orange-600 cursor-pointer hover:bg-orange-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🔥 Nová pochodeň
            {entry.note && <span className="text-stone-600 ml-2">— {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
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
            {entry.note && <span className="italic text-stone-600 ml-2">— {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
          </p>
        );

      case 'character_created':
        return (
          <p className="my-2 text-amber-800 font-medium cursor-pointer hover:bg-amber-50 rounded px-1 -mx-1 transition-colors"
             onClick={() => startEdit(entry)}
             title="Klikni pro úpravu">
            🐭 Na scénu vstupuje <strong>{entry.character}</strong>
            {entry.note && <span className="font-normal italic text-stone-600 ml-2">— {parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</span>}
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
              {entry.note && <span className="italic ml-1">({parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)})</span>}
            </span>
          );
        }
        return null; // Hide other state changes

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
            {entry.note && <span className="italic ml-1">({parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)})</span>}
          </p>
        );

      case 'saved_npc':
        // Získej aktuální stav NPC z worldNPCs (pro isDead atd.)
        const currentNPC = worldNPCs.find(n => n.id === entry.data?.id) || entry.data;
        const npcIsDead = currentNPC?.isDead;
        return (
          <div
            className={`my-2 pl-4 border-l-2 cursor-pointer hover:bg-amber-50 rounded transition-colors overflow-hidden ${
              npcIsDead ? 'border-stone-400 bg-stone-100/50' : 'border-amber-500'
            }`}
            onClick={() => setDetailModal({ type: 'npc', data: currentNPC })}
            title="Klikni pro detail"
          >
            <p className={`font-bold truncate ${npcIsDead ? 'text-stone-500 line-through' : 'text-amber-900'}`}>
              {npcIsDead ? '💀' : '🐭'} {entry.data?.name} {entry.data?.role && <span className="font-normal text-stone-500">— {entry.data.role}</span>}
              {npcIsDead && <span className="ml-2 text-xs text-red-600 font-normal no-underline">† mrtvý</span>}
            </p>
            {!npcIsDead && entry.data?.birthsign && <p className="text-stone-600 text-sm truncate">{entry.data.birthsign}</p>}
            {!npcIsDead && entry.data?.physicalDetail && <p className="text-stone-500 text-sm truncate">{entry.data.physicalDetail}</p>}
            {entry.note && <p className="text-stone-700 italic text-sm mt-1 border-t border-amber-200 pt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
          </div>
        );

      case 'saved_settlement':
        return (
          <p
            className="my-1 text-sm cursor-pointer hover:bg-green-50 rounded px-1 -mx-1 transition-colors truncate"
            onClick={() => setDetailModal({ type: 'settlement', data: entry.data })}
            title="Klikni pro detail"
          >
            🏘️ <span className="font-medium text-green-900">{entry.data?.name}</span>
            <span className="text-stone-500 ml-1">— {entry.data?.size}</span>
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
            {entry.note && <p className="text-sm text-stone-700 italic mt-1 whitespace-pre-wrap">{parseMentions(entry.note, onMentionClick, worldNPCs, settlements, lexicon)}</p>}
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

      {/* Widget nadcházejících událostí */}
      {timedEvents && timedEvents.filter(e => !e.completed).length > 0 && (() => {
        const currentDay = gameTime?.day || 1;
        const activeEvents = timedEvents.filter(e => !e.completed).sort((a, b) => a.targetDay - b.targetDay).slice(0, 3);
        return (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">📅 Nadcházející události</span>
              <button onClick={onOpenEvents} className="text-xs text-orange-600 hover:text-orange-800">Zobrazit vše →</button>
            </div>
            <div className="space-y-1">
              {activeEvents.map(event => {
                const daysLeft = event.targetDay - currentDay;
                return (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${daysLeft <= 0 ? 'bg-red-200 text-red-800' : daysLeft <= 1 ? 'bg-orange-200 text-orange-800' : 'bg-stone-200 text-stone-600'}`}>
                      {daysLeft <= 0 ? 'DNES!' : daysLeft === 1 ? 'Zítra' : `${daysLeft}d`}
                    </span>
                    <span className="text-stone-700 truncate">{event.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

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
                {(parties || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
          <div className="px-6 py-8 font-serif">
            {journal.length === 0 ? (
              <div className="relative">
                <textarea
                  data-testid="journal-input"
                  ref={newEntryRef}
                  value={newEntry}
                  onChange={(e) => {
                    setNewEntry(e.target.value);
                    handleMentionInput(e.target.value, 'newEntry', e.target);
                  }}
                  onKeyDown={(e) => {
                    if (showMentions && mentionTarget === 'newEntry') {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setMentionIndex(i => Math.min(i + 1, filteredMentions.length - 1));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setMentionIndex(i => Math.max(i - 1, 0));
                      } else if (e.key === 'Enter' && filteredMentions[mentionIndex]) {
                        e.preventDefault();
                        insertMention(filteredMentions[mentionIndex], newEntry, setNewEntry, newEntryRef.current);
                      } else if (e.key === 'Escape') {
                        setShowMentions(false);
                      }
                    } else if (e.key === 'Enter' && !e.shiftKey && newEntry.trim()) {
                      e.preventDefault();
                      addNarrativeEntryWithScene();
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowMentions(false), 150)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm text-stone-700 bg-white/50 border border-stone-200 rounded-lg resize-none focus:outline-none focus:border-amber-500 placeholder:text-stone-400 italic"
                  placeholder="Začni psát příběh... (@ pro zmínku, Shift+Enter = nový řádek)"
                />
                {showMentions && mentionTarget === 'newEntry' && filteredMentions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredMentions.map((m, i) => (
                      <button
                        key={`${m.type}-${m.id}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          insertMention(m, newEntry, setNewEntry, newEntryRef.current);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-amber-50 ${i === mentionIndex ? 'bg-amber-100' : ''}`}
                      >
                        <span>{m.icon}</span>
                        <span className="font-medium">{m.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-400 italic">
                Žádné záznamy neodpovídají filtru
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-8 font-serif">
            {/* Flat list s date headers */}
            {filteredJournal.map((entry, i) => {
              const content = formatEntry(entry);
              if (!content) return null;

              const isSelected = selectedIds.has(entry.id);
              const isDragging = draggedId === entry.id;
              const isDropTarget = dropTargetId === entry.id;

              // Zjisti datum pro header
              const entryDate = extractDate(entry.timestamp);
              const prevEntry = filteredJournal[i - 1];
              const prevDate = prevEntry ? extractDate(prevEntry.timestamp) : '';
              const showDateHeader = i === 0 || entryDate !== prevDate;

              return (
                <React.Fragment key={entry.id}>
                  {/* Date separator - nenápadný, jen tečky s datem při hoveru */}
                  {showDateHeader && i > 0 && (
                    <div className="group flex items-center justify-center my-3 gap-2" title={entryDate}>
                      <div className="flex-1 h-px bg-stone-200/30"></div>
                      <span className="text-[10px] text-stone-300/40 group-hover:text-stone-400 transition-colors cursor-default">
                        {entryDate}
                      </span>
                      <div className="flex-1 h-px bg-stone-200/30"></div>
                    </div>
                  )}

                  {/* Drop zone PŘED záznamem */}
                  {draggedId && draggedId !== entry.id && (
                    <div
                      className={`h-1 rounded my-1 transition-all ${
                        dropTargetId === `before-${entry.id}` ? 'bg-amber-500 h-2' : 'bg-transparent hover:bg-amber-300'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDropTargetId(`before-${entry.id}`);
                      }}
                      onDragLeave={() => setDropTargetId(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const draggedIndex = journal.findIndex(j => j.id === draggedId);
                        const targetIndex = journal.findIndex(j => j.id === entry.id);
                        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
                          const newJournal = [...journal];
                          const [draggedEntry] = newJournal.splice(draggedIndex, 1);
                          // Vložit PŘED cílový záznam
                          const insertAt = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
                          newJournal.splice(insertAt, 0, draggedEntry);
                          setJournal(newJournal);
                        }
                        setDraggedId(null);
                        setDropTargetId(null);
                      }}
                    />
                  )}

                  {/* Záznam s drag handle */}
                  <div
                    data-entry-id={entry.id}
                    className={`group flex items-start gap-1 transition-all ${
                      isSelected ? 'bg-amber-100 rounded -mx-2 px-2' : ''
                    } ${isDragging || touchDragId === entry.id ? 'opacity-50 bg-amber-50' : ''} ${
                      isDropTarget ? 'border-b-2 border-amber-500' : ''
                    }`}
                    draggable={!selectionMode && editingId !== entry.id}
                    onDragStart={(e) => handleDragStart(e, entry.id)}
                    onDragOver={(e) => handleDragOver(e, entry.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, entry.id)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={() => !selectionMode && !touchDragId && handleTouchStart(entry.id)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchEnd}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectionMode(true);
                      setSelectedIds(new Set([entry.id]));
                    }}
                  >
                    {/* Drag handle */}
                    {!selectionMode && editingId !== entry.id && (
                      <div
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-600 pt-2 px-1 select-none transition-opacity touch-none"
                        title="Přetáhni pro přesun"
                        onTouchStart={(e) => handleTouchDragStart(e, entry.id)}
                        onTouchMove={handleTouchDragMove}
                        onTouchEnd={handleTouchDragEnd}
                      >
                        ⋮⋮
                      </div>
                    )}

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
                    <div className="flex-1 min-w-0">
                      {content}
                    </div>

                    {/* Tlačítko pro vložení poznámky ZA tento záznam */}
                    {!selectionMode && editingId !== entry.id && (
                      <button
                        onClick={() => setInsertAfterIndex(insertAfterIndex === entry.id ? null : entry.id)}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-stone-400 hover:text-amber-600 pt-2 px-1 transition-opacity"
                        title="Vložit poznámku pod"
                      >
                        +
                      </button>
                    )}
                  </div>

                  {/* Inline vstup pro poznámku s @mentions */}
                  {insertAfterIndex === entry.id && (
                    <div className="relative ml-5">
                      <div className="flex items-start gap-1">
                        <textarea
                          value={insertText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInsertText(val);
                            handleMentionInput(val, 'insert', e.target);
                          }}
                          onKeyDown={(e) => {
                            if (showMentions && mentionTarget === 'insert') {
                              if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setMentionIndex(i => Math.min(i + 1, filteredMentions.length - 1));
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setMentionIndex(i => Math.max(i - 1, 0));
                              } else if (e.key === 'Enter' && filteredMentions[mentionIndex]) {
                                e.preventDefault();
                                insertMention(filteredMentions[mentionIndex], insertText, setInsertText, e.target);
                              } else if (e.key === 'Escape') {
                                setShowMentions(false);
                              }
                            } else if (e.key === 'Enter' && !e.shiftKey && insertText.trim()) {
                              e.preventDefault();
                              insertNoteAfter(entry.id);
                            } else if (e.key === 'Escape') {
                              setInsertAfterIndex(null);
                              setInsertText('');
                            }
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              if (mentionTarget === 'insert') setShowMentions(false);
                              if (!insertText.trim()) {
                                setInsertAfterIndex(null);
                              }
                            }, 150);
                          }}
                          rows={2}
                          className="flex-1 px-3 py-2 text-sm font-serif text-stone-700 bg-white border border-stone-300 rounded-lg resize-none focus:outline-none focus:border-amber-500 placeholder:text-stone-400"
                          placeholder="Poznámka... (@ pro zmínku, Enter ↵)"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => { setInsertAfterIndex(null); setInsertText(''); }}
                          className="text-stone-400 hover:text-stone-600 p-2 text-lg"
                          title="Zrušit"
                        >
                          ×
                        </button>
                      </div>
                      {/* Mention dropdown pro insert */}
                      {showMentions && mentionTarget === 'insert' && filteredMentions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredMentions.map((m, i) => (
                            <button
                              key={`insert-${m.type}-${m.id}`}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                insertMention(m, insertText, setInsertText, document.activeElement);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-amber-50 ${i === mentionIndex ? 'bg-amber-100' : ''}`}
                            >
                              <span>{m.icon}</span>
                              <span className="font-medium">{m.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Vstup pro nový záznam dole s @ mentions */}
            <div className="relative mt-4 sticky bottom-0 bg-gradient-to-t from-amber-50 via-amber-50 to-transparent pt-4">
              <textarea
                ref={newEntryRef}
                value={newEntry}
                onChange={(e) => {
                  setNewEntry(e.target.value);
                  handleMentionInput(e.target.value, 'newEntry', e.target);
                }}
                onKeyDown={(e) => {
                  if (showMentions && mentionTarget === 'newEntry') {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setMentionIndex(i => Math.min(i + 1, filteredMentions.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setMentionIndex(i => Math.max(i - 1, 0));
                    } else if (e.key === 'Enter' && filteredMentions[mentionIndex]) {
                      e.preventDefault();
                      insertMention(filteredMentions[mentionIndex], newEntry, setNewEntry, newEntryRef.current);
                    } else if (e.key === 'Escape') {
                      setShowMentions(false);
                    }
                  } else if (e.key === 'Enter' && !e.shiftKey && newEntry.trim()) {
                    e.preventDefault();
                    addNarrativeEntryWithScene();
                  }
                }}
                onBlur={() => setTimeout(() => setShowMentions(false), 150)}
                rows={3}
                className="w-full px-3 py-2 text-sm text-stone-700 bg-white/50 border border-stone-200 rounded-lg resize-none focus:outline-none focus:border-amber-500 placeholder:text-stone-400 italic"
                placeholder="Pokračuj v příběhu... (@ pro zmínku, Shift+Enter = nový řádek)"
              />
              {/* Mention suggestions - zobrazí se NAD textareou */}
              {showMentions && mentionTarget === 'newEntry' && filteredMentions.length > 0 && (
                <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-stone-200 rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredMentions.map((m, i) => (
                    <button
                      key={`${m.type}-${m.id}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertMention(m, newEntry, setNewEntry, newEntryRef.current);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-amber-50 ${i === mentionIndex ? 'bg-amber-100' : ''}`}
                    >
                      <span>{m.icon}</span>
                      <span className="font-medium">{m.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reading tip */}
      {!selectionMode && (
        <p className="text-center text-xs text-stone-400 mt-6 font-sans">
          💡 Klikni pro úpravu • Přetáhni ⋮⋮ pro přesun • + vloží poznámku • Dlouze podrž pro výběr více
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

      {/* Detail modal pro NPC/osady */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }}>
          <div className="bg-amber-50 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {detailModal.type === 'npc' && detailModal.data && (
              <div className={`p-4 space-y-3 ${detailModal.data.isDead ? 'bg-stone-200' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-2xl font-bold ${detailModal.data.isDead ? 'text-stone-500 line-through' : 'text-amber-900'}`}>
                      {detailModal.data.isDead ? '💀' : '🐭'} {detailModal.data.name}
                    </h3>
                    {detailModal.data.isDead && (
                      <span className="text-sm text-red-600 font-medium">† Mrtvý</span>
                    )}
                  </div>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
                </div>
                {detailModal.data.role && (
                  <p className={`font-medium ${detailModal.data.isDead ? 'text-stone-400' : 'text-stone-600'}`}>🔧 {detailModal.data.role}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm font-mono bg-stone-100 rounded px-3 py-2 justify-center">
                  <span>BO: <b>{detailModal.data.hp?.max || detailModal.data.hp}</b></span>
                  <span>SÍL: <b>{detailModal.data.str?.max || detailModal.data.str}</b></span>
                  <span>MRŠ: <b>{detailModal.data.dex?.max || detailModal.data.dex}</b></span>
                  <span>VŮL: <b>{detailModal.data.wil?.max || detailModal.data.wil}</b></span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-100/50 rounded">
                    <span className="text-sm text-stone-500">Znamení</span>
                    <p className="font-bold truncate">{detailModal.data.birthsign}</p>
                  </div>
                  <div className="p-3 bg-amber-100/50 rounded">
                    <span className="text-sm text-stone-500">Vzhled</span>
                    <p className="font-bold truncate">{detailModal.data.physicalDetail}</p>
                  </div>
                </div>
                {detailModal.data.quirk && (
                  <div className="p-3 bg-purple-100 rounded">
                    <span className="text-sm text-purple-700">Zvláštnost</span>
                    <p className="font-bold text-purple-900">{detailModal.data.quirk}</p>
                  </div>
                )}
                {detailModal.data.goal && (
                  <div className="p-3 bg-blue-100 rounded">
                    <span className="text-sm text-blue-700">Cíl</span>
                    <p className="font-bold text-blue-900">{detailModal.data.goal}</p>
                  </div>
                )}
                {detailModal.data.notes && (
                  <div className="p-3 bg-stone-100 rounded">
                    <span className="text-sm text-stone-500">Poznámky</span>
                    <p className="text-stone-700">{detailModal.data.notes}</p>
                  </div>
                )}

                {/* Generátory chování */}
                <div className="border-t border-amber-200 pt-3">
                  <p className="text-xs text-stone-500 mb-2">🎲 Generátory (nezapisuje se)</p>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => setGeneratedBehavior(`🎭 ${randomFrom(NPC_BEHAVIOR_MOODS)}, ${randomFrom(NPC_BEHAVIOR_ACTIONS)}`)} className="px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 rounded">Chování</button>
                    <button onClick={() => setGeneratedBehavior(`😊 ${randomFrom(NPC_BEHAVIOR_MOODS)}`)} className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded">Nálada</button>
                    <button onClick={() => setGeneratedBehavior(`🏃 ${randomFrom(NPC_BEHAVIOR_ACTIONS)}`)} className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded">Akce</button>
                    <button onClick={() => setGeneratedBehavior(`💭 ${randomFrom(NPC_BEHAVIOR_MOTIVATIONS)}`)} className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded">Motivace</button>
                    <button onClick={() => setGeneratedBehavior(`🤫 ${randomFrom(NPC_SECRETS)}`)} className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded">Tajemství</button>
                    <button onClick={() => setGeneratedBehavior(`⚡ ${randomFrom(NPC_REACTIONS)}`)} className="px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 rounded">Reakce</button>
                  </div>
                  {generatedBehavior && (
                    <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                      <p className="font-medium text-purple-900">{generatedBehavior}</p>
                    </div>
                  )}
                </div>

                {/* Historie událostí NPC z deníku */}
                {(() => {
                  const npcEvents = journal.filter(e => e.npcId === detailModal.data.id && e.subtype === 'npc_event');
                  if (npcEvents.length === 0) return null;
                  return (
                    <div className="border-t border-amber-200 pt-3">
                      <p className="text-xs text-stone-500 mb-2">📜 Historie událostí ({npcEvents.length})</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {npcEvents.slice(-5).reverse().map((event, i) => (
                          <div key={i} className="p-2 bg-orange-50 rounded border border-orange-200 text-sm">
                            <p className="text-orange-900">{event.content}</p>
                            <p className="text-xs text-stone-400 mt-1">{event.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onMentionClick && onMentionClick('npc', detailModal.data.id);
                      setDetailModal(null);
                      setGeneratedBehavior(null);
                    }}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium"
                  >
                    ✏️ Upravit
                  </button>
                  {onUpdateNPC && (
                    <button
                      onClick={() => {
                        const newDeadState = !detailModal.data.isDead;
                        onUpdateNPC(detailModal.data.id, { isDead: newDeadState });
                        setDetailModal({ ...detailModal, data: { ...detailModal.data, isDead: newDeadState } });
                      }}
                      className={`px-4 py-2 rounded font-medium ${
                        detailModal.data.isDead
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-stone-500 hover:bg-stone-600 text-white'
                      }`}
                      title={detailModal.data.isDead ? 'Oživit NPC' : 'Označit jako mrtvého'}
                    >
                      {detailModal.data.isDead ? '💚' : '💀'}
                    </button>
                  )}
                  {onDeleteNPC && (
                    <button
                      onClick={() => {
                        if (confirm(`Opravdu smazat ${detailModal.data.name}? Toto smaže NPC i všechny záznamy v deníku.`)) {
                          onDeleteNPC(detailModal.data.id);
                          setDetailModal(null);
                          setGeneratedBehavior(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            )}

            {detailModal.type === 'settlement' && detailModal.data && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-green-900">🏘️ {detailModal.data.name}</h3>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-100 rounded">
                    <span className="text-sm text-green-700">Velikost</span>
                    <p className="font-bold text-green-900">{detailModal.data.size}</p>
                    {detailModal.data.population && <p className="text-sm text-green-700">{detailModal.data.population}</p>}
                  </div>
                  <div className="p-3 bg-amber-100/50 rounded">
                    <span className="text-sm text-stone-500">Zřízení</span>
                    <p className="font-bold text-sm">{detailModal.data.governance}</p>
                  </div>
                </div>
                {detailModal.data.trades?.length > 0 && (
                  <div className="p-3 bg-blue-100 rounded">
                    <span className="text-sm text-blue-700">Živnost</span>
                    {detailModal.data.trades.map((trade, i) => (
                      <p key={i} className="font-bold text-blue-900">{trade}</p>
                    ))}
                  </div>
                )}
                {detailModal.data.event && (
                  <div className="p-3 bg-orange-100 rounded">
                    <span className="text-sm text-orange-700">Co se děje při příchodu</span>
                    <p className="font-bold text-orange-900">{detailModal.data.event}</p>
                  </div>
                )}
                {detailModal.data.inn && (
                  <div className="p-3 bg-purple-100 rounded">
                    <span className="text-sm text-purple-700">Hostinec</span>
                    <p className="font-bold text-purple-900">{detailModal.data.inn.name || detailModal.data.inn}</p>
                    {detailModal.data.inn.specialty && <p className="text-sm text-purple-700">Specialita: {detailModal.data.inn.specialty}</p>}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {detailModal.data.landmark && (
                    <div className="p-3 bg-green-100 rounded">
                      <span className="text-sm text-green-700">Landmark</span>
                      <p className="font-bold text-green-900 text-sm">{detailModal.data.landmark}</p>
                    </div>
                  )}
                  {detailModal.data.feature && (
                    <div className="p-3 bg-stone-100 rounded">
                      <span className="text-sm text-stone-500">Zajímavost</span>
                      <p className="font-bold text-stone-700 text-sm">{detailModal.data.feature}</p>
                    </div>
                  )}
                </div>
                {detailModal.data.notes && (
                  <div className="p-3 bg-stone-100 rounded">
                    <span className="text-sm text-stone-500">Poznámky</span>
                    <p className="text-stone-700">{detailModal.data.notes}</p>
                  </div>
                )}

                {/* Generátory pro osadu */}
                <div className="border-t border-green-200 pt-3">
                  <p className="text-xs text-stone-500 mb-2">🎲 Generátory (nezapisuje se)</p>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => setGeneratedBehavior(`⚡ ${randomFrom(SETTLEMENT_HAPPENINGS)}`)} className="px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 rounded">Událost</button>
                    <button onClick={() => setGeneratedBehavior(`💬 ${randomFrom(SETTLEMENT_RUMORS)}`)} className="px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 rounded">Zvěst</button>
                    <button onClick={() => setGeneratedBehavior(`🌤️ ${randomFrom(NATURE_EVENTS)}`)} className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded">Počasí</button>
                    <button onClick={() => setGeneratedBehavior(`⚠️ ${randomFrom(WILDERNESS_THREATS)}`)} className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded">Hrozba</button>
                    <button onClick={() => setGeneratedBehavior(`🔍 ${randomFrom(DISCOVERIES)}`)} className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded">Objev</button>
                  </div>
                  {generatedBehavior && (
                    <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                      <p className="font-medium text-green-900">{generatedBehavior}</p>
                    </div>
                  )}
                </div>

                {/* Historie událostí a zvěstí osady z deníku */}
                {(() => {
                  const settlementLogs = journal.filter(e =>
                    e.settlementId === detailModal.data.id &&
                    (e.subtype === 'settlement_event' || e.subtype === 'settlement_rumor')
                  );
                  if (settlementLogs.length === 0) return null;
                  return (
                    <div className="border-t border-green-200 pt-3">
                      <p className="text-xs text-stone-500 mb-2">📜 Historie ({settlementLogs.length})</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {settlementLogs.slice(-5).reverse().map((event, i) => (
                          <div key={i} className={`p-2 rounded border text-sm ${event.subtype === 'settlement_rumor' ? 'bg-purple-50 border-purple-200' : 'bg-orange-50 border-orange-200'}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs">{event.subtype === 'settlement_rumor' ? '💬 Zvěst' : '⚡ Událost'}</span>
                            </div>
                            <p className={event.subtype === 'settlement_rumor' ? 'text-purple-900' : 'text-orange-900'}>{event.content}</p>
                            <p className="text-xs text-stone-400 mt-1">{event.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onMentionClick && onMentionClick('settlement', detailModal.data.id);
                      setDetailModal(null);
                      setGeneratedBehavior(null);
                    }}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                  >
                    ✏️ Upravit
                  </button>
                  {onDeleteSettlement && (
                    <button
                      onClick={() => {
                        if (confirm(`Opravdu smazat ${detailModal.data.name}? Toto smaže osadu i všechny záznamy v deníku.`)) {
                          onDeleteSettlement(detailModal.data.id);
                          setDetailModal(null);
                          setGeneratedBehavior(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Modal pro detail tvora */}
            {detailModal.type === 'creature' && detailModal.data && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{detailModal.data.type?.icon || '🐭'}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-900">{detailModal.data.name}</h3>
                      <p className="text-sm text-stone-600">{detailModal.data.type?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
                </div>

                {/* Aktivita a nálada */}
                <div className="p-3 bg-amber-100/50 rounded">
                  <p className="text-stone-700">
                    {detailModal.data.name} {detailModal.data.doing}.
                    <span className="text-stone-600 ml-1">Je {detailModal.data.personality}.</span>
                  </p>
                  {detailModal.data.mood && (
                    <p className="text-stone-500 italic mt-1">{detailModal.data.mood.charAt(0).toUpperCase() + detailModal.data.mood.slice(1)}.</p>
                  )}
                </div>

                {/* Vzhled */}
                <div className="p-3 bg-white/50 rounded border-l-4 border-amber-400">
                  <span className="text-xs text-amber-700 font-medium block mb-1">👁️ VZHLED</span>
                  <p className="text-stone-700">{detailModal.data.appearance?.charAt(0).toUpperCase() + detailModal.data.appearance?.slice(1)}.</p>
                </div>

                {/* Cíl */}
                <div className="p-3 bg-white/50 rounded border-l-4 border-blue-400">
                  <span className="text-xs text-blue-600 font-medium block mb-1">🎯 CÍL</span>
                  <p className="text-stone-700">{detailModal.data.goal?.charAt(0).toUpperCase() + detailModal.data.goal?.slice(1)}.</p>
                </div>

                {/* Zvláštnost */}
                {detailModal.data.quirk && (
                  <div className="p-3 bg-white/50 rounded border-l-4 border-purple-400">
                    <span className="text-xs text-purple-600 font-medium block mb-1">✨ ZVLÁŠTNOST</span>
                    <p className="text-stone-700">{detailModal.data.quirk.charAt(0).toUpperCase() + detailModal.data.quirk.slice(1)}.</p>
                  </div>
                )}

                {/* Tajemství - pouze pro GM */}
                {detailModal.data.secret && (
                  <div className="p-3 bg-stone-800 rounded border-l-4 border-stone-600">
                    <span className="text-xs text-stone-400 font-medium block mb-1">🔒 TAJEMSTVÍ (pouze GM)</span>
                    <p className="text-stone-300 italic">{detailModal.data.secret.charAt(0).toUpperCase() + detailModal.data.secret.slice(1)}.</p>
                  </div>
                )}

                {/* Kategorie */}
                <div className="pt-3 border-t border-stone-200">
                  <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-500">
                    {detailModal.data.type?.category === 'mouse' ? '🐭 Myš' :
                     detailModal.data.type?.category === 'rat' ? '🐀 Krysa' :
                     detailModal.data.type?.category === 'insect' ? '🐛 Hmyz' :
                     detailModal.data.type?.category === 'spirit' ? '👻 Duch' :
                     detailModal.data.type?.category === 'fae' ? '🧚 Víla' :
                     detailModal.data.type?.category === 'construct' ? '⚙️ Konstrukt' :
                     detailModal.data.type?.category === 'predator' ? '🦉 Predátor' : '🐸 Tvor'}
                  </span>
                </div>

                {/* Poznámka ze záznamu */}
                {detailModal.note && (
                  <div className="p-3 bg-stone-100 rounded">
                    <span className="text-sm text-stone-500">Poznámka</span>
                    <p className="text-stone-700 italic">{detailModal.note}</p>
                  </div>
                )}

                {/* Tlačítko pro povýšení na NPC */}
                {onPromoteToNPC && (
                  <div className="pt-3 border-t border-amber-200">
                    <button
                      onClick={() => {
                        const newNPC = onPromoteToNPC(detailModal.data);
                        if (newNPC) {
                          setDetailModal({ type: 'npc', data: newNPC });
                        }
                      }}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                    >
                      ⭐ Povýšit na NPC
                    </button>
                    <p className="text-xs text-stone-500 text-center mt-1">Vytvoří plnohodnotné NPC se statistikami</p>
                  </div>
                )}
              </div>
            )}

            {/* Modal pro detail scény (frame_scene) */}
            {detailModal.type === 'frame_scene' && detailModal.data && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🎬</span>
                    <div>
                      <h3 className={`text-xl font-bold ${detailModal.data.isAltered ? 'text-orange-700' : 'text-green-700'}`}>
                        [{detailModal.data.alteredDie}] {detailModal.data.isAltered ? 'Pozměněná scéna!' : 'Scéna dle očekávání'}
                      </h3>
                    </div>
                  </div>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
                </div>

                {/* Úvodní situace */}
                <div className="p-3 bg-amber-100/50 rounded border-l-4 border-amber-400">
                  <span className="text-xs text-amber-700 font-medium block mb-1">📖 ÚVOD</span>
                  <p className="text-stone-700">{detailModal.data.opening}</p>
                </div>

                {/* Místo */}
                <div className="p-3 bg-green-100/50 rounded border-l-4 border-green-400">
                  <span className="text-xs text-green-700 font-medium block mb-1">📍 MÍSTO</span>
                  <p className="text-stone-700">{detailModal.data.setting}</p>
                </div>

                {/* Akce + Téma */}
                <div className="p-3 bg-purple-100/50 rounded border-l-4 border-purple-400">
                  <span className="text-xs text-purple-700 font-medium block mb-1">💡 AKCE + TÉMA</span>
                  <p className="text-stone-700 font-medium">{detailModal.data.action} + {detailModal.data.theme}</p>
                </div>

                {/* Komplikace (pokud je pozměněná) */}
                {detailModal.data.isAltered && detailModal.data.complication && (
                  <div className="p-3 bg-orange-100 rounded border-l-4 border-orange-500">
                    <span className="text-xs text-orange-700 font-medium block mb-1">⚡ KOMPLIKACE</span>
                    <p className="text-orange-900 font-medium">{detailModal.data.complication}</p>
                  </div>
                )}

                {/* Poznámka */}
                {detailModal.note && (
                  <div className="p-3 bg-stone-100 rounded">
                    <span className="text-sm text-stone-500">Poznámka</span>
                    <p className="text-stone-700 italic">{detailModal.note}</p>
                  </div>
                )}
              </div>
            )}

            {/* Modal pro detail setkání (encounter) */}
            {detailModal.type === 'encounter' && detailModal.data && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🎭</span>
                    <h3 className="text-xl font-bold text-amber-900">Setkání</h3>
                  </div>
                  <button onClick={() => { setDetailModal(null); setGeneratedBehavior(null); }} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
                </div>

                {/* Tvor */}
                <div className="p-3 bg-amber-100/50 rounded border-l-4 border-amber-400">
                  <span className="text-xs text-amber-700 font-medium block mb-1">🐭 TVOR</span>
                  <p className="text-stone-700 font-medium">{detailModal.data.creature}</p>
                </div>

                {/* Aktivita */}
                <div className="p-3 bg-blue-100/50 rounded border-l-4 border-blue-400">
                  <span className="text-xs text-blue-700 font-medium block mb-1">🎬 AKTIVITA</span>
                  <p className="text-stone-700">{detailModal.data.activity}</p>
                </div>

                {/* Poznámka */}
                {detailModal.note && (
                  <div className="p-3 bg-stone-100 rounded">
                    <span className="text-sm text-stone-500">Poznámka</span>
                    <p className="text-stone-700 italic">{detailModal.note}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modal pro detail počasí */}
      {weatherModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setWeatherModal(null)}>
          <div className={`rounded-xl shadow-xl max-w-sm w-full p-6 ${
            weatherModal.weather?.danger
              ? 'bg-gradient-to-b from-red-100 to-red-200'
              : 'bg-gradient-to-b from-amber-50 to-amber-100'
          }`} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setWeatherModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-xl"
            >
              ✕
            </button>

            {/* Období (pokud je) */}
            {weatherModal.seasonName && (
              <div className="text-center mb-4 pb-4 border-b border-amber-300">
                <div className="text-5xl mb-2">{weatherModal.seasonIcon}</div>
                <div className="text-2xl font-bold text-amber-900">{weatherModal.seasonName}</div>
                <div className="text-sm text-amber-700">🎲 k4 = {weatherModal.seasonRoll}</div>
              </div>
            )}

            {/* Počasí */}
            {weatherModal.weather && (
              <div className="text-center">
                <div className="text-5xl mb-2">{weatherModal.weather.icon}</div>
                <div className="text-2xl font-bold text-amber-900">{weatherModal.weather.type}</div>
                <div className="text-sm text-amber-700 mb-3">
                  🎲 2k6 = {weatherModal.weather.dice?.[0]} + {weatherModal.weather.dice?.[1]} = {weatherModal.weather.roll}
                </div>

                {weatherModal.weather.danger && weatherModal.weather.effect && (
                  <div className="bg-red-200 rounded-lg p-3 text-red-800 text-sm">
                    ⚠️ <strong>Nepříznivé podmínky:</strong><br/>
                    {weatherModal.weather.effect}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setWeatherModal(null)}
              className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
            >
              Zavřít
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// EVENTS PANEL - Časované události
// ============================================

const EventsPanel = ({ timedEvents, setTimedEvents, gameTime }) => {
  const [newEvent, setNewEvent] = useState({ title: '', daysFromNow: 1, notes: '' });
  const [showForm, setShowForm] = useState(false);

  const currentDay = gameTime?.day || 1;

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    const event = {
      id: Date.now().toString(),
      title: newEvent.title.trim(),
      targetDay: currentDay + parseInt(newEvent.daysFromNow || 1),
      notes: newEvent.notes.trim(),
      completed: false,
      createdDay: currentDay
    };
    setTimedEvents([...timedEvents, event]);
    setNewEvent({ title: '', daysFromNow: 1, notes: '' });
    setShowForm(false);
  };

  const toggleComplete = (id) => {
    setTimedEvents(timedEvents.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const deleteEvent = (id) => {
    setTimedEvents(timedEvents.filter(e => e.id !== id));
  };

  // Seřadit podle targetDay, aktivní první
  const sortedEvents = [...timedEvents].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.targetDay - b.targetDay;
  });

  const getDaysRemaining = (targetDay) => {
    const remaining = targetDay - currentDay;
    if (remaining < 0) return { text: `${Math.abs(remaining)} dní po`, urgent: true, past: true };
    if (remaining === 0) return { text: 'DNES!', urgent: true, past: false };
    if (remaining === 1) return { text: 'Zítra', urgent: true, past: false };
    return { text: `Za ${remaining} dní`, urgent: remaining <= 3, past: false };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <SectionHeader icon="⏰" title="Časované události" subtitle="Nadcházející události v kampani" />

      {/* Přidat novou událost */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full">
          + Přidat událost
        </Button>
      ) : (
        <ResultCard>
          <div className="space-y-3">
            <Input
              value={newEvent.title}
              onChange={(v) => setNewEvent({ ...newEvent, title: v })}
              placeholder="Co se stane? (např. Bandité zaútočí)"
            />
            <div className="flex gap-2 items-center">
              <span className="text-sm text-stone-600">Za</span>
              <input
                type="number"
                min="1"
                value={newEvent.daysFromNow}
                onChange={(e) => setNewEvent({ ...newEvent, daysFromNow: e.target.value })}
                className="w-16 px-2 py-1 border border-stone-300 rounded text-center"
              />
              <span className="text-sm text-stone-600">dní (den {currentDay + parseInt(newEvent.daysFromNow || 1)})</span>
            </div>
            <Input
              value={newEvent.notes}
              onChange={(v) => setNewEvent({ ...newEvent, notes: v })}
              placeholder="Poznámky (volitelné)"
            />
            <div className="flex gap-2">
              <Button onClick={addEvent} className="flex-1">✓ Přidat</Button>
              <Button onClick={() => setShowForm(false)} variant="secondary" className="flex-1">✕ Zrušit</Button>
            </div>
          </div>
        </ResultCard>
      )}

      {/* Seznam událostí */}
      {sortedEvents.length === 0 ? (
        <ResultCard>
          <p className="text-center text-stone-500 py-4">
            Žádné naplánované události.<br/>
            <span className="text-sm">Přidej první událost tlačítkem výše.</span>
          </p>
        </ResultCard>
      ) : (
        <div className="space-y-2">
          {sortedEvents.map(event => {
            const remaining = getDaysRemaining(event.targetDay);
            return (
              <ResultCard key={event.id} className={event.completed ? 'opacity-50' : ''}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(event.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      event.completed ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 hover:border-amber-500'
                    }`}
                  >
                    {event.completed && '✓'}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${event.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {event.title}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.completed ? 'bg-green-100 text-green-700' :
                        remaining.past ? 'bg-red-100 text-red-700' :
                        remaining.urgent ? 'bg-orange-100 text-orange-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {remaining.text}
                      </span>
                    </div>
                    {event.notes && <p className="text-sm text-stone-500 mt-1">{event.notes}</p>}
                    <p className="text-xs text-stone-400 mt-1">Den {event.targetDay}</p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-stone-400 hover:text-red-500 p-1"
                  >
                    🗑️
                  </button>
                </div>
              </ResultCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================
// TIME BAR - Sledování času
// ============================================

const TimeBar = ({ gameTime, updateGameTime, partyName, timedEvents }) => {
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

            {/* Widget událostí */}
            {timedEvents && timedEvents.filter(e => !e.completed).length > 0 && (() => {
              const activeEvents = timedEvents.filter(e => !e.completed);
              const urgent = activeEvents.filter(e => e.targetDay <= day + 1);
              const next = activeEvents.sort((a, b) => a.targetDay - b.targetDay)[0];
              const daysLeft = next ? next.targetDay - day : 0;
              return (
                <div className={`px-2 py-1 rounded text-xs ${urgent.length > 0 ? 'bg-orange-600' : 'bg-stone-700'}`} title={next?.title}>
                  ⏰ {activeEvents.length}{daysLeft <= 1 && daysLeft >= 0 ? '!' : ''}
                </div>
              );
            })()}

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
  const [isHidden, setIsHidden] = useState(true); // Na mobilu schované

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
    setIsHidden(true); // Schovat na mobilu
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
    <>
      {/* Záložka na pravém okraji - jen na mobilu když je schované */}
      {isHidden && !isOpen && (
        <button
          onClick={() => {
            setIsHidden(false);
            setIsOpen(true);
          }}
          className="sm:hidden fixed bottom-32 right-0 z-50 bg-amber-500/90 text-white px-1 py-2 rounded-l-md shadow-lg text-lg"
        >
          🎲
        </button>
      )}

      {/* Hlavní panel - na mobilu jen když je otevřený, na desktopu vždy */}
      <div className={`fixed bottom-24 right-4 z-50 flex flex-col-reverse items-end gap-2 transition-all duration-300 ${
        isHidden && !isOpen ? 'hidden sm:flex' : 'flex'
      }`}>
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
    </>
  );
};

// ============================================
// SMALL WORLD PANEL - Malý Svět Generátory
// ============================================

const SmallWorldPanel = ({ onLogEntry }) => {
  const [activeGenerator, setActiveGenerator] = useState('sensory');
  const [lastResult, setLastResult] = useState(null);
  const [logToJournal, setLogToJournal] = useState(true);

  const generators = [
    { id: 'sensory', label: 'Smysly', icon: '👃' },
    { id: 'megastructure', label: 'Mega-Struktura', icon: '🏗️' },
    { id: 'loot', label: 'Kořist', icon: '💎' },
    { id: 'traps', label: 'Pasti', icon: '⚠️' },
    { id: 'whatis', label: 'Co je to?', icon: '❓' }
  ];

  const logEntry = (entry) => {
    if (logToJournal && onLogEntry) {
      onLogEntry(entry);
    }
  };

  // 1. Senzorický Priming (k66)
  const rollSensory = () => {
    const { dice, result } = rollK66();
    const data = SENSORY_PRIMING_TABLE[result];
    const entry = {
      type: 'smallworld',
      subtype: 'sensory_priming',
      timestamp: formatTimestamp(),
      dice,
      diceResult: result,
      result: data
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 2. Mega-Struktura (3×d6)
  const rollMegaStructure = () => {
    const shapeRoll = rollD6();
    const materialRoll = rollD6();
    const stateRoll = rollD6();

    const shape = MEGA_STRUCTURE_SHAPE.find(s => s.roll === shapeRoll);
    const material = MEGA_STRUCTURE_MATERIAL.find(m => m.roll === materialRoll);
    const state = MEGA_STRUCTURE_STATE.find(s => s.roll === stateRoll);

    const entry = {
      type: 'smallworld',
      subtype: 'mega_structure',
      timestamp: formatTimestamp(),
      dice: [shapeRoll, materialRoll, stateRoll],
      result: { shape, material, state }
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 3. Komplikace Kořisti (d20)
  const rollLootComplication = () => {
    const results = [];
    let roll = rollD20();
    results.push(roll);

    // Dvojitá komplikace na 20
    if (roll === 20) {
      let roll1 = rollD20();
      while (roll1 === 20) roll1 = rollD20();
      let roll2 = rollD20();
      while (roll2 === 20) roll2 = rollD20();
      results.push(roll1, roll2);
    }

    const complications = results.map(r =>
      LOOT_COMPLICATIONS.find(c => c.roll === r)
    ).filter(c => c && c.roll !== 20);

    const entry = {
      type: 'smallworld',
      subtype: 'loot_complication',
      timestamp: formatTimestamp(),
      dice: results,
      result: complications,
      isDouble: results[0] === 20
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 4. Fyzikální Pasti (d12)
  const rollTrap = () => {
    const roll = rollD12();
    const trap = PHYSICAL_TRAPS.find(t => t.roll === roll);
    const entry = {
      type: 'smallworld',
      subtype: 'physical_trap',
      timestamp: formatTimestamp(),
      dice: [roll],
      result: trap
    };
    setLastResult(entry);
    logEntry(entry);
  };

  // 5. Co je to? (2×d6)
  const rollWhatIsIt = () => {
    const verbRoll = rollD6();
    const nounRoll = rollD6();
    const verb = WHAT_IS_IT_VERB.find(v => v.roll === verbRoll);
    const noun = WHAT_IS_IT_NOUN.find(n => n.roll === nounRoll);
    const entry = {
      type: 'smallworld',
      subtype: 'what_is_it',
      timestamp: formatTimestamp(),
      dice: [verbRoll, nounRoll],
      result: { verb, noun }
    };
    setLastResult(entry);
    logEntry(entry);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon="🏠"
        title="Malý Svět"
        subtitle="Generátory pro průzkum a detaily prostředí z pohledu myši"
      />

      {/* Tab navigace */}
      <div className="flex flex-wrap gap-2 border-b border-amber-200 pb-3">
        {generators.map(gen => (
          <button
            key={gen.id}
            onClick={() => setActiveGenerator(gen.id)}
            className={`px-3 py-2 rounded-t-lg font-medium transition-colors ${
              activeGenerator === gen.id
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
          >
            {gen.icon} {gen.label}
          </button>
        ))}
      </div>

      {/* Toggle pro logování */}
      <div className="flex items-center justify-end gap-2 -mt-2 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800 transition-colors">
          <input
            type="checkbox"
            checked={logToJournal}
            onChange={(e) => setLogToJournal(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span className={!logToJournal ? 'text-amber-700 font-medium' : ''}>
            📝 Zapisovat do deníku {!logToJournal && '(vypnuto)'}
          </span>
        </label>
      </div>

      {/* SENZORICKÝ PRIMING */}
      {activeGenerator === 'sensory' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">👃 Senzorický Priming (k66)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Generuje smyslové detaily prostředí - vůně, hmatové vjemy a jejich herní implikace. Použij na začátku scény.
          </p>
          <button
            onClick={rollSensory}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit k66
          </button>
          {lastResult?.subtype === 'sensory_priming' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="text-center text-sm text-stone-400 mt-1 mb-3">
                k66 = {lastResult.diceResult}
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">👃 Vůně:</span>
                  <span>{lastResult.result.smell}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">🖐️ Hmat:</span>
                  <span>{lastResult.result.tactile}</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-stone-700 rounded">
                  <span className="text-amber-400 font-bold">{lastResult.result.icon}</span>
                  <span>{lastResult.result.hint}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MEGA-STRUKTURA */}
      {activeGenerator === 'megastructure' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">🏗️ Generátor Mega-Struktur (3×k6)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Vytvoří náhodný velký lidský předmět jako "dungeon" - kombinace tvaru, materiálu a stavu.
          </p>
          <button
            onClick={rollMegaStructure}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit 3×k6
          </button>
          {lastResult?.subtype === 'mega_structure' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="text-center text-sm text-stone-400 mt-1 mb-3">
                Tvar: {lastResult.dice[0]} | Materiál: {lastResult.dice[1]} | Stav: {lastResult.dice[2]}
              </div>
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">🔷 Tvar: {lastResult.result.shape.name}</div>
                  <div className="text-sm text-stone-300">{lastResult.result.shape.desc}</div>
                  <div className="text-xs text-stone-400 mt-1">{lastResult.result.shape.examples}</div>
                </div>
                <div className="p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">🧱 Materiál: {lastResult.result.material.name}</div>
                  <div className="text-sm text-stone-300">{lastResult.result.material.desc}</div>
                  <div className="text-xs text-stone-400 mt-1">{lastResult.result.material.hint}</div>
                </div>
                <div className="p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">⚡ Stav: {lastResult.result.state.name}</div>
                  <div className="text-sm text-stone-300">{lastResult.result.state.desc}</div>
                  <div className="text-xs text-amber-300 mt-1">⚠️ {lastResult.result.state.hint}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KOMPLIKACE KOŘISTI */}
      {activeGenerator === 'loot' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">💎 Komplikace Kořisti (k20)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Když myši najdou kořist větší než mince - co komplikuje její transport? Hod 20 = dvojitá komplikace!
          </p>
          <button
            onClick={rollLootComplication}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit k20
          </button>
          {lastResult?.subtype === 'loot_complication' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              {lastResult.isDouble && (
                <div className="text-center text-amber-400 font-bold mt-2 mb-2">
                  ⚠️ DVOJITÁ KOMPLIKACE! ⚠️
                </div>
              )}
              {lastResult.result.map((comp, i) => (
                <div key={i} className="mt-4 p-3 bg-stone-700 rounded">
                  <div className="text-amber-400 font-bold mb-1">
                    {comp.property} <span className="text-stone-400 font-normal">({comp.desc})</span>
                  </div>
                  <div className="text-sm text-stone-300 mt-2">{comp.impact}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FYZIKÁLNÍ PASTI */}
      {activeGenerator === 'traps' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">⚠️ Fyzikální Pasti (k12)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Prostředí, které je smrtící svou fyzikou - ne mechanickými pastmi. Věci nebezpečné pro malé tvory.
          </p>
          <button
            onClick={rollTrap}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit k12
          </button>
          {lastResult?.subtype === 'physical_trap' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="mt-4 p-3 bg-stone-700 rounded">
                <div className="text-amber-400 font-bold text-lg mb-2">
                  {lastResult.result.object}
                </div>
                <div className="text-stone-300">{lastResult.result.effect}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CO JE TO? */}
      {activeGenerator === 'whatis' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-3 text-lg">❓ Orákulum: Co je to? (2×k6)</h4>
          <p className="text-sm text-stone-600 mb-4">
            Když se ztratíte v abstrakci - co "doopravdy" je ten neznámý lidský předmět? Kombinace funkce + formy.
          </p>
          <button
            onClick={rollWhatIsIt}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            🎲 Hodit 2×k6
          </button>
          {lastResult?.subtype === 'what_is_it' && lastResult.result && (
            <div className="mt-4 p-4 bg-stone-800 text-stone-100 rounded-lg">
              <DiceDisplay dice={lastResult.dice} />
              <div className="text-center text-sm text-stone-400 mt-1 mb-3">
                Sloveso: {lastResult.dice[0]} | Podst. jméno: {lastResult.dice[1]}
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-amber-400 mb-2">
                  "{lastResult.result.verb.verb}" + "{lastResult.result.noun.noun}"
                </div>
                <div className="text-stone-300 mb-4">
                  {lastResult.result.verb.desc} → {lastResult.result.noun.desc}
                </div>
                <div className="p-3 bg-stone-700 rounded text-left">
                  <div className="text-amber-300 font-bold mb-1">💡 Příklady:</div>
                  <div className="text-stone-300 text-sm">{lastResult.result.noun.example}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// SLOT SELECTION SCREEN
// ============================================

function SlotCard({ slot, onSelect, onDelete }) {
  const isFirebase = slot.type === 'firebase';
  const lastMod = slot.lastModified ? new Date(slot.lastModified).toLocaleString('cs-CZ') : 'Nikdy';

  return (
    <div
      data-testid="slot-card"
      className={`${isFirebase ? 'bg-purple-50 hover:bg-purple-100 border-purple-200' : 'bg-amber-50 hover:bg-amber-100 border-amber-200'} border-2 rounded-lg p-4 cursor-pointer transition-colors group shadow-sm`}
      onClick={() => onSelect(slot)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{isFirebase ? '🌐' : '💾'}</span>
            <h3 className="text-lg font-bold text-amber-900 truncate">{slot.name}</h3>
          </div>

          {isFirebase && slot.roomCode && (
            <p className="text-sm text-purple-600 mb-1">
              Kód místnosti: <span className="font-mono bg-purple-100 px-1 rounded">{slot.roomCode}</span>
            </p>
          )}

          <p className="text-xs text-amber-700">
            {slot.preview?.partyCount || 0} družin • {slot.preview?.journalCount || 0} záznamů
          </p>
          <p className="text-xs text-amber-600/70 mt-1">
            Poslední změna: {lastMod}
          </p>
        </div>

        <button
          data-testid="delete-slot-button"
          onClick={(e) => { e.stopPropagation(); onDelete(slot); }}
          className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-600 hover:bg-red-100 rounded transition-all"
          title="Smazat slot"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function SlotSelectionScreen({
  slots,
  onSelectSlot,
  onCreateNew,
  onCreateFirebaseRoom,
  onJoinFirebaseRoom,
  onDeleteSlot,
  lastActiveSlotId
}) {
  const localSlots = slots.filter(s => s.type === 'local');
  const firebaseSlots = slots.filter(s => s.type === 'firebase');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🐭</span>
          <h1 className="text-3xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Mausritter Solo Companion
          </h1>
          <p className="text-amber-700/70">Vyber hru nebo vytvoř novou</p>
        </div>

        {/* Quick Resume */}
        {lastActiveSlotId && (() => {
          const lastSlot = slots.find(s => s.id === lastActiveSlotId);
          if (!lastSlot) return null;
          return (
            <div className="mb-6">
              <button
                data-testid="continue-last-slot-button"
                onClick={() => onSelectSlot(lastSlot)}
                className="w-full p-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg"
              >
                <span className="text-2xl">▶️</span>
                <span className="text-lg font-bold text-white">Pokračovat: {lastSlot.name}</span>
              </button>
            </div>
          );
        })()}

        {/* Local Slots */}
        {localSlots.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
              <span>💾</span> Sólo hry
            </h2>
            <div className="space-y-2">
              {localSlots.map(slot => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  onSelect={onSelectSlot}
                  onDelete={onDeleteSlot}
                />
              ))}
            </div>
          </div>
        )}

        {/* Firebase Slots */}
        {firebaseSlots.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
              <span>🌐</span> Multiplayer místnosti
            </h2>
            <div className="space-y-2">
              {firebaseSlots.map(slot => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  onSelect={onSelectSlot}
                  onDelete={onDeleteSlot}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {slots.length === 0 && (
          <div className="text-center text-amber-600 py-8 mb-6">
            <p>Zatím nemáš žádné uložené hry.</p>
            <p className="text-sm mt-1">Vytvoř novou hru nebo se připoj k místnosti.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
          <button
            data-testid="new-game-button"
            onClick={onCreateNew}
            className="p-4 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg flex flex-col items-center gap-2 transition-all shadow-md"
          >
            <span className="text-2xl">➕</span>
            <span className="font-bold text-white">Nová sólo hra</span>
          </button>

          <button
            onClick={onCreateFirebaseRoom}
            className="p-4 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg flex flex-col items-center gap-2 transition-all shadow-md"
          >
            <span className="text-2xl">🏠</span>
            <span className="font-bold text-white">Vytvořit místnost</span>
          </button>

          <button
            onClick={onJoinFirebaseRoom}
            className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg flex flex-col items-center gap-2 transition-all shadow-md"
          >
            <span className="text-2xl">🚪</span>
            <span className="font-bold text-white">Připojit se</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================

function MausritterSoloCompanion() {
  const [activePanel, setActivePanel] = useState('journal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingMentionOpen, setPendingMentionOpen] = useState(null); // { type: 'npc'|'settlement', id: string }

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
  const [showSyncDirectionChoice, setShowSyncDirectionChoice] = useState(null); // { token, folderId, cloudFileId, hasCloudFile, hasLocalData }
  const [syncSaveFileName, setSyncSaveFileName] = useState('mausritter-save.json'); // Editable filename for sync
  const [showSyncConfirm, setShowSyncConfirm] = useState(null); // Confirm overwrite dialog
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

  // --- MULTIPLAYER STATE (Firebase) ---
  const [roomCode, setRoomCode] = useState(null);
  const [roomName, setRoomName] = useState(null); // Custom room name
  const [roomConnected, setRoomConnected] = useState(false);
  const [roomPlayers, setRoomPlayers] = useState([]); // [{ oderId, name, isGM, online }]
  const [isGM, setIsGM] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [multiplayerStatus, setMultiplayerStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected'
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [showJoinRoomDialog, setShowJoinRoomDialog] = useState(false);
  const [showRoomCreatedDialog, setShowRoomCreatedDialog] = useState(false); // Shows room code
  const [showPlayersDialog, setShowPlayersDialog] = useState(false); // Shows players list
  const [currentGmPin, setCurrentGmPin] = useState(null); // My PIN for reconnecting
  const [multiplayerToast, setMultiplayerToast] = useState(null); // { message, type: 'info'|'success'|'error' }
  const [showDataWarningDialog, setShowDataWarningDialog] = useState(false); // Warning before joining room
  const [showReconnectChoiceDialog, setShowReconnectChoiceDialog] = useState(false); // Choice on page load
  const [savedRoomCredentials, setSavedRoomCredentials] = useState(null); // Credentials for reconnect dialog
  const pendingRoomJoinRef = useRef(null); // { code, playerName, playerPin, isCreate }
  const firebaseDbRef = useRef(null);
  const roomListenerRef = useRef(null);
  const playersListenerRef = useRef(null);
  const presenceRef = useRef(null);
  const lastSyncTimestampRef = useRef(null); // Track last sync to avoid duplicate toasts
  const isLoadingFromFirebaseRef = useRef(false); // Prevent auto-save during Firebase load

  // NEW: Parties system - replaces single character
  const [parties, setParties] = useState([]);
  const [activePartyId, setActivePartyId] = useState(null);
  const [activeCharacterId, setActiveCharacterId] = useState(null);
  const [sidePanelCharacter, setSidePanelCharacter] = useState(null); // Character for mobile side panel

  const [journal, setJournal] = useState([]);
  const [factions, setFactions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [worldNPCs, setWorldNPCs] = useState([]);
  const [timedEvents, setTimedEvents] = useState([]); // { id, title, targetDay, targetWatch, notes, completed }
  const [lexicon, setLexicon] = useState([]); // { id, name, category, description, imageData, createdAt, sourceEntryId }
  const [journalPartyFilter, setJournalPartyFilter] = useState('all');

  // === SLOT SYSTEM STATE ===
  const [slotIndex, setSlotIndex] = useState([]);           // Seznam všech slotů
  const [activeSlotId, setActiveSlotId] = useState(null);   // Aktivní slot ID
  const [showSlotSelection, setShowSlotSelection] = useState(true); // Zobrazit výběr slotů
  const [pendingSlotAction, setPendingSlotAction] = useState(null); // { action: 'new'|'overwrite', newName? }
  const [newSlotName, setNewSlotName] = useState('');       // Název pro nový slot v dialogu
  const [storageWarning, setStorageWarning] = useState(null); // Varování při plném localStorage
  const [googleTokenExpiry, setGoogleTokenExpiry] = useState(null); // Čas expirace Google tokenu

  // Helper: Get active party
  const activeParty = (parties || []).find(p => p.id === activePartyId) || null;
  
  // Helper: Get active character (for detail view)
  const activeCharacter = activeParty?.members?.find(m => m.id === activeCharacterId) || null;

  // Helper: Update party
  const updateParty = (partyId, updates) => {
    setParties(prevParties => prevParties.map(p => p.id === partyId ? { ...p, ...updates } : p));
  };

  // Helper: Update character within party
  const updateCharacterInParty = (partyId, charId, updates) => {
    setParties((parties || []).map(p => {
      if (p.id !== partyId) return p;
      return {
        ...p,
        members: (p.members || []).map(m => m.id === charId ? { ...m, ...updates } : m)
      };
    }));
  };

  // Helper: Safe localStorage.setItem with QuotaExceededError handling
  const safeLocalStorageSet = useCallback((key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('localStorage plný:', e);
        setStorageWarning('Úložiště prohlížeče je plné! Exportujte data nebo smažte staré sloty.');
        return false;
      }
      throw e;
    }
  }, []);

  // Helper: Check if Google token is expired
  const isGoogleTokenExpired = useCallback(() => {
    if (!googleTokenExpiry) return true;
    return Date.now() >= googleTokenExpiry - 60000; // 1 min buffer
  }, [googleTokenExpiry]);

  // Helper: Update gameTime for active party
  const updateGameTime = (newGameTime) => {
    if (!activePartyId) return;
    setParties((parties || []).map(p =>
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
    setParties([...(parties || []), newParty]);
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
    
    setParties((parties || []).map(p => {
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

    setParties((parties || []).map(p => {
      if (p.id !== partyId) return p;
      return { ...p, members: [...p.members, newHireling] };
    }));
    return newHireling;
  };

  // Helper: Add multiple pre-created hirelings to party
  const addHirelingsToParty = (partyId, hirelings) => {
    if (!hirelings || hirelings.length === 0) return;
    setParties((parties || []).map(p => {
      if (p.id !== partyId) return p;
      return { ...p, members: [...(p.members || []), ...hirelings] };
    }));
  };

  // Helper: Remove character from party
  const removeCharacter = (partyId, charId) => {
    setParties((parties || []).map(p => {
      if (p.id !== partyId) return p;
      return { ...p, members: (p.members || []).filter(m => m.id !== charId) };
    }));
    if (activeCharacterId === charId) {
      setActiveCharacterId(null);
    }
  };

  // Helper: Remove party
  const removeParty = (partyId) => {
    setParties((parties || []).filter(p => p.id !== partyId));
    if (activePartyId === partyId) {
      const remaining = (parties || []).filter(p => p.id !== partyId);
      setActivePartyId(remaining.length > 0 ? remaining[0].id : null);
      setActiveCharacterId(null);
    }
  };

  // ============================================
  // SLOT MANAGEMENT FUNCTIONS
  // ============================================

  // Načti data slotu do stavu
  const loadSlotData = (slotOrId) => {
    try {
      // Podporuj jak string ID tak celý objekt slotu
      const slotId = typeof slotOrId === 'string' ? slotOrId : slotOrId?.id;
      if (!slotId) {
        console.error('loadSlotData: Invalid slot ID', slotOrId);
        return;
      }
      const slotKey = `mausritter-slot-${slotId}`;
      const saved = localStorage.getItem(slotKey);

      if (saved) {
        const rawData = JSON.parse(saved);
        const data = migrateSaveData(rawData);

        setParties(data.parties || []);
        setActivePartyId(data.activePartyId || null);
        setActiveCharacterId(data.activeCharacterId || null);
        setJournal(data.journal || []);
        setFactions(data.factions || []);
        setSettlements(data.settlements || []);
        setWorldNPCs(data.worldNPCs || []);
        setTimedEvents(data.timedEvents || []);
        setLexicon(data.lexicon || []);
      } else {
        // Prázdný slot
        setParties([]);
        setActivePartyId(null);
        setActiveCharacterId(null);
        setJournal([]);
        setFactions([]);
        setSettlements([]);
        setWorldNPCs([]);
        setTimedEvents([]);
        setLexicon([]);
      }

      setActiveSlotId(slotId);
      localStorage.setItem('mausritter-active-slot-id', slotId);
      setShowSlotSelection(false);

    } catch (e) {
      console.error('Failed to load slot data:', e);
    }
  };

  // Vytvoř nový lokální slot
  const createNewLocalSlot = (name = 'Nová hra') => {
    const newSlotId = 'slot_' + generateId();
    const newSlot = {
      id: newSlotId,
      type: 'local',
      name: name,
      lastModified: new Date().toISOString(),
      preview: { partyCount: 0, partyNames: [], journalCount: 0 }
    };

    // Přidej do indexu
    const newIndex = [...slotIndex, newSlot];
    setSlotIndex(newIndex);
    localStorage.setItem('mausritter-slots-index', JSON.stringify(newIndex));

    // Inicializuj prázdná data
    const emptyData = {
      version: SAVE_VERSION,
      parties: [],
      activePartyId: null,
      activeCharacterId: null,
      journal: [],
      factions: [],
      settlements: [],
      worldNPCs: [],
      timedEvents: [],
      lexicon: []
    };
    localStorage.setItem(`mausritter-slot-${newSlotId}`, JSON.stringify(emptyData));

    // Načti slot
    loadSlotData(newSlotId);
    return newSlotId;
  };

  // Aktualizuj metadata slotu v indexu
  const updateSlotMeta = useCallback((slotId, updates) => {
    setSlotIndex(prev => {
      const newIndex = prev.map(s =>
        s.id === slotId ? { ...s, ...updates, lastModified: new Date().toISOString() } : s
      );
      localStorage.setItem('mausritter-slots-index', JSON.stringify(newIndex));
      return newIndex;
    });
  }, []);

  // Smaž slot
  const deleteSlot = (slotId) => {
    const slot = slotIndex.find(s => s.id === slotId);
    if (!slot) return;

    // Odstraň z indexu
    const newIndex = slotIndex.filter(s => s.id !== slotId);
    setSlotIndex(newIndex);
    localStorage.setItem('mausritter-slots-index', JSON.stringify(newIndex));

    // Odstraň data
    localStorage.removeItem(`mausritter-slot-${slotId}`);

    // Pokud smazaný slot byl aktivní, zobraz výběr
    if (activeSlotId === slotId) {
      setActiveSlotId(null);
      setShowSlotSelection(true);
      localStorage.removeItem('mausritter-active-slot-id');
    }
  };

  // Vytvoř Firebase slot při createRoom/joinRoom
  const createFirebaseSlot = (roomCode, roomName, playerName, playerPin, isGM) => {
    const slotId = 'room_' + roomCode;

    // Zkontroluj, jestli už neexistuje
    const existing = slotIndex.find(s => s.id === slotId);
    if (existing) {
      // Aktualizuj metadata
      updateSlotMeta(slotId, {
        name: roomName || existing.name,
        playerName,
        playerPin,
        isGM
      });
      return slotId;
    }

    const newSlot = {
      id: slotId,
      type: 'firebase',
      name: roomName || `Místnost ${roomCode}`,
      roomCode: roomCode,
      playerName,
      playerPin,
      isGM,
      lastModified: new Date().toISOString(),
      preview: { partyCount: 0, partyNames: [], journalCount: 0 }
    };

    const newIndex = [...slotIndex, newSlot];
    setSlotIndex(newIndex);
    localStorage.setItem('mausritter-slots-index', JSON.stringify(newIndex));

    return slotId;
  };

  // Load slot index and handle migrations
  useEffect(() => {
    try {
      // 1. Načti index slotů
      const indexJson = localStorage.getItem('mausritter-slots-index');
      let index = indexJson ? JSON.parse(indexJson) : [];

      // 2. MIGRACE: Staré mausritter-save -> nový slot
      const oldSave = localStorage.getItem('mausritter-save');
      if (oldSave && index.length === 0) {
        const oldData = JSON.parse(oldSave);
        if (oldData.parties?.length > 0 || oldData.journal?.length > 0) {
          const newSlotId = 'slot_' + generateId();
          const migratedSlot = {
            id: newSlotId,
            type: 'local',
            name: 'Původní hra',
            lastModified: new Date().toISOString(),
            preview: {
              partyCount: oldData.parties?.length || 0,
              partyNames: (oldData.parties || []).map(p => p.name).slice(0, 3),
              journalCount: oldData.journal?.length || 0
            }
          };
          index = [migratedSlot];
          localStorage.setItem('mausritter-slots-index', JSON.stringify(index));
          localStorage.setItem(`mausritter-slot-${newSlotId}`, oldSave);
          localStorage.setItem('mausritter-active-slot-id', newSlotId);
          console.log('Migrated old save to slot:', newSlotId);
        }
      }

      // 3. MIGRACE: Staré room credentials -> Firebase slot
      const oldRoomCreds = localStorage.getItem('mausritter-room-credentials');
      if (oldRoomCreds) {
        const creds = JSON.parse(oldRoomCreds);
        if (!index.find(s => s.type === 'firebase' && s.roomCode === creds.roomCode)) {
          const firebaseSlotId = 'room_' + creds.roomCode;
          const firebaseSlot = {
            id: firebaseSlotId,
            type: 'firebase',
            name: creds.roomName || `Místnost ${creds.roomCode}`,
            roomCode: creds.roomCode,
            playerName: creds.playerName,
            playerPin: creds.playerPin,
            isGM: creds.isGM,
            lastModified: new Date().toISOString(),
            preview: { partyCount: 0, journalCount: 0 }
          };
          index = [...index, firebaseSlot];
          localStorage.setItem('mausritter-slots-index', JSON.stringify(index));
          console.log('Migrated room credentials to slot:', firebaseSlotId);
        }
        // Smaž staré credentials
        localStorage.removeItem('mausritter-room-credentials');
      }

      setSlotIndex(index);

      // 4. Zkontroluj URL pro room code (#room=ABCDEF)
      const hash = window.location.hash;
      const roomMatch = hash.match(/#room=([A-Z0-9]{6})/i);
      if (roomMatch) {
        const roomCode = roomMatch[1].toUpperCase();
        const firebaseSlot = index.find(s => s.type === 'firebase' && s.roomCode === roomCode);
        if (firebaseSlot) {
          // Máme slot pro tuto místnost - načti a reconnect
          loadSlotData(firebaseSlot.id);
          joinRoom(firebaseSlot.roomCode, firebaseSlot.playerName, firebaseSlot.playerPin, true);
        } else {
          // Nová místnost - zobraz join dialog
          setShowJoinRoomDialog(true);
          window._pendingRoomCode = roomCode;
        }
        return;
      }

      // 5. Zobraz výběr slotů
      setShowSlotSelection(true);

    } catch (e) {
      console.error('Failed to load slots:', e);
      setShowSlotSelection(true);
    }
  }, []);

  // Auto-save - ukládá do aktivního slotu
  useEffect(() => {
    // Skip pokud není aktivní slot nebo jsme na výběru slotů
    if (!activeSlotId || showSlotSelection) return;

    // Skip auto-save while loading data from Firebase
    if (isLoadingFromFirebaseRef.current) return;

    const saveData = {
      version: SAVE_VERSION,
      parties,
      activePartyId,
      activeCharacterId,
      journal,
      factions,
      settlements,
      worldNPCs,
      timedEvents,
      lexicon
    };

    // Ulož do slotu
    const slotKey = `mausritter-slot-${activeSlotId}`;
    if (!safeLocalStorageSet(slotKey, JSON.stringify(saveData))) {
      return; // Storage full, don't update meta
    }

    // Aktualizuj preview v indexu
    updateSlotMeta(activeSlotId, {
      preview: {
        partyCount: parties.length,
        partyNames: parties.slice(0, 3).map(p => p.name),
        journalCount: journal.length
      }
    });

  }, [parties, activePartyId, activeCharacterId, journal, factions, settlements, worldNPCs, timedEvents, lexicon, activeSlotId, showSlotSelection, updateSlotMeta, safeLocalStorageSet]);

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
      timedEvents,
      lexicon,
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

        // Potvrzení před přepsáním dat
        const currentStats = `Aktuální stav:\n- ${parties.length} družin\n- ${journal.length} záznamů v deníku`;
        const importStats = `Import obsahuje:\n- ${data.parties?.length || 0} družin\n- ${data.journal?.length || 0} záznamů v deníku`;

        if (!confirm(`⚠️ Opravdu chcete importovat?\n\nVšechna současná data budou NENÁVRATNĚ přepsána!\n\n${currentStats}\n\n${importStats}`)) {
          return;
        }

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
  // MULTIPLAYER (Firebase Realtime Database)
  // ============================================

  // Generate 6-character room code (no confusing chars like 0/O, 1/I)
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  // Generate 4-digit GM PIN
  const generateGMPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Generate player ID from name+PIN (unique per player, not per device)
  const generatePlayerId = (name, pin) => {
    // Create a simple hash to avoid special characters in Firebase paths
    const str = `${name}_${pin}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `p_${Math.abs(hash).toString(36)}`;
  };

  // Generate unique user ID (stored in localStorage for persistence)
  const getOrCreateUserId = () => {
    // Migrate from sessionStorage to localStorage
    let oderId = localStorage.getItem('mausritter-user-id');
    if (!oderId) {
      oderId = sessionStorage.getItem('mausritter-user-id');
      if (oderId) {
        localStorage.setItem('mausritter-user-id', oderId);
        sessionStorage.removeItem('mausritter-user-id');
      }
    }
    if (!oderId) {
      oderId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('mausritter-user-id', oderId);
    }
    return oderId;
  };

  // Initialize Firebase
  const initFirebase = () => {
    if (firebaseDbRef.current) return firebaseDbRef.current;

    try {
      if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return null;
      }

      // Check if already initialized
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }

      firebaseDbRef.current = firebase.database();
      return firebaseDbRef.current;
    } catch (err) {
      console.error('Firebase init error:', err);
      return null;
    }
  };

  // Show toast notification
  const showMultiplayerToast = (message, type = 'info') => {
    setMultiplayerToast({ message, type });
    setTimeout(() => setMultiplayerToast(null), 3000);
  };

  // Get current game state for sync
  const getGameState = () => ({
    version: SAVE_VERSION,
    parties,
    activePartyId,
    activeCharacterId,
    journal,
    factions,
    settlements,
    worldNPCs,
    timedEvents,
    lexicon
  });

  // Apply game state from Firebase
  const applyGameState = (state, fromUserId) => {
    if (!state) return;

    // Don't apply our own changes
    if (fromUserId === myUserId) return;

    // Ensure parties is always an array (Firebase may store empty array as null)
    if (state.parties !== undefined) setParties(Array.isArray(state.parties) ? state.parties : []);
    if (state.activePartyId !== undefined) setActivePartyId(state.activePartyId);
    if (state.activeCharacterId !== undefined) setActiveCharacterId(state.activeCharacterId);
    if (state.journal) setJournal(state.journal);
    if (state.factions) setFactions(state.factions);
    if (state.settlements) setSettlements(state.settlements);
    if (state.worldNPCs) setWorldNPCs(state.worldNPCs);
    if (state.timedEvents) setTimedEvents(state.timedEvents);
    if (state.lexicon) setLexicon(state.lexicon);
  };

  // Upload state to Firebase (debounced)
  const syncToFirebaseRef = useRef(null);
  const syncToFirebase = useCallback(() => {
    if (!roomConnected || !roomCode || !firebaseDbRef.current) return;

    // Cancel previous timeout
    if (syncToFirebaseRef.current) {
      clearTimeout(syncToFirebaseRef.current);
    }

    // Debounce: wait 500ms before syncing
    syncToFirebaseRef.current = setTimeout(() => {
      const db = firebaseDbRef.current;
      const stateRef = db.ref(`rooms/${roomCode}/state`);

      const state = getGameState();
      state._lastModified = firebase.database.ServerValue.TIMESTAMP;
      state._lastModifiedBy = myUserId;

      setMultiplayerStatus('syncing');
      stateRef.set(state)
        .then(() => {
          setMultiplayerStatus('connected');
        })
        .catch(err => {
          console.error('Sync to Firebase failed:', err);
          setMultiplayerStatus('error');
        });
    }, 500);
  }, [roomConnected, roomCode, myUserId, parties, activePartyId, activeCharacterId, journal, factions, settlements, worldNPCs, timedEvents, lexicon]);

  // Helper: Save solo data before joining/creating a room
  const saveSoloDataBeforeRoomJoin = () => {
    const soloData = {
      version: SAVE_VERSION,
      parties, activePartyId, activeCharacterId, journal,
      factions, settlements, worldNPCs, timedEvents, lexicon
    };
    safeLocalStorageSet('mausritter-save', JSON.stringify(soloData));
    console.log('Solo data saved before room join');
  };

  // Create a new room as GM
  const createRoom = async (playerName, playerPin, roomTitle = '', skipWarning = false) => {
    // Show warning if user has solo data
    const hasSoloData = parties.length > 0 || journal.length > 0;
    if (hasSoloData && !skipWarning && !roomConnected) {
      pendingRoomJoinRef.current = { code: roomTitle, playerName, playerPin, isCreate: true };
      setShowDataWarningDialog(true);
      return null;
    }

    // Save solo data before creating room
    if (!roomConnected) {
      saveSoloDataBeforeRoomJoin();
    }

    const db = initFirebase();
    if (!db) {
      showMultiplayerToast('Firebase není dostupný', 'error');
      return null;
    }

    setMultiplayerStatus('connecting');

    const code = generateRoomCode();
    const oderId = getOrCreateUserId();
    const playerId = generatePlayerId(playerName, playerPin);
    setMyUserId(playerId);

    try {
      const roomRef = db.ref(`rooms/${code}`);

      // Create room with current state
      await roomRef.set({
        meta: {
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          createdBy: playerId,
          name: roomTitle || null, // Custom room name
          players: {
            [playerId]: {
              name: playerName,
              pin: playerPin,
              isGM: true,
              deviceId: oderId,
              joinedAt: firebase.database.ServerValue.TIMESTAMP
            }
          }
        },
        state: {
          ...getGameState(),
          _lastModified: firebase.database.ServerValue.TIMESTAMP,
          _lastModifiedBy: playerId
        }
      });

      // Setup presence
      const presenceRefPath = db.ref(`rooms/${code}/presence/${playerId}`);
      presenceRefPath.set({ online: true, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRefPath.onDisconnect().set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRef.current = presenceRefPath;

      // Listen for state changes from others
      const stateRef = db.ref(`rooms/${code}/state`);
      lastSyncTimestampRef.current = Date.now(); // Initialize timestamp
      stateRef.on('value', (snapshot) => {
        const state = snapshot.val();
        if (state && state._lastModifiedBy !== playerId) {
          // Only show toast if timestamp actually changed (not duplicate event)
          if (state._lastModified && state._lastModified !== lastSyncTimestampRef.current) {
            lastSyncTimestampRef.current = state._lastModified;
            applyGameState(state, state._lastModifiedBy);
            // Don't show toast - it's annoying. Just silently sync.
          }
        }
      });
      roomListenerRef.current = stateRef;

      // Listen for players
      const playersRef = db.ref(`rooms/${code}/meta/players`);
      playersRef.on('value', (snapshot) => {
        const players = snapshot.val() || {};
        const playerList = Object.entries(players).map(([id, p]) => ({
          oderId: id,
          ...p
        }));
        setRoomPlayers(playerList);
      });
      playersListenerRef.current = playersRef;

      setRoomCode(code);
      setRoomName(roomTitle || null);
      setCurrentGmPin(playerPin);
      setRoomConnected(true);
      setIsGM(true);
      setMultiplayerStatus('connected');
      setShowCreateRoomDialog(false);
      setShowRoomCreatedDialog(true); // Show dialog with code

      // Vytvoř/aktualizuj Firebase slot
      const slotId = createFirebaseSlot(code, roomTitle, playerName, playerPin, true);
      setActiveSlotId(slotId);
      localStorage.setItem('mausritter-active-slot-id', slotId);

      return code;
    } catch (err) {
      console.error('Create room error:', err);
      setMultiplayerStatus('disconnected');
      showMultiplayerToast('Chyba při vytváření místnosti', 'error');
      return null;
    }
  };

  // Join existing room - find player by name+PIN or create new
  const joinRoom = async (code, playerName, playerPin, skipWarning = false) => {
    // Show warning if user has solo data
    const hasSoloData = parties.length > 0 || journal.length > 0;
    if (hasSoloData && !skipWarning && !roomConnected) {
      pendingRoomJoinRef.current = { code, playerName, playerPin, isCreate: false };
      setShowDataWarningDialog(true);
      return false;
    }

    // Save solo data before joining room
    if (!roomConnected) {
      saveSoloDataBeforeRoomJoin();
    }

    const db = initFirebase();
    if (!db) {
      showMultiplayerToast('Firebase není dostupný', 'error');
      return false;
    }

    setMultiplayerStatus('connecting');
    const normalizedCode = code.toUpperCase().trim();
    const oderId = getOrCreateUserId();
    const playerId = generatePlayerId(playerName, playerPin);
    setMyUserId(playerId);

    try {
      const roomRef = db.ref(`rooms/${normalizedCode}`);
      const snapshot = await roomRef.get();

      if (!snapshot.exists()) {
        setMultiplayerStatus('disconnected');
        showMultiplayerToast('Místnost neexistuje', 'error');
        return false;
      }

      const roomData = snapshot.val();
      const players = roomData.meta?.players || {};

      // Find existing player with same name+PIN (should match our generated playerId)
      const existingPlayer = players[playerId];

      // Check if name is taken with different PIN
      const nameTaken = Object.entries(players).some(([id, p]) =>
        p.name === playerName && id !== playerId
      );
      if (nameTaken && !existingPlayer) {
        setMultiplayerStatus('disconnected');
        showMultiplayerToast('Toto jméno je již použito s jiným PINem!', 'error');
        return false;
      }

      const amIGM = existingPlayer?.isGM || false;

      // Update or create player record
      await db.ref(`rooms/${normalizedCode}/meta/players/${playerId}`).update({
        name: playerName,
        pin: playerPin,
        isGM: amIGM,
        deviceId: oderId,
        joinedAt: existingPlayer?.joinedAt || firebase.database.ServerValue.TIMESTAMP
      });

      // Setup presence
      const presenceRefPath = db.ref(`rooms/${normalizedCode}/presence/${playerId}`);
      presenceRefPath.set({ online: true, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRefPath.onDisconnect().set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRef.current = presenceRefPath;

      // Load current state from Firebase (prevent auto-save during load)
      isLoadingFromFirebaseRef.current = true;
      if (roomData.state) {
        // Pass 'initial' as fromUserId to ensure it's never equal to myUserId
        applyGameState(roomData.state, 'initial');
      }
      // Use timeout to ensure React state updates are applied before re-enabling auto-save
      setTimeout(() => {
        isLoadingFromFirebaseRef.current = false;
      }, 500);

      // Listen for state changes
      const stateRef = db.ref(`rooms/${normalizedCode}/state`);
      lastSyncTimestampRef.current = roomData.state?._lastModified || Date.now();
      stateRef.on('value', (snapshot) => {
        const state = snapshot.val();
        if (state && state._lastModifiedBy !== playerId) {
          // Only sync if timestamp actually changed (not duplicate event)
          if (state._lastModified && state._lastModified !== lastSyncTimestampRef.current) {
            lastSyncTimestampRef.current = state._lastModified;
            applyGameState(state, state._lastModifiedBy);
            // Don't show toast - it's annoying. Just silently sync.
          }
        }
      });
      roomListenerRef.current = stateRef;

      // Listen for players
      const playersRef = db.ref(`rooms/${normalizedCode}/meta/players`);
      playersRef.on('value', (snapshot) => {
        const playersData = snapshot.val() || {};
        const playerList = Object.entries(playersData).map(([id, p]) => ({
          oderId: id,
          ...p
        }));
        setRoomPlayers(playerList);
      });
      playersListenerRef.current = playersRef;

      const fetchedRoomName = roomData.meta?.name || null;
      setRoomCode(normalizedCode);
      setRoomName(fetchedRoomName);
      setCurrentGmPin(playerPin);
      setRoomConnected(true);
      setIsGM(amIGM);
      setMultiplayerStatus('connected');
      setShowJoinRoomDialog(false);

      // Vytvoř/aktualizuj Firebase slot
      const slotId = createFirebaseSlot(normalizedCode, fetchedRoomName, playerName, playerPin, amIGM);
      setActiveSlotId(slotId);
      localStorage.setItem('mausritter-active-slot-id', slotId);

      const statusMsg = existingPlayer
        ? (amIGM ? 'Připojeno jako GM!' : `Vítej zpět, ${playerName}!`)
        : `Připojeno jako nový hráč!`;
      showMultiplayerToast(statusMsg, 'success');

      return true;
    } catch (err) {
      console.error('Join room error:', err);
      setMultiplayerStatus('disconnected');
      showMultiplayerToast('Chyba při připojování', 'error');
      return false;
    }
  };

  // Leave room
  const leaveRoom = () => {
    if (roomListenerRef.current) {
      roomListenerRef.current.off();
      roomListenerRef.current = null;
    }

    if (playersListenerRef.current) {
      playersListenerRef.current.off();
      playersListenerRef.current = null;
    }

    if (presenceRef.current) {
      presenceRef.current.set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      presenceRef.current = null;
    }

    setRoomCode(null);
    setRoomName(null);
    setRoomConnected(false);
    setRoomPlayers([]);
    setIsGM(false);
    setMultiplayerStatus('disconnected');
    lastSyncTimestampRef.current = null;

    // Nemazat slot ani data - jen odpojit a zobrazit výběr slotů
    setActiveSlotId(null);
    setShowSlotSelection(true);
    localStorage.removeItem('mausritter-active-slot-id');

    showMultiplayerToast('Odpojeno z místnosti', 'info');
  };

  // Kick player from room (GM only)
  const kickPlayer = async (playerId, playerName) => {
    if (!isGM || !roomCode) return;

    const db = initFirebase();
    if (!db) return;

    try {
      // Remove player from players list
      await db.ref(`rooms/${roomCode}/meta/players/${playerId}`).remove();
      // Remove player presence
      await db.ref(`rooms/${roomCode}/presence/${playerId}`).remove();
      showMultiplayerToast(`${playerName} byl vyhozen z místnosti`, 'success');
    } catch (err) {
      console.error('Kick player error:', err);
      showMultiplayerToast('Chyba při vyhazování hráče', 'error');
    }
  };

  // Copy room link to clipboard
  const copyRoomLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#room=${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      showMultiplayerToast('Odkaz zkopírován!', 'success');
    });
  };

  // Copy room code to clipboard
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      showMultiplayerToast('Kód zkopírován!', 'success');
    });
  };

  // Sync to Firebase when state changes
  useEffect(() => {
    if (roomConnected) {
      syncToFirebase();
    }
  }, [roomConnected, parties, activePartyId, journal, factions, settlements, worldNPCs, timedEvents, lexicon]);

  // Check URL for room code on mount
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/room=([A-Z0-9]{6})/i);
    if (match) {
      const code = match[1].toUpperCase();
      // Show join dialog with pre-filled code
      setShowJoinRoomDialog(true);
      // Store code for the dialog
      window._pendingRoomCode = code;
    }
  }, []);

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
        // Store token expiry time (default ~1 hour)
        const expiresIn = response.expires_in || 3599;
        setGoogleTokenExpiry(Date.now() + (expiresIn * 1000));
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
              // Folder was deleted or trashed - clear localStorage and show dialog
              console.warn('Saved folder no longer exists, showing folder choice');
              localStorage.removeItem('googleDriveFolderId');
              localStorage.removeItem('googleDriveFolderName');
              setPendingToken(response.access_token);
              setShowFolderChoice(true);
            }
          } catch (err) {
            console.error('Folder verification failed:', err);
            localStorage.removeItem('googleDriveFolderId');
            localStorage.removeItem('googleDriveFolderName');
            setPendingToken(response.access_token);
            setShowFolderChoice(true);
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
        .setOrigin(window.location.origin)
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
      // Search for all JSON files in folder
      const query = folderId
        ? `mimeType='application/json' and '${folderId}' in parents and trashed=false`
        : `mimeType='application/json' and trashed=false`;
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const searchData = await searchResponse.json();

      const cloudFiles = searchData.files || [];
      const mainSaveFile = cloudFiles.find(f => f.name === 'mausritter-save.json');
      const hasCloudFile = !!mainSaveFile;
      const localSave = localStorage.getItem('mausritter-save');
      const hasLocalData = localSave && localSave.length > 10; // More than just empty object

      // Always show direction choice dialog when connecting
      if (hasCloudFile || hasLocalData || cloudFiles.length > 0) {
        setShowSyncDirectionChoice({
          token,
          folderId,
          cloudFileId: mainSaveFile?.id || null,
          cloudModifiedTime: mainSaveFile?.modifiedTime || null,
          hasCloudFile,
          hasLocalData,
          cloudFiles // All JSON files in folder
        });
        return; // Wait for user decision
      }

      // Neither cloud nor local data - just create new empty file
      await saveToGoogleDrive(token, null, folderId);
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

  // Sync direction choice handlers
  const handleSyncUpload = async () => {
    if (!showSyncDirectionChoice) return;
    const { token, folderId, cloudFiles } = showSyncDirectionChoice;

    // Check if file with this name already exists
    const existingFile = cloudFiles?.find(f => f.name === syncSaveFileName);

    if (existingFile) {
      // Show confirmation dialog
      setShowSyncConfirm({
        token,
        folderId,
        existingFileId: existingFile.id,
        existingFileName: existingFile.name,
        existingModifiedTime: existingFile.modifiedTime
      });
    } else {
      // No existing file - save directly with custom name
      setShowSyncDirectionChoice(null);
      await saveToGoogleDriveWithName(token, null, folderId, syncSaveFileName);
    }
  };

  // Confirm overwrite
  const handleSyncConfirmOverwrite = async () => {
    if (!showSyncConfirm) return;
    const { token, folderId, existingFileId } = showSyncConfirm;
    setShowSyncConfirm(null);
    setShowSyncDirectionChoice(null);
    await saveToGoogleDriveWithName(token, existingFileId, folderId, syncSaveFileName);
  };

  const handleSyncConfirmCancel = () => {
    setShowSyncConfirm(null);
    // Go back to direction choice dialog
  };

  const handleSyncDownload = async () => {
    if (!showSyncDirectionChoice) return;
    const { token, cloudFileId } = showSyncDirectionChoice;
    setShowSyncDirectionChoice(null);
    if (cloudFileId) {
      // Download from cloud (overwrite local)
      setGoogleDriveFileId(cloudFileId);
      await loadFromGoogleDrive(token, cloudFileId);
      setGoogleLastSync(new Date());
    } else {
      // No cloud file - nothing to download
      alert('Na Google Drive není žádný uložený soubor.');
    }
  };

  const handleSyncCancel = () => {
    setShowSyncDirectionChoice(null);
    setSyncSaveFileName('mausritter-save.json'); // Reset filename
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
        .setDeveloperKey(GOOGLE_API_KEY)
        .setOrigin(window.location.origin)
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

  // Start new game - reset all data (or create new slot)
  const startNewGame = (mode = 'new') => {
    const slotName = newSlotName.trim() || 'Nová hra';

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

    if (mode === 'new') {
      // Vytvořit nový slot
      const newSlotId = createNewLocalSlot(slotName);
      setActiveSlotId(newSlotId);
    } else if (mode === 'overwrite' && activeSlotId) {
      // Přepsat aktuální slot - aktualizovat jeho název a vyčistit data
      const updatedIndex = slotIndex.map(s =>
        s.id === activeSlotId
          ? { ...s, name: slotName, lastModified: Date.now(), preview: { partiesCount: 0, journalCount: 0 } }
          : s
      );
      setSlotIndex(updatedIndex);
      localStorage.setItem('mausritter-slots-index', JSON.stringify(updatedIndex));

      // Vyčistit data slotu
      localStorage.setItem(`mausritter-slot-${activeSlotId}`, JSON.stringify({
        parties: [],
        journal: [],
        factions: [],
        settlements: [],
        worldNPCs: []
      }));
    }

    setShowNewGameDialog(false);
    setNewSlotName('');
  };

  // Save to Google Drive
  const saveToGoogleDrive = async (token = googleAccessToken, fileId = googleDriveFileId, folderId = googleDriveFolderId) => {
    if (!token) return;

    // Check if token is expired
    if (isGoogleTokenExpired()) {
      setGoogleSyncStatus('expired');
      setGoogleAccessToken(null);
      setGoogleTokenExpiry(null);
      alert('Google přihlášení vypršelo. Prosím přihlaste se znovu.');
      return;
    }

    try {
      setGoogleSyncStatus('saving');
      const data = getSaveData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

      let response;
      if (fileId) {
        // Update existing file
        response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
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

        response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
        const result = await response.json();
        if (result.id) {
          setGoogleDriveFileId(result.id);
          setGoogleDriveFileName(result.name);
        }
      }

      // Handle token expiration from server
      if (response && response.status === 401) {
        setGoogleSyncStatus('expired');
        setGoogleAccessToken(null);
        setGoogleTokenExpiry(null);
        alert('Google přihlášení vypršelo. Prosím přihlaste se znovu.');
        return;
      }

      setGoogleLastSync(new Date());
      setGoogleSyncStatus('connected');
    } catch (err) {
      console.error('Google Drive save failed:', err);
      setGoogleSyncStatus('error');
    }
  };

  // Save to Google Drive with custom filename
  const saveToGoogleDriveWithName = async (token, fileId, folderId, fileName) => {
    if (!token) return;

    try {
      setGoogleSyncStatus('saving');
      const data = getSaveData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

      if (fileId) {
        // Update existing file (also update name if different)
        const updateMetadata = { name: fileName };
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateMetadata)
        });
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: blob
        });
        setGoogleDriveFileId(fileId);
        setGoogleDriveFileName(fileName);
      } else {
        // Create new file with custom name
        const metadata = {
          name: fileName,
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
      setSyncSaveFileName('mausritter-save.json'); // Reset for next time
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
    { id: 'events', label: 'Události', icon: '📅' },
    { id: 'world', label: 'Svět', icon: '🌍' },
    { id: 'factions', label: 'Frakce', icon: '🏰' },
    { id: 'lexicon', label: 'Lexikon', icon: '📚' },
    { id: 'smallworld', label: 'Malý Svět', icon: '🏠' },
    { id: 'studio', label: 'Kartičky', icon: '🎴' },
    { id: 'howto', label: 'Jak hrát', icon: '📚' }
  ];

  // === SLOT SELECTION SCREEN ===
  // Zobrazit výběr slotů pokud není vybrán žádný aktivní slot
  if (showSlotSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100">
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <SlotSelectionScreen
          slots={slotIndex}
          onSelectSlot={loadSlotData}
          onCreateNew={() => {
            const newSlotId = createNewLocalSlot('Nová hra');
            loadSlotData(newSlotId);
          }}
          onCreateFirebaseRoom={() => {
            // Vytvořit nový slot pro Firebase místnost
            setShowFirebaseJoinDialog(true);
            setFirebaseJoinMode('create');
          }}
          onJoinFirebaseRoom={() => {
            setShowFirebaseJoinDialog(true);
            setFirebaseJoinMode('join');
          }}
          onDeleteSlot={deleteSlot}
          lastActiveSlotId={localStorage.getItem('mausritter-active-slot-id')}
        />
      </div>
    );
  }

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

      {/* Sync Direction Choice Dialog */}
      {showSyncDirectionChoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🔄</span> Co chceš udělat?
            </h3>
            <div className="space-y-3 mb-6">
              {showSyncDirectionChoice.hasLocalData && (
                <div className="flex items-center gap-2 bg-stone-700 p-3 rounded">
                  <span className="text-amber-400">💾</span>
                  <span className="text-stone-300">Máš lokální data v prohlížeči</span>
                </div>
              )}
              {showSyncDirectionChoice.cloudFiles && showSyncDirectionChoice.cloudFiles.length > 0 && (
                <div className="bg-stone-700 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400">☁️</span>
                    <span className="text-stone-300">Soubory na Drive:</span>
                  </div>
                  <div className="ml-6 space-y-1 max-h-32 overflow-y-auto">
                    {showSyncDirectionChoice.cloudFiles.map((file, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className={file.name === 'mausritter-save.json' ? 'text-amber-400 font-medium' : 'text-stone-400'}>
                          {file.name}
                        </span>
                        <span className="text-stone-500">
                          {new Date(file.modifiedTime).toLocaleString('cs-CZ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showSyncDirectionChoice.cloudFiles && showSyncDirectionChoice.cloudFiles.length === 0 && (
                <div className="flex items-center gap-2 bg-stone-700 p-3 rounded">
                  <span className="text-stone-500">☁️</span>
                  <span className="text-stone-400">Složka na Drive je prázdná</span>
                </div>
              )}
              {showSyncDirectionChoice.hasLocalData && (
                <div className="bg-stone-700/50 p-3 rounded">
                  <label className="text-stone-400 text-sm block mb-1">Uloží se jako:</label>
                  <input
                    type="text"
                    value={syncSaveFileName}
                    onChange={(e) => setSyncSaveFileName(e.target.value.endsWith('.json') ? e.target.value : e.target.value + '.json')}
                    className="w-full bg-stone-700 text-amber-400 font-mono px-3 py-2 rounded border border-stone-600 focus:border-amber-500 focus:outline-none"
                  />
                  {showSyncDirectionChoice.cloudFiles?.some(f => f.name === syncSaveFileName) && (
                    <span className="text-red-400 text-sm mt-1 block">⚠️ Soubor s tímto názvem již existuje</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {showSyncDirectionChoice.hasLocalData && (
                <button
                  onClick={handleSyncUpload}
                  className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>💾</span> Uložit na Drive
                </button>
              )}
              {showSyncDirectionChoice.hasCloudFile && (
                <button
                  onClick={handleSyncDownload}
                  className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>📂</span> Načíst z Drive
                </button>
              )}
              <button
                onClick={handleSyncCancel}
                className="w-full px-4 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
              >
                Zrušit připojení
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Confirm Overwrite Dialog */}
      {showSyncConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm mx-4 shadow-2xl border border-red-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
              <span>⚠️</span> Přepsat soubor?
            </h3>
            <div className="space-y-3 mb-6">
              <p className="text-stone-300">
                Soubor <span className="text-amber-400 font-mono">{showSyncConfirm.existingFileName}</span> už existuje.
              </p>
              <div className="bg-stone-700 p-3 rounded text-sm">
                <span className="text-stone-400">Naposledy upraven: </span>
                <span className="text-stone-300">
                  {new Date(showSyncConfirm.existingModifiedTime).toLocaleString('cs-CZ')}
                </span>
              </div>
              <p className="text-red-400 text-sm">
                Tato akce je nevratná!
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSyncConfirmOverwrite}
                className="w-full px-4 py-3 bg-red-700 hover:bg-red-600 rounded font-medium transition-colors"
              >
                Ano, přepsat
              </button>
              <button
                onClick={handleSyncConfirmCancel}
                className="w-full px-4 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm transition-colors"
              >
                Zpět
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

      {/* Multiplayer Toast */}
      {multiplayerToast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-[200] animate-pulse ${
          multiplayerToast.type === 'success' ? 'bg-green-600 text-green-100' :
          multiplayerToast.type === 'error' ? 'bg-red-600 text-red-100' :
          'bg-purple-600 text-purple-100'
        }`}>
          {multiplayerToast.message}
        </div>
      )}

      {/* Storage Warning Toast */}
      {storageWarning && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-[200] max-w-sm">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-medium">{storageWarning}</p>
              <p className="text-sm mt-1 opacity-80">Exportujte data nebo smažte staré sloty.</p>
            </div>
            <button
              onClick={() => setStorageWarning(null)}
              className="text-white/80 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Create Room Dialog */}
      {showCreateRoomDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl border border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🎮</span> Vytvořit místnost
            </h3>
            <p className="text-stone-300 mb-4 text-sm">
              Vytvoř multiplayer místnost a pozvi kamaráda.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Název místnosti</label>
              <input
                type="text"
                id="create-room-title"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none"
                placeholder="např. Sobotní sešlost"
              />
              <p className="text-stone-400 text-xs mt-1">Pro lepší zapamatování</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvoje jméno</label>
              <input
                type="text"
                id="create-room-name"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none"
                placeholder="Zadej své jméno..."
                defaultValue={activeParty?.name || 'GM'}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvůj PIN (4 číslice)</label>
              <input
                type="text"
                id="create-room-pin"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none tracking-widest text-center text-lg font-mono"
                placeholder="1234"
                maxLength={4}
              />
              <p className="text-stone-400 text-xs mt-1">Pro přihlášení z jiného zařízení</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateRoomDialog(false)}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => {
                  const titleInput = document.getElementById('create-room-title');
                  const nameInput = document.getElementById('create-room-name');
                  const pinInput = document.getElementById('create-room-pin');
                  const title = titleInput?.value?.trim() || '';
                  const name = nameInput?.value?.trim() || 'GM';
                  const pin = pinInput?.value?.trim() || '';
                  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                    showMultiplayerToast('PIN musí být 4 číslice!', 'error');
                    return;
                  }
                  createRoom(name, pin, title);
                }}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded font-medium transition-colors"
              >
                Vytvořit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Dialog */}
      {showJoinRoomDialog && (() => {
        const savedCreds = JSON.parse(localStorage.getItem('mausritter-room-credentials') || 'null');
        return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl border border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🚪</span> Připojit se k místnosti
            </h3>
            <p className="text-stone-300 mb-4 text-sm">
              Zadej kód místnosti a svoje přihlašovací údaje.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Kód místnosti</label>
              <input
                type="text"
                id="join-room-code"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none uppercase tracking-widest text-center text-lg font-mono"
                placeholder="ABC123"
                maxLength={6}
                defaultValue={window._pendingRoomCode || savedCreds?.roomCode || ''}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvoje jméno</label>
              <input
                type="text"
                id="join-room-name"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none"
                placeholder="Zadej své jméno..."
                defaultValue={savedCreds?.playerName || ''}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tvůj PIN (4 číslice)</label>
              <input
                type="text"
                id="join-room-pin"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:border-purple-500 focus:outline-none tracking-widest text-center text-lg font-mono"
                placeholder="1234"
                maxLength={4}
                defaultValue={savedCreds?.playerPin || ''}
              />
              <p className="text-stone-400 text-xs mt-1">Zvol si nebo zadej stejný jako minule</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinRoomDialog(false);
                  window._pendingRoomCode = null;
                }}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => {
                  const codeInput = document.getElementById('join-room-code');
                  const nameInput = document.getElementById('join-room-name');
                  const pinInput = document.getElementById('join-room-pin');
                  const code = codeInput?.value?.trim() || '';
                  const name = nameInput?.value?.trim() || '';
                  const pin = pinInput?.value?.trim() || '';
                  if (code.length !== 6) {
                    showMultiplayerToast('Kód místnosti musí mít 6 znaků!', 'error');
                    return;
                  }
                  if (!name) {
                    showMultiplayerToast('Zadej svoje jméno!', 'error');
                    return;
                  }
                  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                    showMultiplayerToast('PIN musí být 4 číslice!', 'error');
                    return;
                  }
                  if (code.length === 6) {
                    joinRoom(code, name, pin);
                    window._pendingRoomCode = null;
                  }
                }}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded font-medium transition-colors"
              >
                Připojit
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Room Created Dialog - shows room code */}
      {showRoomCreatedDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl border border-green-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
              <span>✓</span> {roomName ? `"${roomName}" vytvořena!` : 'Místnost vytvořena!'}
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-stone-400">Kód pro připojení</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-stone-700 rounded text-2xl font-mono tracking-widest text-center">
                  {roomCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    showMultiplayerToast('Kód zkopírován!', 'success');
                  }}
                  className="px-3 py-3 bg-stone-600 hover:bg-stone-500 rounded transition-colors"
                  title="Kopírovat"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="bg-stone-700/50 rounded p-3 mb-4 text-sm text-stone-300">
              <strong>💡 Tip:</strong> Pošli tento kód hráčům. Každý si zvolí svoje jméno a PIN pro přihlášení.
            </div>
            <button
              onClick={() => setShowRoomCreatedDialog(false)}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 rounded font-medium transition-colors"
            >
              Rozumím, zavřít
            </button>
          </div>
        </div>
      )}

      {/* Players List Dialog */}
      {showPlayersDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👥</span> {roomName ? roomName : 'Hráči v místnosti'}
              <span className="ml-auto text-sm font-normal text-purple-300" title={`Kód: ${roomCode}`}>
                🎮 {roomCode}
              </span>
            </h3>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {roomPlayers.map((player) => {
                const isMe = player.oderId === myUserId;
                return (
                <div
                  key={player.oderId}
                  className={`flex items-center gap-3 p-3 rounded ${
                    isMe
                      ? 'bg-green-900/40 border-2 border-green-500'
                      : player.isGM
                        ? 'bg-purple-900/40 border border-purple-500'
                        : 'bg-stone-700'
                  }`}
                >
                  <span className="text-2xl">
                    {player.isGM ? '👑' : '🐭'}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {player.name}
                      {isMe && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-600 rounded text-green-100">ty</span>
                      )}
                      {player.isGM && (
                        <span className="text-xs px-1.5 py-0.5 bg-purple-600 rounded text-purple-100">GM</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400">
                      PIN: ****
                    </div>
                  </div>
                  {/* Kick button - only for GM, not for self */}
                  {isGM && !player.isGM && (
                    <button
                      onClick={() => kickPlayer(player.oderId, player.name)}
                      className="px-2 py-1 bg-red-600/50 hover:bg-red-600 rounded text-xs transition-colors"
                      title="Vyhodit hráče"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
              })}
              {roomPlayers.length === 0 && (
                <div className="text-center text-stone-400 py-4">
                  Žádní hráči
                </div>
              )}
            </div>
            <div className="bg-stone-700/50 rounded p-3 mb-4 text-sm text-stone-300">
              <strong>💡</strong> Kód místnosti: <span className="font-mono text-purple-300">{roomCode}</span>
              <br />
              Hráči se připojí zadáním kódu + svého jména a PINu.
            </div>
            <button
              onClick={() => setShowPlayersDialog(false)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded font-medium transition-colors"
            >
              Zavřít
            </button>
          </div>
        </div>
      )}

      {/* Reconnect Choice Dialog - shown on page load if credentials exist */}
      {showReconnectChoiceDialog && savedRoomCredentials && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-amber-500">
            <h3 className="text-xl font-bold mb-4 text-amber-400">
              Vítej zpět!
            </h3>
            <p className="text-stone-300 mb-4">
              Byl jsi připojen k místnosti <strong className="text-purple-300">{savedRoomCredentials.roomName || savedRoomCredentials.roomCode}</strong>.
            </p>
            <p className="text-stone-300 mb-4">
              Chceš se znovu připojit nebo pokračovat v sólo hře?
            </p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setShowReconnectChoiceDialog(false);
                  localStorage.removeItem('mausritter-room-credentials');
                  setSavedRoomCredentials(null);
                }}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Pokračovat v sólo
              </button>
              <button
                onClick={() => {
                  setShowReconnectChoiceDialog(false);
                  const { roomCode, playerName, playerPin } = savedRoomCredentials;
                  setSavedRoomCredentials(null);
                  joinRoom(roomCode, playerName, playerPin, true);
                }}
                className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded font-medium transition-colors"
              >
                Připojit k místnosti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Warning Dialog - shown before joining/creating room */}
      {showDataWarningDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-amber-500">
            <h3 className="text-xl font-bold mb-4 text-amber-400">
              Pozor na tvá lokální data
            </h3>
            <p className="text-stone-300 mb-4">
              Máš rozpracovanou sólo hru s <strong className="text-green-400">{parties.length}</strong> družinami
              a <strong className="text-green-400">{journal.length}</strong> záznamy v deníku.
            </p>
            <p className="text-stone-300 mb-4">
              Po připojení k místnosti se načtou sdílená data z Firebase.
              Tvoje lokální data zůstanou uložena a vrátí se po odchodu z místnosti.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDataWarningDialog(false);
                  pendingRoomJoinRef.current = null;
                }}
                className="flex-1 px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => {
                  setShowDataWarningDialog(false);
                  const { code, playerName, playerPin, isCreate } = pendingRoomJoinRef.current;
                  pendingRoomJoinRef.current = null;
                  if (isCreate) {
                    createRoom(playerName, playerPin, code, true);
                  } else {
                    joinRoom(code, playerName, playerPin, true);
                  }
                }}
                className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded font-medium transition-colors"
              >
                Rozumím, připojit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Game Dialog - with slot selection */}
      {showNewGameDialog && (
        <div data-testid="new-game-dialog" className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-stone-800 text-stone-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-stone-600">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🆕</span> Nová hra
            </h3>

            {/* Název slotu */}
            <div className="mb-4">
              <label className="block text-stone-300 text-sm mb-2">Název hry:</label>
              <input
                data-testid="new-slot-name-input"
                type="text"
                value={newSlotName}
                onChange={(e) => setNewSlotName(e.target.value)}
                placeholder="Moje dobrodružství"
                className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            {/* Aktivní slot info */}
            {activeSlotId && (() => {
              const currentSlot = slotIndex.find(s => s.id === activeSlotId);
              return currentSlot ? (
                <div className="mb-4 p-3 bg-stone-700/50 rounded border border-stone-600">
                  <p className="text-sm text-stone-400">Aktuální slot:</p>
                  <p className="text-stone-200 font-medium">{currentSlot.name}</p>
                </div>
              ) : null;
            })()}

            {/* Tlačítka */}
            <div className="space-y-2">
              <button
                data-testid="create-new-slot-button"
                onClick={() => startNewGame('new')}
                className="w-full px-4 py-3 bg-green-700 hover:bg-green-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>➕</span> Vytvořit nový slot
              </button>

              {activeSlotId && (
                <button
                  data-testid="overwrite-slot-button"
                  onClick={() => startNewGame('overwrite')}
                  className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-600 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔄</span> Přepsat aktuální slot
                </button>
              )}

              <button
                data-testid="cancel-new-game-button"
                onClick={() => {
                  setShowNewGameDialog(false);
                  setNewSlotName('');
                }}
                className="w-full px-4 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium transition-colors"
              >
                Zrušit
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
              {/* Slot button */}
              {activeSlotId && (() => {
                const currentSlot = slotIndex.find(s => s.id === activeSlotId);
                return (
                  <button
                    onClick={() => setShowSlotSelection(true)}
                    className="hidden md:flex items-center gap-1 px-2 py-1 bg-amber-700/50 hover:bg-amber-600/70 rounded text-xs transition-colors ml-2"
                    title="Zpět na výběr slotů"
                  >
                    <span>📁</span>
                    <span className="max-w-24 truncate">{currentSlot?.name || 'Slot'}</span>
                    {currentSlot?.type === 'firebase' && <span>🔥</span>}
                  </button>
                );
              })()}
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
                  <>
                    <button
                      type="button"
                      onClick={connectGoogleDrive}
                      className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium transition-colors cursor-pointer"
                      title="Připojit Google Drive"
                    >
                      ☁️ Připojit Drive
                    </button>
                    <button
                      onClick={() => setShowNewGameDialog(true)}
                      className="text-xs px-2 py-1.5 rounded bg-amber-600 text-amber-100 hover:bg-amber-500 cursor-pointer transition-colors"
                      title="Nová hra - vymazat vše"
                    >
                      🆕 New
                    </button>
                  </>
                )}
              </div>

              {/* Multiplayer */}
              <div className="flex items-center gap-1 border-l border-amber-700 pl-2 ml-1">
                {roomConnected ? (() => {
                  const myPlayer = roomPlayers.find(p => p.oderId === myUserId);
                  return (
                  <>
                    <span
                      className={`text-xs px-2 py-1 rounded ${isGM ? 'bg-purple-600 text-purple-100' : 'bg-green-600 text-green-100'}`}
                      title={myPlayer ? `Přihlášen jako: ${myPlayer.name} (${isGM ? 'GM' : 'hráč'})` : ''}
                    >
                      {isGM ? '👑' : '🐭'} {myPlayer?.name || (isGM ? 'GM' : 'Hráč')}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-stone-600 text-stone-300" title={`Kód: ${roomCode}`}>
                      🎮 {roomName || roomCode}
                    </span>
                    <button
                      onClick={() => setShowPlayersDialog(true)}
                      className="text-xs px-1.5 py-1 bg-purple-600/70 hover:bg-purple-500 rounded transition-colors"
                      title="Zobrazit hráče"
                    >
                      👥{roomPlayers.length}
                    </button>
                    <button
                      onClick={copyRoomLink}
                      className="px-1.5 py-1 bg-purple-600/70 hover:bg-purple-500 rounded text-xs transition-colors"
                      title="Kopírovat odkaz na místnost"
                    >
                      📋
                    </button>
                    <button
                      onClick={leaveRoom}
                      className="px-1.5 py-1 bg-purple-600/50 hover:bg-red-600 rounded text-xs transition-colors"
                      title="Opustit místnost"
                    >
                      ✕
                    </button>
                  </>
                );})() : (
                  <>
                    {/* Quick reconnect button if credentials saved */}
                    {(() => {
                      const saved = localStorage.getItem('mausritter-room-credentials');
                      if (saved) {
                        const creds = JSON.parse(saved);
                        return (
                          <button
                            onClick={() => joinRoom(creds.roomCode, creds.playerName, creds.playerPin)}
                            className="px-2 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs font-medium transition-colors"
                            title={`Rychlé připojení: ${creds.roomCode} jako ${creds.playerName}`}
                          >
                            ⚡ {creds.roomName || creds.roomCode}
                          </button>
                        );
                      }
                      return null;
                    })()}
                    <button
                      onClick={() => setShowCreateRoomDialog(true)}
                      className="px-2 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-xs font-medium transition-colors"
                      title="Vytvořit multiplayer místnost (jako GM)"
                    >
                      🎮 Místnost
                    </button>
                    <button
                      onClick={() => setShowJoinRoomDialog(true)}
                      className="px-2 py-1.5 bg-purple-600/70 hover:bg-purple-500 rounded text-xs font-medium transition-colors"
                      title="Připojit se k místnosti (jako hráč)"
                    >
                      🚪
                    </button>
                  </>
                )}
              </div>

              <button data-testid="export-button" onClick={handleExport} className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 rounded text-sm font-medium transition-colors" title="Exportovat save">📤</button>
              <label className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 rounded text-sm font-medium cursor-pointer transition-colors" title="Importovat save">
                📥
                <input data-testid="import-file-input" type="file" accept=".json" onChange={handleImport} className="hidden" />
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
              {/* Slot selection button */}
              {activeSlotId && (() => {
                const currentSlot = slotIndex.find(s => s.id === activeSlotId);
                return (
                  <button
                    onClick={() => { setShowSlotSelection(true); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-amber-700/50 hover:bg-amber-600/70 rounded text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span>📁</span>
                      <span className="truncate">{currentSlot?.name || 'Slot'}</span>
                      {currentSlot?.type === 'firebase' && <span>🔥</span>}
                    </span>
                    <span className="text-xs text-amber-300">Změnit slot</span>
                  </button>
                );
              })()}

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

              {/* Multiplayer */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-700">
                <span className="text-sm">🎮 Multiplayer</span>
                {roomConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-purple-600">
                      {roomCode} • 👥{roomPlayers.length}
                    </span>
                    <button
                      onClick={() => { copyRoomLink(); setMobileMenuOpen(false); }}
                      className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => { leaveRoom(); setMobileMenuOpen(false); }}
                      className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setShowCreateRoomDialog(true); setMobileMenuOpen(false); }}
                      className="px-2 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-xs font-medium"
                    >
                      Vytvořit
                    </button>
                    <button
                      onClick={() => { setShowJoinRoomDialog(true); setMobileMenuOpen(false); }}
                      className="px-2 py-1.5 bg-purple-600/70 hover:bg-purple-500 rounded text-xs font-medium"
                    >
                      Připojit
                    </button>
                  </div>
                )}
              </div>

              {/* New Game button - always visible */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-700">
                <span className="text-sm">🆕 Nová hra</span>
                <button
                  onClick={() => { setShowNewGameDialog(true); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium"
                >
                  Vymazat vše
                </button>
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
          <div className="flex gap-1 overflow-x-auto lg:overflow-visible py-2 scrollbar-hide">
            {panels.map(panel => (
              <button
                key={panel.id}
                data-testid={`panel-tab-${panel.id}`}
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

      {/* Character Tabs - Mobile only */}
      {activeParty && (
        <CharacterTabs
          party={activeParty}
          activeCharacterId={sidePanelCharacter?.id}
          onCharacterClick={(character) => setSidePanelCharacter(character)}
        />
      )}

      {/* Character Side Panel - Mobile slide-out */}
      <CharacterSidePanel
        isOpen={!!sidePanelCharacter}
        onClose={() => setSidePanelCharacter(null)}
        character={sidePanelCharacter}
        updateCharacter={(updates) => {
          if (sidePanelCharacter && activePartyId) {
            updateCharacterInParty(activePartyId, sidePanelCharacter.id, updates);
            // Update local state to reflect changes
            setSidePanelCharacter(prev => prev ? { ...prev, ...updates } : null);
          }
        }}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 overflow-hidden">
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

        {activePanel === 'events' && (
          <EventsPanel
            timedEvents={timedEvents}
            setTimedEvents={setTimedEvents}
            gameTime={activeParty?.gameTime}
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
            pendingMentionOpen={pendingMentionOpen}
            setPendingMentionOpen={setPendingMentionOpen}
            onDeleteNPC={(npcId) => {
              setWorldNPCs(worldNPCs.filter(n => n.id !== npcId));
              setSettlements(settlements.map(s => ({
                ...s,
                npcs: s.npcs?.filter(id => id !== npcId) || [],
                ruler: s.ruler === npcId ? null : s.ruler
              })));
              setJournal(journal.filter(e => e.npcId !== npcId && e.data?.id !== npcId));
            }}
            onDeleteSettlement={(settlementId) => {
              setSettlements(settlements.filter(s => s.id !== settlementId));
              setWorldNPCs(worldNPCs.map(n => n.settlementId === settlementId ? { ...n, settlementId: null } : n));
              setJournal(journal.filter(e => e.settlementId !== settlementId && e.data?.id !== settlementId));
            }}
          />
        )}
        
        {activePanel === 'factions' && (
          <FactionPanel
            factions={factions}
            setFactions={setFactions}
            onLogEntry={handleLogEntry}
          />
        )}

        {activePanel === 'lexicon' && (
          <LexikonPanel
            lexicon={lexicon}
            setLexicon={setLexicon}
            journal={journal}
          />
        )}

        {activePanel === 'smallworld' && (
          <SmallWorldPanel
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
            worldNPCs={worldNPCs}
            settlements={settlements}
            timedEvents={timedEvents}
            gameTime={activeParty?.gameTime}
            lexicon={lexicon}
            setLexicon={setLexicon}
            onMentionClick={(type, id) => {
              setPendingMentionOpen({ type, id });
              setActivePanel('world');
            }}
            onOpenEvents={() => setActivePanel('events')}
            onDeleteNPC={(npcId) => {
              // Smazat NPC
              setWorldNPCs(worldNPCs.filter(n => n.id !== npcId));
              // Smazat z osad
              setSettlements(settlements.map(s => ({
                ...s,
                npcs: s.npcs?.filter(id => id !== npcId) || [],
                ruler: s.ruler === npcId ? null : s.ruler
              })));
              // Smazat záznamy z deníku
              setJournal(journal.filter(e => e.npcId !== npcId && e.data?.id !== npcId));
            }}
            onDeleteSettlement={(settlementId) => {
              // Smazat osadu
              setSettlements(settlements.filter(s => s.id !== settlementId));
              // Odstranit settlementId z NPC
              setWorldNPCs(worldNPCs.map(n => n.settlementId === settlementId ? { ...n, settlementId: null } : n));
              // Smazat záznamy z deníku
              setJournal(journal.filter(e => e.settlementId !== settlementId && e.data?.id !== settlementId));
            }}
            onPromoteToNPC={(creatureData) => {
              // Vytvoř NPC z tvora
              const roll = () => Math.floor(Math.random() * 6) + 1;
              const newNPC = {
                id: generateId(),
                name: creatureData.name,
                role: creatureData.type?.name || '',
                birthsign: creatureData.personality || '',
                physicalDetail: creatureData.appearance || '',
                quirk: creatureData.quirk || '',
                goal: creatureData.goal || '',
                notes: creatureData.secret ? `Tajemství: ${creatureData.secret}` : '',
                hp: { current: roll() + roll(), max: roll() + roll() },
                str: { current: roll() + roll() + roll(), max: roll() + roll() + roll() },
                dex: { current: roll() + roll() + roll(), max: roll() + roll() + roll() },
                wil: { current: roll() + roll() + roll(), max: roll() + roll() + roll() },
                settlementId: null,
                createdAt: new Date().toISOString()
              };
              setWorldNPCs([...worldNPCs, newNPC]);
              // Přidej záznam do deníku
              setJournal([{
                id: generateId(),
                type: 'saved_npc',
                timestamp: formatTimestamp(),
                data: newNPC
              }, ...journal]);
              return newNPC;
            }}
            onUpdateNPC={(npcId, updates) => {
              setWorldNPCs(worldNPCs.map(n => n.id === npcId ? { ...n, ...updates } : n));
              // Vrátit aktualizované NPC
              return worldNPCs.find(n => n.id === npcId);
            }}
            myUserId={myUserId}
            roomPlayers={roomPlayers}
            roomConnected={roomConnected}
          />
        )}
      </main>

      {/* TimeBar - sledování času (jen pokud je aktivní družina) */}
      {activeParty && (
        <TimeBar
          gameTime={activeParty.gameTime}
          updateGameTime={updateGameTime}
          partyName={activeParty.name}
          timedEvents={timedEvents}
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


// Error Boundary pro zachycení chyb v renderování
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleClearData = () => {
    if (confirm('Opravdu smazat všechna lokální data? Toto nelze vrátit!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Něco se pokazilo</h1>
            <p className="text-gray-600 mb-4">
              Aplikace narazila na neočekávanou chybu. Zkus obnovit stránku nebo resetovat data.
            </p>
            <details className="mb-4 text-sm">
              <summary className="cursor-pointer text-gray-500">Technické detaily</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
              >
                🔄 Obnovit stránku
              </button>
              <button
                onClick={this.handleClearData}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🗑️ Smazat data
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <MausritterSoloCompanion />
  </ErrorBoundary>
);

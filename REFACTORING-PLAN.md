# Technický audit a strategie refaktoringu aplikace Mausritter Solo Companion

## 1. Manažerské shrnutí a strategický přehled

Předkládaná zpráva představuje hloubkovou technickou analýzu a komplexní plán transformace webové aplikace "Mausritter Solo Companion". Současný stav projektu, charakterizovaný monolitickou architekturou soustředěnou v jediném souboru o rozsahu přesahujícím 18 000 řádků kódu a křehkým systémem synchronizace dat založeným na kombinaci localStorage, Firebase Realtime Database a Google Drive API, dosáhl hranice udržitelnosti. Tento "organický" růst, typický pro projekty vznikající bez původního architektonického plánu, nyní vyústil v technický dluh, který znemožňuje efektivní implementaci nových funkcí, ohrožuje integritu uživatelských dat a degraduje vývojářskou zkušenost.

Analýza identifikuje kritické body selhání, zejména v oblasti správy stavu aplikace a perzistence dat. Současný model, kdy se při připojení k internetu lokální data slepě přepisují daty ze serveru, je v kontextu moderních distribuovaných systémů nepřijatelný a vede k frustrující ztrátě postupu hráčů. Závislost na in-browser Babel transpilaci navíc zbytečně zatěžuje koncová zařízení a prodlužuje dobu načítání aplikace.

Navrhovaná strategie opouští současný model a definuje přechod k architektuře Feature-Sliced Design (FSD), podpořené robustním Local-First přístupem s využitím CRDT (Conflict-free Replicated Data Types). Tento posun transformuje aplikaci z prostého "ukládání stavu" na sofistikovaný systém synchronizace událostí, který umožňuje bezproblémové střídání online a offline režimů bez rizika ztráty dat. Jádrem nové architektury bude knihovna Y.js, která zajistí matematicky korektní slučování změn od více uživatelů či zařízení.

Zpráva dále detailně rozpracovává implementaci konceptu "Scén" inspirovaného profesionálními nástroji jako Foundry VTT, což umožní povýšit aplikaci z pasivního deníku na aktivní herní motor. Součástí návrhu je i modularizace generátorů obsahu pomocí systému registrů a pluginů, což v budoucnu otevře cestu komunitním rozšířením. Přechod na moderní sestavovací nástroje (Vite) a typovaný jazyk (TypeScript) je pak nezbytnou podmínkou pro stabilizaci a další rozvoj projektu.

---

## 2. Hloubkový technický audit a analýza současného stavu

Současná podoba aplikace je učebnicovým příkladem anti-vzoru "Big Ball of Mud" (Velká koule bahna) a "God Object" (Božský objekt). Ačkoliv je aplikace funkčně bohatá a pro uživatele v mnoha ohledech přínosná, její vnitřní struktura je extrémně křehká.

### 2.1 Monolitická past: Soubor mausritter-solo-companion.jsx

Existence jediného souboru `mausritter-solo-companion.jsx` s více než 18 000 řádky kódu je primární brzdou jakéhokoliv dalšího vývoje. Tento soubor funguje jako masivní uzávěr (closure), který v jediném rozsahu platnosti (scope) zachycuje veškerý stav, logiku, UI i datové transformace.

- **Kognitivní přetížení a nemožnost izolace:** Vývojář musí při jakékoliv změně udržovat v paměti kontext celé aplikace. Změna v logice inventáře může mít nečekané vedlejší efekty v vykreslování deníku, protože sdílejí stejný lexikální scope a proměnné. Neexistuje zde zapouzdření; vše je viditelné odevšad.
- **Výkonnostní dopady in-browser kompilace:** Použití Babelu přímo v prohlížeči znamená, že klient musí při každém načtení stránky stáhnout, parsovat a transpilovat megabajty textu. To způsobuje signifikantní zpoždění "Time to Interactive" (TTI), zejména na mobilních zařízeních s nižším výkonem. Absence optimalizace (tree-shaking, minifikace) dále zhoršuje situaci.
- **Coupling stavu a renderování:** Deklarace více než 50 `useState` hooků na nejvyšší úrovni komponenty `MausritterSoloCompanion` způsobuje, že jakákoliv změna stavu – například napsání jednoho znaku do textového pole deníku – vyvolá proces "reconciliation" (porovnávání virtuálního DOMu) pro celý strom aplikace. To vede k citelnému zpomalení UI při psaní nebo interakci.

### 2.2 Krize synchronizace a integrity dat

Současný "tří-systémový" model ukládání (localStorage, Firebase, Google Drive) je zdrojem hlášených race conditions a ztráty dat.

- **Selhání modelu "Last Write Wins":** Logika `applyGameState(roomData.state)` při připojení k místnosti efektivně zahazuje lokální změny. Pokud uživatel hraje hodinu offline (ve vlaku) a poté se připojí k internetu, aplikace stáhne "novější" stav z Firebase (který je ale z pohledu herního děje starší) a přepíše jím lokální pokrok. V distribuovaných systémech nelze spoléhat na prosté časové razítka (wall-clock time) pro řešení konfliktů, protože hodiny na zařízeních nejsou synchronizované a síťová latence je nepředvídatelná.
- **Závody v ukládání (Race Conditions):** Rozdílné časy pro debounce (0ms localStorage, 500ms Firebase, 3000ms Google Drive) garantují, že datová úložiště nejsou nikdy v konzistentním stavu. Pokud uživatel zavře záložku prohlížeče 1,5 sekundy po změně, data jsou v localStorage a možná ve Firebase, ale chybí na Google Drive. Při příštím načtení může "chytrá" logika obnovení načíst starší zálohu z Drive, pokud ji vyhodnotí jako autoritativní.
- **Blokování hlavního vlákna:** Serializace celého herního stavu (`JSON.stringify(gameState)`) při každé změně (pro localStorage) je výpočetně náročná operace. U objektů této velikosti může trvat desítky milisekund, což blokuje hlavní vlákno prohlížeče a způsobuje "zasekávání" UI.

### 2.3 Pevně kódovaný obsah a generátory

Zabudování 34 generátorů a desítek tabulek (jako `ORACLE_TABLE`, `SCENE_COMPLICATIONS`) přímo do kódu porušuje princip Open/Closed (otevřeno pro rozšíření, uzavřeno pro modifikaci).

- **Míchání dat a logiky:** Oprava překlepu v tabulce kořisti ("Loot") vyžaduje zásah do zdrojového kódu a nové nasazení aplikace. To znemožňuje zapojení komunity do tvorby obsahu nebo oprav chyb v textech.
- **Absence metadat:** Generátory v současnosti vrací prosté řetězce nebo nestrukturované objekty. Systém "neví", že výsledek hodu na tabulce zbraní je předmět typu "Weapon" s poškozením "d6". To brání automatizaci – aplikace nemůže automaticky přidat vygenerovaný předmět do inventáře, protože nerozumí jeho sémantice.
- **Duplicita:** Jak bylo identifikováno, existují významné překryvy mezi generátory (např. Action+Theme vs Narrative Words). To tříští UX a mate uživatele, který neví, který nástroj v dané situaci použít.

---

## 3. Komparativní analýza referenčních architektur

Pro návrh nové architektury je klíčové analyzovat, jak podobné problémy řeší etablované open-source projekty a komerční VTT platformy.

### 3.1 Ironsworn Companion a Iron Journal

Tyto nástroje, určené pro hru Ironsworn (která sdílí se hrou Mausritter důraz na sólo hraní), představují zlatý standard v oblasti PWA deníkových aplikací.

- **Architektura:** Využívají striktní Local-First přístup. Primárním úložištěm je IndexedDB v prohlížeči. Cloudová synchronizace je volitelná a často řešená formou importu/exportu nebo prostého zálohování, nikoliv jako real-time multiplayer v pravém slova smyslu.
- **Oddělení dat (Datasworn):** Klíčovým prvkem úspěchu je projekt Datasworn. Jedná se o samostatný repozitář obsahující pouze JSON data pravidel (Moves, Assets, Oracles). Aplikace Iron Journal tato data pouze "konzumuje".
- **Poučení pro Mausritter:** Je nezbytné extrahovat všechny tabulky (Bestiář, Kouzla, Předměty) do samostatného balíčku nebo JSON schématu (např. `mausritter-data`). To umožní komunitě spravovat data nezávisle na vývoji aplikace a usnadní lokalizaci do češtiny bez zásahu do kódu.

### 3.2 Foundry VTT (Datové modelování)

Foundry VTT je komplexní platforma, která definuje standard pro organizaci herního obsahu.

- **Koncept Scény (Scene):** Ve Foundry není scéna jen obrázek na pozadí. Je to dokument, který funguje jako kontejner. Obsahuje reference na Aktéry (Tokens), Poznámky (Journal Notes), Osvětlení a Zdi. Klíčové je, že Scéna definuje kontext.
- **Template.json:** Systémová data jsou definována pomocí schématu (`template.json`). To zajišťuje, že každý Aktér má garantovanou strukturu dat (např. `hp.value`, `hp.max`, `str`, `dex`, `wil`). Tato striktní typizace (v našem případě pomocí TypeScriptu) je nezbytná pro prevenci chyb typu "undefined is not an object".
- **Poučení pro Mausritter:** Scéna v nové aplikaci musí být datová entita, která drží seznam aktivních účastníků (NPCs, PC), nastavení prostředí (např. "Les", "Noc") a stav mapy (Canvas). To umožní generátorům automaticky reagovat na kontext (např. generátor střetnutí nabídne "Lesní zvířata", pokud je scéna v lese).

### 3.3 React RPGs a Roguelikes

Projekty jako `react-rpg` ukazují, jak oddělit herní smyčku od renderovací smyčky.

- **Stavové automaty:** Herní logika (např. vyhodnocení útoku) by měla být psána jako čisté funkce, které transformují stav, a nikoliv jako součást React komponent. React by měl sloužit pouze jako "View" vrstva, která zobrazuje aktuální stav.
- **Poučení pro Mausritter:** Logika hodů kostkou (`rollDice`, `rollD6`) a vyhodnocení tabulek musí být vyčleněna do samostatných TypeScript modulů (např. `features/roll-dice`), které jsou testovatelné bez nutnosti spouštět React.

---

## 4. Návrh nové architektury: Feature-Sliced Design (FSD)

Pro vyřešení problému s 18 000 řádky kódu navrhuji přechod na architektonickou metodiku Feature-Sliced Design (FSD). FSD je moderní standard pro škálovatelné frontendové aplikace, který organizuje kód podle business domény (funkčnosti), nikoliv podle technologického typu (soubory, hooky, styly).

### 4.1 Struktura adresářů (FSD)

Nová struktura striktně definuje vrstvy a pravidla závislosti. Modul ve vyšší vrstvě může importovat pouze z vrstev pod sebou, nikoliv naopak nebo z vrstvy stejné.

```
src/
├── app/                    # Globální nastavení aplikace (vrstva 1 - nejvyšší)
│   ├── providers/          # Context providery (Theme, Auth, YjsSync)
│   ├── styles/             # Globální CSS (Tailwind) a fonty
│   └── store.ts            # Definice kořenového stavu (Zustand + Y.js)
│
├── processes/              # Komplexní procesy napříč stránkami (vrstva 2)
│   ├── session-sync/       # Logika připojování k místnosti, řešení konfliktů
│   └── data-migration/     # Logika pro upgrade verze uložených dat
│
├── pages/                  # Routování a kompozice stránek (vrstva 3)
│   ├── solo-session/       # Hlavní herní obrazovka pro jednoho hráče
│   ├── multiplayer-lobby/  # Výběr a vytvoření místnosti
│   └── scene-editor/       # Nástroj pro kreslení map a přípravu scén
│
├── widgets/                # Samostatné, komplexní UI bloky (vrstva 4)
│   ├── oracle-panel/       # Panel "Věštírna" (skládá se z features)
│   ├── character-sheet/    # Kompletní karta postavy s inventářem
│   ├── journal-log/        # Časová osa/chat s editorem
│   └── navigation-sidebar/ # Postranní panel pro přepínání kontextu
│
├── features/               # Uživatelské interakce/Business logika (vrstva 5)
│   ├── roll-dice/          # Logika hodu kostkou, 3D animace, výpočet
│   ├── manage-inventory/   # Drag & drop logika, slot management
│   ├── create-npc/         # Wizard pro generování NPC
│   └── draw-map/           # Logika kreslení na plátno (Tldraw integrace)
│
├── entities/               # Business datové modely a UI zobrazení (vrstva 6)
│   ├── actor/              # TypeScript typy (Mouse, NPC), komponenta HPBar
│   ├── scene/              # Datový model Scény, hooky pro práci se scénou
│   ├── journal-entry/      # Typy pro záznamy v deníku (Text, Hod, Tabulka)
│   └── generator/          # Interface pro generátory, registr pluginů
│
└── shared/                 # Znovupoužitelný kód bez doménové logiky (vrstva 7 - nejnižší)
    ├── ui/                 # Atomické komponenty (Button, Card, Input, Modal)
    ├── lib/                # Pomocné funkce (matematika, formátování data)
    └── api/                # Wrappery pro Firebase, Google Drive API
```

### 4.2 Výhody FSD pro tento projekt

- **Izolace a Modularita:** `OraclePanel` (Widget) funguje jako samostatná jednotka. Skládá data z `entities/generator` a využívá interakci `features/roll-dice`. Pokud se rozbije logika Věštírny, neovlivní to Kartu postavy.
- **Kognitivní škálování:** Vývojář, který chce upravit logiku inventáře, se pohybuje pouze v `features/manage-inventory` a `entities/item`. Nemusí číst kód soubojového systému nebo deníku. To radikálně snižuje mentální zátěž.
- **Refaktoring po částech:** FSD umožňuje "vykusovat" části monolitu postupně. Můžete například přepsat pouze "Lexikon" do nové struktury `widgets/lexicon-panel`, zatímco zbytek aplikace běží ve starém režimu.

---

## 5. Stavové řízení a synchronizace: CRDT Revoluce

Nejkritičtějším technickým dluhem je současný model synchronizace. Pro vyřešení problémů s přepisováním dat a ztrátou offline postupu je nezbytné přejít na model Conflict-free Replicated Data Types (CRDT).

### 5.1 Proč CRDT a knihovna Y.js?

V současné aplikaci je stav reprezentován jako JSON objekt. Pokud dva uživatelé (nebo jeden uživatel na dvou zařízeních) změní tento objekt, vzniká konflikt "kdo s koho", který obvykle končí přepsáním práce jednoho z nich.

CRDT (konkrétně knihovna Y.js) mění paradigma. Místo "hodnoty" se ukládají "operace" (delta updates).

- **Merge Logika:** Pokud uživatel A přidá do deníku záznam "Potkali jsme hada" a uživatel B přidá "Našli jsme sýr", Y.js zajistí, že výsledný stav bude obsahovat oba záznamy, nikoliv jen ten poslední.
- **Offline-First:** Y.js je ze své podstaty offline-ready. Změny provedené bez připojení se ukládají do lokální historie a při obnovení spojení se automaticky synchronizují a sloučí s ostatními klienty.
- **Decentralizace:** Neexistuje jeden "pravdivý" server, který rozhoduje. Všichni klienti jsou rovnocenní (peers) a konvergují ke stejnému stavu.

### 5.2 Implementace s Y.js a Providers

Architektura bude využívat tzv. Provider Factory vzor pro abstrahování rozdílu mezi SOLO a MULTIPLAYER režimem.

**Datová struktura (Y.Doc)**

Místo velkého JSONu bude stav rozdělen do sdílených typů Y.js:

```javascript
const yDoc = new Y.Doc();
const yParties = yDoc.getMap('parties');         // Mapa ID družiny -> Data
const yJournal = yDoc.getXmlFragment('journal'); // Pro Rich Text (Tiptap)
const yScenes = yDoc.getMap('scenes');           // Mapa scén
const yAwareness = provider.awareness;           // Pro kurzory a online status
```

**Abstraktní SyncManager**

Vytvoříme manažera, který spravuje životní cyklus providerů:

- **Režim SOLO:**
  - Aktivuje se pouze `y-indexeddb` provider.
  - Data se ukládají do IndexedDB prohlížeče. Je to asynchronní, rychlé a zvládne stovky MB dat (na rozdíl od 5MB limitu localStorage).
  - Google Drive se zde používá pouze pro snapshot backup (export celého Y.Doc do souboru), nikoliv pro real-time sync.

- **Režim MULTIPLAYER:**
  - Aktivuje se `y-indexeddb` (pro lokální cache a rychlý start).
  - Aktivuje se Síťový Provider. Vzhledem k tomu, že používáte Firebase, je ideální volbou `y-fire`.
  - `y-fire` synchronizuje binární aktualizace Y.js do Firestore nebo Realtime Database. Díky tomu, že Y.js posílá jen malé "delty" (změny), je to mnohem efektivnější než posílat celý JSON.
  - **Alternativa:** Pro snížení nákladů na Firebase a latence lze zvážit PartyKit (serverless WebSocket platforma optimalizovaná pro Y.js), která nabízí lepší real-time zážitek než polling databáze.

### 5.3 Propojení s Reactem (Zustand)

Y.js typy nejsou přímo reaktivní v Reactu. Použijeme knihovnu Zustand spolu s middlewarem (např. `@syncedstore/core` nebo vlastní hooky), která propojí Y.js data s React komponentami. Komponenty se tak budou překreslovat jen při relevantních změnách.

---

## 6. Motor Generátorů a Plugin Systém

Pro vyřešení chaosu s 34 generátory navrhuji systém Registru a Pluginů. To umožní generátory standardizovat, deduplikovat a v budoucnu snadno rozšiřovat.

### 6.1 Rozhraní Generátoru (Interface)

Každý generátor bude definován jako objekt splňující striktní TypeScript rozhraní:

```typescript
// entities/generator/types.ts

export type RollContext = {
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  locationType?: 'settlement' | 'wilderness' | 'dungeon';
  sceneTension?: number; // 1-6
};

export type RollResult = {
  text: string;           // "Najdeš starý meč."
  data?: any;             // { item: { id: "sword", damage: "d6" } }
  tags: string[];         // ["loot", "weapon"]
  visual?: string;        // URL ikony
};

export interface GeneratorPlugin {
  id: string;
  name: string;           // "Loot (Dungeon)"
  category: 'core' | 'world' | 'narrative';
  tags: string[];         // ['loot', 'dungeon']

  // Funkce roll přijímá kontext a vrací výsledek
  roll: (ctx: RollContext) => RollResult;
}
```

### 6.2 Registr (Registry Pattern)

Vytvoříme singleton třídu `GeneratorRegistry`, která bude spravovat dostupné generátory.

```typescript
// shared/lib/registry.ts
class GeneratorRegistry {
  private generators = new Map<string, GeneratorPlugin>();

  register(gen: GeneratorPlugin) {
    this.generators.set(gen.id, gen);
  }

  // Umožňuje najít generátory podle kontextu
  find(criteria: { tag?: string, category?: string }) {
    return Array.from(this.generators.values()).filter(g => ...);
  }
}
export const registry = new GeneratorRegistry();
```

### 6.3 Reorganizace obsahu

- **Deduplikace:** Generátory Action+Theme, Narrative Words, Simple Action a What is It? sloučíme do jedné rodiny generátorů "Narrative Prompts", které budou sdílet společné slovníky, ale budou mít různé "příchutě" (flavors) volitelné přes kontext.
- **Datové soubory:** Surová data tabulek (pole řetězců) přesuneme do JSON souborů v `src/data/tables/`. Generátory budou jen logikou, která si tato data načítá. To oddělí kód od obsahu.

---

## 7. Doporučený technologický stack

Na základě analýzy doporučuji následující moderní technologie, které nahradí stávající CDN řešení.

| Komponenta | Současný stav | Doporučená technologie | Zdůvodnění |
|---|---|---|---|
| Build Tool | Žádný (In-browser Babel) | **Vite** | Okamžitý start serveru, rychlý Hot Module Replacement (HMR), optimalizovaný production build. Nutnost pro profesionální vývoj. |
| Jazyk | JavaScript (JSX) | **TypeScript** | 18k řádků netypovaného JS je neudržitelných. TS poskytne "záchrannou síť" při refaktoringu a dokumentaci kódu typy. |
| State Management | useState + localStorage | **Zustand + Y.js** | Zustand pro lokální UI stav (např. "který tab je otevřený"), Y.js pro sdílený doménový stav (data hry). |
| Perzistence | localStorage | **IndexedDB (y-indexeddb)** | Asynchronní, velká kapacita, neblokuje UI. |
| Síťová vrstva | Firebase Realtime DB | **y-fire (nebo PartyKit)** | y-fire propojí Y.js s existujícím Firebase projektem. PartyKit je moderní alternativa pro WebSockety, pokud by Firebase nevyhovoval. |
| Rich Text Editor | Textarea | **Tiptap** | Headless editor založený na ProseMirror. Má nativní podporu pro Y.js (kolaborace, viditelné kurzory) a umožňuje @mentions. |
| Mapy/Kreslení | Žádné | **Tldraw** | "Whiteboard" knihovna pro React. Umožňuje kreslení map, tokenů, poznámek. Má first-class podporu pro Y.js multiplayer. |
| UI Framework | Tailwind (CDN) | **Tailwind (PostCSS) + Radix UI** | Tailwind zachovat, ale kompilovat. Radix UI pro přístupné headless komponenty (Modaly, Dropdowny, Taby), které si nastylujete Tailwindem. |

---

## 8. Migrační plán (Vzor "Strangler Fig")

Nepokoušejte se o kompletní přepis naráz ("Big Bang Rewrite"). Aplikace by přestala fungovat na měsíce. Použijte strategii Strangler Fig (Škrtič):

### Fáze 1: Infrastruktura a Stabilizace (Týden 1-2)

- **Inicializace:** Vytvořte nový Vite projekt s Reactem a TypeScriptem.
- **Zapouzdření:** Zkopírujte celý soubor `mausritter-solo-companion.jsx` do `src/legacy/LegacyApp.jsx`.
- **Shim:** Nainstalujte potřebné knihovny (firebase, react, atd.) tak, aby `LegacyApp` běžela uvnitř nové Vite aplikace.
- **Výsledek:** Máte funkční aplikaci v moderním build systému. Zmizela pomalá in-browser kompilace.

### Fáze 2: Extrakce Dat a Čisté Logiky (Týden 3-4)

- **Extrakce Konstant:** Přesuňte `ORACLE_TABLE`, `SCENE_COMPLICATIONS` atd. z JSX souboru do `src/data/tables/`.
- **Extrakce Helperů:** Přesuňte funkce jako `rollD6`, `randomFrom`, `generateId` do `src/shared/lib/dice.ts` a `utils.ts`. Přepište je do TypeScriptu.
- **Refaktoring Legacy:** Upravte `LegacyApp.jsx`, aby importovala tyto nové soubory.
- **Výsledek:** Monolit se zmenšil o tisíce řádků. Základní logika je testovatelná a typovaná.

### Fáze 3: Extrakce Widgetů (Týden 5-8)

- **Postupná extrakce:** Začněte nejméně provázanými panely (např. `OraclePanel`, `TimePanel`) a extrahujte je do `src/widgets/`.
- **Adapter Pattern:** Každý extrahovaný widget dostane adapter, který mu předá data z legacy stavu.
- **Výsledek:** Aplikace funguje jako hybrid - nové widgety vedle legacy kódu.

### Fáze 4: CRDT Migrace (Týden 9-12)

- **Y.js integrace:** Implementujte `SyncManager` a přepojte persistenci z localStorage na IndexedDB (y-indexeddb).
- **Datová migrace:** Vytvořte migrační skript, který převede existující localStorage data do Y.Doc formátu.
- **Firebase upgrade:** Nahraďte přímé Firebase volání za y-fire provider.
- **Výsledek:** Robustní offline-first synchronizace bez ztráty dat.

### Fáze 5: Nové Funkce (Týden 13+)

- **Scény:** Implementujte systém Scén s kontextovými generátory.
- **Tiptap editor:** Nahraďte textarea za rich text editor s Y.js kolaborací.
- **Tldraw mapy:** Přidejte interaktivní mapy s podporou tokenů.
- **Plugin systém:** Otevřete generátory pro komunitní rozšíření.

---

## 9. Rizika a mitigace

| Riziko | Pravděpodobnost | Dopad | Mitigace |
|---|---|---|---|
| Ztráta dat při migraci | Střední | Kritický | Automatický export zálohy před migrací, rollback mechanismus |
| Nekompatibilita Y.js s Firebase | Nízká | Vysoký | y-fire je testovaná knihovna; alternativně PartyKit |
| Příliš dlouhý refaktoring | Vysoká | Střední | Strangler Fig zajistí, že aplikace funguje v každém kroku |
| Výkonnostní regrese | Nízká | Střední | Benchmark testy před a po každé fázi |
| Přerušení kompatibility s existujícími uloženými hrami | Střední | Vysoký | Migrační skripty + zachování importu starých JSON záloh |

---

## 10. Metriky úspěchu

- **Time to Interactive (TTI):** Snížení z >5s na <2s (díky Vite buildu)
- **Velikost monolitu:** Z 18 000 řádků v jednom souboru na max 500 řádků/soubor
- **Test coverage:** Z 0% na >60% pro business logiku
- **Ztráta dat:** Z občasných incidentů na 0 (díky CRDT)
- **Bundle size:** Snížení o 40%+ díky tree-shaking a code splitting

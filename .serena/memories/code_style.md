# Mausritter Solo Companion - Styl kódu

## Jazyk
- **Kód**: TypeScript / TSX
- **UI texty a komentáře**: Čeština
- **Názvy konstant**: Angličtina (SCREAMING_SNAKE_CASE)

## Konvence pojmenování
- **Komponenty**: PascalCase (`OraclePanel`, `CharacterPanel`)
- **Funkce**: camelCase (`rollDice`, `generateId`)
- **Konstanty**: SCREAMING_SNAKE_CASE (`ORACLE_TABLE`, `BESTIARY`)
- **Zustand store**: camelCase (`useGameStore`, `useUiStore`)
- **Typy/Interfaces**: PascalCase (`Party`, `Character`, `GameState`)

## React patterns
- Funkční komponenty s hooks
- Zustand pro globální stav (ne useState/useContext)
- Destructuring props: `const Component = ({ prop1, prop2 }) => {}`
- Inline JSX pro jednoduché komponenty
- Komponenty definovány jako `const ComponentName = (...) => { ... }`

## Styling
- Tailwind CSS v4 utility classes
- Inline className strings (ne template literals)
- Barevná paleta: amber, stone, zelená pro úspěch, červená pro danger

## State management (Zustand)
- `useGameStore` — hlavní herní data
- `useUiStore` — UI stav
- `useSyncStore` — sync stav
- `useMultiplayerStore` — multiplayer
- Selektory: `useGameStore(s => s.parties)`
- Akce: `useGameStore.getState().addParty(party)`

## Datové struktury
- Objekty s id generovaným přes `generateId()`
- Arrays pro seznamy (parties, characters, journal)
- Nested objekty pro komplexní entity
- TypeScript typy v `src/types/index.ts`

## Formát konstant (příklad)
```typescript
const ORACLE_TABLE = {
  unlikely: { 2: 'NO, and...', 3: 'NO', ... },
  even: { 2: 'NO, and...', 3: 'NO', ... },
  likely: { 2: 'NO, and...', 3: 'NO', ... }
};
```

## UI komponenty (reusable) — `src/components/ui/common.tsx`
- `Button` - tlačítko s variantami
- `Input` - textový vstup
- `Select` - dropdown
- `SectionHeader` - nadpis sekce
- `Tooltip` - nápověda
- `ResultCard`, `ResultBadge` - zobrazení výsledků

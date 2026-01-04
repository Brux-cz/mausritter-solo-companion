# Mausritter Solo Companion - Styl kódu

## Jazyk
- **Kód**: Anglická syntax (React, JavaScript)
- **UI texty a komentáře**: Čeština
- **Názvy konstant**: Angličtina (SCREAMING_SNAKE_CASE)

## Konvence pojmenování
- **Komponenty**: PascalCase (`OraclePanel`, `CharacterPanel`)
- **Funkce**: camelCase (`rollDice`, `generateId`)
- **Konstanty**: SCREAMING_SNAKE_CASE (`ORACLE_TABLE`, `BESTIARY`)
- **State variables**: camelCase (`activePanel`, `gameTime`)

## React patterns
- Funkční komponenty s hooks
- Destructuring props: `const Component = ({ prop1, prop2 }) => {}`
- Inline JSX pro jednoduché komponenty
- Komponenty definovány jako `const ComponentName = (...) => { ... }`

## Styling
- Tailwind CSS utility classes
- Inline className strings (ne template literals)
- Barevná paleta: amber, stone, zelená pro úspěch, červená pro danger

## State management
- useState pro lokální stav
- useEffect pro side effects a localStorage sync
- useCallback pro memoizaci funkcí
- useRef pro DOM reference

## Datové struktury
- Objekty s id generovaným přes `generateId()`
- Arrays pro seznamy (parties, characters, journal)
- Nested objekty pro komplexní entity

## Formát konstant (příklad)
```javascript
const ORACLE_TABLE = {
  unlikely: { 2: 'NO, and...', 3: 'NO', ... },
  even: { 2: 'NO, and...', 3: 'NO', ... },
  likely: { 2: 'NO, and...', 3: 'NO', ... }
};
```

## UI komponenty (reusable)
- `Button` - tlačítko s variantami
- `Input` - textový vstup
- `Select` - dropdown
- `SectionHeader` - nadpis sekce
- `Tooltip` - nápověda
- `ResultCard`, `ResultBadge` - zobrazení výsledků

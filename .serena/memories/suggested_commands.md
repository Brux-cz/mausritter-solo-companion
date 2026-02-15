# Mausritter Solo Companion - Doporučené příkazy

## Vývoj

### Dev server (Vite, hot reload)
```bash
npm run dev              # http://localhost:8081
```

### Build pro produkci
```bash
npm run build            # Výstup: dist/
npm run preview          # Náhled produkčního buildu
```

### Testy
```bash
npm test                 # Unit testy (Vitest) — PŘED KAŽDÝM COMMITEM
npm run test:watch       # Watch mode pro vývoj
npm run test:e2e         # E2E testy (Playwright, potřebuje browser)
```

### Zdrojový kód
```
src/components/panels/   # Panely aplikace (.tsx)
src/components/ui/       # UI komponenty (.tsx)
src/stores/              # Zustand stores (.ts)
src/data/constants.ts    # Herní konstanty
src/types/index.ts       # TypeScript typy
src/utils/helpers.ts     # Utility funkce
```

## Git příkazy
```bash
git status
git add soubor1 soubor2
git commit -m "popis změny"
git log --oneline -10
```

## Poznámky
- Vite dev server běží na portu 8081
- `npm test` = Vitest (82 unit testů)
- `npm run test:e2e` = Playwright (13 E2E testů)
- Deploy automaticky přes GitHub Actions na GitHub Pages

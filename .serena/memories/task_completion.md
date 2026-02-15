# Mausritter Solo Companion - Po dokončení úkolu

## Checklist po úpravách kódu

### 1. Unit testy
```bash
npm test
```
Musí projít všech 82 testů (helpers, constants/migrace, gameStore).

### 2. Build
```bash
npm run build
```
Ověří TypeScript typy a vytvoří produkční build.

### 3. E2E testy (volitelné)
```bash
npm run test:e2e
```
Vyžaduje nainstalovaný Chromium (`npx playwright install chromium`).

## Důležité
- **Migrační systém** — při změně struktury dat: přidat migraci do `constants.ts`, zvýšit `CURRENT_VERSION` (aktuálně 6), přidat test do `constants.test.ts`
- **TypeScript typy** — při změně datového modelu aktualizovat `src/types/index.ts`
- **Zustand store** — nové akce/selektory přidat do `gameStore.ts`, otestovat v `gameStore.test.ts`
- **`_extra` pole** — zachovávat neznámá pole pro dopřednou kompatibilitu

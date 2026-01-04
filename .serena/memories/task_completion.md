# Mausritter Solo Companion - Po dokončení úkolu

## Checklist po úpravách kódu

### 1. Build
```bash
node mausritter-project/build-html.js
```

### 2. Testování
- Otevřít `mausritter-solo-companion.html` v prohlížeči
- Ověřit, že aplikace funguje bez chyb v konzoli
- Otestovat upravené funkce manuálně

### 3. Validace
- Zkontrolovat, že localStorage data zůstávají kompatibilní
- Pokud se mění datový model, aktualizovat migrační funkci a zvýšit SAVE_VERSION

## Důležité
- **Žádné automatické testy** - vše se testuje manuálně
- **Žádný linting** - dbát na konzistenci stylu ručně
- **Migrace dat** - při změně struktury uložených dat přidat migraci do `migrations` objektu

# Mausritter Solo Companion - Doporučené příkazy

## Vývoj

### Editace zdrojového kódu
Upravovat pouze soubor:
```
mausritter-project/mausritter-solo-companion.jsx
```

### Build do HTML
```bash
node mausritter-project/build-html.js
```
Výstup: `mausritter-solo-companion.html`

### Spuštění aplikace
```bash
xdg-open mausritter-solo-companion.html
```
nebo otevřít v prohlížeči přímo.

## Git příkazy
```bash
git status
git add .
git commit -m "popis změny"
git log --oneline -10
```

## Systémové příkazy (Linux)
```bash
ls -la                    # seznam souborů
cat soubor                # zobrazit obsah
grep -r "pattern" .       # hledat v souborech
find . -name "*.jsx"      # najít soubory
```

## Poznámky
- Není potřeba npm/yarn - vše z CDN
- Žádné testy (zatím)
- Žádný linting/formatting tool
- Babel transpiluje JSX přímo v prohlížeči

# GitHub Pages Setup

Tento dokument popisuje, jak zprovoznit automatický deploy na GitHub Pages.

## Jak to funguje

Po nastavení se aplikace automaticky nasadí na:
```
https://brux-cz.github.io/mausritter-solo-companion/
```

Každý push do `main` nebo `master` větve automaticky spustí deploy.

## Jednorázové nastavení

### Krok 1: Push workflow souborů

Soubory jsou již připraveny:
- `index.html` - redirect na hlavní aplikaci
- `.github/workflows/pages.yml` - GitHub Actions workflow

Pushni je na GitHub:
```bash
git add .
git commit -m "feat: Add GitHub Pages deployment"
git push origin main
```

### Krok 2: Povolit GitHub Pages

Spusť tento příkaz **jednou** z terminálu (vyžaduje `gh` CLI):

```bash
gh api -X POST "/repos/Brux-cz/mausritter-solo-companion/pages" -f build_type=workflow
```

Pokud nemáš `gh` CLI nainstalované:
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Pak se přihlas
gh auth login
```

### Alternativa: Ruční povolení v UI

Pokud nechceš používat `gh` CLI:

1. Jdi na https://github.com/Brux-cz/mausritter-solo-companion/settings/pages
2. V sekci "Build and deployment" vyber:
   - **Source:** GitHub Actions
3. Klikni "Save"

## Hotovo!

Po nastavení každý push automaticky nasadí novou verzi. Žádné další kroky nejsou potřeba.

## Troubleshooting

### Workflow selže s chybou permissions

Zkontroluj, že Pages jsou povolené (viz Krok 2).

### Stránka ukazuje 404

Počkej 1-2 minuty po deploy. GitHub Pages potřebuje čas na propagaci.

### Google Drive sync nefunguje

Pro produkční nasazení je potřeba přidat novou doménu do Google Cloud Console:

1. Jdi na https://console.cloud.google.com/
2. Vyber projekt `mausritter-solo-companion`
3. APIs & Services → Credentials
4. OAuth 2.0 Client ID → Edit
5. Přidej do "Authorized JavaScript origins":
   ```
   https://brux-cz.github.io
   ```
6. Přidej do "Authorized redirect URIs":
   ```
   https://brux-cz.github.io/mausritter-solo-companion/
   ```

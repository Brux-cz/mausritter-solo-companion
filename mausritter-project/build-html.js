const fs = require('fs');
const path = require('path');

const projectDir = path.dirname(__dirname);
const srcDir = path.join(__dirname, 'src');

// Pořadí souborů pro spojení
const fileOrder = [
  // 1. Všechny konstanty
  'constants/all.js',
  // 2. UI komponenty
  'components/ui/common.jsx',
  // 3. Hooks
  'hooks/useSlotSize.js',
  // 4. Panely
  'components/panels/HowToPlayPanel.jsx',
  'components/panels/OraclePanel.jsx',
  'components/panels/CombatPanel.jsx',
  'components/panels/CharacterPanel.jsx',
  'components/panels/WorldPanel.jsx',
  'components/panels/FactionPanel.jsx',
  'components/panels/PartyPanel.jsx',
  'components/panels/TimePanel.jsx',
  'components/panels/JournalPanel.jsx',
  // 5. Další UI komponenty
  'components/ui/TimeBar.jsx',
  'components/ui/FloatingDice.jsx',
  // 6. Hlavní aplikace
  'components/MausritterApp.jsx',
];

// Spojit soubory
let jsxContent = '';

// Nejdřív zkusit novou strukturu
let usedNewStructure = false;
for (const file of fileOrder) {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    jsxContent += `// === ${file} ===\n`;
    jsxContent += fs.readFileSync(filePath, 'utf8');
    jsxContent += '\n\n';
    usedNewStructure = true;
  }
}

// Fallback na starý monolitický soubor
if (!usedNewStructure) {
  const oldFile = path.join(__dirname, 'mausritter-solo-companion.jsx');
  if (fs.existsSync(oldFile)) {
    jsxContent = fs.readFileSync(oldFile, 'utf8');
    console.log('Using legacy monolithic file');
  }
}

const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Mausritter Solo Companion</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script>tailwind = { config: {} }<\/script>
  <script src="https://cdn.tailwindcss.com?plugins=forms"><\/script>
  <script>tailwind.config = { corePlugins: { preflight: true } }<\/script>
  <script src="https://apis.google.com/js/api.js"><\/script>
  <script src="https://accounts.google.com/gsi/client"><\/script>
  <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"><\/script>
  <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js"><\/script>
  <style>
    * { -webkit-tap-highlight-color: transparent; }
    body { overscroll-behavior: none; }
    .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    /* Google Picker centering fix */
    .picker-dialog { top: 50% !important; transform: translateY(-50%) !important; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>var exports = {}; var module = { exports: exports };</script>
  <script type="text/babel" data-presets="react">
${jsxContent}
  <\/script>
</body>
</html>`;

const outputPath = path.join(projectDir, 'mausritter-solo-companion.html');
fs.writeFileSync(outputPath, html);
console.log('HTML built successfully:', outputPath);

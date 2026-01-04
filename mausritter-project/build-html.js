const fs = require('fs');
const path = require('path');

const projectDir = path.dirname(__dirname);
const jsxContent = fs.readFileSync(path.join(__dirname, 'mausritter-solo-companion.jsx'), 'utf8');

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
  <style>
    * { -webkit-tap-highlight-color: transparent; }
    body { overscroll-behavior: none; }
    .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
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

const fs = require('fs');

// Patch index.css
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(
  /--color-amber-100: [^;]+;[\s\S]*?--color-amber-900: [^;]+;/m,
  `  --color-red-50: #FCF5F5;
  --color-red-100: #F7EAEB;
  --color-red-200: #EDCCCE;
  --color-red-300: #E0A6A9;
  --color-red-400: #D32027;
  --color-red-500: #C4171D;
  --color-red-600: #B11217;
  --color-red-700: #8C0E12;
  --color-red-800: #680A0E;
  --color-red-900: #490709;`
);
fs.writeFileSync('src/index.css', css);

// Patch TSX files
const files = fs.readdirSync('src/components').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/amber-/g, 'red-');
  fs.writeFileSync(file, code);
}
console.log("Patched colors in all files");

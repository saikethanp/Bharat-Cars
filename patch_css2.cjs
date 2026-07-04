const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  /@import url\([^)]+\);/,
  `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap');`
);

code = code.replace(
  /--font-sans: "Inter",/,
  `--font-sans: "Manrope",`
);

code = code.replace(
  /--color-red-500: #C4171D;/,
  `--color-red-500: #C8102E;`
);
code = code.replace(
  /--color-red-700: #8C0E12;/,
  `--color-red-700: #8B0000;`
);

fs.writeFileSync('src/index.css', code);
console.log("Patched index.css font and colors");

const fs = require('fs');
const files = fs.readdirSync('src/components').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Text colors
  code = code.replace(/text-gray-400/g, 'text-[#BDBDBD]');
  code = code.replace(/text-gray-500/g, 'text-[#8A8A8A]'); // slightly darker than BDBDBD for tertiary
  code = code.replace(/text-gray-300/g, 'text-[#E0E0E0]');

  // Borders
  code = code.replace(/border-white\/10/g, 'border-[#2A2A2A]');
  code = code.replace(/border-white\/\[0\.08\]/g, 'border-[#2A2A2A]');
  code = code.replace(/border-white\/5/g, 'border-[#2A2A2A]/50');
  
  // Backgrounds
  code = code.replace(/bg-glass-card/g, 'bg-[#111111]');
  code = code.replace(/border-glass-border/g, 'border-[#2A2A2A]');

  fs.writeFileSync(file, code);
}
console.log("Patched global text and border colors");

const fs = require('fs');
const files = fs.readdirSync('src/components').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Replace other backgrounds
  code = code.replace(/bg-\[#020202\]/g, 'bg-[#0D0D0D]');
  code = code.replace(/bg-\[#030303\]/g, 'bg-[#111111]');
  code = code.replace(/bg-\[#080808\]/g, 'bg-[#111111]');
  
  // Find vehicle cards that might not have a specific background
  // Often they are just `bg-white/[0.02]` or something. Let's leave them if they are glassmorphic, 
  // but if there are specific dark backgrounds, update them.
  
  fs.writeFileSync(file, code);
}
console.log("Patched backgrounds");

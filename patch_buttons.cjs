const fs = require('fs');
const files = fs.readdirSync('src/components').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Pattern 1
  code = code.replace(/bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black/g, 'bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(196,23,29,0.5)]');
  
  // Pattern 2
  code = code.replace(/bg-transparent hover:bg-red-500 disabled:bg-gray-900 border border-red-500\/30 hover:border-transparent text-red-500 hover:text-black/g, 'bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(196,23,29,0.5)] disabled:border-gray-800 disabled:text-gray-500 disabled:shadow-none');
  
  // Pattern 3
  code = code.replace(/bg-transparent hover:bg-red-500 border border-red-500\/30 hover:border-transparent text-red-500 hover:text-black/g, 'bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(196,23,29,0.5)]');

  // Pattern 4
  code = code.replace(/bg-transparent hover:bg-red-500 text-red-500 hover:text-black border border-red-500\/30 hover:border-transparent/g, 'bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(196,23,29,0.5)]');

  // Pattern 5 (from ContactView.tsx or similar)
  code = code.replace(/bg-\[#050505\] hover:bg-red-500 hover:text-black text-red-500 rounded text-\[16px\] font-sans font-semibold tracking-\[0\.15em\] uppercase border border-red-500\/30 hover:border-transparent/g, 'bg-black text-white rounded text-[16px] font-sans font-semibold tracking-[0.15em] uppercase border border-red-500 hover:border-red-400 hover:shadow-[0_0_15px_rgba(196,23,29,0.5)]');

  code = code.replace(/bg-\[#050505\] hover:bg-red-500 hover:text-black text-red-500 rounded text-\[14px\] font-sans font-semibold tracking-\[0\.15em\] uppercase border border-red-500\/30 hover:border-transparent/g, 'bg-black text-white rounded text-[14px] font-sans font-semibold tracking-[0.15em] uppercase border border-red-500 hover:border-red-400 hover:shadow-[0_0_15px_rgba(196,23,29,0.5)]');

  fs.writeFileSync(file, code);
}
console.log("Patched buttons");

const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

code = code.replace(
  /className="bg-glass-card border border-glass-border rounded-lg overflow-hidden hover:border-red-500\/30 transition-all duration-500 group flex flex-col justify-between"/g,
  `className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500 group flex flex-col justify-between"`
);

code = code.replace(
  /className="relative h-60 overflow-hidden cursor-pointer group\/img"/g,
  `className="relative h-64 overflow-hidden cursor-pointer group/img"`
);

code = code.replace(
  /className="p-6 space-y-4" id=\{\`inventory-info-box-\$\{vehicle\.id\}\`\}/g,
  `className="p-8 space-y-5" id={\`inventory-info-box-\$\{vehicle.id\}\`}`
);

code = code.replace(
  /className="text-\[28px\] font-serif font-semibold text-white group-hover:text-red-500 transition-colors uppercase cursor-pointer"/g,
  `className="text-[32px] font-serif font-bold text-white group-hover:text-red-500 transition-colors uppercase cursor-pointer leading-[1.2]"`
);

code = code.replace(
  /className="px-6 pb-6 pt-2" id=\{\`inventory-cta-box-\$\{vehicle\.id\}\`\}/g,
  `className="px-8 pb-8 pt-2" id={\`inventory-cta-box-\$\{vehicle.id\}\`}`
);

code = code.replace(
  /text-\[16px\] sm:text-\[16px\] font-sans font-bold text-red-500/g,
  `text-[20px] font-sans font-bold text-red-500`
);

code = code.replace(
  /className="flex items-center space-x-2 px-4 py-2\.5 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-\[0_0_15px_rgba\(196,23,29,0\.5\)\] rounded text-\[14px\] font-sans font-medium tracking-\[0\.15em\] uppercase transition-all duration-300 group\/btn"/g,
  `className="flex items-center space-x-2 px-6 py-3 bg-[#050505] border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_20px_rgba(200,16,46,0.5)] rounded-lg text-[14px] font-sans font-semibold tracking-[0.15em] uppercase transition-all duration-300 group/btn"`
);

fs.writeFileSync('src/components/InventoryView.tsx', code);
console.log("Patched Inventory cards");

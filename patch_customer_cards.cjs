const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

code = code.replace(
  /className="bg-glass-card border border-glass-border rounded-lg overflow-hidden hover:border-red-500\/30 transition-all duration-500 group flex-none w-\[300px\] sm:w-\[350px\] md:w-\[380px\] snap-start aspect-\[4\/3\]"/g,
  `className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500 group flex-none w-[300px] sm:w-[350px] md:w-[380px] snap-start aspect-[4/3]"`
);

// We need to also check GalleryView.tsx cards
fs.writeFileSync('src/components/HomeView.tsx', code);
console.log("Patched Customer cards");

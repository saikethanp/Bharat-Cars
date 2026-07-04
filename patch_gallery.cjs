const fs = require('fs');
let code = fs.readFileSync('src/components/GalleryView.tsx', 'utf-8');

code = code.replace(
  /className="group relative bg-glass-card border border-glass-border rounded-lg overflow-hidden aspect-\[4\/3\] cursor-pointer"/g,
  `className="group relative bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500"`
);

// Better spacing
code = code.replace(
  /className="absolute inset-0 bg-black\/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20"/g,
  `className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 z-20"`
);

fs.writeFileSync('src/components/GalleryView.tsx', code);
console.log("Patched Gallery cards");

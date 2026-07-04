const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

code = code.replace(
  /className="bg-glass-card border border-glass-border rounded-lg overflow-hidden hover:border-red-500\/30 transition-all duration-500 group flex-none w-\[300px\] sm:w-\[350px\] md:w-\[380px\] snap-start"/g,
  `className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500 group flex-none w-[300px] sm:w-[350px] md:w-[380px] snap-start"`
);

// Info wrapper in home view
code = code.replace(
  /className="p-5 sm:p-6"/g,
  `className="p-6 sm:p-8"`
);

// Title
code = code.replace(
  /className="text-\[28px\] font-serif font-semibold text-white group-hover:text-red-500 transition-colors uppercase"/g,
  `className="text-[32px] font-serif font-bold text-white group-hover:text-red-500 transition-colors uppercase leading-[1.2]"`
);

// Bottom section
code = code.replace(
  /className="flex items-center justify-between text-\[13px\] font-sans font-medium tracking-\[0\.15em\] text-gray-500 py-3 border-y border-white\/\[0\.08\]"/g,
  `className="flex items-center justify-between text-[13px] font-sans font-medium tracking-[0.15em] text-gray-500 py-4 border-y border-[#2A2A2A]"`
);

// Price
code = code.replace(
  /className="text-\[16px\] font-sans font-bold text-red-500"/g,
  `className="text-[20px] font-sans font-bold text-red-500"`
);

fs.writeFileSync('src/components/HomeView.tsx', code);
console.log("Patched Home cards");

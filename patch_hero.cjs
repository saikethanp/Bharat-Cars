const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

// Update Hero Title
code = code.replace(
  /Find Your Car <br \/>[\s\S]*?<\/span>/,
  `Find Your Perfect Car <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 font-serif">
    Today
  </span>`
);

// Update Spacing in hero-left-content
code = code.replace(
  /className="space-y-8 text-left flex flex-col items-start justify-center" id="hero-left-content"/,
  `className="space-y-10 text-left flex flex-col items-start justify-center" id="hero-left-content"`
);

// Update actions spacing
code = code.replace(
  /className="flex flex-row items-center gap-4 w-full sm:w-auto"/,
  `className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"`
);

// Update Buttons
// Inventory Button
code = code.replace(
  /className="group flex items-center space-x-3 px-6 py-3\.5 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-\[0_0_15px_rgba\(196,23,29,0\.5\)\] font-sans font-semibold text-\[16px\] rounded tracking-\[0\.15em\] uppercase transition-all duration-300 shadow-lg shadow-red-500\/5 cursor-pointer"/,
  `className="group flex items-center justify-center space-x-3 px-8 py-4 bg-[#050505] border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_20px_rgba(200,16,46,0.5)] font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 w-full sm:w-[240px] whitespace-nowrap cursor-pointer"`
);

// Contact Button
code = code.replace(
  /className="px-6 py-3\.5 bg-transparent hover:bg-white text-white hover:text-black border border-white hover:border-white font-sans font-semibold text-\[16px\] rounded tracking-\[0\.15em\] uppercase transition-all duration-300 backdrop-blur-md cursor-pointer"/,
  `className="group flex items-center justify-center space-x-3 px-8 py-4 bg-transparent hover:bg-white text-white hover:text-black border border-white hover:border-white font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 backdrop-blur-md w-full sm:w-[240px] whitespace-nowrap cursor-pointer"`
);

// Button icons (add ArrowRight if missing, or adjust)
// We already replaced the class, but we need to ensure the icons are there. Let's do a more robust replace for buttons.

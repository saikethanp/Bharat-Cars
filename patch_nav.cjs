const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

code = code.replace(/h-\[74px\]/, 'h-[64px]');
code = code.replace(/className="h-6 w-6 object-contain filter invert"/, 'className="h-7 w-7 object-contain filter invert transition-transform duration-300 group-hover:scale-110"');
code = code.replace(/text-red-500 bg-white\/5 border border-red-500\/20 shadow-lg shadow-red-500\/5/, 'text-white bg-red-600 border border-red-500 shadow-lg shadow-red-500/20');
code = code.replace(/text-red-500 bg-red-500\/10 border-l-4 border-red-500/, 'text-white bg-red-600 border-l-4 border-red-500');

// Fix icon active color in desktop/mobile maps (if active, make it white since background is red)
code = code.replace(/<Icon className=\{\`h-4 w-4 \$\{isActive \? 'text-red-500' : 'text-gray-400'\}\`\} \/>/g, `<Icon className={\`h-4 w-4 \${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}\`} />`);
code = code.replace(/<Icon className=\{\`h-5 w-5 \$\{isActive \? 'text-red-500' : 'text-gray-400'\}\`\} \/>/g, `<Icon className={\`h-5 w-5 \${isActive ? 'text-white' : 'text-gray-400'}\`} />`);

// Add group class to nav buttons for the group-hover:text-white logic above
code = code.replace(
  /className=\{\`flex items-center space-x-2 px-4 py-2 rounded-lg text-\[17px\] font-sans font-medium tracking-\[0\.02em\] transition-all duration-300 \$\{/g,
  `className={\`group flex items-center space-x-2 px-4 py-2 rounded-lg text-[17px] font-sans font-medium tracking-[0.02em] transition-all duration-300 \${`
);

fs.writeFileSync('src/components/Navbar.tsx', code);
console.log("Patched Navbar");

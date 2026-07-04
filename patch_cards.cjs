const fs = require('fs');
const files = ['src/components/HomeView.tsx', 'src/components/InventoryView.tsx', 'src/components/VehicleDetailsView.tsx', 'src/components/GalleryView.tsx'];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Replace card background
  code = code.replace(/bg-black border border-white\/\[0\.08\]/g, 'bg-[#111111] border border-white/[0.08]');
  code = code.replace(/bg-black border border-white\/10/g, 'bg-[#111111] border border-white/10');
  
  // App.tsx uses bg-black for the main wrapper. We want #050505 for main wrapper, but body is already #050505.
  
  fs.writeFileSync(file, code);
}

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/bg-black text-white/g, 'bg-transparent text-white');
fs.writeFileSync('src/App.tsx', app);

let home = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');
home = home.replace(/bg-black text-white selection:bg-red-500/g, 'bg-transparent text-white selection:bg-red-500');
fs.writeFileSync('src/components/HomeView.tsx', home);

console.log("Patched cards");

const fs = require('fs');
const files = fs.readdirSync('src/components').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Fix button glows to the new red
  code = code.replace(/rgba\(196,23,29,0\.5\)/g, 'rgba(200,16,46,0.5)');
  code = code.replace(/rgba\(212,175,55,0\.18\)/g, 'rgba(200,16,46,0.2)');
  code = code.replace(/rgba\(196,23,29,0\.18\)/g, 'rgba(200,16,46,0.2)');

  // Remove small shadows if they have custom shadow already
  code = code.replace(/shadow-lg shadow-red-500\/5 /g, '');
  code = code.replace(/shadow-lg hover:shadow-red-500\/10 /g, '');

  // VehicleDetails cards
  code = code.replace(
    /className="bg-glass-card border border-glass-border rounded p-6 space-y-6 shadow-xl shadow-red-500\/5 relative overflow-hidden"/g,
    `className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 shadow-2xl shadow-black/50 relative overflow-hidden"`
  );
  code = code.replace(
    /className="relative aspect-\[16\/9\] bg-glass-card border border-glass-border rounded overflow-hidden shadow-2xl shadow-red-500\/5 group\/mainimg"/g,
    `className="relative aspect-[16/9] bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group/mainimg"`
  );

  // Home view contact card or form card
  code = code.replace(
    /className="bg-glass-card border border-glass-border p-8 rounded relative overflow-hidden"/g,
    `className="bg-[#111111] border border-[#2A2A2A] p-10 rounded-2xl relative overflow-hidden shadow-2xl"`
  );

  // Admin view cards
  code = code.replace(
    /className="bg-\[#111111\] border border-white\/10 rounded-lg p-6"/g,
    `className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 shadow-xl"`
  );
  code = code.replace(
    /className="bg-\[#111111\] border border-white\/10 rounded-lg p-6 flex flex-col space-y-4"/g,
    `className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col space-y-4 shadow-xl"`
  );

  fs.writeFileSync(file, code);
}
console.log("Patched other cards and glows");

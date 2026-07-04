const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const logActivityStr = `  const logActivity = async (action: string, entity_type: string, entity_id: string, details?: any) => {
    if (!supabase || !session) return;
    try {
      await supabase.from('activity_logs').insert([{
        user_id: session.user.id,
        action,
        entity_type,
        entity_id,
        details
      }]);
    } catch (e) {}
  };\n`;

if (!code.includes('const logActivity')) {
  code = code.replace(
    /const handleAddVehicle = async/,
    logActivityStr + '\n  const handleAddVehicle = async'
  );
  
  // Add log to handleAddVehicle
  code = code.replace(
    /await supabase\.from\('vehicle_gallery'\)\.insert\(galleryInserts\);\n      \}/,
    `await supabase.from('vehicle_gallery').insert(galleryInserts);\n      }\n      await logActivity('create', 'vehicle', inserted.id, { make: inserted.make, model: inserted.model });`
  );
  
  // Add log to handleDeleteVehicle
  code = code.replace(
    /await supabase\.from\('vehicles'\)\.delete\(\)\.eq\('id', id\);\n    if \(!error\) \{/,
    `await supabase.from('vehicles').delete().eq('id', id);\n    if (!error) {\n      await logActivity('delete', 'vehicle', id);`
  );

  fs.writeFileSync('src/App.tsx', code);
  console.log('Patched App.tsx with Activity Log');
}

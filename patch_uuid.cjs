const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace date-based IDs with UUIDs for Supabase compatibility
code = code.replace(
  /const id = `vehicle-\$\{Date\.now\(\)\}`;/g,
  `const id = crypto.randomUUID();`
);

code = code.replace(
  /const id = `gallery-\$\{Date\.now\(\)\}`;/g,
  `const id = crypto.randomUUID();`
);

code = code.replace(
  /const id = `enquiry-\$\{Date\.now\(\)\}`;/g,
  `const id = crypto.randomUUID();`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx IDs to use UUID');

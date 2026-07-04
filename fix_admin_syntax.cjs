const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

code = code.replace(/  \/\/ Authentication validation\n  import \{ getSupabase \} from '\.\.\/lib\/supabase';\n/, '  // Authentication validation\n');

if (!code.includes("import { getSupabase } from '../lib/supabase';")) {
    code = "import { getSupabase } from '../lib/supabase';\n" + code;
}

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log('Fixed syntax AdminView.tsx');

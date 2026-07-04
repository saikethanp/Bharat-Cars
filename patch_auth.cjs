const fs = require('fs');

let content = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

// Replace handleLoginSubmit and add supabase auth
content = content.replace(
  /const handleLoginSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?setLoginError\(''\);\n  \};/,
  `import { getSupabase } from '../lib/supabase';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setLoginError('Database connection error');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    });
    if (error) {
      setLoginError(error.message);
    } else {
      setLoginError('');
      setIsAuthenticated(true);
    }
  };`
);

// We should also automatically set authenticated if session exists
content = content.replace(
  /export default function AdminView\(\{[^\}]+\}\) \{/,
  `export default function AdminView(props: any) {
    const { vehicles, enquiries, gallery, onAddVehicle, onDeleteVehicle, onAddGalleryItem, onDeleteGalleryItem, onDeleteEnquiry, session, userRole } = props;`
);

content = content.replace(
  /const \[isAuthenticated, setIsAuthenticated\] = useState\(false\);/,
  `const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  React.useEffect(() => {
    if (session && (userRole === 'admin' || userRole === 'manager')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session, userRole]);`
);

fs.writeFileSync('src/components/AdminView.tsx', content);
console.log('AdminView Auth Patched');

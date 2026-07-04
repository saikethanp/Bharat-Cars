const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import for useSiteSettings
if (!content.includes("import { useSiteSettings }")) {
  content = content.replace(
    /import { getSupabase } from '\.\/lib\/supabase';/,
    `import { getSupabase } from './lib/supabase';
import { useSiteSettings } from './lib/SiteSettingsContext';`
  );
}

// Add SEO effect inside App
content = content.replace(
  /const supabase = getSupabase\(\);/,
  `const supabase = getSupabase();
  const { settings } = useSiteSettings();

  useEffect(() => {
    document.title = settings.seoTitle || 'Bharat Cars | Luxury & Performance';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', settings.seoDescription || '');
    }
  }, [settings.seoTitle, settings.seoDescription]);`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx with SEO settings');

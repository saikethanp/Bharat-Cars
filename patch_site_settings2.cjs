const fs = require('fs');

let content = fs.readFileSync('src/lib/SiteSettingsContext.tsx', 'utf-8');

content = content.replace(
  /export interface SiteSettings \{/,
  `export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;`
);

content = content.replace(
  /export const defaultSettings: SiteSettings = \{/,
  `export const defaultSettings: SiteSettings = {
  heroTitle: 'Discover Automotive Excellence',
  heroSubtitle: 'The definitive collection of supercars and hypercars, curated for the uncompromising driver.',
  heroVideoUrl: 'https://player.vimeo.com/video/824804225?h=b1b22e1713&background=1&autoplay=1&loop=1&byline=0&title=0',`
);

content = content.replace(
  /const \[webRes, contactRes, logoRes\] = await Promise\.all\(\[/,
  `const [webRes, contactRes, logoRes, homeRes] = await Promise.all([`
);

content = content.replace(
  /supabase\.from\('site_assets'\)\.select\('url'\)\.eq\('key', 'logo'\)\.limit\(1\)/,
  `supabase.from('site_assets').select('url').eq('key', 'logo').limit(1),
        supabase.from('homepage_settings').select('*').limit(1)`
);

content = content.replace(
  /if \(logoRes\.data && logoRes\.data\.length > 0\) \{/,
  `if (homeRes.data && homeRes.data.length > 0) {
        const d = homeRes.data[0];
        newSettings.heroTitle = d.hero_title || newSettings.heroTitle;
        newSettings.heroSubtitle = d.hero_subtitle || newSettings.heroSubtitle;
        newSettings.heroVideoUrl = d.hero_video_url || newSettings.heroVideoUrl;
      }

      if (logoRes.data && logoRes.data.length > 0) {`
);

content = content.replace(
  /\/\/ logo update via site_assets/,
  `// homepage_settings
    const homeRes = await supabase.from('homepage_settings').select('id').limit(1);
    if (homeRes.data && homeRes.data.length > 0) {
      await supabase.from('homepage_settings').update({
        hero_title: newSettings.heroTitle,
        hero_subtitle: newSettings.heroSubtitle,
        hero_video_url: newSettings.heroVideoUrl
      }).eq('id', homeRes.data[0].id);
    } else {
      await supabase.from('homepage_settings').insert([{
        hero_title: newSettings.heroTitle,
        hero_subtitle: newSettings.heroSubtitle,
        hero_video_url: newSettings.heroVideoUrl
      }]);
    }

    // logo update via site_assets`
);

fs.writeFileSync('src/lib/SiteSettingsContext.tsx', content);
console.log('Patched SiteSettingsContext to include homepage settings');

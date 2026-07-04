const fs = require('fs');

const content = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabase } from './supabase';

export interface SiteSettings {
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHoursWeekdays: string;
  businessHoursWeekend: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  logoUrl: string;
  seoTitle: string;
  seoDescription: string;
}

export const defaultSettings: SiteSettings = {
  phone1: '+91 96420 96476',
  phone2: '+91 70134 97629',
  whatsapp: '+91 96420 96476',
  email: 'pathanimran6151@gmail.com',
  address: 'Opp. Indian Oil Petrol Pump, Basinikonda, Madanapalle, Andhra Pradesh – 517325, India',
  businessHoursWeekdays: 'Monday – Saturday 10:00 AM – 7:00 PM',
  businessHoursWeekend: 'Sunday By Appointment Only',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=...',
  googleMapsDirectionsUrl: 'https://maps.app.goo.gl/ZQuugxd7aMUS8Wre6',
  logoUrl: '/logo.svg',
  seoTitle: 'Bharat Cars | Luxury & Performance',
  seoDescription: 'India’s premier luxury car dealership.'
};

const SiteSettingsContext = createContext<{
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;

    const fetchAllSettings = async () => {
      let newSettings = { ...defaultSettings };
      
      const [webRes, contactRes, logoRes] = await Promise.all([
        supabase.from('website_settings').select('*').limit(1),
        supabase.from('contact_settings').select('*').limit(1),
        supabase.from('site_assets').select('url').eq('key', 'logo').limit(1)
      ]);

      if (webRes.data && webRes.data.length > 0) {
        const d = webRes.data[0];
        newSettings.seoTitle = d.seo_title || newSettings.seoTitle;
        newSettings.seoDescription = d.seo_description || newSettings.seoDescription;
        newSettings.googleMapsEmbedUrl = d.google_maps_url || newSettings.googleMapsEmbedUrl;
      }

      if (contactRes.data && contactRes.data.length > 0) {
        const d = contactRes.data[0];
        newSettings.address = d.address || newSettings.address;
        newSettings.phone1 = d.phone1 || newSettings.phone1;
        newSettings.phone2 = d.phone2 || newSettings.phone2;
        newSettings.whatsapp = d.whatsapp || newSettings.whatsapp;
        newSettings.email = d.email || newSettings.email;
        newSettings.businessHoursWeekdays = d.business_hours_weekdays || newSettings.businessHoursWeekdays;
        newSettings.businessHoursWeekend = d.business_hours_weekend || newSettings.businessHoursWeekend;
      }

      if (logoRes.data && logoRes.data.length > 0) {
        newSettings.logoUrl = logoRes.data[0].url;
      }

      setSettings(newSettings);
    };

    fetchAllSettings();
  }, [supabase]);

  const handleUpdateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    if (!supabase) return;

    // Check auth to see if we can save
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // We do simple updates or inserts if rows dont exist
    // website_settings
    const webRes = await supabase.from('website_settings').select('id').limit(1);
    if (webRes.data && webRes.data.length > 0) {
      await supabase.from('website_settings').update({
        seo_title: newSettings.seoTitle,
        seo_description: newSettings.seoDescription,
        google_maps_url: newSettings.googleMapsEmbedUrl
      }).eq('id', webRes.data[0].id);
    } else {
      await supabase.from('website_settings').insert([{
        seo_title: newSettings.seoTitle,
        seo_description: newSettings.seoDescription,
        google_maps_url: newSettings.googleMapsEmbedUrl
      }]);
    }

    // contact_settings
    const contactRes = await supabase.from('contact_settings').select('id').limit(1);
    if (contactRes.data && contactRes.data.length > 0) {
      await supabase.from('contact_settings').update({
        address: newSettings.address,
        phone1: newSettings.phone1,
        phone2: newSettings.phone2,
        whatsapp: newSettings.whatsapp,
        email: newSettings.email,
        business_hours_weekdays: newSettings.businessHoursWeekdays,
        business_hours_weekend: newSettings.businessHoursWeekend
      }).eq('id', contactRes.data[0].id);
    } else {
      await supabase.from('contact_settings').insert([{
        address: newSettings.address,
        phone1: newSettings.phone1,
        phone2: newSettings.phone2,
        whatsapp: newSettings.whatsapp,
        email: newSettings.email,
        business_hours_weekdays: newSettings.businessHoursWeekdays,
        business_hours_weekend: newSettings.businessHoursWeekend
      }]);
    }

    // logo update via site_assets
    const logoRes = await supabase.from('site_assets').select('id').eq('key', 'logo').limit(1);
    if (logoRes.data && logoRes.data.length > 0) {
      await supabase.from('site_assets').update({ url: newSettings.logoUrl }).eq('id', logoRes.data[0].id);
    } else {
      await supabase.from('site_assets').insert([{ key: 'logo', url: newSettings.logoUrl }]);
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings: handleUpdateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
`;

fs.writeFileSync('src/lib/SiteSettingsContext.tsx', content);
console.log('SiteSettingsContext patched for Supabase');

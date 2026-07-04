-- Create custom types for ENUMs
CREATE TYPE user_role_type AS ENUM ('admin', 'manager', 'editor', 'viewer');
CREATE TYPE vehicle_status AS ENUM ('available', 'sold', 'reserved');
CREATE TYPE enquiry_status AS ENUM ('new', 'pending', 'resolved');

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 2. user_roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role_type NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  mileage NUMERIC NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  description TEXT,
  status vehicle_status DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicles_status ON vehicles(status);

CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 4. vehicle_gallery
CREATE TABLE vehicle_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicle_gallery_vehicle_id ON vehicle_gallery(vehicle_id);

CREATE TRIGGER vehicle_gallery_updated_at BEFORE UPDATE ON vehicle_gallery FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 5. gallery
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. enquiries
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status enquiry_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 7. homepage_settings
CREATE TABLE homepage_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER homepage_settings_updated_at BEFORE UPDATE ON homepage_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 8. website_settings
CREATE TABLE website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seo_title TEXT,
  seo_description TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER website_settings_updated_at BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 9. contact_settings
CREATE TABLE contact_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT,
  phone1 TEXT,
  phone2 TEXT,
  whatsapp TEXT,
  email TEXT,
  business_hours_weekdays TEXT,
  business_hours_weekend TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER contact_settings_updated_at BEFORE UPDATE ON contact_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 10. footer_settings
CREATE TABLE footer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER footer_settings_updated_at BEFORE UPDATE ON footer_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 11. social_links
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 12. site_assets
CREATE TABLE site_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER site_assets_updated_at BEFORE UPDATE ON site_assets FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 13. activity_logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. featured_vehicles
CREATE TABLE featured_vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-----------------------------------------------------
-- RLS POLICIES
-----------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_vehicles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin or manager
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read all profiles if they are admin/manager, users can read their own profile, users can update their own profile
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin_or_manager());
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles: Only admins can view and manage user roles. (Simplified: admin/manager can view, admin can manage, users can view their own)
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all roles" ON user_roles FOR SELECT USING (is_admin_or_manager());

-- Vehicles: Anyone can read, only admin/manager can insert/update/delete
CREATE POLICY "Public read vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Admin write vehicles" ON vehicles FOR ALL USING (is_admin_or_manager());

-- Vehicle Gallery: Anyone can read, only admin/manager can insert/update/delete
CREATE POLICY "Public read vehicle_gallery" ON vehicle_gallery FOR SELECT USING (true);
CREATE POLICY "Admin write vehicle_gallery" ON vehicle_gallery FOR ALL USING (is_admin_or_manager());

-- Gallery: Anyone can read, only admin/manager can insert/update/delete
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admin write gallery" ON gallery FOR ALL USING (is_admin_or_manager());

-- Enquiries: Anyone can insert, only admin/manager can read/update/delete
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read update delete enquiries" ON enquiries FOR ALL USING (is_admin_or_manager());

-- Settings & Assets: Anyone can read, only admin/manager can write
CREATE POLICY "Public read homepage_settings" ON homepage_settings FOR SELECT USING (true);
CREATE POLICY "Admin write homepage_settings" ON homepage_settings FOR ALL USING (is_admin_or_manager());

CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Admin write website_settings" ON website_settings FOR ALL USING (is_admin_or_manager());

CREATE POLICY "Public read contact_settings" ON contact_settings FOR SELECT USING (true);
CREATE POLICY "Admin write contact_settings" ON contact_settings FOR ALL USING (is_admin_or_manager());

CREATE POLICY "Public read footer_settings" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Admin write footer_settings" ON footer_settings FOR ALL USING (is_admin_or_manager());

CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Admin write social_links" ON social_links FOR ALL USING (is_admin_or_manager());

CREATE POLICY "Public read site_assets" ON site_assets FOR SELECT USING (true);
CREATE POLICY "Admin write site_assets" ON site_assets FOR ALL USING (is_admin_or_manager());

CREATE POLICY "Public read featured_vehicles" ON featured_vehicles FOR SELECT USING (true);
CREATE POLICY "Admin write featured_vehicles" ON featured_vehicles FOR ALL USING (is_admin_or_manager());

-- Activity Logs: Only admin/manager can read/insert
CREATE POLICY "Admin all activity_logs" ON activity_logs FOR ALL USING (is_admin_or_manager());

-----------------------------------------------------
-- Initial Seed Data for Settings (Optional but helpful)
-----------------------------------------------------
INSERT INTO website_settings (seo_title, seo_description, google_maps_url) VALUES
('Bharat Cars | Luxury & Performance', 'India''s premier luxury car dealership.', 'https://www.google.com/maps/embed?pb=...');

INSERT INTO contact_settings (address, phone1, phone2, whatsapp, email, business_hours_weekdays, business_hours_weekend) VALUES
('Opp. Indian Oil Petrol Pump, Basinikonda', '+91 96420 96476', '+91 70134 97629', '+91 96420 96476', 'pathanimran6151@gmail.com', 'Monday - Saturday 10:00 AM - 7:00 PM', 'Sunday By Appointment Only');

INSERT INTO site_assets (key, url) VALUES
('logo', '/logo.svg');


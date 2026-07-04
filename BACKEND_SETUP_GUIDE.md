# Backend Setup Guide

This guide provides the complete, detailed steps to create a Supabase backend for your database and Cloudinary for image hosting (converting uploaded images to URLs).

## Part 1: Supabase Setup (Database & Authentication)

Supabase will act as your PostgreSQL database, storing your vehicle listings, gallery items, enquiries, and site settings.

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Click **New Project** and select your organization.
3. Give your project a name (e.g., `bharat-cars`), a secure database password, and select a region close to your users (e.g., Mumbai).
4. Wait for the database to provision (this takes about 1-2 minutes).

### 2. Get Your Supabase Credentials
1. In your Supabase dashboard, go to **Project Settings** (the gear icon on the left).
2. Go to the **API** section.
3. Copy the **Project URL** and the **anon `public` Key**.
4. In your code repository, create a `.env` file based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 3. Create the Database Tables
You can run these SQL commands in the Supabase **SQL Editor** to create all the necessary tables for the app.

**Enquiries Table:**
```sql
create table public.enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  vehicle_id text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on row level security
alter table public.enquiries enable row level security;

-- Allow anonymous inserts (so customers can submit forms)
create policy "Allow anonymous inserts" on public.enquiries for insert with check (true);
-- Only allow authenticated users (admin) to read/update
create policy "Allow authenticated reads" on public.enquiries for select using (auth.role() = 'authenticated');
```

**Site Settings Table:**
```sql
create table public.site_settings (
  id integer primary key,
  phone1 text,
  phone2 text,
  whatsapp text,
  email text,
  address text,
  "businessHoursWeekdays" text,
  "businessHoursWeekend" text,
  "mapUrl" text,
  "logoUrl" text,
  "seoTitle" text,
  "seoDescription" text
);

alter table public.site_settings enable row level security;

-- Allow anyone to read the settings
create policy "Allow public reads" on public.site_settings for select using (true);
-- Only authenticated users can update settings
create policy "Allow authenticated updates" on public.site_settings for update using (auth.role() = 'authenticated');
create policy "Allow authenticated inserts" on public.site_settings for insert with check (auth.role() = 'authenticated');
```

**Vehicles Table (Optional - Currently uses local storage):**
```sql
create table public.vehicles (
  id text primary key,
  make text not null,
  model text not null,
  year integer not null,
  price integer,
  mileage integer,
  fuel_type text,
  transmission text,
  condition text,
  description text,
  images text[], -- Array of URLs from Cloudinary
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.vehicles enable row level security;
create policy "Allow public reads" on public.vehicles for select using (true);
create policy "Allow authenticated all" on public.vehicles for all using (auth.role() = 'authenticated');
```

---

## Part 2: Cloudinary Setup (Image Hosting)

Since Supabase Storage can sometimes be complex to configure for public image hosting in free tiers, Cloudinary is the industry standard for uploading images and getting a URL back instantly.

### 1. Create a Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account.
2. Go to your **Dashboard**.
3. Note down your **Cloud Name** (e.g., `dxy123abc`).

### 2. Create an Upload Preset (Important!)
By default, Cloudinary requires a secure backend signature to upload images. We want to do "Unsigned Uploads" directly from the browser (Admin panel) to get a URL instantly.

1. Go to **Settings** (gear icon) > **Upload**.
2. Scroll down to **Upload presets**.
3. Click **Add upload preset**.
4. Set the **Upload preset name** to something recognizable (e.g., `bharat_cars_uploads`).
5. Change the **Signing Mode** to **Unsigned**.
6. Click **Save**.

### 3. Add Cloudinary Credentials to your App
Update your `.env` file:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=bharat_cars_uploads
```

### 4. Implementation Logic (How to use it in code)

When an admin uploads a file, instead of reading it as a `base64` string (which makes your local storage heavy and crashes the app eventually), you will POST it to Cloudinary and save the resulting URL.

Here is the exact code snippet you would use in `AdminView.tsx` to handle file uploads:

```typescript
const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials missing in .env');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  // Return the secure URL provided by Cloudinary
  return data.secure_url; 
};
```

**How to integrate this into the Add Vehicle form:**

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    
    // Show a loading state here if desired
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      
      // Add the URL to your vehicle form state
      setVehicleForm(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    }
  }
};
```

## Summary
By following these steps:
1. Enquiries and Settings are securely stored in a real PostgreSQL database (Supabase).
2. Car images are uploaded to a robust CDN (Cloudinary), returning clean `https://` URLs.
3. Your app's `localStorage` is freed up from heavy base64 strings, ensuring the application remains fast and doesn't crash from hitting storage limits.

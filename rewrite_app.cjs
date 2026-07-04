const fs = require('fs');

const appContent = `import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import InventoryView from './components/InventoryView';
import VehicleDetailsView from './components/VehicleDetailsView';
import GalleryView from './components/GalleryView';
import ContactView from './components/ContactView';
import AdminView from './components/AdminView';

import { Vehicle, GalleryItem, Enquiry } from './types';
import { getSupabase } from './lib/supabase';

export default function App() {
  const [currentView, setView] = useState<string>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Primary states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('viewer');

  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserRole(session.user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUserRole(session.user.id);
      else setUserRole('viewer');
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    if (data && !error) setUserRole(data.role);
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const fetchData = async () => {
    if (!supabase) return;

    // Fetch vehicles
    const { data: vData } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (vData) {
      setVehicles(vData.map(v => ({
        id: v.id,
        make: v.make,
        model: v.model,
        year: v.year,
        price: Number(v.price),
        mileage: Number(v.mileage),
        transmission: v.transmission,
        fuel_type: v.fuel_type,
        description: v.description || '',
        images: [], // Images would ideally be joined from vehicle_gallery
        created_at: v.created_at
      })));
    }

    // Fetch gallery
    const { data: gData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (gData) {
      setGallery(gData.map(g => ({
        id: g.id,
        image_url: g.image_url,
        description: g.description || '',
        created_at: g.created_at
      })));
    }

    // Fetch enquiries (RLS will handle access)
    if (userRole === 'admin' || userRole === 'manager') {
      const { data: eData } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (eData) setEnquiries(eData);
    }
  };

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedVehicleId]);

  // Enquiry adder callback
  const handleAddEnquiry = async (newEnq: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('enquiries').insert([{
      name: newEnq.name,
      email: newEnq.email,
      phone: newEnq.phone,
      message: newEnq.message,
      status: 'new'
    }]).select();
    
    if (data && !error && (userRole === 'admin' || userRole === 'manager')) {
      setEnquiries((prev) => [data[0] as Enquiry, ...prev]);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (!error) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Vehicle adder callback
  const handleAddVehicle = async (newCar: Omit<Vehicle, 'id' | 'created_at'>) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('vehicles').insert([{
      make: newCar.make,
      model: newCar.model,
      year: newCar.year,
      price: newCar.price,
      mileage: newCar.mileage,
      transmission: newCar.transmission,
      fuel_type: newCar.fuel_type,
      description: newCar.description,
      status: 'available'
    }]).select();

    if (data && !error) {
      const inserted = data[0];
      setVehicles((prev) => [{
        id: inserted.id,
        make: inserted.make,
        model: inserted.model,
        year: inserted.year,
        price: Number(inserted.price),
        mileage: Number(inserted.mileage),
        transmission: inserted.transmission,
        fuel_type: inserted.fuel_type,
        description: inserted.description,
        images: newCar.images, 
        created_at: inserted.created_at
      }, ...prev]);
      
      // Insert vehicle_gallery
      if (newCar.images && newCar.images.length > 0) {
        const galleryInserts = newCar.images.map((url, idx) => ({
          vehicle_id: inserted.id,
          image_url: url,
          is_primary: idx === 0,
          sort_order: idx
        }));
        await supabase.from('vehicle_gallery').insert(galleryInserts);
      }
    } else {
      console.error("Failed to add vehicle", error);
    }
  };

  // Vehicle deletion callback
  const handleDeleteVehicle = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } else {
      console.error("Failed to delete vehicle", error);
    }
  };

  // Gallery item adder callback
  const handleAddGalleryItem = async (newImage: Omit<GalleryItem, 'id' | 'created_at'>) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('gallery').insert([{
      image_url: newImage.image_url,
      description: newImage.description
    }]).select();

    if (data && !error) {
      setGallery((prev) => [data[0] as GalleryItem, ...prev]);
    } else {
      console.error("Failed to add gallery item", error);
    }
  };

  // Gallery item deletion callback
  const handleDeleteGalleryItem = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) {
      setGallery((prev) => prev.filter((g) => g.id !== id));
    } else {
      console.error("Failed to delete gallery item", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-white" id="app-root">
      {/* Luxury Navigation Header */}
      <Navbar currentView={currentView} setView={setView} />

      {/* Main Multi-Screen Content Frame */}
      <main className="flex-grow" id="app-main">
        {currentView === 'home' && (
          <HomeView 
            vehicles={vehicles} 
            setView={setView} 
            setSelectedVehicleId={setSelectedVehicleId} 
            onAddEnquiry={handleAddEnquiry}
          />
        )}
        {currentView === 'inventory' && (
          <InventoryView 
            vehicles={vehicles} 
            setView={setView} 
            setSelectedVehicleId={setSelectedVehicleId} 
          />
        )}
        {currentView === 'vehicle-details' && (
          <VehicleDetailsView 
            vehicleId={selectedVehicleId} 
            vehicles={vehicles} 
            setView={setView} 
            onAddEnquiry={handleAddEnquiry} 
          />
        )}
        {currentView === 'gallery' && (
          <GalleryView 
            galleryItems={gallery} 
          />
        )}
        {currentView === 'contact' && (
          <ContactView 
            onAddEnquiry={handleAddEnquiry} 
          />
        )}
        {currentView === 'admin' && (
          <AdminView 
            vehicles={vehicles} 
            enquiries={enquiries} 
            gallery={gallery}
            onAddVehicle={handleAddVehicle} 
            onDeleteVehicle={handleDeleteVehicle} 
            onAddGalleryItem={handleAddGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onDeleteEnquiry={handleDeleteEnquiry}
            session={session}
            userRole={userRole}
          />
        )}
      </main>

      {/* Luxury Footer */}
      <Footer setView={setView} />
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx rewritten for Supabase connection.');

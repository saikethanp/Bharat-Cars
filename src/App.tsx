import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import InventoryView from './components/InventoryView';
import VehicleDetailsView from './components/VehicleDetailsView';
import GalleryView from './components/GalleryView';
import ContactView from './components/ContactView';
import AdminView from './components/AdminView';
import AdminGuard from './components/AdminGuard';

import { Vehicle, GalleryItem, Enquiry } from './types';
import { getSupabase } from './lib/supabase';
import { useSiteSettings } from './lib/SiteSettingsContext';

export default function App() {
  const [currentView, setView] = useState<string>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Primary states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('viewer');
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);

  const supabase = getSupabase();
  const { settings } = useSiteSettings();

  useEffect(() => {
    document.title = settings.seoTitle || 'Bharat Cars | Luxury & Performance';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', settings.seoDescription || '');
    }
  }, [settings.seoTitle, settings.seoDescription]);

  useEffect(() => {
    if (!supabase) return;

    // Check active session
    console.log("Auth: Session loaded");
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setIsRoleLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth: Auth state changed");
      setSession(session);
      if (session?.user) {
        setIsRoleLoading(true);
        fetchUserRole(session.user.id);
      } else {
        setUserRole('viewer');
        setIsRoleLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    if (!supabase) return;
    console.log("Auth: Fetching role");
    
    let isFinished = false;
    const timeoutId = setTimeout(async () => {
      if (!isFinished) {
        isFinished = true;
        console.log("Auth: Role fetch failed (timeout)");
        setIsRoleLoading(false);
        setUserRole('viewer');
        await supabase.auth.signOut();
        alert("Role fetch timeout. Redirecting to login.");
      }
    }, 5000);

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeoutId);

      if (data && !error) {
        console.log("Auth: Role received");
        setUserRole(data.role);
      } else {
        console.log("Auth: Role fetch failed");
        setUserRole('viewer');
        await supabase.auth.signOut();
        alert("Role fetch failed. Redirecting to login.");
      }
    } catch (e) {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeoutId);
      console.log("Auth: Role fetch failed");
      setUserRole('viewer');
      await supabase.auth.signOut();
      alert("Role fetch failed. Redirecting to login.");
    } finally {
      setIsRoleLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const fetchData = async () => {
    if (!supabase) return;

    // Fetch vehicles
    const { data: vData, error: vError } = await supabase
      .from('vehicles')
      .select('*, vehicle_gallery(image_url, is_primary, sort_order)')
      .order('created_at', { ascending: false });
      
    console.log("Gallery fetch response:", vData, vError);

    if (vData) {
      setVehicles(vData.map(v => {
        const sortedGallery = (v.vehicle_gallery || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
        const images = sortedGallery.map((g: any) => g.image_url);

        return {
          id: v.id,
          make: v.make,
          model: v.model,
          year: v.year,
          price: Number(v.price),
          mileage: Number(v.mileage),
          transmission: v.transmission,
          fuel_type: v.fuel_type,
          description: v.description || '',
          images: images,
          created_at: v.created_at
        };
      }));
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Enquiry deletion callback
  const handleDeleteEnquiry = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (!error) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Vehicle adder callback
    const logActivity = async (action: string, entity_type: string, entity_id: string, details?: any) => {
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
  };

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
    
    console.log("Vehicle inserted:", data, error);

    if (data && !error) {
      const inserted = data[0];
      console.log("Vehicle ID:", inserted.id);
      
      // Insert images into vehicle_gallery
      if (newCar.images && newCar.images.length > 0) {
        const galleryInserts = newCar.images.map((url, index) => ({
          vehicle_id: inserted.id,
          image_url: url,
          is_primary: index === 0,
          sort_order: index
        }));
        const { data: galleryData, error: galleryError } = await supabase.from('vehicle_gallery').insert(galleryInserts).select();
        console.log("Gallery insert response:", galleryData, galleryError);
      }
      await logActivity('create', 'vehicle', inserted.id, { make: inserted.make, model: inserted.model });

      setVehicles((prev) => [{
        id: inserted.id,
        make: inserted.make,
        model: inserted.model,
        year: inserted.year,
        price: inserted.price,
        mileage: inserted.mileage,
        transmission: inserted.transmission,
        fuel_type: inserted.fuel_type,
        description: inserted.description,
        images: newCar.images || [],
        created_at: inserted.created_at
      }, ...prev]);
    } else {
      console.error("Failed to add vehicle", error);
    }
  };

  const handleUpdateVehicle = async (id: string, updatedCar: Omit<Vehicle, 'id' | 'created_at'>) => {
    if (!supabase) return;

    const { error: updateError } = await supabase.from('vehicles').update({
      make: updatedCar.make,
      model: updatedCar.model,
      year: updatedCar.year,
      price: updatedCar.price,
      mileage: updatedCar.mileage,
      transmission: updatedCar.transmission,
      fuel_type: updatedCar.fuel_type,
      description: updatedCar.description,
    }).eq('id', id);

    if (updateError) {
      console.error("Failed to update vehicle", updateError);
      return;
    }

    if (updatedCar.images && updatedCar.images.length > 0) {
      await supabase.from('vehicle_gallery').delete().eq('vehicle_id', id);
      const galleryInserts = updatedCar.images.map((url, index) => ({
        vehicle_id: id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index
      }));
      await supabase.from('vehicle_gallery').insert(galleryInserts);
    }

    await logActivity('update', 'vehicle', id, { make: updatedCar.make, model: updatedCar.model });

    setVehicles((prev) => prev.map(v => 
      v.id === id 
        ? { 
            ...v, 
            make: updatedCar.make,
            model: updatedCar.model,
            year: updatedCar.year,
            price: updatedCar.price,
            mileage: updatedCar.mileage,
            transmission: updatedCar.transmission,
            fuel_type: updatedCar.fuel_type,
            description: updatedCar.description,
            images: updatedCar.images || v.images
          }
        : v
    ));
  };

  // Vehicle deletion callback
  const handleDeleteVehicle = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) {
      await logActivity('delete', 'vehicle', id);
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

  const handleReorderGallery = async (reorderedItems: GalleryItem[]) => {
    setGallery(reorderedItems);
    if (!supabase) return;
    
    const now = Date.now();
    const updates = reorderedItems.map((item, index) => {
      const newDate = new Date(now - index * 1000).toISOString();
      return supabase.from('gallery').update({ created_at: newDate }).eq('id', item.id);
    });
    
    try {
      await Promise.all(updates);
    } catch (e) {
      console.error("Failed to reorder gallery items", e);
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
            galleryItems={gallery}
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
          <AdminGuard session={session} userRole={userRole} isRoleLoading={isRoleLoading}>
            <AdminView 
              vehicles={vehicles} 
              enquiries={enquiries} 
              gallery={gallery}
              onAddVehicle={handleAddVehicle} 
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle} 
              onAddGalleryItem={handleAddGalleryItem}
              onDeleteGalleryItem={handleDeleteGalleryItem}
              onReorderGalleryItems={handleReorderGallery}
              onDeleteEnquiry={handleDeleteEnquiry}
              session={session}
              userRole={userRole}
            />
          </AdminGuard>
        )}
      </main>

      {/* Luxury Footer */}
      <Footer setView={setView} />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (currentView !== 'home') setView('home');
          }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-[0_0_15px_rgba(200,16,46,0.5)] transition-all z-50 flex items-center justify-center cursor-pointer animate-[fade-in_0.3s_ease-out]"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        </button>
      )}
    </div>
  );
}

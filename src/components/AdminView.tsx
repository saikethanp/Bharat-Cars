import { getSupabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  KeyRound, 
  Car, 
  FileText, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  Image as ImageIcon, 
  Trash, 
  Check, 
  Sparkles, 
  AlertCircle, 
  ArrowUpRight, 
  Settings, 
  Search, 
  PlusCircle, 
  Eye, 
  Calendar, 
  Layers, 
  ExternalLink,
  Upload,
  Pencil,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Vehicle, Enquiry, GalleryItem } from '../types';

import { useSiteSettings } from '../lib/SiteSettingsContext';

interface AdminViewProps {
  vehicles: Vehicle[];
  enquiries: Enquiry[];
  gallery: GalleryItem[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'created_at'>) => void;
  onUpdateVehicle: (id: string, vehicle: Omit<Vehicle, 'id' | 'created_at'>) => void;
  onDeleteVehicle: (id: string) => void;
  onAddGalleryItem: (galleryItem: Omit<GalleryItem, 'id' | 'created_at'>) => void;
  onDeleteGalleryItem: (id: string) => void;
  onReorderGalleryItems: (items: GalleryItem[]) => void;
  onDeleteEnquiry: (id: string) => void;
  session?: any;
  userRole?: string;
}

type AdminTab = 'vehicles' | 'add-vehicle' | 'gallery' | 'add-gallery' | 'enquiries' | 'settings';

export default function AdminView({
  vehicles,
  enquiries,
  gallery,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onAddGalleryItem,
  onDeleteGalleryItem,
  onReorderGalleryItems,
  onDeleteEnquiry,
  session,
  userRole
}: AdminViewProps) {
  const { settings, updateSettings } = useSiteSettings();
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  const [activeTab, setActiveTab] = useState<AdminTab>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');

  // Form for adding a vehicle
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: 2026,
    price: 850000,
    mileage: 500,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    description: '',
    imageUrl1: '',
    imageUrl2: '',
  });

  // Separate states for Cover Image and Supporting Gallery Images
  const [coverImage, setCoverImage] = useState<string>('');
  const [supportingImages, setSupportingImages] = useState<string[]>([]);
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [supportingUrlInput, setSupportingUrlInput] = useState('');
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingSupporting, setIsDraggingSupporting] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  // Form for adding a gallery item
  const [newGalleryItem, setNewGalleryItem] = useState({
    image_url: '',
    description: '',
  });

  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleSuccess, setVehicleSuccess] = useState(false);
  const [gallerySuccess, setGallerySuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (files: FileList | null, onUpload: (url: string) => void) => {
    if (!files) return;
    Array.from(files).forEach(async (file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) {
        alert('Maximum file size is 10 MB');
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
        
        if (!import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
          throw new Error('Missing Cloudinary config');
        }

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        console.log('Cloudinary upload response:', data);
        onUpload(data.secure_url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
      } catch (err) {
        console.error('Cloudinary upload failed', err);
        alert('Image upload failed. Backend not connected yet.');
      }
    });
  };

  // Handle adding vehicle
  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.make || !newCar.model) return;

    // Use coverImage and supportingImages
    let images: string[] = [];
    if (coverImage.trim()) {
      images.push(coverImage.trim());
    }
    if (supportingImages.length > 0) {
      images = [...images, ...supportingImages];
    }
    
    if (images.length === 0) {
      // Fallback
      images.push('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop');
    }

    const vehicleData = {
      make: newCar.make,
      model: newCar.model,
      year: Number(newCar.year),
      price: Number(newCar.price),
      mileage: Number(newCar.mileage),
      transmission: newCar.transmission,
      fuel_type: newCar.fuel_type,
      description: newCar.description,
      images: images,
    };

    if (editingVehicleId) {
      onUpdateVehicle(editingVehicleId, vehicleData);
    } else {
      onAddVehicle(vehicleData);
    }

    setVehicleSuccess(true);
    setNewCar({
      make: '',
      model: '',
      year: 2026,
      price: 850000,
      mileage: 500,
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      description: '',
      imageUrl1: '',
      imageUrl2: '',
    });
    setCoverImage('');
    setSupportingImages([]);
    setCoverUrlInput('');
    setSupportingUrlInput('');
    setEditingVehicleId(null);

    setTimeout(() => {
      setVehicleSuccess(false);
      setActiveTab('vehicles');
    }, 1500);
  };

  // Handle adding gallery item
  const handleAddGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.image_url) return;

    onAddGalleryItem({
      image_url: newGalleryItem.image_url,
      description: newGalleryItem.description || 'Gallery Image',
    });

    setGallerySuccess(true);
    setNewGalleryItem({
      image_url: '',
      description: '',
    });

    setTimeout(() => {
      setGallerySuccess(false);
      setActiveTab('gallery');
    }, 1500);
  };

  const totalValuation = vehicles.reduce((sum, v) => sum + v.price, 0);

  // Filters
  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGallery = gallery.filter(item => 
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.image_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen py-10" id="admin-dashboard-portal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* System Dashboard HUD Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#2A2A2A] pb-6 gap-4" id="portal-hud-header">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] tracking-wider uppercase">SYSTEM STATUS • ONLINE</span>
            </div>
            <h1 className="text-[24px] sm:text-[52px] font-serif font-bold text-white uppercase tracking-wider">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] hidden sm:inline">Bharat Cars Admin</span>
            <button
              onClick={async () => {
                const supabase = getSupabase();
                if (supabase) {
                  await supabase.auth.signOut();
                }
              }}
              className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white rounded text-[13px] font-sans font-medium tracking-[0.15em] uppercase transition-all cursor-pointer"
              id="portal-disconnect-btn"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dynamic Metric HUD Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="portal-metric-cards">
          <div className="p-6 bg-[#111111] border border-white/[0.06] rounded-lg space-y-1">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">Total Inventory Value</span>
            <span className="text-[20px] font-sans font-bold text-red-500 block">
              {formatCurrency(totalValuation)}
            </span>
          </div>

          <div className="p-6 bg-[#111111] border border-white/[0.06] rounded-lg space-y-1">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">Total Vehicles</span>
            <span className="text-[20px] font-sans font-bold text-white block">
              {vehicles.length} Active
            </span>
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] block">Vehicles Listed</span>
          </div>

          <div className="p-6 bg-[#111111] border border-white/[0.06] rounded-lg space-y-1">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">Gallery Images</span>
            <span className="text-[20px] font-sans font-bold text-red-400 block">
              {gallery.length} Pieces
            </span>
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] block">Photos & Videos</span>
          </div>

          <div className="p-6 bg-[#111111] border border-white/[0.06] rounded-lg space-y-1">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">New Enquiries</span>
            <span className="text-[20px] font-sans font-bold text-emerald-400 block">
              {enquiries.length} Active
            </span>
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] block">Contact Requests</span>
          </div>
        </div>

        {/* Main Content Area: Tab Navigation & Tab Screen */}
        <div className="bg-[#050505] border border-[#2A2A2A] rounded-xl overflow-hidden" id="portal-workspace-grid">
          
          {/* Workspace Tabs Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#2A2A2A] bg-[#111111]/50 p-4 gap-4">
            
            {/* Nav Pill Group */}
            <div className="flex flex-wrap gap-1.5" id="workspace-pills-nav">
              {(['vehicles', 'add-vehicle', 'gallery', 'add-gallery', 'enquiries', 'settings'] as AdminTab[]).map((tab) => {
                const isActive = activeTab === tab;
                const labelMap: Record<AdminTab, string> = {
                  vehicles: `Vehicles (${vehicles.length})`,
                  'add-vehicle': 'Add New Vehicle',
                  gallery: `Gallery (${gallery.length})`,
                  'add-gallery': 'Upload Image',
                  enquiries: `Customer Enquiries (${enquiries.length})`,
                  settings: 'Website Settings'
                };
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-red-500 text-black font-bold shadow-md shadow-red-500/10' 
                        : 'text-[#BDBDBD] hover:text-white hover:bg-white/5'
                    }`}
                    id={`tab-btn-${tab}`}
                  >
                    {labelMap[tab]}
                  </button>
                );
              })}
            </div>

            {/* Quick Filter Box */}
            {(activeTab === 'vehicles' || activeTab === 'gallery') && (
              <div className="relative w-full sm:w-64" id="workspace-search-box">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A8A8A]" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-[#2A2A2A] rounded pl-9 pr-3 py-1.5 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
                  id="tab-search-input"
                />
              </div>
            )}
          </div>

          {/* Tab Screen Panel Container */}
          <div className="p-6 sm:p-8" id="workspace-content-canvas">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Vehicles Listing Screen */}
              {activeTab === 'vehicles' && (
                <motion.div
                  key="tab-vehicles"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-[28px] font-serif font-semibold text-white uppercase tracking-wider">Vehicle Management</h3>
                      <p className="text-[14px] font-sans font-normal text-[#BDBDBD] leading-[1.7] font-normal">Manage all vehicles displayed on your website. Add, edit, delete, or update vehicle information.</p>
                    </div>
                  </div>

                  {filteredVehicles.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-black/40">
                      <table className="w-full border-collapse text-left text-[14px] sm:text-[16px]">
                        <thead>
                          <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[#8A8A8A] font-sans text-[14px] uppercase tracking-[0.15em]">
                            <th className="py-4 px-5">Vehicle</th>
                            <th className="py-4 px-5">Details</th>
                            <th className="py-4 px-5">Transmission & Fuel</th>
                            <th className="py-4 px-5">Kilometers Driven</th>
                            <th className="py-4 px-5">Price</th>
                            <th className="py-4 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                          {filteredVehicles.map((car) => (
                            <tr key={car.id} className="hover:bg-white/[0.01] transition-all" id={`row-car-${car.id}`}>
                              {/* Thumbnail Name */}
                              <td className="py-4 px-5">
                                <div className="flex items-center space-x-4">
                                  <img 
                                    src={car.images[0]} 
                                    alt={car.model} 
                                    className="w-16 h-10 object-cover rounded border border-[#2A2A2A] shrink-0 bg-black"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <span className="font-serif font-medium text-white block uppercase text-[16px] tracking-wide leading-tight">{car.make}</span>
                                    <span className="text-[14px] font-sans font-normal text-[#BDBDBD] block tracking-wider uppercase font-sans mt-0.5">{car.model}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Year / Description */}
                              <td className="py-4 px-5">
                                <div className="space-y-1">
                                  <span className="px-2 py-0.5 rounded bg-white/5 border border-[#2A2A2A] text-[10px] text-[#E0E0E0] font-sans inline-block">Year: {car.year}</span>
                                  <p className="text-[14px] font-sans font-normal text-[#8A8A8A] truncate max-w-xs">{car.description}</p>
                                </div>
                              </td>

                              {/* Transmission / Fuel */}
                              <td className="py-4 px-5 font-sans text-[14px] font-sans font-normal text-[#E0E0E0]">
                                <div className="space-y-0.5">
                                  <span className="block">Transmission: {car.transmission}</span>
                                  <span className="text-[10px] text-red-500/80 uppercase">Fuel: {car.fuel_type}</span>
                                </div>
                              </td>

                              {/* Mileage */}
                              <td className="py-4 px-5 font-sans text-[14px] font-sans font-normal text-[#BDBDBD]">
                                {(car.mileage || 0).toLocaleString()} km
                              </td>

                              {/* Valuation Price */}
                              <td className="py-4 px-5 font-sans font-bold text-red-500 text-[16px]">
                                {formatCurrency(car.price || 0)}
                              </td>

                              {/* Quick Action Edit/Delete */}
                              <td className="py-4 px-5 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingVehicleId(car.id);
                                    setNewCar({
                                      make: car.make,
                                      model: car.model,
                                      year: car.year,
                                      price: car.price,
                                      mileage: car.mileage || 0,
                                      transmission: car.transmission,
                                      fuel_type: car.fuel_type,
                                      description: car.description || '',
                                      imageUrl1: '',
                                      imageUrl2: '',
                                    });
                                    if (car.images && car.images.length > 0) {
                                      setCoverImage(car.images[0]);
                                      setSupportingImages(car.images.slice(1));
                                    } else {
                                      setCoverImage('');
                                      setSupportingImages([]);
                                    }
                                    setActiveTab('add-vehicle');
                                  }}
                                  className="p-2 bg-blue-500/5 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/10 hover:border-transparent rounded transition-all cursor-pointer inline-flex"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteVehicle(car.id)}
                                  className="p-2 bg-rose-500/5 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/10 hover:border-transparent rounded transition-all cursor-pointer inline-flex"
                                  id={`delete-car-btn-${car.id}`}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-dashed border-[#2A2A2A] rounded-lg text-[#8A8A8A] space-y-2">
                      <Car className="h-8 w-8 mx-auto text-gray-600 animate-bounce" />
                      <p className="text-[13px] font-sans font-medium tracking-[0.15em]">No vehicles match your search.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 2: Add New Vehicle Form */}
              {activeTab === 'add-vehicle' && (
                <motion.div
                  key="tab-add-vehicle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-3xl mx-auto space-y-6"
                >
                  <div className="border-b border-[#2A2A2A] pb-4">
                    <h3 className="text-[28px] font-serif font-semibold text-white uppercase tracking-wider">{editingVehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                    <p className="text-[14px] font-sans font-normal text-[#BDBDBD] leading-[1.7] font-normal mt-0.5">Fill in the vehicle details below to {editingVehicleId ? 'update' : 'add'} a vehicle in your website inventory.</p>
                  </div>

                  {vehicleSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 border border-red-500/30 p-4 rounded text-center text-red-500 text-[13px] font-sans font-medium tracking-[0.15em] uppercase tracking-[0.15em]"
                      id="car-success-notification"
                    >
                      Vehicle {editingVehicleId ? 'updated' : 'added'} successfully.
                    </motion.div>
                  )}

                  <form onSubmit={handleAddVehicleSubmit} className="space-y-6" id="add-car-form">
                    
                    {/* Make & Model */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Brand</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Toyota"
                          value={newCar.make}
                          onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
                          id="car-form-make"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Vehicle Model</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Fortuner Legender"
                          value={newCar.model}
                          onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
                          id="car-form-model"
                        />
                      </div>
                    </div>

                    {/* Pricing, Year, Mileage */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={newCar.price}
                          onChange={(e) => setNewCar({ ...newCar, price: Number(e.target.value) })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white focus:outline-none focus:border-red-500/50 font-sans"
                          id="car-form-price"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Manufacturing Year</label>
                        <input
                          type="number"
                          required
                          value={newCar.year}
                          onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white focus:outline-none focus:border-red-500/50 font-sans"
                          id="car-form-year"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Kilometers Driven</label>
                        <input
                          type="number"
                          required
                          value={newCar.mileage}
                          onChange={(e) => setNewCar({ ...newCar, mileage: Number(e.target.value) })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white focus:outline-none focus:border-red-500/50 font-sans"
                          id="car-form-mileage"
                        />
                      </div>
                    </div>

                    {/* Transmission & Fuel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Transmission</label>
                        <select
                          value={newCar.transmission}
                          onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white focus:outline-none focus:border-red-500/50"
                          id="car-form-trans"
                        >
                          <option value="Automatic">Automatic (Dual-Clutch)</option>
                          <option value="Manual">Manual (Traditional)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Fuel Type</label>
                        <select
                          value={newCar.fuel_type}
                          onChange={(e) => setNewCar({ ...newCar, fuel_type: e.target.value })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white focus:outline-none focus:border-red-500/50"
                          id="car-form-fuel"
                        >
                          <option value="Petrol">Petrol / V12 Twin Turbo</option>
                          <option value="Hybrid">Hybrid Performance</option>
                          <option value="Electric">Electric Drive</option>
                          <option value="Diesel">Diesel Touring</option>
                        </select>
                      </div>
                    </div>

                    {/* Images Upload: Option 1 (Cover Image) and Option 2 (Supporting Images) */}
                    <div className="space-y-6">
                      <div className="border border-[#2A2A2A]/50 bg-white/[0.01] p-5 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase tracking-[0.15em] block font-bold">Cover Image</span>
                            <span className="text-[9px] text-[#8A8A8A] font-sans uppercase">Upload the main image that will be displayed on the website.</span>
                          </div>
                          {coverImage && (
                            <span className="text-[13px] font-sans font-medium tracking-[0.15em] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">
                              Ready
                            </span>
                          )}
                        </div>

                        {/* Drag & Drop Cover Upload Zone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingCover(true);
                            }}
                            onDragLeave={() => setIsDraggingCover(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingCover(false);
                              handleFileUpload(e.dataTransfer.files, (url) => {
                                setCoverImage(url);
                              });
                            }}
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                              isDraggingCover
                                ? 'border-red-500 bg-red-500/10 text-red-400'
                                : 'border-[#2A2A2A] bg-black/40 hover:border-white/20 text-[#BDBDBD] hover:text-[#E0E0E0]'
                            }`}
                            onClick={() => document.getElementById('car-cover-input')?.click()}
                            id="cover-drag-drop-zone"
                          >
                            <input
                              type="file"
                              id="car-cover-input"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleFileUpload(e.target.files, (url) => {
                                  setCoverImage(url);
                                });
                              }}
                            />
                            <Upload className="h-6 w-6 text-red-500/80 mb-2" />
                            <p className="text-[11px] font-sans font-medium uppercase tracking-wider">Upload Image</p>
                            <p className="text-[9px] text-[#8A8A8A] mt-1 uppercase font-sans">Drag & Drop or Click to Upload</p>
                          </div>

                          {/* Cover URL Adder or Image Preview */}
                          <div className="flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase block">Or Enter Image URL</span>
                              <input
                                type="url"
                                placeholder="https://images.unsplash.com/photo-..."
                                value={coverUrlInput}
                                onChange={(e) => {
                                  setCoverUrlInput(e.target.value);
                                  setCoverImage(e.target.value);
                                }}
                                className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2 px-3 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 font-sans"
                                id="cover-url-input-field"
                              />
                            </div>

                            {/* Cover Preview */}
                            {coverImage ? (
                              <div className="relative aspect-[16/9] bg-black border border-[#2A2A2A] rounded-lg overflow-hidden group">
                                <img
                                  src={coverImage}
                                  alt="Cover Preview"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => setCoverImage('')}
                                    className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-[13px] font-sans font-medium tracking-[0.15em] uppercase font-bold tracking-wider cursor-pointer transition-colors flex items-center space-x-1"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                    <span>Remove</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 border border-[#2A2A2A]/50 bg-black/20 rounded-lg flex items-center justify-center p-4">
                                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-gray-600 uppercase ">No image selected</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Option 2: Supporting Gallery Images */}
                      <div className="border border-[#2A2A2A]/50 bg-white/[0.01] p-5 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase tracking-[0.15em] block font-bold">Vehicle Gallery</span>
                            <span className="text-[9px] text-[#8A8A8A] font-sans uppercase">Upload additional images of the vehicle from different angles.</span>
                          </div>
                          <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500">{supportingImages.length} images added</span>
                        </div>

                        {/* Drag & Drop Supporting Upload Zone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingSupporting(true);
                            }}
                            onDragLeave={() => setIsDraggingSupporting(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingSupporting(false);
                              handleFileUpload(e.dataTransfer.files, (url) => {
                                setSupportingImages((prev) => [...prev, url]);
                              });
                            }}
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                              isDraggingSupporting
                                ? 'border-red-500 bg-red-500/10 text-red-400'
                                : 'border-[#2A2A2A] bg-black/40 hover:border-white/20 text-[#BDBDBD] hover:text-[#E0E0E0]'
                            }`}
                            onClick={() => document.getElementById('car-supporting-input')?.click()}
                            id="supporting-drag-drop-zone"
                          >
                            <input
                              type="file"
                              id="car-supporting-input"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleFileUpload(e.target.files, (url) => {
                                  setSupportingImages((prev) => [...prev, url]);
                                });
                              }}
                            />
                            <Upload className="h-6 w-6 text-red-500/80 mb-2" />
                            <p className="text-[11px] font-sans font-medium uppercase tracking-wider">Upload Gallery Images</p>
                            <p className="text-[9px] text-[#8A8A8A] mt-1 uppercase font-sans">Select or Drag Multiple Images</p>
                          </div>

                          {/* Supporting URL Adder */}
                          <div className="flex flex-col justify-center space-y-3">
                            <div className="space-y-1">
                              <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase block">Or Add Image URL</span>
                              <div className="flex gap-2">
                                <input
                                  type="url"
                                  placeholder="Enter Image URL (e.g., Unsplash...)"
                                  value={supportingUrlInput}
                                  onChange={(e) => setSupportingUrlInput(e.target.value)}
                                  className="flex-1 bg-[#111111] border border-[#2A2A2A] rounded py-2 px-3 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 font-sans"
                                  id="supporting-url-input-field"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (supportingUrlInput.trim()) {
                                      setSupportingImages((prev) => [...prev, supportingUrlInput.trim()]);
                                      setSupportingUrlInput('');
                                    }
                                  }}
                                  className="px-3 py-2 bg-white/5 border border-[#2A2A2A] hover:border-red-500 hover:text-black hover:bg-red-500 transition-all rounded text-[13px] font-sans font-medium tracking-[0.15em] text-[#E0E0E0] font-bold uppercase cursor-pointer"
                                  id="supporting-add-url-btn"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Preview of Supporting Images */}
                        {supportingImages.length > 0 && (
                          <div className="space-y-2" id="supporting-images-preview-list">
                            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">Showcase Gallery Images order</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 border border-[#2A2A2A]/50 p-3 rounded-lg">
                              {supportingImages.map((url, index) => (
                                <div
                                  key={index}
                                  className="group relative aspect-[16/10] bg-black border border-[#2A2A2A] rounded overflow-hidden flex flex-col justify-between"
                                  id={`supporting-preview-item-${index}`}
                                >
                                  <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover absolute inset-0 z-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex flex-col justify-between p-2">
                                    <div className="flex justify-between items-center w-full">
                                      <span className="text-[13px] font-sans font-medium tracking-[0.15em] bg-black/80 text-[#BDBDBD] px-1.5 py-0.5 rounded border border-[#2A2A2A]">
                                        #{index + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSupportingImages((prev) => prev.filter((_, i) => i !== index));
                                        }}
                                        className="p-1 bg-rose-500 hover:bg-rose-600 text-white rounded cursor-pointer transition-colors"
                                        title="Remove image"
                                      >
                                        <Trash className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Vehicle Description</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write a complete description of the vehicle including its condition, features, specifications, ownership details, and any additional information customers should know."
                        value={newCar.description}
                        onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                        className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 font-sans leading-[1.7] resize-none"
                        id="car-form-desc"
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab('vehicles')}
                        className="flex-1 py-4 bg-transparent hover:bg-white/5 border border-[#2A2A2A] text-white font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center cursor-pointer"
                      >
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewCar({ make: '', model: '', year: new Date().getFullYear(), price: '', description: '', transmission: 'Automatic', fuel_type: 'Petrol', mileage: 0, image_url: '' });
                          setCoverImage('');
                          setSupportingImages([]);
                          setEditingVehicleId(null);
                        }}
                        className="flex-1 py-4 bg-transparent hover:bg-white/5 border border-[#2A2A2A] text-white font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center cursor-pointer"
                      >
                        <span>Cancel</span>
                      </button>
                      <button
                        type="submit"
                        className="flex-2 py-4 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                        id="car-submit-btn"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>{editingVehicleId ? 'Save Changes' : 'Save Vehicle'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab 3: Gallery List Screen */}
              {activeTab === 'gallery' && (
                <motion.div
                  key="tab-gallery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-[28px] font-serif font-semibold text-white uppercase tracking-wider">Showroom Visual Gallery</h3>
                    <p className="text-[14px] font-sans font-normal text-[#BDBDBD] leading-[1.7] font-normal">Manage gallery images displayed on your website.</p>
                  </div>

                  {filteredGallery.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="portal-gallery-grid">
                      {filteredGallery.map((item) => (
                        <div 
                          key={item.id} 
                          className="relative group bg-black border border-[#2A2A2A] rounded overflow-hidden aspect-[4/3] flex flex-col justify-between"
                          id={`gallery-item-${item.id}`}
                        >
                          <img 
                            src={item.image_url} 
                            alt={item.description} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 absolute inset-0 z-0 bg-black"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
                            <div className="flex justify-end space-x-2">
                              {!searchQuery && (
                                <>
                                  <button
                                    onClick={() => {
                                      const originalIndex = gallery.findIndex(g => g.id === item.id);
                                      if (originalIndex > 0) {
                                        const newGallery = [...gallery];
                                        [newGallery[originalIndex - 1], newGallery[originalIndex]] = [newGallery[originalIndex], newGallery[originalIndex - 1]];
                                        onReorderGalleryItems(newGallery);
                                      }
                                    }}
                                    className="p-2 bg-blue-500/20 text-blue-400 hover:text-white rounded transition-all cursor-pointer hover:bg-blue-600"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const originalIndex = gallery.findIndex(g => g.id === item.id);
                                      if (originalIndex !== -1 && originalIndex < gallery.length - 1) {
                                        const newGallery = [...gallery];
                                        [newGallery[originalIndex], newGallery[originalIndex + 1]] = [newGallery[originalIndex + 1], newGallery[originalIndex]];
                                        onReorderGalleryItems(newGallery);
                                      }
                                    }}
                                    className="p-2 bg-blue-500/20 text-blue-400 hover:text-white rounded transition-all cursor-pointer hover:bg-blue-600"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => onDeleteGalleryItem(item.id)}
                                className="p-2 bg-rose-500 text-white rounded shadow-lg transition-all cursor-pointer hover:bg-rose-600"
                                id={`delete-gallery-btn-${item.id}`}
                                title="Remove Gallery Image"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="space-y-1">
                              <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase tracking-[0.15em] block">GALLERY IMAGE</span>
                            </div>
                          </div>
                          
                          {/* Fallback Static Controls for Mobile or Quick Action */}
                          <div className="absolute top-2 right-2 z-20 md:hidden">
                            <button
                              onClick={() => onDeleteGalleryItem(item.id)}
                              className="p-1.5 bg-black/80 text-rose-500 rounded border border-[#2A2A2A]"
                              id={`delete-gallery-mobile-btn-${item.id}`}
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-dashed border-[#2A2A2A] rounded-lg text-[#8A8A8A] space-y-2">
                      <ImageIcon className="h-8 w-8 mx-auto text-gray-600" />
                      <p className="text-[13px] font-sans font-medium tracking-[0.15em]">No gallery images match your search.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 4: Add Gallery Item Screen */}
              {activeTab === 'add-gallery' && (
                <motion.div
                  key="tab-add-gallery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  <div className="border-b border-[#2A2A2A] pb-4">
                    <h3 className="text-[28px] font-serif font-semibold text-white uppercase tracking-wider">Add Gallery Image</h3>
                    <p className="text-[14px] font-sans font-normal text-[#BDBDBD] leading-[1.7] font-normal mt-0.5">Upload images to the gallery.</p>
                  </div>

                  {gallerySuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 border border-red-500/30 p-4 rounded text-center text-red-500 text-[13px] font-sans font-medium tracking-[0.15em] uppercase tracking-[0.15em]"
                      id="gallery-success-notification"
                    >
                      Image uploaded successfully.
                    </motion.div>
                  )}

                  <form onSubmit={handleAddGallerySubmit} className="space-y-6" id="add-gallery-item-form">
                    {/* Immersive Gallery Image Uploader */}
                    <div className="space-y-4">
                      <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Image Source</label>

                      {/* Drag & Drop Area */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingGallery(true);
                        }}
                        onDragLeave={() => setIsDraggingGallery(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingGallery(false);
                          handleFileUpload(e.dataTransfer.files, (url) => {
                            setNewGalleryItem((prev) => ({ ...prev, image_url: url }));
                          });
                        }}
                        onClick={() => document.getElementById('gallery-file-input')?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                          isDraggingGallery
                            ? 'border-red-500 bg-red-500/10 text-red-400'
                            : 'border-[#2A2A2A] bg-white/[0.01] hover:border-white/20 text-[#BDBDBD] hover:text-[#E0E0E0]'
                        }`}
                        id="gallery-drag-drop-zone"
                      >
                        <input
                          type="file"
                          id="gallery-file-input"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            handleFileUpload(e.target.files, (url) => {
                              setNewGalleryItem((prev) => ({ ...prev, image_url: url }));
                            });
                          }}
                        />
                        <Upload className="h-8 w-8 mx-auto text-red-500/80 mb-2" />
                        <p className="text-[13px] font-sans font-medium tracking-[0.15em] font-medium">Drag & Drop or Click to Upload</p>
                        <p className="text-[10px] text-[#8A8A8A] mt-1 uppercase">Upload Image</p>
                      </div>

                      {/* Manual text input */}
                      <div className="space-y-1">
                        <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">Or Enter Image URL</span>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={newGalleryItem.image_url}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image_url: e.target.value })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 font-sans"
                          id="gallery-form-url"
                        />
                      </div>
                    </div>


                    {newGalleryItem.image_url && (
                      <div className="space-y-2" id="gallery-form-preview-wrapper">
                        <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">Visual Rendering Check</span>
                        <div className="border border-[#2A2A2A] rounded overflow-hidden aspect-[16/9] max-w-md mx-auto bg-black relative">
                          <img 
                            src={newGalleryItem.image_url} 
                            alt="Visual previewing" 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594976610091-667cb4474797?q=80&w=800&auto=format&fit=crop';
                            }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                      id="gallery-submit-btn"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>PUBLISH TO ARCHIVES</span>
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Tab 5: Enquiries Inbox */}
              {activeTab === 'enquiries' && (
                <motion.div
                  key="tab-enquiries"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-[28px] font-serif font-semibold text-white uppercase tracking-wider">Client Inquiry Inbox</h3>
                    <p className="text-[14px] font-sans font-normal text-[#BDBDBD] leading-[1.7] font-normal">View and manage customer enquiries received from the website.</p>
                  </div>

                  {enquiries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="portal-enquiry-grid">
                      {enquiries.map((enq) => {
                        const targetCar = vehicles.find(v => v.id === enq.vehicle_id);
                        return (
                          <div 
                            key={enq.id} 
                            className="bg-black/60 border border-[#2A2A2A] hover:border-white/20 transition-all rounded-lg p-6 space-y-4 flex flex-col justify-between"
                            id={`enquiry-${enq.id}`}
                          >
                            <div className="space-y-3">
                              
                              {/* Header Metadata */}
                              <div className="flex justify-between items-start border-b border-[#2A2A2A]/50 pb-3">
                                <div className="space-y-0.5">
                                  <h4 className="text-[16px] font-sans font-semibold text-white uppercase tracking-wide">{enq.name}</h4>
                                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">
                                    Received: {new Date(enq.created_at).toLocaleDateString()} • {new Date(enq.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="px-2.5 py-0.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[13px] font-sans font-medium tracking-[0.15em] uppercase tracking-[0.15em] font-bold">
                                    {enq.status || 'Pending'}
                                  </span>
                                  <button
                                    onClick={() => onDeleteEnquiry(enq.id)}
                                    className="p-1.5 bg-rose-500/5 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/10 hover:border-transparent rounded transition-all cursor-pointer"
                                    title="Delete Enquiry"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Communications channels */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-1">
                                <a 
                                  href={`mailto:${enq.email}`}
                                  className="flex items-center space-x-2 text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] hover:text-red-500 transition-colors"
                                  title="Send Email"
                                >
                                  <Mail className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                  <span className="truncate">{enq.email}</span>
                                </a>
                                <a 
                                  href={`tel:${enq.phone}`}
                                  className="flex items-center space-x-2 text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] hover:text-red-500 transition-colors"
                                  title="Establish Audio Link"
                                >
                                  <Phone className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                  <span>{enq.phone}</span>
                                </a>
                              </div>

                              {/* Selected Target Car, if present */}
                              {targetCar && (
                                <div className="p-3 bg-white/[0.02] border border-[#2A2A2A]/50 rounded flex items-center space-x-3">
                                  <img 
                                    src={targetCar.images[0]} 
                                    alt={targetCar.model} 
                                    className="w-12 h-8 object-cover rounded border border-[#2A2A2A] bg-black shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <span className="text-[8px] font-sans text-red-500 tracking-wider uppercase block">TARGET VEHICLE</span>
                                    <span className="text-[16px] text-white font-serif uppercase tracking-wide">{targetCar.make} {targetCar.model}</span>
                                  </div>
                                </div>
                              )}

                              {/* Enquiry Message Text */}
                              <div className="bg-white/[0.01] border border-[#2A2A2A]/50 p-4 rounded-lg text-[14px] font-sans font-normal text-[#E0E0E0] font-sans leading-[1.7] ">
                                "{enq.message}"
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-dashed border-[#2A2A2A] rounded-lg text-[#8A8A8A] space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-gray-600" />
                      <p className="text-[13px] font-sans font-medium tracking-[0.15em]">No customer enquiries found.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="tab-settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl"
                >
                  <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                    <div className="space-y-1">
                      <h3 className="text-[28px] font-serif font-semibold text-white uppercase tracking-wider">Website Settings & Contact Info</h3>
                      <p className="text-[14px] font-sans font-normal text-[#BDBDBD] leading-[1.7] font-normal">Update global variables such as phone numbers, emails, addresses, and SEO metadata.</p>
                    </div>
                  </div>
                  {settingsSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded text-center text-emerald-500 text-[13px] font-sans font-medium tracking-[0.15em] uppercase tracking-[0.15em]"
                    >
                      SUCCESS: Website Settings Updated Successfully
                    </motion.div>
                  )}
                  <form onSubmit={handleSettingsSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[16px] font-sans font-medium text-red-500 uppercase tracking-[0.15em] border-b border-[#2A2A2A]/50 pb-2">Direct Communications</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Primary Phone</label>
                          <input type="text" value={settingsForm.phone1} onChange={e => setSettingsForm({...settingsForm, phone1: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Secondary Phone</label>
                          <input type="text" value={settingsForm.phone2} onChange={e => setSettingsForm({...settingsForm, phone2: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">WhatsApp Number (For links)</label>
                          <input type="text" value={settingsForm.whatsapp} onChange={e => setSettingsForm({...settingsForm, whatsapp: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Email Address</label>
                          <input type="email" value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[16px] font-sans font-medium text-red-500 uppercase tracking-[0.15em] border-b border-[#2A2A2A]/50 pb-2">Location & Hours</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Showroom Address</label>
                          <textarea rows={2} value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Google Maps Embed URL</label>
                          <input type="url" value={settingsForm.googleMapsEmbedUrl || ''} onChange={e => {
                            let val = e.target.value;
                            // Basic extraction if user pastes iframe code
                            if (val.includes('<iframe') && val.includes('src="')) {
                              const match = val.match(/src="([^"]+)"/);
                              if (match && match[1]) {
                                val = match[1];
                              }
                            }
                            setSettingsForm({...settingsForm, googleMapsEmbedUrl: val});
                          }} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" placeholder="https://www.google.com/maps/embed?..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Google Maps Directions URL</label>
                          <input type="url" value={settingsForm.googleMapsDirectionsUrl || ''} onChange={e => setSettingsForm({...settingsForm, googleMapsDirectionsUrl: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" placeholder="https://maps.app.goo.gl/..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Business Hours (Weekdays)</label>
                            <input type="text" value={settingsForm.businessHoursWeekdays} onChange={e => setSettingsForm({...settingsForm, businessHoursWeekdays: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Business Hours (Weekend)</label>
                            <input type="text" value={settingsForm.businessHoursWeekend} onChange={e => setSettingsForm({...settingsForm, businessHoursWeekend: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[16px] font-sans font-medium text-red-500 uppercase tracking-[0.15em] border-b border-[#2A2A2A]/50 pb-2">SEO & Branding</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Website Logo</label>
                          <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <button 
                                type="button" 
                                onClick={() => document.getElementById('logo-upload-input')?.click()}
                                className="w-full py-3 bg-transparent hover:bg-white/5 border border-[#2A2A2A] text-white font-sans font-medium text-[10px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                              >
                                <Upload className="h-3.5 w-3.5 text-red-500" />
                                <span>Upload Image</span>
                              </button>
                              <input 
                                type="file" 
                                id="logo-upload-input" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  handleFileUpload(e.target.files, (url) => {
                                    setSettingsForm({...settingsForm, logoUrl: url});
                                  });
                                }} 
                              />
                            </div>
                            {settingsForm.logoUrl && (
                              <div className="w-20 h-20 bg-black border border-[#2A2A2A] rounded flex items-center justify-center p-2 shrink-0">
                                <img src={settingsForm.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Global SEO Title</label>
                          <input type="text" value={settingsForm.seoTitle} onChange={e => setSettingsForm({...settingsForm, seoTitle: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em] block">Global SEO Description</label>
                          <textarea rows={2} value={settingsForm.seoDescription} onChange={e => setSettingsForm({...settingsForm, seoDescription: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-[16px] font-sans font-medium text-red-500 uppercase tracking-[0.15em] border-b border-[#2A2A2A]/50 pb-2">Homepage & Hero</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Hero Title</label>
                          <input type="text" value={settingsForm.heroTitle || ''} onChange={e => setSettingsForm({...settingsForm, heroTitle: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Hero Subtitle</label>
                          <textarea rows={2} value={settingsForm.heroSubtitle || ''} onChange={e => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Hero Video URL</label>
                          <input type="text" value={settingsForm.heroVideoUrl || ''} onChange={e => setSettingsForm({...settingsForm, heroVideoUrl: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="px-6 py-3 bg-red-500 text-black font-bold text-[13px] font-sans font-medium tracking-[0.15em] uppercase tracking-[0.15em] rounded hover:bg-red-400 transition-colors w-full sm:w-auto">
                        Save Website Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        <AnimatePresence>
          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded text-center text-emerald-500 text-[13px] font-sans font-medium tracking-[0.15em] uppercase z-50 flex items-center space-x-2 backdrop-blur-md shadow-lg"
            >
              <Check className="h-4 w-4" />
              <span>Image Uploaded Successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

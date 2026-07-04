import { formatCurrency } from '../lib/utils';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUpRight, ShieldCheck, HelpCircle, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Vehicle } from '../types';
import ZoomLightbox from './ZoomLightbox';

interface InventoryViewProps {
  vehicles: Vehicle[];
  setView: (view: string) => void;
  setSelectedVehicleId: (id: string) => void;
}

export default function InventoryView({ vehicles, setView, setSelectedVehicleId }: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');

  const priceOptions = [
    'Any Price',
    'Under ₹5 Lakh',
    '₹5 Lakh – ₹10 Lakh',
    '₹10 Lakh – ₹20 Lakh',
    '₹20 Lakh – ₹50 Lakh',
    'Above ₹50 Lakh'
  ];
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Instagram-style active image index map for each vehicle card
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  const handleNextImage = (vehicleId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [vehicleId]: ((prev[vehicleId] ?? 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (vehicleId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [vehicleId]: ((prev[vehicleId] ?? 0) - 1 + totalImages) % totalImages,
    }));
  };

  const openLightbox = (images: string[], index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxImages(images);
    setLightboxInitialIndex(index);
    setLightboxOpen(true);
  };

  // Available unique makes for dynamic filters
  const makes = useMemo(() => {
    const list = new Set(vehicles.map((v) => v.make));
    return ['All', ...Array.from(list)];
  }, [vehicles]);

  const fuelTypes = ['All', 'Petrol', 'Hybrid', 'Electric', 'Diesel'];
  const transmissions = ['All', 'Automatic', 'Manual'];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch = 
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMake = selectedMake === 'All' || v.make === selectedMake;
      const matchesTransmission = selectedTransmission === 'All' || v.transmission === selectedTransmission;
      const matchesFuel = selectedFuel === 'All' || v.fuel_type === selectedFuel;
      
      let matchesPrice = true;
      const priceVal = v.price || 0;
      if (selectedPrice === 'Under ₹5 Lakh') matchesPrice = priceVal < 500000;
      else if (selectedPrice === '₹5 Lakh – ₹10 Lakh') matchesPrice = priceVal >= 500000 && priceVal <= 1000000;
      else if (selectedPrice === '₹10 Lakh – ₹20 Lakh') matchesPrice = priceVal > 1000000 && priceVal <= 2000000;
      else if (selectedPrice === '₹20 Lakh – ₹50 Lakh') matchesPrice = priceVal > 2000000 && priceVal <= 5000000;
      else if (selectedPrice === 'Above ₹50 Lakh') matchesPrice = priceVal > 5000000;

      return matchesSearch && matchesMake && matchesTransmission && matchesFuel && matchesPrice;
    });
  }, [vehicles, searchQuery, selectedMake, selectedTransmission, selectedFuel, selectedPrice]);

  const formatPrice = (price: number) => {
    return formatCurrency(price || 0);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMake('All');
    setSelectedTransmission('All');
    setSelectedFuel('All');
    setSelectedPrice('Any Price');
  };

  return (
    <div className="bg-black text-white min-h-screen py-12" id="inventory-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#2A2A2A] pb-8 mb-10" id="inventory-header">
          <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">ATELIER ARCHIVES</span>
          <h1 className="text-[42px] sm:text-[64px] font-serif tracking-tight text-white mt-1">
            The Vault
          </h1>
          <p className="text-[16px] text-[#BDBDBD] font-sans font-normal mt-2 max-w-xl leading-[1.7]">
            Browse our curated acquisition catalog. Fully customizable commissions, ready for international diplomatic transit and immediate possession.
          </p>
        </div>

        {/* Top Filter & Controls Bar (like Flipkart/Amazon) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-[#111111] border border-[#2A2A2A] rounded p-4" id="inventory-toolbar">
          <div className="flex items-center space-x-3 shrink-0">
            {/* Desktop Filters Toggle Button (like Flipkart / Amazon) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex items-center space-x-2 px-4 py-2.5 bg-white/5 hover:bg-red-500 hover:text-black border border-[#2A2A2A] hover:border-transparent rounded text-[13px] font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
              id="desktop-toggle-filters-btn"
            >
              <SlidersHorizontal className="h-4 w-4 text-red-500" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-white/5 hover:bg-red-500 hover:text-black border border-[#2A2A2A] rounded text-[13px] font-sans font-medium tracking-[0.15em] uppercase transition-all cursor-pointer"
              id="mobile-toggle-filters-btn"
            >
              <SlidersHorizontal className="h-4 w-4 text-red-500" />
              <span>Filters</span>
            </button>

            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD]">
              Showing {filteredVehicles.length} of {vehicles.length} Ateliers
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-md" id="toolbar-search-wrapper">
            <input
              type="text"
              placeholder="e.g. Aventador, Phantom, Porsche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050505] border border-[#2A2A2A] rounded py-2.5 pl-10 pr-10 text-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all font-sans"
              id="toolbar-search-input"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8A8A8A]" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#8A8A8A] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Grid Layout */}
        <div className={`lg:grid ${showFilters ? 'lg:grid-cols-4 lg:gap-8' : 'lg:grid-cols-1'}`} id="inventory-main-layout">
          {/* Desktop Filters Panel */}
          {showFilters && (
            <aside className="hidden lg:block space-y-6 bg-[#111111] border border-[#2A2A2A] rounded-lg p-6 h-fit sticky top-28" id="desktop-filters">
              <div className="flex items-center justify-between border-b border-[#2A2A2A]/50 pb-4">
                <span className="text-[16px] font-bold uppercase tracking-wider text-white">SEARCH FILTERS</span>
                <button 
                  onClick={resetFilters}
                  className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 hover:text-red-400 transition-colors"
                  id="desktop-reset-filters-btn"
                >
                  RESET ALL
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Keyword Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Aventador, Phantom"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-[#2A2A2A] rounded-lg py-2.5 pl-10 pr-4 text-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors font-sans"
                    id="desktop-search-input"
                  />
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8A8A8A]" />
                </div>
              </div>

              {/* Make Selector */}
              <div className="space-y-2">
                <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Atelier (Make)</label>
                <div className="flex flex-wrap gap-2">
                  {makes.map((make) => (
                    <button
                      key={make}
                      onClick={() => setSelectedMake(make)}
                      className={`px-3 py-1.5 rounded-lg text-[14px] font-sans tracking-wide border transition-all ${
                        selectedMake === make
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD] hover:text-white hover:border-[#2A2A2A]'
                      }`}
                      id={`filter-make-${make}`}
                    >
                      {make}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Valuation Filter</label>
                </div>
                <div className="flex flex-col gap-2">
                  {priceOptions.map((priceOption) => (
                    <button
                      key={priceOption}
                      onClick={() => setSelectedPrice(priceOption)}
                      className={`px-3 py-1.5 rounded-lg text-[14px] font-sans tracking-wide border transition-all text-left ${
                        selectedPrice === priceOption
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD] hover:text-white hover:border-[#2A2A2A]'
                      }`}
                      id={`filter-price-${priceOption}`}
                    >
                      {priceOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission Selector */}
              <div className="space-y-2">
                <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Transmission</label>
                <div className="grid grid-cols-3 gap-2">
                  {transmissions.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTransmission(t)}
                      className={`py-2 rounded-lg text-[14px] font-sans text-center border transition-all ${
                        selectedTransmission === t
                          ? 'border-red-500 bg-red-500/10 text-red-400 font-medium'
                          : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD] hover:text-white hover:border-[#2A2A2A]'
                      }`}
                      id={`filter-trans-${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type Selector */}
              <div className="space-y-2">
                <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Propulsion System</label>
                <div className="grid grid-cols-2 gap-2">
                  {fuelTypes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFuel(f)}
                      className={`py-2 rounded-lg text-[14px] font-sans text-center border transition-all ${
                        selectedFuel === f
                          ? 'border-red-500 bg-red-500/10 text-red-400 font-medium'
                          : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD] hover:text-white hover:border-[#2A2A2A]'
                      }`}
                      id={`filter-fuel-${f}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Cars Grid */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-8`} id="inventory-cars-panel">
            {filteredVehicles.length > 0 ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`} id="inventory-grid">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500 group flex flex-col justify-between"
                    id={`inventory-card-${vehicle.id}`}
                  >
                    <div>
                      {/* Image Frame with Instagram-style slide controls */}
                      <div 
                        className="relative h-64 overflow-hidden cursor-pointer group/img"
                        onClick={(e) => {
                          // Clicking the main image opens the lightbox
                          const activeIdx = cardImageIndices[vehicle.id] ?? 0;
                          openLightbox(vehicle.images, activeIdx, e);
                        }}
                        id={`inventory-img-box-${vehicle.id}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                        
                        <AnimatePresence mode="wait">
                          <motion.img 
                            key={cardImageIndices[vehicle.id] ?? 0}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            src={vehicle.images[cardImageIndices[vehicle.id] ?? 0] ?? vehicle.images[0]} 
                            alt={`${vehicle.make} ${vehicle.model}`} 
                            className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </AnimatePresence>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20 flex space-x-2">
                          <span className="px-2.5 py-1 bg-[#050505]/85 backdrop-blur-md border border-[#2A2A2A] rounded text-[13px] font-sans font-medium tracking-[0.15em] tracking-[0.15em] text-red-500 uppercase">
                            {vehicle.year} MODEL
                          </span>
                          <span className="px-2.5 py-1 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded text-[13px] font-sans font-medium tracking-[0.15em] tracking-[0.15em] text-red-400 uppercase flex items-center space-x-1">
                            <ShieldCheck className="h-3 w-3 shrink-0" />
                            <span>CERTIFIED</span>
                          </span>
                        </div>

                        {/* Instagram-style Zoom Overlay Button on Top Right */}
                        <button
                          type="button"
                          onClick={(e) => {
                            const activeIdx = cardImageIndices[vehicle.id] ?? 0;
                            openLightbox(vehicle.images, activeIdx, e);
                          }}
                          className="absolute top-4 right-4 z-20 p-2 bg-black/80 hover:bg-red-500 hover:text-black border border-[#2A2A2A] rounded-lg text-red-500 hover:border-transparent transition-all opacity-0 group-hover/img:opacity-100 duration-300"
                          title="View Full & Zoom"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Slide Navigation Chevrons */}
                        {vehicle.images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handlePrevImage(vehicle.id, vehicle.images.length, e)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/75 border border-[#2A2A2A] text-white hover:bg-red-500 hover:text-black hover:border-transparent transition-all duration-200 opacity-0 group-hover/img:opacity-100"
                              title="Previous Image"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNextImage(vehicle.id, vehicle.images.length, e)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/75 border border-[#2A2A2A] text-white hover:bg-red-500 hover:text-black hover:border-transparent transition-all duration-200 opacity-0 group-hover/img:opacity-100"
                              title="Next Image"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {/* Dot indicators */}
                        {vehicle.images.length > 1 && (
                          <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center space-x-1">
                            {vehicle.images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                  (cardImageIndices[vehicle.id] ?? 0) === idx ? 'w-4 bg-red-500' : 'w-1 bg-white/40'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Info Frame */}
                      <div className="p-8 space-y-5" id={`inventory-info-box-${vehicle.id}`}>
                        <div>
                          <h3 
                            className="text-[32px] font-serif font-bold text-white group-hover:text-red-500 transition-colors uppercase cursor-pointer leading-[1.2]"
                            onClick={() => {
                              setSelectedVehicleId(vehicle.id);
                              setView('vehicle-details');
                            }}
                            id={`inventory-title-${vehicle.id}`}
                          >
                            {vehicle.make}
                          </h3>
                          <p className="text-[14px] font-sans font-normal text-[#BDBDBD] tracking-wide mt-0.5">
                            {vehicle.model}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-[11px] font-sans text-[#8A8A8A] text-center py-2.5 border-y border-[#2A2A2A]">
                          <div className="text-left">
                            <span className="text-[9px] text-gray-600 block uppercase">Transmission</span>
                            <span className="text-[#E0E0E0] font-medium block mt-0.5">{vehicle.transmission}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-600 block uppercase">Fuel System</span>
                            <span className="text-[#E0E0E0] font-medium block mt-0.5">{vehicle.fuel_type}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-gray-600 block uppercase">Mileage</span>
                            <span className="text-[#E0E0E0] font-medium block mt-0.5">{(vehicle.mileage || 0).toLocaleString()} KM</span>
                          </div>
                        </div>

                        <p className="text-[14px] font-sans font-normal text-[#BDBDBD] font-sans font-normal line-clamp-2 leading-[1.7]">
                          {vehicle.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA / Action Frame */}
                    <div className="px-8 pb-8 pt-2" id={`inventory-cta-box-${vehicle.id}`}>
                      <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-gray-600 uppercase tracking-[0.15em]">Valuation</span>
                          <span className="text-[20px] font-sans font-bold text-red-500">
                            {formatPrice(vehicle.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedVehicleId(vehicle.id);
                            setView('vehicle-details');
                          }}
                          className="flex items-center space-x-2 px-6 py-3 bg-[#050505] border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_20px_rgba(200,16,46,0.5)] rounded-lg text-[14px] font-sans font-semibold tracking-[0.15em] uppercase transition-all duration-300 group/btn"
                          id={`inventory-action-btn-${vehicle.id}`}
                        >
                          <span>View</span>
                          <ArrowUpRight className="h-3 w-3 text-red-500 group-hover/btn:text-black group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No Cars State */
              <div className="text-center py-20 bg-white/[0.01] border border-[#2A2A2A]/50 rounded-2xl flex flex-col items-center justify-center space-y-4" id="inventory-empty-state">
                <HelpCircle className="h-12 w-12 text-red-500/50 animate-bounce" />
                <h3 className="text-[20px] font-sans font-bold text-white uppercase tracking-wider">NO VEHICLES MATCH</h3>
                <p className="text-[16px] text-[#BDBDBD] font-sans font-normal max-w-sm leading-[1.7]">
                  We currently do not hold any commissions matching your exact parameters. Try broadening your filter horizons or speak directly to the concierge.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black rounded-lg text-[13px] font-sans font-medium tracking-[0.15em] uppercase transition-all"
                  id="empty-state-reset-btn"
                >
                  RESTORE ORIGINAL VAULT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" id="mobile-filters-drawer">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileFilters(false)}></div>

          <div className="fixed inset-y-0 right-0 max-w-full pl-10 flex">
            <div className="w-screen max-w-md bg-black border-l border-[#2A2A2A] text-white p-6 flex flex-col h-full justify-between">
              {/* Drawer Title */}
              <div className="flex items-center justify-between border-b border-[#2A2A2A]/50 pb-4">
                <span className="text-[16px] font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                  <SlidersHorizontal className="h-4 w-4 text-red-500" />
                  <span>Vault Filters</span>
                </span>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 border border-[#2A2A2A]/50 rounded-lg hover:bg-white/5 transition-all"
                  id="mobile-close-filters-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 py-6 overflow-y-auto space-y-6">
                {/* Atelier (Make) */}
                <div className="space-y-2">
                  <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Atelier (Make)</label>
                  <div className="flex flex-wrap gap-2">
                    {makes.map((make) => (
                      <button
                        key={make}
                        onClick={() => setSelectedMake(make)}
                        className={`px-3 py-1.5 rounded-lg text-[14px] font-sans tracking-wide border transition-all ${
                          selectedMake === make
                            ? 'border-red-500 bg-red-500/10 text-red-400'
                            : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD]'
                        }`}
                        id={`mobile-filter-make-${make}`}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Valuation Filter</label>
                  </div>
                  <div className="flex flex-col gap-2">
                    {priceOptions.map((priceOption) => (
                      <button
                        key={priceOption}
                        onClick={() => setSelectedPrice(priceOption)}
                        className={`px-3 py-1.5 rounded-lg text-[14px] font-sans tracking-wide border transition-all text-left ${
                          selectedPrice === priceOption
                            ? 'border-red-500 bg-red-500/10 text-red-400'
                            : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD] hover:text-white hover:border-[#2A2A2A]'
                        }`}
                        id={`mobile-filter-price-${priceOption}`}
                      >
                        {priceOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission Selector */}
                <div className="space-y-2">
                  <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Transmission</label>
                  <div className="grid grid-cols-3 gap-2">
                    {transmissions.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTransmission(t)}
                        className={`py-2 rounded-lg text-[14px] font-sans text-center border transition-all ${
                          selectedTransmission === t
                            ? 'border-red-500 bg-red-500/10 text-red-400 font-medium'
                            : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD]'
                        }`}
                        id={`mobile-filter-trans-${t}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Selector */}
                <div className="space-y-2">
                  <label className="text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-[#BDBDBD] uppercase">Propulsion System</label>
                  <div className="grid grid-cols-2 gap-2">
                    {fuelTypes.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFuel(f)}
                        className={`py-2 rounded-lg text-[14px] font-sans text-center border transition-all ${
                          selectedFuel === f
                            ? 'border-red-500 bg-red-500/10 text-red-400 font-medium'
                            : 'border-[#2A2A2A]/50 bg-white/[0.01] text-[#BDBDBD]'
                        }`}
                        id={`mobile-filter-fuel-${f}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="border-t border-[#2A2A2A]/50 pt-4 space-y-2">
                <button
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full py-3 border border-[#2A2A2A] rounded-xl text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] tracking-[0.15em] uppercase hover:text-white transition-all"
                  id="mobile-drawer-reset-btn"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-red-500 hover:bg-red-400 text-black rounded-xl text-[14px] font-sans font-semibold tracking-[0.15em] uppercase transition-all"
                  id="mobile-drawer-apply-btn"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ZoomLightbox
        images={lightboxImages}
        initialIndex={lightboxInitialIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

import { formatCurrency } from '../lib/utils';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, KeyRound, Calendar, ShieldAlert, Sparkles, Send, Check, Eye, ChevronLeft, ChevronRight, Maximize2, Phone, MessageCircle } from 'lucide-react';
import { Vehicle, Enquiry } from '../types';
import ZoomLightbox from './ZoomLightbox';

interface VehicleDetailsViewProps {
  vehicleId: string;
  vehicles: Vehicle[];
  setView: (view: string) => void;
  onAddEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => void;
}

export default function VehicleDetailsView({ vehicleId, vehicles, setView, onAddEnquiry }: VehicleDetailsViewProps) {
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-[24px] font-bold uppercase tracking-wider text-red-500">Vehicle Not Found</h2>
        <p className="text-[#BDBDBD] mt-2">The requested automotive commission could not be located in our vaults.</p>
        <button
          onClick={() => setView('inventory')}
          className="mt-6 px-6 py-2.5 bg-white/5 border border-[#2A2A2A] hover:border-red-500/30 text-white rounded-lg text-[13px] font-sans font-medium tracking-[0.15em] uppercase transition-all"
        >
          Return to Vault
        </button>
      </div>
    );
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = vehicle.images[activeIndex] || vehicle.images[0];
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleNextImage = () => {
    if (vehicle.images.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const handlePrevImage = () => {
    if (vehicle.images.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in vehicle ${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.price}`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formatPrice = (price: number) => {
    return formatCurrency(price || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        vehicle_id: vehicle.id,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form fields
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1200);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12" id="vehicle-details-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => setView('inventory')}
          className="group flex items-center space-x-2 text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 hover:text-red-400 mb-8 uppercase transition-colors"
          id="back-to-vault-btn"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Vault</span>
        </button>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="details-grid-layout">
          {/* Left Column: Image Gallery Frame (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6" id="details-left-panel">
            {/* Massive Main Viewer with Instagram-style slide capabilities and zoom triggers */}
            <div className="relative aspect-[16/9] bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group/mainimg" id="main-gallery-viewer">
              {/* Fade anim for active image */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  src={activeImage} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Bottom Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex justify-between items-end z-10 pointer-events-none">
                <div>
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 tracking-[0.15em] uppercase">VEHICLE GALLERY</span>
                  <p className="text-[16px] font-sans font-medium text-[#E0E0E0] mt-1">{vehicle.make} {vehicle.model}</p>
                </div>
                <div className="flex items-center space-x-1.5 bg-[#050505]/80 backdrop-blur-md px-3 py-1 rounded border border-[#2A2A2A]">
                  <Eye className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#E0E0E0] uppercase">Click an image to view larger</span>
                </div>
              </div>

              {/* Instagram-style Zoom Overlay Button on Top Right */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/85 hover:bg-red-500 hover:text-black border border-[#2A2A2A] rounded-lg text-red-500 hover:border-transparent transition-all opacity-0 group-hover/mainimg:opacity-100 duration-300"
                title="View Full & Zoom"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {/* Chevrons for Sliding */}
              {vehicle.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 border border-[#2A2A2A] text-white hover:bg-red-500 hover:text-black hover:border-transparent transition-all duration-300"
                    title="Previous Image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 border border-[#2A2A2A] text-white hover:bg-red-500 hover:text-black hover:border-transparent transition-all duration-300"
                    title="Next Image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {vehicle.images.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center space-x-1.5">
                  {vehicle.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        activeIndex === idx ? 'w-5 bg-red-500' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Carousel Selector */}
            <div className="grid grid-cols-3 gap-4" id="gallery-thumbnail-carousel">
              {vehicle.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`aspect-[16/10] bg-[#111111] border rounded overflow-hidden transition-all ${
                    activeIndex === index
                      ? 'border-red-500 scale-[0.98]'
                      : 'border-[#2A2A2A] hover:border-white/20'
                  }`}
                  id={`thumbnail-${index}`}
                >
                  <img src={img} alt={`Angle ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

            {/* Comprehensive Technical Specifications Sheets */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded p-6 space-y-6" id="details-specs-sheet">
              <div className="border-b border-[#2A2A2A]/50 pb-4">
                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 tracking-[0.15em] uppercase block">VEHICLE SPECIFICATIONS</span>
                <h3 className="text-[28px] font-serif font-semibold text-white uppercase mt-0.5">Specifications</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-[16px]" id="specs-grid">
                {[
                  { label: 'Make', value: vehicle.make },
                  { label: 'Model', value: vehicle.model },
                  { label: 'Year', value: vehicle.year },
                  { label: 'Transmission', value: vehicle.transmission },
                  { label: 'Fuel Type', value: vehicle.fuel_type },
                  { label: 'Kilometers Driven', value: `${(vehicle.mileage || 0).toLocaleString()} KM` }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2.5 border-b border-[#2A2A2A]/50" id={`spec-item-${idx}`}>
                    <span className="text-[#8A8A8A] text-[13px] font-sans font-medium tracking-[0.15em] uppercase tracking-wider">{item.label}</span>
                    <span className="text-gray-200 font-sans font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Overview and Inquiry Submission Form (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-8" id="details-right-panel">
            <div className="space-y-4" id="details-pricing-box">
              {/* Manufacturer Header */}
              <div className="space-y-1">
                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">VEHICLE DETAILS</span>
                <h1 className="text-[34px] sm:text-[52px] font-serif font-bold text-white leading-none">
                  {vehicle.make}
                </h1>
                <p className="text-[18px] font-sans text-[#BDBDBD] tracking-wide font-normal">
                  {vehicle.model}
                </p>
              </div>

              {/* Price Badge */}
              <div className="p-5 bg-[#111111] border border-[#2A2A2A] rounded" id="details-price-badge">
                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">Price</span>
                <span className="text-[24px] sm:text-[34px] font-sans font-bold text-red-500 block mt-1">
                  {formatPrice(vehicle.price)}
                </span>
                <div className="flex items-center space-x-2 text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] mt-2">
                  <Calendar className="h-3.5 w-3.5 text-red-500" />
                  <span>Model Year: {vehicle.year}</span>
                </div>
              </div>

              {/* General Narrative */}
              <div className="space-y-3" id="details-description">
                <h4 className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Description</h4>
                <p className="text-[16px] font-sans font-normal text-[#E0E0E0] font-sans font-normal leading-[1.7]">
                  {vehicle.description}
                </p>
              </div>
            </div>

            {/* Interactive Request Form Sheet */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 shadow-2xl shadow-black/50 relative overflow-hidden" id="details-inquiry-box">
              {/* Subtle visual glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-500/10 blur-2xl rounded-full"></div>

              <div className="border-b border-[#2A2A2A]/50 pb-4">
                <div className="flex items-center space-x-2 text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 tracking-[0.15em] uppercase">
                  <KeyRound className="h-4 w-4 animate-pulse" />
                  <span>Book an Inspection</span>
                </div>
                <h3 className="text-[28px] font-serif font-semibold text-white uppercase mt-1">Enquiry Form</h3>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl text-center space-y-4"
                  id="inquiry-success-message"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                    <Check className="h-6 w-6 text-black stroke-[3px]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-red-500 uppercase tracking-wider">REQUEST RECEIVED</h4>
                    <p className="text-[14px] font-sans font-normal text-[#BDBDBD] mt-1 leading-[1.7] font-normal">
                      The Salon Liaison has registered your dossier. A curated viewing invitation will be delivered to your inbox within the next 2 business hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-black rounded-lg text-[14px] font-sans font-semibold tracking-[0.15em] uppercase transition-all"
                    id="submit-another-request-btn"
                  >
                    SUBMIT ANOTHER DISPATCH
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" id="details-inquiry-form">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#050505] border border-[#2A2A2A] rounded py-2 px-3 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                      id="inquiry-form-name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Private Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="vip@clientmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#050505] border border-[#2A2A2A] rounded py-2 px-3 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                        id="inquiry-form-email"
                      />
                    </div>

                    {/* Private Contact Number */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#050505] border border-[#2A2A2A] rounded py-2 px-3 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                        id="inquiry-form-phone"
                      />
                    </div>
                  </div>

                  {/* Message Detail Box */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Message</label>
                    <textarea placeholder="Hi, I'm interested in this vehicle. Please contact me with more details."
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#050505] border border-[#2A2A2A] rounded py-2 px-3 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans leading-[1.7] resize-none"
                      id="inquiry-form-message"
                    ></textarea>
                  </div>

                  {/* Submission dispatch */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] disabled:border-gray-800 disabled:text-[#8A8A8A] disabled:shadow-none font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                    id="inquiry-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>DISPATCHING BRIEF...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-black" />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-[#2A2A2A]/50 pt-6">
                <a
                  href="tel:+919642096476"
                  className="flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded text-[14px] font-sans font-medium tracking-[0.15em] uppercase transition-all border border-[#2A2A2A]"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/919642096476?text=${encodeURIComponent(`Hi Bharat Cars, I am interested in vehicle ${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.price}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded text-[14px] font-sans font-medium tracking-[0.15em] uppercase transition-all border border-emerald-500/30"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ZoomLightbox
        images={vehicle.images}
        initialIndex={activeIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

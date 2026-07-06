import { formatCurrency } from '../lib/utils';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, ChevronLeft, ChevronRight, Instagram, Facebook, Youtube, MapPin, Send, Check, ShieldCheck, Clock } from 'lucide-react';
import { Vehicle, Enquiry, GalleryItem } from '../types';
import { useSiteSettings } from '../lib/SiteSettingsContext';

interface HomeViewProps {
  vehicles: Vehicle[];
  galleryItems: GalleryItem[];
  setView: (view: string) => void;
  setSelectedVehicleId: (id: string) => void;
  onAddEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => void;
}

export default function HomeView({ vehicles, galleryItems, setView, setSelectedVehicleId, onAddEnquiry }: HomeViewProps) {
  const { settings } = useSiteSettings();
  const scrollRef = useRef<HTMLDivElement>(null);
  const customerScrollRef = useRef<HTMLDivElement>(null);

  const [homeFormData, setHomeFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredTime: 'Morning',
  });
  const [homeSubmitting, setHomeSubmitting] = useState(false);
  const [homeSubmitted, setHomeSubmitted] = useState(false);
  const [priceFilter, setPriceFilter] = useState('Any Price');

  const filteredVehicles = React.useMemo(() => {
    if (priceFilter === 'Any Price') return vehicles;
    return vehicles.filter(v => {
      const price = v.price || 0;
      if (priceFilter === 'Under ₹5 Lakh') return price < 500000;
      if (priceFilter === '₹5 Lakh – ₹10 Lakh') return price >= 500000 && price <= 1000000;
      if (priceFilter === '₹10 Lakh – ₹20 Lakh') return price > 1000000 && price <= 2000000;
      if (priceFilter === '₹20 Lakh – ₹50 Lakh') return price > 2000000 && price <= 5000000;
      if (priceFilter === 'Above ₹50 Lakh') return price > 5000000;
      return true;
    });
  }, [vehicles, priceFilter]);

  const handleHomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeFormData.name || !homeFormData.email || !homeFormData.phone) return;

    setHomeSubmitting(true);
    setTimeout(() => {
      onAddEnquiry({
        name: homeFormData.name,
        email: homeFormData.email,
        phone: homeFormData.phone,
        message: `${homeFormData.message} [Preferred Contact: ${homeFormData.preferredTime}]`,
      });
      setHomeSubmitting(false);
      setHomeSubmitted(true);
      setHomeFormData({ name: '', email: '', phone: '', message: '', preferredTime: 'Morning' });
    }, 1200);
  };

  const formatPrice = (price: number) => {
    return formatCurrency(price || 0);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollCustomers = (direction: 'left' | 'right') => {
    if (customerScrollRef.current) {
      const { clientWidth } = customerScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      customerScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };



  return (
    <div className="bg-transparent text-white selection:bg-red-500 selection:text-black" id="home-view-container">
      
      {/* Hero Section - No Background Image, Custom Solid Color and Grid Layout */}
      <div className="relative min-h-[85vh] flex items-center bg-[#050505] overflow-hidden py-16 md:py-24" id="home-hero">
        
        {/* Elite Ambient Glow Accents */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-[110px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center" id="hero-grid-layout">
            
            {/* Left Half: Elegant Content */}
            <div className="space-y-10 text-left flex flex-col items-start justify-center" id="hero-left-content">
              
                            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded bg-white/5 border border-[#2A2A2A] backdrop-blur-md"
                id="hero-badge"
              >
                <Sparkles className="h-4 w-4 text-red-500 animate-pulse" />
                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase">Buying & Selling</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[46px] sm:text-[56px] md:text-[68px] font-serif font-bold text-white leading-[1.1] tracking-tight uppercase"
                id="hero-title"
              >
                Find Your Perfect Car <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 font-serif">
                  Today
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl text-[16px] text-[#BDBDBD] font-sans font-normal leading-[1.7]"
                id="hero-desc"
              >
                Welcome to Bharat Cars, Madanapalle. We offer quality pre-owned cars with trusted service, fair prices, and a smooth buying experience.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
                id="hero-actions"
              >
                <button
                  onClick={() => setView('inventory')}
                  className="group flex items-center justify-center space-x-3 px-8 py-4 bg-[#050505] border border-red-500 text-white hover:bg-red-500 hover:text-white hover:border-red-400 hover:shadow-[0_0_20px_rgba(200,16,46,0.5)] font-sans font-semibold text-[16px] rounded-full tracking-[0.15em] uppercase transition-all duration-300 w-full sm:w-[240px] whitespace-nowrap cursor-pointer"
                  id="hero-btn-inventory"
                >
                  <span>Explore Cars</span>
                  <ArrowUpRight className="h-5 w-5 text-red-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button
                  onClick={() => setView('contact')}
                  className="group flex items-center justify-center space-x-3 px-8 py-4 bg-transparent hover:bg-white text-white hover:text-black border border-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] font-sans font-semibold text-[16px] rounded-full tracking-[0.15em] uppercase transition-all duration-300 backdrop-blur-md w-full sm:w-[240px] whitespace-nowrap cursor-pointer"
                  id="hero-btn-contact"
                >
                  <span>Get Directions</span>
                  <MapPin className="h-5 w-5 text-white group-hover:text-black group-hover:translate-y-[-2px] transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Right Half: Official Brand Logo Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center md:justify-end"
              id="hero-right-logo"
            >
              <div className="relative w-[270px] h-[270px] sm:w-[410px] sm:h-[410px] md:w-[500px] md:h-[500px] flex items-center justify-center group transition-all duration-700">
                {/* Logo Image */}
                <img 
                  src={settings.logoUrl} 
                  onError={(e) => {
                    // Fallback to logo.png
                    e.currentTarget.src = "/logo.png";
                  }}
                  alt={settings.seoTitle} 
                  className="relative w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(200,16,46,0.2)] group-hover:scale-[1.04] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>




      {/* Interactive Horizontal Scrolling Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#2A2A2A]" id="home-featured-section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">OUR COLLECTION</span>
            <h2 className="text-[34px] sm:text-[52px] font-serif font-bold tracking-tight text-white" id="featured-section-title">
              Explore Our Cars
            </h2>
          </div>
          
          <div className="flex items-center space-x-4 mt-2 sm:mt-0" id="featured-controls-container">
            {/* Price Filter */}
            <div className="hidden sm:flex items-center space-x-2">
              {['Any Price', 'Under ₹5 Lakh', '₹5 Lakh – ₹10 Lakh', '₹10 Lakh – ₹20 Lakh', '₹20 Lakh – ₹50 Lakh', 'Above ₹50 Lakh'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriceFilter(filter)}
                  className={`px-3 py-1.5 text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider rounded border transition-all ${
                    priceFilter === filter 
                      ? 'bg-red-500 text-black border-red-500' 
                      : 'bg-transparent text-[#BDBDBD] border-[#2A2A2A] hover:border-red-500/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Slide Buttons Removed as per request */}

            <button 
              onClick={() => setView('inventory')}
              className="flex items-center space-x-2 text-[13px] font-sans font-medium tracking-[0.15em] tracking-wider text-red-500 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 px-4 py-2.5 rounded transition-all group cursor-pointer"
              id="featured-view-all-btn"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile Price Filter */}
        <div className="flex sm:hidden overflow-x-auto space-x-2 mb-6 pb-2 scrollbar-none">
          {['Any Price', 'Under ₹5 Lakh', '₹5 Lakh – ₹10 Lakh', '₹10 Lakh – ₹20 Lakh', '₹20 Lakh – ₹50 Lakh', 'Above ₹50 Lakh'].map((filter) => (
            <button
              key={filter}
              onClick={() => setPriceFilter(filter)}
              className={`px-4 py-2 text-[14px] whitespace-nowrap font-sans tracking-wider rounded border transition-all ${
                priceFilter === filter 
                  ? 'bg-red-500 text-black border-red-500' 
                  : 'bg-transparent text-[#BDBDBD] border-[#2A2A2A]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Carousel Container with Touch Swipe & Smooth Scroll */}
        <div className="relative w-full overflow-visible" id="carousel-track-wrapper">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-8 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
            id="featured-car-carousel"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredVehicles.length === 0 ? (
              <div className="w-full flex items-center justify-center py-20 min-w-full">
                <div className="text-center space-y-4">
                  <p className="text-xl font-serif text-white">No cars found in this price range.</p>
                  <button onClick={() => setPriceFilter('Any Price')} className="text-red-500 hover:text-red-400 font-sans text-sm underline tracking-wider uppercase cursor-pointer">View all cars</button>
                </div>
              </div>
            ) : (
            filteredVehicles.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.3) }}
                className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500 group flex-none w-[300px] sm:w-[350px] md:w-[380px] snap-start"
                id={`featured-card-${vehicle.id}`}
              >
                {/* Image Container with Hover zoom */}
                <div 
                  className="relative h-56 sm:h-64 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedVehicleId(vehicle.id);
                    setView('vehicle-details');
                  }}
                  id={`featured-img-${vehicle.id}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src={vehicle.images[0]} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#050505]/85 backdrop-blur-md border border-[#2A2A2A] rounded text-[13px] font-sans font-medium tracking-[0.15em] tracking-[0.15em] text-red-500 uppercase">
                    {vehicle.year} MODEL
                  </span>
                </div>

                {/* Specs & Pricing */}
                <div className="p-6 space-y-4" id={`featured-content-${vehicle.id}`}>
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedVehicleId(vehicle.id);
                      setView('vehicle-details');
                    }}
                    id={`featured-title-${vehicle.id}`}
                  >
                    <h3 className="text-[32px] font-serif font-bold text-white group-hover:text-red-500 transition-colors uppercase leading-[1.2]">
                      {vehicle.make}
                    </h3>
                    <p className="text-[14px] font-sans font-normal text-[#BDBDBD] tracking-wide mt-0.5">
                      {vehicle.model}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] py-4 border-y border-[#2A2A2A]">
                    <span>{vehicle.transmission}</span>
                    <span>•</span>
                    <span>{vehicle.fuel_type}</span>
                    <span>•</span>
                    <span>{(vehicle.mileage || 0).toLocaleString()} KM</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[20px] font-sans font-bold text-red-500">
                      {formatPrice(vehicle.price)}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedVehicleId(vehicle.id);
                        setView('vehicle-details');
                      }}
                      className="p-3 bg-white/5 group-hover:bg-red-500 text-white group-hover:text-black rounded border border-[#2A2A2A] group-hover:border-transparent transition-all duration-300 cursor-pointer"
                      id={`featured-action-${vehicle.id}`}
                      aria-label="View Details"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )))}
          </div>
        </div>
      </div>

      {/* Happy Customers Gallery Section */}
      <div className="bg-[#050505] py-24 border-t border-[#2A2A2A]" id="home-customers-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">OUR DELIVERIES</span>
              <h2 className="text-[34px] sm:text-[52px] font-serif font-bold tracking-tight text-white" id="customers-section-title">
                Happy Customers
              </h2>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0" id="customers-controls-container">
              {/* Interactive Slide Left & Right Buttons */}
              <button 
                onClick={() => scrollCustomers('left')}
                className="p-2.5 bg-[#111111] hover:bg-red-500 text-red-500 hover:text-black border border-[#2A2A2A] hover:border-transparent rounded transition-all duration-300 cursor-pointer"
                id="customers-slide-left-btn"
                aria-label="Slide Left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scrollCustomers('right')}
                className="p-2.5 bg-[#111111] hover:bg-red-500 text-red-500 hover:text-black border border-[#2A2A2A] hover:border-transparent rounded transition-all duration-300 cursor-pointer"
                id="customers-slide-right-btn"
                aria-label="Slide Right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Carousel Container with Touch Swipe & Smooth Scroll */}
          <div className="relative w-full overflow-visible" id="customers-carousel-track-wrapper">
            <div 
              ref={customerScrollRef}
              className="flex overflow-x-auto gap-8 pb-8 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
              id="customers-carousel"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {galleryItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.3) }}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500 group flex-none w-[300px] sm:w-[350px] md:w-[380px] snap-start aspect-[4/3]"
                  id={`customer-card-${item.id}`}
                >
                  {/* Image Container with Hover zoom */}
                  <div className="relative w-full h-full overflow-hidden" id={`customer-img-wrapper-${item.id}`}>
                    <img 
                      src={item.image_url} 
                      alt={item.description || 'Gallery Delivery'} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Follow Us / Social Channels Section */}
      <div className="bg-[#050505] py-16 border-t border-[#2A2A2A]" id="home-social-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">CONNECT WITH THE VAULT</span>
            <h2 className="text-[34px] sm:text-[42px] font-serif font-bold tracking-tight text-white uppercase">
              Follow Our Journey
            </h2>
            <p className="text-[14px] sm:text-[16px] text-[#BDBDBD] font-sans font-normal leading-[1.7]">
              Experience the ultra-luxury automotive lifestyle and catch live updates from our private showrooms on our official social media channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto" id="social-buttons-grid">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/bharatcarsmadanapalle/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-lg border border-[#2A2A2A]/50 bg-gradient-to-r from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10 hover:from-[#833ab4]/20 hover:via-[#fd1d1d]/20 hover:to-[#fcb045]/20 transition-all duration-300 group cursor-pointer"
              id="instagram-social-btn"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white">
                  <Instagram className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">INSTAGRAM</span>
                  <span className="text-[16px] font-sans font-medium text-white tracking-wide">@BharatCars</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#8A8A8A] group-hover:text-white transition-colors" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/bharatcarsmadanapalle/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-lg border border-[#2A2A2A]/50 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-all duration-300 group cursor-pointer"
              id="facebook-social-btn"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded bg-[#1877F2] text-white">
                  <Facebook className="h-5 w-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">FACEBOOK</span>
                  <span className="text-[16px] font-sans font-medium text-white tracking-wide">@BharatCars</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#8A8A8A] group-hover:text-white transition-colors" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@Bharatcarsmadanapalle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-lg border border-[#2A2A2A]/50 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 transition-all duration-300 group cursor-pointer"
              id="youtube-social-btn"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded bg-[#FF0000] text-white">
                  <Youtube className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase tracking-[0.15em] block">YOUTUBE</span>
                  <span className="text-[16px] font-sans font-medium text-white tracking-wide">Bharat Cars</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#8A8A8A] group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Bharat Cars Section in Home Page */}
      <div className="bg-black py-24 border-t border-[#2A2A2A]" id="home-concierge-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#2A2A2A] pb-8 mb-12 text-center max-w-2xl mx-auto space-y-2" id="concierge-header">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">GET IN TOUCH</span>
            <h2 className="text-[34px] sm:text-[52px] font-serif font-bold tracking-tight text-white uppercase">
              Contact Bharat Cars
            </h2>
            <p className="text-[16px] text-[#BDBDBD] font-sans font-normal mt-2 leading-[1.7]">
              Looking for your next car? We're here to help. Contact us by phone, WhatsApp, or visit our showroom in Madanapalle. Our team is ready to answer your questions and help you find the right vehicle.
            </p>
          </div>

          {/* Contact Page Grid - 50/50 Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="concierge-main-grid">
            
            {/* Left Column: Live Google Map & Salon Coordinates (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-6 flex flex-col" id="concierge-map-panel">
              {/* Live Interactive Map Card */}
              <div className="relative bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-hidden flex-1 min-h-[400px] flex flex-col" id="concierge-live-map-card">
                {/* Map Title/Header */}
                <div className="p-4 bg-white/[0.02] border-b border-[#2A2A2A]/50 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-white uppercase">Live Showroom Location</span>
                  </div>
                  <a 
                    href={settings.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 px-3 py-1.5 rounded transition-all"
                    id="concierge-get-directions-btn"
                  >
                    <span>GET DIRECTIONS</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                
                {/* Actual Map Iframe - Styled dark and elegant */}
                <div className="flex-1 relative w-full min-h-[300px]">
                <a href={settings.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label="Open in Google Maps"></a>
                <iframe
                  src={settings.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Bharat Cars Location"
                />
              </div>
              </div>

              {/* Coordinates / Brief Details below map */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0" id="concierge-map-details-grid">
                <div className="p-5 bg-[#111111] border border-[#2A2A2A] rounded space-y-1">
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase tracking-[0.15em] block">Bharat Cars</span>
                  <p className="text-[16px] text-white font-sans font-semibold uppercase font-serif">{settings.seoTitle.split('|')[0]}</p>
                  <p className="text-[14px] font-sans font-normal text-[#BDBDBD]">{settings.address}</p>
                </div>
                <div className="p-5 bg-[#111111] border border-[#2A2A2A] rounded space-y-1">
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase tracking-[0.15em] block">Direct Communications</span>
                  <p className="text-[16px] text-white font-sans font-semibold">{settings.phone1}</p>
                  <p className="text-[14px] font-sans font-normal text-[#BDBDBD]">{settings.email}</p>
                </div>
              </div>

              {/* Assurance Badges */}
              <div className="flex items-center space-x-3 text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] p-2 shrink-0" id="concierge-assurance">
                <ShieldCheck className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span></span>
              </div>
            </div>

            {/* Right Column: Secure Enquiry Form Card (lg:col-span-6) */}
            <div className="lg:col-span-6" id="concierge-form-panel">
              <div className="bg-[#111111] border border-[#2A2A2A] rounded p-8 space-y-6 shadow-2xl h-full flex flex-col justify-between" id="concierge-form-box">
                <div>
                  <div className="border-b border-[#2A2A2A]/50 pb-4 mb-6">
                    <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 tracking-[0.15em] uppercase block">SECURE DISPATCH HANDLER</span>
                    <h3 className="text-[28px] font-serif font-semibold text-white uppercase mt-0.5">SEND ENQUIRY</h3>
                  </div>

                  {homeSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 border border-red-500/30 p-8 rounded text-center space-y-4 my-8"
                      id="concierge-success-message"
                    >
                      <div className="mx-auto w-12 h-12 rounded bg-red-500 flex items-center justify-center">
                        <Check className="h-6 w-6 text-black stroke-[3px]" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-red-500 uppercase tracking-wider">DISPATCH SECURED</h4>
                        <p className="text-[14px] font-sans font-normal text-[#BDBDBD] mt-2 leading-[1.7] font-normal">
                          Your acquisitions dossier has been transmitted. Our lead Salon Concierge will contact you via your preferred communication method shortly to confirm details.
                        </p>
                      </div>
                      <button
                        onClick={() => setHomeSubmitted(false)}
                        className="px-6 py-2.5 bg-black text-white rounded text-[14px] font-sans font-semibold tracking-[0.15em] uppercase border border-red-500 hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] transition-all cursor-pointer"
                        id="concierge-submit-another-btn"
                      >
                        DISPATCH NEW ENQUIRY
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleHomeSubmit} className="space-y-5" id="concierge-direct-form">
                      {/* Client Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Client Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Maharaja Ranjit Singh"
                          value={homeFormData.name}
                          onChange={(e) => setHomeFormData({ ...homeFormData, name: e.target.value })}
                          className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                          id="concierge-form-name"
                        />
                      </div>

                      {/* Grid Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Client Email</label>
                          <input
                            type="email"
                            required
                            placeholder="vip@clientmail.com"
                            value={homeFormData.email}
                            onChange={(e) => setHomeFormData({ ...homeFormData, email: e.target.value })}
                            className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                            id="concierge-form-email"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Client Telephone</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 XXXXX XXXXX"
                            value={homeFormData.phone}
                            onChange={(e) => setHomeFormData({ ...homeFormData, phone: e.target.value })}
                            className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                            id="concierge-form-phone"
                          />
                        </div>
                      </div>

                      {/* Preferred Time for Callback */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Preferred Callback Window</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Morning', 'Afternoon', 'Evening'].map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setHomeFormData({ ...homeFormData, preferredTime: time })}
                              className={`py-2.5 rounded text-[14px] font-sans tracking-wide text-center border transition-all ${
                                homeFormData.preferredTime === time
                                  ? 'border-red-500 bg-red-500/10 text-red-400'
                                  : 'border-[#2A2A2A] bg-[#050505] text-[#BDBDBD] hover:text-white'
                              }`}
                              id={`concierge-pref-time-${time}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message Detail */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Commission / Procurement Brief</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Describe your requested automotive specifications, preferred color codes, bespoke customization desires, or showroom viewing scheduling preferences."
                          value={homeFormData.message}
                          onChange={(e) => setHomeFormData({ ...homeFormData, message: e.target.value })}
                          className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans leading-[1.7] resize-none"
                          id="concierge-form-message"
                        ></textarea>
                      </div>

                      {/* Dispatch Button */}
                      <button
                        type="submit"
                        disabled={homeSubmitting}
                        className="w-full py-4 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] disabled:border-gray-800 disabled:text-[#8A8A8A] disabled:shadow-none font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                        id="concierge-submit-btn"
                      >
                        {homeSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>SECURING DISPATCH ROUTE...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>SEND ENQUIRY</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

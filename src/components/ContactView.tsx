/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Check, ShieldCheck, Clock, ArrowUpRight } from 'lucide-react';
import { Enquiry } from '../types';
import { useSiteSettings } from '../lib/SiteSettingsContext';

interface ContactViewProps {
  onAddEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => void;
}

export default function ContactView({ onAddEnquiry }: ContactViewProps) {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredTime: 'Anytime',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.message} [Preferred Contact: ${formData.preferredTime}]`,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '', preferredTime: 'Anytime' });
    }, 1200);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12" id="contact-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#2A2A2A] pb-8 mb-12 text-center max-w-2xl mx-auto space-y-2" id="contact-header">
          <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">GET IN TOUCH</span>
          <h1 className="text-[42px] sm:text-[64px] font-serif font-bold tracking-tight text-white uppercase">
            Contact Bharat Cars
          </h1>
          <p className="text-[16px] text-[#BDBDBD] font-sans font-normal mt-2 leading-[1.7]">
            Looking for your next car? We're here to help. Contact us by phone, WhatsApp, or visit our showroom in Madanapalle. Our team is ready to answer your questions and help you find the right vehicle.
          </p>
        </div>

        {/* Contact Page Grid - 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="contact-main-grid">
          
          {/* Left Column: Live Google Map & Salon Coordinates (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col" id="contact-map-panel">
            {/* Live Interactive Map Card */}
            <div className="relative bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-hidden flex-1 min-h-[400px] flex flex-col" id="live-map-card">
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
                  id="get-directions-btn"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0" id="map-details-grid">
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
            <div className="flex items-center space-x-3 text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] p-2 shrink-0" id="contact-assurance">
              <ShieldCheck className="h-4.5 w-4.5 text-red-500 shrink-0" />
              <span></span>
            </div>
          </div>

          {/* Right Column: Secure Enquiry Form Card (lg:col-span-6) */}
          <div className="lg:col-span-6" id="contact-form-panel">
            <div className="bg-[#111111] border border-[#2A2A2A] rounded p-8 space-y-6 shadow-2xl h-full flex flex-col justify-between" id="contact-form-box">
              <div>
                <div className="border-b border-[#2A2A2A]/50 pb-4 mb-6">
                  <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 tracking-[0.15em] uppercase block">SECURE DISPATCH HANDLER</span>
                  <h3 className="text-[28px] font-serif font-semibold text-white uppercase mt-0.5">SEND ENQUIRY</h3>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/30 p-8 rounded text-center space-y-4 my-8"
                    id="contact-success-message"
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
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 bg-black text-white rounded text-[14px] font-sans font-semibold tracking-[0.15em] uppercase border border-red-500 hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] transition-all cursor-pointer"
                      id="contact-submit-another-btn"
                    >
                      DISPATCH NEW ENQUIRY
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" id="direct-contact-form">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Client Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Maharaja Ranjit Singh"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                        id="contact-form-name"
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
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                          id="contact-form-email"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase tracking-[0.15em]">Client Telephone</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans"
                          id="contact-form-phone"
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
                            onClick={() => setFormData({ ...formData, preferredTime: time })}
                            className={`py-2.5 rounded text-[14px] font-sans tracking-wide text-center border transition-all ${
                              formData.preferredTime === time
                                ? 'border-red-500 bg-red-500/10 text-red-400'
                                : 'border-[#2A2A2A] bg-[#050505] text-[#BDBDBD] hover:text-white'
                            }`}
                            id={`contact-pref-time-${time}`}
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
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#050505] border border-white/15 rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors font-sans leading-[1.7] resize-none"
                        id="contact-form-message"
                      ></textarea>
                    </div>

                    {/* Dispatch Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] disabled:border-gray-800 disabled:text-[#8A8A8A] disabled:shadow-none font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                      id="contact-submit-btn"
                    >
                      {isSubmitting ? (
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
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Car, Mail, Phone, MapPin, ShieldAlert, Award, Star } from 'lucide-react';
import { useSiteSettings } from '../lib/SiteSettingsContext';

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-[#050505] border-t border-[#2A2A2A] text-[#BDBDBD] font-sans" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4" id="footer-brand-col">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
              <div className="border border-red-500/30 p-1.5 rounded bg-[#050505]">
                <img src={settings.logoUrl} alt="Logo" className="h-6 w-6 object-contain filter invert" onError={(e) => { e.currentTarget.style.display='none'; }} />
                {!settings.logoUrl && <Car className="h-5 w-5 text-red-500" />}
              </div>
              <span className="font-serif font-bold text-[24px] tracking-[0.12em] text-red-500 uppercase">
                {settings.seoTitle.split('|')[0]}
              </span>
            </div>
            <p className="text-[16px] font-sans font-normal text-[#8A8A8A] leading-[1.7]">
              {settings.seoDescription}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div id="footer-links-col">
            <h3 className="text-[13px] font-sans font-medium uppercase tracking-[0.15em] text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-[16px] font-sans font-normal leading-[1.7]">
              <li>
                <button onClick={() => setView('home')} className="hover:text-red-500 transition-colors" id="footer-home-btn">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setView('inventory')} className="hover:text-red-500 transition-colors" id="footer-inventory-btn">
                  Inventory
                </button>
              </li>
              <li>
                <button onClick={() => setView('gallery')} className="hover:text-red-500 transition-colors" id="footer-gallery-btn">
                  Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setView('contact')} className="hover:text-red-500 transition-colors" id="footer-contact-btn">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-3 text-[16px] font-sans font-normal leading-[1.7]" id="footer-contact-col">
            <h3 className="text-[13px] font-sans font-medium uppercase tracking-[0.15em] text-white mb-4">Contact</h3>
            <div className="flex items-center space-x-3 text-[#BDBDBD]">
              <Phone className="h-4 w-4 text-red-500 shrink-0" />
              <a href={`tel:${settings.phone1.replace(/\s+/g, '')}`} className="hover:text-red-500 transition-colors">{settings.phone1}</a>
            </div>
            {settings.phone2 && (
              <div className="flex items-center space-x-3 text-[#BDBDBD]">
                <Phone className="h-4 w-4 text-red-500 shrink-0" />
                <a href={`tel:${settings.phone2.replace(/\s+/g, '')}`} className="hover:text-red-500 transition-colors">{settings.phone2}</a>
              </div>
            )}
            <div className="flex items-center space-x-3 text-[#BDBDBD]">
              <Phone className="h-4 w-4 text-red-500 shrink-0" />
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Bharat%20Cars,%0A%0AI%20am%20interested%20in%20one%20of%20your%20luxury%20vehicles.%0APlease%20share%20more%20details.`} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">WhatsApp</a>
            </div>
            <div className="flex items-center space-x-3 text-[#BDBDBD]">
              <Mail className="h-4 w-4 text-red-500 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-red-500 transition-colors break-all">{settings.email}</a>
            </div>
            <div className="flex items-start space-x-3 text-[#BDBDBD] mt-2 pt-2 border-t border-[#2A2A2A]/50">
              <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex flex-col space-y-1">
                <span>{settings.address}</span>
                <span className="text-[14px] font-sans font-normal text-[#8A8A8A] block mt-1">{settings.businessHoursWeekdays}</span>
                <span className="text-[14px] font-sans font-normal text-[#8A8A8A] block">{settings.businessHoursWeekend}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2A2A2A]/50 flex flex-col sm:flex-row items-center justify-between text-[14px] font-sans font-normal text-gray-600" id="footer-bottom">
          <div className="flex flex-col space-y-1 text-center sm:text-left">
            <p>© 2026 Bharat Cars.</p>
            <p>Designed & Developed by Kethan & Sufiyan</p>
            <p>Powered by Zenvix</p>
          </div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button onClick={() => setView('admin')} className="hover:text-red-500 transition-colors flex items-center space-x-1" id="footer-admin-login-btn">
              <Star className="h-3 w-3 text-red-500" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

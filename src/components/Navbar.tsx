/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Car, Menu, X, Shield, Image, PhoneCall, Home, Grid, Download } from 'lucide-react';
import { useSiteSettings } from '../lib/SiteSettingsContext';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Grid },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-[#2A2A2A]" id="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => { setView('home'); setIsOpen(false); }}
            id="nav-logo-btn"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/15 blur-md rounded-full group-hover:bg-red-500/25 transition-all"></div>
              <div className="relative border border-red-500/30 p-1.5 rounded bg-[#050505]">
                <img src={settings.logoUrl} alt="Logo" className="h-7 w-7 object-contain filter invert transition-transform duration-300 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display='none'; }} />
                {!settings.logoUrl && <Car className="h-5 w-5 text-red-500" />}
              </div>
            </div>
            <div>
              <span className="font-serif font-bold text-[24px] tracking-[0.12em] text-red-500 uppercase block">
                {settings.seoTitle.split('|')[0]}
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1" id="nav-desktop-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'admin' && currentView.startsWith('admin'));
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-lg text-[17px] font-sans font-medium tracking-[0.02em] transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-red-600 border border-red-500 shadow-lg shadow-red-500/20'
                      : 'text-[#E0E0E0] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#BDBDBD] group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {/* Download App Button */}
            <a
              href="/bharat-cars-app.apk"
              download
              className="group flex items-center space-x-2 px-4 py-2 ml-2 rounded-lg text-[17px] font-sans font-medium tracking-[0.02em] transition-all duration-300 text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border border-red-500/50 shadow-lg shadow-red-500/20"
              id="nav-link-download-app"
            >
              <Download className="h-4 w-4 text-white" />
              <span>Get App</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#BDBDBD] hover:text-white hover:bg-white/5 transition-all border border-[#2A2A2A]/50"
              aria-label="Toggle Menu"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-[#2A2A2A] px-4 pt-2 pb-6 space-y-2" id="mobile-menu-container">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'admin' && currentView.startsWith('admin'));
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-[17px] font-sans font-medium tracking-[0.02em] transition-all ${
                  isActive
                    ? 'text-white bg-red-600 border-l-4 border-red-500'
                    : 'text-[#E0E0E0] hover:text-white hover:bg-white/5'
                }`}
                id={`nav-mobile-link-${item.id}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#BDBDBD]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          {/* Mobile Download App Button */}
          <a
            href="/bharat-cars-app.apk"
            download
            className="flex items-center space-x-3 w-full px-4 py-3 mt-4 rounded-lg text-[17px] font-sans font-medium tracking-[0.02em] transition-all text-white bg-gradient-to-r from-red-600 to-red-800 border-l-4 border-red-500"
            onClick={() => setIsOpen(false)}
            id="nav-mobile-link-download-app"
          >
            <Download className="h-5 w-5 text-white" />
            <span>Download Android App</span>
          </a>
        </div>
      )}
    </nav>
  );
}

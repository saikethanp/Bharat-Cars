/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, X, Image, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';
import ZoomLightbox from './ZoomLightbox';

interface GalleryViewProps {
  galleryItems: GalleryItem[];
}

export default function GalleryView({ galleryItems }: GalleryViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = galleryItems.map((item) => item.image_url);

  return (
    <div className="bg-black text-white min-h-screen py-12" id="gallery-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="border-b border-[#2A2A2A] pb-8 mb-12 text-center max-w-2xl mx-auto space-y-2" id="gallery-header">
          <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase block">OUR GALLERY</span>
          <h1 className="text-[42px] sm:text-[64px] font-serif font-bold tracking-tight text-white uppercase">
            Explore Our Collection
          </h1>
          <p className="text-[16px] text-[#BDBDBD] font-sans font-normal mt-2 leading-[1.7]">
            Explore our showroom and discover quality cars through our photo gallery
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-grid">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(200,16,46,0.1)] hover:-translate-y-2 transition-all duration-500"
              onClick={() => {
                setLightboxIndex(index);
              }}
              id={`gallery-card-${item.id}`}
            >
              {/* Image with zoom on hover */}
              <img
                src={item.image_url}
                alt="Showroom Masterpiece"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center z-20">
                  <ZoomIn className="h-10 w-10 text-white/70" />
              </div>

              {/* Gradient Bottom (Normal state) */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none group-hover:opacity-0 transition-opacity"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-Screen Immersive Zoom Lightbox Modal */}
      <ZoomLightbox
        images={images}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize, GripHorizontal } from 'lucide-react';

interface ZoomLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ZoomLightbox({ images, initialIndex = 0, isOpen, onClose }: ZoomLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync index when initialIndex changes or is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard events (left, right, escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && scale === 1) handleNext();
      if (e.key === 'ArrowLeft' && scale === 1) handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, scale, images]);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
      // Center zoom around click position roughly
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left - rect.width / 2;
        const clickY = e.clientY - rect.top - rect.height / 2;
        setPosition({ x: -clickX * 1.5, y: -clickY * 1.5 });
      }
    }
  };

  // Drag to pan image when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    // Boundary constraints for panning (based on zoom level)
    const maxPanX = (scale - 1) * 300;
    const maxPanY = (scale - 1) * 200;
    
    setPosition({
      x: Math.max(Math.min(newX, maxPanX), -maxPanX),
      y: Math.max(Math.min(newY, maxPanY), -maxPanY)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[200] flex flex-col items-center justify-between bg-black/98 backdrop-blur-xl select-none"
        id="zoom-lightbox-modal"
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-black/80 z-20">
          <div className="flex flex-col">
            <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase tracking-[0.15em]">Atelier Immersive View</span>
            <span className="text-[14px] font-sans font-normal text-[#BDBDBD] font-sans mt-0.5 uppercase">
              Image {currentIndex + 1} of {images.length}
            </span>
          </div>

          {/* Zoom Buttons and Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleZoomIn}
              className="p-2 border border-[#2A2A2A] hover:border-red-500 rounded-lg hover:bg-white/5 text-[#BDBDBD] hover:text-red-500 transition-all cursor-pointer"
              title="Zoom In"
              id="lightbox-zoom-in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              disabled={scale === 1}
              className="p-2 border border-[#2A2A2A] hover:border-red-500 rounded-lg hover:bg-white/5 text-[#BDBDBD] hover:text-red-500 transition-all disabled:opacity-30 disabled:hover:text-[#BDBDBD] disabled:hover:border-[#2A2A2A] cursor-pointer"
              title="Zoom Out"
              id="lightbox-zoom-out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={resetZoom}
              disabled={scale === 1 && position.x === 0 && position.y === 0}
              className="p-2 border border-[#2A2A2A] hover:border-red-500 rounded-lg hover:bg-white/5 text-[#BDBDBD] hover:text-red-500 transition-all disabled:opacity-30 disabled:hover:text-[#BDBDBD] disabled:hover:border-[#2A2A2A] cursor-pointer"
              title="Reset Position"
              id="lightbox-reset-zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <div className="h-5 w-px bg-white/10 mx-1"></div>

            <button
              onClick={onClose}
              className="p-2 border border-[#2A2A2A] hover:border-rose-500 rounded-lg hover:bg-rose-500/10 text-[#BDBDBD] hover:text-rose-400 transition-all cursor-pointer"
              title="Close Room"
              id="lightbox-close-btn"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Content Stage */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden p-4">
          
          {/* Previous Button */}
          {images.length > 1 && scale === 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-6 z-30 p-4 rounded-full border border-[#2A2A2A] bg-black/50 backdrop-blur-md text-white hover:bg-red-500 hover:text-black hover:border-transparent transition-all duration-300 transform -translate-y-1/2 top-1/2 cursor-pointer"
              id="lightbox-prev-btn"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Interactive Image Frame */}
          <div 
            className={`relative max-w-full max-h-full flex items-center justify-center ${
              scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            id="lightbox-stage"
          >
            <motion.img
              ref={imgRef}
              src={images[currentIndex]}
              alt="Atelier Showcase"
              className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain rounded-lg shadow-2xl origin-center select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              referrerPolicy="no-referrer"
              id="lightbox-active-img"
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && scale === 1 && (
            <button
              onClick={handleNext}
              className="absolute right-6 z-30 p-4 rounded-full border border-[#2A2A2A] bg-black/50 backdrop-blur-md text-white hover:bg-red-500 hover:text-black hover:border-transparent transition-all duration-300 transform -translate-y-1/2 top-1/2 cursor-pointer"
              id="lightbox-next-btn"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Bottom Interactive Navigation & Hint */}
        <div className="w-full flex flex-col items-center space-y-4 pb-8 pt-4 border-t border-white/[0.06] bg-black/80 z-20">
          
          {/* Zoom Instruction Badge */}
          <div className="flex items-center space-x-2 bg-white/5 border border-[#2A2A2A] rounded-full px-3 py-1">
            {scale > 1 ? (
              <>
                <GripHorizontal className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#E0E0E0] uppercase tracking-[0.15em]">
                  Hold left mouse click & drag to pan the canvas | {scale.toFixed(1)}x Zoom
                </span>
              </>
            ) : (
              <>
                <Maximize className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#E0E0E0] uppercase tracking-[0.15em]">
                  Double Click on image to trigger instant zoom
                </span>
              </>
            )}
          </div>

          {/* Dot Indicators */}
          {images.length > 1 && (
            <div className="flex items-center space-x-2" id="lightbox-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    resetZoom();
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-6 bg-red-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  id={`lightbox-dot-${idx}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}

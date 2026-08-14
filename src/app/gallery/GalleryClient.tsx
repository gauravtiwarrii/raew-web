"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
}

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

export default function GalleryClient({ initialItems }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ["ALL", ...Array.from(new Set(initialItems.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === "ALL"
      ? initialItems
      : initialItems.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <div className="space-y-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <Camera className="w-4 h-4 text-amber-400" />
          <span>Visual Showcase</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Factory & Machinery Gallery
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
          Explore photographs of our agricultural machinery manufacturing line, structural welding shop, quality testing process, and customer field handovers.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                isActive
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-all space-y-2"
          >
            <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-slate-950/80 text-white font-medium text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                {item.category}
              </span>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-gray-300 hover:text-white p-2 rounded-full bg-slate-900/80 border border-slate-700"
            aria-label="Close image lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white p-3 rounded-full bg-slate-900/80 border border-slate-700"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white p-3 rounded-full bg-slate-900/80 border border-slate-700"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full space-y-3">
            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
              <Image
                src={filteredItems[activeLightboxIndex].imageUrl}
                alt={filteredItems[activeLightboxIndex].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center text-white space-y-1">
              <h3 className="font-bold text-lg">
                {filteredItems[activeLightboxIndex].title}
              </h3>
              <p className="text-xs text-gray-400">
                {filteredItems[activeLightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

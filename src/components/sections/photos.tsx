"use client";

import Image from "next/image";
import { getPhotos } from "@/lib/contentful/client";
import SectionHeader from "@/components/ui/section-header";
import { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";

export default function PhotosAndImages() {
  const [seminarImages, setSeminarImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    getPhotos().then((r) => {
      const images = r.data.photosCollection.items
        .map((e) => e.photosCollection.items)
        .flat()
        .map((e) => e.url);
      setSeminarImages(images);
    });
  }, []);

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + seminarImages.length) % seminarImages.length);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % seminarImages.length);
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-white via-secondary/40 to-white py-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="px-8 lg:px-16 mb-12">
          <SectionHeader
            title={
              <>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Life
                </span>{" "}
                at i2i Technologies
              </>
            }
            subtitle="A glimpse into our vibrant learning environment and the amazing experiences of our students"
          />
        </div>

        <div className="px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {seminarImages.map((e, i) => (
            <div
              key={i}
              onClick={() => openModal(i)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-[280px] md:h-[320px]">
                <Image
                  src={e}
                  fill
                  alt={`Seminar photo ${i + 1}`}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Hover overlay with icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10"
            aria-label="Close"
          >
            <HiX className="w-6 h-6 text-white" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
            aria-label="Previous photo"
          >
            <HiChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
            aria-label="Next photo"
          >
            <HiChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Image Container */}
          <div 
            className="relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-[85vw] h-[70vh] md:w-[900px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <Image
                src={seminarImages[selectedIndex]}
                alt={`Seminar photo ${selectedIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 85vw, 900px"
              />
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
            {selectedIndex + 1} / {seminarImages.length}
          </div>
        </div>
      )}
    </section>
  );
}

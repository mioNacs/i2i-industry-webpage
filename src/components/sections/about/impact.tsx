'use client'

import Image from "next/image";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";

interface ImpactProps {
    stats: {
        value: string;
        key: string;
    }[];
    photos?: string[]; // Array of image URLs
}

export default function AboutImpact({ stats, photos = [] }: ImpactProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedIndex]);

    const openModal = (index: number) => {
        setSelectedIndex(index);
    };

    const closeModal = () => {
        setSelectedIndex(null);
    };

    const goToPrevious = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
        }
    };

    const goToNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % photos.length);
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <SectionHeader 
                    title={<>Our Impact on <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Students</span></>}
                    subtitle=""
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 max-w-6xl mx-auto mt-12 border border-gray-100 rounded-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-red-50/30">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-8 lg:py-12 hover:bg-white transition-colors duration-300 text-center">
                            <h4 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                                {stat.value}
                            </h4>
                            <p className="text-sm text-gray-500 font-medium">
                                {stat.key}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Description Text */}
                <div className="max-w-3xl mx-auto text-center mt-12 mb-16">
                     <p className="text-lg text-gray-600 leading-relaxed">
                        From the past year we have been helping students achieve their dreams and goals.
                        <br className="hidden md:block" />
                        Our curriculum is decided based on the individual and their career goals.
                    </p>
                </div>

                {/* Photos Grid */}
                {photos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                        {photos.map((url, i) => (
                            <AnimateOnScroll key={i} delay={i * 0.1}>
                                <div 
                                    className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                    onClick={() => openModal(i)}
                                >
                                    <Image
                                        src={url}
                                        alt={`Impact photo ${i + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    {/* Hover overlay with icon */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </AnimateOnScroll>
                        ))}
                    </div>
                )}
            </div>

            {/* Photo Modal */}
            {selectedIndex !== null && (
                <div 
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={closeModal}
                >
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 z-10"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 z-10 hidden md:flex"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 z-10 hidden md:flex"
                    aria-label="Next photo"
                >
                    <HiChevronRight className="w-8 h-8 text-white" />
                </button>

                {/* Image Container */}
                <div 
                    className="relative flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden shadow-2xl">
                    <Image
                        src={photos[selectedIndex]}
                        alt={`Impact photo ${selectedIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                        sizes="100vw"
                    />
                    </div>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
                    {selectedIndex + 1} / {photos.length}
                </div>
                </div>
            )}
        </section>
    )
}

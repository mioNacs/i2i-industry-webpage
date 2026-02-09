"use client";

import { getTestimonials } from "@/lib/contentful/client";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdStar } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import SectionHeader from "@/components/ui/section-header";

interface Testimonial {
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export default function Testimonials() {
  const [data, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTestimonial) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTestimonial]);

  const [sliderRef, instanceRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 450px)": {
        slides: { perView: 1, spacing: 16 },
      },
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 24 },
      },
    },
    loop: true,
    slides: { perView: 1, spacing: 20 },
  });

  useEffect(() => {
    getTestimonials()
      .then((e) => e.data.testimonialCollection.items)
      .then((e) =>
        e.map((i: any) => ({
          name: i.name,
          avatar: i.image.url,
          rating: i.rating,
          text: i.testimonial,
        }))
      )
      .then((items) => {
        setTestimonials(items);
        setIsLoading(false);
      });
  }, []);

  // Auto-play with pause-on-hover
  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        instanceRef.current?.next();
      }
    }, 4000);
  }, [isPaused, instanceRef]);

  useEffect(() => {
    if (data.length > 0) startAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [data, startAutoPlay]);

  return (
    <>
    <section className="w-full px-8 py-16 flex flex-col items-center bg-gradient-to-b from-white via-accent/5 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/3 to-primary/3 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <SectionHeader
          title={
            <>
              What Our{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Students
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-gray-600 font-semibold">
                Are Saying About Us
              </span>
            </>
          }
          subtitle={
            <>
              You learn today and earn tomorrow. Don&apos;t just take our word for it, see what others are saying! Experience the difference that sets us apart. Their{" "}
              <span className="font-semibold text-primary">success stories</span> speak volumes.
            </>
          }
        />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/50 rounded-2xl h-64 animate-pulse border border-gray-100"
            />
          ))}
        </div>
      )}

      {/* Testimonial Slider */}
      {data.length > 0 && (
        <div
          className="my-8 w-full py-8 px-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div ref={sliderRef} className="keen-slider">
            {data.map((t, i) => (
              <TestimonialCard key={i} data={t} onClick={() => setSelectedTestimonial(t)} />
            ))}
          </div>
        </div>
      )}

      {/* Slider Controls */}
      <div className="w-full flex justify-center gap-4">
        <button
          className="btn btn-circle bg-white border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white text-primary transition-all duration-300 shadow-md hover:shadow-xl"
          onClick={() => instanceRef.current?.prev()}
          aria-label="Previous testimonial"
        >
          <HiChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="btn btn-circle bg-gradient-to-r from-primary to-accent text-white border-0 hover:shadow-xl hover:scale-110 transition-all duration-300 shadow-lg"
          onClick={() => instanceRef.current?.next()}
          aria-label="Next testimonial"
        >
          <HiChevronRight className="w-6 h-6" />
        </button>
      </div>
      </div>
    </section>

      {/* Testimonial Modal */}
      {selectedTestimonial && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div 
            className="relative bg-white rounded-b-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Decorative Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 z-10"
              aria-label="Close modal"
            >
              <span className="text-2xl text-gray-600">&times;</span>
            </button>

            <div className="p-8 md:p-12 pt-12">
              {/* Quote Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <BiSolidQuoteAltLeft className="w-8 h-8 text-white" />
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-800 text-lg md:text-xl leading-relaxed mb-8 italic">
                "{selectedTestimonial.text}"
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-30" />
                  <div className="relative w-16 h-16 rounded-full ring-2 ring-primary/50">
                    <Image
                      alt={`${selectedTestimonial.name}'s photo`}
                      fill
                      sizes="64px"
                      src={selectedTestimonial.avatar}
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedTestimonial.name}
                  </h4>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, index) => (
                      <IoMdStar
                        key={selectedTestimonial.name + index}
                        className={`size-5 ${
                          index < selectedTestimonial.rating
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Verified Student
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TestimonialCard({ data, onClick }: { data: Testimonial; onClick: () => void }) {
  return (
    <div className="keen-slider__slide px-3 py-2">
      <div 
        onClick={onClick}
        className="group relative bg-white rounded-3xl border-2 border-accent hover:border-primary transition-all duration-300 h-full flex flex-col overflow-hidden cursor-pointer"
      >
        {/* Top Decorative Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl" />

        <div className="absolute inset-0 group-hover:scale-100 transition-all duration-300 pointer-events-none" />
        
        {/* Content Container */}
        <div className="relative p-6 md:p-8 flex flex-col h-full">
          {/* Quote Icon */}
          <div className="mb-4 flex items-start justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <BiSolidQuoteAltLeft className="w-6 h-6 text-white" />
            </div>
            {/* Stars */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, index) => (
                <IoMdStar
                  key={data.name + index}
                  className={`size-5 ${
                    index < data.rating
                      ? "text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Testimonial Text */}
          <div className="flex-1 mb-6">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-5">
              "{data.text}"
            </p>
          </div>

          {/* Gradient Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />

          {/* User Info */}
          <div className="flex items-center gap-4">
            {/* Avatar with Ring */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
              <div className="relative w-14 h-14 rounded-full ring-2 ring-gray-200 group-hover:ring-primary transition-all duration-300">
                <Image
                  alt={`${data.name}'s photo`}
                  fill
                  sizes="56px"
                  src={data.avatar}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            
            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <h4 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 truncate">
                {data.name}
              </h4>
              <p className="text-sm text-gray-500 font-medium">
                Verified Student
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Shine Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}

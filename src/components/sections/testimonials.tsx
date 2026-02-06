"use client";

import { getTestimonials } from "@/lib/contentful/client";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdStar } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

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

  const [sliderRef, instanceRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 450px)": {
        slides: { perView: 1, spacing: 10 },
      },
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 10 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 3, spacing: 16 },
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
    <section className="w-full px-8 py-16 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row gap-5 mb-8">
        <div className="flex-1">
          <h3 className="text-3xl md:text-4xl font-sans font-black capitalize text-center md:text-left">
            What our <span className="text-primary">Students</span>
            <br />
            are saying about us.
          </h3>
          <div className="divider divider-accent mx-auto md:mx-0 max-w-32"></div>
        </div>

        <p className="text-center flex-1 lg:text-start text-gray-600">
          You learn today and earn tomorrow. Don&apos;t just take our word for
          it, see what others are saying! Experience the difference that sets us
          apart. Their success stories speak volumes.
          <br />
          <br />
          See what our students are saying:
        </p>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Testimonial Slider */}
      {data.length > 0 && (
        <div
          className="my-8 flex justify-center w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div ref={sliderRef} className="keen-slider mx-0 md:mx-8">
            {data.map((t, i) => (
              <TestimonialCard key={i} data={t} />
            ))}
          </div>
        </div>
      )}

      {/* Slider Controls */}
      <div className="w-full flex justify-center gap-4">
        <button
          className="btn btn-circle btn-primary btn-outline"
          onClick={() => instanceRef.current?.prev()}
          aria-label="Previous testimonial"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
        <button
          className="btn btn-circle btn-primary"
          onClick={() => instanceRef.current?.next()}
          aria-label="Next testimonial"
        >
          <HiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

function TestimonialCard({ data }: { data: Testimonial }) {
  return (
    <div className="border bg-white px-8 py-6 keen-slider__slide rounded-xl hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className="size-12 relative overflow-hidden flex-shrink-0">
          <Image
            alt={`${data.name}'s photo`}
            fill
            sizes="48px"
            src={data.avatar}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <IoMdStar
                key={data.name + index}
                className={`size-5 ${
                  index < data.rating
                    ? "text-amber-500"
                    : "text-amber-500 opacity-20"
                }`}
              />
            ))}
          </div>
          <p className="mt-0.5 text-lg font-medium text-gray-900">
            {data.name}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-700 whitespace-normal break-words text-sm leading-relaxed line-clamp-6">
          {data.text}
        </p>
      </div>
    </div>
  );
}

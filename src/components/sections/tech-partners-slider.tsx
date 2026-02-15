"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface TechPartnersSliderProps {
  companies: string[];
}

export default function TechPartnersSlider({ companies }: TechPartnersSliderProps) {
  const validCompanies = companies.filter((c) => c && c.trim().length > 0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    rtl: false,
    slides: {
      perView: 2,
      spacing: 20,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 4, spacing: 10 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 5, spacing: 10 },
      },
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [instanceRef]);

  if (validCompanies.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
      {/* Label */}
      <div className="flex-shrink-0">
        <h3 className="text-xl md:text-3xl font-bold text-gray-800 whitespace-nowrap">
          Trusted By
        </h3>
      </div>

      {/* Slider */}
      <div className="flex-grow w-full overflow-hidden border-l-2 border-accent">
        <div key={validCompanies.join(',')} ref={sliderRef} className="keen-slider flex items-center">
          {validCompanies.map((company, index) => (
            <div key={`${company}-${index}`} className="keen-slider__slide flex justify-center items-center h-28 w-auto min-w-[160px]">
              <div className="relative w-full h-full">
                <Image
                  src={company}
                  alt={`Partner logo ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 33vw, 20vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

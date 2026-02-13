"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface TechPartnersSliderProps {
  companies: string[];
}

export default function TechPartnersSlider({ companies }: TechPartnersSliderProps) {
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

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full border-gray-200 bg-white">
      {/* Label */}
      <div className="flex-shrink-0">
        <h3 className="text-xl md:text-3xl font-bold text-gray-800 whitespace-nowrap">
          Trusted by
        </h3>
      </div>

      {/* Slider */}
      <div className="flex-grow w-full overflow-hidden">
        <div ref={sliderRef} className="keen-slider flex items-center">
          {companies.map((company, index) => (
            <div key={index} className="keen-slider__slide flex justify-center items-center h-28 w-auto min-w-[160px]">
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

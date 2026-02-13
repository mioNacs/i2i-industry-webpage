"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const CERTIFICATIONS = [
  { 
    name: "Startup India", 
    src: "/certifications/startup-india.png",
    width: 140,
    height: 50
  },
  { 
    name: "ISO 9001:2015", 
    src: "/certifications/iso-9001.png",
    width: 80,
    height: 80
  },
  { 
    name: "MSME", 
    src: "/certifications/msme.png",
    width: 80,
    height: 80
  },
  { 
    name: "Gem", 
    src: "/certifications/gem.png",
    width: 100,
    height: 60
  },
  { 
    name: "Startup India Hub", 
    src: "/certifications/startup-india-hub.png",
    width: 140,
    height: 60
  },
];

export default function Certifications() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "snap",
      rtl: false,
      slides: {
        perView: 2,
        spacing: 30,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 4, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 5, spacing: 25 },
        },
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000); // 2000ms interval as requested
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  return (
    <section className="w-full md:w-[80%] mx-auto py-10 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-0 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
          Certifications
        </h3>
        
        <div ref={sliderRef} className="keen-slider flex items-center grayscale-[0.3] border-l-2 border-accent hover:grayscale-0 transition-all duration-500">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.name} className="keen-slider__slide flex items-center justify-center h-20">
              <div className="relative w-full h-full flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <Image
                  src={cert.src}
                  alt={`${cert.name} Certification`}
                  width={cert.width}
                  height={cert.height}
                  className="object-contain h-12 md:h-16 w-auto max-w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

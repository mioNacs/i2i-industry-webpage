import { studentIcons } from "@/lib/student_assets";
import { IoMdStar } from "react-icons/io";
import Image from "next/image";
import { Section } from "@/components/ui/container";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import SectionHeader from "@/components/ui/section-header";

export default function Placements() {
  return (
    <section className="w-full bg-gradient-to-b from-white via-secondary/30 to-white py-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="px-8 lg:px-16 mb-12">
          <SectionHeader
            title={
              <>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Placements
                </span>{" "}
                of the Month
                <br />
                <span className="text-2xl md:text-4xl text-gray-600 font-semibold flex items-center justify-center gap-2">
                  <IoMdStar className="text-amber-400" />
                  <IoMdStar className="text-amber-400" />
                  <IoMdStar className="text-amber-400" />
                </span>
              </>
            }
            subtitle={
              <>
                We are proud to have placed{" "}
                <span className="font-semibold text-primary">numerous students</span> into their dream career paths.
              </>
            }
          />
        </div>

        {/* Enhanced Marquee with Pause on Hover */}
        <div className="my-12 w-full overflow-hidden">
          <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            {/* Original set */}
            {studentIcons.map((e, i) => (
              <div
                key={"student" + i}
                className="flex-shrink-0 group relative"
              >
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-primary/50 shadow-sm group-hover:shadow-xl transition-all duration-300 bg-white">
                  <Image
                    src={e.icon}
                    alt={`Placed student ${i + 1}`}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Bottom Accent Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </div>
            ))}
            {/* Duplicated set for seamless loop */}
            {studentIcons.map((e, i) => (
              <div
                key={"student-dup" + i}
                className="flex-shrink-0 group relative"
              >
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-primary/50 shadow-sm group-hover:shadow-xl transition-all duration-300 bg-white">
                  <Image
                    src={e.icon}
                    alt={`Placed student ${i + 1}`}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Bottom Accent Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Stats Badge */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-full backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                <span className="text-primary text-lg font-bold">{studentIcons.length}+</span> Students Placed This Month
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

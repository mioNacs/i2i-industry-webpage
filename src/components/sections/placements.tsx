import { studentIcons } from "@/lib/student_assets";
import { IoMdStar } from "react-icons/io";
import Image from "next/image";
import { Section } from "@/components/ui/container";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default function Placements() {
  return (
    <Section>
      <AnimateOnScroll>
        <h4 className="font-bold text-center text-3xl md:text-5xl">
          Placements of the month
        </h4>
      </AnimateOnScroll>

      <AnimateOnScroll delay={0.1}>
        <div className="flex gap-1 my-3">
          {[...Array(3)].map((_, i) => (
            <IoMdStar
              key={"placement" + i}
              className="text-amber-400 text-3xl"
            />
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={0.2}>
        <p className="mt-2 text-gray-600 text-center">
          We are proud to have placed numerous students into their dream career
          paths.
        </p>
      </AnimateOnScroll>

      {/* BUG FIX: Seamless marquee — items duplicated for translateX(-50%) */}
      <div className="my-12 w-full overflow-hidden">
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {/* Original set */}
          {studentIcons.map((e, i) => (
            <div
              key={"student" + i}
              className="flex-shrink-0 group"
            >
              <Image
                src={e.icon}
                alt={`Placed student ${i + 1}`}
                width={120}
                height={120}
                className="w-32 h-32 object-cover rounded-lg border border-primary/20 bg-primary/5 group-hover:border-primary group-hover:shadow-md transition-all duration-300"
              />
            </div>
          ))}
          {/* Duplicated set for seamless loop */}
          {studentIcons.map((e, i) => (
            <div
              key={"student-dup" + i}
              className="flex-shrink-0"
            >
              <Image
                src={e.icon}
                alt={`Placed student ${i + 1}`}
                width={120}
                height={120}
                className="w-32 h-32 object-cover rounded-lg border border-primary/20 bg-primary/5"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

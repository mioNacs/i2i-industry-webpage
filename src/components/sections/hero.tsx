import { getHeroSection } from "@/lib/contentful/client";
import Image from "next/image";
import { IoMdStar } from "react-icons/io";
import HeroImage from "../../../public/hero2.png";
import { ContactUsButton } from "@/components/forms/contact-form";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default async function Hero() {
  const response = await getHeroSection();
  const data = response.data.heroSectionCollection.items[0];
  const { title, subtitle, highlights } = data;

  return (
    <div className="w-screen bg-gradient-to-br from-white via-secondary/10 to-primary/5 flex flex-col lg:flex-row relative gap-6 md:gap-12 px-4 md:px-16 py-8 md:py-24">
      {/* Left Content */}
      <div className="relative items-center min-h-[24rem] flex-1 flex flex-col justify-center space-y-8 my-6">
        {/* Decorative circle */}
        <div className="absolute border border-primary/20 rounded-full aspect-video top-0 left-0 w-1/3 h-1/2 animate-pulse" />

        <AnimateOnScroll>
          <h1 className="text-4xl md:text-5xl font-bold font-sans leading-tight text-center capitalize">
            <HeroTitle title={title} highlights={highlights} />
          </h1>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150}>
          <p className="text-lg text-base-content/80 max-w-lg font-sans text-center">
            {subtitle}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={300}>
          <div className="flex flex-wrap gap-4 uppercase justify-center">
            <ContactUsButton />
            <ContactUsButton text="Book a Call" variant="outline" />
          </div>
        </AnimateOnScroll>
      </div>

      {/* Right Content */}
      <div className="relative flex-1 flex flex-col justify-center items-center">
        {/* Rating badge */}
        <AnimateOnScroll delay={200}>
          <div className="w-fit p-4 absolute -top-4 sm:top-4 bg-white/90 backdrop-blur-sm z-10 rounded-xl flex flex-col items-start shadow-xl border border-gray-100">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <IoMdStar
                    key={index}
                    className={`size-5 ${index < 4 ? "text-amber-500" : "text-amber-500 opacity-40"}`}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600 font-light">
                (1,498)
              </span>
            </div>
            <p className="mt-2 text-gray-900 font-medium tracking-wide text-sm">
              Trusted by 1000+ students
            </p>
          </div>
        </AnimateOnScroll>

        <Image
          width={632}
          height={404}
          src={HeroImage}
          alt="Student with thumbs up celebrating success"
          className="object-contain w-[632px] h-full"
          priority
        />
      </div>
    </div>
  );
}

/** Fixed: Uses JSX instead of raw HTML string with className */
function HeroTitle({
  title,
  highlights,
}: {
  title: string;
  highlights: string[];
}) {
  const words = title.split(/\s+/);
  return (
    <>
      {words.map((word, i) => {
        const isHighlighted = highlights.some(
          (h) => h.toLowerCase() === word.toLowerCase()
        );
        return (
          <span key={i}>
            {isHighlighted ? (
              <span className="text-primary">{word}</span>
            ) : (
              word
            )}{" "}
          </span>
        );
      })}
    </>
  );
}

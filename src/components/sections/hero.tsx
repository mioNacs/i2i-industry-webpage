import { getHeroSection } from "@/lib/contentful/client";
import Image from "next/image";
import Link from "next/link";
import { IoMdStar } from "react-icons/io";
import HeroImage from "../../../public/hero2.png";
import { ContactUsButton } from "@/components/forms/contact-form";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default async function Hero() {
  const response = await getHeroSection();
  const data = response.data.heroSectionCollection.items[0];
  const { title, subtitle, highlights } = data;

  return (
    <div className="w-screen relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-accent/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="relative flex flex-col lg:flex-row gap-8 min-h-[90vh] md:gap-16 px-4 md:px-16 py-12 max-w-[1400px] mx-auto">
        {/* Left Content */}
        <div className="relative flex-1 flex flex-col justify-center space-y-6 md:space-y-9 my-8 z-10">

          {/* Title */}
          <AnimateOnScroll delay={100}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-sans leading-tight text-center lg:text-left">
              <HeroTitle title={title} highlights={highlights} />
            </h1>
          </AnimateOnScroll>

          {/* Subtitle */}
          <AnimateOnScroll delay={200}>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-sans text-center lg:text-left leading-relaxed">
              {subtitle}
            </p>
          </AnimateOnScroll>

          {/* CTA Section */}
          <AnimateOnScroll delay={300}>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/auth/login"
                className="btn btn-lg px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white border-0 bg-accent flex items-center justify-center font-bold rounded-xl"
              >
                Start Your Journey
              </Link>
              <Link
                href="/course"
                className="btn border-none shadow-xl hover:shadow-2xl text-white bg-primary hover:bg-accent px-8 scale-105 hover:scale-110 transition-all duration-200"
              >
                View Courses
              </Link>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Right Content */}
        <div className="relative flex-1 flex flex-col justify-center items-center z-10">
          {/* Floating Rating Card */}
          <AnimateOnScroll delay={200}>
            <div className="absolute -top-8 sm:top-8 left-4 sm:left-12 z-20 p-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/10 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <IoMdStar
                      key={index}
                      className={`w-5 h-5 ${index < 4 ? "text-amber-400" : "text-amber-400/40"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">4.8</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                1,498 Reviews
              </p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                Trusted by 1000+
              </p>
            </div>
          </AnimateOnScroll>

          {/* Main Image with decorative background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-6 scale-105 blur-2xl" />
            <Image
              width={632}
              height={404}
              src={HeroImage}
              alt="Student with thumbs up celebrating success"
              className="object-contain w-full max-w-[632px] h-auto relative z-10 drop-shadow-2xl"
              priority
            />
          </div>
        </div>
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
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-extrabold">
                {word}
              </span>
            ) : (
              <span className="text-gray-900">{word}</span>
            )}{" "}
          </span>
        );
      })}
    </>
  );
}

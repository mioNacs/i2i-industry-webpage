import { jobPartnerIcons, TypeIconData } from "@/lib/company_assets";
import Image from "next/image";
import { Section } from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default function JobPartners() {
  const first = jobPartnerIcons.slice(0, 25);
  const second = jobPartnerIcons.slice(25, 45);
  const third = jobPartnerIcons.slice(45, 65);
  const fourth = jobPartnerIcons.slice(65);

  return (
    <Section className="pt-0 bg-gradient-to-b from-white via-accent/5 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/3 to-primary/3 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        <SectionHeader
          title={
            <>
              Our Job{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Partners
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-gray-600 font-semibold">
                Help You Land Your Dream Job
              </span>
            </>
          }
          subtitle="We have 1250+ successful alumni working in top organizations across different companies which act as our alumni network."
        />

        <AnimateOnScroll>
          <div className="inline-flex items-center gap-2 border-2 border-accent text-accent bg-white px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            You can be the next one
          </div>
        </AnimateOnScroll>

        {/* Enhanced Marquee Container */}
        <div className="w-full bg-white border-2 border-accent rounded-2xl shadow-inner flex flex-col py-6">
          <MarqueeRow icons={first} reverse={false} />
          <MarqueeRow icons={second} reverse={true} />
          <MarqueeRow icons={third} reverse={false} />
          <MarqueeRow icons={fourth} reverse={true} />
        </div>
      </div>
    </Section>
  );
}

function MarqueeRow({
  icons,
  reverse,
}: {
  icons: TypeIconData[];
  reverse: boolean;
}) {
  const width = 450;
  const height = 50;

  return (
    <div className="w-full relative flex overflow-x-hidden items-center group">
      <div
        className={`py-6 ${
          reverse ? "animate-marquee2" : "animate-marquee"
        } group-hover:[animation-play-state:paused] whitespace-nowrap flex gap-8 md:gap-12`}
      >
        {/* Original set */}
        {icons.map((e, idx) => (
          <div
            key={e.name + idx}
            className="relative flex-shrink-0 group/logo transition-all duration-300 hover:scale-105 hover:z-10"
          >
            {/* Card Background with Glow */}
            <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 shadow-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-white to-accent/10 rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300" />
            
            {/* Logo Image */}
            <div className="relative border-2 border-accent hover:border-primary rounded-xl px-6 py-4 shadow-sm group-hover/logo:shadow-xl transition-all duration-300">
              <Image
                src={e.icon}
                width={width}
                height={height}
                alt={e.name}
                className="w-[180px] md:w-[220px] h-[36px] md:h-[44px] object-contain grayscale/50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        ))}
        {/* Duplicated set for seamless loop */}
        {icons.map((e, idx) => (
          <div
            key={e.name + "-dup" + idx}
            className="relative flex-shrink-0 group/logo transition-all duration-300 hover:scale-105 hover:z-10"
          >
            {/* Card Background with Glow */}
            <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 shadow-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-white to-accent/10 rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300" />
            
            {/* Logo Image */}
            <div className="relative border-2 border-accent hover:border-primary rounded-xl px-6 py-4 shadow-sm group-hover/logo:shadow-xl transition-all duration-300">
              <Image
                src={e.icon}
                width={width}
                height={height}
                alt={e.name}
                className="w-[180px] md:w-[220px] h-[36px] md:h-[44px] object-contain grayscale/50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

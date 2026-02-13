import { jobPartnerIcons, TypeIconData } from "@/lib/company_assets";
import Image from "next/image";
import { Section } from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default function JobPartners() {
  const first = jobPartnerIcons.slice(0, 30);
  const second = jobPartnerIcons.slice(30, 57);
  const third = jobPartnerIcons.slice(57);

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
            </>
          }
          subtitle="We have 1250+ successful alumni working in top organizations across different companies which act as our alumni network."
        />

        {/* Enhanced Marquee Container */}
        <div className="w-full flex flex-col py-4 mt-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <MarqueeRow icons={first} reverse={false} />
          <MarqueeRow icons={second} reverse={true} />
          <MarqueeRow icons={third} reverse={false} />
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
  const height = 150;

  return (
    <div className="w-full relative flex overflow-x-hidden items-center group">
      <div
        className={`py-4 ${
          reverse ? "animate-marquee2" : "animate-marquee"
        } group-hover:[animation-play-state:paused] whitespace-nowrap flex gap-8 md:gap-12`}
      >
        {/* Set 1 */}
        {icons.map((e, idx) => (
          <div
            key={e.name + idx + "-1"}
            className="relative flex-shrink-0 group/logo transition-all duration-300 hover:scale-110"
          >
              <Image
                src={e.icon}
                width={width}
                height={height}
                alt={e.name}
                className="w-auto h-[40px] md:h-[60px] object-contain grayscale-[0.2] group-hover/logo:grayscale-0 transition-all duration-300"
              />
          </div>
        ))}
        {/* Set 2 */}
        {icons.map((e, idx) => (
          <div
            key={e.name + idx + "-2"}
            className="relative flex-shrink-0 group/logo transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
          >
              <Image
                src={e.icon}
                width={width}
                height={height}
                alt={e.name}
                className="w-auto h-[50px] md:h-[80px] object-contain grayscale-[0.3] group-hover/logo:grayscale-0 transition-all duration-300"
              />
          </div>
        ))}
        {/* Set 3 */}
        {icons.map((e, idx) => (
          <div
            key={e.name + idx + "-3"}
            className="relative flex-shrink-0 group/logo transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
          >
              <Image
                src={e.icon}
                width={width}
                height={height}
                alt={e.name}
                className="w-auto h-[50px] md:h-[80px] object-contain grayscale-[0.3] group-hover/logo:grayscale-0 transition-all duration-300"
              />
          </div>
        ))}
        {/* Set 4 */}
        {icons.map((e, idx) => (
          <div
            key={e.name + idx + "-4"}
            className="relative flex-shrink-0 group/logo transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
          >
              <Image
                src={e.icon}
                width={width}
                height={height}
                alt={e.name}
                className="w-auto h-[50px] md:h-[80px] object-contain grayscale-[0.3] group-hover/logo:grayscale-0 transition-all duration-300"
              />
          </div>
        ))}
      </div>
    </div>
  );
}

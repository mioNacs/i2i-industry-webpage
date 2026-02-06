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
    <Section className="pt-0">
      <SectionHeader
        title={
          <>
            Our Job <span className="text-primary">Partners</span>
            <br />
            help you land your <span className="text-primary">dream job</span>
          </>
        }
        subtitle="We have 1250+ successful alumni working in top organizations across different companies which act as our alumni network."
      />

      <AnimateOnScroll>
        <div className="badge badge-primary p-4 font-semibold badge-lg my-4 mb-8">
          You can be the next one
        </div>
      </AnimateOnScroll>

      {/* BUG FIX: Seamless marquee — items duplicated + translateX(-50%) keyframe */}
      <div className="w-full bg-secondary/40 flex flex-col gap-2 py-4">
        <MarqueeRow icons={first} reverse={false} />
        <MarqueeRow icons={second} reverse={true} />
        <MarqueeRow icons={third} reverse={false} />
        <MarqueeRow icons={fourth} reverse={true} />
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
  const imgClass = "w-[450px] h-[50px] object-contain flex-shrink-0";

  return (
    <div className="w-full relative flex overflow-x-hidden items-center">
      <div
        className={`py-8 ${
          reverse ? "animate-marquee2" : "animate-marquee"
        } whitespace-nowrap flex gap-16`}
      >
        {/* Original set */}
        {icons.map((e) => (
          <Image
            src={e.icon}
            width={width}
            height={height}
            key={e.name}
            alt={e.name}
            className={imgClass}
          />
        ))}
        {/* Duplicated set for seamless loop */}
        {icons.map((e) => (
          <Image
            src={e.icon}
            width={width}
            height={height}
            key={e.name + "-dup"}
            alt={e.name}
            className={imgClass}
          />
        ))}
      </div>
    </div>
  );
}

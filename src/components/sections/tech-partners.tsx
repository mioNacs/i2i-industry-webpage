import { getTeachingPartners } from "@/lib/contentful/client";
import Image from "next/image";
import { Section } from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default async function TechPartners() {
  const data = await getTeachingPartners();
  if (!data) return null;

  const companies = data.data.teachingPartnersCollection.items
    .flatMap((e) => e.partnersCollection.items)
    .map((e) => e.url + "?w=203");

  return (
    <Section className="bg-white">
      <SectionHeader
        title={
          <>
            Our Big Tech <span className="text-primary">Partners</span>
            <br />
            help you to make right career choices
          </>
        }
        subtitle="Our instructors will not only make your fundamentals strong but also make you understand the real-time importance of the industries."
      />

      <AnimateOnScroll>
        {/* BUG FIX: opacity-6 → opacity-60 */}
        <div className="w-full my-8 flex justify-evenly flex-wrap opacity-60 gap-6 gap-y-4 md:gap-y-8">
          {companies.map((company, index) => (
            <Image
              key={index}
              alt="Tech partner logo"
              src={company}
              width={208}
              height={80}
              className="object-contain w-40 md:w-52 h-16 md:h-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>
      </AnimateOnScroll>
    </Section>
  );
}

import { getTeachingPartners } from "@/lib/contentful/client";
import Image from "next/image";
import { Section } from "@/components/ui/container";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import SectionHeader from "@/components/ui/section-header";
import { HiArrowRight } from "react-icons/hi";

export default async function TechPartners() {
  const data = await getTeachingPartners();
  if (!data) return null;

  const companies = data.data.teachingPartnersCollection.items
    .flatMap((e) => e.partnersCollection.items)
    .map((e) => e.url + "?w=203");

  return (
    <Section className="bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        <SectionHeader
          title={
            <>
              Our Big Tech{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Partners
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-gray-600 font-semibold">
                Help You Make Right Career Choices
              </span>
            </>
          }
          subtitle={
            <>
              Our instructors will not only make your fundamentals strong but also make you understand the{" "}
              <span className="font-semibold text-primary">real-time importance</span> of the industries.
            </>
          }
        />

        {/* Logo Grid */}
        <AnimateOnScroll delay={200}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {companies.map((company, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 will-change-transform"
              >
                {/* Enhanced Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-primary/5 to-transparent transition-all duration-500" />
                
                {/* Logo */}
                <div className="relative flex items-center justify-center h-16 md:h-20">
                  <Image
                    alt="Tech partner logo"
                    src={company}
                    width={208}
                    height={80}
                    className="object-contain w-full h-full grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Hover Border Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl" />
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}

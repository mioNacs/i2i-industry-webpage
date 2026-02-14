import { getTeachingPartners } from "@/lib/contentful/client";
import { Section } from "@/components/ui/container";
import TechPartnersSlider from "./tech-partners-slider";

export default async function TechPartners() {
  const data = await getTeachingPartners();
  
  const contentfulCompanies = data?.data?.teachingPartnersCollection?.items
    .flatMap((e) => e.partnersCollection.items)
    .map((e) => e.url + "?w=400") || [];

  const localCompanies = [
    "/partners/partner-1.png",
    "/partners/partner-2.png",
    "/partners/partner-3.png",
    "/partners/partner-5.png",
    "/partners/partner-6.png",
    "/partners/partner-7.png",
    "/partners/partner-8.png",
    "/partners/partner-9.png",
    "/partners/partner-10.png",
    "/partners/partner-11.png",
    "/partners/partner-12.png",
    "/partners/partner-14.png",
    "/partners/partner-15.png",
    "/partners/partner-16.png",
    "/partners/partner-17.png",
    "/partners/partner-18.png",
    "/partners/partner-19.png",
    "/partners/partner-21.png",
    "/partners/partner-22.png",
    "/partners/partner-23.png",
    "/partners/partner-25.png",
    "/partners/partner-26.png",
    "/partners/partner-27.png",
  ];

  const companies = [...contentfulCompanies, ...localCompanies];

  return (
    <Section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <TechPartnersSlider companies={companies} />
      </div>
    </Section>
  );
}



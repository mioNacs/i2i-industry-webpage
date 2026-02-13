import Hero from "@/components/sections/hero";
import HomeCTA from "@/components/sections/home-cta";
import StatsSection from "@/components/sections/stats";
import TechPartners from "@/components/sections/tech-partners";
import Courses from "@/components/sections/courses";
import WhyChooseUs from "@/components/sections/why-choose-us";
import JobPartners from "@/components/sections/job-partners";
import MentorSection from "@/components/sections/mentors";
import Testimonials from "@/components/sections/testimonials";
import PhotosAndImages from "@/components/sections/photos";
import FAQ from "@/components/sections/faq";
import Placements from "@/components/sections/placements";
import CTASection from "@/components/sections/cta-section";
import Certifications from "@/components/sections/certifications";

export default async function Home() {
  return (
    <div className="flex flex-col font-sans bg-gray-50/50 max-w-full overflow-x-hidden">
      <HomeCTA />
      <Hero />
      <StatsSection />
      <TechPartners />
      <Courses />
      <WhyChooseUs />
      <JobPartners />
      <MentorSection />
      <Testimonials />
      <PhotosAndImages />
      <FAQ />
      <Placements />
      <Certifications />
      <CTASection />
    </div>
  );
}

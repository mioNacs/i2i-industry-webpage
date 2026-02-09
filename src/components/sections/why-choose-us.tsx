import { getPreferredChoice } from "@/lib/contentful/client";
import { Section } from "@/components/ui/container";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import SectionHeader from "@/components/ui/section-header";
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLightBulb,
  HiOutlineUserGroup,
  HiCheckCircle,
} from "react-icons/hi";

const featureIcons = [
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLightBulb,
  HiOutlineUserGroup,
];

export default async function WhyChooseUs() {
  const response = await getPreferredChoice();
  const topFeatures = response.data.preferedChoiceCollection.items;

  return (
    <Section className="bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        <SectionHeader
          title={
            <>
              What Makes Us The{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Preferred
              </span>{" "}
              Choice?
            </>
          }
          subtitle={
            <>
              With an impressive history of delivering exceptional results and a steadfast commitment to our mentee's{" "}
              <span className="font-semibold text-primary">happiness and success stories</span>, we confidently stand out as the ultimate choice for your needs.
            </>
          }
          className="md:mb-16"
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {topFeatures.map((feature: any, index: number) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <AnimateOnScroll key={index} delay={index * 0.1}>
                <div className="group relative bg-white rounded-2xl border-2 border-accent hover:border-primary hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full cursor-pointer">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none" />
                  
                  <div className="relative p-4 md:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                    {/* Icon Container */}
                    <div className="mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors text-center">
                      {feature.title}
                    </h3>

                    {/* Hover Tooltip */}
                    <div className="absolute inset-x-0 bottom-full mb-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-gray-900 text-white text-sm p-4 rounded-xl shadow-2xl relative">
                        <p className="leading-relaxed">{feature.description}</p>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                          <div className="border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    
                   </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Bottom Stats/Trust Indicator */}
        <AnimateOnScroll delay={0.4}>
          <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">Certified</p>
                <p className="text-xs text-gray-500">Industry Recognized</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">Expert Mentors</p>
                <p className="text-xs text-gray-500">Industry Veterans</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">Job Ready</p>
                <p className="text-xs text-gray-500">Career Support</p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}

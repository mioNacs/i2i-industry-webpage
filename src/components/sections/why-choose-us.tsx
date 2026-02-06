import { getPreferredChoice } from "@/lib/contentful/client";
import { Section } from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLightBulb,
  HiOutlineUserGroup,
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
    <Section className="bg-white">
      <SectionHeader
        title={
          <>
            What makes us the <span className="text-primary">Preferred</span>{" "}
            choice?
          </>
        }
        subtitle="With an impressive history of delivering exceptional results and a steadfast commitment to our mentee's happiness and success stories, we confidently stand out as the ultimate choice for your needs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {topFeatures.map((feature: any, index: number) => {
          const Icon = featureIcons[index % featureIcons.length];
          return (
            <AnimateOnScroll key={index} delay={index * 0.1}>
              <div className="card card-bordered border-secondary bg-white group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="card-body p-4 space-y-4">
                  <div className="w-full flex flex-col gap-4 bg-gradient-to-tr from-primary/10 to-secondary/5 p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          );
        })}
      </div>
    </Section>
  );
}

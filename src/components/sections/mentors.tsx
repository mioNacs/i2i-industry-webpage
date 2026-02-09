import Image from "next/image";
import { getMentorData } from "@/lib/contentful/client";
import { MentorItem } from "@/lib/contentful/types/mentor";
import { BsLinkedin as LiIcon } from "react-icons/bs";
import Link from "next/link";
import { Section } from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default async function MentorSection() {
  const response = await getMentorData();
  const mentors = response.data.mentorCollection.items;

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
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Experienced Mentors
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-gray-600 font-semibold">
                Help You With Career Choices & Interviews
              </span>
            </>
          }
          subtitle={
            <>
              Multiple Career Oriented Sessions & Mock Interviews by{" "}
              <span className="font-semibold text-primary">Tech Experts</span>. These helped thousands of learners gain first-hand insights & guidance for their respective career trajectories.
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {mentors.map((e: any, i: number) => (
            <AnimateOnScroll key={"Mentor" + i} delay={i * 0.1}>
              <MentorCard item={e} />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={0.3}>
          <div className="mt-6 md:mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border-2 border-accent">
            <span className="text-xl font-bold text-accent">
              And Many More...
            </span>
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}

function MentorCard({ item }: { item: MentorItem }) {
  return (
    <div className="max-w-sm mx-auto w-full h-full">
      <Link href={item.linkedin} target="_blank" className="block h-full">
        <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 h-full flex flex-col will-change-transform">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500 pointer-events-none" />
          
          {/* Image Container */}
          <div className="relative w-full h-[280px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-2xl">
            {/* LinkedIn Badge */}
            <div className="absolute z-20 top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-lg group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <LiIcon className="size-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            
            {/* Mentor Photo */}
            <Image
              src={item.photo.url}
              alt={`${item.name} - Mentor`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
            />
          </div>
          
          {/* Content Container */}
          <div className="relative px-5 py-6 flex flex-col flex-1 bg-gradient-to-br from-white via-primary/3 to-accent/5 rounded-b-2xl">
            {/* Name */}
            <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors duration-300">
              {item.name}
            </h3>
            
            {/* Divider */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent mb-3 group-hover:w-full transition-all duration-500" />
            
            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed capitalize flex-1">
              {item.description}
            </p>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        </div>
      </Link>
    </div>
  );
}

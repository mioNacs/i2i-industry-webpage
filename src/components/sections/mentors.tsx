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
    <Section>
      <SectionHeader
        title={
          <>
            Our <span className="text-primary">experienced mentors</span> help
            you with your
            <br /> career choices & interviews
          </>
        }
        subtitle="Multiple Career Oriented Sessions & Mock Interviews by Tech Experts. These helped thousands of learners gain first-hand insights & guidance for their respective career trajectories."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {mentors.map((e: any, i: number) => (
          <AnimateOnScroll key={"Mentor" + i} delay={i * 0.1}>
            <MentorCard item={e} />
          </AnimateOnScroll>
        ))}
      </div>

      <AnimateOnScroll delay={0.3}>
        <p className="text-2xl mt-10 font-semibold text-gray-700">
          And Many More...
        </p>
      </AnimateOnScroll>
    </Section>
  );
}

function MentorCard({ item }: { item: MentorItem }) {
  return (
    <div className="max-w-sm mx-auto w-full">
      <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <Link href={item.linkedin} target="_blank" className="relative block">
          <div className="relative w-full h-[300px] lg:h-[270px] bg-gray-200 overflow-hidden">
            <div className="absolute z-10 bottom-4 right-4 bg-white rounded-lg shadow-md group-hover:scale-110 transition-transform">
              <LiIcon className="size-10 text-blue-500" />
            </div>
            <Image
              src={item.photo.url}
              alt={`${item.name} - Mentor`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="px-4 flex flex-col items-start text-start bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/10 pt-4 pb-8">
            <h3 className="text-xl font-semibold mb-1 text-gray-700">
              {item.name}
            </h3>
            <div className="divider divide-neutral-200 my-1 mb-3"></div>
            <p className="text-sm text-gray-500 capitalize">
              {item.description}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

import { getCourses } from "@/lib/contentful/client";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/container";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import SectionHeader from "@/components/ui/section-header";
import { HiArrowRight, HiCalendar, HiCheckCircle } from "react-icons/hi";

export interface CourseData {
  id: string;
  title: string;
  img: string;
  learningPoints: string[];
  startDate: Date;
  description: string;
  module: { name: string; data: string[] }[];
}

export default async function Courses() {
  const response = await getCourses();
  const courses: CourseData[] = response.data.coursesCollection.items.map(
    (e: any) => ({
      id: e.sys.id,
      title: e.name,
      img: e.image.url,
      learningPoints: e.learningPoints,
      startDate: new Date(e.startDate),
      description: e.description,
      module: e.module,
    })
  );

  return (
    <Section className="bg-gradient-to-b from-white via-accent/5 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/3 to-primary/3 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        <SectionHeader
          title={
            <>
              Our Top Selling
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Courses
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-gray-600 font-semibold">
                For Focused Professionals
              </span>
            </>
          }
          subtitle={
            <>
              Confused about which career to switch to? Try our{" "}
              <span className="font-semibold text-primary">Free Career Counselling</span>{" "}
              & get all your doubts cleared. Master Data Science, Software Development, DSA, & Data Engineering.
            </>
          }
        />

        {/* Courses Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.slice(0, 3).map((c, i) => (
            <AnimateOnScroll key={c.id} delay={i * 0.1}>
              <CourseCard data={c} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimateOnScroll delay={0.3}>
          <div className="mt-12 md:mt-16 text-center">
            <Link
              href="/course"
              className="btn btn-primary btn-lg px-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 uppercase"
            >
              View All Courses
              <HiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}

function CourseCard({ data }: { data: CourseData }) {

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none rounded-2xl" />
      
      {/* Image Container */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden">
        <Image
          width={361}
          height={200}
          src={data.img}
          alt={data.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 will-change-transform"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Course Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 
            className="text-xl font-bold text-white line-clamp-2"
            style={{ textShadow: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)' }}
          >
            {data.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {data.description}
        </p>

        {/* Key Learning Points - Minimalist Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.learningPoints.slice(0, 3).map((point, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20"
            >
              <HiCheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-xs font-medium text-gray-700 truncate max-w-[250px]">
                {point}
              </span>
            </div>
          ))}
          {data.learningPoints.length > 3 && (
            <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full">
              <span className="text-xs font-medium text-gray-600">
                +{data.learningPoints.length - 3} more
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            href={`/course/${data.id}`}
            className="btn btn-primary text-white btn-block text-sm font-semibold  border-0 transition-all duration-300"
          >
            Explore Course
            <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}

import { getCourses } from "@/lib/contentful/client";
import Link from "next/link";
import { Section } from "@/components/ui/container";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import SectionHeader from "@/components/ui/section-header";
import { HiArrowRight } from "react-icons/hi";
import CourseCard from "./course-card";

export default async function Courses() {
  const response = await getCourses();
  const courses = response.data.courseCollection.items;

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
            <AnimateOnScroll key={c.sys.id} delay={i * 0.1}>
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

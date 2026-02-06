import { getCourses } from "@/lib/contentful/client";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

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
    <Section>
      <SectionHeader
        title={
          <>
            <span className="text-primary">Our Top Selling Courses</span>
            <br />
            for focussed professionals
          </>
        }
        subtitle="Are you confused about which career to switch to? Try our Free Career Counselling & get all your doubts cleared. Get to know all about Data Science, Software Development, DSA, & Data Engineering."
      />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {courses.slice(0, 3).map((c, i) => (
          <AnimateOnScroll key={c.id} delay={i * 0.15}>
            <CourseCard data={c} />
          </AnimateOnScroll>
        ))}
      </div>

      <AnimateOnScroll delay={0.3}>
        <Link
          href="/course"
          className="btn btn-primary mt-12 uppercase px-8 hover:scale-105 transition-transform"
        >
          View All Courses
        </Link>
      </AnimateOnScroll>
    </Section>
  );
}

function CourseCard({ data }: { data: CourseData }) {
  return (
    <div className="card card-bordered bg-white group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="card-body p-6">
        <div className="flex flex-col h-full">
          <div className="overflow-hidden rounded-lg mb-4">
            <Image
              width={361}
              height={200}
              src={data.img}
              alt={data.title}
              className="object-cover w-full h-[200px] group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h3 className="card-title text-lg">{data.title}</h3>

          <span className="text-error font-medium my-3 text-sm">
            What will you learn?
          </span>

          {/* Enhancement: Bulleted list with better spacing */}
          <ul className="list-disc gap-1.5 flex flex-col ml-5">
            {data.learningPoints.map((point, i) => (
              <li className="text-sm text-gray-600" key={i}>
                {point}
              </li>
            ))}
          </ul>

          <div className="divider mt-auto pt-4"></div>

          <div className="w-full flex justify-end">
            <Link
              href={`/course/${data.id}`}
              className="btn btn-primary btn-sm group-hover:btn-accent transition-colors"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

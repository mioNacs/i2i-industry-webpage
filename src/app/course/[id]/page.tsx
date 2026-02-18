import { getCourse } from '@/lib/contentful/client';
import CourseDetailHero from '@/components/sections/course-detail-hero';

import CareerAssistance from '@/components/sections/career-assistance';
import CertificationSection from '@/components/sections/certification';
import Mentors from '@/components/sections/mentors'; // Assuming this exists and is generic
import JobPartners from '@/components/sections/job-partners';
import { ContactUsButton } from "@/components/forms/contact-form";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import Link from 'next/link';
import Image from 'next/image';
import CourseTierSection from '@/components/sections/course-tier-section';

interface PageProp {
    id: string
}

export default async function CoursePage({ params }: { params: Promise<PageProp> }) {
    const id = (await params).id;
    

    const response = await getCourse(id); 
    
    const course = response.data.course; 

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
    }

    return (
        <main className='w-full bg-white'>
            {/* Hero */}
            <CourseDetailHero course={course} />

             {/* Overview Points */}
             <section className="relative w-full py-16 overflow-hidden bg-white">
                 <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <SectionHeader 
                        title={<>Program <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Overview</span></>}
                        subtitle="A comprehensive overview of what you will learn and achieve."
                        align="center"
                        className="mb-8 md:mb-12"
                    />

                    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border-2 border-black/5 shadow-xl shadow-gray-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                         {/* Corner Accents */}
                         <div className="absolute top-0 left-0 w-2 h-20 bg-gradient-to-b from-primary to-transparent opacity-50" />
                         <div className="absolute top-0 left-0 h-2 w-20 bg-gradient-to-r from-primary to-transparent opacity-50" />
                         <div className="absolute bottom-0 right-0 w-2 h-20 bg-gradient-to-t from-accent to-transparent opacity-50" />
                         <div className="absolute bottom-0 right-0 h-2 w-20 bg-gradient-to-l from-accent to-transparent opacity-50" />

                        <div className="space-y-4">
                            {course.overviewPoints?.map((point, idx) => (
                                <p key={idx} className="text-lg md:text-xl text-gray-700 leading-relaxed font-sans relative z-10 flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                                    {point}
                                </p>
                            ))}
                            {!course.overviewPoints && (
                                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-sans relative z-10">
                                    {course.description}
                                </p>
                            )}
                        </div>
                    </div>
                 </div>
            </section>

            {/* Course Tiers */}
            <CourseTierSection tiers={course.tiers} />




            {/* Career Assistance */}
            <CareerAssistance />

            {/* Certification */}
            <CertificationSection />

             {/* Mentors */}
            <Mentors />

            {/* Job Partners */}
             <JobPartners />

            {/* Contact / CTA */}
            <section className="w-full bg-slate-900 text-white py-20 px-8 md:px-16" id="contact-form">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
                        <div className="space-y-6 flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black capitalize leading-tight">
                                Want To Learn More About <span className="text-primary">{course.title}</span>?
                            </h2>
                            <p className="text-gray-300 text-lg max-w-xl">
                                Contact us to get a detailed outline of our coaching method, teaching pattern, and how we can help you achieve your career goals.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <ContactUsButton text="Get in Touch" className="w-full sm:w-auto min-w-[180px]" />
                            </div>
                            <p className="text-sm text-gray-400 pt-4">
                                By clicking contact you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Use</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </p>
                        </div>

                         <div className="hidden md:flex flex-1 justify-center relative">
                            {/* Decorative avatars or graphic similar to old design */}
                             <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                                <div className="avatar border-4 border-slate-900">
                                    <div className="w-20">
                                        <Image src="https://i.pravatar.cc/300?img=68" alt='user' width={80} height={80} />
                                    </div>
                                </div>
                                <div className="avatar border-4 border-slate-900">
                                    <div className="w-20">
                                        <Image src="https://i.pravatar.cc/300?img=59" alt='user' width={80} height={80} />
                                    </div>
                                </div>
                                <div className="avatar border-4 border-slate-900">
                                    <div className="w-20">
                                        <Image src="https://i.pravatar.cc/300?img=15" alt='user' width={80} height={80} />
                                    </div>
                                </div>
                                <div className="avatar placeholder border-4 border-slate-900">
                                    <div className="bg-primary text-white w-20">
                                        <span className="text-xl font-bold">+99</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}

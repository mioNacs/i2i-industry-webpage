import Image from 'next/image';
import { HiCheckCircle, HiClock, HiAcademicCap, HiUserGroup, HiLightningBolt } from "react-icons/hi";
import { CourseItem } from '@/lib/contentful/types/courses';

interface CourseDetailHeroProps {
    course: CourseItem;
}

export default function CourseDetailHero({ course }: CourseDetailHeroProps) {
    // Calculate duration range from tiers if available, else fallback
    const durations = course.tiers?.items?.map(t => t.durationMonths) || [];
    const durationDisplay = durations.length > 0 
        ? (durations.length > 1 ? `${durations[0]} - ${durations[durations.length - 1]}` : durations[0]) 
        : 'Flexible';

    return (
        <section className='w-full relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-accent/10 pt-28 pb-16 lg:pt-16 lg:pb-24'>
             {/* Animated Background Elements */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    
                    {/* Left Content */}
                    <div className='flex-1 flex flex-col gap-6 items-start animate-fade-in text-center lg:text-left'>
                        
                        <div className="space-y-4">
                            <h1 className='text-4xl lg:text-6xl font-black text-gray-900 leading-[1.1] capitalize'>
                                {course.title}
                            </h1>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <DetailItem icon={<HiClock />} label="Duration" value={durationDisplay} />
                            <DetailItem icon={<HiAcademicCap />} label="Mode" value="Online / Hybrid" />
                        </div>

                         <div className="space-y-6 w-full text-gray-700 bg-white/60 p-6 rounded-2xl border border-white backdrop-blur-sm shadow-sm">
                             {course.overviewPoints && (
                                <div className="text-left">
                                    <b className='text-gray-900 block mb-1 text-lg'>Highlights:</b>
                                    <ul className="text-sm leading-relaxed text-gray-600 list-disc pl-5">
                                        {course.overviewPoints.map((pt, i) => (
                                            <li key={i}>{pt}</li>
                                        ))}
                                    </ul>
                                </div>
                             )}
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
                             <a href="#contact-form" className="btn btn-lg bg-accent hover:bg-accent/90 text-white border-none shadow-xl hover:shadow-2xl hover:scale-105 transition-all rounded-xl px-8 normal-case text-lg font-bold flex-1 sm:flex-none">
                                Apply Now
                            </a>
                            <a href="#curriculum" className="btn btn-lg bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 shadow-md hover:shadow-xl hover:scale-105 transition-all rounded-xl px-8 normal-case text-lg font-bold flex-1 sm:flex-none">
                                View Curriculum
                            </a>
                        </div>
                    </div>

                    {/* Right Content - Image */}
                    <div className='flex-1 w-full max-w-xl lg:max-w-none relative flex justify-center'>
                        <div className="relative w-full aspect-[4/3] lg:aspect-square max-h-[500px]">
                            {/* Blur Backdrops */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-[3rem] transform rotate-6 scale-95 blur-2xl opacity-60" />
                            
                            {/* Main Image Container */}
                            <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-[6px] border-white ring-2 ring-black z-10">
                                 {course.image && (
                                     <Image
                                        alt={course.title}
                                        src={course.image.url}
                                        fill
                                        className='object-cover hover:scale-105 transition-transform duration-700'
                                        priority
                                    />
                                 )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                                
                                <div className="absolute bottom-0 left-0 p-8 text-white z-20">
                                    <p className="font-bold text-lg mb-1">Certified Course</p>
                                    <p className="text-sm opacity-90">Includes Industry Recognized Certification</p>
                                </div>
                            </div>

                            {/* Floating Qualification Badge */}
                            <div className="absolute top-8 -right-4 lg:-right-12 z-20 bg-white/80 p-4 rounded-2xl shadow-xl border-2 border-black backdrop-blur-md flex items-center gap-3 animate-bounce-slow">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <HiCheckCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Placement</p>
                                    <p className="text-xl font-black text-gray-900">Assistance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function DetailItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <div className="text-primary text-2xl mb-2 group-hover:scale-110 transition-transform bg-primary/5 p-2 rounded-lg">{icon}</div>
            <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="font-bold text-gray-900 text-sm">{value}</p>
            </div>
        </div>
    )
}

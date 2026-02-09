import { HiCheckCircle, HiArrowRight } from "react-icons/hi";
import Link from 'next/link';

export default function CoursesHero() {
    return (
        <div className='flex flex-col md:flex-row w-full bg-gradient-to-br from-primary/5 via-accent/5 to-white relative overflow-hidden'>
            
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Left Content */}
            <div className='flex-1 flex flex-col p-8 md:p-16 gap-6 relative z-10'>
                <h1 className="text-4xl md:text-6xl font-black font-sans capitalize leading-tight">
                    Grow your <br />
                    Career <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                        exponentially
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-700 font-sans max-w-xl leading-relaxed">
                    Our curriculum offers a &quot;hands-on&quot; approach to learning via live classes,
                    2-step counselling, and <span className="font-bold text-primary">100% placement assistance.</span>
                </p>

                <Link 
                    href="#courses"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 w-fit mt-4"
                >
                    Explore Courses
                    <HiArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Right Content */}
            <div className='p-8 lg:p-16 flex flex-1 items-center justify-center font-sans relative z-10'>
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                    
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-[60px]" />

                    {/* Main Chart Card */}
                    <div className="relative w-full bg-white/60 backdrop-blur-xl border-2 border-black p-6 rounded-3xl shadow-2xl transform transition-all hover:scale-[1.02] duration-500">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white border-2 border-black rounded-lg">
                                <span className="text-2xl">📈</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Career Growth</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Last 6 Months</p>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="relative h-48 w-full flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-gray-200">
                            
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 pb-2">
                                <div className="w-full h-px bg-gray-400 border-dashed" />
                                <div className="w-full h-px bg-gray-400 border-dashed" />
                                <div className="w-full h-px bg-gray-400 border-dashed" />
                            </div>

                            {/* Bars */}
                            {[30, 45, 55, 40, 70, 85, 100].map((h, i) => (
                                <div 
                                    key={i} 
                                    className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-md hover:opacity-90 transition-all duration-300 relative group shadow-sm"
                                    style={{ height: `${h}%` }}
                                >
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating Badge 1 - Placement */}
                    <div className="absolute -right-4 top-12 bg-white/40 p-4 rounded-xl shadow-xl flex items-center gap-3 border-2 border-black backdrop-blur-sm z-20">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <HiCheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Placement Rate</p>
                            <p className="text-lg font-bold text-gray-800">100%</p>
                        </div>
                    </div>

                    {/* Floating Badge 2 - Hike */}
                     <div className="absolute -left-4 bottom-14 bg-white/60 p-4 rounded-xl shadow-xl flex items-center gap-3 border-2 border-black backdrop-blur-sm z-20">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <span className="text-xl">💼</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Avg. Hike</p>
                            <p className="text-lg font-bold text-gray-800">50-100%</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

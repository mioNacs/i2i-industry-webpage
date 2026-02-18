import { HiArrowRight } from "react-icons/hi";
import Image from "next/image";
import { CourseItem } from '@/lib/contentful/types/courses';
import { IoMdStar } from 'react-icons/io';
import Link from 'next/link';

interface CourseCardProps {
    data: CourseItem;
}

export default function CourseCard({ data }: CourseCardProps) {
    return (
        <div className='group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden h-full'>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none rounded-2xl" />
            
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    width={400}
                    height={280}
                    src={data.image.url}
                    alt={`${data.title} course image`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 will-change-transform"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Course Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 
                        className='font-bold text-xl text-white line-clamp-2'
                        style={{ textShadow: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)' }}
                    >
                        {data.title}
                    </h2>
                </div>
            </div>

            <div className='p-5 flex flex-col flex-1'>
                {/* Mode Badge - Hardcoded for now as it's not in the new schema yet */}
                <div className='mb-4'>
                    <div className='inline-flex items-center gap-2 px-3 py-1.5 border-2 border-accent rounded-full'>
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        <span className="text-xs font-semibold text-gray-900">Online / Hybrid</span>
                    </div>
                </div>

                {/* Course Info Bullets */}
                <ul className='flex flex-col gap-2 text-sm font-medium text-gray-600 mb-4'>
                    <li className='flex items-center gap-2'>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                        {/* Derive duration from tiers */}
                        {data.tiers?.items?.length > 0 
                            ? `${data.tiers.items[0].durationMonths} - ${data.tiers.items[data.tiers.items.length - 1].durationMonths}`
                            : 'Flexible Duration'}
                    </li>
                    {data.startingPrice && (
                        <li className='flex items-center gap-2'>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                            Starts at {data.startingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </li>
                    )}
                </ul>

                {/* Spacer to push rating to bottom */}
                <div className="flex-1"></div>

                {/* Rating Footer - Stuck to Bottom */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                            <p className='text-sm font-bold text-gray-900'>{getRandomStarRating()}</p>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                    <IoMdStar 
                                        key={index} 
                                        className={`size-4 ${
                                            index < 4 ? "text-amber-400" : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className='text-gray-500 text-xs font-medium'>
                            ({getRandomStudentCount()})
                        </p>
                    </div>

                    {/* Explore Button */}
                    <Link
                        href={`/course/${data.sys.id}`}
                        className="w-full px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        Explore Course
                        <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Bottom Accent Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
    )
}

/**
 * Generates a random number for no. of students who rated.
 * @returns number
 */
function getRandomStudentCount() {
    return Math.floor(Math.random() * (1001 - 300)) + 100;
}

/**
 * Generates a random number for rating.
 * @returns number
 */
function getRandomStarRating() {
    // Generate random number between 4 and 5
    const rating = (Math.random() * (5 - 4)) + 4;
    // Round to 1 decimal place
    return Math.round(rating * 10) / 10;
}

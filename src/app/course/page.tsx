import { getCourses } from '@/lib/contentful/client'
import React from 'react'
import CoursesHero from '@/components/sections/courses-hero'
import CourseCard from '@/components/sections/course-card'


export default async function CoursesListingPage() {
    const response = (await getCourses())
    const courses = response.data.courseCollection.items

    return (
        <main className='w-full h-full flex flex-col items-stretch overflow-hidden bg-gray-50'>

            {/* Hero Section */}
            <CoursesHero />

            {/* Course Listing Section */}
            <div id="courses" className='w-full px-8 lg:px-16 mt-16'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl md:text-5xl font-black font-sans mb-4'>
                        Explore <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>Courses</span>
                    </h2>
                    <p className='text-lg md:text-xl text-gray-600 font-sans max-w-2xl mx-auto'>
                        Professionally crafted courses and learnings designed to accelerate your career growth.
                    </p>
                </div>

                <div className='my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {courses.map((c, i) => <CourseCard key={i} data={c} />)}
                </div>
            </div>

            <div className="h-16"></div>

        </main>
    )
}

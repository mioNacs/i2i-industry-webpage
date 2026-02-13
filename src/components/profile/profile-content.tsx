'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiBriefcase, HiAcademicCap, HiLocationMarker, HiOfficeBuilding, HiCheckCircle } from 'react-icons/hi';
import SignOutButton from '@/components/auth/sign-out-button';

interface ProfileContentProps {
  profile: any;
  user: any;
  savedJobs: any[];
  enrolledCourses: any[];
}

export default function ProfileContent({
  profile,
  user,
  savedJobs,
  enrolledCourses,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'courses'>('jobs');

  return (
    <div className="w-full">
      {/* 1. Header Section - User Details */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Avatar */}
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-gray-100">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Profile'}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.full_name || 'Welcome!'}
              </h1>
              <p className="text-gray-500 font-medium">
                {user.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
                <span className="badge badge-lg badge-primary badge-outline capitalize">
                  {profile?.role || 'Student'}
                </span>
                <span className="badge badge-lg badge-ghost">
                  Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
               <SignOutButton />
            </div>

          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2
                        ${activeTab === 'jobs' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <HiBriefcase className="text-lg" />
                    Saved Jobs 
                    <span className="badge badge-sm badge-ghost ml-1">{savedJobs.length}</span>
                </button>

                <button
                    onClick={() => setActiveTab('courses')}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2
                        ${activeTab === 'courses' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <HiAcademicCap className="text-lg" />
                    My Courses
                    <span className="badge badge-sm badge-ghost ml-1">{enrolledCourses.length}</span>
                </button>
            </div>
        </div>
      </div>

      {/* 3. Content Area */}
      <div className="container mx-auto px-4 py-8 min-h-[500px]">
        
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
            <div className="animate-fade-in">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Saved Jobs</h2>
                    <p className="text-gray-500">Keep track of roles you're interested in.</p>
                </div>

                {savedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedJobs.map((job) => (
                            <div key={job.sys.id} className="card bg-white border border-gray-200 hover:shadow-md transition-all group">
                                <div className="card-body p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
                                            {job.companyIcon?.url ? (
                                                <Image 
                                                    src={job.companyIcon.url} 
                                                    alt={job.companyName} 
                                                    width={32} 
                                                    height={32} 
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <HiOfficeBuilding className="text-xl text-gray-400" />
                                            )}
                                        </div>
                                        {/* Optional: Add remove bookmark button here */}
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {job.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <HiOfficeBuilding /> {job.companyName} 
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                                        <span className="flex items-center gap-1">
                                            <HiLocationMarker /> {job.location}
                                        </span>
                                        {job.salary && (
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium">
                                                {job.salary}
                                            </span>
                                        )}
                                    </div>

                                    <div className="card-actions justify-end mt-auto">
                                        <Link href={`/jobs/${job.sys.id}`} className="btn btn-outline btn-sm w-full group-hover:btn-primary group-hover:text-white">
                                            View Details
                                            <HiCheckCircle className="ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState 
                        icon={<HiBriefcase className="w-12 h-12 text-gray-300" />}
                        title="No jobs saved yet"
                        description="Browse our job listings and bookmark roles that match your skills."
                        actionLink="/jobs"
                        actionText="Find Jobs"
                    />
                )}
            </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
            <div className="animate-fade-in">
                 <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Enrolled Courses</h2>
                    <p className="text-gray-500">Continue where you left off.</p>
                </div>

                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => (
                            <div key={course.sys.id} className="card bg-white border border-gray-200 hover:shadow-md transition-all overflow-hidden group">
                                {course.image?.url && (
                                    <figure className="h-40 relative bg-gray-100">
                                        <Image 
                                            src={course.image.url} 
                                            alt={course.name} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 badge badge-primary shadow-sm">
                                            {course.mode}
                                        </div>
                                    </figure>
                                )}
                                <div className="card-body p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {course.description}
                                    </p>
                                    
                                    <div className="card-actions mt-auto">
                                        <Link href={`/courses/${course.sys.id}`} className="btn btn-primary btn-sm w-full">
                                            Go to Course
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState 
                        icon={<HiAcademicCap className="w-12 h-12 text-gray-300" />}
                        title="You haven't enrolled in any courses"
                        description="Upskill yourself with our premium courses designed by industry experts."
                        actionLink="/course"
                        actionText="Explore Courses"
                    />
                )}
            </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, actionLink, actionText }: any) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-6">{description}</p>
            <Link href={actionLink} className="btn btn-primary">
                {actionText}
            </Link>
        </div>
    )
}

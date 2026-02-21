'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiBriefcase, HiAcademicCap, HiLocationMarker, HiOfficeBuilding, HiCheckCircle, HiClock, HiCalendar, HiArrowRight } from 'react-icons/hi';
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
                 <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Enrolled Courses</h2>
                    <p className="text-gray-500">Continue your learning journey.</p>
                </div>

                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {enrolledCourses.map((course, index) => (
                            <div 
                                key={course.sys.id} 
                                className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                style={{ 
                                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500 pointer-events-none rounded-2xl" />
                                
                                <div className="flex flex-col md:flex-row relative">
                                    {/* Course Image */}
                                    {course.image?.url && (
                                        <div className="md:w-56 h-52 md:h-auto relative overflow-hidden flex-shrink-0">
                                            <Image 
                                                src={course.image.url} 
                                                alt={course.title || course.name} 
                                                fill 
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                            
                                            {/* Status Badge on Image */}
                                            {course.enrollment?.paymentStatus === 'completed' && (
                                                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                                                    <HiCheckCircle className="w-4 h-4" />
                                                    Active
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Course Details */}
                                    <div className="flex-1 p-6 flex flex-col">
                                        {/* Header */}
                                        <div className="mb-4">
                                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                                                {course.title || course.name}
                                            </h3>
                                            
                                            {/* Tier Badge */}
                                            {course.enrollment?.tier && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                                    <span className="text-xs font-bold text-primary">{course.enrollment.tier.tier}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Tier Details Card */}
                                        {course.enrollment?.tier && (
                                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 mb-4 border border-gray-100 group-hover:border-primary/20 transition-colors duration-300">
                                                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                    <HiAcademicCap className="w-4 h-4 text-primary" />
                                                    {course.enrollment.tier.title}
                                                </p>
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <HiClock className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Duration</p>
                                                            <p className="font-semibold text-gray-700">{course.enrollment.tier.durationMonths}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                                            <HiCalendar className="w-4 h-4 text-accent" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Total Hours</p>
                                                            <p className="font-semibold text-gray-700">{course.enrollment.tier.durationHours}h</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Progress-like stats */}
                                                <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">
                                                        <span className="font-medium text-gray-700">Academic:</span> {course.enrollment.tier.academicDuration || 'N/A'}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        <span className="font-medium text-gray-700">Internship:</span> {course.enrollment.tier.internshipDuration || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Footer */}
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                {course.enrollment?.amountPaid && (
                                                    <p className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                                        {course.enrollment.amountPaid.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                                                    </p>
                                                )}
                                                {course.enrollment?.purchasedAt && (
                                                    <p className="text-xs text-gray-400">
                                                        Enrolled {new Date(course.enrollment.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {/* Conditional Button/Link based on payment status */}
                                            {course.enrollment?.fullAccessGranted ? (
                                                <Link 
                                                    href={`/course/${course.sys.id}`} 
                                                    className="group/btn flex items-center gap-2 px-5 py-2.5 text-primary hover:text-primary-focus text-sm font-semibold transition-all duration-300"
                                                >
                                                    You already own it
                                                    <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                </Link>
                                            ) : course.enrollment?.remainingAmount > 0 ? (
                                                <Link 
                                                    href={`/course/${course.sys.id}`} 
                                                    className="group/btn flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-focus text-white text-sm font-semibold rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-105"
                                                >
                                                    Pay Remaining ({(course.enrollment.remainingAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })})
                                                    <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                </Link>
                                            ) : (
                                                <Link 
                                                    href={`/course/${course.sys.id}`} 
                                                    className="group/btn flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-focus text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                                                >
                                                    Continue
                                                    <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                </Link>
                                            )}
                                        </div>
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

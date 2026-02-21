'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    HiBriefcase, HiAcademicCap, HiLocationMarker, HiOfficeBuilding,
    HiOutlinePencilAlt, HiCamera, HiOutlineDocumentText
} from 'react-icons/hi';
import SignOutButton from '@/components/auth/sign-out-button';
import ReceiptModal from './receipt-modal';

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
    const [activeTab, setActiveTab] = useState<'jobs' | 'courses'>('courses');
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

    return (
        <div className="w-full min-h-screen bg-slate-50">
            {/* 1. Header Section - User Details */}
            <div className="bg-gradient-to-r from-[#0F4A8A] to-[#1a5b9c] pt-12 pb-24 relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20 mb-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">

                    {/* Avatar with Camera Icon */}
                    <div className="relative group cursor-pointer">
                        <div className="w-28 h-28 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-gray-100 relative">
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.full_name || 'Profile'}
                                    width={112}
                                    height={112}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-slate-100">
                                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                                </div>
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <HiCamera className="text-white w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Info & Stats */}
                    <div className="flex-1 text-center md:text-left space-y-3 pt-2">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                {profile?.full_name || 'Welcome!'}
                                <button className="text-gray-400 hover:text-[#0F4A8A] transition-colors p-1" title="Edit Profile">
                                    <HiOutlinePencilAlt className="w-5 h-5" />
                                </button>
                            </h1>
                            <span className="badge badge-primary bg-[#0F4A8A] border-none text-white badge-md capitalize font-semibold shadow-sm">
                                {profile?.role || 'Student'}
                            </span>
                        </div>

                        <p className="text-gray-500 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                            {user.email} <span className="text-gray-300">•</span> Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="px-4 relative z-10 flex justify-end">
                        {/* Subtle Sign Out */}
                        <div className="text-white/80 hover:text-white transition-colors text-sm">
                            <SignOutButton />
                        </div>
                    </div>

                </div>
            </div>

            {/* 2. Tabs Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                        {[
                            { id: 'courses', label: 'My Courses', icon: HiAcademicCap, badge: enrolledCourses.length },
                            { id: 'jobs', label: 'Saved Jobs', icon: HiBriefcase, badge: savedJobs.length },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`relative px-4 py-2.5 text-sm font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-2 group
                          ${activeTab === tab.id
                                        ? 'bg-[#0F4A8A]/10 text-[#0F4A8A]'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                            >
                                <tab.icon className={`text-lg ${activeTab === tab.id ? 'text-[#0F4A8A]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                {tab.label}
                                {tab.badge !== null && tab.badge !== undefined && (
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-[#0F4A8A] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Content Area */}
            <div className="container mx-auto px-4 py-8 min-h-[500px]">

                {/* Jobs Tab */}
                {activeTab === 'jobs' && (
                    <div className="animate-fade-in">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Saved Jobs</h2>
                                <p className="text-gray-500 text-sm mt-1">Keep track of roles you're interested in.</p>
                            </div>
                        </div>

                        {savedJobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedJobs.map((job) => (
                                    <div key={job.sys.id} className="bg-white rounded-xl border border-gray-200 hover:border-[#0F4A8A]/30 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-full hover:-translate-y-1">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-32 h-14 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                                                    {job.companyIcon?.url ? (
                                                        <Image
                                                            src={job.companyIcon.url}
                                                            alt={job.companyName}
                                                            width={80}
                                                            height={40}
                                                            className="object-contain"
                                                        />
                                                    ) : (
                                                        <HiOfficeBuilding className="text-3xl text-gray-300" />
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#0F4A8A] transition-colors line-clamp-1">
                                                {job.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 font-medium">
                                                <HiOfficeBuilding className="text-gray-400" /> {job.companyName}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <HiLocationMarker className="text-gray-400" /> {job.location}
                                                </span>
                                                {job.salary && (
                                                    <span className="text-green-600 flex items-center gap-1 before:content-['•'] before:text-gray-300 before:mr-1">
                                                        {job.salary}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-gray-50 flex gap-3 bg-gray-50/50 rounded-b-xl">
                                            <Link href={`/jobs/${job.sys.id}`} className="btn btn-outline btn-sm flex-1 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300">
                                                View Details
                                            </Link>
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
                            <p className="text-gray-500 text-sm mt-1">Pick up right where you left off.</p>
                        </div>

                        {enrolledCourses.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {enrolledCourses.map((course, index) => {
                                    // Calculate pricing safely
                                    const totalAmount = course.enrollment?.tier?.programFees
                                        ? Math.round(course.enrollment.tier.programFees * (1 + (course.enrollment.tier.gstPercentage || 0) / 100))
                                        : 0;
                                    const amountPaid = course.enrollment?.amountPaid || 0;
                                    const remainingAmount = course.enrollment?.remainingAmount || 0;
                                    const isFullyPaid = remainingAmount === 0 || course.enrollment?.fullAccessGranted;

                                    return (
                                        <div
                                            key={`${course.sys.id}_${course.enrollment?.tierId}`}
                                            className="group bg-white rounded-2xl border border-gray-200 hover:border-[#0F4A8A]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
                                            style={{
                                                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                                            }}
                                        >
                                            {/* Course Image */}
                                            {course.image?.url && (
                                                <div className="h-64 relative overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <Image
                                                        src={course.image.url}
                                                        alt={course.title || course.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                                                </div>
                                            )}

                                            {/* Course Details */}
                                            <div className="flex-1 p-6 flex flex-col">
                                                {/* Header */}
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[#0F4A8A] transition-colors duration-300 line-clamp-2">
                                                        {course.title || course.name}
                                                    </h3>

                                                    {/* Tier Info */}
                                                    {course.enrollment?.tier && (
                                                        <div className="text-sm text-gray-600 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <HiAcademicCap className="w-5 h-5 text-[#0F4A8A]" />
                                                                <span>{course.enrollment.tier.title}</span>
                                                            </div>
                                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-semibold border border-gray-200 uppercase tracking-wider">
                                                                {course.enrollment.tier.tier}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Pricing Breakdown */}
                                                <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Total Fee</span>
                                                            <span className="font-bold text-gray-700">₹{totalAmount.toLocaleString()} <br className='sm:hidden' />
                                                                <span className="text-xs text-gray-500 font-semibold">+ 18% GST</span>
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col border-l border-gray-200 pl-3">
                                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Paid</span>
                                                            <span className="font-bold text-green-600">₹{amountPaid.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex flex-col border-l border-gray-200 pl-3">
                                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Due</span>
                                                            <span className={`font-bold ${isFullyPaid ? 'text-gray-400' : 'text-orange-500'}`}>
                                                                ₹{remainingAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer Actions */}
                                                <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-2">
                                                    {isFullyPaid ? (
                                                        <Link
                                                            href={`/course/${course.sys.id}`}
                                                            className="btn btn-[#0F4A8A] bg-[#0F4A8A] hover:bg-[#0a3666] text-white flex-1 min-h-[44px] h-[44px] rounded-lg shadow-md border-none"
                                                        >
                                                            Continue Learning
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            <Link
                                                                href={`/course/${course.sys.id}`}
                                                                className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 min-h-[44px] h-[44px] rounded-lg"
                                                            >
                                                                Course Details
                                                            </Link>
                                                            <Link
                                                                href={`/course/${course.sys.id}/enroll?tierId=${course.enrollment?.tier?.sys.id}`}
                                                                className="btn bg-orange-500 hover:bg-orange-600 text-white flex-1 min-h-[44px] h-[44px] rounded-lg shadow-md border-none"
                                                            >
                                                                Pay Remaining
                                                            </Link>
                                                        </>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedReceipt(course)}
                                                        className="btn btn-outline border-gray-200 text-[#0F4A8A] hover:bg-gray-100 min-h-[44px] h-[44px] rounded-lg px-3 group/receipt flex items-center justify-center relative overflow-visible"
                                                        title="View Receipt"
                                                    >
                                                        <HiOutlineDocumentText className="w-5 h-5 group-hover/receipt:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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

            {/* Receipt Modal */}
            <ReceiptModal
                isOpen={!!selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
                enrollment={selectedReceipt?.enrollment}
                user={user}
                profile={profile}
                courseTitle={selectedReceipt?.title || selectedReceipt?.name}
            />
        </div>
    );
}

function EmptyState({ icon, title, description, actionLink, actionText }: any) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center hover:bg-gray-50 transition-colors">
            <div className="mb-4 bg-gray-50 p-4 rounded-full">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-8 text-sm">{description}</p>
            <Link href={actionLink} className="btn btn-[#0F4A8A] bg-[#0F4A8A] hover:bg-[#0a3666] text-white border-none shadow-md rounded-lg px-8">
                {actionText}
            </Link>
        </div>
    )
}

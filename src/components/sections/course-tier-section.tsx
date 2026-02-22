'use client'
import { useState, useEffect } from 'react';
import { CourseTier } from '@/lib/contentful/types/courses';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EnrollmentStatus {
    hasEnrollment: boolean;
    fullAccessGranted: boolean;
    remainingAmount: number;
    tierId: string;
}

interface CourseTierSectionProps {
    tiers: { items: CourseTier[] };
    courseId: string;
    courseTitle: string;
}

export default function CourseTierSection({ tiers, courseId, courseTitle }: CourseTierSectionProps) {
    // Sort tiers or ensure default order? Assuming data comes in desired order or we find 'Post Graduate'
    const defaultTier = tiers.items.find(t => t.tier === 'Fast-Track Program') || tiers.items[0];
    const [selectedTier, setSelectedTier] = useState<CourseTier>(defaultTier);
    const [user, setUser] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus | null>(null);
    const router = useRouter();

    // Check authentication status and enrollment
    useEffect(() => {
        const checkAuthAndEnrollment = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Check enrollment status for this course
                const { data: enrollments } = await supabase
                    .from('enrollments')
                    .select('tier_id, full_access_granted, remaining_amount, payment_status, purchased_at')
                    .eq('user_id', user.id)
                    .eq('course_id', courseId)
                    .eq('tier_id', selectedTier.sys.id)
                    .eq('payment_status', 'completed')
                    .order('full_access_granted', { ascending: false })
                    .order('purchased_at', { ascending: false })
                    .limit(1);

                const enrollment = enrollments?.[0];

                if (enrollment) {
                    setEnrollmentStatus({
                        hasEnrollment: true,
                        fullAccessGranted: enrollment.full_access_granted || false,
                        remainingAmount: enrollment.remaining_amount || 0,
                        tierId: enrollment.tier_id,
                    });
                }
            }

            setIsCheckingAuth(false);
        };
        checkAuthAndEnrollment();
    }, [courseId]);

    // Calculate total amount with GST (in rupees) - for display only
    const calculateTotalAmount = (tier: CourseTier): number => {
        const baseAmount = tier.programFees;
        const gstAmount = tier.gstPercentage ? (baseAmount * tier.gstPercentage) / 100 : 0;
        return Math.round(baseAmount + gstAmount); // Amount in rupees
    };

    // Handle enrollment button click - navigate to enrollment page
    const handleEnroll = async () => {
        // Check if user is logged in
        if (!user) {
            toast.error('Please login to enroll in a course');
            router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        // Navigate to the enrollment page
        router.push(`/course/${courseId}/enroll?tierId=${selectedTier.sys.id}`);
    };

    if (!tiers || tiers.items.length === 0) return null;

    return (
        <section id="curriculum" className="py-20 px-4 md:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your <span className="text-primary">Learning Path</span></h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Select the tier that best fits your career goals and schedule.</p>
                </div>

                {/* Tier Toggles */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {tiers.items.map((tier) => (
                        <button
                            key={tier.sys.id}
                            onClick={() => setSelectedTier(tier)}
                            className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 border-2 
                                ${selectedTier.sys.id === tier.sys.id
                                    ? 'bg-primary border-primary text-white shadow-lg scale-105'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {tier.tier}
                        </button>
                    ))}
                </div>

                {/* Selected Tier Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTier.sys.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                            {/* Left Column: Details & Fees */}
                            <div className="lg:col-span-4 p-8 md:p-10 bg-slate-900 text-white flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{selectedTier.title}</h3>
                                    <div className="inline-block bg-primary/20 text-primary-content px-3 py-1 rounded-md text-sm font-medium mb-6 border border-primary/30">
                                        {selectedTier.tier} Level
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Duration</p>
                                            <p className="text-2xl font-bold">{selectedTier.durationMonths}</p>
                                            <p className="text-sm text-gray-400">({selectedTier.durationHours} Hours)</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wider">Academic</p>
                                                <p className="font-semibold">{selectedTier.academicDuration}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wider">Internship</p>
                                                <p className="font-semibold">{selectedTier.internshipDuration}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-700">
                                            <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Program Fees</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-3xl font-bold text-primary">
                                                    {selectedTier.programFees.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                                                </p>
                                                {selectedTier.gstPercentage && (
                                                    <span className="text-sm text-gray-400">+ {selectedTier.gstPercentage}% GST</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 space-y-3">
                                    {/* Conditional button based on enrollment status */}
                                    {enrollmentStatus?.hasEnrollment && enrollmentStatus.tierId === selectedTier.sys.id ? (
                                        enrollmentStatus.fullAccessGranted ? (
                                            // Full access - show "You already own it" link
                                            <Link
                                                href="/profile"
                                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircleIcon className="w-6 h-6" />
                                                You already own it
                                            </Link>
                                        ) : enrollmentStatus.remainingAmount > 0 ? (
                                            // Partial payment - show "Pay Remaining" button
                                            <button
                                                onClick={handleEnroll}
                                                disabled={isCheckingAuth}
                                                className="w-full py-4 bg-accent hover:bg-accent-focus text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-accent/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isCheckingAuth ? (
                                                    'Loading...'
                                                ) : (
                                                    <>
                                                        Pay Remaining
                                                        <span className="text-sm font-normal opacity-80">
                                                            ({enrollmentStatus.remainingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })})
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            // Fallback - go to profile
                                            <Link
                                                href="/profile"
                                                className="w-full py-4 bg-primary hover:bg-primary-focus text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                                            >
                                                Go to My Courses
                                            </Link>
                                        )
                                    ) : (
                                        // No enrollment or different tier - show normal enroll button
                                        <button
                                            onClick={handleEnroll}
                                            disabled={isCheckingAuth}
                                            className="w-full py-4 bg-primary hover:bg-primary-focus text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isCheckingAuth ? (
                                                'Loading...'
                                            ) : (
                                                <>
                                                    Enroll Now
                                                    <span className="text-sm font-normal opacity-80">
                                                        ({calculateTotalAmount(selectedTier).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })})
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                    <p className="text-center text-xs text-gray-500">Limited seats available for the upcoming batch.</p>
                                </div>
                            </div>

                            {/* Right Column: Modules & Career */}
                            <div className="lg:col-span-8 p-8 md:p-10">
                                <div className="grid md:grid-cols-2 gap-8 md:gap-12">

                                    {/* Modules */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                                            Key Modules
                                        </h4>
                                        <div className="space-y-6">
                                            {selectedTier.modules?.map((module, i) => (
                                                <div key={i} className="space-y-2">
                                                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                                                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                        {module.name}
                                                    </h5>
                                                    <ul className="pl-9 space-y-1">
                                                        {module.points?.map((point, j) => (
                                                            <li key={j} className="text-sm text-gray-600 list-disc relative">
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tools, Career & Internship */}
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                <span className="w-1 h-6 bg-accent rounded-full"></span>
                                                Tools Covered
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTier.toolsCovered?.map((tool, i) => (
                                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                <span className="w-1 h-6 bg-secondary rounded-full"></span>
                                                Career Opportunities
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedTier.careerOpportunities?.map((career, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                        {career}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {selectedTier.internshipDetails && (
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                                    Internship Timeline
                                                </h4>
                                                <div className="space-y-4 border-l-2 border-gray-200 pl-4 ml-1">
                                                    {selectedTier.internshipDetails.timeline?.map((item, i) => (
                                                        <div key={i} className="relative">
                                                            <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                                            <p className="text-sm font-bold text-gray-800">{item.period}</p>
                                                            <p className="text-xs text-gray-500">{item.tasks.join(', ')}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="mt-10 pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-md text-gray-900 uppercase font-bold mb-1">Eligibility</p>
                                        <p className="text-sm text-gray-700">{selectedTier.admissionEligibility}</p>
                                    </div>
                                    <div>
                                        <p className="text-md text-gray-900 uppercase font-bold mb-1">Certification Requirements</p>
                                        <p className="text-sm text-gray-700">{selectedTier.certificationRequirements}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

        </section>
    );
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCourses, getJobsData } from '@/lib/contentful/client'
import ProfileContent from '@/components/profile/profile-content'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Parallel Data Fetching
    const [profileRes, savedJobsRes, enrollmentsRes, contentfulJobsRes, contentfulCoursesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('saved_jobs').select('job_id, saved_at').eq('user_id', user.id),
        supabase.from('enrollments').select('course_id, tier_id, purchased_at, amount_paid, payment_status, full_access_granted, remaining_amount, total_course_amount, payment_type').eq('user_id', user.id),
        getJobsData(),
        getCourses()
    ]);

    const profile = profileRes.data;
    const savedJobIds = new Set(savedJobsRes.data?.map(j => j.job_id) || []);
    
    // Create a map of enrollments with tier details
    const enrollmentsMap = new Map(
        enrollmentsRes.data?.map(e => [e.course_id, e]) || []
    );

    // Filter Contentful Data
    const savedJobs = contentfulJobsRes.data.jobCollection.items.filter(job => savedJobIds.has(job.sys.id));
    
    // Get enrolled courses with their tier info
    const enrolledCourses = contentfulCoursesRes.data.courseCollection.items
        .filter((course: any) => enrollmentsMap.has(course.sys.id))
        .map((course: any) => {
            const enrollment = enrollmentsMap.get(course.sys.id);
            const purchasedTier = course.tiers?.items?.find((tier: any) => tier.sys.id === enrollment?.tier_id);
            return {
                ...course,
                enrollment: {
                    tierId: enrollment?.tier_id,
                    purchasedAt: enrollment?.purchased_at,
                    amountPaid: enrollment?.amount_paid,
                    paymentStatus: enrollment?.payment_status,
                    fullAccessGranted: enrollment?.full_access_granted,
                    remainingAmount: enrollment?.remaining_amount,
                    totalCourseAmount: enrollment?.total_course_amount,
                    paymentType: enrollment?.payment_type,
                    tier: purchasedTier || null,
                }
            };
        });

    return (
        <div className="min-h-screen bg-gray-50 md:px-20">
            <ProfileContent 
                user={user}
                profile={profile}
                savedJobs={savedJobs}
                enrolledCourses={enrolledCourses}
            />
        </div>
    )
}

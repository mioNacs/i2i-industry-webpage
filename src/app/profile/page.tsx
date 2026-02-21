import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCourses, getJobsData } from '@/lib/contentful/client'
import ProfileContent from '@/components/profile/profile-content'

export const dynamic = 'force-dynamic';

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
        supabase.from('enrollments').select('*').eq('user_id', user.id),
        getJobsData(),
        getCourses()
    ]);

    const profile = profileRes.data;
    const savedJobIds = new Set(savedJobsRes.data?.map(j => j.job_id) || []);

    // Create a map of enrollments keyed by course AND tier, prioritizing full access and recent ones
    const enrollmentsMap = new Map();
    (enrollmentsRes.data || []).forEach(e => {
        const key = `${e.course_id}_${e.tier_id}`;
        const existing = enrollmentsMap.get(key);
        const eDate = e.purchased_at ? new Date(e.purchased_at).getTime() : 0;
        const exDate = existing?.purchased_at ? new Date(existing.purchased_at).getTime() : 0;

        if (!existing ||
            e.full_access_granted ||
            (!existing.full_access_granted && eDate > exDate)) {
            enrollmentsMap.set(key, e);
        }
    });

    // Filter Contentful Data
    const savedJobs = contentfulJobsRes.data.jobCollection.items.filter((job: any) => savedJobIds.has(job.sys.id));

    // Get enrolled courses with their tier info
    const enrolledCourses: any[] = [];

    enrollmentsMap.forEach((enrollment) => {
        const course = contentfulCoursesRes.data.courseCollection.items.find((c: any) => c.sys.id === enrollment.course_id);
        if (course) {
            const purchasedTier = course.tiers?.items?.find((tier: any) => tier.sys.id === enrollment.tier_id);
            enrolledCourses.push({
                ...course,
                enrollment: {
                    id: enrollment.id,
                    tierId: enrollment.tier_id,
                    purchasedAt: enrollment.purchased_at,
                    amountPaid: enrollment.amount_paid,
                    paymentStatus: enrollment.payment_status,
                    fullAccessGranted: enrollment.full_access_granted,
                    remainingAmount: enrollment.remaining_amount,
                    totalCourseAmount: enrollment.total_course_amount,
                    paymentType: enrollment.payment_type,
                    courseMode: enrollment.course_mode,
                    courseTitle: enrollment.course_title,
                    tierTitle: enrollment.tier_title,
                    durationMonths: enrollment.duration_months,
                    durationHours: enrollment.duration_hours,
                    mobileNo: enrollment.mobile_no,
                    tier: purchasedTier || null,
                }
            });
        }
    });

    // Sort by recent purchases
    enrolledCourses.sort((a, b) => {
        const dateA = new Date(a.enrollment.purchasedAt || 0).getTime();
        const dateB = new Date(b.enrollment.purchasedAt || 0).getTime();
        return dateB - dateA;
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

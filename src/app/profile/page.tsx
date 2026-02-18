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
        supabase.from('enrollments').select('course_id, purchased_at').eq('user_id', user.id),
        getJobsData(),
        getCourses()
    ]);

    const profile = profileRes.data;
    const savedJobIds = new Set(savedJobsRes.data?.map(j => j.job_id) || []);
    const enrolledCourseIds = new Set(enrollmentsRes.data?.map(c => c.course_id) || []);

    // Filter Contentful Data
    const savedJobs = contentfulJobsRes.data.jobCollection.items.filter(job => savedJobIds.has(job.sys.id));
    const enrolledCourses = contentfulCoursesRes.data.courseCollection.items.filter((course: any) => enrolledCourseIds.has(course.sys.id));

    return (
        <div className="min-h-screen bg-gray-50 px-20">
            <ProfileContent 
                user={user}
                profile={profile}
                savedJobs={savedJobs}
                enrolledCourses={enrolledCourses}
            />
        </div>
    )
}

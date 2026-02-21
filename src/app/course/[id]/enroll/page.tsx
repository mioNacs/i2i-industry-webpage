import { getCourse } from '@/lib/contentful/client';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EnrollmentForm from '@/components/forms/enrollment-form';
import { CourseTier } from '@/lib/contentful/types/courses';

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ tierId?: string }>;
}

export default async function EnrollPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { tierId } = await searchParams;

    if (!tierId) {
        redirect(`/course/${id}`);
    }

    // Get strictly authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Build the redirect URI back to here
        const currentPath = `/course/${id}/enroll?tierId=${tierId}`;
        redirect(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }

    // Fetch the course from Contentful
    const response = await getCourse(id); 
    const course = response.data.course; 

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
    }

    // Find the requested tier
    const tier = course.tiers?.items.find((t: CourseTier) => t.sys.id === tierId);

    if (!tier) {
        return <div className="min-h-screen flex items-center justify-center">Requested tier not found for this course</div>;
    }

    // check enrollment status
    let remainingPaymentMode = false;
    let remainingAmount = 0;

    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('tier_id, full_access_granted, remaining_amount, payment_status')
        .eq('user_id', user.id)
        .eq('course_id', course.sys.id)
        .eq('payment_status', 'completed')
        .single();
    
    if (enrollment) {
        if (enrollment.tier_id === tierId && !enrollment.full_access_granted && enrollment.remaining_amount > 0) {
            remainingPaymentMode = true;
            remainingAmount = enrollment.remaining_amount;
        } else if (enrollment.tier_id === tierId && enrollment.full_access_granted) {
            // Already fully enrolled in this tier, take them to profile
            redirect('/profile');
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col mb-8 text-center sm:text-left sm:flex-row items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">
                      Complete Your Enrollment
                  </h1>
                  <a href={`/course/${id}`} className="mt-4 sm:mt-0 text-primary hover:underline bg-primary/10 px-4 py-2 rounded-lg font-medium">
                      Back to Course
                  </a>
                </div>
                
                <EnrollmentForm
                    courseId={course.sys.id}
                    courseTitle={course.title}
                    tier={tier}
                    user={{
                      id: user.id || '',
                      email: user.email || '',
                      user_metadata: user.user_metadata,
                    }}
                    standalone={true}
                    remainingPaymentMode={remainingPaymentMode}
                    remainingAmount={remainingAmount}
                />
            </div>
        </main>
    );
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleSaveJob(jobId: string, isSaved: boolean) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('User not authenticated')
    }

    try {
        if (isSaved) {
            // Unsave: Delete the record
            const { error } = await supabase
                .from('saved_jobs')
                .delete()
                .match({ user_id: user.id, job_id: jobId })

            if (error) throw error
        } else {
            // Save: Insert the record
            const { error } = await supabase
                .from('saved_jobs')
                .insert({ user_id: user.id, job_id: jobId })

            if (error) {
                // Ignore unique violation if already saved (race condition)
                if (error.code !== '23505') throw error
            }
        }

        revalidatePath('/jobs')
        revalidatePath('/profile')
        return { success: true }
    } catch (error) {
        console.error('Error toggling saved job:', error)
        return { success: false, error: 'Failed to update saved job' }
    }
}

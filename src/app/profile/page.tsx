import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Container from '@/components/ui/container'
import SignOutButton from '@/components/auth/sign-out-button'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
            <Container className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 md:h-48 relative">
                        <div className="absolute -bottom-16 left-8 md:left-12">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-400">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.full_name || 'User Avatar'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{(profile?.full_name || user.email || '?')[0].toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 md:px-12 pb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {profile?.full_name || 'User Profile'}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </p>
                            </div>
                            <SignOutButton />
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Account Details
                            </h2>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        User ID
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded inline-block">
                                        {user.id}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Role
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 capitalize">
                                        {profile?.role || 'Student'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Joined
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                                        {new Date(user.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Last Sign In
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

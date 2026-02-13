'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Container from '@/components/ui/container'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useCountdown } from '@/hooks/use-countdown'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { timeLeft, startCountdown, isActive } = useCountdown()
    const supabase = createClient()

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
            })

            if (error) {
                toast.error(error.message)
            } else {
                setSuccess(true)
                toast.success('Password reset email sent!')
                startCountdown(60)
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Container className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Reset Password
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || isActive}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isActive
                                    ? `Resend available in ${timeLeft}s`
                                    : loading ? 'Sending link...' : 'Send reset link'
                                }
                            </button>
                        </form>
                    ) : (
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
                            <p className="text-green-800 dark:text-green-200">
                                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                            </p>
                            <div className="mt-4">
                                <button
                                    onClick={() => !isActive && setSuccess(false)}
                                    disabled={isActive}
                                    className="text-sm font-medium text-green-800 dark:text-green-200 underline hover:text-green-600 dark:hover:text-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isActive ? `Resend available in ${timeLeft}s` : 'Resend email'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}

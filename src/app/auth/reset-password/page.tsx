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
        <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-gray-700">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-accent mb-2">
                            Reset Password
                        </h1>
                        <p className="text-base-content/60">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="form-control">
                                <label className="label" htmlFor="email">
                                    <span className="label-text font-medium">Email address</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered w-full"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || isActive}
                                className="btn btn-accent text-white w-full normal-case text-lg"
                            >
                                {isActive
                                    ? `Resend available in ${timeLeft}s`
                                    : loading ? <span className="loading loading-spinner rounded-full"></span> : 'Send reset link'
                                }
                            </button>
                        </form>
                    ) : (
                        <div className="alert alert-success shadow-sm flex-col items-start gap-4">
                            <div>
                                <h3 className="font-bold">Check your email</h3>
                                <div className="text-sm">
                                    Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                                </div>
                            </div>
                            <button
                                onClick={() => !isActive && setSuccess(false)}
                                disabled={isActive}
                                className="btn btn-sm btn-ghost underline"
                            >
                                {isActive ? `Resend available in ${timeLeft}s` : 'Resend email'}
                            </button>
                        </div>
                    )}

                    <div className="text-center mt-6">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-sm font-medium text-base-content/60 hover:text-accent transition-colors"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

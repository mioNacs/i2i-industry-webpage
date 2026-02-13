'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Container from '@/components/ui/container'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useCountdown } from '@/hooks/use-countdown'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [needsConfirmation, setNeedsConfirmation] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const { timeLeft, startCountdown, isActive } = useCountdown()
    const router = useRouter()
    const supabase = createClient()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setNeedsConfirmation(false)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                if (error.message.includes('Email not confirmed')) {
                    setNeedsConfirmation(true)
                }
                toast.error(error.message)
            } else {
                toast.success('Logged in successfully!')
                router.push('/')
                router.refresh()
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleResendConfirmation = async () => {
        setResendLoading(true)
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Confirmation email sent! Please check your inbox.')
                setNeedsConfirmation(false)
                startCountdown(60)
            }
        } catch (error) {
            toast.error('Failed to resend confirmation email')
        } finally {
            setResendLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                toast.error(error.message)
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-gray-700">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-accent">
                            Welcome Back
                        </h1>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full gap-2 normal-case text-base"
                    >
                        <FcGoogle className="text-xl" />
                        Continue with Google
                    </button>

                    <div className="divider text-base-content/60 text-sm">Or continue with email</div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="form-control">
                            <label className="label" htmlFor="email">
                                <span className="label-text font-medium">Email address</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setNeedsConfirmation(false)
                                }}
                                className="input input-bordered w-full"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="••••••••"
                            />
                        </div>

                        {needsConfirmation && (
                            <div className="alert alert-warning shadow-sm">
                                <div className="flex flex-col gap-2 w-full">
                                    <span className="text-sm">Your email address has not been confirmed yet.</span>
                                    <button
                                        type="button"
                                        onClick={handleResendConfirmation}
                                        disabled={resendLoading || isActive}
                                        className="btn btn-xs btn-ghost underline justify-start px-0"
                                    >
                                        {isActive
                                            ? `Resend available in ${timeLeft}s`
                                            : resendLoading ? 'Sending...' : 'Resend confirmation email'
                                        }
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <label className="label cursor-pointer justify-start gap-2 p-0">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="checkbox checkbox-accent checkbox-sm"
                                />
                                <span className="label-text">Remember me</span>
                            </label>

                            <Link
                                href="/auth/reset-password"
                                className="link link-accent text-sm no-underline hover:underline font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-accent text-white w-full normal-case text-lg"
                        >
                            {loading ? <span className="loading loading-spinner rounded-full"></span> : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-base-content/60 mt-6">
                        Don't have an account?{' '}
                        <Link
                            href="/auth/signup"
                            className="link link-accent font-medium no-underline hover:underline"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

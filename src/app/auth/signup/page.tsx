'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Container from '@/components/ui/container'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })

            if (error) {
                toast.error(error.message)
            } else if (data.user) {
                if (data.user.identities && data.user.identities.length === 0) {
                    toast.error('User already registered')
                } else {
                    toast.success('Signup successful! Check your email for verification.')
                    router.push('/auth/login')
                }
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
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
                        <h1 className="text-3xl font-bold text-accent mb-2">
                            Create Account
                        </h1>
                        <p className="text-base-content/60">
                            Join us to start your journey
                        </p>
                    </div>

                    <button
                        onClick={handleGoogleSignup}
                        className="btn btn-outline w-full gap-2 normal-case text-base"
                    >
                        <FcGoogle className="text-xl" />
                        Sign up with Google
                    </button>

                    <div className="divider text-base-content/60 text-sm">Or sign up with email</div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="form-control">
                            <label className="label" htmlFor="fullName">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="John Doe"
                            />
                        </div>

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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-accent text-white w-full normal-case text-lg"
                        >
                            {loading ? <span className="loading loading-spinner rounded-full"></span> : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-base-content/60 mt-6">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="link link-accent font-medium no-underline hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

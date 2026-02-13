'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Container from '@/components/ui/container'
import { toast } from 'react-hot-toast'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Password updated successfully!')
                router.push('/')
                router.refresh()
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
                            Set New Password
                        </h1>
                        <p className="text-base-content/60">
                            Please enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text font-medium">New Password</span>
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

                        <div className="form-control">
                            <label className="label" htmlFor="confirmPassword">
                                <span className="label-text font-medium">Confirm Password</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-accent text-white w-full normal-case text-lg"
                        >
                            {loading ? <span className="loading loading-spinner rounded-full"></span> : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

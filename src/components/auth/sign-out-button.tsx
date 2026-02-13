'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SignOutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSignOut = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {
                toast.error('Error signing out')
                console.error('Error signing out:', error)
            } else {
                toast.success('Signed out successfully')
                router.push('/auth/login')
                router.refresh()
            }
        } catch (error) {
            console.error('Unexpected error signing out:', error)
            toast.error('Unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Signing out...' : 'Sign Out'}
        </button>
    )
}

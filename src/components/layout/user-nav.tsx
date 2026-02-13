'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FaUserCircle } from 'react-icons/fa'
import { LuLogOut, LuUser } from 'react-icons/lu'
import { User } from '@supabase/supabase-js'

export default function UserNav() {
    const [user, setUser] = useState<User | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setIsOpen(false)
        router.refresh()
    }

    if (loading) return null

    if (!user) {
        return (
            <Link
                href="/auth/login"
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
                Login / Signup
            </Link>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                {user.user_metadata.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover"
                    />
                ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-600 hover:text-primary transition-colors" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user.user_metadata.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                        </p>
                    </div>

                    <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <LuUser className="w-4 h-4" />
                        Profile
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                    >
                        <LuLogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

'use client'

import Link from 'next/link'
import Container from '@/components/ui/container'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function VerifiedPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Container>
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6 text-center max-w-md w-full mx-auto">
                    <div className="flex justify-center">
                        <CheckCircleIcon className="h-16 w-16 text-green-500" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Email Verified!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Your email has been successfully verified. You can now login with your email.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/auth/login"
                            className="inline-block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}

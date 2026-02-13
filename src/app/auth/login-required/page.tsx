import Link from 'next/link'
import Container from '@/components/ui/container'
import { LockClosedIcon } from '@heroicons/react/24/outline'

export default function LoginRequiredPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Container className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                            <LockClosedIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Login Required
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            You need to be logged in to access this page. Please sign in or create an account to continue.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Link
                            href="/auth/login"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity text-center shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-center"
                        >
                            Create Account
                        </Link>
                    </div>

                    <div className="text-sm">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}

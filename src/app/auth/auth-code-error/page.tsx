'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/ui/container'
import { Suspense, useEffect, useState } from 'react'

function AuthCodeErrorContent() {
    const searchParams = useSearchParams()
    const [errorState, setErrorState] = useState<{ error: string | null, errorCode: string | null, errorDescription: string | null }>({
        error: searchParams.get('error'),
        errorCode: searchParams.get('error_code'),
        errorDescription: searchParams.get('error_description')
    })

    useEffect(() => {
        // Check hash for errors (Supabase sometimes returns errors in hash for certain flows)
        if (window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1)) // remove #
            const hashError = hashParams.get('error')
            const hashErrorCode = hashParams.get('error_code')
            const hashErrorDescription = hashParams.get('error_description')

            if (hashError || hashErrorCode || hashErrorDescription) {
                setErrorState({
                    error: hashError || searchParams.get('error'),
                    errorCode: hashErrorCode || searchParams.get('error_code'),
                    errorDescription: hashErrorDescription || searchParams.get('error_description')
                })
            }
        }
    }, [searchParams])

    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6 text-center max-w-md w-full">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-red-600">
                    Authentication Error
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    We encountered an issue while signing you in.
                </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-xl text-left text-sm overflow-auto">
                {errorState.error && <p><strong>Error:</strong> {errorState.error}</p>}
                {errorState.errorCode && <p><strong>Code:</strong> {errorState.errorCode}</p>}
                {errorState.errorDescription && <p><strong>Description:</strong> {errorState.errorDescription.replace(/\+/g, ' ')}</p>}
                {!errorState.error && !errorState.errorCode && !errorState.errorDescription && (
                    <p>Unknown error occurred during authentication code exchange.</p>
                )}
            </div>

            <div className="pt-4">
                <Link
                    href="/auth/login"
                    className="inline-block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Container>
                <Suspense fallback={<div>Loading error details...</div>}>
                    <AuthCodeErrorContent />
                </Suspense>
            </Container>
        </div>
    )
}

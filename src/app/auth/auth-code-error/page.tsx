'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/ui/container'
import { Suspense, useEffect, useState } from 'react'
import { HiExclamationCircle, HiCheckCircle, HiHome, HiArrowRight } from 'react-icons/hi'

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

    const isOtpExpired = errorState.errorCode === 'otp_expired';

    return (
        <div className="card w-full max-w-lg bg-base-100 shadow-xl border-2 border-gray-700 overflow-hidden">
            <div className={`h-2 w-full ${isOtpExpired ? 'bg-success' : 'bg-error'}`} />
            
            <div className="card-body items-center text-center p-8 sm:p-10">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 
                    ${isOtpExpired ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}
                >
                    {isOtpExpired ? (
                        <HiCheckCircle className="w-12 h-12" />
                    ) : (
                        <HiExclamationCircle className="w-12 h-12" />
                    )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-3">
                    {isOtpExpired ? 'Email Likely Verified' : 'Authentication Issue'}
                </h1>
                
                <p className="text-base-content/70 mb-8 max-w-sm">
                    {isOtpExpired
                        ? 'The link involved has expired, which usually means your email was already verified successfully. You can proceed to login.'
                        : 'We encountered a problem while trying to sign you in. Please check the details below or try again.'}
                </p>

                {/* Error Details Box */}
                {!isOtpExpired && (
                    <div className="w-full text-left bg-base-200/50 rounded-lg p-4 mb-8 border border-base-200 text-sm font-mono overflow-x-auto">
                        <div className="space-y-1">
                            {errorState.error && (
                                <div className="flex flex-col sm:flex-row sm:gap-2">
                                    <span className="font-bold text-error/80 uppercase tracking-wider text-xs">Error:</span>
                                    <span className="text-base-content/80 break-all">{errorState.error}</span>
                                </div>
                            )}
                            {errorState.errorCode && (
                                <div className="flex flex-col sm:flex-row sm:gap-2">
                                    <span className="font-bold text-error/80 uppercase tracking-wider text-xs">Code:</span>
                                    <span className="text-base-content/80">{errorState.errorCode}</span>
                                </div>
                            )}
                            {errorState.errorDescription && (
                                <div className="flex flex-col sm:flex-row sm:gap-2">
                                    <span className="font-bold text-error/80 uppercase tracking-wider text-xs">Desc:</span>
                                    <span className="text-base-content/80">{errorState.errorDescription.replace(/\+/g, ' ')}</span>
                                </div>
                            )}
                            {!errorState.error && !errorState.errorCode && !errorState.errorDescription && (
                                <span className="text-base-content/60 italic">Unknown error occurred.</span>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link
                        href="/auth/login"
                        className={`btn w-full sm:flex-1 ${isOtpExpired ? 'btn-success text-white' : 'btn-primary'}`}
                    >
                        {isOtpExpired ? 'Continue to Login' : 'Try Logging In'}
                        <HiArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    
                    <Link
                        href="/"
                        className="btn btn-ghost w-full sm:flex-1"
                    >
                        <HiHome className="mr-2 w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-base-100 px-4">
            <Container className="flex justify-center w-full">
                <Suspense fallback={<div className="loading loading-spinner loading-lg text-primary"></div>}>
                    <AuthCodeErrorContent />
                </Suspense>
            </Container>
        </div>
    )
}

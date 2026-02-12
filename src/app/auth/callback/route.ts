import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Failsafe: Check if profile exists, if not create it
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.id)
                    .single()

                if (!profile) {
                    try {
                        const { error: insertError } = await supabase.from('profiles').insert({
                            id: user.id,
                            email: user.email,
                            full_name: user.user_metadata.full_name,
                            avatar_url: user.user_metadata.avatar_url,
                        })
                        if (insertError) {
                            console.error('Failsafe profile creation failed:', insertError)
                        }
                    } catch (err) {
                        console.error('Unexpected error in profile creation failsafe:', err)
                    }
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            // Redirect to error page with error details
            console.error('Supabase Auth Error:', error)
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error.name}&error_description=${encodeURIComponent(error.message)}`)
        }
    }

    // return the user to an error page with instructions
    // Log the error for debugging
    console.error('Callback Error: No code provided in URL. Search params:', searchParams.toString())

    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const errorCode = searchParams.get('error_code')

    if (error) {
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}&error_description=${errorDescription}&error_code=${errorCode}`)
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&error_description=No+authorization+code+returned+from+provider.+Params:+${searchParams.toString()}`)
}

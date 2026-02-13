import { useState, useEffect, useCallback } from 'react'

interface UseCountdownReturn {
    timeLeft: number
    startCountdown: (seconds: number) => void
    isActive: boolean
}

export function useCountdown(): UseCountdownReturn {
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        if (timeLeft <= 0) return

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timerId)
    }, [timeLeft])

    const startCountdown = useCallback((seconds: number) => {
        setTimeLeft(seconds)
    }, [])

    return {
        timeLeft,
        startCountdown,
        isActive: timeLeft > 0
    }
}

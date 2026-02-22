import { useState, useEffect, useRef } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * useCountdown — counts down to a target date.
 * The targetDate ref is captured once from a stable initial value,
 * so reloading the page does NOT reset the timer to a fresh countdown.
 *
 * Usage: pass a stable Date object (e.g. from useMemo or a module constant).
 */
export function useCountdown(targetDate: Date): TimeLeft {
    const stableTarget = useRef(targetDate);

    const getTimeLeft = (): TimeLeft => {
        const difference = stableTarget.current.getTime() - Date.now();
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return timeLeft;
}

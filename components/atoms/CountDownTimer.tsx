"use client"
import { StudyTime } from '@/lib/icons';
import { CountdownTimerProps } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';

const CountDownTimer: React.FC<CountdownTimerProps> = ({
    minutes = 0,
    seconds = 0,
    className = '',
}) => {
    const totalSeconds = minutes * 60 + seconds;
    const [timeLeft, setTimeLeft] = useState(totalSeconds);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const formatTime = (total: number) => {
        const mins = Math.floor(total / 60);
        const secs = total % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    useEffect(() => {
        setTimeLeft(minutes * 60 + seconds);
    }, [minutes, seconds]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft]);

    const isFinished = timeLeft === 0;

    return (
        <div
            className={`
        inline-flex flex-col items-center rounded-2xl

        ${className}
      `}
        >
            <div className={`w-20 md:w-24 lg:w-28 rounded-full p-2 md:p-3 lg:p-4 flex gap-1 md:gap-1.5 lg:gap-2 items-center justify-center text-xs md:text-sm lg:text-base font-medium tracking-wider
            ${isFinished ? 'text-destructive animate-pulse bg-destructive/20' : 'text-primary bg-primary/20'}
            transition-colors duration-300`}>
                <StudyTime className='h-auto w-4 md:w-5 lg:w-6'/>
                <div>
                    {formatTime(timeLeft)}
                </div>
            </div>
        </div>
    );
}

export default CountDownTimer;
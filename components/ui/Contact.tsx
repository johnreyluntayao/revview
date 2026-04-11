"use client"

import { Button } from '@/lib/client-imports'
import { ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';


const Contact = () => {
    const router = useRouter();

    const handleStartReviewing = () => {
        router.push('/quiz-selection');
    }

    return (
        <section className='w-full '>
            <div className='w-full h-[50vh] flex flex-col bg-linear-to-r from-hero1 to-hero2 text-white items-center justify-center text-center text-pretty gap-4 md:gap-6 lg:gap-8 px-8 md:px-10 lg:px-12'>
                <h1 className='text-2xl md:text-[32px] lg:text-5xl font-bold text-primary-foreground'>
                    Ready to Ace your Exam?
                </h1>
                <p className='text-sm md:text-base lg:text-lg text-primary50'>
                    Start your free preparation journey today. No credit card required.
                </p>
                <Button text='Start Reviewing Now' textColor={'text-primary-foreground'} backgroundColor={'bg-linear-to-r from-primary/80 to-secondary/80'} rightIcon={<ArrowRightIcon />} onClick={handleStartReviewing}/>
            </div>
        </section>

    )
}

export default Contact
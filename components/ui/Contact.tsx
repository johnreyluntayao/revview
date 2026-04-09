import { Button } from '@/lib/client-imports'
import { ArrowRightIcon } from 'lucide-react'


const Contact = () => {
    return (
        <section>
            <div className='w-full h-[50vh] flex flex-col bg-linear-to-r from-hero1 to-hero2 text-white items-center justify-center text-center text-pretty gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-8'>
                <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold'>
                    Ready to Ace your Exam?
                </h1>
                <p className='text-sm md:text-base lg:text-lg font-light text-white/80'>
                    Start your free preparation journey today. No credit card required.
                </p>
                <Button text='Start Reviewing Now' textColor={'text-primary-foreground'} backgroundColor={'bg-primary'} rightIcon={<ArrowRightIcon />} />
            </div>
        </section>

    )
}

export default Contact
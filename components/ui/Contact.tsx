import React from 'react'
import Button from '../atoms/Button'

const Contact = () => {
    return (
        <section>
            <div className='w-full h-screen flex flex-col bg-primary/10 items-center justify-center text-center text-pretty gap-4 md:gap-6 lg:gap-8'>
                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>
                    Ready to Ace the CSE?
                </h1>
                <p className='text-base md:text-lg lg:text-xl text-foreground/60'>
                    Interactive online reviewer with instant feedback, progress tracking, and comprehensive coverage of all CSE categories.
                </p>
                <Button text='Start Reviewing Now' textColor={'text-primary-foreground'} backgroundColor={'bg-primary'} />
            </div>
        </section>

    )
}

export default Contact
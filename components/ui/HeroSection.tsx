import React from 'react'
import Button from '../atoms/Button'

const HeroSection = () => {
  return (
    <section>
      <div className='w-full h-screen 
        flex flex-col 
        items-center justify-center
        text-center text-pretty 
        gap-4 md:gap-6 lg:gap-8'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground'>
          Master the Civil Service Exam
        </h1>
        <p className='text-lg md:text-xl lg:text-2xl text-foreground/60'>
          Interactive online reviewer with instant feedback, progress tracking, and comprehensive coverage of all CSE categories.
        </p>

        <div className='grid grid-cols-2 gap-2 md:gap-4 lg:gap-6'>
          <Button text='Get Started' textColor={'text-primary-foreground'} backgroundColor={'bg-primary'} />
          <Button text='Learn More' textColor={'text-primary'} backgroundColor={'bg-primary-foreground'} borderColor='border-primary' />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
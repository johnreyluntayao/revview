import { Button } from '@/lib/client-imports'

const HeroSection = () => {
  return (
    <section>
      <div className='w-full h-screen max-h-[95vh]
        flex flex-col 
        items-center justify-center
        text-center text-pretty 
        gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8
        bg-heroGradient'>
        <div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6'>
          Master your Exam at <span className='text-primary'>RevView</span>
        </h1>
        <p className='text-lg md:text-xl lg:text-2xl text-foreground/60'>
          Interactive online reviewer with instant feedback, progress tracking, and comprehensive coverage of all exam categories.
        </p>
        </div>
        
        <div className='grid grid-cols-2 gap-2 md:gap-4 lg:gap-6'>
          <Button text='Get Started' textColor={'text-primary-foreground'} backgroundColor={'bg-primary'} />
          <Button text='Learn More' textColor={'text-primary'} backgroundColor={'bg-primary-foreground'} borderColor='border-primary' />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
import React from 'react'

import { SelectCategory, SelectDifficultyLevel, SelectNumQuestions, SummaryPanel } from '@/lib/imports'

const CustomizeQuiz = () => {
  return (
    <div className='mx-4 md:mx-6 lg:mx-8 py-10 gap-4 md:gap-6 lg:gap-8 flex flex-col'>
        <div className='text-center'>
          <h1 className='text-lg md:text-2xl lg:text-4xl font-bold text-foreground mb-1 md:mb-1.5 lg:mb-2'>
          Customize your Review
        </h1>
        <p className='text-xs md:text-base lg:text-lg text-foreground/60'>
          Choose your category, number of questions, and difficulty to start your personalized quiz.
        </p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
          <div className='col-span-2 flex flex-col gap-4 md:gap-6 lg:gap-8'>
            <SelectCategory/>
            <SelectNumQuestions/>
            <SelectDifficultyLevel/>
          </div>
          <div className='col-span-1'>
            <SummaryPanel
            categories={[]} // Pass actual categories data
            selectedCategory={null} // Pass actual selected category
            selectedQuestions={0} // Pass actual number of selected questions   
            selectedDifficulty={''} totalTime={''} isStarting={false} handleStartQuiz={function (): void {
              throw new Error('Function not implemented.')
            } }            />
          </div>
          
        </div>
        
    </div>
  )
}

export default CustomizeQuiz
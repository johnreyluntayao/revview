import React from 'react'
import SelectCategory from './ui/SelectCategory'
import SelectDifficultyLevel from './ui/SelectDifficultyLevel'
import SelectNumQuestions from './ui/SelectNumQuestions'

const CustomizeMain = () => {
  return (
    <div className='mx-4 md:mx-8 lg:mx-16 py-10 gap-4 md:gap-5 lg:gap-6 flex flex-col'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6'>
          Customize your Review
        </h1>
        <p className='text-lg md:text-xl lg:text-2xl text-foreground/60'>
          Choose your category, number of questions, and difficulty to start your personalized quiz.
        </p>
        </div>
        
        <SelectCategory/>
        <SelectNumQuestions/>
        <SelectDifficultyLevel/>
    </div>
  )
}

export default CustomizeMain
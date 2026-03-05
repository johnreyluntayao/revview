import React from 'react'
import Progress from '../atoms/Progress'

const categories = [
  {
    title: 'Numerical Ability',
    value: 69,
    testCount: 4
  },
  {
    title: 'Analytical Ability',
    value: 42,
    testCount: 10
  },
  {
    title: 'Verbal Ability',
    value: 6,
    testCount: 7
  },
  {
    title: 'General Information',
    value: 40,
    testCount: 44
  }
]

const CategoryProgress = () => {
  return (
    <section>
      <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-4 lg:p-6 rounded-xl border-border border ">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
          Category Progress
        </h1>
        {categories.map((value) => (
          <div key={value.title} className="w-full" >
            <Progress variant='percent' percentage={value.value} label={value.title} subLabel={`${value.testCount} test completed`}/>

          </div>
        ))}

      </div>

    </section>
  )
}

export default CategoryProgress
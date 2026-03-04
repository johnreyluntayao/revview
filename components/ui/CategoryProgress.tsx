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
      <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-3 lg:p-4 rounded-xl border-border border">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-5">
          Comprehensive Coverage
        </h1>
        {categories.map((value) => (

          <div key={value.title} className="w-full overflow-hidden" >
            <Progress variant='percent' percentage={value.value} label={value.title} subLabel={`${value.testCount} test completed`}/>

          </div>
        ))}

      </div>

    </section>
  )
}

export default CategoryProgress
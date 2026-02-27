'use client'
import React from 'react'
import List from '../atoms/List'
import { CustomQuiz } from '@/lib/icons'

const categories = [
  {
    title: 'Numerical Ability',
    items: [
      { label: 'Basic operations' },
      { label: 'Word problems' },
      { label: 'Quick calculations' },
    ],
  },
  {
    title: 'Analytical Ability',
    items: [
      { label: 'Word association' },
      { label: 'Logic & reasoning' },
      { label: 'Data interpretation' },
    ],
  },
  {
    title: 'Verbal Ability',
    items: [
      { label: 'Grammar & usage' },
      { label: 'Vocabulary' },
      { label: 'Reading comprehension' },
    ],
  },
  {
    title: 'General Information',
    items: [
      { label: 'Philippine Constitution' },
      { label: 'Code of Conduct' },
      { label: 'Peace & Human Rights' },
    ],
  },
]

const ComprehensiveCoverage = () => {
  return (
    <section>
      <div className="w-full h-screen flex flex-col justify-center text-pretty gap-4 md:gap-6 lg:gap-8">
        <h1 className="self-center text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-10">
          Comprehensive Coverage
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((category) => (
            <div
              key={category.title}
              className="w-full p-6 bg-primary/10 rounded-xl shadow-md overflow-hidden border"
            >
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground">
                {category.title}
              </h2>
              <div className="pl-2 py-2">
                <List
                  items={category.items}
                  isNumberedList={false}
                  sharedIcon={CustomQuiz}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ComprehensiveCoverage
import React from 'react'
import Card from '../atoms/Card'
import { BookOpen, User } from 'lucide-react'
import { CustomQuiz, InstantFeedback, ProgressTracking } from '@/lib/icons';

const featureCards = [
    {
        icon: <InstantFeedback size={44} strokeWidth={1.8} />,
        title: "Instant Feedback",
        description: "Get immediate answers and detailed explanations for every question.",

    },
    {
        icon: <ProgressTracking size={44} strokeWidth={1.8} />,
        title: "Progress Tracking",
        description: "Monitor your improvement across all categories with detailed analytics.",
        
    },
    {
        icon: <BookOpen size={44} strokeWidth={1.8} />,
        title: "All Categories",
        description: "Complete coverage of Numerical, Analytical, Verbal, and General Information.",
        
    },
    {
        icon: <CustomQuiz size={44} strokeWidth={1.8} />,
        title: "Customizable Quizzes",
        description: "Choose difficulty, number of questions, and specific categories.",
        
    },
];

const WhyChoose = () => {
    return (
        <section>
            <div className='w-full h-screen flex flex-col items-center justify-center text-pretty gap-4 md:gap-6 lg:gap-8'>

                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-10'>
                    Why Choose CSE Reviewer?
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featureCards.map((feature, idx) => (
                        <Card
                            key={idx}
                            variant="compact"
                            icon={feature.icon}
                            title={feature.title}
                            value={feature.description}
                            className="h-full flex flex-col justify-start items-start text-left"
                        />
                    ))}
                </div>

            </div>
        </section>

    )
}

export default WhyChoose
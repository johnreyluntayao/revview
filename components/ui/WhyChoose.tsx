
import { Card } from '@/lib/client-imports'
import { CustomQuiz, InstantFeedback, ProgressTracking, AllCategories } from '@/lib/icons';

const featureCards = [
    {
        icon: <InstantFeedback  className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12" strokeWidth={1.8}/>,
        title: "Instant Feedback",
        description: "Get immediate answers and detailed explanations for every question.",

    },
    {
        icon: <ProgressTracking  className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12" strokeWidth={1.8} />,
        title: "Progress Tracking",
        description: "Monitor your improvement across all categories with detailed analytics.",
        
    },
    {
        icon: <AllCategories  className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12" strokeWidth={1.8}/>,
        title: "All Categories",
        description: "Complete coverage of Numerical, Analytical, Verbal, and General Information.",
        
    },
    {
        icon: <CustomQuiz  className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12" strokeWidth={1.8}/>,
        title: "Customizable Quizzes",
        description: "Choose difficulty, number of questions, and specific categories.",
        
    },
];

const WhyChoose = () => {
    return (
        <section>
            <div className='w-full min-h-screen flex flex-col items-center justify-center text-pretty gap-4 md:gap-6 lg:gap-8 py-4 md:py-6 lg:py-8'>

                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>
                    Why Choose <span className='text-primary'>RevView</span>?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 ">
                    {featureCards.map((feature, idx) => (
                        <Card
                            key={idx}
                            variant="compact"
                            icon={feature.icon}
                            title={feature.title}
                            value={feature.description}
                            className="h-full flex flex-col justify-between items-start text-left "
                            bg='bg-linear-to-br from-primary/70 to-secondary/70'
                            textColor='text-white'
                            iconColor='text-white'
                        />
                    ))}
                </div>

            </div>
        </section>

    )
}

export default WhyChoose
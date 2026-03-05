import React from 'react'
import { AverageScore, BestCategory,  ProgressTracking, StudyTime } from '@/lib/icons';
import { Card } from '@/lib/client-imports';

const featureCards = [
    {
        icon: <ProgressTracking />,
        title: "Total Test",
        description: "25",

    },
    {
        icon: <AverageScore />,
        title: "Average Score",
        description: "40%",

    },
    {
        icon: <BestCategory />,
        title: "Best Category",
        description: "Verbal",

    },
    {
        icon: <StudyTime />,
        title: "Best time",
        description: "10mins",

    },
];

const SummaryCards = () => {
    return (
        <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 w-full">
                {featureCards.map((feature, idx) => (
                    <Card
                        key={idx}
                        variant="data"
                        icon={feature.icon}
                        title={feature.title}
                        value={feature.description}
                    />
                ))}
            </div>

        </section>
    )
}

export default SummaryCards
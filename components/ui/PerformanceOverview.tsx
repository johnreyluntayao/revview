import { Card } from "@/lib/imports"


const PerformanceOverview = () => {
    return (
        <section>
            <div className="w-full h-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-4 lg:p-6 rounded-xl border-border border ">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
                    Performance Overview
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-6">

                    <Card variant="highlight" title="Overall Score" value="68%" textColor="text-primary/90" bg="bg-primary/5" subValue='Based on completed quizzes' className='col-span-1 md:col-span-2' />
                    <Card variant="highlight" title="Best Score" value="69%" textColor="text-green-600" bg="bg-green-50" className='col-span-1' />
                    <Card variant="highlight" title="Lowest Score" value="67%" textColor="text-orange-600" bg="bg-orange-50" className='col-span-1' />

                </div>



            </div>

        </section>
    )
}

export default PerformanceOverview
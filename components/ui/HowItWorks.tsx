import { List } from '@/lib/client-imports';

const howItWorks = [
    {
        label: "Sign In",
        description:
            "Log in with your Google account or email to access your personalized dashboard and track your progress.",
    },
    {
        label: "Customize Your Quiz",
        description:
            "Select categories (Verbal Ability, General Information), difficulty level, and number of questions that match your study goals.",
    },
    {
        label: "Take the Quiz",
        description:
            "Answer questions under realistic time pressure with a countdown timer. No going back once you submit an answer!",
    },

    {
        label: "Learn & Improve",
        description:
            "Receive instant feedback with detailed explanations to strengthen your understanding.",
    }
    

];

const HowItWorks = () => {
    return (
        <section>
            <div className='w-full flex flex-col items-center justify-center text-pretty gap-4 md:gap-6 lg:gap-8  p-4 md:p-6 lg:p-8 min-h-screen'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>
                    How It Works
                </h2>
                <List items={howItWorks} isNumberedList={true} />
            </div>

        </section>

    )
}

export default HowItWorks
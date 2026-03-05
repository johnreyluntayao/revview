import { ScoreCard, Card, QuizAccordion } from "@/lib/client-imports";


const QuizResult = () => {

    const sampleQuestions = [
    {
        id: "q1",
        text: "What is the primary source of energy for Earth's climate system?",
        options: [
        "Geothermal heat from the Earth's core",
        "Solar radiation from the Sun",
        "Tidal forces from the Moon",
        "Radioactive decay in the mantle",
        ],
        correctAnswer: "B",
        explanation:
        "The Sun provides nearly all the energy that drives Earth's climate system through solar radiation. Geothermal, tidal, and radioactive sources contribute only a tiny fraction.",
    },
    {
        id: "q2",
        text: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Linked List", "Stack", "Binary Tree"],
        correctAnswer: "C",
        explanation:
        "A **stack** follows the LIFO principle — the last element added is the first one removed (like a stack of plates). Queues use FIFO (First In, First Out).",
    },
    {
        id: "q3",
        text: "In JavaScript, what is the result of `typeof null`?",
        options: ["null", "undefined", "object", "boolean"],
        correctAnswer: "C",
        explanation:
        "Due to a famous bug in the original JavaScript implementation, `typeof null` returns `'object'`. This is considered a historical error that was never fixed for backward compatibility.",
    },
    {
        id: "q4",
        text: "Which planet has the shortest day in our solar system?",
        options: ["Mercury", "Jupiter", "Earth", "Saturn"],
        correctAnswer: "B",
        explanation:
        "Jupiter has the shortest day of any planet, completing one rotation in approximately **9 hours and 56 minutes**. Despite being much larger than Earth, it rotates very quickly.",
    },
    ];

    const sampleAnswers = [
    {
        questionId: "q1",
        selectedOption: "B",
        isCorrect: true,
    },
    {
        questionId: "q2",
        selectedOption: "C",
        isCorrect: true,
    },
    {
        questionId: "q3",
        selectedOption: "A", // wrong
        isCorrect: false,
    },
    {
        questionId: "q4",
        selectedOption: "C", // wrong
        isCorrect: false,
    },
    ];

  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 space-y-4 md:space-y-6 lg:space-y-8 bg-linear-to-br from-primary/5 to-secondary/5">
        <div>
            <ScoreCard
                score={50}
                correctCount={31}
                totalQuestions={40}
                minutesUsed={12}
                secondsUsed={45}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-5">
            <Card variant="overview" title="Category" value="Numerical"/>
            <Card variant="overview" title="Difficulty" value="Medium"/>
        </div>
        <div className="rounded-xl border border-border p-4 md:p-6 lg:p-8 bg-white">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-5 lg:mb-6 text-foreground">
            Answer Review
          </h2>

        <QuizAccordion 
            questions={sampleQuestions}
            answers={sampleAnswers} 
        />
        </div>
    </div>
  )
}

export default QuizResult
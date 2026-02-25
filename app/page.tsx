import Card from "@/components/atoms/Card";
import Chip from "@/components/atoms/Chip";
import CountDownTimer from "@/components/atoms/CountDownTimer";
import Feedback from "@/components/atoms/Feedback";
import Footer from "@/components/atoms/Footer";
import Progress from "@/components/atoms/Progress";
import { NavBar, QuizAccordion } from "@/lib/imports";
import { Car, Eye } from "lucide-react";

import { Users, UserCheck, BookOpen, BarChart2, Trophy, Clock } from "lucide-react";


export default function Home() {

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
    <div className="flex min-h-screen items-center justify-center font-sans">

   <QuizAccordion
   questions={sampleQuestions}
    answers={sampleAnswers} 
   />

</div>
  );
}

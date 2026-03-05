"use client";

import { IncorrectAnswer, CorrectAnswer } from "@/lib/icons";
import { Chip } from "@/lib/client-imports";
import { useState } from "react";

interface Question {
  id: string | number;
  text: string;
  options: string[];
  correctAnswer: string; 
  explanation: string;
}

interface Answer {
  questionId: string | number;
  selectedOption: string;
  isCorrect: boolean;
}

interface QuizAccordionProps {
  questions: Question[];
  answers: Answer[];
}

const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function QuizAccordion({
  questions,
  answers,
}: QuizAccordionProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  return (
    <div className="space-y-4 w-full">
      {questions.map((question, idx) => {
        const answer = answers.find((a) => a.questionId === question.id);
        const isExpanded = expandedQuestion === idx;

        return (
          <div
            key={question.id ?? idx}
            className="border border-border rounded-xl overflow-hidden bg-card"
          >
            <button
              onClick={() =>
                setExpandedQuestion(isExpanded ? null : idx)
              }
              className="w-full p-5 sm:p-6 hover:bg-muted/40 transition-colors text-left flex items-start gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  answer?.isCorrect
                    ? "bg-success/10"
                    : "bg-destructive/10"
                }`}
              >
                {answer?.isCorrect ? (
                  <CorrectAnswer className="w-6 h-6 text-success" />
                ) : (
                  <IncorrectAnswer className="w-6 h-6 text-destructive" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground mb-1.5">
                  Question {idx + 1}
                </p>
                <p className="text-foreground">
                  {question.text}
                </p>
              </div>

              <div className="hidden md:block">
                <Chip 
                  variant={`${answer?.isCorrect ? "correct" : "incorrect"}`} 
                  text={answer?.isCorrect ? "Correct" : "Incorrect"}
                />
              </div>
              
            </button>

            <div
              className={`
                grid transition-all duration-300 ease-out
                ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
              `}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border p-5 sm:p-6 bg-muted/30">
                  <div className="space-y-6">
                    {/* Options */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">
                        All Options:
                      </p>
                      <div className="space-y-2.5">
                        {question.options.map((option, optIdx) => {
                          const letter = optionLetters[optIdx] ?? String(optIdx + 1);
                          const isCorrect = letter === question.correctAnswer;
                          const isSelected = letter === answer?.selectedOption;

                          return (
                            <div
                              key={optIdx}
                              className={`p-3.5 rounded-lg border transition-colors ${
                                isCorrect && isSelected
                                  ? "border-success/50 bg-success/5"
                                  : isCorrect
                                  ? "border-success/40 bg-success/8"
                                  : isSelected && !answer?.isCorrect
                                  ? "border-destructive/50 bg-destructive/5"
                                  : "border-border/60 bg-background/40"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-foreground min-w-6">
                                  {letter}.
                                </span>
                                <span className="text-foreground flex-1">
                                  {option}
                                </span>

                                {isCorrect && (
                                  <Chip variant="correct" text="Correct" />
                                )}

                                {isSelected && !answer?.isCorrect && (
                                  <Chip variant="incorrect" text="Your Answer" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2.5">
                          Explanation:
                        </p>
                        <div className="prose prose-neutral dark:prose-invert text-foreground text-[15px] leading-relaxed">
                          {question.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
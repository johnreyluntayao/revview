"use client";

import { IncorrectAnswer, CorrectAnswer } from "@/lib/icons";
import { Chip } from "@/lib/client-imports";
import { useState } from "react";
import Image from "next/image";

interface Question {
  id: string | number;
  text: string;
  options: (string | null | undefined)[];
  option_images?: string[] | null;    
  correctAnswer: string;
  explanation: string;
  img_url?: string | null;      
  explanation_img_url?: string | null; 
}

interface Answer {
  questionId: string | number;
  selectedOption: string | null;
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
    <div className="space-y-2 md:space-y-3 lg:space-y-4 w-full">
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
              className="w-full p-4 md:p-5 lg:p-6 hover:bg-muted/40 transition-colors text-left flex items-start gap-2 md:gap-3 lg:gap-4"
            >
              <div
                className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  answer?.isCorrect
                    ? "bg-success/10"
                    : "bg-destructive/10"
                }`}
              >
                {answer?.isCorrect ? (
                  <CorrectAnswer className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-success" />
                ) : (
                  <IncorrectAnswer className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-destructive" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-xs md:text-sm lg:text-base">
                <div className="flex-1 space-y-4 md:space-y-0 md:flex justify-start items-start gap-0 md:gap-5 lg:gap-6">
                  <div>
                    <p className="font-semibold text-foreground mb-0.5 md:mb-1 lg:mb-1.5">
                  Question {idx + 1}
                </p>
                <p className="whitespace-pre-wrap text-foreground">{question.text}</p>
                  </div>
                   {question.img_url && (
                  <div className="">
                    <Image
                      src={question.img_url}
                      alt={`Question ${idx + 1} image`}
                      width={1000}
                      height={1000}
                      className="rounded-lg border border-border max-w-full w-auto  h-36 md:h-48 lg:h-56"
                      priority={idx === 0}
                    />
                  </div>
                )}
                </div>
               

                
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
                <div className="border-t border-border p-4 md:p-5 lg:p-6 bg-muted/30">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-muted-foreground mb-1 md:mb-2 lg:mb-3">
                        All Options:
                      </p>
                      <div className="space-y-1 md:space-y-2 lg:space-y-3">
                        {question.options.flatMap((option, optIdx) => {
                          if (typeof option !== "string" || !option.trim()) {
                            return [];
                          }

                          const letter = optionLetters[optIdx] ?? String(optIdx + 1);
                          const isCorrect = letter === question.correctAnswer;
                          const isSelected = letter === answer?.selectedOption;

                          const optionImage = question.option_images?.[optIdx];

                          return (
                            <div
                              key={letter}
                              className={`p-2 md:p-3 lg:p-4 rounded-lg border transition-colors ${
                                isCorrect && isSelected
                                  ? "border-success/50 bg-success/5"
                                  : isCorrect
                                  ? "border-success/40 bg-success/8"
                                  : isSelected && !answer?.isCorrect
                                  ? "border-destructive/50 bg-destructive/5"
                                  : "border-border/60 bg-background/40"
                              }`}
                            >
                              <div className="relative flex items-center gap-1 md:gap-2 lg:gap-3 text-xs md:text-sm lg:text-base">
                                <span className="font-semibold text-foreground">
                                  {letter}.
                                </span>
                                {optionImage ? (
                                  <div className="flex-1">
                                    <Image
                                      src={optionImage}
                                      alt={`Option ${letter} image`}
                                      width={1000}
                                      height={1000}
                                      className="rounded-md border border-border w-auto h-20 md:h-24 lg:h-28"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-foreground flex-1">
                                    {option}
                                  </span>
                                )}

                                {isCorrect && (
                                  <div className={`${optionImage ? "absolute bottom-0 right-0" : ""}`}>
                                  <Chip variant={`${optionImage ? "correct2" : "correct"}`} text="Correct Answer" />
                                   </div>
                                )}

                                {isSelected && !isCorrect && (
                                  <div className={`${optionImage ? "absolute bottom-0 right-0" : ""}`}>
                                    <Chip variant={`${optionImage ? "incorrect2" : "incorrect"}`} text="Your Answer" />
                                  </div>
                                  
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {(question.explanation || question.explanation_img_url) && (
                      <div>
                        <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-muted-foreground mb-1 md:mb-2 lg:mb-3">
                          Explanation:
                        </p>

                        {question.explanation && (
                          <div className="prose prose-neutral dark:prose-invert text-foreground text-xs md:text-sm lg:text-base leading-relaxed mb-2 md:mb-3 lg:mb-4">
                            {question.explanation}
                          </div>
                        )}

                        {question.explanation_img_url && (
                          <div>
                            <Image
                              src={question.explanation_img_url}
                              alt="Explanation image"
                              width={1000}
                              height={1000}
                              className="rounded-lg border border-border w-auto h-36 md:h-48 lg:h-56"
                            />
                          </div>
                        )}
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

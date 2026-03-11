'use client'
import { Button, RadioButton, Progress } from '@/lib/client-imports';
import React, { useEffect, useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type Question = {
  id: string;
  text: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
};

const questions: Question[] = [
  {
    id: 'q1',
    text: 'What is the result of 25 × 4 + 15?',
    options: [
      { value: 'A', label: '100' },
      { value: 'B', label: '115' },
      { value: 'C', label: '125' },
      { value: 'D', label: '130' },
      { value: 'E', label: '145' },
    ],
    correctAnswer: 'B',
    explanation:
      'Following order of operations: 25 × 4 = 100, then 100 + 15 = 115.',
  },
  {
    id: 'q2',
    text: 'What is 12 × 3?',
    options: [
      { value: 'A', label: '24' },
      { value: 'B', label: '30' },
      { value: 'C', label: '36' },
      { value: 'D', label: '40' },
      { value: 'E', label: '48' },
    ],
    correctAnswer: 'C',
    explanation: '12 multiplied by 3 equals 36.',
  },
];

const Quiz = () => {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const confirmedAnswer = answers[currentQuestion.id] ?? null;

  const isCorrect = confirmedAnswer === currentQuestion.correctAnswer;

  const handleSelect = (value: string) => {
    if (submitted) return;
    setSelectedChoice(value);
  };

  const handleSubmit = () => {
    if (!selectedChoice) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedChoice,
    }));

    setSubmitted(true);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedChoice(null);
    setSubmitted(false);
  };

  // Keyboard support
  useEffect(() => {
    if (submitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

      const key = e.key.toUpperCase();

      let selectedValue: string | null = null;

      if (key >= 'A' && key <= 'E') {
        selectedValue = key;
      }

      if (key >= '1' && key <= '5') {
        const index = Number(key) - 1;
        if (index < currentQuestion.options.length) {
          selectedValue = currentQuestion.options[index].value;
        }
      }

      if (selectedValue) {
        e.preventDefault();
        setSelectedChoice(selectedValue);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);

  }, [submitted, currentQuestion]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Progress updates ONLY after submit */}
      <Progress
        variant="default"
        current={Object.keys(answers).length}
        total={questions.length}
        label="Quiz Progress"
        subLabel={`${Object.keys(answers).length} answered`}
      />

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">

        <div className="p-6 pb-4">
          <h2 className="text-xl font-semibold leading-tight">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="px-6 pb-6 space-y-3">

          {currentQuestion.options.map((option) => {

            const isSelected = selectedChoice === option.value;
            const isConfirmed = confirmedAnswer === option.value;

            let extraProps: any = {};

            if (submitted) {
              extraProps = {
                selectedColor:
                  isConfirmed && isCorrect
                    ? 'bg-green-600 border-green-600 text-white'
                    : undefined,
                unselectedColor:
                  isConfirmed && !isCorrect
                    ? 'bg-red-50 border-red-300'
                    : undefined,
              };
            }

            return (
              <RadioButton
                key={option.value}
                variant="choice"
                value={option.value}
                label={option.label}
                isSelected={isSelected || isConfirmed}
                onSelect={handleSelect}
                disabled={submitted}
                hideIndicator={true}
                {...extraProps}
              />
            );

          })}

        </div>

        {submitted && (
          <div
            className={`px-6 py-5 border-t ${
              isCorrect
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`text-lg font-bold ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>

              {isCorrect && <span className="text-green-600">✔</span>}
            </div>

            <p className="mt-2 text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

      </div>

      {!submitted && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          You may press <strong>A–E</strong> or <strong>1–5</strong> to select an answer.
          Select an option then press <strong>Submit Answer</strong>
        </div>
      )}

      <div className="mt-8 flex justify-end gap-3">

        {!submitted && (
          <Button
            text="Submit Answer"
            backgroundColor="bg-primary"
            textColor="text-primary-foreground"
            onClick={handleSubmit}
          />
        )}

        {submitted && currentQuestionIndex < questions.length - 1 && (
          <Button
            text="Next Question"
            backgroundColor="bg-primary"
            textColor="text-primary-foreground"
            onClick={nextQuestion}
          />
        )}

      </div>

    </div>
  );
};

export default Quiz;
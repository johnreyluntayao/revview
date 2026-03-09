'use client'
import { Button, RadioButton } from '@/lib/client-imports';
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

const sampleQuestion: Question = {
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
  explanation: 'Following order of operations: 25 × 4 = 100, then 100 + 15 = 115. The answer is B.',
};

const Quiz = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = sampleQuestion;
  const isCorrect = selected === question.correctAnswer;

  const handleSelect = (value: string) => {
    if (answered) return;
    setSelected(value);
    setAnswered(true);
  };

  // Keyboard support
  useEffect(() => {
    if (answered) return; // disable after answering

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toUpperCase();

      // Support both A/B/C/D/E and 1/2/3/4/5
      let selectedValue: string | null = null;

      if (key >= 'A' && key <= 'E') {
        selectedValue = key;
      } else if (key >= '1' && key <= '5') {
        const index = Number(key) - 1;
        if (index < question.options.length) {
          selectedValue = question.options[index].value;
        }
      }

      if (selectedValue) {
        e.preventDefault(); // prevent page scroll on spacebar etc.
        handleSelect(selectedValue);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answered, question.options]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">
          Question 1 of 5 • {answered ? '1 answered' : 'Not answered yet'}
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="p-6 pb-4">
          <h2 className="text-xl font-semibold leading-tight">
            {question.text}
          </h2>
        </div>

        <div className="px-6 pb-6 space-y-3">
          {question.options.map((option) => {
            const isSelected = selected === option.value;
            const showFeedback = answered && isSelected;

            let variant: 'default' | 'choice' = 'choice';
            let extraProps: any = {};

            if (['A', 'B', 'C', 'D', 'E'].includes(option.value)) {
              extraProps = {
                selectedColor: isCorrect && isSelected 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : undefined,
                unselectedColor: showFeedback && !isCorrect 
                  ? 'bg-red-50 border-red-300' 
                  : undefined,
              };
            }

            return (
              <RadioButton
                key={option.value}
                variant={variant}
                value={option.value}
                label={option.label}
                isSelected={isSelected}
                onSelect={handleSelect}
                disabled={answered}
                hideIndicator={true}   
                {...extraProps}
              />
            );
          })}
        </div>

        {answered && (
          <div className={`px-6 py-5 border-t ${
            isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
              {isCorrect && <span className="text-green-600">✔</span>}
            </div>
            <p className="mt-2 text-muted-foreground">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {answered && (
        <div className="mt-8 flex justify-end">
          <Button text="Next Question" textColor='text-primary-foreground' backgroundColor='bg-primary'/>
        </div>
      )}

      {/* Small hint for users */}
      {!answered && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          You can also press <strong>A</strong>–<strong>E</strong> or <strong>1</strong>–<strong>5</strong> to select
        </div>
      )}
    </div>
  );
};

export default Quiz;
import React from 'react';
import Button from '../atoms/Button';
import { ViewDetailedResults } from '@/lib/icons';

interface ScoreRecordProps {
  title: string;
  difficulty: string;
  items: number;          // total questions
  score: number;          // correct answers
  time: string;           // e.g. "18:45"
  date: string;           // e.g. "Feb 3, 2024"
}

const ScoreRecord = ({
  title,
  difficulty,
  items,
  score,
  time,
  date,
}: ScoreRecordProps) => {

  const calculatedPercent = items > 0 ? Math.round((score / items) * 100) : 0;
  return (
    <div className="w-full p-4">
      <div
        className="
          relative 
          rounded-lg 
          overflow-hidden
          bg-white
          shadow-sm
          border border-border/40
          self-center
        "
      >
        <div className="p-5 flex items-start gap-4 md:gap-5 lg:gap-6 flex-wrap">

          <div
            className="
              relative 
              w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 
              shrink-0
              rounded-full 
              bg-success/30
              shadow-inner
              self-center
            "
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center leading-tight">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-success text-nowrap">
                  {Math.round(calculatedPercent)}<span>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
              {title}
            </h3>

            <div className="flex flex-wrap flex-col md:flex-row md:gap-x-12 lg:gap-x-18 text-sm md:text-base lg:text-lg font-medium text-foreground/80">
              <div>
                <span className="text-foreground/60">Difficulty:</span> {difficulty}
              </div>
              <div>
                <span className="text-foreground/60">Questions:</span> {score}/{items}
              </div>
              <div>
                <span className="text-foreground/60">Time:</span> {time}
              </div>
            </div>

            {/* Date */}
            <div className="text-sm md:text-base lg:text-lg text-foreground/50 mt-1">
              {date}
            </div>
          </div>

          {/* Right arrow / detail button */}
          <div className="self-center ml-auto items-center">
            <Button
              leftIcon={<ViewDetailedResults />}
              borderColor="border-none"
              isRounded={true}
              backgroundColor="hover:bg-primary"
              textColor="hover:text-white"
              className='h-12 w-12'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreRecord;
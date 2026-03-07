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
        "
      >
        <div className="p-5 flex items-start gap-5 flex-wrap sm:flex-nowrap">
          {/* Circular score badge */}
          <div
            className="
              relative 
              w-20 h-20 sm:w-24 sm:h-24 
              shrink-0
              rounded-full 
              bg-success/30
              border-4 border-success
              flex items-center justify-center
              shadow-inner
            "
          >
            <div className="text-center leading-tight">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-success text-nowrap">
                {Math.round(calculatedPercent)}<span>%</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
              {title}
            </h3>

            <div className="flex flex-wrap gap-x-10 gap-y-1 md:gap-x-16 lg:gap-x-24 text-sm md:text-base lg:text-lg font-medium text-foreground/80">
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
          <div className="self-center ml-auto hidden sm:flex items-center">
            <Button
              leftIcon={<ViewDetailedResults />}
              borderColor="border-none"
              isRounded={true}
              backgroundColor="hover:bg-primary"
              textColor="hover:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreRecord;
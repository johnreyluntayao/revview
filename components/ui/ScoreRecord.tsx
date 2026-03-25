import { Button } from '@/lib/client-imports';
import { Eye } from 'lucide-react';   // ← Eye icon

interface ScoreRecordProps {
  title: string;
  difficulty: string;
  items: number;    
  score: number;     
  time: string;     
  date: string;     
  percentage: number;     
  quizSessionId: string;
  onViewDetail: () => void;
}

const ScoreRecord = ({
  title,
  difficulty,
  items,
  score,
  time,
  date,
  percentage,
  quizSessionId,
  onViewDetail,
}: ScoreRecordProps) => {

  const getScoreBgColor = (scoreVal: number) => {
    if (scoreVal >= 80) return "bg-success/15";
    if (scoreVal >= 60) return "bg-primary/15";
    if (scoreVal >= 40) return "bg-warning/15";
    return "bg-destructive/15";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const bgClass = getScoreBgColor(percentage);
  const textClass = getScoreTextColor(percentage);

  return (
    <div className="w-full">
      <button
        onClick={onViewDetail}
        className="
          w-full group
          relative 
          rounded-lg 
          overflow-hidden
          bg-white
          hover:shadow-md
          border border-border/40
          hover:border-primary/60
          transition-all duration-200
          text-left
        "
      >
        <div className="p-4 md:p-5 lg:p-6 flex items-start gap-4 md:gap-5 lg:gap-6 flex-wrap">

          <div
            className={`
              relative 
              w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 
              shrink-0
              rounded-full 
              shadow-inner
              self-center
              ${bgClass}
            `}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center leading-tight">
                <div className={`text-lg md:text-xl lg:text-2xl font-bold ${textClass} text-nowrap`}>
                  {percentage}<span>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2 flex-1 min-w-0">
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-foreground">
              {title}
            </h3>

            <div className="flex flex-wrap flex-col md:flex-row md:gap-x-12 lg:gap-x-18 text-xs md:text-sm lg:text-base font-medium text-foreground/80">
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
            <div className="text-xs md:text-sm lg:text-base text-foreground/50 mt-1">
              {date}
            </div>
          </div>

          {/* Eye icon - visible only on hover */}
          <div className="self-center ml-auto items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 flex items-center justify-center group-hover:bg-primary/10 transition-colors rounded-xl">
              <Eye className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-muted-foreground group-hover:text-primary" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ScoreRecord;
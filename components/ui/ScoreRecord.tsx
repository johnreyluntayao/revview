
import { Button } from '@/lib/client-imports';
import { ViewDetailedResults } from '@/lib/icons';

interface ScoreRecordProps {
  title: string;
  difficulty: string;
  items: number;    
  score: number;     
  time: string;     
  date: string;     
  percentage: number;     
}

const ScoreRecord = ({
  title,
  difficulty,
  items,
  score,
  time,
  date,
  percentage,
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
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${textClass} text-nowrap`}>
                  {percentage}<span>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-foreground">
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

          {/* Right arrow / detail button */}
          <div className="self-center ml-auto items-center">
            <Button
              leftIcon={<ViewDetailedResults />}
              borderColor="border-none"
              isRounded={true}
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

import { Pause, CorrectAnswer as ResumeQuiz, RetakeQuiz, Home } from '@/lib/icons';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export default function PauseModal({
  isOpen,
  onClose,
  onRestart,
  onExit,
}: PauseModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-4 md:p-6 lg:p-8 max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
      >
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-warning/25 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4">
            <Pause className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-warning" />
          </div>
          <h2 id="pause-title" className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
            Quiz Paused
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground mt-1 md:mt-1.5 lg:mt-2">
            You can resume your quiz or exit and come back later.
          </p>
        </div>

        {/* Pause Options */}
        <div className="space-y-2 md:space-y-2.5 lg:space-y-3">
          {/* Resume */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 md:gap-2.5 lg:gap-3 px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 bg-success/15 text-success rounded-lg font-semibold hover:opacity-90 transition"
          >
            <ResumeQuiz className="w-4 h-4 md:w-5 md:h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm md:text-base">Resume Quiz</p>
              <p className="text-[10px] md:text-xs opacity-90">Continue taking the quiz</p>
            </div>
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full flex items-center gap-2 md:gap-2.5 lg:gap-3 px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 bg-primary/15 text-primary rounded-lg font-semibold hover:bg-muted/80 transition"
          >
            <RetakeQuiz className="w-4 h-4 md:w-5 md:h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm md:text-base">Restart Quiz</p>
              <p className="text-[10px] md:text-xs opacity-90">Start over with new questions</p>
            </div>
          </button>

          {/* Exit */}
          <button
            onClick={onExit}
            className="w-full flex items-center gap-2 md:gap-2.5 lg:gap-3 px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 bg-destructive/15 text-destructive rounded-lg font-semibold hover:bg-muted/80 transition"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm md:text-base">Exit to Dashboard</p>
              <p className="text-[10px] md:text-xs opacity-90">Go home (progress will be lost)</p>
            </div>
          </button>
        </div>

        {/* Small note */}
        <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-4 md:mt-5 lg:mt-6">
          Timer is paused while you're away
        </p>
      </div>
    </div>
  );
}
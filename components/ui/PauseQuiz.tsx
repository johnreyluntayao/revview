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
      className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-border animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/10 rounded-full flex items-center justify-center">
            <Pause className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Paused</h2>
          <p className="text-muted-foreground">
            Your timer is paused. You can resume or exit to dashboard.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 p-4 bg-green-500/10 hover:bg-green-500/20 text-green-700 rounded-xl transition"
          >
            <ResumeQuiz className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Resume Quiz</div>
              <div className="text-sm opacity-80">Continue where you left off</div>
            </div>
          </button>

          <button
            onClick={onRestart}
            className="w-full flex items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-xl transition"
          >
            <RetakeQuiz className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Restart Quiz</div>
              <div className="text-sm opacity-80">Start over with new questions</div>
            </div>
          </button>

          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-700 rounded-xl transition"
          >
            <Home className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Exit to Dashboard</div>
              <div className="text-sm opacity-80">Progress will NOT be saved</div>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Timer remains paused while this window is open
        </p>
      </div>
    </div>
  );
}
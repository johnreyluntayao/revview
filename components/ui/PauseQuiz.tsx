import { Pause, CorrectAnswer as ResumeQuiz, RetakeQuiz, Home } from "@/lib/icons";
import Modal from "@/components/atoms/Modal";

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export default function PauseModal({ isOpen, onClose, onRestart, onExit }: PauseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quiz paused"
      description="Your timer is paused while this window is open."
      size="md"
      closeOnBackdrop={false}
      contentClassName="p-4 sm:p-6"
    >
      <div className="mb-5 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
          <Pause className="size-7" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Resume where you left off, restart with a new setup, or exit the session.</p>
      </div>

      <div className="space-y-2.5">
        <button type="button" onClick={onClose} className="flex w-full items-center gap-3 rounded-xl border border-success/20 bg-success/8 p-3.5 text-success transition hover:bg-success/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success">
          <ResumeQuiz className="size-5 shrink-0" />
          <span className="text-left"><span className="block text-sm font-semibold">Resume quiz</span><span className="block text-xs opacity-80">Continue from the current question</span></span>
        </button>
        <button type="button" onClick={onRestart} className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-primary/8 p-3.5 text-primary transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <RetakeQuiz className="size-5 shrink-0" />
          <span className="text-left"><span className="block text-sm font-semibold">Restart quiz</span><span className="block text-xs opacity-80">Return to quiz selection</span></span>
        </button>
        <button type="button" onClick={onExit} className="flex w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/8 p-3.5 text-destructive transition hover:bg-destructive/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive">
          <Home className="size-5 shrink-0" />
          <span className="text-left"><span className="block text-sm font-semibold">Exit to dashboard</span><span className="block text-xs opacity-80">This quiz session will be discarded</span></span>
        </button>
      </div>
    </Modal>
  );
}

import { Close, Delete, Feedback as Star, Resolve } from "@/lib/icons";
import { Chip } from "@/lib/client-imports";
import type { FeedbackProps } from "@/lib/types";

const Feedback: React.FC<FeedbackProps> = ({
  name,
  date,
  rating,
  comment,
  status = "pending",
  onResolveToggle,
  onDelete,
  isUpdating = false,
}) => {
  const isResolved = status === "resolved";

  return (
    <article className="flex h-full flex-col rounded-xl border border-border/80 bg-background p-4 transition duration-300 hover:border-primary/20 hover:shadow-sm md:p-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground md:text-base">{name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
          <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className={`size-4 ${
                  index < rating
                    ? "fill-warning text-warning"
                    : "fill-muted text-muted-foreground/35"
                }`}
              />
            ))}
          </div>

          {isResolved ? (
            <Chip variant="resolved" text="Resolved" />
          ) : (
            <Chip className="bg-warning/10 text-warning" text="Pending" />
          )}
        </div>
      </header>

      <div className="my-4 flex-1 rounded-xl bg-muted/35 px-3.5 py-3 md:px-4">
        <p className="text-sm leading-relaxed text-foreground/80">{comment}</p>
      </div>

      <footer className="grid grid-cols-1 gap-2 border-t border-border/70 pt-3 sm:grid-cols-[auto_auto] sm:justify-start">
        <button
          type="button"
          onClick={onResolveToggle}
          disabled={isUpdating}
          className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
            isResolved
              ? "bg-warning/10 text-warning hover:bg-warning/15"
              : "bg-success/10 text-success hover:bg-success/15"
          }`}
        >
          {isResolved ? <Close className="size-4" /> : <Resolve className="size-4" />}
          {isUpdating ? "Updating..." : isResolved ? "Reopen" : "Mark resolved"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isUpdating}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <Delete className="size-4" />
          Delete
        </button>
      </footer>
    </article>
  );
};

export default Feedback;

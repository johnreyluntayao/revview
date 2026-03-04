import { Feedback as Star, Resolve, Delete, Close } from "@/lib/icons";
import { Button, Chip } from "@/lib/imports"; 

interface FeedbackProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
  status?: "resolved" | "pending";
  onResolveToggle: () => void;
  onDelete: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({
  name,
  date,
  rating,
  comment,
  status = "pending",
  onResolveToggle,
  onDelete,
}) => {
  const isResolved = status === "resolved";

  return (
    <div className="bg-white border border-border hover:border-primary/50 rounded-xl p-4 md:p-5 lg:p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 md:mb-3 lg:mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-sm md:text-base lg:text-lg">{name}</h3>
          <p className="text-xs md:text-sm lg:text-base text-foreground/50">{date}</p>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-yellow-400 fill-muted-foreground"
                }
              />
            ))}
          </div>
          
          <div className="hidden md:block">
            {isResolved && (
              <Chip
                variant="resolved"
                text="Resolved"
              />
            )}
          </div>
          
        </div>
      </div>

      <p className="text-foreground/80 leading-relaxed mb-6 text-sm md:text-base lg:text-lg">
        {comment}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1 md:gap-2 lg:gap-3 flex-wrap">
        <Button
          onClick={onResolveToggle}
          text={isResolved ? "Unresolve" : "Mark Resolved"}
          backgroundColor={isResolved ? "bg-warning/25" : "bg-success/10"}
          textColor={isResolved ? "text-warning" : "text-success"}
          leftIcon={isResolved ? <Close /> : <Resolve />}
        />

        <Button
          onClick={onDelete}
          text="Delete"
          backgroundColor="bg-destructive/10"
          textColor="text-destructive"
          leftIcon={<Delete />}
        />
      </div>
    </div>
  );
};

export default Feedback;
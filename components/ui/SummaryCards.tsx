import type { ReactNode } from "react";

interface SummaryCardItem {
  icon?: ReactNode;
  title: string;
  value: string | number;
}

interface SummaryCardsProps {
  cards: SummaryCardItem[];
}

const accents = [
  "bg-primary/10 text-primary",
  "bg-success/10 text-success",
  "bg-secondary/10 text-secondary",
  "bg-warning/10 text-warning",
];

const SummaryCards = ({ cards }: SummaryCardsProps) => (
  <section aria-label="Learning summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
    {cards.map((card, index) => (
      <article
        key={card.title}
        className="group rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md md:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground md:text-sm">{card.title}</p>
            <p className="mt-2 break-words text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {card.value}
            </p>
          </div>
          {card.icon && (
            <div className={`hidden size-10 shrink-0 items-center justify-center rounded-xl sm:flex [&>svg]:size-5 ${accents[index % accents.length]}`}>
              {card.icon}
            </div>
          )}
        </div>
      </article>
    ))}
  </section>
);

export default SummaryCards;

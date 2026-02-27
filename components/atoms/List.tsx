import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ListItem {
  label: string;
  description?: string;
}

interface ListProps {
  items: ListItem[];
  isNumberedList?: boolean;
  /** 
   * Lucide icon component to use for ALL items (non-numbered variant only)
   * Example: <List sharedIcon={CheckCircle2} ... />
   */
  sharedIcon?: LucideIcon;
  className?: string;
}

export const List = ({
  items,
  isNumberedList = false,
  sharedIcon: SharedIcon,
  className = '',
}: ListProps) => {
  if (isNumberedList) {
    // ── Numbered Steps variant ────────────────────────────────
    return (
      <ol className={`flex flex-col gap-2 md:gap-4 lg:gap-6 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg md:text-xl lg:text-2xl shadow-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
                {item.label}
              </h3>
              {item.description && (
                <p className="text-foreground/60 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  // ── Bullet / Feature list variant ────────────────────────────
  const showIcon = !!SharedIcon;

  return (
    <div className={`space-y-4 md:space-y-5 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="pt-1 flex-shrink-0">
            {showIcon ? (
              // Render the Lucide icon component with desired styling
              <SharedIcon className="h-6 w-6 text-primary" />
            ) : (
              // Fallback bullet
              <span className="text-2xl leading-none">•</span>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-base md:text-lg">
              {item.label}
            </h3>
            {item.description && (
              <p className="mt-1 text-sm md:text-base text-gray-600">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
import { ListProps } from "@/lib/types";

const List = ({
  items,
  isNumberedList = false,
  sharedIcon,
  className = "",
}: ListProps) => {
  const Tag = isNumberedList ? "ol" : "div";
  const isCustomIcon = !!sharedIcon;

  if (isNumberedList) {
    return (
      <ol className={`flex flex-col gap-4 md:gap-6 lg:gap-8 ${className}`}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 md:gap-4 lg:gap-6">
            <div className="flex size-12 md:size-14 lg:size-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg md:text-xl lg:text-2xl shadow-sm">
              {i + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
                {item.label}
              </h3>
              {item.description && (
                <p className="text-foreground/60 leading-relaxed text-xs md:text-sm lg:text-base">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <Tag className={`${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-start gap-2 md:gap-2.5 lg:gap-3">
          <div className="shrink-0">
            {isCustomIcon ? (
              sharedIcon
            ) : (
              <span className="text-2xl leading-none">•</span>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-foreground text-xs md:text-sm lg:text-base">
              {item.label}
            </h3>
            {item.description && (
              <p className="mt-1 text-xs md:text-sm lg:text-base text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </Tag>
  );
};

export default List;
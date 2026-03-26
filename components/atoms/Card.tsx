// components/Card.tsx
import { CardProps } from "@/lib/types";
import React, { JSX } from "react";

const Card: React.FC<CardProps> = ({
    variant = "stat",
    title = "",
    value,
    subValue = "",
    icon,
    bg = "bg-background",
    textColor = "text-foreground",
    iconColor = "text-primary",
    trend = null,
    className = "",
    subColor,
    subColor2,
}) => {
    // Base styles shared across variants
    const baseClasses = `
    rounded-xl shadow-sm border border-border overflow-hidden
    ${bg} ${className}
  `;

    let content: JSX.Element;

    switch (variant) {
        case "stat":
            content = (
                <div className="p-4 md:p-5 lg:p-6 w-full bg-linear-to-br from-primary/70 to-secondary/70 text-white">
                    <div className="flex items-center justify-between">
                        {title && (
                            <h3 className={`text-xs md:text-sm lg:text-base font-medium ${textColor}`}>{title}</h3>
                        )}
                        {icon && (
                            <div
                                className={`
                                p-2 rounded-lg ${iconColor}
                                text-xl md:text-2xl lg:text-3xl           // font-size here still controls icon
                                [&>svg]:size-[1em]                        // direct child svg
                                [&>svg]:block                             // sometimes helps alignment
                                `}
                            >
                                {icon}
                            </div>
                        )}
                    </div>
                    <div className="flex items-baseline">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-right text-white">{value}</p>
                        {trend && (
                            <span
                                className={`text-xs md:text-sm lg:text-base text-right font-medium ${trend === "up" ? "text-success" : "text-destructive"
                                    }`}
                            >
                                {trend === "up" ? "↑" : "↓"}
                            </span>
                        )}
                    </div>
                    {subValue && <p className="mt-1 text-xs md:text-sm lg:text-base text-white">{subValue}</p>}
                </div>
            );
            break;

        // Variant 2: Highlight / score card with big centered value
        case "highlight":
            content = (
                <div className={`p-4 md:p-5 lg:p-6 space-y-2 text-left w-full bg-linear-to-br ${bg}`}>
                    {title && <h1 className={`text-sm md:text-base lg:text-lg font-semibold ${subColor}`}>{title}</h1>}
                    <p className={`text-3xl md:text-4xl lg:text-5xl font-bold  ${textColor}`}>{value}</p>
                    {subValue && <p className={`mt-2 text-sm md:text-base lg:text-lg ${subColor2}`}>{subValue}</p>}
                </div>
            );
            break;

        // Variant 3: Overall score with best/lowest (third screenshot style)
        case "overview":
            content = (
                <div className="p-4 md:p-6 lg:p-8 text-left w-full">
                    {title && <h3 className={`text-[10px] md:text-xs lg:text-sm font-medium text-muted-foreground mb-1`}>{title}</h3>}
                    <p className={`text-base md:text-lg lg:text-xl font-semibold text-foreground capitalize ${textColor}`}>{value}</p>
                </div>
            );
            break;

        // Variant 4: Compact / minimal
        case "compact":
            content = (
                <div className="p-3 md:p-4 lg:p-5 flex flex-col items-left gap-2 md:gap-3 lg:gap-4 w-full">
                    {icon && (<div className={`${iconColor} text-xl md:text-4xl lg:text-6xl`}>{icon}</div>)}
                    <div className="flex flex-col gap-1 md:gap-2 lg:gap-3">
                        {title && <p className="text-base md:text-lg lg:text-xl text-foreground font-semibold">{title}</p>}
                        <p className="text-xs md:text-sm lg:text-base text-foreground/50">{value}</p>
                    </div>
                    
                </div>
            );
            break;

            case "data":
            content = (
                <div className="p-4 md:p-5 lg:p-6 flex flex-col items-left gap-2 md:gap-3 lg:gap-4 w-full bg-linear-to-br from-primary/70 to-secondary/70 h-full">
                    {icon && (<div className={`text-white text-2xl md:text-3xl lg:text-4xl [&>svg]:block [&>svg]:size-[1em]`}>{icon}</div>)}
                    <div className="flex flex-col gap-1 md:gap-2 lg:gap-3">
                        {title && <p className="text-xs md:text-sm lg:text-base text-white">{title}</p>}
                        {value && (
                            <p 
                                className={`text-white font-semibold ${
                                value.toString().length > 15 
                                    ? "text-lg md:text-xl lg:text-2xl" 
                                    : "text-xl md:text-2xl lg:text-3xl"
                                }`}
                            >
                                {value}
                            </p>
                            )}
                    </div>
                    
                </div>
            );
            break;

        default:
            content = <div className="p-6 text-center">Invalid variant</div>;
    }

    return <div className={baseClasses}>{content}</div>;
};

export default Card;
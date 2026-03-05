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
                <div className="p-5 w-full">
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
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-right">{value}</p>
                        {trend && (
                            <span
                                className={`text-xs md:text-sm lg:text-base text-right font-medium ${trend === "up" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {trend === "up" ? "↑" : "↓"}
                            </span>
                        )}
                    </div>
                    {subValue && <p className="mt-1 text-xs md:text-sm lg:text-base text-gray-500">{subValue}</p>}
                </div>
            );
            break;

        // Variant 2: Highlight / score card with big centered value
        case "highlight":
            content = (
                <div className="p-6 text-left w-full">
                    {title && <h1 className="text-sm md:text-base lg:text-lg font-semibold text-foreground/60">{title}</h1>}
                    <p className={`text-3xl md:text-4xl lg:text-5xl font-bold  ${textColor}`}>{value}</p>
                    {subValue && <p className="mt-2 text-sm md:text-base lg:text-lg text-foreground/60">{subValue}</p>}
                </div>
            );
            break;

        // Variant 3: Overall score with best/lowest (third screenshot style)
        case "overview":
            content = (
                <div className="p-4 md:p-6 lg:p-8 text-left w-full">
                    {title && <h3 className={`text-xs md:text-sm lg:text-base font-medium text-muted-foreground mb-1`}>{title}</h3>}
                    <p className={`text-lg md:text-xl lg:text-2xl font-semibold text-foreground capitalize ${textColor}`}>{value}</p>
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
                <div className="p-3 md:p-4 lg:p-5 flex flex-col items-left gap-2 md:gap-3 lg:gap-4 w-full">
                    {icon && (<div className={`${iconColor} text-2xl md:text-3xl lg:text-4xl [&>svg]:block [&>svg]:size-[1em]`}>{icon}</div>)}
                    <div className="flex flex-col gap-1 md:gap-2 lg:gap-3">
                        {title && <p className="text-xs md:text-sm lg:text-base text-foreground/50">{title}</p>}
                        <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-semibold">{value}</p>
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
// components/Card.tsx
import { CardProps } from "@/lib/types";
import React, { JSX } from "react";
import Image from "next/image";

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
  image, // new
  imageAlt = "", // new
}) => {
  const baseClasses = `
    rounded-3xl shadow-sm border border-border overflow-hidden
    ${bg} ${className}
  `;

  let content: JSX.Element;

  switch (variant) {
    case "stat":
      content = (
        <div className="p-4 md:p-5 lg:p-6 w-full bg-linear-to-br from-primary/70 to-secondary/70 text-white">
          {/* ... your existing stat content ... */}
          <div className="flex items-center justify-between">
            {title && (
              <h3
                className={`text-xs md:text-sm lg:text-base font-medium ${textColor}`}
              >
                {title}
              </h3>
            )}
            {icon && (
              <div
                className={`p-2 rounded-lg ${iconColor} text-xl md:text-2xl lg:text-3xl [&>svg]:size-[1em]`}
              >
                {icon}
              </div>
            )}
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-right text-white">
              {value}
            </p>
            {trend && (
              <span
                className={`text-xs md:text-sm lg:text-base ${trend === "up" ? "text-success" : "text-destructive"}`}
              >
                {trend === "up" ? "↑" : "↓"}
              </span>
            )}
          </div>
          {subValue && (
            <p className="mt-1 text-xs md:text-sm lg:text-base text-white">
              {subValue}
            </p>
          )}
        </div>
      );
      break;

    case "highlight":
      content = (
        <div
          className={`p-4 md:p-5 lg:p-6 space-y-2 text-left w-full bg-linear-to-br ${bg}`}
        >
          {title && (
            <h1
              className={`text-sm md:text-base lg:text-lg font-semibold ${subColor}`}
            >
              {title}
            </h1>
          )}
          <p
            className={`text-3xl md:text-4xl lg:text-5xl font-bold ${textColor}`}
          >
            {value}
          </p>
          {subValue && (
            <p className={`mt-2 text-sm md:text-base lg:text-lg ${subColor2}`}>
              {subValue}
            </p>
          )}
        </div>
      );
      break;

    case "overview":
      content = (
        <div className="p-4 md:p-6 lg:p-8 text-left w-full bg-linear-to-br from-primary/70 to-secondary/70 text-white">
          {title && (
            <h3 className="text-[10px] md:text-xs lg:text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p
            className={`text-base md:text-lg lg:text-xl font-semibold text-white capitalize ${textColor}`}
          >
            {value}
          </p>
        </div>
      );
      break;

    case "compact":
      content = (
        <div className="p-4 md:p-5 lg:p-6 flex flex-col items-start w-full gap-4 md:gap-5 lg:gap-6">
          {icon && (
            <div
              className={`${iconColor} text-[40px] md:text-[50px] lg:text-6xl`}
            >
              {icon}
            </div>
          )}
          <div className="flex flex-col flex-1 w-full gap-3 md:gap-3.5 lg:gap-4">
            {title && (
              <p
                className={`font-bold ${textColor} text-base md:text-lg lg:text-xl whitespace-nowrap overflow-hidden text-ellipsis`}
              >
                {title}
              </p>
            )}
            {value && (
              <p
                className={`${textColor} text-xs md:text-sm lg:text-base leading-relaxed`}
              >
                {value}
              </p>
            )}
          </div>
        </div>
      );
      break;

    case "data":
      content = (
        <div className="p-4 md:p-5 lg:p-6 flex flex-col items-left gap-2 md:gap-3 lg:gap-4 w-full bg-linear-to-br from-primary/70 to-secondary/70 h-full">
          {icon && (
            <div className="text-white text-2xl md:text-3xl lg:text-4xl [&>svg]:block [&>svg]:size-[1em]">
              {icon}
            </div>
          )}
          <div className="flex flex-col gap-1 md:gap-2 lg:gap-3">
            {title && (
              <p className="text-xs md:text-sm lg:text-base text-white">
                {title}
              </p>
            )}
            {value && (
              <p
                className={`text-white font-semibold ${value.toString().length > 15 ? "text-lg md:text-xl lg:text-2xl" : "text-xl md:text-2xl lg:text-3xl"}`}
              >
                {value}
              </p>
            )}
          </div>
        </div>
      );
      break;

    case "step":
      content = (
        <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden">
          {/* Image Box */}
          {image && (
            <div className="relative h-48 md:h-52 lg:h-60 p-2 overflow-hidden">
              <img
                src={image}
                alt={imageAlt || title || "Step illustration"}
                className="w-full h-48 md:h-52 lg:h-60 object-contain"
              />
            </div>
          )}

          {/* Content Area */}
          <div className="p-6 md:p-7 lg:p-8 flex flex-col flex-1 gap-2 md:gap-2.5 lg:gap-3">
            {/* Step Number */}
            {title && (
              <div className="inline-flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 rounded-md md:rounded-lg lg:rounded-xl bg-primary text-white font-semibold text-md md:text-lg lg:text-xl shadow">
                {title}
              </div>
            )}

            {/* Main Title */}
            {value && (
              <h3 className="text-md md:text-lg lg:text-xl font-semibold text-foreground leading-tight line-clamp-1">
                {value}
              </h3>
            )}

            {/* Description */}
            {subValue && (
              <p className="text-muted-foreground text-sm md:text-md lg:text-base leading-relaxed flex-1">
                {subValue}
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

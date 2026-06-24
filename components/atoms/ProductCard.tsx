// components/ProductCard.tsx
"use client";

import React from "react";
import Button from "./Button";

const gradientOptions = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-cyan-600",
  "from-purple-500 to-violet-600",
  "from-amber-500 to-orange-600",
  "from-green-500 to-lime-600",
  "from-sky-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-yellow-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-purple-600",
  "from-teal-500 to-cyan-600",
  "from-orange-500 to-red-600",
];

interface ProductCardProps {
  id?: string;
  image: string;
  imageAlt?: string;
  category?: string | null;
  title: string;
  subtitle?: string;
  price?: number | string | null;
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  onCategoryClick?: (category: string) => void;
  className?: string;
}

const getGradient = (seed: string) => {
  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return gradientOptions[hash % gradientOptions.length];
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  imageAlt = "Product image",
  category,
  title,
  subtitle,
  price,
  buttonText = "Get Instant Access",
  buttonLink,
  onButtonClick,
  onCategoryClick,
  className = "",
}) => {
  const displayCategory = category || "Uncategorized";
  const gradient = getGradient(id || title);

  const handleClick = () => {
    if (onButtonClick) return onButtonClick();
    if (buttonLink) window.open(buttonLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`relative w-full h-90 md:h-110 lg:h-115 xl:h-140 rounded-xl overflow-hidden shadow-xl group/card ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
      />

      <div className={`absolute inset-0 bg-linear-to-b ${gradient} opacity-65`} />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 xl:p-6 bg-linear-to-t from-foreground/90 via-foreground/70 to-transparent">
        <button
          type="button"
          className="uppercase text-primary-foreground tracking-[2px] text-[10px] md:text-xs font-semibold mb-0.5 md:mb-0.75 xl:mb-1 opacity-75 text-left"
          onClick={() => category && onCategoryClick?.(category)}
        >
          {displayCategory}
        </button>

        <h3 className="text-2xl md:text-3xl lg:text-2xl xl:text-4xl font-bold text-primary-foreground leading-none mb-1 md:mb-1.5 xl:mb-2 line-clamp-2">
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs md:text-sm xl:text-base text-primary-foreground/90 leading-tight mb-4 md:mb-5 xl:mb-6 line-clamp-3 lg:line-clamp-2 xl:line-clamp-3">
            {subtitle}
          </p>
        )}

        <div className="flex items-end justify-between gap-2 md:gap-3 xl:gap-4">
          <div>
            <span className="text-[10px] md:text-xs xl:text-sm text-primary-foreground/70">
              Starting at
            </span>
            <div className="flex items-baseline gap-0.5 md:gap-0.75 xl:gap-1">
              <span className="text-base md:text-md lg:text-lg xl:text-2xl font-bold text-primary-foreground tracking-tight leading-none line-clamp-1">
                ₱{price ?? 0}
              </span>
              <span className="text-xs md:text-sm xl:text-base text-primary-foreground/70 leading-none line-clamp-1">
                PHP
              </span>
            </div>
          </div>

          <Button
            text={buttonText}
            backgroundColor="bg-primary"
            textColor="text-white"
            className="text-[10px] md:text-xs xl:text-lg"
            onClick={handleClick}
            restrict={true}
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
    </div>
  );
};

export default ProductCard;

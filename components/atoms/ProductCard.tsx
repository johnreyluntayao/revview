// components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Chip from "./Chip";
import Button from "./Button";

interface ProductCardProps {
  image: string;
  imageAlt?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  imageAlt = "Product cover",
  badge = "Book",
  title,
  subtitle = "A Guide to Creating Visually Stunning Websites",
  buttonText = "Shop Now",
  buttonLink,
  onButtonClick,
  className = "",
}) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonLink) {
      window.open(buttonLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full bg-white rounded-lg overflow-hidden border border-border shadow-sm ${className}`}
    >
      {/* Image Box */}
      {image && (
        <Image
          height={1000}
          width={1000}
          src={image}
          alt={imageAlt}
          className="w-full aspect-[4/3] object-cover rounded-t-lg"
        />
      )}

      {/* Content Area - Fixed structure for consistent card height */}
      <div className="p-4 md:p-5 lg:p-6 flex flex-col flex-1">
        <div className="flex flex-col gap-3 flex-1">
          {/* Published Badge */}
          {badge && (
            <Chip
              text={badge}
              className="bg-primary text-white w-fit text-xs"
            />
          )}

          {/* Main Title - Limited to 2 lines */}
          <h3 className="text-sm md:text-base lg:text-lg font-bold text-foreground leading-tight line-clamp-2 min-h-[2.8em]">
            {title}
          </h3>

          {/* Subtitle / Description - Limited to 4 lines */}
          {subtitle && (
            <p className="text-muted-foreground text-xs md:text-sm lg:text-base leading-relaxed line-clamp-4 flex-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Button - Always at the bottom */}
        <div className="mt-auto pt-4">
          <Button
            text={buttonText}
            backgroundColor="bg-primary"
            textColor="text-white"
            className="w-full transition-all h-8 md:h-9 lg:h-10"
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
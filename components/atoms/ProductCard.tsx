// components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Chip from "./Chip";
import Button from "./Button";

export type Category = "Books" | "Materials" | "Courses" | "All";

interface ProductCardProps {
  image: string;
  imageAlt?: string;

  category: Category;

  title: string;
  subtitle?: string;

  price?: string;
  currency?: string;

  buttonText?: string;
  buttonLink?: string;

  onButtonClick?: () => void;
  onCategoryClick?: (category: Category) => void;

  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  imageAlt = "Product image",
  category,
  title,
  subtitle,
  price = "150",
  currency = "₱",
  buttonText = "Get Instant Access",
  buttonLink,
  onButtonClick,
  onCategoryClick,
  className = "",
}) => {
  const handleClick = () => {
    if (onButtonClick) return onButtonClick();
    if (buttonLink) window.open(buttonLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`relative w-full h-[340px] rounded-2xl overflow-hidden shadow-lg group ${className}`}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-purple-600/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* CATEGORY BADGE (clickable filter hook) */}
      <div className="absolute top-4 left-4">
        <Chip
          text={category}
          className="bg-white/20 text-white backdrop-blur-md border border-white/20 text-[10px] cursor-pointer"
          onClick={() => onCategoryClick?.(category)}
        />
      </div>

      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
        <div className="max-w-[70%]">
          <h3 className="text-lg font-bold line-clamp-2">{title}</h3>

          {subtitle && (
            <p className="text-xs text-white/80 mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}

          <p className="mt-2 text-sm font-semibold">
            Starting at {currency}
            {price} PHP
          </p>
        </div>

        <Button
          text={buttonText}
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-xs rounded-lg"
        />
      </div>
    </div>
  );
};

export default ProductCard;
"use client";

import React from "react";
import { ExternalLink } from "@/lib/icons";
import Image from "next/image";
import Button from "./Button";
import Chip from "./Chip";
import { normalizeHttpUrl, normalizeImageUrl } from "@/lib/safe-url";

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

const formatPrice = (price: number | string | null | undefined) => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) return "Price unavailable";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  imageAlt = "Product image",
  category,
  title,
  subtitle,
  price,
  buttonText = "View product",
  buttonLink,
  onButtonClick,
  onCategoryClick,
  className = "",
}) => {
  const displayCategory = category || "Study resource";

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
      return;
    }

    const safeLink = buttonLink ? normalizeHttpUrl(buttonLink) : null;
    if (safeLink) {
      window.open(safeLink, "_blank", "noopener,noreferrer");
    }
  };

  const safeImage = normalizeImageUrl(image) ?? "/Icon.svg";
  const safeButtonLink = buttonLink ? normalizeHttpUrl(buttonLink) : null;

  return (
    <article
      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/8 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
        <Image
          src={safeImage}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-foreground/10 to-transparent" />
        <button
          type="button"
          onClick={() => category && onCategoryClick?.(category)}
          disabled={!category}
          className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] text-left transition hover:brightness-95 disabled:cursor-default"
        >
          <Chip
            text={displayCategory}
            variant="product"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground sm:text-lg">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground sm:text-sm">
          {subtitle || "A recommended resource selected to support your exam preparation."}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Starting at
            </p>
            <p className="mt-0.5 truncate text-lg font-extrabold tracking-tight text-foreground">
              {formatPrice(price)}
            </p>
          </div>

          <Button
            text={buttonText}
            size="sm"
            backgroundColor="bg-primary"
            textColor="text-primary-foreground"
            rightIcon={<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
            onClick={handleClick}
            isDisabled={!safeButtonLink && !onButtonClick}
            className="min-h-10 shrink-0 px-3.5 py-2 text-xs font-bold shadow-sm sm:text-sm"
            restrict
          />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

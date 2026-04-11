"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  fadeIntensity?: "light" | "medium" | "strong";
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  className = "",
  showArrows = true,
  showDots = true,
  fadeIntensity = "medium",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = children.length;

  // Responsive items per view: 3 on lg, 2 on md, 1 on mobile
  const getItemsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      const newItems = getItemsPerView();
      setItemsPerView(newItems);
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, totalSlides - newItems)));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalSlides]);

  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (totalSlides <= itemsPerView) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext, totalSlides, itemsPerView]);

  const slideWidthPercentage = (100 / itemsPerView);

  // Fade intensity
  const fadeClass = {
    light: "from-white/10 to-transparent",
    medium: "from-white/30 to-transparent",
    strong: "from-white/60 to-transparent",
  }[fadeIntensity];

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative">
        {/* Left Fade - only when not at start */}
        {currentIndex > 0 && (
          <div 
            className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-linear-to-r ${fadeClass}`} 
          />
        )}

        {/* Right Fade - only when not at end */}
        {currentIndex < maxIndex && (
          <div 
            className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-linear-to-l ${fadeClass}`} 
          />
        )}

        {/* Slides Container */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * slideWidthPercentage}%)` }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="shrink-0 px-3 md:px-4"
              style={{ width: `${slideWidthPercentage}%` }}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Navigation Arrows - show only when needed */}
        {showArrows && totalSlides > itemsPerView && (
          <>
            {/* Left Arrow - hide when at first position */}
            {currentIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary p-3.5 rounded-full shadow-lg z-20 hidden md:block transition-all hover:scale-105 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Right Arrow - hide when at last position */}
            {currentIndex < maxIndex && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary p-3.5 rounded-full shadow-lg z-20 hidden md:block transition-all hover:scale-105 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Dots */}
      {showDots && totalSlides > itemsPerView && (
        <div className="flex justify-center gap-2 py-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
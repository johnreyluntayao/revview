'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/safe-url";
import { Button } from "@/lib/client-imports";
import { ArrowRight, ArrowLeft } from "@/lib/icons"


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


export interface Affiliate {
  id: string;  
  title: string;
  description?: string | null;
  category?: string | null;
  price?: number | null;  
  img_url?: string | null;
  affiliate_link: string;
  created_at: string;       
  updated_at: string;
}

export default function Carousel({ cards }: { cards: Affiliate[]}) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = cards.length;
  const cardsWithColor = useMemo(
    () =>
      cards.map((card, index) => ({
        ...card,
        color: gradientOptions[index % gradientOptions.length],
      })),
    [cards],
  );

  const slideToItem = useCallback((targetIndex: number) => {
    if (!carouselRef.current || totalCards === 0) return;

    const normalizedIndex = ((targetIndex % totalCards) + totalCards) % totalCards;
    const carousel = carouselRef.current;
    const cardElements = carousel.children;
    const targetElement = cardElements[normalizedIndex] as HTMLElement;

    if (targetElement) {
      const scrollPadding = Number.parseFloat(window.getComputedStyle(carousel).scrollPaddingLeft) || 0;
      const scrollPosition = Math.max(0, targetElement.offsetLeft - scrollPadding);

      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });

      setCurrentIndex(normalizedIndex);
    }
  }, [totalCards]);

  const goToPrevious = useCallback(
    () => slideToItem((currentIndex - 1 + totalCards) % totalCards),
    [currentIndex, slideToItem, totalCards],
  );
  const goToNext = useCallback(
    () => slideToItem((currentIndex + 1) % totalCards),
    [currentIndex, slideToItem, totalCards],
  );

  const syncClosestItem = useCallback(() => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    const scrollPadding = Number.parseFloat(window.getComputedStyle(carousel).scrollPaddingLeft) || 0;
    const viewportStart = carousel.scrollLeft + scrollPadding;

    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(carousel.children).forEach((child, idx) => {
      const card = child as HTMLElement;
      const distance = Math.abs(card.offsetLeft - viewportStart);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (Math.abs(minDistance) > 5) {
      slideToItem(closestIndex);
    } else {
      setCurrentIndex(closestIndex);
    }
  }, [slideToItem]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, goToNext]);

  useEffect(() => {
    const timer = setTimeout(() => {
      slideToItem(0);
    }, 150);

    return () => clearTimeout(timer);
  }, [slideToItem]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        syncClosestItem();
      }, 150);
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      carousel.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [syncClosestItem]);

  if (cardsWithColor.length === 0) {
    return <div className="relative w-full overflow-hidden h-150" />;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          onClick={goToPrevious}
          className="hidden md:flex absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 z-30 items-center justify-center p-3 lg:p-4 bg-primary hover:bg-background hover:text-primary border border-primary rounded-full transition-all duration-300 text-white hover:scale-110 active:scale-95"
          aria-label="Previous"
        >
          <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.5} />
        </button>

        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 items-center justify-center p-3 lg:p-4 bg-primary hover:bg-background hover:text-primary border border-primary rounded-full transition-all duration-300 text-white hover:scale-110 active:scale-95"
          aria-label="Next"
        >
          <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.5} />
        </button>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 py-7 md:px-20 md:py-10 lg:px-24 lg:py-12 scroll-px-4 md:scroll-px-20 lg:scroll-px-24"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cardsWithColor.map((card) => {
            return (
              <div
                key={card.id}
                className="shrink-0 snap-start basis-full md:basis-[calc((100%_-_1.25rem)/2)] lg:basis-[calc((100%_-_3rem)/3)]"
              >
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-xl group/card cursor-pointer"
                  onClick={() => router.push('/products')}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      router.push('/products');
                    }
                  }}
                  role="link"
                  tabIndex={0}
                >
                  <Image
                    src={card.img_url ? normalizeImageUrl(card.img_url) ?? '/Icon.svg' : '/Icon.svg'}
                    alt={card.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                  />

                  <div className={`absolute inset-0 bg-linear-to-b ${card.color} opacity-20`} />

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 lg:p-6 bg-linear-to-t from-foreground/90 via-foreground/70 to-transparent">
                    <div className="uppercase text-primary-foreground tracking-[2px] text-[10px] md:text-xs font-semibold mb-0.5 md:mb-0.75 lg:mb-1 opacity-75">
                      {card.category || "Uncategorized"}
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground leading-none mb-1 md:mb-1.5 lg:mb-2 line-clamp-2">
                      {card.title}
                    </h3>
                    
                    <p className="text-xs md:text-sm lg:text-base text-primary-foreground/90 leading-tight mb-4 md:mb-5 lg:mb-6 line-clamp-2">
                      {card.description}
                    </p>

                    <div className="flex items-end justify-between gap-2 md:gap-3 lg:gap-4">
                      <div>
                        <span className="text-[10px] md:text-xs lg:text-sm text-primary-foreground/70">Starting at</span>
                        <div className="flex items-baseline gap-0.5 md:gap-0.75 lg:gap-1">
                          <span className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground tracking-tight">₱{card.price}</span>
                          <span className="text-sm md:text-base text-primary-foreground/70">PHP</span>
                        </div>
                      </div>

                      <Button 
                        text="View Products"
                        backgroundColor='bg-primary'
                        textColor='text-white'
                        className="shadow-lg transition-all active:scale-95"
                        onClick={() => router.push('/products')}
                      />
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

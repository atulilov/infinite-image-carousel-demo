"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./InfiniteImageCarousel.module.css";

export interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface InfiniteImageCarouselProps {
  images: CarouselImage[];
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
  className?: string;
}

const InfiniteImageCarousel: React.FC<InfiniteImageCarouselProps> = ({
  images,
  itemWidth = 300,
  itemHeight = 200,
  gap = 16,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isResettingRef = useRef(false);

  // Create extended array for seamless infinite scroll
  // We need at least 3 copies: prev, current, next
  const extendedImages = [...images, ...images, ...images];

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isResettingRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidthWithGap = itemWidth + gap;
    const totalItemsPerSet = images.length;
    const singleSetWidth = totalItemsPerSet * itemWidthWithGap;

    // Use a more generous buffer zone for smoother transitions
    const bufferZone = Math.min(itemWidthWithGap * 2, singleSetWidth * 0.2);

    // Reset position seamlessly when we get close to the edges
    if (scrollLeft <= bufferZone) {
      // Scrolling left: Near the start of first set, jump to equivalent position in the second set
      isResettingRef.current = true;
      const newScrollLeft = scrollLeft + singleSetWidth;
      container.scrollLeft = newScrollLeft;
      // Use setTimeout instead of requestAnimationFrame for better timing
      setTimeout(() => {
        isResettingRef.current = false;
      }, 16); // ~1 frame at 60fps
    } else if (scrollLeft >= singleSetWidth * 2 - bufferZone) {
      // Scrolling right: Near the end of second set, jump to equivalent position in the second set
      isResettingRef.current = true;
      const newScrollLeft = scrollLeft - singleSetWidth;
      container.scrollLeft = newScrollLeft;
      setTimeout(() => {
        isResettingRef.current = false;
      }, 16);
    }

    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [images.length, itemWidth, gap]);

  const initializeScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const itemWidthWithGap = itemWidth + gap;
    const totalItemsPerSet = images.length;

    // Start in the middle set (second copy)
    const initialScrollLeft = totalItemsPerSet * itemWidthWithGap;
    container.scrollLeft = initialScrollLeft;
  }, [images.length, itemWidth, gap]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initialize scroll position after images load
    const timer = setTimeout(initializeScrollPosition, 100);

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, initializeScrollPosition]);

  if (images.length === 0) {
    return <div className={styles.emptyCarousel}>No images to display</div>;
  }

  return (
    <div className={`${styles.carouselContainer} ${className}`}>
      <div
        ref={scrollContainerRef}
        className={styles.scrollContainer}
        style={{ gap: `${gap}px` }}
      >
        {extendedImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className={styles.imageWrapper}
            style={{
              minWidth: `${itemWidth}px`,
              height: `${itemHeight}px`,
            }}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes={`${itemWidth}px`}
              className={styles.image}
              priority={index < 6} // Prioritize first few images
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>

      {/* Optional loading indicator */}
      {isScrolling && (
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollBar} />
        </div>
      )}
    </div>
  );
};

export default InfiniteImageCarousel;

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
  const [responsiveItemWidth, setResponsiveItemWidth] = useState(itemWidth);
  const [responsiveItemHeight, setResponsiveItemHeight] = useState(itemHeight);
  const [responsiveGap, setResponsiveGap] = useState(gap);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isResettingRef = useRef(false);

  // Touch handling for mobile swipe
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const isTouchDevice = useRef(false);

  // Responsive sizing based on viewport
  const updateResponsiveSizes = useCallback(() => {
    const viewport = window.innerWidth;

    if (viewport <= 767) {
      // Mobile - Make items larger and more touchable
      setResponsiveItemWidth(Math.min(itemWidth * 0.85, viewport * 0.8));
      setResponsiveItemHeight(itemHeight * 0.8);
      setResponsiveGap(Math.max(gap * 0.75, 12));
    } else if (viewport <= 1024) {
      // Tablet
      setResponsiveItemWidth(Math.min(itemWidth * 0.85, viewport * 0.5));
      setResponsiveItemHeight(itemHeight * 0.85);
      setResponsiveGap(Math.max(gap * 0.75, 12));
    } else {
      // Desktop
      setResponsiveItemWidth(itemWidth);
      setResponsiveItemHeight(itemHeight);
      setResponsiveGap(gap);
    }
  }, [itemWidth, itemHeight, gap]);

  useEffect(() => {
    updateResponsiveSizes();

    const handleResize = () => {
      updateResponsiveSizes();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateResponsiveSizes]);

  // Create extended array for seamless infinite scroll
  // We need at least 3 copies: prev, current, next
  const extendedImages = [...images, ...images, ...images];

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isResettingRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidthWithGap = responsiveItemWidth + responsiveGap;
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
  }, [images.length, responsiveItemWidth, responsiveGap]);

  // Touch handlers for better mobile experience
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current || !e.touches[0]) return;

    isTouchDevice.current = true;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Reduce scroll momentum to improve touch responsiveness
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollSnapType = "x mandatory";
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !scrollContainerRef.current || !e.touches[0])
      return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If horizontal swipe is dominant, prevent vertical scrolling
    if (deltaX > deltaY && deltaX > 10) {
      // e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;

    // Restore normal scroll behavior
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollSnapType = "x mandatory";
    }
  }, []);

  // Handle wheel events for better hybrid device support
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // If this is a touch device, let the native scroll handle it
    if (isTouchDevice.current) return;

    // Prevent parent scroll when scrolling horizontally in the carousel
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // e.preventDefault();
    }
  }, []);

  const initializeScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const itemWidthWithGap = responsiveItemWidth + responsiveGap;
    const totalItemsPerSet = images.length;

    // Start in the middle set (second copy)
    const initialScrollLeft = totalItemsPerSet * itemWidthWithGap;
    container.scrollLeft = initialScrollLeft;
  }, [images.length, responsiveItemWidth, responsiveGap]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initialize scroll position after images load
    const timer = setTimeout(initializeScrollPosition, 100);

    // Use passive listeners for better performance on mobile
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
        style={{ gap: `${responsiveGap}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {extendedImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className={styles.imageWrapper}
            style={{
              minWidth: `${responsiveItemWidth}px`,
              height: `${responsiveItemHeight}px`,
            }}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes={`(max-width: 767px) ${Math.round(responsiveItemWidth)}px, (max-width: 1024px) ${Math.round(responsiveItemWidth)}px, ${responsiveItemWidth}px`}
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

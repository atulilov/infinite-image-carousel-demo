"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "./InfiniteImageCarousel.module.css";

interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface InfiniteImageCarouselProps {
  images: CarouselImage[];
  itemWidth: number;
  itemHeight: number;
  gap?: number;
}

const InfiniteImageCarousel: React.FC<InfiniteImageCarouselProps> = ({
  images,
  itemWidth,
  itemHeight,
  gap = 16,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create extended array for infinite loop illusion
  // Clone first and last items to enable seamless infinite scrolling
  const extendedImages = React.useMemo(() => {
    const cloneCount = Math.min(5, Math.ceil(images.length / 2));
    const lastItems = images.slice(-cloneCount);
    const firstItems = images.slice(0, cloneCount);
    return [...lastItems, ...images, ...firstItems];
  }, [images]);

  // Calculate dimensions for scroll logic
  const itemTotalWidth = itemWidth + gap;
  const originalStartIndex = Math.min(5, Math.ceil(images.length / 2));
  const originalEndIndex = originalStartIndex + images.length;

  // Handle infinite scroll logic
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;

    // Calculate current item index based on scroll position
    const currentIndex = Math.round(scrollLeft / itemTotalWidth);

    // Infinite loop logic: jump to opposite end when reaching cloned items
    if (currentIndex < originalStartIndex) {
      // Scrolled past left cloned items - jump to end of original items
      const targetScroll =
        (originalEndIndex - (originalStartIndex - currentIndex)) *
        itemTotalWidth;
      container.scrollTo({ left: targetScroll, behavior: "instant" });
    } else if (currentIndex >= originalEndIndex) {
      // Scrolled past right cloned items - jump to start of original items
      const targetScroll =
        (originalStartIndex + (currentIndex - originalEndIndex)) *
        itemTotalWidth;
      container.scrollTo({ left: targetScroll, behavior: "instant" });
    }
  }, [itemTotalWidth, originalStartIndex, originalEndIndex]);

  // Debounced scroll handler to prevent excessive calculations
  const debouncedScrollHandler = useCallback(() => {
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Handle scroll immediately for responsiveness
    handleScroll();

    // Debounce for performance
    scrollTimeoutRef.current = setTimeout(() => {
      // Scroll handling is complete
    }, 150);
  }, [handleScroll]);

  // Initialize scroll position to start of original images
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial scroll position to show original images (not clones)
    const initialScroll = originalStartIndex * itemTotalWidth;
    container.scrollTo({ left: initialScroll, behavior: "instant" });
  }, [itemTotalWidth, originalStartIndex]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.carousel}>
      <div
        ref={containerRef}
        className={styles.container}
        onScroll={debouncedScrollHandler}
        style={
          {
            "--item-width": `${itemWidth}px`,
            "--item-height": `${itemHeight}px`,
            "--gap": `${gap}px`,
          } as React.CSSProperties
        }
      >
        {extendedImages.map((image, index) => (
          <div key={`${image.id}-${index}`} className={styles.imageWrapper}>
            <Image
              src={image.url}
              alt={image.alt}
              width={itemWidth}
              height={itemHeight}
              className={styles.image}
              loading={index < 10 ? "eager" : "lazy"}
              priority={index < 3}
              sizes={`${itemWidth}px`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteImageCarousel;

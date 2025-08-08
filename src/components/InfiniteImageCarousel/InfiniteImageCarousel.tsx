"use client";

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
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
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Create extended array for infinite loop illusion
  const extendedImages = useMemo(() => {
    const cloneCount = Math.min(5, Math.ceil(images.length / 2));
    const lastItems = images.slice(-cloneCount);
    const firstItems = images.slice(0, cloneCount);
    return [...lastItems, ...images, ...firstItems];
  }, [images]);

  // Calculate dimensions for scroll logic and virtualization
  const itemTotalWidth = itemWidth + gap;
  const originalStartIndex = Math.min(5, Math.ceil(images.length / 2));
  const originalEndIndex = originalStartIndex + images.length;
  const totalWidth = extendedImages.length * itemTotalWidth;

  // Virtualization: Calculate visible range with buffer
  const bufferSize = 5;
  const startIndex = Math.max(
    0,
    Math.floor(scrollLeft / itemTotalWidth) - bufferSize
  );
  const visibleCount =
    Math.ceil(containerWidth / itemTotalWidth) + bufferSize * 2;
  const endIndex = Math.min(
    extendedImages.length - 1,
    startIndex + visibleCount
  );

  // Generate visible items for rendering
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const image = extendedImages[i];
      if (image) {
        items.push({
          index: i,
          image,
          left: i * itemTotalWidth,
        });
      }
    }
    return items;
  }, [startIndex, endIndex, extendedImages, itemTotalWidth]);

  // Handle infinite scroll logic with virtualization
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentScrollLeft = container.scrollLeft;
    setScrollLeft(currentScrollLeft);

    // Calculate current item index based on scroll position
    const currentIndex = Math.round(currentScrollLeft / itemTotalWidth);

    // Infinite loop logic: jump to opposite end when reaching cloned items
    if (currentIndex < originalStartIndex) {
      const targetScroll =
        (originalEndIndex - (originalStartIndex - currentIndex)) *
        itemTotalWidth;
      container.scrollTo({ left: targetScroll, behavior: "instant" });
    } else if (currentIndex >= originalEndIndex) {
      const targetScroll =
        (originalStartIndex + (currentIndex - originalEndIndex)) *
        itemTotalWidth;
      container.scrollTo({ left: targetScroll, behavior: "instant" });
    }
  }, [itemTotalWidth, originalStartIndex, originalEndIndex]);

  // Debounced scroll handler
  const debouncedScrollHandler = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    handleScroll();

    scrollTimeoutRef.current = setTimeout(() => {}, 150);
  }, [handleScroll]);

  // Initialize and handle resize for virtualization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      setContainerWidth(container.clientWidth);
      setScrollLeft(container.scrollLeft);
    };

    const initialScroll = originalStartIndex * itemTotalWidth;
    container.scrollTo({ left: initialScroll, behavior: "instant" });

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
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
        <div className={styles.virtualContainer} style={{ width: totalWidth }}>
          {visibleItems.map(({ index, image, left }) => (
            <div
              key={`${image.id}-${index}`}
              className={styles.imageWrapper}
              style={{
                position: "absolute",
                left: left,
                width: itemWidth,
                height: itemHeight,
              }}
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={itemWidth}
                height={itemHeight}
                className={styles.image}
                loading="lazy"
                sizes={`${itemWidth}px`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteImageCarousel;

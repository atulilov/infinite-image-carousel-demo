"use client";

import {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
  type FC,
  type CSSProperties,
} from "react";
import Image from "next/image";

import styles from "./InfiniteImageCarousel.module.css";

import type { InfiniteImageCarouselProps } from "./InfiniteImageCarousel.types";

const InfiniteImageCarousel: FC<InfiniteImageCarouselProps> = ({
  images,
  itemWidth,
  itemHeight,
  gap = 16,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

    // Use precise positioning instead of rounded indices for seamless transitions
    const originalSectionStart = originalStartIndex * itemTotalWidth;
    const originalSectionEnd = originalEndIndex * itemTotalWidth;

    // Check if we're in the left clone section (need to jump to end)
    if (currentScrollLeft < originalSectionStart) {
      const offsetWithinClone = currentScrollLeft;
      const targetScroll =
        originalSectionEnd - (originalSectionStart - offsetWithinClone);
      container.scrollTo({ left: targetScroll, behavior: "instant" });
      setScrollLeft(targetScroll);
    }
    // Check if we're in the right clone section (need to jump to start)
    else if (currentScrollLeft >= originalSectionEnd) {
      const offsetBeyondEnd = currentScrollLeft - originalSectionEnd;
      const targetScroll = originalSectionStart + offsetBeyondEnd;
      container.scrollTo({ left: targetScroll, behavior: "instant" });
      setScrollLeft(targetScroll);
    }
  }, [itemTotalWidth, originalStartIndex, originalEndIndex]);

  // Immediate scroll handler for smooth infinite loop
  const immediateScrollHandler = useCallback(() => {
    handleScroll();
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

  const containerStyle: CSSProperties & Record<string, string> = {
    "--item-width": `${itemWidth}px`,
    "--item-height": `${itemHeight}px`,
    "--gap": `${gap}px`,
  };

  return (
    <div className={styles.carousel}>
      <div
        ref={containerRef}
        className={styles.container}
        onScroll={immediateScrollHandler}
        style={containerStyle}
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

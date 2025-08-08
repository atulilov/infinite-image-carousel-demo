"use client";

import { useEffect, type FC } from "react";
import Image from "next/image";

import styles from "./InfiniteImageCarousel.module.css";
import type { InfiniteImageCarouselProps } from "./InfiniteImageCarousel.types";

import {
  useCarouselData,
  useInfiniteScroll,
  useContainerDimensions,
  useVirtualization,
} from "./InfiniteImageCarousel.hooks";
import {
  createContainerStyle,
  createItemStyle,
} from "./InfiniteImageCarousel.utils";

const InfiniteImageCarousel: FC<InfiniteImageCarouselProps> = ({
  images,
  itemWidth,
  itemHeight,
  gap = 16,
}) => {
  const carouselData = useCarouselData(images, itemWidth, gap);
  const {
    extendedImages,
    itemTotalWidth,
    originalStartIndex,
    originalEndIndex,
    totalWidth,
  } = carouselData;

  const infiniteScroll = useInfiniteScroll({
    itemTotalWidth,
    originalStartIndex,
    originalEndIndex,
  });
  const { containerRef, scrollLeft, handleInfiniteScroll, initializeScroll } =
    infiniteScroll;

  const containerWidth = useContainerDimensions(containerRef);

  const visibleItems = useVirtualization({
    scrollLeft,
    containerWidth,
    itemTotalWidth,
    totalItems: extendedImages.length,
  });

  useEffect(() => {
    initializeScroll();
  }, [initializeScroll]);

  const containerStyle = createContainerStyle(itemWidth, itemHeight, gap);

  return (
    <div className={styles.carousel}>
      <div
        ref={containerRef}
        className={styles.container}
        onScroll={handleInfiniteScroll}
        style={containerStyle}
      >
        <div className={styles.virtualContainer} style={{ width: totalWidth }}>
          {visibleItems.map(({ index, left }) => {
            const image = extendedImages[index];
            if (!image) return null;

            return (
              <div
                key={`${image.id}-${index}`}
                className={styles.imageWrapper}
                style={createItemStyle(left, itemWidth, itemHeight)}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfiniteImageCarousel;

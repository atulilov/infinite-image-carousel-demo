import {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
  type RefObject,
} from "react";
import type {
  CarouselImage,
  UseInfiniteScrollParams,
  VirtualizationConfig,
  VisibleItem,
} from "./InfiniteImageCarousel.types";

// Pure utility functions
export const createExtendedImageArray = (images: CarouselImage[]) => {
  const cloneCount = Math.min(5, Math.ceil(images.length / 2));
  const lastItems = images.slice(-cloneCount);
  const firstItems = images.slice(0, cloneCount);
  return [...lastItems, ...images, ...firstItems];
};

export const calculateCarouselDimensions = (
  images: CarouselImage[],
  itemWidth: number,
  gap: number
) => {
  const extendedImages = createExtendedImageArray(images);
  const itemTotalWidth = itemWidth + gap;
  const originalStartIndex = Math.min(5, Math.ceil(images.length / 2));
  const originalEndIndex = originalStartIndex + images.length;
  const totalWidth = extendedImages.length * itemTotalWidth;

  return {
    extendedImages,
    itemTotalWidth,
    originalStartIndex,
    originalEndIndex,
    totalWidth,
  };
};

const calculateVisibleRange = (
  scrollLeft: number,
  containerWidth: number,
  itemTotalWidth: number,
  totalItems: number,
  bufferSize: number = 5
) => {
  const startIndex = Math.max(
    0,
    Math.floor(scrollLeft / itemTotalWidth) - bufferSize
  );
  const visibleCount =
    Math.ceil(containerWidth / itemTotalWidth) + bufferSize * 2;
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount);

  return { startIndex, endIndex };
};

// Hooks
export const useCarouselData = (
  images: CarouselImage[],
  itemWidth: number,
  gap: number
) => {
  return useMemo(
    () => calculateCarouselDimensions(images, itemWidth, gap),
    [images, itemWidth, gap]
  );
};

export const useInfiniteScroll = ({
  itemTotalWidth,
  originalStartIndex,
  originalEndIndex,
}: UseInfiniteScrollParams) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleInfiniteScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentScrollLeft = container.scrollLeft;
    setScrollLeft(currentScrollLeft);

    const originalSectionStart = originalStartIndex * itemTotalWidth;
    const originalSectionEnd = originalEndIndex * itemTotalWidth;

    // Jump from left clone section to end
    if (currentScrollLeft < originalSectionStart) {
      const offsetWithinClone = currentScrollLeft;
      const targetScroll =
        originalSectionEnd - (originalSectionStart - offsetWithinClone);
      container.scrollTo({ left: targetScroll, behavior: "instant" });
      setScrollLeft(targetScroll);
      return;
    }

    // Jump from right clone section to start
    if (currentScrollLeft >= originalSectionEnd) {
      const offsetBeyondEnd = currentScrollLeft - originalSectionEnd;
      const targetScroll = originalSectionStart + offsetBeyondEnd;
      container.scrollTo({ left: targetScroll, behavior: "instant" });
      setScrollLeft(targetScroll);
    }
  }, [itemTotalWidth, originalStartIndex, originalEndIndex]);

  const initializeScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialScroll = originalStartIndex * itemTotalWidth;
    container.scrollTo({ left: initialScroll, behavior: "instant" });
  }, [itemTotalWidth, originalStartIndex]);

  return {
    containerRef,
    scrollLeft,
    handleInfiniteScroll,
    initializeScroll,
  };
};

export const useContainerDimensions = (
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    setContainerWidth(container.clientWidth);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateDimensions, containerRef]);

  return containerWidth;
};

export const useVirtualization = ({
  scrollLeft,
  containerWidth,
  itemTotalWidth,
  totalItems,
}: VirtualizationConfig) => {
  const visibleRange = useMemo(
    () =>
      calculateVisibleRange(
        scrollLeft,
        containerWidth,
        itemTotalWidth,
        totalItems
      ),
    [scrollLeft, containerWidth, itemTotalWidth, totalItems]
  );

  const visibleItems = useMemo(() => {
    const items: VisibleItem[] = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      items.push({
        index: i,
        left: i * itemTotalWidth,
      });
    }
    return items;
  }, [visibleRange.startIndex, visibleRange.endIndex, itemTotalWidth]);

  return visibleItems;
};

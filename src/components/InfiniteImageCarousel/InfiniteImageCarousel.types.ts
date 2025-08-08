export interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface InfiniteImageCarouselProps {
  images: CarouselImage[];
  itemWidth: number;
  itemHeight: number;
  gap?: number;
}

export interface UseInfiniteScrollParams {
  itemTotalWidth: number;
  originalStartIndex: number;
  originalEndIndex: number;
}

export interface VirtualizationConfig {
  scrollLeft: number;
  containerWidth: number;
  itemTotalWidth: number;
  totalItems: number;
}

export interface VisibleItem {
  index: number;
  left: number;
}

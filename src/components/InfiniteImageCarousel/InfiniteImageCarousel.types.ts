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

import type { CarouselImage } from "../components/InfiniteImageCarousel";

interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface FetchImagesOptions {
  count?: number;
  width?: number;
  height?: number;
}

export const fetchImages = async (
  options: FetchImagesOptions = {}
): Promise<CarouselImage[]> => {
  const { count = 20, width = 400, height = 300 } = options;

  try {
    const response = await fetch(
      `https://picsum.photos/v2/list?page=1&limit=${count}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }

    const picsumImages: PicsumImage[] = await response.json();

    const carouselImages: CarouselImage[] = picsumImages.map(img => ({
      id: img.id,
      url: `https://picsum.photos/id/${img.id}/${width}/${height}`,
      alt: `Photo by ${img.author}`,
      width,
      height,
    }));

    return carouselImages;
  } catch {
    // Fallback: generate some placeholder images
    const fallbackImages: CarouselImage[] = Array.from(
      { length: count },
      (_, index) => ({
        id: `fallback-${index}`,
        url: `https://picsum.photos/${width}/${height}?random=${index}`,
        alt: `Random image ${index + 1}`,
        width,
        height,
      })
    );
    return fallbackImages;
  }
};

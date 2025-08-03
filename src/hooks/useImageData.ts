"use client";

import { useState, useEffect } from "react";
import type { CarouselImage } from "../components/InfiniteImageCarousel";

interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface UseImageDataOptions {
  count?: number;
  width?: number;
  height?: number;
}

export const useImageData = (options: UseImageDataOptions = {}) => {
  const { count = 20, width = 400, height = 300 } = options;
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch list of images from Picsum
        const response = await fetch(
          `https://picsum.photos/v2/list?page=1&limit=${count}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const picsumImages: PicsumImage[] = await response.json();

        // Transform the data to match our CarouselImage interface
        const carouselImages: CarouselImage[] = picsumImages.map(img => ({
          id: img.id,
          url: `https://picsum.photos/id/${img.id}/${width}/${height}`,
          alt: `Photo by ${img.author}`,
          width,
          height,
        }));

        setImages(carouselImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");

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

        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [count, width, height]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Force a re-fetch by updating the effect dependencies
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://picsum.photos/v2/list?page=${Math.floor(Math.random() * 10) + 1}&limit=${count}`
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

        setImages(carouselImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  };

  return { images, loading, error, refetch };
};

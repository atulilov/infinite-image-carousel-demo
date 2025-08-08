/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import InfiniteImageCarousel from "./InfiniteImageCarousel";
import type { CarouselImage } from "./InfiniteImageCarousel.types";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    [key: string]: unknown;
  }) {
    // Using img element for testing purposes - Next.js Image is mocked
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...props}
      />
    );
  };
});

// Mock CSS modules
jest.mock("./InfiniteImageCarousel.module.css", () => ({
  carousel: "carousel",
  container: "container",
  virtualContainer: "virtualContainer",
  imageWrapper: "imageWrapper",
  image: "image",
}));

const mockImages: CarouselImage[] = [
  {
    id: "1",
    url: "https://example.com/image1.jpg",
    alt: "Image 1",
    width: 300,
    height: 200,
  },
  {
    id: "2",
    url: "https://example.com/image2.jpg",
    alt: "Image 2",
    width: 300,
    height: 200,
  },
  {
    id: "3",
    url: "https://example.com/image3.jpg",
    alt: "Image 3",
    width: 300,
    height: 200,
  },
  {
    id: "4",
    url: "https://example.com/image4.jpg",
    alt: "Image 4",
    width: 300,
    height: 200,
  },
  {
    id: "5",
    url: "https://example.com/image5.jpg",
    alt: "Image 5",
    width: 300,
    height: 200,
  },
];

const defaultProps = {
  images: mockImages,
  itemWidth: 300,
  itemHeight: 200,
  gap: 16,
};

describe("InfiniteImageCarousel", () => {
  beforeEach(() => {
    // Mock getBoundingClientRect for container dimensions
    Object.defineProperty(HTMLDivElement.prototype, "getBoundingClientRect", {
      value: jest.fn(() => ({
        width: 1200,
        height: 200,
        top: 0,
        left: 0,
        bottom: 200,
        right: 1200,
      })),
      writable: true,
    });

    // Mock scrollLeft property
    Object.defineProperty(HTMLDivElement.prototype, "scrollLeft", {
      value: 0,
      writable: true,
    });

    // Mock scrollTo method
    Object.defineProperty(HTMLDivElement.prototype, "scrollTo", {
      value: jest.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders without crashing", () => {
      render(<InfiniteImageCarousel {...defaultProps} />);
      expect(screen.getAllByRole("img")).toHaveLength(11); // Extended array with clones
    });

    test("renders carousel with correct structure", () => {
      const { container } = render(<InfiniteImageCarousel {...defaultProps} />);

      const carousel = container.querySelector(".carousel");
      expect(carousel).toBeInTheDocument();

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toBeInTheDocument();

      const virtualContainer = container.querySelector(".virtualContainer");
      expect(virtualContainer).toBeInTheDocument();
    });

    test("renders images with correct attributes", () => {
      render(<InfiniteImageCarousel {...defaultProps} />);

      // Should render multiple images (extended array includes clones)
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(mockImages.length);

      // Check first visible image attributes
      const firstImage = images[0];
      expect(firstImage).toHaveAttribute("width", "300");
      expect(firstImage).toHaveAttribute("height", "200");
      expect(firstImage).toHaveAttribute("alt");
    });
  });

  describe("Props handling", () => {
    test("handles itemWidth and itemHeight props", () => {
      const { container } = render(
        <InfiniteImageCarousel
          {...defaultProps}
          itemWidth={400}
          itemHeight={300}
        />
      );

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toHaveStyle({
        "--item-width": "400px",
        "--item-height": "300px",
      });
    });

    test("handles gap prop", () => {
      const { container } = render(
        <InfiniteImageCarousel {...defaultProps} gap={20} />
      );

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toHaveStyle("--gap: 20px");
    });

    test("uses default gap when not provided", () => {
      const { container } = render(
        <InfiniteImageCarousel
          images={mockImages}
          itemWidth={300}
          itemHeight={200}
        />
      );

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toHaveStyle("--gap: 16px");
    });

    test("handles empty images array", () => {
      render(<InfiniteImageCarousel {...defaultProps} images={[]} />);

      // Should not crash and should render container structure
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    test("handles single image", () => {
      const singleImage = [mockImages[0]!];
      render(<InfiniteImageCarousel {...defaultProps} images={singleImage} />);

      // Should render extended array with clones
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(1);
    });
  });

  describe("Image display", () => {
    test("displays correct image URLs", () => {
      render(<InfiniteImageCarousel {...defaultProps} />);

      const images = screen.getAllByRole("img");

      // Check that original images are present
      mockImages.forEach(mockImage => {
        const matchingImages = images.filter(
          img => img.getAttribute("src") === mockImage.url
        );
        expect(matchingImages.length).toBeGreaterThan(0);
      });
    });

    test("displays correct alt text", () => {
      render(<InfiniteImageCarousel {...defaultProps} />);

      mockImages.forEach(mockImage => {
        const matchingImages = screen.getAllByAltText(mockImage.alt);
        expect(matchingImages.length).toBeGreaterThan(0);
      });
    });

    test("applies lazy loading to images", () => {
      render(<InfiniteImageCarousel {...defaultProps} />);

      const images = screen.getAllByRole("img");
      images.forEach(img => {
        expect(img).toHaveAttribute("loading", "lazy");
      });
    });

    test("sets correct sizes attribute", () => {
      render(<InfiniteImageCarousel {...defaultProps} />);

      const images = screen.getAllByRole("img");
      images.forEach(img => {
        expect(img).toHaveAttribute("sizes", "300px");
      });
    });
  });

  describe("Scroll behavior", () => {
    test("handles scroll events", async () => {
      const { container } = render(<InfiniteImageCarousel {...defaultProps} />);

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toBeInTheDocument();

      // Simulate scroll event
      if (scrollContainer) {
        Object.defineProperty(scrollContainer, "scrollLeft", {
          value: 100,
          writable: true,
        });

        fireEvent.scroll(scrollContainer);

        // Component should handle the scroll without crashing
        await waitFor(() => {
          expect(scrollContainer).toBeInTheDocument();
        });
      }
    });

    test("initializes scroll position", async () => {
      const { container } = render(<InfiniteImageCarousel {...defaultProps} />);

      const scrollContainer = container.querySelector(".container");

      // Should initialize without errors
      await waitFor(() => {
        expect(scrollContainer).toBeInTheDocument();
      });
    });
  });

  describe("Virtualization", () => {
    test("renders virtual container with correct width", () => {
      const { container } = render(<InfiniteImageCarousel {...defaultProps} />);

      const virtualContainer = container.querySelector(".virtualContainer");
      expect(virtualContainer).toBeInTheDocument();
      expect(virtualContainer).toHaveStyle("width: 3476px");
    });

    test("positions image wrappers absolutely", () => {
      const { container } = render(<InfiniteImageCarousel {...defaultProps} />);

      const imageWrappers = container.querySelectorAll(".imageWrapper");
      expect(imageWrappers.length).toBeGreaterThan(0);

      imageWrappers.forEach(wrapper => {
        expect(wrapper).toHaveStyle("position: absolute");
        expect(wrapper).toHaveStyle("width: 300px");
        expect(wrapper).toHaveStyle("height: 200px");
      });
    });
  });

  describe("Accessibility", () => {
    test("all images have alt text", () => {
      render(<InfiniteImageCarousel {...defaultProps} />);

      const images = screen.getAllByRole("img");
      images.forEach(img => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });

    test("container is scrollable", () => {
      const { container } = render(<InfiniteImageCarousel {...defaultProps} />);

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toBeInTheDocument();

      // Should be able to receive scroll events
      if (scrollContainer) {
        fireEvent.scroll(scrollContainer);
        // Should not throw error
      }
    });
  });

  describe("Edge cases", () => {
    test("handles very small itemWidth and itemHeight", () => {
      render(
        <InfiniteImageCarousel {...defaultProps} itemWidth={1} itemHeight={1} />
      );

      const images = screen.getAllByRole("img");
      expect(images[0]).toHaveAttribute("width", "1");
      expect(images[0]).toHaveAttribute("height", "1");
    });

    test("handles very large itemWidth and itemHeight", () => {
      render(
        <InfiniteImageCarousel
          {...defaultProps}
          itemWidth={2000}
          itemHeight={1500}
        />
      );

      const images = screen.getAllByRole("img");
      expect(images[0]).toHaveAttribute("width", "2000");
      expect(images[0]).toHaveAttribute("height", "1500");
    });

    test("handles zero gap", () => {
      const { container } = render(
        <InfiniteImageCarousel {...defaultProps} gap={0} />
      );

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toHaveStyle("--gap: 0px");
    });

    test("handles large gap", () => {
      const { container } = render(
        <InfiniteImageCarousel {...defaultProps} gap={100} />
      );

      const scrollContainer = container.querySelector(".container");
      expect(scrollContainer).toHaveStyle("--gap: 100px");
    });

    test("handles images with missing optional properties", () => {
      const imagesWithoutOptional: CarouselImage[] = [
        {
          id: "1",
          url: "https://example.com/image1.jpg",
          alt: "Image 1",
        },
        {
          id: "2",
          url: "https://example.com/image2.jpg",
          alt: "Image 2",
        },
      ];

      render(
        <InfiniteImageCarousel
          {...defaultProps}
          images={imagesWithoutOptional}
        />
      );

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(2);
    });

    test("handles special characters in image alt text", () => {
      const specialImages: CarouselImage[] = [
        {
          id: "1",
          url: "https://example.com/image1.jpg",
          alt: "Image with special chars: é, ñ, 中文, 🎉",
        },
      ];

      render(
        <InfiniteImageCarousel {...defaultProps} images={specialImages} />
      );

      const specialAltImages = screen.getAllByAltText(
        "Image with special chars: é, ñ, 中文, 🎉"
      );
      expect(specialAltImages.length).toBeGreaterThan(0);
    });
  });

  describe("Performance", () => {
    test("does not re-render unnecessarily with same props", () => {
      const { rerender } = render(<InfiniteImageCarousel {...defaultProps} />);

      const initialImageCount = screen.getAllByRole("img").length;

      // Re-render with same props
      rerender(<InfiniteImageCarousel {...defaultProps} />);

      const afterRerenderImageCount = screen.getAllByRole("img").length;
      expect(afterRerenderImageCount).toBe(initialImageCount);
    });

    test("handles rapid prop changes", () => {
      const { rerender } = render(<InfiniteImageCarousel {...defaultProps} />);

      // Change props rapidly
      rerender(<InfiniteImageCarousel {...defaultProps} itemWidth={400} />);
      rerender(<InfiniteImageCarousel {...defaultProps} itemWidth={500} />);
      rerender(<InfiniteImageCarousel {...defaultProps} gap={20} />);

      // Should still render correctly
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import InfiniteImageCarousel from "./InfiniteImageCarousel";

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    className,
    loading,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    loading?: "eager" | "lazy";
    sizes?: string;
  }) {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        data-testid="carousel-image"
      />
    );
    /* eslint-enable @next/next/no-img-element */
  };
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollTo method
Element.prototype.scrollTo = jest.fn();

const mockImages = [
  {
    id: "1",
    url: "/test-image-1.jpg",
    alt: "Test Image 1",
    width: 300,
    height: 200,
  },
  {
    id: "2",
    url: "/test-image-2.jpg",
    alt: "Test Image 2",
    width: 300,
    height: 200,
  },
  {
    id: "3",
    url: "/test-image-3.jpg",
    alt: "Test Image 3",
    width: 300,
    height: 200,
  },
];

describe("InfiniteImageCarousel", () => {
  const defaultProps = {
    images: mockImages,
    itemWidth: 300,
    itemHeight: 200,
    gap: 16,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the carousel container", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();
  });

  it("renders images with correct dimensions", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    const images = screen.getAllByTestId("carousel-image");
    expect(images.length).toBeGreaterThan(0);

    images.forEach(img => {
      expect(img).toHaveAttribute("width", "300");
      expect(img).toHaveAttribute("height", "200");
    });
  });

  it("applies correct CSS custom properties", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    const container = document.querySelector(".container");
    expect(container).toHaveStyle({
      "--item-width": "300px",
      "--item-height": "200px",
      "--gap": "16px",
    });
  });

  it("uses default gap value when not provided", () => {
    const propsWithoutGap = {
      images: mockImages,
      itemWidth: 300,
      itemHeight: 200,
    };

    render(<InfiniteImageCarousel {...propsWithoutGap} />);

    const container = document.querySelector(".container");
    expect(container).toHaveStyle("--gap: 16px");
  });

  it("creates extended image array for infinite loop", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    // Should render more images than the original array due to cloning
    const images = screen.getAllByTestId("carousel-image");
    expect(images.length).toBeGreaterThan(mockImages.length);
  });

  it("sets up ResizeObserver for container", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    expect(ResizeObserver).toHaveBeenCalled();
    const mockResizeObserver = ResizeObserver as jest.Mock;
    const resizeObserverInstance = mockResizeObserver.mock.results[0]?.value;
    if (resizeObserverInstance) {
      expect(resizeObserverInstance.observe).toHaveBeenCalled();
    }
  });

  it("initializes scroll position on mount", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    expect(Element.prototype.scrollTo).toHaveBeenCalledWith({
      left: expect.any(Number),
      behavior: "instant",
    });
  });

  it("handles empty images array", () => {
    const emptyProps = {
      ...defaultProps,
      images: [],
    };

    render(<InfiniteImageCarousel {...emptyProps} />);

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();
  });

  it("positions image wrappers absolutely", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    const imageWrappers = document.querySelectorAll(".imageWrapper");
    imageWrappers.forEach(wrapper => {
      expect(wrapper).toHaveStyle("position: absolute");
      expect(wrapper).toHaveStyle("width: 300px");
      expect(wrapper).toHaveStyle("height: 200px");
    });
  });

  it("applies lazy loading to images", () => {
    render(<InfiniteImageCarousel {...defaultProps} />);

    const images = screen.getAllByTestId("carousel-image");
    images.forEach(img => {
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });
});

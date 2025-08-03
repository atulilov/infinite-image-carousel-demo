// Test cases for the infinite carousel

// Test data with different numbers of images
export const testImages = {
  small: Array.from({ length: 3 }, (_, i) => ({
    id: `small-${i}`,
    url: `https://picsum.photos/300/200?random=${i}`,
    alt: `Small test image ${i + 1}`,
  })),

  medium: Array.from({ length: 12 }, (_, i) => ({
    id: `medium-${i}`,
    url: `https://picsum.photos/300/200?random=${i + 10}`,
    alt: `Medium test image ${i + 1}`,
  })),

  large: Array.from({ length: 50 }, (_, i) => ({
    id: `large-${i}`,
    url: `https://picsum.photos/300/200?random=${i + 100}`,
    alt: `Large test image ${i + 1}`,
  })),

  xlarge: Array.from({ length: 1000 }, (_, i) => ({
    id: `xlarge-${i}`,
    url: `https://picsum.photos/300/200?random=${i + 1000}`,
    alt: `XLarge test image ${i + 1}`,
  })),
};

// Different image sizes for aspect ratio testing
export const variableSizeImages = [
  {
    id: "landscape-1",
    url: "https://picsum.photos/400/200?random=2000",
    alt: "Landscape image 1",
  },
  {
    id: "portrait-1",
    url: "https://picsum.photos/200/400?random=2001",
    alt: "Portrait image 1",
  },
  {
    id: "square-1",
    url: "https://picsum.photos/300/300?random=2002",
    alt: "Square image 1",
  },
  {
    id: "wide-1",
    url: "https://picsum.photos/600/200?random=2003",
    alt: "Wide image 1",
  },
  {
    id: "tall-1",
    url: "https://picsum.photos/200/600?random=2004",
    alt: "Tall image 1",
  },
];

# Infinite Image Carousel

A React component that creates a truly infinite, scroll-based image carousel with seamless circular navigation.

## Features

- **True Infinite Scroll**: Items loop seamlessly in a circle with no visible jumps or resets
- **Scroll-Only Navigation**: No buttons or arrows - navigation is entirely scroll-based
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Performance Optimized**: Handles 5 to 1000+ images efficiently
- **Flexible Sizing**: Supports different image sizes and aspect ratios
- **Touch Friendly**: Smooth touch and drag interactions
- **Zero Dependencies**: Built with vanilla React and CSS

## How It Works

The infinite scroll is achieved by creating three copies of the image array and intelligently repositioning the scroll when the user approaches the edges:

1. **Triple Array**: `[images, images, images]` ensures content in all directions
2. **Smart Repositioning**: When scrolling near edges, instantly jump to equivalent position in middle section
3. **Buffer Zones**: Uses generous buffer zones to ensure jumps happen off-screen
4. **Seamless Experience**: Users never see the repositioning - it feels truly infinite

## Usage

```tsx
import InfiniteImageCarousel from "./components/InfiniteImageCarousel";

const images = [
  { id: "1", url: "image1.jpg", alt: "Image 1" },
  { id: "2", url: "image2.jpg", alt: "Image 2" },
  // ... more images
];

export function App() {
  return (
    <InfiniteImageCarousel
      images={images}
      itemWidth={300}
      itemHeight={200}
      gap={16}
    />
  );
}
```

## Props

| Prop         | Type              | Default  | Description                         |
| ------------ | ----------------- | -------- | ----------------------------------- |
| `images`     | `CarouselImage[]` | Required | Array of image objects              |
| `itemWidth`  | `number`          | `300`    | Width of each image item in pixels  |
| `itemHeight` | `number`          | `200`    | Height of each image item in pixels |
| `gap`        | `number`          | `16`     | Gap between images in pixels        |
| `className`  | `string`          | `''`     | Additional CSS class                |

## CarouselImage Interface

```tsx
interface CarouselImage {
  id: string; // Unique identifier
  url: string; // Image URL
  alt: string; // Alt text for accessibility
  width?: number; // Optional: original width
  height?: number; // Optional: original height
}
```

## Demo

Run the project to see live examples:

```bash
npm run dev
```

The demo includes:

- 5-item carousel showing pure circular behavior
- 12-item landscape images
- 50-item performance test
- Portrait orientation examples

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full touch support

## License

MIT

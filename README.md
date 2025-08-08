# 🎠 Infinite Image Carousel Demo

A high-performance, scroll-based infinite image carousel built with **Next.js 15**, **React 19**, and **TypeScript**. This project demonstrates modern web development practices, progressive web app (PWA) capabilities, and advanced image handling techniques.

## ✨ Features

### 🚀 Performance Optimized

- **True Infinite Scroll**: Items loop seamlessly in a circle with no visible jumps or resets
- **Scroll-Only Navigation**: No buttons or arrows - navigation is entirely scroll-based
- **Lazy loading** and image optimization using Next.js Image component
- **Virtualization-ready** architecture for handling thousands of images
- **Memory efficient** with proper cleanup and memoization

### 🌐 Modern Web Technologies

- **Next.js 15** with App Router and Turbopack for lightning-fast development
- **React 19** with modern hooks and functional components
- **TypeScript** with strict type checking for robust code
- **CSS Modules** for component-scoped styling
- **PWA support** with service workers and offline capabilities

### 📱 Progressive Web App (PWA)

- **Service Worker** for offline functionality
- **Installable** as a native app on mobile and desktop
- **Cache strategies** for optimal performance
- **Background sync** capabilities

### 🎨 Advanced Image Handling

- **Multiple API integration strategies** (Picsum Photos API)
- **Batch fetching** with pagination support for 1000+ images
- **Rate limiting** to prevent API timeouts
- **Graceful error handling** with fallback images
- **Responsive image sizing** with customizable dimensions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Prettier
- **Build Tool**: Turbopack
- **Image API**: Picsum Photos
- **PWA**: Service Workers + Web App Manifest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/atulilov/infinite-image-carousel-demo.git
cd infinite-image-carousel-demo

# Install dependencies
yarn install
# or
npm install

# Start the development server
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the demo.

### Development Scripts

```bash
yarn dev          # Start development server with Turbopack
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn format       # Format code with Prettier
yarn test         # Run tests
yarn type-check   # Run TypeScript type checking
```

## 🎯 How the Infinite Scroll Works

The infinite scroll is achieved by creating three copies of the image array and intelligently repositioning the scroll when the user approaches the edges:

1. **Triple Array**: `[images, images, images]` ensures content in all directions
2. **Smart Repositioning**: When scrolling near edges, instantly jump to equivalent position in middle section
3. **Buffer Zones**: Uses generous buffer zones to ensure jumps happen off-screen
4. **Seamless Experience**: Users never see the repositioning - it feels truly infinite

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main demo page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── InfiniteImageCarousel/   # Main carousel component
│   │   ├── InfiniteImageCarousel.tsx
│   │   ├── InfiniteImageCarousel.hooks.ts
│   │   ├── InfiniteImageCarousel.types.ts
│   │   ├── InfiniteImageCarousel.utils.ts
│   │   ├── InfiniteImageCarousel.module.css
│   │   └── InfiniteImageCarousel.test.tsx
│   ├── PWAControls/             # PWA installation controls
│   └── ServiceWorkerRegistration/ # SW registration logic
├── hooks/                       # Custom React hooks
│   └── usePWA.ts               # PWA functionality hook
├── lib/                        # Utility libraries
│   └── imageService.ts         # Image fetching service
└── pages/                      # Additional pages
```

## Usage

```tsx
import InfiniteImageCarousel from "~/components/InfiniteImageCarousel";
import { fetchImages, fetchLargeImages } from "~/lib/imageService";

const images = await fetchImages({
  count: 100,
  width: 300,
  height: 200,
});

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

### Advanced Image Fetching

#### Standard Fetching

```typescript
const images = await fetchImages({
  count: 100,
  width: 400,
  height: 300,
});
```

#### Large Dataset Fetching (1000+ images)

```typescript
const largeImageSet = await fetchLargeImages({
  count: 1000, // Total images needed
  width: 400, // Image width
  height: 300, // Image height
  limit: 50, // Images per API call
  page: 1, // Starting page
});
```

#### Array Multiplication for Performance

```typescript
// Multiply existing array to create larger datasets without API calls
const repeatedArray = Array.from({ length: 10 }, () => [...images]).flat();
// Creates 1000 images from 100 original images
```

````

## Props & Configuration

### InfiniteImageCarousel Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `images` | CarouselImage[] | ✅ | - | Array of image objects |
| `itemWidth` | number | ✅ | - | Width of each carousel item in pixels |
| `itemHeight` | number | ✅ | - | Height of each carousel item in pixels |
| `gap` | number | ❌ | 0 | Space between carousel items |

### Image Service Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `count` | number | 20 | Number of images to fetch |
| `width` | number | 400 | Image width in pixels |
| `height` | number | 300 | Image height in pixels |
| `page` | number | 1 | Starting page for pagination |
| `limit` | number | 50 | Images per API request (max: 100) |

### CarouselImage Interface

```typescript
interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}
````

## 🚦 API Rate Limiting & Performance

The image service implements intelligent rate limiting to prevent API timeouts:

- **Sequential requests** with 100ms delays between calls
- **Graceful error handling** for failed requests
- **Fallback strategies** for offline scenarios
- **Configurable request limits** (recommended: 50 per call)
- **Smart pagination** for large datasets

## 📱 PWA Features

This app is installable as a PWA with:

- **Offline support** via service workers
- **App-like experience** on mobile devices
- **Background synchronization**
- **Push notifications** (infrastructure ready)
- **Automatic updates** for cached content

Install the PWA by clicking the install button when prompted or through your browser's menu.

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

Tests cover:

- Component rendering and interactions
- Image loading and error states
- Infinite scroll logic
- PWA functionality
- API service methods

## 🎨 Styling Architecture

- **CSS Modules** for component isolation and scoped styles
- **Mobile-first** responsive design approach
- **CSS Variables** for consistent theming and easy customization
- **Performance optimized** styles with minimal reflows

## 🌟 Performance Features

- **Server-side rendering** for fast initial page loads
- **Image optimization** with Next.js Image component
- **Code splitting** and dynamic imports for smaller bundles
- **Bundle optimization** with Turbopack
- **Memory management** for large image datasets
- **Virtualization-ready** architecture

## 📈 Browser Support

- **Modern browsers** (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- **Mobile browsers** with full touch support
- **PWA installation** support across platforms
- **Service Worker** compatibility for offline features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`yarn test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code:

- Passes all tests and linting
- Follows TypeScript best practices
- Includes appropriate documentation
- Maintains backward compatibility

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[Picsum Photos](https://picsum.photos/)** for providing the beautiful image API
- **[Next.js team](https://nextjs.org/)** for the amazing React framework
- **[Unsplash](https://unsplash.com/)** photographers for the stunning imagery
- **React team** for the powerful and flexible UI library

---

<div align="center">
  <p>🎠 <strong>Built with ❤️ using modern web technologies</strong> 🎠</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#-pwa-features">PWA</a> •
    <a href="#-testing">Testing</a>
  </p>
</div>

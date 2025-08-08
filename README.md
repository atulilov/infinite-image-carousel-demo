# Infinite Image Carousel

A high-performance, scroll-based infinite image carousel built with Next.js 15, React 19, and TypeScript. Features PWA capabilities, offline support, and optimized virtualization for smooth performance with hundreds or thousands of images.

## ✨ Features

- **Infinite Scrolling**: Seamless infinite carousel with scroll-based navigation
- **Performance Optimized**: Virtualization ensures smooth scrolling with large datasets
- **PWA Support**: Install as a Progressive Web App with offline capabilities
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Image Optimization**: Built-in Next.js image optimization with WebP/AVIF support
- **TypeScript**: Fully typed with strict TypeScript configuration
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Service Worker**: Offline-first architecture with intelligent caching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn or npm package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd infinite-image-carousel
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Start the development server:

```bash
yarn dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `yarn dev`          | Start development server with Turbopack |
| `yarn build`        | Build optimized production bundle       |
| `yarn start`        | Start production server                 |
| `yarn lint`         | Run ESLint for code quality             |
| `yarn lint:fix`     | Fix ESLint issues automatically         |
| `yarn format`       | Format code with Prettier               |
| `yarn format:check` | Check code formatting                   |
| `yarn type-check`   | Run TypeScript type checking            |
| `yarn test`         | Run Jest tests                          |

## 🏗️ Project Structure

```
├── public/                     # Static assets and PWA files
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                 # Service worker
│   └── *.png                 # App icons
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx         # Main page component
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable React components
│   │   ├── InfiniteImageCarousel/  # Main carousel component
│   │   ├── PWAControls/           # PWA installation controls
│   │   └── ServiceWorkerRegistration/
│   ├── hooks/               # Custom React hooks
│   │   └── usePWA.ts       # PWA functionality hook
│   └── lib/                # Utility libraries
│       └── imageService.ts # Image fetching service
└── *.config.*             # Configuration files
```

## 🎯 Usage Examples

### Basic Carousel

```tsx
import InfiniteImageCarousel from "~/components/InfiniteImageCarousel";

const MyComponent = () => {
  const images = [
    { id: "1", url: "/image1.jpg", alt: "Image 1", width: 300, height: 200 },
    { id: "2", url: "/image2.jpg", alt: "Image 2", width: 300, height: 200 },
    // ... more images
  ];

  return (
    <InfiniteImageCarousel
      images={images}
      itemWidth={300}
      itemHeight={200}
      gap={16}
    />
  );
};
```

### Fetching Images Dynamically

```tsx
import { fetchImages } from "~/lib/imageService";

const MyPage = async () => {
  const images = await fetchImages({
    count: 50,
    width: 400,
    height: 300,
  });

  return (
    <InfiniteImageCarousel images={images} itemWidth={400} itemHeight={300} />
  );
};
```

## ⚙️ Configuration

### Environment Setup

The project uses sensible defaults and doesn't require environment variables for basic functionality. However, you can customize:

- **Image Service**: Modify `src/lib/imageService.ts` to use your preferred image API
- **PWA Settings**: Update `public/manifest.json` for your app metadata
- **Styling**: Customize CSS modules in component directories

### Next.js Configuration

Key configuration features in `next.config.ts`:

- **Image Optimization**: WebP/AVIF formats with optimized sizes
- **Security Headers**: Content security and frame protection
- **PWA Support**: Service worker and manifest integration
- **Performance**: Bundle optimization and compression

## 🛠️ Technologies Used

### Core Framework

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Strict type safety and developer experience

### Development Tools

- **Turbopack**: Ultra-fast development builds
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Jest**: Unit testing framework

### Testing & Quality

- **@testing-library/react**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers
- **Lint-staged**: Run linters on staged files

## 🔧 Development Guidelines

### Code Quality

- Strict TypeScript configuration with no `any` types
- ESLint rules for React, accessibility, and hooks
- Prettier for consistent formatting
- Pre-commit hooks ensure code quality

### Performance Best Practices

- Virtualization for large image lists
- Image optimization with Next.js Image component
- Memoization using React.memo, useCallback, useMemo
- Service worker caching for offline performance

### Component Architecture

- Functional components with hooks
- Custom hooks for reusable logic
- CSS Modules for component-scoped styling
- TypeScript interfaces for all props

## 📱 PWA Features

The app supports Progressive Web App capabilities:

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Works without internet connection
- **Background Sync**: Efficient resource caching
- **Responsive**: Optimized for all screen sizes

## 🎯 How the Infinite Scroll Works

The infinite scroll creates a seamless looping experience by:

1. **Extended Array**: Creates copies of the original images to provide content in all scroll directions
2. **Smart Repositioning**: When scrolling approaches edges, seamlessly jumps to equivalent position
3. **Buffer Zones**: Uses buffer zones to ensure repositioning happens off-screen
4. **Virtualization**: Only renders visible items for optimal performance with large datasets

## � API Reference

### fetchImages Function

The only available image fetching function:

```typescript
import { fetchImages } from "~/lib/imageService";

const images = await fetchImages({
  count: 50, // Optional: Number of images (default: 20, max: 100)
  width: 400, // Optional: Image width (default: 400)
  height: 300, // Optional: Image height (default: 300)
});
```

### InfiniteImageCarousel Props

```typescript
interface InfiniteImageCarouselProps {
  images: CarouselImage[]; // Required: Array of image objects
  itemWidth: number; // Required: Width of each item in pixels
  itemHeight: number; // Required: Height of each item in pixels
  gap?: number; // Optional: Gap between items (default: 0)
}
```

### CarouselImage Interface

```typescript
interface CarouselImage {
  id: string; // Unique identifier
  url: string; // Image URL
  alt: string; // Alt text for accessibility
  width?: number; // Optional: Image width
  height?: number; // Optional: Image height
}
```

## 🚀 Performance Tips

For large datasets, multiply smaller arrays instead of making excessive API calls:

```typescript
// Efficient way to create large datasets
const baseImages = await fetchImages({ count: 100 });
const largeDataset = Array.from({ length: 10 }, () => [...baseImages]).flat();
// Creates 1000 items from 100 API calls instead of 1000 calls
```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
yarn test              # Run all tests
yarn test --watch     # Run tests in watch mode
yarn test --coverage  # Run tests with coverage
```

Tests cover:

- Component rendering and interactions
- Image loading and error states
- Infinite scroll logic
- PWA functionality

## 📱 PWA Features

The app supports Progressive Web App capabilities:

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Works without internet connection via service worker
- **Background Sync**: Efficient resource caching
- **Responsive**: Optimized for all screen sizes

Install by clicking the install button when prompted or through your browser's menu.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
- **React team** for the powerful UI library

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

## 📄 License

This project is private and not licensed for public distribution.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

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

# Copilot Instructions for the Infinite Image Carousel Project

This document provides AI coding agents with a comprehensive guide to working on this project. It combines general web development best practices with project-specific conventions.

## 1. Project Overview & Key Files

- **Framework:** A [Next.js](https://nextjs.org) project using the App Router (`/src/app`) with Turbopack for fast development.
- **Entry Point:** The main page is `src/app/page.tsx`.
- **Global Styles:** Located in `src/app/globals.css`.
- **Component-Scoped Styles:** Use CSS Modules (e.g., `page.module.css`).
- **Components & Hooks:** New components go in `src/components/`, and custom hooks in `src/hooks/`.
- **Static Assets:** Images and icons are in the `public/` folder and referenced directly (e.g., `/next.svg`).
- **Path Aliases:** Use `~/*` for all internal imports (e.g., `import Component from '~/components/Component'`).

## 2. Developer Workflow

- **Run Development Server:** `yarn dev` (uses Turbopack for faster development builds)
- **Build for Production:** `yarn build`
- **Deployment:** The project is set up for easy deployment to Vercel.

---

## 3. Guiding Principles & Best Practices

### TypeScript: Embrace Strict Typing

- **No `any`:** Avoid using the `any` type. Define specific types and interfaces for all props, state, and data structures.
- **Strict Mode:** The `tsconfig.json` should have `strict: true` enabled to catch errors at compile time.
- **Clear Prop Interfaces:** Every component must have a well-defined `Props` interface.
  ```typescript
  // Example for a future carousel component
  interface InfiniteImageCarouselProps {
    images: { src: string; alt: string }[];
    itemWidth: number;
    itemHeight: number;
    gap?: number;
  }
  ```

### React: Modern and Performant

- **Functional Components & Hooks:** Use functional components and hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) exclusively.
- **Custom Hooks:** Encapsulate reusable or complex logic into custom hooks. For example, a `useInfiniteScroll` hook would be appropriate for the carousel logic.
- **Performance Optimization:**
  - **Memoization:** Use `React.memo`, `useCallback`, and `useMemo` to prevent unnecessary re-renders, especially in interactive components.
  - **Virtualization:** For long lists of images, use a virtualization technique to render only visible items.

### Next.js: App Router Model

- **Server & Client Components:**
  - **Server Components (Default):** Use for non-interactive content and data fetching to reduce client-side JavaScript.
  - **Client Components (`"use client"`):** Use for interactive UI that requires state and event listeners (e.g., the carousel itself).
- **Image Optimization:** Always use the built-in `next/image` component for automatic optimization, resizing, and lazy loading.

### Styling

- **CSS Modules:** Use CSS Modules (`.module.css`) for component-scoped styling to avoid class name collisions.
- **Responsive Design:** Use a mobile-first approach with media queries.
- **CSS Variables:** Use CSS variables for theming (colors, spacing) to ensure consistency.

---

## 4. Carousel-Specific Implementation Notes

- **Infinite Loop Illusion:** To create the "infinite" effect, clone a subset of images at the beginning and end. When a cloned item is reached, programmatically scroll back to the original item.
- **Scroll-Based Logic:** Use `onScroll` event listeners to track position and trigger the infinite loop logic.
- **Image Sizing:** Use `object-fit: cover` to ensure images fill their containers without distortion.

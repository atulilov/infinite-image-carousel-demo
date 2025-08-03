"use client";

import React from "react";
import InfiniteImageCarousel from "../components/InfiniteImageCarousel";
import { useImageData } from "../hooks/useImageData";
import styles from "./page.module.css";

export default function Home() {
  const { images: tinyImages, loading: loadingTiny } = useImageData({
    count: 5,
    width: 300,
    height: 200,
  });

  const { images: smallImages, loading: loadingSmall } = useImageData({
    count: 12,
    width: 300,
    height: 200,
  });

  const { images: largeImages, loading: loadingLarge } = useImageData({
    count: 50,
    width: 400,
    height: 300,
  });

  const { images: portraitImages, loading: loadingPortrait } = useImageData({
    count: 20,
    width: 250,
    height: 350,
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Infinite Image Carousel Demo</h1>
          <p>
            Scroll-based infinite carousels with different image sizes and
            aspect ratios
          </p>
        </div>

        <section className={styles.carouselSection}>
          <h2>Circular Demo (5 items)</h2>
          <p>
            Very small set to demonstrate true circular/infinite behavior -
            scroll continuously!
          </p>
          {loadingTiny ? (
            <div className={styles.loading}>Loading images...</div>
          ) : (
            <InfiniteImageCarousel
              images={tinyImages}
              itemWidth={300}
              itemHeight={200}
              gap={16}
            />
          )}
        </section>

        <section className={styles.carouselSection}>
          <h2>Landscape Images (12 items)</h2>
          <p>Small set of landscape-oriented images</p>
          {loadingSmall ? (
            <div className={styles.loading}>Loading images...</div>
          ) : (
            <InfiniteImageCarousel
              images={smallImages}
              itemWidth={300}
              itemHeight={200}
              gap={16}
            />
          )}
        </section>

        <section className={styles.carouselSection}>
          <h2>Mixed Aspect Ratios (50 items)</h2>
          <p>Larger set demonstrating performance with more images</p>
          {loadingLarge ? (
            <div className={styles.loading}>Loading images...</div>
          ) : (
            <InfiniteImageCarousel
              images={largeImages}
              itemWidth={400}
              itemHeight={300}
              gap={20}
            />
          )}
        </section>

        <section className={styles.carouselSection}>
          <h2>Portrait Images (20 items)</h2>
          <p>Portrait-oriented images with different dimensions</p>
          {loadingPortrait ? (
            <div className={styles.loading}>Loading images...</div>
          ) : (
            <InfiniteImageCarousel
              images={portraitImages}
              itemWidth={250}
              itemHeight={350}
              gap={12}
            />
          )}
        </section>

        <div className={styles.features}>
          <h2>Features</h2>
          <ul>
            <li>✅ True infinite circular scroll (seamless looping)</li>
            <li>✅ Scroll-based navigation (no buttons/arrows needed)</li>
            <li>✅ Responsive design for all screen sizes</li>
            <li>✅ Optimized for both mobile and desktop</li>
            <li>✅ Works with any number of images (5 to 1000+)</li>
            <li>✅ Supports different image sizes and aspect ratios</li>
            <li>✅ Touch-friendly with smooth drag support</li>
            <li>✅ Performance optimized with minimal DOM manipulation</li>
            <li>✅ Image loading optimization with priority loading</li>
            <li>
              ✅ No visible &quot;reset&quot; or &quot;jump&quot; - truly
              seamless
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

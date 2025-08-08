import React from "react";
import InfiniteImageCarousel from "~/components/InfiniteImageCarousel";
import PWAControls from "~/components/PWAControls";
import ServiceWorkerRegistration from "~/components/ServiceWorkerRegistration";
import { fetchImages } from "~/lib/imageService";
import styles from "./page.module.css";

export default async function Home() {
  const tinyImages = await fetchImages({
    count: 10,
    width: 300,
    height: 200,
  });

  return (
    <div className={styles.page}>
      <ServiceWorkerRegistration />
      <PWAControls />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Infinite Image Carousel Demo</h1>
          <p>
            Scroll-based infinite carousels with different image sizes and
            aspect ratios
          </p>
        </div>

        <section className={styles.carouselSection}>
          <h2>Optimized Infinite Carousel (500x3 items)</h2>
          <p>
            Performance-optimized carousel with reduced initial load and better
            scroll handling
          </p>
          <InfiniteImageCarousel
            images={tinyImages}
            itemWidth={300}
            itemHeight={200}
            gap={16}
          />
        </section>
      </main>
    </div>
  );
}

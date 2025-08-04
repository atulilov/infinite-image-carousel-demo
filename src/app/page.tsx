import React from "react";
import InfiniteImageCarousel from "../components/InfiniteImageCarousel";
import { fetchImages } from "../lib/imageService";
import styles from "./page.module.css";

export default async function Home() {
  const tinyImages = await fetchImages({
    count: 500,
    width: 300,
    height: 200,
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

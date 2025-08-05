"use client";

import styles from "./page.module.css";

export default function OfflinePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
            />
          </svg>
        </div>

        <h1 className={styles.title}>You&apos;re Offline</h1>

        <p className={styles.description}>
          It looks like you&apos;re not connected to the internet. Don&apos;t
          worry, you can still view cached images from your previous visits.
        </p>

        <div className={styles.buttonContainer}>
          <button
            onClick={() => window.location.reload()}
            className={styles.primaryButton}
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className={styles.secondaryButton}
          >
            Go Back
          </button>
        </div>

        <div className={styles.footer}>
          <p>
            Once you&apos;re back online, the app will automatically sync and
            load new content.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { usePWA } from "~/hooks/usePWA";
import styles from "./PWAControls.module.css";

export default function PWAControls() {
  const { isInstallable, isInstalled, isOnline, installApp, shareApp } =
    usePWA();

  const handleInstall = async () => {
    try {
      await installApp();
    } catch {
      // Handle error silently or show user-friendly message
      alert("Unable to install app. Please try again later.");
    }
  };

  const handleShare = async () => {
    try {
      await shareApp();
    } catch {
      // Handle error silently or show user-friendly message
      alert("Unable to share app. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Online/Offline Status */}
      <div
        className={`${styles.statusIndicator} ${isOnline ? styles.online : styles.offline}`}
      >
        <div className={styles.statusDot} />
        <span className={styles.statusText}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Install Button */}
      {isInstallable && !isInstalled && (
        <button
          onClick={handleInstall}
          className={styles.installButton}
          title="Install app"
        >
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Install App</span>
        </button>
      )}

      {/* Share Button */}
      <button
        onClick={handleShare}
        className={styles.shareButton}
        title="Share app"
      >
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
        <span>Share</span>
      </button>

      {/* Installed Indicator */}
      {isInstalled && (
        <div className={styles.installedIndicator}>
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Installed
        </div>
      )}
    </div>
  );
}

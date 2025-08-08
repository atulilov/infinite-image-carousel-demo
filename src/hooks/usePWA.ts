"use client";

import { useEffect, useState } from "react";

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  installApp: () => Promise<void>;
  shareApp: () => Promise<void>;
}

export const usePWA = (): UsePWAReturn => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(
    null
  );

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (typeof window === "undefined") {
        return;
      }

      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isIOSStandalone =
        (window.navigator as NavigatorWithStandalone).standalone === true;
      setIsInstalled(isStandalone || (isIOS && isIOSStandalone));
    };

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    checkInstalled();
    updateOnlineStatus();

    // Event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      throw new Error("Install prompt not available");
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const shareApp = async (): Promise<void> => {
    if (navigator.share) {
      await navigator.share({
        title: "Infinite Image Carousel",
        text: "Check out this infinite scrolling image carousel!",
        url: window.location.href,
      });
      return;
    }
    // Fallback to copying to clipboard
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    shareApp,
  };
};

"use client";

import { useEffect } from "react";

const registerOrGetServiceWorker = async () => {
  // Check if we already have a registration
  const existingRegistration = await navigator.serviceWorker
    .getRegistration("/")
    .catch(error => {
      console.warn("Failed to get service worker registration:", error);
      return null;
    });

  if (existingRegistration) {
    console.log("Using existing service worker");
    return existingRegistration;
  }

  // Register new service worker (this automatically checks for updates)
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });

  console.log("Registered new service worker");
  return registration;
};

const handleServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
  const newWorker = registration.installing;
  if (!newWorker) return;

  newWorker.addEventListener("statechange", () => {
    if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
      if (confirm("New version available! Refresh to update?")) {
        window.location.reload();
      }
    }
  });
};

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (!navigator.serviceWorker || process.env.NODE_ENV !== "production") {
      return;
    }

    const initializeServiceWorker = async () => {
      try {
        const registration = await registerOrGetServiceWorker();

        // Listen for updates (both automatic and manual)
        registration.addEventListener("updatefound", () => {
          handleServiceWorkerUpdate(registration);
        });
      } catch (error) {
        console.warn("Service worker failed:", error);
      }
    };

    initializeServiceWorker();
  }, []);

  return null;
};

export default ServiceWorkerRegistration;

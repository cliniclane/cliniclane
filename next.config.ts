import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "media-hosting.imagekit.io",
    ],
  },
  i18n: {
    locales: ["en", "de", "fr"], // Add more languages as needed
    defaultLocale: "en",
    localeDetection: false, // Disable automatic detection
  },
};

export default nextConfig;

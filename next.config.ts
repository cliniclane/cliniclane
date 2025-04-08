import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { i18n } = require("./next-i18next.config");

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "media-hosting.imagekit.io",
      "encrypted-tbn0.gstatic.com",
      "www.google.com",
      "img.express.pk",
      "res.cloudinary.com",
      "ucarecdn.com",
    ],
  },
  i18n,
};

export default nextConfig;

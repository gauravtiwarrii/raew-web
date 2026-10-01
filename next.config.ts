import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 414, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Unsplash (existing)
      { protocol: "https", hostname: "images.unsplash.com" },
      // Placeholder (existing)
      { protocol: "https", hostname: "via.placeholder.com" },
      // Cloudinary
      { protocol: "https", hostname: "res.cloudinary.com" },
      // imgbb
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" },
      // Imgur
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
      // Google Photos / Drive
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
      // GitHub raw content
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      // Supabase Storage
      { protocol: "https", hostname: "*.supabase.co" },
      // AWS S3
      { protocol: "https", hostname: "*.amazonaws.com" },
      // Vercel Blob
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Picsum (testing)
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      ],
    }];
  },
};

export default nextConfig;

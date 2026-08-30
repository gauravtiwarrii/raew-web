import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
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
};

export default nextConfig;

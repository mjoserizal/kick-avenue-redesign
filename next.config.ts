import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3jneea6mhvdzo.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "kickavenue-assets.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "kickavenue-assets.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d2n2h8jqzztm8j.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "images.kickavenue.com",
      },
      {
        protocol: "https",
        hostname: "tcgplayer-cdn.tcgplayer.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
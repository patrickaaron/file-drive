/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "frugal-kookabura-152.convex.cloud",
      },
      {
        hostname: "determined-chameleon-803.convex.cloud",
      },
    ],
  },
};

export default nextConfig;

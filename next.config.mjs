/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        runtime: 'edge',
      },
      // Required for Cloudflare Pages
      images: {
        unoptimized: true,
      }
};

export default nextConfig;

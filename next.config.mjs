/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["res.cloudinary.com"], // Add Cloudinary domain here to allow access to image URLs
    },
    webpack(config, { isServer }) {
      // Only exclude pdf-parse from client-side bundling if it's server-side only
      if (isServer) {
        config.externals = config.externals || [];
        config.externals.push("pdf-parse"); // Prevent bundling pdf-parse for the client-side
      }
      return config;
    },
    experimental: {
      // Optional: This ensures certain features are properly handled in the latest Next.js versions.
      scrollRestoration: true,
    },
  };
  
  export default nextConfig;
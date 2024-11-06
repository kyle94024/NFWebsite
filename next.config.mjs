/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"], // Add Cloudinary domain here to allow access to image URLs
    },
};

export default nextConfig;

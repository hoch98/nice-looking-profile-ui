/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['*.googleusercontent.com'], formats: ['image/avif', 'image/webp'], },
  output: "export",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.mapbox.com', 'openweathermap.org', 'tile.openstreetmap.org'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'maplibre-gl': 'maplibre-gl',
    };
    return config;
  },
};

module.exports = nextConfig;

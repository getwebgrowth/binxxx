/** @type {import('next').NextConfig} */
const nextConfig = {

  async redirects() {
    return [
      // Redirect old /api docs page → new keyword-rich slug
      // Note: This only applies to the browser page visit, NOT to /api/v1/... API routes
      {
        source: '/api',
        destination: '/free-bin-checker-api',
        permanent: true, // 301 — pass full SEO equity
      },
    ];
  },

  webpack(config, { dev }) {
    if (dev) {
      // Disable webpack persistent filesystem cache in dev mode.
      // Next.js 14's dev cache can serve stale CSS chunks after hot-reload changes,
      // causing the "page shows unstyled / no Tailwind" bug permanently.
      // This forces webpack to recompile CSS from scratch on every change.
      config.cache = false;
    }
    return config;
  },

};

export default nextConfig;

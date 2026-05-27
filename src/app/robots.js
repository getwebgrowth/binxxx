export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Bingbot'],
        allow: '/',
        disallow: ['/admin', '/api/'],
      }
    ],
    sitemap: 'https://ccbins.co/sitemap.xml',
  };
}

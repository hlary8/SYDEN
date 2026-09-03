const express = require('express');
const router = express.Router();

const getSiteBaseUrl = () => {
  const configured = (
    process.env.CLIENT_URL ||
    process.env.CORS_ORIGIN ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.RENDER_URL ||
    ''
  ).replace(/\/$/, '');
  return configured || 'https://deleon1.onrender.com';
};

// robots.txt
router.get('/robots.txt', (req, res) => {
  const siteBaseUrl = getSiteBaseUrl();
  const robotsTxt = `User-agent: *
Allow: /
Allow: /deleon
Allow: /deleon/lands
Allow: /deleon/about
Allow: /deleon/contact
Allow: /syden
Allow: /syden/livestock
Allow: /syden/veterinary
Allow: /syden/farm-activities
Allow: /syden/about
Allow: /syden/contact
Allow: /deefresh
Allow: /deefresh/produce
Allow: /deefresh/farmers
Allow: /deefresh/seeds
Allow: /deefresh/about
Allow: /deefresh/contact
Allow: /about
Allow: /history
Allow: /contact
Allow: /press

Disallow: /admin
Disallow: /auth
Disallow: /*/admin
Disallow: /api/

User-agent: Googlebot
Allow: /

Sitemap: ${siteBaseUrl}/sitemap.xml
`;
  res.type('text/plain').send(robotsTxt);
});

// sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = getSiteBaseUrl();
  
  const staticUrls = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/deleon', priority: '0.9', changefreq: 'weekly' },
    { url: '/deleon/lands', priority: '0.9', changefreq: 'daily' },
    { url: '/deleon/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/deleon/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/syden', priority: '0.9', changefreq: 'weekly' },
    { url: '/syden/livestock', priority: '0.9', changefreq: 'daily' },
    { url: '/syden/veterinary', priority: '0.8', changefreq: 'monthly' },
    { url: '/syden/farm-activities', priority: '0.8', changefreq: 'weekly' },
    { url: '/syden/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/syden/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/deefresh', priority: '0.9', changefreq: 'weekly' },
    { url: '/deefresh/produce', priority: '0.9', changefreq: 'daily' },
    { url: '/deefresh/farmers', priority: '0.8', changefreq: 'weekly' },
    { url: '/deefresh/seeds', priority: '0.8', changefreq: 'monthly' },
    { url: '/deefresh/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/deefresh/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/history', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/press', priority: '0.7', changefreq: 'weekly' }
  ];

  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const sitemapEntries = staticUrls.map(item => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n');

  const sitemapFooter = `</urlset>`;

  const sitemap = `${sitemapHeader}\n${sitemapEntries}\n${sitemapFooter}`;

  res.header('Content-Type', 'application/xml').send(sitemap);
});

module.exports = router;

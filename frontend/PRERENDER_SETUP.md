# Pre-rendering Setup Guide

## Overview
This frontend uses **vite-plugin-prerender** to generate static HTML files for all routes at build time. This ensures:
- ✅ Each page has unique `<title>`, `<meta description>`, and `<link rel="canonical">` tags
- ✅ Google can crawl and index each page independently
- ✅ No JavaScript execution required for initial page loads (better SEO)
- ✅ Client-side interactivity remains fully functional (admin panels, forms, etc.)

## How It Works

1. **Build Process:**
   - `npm run build` triggers Vite to build the React app
   - vite-plugin-prerender then uses a headless browser to visit each route
   - Each route's rendered HTML is saved to `dist/`

2. **Route Configuration:**
   - All prerender routes are defined in `prerender-routes.js`
   - ~26 static public routes are included (not admin routes)
   - Each route uses `useSEO()` hook to set unique meta tags

3. **SEO Meta Tags:**
   - Every page component uses the `useSEO()` hook to set:
     - `<title>` (page title)
     - `<meta name="description">` (page description)
     - `<link rel="canonical">` (canonical URL)
     - Open Graph tags for social sharing

## Installation & Setup

```bash
cd frontend

# Install dependencies (includes vite-plugin-prerender)
npm install

# Build with pre-rendering
npm run build

# Preview the prerendered output before deploying
npm run preview
```

## Build Output

After `npm run build`, the `dist/` directory contains:
```
dist/
├── index.html                          # Homepage
├── deleon/
│   ├── index.html                      # /deleon
│   ├── lands/
│   │   └── index.html                  # /deleon/lands
│   ├── about/
│   │   └── index.html                  # /deleon/about
│   └── contact/
│       └── index.html                  # /deleon/contact
├── syden/
│   ├── index.html                      # /syden
│   ├── livestock/
│   │   └── index.html                  # /syden/livestock
│   ├── veterinary/
│   │   └── index.html                  # /syden/veterinary
│   └── ... (other routes)
├── deefresh/
│   ├── index.html                      # /deefresh
│   ├── produce/
│   │   └── index.html                  # /deefresh/produce
│   └── ... (other routes)
└── assets/                             # JS, CSS, images
```

## Verifying Pre-rendering

**After deployment**, verify in Google Search Console:

1. Inspect `/syden`:
   - Should show canonical: `https://deleon1.onrender.com/syden`
   - Unique title and description for Syden page
   - Not the homepage content

2. Inspect `/deleon`:
   - Should show canonical: `https://deleon1.onrender.com/deleon`
   - Unique title and description for DeLeon page
   - Not the homepage content

3. Inspect `/deefresh`:
   - Should show canonical: `https://deleon1.onrender.com/deefresh`
   - Unique title and description for DeeFresh page
   - Not the homepage content

## Troubleshooting

**Issue:** Build fails with "Chrome not found"
- **Solution:** vite-plugin-prerender requires Chromium. Install Docker or use a deployment platform that includes it (Render, Vercel, Netlify)

**Issue:** Some routes show incorrect meta tags
- **Solution:** Verify each page component calls `useSEO()` with unique values at the top of the component

**Issue:** Admin routes showing in sitemap
- **Solution:** Admin routes are NOT prerendered (by design). Only public routes are in `prerender-routes.js`

## Adding New Routes

To add a new public route to prerendering:

1. Create the component and add it to App.jsx routes
2. Ensure it calls `useSEO()` with unique meta tags
3. Add the route path to `prerender-routes.js`
4. Rebuild: `npm run build`

Example:
```js
// In prerender-routes.js
export const preRenderRoutes = [
  '/',
  '/deleon',
  '/syden',
  '/deefresh',
  '/new-page',  // ← Add new public route here
];
```

## Notes

- **Static pages only:** Only public, content routes are prerendered
- **Admin routes:** Admin dashboards, uploads, etc. remain client-side only
- **API calls:** Pages that fetch dynamic data will show loading states during prerender
- **Client-side hydration:** React takes over on page load for interactivity

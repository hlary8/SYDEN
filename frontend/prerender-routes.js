/**
 * Prerender Routes Configuration
 * Lists all static routes to be pre-rendered at build time
 * Each page will get its own static HTML with unique meta tags from useSEO hook
 */

export const preRenderRoutes = [
  // Portal Routes
  '/',
  '/about',
  '/history',
  '/about/our-story',
  '/contact',
  '/dream-machine',
  '/houses',
  '/sustainability',
  '/coming-soon',
  '/press',
  '/global-presence',
  '/talent',

  // DeLeon Routes
  '/deleon',
  '/deleon/lands',
  '/deleon/about',
  '/deleon/contact',

  // Syden Routes
  '/syden',
  '/syden/livestock',
  '/syden/veterinary',
  '/syden/farm-activities',
  '/syden/about',
  '/syden/contact',

  // DeeFresh Routes
  '/deefresh',
  '/deefresh/produce',
  '/deefresh/farmers',
  '/deefresh/seeds',
  '/deefresh/about',
  '/deefresh/contact',
];

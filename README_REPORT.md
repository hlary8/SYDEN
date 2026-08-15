# README_REPORT.md

## Summary of changes

### 1) Homepage responsive navigation
- Updated the parent navbar so mobile renders only the DeLeon brand name with a hamburger icon and Join Us action.
- Kept the desktop layout unchanged for the full holding-company navigation.
- The full-screen mega menu remains the route for the deeper brand and company links.

### 2) Luxury hero and mobile slideshow
- Added a mobile-only hero slideshow that rotates through DeLeon, Syden and DeeFresh imagery every 5 seconds.
- Added subtle Ken Burns motion, gold dot indicators and a dark overlay for readability.
- The desktop hero layout remains intact as requested.

### 3) Cinematic Journey cards
- Converted the three company cards into a swipeable horizontal scroll-snap layout on mobile.
- Added soft edge fades and prevented vertical page shake with touch-action handling.
- Each card links to the new history page.

### 4) Video showcase and sustainability CTA
- Added the new cinematic "The DeLeon Story" section below the houses panel.
- Included a luxury placeholder video container with gold border and play icon.
- Added the standalone SUSTAINABILITY CTA at the bottom of the homepage.

### 5) Dream Machine layout refinement
- Converted the previous/next controls to left/right floating arrow buttons in the content frame.
- Removed the bottom bar to create a more editorial gallery feel.

### 6) Real history route
- Added a working /history page and /about/our-story alias.
- Added tabbed brand pages for DeLeon, Syden and DeeFresh with gallery, rich text, and lightbox modal behavior.
- Included a featured-house rotation using localStorage and a 24-hour timestamp.

### 7) Session and auth hardening
- Added automatic Authorization header injection on every request.
- Added app-load token expiry checks and redirect handling to /auth/login with a session-expired toast event.
- Extended the JWT and cookie expiry model to a 30-day lifecycle for production compatibility.
- Hardened backend CORS handling for localhost and Render-style deployments.

## File structure additions
- frontend/src/pages/portal/HistoryPage.jsx
- README_REPORT.md

## Modified files
- frontend/src/App.jsx
- frontend/src/components/common/ParentNavbar.jsx
- frontend/src/pages/portal/PortalHome.jsx
- frontend/src/pages/portal/DreamMachine.jsx
- frontend/src/index.css
- frontend/src/context/AuthContext.jsx
- backend/src/controllers/authController.js
- backend/src/utils/jwt.js
- backend/server.js

## How to test each feature

### Homepage navigation
1. Start the frontend app.
2. Open the browser in a mobile viewport.
3. Confirm the navbar reads only DeLeon + hamburger + Join Us.
4. Open the mega menu and confirm Syden and DeeFresh appear there.

### Hero slideshow
1. Open the portal homepage on mobile.
2. Confirm the hero image rotates automatically every 5 seconds.
3. Check gold dot indicators at the base of the carousel.

### Cinematic journey scroll
1. Open the homepage on mobile.
2. Swipe across the three story cards.
3. Confirm they snap properly and the page remains stable without vertical shaking.

### Video showcase and sustainability CTA
1. Scroll to the new section below the houses component.
2. Confirm the gold-bordered video placeholder appears and the subtitle is visible.
3. Confirm the SUSTAINABILITY button sits centered and navigates to /sustainability.

### Dream Machine
1. Open /dream-machine.
2. Check the previous and next arrows sit in the left and right corners of the main frame.
3. Confirm the old bottom navigation bar is removed.

### History page
1. Visit /history or /about/our-story.
2. Switch tabs between DeLeon, Syden and DeeFresh.
3. Click a gallery image to open the lightbox and close it with the × button.
4. Refresh the page and confirm the featured house rotates based on the 24-hour localStorage timestamp.

### Auth and cookies
1. Log in with a normal user account.
2. Refresh the page after a few minutes and confirm the session stays active.
3. Force an expired token and confirm the app redirects to /auth/login with the session-expired message.
4. Verify cookies are only set with secure and sameSite settings in production.

## Known considerations
- Ensure the Cloudinary environment variables are configured for any upload-heavy workflows beyond the front-end changes here.
- The project uses the existing route structure and initial brand architecture; this patch is additive and preserves current routes.
- For full production deployment on Render, ensure CORS and frontend domain variables are set to match the deployed URLs.

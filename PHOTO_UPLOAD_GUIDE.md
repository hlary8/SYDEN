# Complete Photo & Video Upload Guide for DELEON ENTERPRiSES

This guide shows **exactly where** to place/upload your custom photos and videos across every page.

---

## 📍 SECTION 1: ADMIN LOGIN & TOKEN

### Step 1: Get Admin Access Token
Login with your admin account and save the access token:

```bash
curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@syden.com","password":"AdminPass123!"}' | jq .accessToken
```

**Save the token value** — you'll use it for all uploads.

Example output:
```
"eyJhbGc..."
```

---

## 📍 SECTION 2: UPLOAD YOUR PHOTOS/VIDEOS TO CLOUDINARY (Backend)

All uploads go through Cloudinary. After uploading, you'll get a URL to use in your pages.

### Upload Single Photo or Video (Recommended)

```bash
ADMIN_TOKEN="your_token_here"

# Upload a photo
curl -X POST http://localhost:4000/api/v1/upload/image \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "image=@/path/to/your/photo.jpg"

# Response: { "url": "https://res.cloudinary.com/...", "publicId": "..." }
# Copy the URL for later use
```

**Supported formats:**
- Images: `.jpg`, `.png`, `.webp`, `.gif`
- Videos: `.mp4`, `.webm`, `.mov`

---

## 📍 SECTION 3: HOMEPAGE HERO

**File:** `frontend/src/pages/portal/PortalHome.jsx`

### Location on Page
The large hero image on the right side of the first section.

### How to Change It
Edit `.env.local` in the **frontend** folder:

```
VITE_HOLDINGS_HERO=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/your-image.jpg
```

Then restart frontend: `npm run dev`

### Environment Variables Available
```
VITE_HOLDINGS_HERO              # Main hero on portal home (currently shows land)
```

---

## 📍 SECTION 4: HOUSES PAGE

**File:** `frontend/src/pages/portal/Houses.jsx`

### 4A: Main Hero (OUR HOUSES heading)

**Location:** Top of the page behind "OUR HOUSES" title

**How to Change:**
Edit `frontend/.env.local`:

```
VITE_HERO_IMAGE_URL=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/houses-hero.jpg
```

### 4B: DeLeon House Image/Video

**Location:** Right side of DeLeon section (shows as CinematicHero component)

**How to Change:**
Edit `frontend/.env.local`:

```
VITE_DELEON_HOUSE_MEDIA=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/deleon-lands.jpg
VITE_DELEON_HOUSE_POSTER=https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_200,e_blur:200/v123/deleon-lands.jpg
```

**Poster image explanation:** The poster is a blurred version used while video/large image loads.
- Create poster URL by adding Cloudinary transforms: `?w=200,e_blur:200` to your image URL.

### 4C: Syden House Image/Video

**Location:** Right side of Syden section

**How to Change:**
Edit `frontend/.env.local`:

```
VITE_SYDEN_HOUSE_MEDIA=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/syden-livestock.jpg
VITE_SYDEN_HOUSE_POSTER=https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_200,e_blur:200/v123/syden-livestock.jpg
```

### 4D: DeeFresh House Image/Video

**Location:** Right side of DeeFresh section

**How to Change:**
Edit `frontend/.env.local`:

```
VITE_DEEFRESH_HOUSE_MEDIA=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/deefresh-harvest.jpg
VITE_DEEFRESH_HOUSE_POSTER=https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_200,e_blur:200/v123/deefresh-harvest.jpg
```

---

## 📍 SECTION 5: SUSTAINABILITY PAGE

**File:** `frontend/src/pages/portal/Sustainability.jsx`

### Location
Background image behind "SUSTAINABILITY" heading

### How to Change
Edit the direct image URL in the JSX (search for "unsplash"):

Replace:
```jsx
<section className="h-[50vh] md:h-[60vh] bg-[url('https://images.unsplash.com/...')] bg-cover bg-center relative">
```

With your Cloudinary URL:
```jsx
<section className="h-[50vh] md:h-[60vh] bg-[url('https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/sustainability.jpg')] bg-cover bg-center relative">
```

---

## 📍 SECTION 6: LISTINGS DATABASE (DeLeon Lands, Syden Livestock, DeeFresh Produce)

### 6A: Create a New Land Listing (DeLeon)

```bash
ADMIN_TOKEN="your_token_here"

curl -X POST http://localhost:4000/api/v1/lands \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laikipia Premium Parcel",
    "description": "12 acres of prime land",
    "price": 500000,
    "sizeAcres": 12,
    "location": {
      "address": "Laikipia, Kenya",
      "coordinates": [35.10, -0.20]
    },
    "images": [
      {
        "url": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/land1.jpg",
        "publicId": "deleon/land-1",
        "caption": "Aerial view"
      }
    ],
    "features": ["Fenced", "Electricity", "Water Access"],
    "status": "available"
  }'
```

**Or with multipart form data (if using file uploads):**

```bash
curl -X POST http://localhost:4000/api/v1/lands \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "title=My Land" \
  -F "price=500000" \
  -F "description=Beautiful land" \
  -F "sizeAcres=12" \
  -F "images=@/path/to/my-photo.jpg"
```

### 6B: Update Existing Land Listing

```bash
LAND_ID="5f7d8c1a9b2e3f4g5h6i"  # Get from GET /api/v1/lands

curl -X PATCH http://localhost:4000/api/v1/lands/$LAND_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "images=@/path/to/updated-photo.jpg"
```

### 6C: Create a New Livestock Entry (Syden)

```bash
curl -X POST http://localhost:4000/api/v1/livestock \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daisy - Friesian Dairy",
    "category": "cattle",
    "breed": "Holstein Friesian",
    "age": "36 months",
    "healthStatus": "Excellent",
    "description": "High-yield dairy cow",
    "careInstructions": "Pasture + balanced nutrition",
    "images": [
      {
        "url": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/livestock1.jpg",
        "publicId": "syden/cow-1"
      }
    ],
    "isFeatured": true
  }'
```

### 6D: Create a New Produce Entry (DeeFresh)

```bash
curl -X POST http://localhost:4000/api/v1/produce \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Tomatoes",
    "slug": "fresh-tomatoes",
    "category": "vegetables",
    "variety": "Beefsteak",
    "description": "Vine-ripened, locally grown",
    "pricePerUnit": 180,
    "unit": "kg",
    "availability": "in-season",
    "images": [
      {
        "url": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/tomatoes.jpg",
        "publicId": "deefresh/tomatoes-1",
        "alt": "Fresh red tomatoes"
      }
    ],
    "farmerSource": {
      "name": "Maya Farms",
      "location": "Kiambu"
    }
  }'
```

---

## 📍 SECTION 7: DREAM MACHINE PAGE (Carousel)

**File:** `frontend/src/pages/portal/DreamMachine.jsx`

### Locations
The three slides showing DeLeon, Syden, DeeFresh in carousel format.

### How to Change
Find the `slides` array and update image URLs:

```jsx
const slides = [
  {
    id: 'DELEON ENTERPRiSES',
    title: 'THE LAND LEGACY',
    subtitle: '...',
    cta: '...',
    link: '/DELEON ENTERPRiSES',
    image: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/deleon-dream.jpg'  // ← CHANGE THIS
  },
  {
    id: 'syden',
    title: 'THE PASTORAL ART',
    subtitle: '...',
    cta: '...',
    link: '/syden',
    image: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/syden-dream.jpg'  // ← CHANGE THIS
  },
  {
    id: 'deefresh',
    title: 'THE HARVEST DREAM',
    subtitle: '...',
    cta: '...',
    link: '/deefresh',
    image: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/deefresh-dream.jpg'  // ← CHANGE THIS
  }
];
```

---

## 📍 SECTION 8: OTHER PORTAL PAGES

These pages have static hero backgrounds that can be customized:

### Press Page
**File:** `frontend/src/pages/portal/Press.jsx`

Find and replace the Unsplash URL:
```jsx
// Before:
<section className="h-[60vh] bg-[url('https://images.unsplash.com/photo-1500534623283-312aade485b7')] ...

// After:
<section className="h-[60vh] bg-[url('https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/press-hero.jpg')] ...
```

### Talent Page
**File:** `frontend/src/pages/portal/Talent.jsx`

Same pattern — replace the Unsplash URL with your Cloudinary image.

### Company Pages (DeLeon, Syden, DeeFresh homes)
**Files:** 
- `frontend/src/pages/deleon/DeLeononHome.jsx` (or similar)
- `frontend/src/pages/syden/SydenHome.jsx`
- `frontend/src/pages/deefresh/DeeFreshHome.jsx`

Replace any hardcoded image URLs with Cloudinary URLs.

---

## 📍 SECTION 9: QUICK REFERENCE — WHERE TO UPLOAD

| Page/Component | Upload Endpoint | File Type | How to Link |
|---|---|---|---|
| Homepage Hero | `POST /api/v1/upload/image` | JPG, PNG, WebP | Env var: `VITE_HOLDINGS_HERO` |
| Houses Main Hero | `POST /api/v1/upload/image` | JPG, PNG, WebP | Env var: `VITE_HERO_IMAGE_URL` |
| DeLeon House Card | `POST /api/v1/upload/image` | JPG, PNG, **MP4** | Env vars: `VITE_DELEON_HOUSE_MEDIA` + `VITE_DELEON_HOUSE_POSTER` |
| Syden House Card | `POST /api/v1/upload/image` | JPG, PNG, **MP4** | Env vars: `VITE_SYDEN_HOUSE_MEDIA` + `VITE_SYDEN_HOUSE_POSTER` |
| DeeFresh House Card | `POST /api/v1/upload/image` | JPG, PNG, **MP4** | Env vars: `VITE_DEEFRESH_HOUSE_MEDIA` + `VITE_DEEFRESH_HOUSE_POSTER` |
| Land Listings | `POST /api/v1/lands` | JPG, PNG, WebP | Add to `images[]` array in API payload |
| Livestock | `POST /api/v1/livestock` | JPG, PNG, WebP | Add to `images[]` array in API payload |
| Produce | `POST /api/v1/produce` | JPG, PNG, WebP | Add to `images[]` array in API payload |
| Dream Machine Carousel | Direct JSX edit | JPG, PNG, WebP | Replace `image:` string in slides array |

---

## 📍 STEP-BY-STEP WORKFLOW EXAMPLE

### Example: Add Your DeLeon Land Photo to the Site

1. **Take a photo** of your land (land1.jpg)

2. **Upload to Cloudinary via backend:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/upload/image \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "image=@land1.jpg"
   ```
   
   **Copy the response URL:** `https://res.cloudinary.com/tmcloud/image/upload/...`

3. **Add to listings database:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/lands \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "My Land Parcel",
       "price": 500000,
       "sizeAcres": 12,
       "location": { "address": "Laikipia, Kenya" },
       "images": [
         { "url": "https://res.cloudinary.com/tmcloud/image/upload/...", "publicId": "land-1" }
       ]
     }'
   ```

4. **See it live** → Visit `/deleon/lands` → Your new listing appears!

---

## 📍 ENVIRONMENT VARIABLES (.env.local)

Create or edit `frontend/.env.local` to override any hero image:

```
# Homepage
VITE_HOLDINGS_HERO=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/holdings-hero.jpg

# Houses Page
VITE_HERO_IMAGE_URL=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/houses-hero.jpg

# DeLeon House Card (with optional poster for videos)
VITE_DELEON_HOUSE_MEDIA=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/deleon.jpg
VITE_DELEON_HOUSE_POSTER=https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_200,e_blur:200/v123/deleon-poster.jpg

# Syden House Card
VITE_SYDEN_HOUSE_MEDIA=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/syden.jpg
VITE_SYDEN_HOUSE_POSTER=https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_200,e_blur:200/v123/syden-poster.jpg

# DeeFresh House Card
VITE_DEEFRESH_HOUSE_MEDIA=https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/deefresh.jpg
VITE_DEEFRESH_HOUSE_POSTER=https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_200,e_blur:200/v123/deefresh-poster.jpg
```

**After saving `.env.local`:**
```bash
npm run dev  # Restart frontend to pick up changes
```

---

## 📍 CLOUDINARY TRANSFORMATIONS (Quick Reference)

Make URLs work harder with Cloudinary transforms:

```
# Resize image to 1920px width (auto quality)
?w=1920

# Resize + blur (for posters)
?w=200,e_blur:200

# Resize + quality compression
?w=1600,q=80

# Square crop (useful for thumbnails)
?w=400,aspect_ratio=1:1,crop=fill

# Full URL example:
https://res.cloudinary.com/tmcloud/image/upload/w=1600,q=auto/v123/my-image.jpg
```

---

## 📍 TROUBLESHOOTING

| Issue | Solution |
|---|---|
| 401 Unauthorized on upload | Make sure token is valid: `curl -X POST /api/v1/auth/login ...` |
| Image not showing after env var change | Restart frontend: `npm run dev` |
| Video won't play | Make sure file is `.mp4` and has `VITE_..._POSTER` set for thumbnail |
| Unsupported file format error | Use `.jpg`, `.png`, `.webp` for images; `.mp4`, `.webm`, `.mov` for video |
| Image takes too long to load | Use Cloudinary transforms to reduce size: `?w=1600,q=auto` |

---

## 📍 QUICK COMMANDS TO BOOKMARK

```bash
# Get admin token
curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@syden.com","password":"AdminPass123!"}' | jq .accessToken

# Upload single image
curl -X POST http://localhost:4000/api/v1/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@your-image.jpg"

# Get all lands
curl -s http://localhost:4000/api/v1/lands | jq .data

# Get all livestock
curl -s http://localhost:4000/api/v1/livestock | jq .data

# Get all produce
curl -s http://localhost:4000/api/v1/produce | jq .data
```

---

**Questions?** Check the specific page file paths and look for image URLs — they all follow the same pattern. Happy uploading! 🎉

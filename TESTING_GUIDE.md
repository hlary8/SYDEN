# 🧪 Complete Testing Guide - SYDEN Ecosystem

Verify all upload, admin, and real-time features are working.

---

## ✅ Local Testing (Before Deploying to Render)

### Setup
```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev  # or: node server.js

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev

# Backend runs on: http://localhost:4000
# Frontend runs on: http://localhost:5173
```

---

## 1️⃣ Authentication & Rate Limiting Tests

### Test 1.1: Admin Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@syden.com","password":"AdminPass123!"}' | jq .
```

**Expected**: Returns `accessToken` and user object with `role: "admin"`

### Test 1.2: 429 Rate Limit Fixed

- Make 51+ login attempts in 15 minutes
- Should get rate-limited with proper error message
- **Before fix**: Would hit 100 req limit (too low)
- **After fix**: Should allow 50 attempts, then rate limit

---

## 2️⃣ Photo Upload Tests

### Test 2.1: Direct Image Upload to Cloudinary

```bash
TOKEN="your_admin_token"

curl -X POST http://localhost:4000/api/v1/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/test-image.jpg"
```

**Expected**: Returns JSON with `url` and `publicId`

```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "uploads/..."
}
```

### Test 2.2: Livestock Upload with Photos

1. Go to `http://localhost:5173/syden/admin/livestock`
2. Login if needed
3. Click **+ Add Livestock**
4. Fill form:
   - Name: "Daisy Holstein"
   - Breed: "Friesian"
   - Age: "3 years"
   - Category: "cattle"
   - Description: "Best dairy cow"
   - Care: "Daily milking, balanced feed"
5. **Upload photos**: Click "Click to upload images" → Select 1-3 photos
6. Check images preview shows ✓ N image(s) ready
7. Click **Save Livestock**

**Expected**: 
- No errors
- Livestock appears in list immediately
- Photos display in the card

### Test 2.3: Produce Upload with Photos

1. Go to `http://localhost:5173/deefresh/admin/produce`
2. Click **+ Add Produce**
3. Fill form completely
4. Upload photos
5. Click **Save Produce**

**Expected**: Produce appears on `/deefresh/produce` page with photos

### Test 2.4: News Upload with Cover + Gallery

1. Go to `http://localhost:5173/admin/news`
2. Click **+ New Article**
3. Fill:
   - Title: "Syden Achieves Organic Certification"
   - Excerpt: "Major milestone for sustainable farming"
   - Content: "Long form article content here..."
   - Cover Image: Upload 1 photo
   - Gallery Images: Upload 2-3 additional photos
4. Category: "syden"
5. Click **Publish Article**

**Expected**: 
- Article published immediately
- Photos stored in Cloudinary
- Appears on `/press` page

### Test 2.5: Land Upload with Photos

1. Go to `http://localhost:5173/deleon/lands`  (or admin panel if exists)
2. Upload land with photos
3. Verify photos display

---

## 3️⃣ Admin Permissions Tests

### Test 3.1: Non-Admin Cannot Upload

1. Login as regular user (if have test user account)
2. Try to access `/syden/admin/livestock`
3. Should be redirected to home or show "Access Denied"

### Test 3.2: Admin-Only Features

- `/syden/admin/livestock` - Only admin sees this
- `/deefresh/admin/produce` - Only admin sees this
- `/admin/news` - Only admin sees this
- Edit/Delete buttons only for admins

---

## 4️⃣ Real-Time Updates Tests (No Page Refresh)

### Test 4.1: Real-Time Livestock Updates

**Setup**:
- Open `http://localhost:5173/syden/livestock` in **Window/Tab A** (viewer)
- Open `http://localhost:5173/syden/admin/livestock` in **Window/Tab B** (admin)

**Test**:
1. In Window A, note the livestock count
2. In Window B, click **+ Add Livestock**
3. Submit a new livestock
4. **Check Window A** - New livestock appears WITHOUT page refresh ✓

**Expected**: Real-time update within 1-2 seconds

### Test 4.2: Real-Time Edit

1. In Window B, click Edit on any livestock
2. Change a field (description, age, etc)
3. Click Save
4. **Check Window A** - Item updates immediately ✓

### Test 4.3: Real-Time Delete

1. In Window B, click Delete on an item
2. Confirm deletion
3. **Check Window A** - Item disappears immediately ✓

### Test Similar for:
- Produce (`/deefresh/produce` + `/deefresh/admin/produce`)
- News (`/press` + `/admin/news`)

---

## 5️⃣ Timestamp Tests

### Test 5.1: Check Created/Updated Timestamps

**Via API**:
```bash
curl http://localhost:4000/api/v1/livestock | jq '.data[0] | {name, createdAt, updatedAt}'
```

**Expected Output**:
```json
{
  "name": "Daisy Holland",
  "createdAt": "2024-08-13T10:00:00.000Z",
  "updatedAt": "2024-08-13T10:00:00.000Z"
}
```

### Test 5.2: Edit Item & Check updatedAt Changed

1. Create an item
2. Note the `createdAt` timestamp
3. Edit the item after waiting 5+ seconds
4. Verify `updatedAt` is newer than original time

---

## 6️⃣ CRUD Operations Tests

### Test 6.1: Create (C)

✅ Tested in Admin Upload sections above

### Test 6.2: Read (R)

```bash
# Get all livestock
curl http://localhost:4000/api/v1/livestock | jq '.data | length'

# Get single livestock
curl http://localhost:4000/api/v1/livestock/[ID] | jq .

# Get with filters
curl "http://localhost:4000/api/v1/livestock?category=cattle&featured=true" | jq .
```

### Test 6.3: Update (U)

```bash
TOKEN="your_admin_token"
LIVESTOCK_ID="5f..."

curl -X PATCH http://localhost:4000/api/v1/livestock/$LIVESTOCK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated description"}'
```

### Test 6.4: Delete (D)

```bash
TOKEN="your_admin_token"
LIVESTOCK_ID="5f..."

curl -X DELETE http://localhost:4000/api/v1/livestock/$LIVESTOCK_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7️⃣ Image Upload Error Handling

### Test 7.1: Invalid File Type

```bash
# Try uploading a .txt file
curl -X POST http://localhost:4000/api/v1/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@test.txt"
```

**Expected**: Error message about file type

### Test 7.2: File Too Large

```bash
# Should fail if file > 5MB
curl -X POST http://localhost:4000/api/v1/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@huge-file.jpg"
```

**Expected**: Error about file size limit

### Test 7.3: Missing Auth Header

```bash
curl -X POST http://localhost:4000/api/v1/upload/image \
  -F "image=@test.jpg"
```

**Expected**: 401 Unauthorized

---

## 8️⃣ Frontend Real-Time Rendering

### Test 8.1: Image Display in Photos

1. Upload livestock with photos
2. Go to livestock listing page
3. Verify images display correctly
4. Check image quality (should be compressed by Cloudinary)

### Test 8.2: Multiple Images per Item

1. Upload produce with 3 photos
2. Check produce detail page
3. All 3 photos should be visible

---

## 9️⃣ Browser Console Checks

### Test 9.1: No Upload Errors

Open DevTools Console (F12 → Console tab) while uploading:

- Should NOT see 401 errors
- Should NOT see 429 rate limit errors
- Should see "Upload error" messages if upload fails

### Test 9.2: Socket.IO Connected

In Console:
```javascript
// Should see "✓ Connected to real-time server"
```

---

## 🔟 Full Workflow Test

**Complete end-to-end test**:

1. ✅ Login as admin
2. ✅ Upload livestock with 2 photos
3. ✅ Edit livestock description
4. ✅ Upload news article with cover + 2 gallery photos
5. ✅ Publish news
6. ✅ View livestock on public page - Photos display
7. ✅ View news on press page - Photos display
8. ✅ Open public page in another tab
9. ✅ Delete a news article in admin tab
10. ✅ Public tab updates without refresh ✓

If all pass → **Ready to deploy to Render!** 🚀

---

## After Deployment to Render

Repeat all above tests using:
- `https://your-backend-xxxxx.onrender.com` instead of `localhost:4000`
- `https://your-frontend-xxxxx.onrender.com` instead of `localhost:5173`

### Key Points:
- Session persistence (stay logged in across page reload)
- Images load from Cloudinary
- Real-time updates work across browsers
- Timestamps display correctly

---

## Troubleshooting Tests

| Issue | Debug Command |
|-------|---|
| Images not uploading | Check browser Console for errors; Check backend logs  |
| 404 on land upload | Verify land route has upload middleware |
| 401 on admin pages | Check localStorage for accessToken |
| Real-time not working | Check if Socket.IO connects in Console |
| Rated limited on login | Check if authLimiter is properly configured |

---

## Performance Checks

- Upload time for 3MB image: Should be < 5 seconds
- Page load with 12 livestock items: Should be < 3 seconds
- Real-time update appears on screen: Should be < 2 seconds

All tests passing? ✨ **Your SYDEN ecosystem is production-ready!**

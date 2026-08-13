# 🚀 Render Deployment Guide for SYDEN Ecosystem

Complete guide to deploy both backend and frontend to Render.io

---

## 📋 Prerequisites

- Render.io account (www.render.com)
- GitHub repository with code pushed
- MongoDB Atlas connection string (MongoDB database)
- Cloudinary account (for image storage)
- Environment variables prepared

---

## 🔧 STEP 1: Prepare Environment Variables

### Backend Environment Variables

Create a `.env` file in your repository root or keep it as a Render environment secret:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/syden-prod

# JWT
JWT_ACCESS_SECRET=your-very-long-random-secret-key-here
JWT_REFRESH_SECRET=another-very-long-random-secret-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=https://your-frontend-domain.onrender.com

# Port
PORT=4000

# Environment
NODE_ENV=production
```

### Frontend Environment Variables

Create `frontend/.env.production` in the frontend folder:

```env
VITE_API_URL=https://your-backend-api.onrender.com
VITE_HOLDINGS_HERO=https://res.cloudinary.com/your-cloud/image/upload/v123/holdings.jpg
VITE_HERO_IMAGE_URL=https://res.cloudinary.com/your-cloud/image/upload/v123/houses.jpg
VITE_DELEON_HOUSE_MEDIA=https://res.cloudinary.com/your-cloud/image/upload/v123/deleon.jpg
VITE_DELEON_HOUSE_POSTER=https://res.cloudinary.com/your-cloud/image/upload/w_200,e_blur:200/v123/deleon.jpg
VITE_SYDEN_HOUSE_MEDIA=https://res.cloudinary.com/your-cloud/image/upload/v123/syden.jpg
VITE_SYDEN_HOUSE_POSTER=https://res.cloudinary.com/your-cloud/image/upload/w_200,e_blur:200/v123/syden.jpg
VITE_DEEFRESH_HOUSE_MEDIA=https://res.cloudinary.com/your-cloud/image/upload/v123/deefresh.jpg
VITE_DEEFRESH_HOUSE_POSTER=https://res.cloudinary.com/your-cloud/image/upload/w_200,e_blur:200/v123/deefresh.jpg
```

---

## 🌐 STEP 2: Deploy Backend to Render

### 2.1 Create a New Web Service

1. Go to **Render Dashboard** → Click **+ New** → Select **Web Service**
2. Connect your GitHub repository
3. Set the following:
   - **Name**: `syden-backend` (or your choice)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Instance Type**: Free or Paid (Free tier has limitations)

### 2.2 Add Environment Variables

1. In the Web Service settings, go to **Environment**
2. Add all backend env vars from Step 1
3. Make sure `CORS_ORIGIN` points to your frontend URL (will update after deploying frontend)

### 2.3 Deploy

Click **Deploy** and wait for the build to complete (3-5 minutes).

**Note the backend URL**: `https://your-backend-xxxxx.onrender.com`

---

## 🎨 STEP 3: Deploy Frontend to Render

### 3.1 Create a New Static Site

1. Go to **Render Dashboard** → Click **+ New** → Select **Static Site**
2. Connect your GitHub repository
3. Set the following:
   - **Name**: `syden-frontend` (or your choice)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

### 3.2 Add Environment Variables

Before deploying, update your `.env.production`:

```env
VITE_API_URL=https://your-backend-xxxxx.onrender.com
```

Add this to Render environment variables as well.

### 3.3 Deploy

Click **Deploy** and wait for build completion.

**Note the frontend URL**: `https://your-frontend-xxxxx.onrender.com`

---

## 🔄 STEP 4: Update Backend CORS

Now that you have the frontend URL, update your backend:

1. Go to **Backend Web Service** → **Environment**
2. Update `CORS_ORIGIN` to your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-xxxxx.onrender.com
   ```
3. Click **Save** → Render will redeploy automatically

---

## 🧪 STEP 5: Test Deployment

### 5.1 Test Backend Health

```bash
curl https://your-backend-xxxxx.onrender.com/api/v1/health
```

Expected response:
```json
{"status": "ok", "timestamp": "2024-08-13T..."}
```

### 5.2 Test Admin Login

```bash
curl -X POST https://your-backend-xxxxx.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@syden.com","password":"AdminPass123!"}' | jq .
```

Should return an accessToken.

### 5.3 Test Image Upload

```bash
TOKEN="your_token_from_login"

curl -X POST https://your-backend-xxxxx.onrender.com/api/v1/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/test-image.jpg"
```

Should return Cloudinary URL.

### 5.4 Test Frontend

Visit `https://your-frontend-xxxxx.onrender.com` in your browser. You should see the home page loading without errors.

---

## 📸 STEP 6: Upload Content

### 6.1 Access Admin Panels

- **Admin News**: `https://your-frontend-xxxxx.onrender.com/admin/news`
- **Livestock Upload** (Syden): `https://your-frontend-xxxxx.onrender.com/syden/admin/livestock`
- **Produce Upload** (DeeFresh): `https://your-frontend-xxxxx.onrender.com/deefresh/admin/produce`

### 6.2 Upload Livestock

1. Go to Syden Livestock Admin
2. Click **+ Add Livestock**
3. Fill in:
   - Animal Name
   - Breed
   - Age
   - Category
   - Description
   - Care Instructions
   - Upload photos (click "Click to upload images")
4. Click **Save Livestock**

The livestock will appear on `/syden/livestock` page with photos immediately.

### 6.3 Upload Produce

1. Go to DeeFresh Produce Admin
2. Click **+ Add Produce**
3. Fill in all fields
4. Upload photos
5. Click **Save Produce**

The produce will appear on `/deefresh/produce` page.

### 6.4 Upload News

1. Go to Admin News Dashboard
2. Click **+ New Article**
3. Fill in:
   - Article Title
   - Excerpt
   - Content
   - Upload cover image
   - Select category
   - Publish
4. Click **Publish Article**

The news will appear on `/press` and internal news feeds.

---

## 🛠️ Troubleshooting Render Deployment

### Issue: Backend Returns 503 Service Unavailable

**Solution**: 
- Check MongoDB connection string
- Verify Cloudinary credentials
- Check Render logs: Service → Logs tab
- Make sure `NODE_ENV=production`

### Issue: Frontend Returns Build Error

**Solution**:
- Check build logs in Render
- Ensure `VITE_API_URL` points to correct backend
- Make sure all dependencies are in `frontend/package.json`
- Delete `frontend/node_modules` and `frontend/.env.local`, rebuild

### Issue: Images Not Uploading

**Solution**:
- Verify Cloudinary credentials in backend env vars
- Check backend logs for upload errors
- Ensure file size < 5MB
- Try uploading via direct curl test first

### Issue: 401 Errors on API Calls

**Solution**:
- Verify `JWT_ACCESS_SECRET` is set
- Check that token is being sent correctly
- Ensure `CORS_ORIGIN` includes your frontend domain (with https://)

### Issue: CORS Errors in Browser

**Solution**:
```javascript
// Update axios config in frontend
axios.defaults.baseURL = 'https://your-backend-xxxxx.onrender.com';
axios.defaults.withCredentials = true;
```

---

## 📊 Monitor Your Deployment

### View Logs

1. Go to Your Service → **Logs** tab
2. Filter by:
   - Server errors (500s)
   - Request logs
   - Upload events

### Performance

- Check **Metrics** tab for CPU/memory usage
- If Free tier is overloaded, upgrade to Starter ($7/month)

### Automated Deploys

Render automatically redeploys when you push to GitHub.

---

## 🎯 Admin Features Checklist

✅ **Photo Upload Works On**:
- Livestock page (Syden) - Full CRUD with images
- Produce page (DeeFresh) - Full CRUD with images  
- Land listings (DELEON) - Full CRUD with images
- News articles - Cover + gallery images

✅ **Admin Permissions**:
- Only admins can upload/edit/delete
- Users are redirected if not admin
- Real-time updates without page refresh

✅ **Timestamps**:
- All content has `createdAt` and `updatedAt`
- News shows publication date
- Livestock/Produce show creation date

✅ **Content Features**:
- Search & filter on all listing pages
- Categories on livestock & produce
- Tags & featured articles on news
- View counts on news articles

---

## 🔐 Security Notes

1. **Never commit `.env` to GitHub** - Use Render environment variables
2. **Rotate JWT secrets** periodically
3. **Use strong Cloudinary API key** - Consider restricting to specific operations
4. **Enable HTTPS** - Render provides free SSL
5. **Monitor rate limiting** - Adjust in [rateLimiters.js](backend/src/middleware/rateLimiters.js) if needed

---

## 📞 Support

For issues with:
- **Render**: Visit [render.com/docs](https://render.com/docs)
- **MongoDB Atlas**: Follow [MongoDB docs](https://docs.atlas.mongodb.com)
- **Cloudinary**: Check [Cloudinary docs](https://cloudinary.com/documentation)

---

## Next Steps After Deployment

1. ✅ Test all admin upload features
2. ✅ Upload sample livestock/produce/land
3. ✅ Post sample news article
4. ✅ Test user login and viewing content
5. ✅ Check real-time updates work
6. ✅ Monitor logs for any errors

**Deployment complete! Your SYDEN ecosystem is now live.** 🎉

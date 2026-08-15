# DELEON ENTERPRiSES Ecosystem - Deployment Guide

## Overview

This guide covers deploying the DELEON ENTERPRiSES Ecosystem across multiple platforms:
- **Backend**: Railway or Render (Node.js)
- **Frontend**: Vercel or Netlify (React)
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary

## Prerequisites

- GitHub account (for CI/CD)
- MongoDB Atlas account
- Cloudinary account (credentials in `.env`)
- Railway/Render account (for backend)
- Vercel account (for frontend)

## Backend Deployment (Railway)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/DELEON ENTERPRiSES-ecosystem.git
git push -u origin main
```

### Step 2: Connect Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure environment variables:
   - `MONGO_URI`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `REDIS_URL` (Railway provides)
   - `NODE_ENV=production`
   - `COOKIE_SECURE=true`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`

### Step 3: Deploy

Railway auto-deploys on push to main.

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

Go to [vercel.com](https://vercel.com) and sign in with GitHub.

### Step 2: Import Project

1. Click "New Project"
2. Import your GitHub repository
3. Set root directory: `frontend`
4. Configure environment:
   - `VITE_API_URL=https://your-backend-railway.railway.app`

### Step 3: Deploy

Click "Deploy" — Vercel auto-deploys on push to main.

## Environment Variables Reference

### Backend (.env)

```
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/DELEON ENTERPRiSES
JWT_ACCESS_SECRET=<random_64_char_string>
JWT_REFRESH_SECRET=<different_random_64_char_string>
CLOUDINARY_CLOUD_NAME=<your_cloud>
CLOUDINARY_API_KEY=<your_key>
CLOUDINARY_API_SECRET=<your_secret>
REDIS_URL=redis://:<password>@<host>:<port>
COOKIE_SECURE=true
CORS_ORIGIN=https://your-frontend.vercel.app
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)

```
VITE_API_URL=https://your-backend-railway.railway.app
VITE_CLIENT_URL=https://your-frontend.vercel.app
```

## Database Setup (MongoDB Atlas)

1. Create a cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Whitelist your IP address
3. Create a database user
4. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/DELEON ENTERPRiSES`
5. Add to `.env` as `MONGO_URI`

## Running Locally with Production Env

```bash
cp .env.example .env
# Fill with your actual credentials
npm install
npm run dev
```

## Monitoring & Logs

- **Railway**: View logs on dashboard
- **Vercel**: View build/deployment logs on dashboard
- **MongoDB**: Monitor in Atlas dashboard
- **Errors**: Set up Sentry for error tracking (future enhancement)

## Troubleshooting

**Backend won't start**: Check MONGO_URI and Redis connection string
**Frontend can't reach API**: Verify CORS_ORIGIN in backend .env
**Cloudinary uploads fail**: Verify API credentials and cloud name
**MongoDB connection timeout**: Whitelist Railway/Vercel IPs in Atlas

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push:
1. Runs backend tests (Jest)
2. Builds frontend (Vite)
3. Uploads artifacts
4. Deploys on merge to main (manual trigger for now)

To enable auto-deploy:
1. Go to GitHub Actions
2. Add Railway/Vercel API tokens as secrets
3. Update workflow with deployment steps

## Scaling

- Use MongoDB Atlas sharding for large datasets
- Deploy multiple backend instances with load balancer
- Enable Cloudinary CDN for image caching
- Use Redis for session/cache scaling

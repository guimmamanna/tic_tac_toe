# Deployment Guide - Epic Tic-Tac-Toe

Complete guide for deploying to production.

## Overview

The application consists of two parts:
1. **Frontend** (Next.js) - Deploy to Vercel
2. **Backend** (Node.js + Socket.io) - Deploy to Render/Railway/Heroku

## Prerequisites

- GitHub account
- Vercel account (free)
- Render/Railway account (free tier available)
- PostgreSQL database (Supabase/Railway/Neon - free tier)
- Redis instance (Upstash - free tier)

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Environment Variables

Add these in Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_APP_NAME=Epic Tic-Tac-Toe
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Step 4: Deploy

Click "Deploy" and wait for build to complete!

---

## Part 2: Deploy Backend to Render

### Step 1: Create New Web Service

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: epic-tictactoe-backend
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 2: Environment Variables

Add in Render dashboard:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://user:password@host:6379
JWT_SECRET=your-super-secret-jwt-key-CHANGE-THIS
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Step 3: Deploy

Click "Create Web Service" and wait for deployment!

---

## Part 3: Set Up Database (PostgreSQL)

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Run migrations:
   ```bash
   cd backend
   DATABASE_URL="your-connection-string" npx prisma migrate deploy
   ```

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Provision PostgreSQL
3. Copy connection string
4. Use in backend environment variables

### Option C: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Use in backend environment variables

---

## Part 4: Set Up Redis (Upstash)

1. Go to [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection string (format: `redis://...`)
4. Add to backend environment variables

---

## Part 5: Update Frontend with Backend URL

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL`
5. Redeploy

---

## Part 6: Verify Deployment

### Backend Health Check

Visit: `https://your-backend.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "version": "1.0.0",
  "uptime": 123
}
```

### Frontend Check

Visit: `https://your-app.vercel.app`

Test:
1. Click "VS AI" - Should work immediately
2. Try multiplayer in 2 browser windows
3. Check leaderboard
4. Try profile page

---

## Troubleshooting

### Backend Won't Start

**Issue**: Port binding errors
**Solution**: Make sure `PORT` env var is set and backend listens on it

**Issue**: Database connection failed
**Solution**: Check `DATABASE_URL` format and run migrations

### Frontend Can't Connect to Backend

**Issue**: CORS errors
**Solution**: Add your Vercel URL to `CORS_ORIGINS` in backend

**Issue**: Socket.io won't connect
**Solution**: Verify `NEXT_PUBLIC_SOCKET_URL` is correct

### Database Issues

**Issue**: Tables don't exist
**Solution**: Run Prisma migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

---

## Cost Estimation

All services have generous free tiers:

- **Vercel**: Free for hobby projects
- **Render**: Free tier with 750 hours/month
- **Supabase**: 500MB database free
- **Upstash**: 10K commands/day free
- **Total**: $0/month for moderate usage!

---

## Performance Optimization

### Frontend

1. Enable Image Optimization in Vercel
2. Use Vercel Analytics
3. Enable caching headers

### Backend

1. Use Redis for session storage
2. Enable response compression
3. Add rate limiting

### Database

1. Create indexes on frequently queried fields
2. Use connection pooling
3. Monitor query performance

---

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable HTTPS only (automatic on Vercel/Render)
- [ ] Set secure `CORS_ORIGINS`
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on backend
- [ ] Sanitize user inputs
- [ ] Use prepared statements (Prisma does this)

---

## Monitoring

### Vercel Analytics

Enable in project settings for:
- Page views
- Performance metrics
- Error tracking

### Render Metrics

Available in dashboard:
- CPU usage
- Memory usage
- Request logs
- Health checks

---

## Updating the App

### Deploy New Changes

```bash
git add -A
git commit -m "Update feature X"
git push origin main
```

Both Vercel and Render will auto-deploy!

### Database Migrations

```bash
cd backend
npx prisma migrate deploy
```

Run this after deploying schema changes.

---

## Rollback

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Render

1. Go to your service
2. Click "Manual Deploy"
3. Select previous commit

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `epictic.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated!

---

## Support

- **Frontend Issues**: Check Vercel logs
- **Backend Issues**: Check Render logs
- **Database Issues**: Check Supabase/Railway logs
- **General**: Open GitHub issue

---

**Your app is now live!** 🚀

Share your link: `https://your-app.vercel.app`

# 🚀 Deploy Your Game NOW!

Follow these simple steps to deploy in 10 minutes.

## ✅ Prerequisites
- GitHub repo is ready ✓
- All code is committed ✓
- You're ready to deploy ✓

---

## 🎯 Step 1: Deploy Frontend to Vercel (3 minutes)

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com/new
   - Sign in with GitHub (if not already)

2. **Import Repository**
   - Click "Import Git Repository"
   - Select `guimmamanna/tic_tac_toe`
   - Click "Import"

3. **Configure Project**
   ```
   Project Name: epic-tictactoe (or your choice)
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend
   ```

4. **Environment Variables** (Click "Environment Variables")
   Add these (we'll update backend URL later):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   NEXT_PUBLIC_APP_NAME=Epic Tic-Tac-Toe
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

5. **Click "Deploy"**
   - Wait 1-2 minutes
   - You'll get a URL like: `https://epic-tictactoe-abc123.vercel.app`
   - **Save this URL!** ✅

---

### Option B: Via Vercel CLI (Advanced)

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

---

## 🎯 Step 2: Deploy Backend to Railway (5 minutes)

### Via Railway Dashboard (Easiest)

1. **Go to Railway**
   - Visit: https://railway.app/new
   - Sign in with GitHub

2. **Create New Project**
   - Click "Deploy from GitHub repo"
   - Select `guimmamanna/tic_tac_toe`
   - Click "Deploy Now"

3. **Configure Settings**
   - Click on the service
   - Go to "Settings"
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

4. **Add PostgreSQL Database**
   - In project, click "+ New"
   - Select "Database"
   - Choose "Add PostgreSQL"
   - Railway auto-connects it! ✅

5. **Add Redis Database**
   - Click "+ New" again
   - Select "Database"
   - Choose "Add Redis"
   - Railway auto-connects it! ✅

6. **Add Environment Variables**
   Go to your backend service → Variables → Add:
   ```
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_SECRET=your-secret-key-change-this-to-random-string
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
   Replace `your-frontend.vercel.app` with your Vercel URL from Step 1!

7. **Generate Domain**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - You'll get: `https://your-backend.up.railway.app`
   - **Save this URL!** ✅

8. **Deploy**
   - Railway auto-deploys!
   - Wait 2-3 minutes
   - Check logs for "Server running" ✅

---

## 🎯 Step 3: Connect Frontend to Backend (1 minute)

1. **Update Vercel Environment Variables**
   - Go to Vercel Dashboard
   - Your Project → Settings → Environment Variables
   - Update these variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
     NEXT_PUBLIC_SOCKET_URL=https://your-backend.up.railway.app
     ```
     (Use your Railway URL from Step 2!)

2. **Redeploy Frontend**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Wait 1 minute

---

## 🎯 Step 4: Run Database Migrations (1 minute)

### Option A: Via Railway Dashboard

1. Go to your backend service in Railway
2. Click "Settings" → "Deploy"
3. Update Build Command to:
   ```bash
   npm install && npx prisma migrate deploy && npx prisma generate && npm run build
   ```
4. Click "Save"
5. Redeploy

### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy
railway run npx prisma generate
```

---

## ✅ Step 5: Test Your Deployment

### Backend Health Check
Visit: `https://your-backend.up.railway.app/health`

Should show:
```json
{
  "status": "ok",
  "timestamp": "...",
  "version": "1.0.0"
}
```

### Frontend Test
Visit: `https://your-frontend.vercel.app`

Test:
- ✅ Homepage loads
- ✅ Click "VS AI" - game works!
- ✅ Click "Leaderboard" - shows rankings
- ✅ Click "Profile" - shows stats

### Multiplayer Test
1. Open your Vercel URL in normal browser
2. Open same URL in incognito window
3. Create private room in window 1
4. Join with code in window 2
5. Play together! ✅

---

## 🎉 You're Live!

### Your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.up.railway.app`
- **Database**: Railway PostgreSQL ✅
- **Redis**: Railway Redis ✅

### Share Your Game:
```
🎮 Play Epic Tic-Tac-Toe!
https://your-app.vercel.app

Features:
✨ Online Multiplayer
🤖 AI Opponents
🎨 8 Beautiful Themes
🏆 Global Leaderboard
💬 In-Game Chat
```

---

## 🐛 Troubleshooting

### Frontend Shows Errors
- Check Vercel deployment logs
- Verify environment variables are set
- Make sure backend URL is correct

### Backend Won't Start
- Check Railway logs
- Verify database is connected
- Check environment variables

### Database Errors
- Make sure migrations ran
- Check DATABASE_URL is set
- Verify PostgreSQL is running

### Socket.io Not Working
- Verify CORS_ORIGINS includes your Vercel URL
- Check NEXT_PUBLIC_SOCKET_URL is correct
- Look at browser console for errors

---

## 💰 Cost
**$0/month** - Everything is free!
- Vercel: Free
- Railway: $5 credit/month (auto-renews)
- Good for 10,000+ players!

---

## 🎯 Next Steps

After deployment:

1. **Add Custom Domain** (Optional)
   - Vercel: Settings → Domains
   - Railway: Settings → Custom Domain

2. **Monitor Usage**
   - Vercel: Analytics dashboard
   - Railway: Metrics tab

3. **Add Real Sounds**
   - Replace MP3s in `frontend/public/sounds/`
   - Redeploy

4. **Invite Players!**
   - Share your link
   - Get feedback
   - Iterate!

---

## 📞 Need Help?

If you get stuck:
1. Check Railway/Vercel logs
2. Verify all environment variables
3. Test backend health endpoint
4. Open GitHub issue

**Your game is ready to launch!** 🚀

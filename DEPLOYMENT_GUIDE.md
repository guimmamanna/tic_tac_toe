# Deployment Guide - Epic Tic-Tac-Toe

## Backend Deployment to Railway

### Step 1: Deploy to Railway
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your `tic_tac_toe` repository
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 2: Add Environment Variables
In Railway dashboard, go to your service > Variables tab and add:

```
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://frontend-pi-two-68.vercel.app,https://frontend-r1lwum9av-christian-manna-guimmas-projects.vercel.app
JWT_SECRET=epic-tictactoe-jwt-secret-2024-production-secure-key
SESSION_SECRET=epic-tictactoe-session-secret-2024-production
```

Or import from `railway-env-vars.txt`

### Step 3: Get Your Railway URL
After deployment, Railway will provide a URL like:
- `https://your-app.up.railway.app`

Copy this URL - you'll need it for the frontend.

---

## Frontend Configuration on Vercel

### Update Environment Variables
1. Go to https://vercel.com/christian-manna-guimmas-projects/frontend/settings/environment-variables
2. Add these variables (replace YOUR_RAILWAY_APP_URL with your actual Railway URL):

```
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-app.up.railway.app
```

3. Click "Save"
4. Go to Deployments tab
5. Click "Redeploy" on the latest deployment

---

## Testing

After both deployments:
1. Visit your Vercel frontend URL: https://frontend-pi-two-68.vercel.app
2. Click "Play vs AI"
3. Try to make a move - the AI should respond (this confirms backend is working)
4. Check browser console for any errors

---

## Troubleshooting

### AI doesn't work
- Check Railway logs for errors
- Verify CORS_ORIGINS includes your Vercel URL
- Check frontend environment variables are set correctly

### CORS errors
- Make sure CORS_ORIGINS in Railway includes your Vercel domain
- Redeploy backend after changing environment variables

### 404 errors
- Verify the Railway app is running (check Railway dashboard)
- Confirm the API URL in Vercel matches your Railway URL

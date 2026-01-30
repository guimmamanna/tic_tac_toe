# Railway Backend Configuration

## IMPORTANT: Configure in Railway Dashboard

Go to your Railway project → Settings → and set:

### Root Directory
```
backend
```

### Build Command
```
npm install && npx prisma generate && npm run build
```

### Start Command  
```
npm start
```

### Environment Variables
```
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://frontend-pi-two-68.vercel.app
JWT_SECRET=epic-tictactoe-jwt-secret-2024
SESSION_SECRET=epic-tictactoe-session-2024
```

## Why This Fix Works
- Setting Root Directory to `backend` makes Railway treat backend as the project root
- This avoids workspace/monorepo confusion
- Build outputs go to the correct location (`backend/dist`)
- Start command can find `dist/server.js` correctly

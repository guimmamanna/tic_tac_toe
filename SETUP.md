# Epic Tic-Tac-Toe - Setup Guide

Complete setup instructions for running the game locally.

## Prerequisites

Make sure you have the following installed:
- **Node.js** 20+ and npm
- **Docker** and Docker Compose
- **Git**

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd tic_tac_toe
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Start Database Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

Verify the services are running:
```bash
docker-compose ps
```

You should see both `tictactoe-postgres` and `tictactoe-redis` running.

### 4. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

The default `.env` settings should work for local development. If you need to customize:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/tictactoe"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
CORS_ORIGINS="http://localhost:3000"
```

### 5. Set Up Database

Run Prisma migrations to create the database schema:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

(Optional) Open Prisma Studio to view the database:
```bash
npx prisma studio
```

### 6. Configure Frontend Environment (Optional)

```bash
cd frontend
cp .env.local.example .env.local
```

The defaults should work, but you can customize if needed.

### 7. Start the Application

You have two options:

**Option A: Run both servers from root (Recommended)**
```bash
# From the root directory
npm run dev
```

This will start both the backend and frontend concurrently.

**Option B: Run servers separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 8. Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Verification

1. Open http://localhost:3000 in your browser
2. You should see the Epic Tic-Tac-Toe landing page
3. Click "VS AI" to test the game
4. Make some moves and verify the game works

## Testing Multiplayer

To test multiplayer functionality:

1. Open http://localhost:3000 in one browser window
2. Open http://localhost:3000 in an incognito/private window
3. In one window, click "Private Room"
4. Copy the room code
5. In the other window, enter the room code
6. Play the game between the two windows!

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart the database
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

### Port Already in Use

If port 3000 or 3001 is already in use:

**Change Backend Port:**
Edit `backend/.env`:
```env
PORT=3002
```

**Change Frontend Port:**
```bash
cd frontend
PORT=3001 npm run dev
```

### Socket.io Connection Issues

1. Check that the backend is running
2. Verify CORS settings in `backend/.env`
3. Check browser console for errors
4. Make sure firewall isn't blocking the ports

### Node Modules Issues

If you encounter dependency issues:

```bash
# Clean install
cd frontend
rm -rf node_modules package-lock.json
npm install

cd ../backend
rm -rf node_modules package-lock.json
npm install
```

## Development Commands

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build TypeScript
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

### Database
```bash
# Start databases
docker-compose up -d

# Stop databases
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v  # Warning: This deletes all data!
docker-compose up -d
cd backend && npx prisma migrate dev --name init
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](DEPLOYMENT.md) (coming soon).

## Need Help?

- Check the [README.md](README.md) for general information
- Open an issue on GitHub
- Check existing issues for solutions

## Next Steps

- Add real sound effects to `frontend/public/sounds/`
- Customize themes in `frontend/tailwind.config.ts`
- Add your own avatar images to `frontend/public/avatars/`
- Implement user authentication for persistent profiles
- Deploy to production!

---

Happy gaming! 🎮✨

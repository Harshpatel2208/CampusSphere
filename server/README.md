# LDRP ERP Server

Backend server for the LDRP ERP project using Express.js and PostgreSQL with Prisma ORM.

---

## Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

---

## Initial Setup (First Time Only)

### 1. Install PostgreSQL

Download and install from: https://www.postgresql.org/download/

**Remember the password you set for the `postgres` user!**

### 2. Create Database

Open PowerShell and run:

```bash
psql -U postgres

# In the PostgreSQL prompt:
CREATE DATABASE campus_sphere;
\q
```

### 3. Setup Project

```bash
# Navigate to server directory
cd server

# One-time setup (installs dependencies and runs migrations)
npm run setup
```

---

## Environment Configuration

1. **Copy the template:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your local values:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/campus_sphere"
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=http://localhost:5173
   ```

   Replace `YOUR_PASSWORD` with the PostgreSQL password from step 1.

3. **Important:** Never commit `.env` file (already in `.gitignore`)

---

## Development

### Start Development Server

```bash
npm run dev
```

Or with automatic database migrations:

```bash
npm run dev:with-migration
```

Server will run on `http://localhost:5000`

---

## Database Management

### View Data in GUI

```bash
npm run prisma:studio
```

Opens Prisma Studio at `http://localhost:5555`

### Auto-generate Prisma Client

```bash
npm run prisma:generate
```

### Apply Migrations

```bash
# Deploy existing migrations
npm run prisma:deploy

# Create new migration (for schema changes)
npm run prisma:migrate
```

### Reset Database (⚠️ Deletes all data)

```bash
npm run prisma:reset
```

---

## Project Structure

```
server/
├── controllers/       # Request handlers
├── routes/           # API routes
├── middleware/       # Express middleware
├── lib/              # Utility functions
├── prisma/
│   └── schema.prisma # Database schema
├── package.json      # Dependencies and scripts
├── .env.example      # Environment template
├── .env              # Local environment (not committed)
└── index.js          # Server entry point
```

---

## Git Workflow for Team

### Before Starting Work

```bash
# Update your branch
git pull origin student

# Create feature branch
git checkout -b feature/your-feature-name
```

### When Done with Feature

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add student registration endpoint"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### If Schema Changes are Made

1. **Receive changes:**
   ```bash
   git pull origin develop
   ```

2. **Apply migrations:**
   ```bash
   npm run prisma:deploy
   ```

3. **Verify schema:**
   ```bash
   npm run prisma:studio
   ```

---

## Common Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run setup` | First-time setup |
| `npm run prisma:studio` | Open database GUI |
| `npm run prisma:migrate` | Create new migration |
| `npm run prisma:deploy` | Apply migrations |
| `npm run prisma:reset` | Reset database (⚠️ deletes data) |

---

## Troubleshooting

### Cannot connect to PostgreSQL

```bash
# Check PostgreSQL service is running
# Windows: Services app → PostgreSQL → ensure it's running
# Or restart the service
```

### Connection String Error

Verify your `.env` file has correct:
- Username: `postgres`
- Password: (your PostgreSQL password)
- Database: `campus_sphere`
- Port: `5432`

### Migration Failed

```bash
# Try resetting (backup data first!)
npm run prisma:reset

# Or manually check database
psql -U postgres -d campus_sphere
\dt  -- list tables
```

### Port 5000 Already in Use

Change `PORT` in `.env` to another number (e.g., `5001`)

---

## Database Schema

Current schema is defined in `prisma/schema.prisma`

To view all tables and relationships:
```bash
npm run prisma:studio
```

---

## API Documentation

See individual route files in `routes/` directory for endpoint documentation.

---

## Contributing

1. Create feature branch from `student` branch
2. Make changes
3. Test locally with `npm run dev`
4. Commit with clear messages
5. Push and create Pull Request
6. Wait for code review

---

## Important Notes

- **Never commit `.env` file** (it's in `.gitignore`)
- **Never push to main branch directly** (use Pull Requests)
- **Always run migrations** after pulling new code: `npm run prisma:deploy`
- **Backup important data** before running `npm run prisma:reset`

---

## Support

For issues or questions, contact the team or create an issue on GitHub.

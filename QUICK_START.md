# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Initialize Database
```bash
npm run db:generate
npm run db:push
```

### Step 4: Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## 📱 Key Pages

- **Home**: `/` - Main landing page
- **Virtual Tour**: `/tour` - 360° interactive tour
- **Events**: `/events` - Book visits and RSVP
- **Learning**: `/learning` - Interactive modules
- **Leaderboard**: `/leaderboard` - Rankings & badges
- **Vendors**: `/vendors` - Expert profiles
- **Spotlight**: `/spotlight` - Student projects
- **Admin**: `/admin` - Management dashboard
- **Login**: `/login` - Authentication

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts` - modify `primary` and `accent` colors

### Add Content
- Replace mock data in components with API calls
- Add real images to `/public` folder
- Update database with seed data

### Deploy
1. Push to GitHub
2. Deploy to Vercel/Netlify
3. Update `DATABASE_URL` to PostgreSQL
4. Set environment variables
5. Deploy! 🚀

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Feature overview
- **README.md** - Project information

## 🆘 Need Help?

Check the console for errors, ensure all dependencies are installed, and verify your `.env` file is configured correctly.

Happy coding! 🎉


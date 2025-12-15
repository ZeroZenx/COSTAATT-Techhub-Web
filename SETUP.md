# Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `DATABASE_URL`: SQLite database path (default: `file:./dev.db`)
   - `NEXTAUTH_SECRET`: Generate a random secret (use `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your app URL (default: `http://localhost:3000`)

3. **Set Up Database**
   ```bash
   npm run db:generate
   npm run db:push
   ```
   
   This creates the database schema using Prisma.

4. **Seed Initial Data (Optional)**
   
   You can use Prisma Studio to add initial data:
   ```bash
   npm run db:studio
   ```
   
   Or create a seed script to populate initial badges, events, etc.

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /api          - API routes
  /admin        - Admin dashboard
  /events       - Events page
  /learning     - Learning modules
  /leaderboard  - Leaderboard page
  /login        - Authentication
  /spotlight    - Student showcase
  /tour         - Virtual tour
  /vendors      - Vendor highlights

/components
  /admin        - Admin components
  /auth         - Authentication components
  /events       - Event-related components
  /home         - Homepage components
  /layout       - Layout components (Navbar, Footer)
  /learning     - Learning module components
  /leaderboard  - Leaderboard components
  /spotlight    - Student spotlight components
  /tour         - Virtual tour components
  /vendors      - Vendor components

/lib
  prisma.ts     - Prisma client instance
  utils.ts      - Utility functions

/prisma
  schema.prisma - Database schema
```

## Key Features

### 1. Interactive Virtual Tour
- 360° 3D environment using Three.js
- Clickable hotspots on devices
- Interactive device information modals

### 2. Event Booking System
- Calendar view and list view
- Booking form with validation
- RSVP functionality
- Admin approval workflow

### 3. Gamification
- Badge system
- Points and leaderboards
- Individual and school rankings
- Challenge tracking

### 4. Learning Modules
- Interactive quizzes with instant feedback
- AR/VR demo placeholders
- IoT simulation interface
- Progress tracking

### 5. Student Spotlight
- Project submissions
- Featured projects
- Social sharing
- Filtering by project type

### 6. Admin Dashboard
- Booking management
- Event creation
- Submission approval
- User management
- Badge creation

## Database Management

### View Database
```bash
npm run db:studio
```

### Reset Database
```bash
rm prisma/dev.db
npm run db:push
```

### Update Schema
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Update `DATABASE_URL` to use PostgreSQL (Vercel Postgres)
5. Deploy!

### Environment Variables for Production

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Strong random secret
- `NEXTAUTH_URL`: Your production URL

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme.

### Content
- Update mock data in components with real API calls
- Connect to your backend API
- Add real images and videos

### Features
- Implement full authentication with NextAuth
- Add file upload for project submissions
- Integrate real AR/VR experiences
- Connect to IoT devices for live data

## Troubleshooting

### Database Issues
- Ensure Prisma client is generated: `npm run db:generate`
- Check database file permissions
- Verify DATABASE_URL in .env

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

### 3D Tour Not Loading
- Ensure Three.js dependencies are installed
- Check browser console for errors
- Verify WebGL support in browser

## Next Steps

1. **Authentication**: Implement full NextAuth.js setup with providers
2. **File Uploads**: Add file upload functionality for submissions
3. **Real AR/VR**: Integrate actual AR/VR experiences
4. **Notifications**: Add email/push notifications
5. **Analytics**: Integrate analytics tracking
6. **SEO**: Add meta tags and SEO optimization

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.


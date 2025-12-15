# COSTAATT Tech Hub - Interactive Web Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An interactive web platform for COSTAATT Tech Hub featuring virtual tours, event bookings, gamification, and student project showcases.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment)

</div>

## Features

- 🎮 **Interactive Virtual Tour** - 360° walkthrough with clickable hotspots
- 📅 **Event Calendar & Booking** - Weekly time slots and RSVP system
- 🏆 **Gamification** - Badges, leaderboards, and challenges
- 🎓 **Interactive Learning** - AR/VR demos, quizzes, and IoT simulations
- 👥 **Vendor Highlights** - Profiles and event feeds
- 💡 **User Collaboration** - Project submissions, polls, and student spotlight
- 🔧 **Admin Dashboard** - Content management system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **3D/VR**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **Database**: Prisma with SQLite (easily upgradeable to PostgreSQL)
- **Authentication**: NextAuth.js

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app              - Next.js app router pages
/components       - React components
/lib              - Utilities and configurations
/prisma           - Database schema
/public           - Static assets
```

## Admin Access

Default admin credentials can be set up through the database. Use Prisma Studio to manage:
```bash
npm run db:studio
```

## Deployment

The app is ready for deployment on Vercel, Netlify, or any Node.js hosting platform. For production:
- Update `DATABASE_URL` to use PostgreSQL
- Set secure `NEXTAUTH_SECRET`
- Configure environment variables

## License

MIT


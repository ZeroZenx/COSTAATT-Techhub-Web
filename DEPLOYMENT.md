# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Update database to PostgreSQL (recommended for production)
- [ ] Configure domain and SSL certificate
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure CDN for static assets
- [ ] Set up backup strategy for database
- [ ] Configure email service for notifications
- [ ] Review and update security settings
- [ ] Test production build locally
- [ ] Set up monitoring and analytics

## Environment Variables

Copy `.env.example` to `.env.production` and configure:

```bash
# Required
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secure-random-secret-minimum-32-chars"

# Recommended
APP_NAME="COSTAATT Tech Hub"
APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

## Database Setup

### Option 1: PostgreSQL (Recommended)

1. Create PostgreSQL database
2. Update `DATABASE_URL` in `.env`
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Option 2: SQLite (Development Only)

SQLite works for development but is NOT recommended for production due to:
- Limited concurrency
- No network access
- File locking issues

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel dashboard

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

3. **Database Setup**
   - Use Vercel Postgres (recommended)
   - Or connect external PostgreSQL database

4. **Deploy**
   - Vercel auto-deploys on push to main branch
   - Or manually trigger deployment

5. **Post-Deployment**
   ```bash
   # Run migrations
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Add in Netlify dashboard
   - Set `NODE_ENV=production`

3. **Database**
   - Use Netlify Postgres or external PostgreSQL

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -t costatechhub .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://..." \
     -e NEXTAUTH_URL="https://..." \
     -e NEXTAUTH_SECRET="..." \
     costatechhub
   ```

### Self-Hosted (VPS/Server)

1. **Install Dependencies**
   ```bash
   npm ci --production
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "costatechhub" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Post-Deployment Steps

### 1. Database Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

### 2. Seed Initial Data (Optional)
Create a seed script in `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add seed data here
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run with:
```bash
npx prisma db seed
```

### 3. Verify Deployment
- [ ] Check homepage loads
- [ ] Test API endpoints
- [ ] Verify database connections
- [ ] Test authentication flow
- [ ] Check error handling
- [ ] Verify images load correctly
- [ ] Test mobile responsiveness

### 4. Monitoring Setup

#### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### Analytics (Google Analytics)
Add to `app/layout.tsx`:
```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
  strategy="afterInteractive"
/>
```

### 5. Performance Optimization

- Enable CDN for static assets
- Configure image optimization
- Set up caching headers
- Enable compression
- Use edge functions for API routes

## Security Checklist

- [ ] All environment variables set
- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection enabled
- [ ] CSRF protection (NextAuth handles this)
- [ ] Regular dependency updates

## Backup Strategy

### Database Backups
```bash
# PostgreSQL backup
pg_dump -h localhost -U user -d dbname > backup.sql

# Restore
psql -h localhost -U user -d dbname < backup.sql
```

### Automated Backups
Set up cron job or use managed database service with automatic backups.

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is accessible
- Verify SSL settings if required

### Performance Issues
- Enable Next.js caching
- Use CDN for static assets
- Optimize images
- Enable database connection pooling

## Support

For issues or questions:
- Check logs: `pm2 logs` or hosting platform logs
- Review error tracking (Sentry)
- Check database connection status
- Verify environment variables


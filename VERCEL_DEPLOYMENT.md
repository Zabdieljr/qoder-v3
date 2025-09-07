# Vercel Deployment Guide for Qoder V3 Frontend

## Overview

This guide provides step-by-step instructions for deploying the Qoder V3 React frontend to Vercel. The project is configured as a monorepo with the frontend located in the `/frontend` directory.

## Environment Variables Configuration

### Required Environment Variables

The following environment variables must be configured in Vercel for the application to function properly:

#### Supabase Configuration
- **VITE_SUPABASE_URL**: Your Supabase project URL
  - Example: `https://kmcuhicgzwdcalnyywgo.supabase.co`
  - Location: Supabase Dashboard → Settings → API → Project URL

- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous/public key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Location: Supabase Dashboard → Settings → API → Project API keys → anon public

#### Application Configuration
- **VITE_APP_NAME**: Application display name
  - Default: `Qoder V3 - User Management`
  
- **VITE_APP_VERSION**: Application version
  - Default: `1.0.0`

### Setting Environment Variables in Vercel

#### Method 1: Vercel Dashboard
1. Log in to your Vercel dashboard
2. Navigate to your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: Variable value
   - **Environments**: Select all environments (Production, Preview, Development)
5. Click **Save**

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_APP_NAME
vercel env add VITE_APP_VERSION
```

### Environment Variable Security

- **Never commit** `.env.local` files to version control
- Use Vercel's encrypted environment variable storage
- Rotate Supabase keys regularly
- Use different keys for different environments (production, staging, development)

## Deployment Configuration

### Automatic Deployment Setup

1. **Connect Repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `qoder-v3` repository

2. **Configure Build Settings**:
   The `vercel.json` file in the repository root automatically configures:
   - **Root Directory**: Frontend source location
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Manual Configuration (Alternative)

If you prefer to configure settings manually in Vercel dashboard:

1. **Project Settings** → **General**:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Build Process Verification

### Local Build Test (if Node.js available)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run build
npm run build

# Verify dist directory is created
ls -la dist/
```

### Vercel Build Logs
Monitor the build process in Vercel:
1. Go to your project dashboard
2. Click on the latest deployment
3. View **Function Logs** and **Build Logs**
4. Look for any errors or warnings

## Post-Deployment Verification

### Functionality Checklist
- [ ] Application loads successfully
- [ ] All routes work correctly (/, /login, /register, /dashboard, etc.)
- [ ] Supabase authentication functions
- [ ] User registration and login work
- [ ] API calls to Supabase succeed
- [ ] Responsive design displays correctly on mobile/desktop

### Testing Commands
```bash
# Test main application
curl -I https://your-app.vercel.app

# Test routing (should return 200 for SPA)
curl -I https://your-app.vercel.app/login
curl -I https://your-app.vercel.app/dashboard

# Test static assets
curl -I https://your-app.vercel.app/assets/index.css
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Command 'vite' not found"
**Cause**: Vercel is not running commands in the frontend directory
**Solution**: Verify `vercel.json` configuration or set Root Directory to `frontend`

#### Issue: Environment variables not loading
**Cause**: Variables not properly configured or missing `VITE_` prefix
**Solution**: 
- Verify all variables start with `VITE_`
- Check Vercel environment variable settings
- Redeploy after adding variables

#### Issue: Routing not working (404 on refresh)
**Cause**: Missing SPA routing configuration
**Solution**: Verify `vercel.json` includes the catch-all route configuration

#### Issue: Supabase connection errors
**Cause**: Incorrect environment variables or CORS issues
**Solution**: 
- Verify Supabase URL and key are correct
- Check Supabase project settings for allowed origins
- Add your Vercel domain to Supabase allowed origins

#### Issue: Build fails with dependency errors
**Cause**: Package.json dependency issues or Node.js version mismatch
**Solution**: 
- Verify package.json is valid
- Check for conflicting dependencies
- Set Node.js version in Vercel settings

### Debug Information Collection
When reporting issues, collect:
1. Vercel build logs (complete)
2. Browser console errors
3. Network tab showing failed requests
4. Environment variable configuration (without revealing values)

## Performance Optimization

### Caching Configuration
The `vercel.json` includes optimized caching headers:
- Static assets: 1 year cache
- HTML files: No cache (for updates)

### Bundle Optimization
The Vite configuration includes:
- Source maps for debugging
- Asset optimization
- Code splitting (automatic)

### Monitoring
- Monitor Vercel Analytics
- Check Core Web Vitals
- Review function invocation logs

## Maintenance

### Regular Tasks
- Monitor Vercel deployment notifications
- Update dependencies monthly
- Review and rotate environment variables quarterly
- Test deployment process with staging environment

### Rollback Process
If deployment issues occur:
1. Go to Vercel project dashboard
2. Find previous successful deployment
3. Click "Promote to Production"
4. Investigate and fix issues before next deployment

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
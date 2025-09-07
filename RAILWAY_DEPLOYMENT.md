# Railway Deployment Guide

## 🚂 Deploying Qoder V3 Backend to Railway

### Prerequisites
- Railway account: [railway.app](https://railway.app)
- GitHub repository with your code
- Git CLI installed

### Step 1: Prepare Your Repository

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Add Railway deployment configuration"
   git push origin main
   ```

### Step 2: Deploy via Railway Dashboard

1. **Login to Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `qoder-v3` repository

3. **Configure the Service**:
   - Railway will auto-detect it as a Java/Maven project
   - No additional configuration needed initially

### Step 3: Add PostgreSQL Database

1. **Add Database Service**:
   - In your Railway project dashboard
   - Click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create database and inject environment variables

2. **Database Variables** (automatically provided):
   - `DATABASE_URL` - Full connection string
   - `PGHOST` - Database host
   - `PGPORT` - Database port (default: 5432)
   - `PGDATABASE` - Database name
   - `PGUSER` - Database username
   - `PGPASSWORD` - Database password

### Step 4: Configure Environment Variables

In your Railway service settings, add these environment variables:

```bash
# Profile
SPRING_PROFILES_ACTIVE=production

# Server Configuration
PORT=8080

# Memory Configuration
JAVA_TOOL_OPTIONS=-Xmx512m -XX:+UseContainerSupport
```

### Step 5: Domain Configuration

1. **Custom Domain** (optional):
   - Go to Service Settings → Networking
   - Add your custom domain
   - Configure DNS records as shown

2. **Railway Subdomain**:
   - Railway provides a free subdomain
   - Format: `https://your-service-name.up.railway.app`

### Step 6: Monitoring and Logs

1. **View Logs**:
   - Railway dashboard → Your service → Logs tab
   - Real-time application logs

2. **Metrics**:
   - Monitor CPU, Memory, and Network usage
   - Available in the Metrics tab

### Step 7: Database Migrations

- Flyway migrations will run automatically on startup
- Monitor logs to ensure migrations complete successfully
- Database schema will be created based on your migration files

### Step 8: Testing the Deployment

1. **Health Check**:
   ```bash
   curl https://your-app.up.railway.app/health
   ```

2. **API Root**:
   ```bash
   curl https://your-app.up.railway.app/
   ```

3. **Actuator Health**:
   ```bash
   curl https://your-app.up.railway.app/actuator/health
   ```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Java version (should be 21)
   - Verify Maven dependencies
   - Check Railway build logs

2. **Database Connection Issues**:
   - Ensure PostgreSQL service is running
   - Check environment variables are set
   - Verify network connectivity

3. **Memory Issues**:
   - Adjust `JAVA_TOOL_OPTIONS`
   - Monitor memory usage in Railway dashboard
   - Consider upgrading plan if needed

### Useful Commands

```bash
# Check Railway CLI status
railway status

# View logs
railway logs

# Connect to database
railway connect postgresql
```

## 🚀 Production Considerations

1. **Environment Separation**:
   - Use separate Railway projects for staging/production
   - Different database instances
   - Environment-specific configurations

2. **Monitoring**:
   - Set up uptime monitoring
   - Configure alerting for failures
   - Monitor database performance

3. **Backup Strategy**:
   - Railway provides automatic PostgreSQL backups
   - Consider additional backup strategies for critical data

4. **Security**:
   - Use environment variables for secrets
   - Enable HTTPS (automatic on Railway)
   - Configure CORS for frontend integration

## 📊 Expected Results

After successful deployment:
- ✅ Backend API accessible via Railway URL
- ✅ Database migrations completed
- ✅ Health checks passing
- ✅ Actuator endpoints available
- ✅ Ready for frontend integration

## 🔗 Integration with Frontend

Update your frontend's Supabase configuration or API endpoints to point to:
```
https://your-backend.up.railway.app
```

Your Spring Boot backend is now deployed and ready to serve your React frontend!
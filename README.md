# Qoder V3 - Full Stack Application

A modern full-stack application built with Spring Boot backend and React frontend, deployed on Railway and Vercel respectively.

## 🚀 Live Deployments

- **Frontend (Vercel)**: https://qoder-v3.vercel.app
- **Backend (Railway)**: https://qoder-v3-production.up.railway.app
- **Database**: Supabase PostgreSQL

## 🏗️ Architecture

### Backend (Spring Boot 3.5.5)
- **Language**: Java 17 (LTS for cloud compatibility)
- **Framework**: Spring Boot with Spring Data JPA
- **Database**: PostgreSQL via Supabase
- **Authentication**: OAuth2 Client
- **Documentation**: Spring REST Docs + Asciidoctor
- **AI Integration**: Spring AI with PostgresML embeddings
- **Deployment**: Railway with Nixpacks

### Frontend (React 18)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## 📁 Project Structure

```
qoder-v3/
├── src/                           # Spring Boot backend
│   ├── main/
│   │   ├── java/com/qoderv3/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/      # Flyway migrations
│   └── test/
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── router/
│   ├── package.json
│   └── vercel.json
├── nixpacks.toml                  # Railway deployment config
├── pom.xml                        # Maven configuration
└── README.md
```

## 🛠️ Local Development Setup

### Prerequisites
- Java 17+ (JDK)
- Node.js 18+
- PostgreSQL (or use Supabase)

### Backend Setup
```bash
# Build and run Spring Boot application
./mvnw clean package
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ☁️ Deployment Configuration

### Railway (Backend)
- **Build System**: Nixpacks with Java 17
- **Environment**: Production Spring profile
- **Database**: Connected to Supabase PostgreSQL
- **Configuration Files**:
  - `nixpacks.toml` - Deployment configuration
  - `.java-version` - Java version specification
  - `system.properties` - Runtime configuration

### Vercel (Frontend)
- **Framework**: React with Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## 🗄️ Database Setup

### Supabase Configuration
1. Create a new Supabase project
2. Run the database setup script in SQL Editor:

```sql
-- See simple-supabase-setup.sql for complete script
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255),
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Enable Row Level Security and create appropriate policies

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres
spring.datasource.username=postgres.your-project-id
spring.datasource.password=your-database-password
```

## 🚦 Initial Setup

1. **Access the application** at your Vercel deployment URL
2. **Complete admin setup** - The app will guide you through creating an initial admin user
3. **Admin Credentials** (as configured):
   - Username: `zarenas`
   - Email: `zabdieljr2@gmail.com`
   - Password: `eliasz91$`

## 🧪 Testing & Debugging

### Database Connection Test
The application includes a built-in database connection test component that verifies:
- Supabase connection status
- Authentication state
- Table access permissions

### Common Issues & Solutions

1. **Blank Page on Frontend**
   - Check environment variables in Vercel
   - Verify Supabase configuration

2. **Admin Setup Fails**
   - Ensure database tables are created
   - Check RLS policies in Supabase

3. **Backend Build Fails**
   - Verify Java version configuration
   - Check Maven compiler plugin settings

## 📋 Development Commands

### Backend
```bash
./mvnw clean package          # Build
./mvnw spring-boot:run        # Run locally
./mvnw test                   # Run tests
```

### Frontend
```bash
npm run dev                   # Development server
npm run build                 # Production build
npm run preview               # Preview build
npm test                      # Run tests
```

## 🔄 CI/CD Pipeline

- **Frontend**: Automatic deployment on push to main branch via Vercel GitHub integration
- **Backend**: Automatic deployment on push to main branch via Railway GitHub integration
- **Database**: Manual migration execution in Supabase SQL Editor

## 📚 Documentation

- **API Documentation**: Available at backend URL + `/docs` (when configured)
- **Database Schema**: See `src/main/resources/db/migration/` for Flyway migrations
- **Component Documentation**: JSDoc comments in React components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is a demo application for learning and development purposes.

---

**Note**: This is a demo application showcasing modern full-stack development practices with cloud deployment strategies.
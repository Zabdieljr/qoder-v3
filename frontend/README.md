# Qoder V3 Frontend - React User Management System

A modern, secure, and scalable React-based user management system with Supabase authentication integration.

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login with email/password
  - Protected routes with role-based access control
  - Secure session handling with JWT tokens
  - Password reset functionality

- **User Management**
  - Complete user CRUD operations (admin only)
  - User profile management
  - Status management (Active, Inactive, Suspended, Pending)
  - Real-time user statistics dashboard

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Modern component library with Lucide React icons
  - Dark/light theme support
  - Mobile-first design approach

- **Security**
  - Row Level Security (RLS) with Supabase
  - Input validation with Yup schema validation
  - XSS and CSRF protection
  - Secure password requirements

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with hooks and functional components
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router v6 with protected routes
- **Forms**: React Hook Form with Yup validation
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase project with authentication enabled

### Setup

1. **Clone and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Application will be available at `http://localhost:3000`

## 🗄 Database Setup

The application expects the following Supabase database schema:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    github_username VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);
```

## 👤 Initial Admin User

The system automatically creates an initial admin user with the following credentials:

- **Username**: zarenas
- **Email**: zabdieljr2@gmail.com
- **Password**: eliasz91$

⚠️ **Important**: Change these credentials immediately after first login in production!

## 🏗 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── RouteGuards.jsx
│   │   └── Sidebar.jsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── UserManagement.jsx
│   │   └── UserProfile.jsx
│   ├── router/            # Routing configuration
│   │   └── index.jsx
│   ├── services/          # API services
│   │   ├── auth.js
│   │   └── supabase.js
│   ├── test/              # Test utilities
│   │   ├── setup.js
│   │   └── utils.jsx
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **Components**: Unit tests for all major components
- **Authentication**: Auth context and service tests
- **Route Guards**: Access control testing
- **Forms**: Validation and submission testing

## 📱 Usage

### For Regular Users

1. **Registration**: Create account with email verification
2. **Login**: Secure authentication with remember me option
3. **Profile Management**: Update personal information and password
4. **Dashboard**: View personalized user dashboard

### For Admin Users

1. **User Management**: Full CRUD operations on user accounts
2. **User Status Control**: Activate, suspend, or deactivate users
3. **System Statistics**: View user metrics and activity
4. **Bulk Operations**: Manage multiple users efficiently

## 🔧 Configuration

### Tailwind CSS

Custom theme configuration in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        // ... more shades
      }
    }
  }
}
```

### Vite Configuration

Optimized build settings in `vite.config.js`:

- Path aliases for cleaner imports
- Development server configuration
- Build optimization settings

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel**: Zero-config deployment with automatic HTTPS
- **Netlify**: JAMstack deployment with form handling
- **AWS S3 + CloudFront**: Enterprise-grade CDN deployment
- **Docker**: Containerized deployment

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_NAME=Qoder V3 - User Management
VITE_APP_VERSION=1.0.0
```

## 🔒 Security Best Practices

- Environment variables for sensitive configuration
- Input validation and sanitization
- Protected routes with proper authentication
- Row Level Security (RLS) policies
- Password strength requirements
- XSS and CSRF protection

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed
2. **Authentication Issues**: Verify Supabase configuration
3. **Route Problems**: Check React Router setup
4. **Styling Issues**: Confirm Tailwind CSS compilation

### Debug Mode

Enable development mode for detailed error messages:

```bash
NODE_ENV=development npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Email: support@qoder.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

Built with ❤️ using React and Supabase
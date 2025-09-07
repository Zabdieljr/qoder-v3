# Qoder V3 Frontend - Development Guide

## 🚀 Quick Start

### Prerequisites Check
Before starting development, ensure you have:
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Supabase project configured
- [ ] Environment variables set up

### Initial Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

### Development Server
The application will be available at: `http://localhost:3000`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🏗 Architecture Overview

### Component Hierarchy
```
App
├── ErrorBoundary
├── AuthProvider
└── RouterProvider
    ├── PublicRoute (Login, Register)
    └── PrivateRoute (Dashboard, Profile)
        └── AdminRoute (User Management)
```

### State Management
- **Authentication**: Context API with Supabase Auth
- **UI State**: Local component state and props
- **Form State**: React Hook Form
- **Server State**: Direct Supabase calls (future: React Query)

### Routing Structure
```
/ → /login (redirect)
/login → LoginPage (public)
/register → RegisterPage (public)
/dashboard → Dashboard Layout (private)
  ├── / → DashboardHome
  ├── /profile → UserProfile
  ├── /settings → Settings
  └── /users → UserManagement (admin only)
```

## 🔐 Authentication Flow

### User Registration
1. User fills registration form
2. Form validation with Yup schema
3. Supabase auth.signUp() call
4. User profile created in database
5. Email verification sent
6. Success message displayed

### User Login
1. User enters credentials
2. Form validation
3. Supabase auth.signInWithPassword()
4. User profile fetched from database
5. Auth context updated
6. Redirect to dashboard

### Session Management
- Automatic token refresh
- Persistent sessions across browser restarts
- Secure logout with token cleanup

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```css
/* Form Elements */
.form-input     /* Standard input styling */
.btn-primary    /* Primary button */
.btn-secondary  /* Secondary button */
.card          /* Card container */
.form-error    /* Error message text */

/* Layout */
.sidebar       /* Sidebar navigation */
.main-content  /* Main content area */
```

### Color Palette
- **Primary**: Blue shades (primary-50 to primary-900)
- **Gray**: Neutral grays (gray-50 to gray-900)
- **Success**: Green shades for positive actions
- **Error**: Red shades for errors and warnings

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar collapses on mobile

## 🧪 Testing Strategy

### Unit Tests
- Component rendering and props
- User interactions and events
- Form validation logic
- Auth context behavior

### Integration Tests
- Authentication flows
- Route protection
- Form submissions
- API integrations

### Test Files Location
```
src/
├── components/__tests__/
├── contexts/__tests__/
├── pages/__tests__/
└── test/utils.jsx  # Test utilities
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test LoginForm.test.jsx

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Environment Configuration

### Development (.env.local)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_NAME=Qoder V3 - User Management
VITE_APP_VERSION=1.0.0
```

### Production
- Use production Supabase project
- Enable RLS policies
- Configure proper CORS settings
- Set up monitoring and error tracking

## 🚨 Common Issues & Solutions

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

### Authentication Issues
- Verify Supabase URL and keys
- Check network requests in DevTools
- Ensure RLS policies are configured
- Validate email/password requirements

### Styling Problems
- Check Tailwind compilation
- Verify import statements
- Clear browser cache
- Check for CSS conflicts

### Route Issues
- Check route definitions in router/index.jsx
- Verify component imports
- Check authentication state
- Validate route protection logic

## 📝 Code Standards

### Component Structure
```jsx
import React, { useState, useEffect } from 'react'
import { SomeIcon } from 'lucide-react'

export const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // Side effects
  }, [dependencies])

  const handleSomething = () => {
    // Event handlers
  }

  return (
    <div className="component-styles">
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```

### File Naming
- Components: PascalCase (UserProfile.jsx)
- Utilities: camelCase (authService.js)
- Pages: PascalCase (LoginPage.jsx)
- Tests: ComponentName.test.jsx

### Import Order
1. React and React-related imports
2. Third-party libraries
3. Internal components and utilities
4. Relative imports

## 🔄 Development Workflow

### Feature Development
1. Create feature branch
2. Implement component/feature
3. Write unit tests
4. Update documentation
5. Test in browser
6. Submit pull request

### Code Review Checklist
- [ ] Component follows established patterns
- [ ] Tests cover main functionality
- [ ] Accessibility considerations
- [ ] Performance implications
- [ ] Security considerations
- [ ] Error handling

## 🚀 Performance Optimization

### Bundle Size
- Use dynamic imports for large components
- Optimize images and assets
- Remove unused dependencies
- Use production builds

### Runtime Performance
- Minimize re-renders with React.memo
- Use useCallback for event handlers
- Optimize heavy computations with useMemo
- Implement proper error boundaries

### Loading States
- Show loading spinners for async operations
- Implement skeleton screens
- Use optimistic updates where appropriate
- Cache frequently accessed data

## 🔒 Security Checklist

### Input Validation
- [ ] All forms use validation schemas
- [ ] User input is sanitized
- [ ] File uploads are secured
- [ ] SQL injection prevention

### Authentication
- [ ] Secure password requirements
- [ ] Session timeout handling
- [ ] Proper logout implementation
- [ ] Route protection

### Data Protection
- [ ] Environment variables for secrets
- [ ] HTTPS in production
- [ ] Proper CORS configuration
- [ ] RLS policies enabled

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Guide](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

Happy coding! 🎉
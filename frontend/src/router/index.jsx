import React from 'react'
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom'
import { PublicRoute, PrivateRoute, AdminRoute } from '../components/RouteGuards.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

// Import pages
import { LoginPage } from '../pages/LoginPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import Dashboard, { DashboardHome } from '../pages/Dashboard.jsx'
import { UserProfile } from '../pages/UserProfile.jsx'
import { UserManagement } from '../pages/UserManagement.jsx'

// Settings placeholder component
const Settings = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
      <p className="text-gray-600">Settings page is coming soon...</p>
    </div>
  </div>
)

// 404 Not Found component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-6xl text-gray-400 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/dashboard"
        className="btn-primary inline-flex items-center"
      >
        Go to Dashboard
      </a>
    </div>
  </div>
)

// Reset Password placeholder component
const ResetPassword = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-6">
          Password reset functionality is coming soon.
        </p>
        <a
          href="/login"
          className="btn-primary inline-flex items-center"
        >
          Back to Login
        </a>
      </div>
    </div>
  </div>
)

// Login page wrapper with auth check
const LoginPageWrapper = () => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  
  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }
  
  return <LoginPage />
}

// Register page wrapper with auth check
const RegisterPageWrapper = () => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  
  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }
  
  return <RegisterPage />
}

// Dashboard wrapper with auth check
const DashboardWrapper = () => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  
  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }
  
  return <Dashboard />
}

// Admin route wrapper with auth and admin check
const AdminRouteWrapper = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  
  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }
  
  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 text-red-500 mb-4">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }
  
  return children
}

// Create the router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <LoginPageWrapper />
  },
  {
    path: '/register',
    element: <RegisterPageWrapper />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/dashboard',
    element: <DashboardWrapper />,
    children: [
      {
        index: true,
        element: <DashboardHome />
      },
      {
        path: 'profile',
        element: <UserProfile />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  },
  {
    path: '/dashboard/users',
    element: (
      <AdminRouteWrapper>
        <Dashboard>
          <UserManagement />
        </Dashboard>
      </AdminRouteWrapper>
    )
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router
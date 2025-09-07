import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
)

// Public Route - Redirects authenticated users to dashboard
export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    // Get the redirect path from state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}

// Private Route - Requires authentication
export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    // Save the attempted location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

// Admin Route - Requires admin privileges
export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

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
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    )
  }

  return <Outlet />
}

// Route Guard HOC for individual components
export const withAuthGuard = (Component, requireAdmin = false) => {
  return function AuthGuardedComponent(props) {
    const { isAuthenticated, isAdmin, loading } = useAuth()
    const location = useLocation()

    if (loading) {
      return <LoadingSpinner />
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requireAdmin && !isAdmin) {
      return <Navigate to="/dashboard" replace />
    }

    return <Component {...props} />
  }
}

export default {
  PublicRoute,
  PrivateRoute,
  AdminRoute,
  withAuthGuard
}
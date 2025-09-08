import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicRoute, PrivateRoute, AdminRoute } from '../components/RouteGuards.jsx'

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

// Simple test component to verify routing works
const TestComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 App is Working!</h1>
      <p className="text-gray-600 mb-6">Routing is functional. Let's test login:</p>
      <a
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
      >
        Go to Login
      </a>
    </div>
  </div>
)

// Create the router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <TestComponent /> // Temporarily show test component
  },
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginPage />
      }
    ]
  },
  {
    path: '/register',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <RegisterPage />
      }
    ]
  },
  {
    path: '/reset-password',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <ResetPassword />
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: <Dashboard />,
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
      }
    ]
  },
  {
    path: '/dashboard/users',
    element: <AdminRoute />,
    children: [
      {
        path: '',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <UserManagement />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router
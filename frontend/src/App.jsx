import React, { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { router } from './router/index.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AdminSetup, { useAdminSetup } from './components/AdminSetup.jsx'
import DatabaseConnectionTest from './components/DatabaseConnectionTest.jsx'
import './index.css'

// Temporary flag to show database test
const SHOW_DB_TEST = true

// App wrapper that handles admin setup
const AppWrapper = () => {
  const { setupNeeded, checking } = useAdminSetup()
  const [setupComplete, setSetupComplete] = useState(false)

  // Show loading while checking setup status
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    )
  }

  // Show admin setup if needed and not completed
  if (setupNeeded && !setupComplete) {
    return (
      <AdminSetup onComplete={() => setSetupComplete(true)} />
    )
  }

  // Normal app flow
  return <RouterProvider router={router} />
}

function App() {
  // Show database connection test if enabled
  if (SHOW_DB_TEST) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <DatabaseConnectionTest />
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
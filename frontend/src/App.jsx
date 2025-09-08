import React, { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { router } from './router/index.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AdminSetup, { useAdminSetup } from './components/AdminSetup.jsx'
import DatabaseConnectionTest from './components/DatabaseConnectionTest.jsx'
import './index.css'

// Temporary flag to show database test
const SHOW_DB_TEST = false

// Temporary flag to disable admin setup check (for debugging)
const SKIP_ADMIN_CHECK = true // Skip admin check to prevent hanging

// App wrapper that handles admin setup
const AppWrapper = () => {
  const { setupNeeded, checking } = useAdminSetup()
  const [setupComplete, setSetupComplete] = useState(false)
  const [forceSkipCheck, setForceSkipCheck] = useState(false)
  const [emergencyBypass, setEmergencyBypass] = useState(false)

  // If we're skipping admin check, go straight to main app
  if (SKIP_ADMIN_CHECK) {
    console.log('Admin check disabled, loading main app directly')
    return <RouterProvider router={router} />
  }

  // Emergency bypass: if stuck on loading for too long, show skip option
  useEffect(() => {
    if (checking) {
      const emergencyTimer = setTimeout(() => {
        console.warn('App initialization taking too long, enabling emergency bypass')
        setEmergencyBypass(true)
      }, 8000) // 8 seconds
      
      return () => clearTimeout(emergencyTimer)
    }
  }, [checking])

  // Show loading while checking setup status
  if (checking && !emergencyBypass) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Initializing application...</p>
          <p className="text-sm text-gray-500 mb-4">Checking system configuration...</p>
        </div>
      </div>
    )
  }

  // Emergency bypass or force skip
  if (emergencyBypass || forceSkipCheck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">System initialization is taking longer than expected</p>
          <p className="text-sm text-gray-500 mb-6">This might be due to database connectivity issues.</p>
          <button 
            onClick={() => {
              console.log('User chose emergency bypass')
              setForceSkipCheck(true)
              window.location.reload()
            }}
            className="btn-primary mb-3"
          >
            Continue Anyway
          </button>
          <p className="text-xs text-gray-400">You can set up admin user later if needed</p>
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
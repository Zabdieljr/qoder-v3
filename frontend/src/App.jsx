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

// App wrapper that handles admin setup
const AppWrapper = () => {
  const { setupNeeded, checking } = useAdminSetup()
  const [setupComplete, setSetupComplete] = useState(false)
  const [forceSkipCheck, setForceSkipCheck] = useState(false)

  // Emergency bypass: if stuck on loading for too long, show skip option
  useEffect(() => {
    if (checking) {
      const emergencyTimer = setTimeout(() => {
        console.warn('App initialization taking too long, enabling skip option')
        setForceSkipCheck(true)
      }, 15000) // 15 seconds
      
      return () => clearTimeout(emergencyTimer)
    }
  }, [checking])

  // Show loading while checking setup status
  if (checking && !forceSkipCheck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Initializing application...</p>
          <p className="text-sm text-gray-500 mb-4">Checking admin setup status...</p>
          {forceSkipCheck && (
            <button 
              onClick={() => {
                console.log('User chose to skip admin check')
                setForceSkipCheck(true)
              }}
              className="btn-secondary text-sm"
            >
              Skip and Continue to App
            </button>
          )}
        </div>
      </div>
    )
  }

  // If we're forcing skip or admin check failed, show normal app
  if (forceSkipCheck) {
    console.log('Bypassing admin setup check, loading main app')
    return <RouterProvider router={router} />
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
import React, { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { router } from './router/index.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AdminSetup, { useAdminSetup } from './components/AdminSetup.jsx'
import DiagnosticTest from './components/DiagnosticTest.jsx'
import './index.css'

// Temporary diagnostic mode - set to true to debug
const DIAGNOSTIC_MODE = true

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
  // Show diagnostic test if enabled
  if (DIAGNOSTIC_MODE) {
    return (
      <ErrorBoundary>
        <DiagnosticTest />
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
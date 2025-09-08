import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import LoginForm from '../components/LoginForm.jsx'

export const LoginPage = () => {
  const { signIn, loading, error, clearError, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleLogin = async (formData) => {
    const { email, password } = formData
    
    const result = await signIn(email, password)
    
    if (result.success) {
      // Navigation will be handled by useEffect above
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
    // Error handling is managed by AuthContext
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Qoder V3
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding/Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">
              User Management System
            </h3>
            <p className="text-xl text-blue-100 mb-6">
              Secure, scalable, and modern user administration
            </p>
            <div className="space-y-2 text-blue-200">
              <p>✓ Role-based access control</p>
              <p>✓ Real-time user management</p>
              <p>✓ Secure authentication</p>
              <p>✓ Modern responsive design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import RegisterForm from '../components/RegisterForm.jsx'

export const RegisterPage = () => {
  const { signUp, loading, error, clearError, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

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

  const handleRegister = async (formData) => {
    const { firstName, lastName, username, email, password } = formData
    
    const result = await signUp(email, password, {
      firstName,
      lastName,
      username
    })
    
    if (result.success) {
      setRegistrationSuccess(true)
      // Don't auto-navigate, show success message instead
      // User will need to verify email before logging in
    }
    // Error handling is managed by AuthContext
  }

  // Success state
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 text-green-500 mb-4">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Please check your email to verify your account before signing in.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary py-3 text-base font-medium"
              >
                Continue to Sign In
              </button>
              <button
                onClick={() => {
                  setRegistrationSuccess(false)
                  clearError()
                }}
                className="w-full btn-secondary py-3 text-base font-medium"
              >
                Register Another Account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding/Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">
              Join Our Community
            </h3>
            <p className="text-xl text-green-100 mb-6">
              Create your account and start managing users efficiently
            </p>
            <div className="space-y-2 text-green-200">
              <p>✓ Secure account creation</p>
              <p>✓ Email verification</p>
              <p>✓ Instant dashboard access</p>
              <p>✓ Professional tools</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Qoder V3
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join us and start managing your users
            </p>
          </div>

          {/* Registration Form */}
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
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
    </div>
  )
}

export default RegisterPage
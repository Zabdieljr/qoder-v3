import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import RegisterForm from '../components/RegisterForm.jsx'
import { Code2, CheckCircle, Shield, Mail, Zap, Users } from 'lucide-react'

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
              <CheckCircle className="w-16 h-16" />
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
                className="w-full btn-primary-modern py-3 text-base font-medium"
              >
                Continue to Sign In
              </button>
              <button
                onClick={() => {
                  setRegistrationSuccess(false)
                  clearError()
                }}
                className="w-full btn-secondary-modern py-3 text-base font-medium"
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
      {/* Left Side - Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-600 via-primary-600 to-primary-700 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-md">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">
              Join Our Community
            </h3>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Create your account and start managing users with enterprise-grade tools
            </p>
            <div className="grid grid-cols-2 gap-4 text-white/80">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Secure Account</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span className="text-sm">Email Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm">Instant Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code2 className="h-5 w-5" />
                <span className="text-sm">Modern Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Qoder V3</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
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
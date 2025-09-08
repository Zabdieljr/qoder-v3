import React, { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import LoginForm from '../components/LoginForm.jsx'
import { Code2, Shield, Users, Zap } from 'lucide-react'

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
              Welcome Back
            </h1>
            <p className="text-gray-600">
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

      {/* Right Side - Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-md">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Code2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">
              Modern User Management
            </h3>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Secure, scalable, and developer-friendly platform for the future of web applications
            </p>
            <div className="grid grid-cols-2 gap-4 text-primary-100">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Role Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm">Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code2 className="h-5 w-5" />
                <span className="text-sm">Modern Tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
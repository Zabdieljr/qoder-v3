import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
})

export const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const isLoading = loading || isSubmitting

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit({ ...data, rememberMe })
    } catch (err) {
      console.error('Login form error:', err)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          autoComplete="email"
          className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Enter your email address"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            className={`form-input pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="/forgot-password"
            className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Login Failed
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center py-3 text-base font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="-ml-1 mr-3 h-5 w-5" />
              Sign In
            </>
          )}
        </button>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline"
          >
            Create one here
          </a>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
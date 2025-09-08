import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, UserPlus, Check, X, User, Mail, Lock, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from './ui/LoadingSpinner.jsx'

// Validation schema
const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
})

// Password strength indicator
const PasswordStrength = ({ password }) => {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /\d/, text: 'One number' },
    { regex: /[@$!%*?&]/, text: 'One special character' }
  ]

  return (
    <div className="mt-2 space-y-1">
      <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
      {requirements.map((req, index) => {
        const isValid = req.regex.test(password)
        return (
          <div key={index} className="flex items-center text-xs">
            {isValid ? (
              <Check className="h-3 w-3 text-green-500 mr-2" />
            ) : (
              <X className="h-3 w-3 text-gray-400 mr-2" />
            )}
            <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
              {req.text}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export const RegisterForm = ({ onSubmit, loading = false, error = null }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })

  const password = watch('password', '')
  const isLoading = loading || isSubmitting

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data)
    } catch (err) {
      console.error('Registration form error:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {/* Name Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="form-group">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              autoComplete="given-name"
              className={`form-input-modern pl-10 ${errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="John"
              disabled={isLoading}
            />
          </div>
          {errors.firstName && (
            <p className="form-error">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.firstName.message}</span>
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              autoComplete="family-name"
              className={`form-input-modern pl-10 ${errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Doe"
              disabled={isLoading}
            />
          </div>
          {errors.lastName && (
            <p className="form-error">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.lastName.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          {...register('username')}
          type="text"
          id="username"
          autoComplete="username"
          className={`form-input ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="johndoe"
          disabled={isLoading}
        />
        {errors.username && (
          <p className="form-error">{errors.username.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          autoComplete="email"
          className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="john.doe@example.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            className={`form-input pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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
        {password && <PasswordStrength password={password} />}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            {...register('agreeToTerms')}
            id="agreeToTerms"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={isLoading}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="agreeToTerms" className="text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </label>
          {errors.agreeToTerms && (
            <p className="form-error mt-1">{errors.agreeToTerms.message}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Registration Failed
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-modern flex items-center justify-center py-3 text-base font-medium"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="-ml-1 mr-3 h-5 w-5" />
              Create Account
            </>
          )}
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline bg-transparent border-none cursor-pointer"
          >
            Sign in here
          </button>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm
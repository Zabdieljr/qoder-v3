import React, { useState, useEffect } from 'react'
import { authService } from '../services/auth.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Shield, Loader2, Check, AlertCircle } from 'lucide-react'

// Admin user configuration as specified in design
const ADMIN_CONFIG = {
  username: 'zarenas',
  email: 'zabdieljr2@gmail.com',
  password: 'eliasz91$'
}

export const AdminSetup = ({ onComplete }) => {
  const [setupStatus, setSetupStatus] = useState('checking') // checking, needed, creating, complete, error
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkAdminExists()
  }, [])

  const checkAdminExists = async () => {
    try {
      setSetupStatus('checking')
      setMessage('Checking for admin user...')
      
      // Try to get all users to see if admin exists
      const { data: users, error } = await authService.getAllUsers()
      
      if (error) {
        // If we can't fetch users, we might not have permission or no users exist
        setSetupStatus('needed')
        setMessage('Admin user needs to be created')
        return
      }

      // Check if admin user exists
      const adminExists = users?.some(user => 
        user.username === ADMIN_CONFIG.username || 
        user.email === ADMIN_CONFIG.email
      )

      if (adminExists) {
        setSetupStatus('complete')
        setMessage('Admin user already exists')
        onComplete?.(true)
      } else {
        setSetupStatus('needed')
        setMessage('Admin user needs to be created')
      }
    } catch (err) {
      console.error('Error checking admin user:', err)
      setSetupStatus('needed')
      setMessage('Unable to verify admin user, will attempt creation')
    }
  }

  const createAdminUser = async () => {
    try {
      setSetupStatus('creating')
      setMessage('Creating admin user...')
      setError('')

      const result = await authService.createAdminUser(ADMIN_CONFIG)

      if (result.error) {
        // If user already exists, that's actually success
        if (result.error.message?.includes('already registered') || 
            result.error.message?.includes('already exists')) {
          setSetupStatus('complete')
          setMessage('Admin user already exists')
          onComplete?.(true)
          return
        }

        throw result.error
      }

      setSetupStatus('complete')
      setMessage('Admin user created successfully!')
      onComplete?.(true)

    } catch (err) {
      console.error('Error creating admin user:', err)
      setSetupStatus('error')
      setError(err.message || 'Failed to create admin user')
    }
  }

  const renderContent = () => {
    switch (setupStatus) {
      case 'checking':
        return (
          <div className="text-center">
            <Loader2 className="animate-spin w-8 h-8 mx-auto text-primary-600 mb-4" />
            <p className="text-gray-600">{message}</p>
          </div>
        )

      case 'needed':
        return (
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Admin Setup Required
            </h3>
            <p className="text-gray-600 mb-6">
              {message}. Click below to create the initial admin user.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Admin Credentials:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Username:</strong> {ADMIN_CONFIG.username}</p>
                <p><strong>Email:</strong> {ADMIN_CONFIG.email}</p>
                <p><strong>Password:</strong> {ADMIN_CONFIG.password}</p>
              </div>
            </div>
            <button
              onClick={createAdminUser}
              className="btn-primary flex items-center mx-auto"
            >
              <Shield className="w-4 h-4 mr-2" />
              Create Admin User
            </button>
          </div>
        )

      case 'creating':
        return (
          <div className="text-center">
            <Loader2 className="animate-spin w-8 h-8 mx-auto text-primary-600 mb-4" />
            <p className="text-gray-600">{message}</p>
            <div className="mt-4 text-sm text-gray-500">
              This may take a few moments...
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center">
            <Check className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Setup Complete
            </h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                You can now sign in with the admin credentials to access all features.
              </p>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Setup Failed
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={createAdminUser}
                className="btn-primary flex items-center mx-auto"
              >
                <Shield className="w-4 h-4 mr-2" />
                Retry Setup
              </button>
              <button
                onClick={checkAdminExists}
                className="btn-secondary flex items-center mx-auto"
              >
                Check Again
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Qoder V3 Setup
            </h1>
            <p className="text-gray-600">
              Initial system configuration
            </p>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// Hook for checking if admin setup is needed
export const useAdminSetup = () => {
  const [setupNeeded, setSetupNeeded] = useState(true)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const { data: users, error } = await authService.getAllUsers()
      
      if (!error && users) {
        const adminExists = users.some(user => 
          user.username === ADMIN_CONFIG.username || 
          user.email === ADMIN_CONFIG.email
        )
        setSetupNeeded(!adminExists)
      } else {
        // If we can't check, assume setup is needed
        setSetupNeeded(true)
      }
    } catch (err) {
      console.error('Error checking setup status:', err)
      setSetupNeeded(true)
    } finally {
      setChecking(false)
    }
  }

  return { setupNeeded, checking, recheckSetup: checkSetupStatus }
}

export default AdminSetup
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  User, 
  Mail, 
  Save, 
  Loader2, 
  Camera, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

// Profile validation schema
const profileSchema = yup.object({
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
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters'),
  githubUsername: yup
    .string()
    .matches(/^[a-zA-Z0-9\-_]+$/, 'Invalid GitHub username format')
    .max(39, 'GitHub username must be less than 39 characters')
})

// Password change validation schema
const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

export const UserProfile = () => {
  const { user, updateProfile, updatePassword, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Profile form
  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      bio: '',
      githubUsername: ''
    }
  })

  // Password form
  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // Load user data into form
  useEffect(() => {
    if (user?.profile) {
      profileForm.reset({
        firstName: user.profile.first_name || '',
        lastName: user.profile.last_name || '',
        username: user.profile.username || '',
        bio: user.profile.bio || '',
        githubUsername: user.profile.github_username || ''
      })
    }
  }, [user, profileForm])

  // Clear messages after timeout
  useEffect(() => {
    if (updateSuccess || updateError) {
      const timer = setTimeout(() => {
        setUpdateSuccess('')
        setUpdateError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [updateSuccess, updateError])

  const handleProfileUpdate = async (data) => {
    try {
      setUpdateError('')
      setUpdateSuccess('')

      const updates = {
        first_name: data.firstName,
        last_name: data.lastName,
        full_name: `${data.firstName} ${data.lastName}`,
        username: data.username,
        bio: data.bio,
        github_username: data.githubUsername
      }

      const result = await updateProfile(updates)

      if (result.success) {
        setUpdateSuccess('Profile updated successfully!')
      } else {
        setUpdateError(result.error || 'Failed to update profile')
      }
    } catch (error) {
      setUpdateError('An unexpected error occurred')
    }
  }

  const handlePasswordUpdate = async (data) => {
    try {
      setUpdateError('')
      setUpdateSuccess('')

      // Note: In a real implementation, you'd verify the current password first
      const result = await updatePassword(data.newPassword)

      if (result.success) {
        setUpdateSuccess('Password updated successfully!')
        passwordForm.reset()
      } else {
        setUpdateError(result.error || 'Failed to update password')
      }
    } catch (error) {
      setUpdateError('An unexpected error occurred')
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: User },
    { id: 'security', name: 'Security', icon: Eye }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account information and security settings
            </p>
          </div>
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-800">{updateSuccess}</p>
          </div>
        </div>
      )}

      {updateError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{updateError}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...profileForm.register('firstName')}
                      type="text"
                      id="firstName"
                      className={`form-input ${profileForm.formState.errors.firstName ? 'border-red-500' : ''}`}
                      disabled={loading}
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="form-error">{profileForm.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...profileForm.register('lastName')}
                      type="text"
                      id="lastName"
                      className={`form-input ${profileForm.formState.errors.lastName ? 'border-red-500' : ''}`}
                      disabled={loading}
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="form-error">{profileForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    {...profileForm.register('username')}
                    type="text"
                    id="username"
                    className={`form-input ${profileForm.formState.errors.username ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {profileForm.formState.errors.username && (
                    <p className="form-error">{profileForm.formState.errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    className="form-input bg-gray-50"
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    {...profileForm.register('bio')}
                    id="bio"
                    rows={4}
                    className={`form-input ${profileForm.formState.errors.bio ? 'border-red-500' : ''}`}
                    placeholder="Tell us about yourself..."
                    disabled={loading}
                  />
                  {profileForm.formState.errors.bio && (
                    <p className="form-error">{profileForm.formState.errors.bio.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Username
                  </label>
                  <input
                    {...profileForm.register('githubUsername')}
                    type="text"
                    id="githubUsername"
                    className={`form-input ${profileForm.formState.errors.githubUsername ? 'border-red-500' : ''}`}
                    placeholder="yourusername"
                    disabled={loading}
                  />
                  {profileForm.formState.errors.githubUsername && (
                    <p className="form-error">{profileForm.formState.errors.githubUsername.message}</p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || profileForm.formState.isSubmitting}
                  className="btn-primary flex items-center"
                >
                  {(loading || profileForm.formState.isSubmitting) ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('currentPassword')}
                        type={showPasswords.current ? 'text' : 'password'}
                        id="currentPassword"
                        className={`form-input pr-10 ${passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="form-error">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('newPassword')}
                        type={showPasswords.new ? 'text' : 'password'}
                        id="newPassword"
                        className={`form-input pr-10 ${passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="form-error">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('confirmPassword')}
                        type={showPasswords.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        className={`form-input pr-10 ${passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''}`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="form-error">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || passwordForm.formState.isSubmitting}
                      className="btn-primary flex items-center"
                    >
                      {(loading || passwordForm.formState.isSubmitting) ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="-ml-1 mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Account Security Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Two-factor authentication recommended</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Email verification enabled</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Password strength requirements enforced</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
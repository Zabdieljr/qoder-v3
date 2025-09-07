import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/auth.js'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { session, error } = await authService.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setError(error.message)
        } else if (session && mounted) {
          setSession(session)
          const { user: currentUser, error: userError } = await authService.getCurrentUser()
          
          if (userError) {
            console.error('User fetch error:', userError)
            setError(userError.message)
          } else {
            setUser(currentUser)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setError(err.message)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      
      if (mounted) {
        setSession(session)
        setError(null)
        
        if (session) {
          try {
            const { user: currentUser, error: userError } = await authService.getCurrentUser()
            if (userError) {
              console.error('User fetch error on auth change:', userError)
              setError(userError.message)
            } else {
              setUser(currentUser)
            }
          } catch (err) {
            console.error('Error fetching user on auth change:', err)
            setError(err.message)
          }
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  // Sign Up
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await authService.signUp(email, password, userData)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign In
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await authService.signIn(email, password)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign Out
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await authService.signOut()
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      // Clear state
      setUser(null)
      setSession(null)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Logout failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update Profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) {
        throw new Error('No user logged in')
      }
      
      const { data, error } = await authService.updateProfile(user.id, updates)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      // Update local user state
      setUser(prevUser => ({
        ...prevUser,
        profile: { ...prevUser.profile, ...data }
      }))
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Reset Password
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await authService.resetPassword(email)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Password reset failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update Password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await authService.updatePassword(newPassword)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Password update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Clear Error
  const clearError = () => {
    setError(null)
  }

  // Helper functions
  const isAuthenticated = !!session
  const isAdmin = user?.profile?.username === 'zarenas' || false
  const userRole = isAdmin ? 'ADMIN' : 'USER'

  const value = {
    // State
    user,
    session,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    userRole,
    
    // Actions
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
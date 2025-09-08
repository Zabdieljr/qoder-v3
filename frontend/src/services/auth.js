import { supabase, TABLES, USER_STATUS } from './supabase.js'

export class AuthService {
  // User Registration
  async signUp(email, password, userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            full_name: `${userData.firstName} ${userData.lastName}`
          }
        }
      })

      if (error) throw error

      // Create user profile in users table
      if (data.user) {
        const { error: profileError } = await supabase
          .from(TABLES.USERS)
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              username: userData.username,
              first_name: userData.firstName,
              last_name: userData.lastName,
              full_name: `${userData.firstName} ${userData.lastName}`,
              status: USER_STATUS.PENDING,
              email_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  // User Login
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Update last login time
      if (data.user) {
        await supabase
          .from(TABLES.USERS)
          .update({ 
            last_login_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id)
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  // User Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  // Get Current Session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      console.error('Get session error:', error)
      return { session: null, error }
    }
  }

  // Get Current User
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error

      if (user) {
        // Get extended user profile
        const { data: profile, error: profileError } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Profile fetch error:', profileError)
          return { user, error: null }
        }

        return { user: { ...user, profile }, error: null }
      }

      return { user: null, error: null }
    } catch (error) {
      console.error('Get current user error:', error)
      return { user: null, error }
    }
  }

  // Update User Profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { data: null, error }
    }
  }

  // Password Reset
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  }

  // Update Password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { data: null, error }
    }
  }

  // Create Admin User (for initial setup)
  async createAdminUser(adminData) {
    try {
      console.log('Creating admin user with data:', adminData)
      
      // First, let's check what columns actually exist in the users table
      console.log('Checking table structure...')
      const { data: tableInfo, error: tableError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .limit(0)
      
      if (tableError) {
        console.error('Table structure check failed:', tableError)
      }
      
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          data: {
            username: adminData.username
          }
        }
      })

      if (authError) {
        console.error('Auth signup error:', authError)
        throw authError
      }

      console.log('Auth user created:', authData)

      // Create profile with only essential fields that we know exist
      if (authData.user) {
        const profileData = {
          id: authData.user.id,
          email: adminData.email,
          username: adminData.username,
          status: USER_STATUS.ACTIVE
        }

        console.log('Attempting to insert minimal profile:', profileData)

        const { data: insertedProfile, error: profileError } = await supabase
          .from(TABLES.USERS)
          .insert([profileData])
          .select()
          .single()

        if (profileError) {
          console.error('Profile creation error:', profileError)
          console.error('Full error details:', JSON.stringify(profileError, null, 2))
          throw profileError
        }

        console.log('Profile created successfully:', insertedProfile)
        return { data: { auth: authData, profile: insertedProfile }, error: null }
      }

      return { data: authData, error: null }
    } catch (error) {
      console.error('Create admin user error:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      return { data: null, error }
    }
  }

  // Get all users (admin function)
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get all users error:', error)
      return { data: null, error }
    }
  }

  // Update user status (admin function)
  async updateUserStatus(userId, status) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update user status error:', error)
      return { data: null, error }
    }
  }

  // Delete user (admin function)
  async deleteUser(userId) {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Delete user error:', error)
      return { error }
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()
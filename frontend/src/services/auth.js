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
      console.log('AuthService.updateProfile called with:')
      console.log('- User ID:', userId)
      console.log('- Updates:', updates)
      
      // First, check if the user exists
      const { data: existingUser, error: checkError } = await supabase
        .from(TABLES.USERS)
        .select('id, username, email')
        .eq('id', userId)
        .single()
      
      if (checkError) {
        console.error('User lookup error:', checkError)
        if (checkError.code === 'PGRST116') {
          throw new Error(`User with ID ${userId} not found in database`)
        }
        throw checkError
      }
      
      console.log('Found existing user:', existingUser)
      
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Profile update error:', error)
        throw error
      }
      
      console.log('Profile update successful:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
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
      
      // First check if user already exists in auth.users
      const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers()
      
      if (!checkError && existingUsers?.users) {
        const existingUser = existingUsers.users.find(u => u.email === adminData.email)
        if (existingUser) {
          console.log('User already exists in auth, attempting sign in...')
          
          // Try to sign in the existing user
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: adminData.email,
            password: adminData.password
          })
          
          if (!signInError && signInData.session) {
            // Check if profile exists
            const { data: profile } = await supabase
              .from(TABLES.USERS)
              .select('*')
              .eq('email', adminData.email)
              .single()
            
            return {
              data: {
                auth: signInData,
                profile: profile
              },
              error: null
            }
          }
        }
      }
      
      // Create new auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          emailRedirectTo: undefined, // Don't require email confirmation for admin
          data: {
            username: adminData.username,
            first_name: 'Admin',
            last_name: 'User'
          }
        }
      })

      if (authError) {
        console.error('Auth signup error:', authError)
        
        // Handle case where user already exists but password is wrong
        if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
          console.log('User exists, trying to sign in instead...')
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: adminData.email,
            password: adminData.password
          })
          
          if (signInError) {
            throw new Error(`User exists but sign-in failed: ${signInError.message}. Please check the password or use account recovery.`)
          }
          
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('email', adminData.email)
            .single()
          
          if (existingProfile) {
            return {
              data: {
                auth: signInData,
                profile: existingProfile
              },
              error: null
            }
          }
        }
        
        throw authError
      }

      console.log('Auth user created successfully:', authData)

      // Create user profile in our users table
      if (authData.user) {
        const profileData = {
          id: authData.user.id,
          username: adminData.username,
          email: adminData.email,
          first_name: 'Admin',
          last_name: 'User',
          full_name: 'Admin User',
          status: USER_STATUS.ACTIVE,
          email_verified: true, // Mark as verified for admin
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('Creating user profile with data:', profileData)

        const { data: insertedProfile, error: profileError } = await supabase
          .from(TABLES.USERS)
          .insert([profileData])
          .select()
          .single()

        if (profileError) {
          console.error('Profile creation error:', profileError)
          console.error('Full error details:', JSON.stringify(profileError, null, 2))
          
          // If RLS is blocking, provide helpful error message
          if (profileError.message && profileError.message.includes('row-level security')) {
            console.error('RLS Policy Error: Run the fix-rls-policies.sql script in Supabase SQL Editor')
            throw new Error('Row-level security is preventing admin user creation. Please run the RLS fix script in Supabase SQL Editor.')
          }
          
          throw profileError
        }

        console.log('Admin user profile created successfully:', insertedProfile)
        
        // Always attempt to create a session by signing in
        console.log('Attempting to create session by signing in...')
        
        // Wait a moment for auth system to process
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminData.email,
          password: adminData.password
        })
        
        if (signInError) {
          console.warn('Sign-in after creation failed:', signInError)
          // Still return success since user and profile were created
          return {
            data: {
              auth: authData,
              profile: insertedProfile,
              message: 'Admin user created successfully. Please sign in manually.'
            },
            error: null
          }
        }
        
        console.log('Successfully signed in after creation:', signInData)
        return {
          data: {
            auth: signInData,
            profile: insertedProfile
          },
          error: null
        }
        
      } else {
        throw new Error('User creation failed - no user object returned from Supabase Auth')
      }

    } catch (error) {
      console.error('Create admin user error:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      return { data: null, error }
    }
  }

  // Get all users (admin function)
  async getAllUsers() {
    try {
      console.log('AuthService.getAllUsers: Starting user fetch...')
      
      // Add a timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log('AuthService.getAllUsers: Request timeout, aborting...')
        controller.abort()
      }, 8000) // 8 second timeout
      
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('id, username, email, status, created_at')
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)
      
      if (error) {
        console.error('AuthService.getAllUsers: Supabase error:', error)
        throw error
      }
      
      console.log('AuthService.getAllUsers: Success, found', data?.length || 0, 'users')
      return { data: data || [], error: null }
    } catch (error) {
      console.error('AuthService.getAllUsers: Error:', error)
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        return { data: null, error: { message: 'Request timeout - database may be unavailable' } }
      }
      
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
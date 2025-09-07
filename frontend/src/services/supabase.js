import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'qoder-v3-frontend'
    }
  }
})

// Database tables configuration
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  EMBEDDINGS: 'embeddings'
}

// User status enum
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE', 
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING'
}

// Project status enum
export const PROJECT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED'
}

// Project visibility enum
export const PROJECT_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  INTERNAL: 'INTERNAL'
}

export default supabase
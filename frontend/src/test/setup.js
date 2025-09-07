import '@testing-library/jest-dom'

// Mock Supabase
jest.mock('../services/supabase.js', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    }))
  },
  TABLES: {
    USERS: 'users',
    PROJECTS: 'projects',
    EMBEDDINGS: 'embeddings'
  },
  USER_STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    PENDING: 'PENDING'
  }
}))

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/test', search: '', hash: '', state: null }),
  Navigate: ({ to, replace }) => `Navigate to ${to} (replace: ${replace})`
}))

// Mock environment variables
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.location
delete window.location
window.location = { 
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn()
}
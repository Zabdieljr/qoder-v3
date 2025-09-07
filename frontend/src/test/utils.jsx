import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext.jsx'

// Default mock auth context value
export const defaultAuthContext = {
  user: null,
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isAdmin: false,
  userRole: 'USER',
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  resetPassword: jest.fn(),
  updatePassword: jest.fn(),
  clearError: jest.fn()
}

// Mock authenticated user
export const mockAuthenticatedUser = {
  id: '1',
  email: 'test@example.com',
  profile: {
    id: '1',
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    full_name: 'Test User',
    email: 'test@example.com',
    status: 'ACTIVE',
    bio: 'Test bio',
    github_username: 'testuser',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
}

// Mock admin user
export const mockAdminUser = {
  ...mockAuthenticatedUser,
  profile: {
    ...mockAuthenticatedUser.profile,
    username: 'zarenas',
    email: 'zabdieljr2@gmail.com'
  }
}

// Mock authenticated context
export const authenticatedContext = {
  ...defaultAuthContext,
  user: mockAuthenticatedUser,
  isAuthenticated: true,
  session: { access_token: 'mock-token' }
}

// Mock admin context
export const adminContext = {
  ...authenticatedContext,
  user: mockAdminUser,
  isAdmin: true,
  userRole: 'ADMIN'
}

// Custom render function with providers
export const renderWithProviders = (
  ui,
  {
    authContextValue = defaultAuthContext,
    routerProps = {},
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <MemoryRouter {...routerProps}>
      <AuthProvider value={authContextValue}>
        {children}
      </AuthProvider>
    </MemoryRouter>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Render with authenticated user
export const renderWithAuth = (ui, options = {}) => {
  return renderWithProviders(ui, {
    authContextValue: authenticatedContext,
    ...options
  })
}

// Render with admin user
export const renderWithAdmin = (ui, options = {}) => {
  return renderWithProviders(ui, {
    authContextValue: adminContext,
    ...options
  })
}

// Mock form submission
export const mockFormSubmit = (formElement, data) => {
  const form = formElement.querySelector('form')
  if (form) {
    const event = new Event('submit', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'preventDefault', {
      value: jest.fn(),
      writable: true
    })
    form.dispatchEvent(event)
  }
}

// Wait for loading to finish
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
}

// Common test assertions
export const expectElementToBeInDocument = (element) => {
  expect(element).toBeInTheDocument()
}

export const expectElementNotToBeInDocument = (element) => {
  expect(element).not.toBeInTheDocument()
}

// Mock server responses
export const mockSuccessResponse = (data) => ({
  data,
  error: null
})

export const mockErrorResponse = (message) => ({
  data: null,
  error: { message }
})

// Test user data
export const testUsers = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    status: 'ACTIVE',
    created_at: '2023-01-01T00:00:00Z',
    last_login_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    full_name: 'Jane Smith',
    status: 'INACTIVE',
    created_at: '2023-01-01T00:00:00Z',
    last_login_at: null
  },
  {
    id: '3',
    username: 'admin_user',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    full_name: 'Admin User',
    status: 'ACTIVE',
    created_at: '2023-01-01T00:00:00Z',
    last_login_at: '2023-01-03T00:00:00Z'
  }
]

export default {
  renderWithProviders,
  renderWithAuth,
  renderWithAdmin,
  defaultAuthContext,
  authenticatedContext,
  adminContext,
  mockAuthenticatedUser,
  mockAdminUser,
  testUsers,
  mockSuccessResponse,
  mockErrorResponse
}
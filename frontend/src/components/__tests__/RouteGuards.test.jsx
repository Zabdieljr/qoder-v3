import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext.jsx'
import { PublicRoute, PrivateRoute, AdminRoute } from '../RouteGuards.jsx'

// Mock the auth context
const mockAuthContextValue = {
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  user: null,
  session: null,
  error: null
}

const MockAuthProvider = ({ children, value = mockAuthContextValue }) => {
  return (
    <AuthProvider value={value}>
      {children}
    </AuthProvider>
  )
}

const TestComponent = ({ text = 'Test Content' }) => <div>{text}</div>

const renderWithRouter = (component, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('RouteGuards', () => {
  describe('PublicRoute', () => {
    test('renders children when user is not authenticated', () => {
      renderWithRouter(
        <MockAuthProvider value={{ ...mockAuthContextValue, isAuthenticated: false }}>
          <PublicRoute>
            <TestComponent />
          </PublicRoute>
        </MockAuthProvider>
      )
      
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    test('redirects to dashboard when user is authenticated', () => {
      renderWithRouter(
        <MockAuthProvider value={{ ...mockAuthContextValue, isAuthenticated: true }}>
          <PublicRoute>
            <TestComponent />
          </PublicRoute>
        </MockAuthProvider>
      )
      
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    test('shows loading spinner when loading', () => {
      renderWithRouter(
        <MockAuthProvider value={{ ...mockAuthContextValue, loading: true }}>
          <PublicRoute>
            <TestComponent />
          </PublicRoute>
        </MockAuthProvider>
      )
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })

  describe('PrivateRoute', () => {
    test('renders children when user is authenticated', () => {
      renderWithRouter(
        <MockAuthProvider value={{ ...mockAuthContextValue, isAuthenticated: true }}>
          <PrivateRoute>
            <TestComponent />
          </PrivateRoute>
        </MockAuthProvider>
      )
      
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    test('redirects to login when user is not authenticated', () => {
      renderWithRouter(
        <MockAuthProvider value={{ ...mockAuthContextValue, isAuthenticated: false }}>
          <PrivateRoute>
            <TestComponent />
          </PrivateRoute>
        </MockAuthProvider>
      )
      
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    test('shows loading spinner when loading', () => {
      renderWithRouter(
        <MockAuthProvider value={{ ...mockAuthContextValue, loading: true }}>
          <PrivateRoute>
            <TestComponent />
          </PrivateRoute>
        </MockAuthProvider>
      )
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })

  describe('AdminRoute', () => {
    test('renders children when user is authenticated and admin', () => {
      renderWithRouter(
        <MockAuthProvider value={{ 
          ...mockAuthContextValue, 
          isAuthenticated: true, 
          isAdmin: true 
        }}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      )
      
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    test('redirects to login when user is not authenticated', () => {
      renderWithRouter(
        <MockAuthProvider value={{ 
          ...mockAuthContextValue, 
          isAuthenticated: false, 
          isAdmin: false 
        }}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      )
      
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    test('shows access denied when authenticated but not admin', () => {
      renderWithRouter(
        <MockAuthProvider value={{ 
          ...mockAuthContextValue, 
          isAuthenticated: true, 
          isAdmin: false 
        }}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      )
      
      expect(screen.getByText('Access Denied')).toBeInTheDocument()
      expect(screen.getByText(/don't have permission/i)).toBeInTheDocument()
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    test('shows loading spinner when loading', () => {
      renderWithRouter(
        <MockAuthProvider value={{ 
          ...mockAuthContextValue, 
          loading: true 
        }}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      )
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })
})
import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../contexts/AuthContext.jsx'

// Test component to access auth context
const TestComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error,
    signIn, 
    signUp, 
    signOut 
  } = useAuth()

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no-user'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      
      <button onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password', { username: 'test' })}>
        Sign Up
      </button>
      <button onClick={signOut}>
        Sign Out
      </button>
    </div>
  )
}

const renderWithAuthProvider = (component) => {
  return render(\n    <AuthProvider>\n      {component}\n    </AuthProvider>\n  )\n}\n\ndescribe('AuthContext', () => {\n  beforeEach(() => {\n    jest.clearAllMocks()\n  })\n\n  test('provides initial auth state', async () => {\n    renderWithAuthProvider(<TestComponent />)\n    \n    expect(screen.getByTestId('loading')).toHaveTextContent('loading')\n    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated')\n    expect(screen.getByTestId('user')).toHaveTextContent('no-user')\n    expect(screen.getByTestId('error')).toHaveTextContent('no-error')\n  })\n\n  test('handles successful sign in', async () => {\n    const mockSignIn = require('../services/auth.js').authService.signIn\n    mockSignIn.mockResolvedValue({\n      data: { user: { id: '1', email: 'test@example.com' } },\n      error: null\n    })\n\n    renderWithAuthProvider(<TestComponent />)\n    \n    const signInButton = screen.getByText('Sign In')\n    \n    await act(async () => {\n      await userEvent.click(signInButton)\n    })\n\n    await waitFor(() => {\n      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password')\n    })\n  })\n\n  test('handles sign in error', async () => {\n    const mockSignIn = require('../services/auth.js').authService.signIn\n    mockSignIn.mockResolvedValue({\n      data: null,\n      error: { message: 'Invalid credentials' }\n    })\n\n    renderWithAuthProvider(<TestComponent />)\n    \n    const signInButton = screen.getByText('Sign In')\n    \n    await act(async () => {\n      await userEvent.click(signInButton)\n    })\n\n    await waitFor(() => {\n      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials')\n    })\n  })\n\n  test('handles successful sign up', async () => {\n    const mockSignUp = require('../services/auth.js').authService.signUp\n    mockSignUp.mockResolvedValue({\n      data: { user: { id: '1', email: 'test@example.com' } },\n      error: null\n    })\n\n    renderWithAuthProvider(<TestComponent />)\n    \n    const signUpButton = screen.getByText('Sign Up')\n    \n    await act(async () => {\n      await userEvent.click(signUpButton)\n    })\n\n    await waitFor(() => {\n      expect(mockSignUp).toHaveBeenCalledWith(\n        'test@example.com',\n        'password',\n        { username: 'test' }\n      )\n    })\n  })\n\n  test('handles sign out', async () => {\n    const mockSignOut = require('../services/auth.js').authService.signOut\n    mockSignOut.mockResolvedValue({ error: null })\n\n    renderWithAuthProvider(<TestComponent />)\n    \n    const signOutButton = screen.getByText('Sign Out')\n    \n    await act(async () => {\n      await userEvent.click(signOutButton)\n    })\n\n    await waitFor(() => {\n      expect(mockSignOut).toHaveBeenCalled()\n    })\n  })\n\n  test('throws error when used outside provider', () => {\n    // Suppress console.error for this test\n    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})\n    \n    expect(() => {\n      render(<TestComponent />)\n    }).toThrow('useAuth must be used within an AuthProvider')\n    \n    consoleSpy.mockRestore()\n  })\n})
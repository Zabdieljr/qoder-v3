import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Log to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // In production, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto w-16 h-16 text-red-500 mb-6">
                <AlertTriangle className="w-full h-full" />
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>

              {/* Error Description */}
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Error Details (Development Only):
                  </h3>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </button>
              </div>

              {/* Additional Help */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact support at{' '}
                  <a 
                    href="mailto:support@qoder.com" 
                    className="text-primary-600 hover:text-primary-500"
                  >
                    support@qoder.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Function component error boundary for hooks
export const withErrorBoundary = (Component, fallback) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Custom hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null)

  const resetError = () => setError(null)

  const handleError = React.useCallback((error) => {
    console.error('Application error:', error)
    setError(error)
  }, [])

  // Reset error when component unmounts
  React.useEffect(() => {
    return () => setError(null)
  }, [])

  return { error, handleError, resetError }
}

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // Prevent the default behavior (logging to console)
    event.preventDefault()
  })

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
  })
}

export default ErrorBoundary
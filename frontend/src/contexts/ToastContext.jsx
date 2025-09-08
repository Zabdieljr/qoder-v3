import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const Toast = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className=\"h-5 w-5 text-green-500\" />
      case 'error': return <AlertCircle className=\"h-5 w-5 text-red-500\" />
      case 'warning': return <AlertTriangle className=\"h-5 w-5 text-yellow-500\" />
      default: return <Info className=\"h-5 w-5 text-blue-500\" />
    }
  }

  const getStyles = () => {
    const base = \"fixed top-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm z-50 flex items-start space-x-3\"
    switch (toast.type) {
      case 'success': return `${base} border-green-200 bg-green-50`
      case 'error': return `${base} border-red-200 bg-red-50`
      case 'warning': return `${base} border-yellow-200 bg-yellow-50`
      default: return `${base} border-blue-200 bg-blue-50`
    }
  }

  return (
    <div className={getStyles()} style={{ top: `${4 + toast.index * 80}px` }}>
      {getIcon()}
      <div className=\"flex-1\">
        {toast.title && <h4 className=\"font-semibold text-gray-900 mb-1\">{toast.title}</h4>}
        <p className=\"text-sm text-gray-700\">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className=\"text-gray-400 hover:text-gray-600\">
        <X className=\"h-4 w-4\" />
      </button>
    </div>
  )
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, title: options.title, index: toasts.length }
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, options.duration || 5000)

    return id
  }, [toasts.length])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: (message, options) => addToast(message, 'success', options),
    error: (message, options) => addToast(message, 'error', options),
    warning: (message, options) => addToast(message, 'warning', options),
    info: (message, options) => addToast(message, 'info', options),
    remove: removeToast
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toasts.map((toast, index) => (
        <Toast key={toast.id} toast={{ ...toast, index }} onRemove={removeToast} />
      ))}
    </ToastContext.Provider>
  )
}

export default ToastProvider
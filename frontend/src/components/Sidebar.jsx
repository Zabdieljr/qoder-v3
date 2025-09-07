import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  User, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`
      }
    >
      <Icon className="mr-3 h-5 w-5" />
      {label}
    </NavLink>
  )
}

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, signOut, isAdmin } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    onClose?.()
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    ...(isAdmin ? [{ name: 'User Management', href: '/dashboard/users', icon: Users }] : []),
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        sidebar
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-white font-semibold text-lg">Qoder V3</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-medium text-sm">
                  {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user?.profile?.full_name || user?.profile?.username || 'User'}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.email}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                to={item.href}
                icon={item.icon}
                label={item.name}
                onClick={() => window.innerWidth < 1024 && onClose?.()}
              />
            ))}
          </nav>

          {/* Footer - Sign Out */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
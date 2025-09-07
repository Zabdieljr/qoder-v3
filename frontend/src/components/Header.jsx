import React from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

export const Header = ({ onMenuClick }) => {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Page title or breadcrumb */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back, {user?.profile?.first_name || 'User'}!
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-700 focus:outline-none focus:text-gray-700">
            <Bell className="h-6 w-6" />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { authService } from '../services/auth.js'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react'

// Statistics Card Component
const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { action: 'User registered', user: 'john.doe@example.com', time: '2 minutes ago' },
    { action: 'Profile updated', user: 'jane.smith@example.com', time: '1 hour ago' },
    { action: 'User logged in', user: 'mike.johnson@example.com', time: '2 hours ago' },
    { action: 'Password reset', user: 'sarah.wilson@example.com', time: '3 hours ago' },
  ]

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.action}</span> - {activity.user}
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Dashboard Overview Component
const DashboardOverview = () => {
  const { user, isAdmin, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsersToday: 0
  })
  const [loading, setLoading] = useState(true)

  // Debug user data
  useEffect(() => {
    console.log('Dashboard: User data:', user)
    console.log('Dashboard: Is authenticated:', isAuthenticated)
    console.log('Dashboard: Is admin:', isAdmin)
  }, [user, isAuthenticated, isAdmin])

  useEffect(() => {
    const fetchStats = async () => {
      if (isAdmin) {
        try {
          const { data: users, error } = await authService.getAllUsers()
          if (!error && users) {
            const active = users.filter(u => u.status === 'ACTIVE').length
            const inactive = users.filter(u => u.status !== 'ACTIVE').length
            const today = new Date().toDateString()
            const newToday = users.filter(u => 
              new Date(u.created_at).toDateString() === today
            ).length

            setStats({
              totalUsers: users.length,
              activeUsers: active,
              inactiveUsers: inactive,
              newUsersToday: newToday
            })
          }
        } catch (error) {
          console.error('Error fetching user stats:', error)
        }
      }
      setLoading(false)
    }

    fetchStats()
  }, [isAdmin])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.profile?.first_name || 'User'}!
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid - Only for Admin Users */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={loading ? '...' : stats.totalUsers}
              icon={Users}
              color="primary"
            />
            <StatCard
              title="Active Users"
              value={loading ? '...' : stats.activeUsers}
              icon={UserCheck}
              color="green"
            />
            <StatCard
              title="Inactive Users"
              value={loading ? '...' : stats.inactiveUsers}
              icon={UserX}
              color="red"
            />
            <StatCard
              title="New Today"
              value={loading ? '...' : stats.newUsersToday}
              icon={Activity}
              trend="+12% from yesterday"
              color="yellow"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/dashboard/users"
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  Manage Users
                </a>
                <a
                  href="/dashboard/profile"
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Update Profile
                </a>
                <a
                  href="/dashboard/settings"
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  System Settings
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Regular User Dashboard */}
      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Username</p>
                <p className="text-gray-900">{user?.profile?.username || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user?.profile?.status || 'Active'}
                </span>
              </div>
              <a
                href="/dashboard/profile"
                className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium text-sm"
              >
                Update Profile →
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/dashboard/profile"
                className="block w-full text-left px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                Edit Profile
              </a>
              <a
                href="/dashboard/settings"
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Account Settings
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Dashboard Layout Component
export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Dashboard Home Page (default route)
export const DashboardHome = () => {
  return <DashboardOverview />
}

export default Dashboard
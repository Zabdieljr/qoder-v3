import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { authService } from '../services/auth.js'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import { LoadingSpinner, CardSkeleton } from '../components/ui/LoadingSpinner.jsx'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react'

// Modern Statistics Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendDirection = 'up', color = 'primary', loading = false }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 text-white',
    green: 'from-green-500 to-green-600 text-white',
    red: 'from-red-500 to-red-600 text-white',
    yellow: 'from-yellow-500 to-yellow-600 text-white',
    blue: 'from-blue-500 to-blue-600 text-white'
  }

  const iconBgClasses = {
    primary: 'bg-white/20',
    green: 'bg-white/20', 
    red: 'bg-white/20',
    yellow: 'bg-white/20',
    blue: 'bg-white/20'
  }

  if (loading) {
    return <CardSkeleton />
  }

  return (
    <div className={`card-elevated p-6 bg-gradient-to-br ${colorClasses[color]} transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {trend && (
            <div className="flex items-center">
              {trendDirection === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-200 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-200 mr-1" />
              )}
              <span className="text-sm text-white/90">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${iconBgClasses[color]} backdrop-blur-sm`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  )
}

// Enhanced Recent Activity Component
const RecentActivity = ({ loading = false }) => {
  const activities = [
    { action: 'User registered', user: 'john.doe@example.com', time: '2 minutes ago', type: 'success' },
    { action: 'Profile updated', user: 'jane.smith@example.com', time: '1 hour ago', type: 'info' },
    { action: 'User logged in', user: 'mike.johnson@example.com', time: '2 hours ago', type: 'success' },
    { action: 'Password reset', user: 'sarah.wilson@example.com', time: '3 hours ago', type: 'warning' },
    { action: 'Failed login attempt', user: 'test@example.com', time: '4 hours ago', type: 'error' }
  ]

  const getActivityColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-primary-500'
    }
  }

  if (loading) {
    return <CardSkeleton />
  }

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary-600" />
          Recent Activity
        </h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.action}</span>
              </p>
              <p className="text-sm text-gray-600 truncate">{activity.user}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
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
  const toast = useToast()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsersToday: 0,
    growthRate: 0
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
            const yesterday = new Date(Date.now() - 86400000).toDateString()
            const newToday = users.filter(u => 
              new Date(u.created_at).toDateString() === today
            ).length
            const newYesterday = users.filter(u => 
              new Date(u.created_at).toDateString() === yesterday
            ).length
            
            const growthRate = newYesterday > 0 ? 
              Math.round(((newToday - newYesterday) / newYesterday) * 100) : 0

            setStats({
              totalUsers: users.length,
              activeUsers: active,
              inactiveUsers: inactive,
              newUsersToday: newToday,
              growthRate
            })
          }
        } catch (error) {
          console.error('Error fetching user stats:', error)
          toast.error('Failed to load dashboard statistics')
        }
      }
      setLoading(false)
    }

    fetchStats()
  }, [isAdmin, toast])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-elevated p-8 bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.profile?.first_name || 'User'}!
            </h2>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your account today.
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Last login: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">
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
              loading={loading}
            />
            <StatCard
              title="Active Users"
              value={loading ? '...' : stats.activeUsers}
              icon={UserCheck}
              color="green"
              loading={loading}
            />
            <StatCard
              title="Inactive Users"
              value={loading ? '...' : stats.inactiveUsers}
              icon={UserX}
              color="red"
              loading={loading}
            />
            <StatCard
              title="New Today"
              value={loading ? '...' : stats.newUsersToday}
              icon={Activity}
              trend={loading ? '' : `${stats.growthRate >= 0 ? '+' : ''}${stats.growthRate}% from yesterday`}
              trendDirection={stats.growthRate >= 0 ? 'up' : 'down'}
              color="yellow"
              loading={loading}
            />
          </div>

          {/* Analytics and Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <RecentActivity loading={loading} />
            </div>
            <div className="space-y-6">
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-3">
                  <a
                    href="/dashboard/users"
                    className="flex items-center justify-between w-full p-4 text-left bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-primary-600 mr-3" />
                      <span className="font-medium text-primary-700">Manage Users</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="/dashboard/profile"
                    className="flex items-center justify-between w-full p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="font-medium text-gray-700">Update Profile</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="flex items-center justify-between w-full p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="font-medium text-gray-700">System Settings</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Regular User Dashboard */}
      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary-600" />
              Your Profile
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-600">Username</p>
                <p className="text-gray-900 font-medium">{user?.profile?.username || 'Not set'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user?.profile?.status || 'Active'}
                </span>
              </div>
              <a
                href="/dashboard/profile"
                className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium text-sm group"
              >
                Update Profile
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a
                href="/dashboard/profile"
                className="flex items-center justify-between w-full p-4 text-left bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-primary-700">Edit Profile</span>
                </div>
                <ArrowRight className="h-4 w-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/dashboard/settings"
                className="flex items-center justify-between w-full p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-700">Account Settings</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Dashboard Layout Component with Enhanced Responsive Design
export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
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
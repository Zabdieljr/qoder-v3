import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { authService, USER_STATUS } from '../services/auth.js'

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    [USER_STATUS.ACTIVE]: { 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle,
      label: 'Active' 
    },
    [USER_STATUS.INACTIVE]: { 
      color: 'bg-gray-100 text-gray-800', 
      icon: XCircle,
      label: 'Inactive' 
    },
    [USER_STATUS.SUSPENDED]: { 
      color: 'bg-red-100 text-red-800', 
      icon: Ban,
      label: 'Suspended' 
    },
    [USER_STATUS.PENDING]: { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: Clock,
      label: 'Pending' 
    }
  }

  const config = statusConfig[status] || statusConfig[USER_STATUS.INACTIVE]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  )
}

// User Action Dropdown
const UserActionDropdown = ({ user, onEdit, onDelete, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { 
      label: 'View Details', 
      icon: Eye, 
      onClick: () => onEdit(user),
      color: 'text-gray-700 hover:bg-gray-100'
    },
    { 
      label: 'Edit User', 
      icon: Edit, 
      onClick: () => onEdit(user),
      color: 'text-gray-700 hover:bg-gray-100'
    },
    ...(user.status === USER_STATUS.ACTIVE ? [
      { 
        label: 'Suspend User', 
        icon: Ban, 
        onClick: () => onStatusChange(user.id, USER_STATUS.SUSPENDED),
        color: 'text-red-700 hover:bg-red-50'
      }
    ] : [
      { 
        label: 'Activate User', 
        icon: UserCheck, 
        onClick: () => onStatusChange(user.id, USER_STATUS.ACTIVE),
        color: 'text-green-700 hover:bg-green-50'
      }
    ]),
    { 
      label: 'Delete User', 
      icon: Trash2, 
      onClick: () => onDelete(user),
      color: 'text-red-700 hover:bg-red-50'
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick()
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center ${action.color}`}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// User Edit Modal
const UserEditModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    status: USER_STATUS.ACTIVE,
    bio: '',
    githubUsername: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        status: user.status || USER_STATUS.ACTIVE,
        bio: user.bio || '',
        githubUsername: user.github_username || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        status: formData.status,
        bio: formData.bio,
        github_username: formData.githubUsername
      }

      await onSave(user.id, updates)
      onClose()
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit User: {user?.username}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              className="form-input bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input"
            >
              <option value={USER_STATUS.ACTIVE}>Active</option>
              <option value={USER_STATUS.INACTIVE}>Inactive</option>
              <option value={USER_STATUS.SUSPENDED}>Suspended</option>
              <option value={USER_STATUS.PENDING}>Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="form-input"
              rows={3}
              placeholder="User bio..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Username
            </label>
            <input
              type="text"
              value={formData.githubUsername}
              onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
              className="form-input"
              placeholder="github-username"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm(user.id)
      onClose()
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Delete User
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete user <strong>{user?.username}</strong>? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main UserManagement Component
export const UserManagement = () => {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [error, setError] = useState('')

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access user management.</p>
      </div>
    )
  }

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await authService.getAllUsers()
      
      if (fetchError) {
        setError('Failed to load users')
        console.error('Error fetching users:', fetchError)
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle user edit
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  // Handle user save
  const handleSaveUser = async (userId, updates) => {
    try {
      const { error } = await authService.updateProfile(userId, updates)
      if (error) {
        throw error
      }
      
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Handle user delete
  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  // Handle delete confirmation
  const handleConfirmDelete = async (userId) => {
    try {
      const { error } = await authService.deleteUser(userId)
      if (error) {
        throw error
      }
      
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // Handle status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const { error } = await authService.updateUserStatus(userId, newStatus)
      if (error) {
        throw error
      }
      
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === USER_STATUS.ACTIVE).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === USER_STATUS.SUSPENDED).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <Mail className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === USER_STATUS.PENDING).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value={USER_STATUS.ACTIVE}>Active</option>
              <option value={USER_STATUS.INACTIVE}>Inactive</option>
              <option value={USER_STATUS.SUSPENDED}>Suspended</option>
              <option value={USER_STATUS.PENDING}>Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="animate-spin w-8 h-8 mx-auto text-primary-600 mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-medium text-sm">
                            {user.first_name?.[0] || user.email?.[0] || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || user.username}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.last_login_at 
                        ? new Date(user.last_login_at).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <UserActionDropdown
                        user={user}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserEditModal
        user={selectedUser}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSaveUser}
      />

      <DeleteConfirmModal
        user={selectedUser}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default UserManagement
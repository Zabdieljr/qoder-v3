import { supabase } from '../services/supabase.js'

// Database connection test function
export const testDatabaseConnection = async () => {
  const results = {
    connection: 'TESTING',
    authentication: 'TESTING',
    tableAccess: 'TESTING',
    errors: []
  }

  try {
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(0)

    if (connectionError) {
      results.connection = 'FAILED'
      results.errors.push(`Connection: ${connectionError.message}`)
    } else {
      results.connection = 'SUCCESS'
    }

    // Test 2: Authentication status
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      results.authentication = 'ERROR'
      results.errors.push(`Auth: ${authError.message}`)
    } else {
      results.authentication = session ? 'AUTHENTICATED' : 'ANONYMOUS'
    }

    // Test 3: Table access
    const { data: tableTest, error: tableError } = await supabase
      .from('users')
      .select('id, username, email')
      .limit(1)

    if (tableError) {
      results.tableAccess = 'FAILED'
      results.errors.push(`Table Access: ${tableError.message}`)
    } else {
      results.tableAccess = 'SUCCESS'
    }

  } catch (error) {
    results.errors.push(`Unexpected error: ${error.message}`)
  }

  return results
}

// Component to display connection test results
import React, { useState, useEffect } from 'react'

const DatabaseConnectionTest = () => {
  const [testResults, setTestResults] = useState(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    runTest()
  }, [])

  const runTest = async () => {
    setTesting(true)
    const results = await testDatabaseConnection()
    setTestResults(results)
    setTesting(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600'
      case 'FAILED': return 'text-red-600'
      case 'ERROR': return 'text-red-600'
      case 'TESTING': return 'text-yellow-600'
      case 'AUTHENTICATED': return 'text-green-600'
      case 'ANONYMOUS': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  if (testing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">🔍 Testing Database Connection...</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🔍 Database Connection Test</h2>
        <button 
          onClick={runTest}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Run Test Again
        </button>
      </div>
      
      {testResults && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Connection:</span>
            <span className={getStatusColor(testResults.connection)}>
              {testResults.connection}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Authentication:</span>
            <span className={getStatusColor(testResults.authentication)}>
              {testResults.authentication}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Table Access:</span>
            <span className={getStatusColor(testResults.tableAccess)}>
              {testResults.tableAccess}
            </span>
          </div>

          {testResults.errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <h3 className="text-red-800 font-medium mb-2">Errors:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {testResults.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {testResults.errors.length === 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">✅ All database tests passed!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DatabaseConnectionTest
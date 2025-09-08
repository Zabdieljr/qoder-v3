import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase.js'

const DiagnosticTest = () => {
  const [status, setStatus] = useState('Loading...')
  const [details, setDetails] = useState({})

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    const results = {}

    try {
      // Test 1: Environment Variables
      results.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'MISSING'
      results.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'

      // Test 2: Supabase Client Initialization
      results.supabaseClient = supabase ? 'OK' : 'FAILED'

      // Test 3: Simple Supabase Connection Test
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1)
        results.dbConnection = error ? `ERROR: ${error.message}` : 'OK'
      } catch (err) {
        results.dbConnection = `EXCEPTION: ${err.message}`
      }

      setDetails(results)
      setStatus('Diagnostics Complete')
    } catch (error) {
      setStatus(`Error: ${error.message}`)
      setDetails({ error: error.message })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          App Diagnostic Test
        </h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Status:</h2>
          <p className="text-gray-700">{status}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Details:</h2>
          <div className="space-y-2 text-sm">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span className={
                  value === 'OK' || value === 'SET' ? 'text-green-600' : 
                  value === 'MISSING' || value?.includes('ERROR') ? 'text-red-600' : 
                  'text-gray-700'
                }>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={runDiagnostics}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Run Diagnostics Again
        </button>
      </div>
    </div>
  )
}

export default DiagnosticTest
import React from 'react'

// Minimal test component
const MinimalTest = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>🎉 Frontend is Working!</h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>The Vercel deployment is successful.</p>
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '15px', 
          borderRadius: '6px',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ color: '#0369a1', margin: '0 0 10px 0' }}>Environment Check:</h3>
          <p style={{ color: '#0369a1', margin: '5px 0' }}>
            Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ MISSING'}
          </p>
          <p style={{ color: '#0369a1', margin: '5px 0' }}>
            Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING'}
          </p>
        </div>
        <p style={{ color: '#6b7280', marginTop: '20px', fontSize: '14px' }}>
          Time: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  )
}

function App() {
  return <MinimalTest />
}

export default App
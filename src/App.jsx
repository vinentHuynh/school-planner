import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { getCurrentUser } from 'aws-amplify/auth'

function App() {
  const [count, setCount] = useState(0)
  const [hasAmplifyConfig, setHasAmplifyConfig] = useState(false)

  useEffect(() => {
    // Check if Amplify is configured
    const checkAmplifyConfig = async () => {
      try {
        await getCurrentUser()
        setHasAmplifyConfig(true)
      } catch {
        setHasAmplifyConfig(false)
      }
    }
    checkAmplifyConfig()
  }, [])

  // Render static version when Amplify is not configured
  if (!hasAmplifyConfig) {
    return (
      <main>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>School Planner</h1>
        <p>Running in demo mode - backend authentication not configured</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Your school planning app is ready to go! Start the Amplify sandbox to enable authentication.
        </p>
      </main>
    )
  }

  // Render with authentication when Amplify is configured
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>School Planner</h1>
          <p>Welcome, {user.signInDetails.loginId}!</p>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Your school planning app is ready to go!
          </p>
          <button onClick={signOut} style={{ marginTop: '20px' }}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  )
}

export default App

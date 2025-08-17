import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify'

// Initialize Amplify configuration
async function initializeAmplify() {
  try {
    const { default: outputs } = await import('../amplify_outputs.json')
    Amplify.configure(outputs)
    console.log('Amplify configured with backend')
  } catch {
    console.log('Amplify outputs not found - running in static mode')
    // App will run without Amplify backend features
  }
}

// Initialize Amplify
initializeAmplify()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

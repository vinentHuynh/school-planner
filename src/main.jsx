import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify'

async function initializeAmplify() {
  try {
    // Use dynamic import with string concatenation to avoid Rollup static analysis
    const amplifyPath = '../amplify_outputs' + '.json'
    const { default: outputs } = await import(/* @vite-ignore */ amplifyPath)
    Amplify.configure(outputs)
    console.log('Amplify configured successfully')
  } catch {
    console.log('Running in static mode - Amplify configuration not available')
  }
}

// Initialize Amplify before rendering
initializeAmplify().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

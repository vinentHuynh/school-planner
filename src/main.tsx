import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import { ThemeProvider } from './contexts';
import { AppThemeProvider } from './components/AppThemeProvider.tsx';
import '@mantine/core/styles.css';

async function initializeAmplify() {
  try {
    // Use dynamic import with string concatenation to avoid Rollup static analysis
    const amplifyPath = '../amplify_outputs' + '.json';
    const { default: outputs } = await import(/* @vite-ignore */ amplifyPath);
    Amplify.configure(outputs);
    console.log('Amplify configured successfully');
  } catch {
    console.log('Running in static mode - Amplify configuration not available');
  }
}

// Initialize Amplify before rendering
initializeAmplify().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
});

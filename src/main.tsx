import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import ErrorBoundary from './components/utils/ErrorBoundary.tsx';
import './index.css';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// StorageAvailabilityWarning Component Definition
function StorageAvailabilityWarning() {
  const [localStorageAvailable, setLocalStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      const testKey = '__testLocalStorageCheck__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setLocalStorageAvailable(true);
    } catch (e) {
      console.warn("localStorage access test failed:", e);
      setLocalStorageAvailable(false);
    }
  }, []);

  if (!localStorageAvailable) {
    return (
      <div style={{
        padding: '10px',
        backgroundColor: 'red',
        color: 'white',
        textAlign: 'center',
        position: 'sticky',
        top: '0',
        zIndex: 9999
      }}>
        Warning: This application requires browser storage (localStorage) for user sessions and may not function correctly. Please check your browser settings.
      </div>
    );
  }
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StorageAvailabilityWarning />
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ClerkProvider>
  </StrictMode>
);
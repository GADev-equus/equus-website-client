import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ToastProvider } from './components/ui/toast.jsx'
import { initializePerformanceMonitoring } from './utils/performance.js'

// Initialize performance monitoring
initializePerformanceMonitoring();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ToastProvider>
  </StrictMode>,
)

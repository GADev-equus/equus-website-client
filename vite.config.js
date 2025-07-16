import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@radix-ui/react-slot', 'lucide-react'],
          
          // Admin features
          'admin': [
            './src/pages/admin/Dashboard.jsx',
            './src/pages/admin/Users.jsx',
            './src/pages/admin/Analytics.jsx'
          ],
          
          // Auth features
          'auth': [
            './src/pages/auth/SignIn.jsx',
            './src/pages/auth/SignUp.jsx',
            './src/pages/auth/ResetPassword.jsx'
          ]
        }
      }
    },
    // Enable source maps for production debugging
    sourcemap: process.env.NODE_ENV !== 'production',
    
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      },
    },
  },
  
  // Development server optimizations
  server: {
    hmr: {
      overlay: true
    }
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@radix-ui/react-slot'] // Let Vite handle this dynamically
  }
})

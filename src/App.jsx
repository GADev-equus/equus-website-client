/**
 * App Component - Main application component with routing
 * Sets up React Router with authentication and admin routes
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AdminRoute from '@/components/shared/AdminRoute';
import { LoadingSpinnerCenter } from '@/components/ui/loading-spinner';
import LoadingStateWrapper from '@/components/ui/LoadingStateWrapper';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Critical pages - loaded immediately
import Home from '@/pages/Home';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';
import EmailVerification from '@/pages/auth/EmailVerification';

// Lazy-loaded pages - loaded on demand
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const UserDashboard = lazy(() => import('@/pages/user/Dashboard'));
const Profile = lazy(() => import('@/pages/user/Profile'));
const Settings = lazy(() => import('@/pages/user/Settings'));
const PasswordChange = lazy(() => import('@/pages/user/PasswordChange'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Users = lazy(() => import('@/pages/admin/Users'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const PageViews = lazy(() => import('@/pages/admin/PageViews'));

function App() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div 
          className={!isDesktop ? 'non-desktop-layout' : ''}
          style={{
            height: isDesktop ? '100vh' : 'auto',
            minHeight: !isDesktop ? '100vh' : 'auto',
            backgroundColor: 'var(--equus-background-dark)',
            border: 'var(--equus-border-width) solid var(--equus-border-color)',
            position: 'relative',
            display: !isDesktop ? 'flex' : 'block',
            flexDirection: !isDesktop ? 'column' : 'row'
          }}
        >
          <Header />
          
          <main id="main-content" style={{ 
            position: isDesktop ? 'absolute' : 'static',
            top: isDesktop ? 'var(--header-height, 120px)' : 'auto',
            bottom: isDesktop ? 'var(--footer-height, 100px)' : 'auto',
            left: isDesktop ? 0 : 'auto',
            right: isDesktop ? 0 : 'auto',
            overflow: isDesktop ? 'auto' : 'visible',
            padding: isDesktop ? '1rem' : '1rem',
            paddingTop: !isDesktop ? `calc(var(--header-height, 120px) + 1rem)` : '1rem',
            flex: !isDesktop ? 1 : 'none'
          }}>
            <Suspense fallback={
              <LoadingStateWrapper 
                isLoading={true} 
                size="lg" 
                className="min-h-screen flex items-center justify-center"
                showColdStartUI={true}
                minColdStartThreshold={3000}
              />
            }>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Authentication Routes */}
                <Route path="/auth/signin" element={<SignIn />} />
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/verify-email" element={<EmailVerification />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/settings/password" element={
                  <ProtectedRoute>
                    <PasswordChange />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <Users />
                  </AdminRoute>
                } />
                <Route path="/admin/analytics" element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                } />
                <Route path="/admin/page-views" element={
                  <AdminRoute>
                    <PageViews />
                  </AdminRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

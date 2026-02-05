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
import PageObserver from '@/components/PageObserver';

// Critical pages - loaded immediately
import Home from '@/pages/Home';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';
import EmailVerification from '@/pages/auth/EmailVerification';

// Lazy-loaded pages - loaded on demand
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const Products = lazy(() => import('@/pages/Products'));
const About = lazy(() => import('@/pages/About'));
const ArticlePage = lazy(() => import('@/pages/articles/ArticlePage'));
const UserDashboard = lazy(() => import('@/pages/user/Dashboard'));
const Profile = lazy(() => import('@/pages/user/Profile'));
const Settings = lazy(() => import('@/pages/user/Settings'));
const PasswordChange = lazy(() => import('@/pages/user/PasswordChange'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Users = lazy(() => import('@/pages/admin/Users'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const PageViews = lazy(() => import('@/pages/admin/PageViews'));
const Contacts = lazy(() => import('@/pages/admin/Contacts'));
const SubdomainRequests = lazy(() => import('@/pages/admin/SubdomainRequests'));

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Ensure dark theme is always applied
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    // Remove any light theme references
    root.classList.remove('light');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <PageObserver />
        <div className={`app-container ${isDesktop ? 'desktop' : 'mobile'}`}>
          <Header />

          <main className="main-content pt-0 lg:pt-0">
            <div className="mobile-content-wrapper w-full max-w-[100vw] overflow-x-hidden box-border">
              <Suspense
                fallback={
                  <LoadingStateWrapper
                    isLoading={true}
                    size="lg"
                    className="min-h-screen flex items-center justify-center"
                    showColdStartUI={true}
                    minColdStartThreshold={3000}
                  />
                }
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/articles/:slug" element={<ArticlePage />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Authentication Routes */}
                  <Route path="/auth/signin" element={<SignIn />} />
                  <Route path="/auth/signup" element={<SignUp />} />
                  <Route
                    path="/auth/reset-password"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="/auth/verify-email"
                    element={<EmailVerification />}
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings/password"
                    element={
                      <ProtectedRoute>
                        <PasswordChange />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <Users />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <AdminRoute>
                        <Analytics />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/page-views"
                    element={
                      <AdminRoute>
                        <PageViews />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/contacts"
                    element={
                      <AdminRoute>
                        <Contacts />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/subdomain-requests"
                    element={
                      <AdminRoute>
                        <SubdomainRequests />
                      </AdminRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

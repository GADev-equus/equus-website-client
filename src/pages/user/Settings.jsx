/**
 * Settings Page - Account settings overview page
 * Provides overview of account settings and navigation to specific settings pages
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import authService from '@/services/authService';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  
  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState
  } = useColdStartAwareLoading(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.getCurrentUser();
      if (result.success) {
        setUserProfile(result.user);
      } else {
        setError('Failed to load account data');
      }
    } catch (err) {
      setError('Failed to load account data');
      console.error('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirmingLogout) {
      setConfirmingLogout(true);
      setTimeout(() => setConfirmingLogout(false), 5000); // Reset after 5 seconds
      return;
    }
    
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccountStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'deactivated': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!userProfile) return 0;
    let completed = 0;
    const fields = ['firstName', 'lastName', 'email', 'avatar', 'bio'];
    
    fields.forEach(field => {
      if (userProfile[field]) completed++;
    });
    
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return (
      <UserLayout title="Account Settings">
        <div className="space-y-6">
          {shouldShowColdStartUI && shouldShowColdStartUI() ? (
            <div className="min-h-screen flex items-center justify-center">
              <ColdStartLoader 
                startTime={loadingState?.coldStartTime || Date.now()}
                size="lg"
                className="min-h-screen"
              />
            </div>
          ) : (
            [...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))
          )}
        </div>
      </UserLayout>
    );
  }

  const currentUser = userProfile || user;

  return (
    <UserLayout title="Account Settings">
      <div className="space-y-8">
        <div className="equus-section">
          {/* Page Header */}
          <Card className="equus-card">
            <CardHeader>
              <CardTitle className="text-2xl">Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences, security settings, and personal information
              </CardDescription>
            </CardHeader>
          </Card>

          {error && (
            <Alert className="border-destructive">
              <AlertDescription className="text-destructive">
                {error}
                <Button variant="outline" size="sm" onClick={loadUserData} className="ml-2">
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 equus-gap-lg">
            {/* Profile Information */}
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Profile Information</CardDescription>
                <CardTitle className="text-lg">{currentUser?.firstName} {currentUser?.lastName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                  {currentUser?.username && (
                    <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{currentUser?.role || 'user'}</Badge>
                    <Badge className={getAccountStatusColor(currentUser?.accountStatus)}>
                      {currentUser?.accountStatus || 'active'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Profile Completion</CardDescription>
                <CardTitle className="text-lg">{getProfileCompletionPercentage()}%</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProfileCompletionPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getProfileCompletionPercentage() < 100 ? 'Complete your profile for better experience' : 'Profile completed!'}
                </p>
              </CardContent>
            </Card>

            {/* Email Status */}
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Email Verification</CardDescription>
                <CardTitle className="text-lg">
                  {currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center gap-2">
                  {currentUser?.emailVerified ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <span>✓</span>
                      <span className="text-sm">Email verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <span>⚠</span>
                      <span className="text-sm">Please verify your email</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="equus-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common account management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/profile">
                    👤 Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/settings/password">
                    🔒 Change Password
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={loadUserData}
                >
                  🔄 Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 equus-gap-xl">
            {/* Security Information */}
            <Card className="equus-card">
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Your account security information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${currentUser?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm">Email Verification</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {currentUser?.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${currentUser?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">Account Status</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {currentUser?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Two-Factor Auth</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Not Available
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Login Security</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {currentUser?.loginAttempts > 0 ? `${currentUser.loginAttempts} attempts` : 'Good'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Activity */}
            <Card className="equus-card">
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Recent account activity and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Login</span>
                    <span className="text-sm font-medium">
                      {formatDate(currentUser?.lastLogin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm font-medium">
                      {formatDate(currentUser?.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profile Updated</span>
                    <span className="text-sm font-medium">
                      {formatDate(currentUser?.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Type</span>
                    <Badge variant="secondary">{currentUser?.role || 'user'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy & Data */}
          <Card className="equus-card">
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>Manage your privacy settings and data preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Data Export</h4>
                    <p className="text-xs text-muted-foreground">Download a copy of your account data</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Delete Account</h4>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card className="equus-card border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Sign Out</CardTitle>
              <CardDescription>Sign out of your account on this device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    You will need to sign in again to access your account
                  </p>
                </div>
                <Button 
                  variant={confirmingLogout ? "destructive" : "outline"}
                  onClick={handleLogout}
                  className={confirmingLogout ? "animate-pulse" : ""}
                >
                  {confirmingLogout ? "Click Again to Confirm" : "Sign Out"}
                </Button>
              </div>
              {confirmingLogout && (
                <p className="text-xs text-muted-foreground mt-2">
                  Click the button again within 5 seconds to confirm sign out
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default Settings;
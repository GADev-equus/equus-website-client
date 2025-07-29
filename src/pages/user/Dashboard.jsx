/**
 * User Dashboard Page - Personal dashboard for regular users
 * Displays personal information, account status, and user-specific actions
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import SubdomainAccessCard from '@/components/subdomain/SubdomainAccessCard';
import { useAuth } from '@/contexts/AuthContext';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import authService from '@/services/authService';

const Dashboard = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  
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
      
      // Get current user profile
      const profileResponse = await authService.getCurrentUser();
      if (profileResponse.success) {
        setUserProfile(profileResponse.user);
      }
    } catch (err) {
      setError('Failed to load user data');
      console.error('User dashboard error:', err);
    } finally {
      setLoading(false);
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

  const getDaysSinceRegistration = () => {
    if (!userProfile?.createdAt) return 0;
    const registrationDate = new Date(userProfile.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - registrationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      <UserLayout title="Dashboard">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      </UserLayout>
    );
  }

  const currentUser = userProfile || user;

  return (
    <UserLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={loadUserData} className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Welcome back, {currentUser?.firstName}!</CardTitle>
            <CardDescription>
              Here's your personal dashboard with account information and quick actions.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Profile</CardDescription>
              <CardTitle className="text-lg">{currentUser?.firstName} {currentUser?.lastName}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{currentUser?.role || 'user'}</Badge>
                  <Badge className={getAccountStatusColor(currentUser?.accountStatus)}>
                    {currentUser?.accountStatus || 'active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Email Status</CardDescription>
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

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Profile Completion</CardDescription>
              <CardTitle className="text-lg">{getProfileCompletionPercentage()}%</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProfileCompletionPercentage()}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>Your recent account information</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-sm font-medium">
                    {formatDate(currentUser?.lastLogin)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Registration Date</span>
                  <span className="text-sm font-medium">
                    {formatDate(currentUser?.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Days Active</span>
                  <span className="text-sm font-medium">
                    {getDaysSinceRegistration()} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge className={getAccountStatusColor(currentUser?.accountStatus)}>
                    {currentUser?.accountStatus || 'active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common account management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <Button variant="outline" className="w-full justify-start h-11 text-sm" asChild>
                <Link to="/profile">
                  👤 Edit Profile
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-11 text-sm" asChild>
                <Link to="/settings">
                  ⚙️ Account Settings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-11 text-sm" asChild>
                <Link to="/settings/password">
                  🔒 Change Password
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-11 text-sm"
                onClick={loadUserData}
              >
                🔄 Refresh Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Protected Resources Access */}
        <SubdomainAccessCard />

        {/* Security Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Security Status</CardTitle>
            <CardDescription>Your account security information</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center justify-between gap-2 p-2 sm:p-0">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentUser?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm">Email Verification</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentUser?.emailVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-2 sm:p-0">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentUser?.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">Account Status</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentUser?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-2 sm:p-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">Security</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentUser?.loginAttempts > 0 ? `${currentUser.loginAttempts} attempts` : 'Good'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Information (if applicable) */}
        {currentUser?.referralCode && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Referral Information</CardTitle>
              <CardDescription>Your personal referral code</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Your referral code:</p>
                  <p className="text-lg font-mono font-bold break-all">{currentUser.referralCode}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => navigator.clipboard.writeText(currentUser.referralCode)}
                >
                  Copy Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  );
};

export default Dashboard;
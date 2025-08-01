/**
 * User Dashboard Page - Personal dashboard for regular users
 * Displays personal information, account status, and user-specific actions
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '@/components/layout/UserLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import SubdomainAccessCard from '@/components/subdomain/SubdomainAccessCard';
import { useAuth } from '@/contexts/AuthContext';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import authService from '@/services/authService';

// Placeholder for icons - replace with your actual icon library imports
const UserIcon = () => <span>👤</span>;
const EmailIcon = () => <span>✉️</span>;
const ShieldIcon = () => <span>🛡️</span>;
const CalendarIcon = () => <span>📅</span>;
const SettingsIcon = () => <span>⚙️</span>;
const LockIcon = () => <span>🔒</span>;
const RefreshIcon = () => <span>🔄</span>;
const CopyIcon = () => <span>📋</span>;
const CheckIcon = () => <span>✓</span>;
const WarningIcon = () => <span>⚠️</span>;

const Dashboard = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState,
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
      minute: '2-digit',
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
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'deactivated':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!userProfile) return 0;
    let completed = 0;
    const fields = ['firstName', 'lastName', 'email', 'avatar', 'bio'];

    fields.forEach((field) => {
      if (userProfile[field]) completed++;
    });

    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return (
      <UserLayout title="Dashboard">
        <div className="space-y-6 px-1 sm:px-0">
          {shouldShowColdStartUI && shouldShowColdStartUI() ? (
            <div className="min-h-screen flex items-center justify-center">
              <ColdStartLoader
                startTime={loadingState?.coldStartTime || Date.now()}
                size="lg"
                className="min-h-screen"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="space-y-6 px-1 sm:px-0">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadUserData}
                className="mt-2"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Consolidated Header Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="lg:flex-shrink-0 lg:w-1/3">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome back, {currentUser?.firstName}! 👋
                </CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Here's a summary of your account and recent activity.
                </CardDescription>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <p className="text-sm text-muted-foreground">
                    Profile Completion
                  </p>
                  <p className="text-2xl font-bold">
                    {getProfileCompletionPercentage()}%
                  </p>
                  <div className="progress-equus">
                    <div
                      className="progress-fill-equus"
                      style={{ width: `${getProfileCompletionPercentage()}%` }}
                    />
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <p className="text-sm text-muted-foreground">Email Status</p>
                  <p
                    className={`text-2xl font-bold ${
                      currentUser?.emailVerified
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {currentUser?.emailVerified ? 'Verified' : 'Pending'}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {currentUser?.emailVerified ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <WarningIcon className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <p className="text-sm text-muted-foreground">
                    Account Status
                  </p>
                  <Badge
                    className={`mt-2 ${getAccountStatusColor(
                      currentUser?.accountStatus,
                    )}`}
                  >
                    {currentUser?.accountStatus || 'active'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Overview Card */}
            <Card className="shadow-sm h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Account Overview
                </CardTitle>
                <CardDescription>
                  Your recent activity and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="text-sm font-medium truncate">
                      {formatDate(currentUser?.lastLogin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Member Since
                    </p>
                    <p className="text-sm font-medium truncate">
                      {formatDate(currentUser?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Days Active</p>
                    <p className="text-sm font-medium">
                      {getDaysSinceRegistration()} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {currentUser?.role || 'user'}
                    </Badge>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Security Status</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            currentUser?.emailVerified
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <span className="text-sm">Email Verification</span>
                      </div>
                      <Badge
                        variant={
                          currentUser?.emailVerified ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {currentUser?.emailVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            currentUser?.isActive
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-sm">Account Status</span>
                      </div>
                      <Badge
                        variant={
                          currentUser?.isActive ? 'default' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {currentUser?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm">Login Attempts</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {currentUser?.loginAttempts > 0
                          ? `${currentUser.loginAttempts} attempts`
                          : 'Good'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Information (if applicable) */}
            {currentUser?.referralCode && (
              <Card className="shadow-sm h-fit">
                <CardHeader>
                  <CardTitle>Referral Information</CardTitle>
                  <CardDescription>
                    Share this code with friends to earn rewards.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">
                        Your referral code:
                      </p>
                      <p className="text-lg font-mono font-bold bg-gray-100 dark:bg-gray-800 p-2 rounded-md break-all">
                        {currentUser.referralCode}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto gap-2"
                      onClick={() =>
                        navigator.clipboard.writeText(currentUser.referralCode)
                      }
                    >
                      <CopyIcon className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="shadow-sm border-primary/20 dark:border-primary/10 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks to manage your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-11 text-sm gap-2"
                  asChild
                >
                  <Link to="/profile">
                    <UserIcon className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-11 text-sm gap-2"
                  asChild
                >
                  <Link to="/settings">
                    <SettingsIcon className="h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-11 text-sm gap-2"
                  asChild
                >
                  <Link to="/settings/password">
                    <LockIcon className="h-4 w-4" />
                    Change Password
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-11 text-sm gap-2"
                  onClick={loadUserData}
                >
                  <RefreshIcon className="h-4 w-4" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Protected Resources Access - Full Width */}
        <SubdomainAccessCard />
      </div>
    </UserLayout>
  );
};

export default Dashboard;

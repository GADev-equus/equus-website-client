/**
 * Admin Dashboard Page - Main admin overview page
 * Displays system statistics, recent activity, and quick access to admin functions
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CardSkeleton,
  UserListSkeleton,
} from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { useToast } from '@/components/ui/toast';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import { cn } from '@/lib/utils';
import userService from '@/services/userService';
import adminContactService from '@/services/adminContactService';
import subdomainRequestService from '@/services/subdomainRequestService';

// Placeholder for icons - replace with your actual icon library imports
const UsersIcon = () => <span>👥</span>;
const ChartIcon = () => <span>📈</span>;
const DocumentIcon = () => <span>📄</span>;
const MailIcon = () => <span>📩</span>;
const KeyIcon = () => <span>🔑</span>;
const RefreshIcon = () => <span>🔄</span>;
const SettingsIcon = () => <span>⚙️</span>;
const CalendarIcon = () => <span>📅</span>;
const ShieldIcon = () => <span>🛡️</span>;

const Dashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    adminUsers: 0,
  });
  const [contactStats, setContactStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [subdomainRequestStats, setSubdomainRequestStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    denied: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [error, setError] = useState(null);

  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState,
  } = useColdStartAwareLoading(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user statistics
      const statsResponse = await userService.getUserStats();
      if (statsResponse.success) {
        setStats({
          totalUsers: statsResponse.stats?.totalUsers || 0,
          activeUsers: statsResponse.stats?.activeUsers || 0,
          newUsersToday: statsResponse.stats?.newUsersToday || 0,
          adminUsers: statsResponse.stats?.adminUsers || 0,
        });
      }

      // Load contact statistics
      try {
        const contactStatsResponse =
          await adminContactService.getContactStats();
        if (contactStatsResponse && contactStatsResponse.success) {
          setContactStats(contactStatsResponse.stats || {});
        }
      } catch (contactErr) {
        console.error('Contact stats error:', contactErr);
        setContactStats({
          total: 0,
          pending: 0,
          read: 0,
          replied: 0,
          archived: 0,
        });
      }

      // Load subdomain request statistics
      try {
        console.log(
          '🔍 Admin Dashboard: Loading subdomain request statistics...',
        );
        const subdomainStatsResponse =
          await subdomainRequestService.getRequestStats();
        console.log(
          '📊 Admin Dashboard: Subdomain stats response:',
          subdomainStatsResponse,
        );

        if (subdomainStatsResponse && subdomainStatsResponse.success) {
          console.log(
            '✅ Admin Dashboard: Subdomain stats loaded:',
            subdomainStatsResponse.stats,
          );
          setSubdomainRequestStats(subdomainStatsResponse.stats || {});
        } else {
          console.warn(
            '⚠️ Admin Dashboard: Subdomain stats request unsuccessful:',
            subdomainStatsResponse,
          );
          setSubdomainRequestStats({
            total: 0,
            pending: 0,
            approved: 0,
            denied: 0,
          });
        }
      } catch (subdomainErr) {
        console.error(
          '❌ Admin Dashboard: Subdomain request stats error:',
          subdomainErr,
        );
        setSubdomainRequestStats({
          total: 0,
          pending: 0,
          approved: 0,
          denied: 0,
        });
      }

      // Load recent users (limited to 3)
      const usersResponse = await userService.getAllUsers({
        limit: 3,
        sort: 'createdAt',
        order: 'desc',
      });
      if (usersResponse.success) {
        setRecentUsers(usersResponse.users || []);
      }

      // Load recent contacts (limited to 3)
      try {
        const contactsResponse = await adminContactService.getRecentContacts(3);
        if (contactsResponse && contactsResponse.success) {
          setRecentContacts(contactsResponse.contacts || []);
        }
      } catch (contactErr) {
        console.error('Recent contacts error:', contactErr);
        setRecentContacts([]);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
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
            <>
              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>

              {/* Quick Actions and Recent Activity Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-10 bg-muted rounded-md animate-pulse" />
                    <div className="h-10 bg-muted rounded-md animate-pulse" />
                    <div className="h-10 bg-muted rounded-md animate-pulse" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-border"
                        >
                          <div className="space-y-1">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                          </div>
                          <div className="text-right space-y-1">
                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                            <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Contacts</CardTitle>
                    <CardDescription>
                      Latest contact submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-border"
                        >
                          <div className="space-y-1">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                          </div>
                          <div className="text-right space-y-1">
                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                            <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Status Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current system health and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-muted rounded-full animate-pulse" />
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-12 bg-muted rounded animate-pulse ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 lg:space-y-8 px-1 sm:px-0">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                className="mt-2"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-950 to-indigo-950 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-100">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-base text-gray-300">
              Overview of your system's health and activity.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <UsersIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeUsers} active
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Contacts
              </CardTitle>
              <MailIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {contactStats.pending}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {contactStats.total} total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Access Requests
              </CardTitle>
              <KeyIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {subdomainRequestStats.pending}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {subdomainRequestStats.total} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* System Activity */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  System Activity
                </CardTitle>
                <CardDescription>
                  Key statistics and recent system information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Users
                  </span>
                  <span className="text-sm font-medium">
                    {stats.activeUsers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    New Today
                  </span>
                  <span className="text-sm font-medium">
                    {stats.newUsersToday}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Admins</span>
                  <span className="text-sm font-medium">
                    {stats.adminUsers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Contacts
                  </span>
                  <span className="text-sm font-medium">
                    {contactStats.total}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/users">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-11 text-sm gap-2"
                  >
                    <UsersIcon className="h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-11 text-sm gap-2"
                  >
                    <ChartIcon className="h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link to="/admin/page-views">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-11 text-sm gap-2"
                  >
                    <DocumentIcon className="h-4 w-4" />
                    Page Views Analytics
                  </Button>
                </Link>
                <Link to="/admin/contacts">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-11 text-sm gap-2"
                  >
                    <MailIcon className="h-4 w-4" />
                    Manage Contacts
                    {contactStats.pending > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {contactStats.pending}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/admin/subdomain-requests">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-11 text-sm gap-2"
                  >
                    <KeyIcon className="h-4 w-4" />
                    Subdomain Requests
                    {subdomainRequestStats.pending > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {subdomainRequestStats.pending}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start h-11 text-sm gap-2"
                  onClick={loadDashboardData}
                >
                  <RefreshIcon className="h-4 w-4" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Users */}
            <Card className="shadow-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {recentUsers.length > 0 ? (
                  <div className="space-y-3">
                    {recentUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </p>
                          <Badge
                            variant={
                              user.status === 'active' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Link to="/admin/users">
                      <Button variant="ghost" size="sm" className="w-full mt-3">
                        View All Users →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No recent users
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Contacts */}
            <Card className="shadow-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle>Recent Contacts</CardTitle>
                <CardDescription>
                  Latest contact form submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {recentContacts.length > 0 ? (
                  <div className="space-y-3">
                    {recentContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contact.email}
                          </p>
                          {contact.subject && (
                            <p className="text-xs text-muted-foreground">
                              Subject: {contact.subject}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(contact.createdAt)}
                          </p>
                          <Badge variant={contact.status} className="text-xs">
                            {contact.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Link to="/admin/contacts">
                      <Button variant="ghost" size="sm" className="w-full mt-3">
                        View All Contacts →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No recent contacts
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status - Full Width */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Current system health and information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">API Service</span>
                </div>
                <Badge variant="default" className="text-xs">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge variant="default" className="text-xs">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Email Service</span>
                </div>
                <Badge variant="default" className="text-xs">
                  Available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

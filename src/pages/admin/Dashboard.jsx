/**
 * Admin Dashboard Page - Main admin overview page
 * Displays system statistics, recent activity, and quick access to admin functions
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSkeleton, UserListSkeleton } from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { useToast } from '@/components/ui/toast';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import { cn } from '@/lib/utils';
import userService from '@/services/userService';
import adminContactService from '@/services/adminContactService';
import subdomainRequestService from '@/services/subdomainRequestService';

const Dashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    adminUsers: 0
  });
  const [contactStats, setContactStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    archived: 0
  });
  const [subdomainRequestStats, setSubdomainRequestStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    denied: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [error, setError] = useState(null);
  
  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState
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
          adminUsers: statsResponse.stats?.adminUsers || 0
        });
      }
      
      // Load contact statistics
      try {
        const contactStatsResponse = await adminContactService.getContactStats();
        if (contactStatsResponse && contactStatsResponse.success) {
          setContactStats(contactStatsResponse.stats || {});
        }
      } catch (contactErr) {
        console.error('Contact stats error:', contactErr);
        // Don't fail the whole dashboard if contact stats fail
        // Set default empty stats to prevent UI errors
        setContactStats({
          total: 0,
          pending: 0,
          read: 0,
          replied: 0,
          archived: 0
        });
      }

      // Load subdomain request statistics
      try {
        console.log('🔍 Admin Dashboard: Loading subdomain request statistics...');
        const subdomainStatsResponse = await subdomainRequestService.getRequestStats();
        console.log('📊 Admin Dashboard: Subdomain stats response:', subdomainStatsResponse);
        
        if (subdomainStatsResponse && subdomainStatsResponse.success) {
          console.log('✅ Admin Dashboard: Subdomain stats loaded:', subdomainStatsResponse.stats);
          setSubdomainRequestStats(subdomainStatsResponse.stats || {});
        } else {
          console.warn('⚠️ Admin Dashboard: Subdomain stats request unsuccessful:', subdomainStatsResponse);
          setSubdomainRequestStats({
            total: 0,
            pending: 0,
            approved: 0,
            denied: 0
          });
        }
      } catch (subdomainErr) {
        console.error('❌ Admin Dashboard: Subdomain request stats error:', subdomainErr);
        // Don't fail the whole dashboard if subdomain stats fail
        setSubdomainRequestStats({
          total: 0,
          pending: 0,
          approved: 0,
          denied: 0
        });
      }
      
      // Load recent users (limited to 3)
      const usersResponse = await userService.getAllUsers({ limit: 3, sort: 'createdAt', order: 'desc' });
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
        // Don't fail the whole dashboard if recent contacts fail
        // Set empty array to prevent UI errors
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
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
            <>
              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>

              {/* Quick Actions and Recent Activity Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
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
                        <div key={i} className="flex items-center justify-between py-2 border-b border-border">
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
                    <CardDescription>Latest contact submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-border">
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
                  <CardDescription>Current system health and information</CardDescription>
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
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Enhanced spacing section */}
        <div className="equus-section">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={loadDashboardData} className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-6">
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">{stats.activeUsers}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>New Today</CardDescription>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">{stats.newUsersToday}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Administrators</CardDescription>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">{stats.adminUsers}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Admin accounts</p>
            </CardContent>
          </Card>

          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Total Contacts</CardDescription>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">{contactStats.total}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Form submissions</p>
            </CardContent>
          </Card>

          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Pending Contacts</CardDescription>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-orange-600">{contactStats.pending}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Access Requests</CardDescription>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-purple-600">{subdomainRequestStats.pending}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <Card className="equus-card">
            <CardHeader className="pb-4">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start h-11 text-sm">
                  👥 Manage Users
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full justify-start h-11 text-sm">
                  📈 View Analytics
                </Button>
              </Link>
              <Link to="/admin/page-views">
                <Button variant="outline" className="w-full justify-start h-11 text-sm">
                  📄 Page Views Analytics
                </Button>
              </Link>
              <Link to="/admin/contacts">
                <Button variant="outline" className="w-full justify-start h-11 text-sm">
                  📩 Manage Contacts
                  {contactStats.pending > 0 && (
                    <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {contactStats.pending}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/admin/subdomain-requests">
                <Button variant="outline" className="w-full justify-start h-11 text-sm">
                  🔑 Subdomain Requests
                  {subdomainRequestStats.pending > 0 && (
                    <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      {subdomainRequestStats.pending}
                    </span>
                  )}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={loadDashboardData}
              >
                🔄 Refresh Data
              </Button>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="equus-card">
            <CardHeader className="pb-4">
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
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
                        <span className={cn(
                          "inline-block px-3 py-2 rounded-full text-xs",
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        )}>
                          {user.status}
                        </span>
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
                <p className="text-muted-foreground text-sm">No recent users</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card className="equus-card">
            <CardHeader className="pb-4">
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>Latest contact form submissions</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {recentContacts.length > 0 ? (
                <div className="space-y-3">
                  {recentContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">
                          {contact.name}
                        </p>
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
                        <span className={cn(
                          "inline-block px-3 py-2 rounded-full text-xs",
                          contact.status === 'pending' && 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
                          contact.status === 'read' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                          contact.status === 'replied' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                          !['pending', 'read', 'replied'].includes(contact.status) && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        )}>
                          {contact.status}
                        </span>
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
                <p className="text-muted-foreground text-sm">No recent contacts</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="equus-card">
          <CardHeader className="pb-4">
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and information</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">API Service</span>
                <span className="text-xs text-muted-foreground ml-auto">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Database</span>
                <span className="text-xs text-muted-foreground ml-auto">Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Email Service</span>
                <span className="text-xs text-muted-foreground ml-auto">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
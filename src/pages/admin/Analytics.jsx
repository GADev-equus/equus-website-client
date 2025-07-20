/**
 * Admin Analytics Page - Analytics and statistics page
 * Comprehensive analytics dashboard with user metrics, system statistics, and trends
 */

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import userService from '@/services/userService';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      suspendedUsers: 0,
      adminUsers: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0
    },
    registrationTrends: [],
    userActivity: [],
    systemMetrics: {
      totalLogins: 0,
      failedLogins: 0,
      avgSessionTime: 0,
      topUserAgents: [],
      topLocations: []
    }
  });
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState
  } = useColdStartAwareLoading(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load comprehensive user statistics
      const statsResponse = await userService.getUserStats({ period: selectedPeriod });
      if (statsResponse.success) {
        setAnalytics(prev => ({
          ...prev,
          userStats: {
            totalUsers: statsResponse.stats?.totalUsers || 0,
            activeUsers: statsResponse.stats?.activeUsers || 0,
            inactiveUsers: statsResponse.stats?.inactiveUsers || 0,
            suspendedUsers: statsResponse.stats?.suspendedUsers || 0,
            adminUsers: statsResponse.stats?.adminUsers || 0,
            newUsersToday: statsResponse.stats?.newUsersToday || 0,
            newUsersThisWeek: statsResponse.stats?.newUsersThisWeek || 0,
            newUsersThisMonth: statsResponse.stats?.newUsersThisMonth || 0
          },
          registrationTrends: statsResponse.stats?.registrationTrends || [],
          userActivity: statsResponse.stats?.userActivity || [],
          systemMetrics: {
            totalLogins: statsResponse.stats?.totalLogins || 0,
            failedLogins: statsResponse.stats?.failedLogins || 0,
            avgSessionTime: statsResponse.stats?.avgSessionTime || 0,
            topUserAgents: statsResponse.stats?.topUserAgents || [],
            topLocations: statsResponse.stats?.topLocations || []
          }
        }));
      }
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getGrowthIndicator = (current, previous) => {
    if (previous === 0) return { value: 0, trend: 'neutral' };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          {shouldShowColdStartUI && shouldShowColdStartUI() ? (
            <ColdStartLoader 
              startTime={loadingState?.coldStartTime || Date.now()}
              size="lg"
              className="min-h-screen"
            />
          ) : (
            <div className="text-muted-foreground">Loading analytics...</div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-8">
        {/* Enhanced spacing section */}
        <div className="equus-section">
        {error && (
          <Card className="border-destructive equus-card">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={loadAnalytics} className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Period Selector */}
        <Card className="equus-card">
          <CardHeader>
            <CardTitle>Analytics Period</CardTitle>
            <CardDescription>Select time period for analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[
                { value: '24h', label: 'Last 24 Hours' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '90d', label: 'Last 90 Days' }
              ].map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 equus-gap-lg">
          <Card className="equus-card">
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-2xl">{analytics.userStats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All registered accounts</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-2">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {analytics.userStats.activeUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(analytics.userStats.activeUsers, analytics.userStats.totalUsers)} of total
              </p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-2">
              <CardDescription>New This Month</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {analytics.userStats.newUsersThisMonth}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Monthly registrations</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-2">
              <CardDescription>Administrators</CardDescription>
              <CardTitle className="text-2xl text-purple-600">
                {analytics.userStats.adminUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(analytics.userStats.adminUsers, analytics.userStats.totalUsers)} of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 equus-gap-xl">
          <Card className="equus-card">
            <CardHeader>
              <CardTitle>User Status Distribution</CardTitle>
              <CardDescription>Current user account status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{analytics.userStats.activeUsers}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatPercentage(analytics.userStats.activeUsers, analytics.userStats.totalUsers)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm">Inactive</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{analytics.userStats.inactiveUsers}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatPercentage(analytics.userStats.inactiveUsers, analytics.userStats.totalUsers)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Suspended</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{analytics.userStats.suspendedUsers}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatPercentage(analytics.userStats.suspendedUsers, analytics.userStats.totalUsers)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="equus-card">
            <CardHeader>
              <CardTitle>Registration Trends</CardTitle>
              <CardDescription>New user registration statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today</span>
                  <span className="font-medium">{analytics.userStats.newUsersToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Week</span>
                  <span className="font-medium">{analytics.userStats.newUsersThisWeek}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <span className="font-medium">{analytics.userStats.newUsersThisMonth}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Daily Average: {Math.round(analytics.userStats.newUsersThisMonth / 30)} users
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <Card className="equus-card">
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>Authentication and system performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {analytics.systemMetrics.totalLogins}
                </div>
                <div className="text-sm text-muted-foreground">Total Logins</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {analytics.systemMetrics.failedLogins}
                </div>
                <div className="text-sm text-muted-foreground">Failed Logins</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPercentage(
                    analytics.systemMetrics.totalLogins - analytics.systemMetrics.failedLogins,
                    analytics.systemMetrics.totalLogins
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatDuration(analytics.systemMetrics.avgSessionTime)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Session</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top User Agents & Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 equus-gap-xl">
          <Card className="equus-card">
            <CardHeader>
              <CardTitle>Top User Agents</CardTitle>
              <CardDescription>Most common browsers and devices</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.systemMetrics.topUserAgents.length > 0 ? (
                <div className="space-y-2">
                  {analytics.systemMetrics.topUserAgents.slice(0, 5).map((agent, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm truncate">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">{agent.count} users</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No user agent data available</p>
              )}
            </CardContent>
          </Card>

          <Card className="equus-card">
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>Most common user locations</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.systemMetrics.topLocations.length > 0 ? (
                <div className="space-y-2">
                  {analytics.systemMetrics.topLocations.slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm">{location.name}</span>
                      <span className="text-xs text-muted-foreground">{location.count} users</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No location data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <Card className="equus-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              <Button onClick={loadAnalytics} variant="outline">
                🔄 Refresh Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
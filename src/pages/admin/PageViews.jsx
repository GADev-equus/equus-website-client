/**
 * Admin Page Views Analytics - Comprehensive page views and traffic analytics
 * Displays website traffic, page performance, and visitor analytics
 */

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import analyticsService from '@/services/analyticsService';

const PageViews = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalPageViews: 0,
      uniqueVisitors: 0,
      authenticatedPageViews: 0,
      averageResponseTime: 0,
      topPages: [],
      trafficByHour: [],
      statusCodeStats: []
    },
    traffic: {
      trafficData: [],
      userTypeBreakdown: [],
      methodBreakdown: [],
      referrerStats: []
    },
    performance: {
      performanceData: [],
      overallStats: {}
    },
    users: {
      userAnalytics: [],
      activitySummary: {}
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [overviewData, trafficData, performanceData, userData] = await Promise.all([
        analyticsService.getOverview(selectedPeriod),
        analyticsService.getTrafficAnalytics(selectedPeriod),
        analyticsService.getPagePerformance(selectedPeriod),
        analyticsService.getUserAnalytics(selectedPeriod)
      ]);

      if (overviewData.success) {
        setAnalytics(prev => ({
          ...prev,
          overview: overviewData.data
        }));
      }

      if (trafficData.success) {
        setAnalytics(prev => ({
          ...prev,
          traffic: trafficData.data
        }));
      }

      if (performanceData.success) {
        setAnalytics(prev => ({
          ...prev,
          performance: performanceData.data
        }));
      }

      if (userData.success) {
        setAnalytics(prev => ({
          ...prev,
          users: userData.data
        }));
      }

    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatResponseTime = (ms) => {
    if (ms >= 1000) {
      return (ms / 1000).toFixed(2) + 's';
    }
    return Math.round(ms) + 'ms';
  };

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600';
    if (statusCode >= 300 && statusCode < 400) return 'text-blue-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600';
    if (statusCode >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={() => onClick(id)}
      className="flex-1 sm:flex-none"
    >
      {label}
    </Button>
  );

  if (loading) {
    return (
      <AdminLayout title="Page Views Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Page Views Analytics">
      <div className="space-y-6">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={loadAnalytics} className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Period Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Period</CardTitle>
            <CardDescription>Select time period for analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                { value: '1h', label: 'Last Hour' },
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

        {/* Tab Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <TabButton
                id="overview"
                label="Overview"
                isActive={activeTab === 'overview'}
                onClick={setActiveTab}
              />
              <TabButton
                id="traffic"
                label="Traffic"
                isActive={activeTab === 'traffic'}
                onClick={setActiveTab}
              />
              <TabButton
                id="performance"
                label="Performance"
                isActive={activeTab === 'performance'}
                onClick={setActiveTab}
              />
              <TabButton
                id="users"
                label="Users"
                isActive={activeTab === 'users'}
                onClick={setActiveTab}
              />
            </div>
          </CardContent>
        </Card>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Page Views</CardDescription>
                  <CardTitle className="text-2xl">{formatNumber(analytics.overview.totalPageViews)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">All page requests</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Unique Visitors</CardDescription>
                  <CardTitle className="text-2xl text-blue-600">
                    {formatNumber(analytics.overview.uniqueVisitors)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Unique sessions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Authenticated Views</CardDescription>
                  <CardTitle className="text-2xl text-green-600">
                    {formatNumber(analytics.overview.authenticatedPageViews)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(analytics.overview.authenticatedPageViews, analytics.overview.totalPageViews)} of total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Response Time</CardDescription>
                  <CardTitle className="text-2xl text-purple-600">
                    {formatResponseTime(analytics.overview.averageResponseTime)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Server response time</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Pages & Status Codes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.overview.topPages?.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.overview.topPages.slice(0, 10).map((page, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex-1">
                            <span className="text-sm font-medium truncate block">{page.path}</span>
                            <span className="text-xs text-muted-foreground">{page.uniqueVisitors} unique visitors</span>
                          </div>
                          <span className="text-sm font-medium">{formatNumber(page.count)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No page data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status Code Distribution</CardTitle>
                  <CardDescription>HTTP response status codes</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.overview.statusCodeStats?.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.overview.statusCodeStats.map((status, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className={`text-sm font-medium ${getStatusColor(status._id)}`}>
                            {status._id}
                          </span>
                          <span className="text-sm">{formatNumber(status.count)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No status code data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* User Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Type Breakdown</CardTitle>
                  <CardDescription>Authenticated vs anonymous users</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.traffic.userTypeBreakdown?.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.traffic.userTypeBreakdown.map((type, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${type.userType === 'authenticated' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                            <span className="text-sm capitalize">{type.userType}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatNumber(type.count)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {type.uniqueVisitors} visitors
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No user type data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>HTTP Methods</CardTitle>
                  <CardDescription>Request methods distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.traffic.methodBreakdown?.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.traffic.methodBreakdown.map((method, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-sm font-medium">{method._id}</span>
                          <span className="text-sm">{formatNumber(method.count)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No method data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Traffic Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Over Time</CardTitle>
                <CardDescription>Page views and visitors over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.traffic.trafficData?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">
                          {analytics.traffic.trafficData.reduce((sum, item) => sum + item.pageViews, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Views</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">
                          {analytics.traffic.trafficData.reduce((sum, item) => sum + item.uniqueVisitors, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Visitors</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">
                          {analytics.traffic.trafficData.reduce((sum, item) => sum + item.authenticatedUsers, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Authenticated Users</div>
                      </div>
                    </div>
                    <div className="h-48 flex items-end gap-1">
                      {analytics.traffic.trafficData.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${(item.pageViews / Math.max(...analytics.traffic.trafficData.map(d => d.pageViews))) * 100}%` }}
                          ></div>
                          <div className="text-xs text-muted-foreground mt-1 truncate">
                            {item.period}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No traffic data available</p>
                )}
              </CardContent>
            </Card>

            {/* Top Referrers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Traffic sources</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.traffic.referrerStats?.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.traffic.referrerStats.map((referrer, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm truncate">{referrer._id}</span>
                        <span className="text-sm font-medium">{formatNumber(referrer.count)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No referrer data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Overall Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
                <CardDescription>System performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {formatNumber(analytics.performance.overallStats?.totalRequests || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatResponseTime(analytics.performance.overallStats?.avgResponseTime || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analytics.performance.overallStats?.slowRequestsPercentage || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Slow Requests</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {analytics.performance.overallStats?.errorRate || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Error Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Page Performance Details */}
            <Card>
              <CardHeader>
                <CardTitle>Page Performance</CardTitle>
                <CardDescription>Individual page performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.performance.performanceData?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Page</th>
                          <th className="text-right p-2">Views</th>
                          <th className="text-right p-2">Visitors</th>
                          <th className="text-right p-2">Avg Time</th>
                          <th className="text-right p-2">Error Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.performance.performanceData.slice(0, 10).map((page, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 truncate max-w-xs">{page.path}</td>
                            <td className="p-2 text-right">{formatNumber(page.totalViews)}</td>
                            <td className="p-2 text-right">{formatNumber(page.uniqueVisitors)}</td>
                            <td className="p-2 text-right">{formatResponseTime(page.avgResponseTime)}</td>
                            <td className="p-2 text-right">
                              <span className={page.errorRate > 5 ? 'text-red-600' : 'text-green-600'}>
                                {page.errorRate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No performance data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity Summary</CardTitle>
                <CardDescription>Authenticated user activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {formatNumber(analytics.users.activitySummary?.totalAuthenticatedViews || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(analytics.users.activitySummary?.uniqueAuthenticatedUsers || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(analytics.users.activitySummary?.avgViewsPerUser || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Views/User</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Active Users */}
            <Card>
              <CardHeader>
                <CardTitle>Most Active Users</CardTitle>
                <CardDescription>Top users by page views</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.users.userAnalytics?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User ID</th>
                          <th className="text-right p-2">Views</th>
                          <th className="text-right p-2">Sessions</th>
                          <th className="text-right p-2">Pages</th>
                          <th className="text-right p-2">Avg Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.users.userAnalytics.slice(0, 10).map((user, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 truncate max-w-xs">{user.userId}</td>
                            <td className="p-2 text-right">{formatNumber(user.totalViews)}</td>
                            <td className="p-2 text-right">{user.uniqueSessions}</td>
                            <td className="p-2 text-right">{user.pagesVisited}</td>
                            <td className="p-2 text-right">{formatResponseTime(user.avgResponseTime)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No user activity data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Refresh Button */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              <Button onClick={loadAnalytics} variant="outline">
                🔄 Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PageViews;
/**
 * Admin Subdomain Requests Page - Manage user access requests for protected subdomains
 * Allows admins to view, approve, and deny access requests
 */

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CardSkeleton } from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { useToast } from '@/components/ui/toast';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import subdomainRequestService from '@/services/subdomainRequestService';

const SubdomainRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    denied: 0
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubdomain, setSelectedSubdomain] = useState('all');
  const [processingRequest, setProcessingRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalType, setModalType] = useState('approve'); // 'approve' or 'deny'
  const [modalMessage, setModalMessage] = useState('');
  const [modalExpiry, setModalExpiry] = useState('');
  
  const toast = useToast();
  
  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState
  } = useColdStartAwareLoading(true);

  useEffect(() => {
    loadRequestsData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, selectedStatus, selectedSubdomain]);

  const loadRequestsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load requests and stats in parallel
      const [requestsResponse, statsResponse] = await Promise.all([
        subdomainRequestService.getAllRequests({ limit: 100 }),
        subdomainRequestService.getRequestStats()
      ]);
      
      if (requestsResponse.success) {
        setRequests(requestsResponse.requests || []);
      } else {
        setError(`Failed to load requests: ${requestsResponse.message || 'Unknown error'}`);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.stats || {});
      }
      // Don't fail the whole page if just stats fail
      
    } catch (err) {
      setError(`Failed to load subdomain requests: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.subdomainName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }
    
    // Subdomain filter
    if (selectedSubdomain !== 'all') {
      filtered = filtered.filter(request => request.subdomainId === selectedSubdomain);
    }
    
    setFilteredRequests(filtered);
  };

  const handleApproveRequest = async (request) => {
    setSelectedRequest(request);
    setModalType('approve');
    setModalMessage('');
    setModalExpiry('');
    setShowApprovalModal(true);
  };

  const handleDenyRequest = async (request) => {
    setSelectedRequest(request);
    setModalType('deny');
    setModalMessage('');
    setShowApprovalModal(true);
  };

  const processRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      setProcessingRequest(selectedRequest.id);
      
      let response;
      if (modalType === 'approve') {
        response = await subdomainRequestService.approveRequest(selectedRequest.id, {
          adminMessage: modalMessage,
          expiresAt: modalExpiry || null
        });
      } else {
        response = await subdomainRequestService.denyRequest(selectedRequest.id, {
          adminMessage: modalMessage
        });
      }
      
      if (response.success) {
        toast.success(`Successfully ${modalType === 'approve' ? 'approved' : 'denied'} access request for ${selectedRequest.subdomainName}`, {
          title: `Request ${modalType === 'approve' ? 'Approved' : 'Denied'}`
        });
        
        // Reload data
        await loadRequestsData();
      } else {
        throw new Error(response.message || `Failed to ${modalType} request`);
      }
      
    } catch (error) {
      toast.error(error.message || `Failed to ${modalType} request. Please try again.`, {
        title: "Error"
      });
    } finally {
      setProcessingRequest(null);
      setShowApprovalModal(false);
      setSelectedRequest(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'denied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'revoked':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getSubdomainIcon = (subdomainId) => {
    return subdomainId === 'ai-trl' ? '🤖' : '📚';
  };

  if (loading) {
    return (
      <AdminLayout title="Subdomain Access Requests">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>

              {/* Filters Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Requests List Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
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
    <AdminLayout title="Subdomain Access Requests">
      <div className="space-y-8">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={loadRequestsData} className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">All time requests</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-2xl text-orange-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.approved}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Access granted</p>
            </CardContent>
          </Card>
          
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Denied</CardDescription>
              <CardTitle className="text-2xl text-red-600">{stats.denied}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-muted-foreground">Access denied</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Requests</CardTitle>
            <CardDescription>Search and filter access requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search by user or subdomain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subdomain</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={selectedSubdomain}
                  onChange={(e) => setSelectedSubdomain(e.target.value)}
                >
                  <option value="all">All Subdomains</option>
                  <option value="ai-trl">AI Training & Learning</option>
                  <option value="ai-tutot">AI Tutorial Platform</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={loadRequestsData} variant="outline" className="w-full">
                  🔄 Refresh
                </Button>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={async () => {
                    try {
                      const statsTest = await subdomainRequestService.getRequestStats();
                      const requestsTest = await subdomainRequestService.getAllRequests({ limit: 10 });
                      toast({
                        title: "API Test",
                        description: `Stats: ${JSON.stringify(statsTest?.stats || {})} | Requests: ${requestsTest?.requests?.length || 0}`,
                        duration: 10000
                      });
                    } catch (error) {
                      toast({
                        title: "API Test Failed",
                        description: error.message,
                        variant: "destructive"
                      });
                    }
                  }}
                  variant="ghost" 
                  className="w-full"
                >
                  🧪 Test API
                </Button>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedSubdomain('all');
                  }}
                  variant="ghost" 
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Access Requests ({filteredRequests.length})</CardTitle>
            <CardDescription>Manage subdomain access requests from users</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {getSubdomainIcon(request.subdomainId)}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {request.userId?.firstName} {request.userId?.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{request.userId?.email}</p>
                        <p className="text-sm font-medium text-blue-600">{request.subdomainName}</p>
                        {request.requestReason && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Reason: {request.requestReason}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Requested: {formatDate(request.createdAt)}
                        </p>
                        {request.reviewedAt && (
                          <p className="text-xs text-muted-foreground">
                            Reviewed: {formatDate(request.reviewedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        {request.adminMessage && (
                          <p className="text-xs text-muted-foreground max-w-48 text-right">
                            Note: {request.adminMessage}
                          </p>
                        )}
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApproveRequest(request)}
                            disabled={processingRequest === request.id}
                            className="bg-green-600 hover:bg-green-700 text-white border-green-600 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                          >
                            {processingRequest === request.id ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span>✓</span>
                                <span>Approve</span>
                              </div>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDenyRequest(request)}
                            disabled={processingRequest === request.id}
                            className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                          >
                            {processingRequest === request.id ? 'Processing...' : 'Deny'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No requests found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval/Denial Modal */}
        {showApprovalModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">
                {modalType === 'approve' ? 'Approve' : 'Deny'} Access Request
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>User:</strong> {selectedRequest.userId?.firstName} {selectedRequest.userId?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Resource:</strong> {selectedRequest.subdomainName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {modalType === 'approve' ? 'Approval' : 'Denial'} Message (Optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    rows="3"
                    placeholder={`Optional message for the user...`}
                    value={modalMessage}
                    onChange={(e) => setModalMessage(e.target.value)}
                  />
                </div>

                {modalType === 'approve' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Access Expiry (Optional)
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      value={modalExpiry}
                      onChange={(e) => setModalExpiry(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty for permanent access
                    </p>
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowApprovalModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={processRequest}
                    disabled={processingRequest === selectedRequest.id}
                    className={modalType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  >
                    {processingRequest === selectedRequest.id ? 'Processing...' : 
                     modalType === 'approve' ? 'Approve Request' : 'Deny Request'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SubdomainRequests;
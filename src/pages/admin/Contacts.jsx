/**
 * Admin Contacts Page - Contact form management interface
 * Allows admins to view, manage, and respond to contact form submissions
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import adminContactService from '@/services/adminContactService';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    archived: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 20
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState
  } = useColdStartAwareLoading(true);

  useEffect(() => {
    loadContacts();
    loadStats();
  }, [filters]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminContactService.getAllContacts(filters);
      if (response && response.success) {
        setContacts(response.contacts || []);
        setPagination(response.pagination || {});
      } else {
        // Handle case where response doesn't have expected structure
        setContacts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      console.error('Load contacts error:', err);
      // Set empty state on error
      setContacts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminContactService.getContactStats();
      if (response && response.success) {
        setStats(response.stats || {});
      } else {
        // Set default stats on invalid response
        setStats({
          total: 0,
          pending: 0,
          read: 0,
          replied: 0,
          archived: 0
        });
      }
    } catch (err) {
      console.error('Load stats error:', err);
      // Set default stats on error
      setStats({
        total: 0,
        pending: 0,
        read: 0,
        replied: 0,
        archived: 0
      });
    }
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      const response = await adminContactService.updateContactStatus(contactId, newStatus);
      if (response && response.success) {
        setSuccess(`Contact marked as ${newStatus}`);
        
        // Update the contact in the list
        setContacts(prev => prev.map(contact => 
          contact._id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        ));
        
        // Update selected contact if it's the one being updated
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(prev => ({ ...prev, status: newStatus }));
        }

        // Refresh stats
        loadStats();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        // Handle case where response doesn't have expected structure
        setError('Failed to update contact status - invalid response');
      }
    } catch (err) {
      setError(err.message || 'Failed to update contact status');
      console.error('Status update error:', err);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await adminContactService.deleteContact(contactId);
      if (response.success) {
        setSuccess('Contact deleted successfully');
        
        // Remove from list
        setContacts(prev => prev.filter(contact => contact._id !== contactId));
        
        // Close modal if this contact was selected
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(null);
        }

        // Refresh stats and reload if needed
        loadStats();
        if (contacts.length === 1 && filters.page > 1) {
          setFilters(prev => ({ ...prev, page: prev.page - 1 }));
        }
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete contact');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      read: 'bg-blue-100 text-blue-800 border-blue-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[status] || styles.pending;
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

  if (loading) {
    return (
      <AdminLayout title="Contacts">
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>

              {/* Filters and Content Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Management</CardTitle>
                  <CardDescription>Manage contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-64 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                    </div>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse" />
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
    <AdminLayout title="Contacts">
      <div className="space-y-8 p-4">
        <div className="equus-section">
          {/* Success/Error Messages */}
          {error && (
            <Card className="border-destructive mb-4">
              <CardContent className="p-4">
                <p className="text-destructive text-sm">{error}</p>
                <Button variant="outline" size="sm" onClick={() => setError(null)} className="mt-2">
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card className="border-green-500 mb-4">
              <CardContent className="p-4">
                <p className="text-green-700 text-sm">{success}</p>
                <Button variant="outline" size="sm" onClick={() => setSuccess(null)} className="mt-2">
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 equus-gap-lg">
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Total Contacts</CardDescription>
                <CardTitle className="text-2xl">{stats.total}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground">All submissions</p>
              </CardContent>
            </Card>
            
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-2xl text-orange-600">{stats.pending}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
            
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Read</CardDescription>
                <CardTitle className="text-2xl text-blue-600">{stats.read}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground">Reviewed</p>
              </CardContent>
            </Card>
            
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Replied</CardDescription>
                <CardTitle className="text-2xl text-green-600">{stats.replied}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground">Responded to</p>
              </CardContent>
            </Card>
            
            <Card className="equus-card">
              <CardHeader className="pb-3">
                <CardDescription>Archived</CardDescription>
                <CardTitle className="text-2xl text-gray-600">{stats.archived}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Management */}
          <Card className="equus-card">
            <CardHeader className="pb-4">
              <CardTitle>Contact Management</CardTitle>
              <CardDescription>View and manage contact form submissions</CardDescription>
            </CardHeader>
            <CardContent style={{ padding: '2rem' }}>
              {/* Filters */}
              <div className="flex flex-wrap gap-4" style={{ marginBottom: '2rem' }}>
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange({ status: e.target.value })}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>

                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="px-3 py-2 border border-input rounded-md bg-background flex-1 min-w-[200px]"
                />

                <Button variant="outline" onClick={loadContacts}>
                  🔄 Refresh
                </Button>
              </div>

              {/* Contact List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div key={contact._id} className="border border-border rounded-lg hover:bg-accent/50 transition-colors" style={{ padding: '2rem' }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="font-medium text-base">{contact.name}</h3>
                            <Badge className={`text-xs px-3 py-2 ${getStatusBadgeStyle(contact.status)}`}>
                              {adminContactService.getStatusIcon(contact.status)} {contact.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground" style={{ marginBottom: '1rem' }}>{contact.email}</p>
                          {contact.subject && (
                            <p className="text-sm font-medium" style={{ marginBottom: '1.5rem' }}>Subject: {contact.subject}</p>
                          )}
                          <p className="text-sm text-muted-foreground" style={{ marginBottom: '1.5rem' }}>
                            {contact.message.length > 150 
                              ? `${contact.message.substring(0, 150)}...`
                              : contact.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {formatDate(contact.createdAt)}
                            {!contact.emailSent && <span className="text-red-600 ml-2">(Email failed)</span>}
                          </p>
                        </div>
                        
                        <div className="flex flex-col" style={{ gap: '1rem', marginLeft: '2rem' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedContact(contact)}
                            style={{ 
                              backgroundColor: 'white',
                              border: '1px solid #ccc',
                              color: '#333',
                              padding: '8px 16px',
                              minHeight: '32px'
                            }}
                          >
                            View Details
                          </Button>
                          
                          {contact.status === 'pending' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusUpdate(contact._id, 'read')}
                              style={{ 
                                backgroundColor: '#3b82f6',
                                border: '1px solid #3b82f6',
                                color: 'white',
                                padding: '8px 16px',
                                minHeight: '32px'
                              }}
                            >
                              Mark as Read
                            </Button>
                          )}
                          
                          {contact.status === 'read' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusUpdate(contact._id, 'replied')}
                              style={{ 
                                backgroundColor: '#10b981',
                                border: '1px solid #10b981',
                                color: 'white',
                                padding: '8px 16px',
                                minHeight: '32px'
                              }}
                            >
                              Mark as Replied
                            </Button>
                          )}
                          
                          {(contact.status === 'read' || contact.status === 'replied') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(contact._id, 'archived')}
                              style={{ 
                                backgroundColor: 'white',
                                border: '1px solid #6b7280',
                                color: '#6b7280',
                                padding: '8px 16px',
                                minHeight: '32px'
                              }}
                            >
                              Archive
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {filters.search || filters.status 
                      ? 'No contacts match your current filters'
                      : 'No contact submissions yet'
                    }
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * filters.limit, pagination.totalItems)} of{' '}
                    {pagination.totalItems} contacts
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    
                    <span className="flex items-center px-3 py-1 text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border flex items-center justify-between" style={{ padding: '1.5rem' }}>
              <h2 className="text-lg font-semibold">Contact Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedContact(null)}>
                ✕
              </Button>
            </div>
            
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
              </div>
              
              {selectedContact.subject && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>Subject</label>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
                <div className="bg-muted rounded-md" style={{ marginTop: '0.5rem', padding: '1.5rem' }}>
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 text-sm" style={{ gap: '2rem' }}>
                <div>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs px-3 py-2 ${getStatusBadgeStyle(selectedContact.status)}`}>
                      {adminContactService.getStatusIcon(selectedContact.status)} {selectedContact.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Sent</label>
                  <p className={selectedContact.emailSent ? 'text-green-600' : 'text-red-600'}>
                    {selectedContact.emailSent ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 text-sm" style={{ gap: '2rem' }}>
                <div>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>Submitted</label>
                  <p>{formatDate(selectedContact.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>IP Address</label>
                  <p>{selectedContact.ipAddress}</p>
                </div>
              </div>
              
              {selectedContact.userAgent && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground" style={{ display: 'block', marginBottom: '0.5rem' }}>User Agent</label>
                  <p className="text-xs font-mono bg-muted rounded" style={{ padding: '1rem', marginTop: '0.5rem' }}>
                    {selectedContact.userAgent}
                  </p>
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-background border-t border-border flex justify-end" style={{ padding: '1.5rem', gap: '1rem' }}>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  handleDeleteContact(selectedContact._id);
                  setSelectedContact(null);
                }}
              >
                Delete
              </Button>
              
              {selectedContact.status === 'pending' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedContact._id, 'read')}
                >
                  Mark as Read
                </Button>
              )}
              
              {selectedContact.status === 'read' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedContact._id, 'replied')}
                >
                  Mark as Replied
                </Button>
              )}
              
              {(selectedContact.status === 'read' || selectedContact.status === 'replied') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedContact._id, 'archived')}
                >
                  Archive
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Contacts;
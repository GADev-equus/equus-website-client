/**
 * Admin Users Page - User management page
 * Full user management interface with search, filtering, and actions
 */

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserListSkeleton } from '@/components/ui/loading-skeletons';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import userService from '@/services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingUser, setUpdatingUser] = useState(null);
  
  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState
  } = useColdStartAwareLoading(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Pass 'all' status to get ALL users including suspended ones
      const response = await userService.getAllUsers({ status: 'all' });
      if (response.success) {
        const users = response.users || [];
        setUsers(users);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      // Check both status and accountStatus fields to handle potential field name differences
      filtered = filtered.filter(user => {
        const matchesStatus = user.status === selectedStatus;
        const matchesAccountStatus = user.accountStatus === selectedStatus;
        return matchesStatus || matchesAccountStatus;
      });
    }
    
    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdatingUser(userId);
      const response = await userService.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        setError(response.message || 'Failed to update user role');
      }
    } catch (err) {
      setError('Failed to update user role');
      console.error('Update role error:', err);
    } finally {
      setUpdatingUser(null);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      setUpdatingUser(userId);
      const response = await userService.updateUserStatus(userId, newStatus);
      
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user._id === userId ? { 
            ...user, 
            status: newStatus,
            accountStatus: newStatus  // Update both fields to ensure consistency
          } : user
        ));
        
        // Reload users to get fresh data from backend
        setTimeout(() => {
          loadUsers();
        }, 1000);
      } else {
        setError(response.message || 'Failed to update user status');
      }
    } catch (err) {
      setError('Failed to update user status');
      console.error('Update status error:', err);
    } finally {
      setUpdatingUser(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="User Management">
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
              {/* Search and Filter Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Search and Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 h-10 bg-muted rounded-md animate-pulse" />
                    <div className="w-32 h-10 bg-muted rounded-md animate-pulse" />
                    <div className="w-32 h-10 bg-muted rounded-md animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              {/* Users List Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserListSkeleton />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={loadUsers} className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Users</CardTitle>
            <CardDescription>Search and filter user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={loadUsers} variant="outline" className="w-full">
                  🔄 Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user accounts, roles, and status</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length > 0 ? (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status || user.accountStatus)}`}>
                          {user.status || user.accountStatus}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Role Update */}
                        <select 
                          className="text-xs px-2 py-1 border border-border rounded bg-background"
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          disabled={updatingUser === user._id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {/* Status Update */}
                        <select 
                          className="text-xs px-2 py-1 border border-border rounded bg-background"
                          value={user.status || user.accountStatus}
                          onChange={(e) => updateUserStatus(user._id, e.target.value)}
                          disabled={updatingUser === user._id}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      {updatingUser === user._id && (
                        <div className="text-xs text-muted-foreground">Updating...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-2xl">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-2xl">
                {users.filter(u => u.status === 'active').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Admin Users</CardDescription>
              <CardTitle className="text-2xl">
                {users.filter(u => u.role === 'admin').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;
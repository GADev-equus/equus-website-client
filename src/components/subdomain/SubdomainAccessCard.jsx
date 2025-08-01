import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  accessProtectedSubdomain,
  getAllSubdomainsWithStatus,
  getSubdomainName,
  SUBDOMAIN_CONFIG,
} from '@/utils/subdomainAccess';
import subdomainRequestService from '@/services/subdomainRequestService';

/**
 * SubdomainAccessCard - Displays available protected subdomains with access controls
 * Integrates with the existing authentication system and user dashboard
 */
const SubdomainAccessCard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loadingStates, setLoadingStates] = useState({});
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const [approvedRequests, setApprovedRequests] = useState(new Set());

  // Get all subdomains with their access status for current user
  const subdomains = getAllSubdomainsWithStatus(user);

  /**
   * Load user's pending and approved requests on component mount
   * This ensures the UI shows accurate status
   */
  useEffect(() => {
    const loadUserRequests = async () => {
      if (!user) return;

      try {
        // Load both pending and approved requests
        const [pendingResponse, approvedResponse] = await Promise.all([
          subdomainRequestService.getMyRequests({ status: 'pending' }),
          subdomainRequestService.getMyRequests({ status: 'approved' }),
        ]);

        if (pendingResponse.success && pendingResponse.requests) {
          const pendingSubdomains = new Set(
            pendingResponse.requests.map((req) => req.subdomainId),
          );
          setPendingRequests(pendingSubdomains);
        }

        if (approvedResponse.success && approvedResponse.requests) {
          // Filter for non-expired approved requests
          const activeApproved = approvedResponse.requests.filter(
            (req) => !req.expiresAt || new Date(req.expiresAt) > new Date(),
          );
          const approvedSubdomains = new Set(
            activeApproved.map((req) => req.subdomainId),
          );
          setApprovedRequests(approvedSubdomains);
        }
      } catch (error) {
        console.error('Error loading user requests:', error);
      }
    };

    loadUserRequests();
  }, [user]);

  /**
   * Handle access to protected subdomain
   * @param {string} subdomainId - The subdomain identifier
   */
  const handleSubdomainAccess = async (subdomainId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [subdomainId]: true }));

      await accessProtectedSubdomain(subdomainId, {
        validateFirst: true,
        openInNewTab: false,
        onNotification: (notification) => {
          toast.addToast(notification);
        },
      });

      // Navigation will happen automatically for successful access
    } catch (error) {
      console.error(`Error accessing ${subdomainId}:`, error);
      toast.error(
        `Failed to access ${getSubdomainName(subdomainId)}. Please try again.`,
        {
          title: 'Access Error',
        },
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [subdomainId]: false }));
    }
  };

  /**
   * Handle user request for subdomain access
   * @param {string} subdomainId - The subdomain identifier
   */
  const handleRequestAccess = async (subdomainId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [subdomainId]: true }));

      // Submit actual request to backend
      const response = await subdomainRequestService.submitRequest(
        subdomainId,
        `User requesting access to ${getSubdomainName(
          subdomainId,
        )} from dashboard`,
      );

      if (response.success) {
        // Add to pending requests set for immediate UI update
        setPendingRequests((prev) => new Set([...prev, subdomainId]));

        toast.success(
          `Your request for access to ${getSubdomainName(
            subdomainId,
          )} has been submitted to administrators. You will be notified when reviewed.`,
          {
            title: 'Access Request Submitted',
            duration: 5000,
          },
        );
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (error) {
      // Handle specific error cases
      let errorMessage = 'Failed to submit access request. Please try again.';

      if (error.message?.includes('pending request')) {
        errorMessage = 'You already have a pending request for this resource.';
      } else if (error.message?.includes('already have access')) {
        errorMessage = 'You already have access to this resource.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        title: 'Request Error',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [subdomainId]: false }));
    }
  };

  const getStatusBadgeVariant = (
    hasAccess,
    accessReason,
    userRole,
    requiredRoles,
    subdomainId,
  ) => {
    // Check if request is pending
    if (pendingRequests.has(subdomainId)) {
      return {
        className:
          'bg-blue-900/20 text-blue-300 border border-blue-700 px-3 py-1',
        text: 'Pending',
      };
    }

    if (hasAccess) {
      return {
        className:
          'bg-green-900/20 text-green-300 border border-green-700 px-3 py-1',
        text: 'Available',
      };
    }

    if (accessReason.includes('Email verification')) {
      return {
        className:
          'bg-yellow-900/20 text-yellow-300 border border-yellow-700 px-3 py-1',
        text: 'Verify Email',
      };
    }

    if (accessReason.includes('role')) {
      // Check if it's a regular user trying to access admin-only resource
      if (
        userRole === 'user' &&
        requiredRoles &&
        requiredRoles.includes('admin') &&
        !requiredRoles.includes('user')
      ) {
        return {
          className:
            'bg-orange-900/20 text-orange-300 border border-orange-700 px-3 py-1',
          text: 'Requires Admin Approval',
        };
      }
      return {
        className: 'bg-red-900/20 text-red-300 border border-red-700 px-3 py-1',
        text: 'No Access',
      };
    }

    return {
      className: 'bg-gray-700 text-gray-300 border border-gray-600 px-3 py-1',
      text: 'Restricted',
    };
  };

  // If no subdomains are configured, show info card
  if (subdomains.length === 0) {
    return (
      <Card className="equus-card">
        <CardHeader className="pb-4">
          <CardTitle>Protected Resources</CardTitle>
          <CardDescription>
            Specialized platforms and applications
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-medium text-gray-100 mb-2">
              No Protected Resources Available
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {!user?.emailVerified
                ? 'Complete email verification to access protected resources'
                : 'Additional resources may become available based on your account status'}
            </p>
            {!user?.emailVerified && (
              <Button variant="outline" size="sm">
                Verify Email
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="equus-card">
      <CardHeader className="pb-4">
        <CardTitle>Protected Resources Access</CardTitle>
        <CardDescription>
          Specialized platforms available to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 space-y-3">
        {subdomains.map((subdomain) => {
          const config = SUBDOMAIN_CONFIG[subdomain.id];
          const isPending = pendingRequests.has(subdomain.id);
          const isApproved = approvedRequests.has(subdomain.id);

          // Override access based on approved requests
          const hasAccess = subdomain.hasAccess || isApproved;
          const accessReason = isApproved
            ? 'accessible'
            : subdomain.accessReason;

          const statusBadge = getStatusBadgeVariant(
            hasAccess,
            accessReason,
            user?.role,
            config?.allowedRoles,
            subdomain.id,
          );
          const isLoading = loadingStates[subdomain.id];

          // Check if this is a regular user trying to access admin-only resource
          const isRequestAccess =
            !isPending &&
            !hasAccess &&
            user?.role === 'user' &&
            config?.allowedRoles?.includes('admin') &&
            !config?.allowedRoles?.includes('user') &&
            accessReason.includes('Contact administrators for access approval');

          return (
            <div
              key={subdomain.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg transition-all duration-200 ${
                subdomain.hasAccess
                  ? 'hover:shadow-sm hover:border-blue-200'
                  : 'opacity-75'
              }`}
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <span className="text-2xl">{subdomain.icon}</span>
                <div>
                  <h4 className="font-medium text-sm text-gray-100">
                    {subdomain.name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {subdomain.description}
                  </p>
                  {hasAccess ? (
                    <div className="text-xs text-gray-400 mt-1">
                      🔗 {config?.url}
                      <br />
                      <span className="text-blue-400 font-medium">
                        Use "Access" button below for authentication
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-red-400 mt-1">{accessReason}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                <Badge
                  variant="secondary"
                  className={statusBadge.className + ' self-start sm:self-auto'}
                >
                  {statusBadge.text}
                </Badge>

                <Button
                  size="sm"
                  variant={hasAccess ? 'default' : 'outline'}
                  onClick={() => {
                    if (hasAccess) {
                      handleSubdomainAccess(subdomain.id);
                    } else if (isRequestAccess) {
                      handleRequestAccess(subdomain.id);
                    } else {
                      handleSubdomainAccess(subdomain.id);
                    }
                  }}
                  disabled={
                    isLoading || isPending || (!hasAccess && !isRequestAccess)
                  }
                  className="w-full sm:w-auto min-w-[120px] px-4 py-2 font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-current" />
                      <span className="text-xs">
                        {isRequestAccess ? 'Requesting...' : 'Connecting...'}
                      </span>
                    </div>
                  ) : hasAccess ? (
                    '🚀 Access Now'
                  ) : isPending ? (
                    'Pending'
                  ) : isRequestAccess ? (
                    'Request Access'
                  ) : (
                    'Locked'
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {/* Additional information footer */}
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-sm">💡</span>
            <div className="text-xs text-gray-400">
              <p className="mb-1">
                <strong>Security Notice:</strong> Protected resources require
                active authentication and appropriate permissions.
              </p>
              <p>
                Access is logged and monitored. Contact support if you need
                access to additional resources.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubdomainAccessCard;

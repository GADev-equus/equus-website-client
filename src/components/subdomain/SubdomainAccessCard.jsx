import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  accessProtectedSubdomain, 
  getAllSubdomainsWithStatus,
  getSubdomainName,
  SUBDOMAIN_CONFIG
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

  // Get all subdomains with their access status for current user
  const subdomains = getAllSubdomainsWithStatus(user);
  const accessibleSubdomains = subdomains.filter(subdomain => subdomain.hasAccess);

  /**
   * Load user's pending requests on component mount
   * This ensures the UI shows accurate pending status
   */
  useEffect(() => {
    const loadPendingRequests = async () => {
      if (!user) return;
      
      try {
        const response = await subdomainRequestService.getMyRequests({ status: 'pending' });
        
        if (response.success && response.requests) {
          const pendingSubdomains = new Set(response.requests.map(req => req.subdomainId));
          setPendingRequests(pendingSubdomains);
        }
      } catch (error) {
        console.error('Error loading pending requests:', error);
      }
    };

    loadPendingRequests();
  }, [user]);

  /**
   * Handle access to protected subdomain
   * @param {string} subdomainId - The subdomain identifier
   */
  const handleSubdomainAccess = async (subdomainId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [subdomainId]: true }));

      const result = await accessProtectedSubdomain(subdomainId, {
        validateFirst: true,
        openInNewTab: false,
        onNotification: (notification) => {
          toast.addToast(notification);
        }
      });

      // Navigation will happen automatically for successful access

    } catch (error) {
      console.error(`Error accessing ${subdomainId}:`, error);
      toast.error(`Failed to access ${getSubdomainName(subdomainId)}. Please try again.`, {
        title: "Access Error"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [subdomainId]: false }));
    }
  };

  /**
   * Handle user request for subdomain access
   * @param {string} subdomainId - The subdomain identifier
   */
  const handleRequestAccess = async (subdomainId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [subdomainId]: true }));

      // Submit actual request to backend
      const response = await subdomainRequestService.submitRequest(
        subdomainId,
        `User requesting access to ${getSubdomainName(subdomainId)} from dashboard`
      );

      if (response.success) {
        // Add to pending requests set for immediate UI update
        setPendingRequests(prev => new Set([...prev, subdomainId]));
        
        toast.success(`Your request for access to ${getSubdomainName(subdomainId)} has been submitted to administrators. You will be notified when reviewed.`, {
          title: "Access Request Submitted",
          duration: 5000
        });

      } else {
        throw new Error(response.message || 'Failed to submit request');
      }

    } catch (error) {
      console.error(`Error requesting access to ${subdomainId}:`, error);
      
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
        title: "Request Error"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [subdomainId]: false }));
    }
  };

  const getStatusBadgeVariant = (hasAccess, accessReason, userRole, requiredRoles, subdomainId) => {
    // Check if request is pending
    if (pendingRequests.has(subdomainId)) {
      return {
        className: "bg-blue-100 text-blue-800 px-3 py-1",
        text: "Pending"
      };
    }
    
    if (hasAccess) {
      return {
        className: "bg-green-100 text-green-800 px-3 py-1",
        text: "Available"
      };
    }
    
    if (accessReason.includes('Email verification')) {
      return {
        className: "bg-yellow-100 text-yellow-800 px-3 py-1", 
        text: "Verify Email"
      };
    }
    
    if (accessReason.includes('role')) {
      // Check if it's a regular user trying to access admin-only resource
      if (userRole === 'user' && requiredRoles && requiredRoles.includes('admin') && !requiredRoles.includes('user')) {
        return {
          className: "bg-orange-100 text-orange-800 px-3 py-1",
          text: "Requires Admin Approval"
        };
      }
      return {
        className: "bg-red-100 text-red-800 px-3 py-1",
        text: "No Access"
      };
    }
    
    return {
      className: "bg-gray-100 text-gray-800 px-3 py-1",
      text: "Restricted"
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
            <h3 className="font-medium text-gray-900 mb-2">No Protected Resources Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {!user?.emailVerified 
                ? "Complete email verification to access protected resources"
                : "Additional resources may become available based on your account status"
              }
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
        {subdomains.map(subdomain => {
          const config = SUBDOMAIN_CONFIG[subdomain.id];
          const isPending = pendingRequests.has(subdomain.id);
          const statusBadge = getStatusBadgeVariant(
            subdomain.hasAccess, 
            subdomain.accessReason, 
            user?.role, 
            config?.allowedRoles,
            subdomain.id
          );
          const isLoading = loadingStates[subdomain.id];
          
          // Check if this is a regular user trying to access admin-only resource
          const isRequestAccess = !isPending && !subdomain.hasAccess && 
                                  user?.role === 'user' && 
                                  config?.allowedRoles?.includes('admin') && 
                                  !config?.allowedRoles?.includes('user') &&
                                  subdomain.accessReason.includes('Contact administrators for access approval');
          

          return (
            <div 
              key={subdomain.id} 
              className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
                subdomain.hasAccess ? 'hover:shadow-sm hover:border-blue-200' : 'opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{subdomain.icon}</span>
                <div>
                  <h4 className="font-medium text-sm">{subdomain.name}</h4>
                  <p className="text-xs text-muted-foreground">{subdomain.description}</p>
                  {subdomain.hasAccess ? (
                    <a 
                      href={config?.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                    >
                      🔗 {config?.url}
                    </a>
                  ) : (
                    <p className="text-xs text-red-600 mt-1">
                      {subdomain.accessReason}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={statusBadge.className}
                >
                  {statusBadge.text}
                </Badge>
                
                <Button 
                  size="sm" 
                  variant={subdomain.hasAccess ? "default" : "outline"}
                  onClick={() => {
                    if (subdomain.hasAccess) {
                      handleSubdomainAccess(subdomain.id);
                    } else if (isRequestAccess) {
                      handleRequestAccess(subdomain.id);
                    } else {
                      handleSubdomainAccess(subdomain.id);
                    }
                  }}
                  disabled={isLoading || isPending || (!subdomain.hasAccess && !isRequestAccess)}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">
                        {isRequestAccess ? "Requesting..." : "Connecting..."}
                      </span>
                    </div>
                  ) : (
                    subdomain.hasAccess 
                      ? "Access" 
                      : isPending 
                        ? "Pending" 
                        : isRequestAccess 
                          ? "Request Access" 
                          : "Locked"
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
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">
                <strong>Security Notice:</strong> Protected resources require active authentication and appropriate permissions.
              </p>
              <p>
                Access is logged and monitored. Contact support if you need access to additional resources.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubdomainAccessCard;
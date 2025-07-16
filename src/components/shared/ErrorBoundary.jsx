/**
 * ErrorBoundary - Global error boundary component
 * Catches JavaScript errors anywhere in the component tree and displays fallback UI
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and external service
    const errorId = Date.now().toString();
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo, errorId);
    }
  }

  reportError = (error, errorInfo, errorId) => {
    // This is where you would send the error to your error reporting service
    // For example: Sentry, LogRocket, Bugsnag, etc.
    
    const errorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      user: this.props.user || null
    };

    // Example: Send to error reporting service
    // errorReportingService.captureException(errorReport);
    
    console.warn('Error report generated:', errorReport);
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI based on error type
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleReset);
      }

      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                ⚠️ Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <AlertTitle>Application Error</AlertTitle>
                <AlertDescription>
                  An unexpected error occurred. We apologize for the inconvenience.
                  {this.state.errorId && (
                    <div className="mt-2 text-xs opacity-70">
                      Error ID: {this.state.errorId}
                    </div>
                  )}
                </AlertDescription>
              </Alert>

              {isDevelopment && this.state.error && (
                <Alert>
                  <AlertTitle>Development Error Details</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Stack trace:</strong>
                        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component stack:</strong>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button onClick={this.handleReset} variant="default">
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="outline">
                  Reload Page
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="ghost"
                >
                  Go Home
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  If this problem persists, please contact support with the error ID above.
                </p>
                <p className="mt-2">
                  <a 
                    href="mailto:support@equus-systems.com" 
                    className="text-primary hover:underline"
                  >
                    support@equus-systems.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
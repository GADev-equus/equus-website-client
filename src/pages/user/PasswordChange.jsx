/**
 * PasswordChange Page - Password change page
 * Allows users to change their password with security validation
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import authService from '@/services/authService';

const PasswordChange = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Watch form values for validation
  const watchedValues = form.watch();

  const validatePassword = (value) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
      return 'Password must contain at least one special character';
    }
    return true;
  };

  const validateConfirmPassword = (value) => {
    const newPassword = watchedValues.newPassword;
    if (value !== newPassword) {
      return 'Passwords do not match';
    }
    return true;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      password.length >= 12
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score < 3) return { strength: score, label: 'Weak', color: 'bg-red-500' };
    if (score < 5) return { strength: score, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: score, label: 'Strong', color: 'bg-green-500' };
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      
      if (result.success) {
        setSuccess('Password changed successfully! You can continue using your account with the new password.');
        form.reset();
        
        // Redirect to settings after a delay
        setTimeout(() => {
          navigate('/settings');
        }, 3000);
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const { formState } = form;
    return Object.keys(formState.errors).length === 0 && 
           watchedValues.currentPassword && 
           watchedValues.newPassword && 
           watchedValues.confirmPassword;
  };

  const passwordStrength = getPasswordStrength(watchedValues.newPassword);

  return (
    <UserLayout title="Change Password">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="equus-section">
          {/* Page Header */}
          <Card >
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Navigation Breadcrumb */}
          <div className="text-sm text-muted-foreground">
            <Link to="/settings" className="hover:text-foreground">
              Settings
            </Link>
            {' > '}
            <span>Change Password</span>
          </div>

          {/* Status Messages */}
          {error && (
            <Alert className="border-destructive">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {/* Password Change Form */}
          <Card >
            <CardHeader>
              <CardTitle>Update Your Password</CardTitle>
              <CardDescription>
                Enter your current password and choose a new secure password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password *</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      {...form.register('currentPassword', {
                        required: 'Current password is required'
                      })}
                      className={form.formState.errors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {form.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password *</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      {...form.register('newPassword', {
                        required: 'New password is required',
                        validate: validatePassword
                      })}
                      className={form.formState.errors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? '🙈' : '👁️'}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {watchedValues.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={cn("h-2 rounded-full transition-all duration-300", passwordStrength.color)}
                            style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-xs font-medium",
                          passwordStrength.label === 'Weak' && 'text-red-600',
                          passwordStrength.label === 'Medium' && 'text-yellow-600',
                          passwordStrength.label === 'Strong' && 'text-green-600'
                        )}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {form.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      {...form.register('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: validateConfirmPassword
                      })}
                      className={form.formState.errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className="flex-1"
                  >
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/settings')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Security Tips */}
          <Card >
            <CardHeader>
              <CardTitle>Password Security Tips</CardTitle>
              <CardDescription>
                Follow these guidelines to create a strong, secure password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-green-600">✓ Do:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use at least 8 characters (12+ recommended)</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Add numbers and special characters</li>
                    <li>• Use a unique password for this account</li>
                    <li>• Consider using a password manager</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-red-600">✗ Don't:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use personal information (name, birthday)</li>
                    <li>• Reuse passwords from other accounts</li>
                    <li>• Use common words or patterns</li>
                    <li>• Share your password with others</li>
                    <li>• Store passwords in plain text</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Security Information */}
          <Card >
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Your account security status and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Password Last Changed</h4>
                    <p className="text-xs text-muted-foreground">
                      {user?.passwordChangedAt ? 
                        new Date(user.passwordChangedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 
                        'Never'
                      }
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Login Alerts</h4>
                    <p className="text-xs text-muted-foreground">Get notified of suspicious login attempts</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default PasswordChange;
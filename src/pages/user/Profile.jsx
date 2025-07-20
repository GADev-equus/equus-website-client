/**
 * Profile Page - User profile editing page
 * Allows users to edit their profile information with validation
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/loading-skeletons';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/authService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      bio: '',
      avatar: ''
    }
  });

  // Watch form values for validation
  const watchedValues = form.watch();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const result = await authService.getCurrentUser();
      if (result.success) {
        const userData = result.user;
        setUserProfile(userData);
        
        // Populate form with current user data
        form.reset({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          bio: userData.bio || '',
          avatar: userData.avatar || ''
        });
      } else {
        setError('Failed to load profile data');
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile load error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const validateUsername = (value) => {
    if (!value) return true; // Username is optional
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.length > 20) {
      return 'Username must not exceed 20 characters';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return true;
  };

  const validateAvatar = (value) => {
    if (!value) return true; // Avatar is optional
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(value)) {
      return 'Please enter a valid URL';
    }
    return true;
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Only send fields that have changed or have values
      const updateData = {};
      
      if (data.firstName?.trim()) updateData.firstName = data.firstName.trim();
      if (data.lastName?.trim()) updateData.lastName = data.lastName.trim();
      if (data.username?.trim()) updateData.username = data.username.trim();
      if (data.bio !== undefined) updateData.bio = data.bio; // Allow empty string
      if (data.avatar !== undefined) updateData.avatar = data.avatar; // Allow empty string

      // Check if any data is being updated
      if (Object.keys(updateData).length === 0) {
        setError('Please make at least one change to update your profile');
        return;
      }

      const result = await authService.updateProfile(updateData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setUserProfile(result.user);
        
        // Update user context
        if (updateUser) {
          updateUser(result.user);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!userProfile) return 0;
    let completed = 0;
    const fields = ['firstName', 'lastName', 'email', 'avatar', 'bio'];
    
    fields.forEach(field => {
      if (userProfile[field]) completed++;
    });
    
    return Math.round((completed / fields.length) * 100);
  };

  const isFormValid = () => {
    const { formState } = form;
    return Object.keys(formState.errors).length === 0;
  };

  const hasChanges = () => {
    if (!userProfile) return false;
    
    return (
      watchedValues.firstName !== (userProfile.firstName || '') ||
      watchedValues.lastName !== (userProfile.lastName || '') ||
      watchedValues.username !== (userProfile.username || '') ||
      watchedValues.bio !== (userProfile.bio || '') ||
      watchedValues.avatar !== (userProfile.avatar || '')
    );
  };

  if (initialLoading) {
    return (
      <UserLayout title="Edit Profile">
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout title="Edit Profile">
      <div className="space-y-8">
        <div className="equus-section">
          {/* Page Header */}
          <Card className="equus-card">
            <CardHeader>
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Completion */}
          <Card className="equus-card">
            <CardHeader className="pb-3">
              <CardDescription>Profile Completion</CardDescription>
              <CardTitle className="text-lg">{getProfileCompletionPercentage()}%</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProfileCompletionPercentage()}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete your profile to help others get to know you better
              </p>
            </CardContent>
          </Card>

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

          {/* Profile Form */}
          <Card className="equus-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    {...form.register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      },
                      maxLength: {
                        value: 50,
                        message: 'First name must not exceed 50 characters'
                      }
                    })}
                    className={form.formState.errors.firstName ? 'border-destructive' : ''}
                    placeholder="Enter your first name"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    {...form.register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      },
                      maxLength: {
                        value: 50,
                        message: 'Last name must not exceed 50 characters'
                      }
                    })}
                    className={form.formState.errors.lastName ? 'border-destructive' : ''}
                    placeholder="Enter your last name"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    {...form.register('username', {
                      validate: validateUsername
                    })}
                    className={form.formState.errors.username ? 'border-destructive' : ''}
                    placeholder="Choose a unique username (optional)"
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    3-20 characters, letters, numbers, underscores, and hyphens only
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    {...form.register('bio', {
                      maxLength: {
                        value: 500,
                        message: 'Bio must not exceed 500 characters'
                      }
                    })}
                    className={`w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none ${
                      form.formState.errors.bio ? 'border-destructive' : ''
                    }`}
                    rows={4}
                    placeholder="Tell us about yourself (optional)"
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.bio?.length || 0}/500 characters
                  </p>
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    type="url"
                    {...form.register('avatar', {
                      validate: validateAvatar
                    })}
                    className={form.formState.errors.avatar ? 'border-destructive' : ''}
                    placeholder="https://example.com/your-avatar.jpg (optional)"
                  />
                  {form.formState.errors.avatar && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.avatar.message}
                    </p>
                  )}
                  {watchedValues.avatar && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                      <img
                        src={watchedValues.avatar}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t mt-6">
                  <Button
                    type="submit"
                    disabled={loading || !isFormValid() || !hasChanges()}
                    className="flex-1 font-medium py-3"
                    style={{
                      backgroundColor: (loading || !isFormValid() || !hasChanges()) ? '#d1d5db' : '#2563eb',
                      color: (loading || !isFormValid() || !hasChanges()) ? '#6b7280' : '#ffffff',
                      border: '1px solid #2563eb',
                      borderRadius: '8px',
                      cursor: (loading || !isFormValid() || !hasChanges()) ? 'not-allowed' : 'pointer',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && isFormValid() && hasChanges()) {
                        e.target.style.backgroundColor = '#1d4ed8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading && isFormValid() && hasChanges()) {
                        e.target.style.backgroundColor = '#2563eb';
                      }
                    }}
                    size="lg"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                    className="px-6 py-3 border-gray-300 hover:bg-gray-50"
                    size="lg"
                  >
                    Cancel
                  </Button>
                </div>
                
                {/* Help text for disabled button */}
                {(!hasChanges() || !isFormValid()) && (
                  <div className="text-sm text-muted-foreground text-center pt-2">
                    {!hasChanges() && "Make changes to your profile to enable the update button"}
                    {!isFormValid() && hasChanges() && "Please fix the errors above to enable the update button"}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
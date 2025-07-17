# User Dashboard Implementation Plan

## Overview
Create distinct dashboard experiences for admin and regular users with appropriate data access and functionality.

## Current Problem
Both admin and regular users are seeing the same dashboard (`/admin/dashboard/Dashboard.jsx`) which shows:
- System-wide user statistics (total users, active users, etc.)
- Recent user registrations
- Admin-specific quick actions (Manage Users, View Analytics)
- System status information

This is inappropriate for regular users who should only see their own personal information and stats.

## Current Architecture Analysis
- `/dashboard` → Protected route using same `Dashboard` component
- `/admin/dashboard` → Admin route using same `Dashboard` component
- The component makes admin-level API calls (`userService.getUserStats()`, `userService.getAllUsers()`)
- All users get system-wide statistics and admin functionality

## User Model Data Available
From the User model, relevant personal data for regular users includes:
- Profile info (firstName, lastName, email, avatar, bio)
- Account status (emailVerified, isActive, accountStatus)
- Activity tracking (lastLogin, registrationDate, loginAttempts)
- Role and permissions
- Referral information (referredBy, referralCode)

## Implementation Plan

### 1. Create New User Dashboard Component
- **File**: `client/src/pages/user/Dashboard.jsx`
- **Purpose**: Personal dashboard for regular users
- **Content**:
  - Personal profile summary (name, email, avatar)
  - Account status (email verification, account status)
  - Personal activity stats (last login, registration date, login attempts)
  - Profile management quick actions (Edit Profile, Change Password)
  - Personal referral information (if applicable)
  - Account security status (last login, failed attempts)

### 2. Keep Current Dashboard for Admin Only
- **File**: `client/src/pages/admin/Dashboard.jsx` (current)
- **Purpose**: Keep as admin-only dashboard
- **Content**: Current system-wide functionality (no changes needed)

### 3. Update Routing Structure
- **File**: `client/src/App.jsx`
- **Changes**:
  - `/dashboard` → Import and use new `UserDashboard` component
  - `/admin/dashboard` → Continue using current `AdminDashboard` component
  - Ensure proper role-based access

### 4. Create User-Specific API Service Methods
- **File**: `client/src/services/userService.js`
- **Add methods**:
  - `getUserProfile()` - Get current user's profile
  - `getUserActivity()` - Get user's personal activity stats
  - `getUserReferrals()` - Get user's referral information

### 5. Backend API Verification
- **File**: `api/controllers/userController.js`
- **Ensure endpoints exist**:
  - `GET /api/users/profile` - Current user profile ✅ (already exists)
  - `GET /api/users/activity` - Current user activity stats (may need to create)
  - `GET /api/users/referrals` - Current user referral info (may need to create)

### 6. Create User Layout Component
- **File**: `client/src/components/layout/UserLayout.jsx`
- **Purpose**: Layout wrapper for user pages (similar to AdminLayout)
- **Features**: User-friendly navigation, profile access, logout

## User Dashboard Features

### Profile Section
- User avatar/initials
- Full name and email
- Email verification status
- Account status indicator
- Quick edit profile button

### Account Activity
- Last login date/time
- Registration date
- Login attempts (if any failures)
- Account security status

### Quick Actions
- Edit Profile
- Change Password
- View Account Settings
- Logout

### Personal Stats (Optional)
- Days since registration
- Total logins
- Profile completion percentage
- Referral statistics (if applicable)

## Benefits
- **Security**: Users only see their own data
- **UX**: Role-appropriate interfaces
- **Scalability**: Clear separation of concerns
- **Maintainability**: Separate components for different user types

## File Changes Required
1. Create `client/src/pages/user/Dashboard.jsx`
2. Create `client/src/components/layout/UserLayout.jsx` 
3. Modify `client/src/App.jsx` routing
4. Update `client/src/services/userService.js`
5. Potentially create new backend API endpoints for user activity

## Security Considerations
- Ensure user dashboard only accesses user-specific data
- Verify all API calls are properly authenticated
- No system-wide statistics exposed to regular users
- Role-based access controls maintained

## Testing Plan
- Test user dashboard shows only personal data
- Test admin dashboard retains full functionality
- Test proper routing based on user role
- Test API endpoint security
- Test responsive design on both dashboards

## Implementation Steps

### Step 1: Create User Directory Structure
```bash
mkdir -p client/src/pages/user
mkdir -p client/src/components/layout
```

### Step 2: Create UserLayout Component
Create a layout wrapper similar to AdminLayout but for regular users:
- Simple navigation
- Profile access
- User-friendly design
- No admin-specific features

### Step 3: Create User Dashboard Component
Build the personal dashboard with:
- Profile card with user info
- Account status indicators
- Personal activity timeline
- Quick action buttons
- Security status overview

### Step 4: Update App Routing
Modify the routing to use different components:
- `/dashboard` uses UserDashboard
- `/admin/dashboard` uses AdminDashboard
- Maintain proper role-based access

### Step 5: Extend User Service
Add methods to fetch user-specific data:
- Personal profile information
- Account activity history
- Security status
- Referral information

### Step 6: Backend API Extensions (if needed)
Create endpoints for:
- User activity statistics
- Personal referral data
- Account security information

## UI/UX Considerations

### User Dashboard Design
- **Clean and Personal**: Focus on user's own information
- **Actionable**: Clear buttons for common tasks
- **Informative**: Show important account status
- **Secure**: Display security-related information

### Admin Dashboard Design
- **Comprehensive**: System-wide statistics and controls
- **Powerful**: Advanced management features
- **Analytical**: Detailed metrics and trends
- **Administrative**: User management capabilities

## Error Handling
- Graceful handling of API failures
- Clear error messages for users
- Fallback UI states
- Proper loading indicators

## Performance Considerations
- Lazy loading for dashboard components
- Efficient API calls (only fetch needed data)
- Caching for frequently accessed user data
- Optimized re-renders

## Accessibility
- Screen reader support
- Keyboard navigation
- High contrast mode support
- Proper ARIA labels

## Mobile Responsiveness
- Touch-friendly interface
- Responsive grid layouts
- Mobile-optimized navigation
- Adaptive content sizing

This comprehensive plan ensures users get a personalized dashboard experience while maintaining the powerful admin interface for system management.
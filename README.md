# Equus Website Client

React frontend application for the Equus website built with Vite. A modern, full-featured authentication system with complete user management capabilities.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will run on **port 5173** by default.

## Project Structure

```
client/
├── src/
│   ├── App.jsx                    # Main app component with routing
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global styles and CSS reset
│   ├── components/                # Reusable UI components
│   │   ├── ui/                   # Base UI components (buttons, forms, etc.)
│   │   ├── forms/                # Form components (auth, contact, etc.)
│   │   ├── layout/               # Layout components (UserLayout, AdminLayout)
│   │   ├── shared/               # Shared components (routing, navigation)
│   │   ├── Header.jsx            # Main navigation header (clickable)
│   │   ├── Footer.jsx            # Site footer (reduced height)
│   │   └── ContactForm.jsx       # Contact form with validation
│   ├── pages/                    # Page components
│   │   ├── Home.jsx              # Landing page with contact form
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── SignIn.jsx        # User login page
│   │   │   ├── SignUp.jsx        # User registration page
│   │   │   ├── ResetPassword.jsx # Password reset page
│   │   │   └── EmailVerification.jsx # Email verification page
│   │   ├── user/                 # User dashboard pages
│   │   │   ├── Dashboard.jsx     # Personal user dashboard
│   │   │   ├── Profile.jsx       # Profile editing page
│   │   │   ├── Settings.jsx      # Account settings overview
│   │   │   └── PasswordChange.jsx # Password management page
│   │   ├── admin/                # Admin dashboard pages
│   │   │   ├── Dashboard.jsx     # Admin dashboard
│   │   │   ├── Users.jsx         # User management
│   │   │   ├── Analytics.jsx     # User analytics dashboard
│   │   │   └── PageViews.jsx     # Page views analytics dashboard
│   │   ├── Unauthorized.jsx      # 403 access denied page
│   │   └── NotFound.jsx          # 404 error page
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.jsx       # Authentication context
│   ├── services/                 # API service layer
│   │   ├── authService.js        # Authentication API calls
│   │   ├── userService.js        # User management API calls
│   │   ├── contactService.js     # Contact form service
│   │   ├── analyticsService.js   # Analytics data service
│   │   └── httpService.js        # HTTP client wrapper
│   └── utils/                    # Utility functions
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── vite.config.js                # Vite configuration
```

## Features

### ✅ Core Features
- **React 18** with JavaScript (no TypeScript)
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Complete CSS reset** and modern styling
- **Hot module replacement (HMR)**
- **Component-based architecture**

### 🔐 Authentication System
- **User Registration** with email verification
- **User Login** with JWT tokens
- **Password Reset** with email token flow
- **Email Verification** system
- **Protected Routes** with role-based access
- **Admin Routes** for administrative functions
- **Role-Based Redirects** (admin → admin dashboard, user → user dashboard)
- **Automatic Token Refresh** for seamless UX
- **Session Management** with localStorage

### 🎨 UI Components
- **Reusable UI Library** (buttons, forms, cards, alerts)
- **AuthForm Component** for all authentication flows with consistent styling
- **ContactForm Component** with validation and rate limiting
- **Layout Components** (UserLayout, AdminLayout) for role-based interfaces
- **Loading States** and error handling
- **Responsive Design** patterns
- **Accessibility Features** (skip links, ARIA labels)
- **Consistent Form Styling** across all components

### 🛡️ Security Features
- **JWT Token Management** with automatic refresh
- **Protected Route Components** for authentication
- **Admin Route Guards** for role-based access
- **Real-time Input Validation** on all forms
- **Button Disable Logic** until validation passes
- **Required Field Indicators** (*) for user clarity
- **Error Boundary** handling
- **Secure Token Storage** in localStorage
- **Rate Limiting** on contact form submissions

## Development

### Available Scripts
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

### Authentication Flow
1. **Registration**: User signs up → Email verification → Account activated
2. **Login**: User signs in → JWT token issued → Role-based redirect (admin/user dashboard)
3. **Password Reset**: User requests reset → Email sent → Password updated
4. **Protected Access**: Token validated → Route access granted/denied

### Key Dependencies
- **react** - UI library (v18+)
- **react-dom** - React DOM renderer
- **react-router-dom** - Client-side routing
- **react-hook-form** - Form management with validation
- **vite** - Build tool and development server (v5.4.10)

## API Integration

The client communicates with a Node.js/Express backend:
- **Backend URL**: `http://localhost:8000`
- **Frontend URL**: `http://localhost:5173`
- **Authentication**: JWT tokens with automatic refresh
- **CORS**: Configured for cross-origin requests

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/request-reset` - Password reset request
- `POST /api/auth/reset` - Password reset confirmation
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### User Management Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete user account
- `GET /api/users` - Admin: List all users
- `PUT /api/users/:id/role` - Admin: Update user role

### Analytics Endpoints (Admin Only)
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/traffic` - Get traffic analytics
- `GET /api/analytics/performance` - Get performance metrics
- `GET /api/analytics/users` - Get user analytics

## Route Structure

### Public Routes
- `/` - Home page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/reset-password` - Password reset page
- `/auth/verify-email` - Email verification page

### Protected Routes
- `/dashboard` - User dashboard (requires authentication) - Personal user interface
- `/profile` - Profile editing page (requires authentication)
- `/settings` - Account settings overview (requires authentication)
- `/settings/password` - Password change page (requires authentication)

### Admin Routes
- `/admin/dashboard` - Admin dashboard (requires admin role)
- `/admin/users` - User management (requires admin role)
- `/admin/analytics` - User analytics dashboard (requires admin role)
- `/admin/page-views` - Page views analytics dashboard (requires admin role)

### Error Routes
- `/unauthorized` - 403 access denied
- `*` - 404 not found

## Environment Variables

### Development Environment
Create a `.env.development` file in the client directory:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Equus Website
```

### Production Environment
Create a `.env.production` file in the client directory:
```env
VITE_API_URL=https://equus-website-api.onrender.com
VITE_APP_NAME=Equus Website
```

**Note**: Environment variables in Vite must be prefixed with `VITE_` to be accessible in the client code.

## Production Deployment

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your web server
3. Configure environment variables for production
4. Set up proper HTTPS and security headers
5. Configure backend CORS for production domain

## Recent Improvements

### User Profile Management System (Latest - July 2025)
Complete frontend user profile management system implemented to work with existing backend API endpoints. This system provides users with comprehensive profile editing, settings management, and password change functionality.

#### 🎯 **Project Goal - ACHIEVED**
Created a complete frontend user profile management system that connects seamlessly to the existing backend API endpoints, filling the gap where dashboard navigation links existed but components were missing.

#### 📋 **Components Implemented**

**1. Profile Edit Page (`/profile`)**
- **File**: `client/src/pages/user/Profile.jsx`
- **Features**: Edit firstName, lastName, username, bio, avatar with real-time validation, live avatar preview, profile completion percentage display, save/cancel functionality with loading states, success/error messaging with auto-dismiss

**2. Account Settings Page (`/settings`)**
- **File**: `client/src/pages/user/Settings.jsx`
- **Features**: Account overview with profile information, email verification status indicators, account security information dashboard, navigation to other settings pages, quick actions for common tasks, secure logout with confirmation

**3. Password Change Page (`/settings/password`)**
- **File**: `client/src/pages/user/PasswordChange.jsx`
- **Features**: Current password validation, new password with real-time strength indicator, confirm password matching validation, security best practices messaging, password requirements display, password visibility toggles

**4. Routing Integration (`App.jsx`)**
- **Updates**: Added lazy imports for all profile components, added protected routes for `/profile`, `/settings`, `/settings/password`, integrated with existing ProtectedRoute wrapper

#### 🔧 **Technical Implementation**
- **Form Validation & UX**: React Hook Form for state management, real-time validation with immediate feedback, button state logic (disabled until valid changes), loading states during API calls, comprehensive error messaging
- **API Integration**: `authService.updateProfile(userData)`, `authService.changePassword(passwordData)`, `authService.getCurrentUser()`, automatic user context updates after changes
- **UI/UX Design**: UserLayout integration for consistent navigation, following existing `equus-*` CSS patterns, responsive design with mobile-first approach, accessibility with proper labels and keyboard navigation

#### 🎨 **Styling Solutions**
- **Button Visibility Fix**: Resolved global CSS reset `button { background: none; }` override issue with inline styles and proper state management
- **Form Consistency**: Unified styling across all forms to match existing design patterns, visual feedback for required fields and validation states, user guidance with help text explaining button disabled states

#### 🧪 **Testing Completed**
✅ Navigation from dashboard to all profile pages works correctly  
✅ Profile editing form validates and saves data to backend  
✅ Password change with security validation functions properly  
✅ Settings overview displays accurate account information  
✅ Button styling is visible and functional across all states  
✅ Form validations work as expected with real-time feedback  
✅ Success and error messages display and dismiss properly  
✅ Responsive design works on different screen sizes  
✅ Avatar preview functionality works with valid URLs  
✅ Profile completion tracking updates correctly  

#### 📊 **Features Breakdown**
- **Security Features**: Password strength indicators with visual feedback, current password validation before changes, account lockout information display, secure logout with double-click confirmation, password visibility toggles
- **User Experience Features**: Profile completion percentage tracking, avatar preview with error handling, real-time form validation, loading states during API operations, success messaging with auto-dismiss, help text for disabled buttons, breadcrumb navigation, quick action buttons
- **Data Management Features**: Profile data CRUD operations, form state management with react-hook-form, local context updates after successful changes, proper error handling and recovery, input sanitization and validation

#### 🔗 **Integration Points**
- **Backend API Endpoints**: `PUT /api/users/profile` (profile updates), `GET /api/users/profile` (profile retrieval), `PUT /api/users/password` (password changes)
- **Frontend Components**: UserLayout for consistent navigation, AuthContext for user state management, existing UI components (Card, Button, Input, etc.), form validation patterns from auth components

#### 🎉 **Final Status: COMPLETE AND FUNCTIONAL**
All user profile management features have been successfully implemented, tested, and integrated. The system provides complete profile editing with validation, secure password management with strength indicators, comprehensive settings with account overview and security information, seamless navigation from dashboard to all profile pages, consistent design unified across all components, and professional UX with loading states, validation feedback, and error handling.

The missing frontend profile management functionality has been fully restored, connecting the existing dashboard navigation to a complete, functional profile management system.

**Implementation Date**: July 20, 2025 | **Status**: Production Ready | **Manual Testing**: Completed Successfully

### Page Views Analytics System
- **✅ Analytics Dashboard**: Complete page views analytics with 4 comprehensive tabs (Overview, Traffic, Performance, Users)
- **✅ Real-time Data Collection**: Automatic tracking of page views, sessions, and user activity
- **✅ Admin Integration**: Easy access via admin dashboard with "📄 Page Views Analytics" button
- **✅ Time Period Filters**: Support for 1h, 24h, 7d, 30d, 90d analytics periods
- **✅ Session Tracking**: UUID-based session management with visitor analytics
- **✅ Performance Monitoring**: Response time and error rate tracking
- **✅ User Analytics**: Authenticated vs anonymous user differentiation

### Form Consistency & Validation
- **✅ Unified Form Styling**: All forms now use consistent design with light background, blue left border, and matching button styles
- **✅ Real-time Validation**: Button disable logic implemented across all forms until validation passes
- **✅ Required Field Indicators**: Asterisks (*) added to all required fields for user clarity
- **✅ Contact Form Integration**: Professional contact form with rate limiting and database storage
- **✅ Layout Optimization**: Fixed header/footer with scrollable content, reduced component heights

### User Experience Enhancements
- **✅ Dashboard Separation**: Distinct user and admin dashboards with role-appropriate interfaces
- **✅ Clickable Header**: Logo/header now navigates to home page
- **✅ Role-Based Navigation**: Admin users redirect to admin dashboard, regular users to user dashboard after login
- **✅ Contact Form CTA**: Added invitation to sign in/register below contact form
- **✅ Fixed Layout**: Proper header/footer positioning with scrollable main content

### Technical Improvements
- **✅ AuthForm Validation**: Comprehensive form validation with real-time feedback
- **✅ Button State Management**: Proper disabled states with visual feedback
- **✅ Label Consistency**: Left-aligned labels across all forms
- **✅ Error Handling**: Enhanced error messaging and status indicators
- **✅ Authentication Flow**: Fixed email verification and password reset URLs

## Contributing

1. Follow the existing component structure
2. Use the established authentication patterns
3. Add proper error handling and loading states
4. Include form validation for user inputs
5. Test authentication flows thoroughly
6. Maintain responsive design principles
7. Ensure form consistency with required field indicators
8. Use the unified form styling patterns
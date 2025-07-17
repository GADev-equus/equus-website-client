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
│   │   │   └── Dashboard.jsx     # Personal user dashboard
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
2. **Login**: User signs in → JWT token issued → Access granted
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

### Page Views Analytics System (Latest)
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
- **✅ Improved Navigation**: Users redirect to dashboard after login instead of home
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
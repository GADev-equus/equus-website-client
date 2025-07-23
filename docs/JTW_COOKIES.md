1. Overview
This guide ensures:

Users can log in at equussystems.co

Auth session is automatically shared with ai-tutor.equussystems.co

Only authenticated users can access the subdomain

Secure practices for modern browsers and hosts

2. Requirements
All frontends and backend must be served over HTTPS

You control the API backend and both frontend domains

You use JWT tokens in HttpOnly cookies for authentication

3. Express API (Backend) Setup
A. Install and Configure CORS
bash
CopyEdit
npm install cors cookie-parser
js
CopyEdit
// server.js or app.js
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({
  origin: [
    'https://equussystems.co',
    'https://ai-tutor.equussystems.co',
    'https://ai-tfl.equussystems.co'
  ],
  credentials: true, // allow cookies to be sent
}));
B. Set Secure Auth Cookie on Login
js
CopyEdit
// On successful login/signup (e.g. POST /auth/login)
res.cookie('auth_token', jwtToken, {
  domain: '.equussystems.co',   // allow all subdomains
  path: '/',
  httpOnly: true,               // not accessible via JS
  secure: true,                 // HTTPS only
  sameSite: 'none',             // required for cross-domain
  maxAge: 3600 * 1000,          // 1 hour (adjust as needed)
});
res.status(200).json({ message: 'Login successful' });
C. Authenticate via Cookie (Middleware Example)
js
CopyEdit
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Usage:
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});
4. React Frontend (Main & Subdomain)
A. Making Authenticated API Calls
With Fetch:

js
CopyEdit
fetch('https://api.equussystems.co/api/protected', {
  credentials: 'include', // crucial: sends cookie!
});
With Axios:

js
CopyEdit
import axios from 'axios';

axios.get('https://api.equussystems.co/api/protected', {
  withCredentials: true, // crucial!
});
B. Protecting Routes in the Subdomain
On ai-tutor.equussystems.co, every protected route/component should check authentication status:

js
CopyEdit
// src/hooks/useAuthGuard.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://api.equussystems.co/api/protected', { withCredentials: true })
      .catch(() => navigate('https://equussystems.co/login'));
  }, [navigate]);
}
Usage in a Component:

js
CopyEdit
import useAuthGuard from './hooks/useAuthGuard';

function ProtectedPage() {
  useAuthGuard();
  return <div>Secret content</div>;
}
C. Logging Out (Clear Cookie on Backend)
js
CopyEdit
// Express logout route
app.post('/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    domain: '.equussystems.co',
    path: '/',
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });
  res.status(200).json({ message: 'Logged out' });
});
On frontend, after logout, redirect user to main site.

5. Troubleshooting Checklist
 All sites use HTTPS (cookies will not work cross-domain on HTTP)

 Cookie has: domain: '.equussystems.co', path: '/', httpOnly: true, secure: true, sameSite: 'none'

 API CORS config includes all frontends, and credentials: true

 All frontend API calls use credentials: 'include' or withCredentials: true

 Protected routes on subdomain redirect unauthenticated users to main site

6. Notes & Security
Never store sensitive tokens in localStorage for SSO across subdomains.

If your API is public (e.g., api.equussystems.co), use CORS and cookie settings to restrict access.

Set short expiry times for JWT cookies; offer refresh tokens if needed.

For advanced SSO, consider OAuth2/OIDC in the future.

7. Example Folder Structure
bash
CopyEdit
/backend   # Node/Express API
/frontend-main   # React (equussystems.co)
/frontend-ai-tutor   # React (ai-tutor.equussystems.co)
8. Resources
MDN: Set-Cookie documentation

Express.js CORS

Cookie sharing across subdomains
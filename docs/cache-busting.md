# Cache Busting Strategy Documentation

## Overview

This document outlines the comprehensive cache busting strategy implemented for the Equus Systems website to ensure users always receive the latest version of the application without manual cache clearing.

## Implementation Components

### 1. **Vite Build Configuration**

The `vite.config.js` file has been configured with explicit hash naming for all build outputs:

```javascript
build: {
  rollupOptions: {
    output: {
      // Explicit hash configuration for cache busting
      chunkFileNames: `assets/[name].[hash].js`,
      entryFileNames: `assets/[name].[hash].js`,
      assetFileNames: `assets/[name].[hash].[ext]`,
      
      manualChunks: {
        // Vendor chunks with hashed names
        'react-vendor': ['react', 'react-dom'],
        'router-vendor': ['react-router-dom'],
        'ui-vendor': ['@radix-ui/react-slot', 'lucide-react'],
        'admin': [...],
        'auth': [...]
      }
    }
  }
}
```

**Benefits:**
- Every build generates unique filenames (e.g., `main.abc123.js`)
- Browsers automatically fetch new files when content changes
- Unchanged chunks retain their cached versions for faster loading

### 2. **HTML Cache Prevention**

The `index.html` file includes meta tags to prevent HTML caching:

```html
<!-- Cache Control Meta Tags - Prevent HTML caching -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

**Purpose:**
- Ensures the HTML file (which references the hashed assets) is never cached
- Prevents the scenario where cached HTML references old asset filenames
- Forces browsers to always fetch the latest index.html

### 3. **Server-Side Cache Headers**

## Server Configuration by Platform

### **Render.com (Current Hosting)**

Render automatically handles static asset caching, but you can enhance it with a `render.yaml` file:

```yaml
services:
  - type: web
    name: equus-website
    env: node
    plan: free
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
    headers:
      - path: /assets/*
        name: Cache-Control
        value: public, max-age=31536000, immutable
      - path: /
        name: Cache-Control
        value: no-cache, no-store, must-revalidate
```

### **Netlify Alternative**

If deploying to Netlify, create `public/_headers`:

```
# Cache static assets for 1 year
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Don't cache HTML
/*
  Cache-Control: no-cache, no-store, must-revalidate
  
/*.html
  Cache-Control: no-cache, no-store, must-revalidate
```

### **Vercel Alternative**

If deploying to Vercel, create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### **Express.js Server (If Using Custom Server)**

If serving with Express.js, add middleware:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Cache static assets for 1 year
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
  maxAge: '1y',
  immutable: true
}));

// Don't cache HTML files
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: 0,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));
```

## Build Output Verification

### **Expected Build Structure**

After running `npm run build`, you should see:

```
dist/
├── index.html                    # No hash (always fetched fresh)
├── assets/
│   ├── main.abc123.js           # Hashed main entry
│   ├── main.abc123.css          # Hashed main CSS
│   ├── react-vendor.def456.js   # Hashed vendor chunk
│   ├── admin.ghi789.js          # Hashed admin chunk
│   └── auth.jkl012.js           # Hashed auth chunk
└── vite.svg                     # Static assets
```

### **Verification Commands**

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "build:verify": "npm run build && ls -la dist/assets/ | grep -E '\\.[a-f0-9]{8}\\.'",
    "build:analyze": "npm run build && du -sh dist/assets/*"
  }
}
```

## Testing Cache Busting

### **Manual Testing Steps**

1. **Initial Build:**
   ```bash
   npm run build
   ls dist/assets/
   # Note the hash values in filenames
   ```

2. **Make a Change:**
   - Edit any source file (e.g., add a console.log)
   - Run `npm run build` again

3. **Verify Hash Change:**
   ```bash
   ls dist/assets/
   # Hash values should be different for changed files
   # Unchanged vendor chunks should retain same hash
   ```

4. **Browser Testing:**
   - Deploy the first build
   - Load the site and check Network tab
   - Deploy the second build
   - Hard refresh (Ctrl+F5) and verify new assets load

### **Automated Testing**

Create a test script to verify cache busting:

```javascript
// test-cache-busting.js
const fs = require('fs');
const path = require('path');

function extractHashes(buildDir) {
  const assetsDir = path.join(buildDir, 'assets');
  const files = fs.readdirSync(assetsDir);
  
  return files.map(file => {
    const match = file.match(/\.([a-f0-9]{8})\./);
    return match ? { file, hash: match[1] } : null;
  }).filter(Boolean);
}

// Compare hashes between builds
console.log('Build 1 hashes:', extractHashes('dist-1'));
console.log('Build 2 hashes:', extractHashes('dist-2'));
```

## Cache Strategy Benefits

### **Performance Benefits**
- **Faster Load Times**: Unchanged vendor chunks stay cached
- **Reduced Bandwidth**: Only changed files are re-downloaded
- **Improved UX**: No "hard refresh" needed for updates

### **Deployment Benefits**
- **Zero-Downtime Updates**: New versions deploy without cache conflicts
- **Rollback Safety**: Old versions can be restored without cache issues
- **A/B Testing**: Different versions can coexist

### **Development Benefits**
- **Predictable Updates**: Developers can ensure users get latest features
- **Debugging**: Clear separation between cached and fresh content
- **Monitoring**: Can track which assets are being cached vs. fetched

## Troubleshooting

### **Common Issues**

1. **Users Still See Old Version:**
   - Check if server is sending proper cache headers
   - Verify HTML is not being cached
   - Test with different browsers/incognito mode

2. **Assets Not Loading:**
   - Verify build output has correct hash structure
   - Check server is serving assets with correct MIME types
   - Ensure CDN/proxy isn't modifying filenames

3. **Build Size Increases:**
   - Review manual chunk configuration
   - Consider lazy loading for large features
   - Analyze bundle with `npm run build:analyze`

### **Debug Commands**

```bash
# Check build output
npm run build && find dist -name "*.js" -o -name "*.css" | head -20

# Verify server headers (replace with your domain)
curl -I https://your-site.com/assets/main.abc123.js
curl -I https://your-site.com/

# Test cache behavior
curl -H "Cache-Control: no-cache" https://your-site.com/
```

## Best Practices

### **Development Workflow**
1. Test cache busting in production-like environment
2. Monitor build output for unexpected hash changes
3. Use browser dev tools to verify cache behavior
4. Document any custom server configurations

### **Deployment Checklist**
- [ ] Build generates hashed filenames
- [ ] HTML includes cache-control meta tags
- [ ] Server sends appropriate cache headers
- [ ] Test in multiple browsers
- [ ] Verify mobile performance
- [ ] Monitor CDN behavior (if applicable)

This cache busting strategy ensures that your page views counter and all future updates deploy reliably without requiring users to manually clear their browser cache.
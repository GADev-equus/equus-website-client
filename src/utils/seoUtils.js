/**
 * SEO Utilities for Performance and Meta Management
 */

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3j6zbXWjgevT5.woff2',
    'https://fonts.gstatic.com/s/sen/v8/6xKjdSBYKcSV-LCoeQqfX1RYOo3qPZZMkids.woff2'
  ];

  fontPreloads.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Generate dynamic page titles
export const generatePageTitle = (pageName, includesSiteName = true) => {
  const siteName = 'Equus Systems';
  if (!pageName || pageName === siteName) return siteName;
  return includesSiteName ? `${pageName} | ${siteName}` : pageName;
};

// Generate breadcrumb data for SEO
export const generateBreadcrumbs = (path) => {
  const pathSegments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: 'https://equussystems.co' }];
  
  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    breadcrumbs.push({
      name,
      url: `https://equussystems.co${currentPath}`
    });
  });
  
  return breadcrumbs;
};

// Clean and validate URLs
export const normalizeUrl = (url, baseUrl = 'https://equussystems.co') => {
  if (!url) return baseUrl;
  if (url.startsWith('http')) return url;
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Image optimization for SEO
export const optimizeImageForSEO = (src, alt, title) => {
  return {
    src: normalizeUrl(src),
    alt: alt || title || 'Equus Systems',
    title: title || alt || 'Equus Systems',
    loading: 'lazy',
    decoding: 'async'
  };
};

// Track page views for SEO analytics
export const trackSEOPageView = (pageName, url) => {
  if (typeof window !== 'undefined') {
    // You can integrate with Google Analytics, Plausible, etc.
    console.log(`SEO Page View: ${pageName} - ${url}`);
    
    // If Google Analytics is loaded
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: url
      });
    }
  }
};

// Generate meta description based on content
export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) return 'Advanced technology solutions and AI-powered applications for modern businesses.';
  
  // Remove HTML tags and extra whitespace
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  if (cleanContent.length <= maxLength) return cleanContent;
  
  // Truncate at word boundary
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
};

// Create Open Graph image URL
export const createOGImageUrl = (title, description = '') => {
  // This would typically generate a dynamic OG image
  // For now, return the default favicon
  return 'https://equussystems.co/favicon.ico';
};

// SEO-friendly URL slug generation
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Initialize SEO performance monitoring
export const initSEOPerformance = () => {
  if (typeof window !== 'undefined') {
    // Preload critical resources
    preloadCriticalResources();
    
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }
};
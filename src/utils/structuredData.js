/**
 * Structured Data Utilities for SEO
 * Generates JSON-LD structured data for better search engine understanding
 */

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Equus Systems Ltd.',
  url: 'https://equussystems.co',
  logo: 'https://equussystems.co/favicon.ico',
  description:
    'Advanced technology solutions and AI-powered applications for modern businesses.',
  foundingDate: '2024',
  sameAs: [
    'https://github.com/equussystems',
    'https://linkedin.com/company/equussystems',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  areaServed: 'Worldwide',
  knowsAbout: [
    'Web Development',
    'Artificial Intelligence',
    'Business Automation',
    'Technology Solutions',
  ],
});

export const createWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Equus Systems Ltd.',
  url: 'https://equussystems.co',
  description:
    'Advanced technology solutions and AI-powered applications for modern businesses.',
  publisher: {
    '@type': 'Organization',
    name: 'Equus Systems Ltd.',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://equussystems.co/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const createWebPageSchema = (pageData) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: pageData.title,
  description: pageData.description,
  url: pageData.url,
  isPartOf: {
    '@type': 'WebSite',
    name: 'Equus Systems Ltd.',
    url: 'https://equussystems.co',
  },
  about: {
    '@type': 'Thing',
    name: pageData.topic || pageData.title,
  },
  datePublished: pageData.datePublished || new Date().toISOString(),
  dateModified: pageData.dateModified || new Date().toISOString(),
  author: {
    '@type': 'Organization',
    name: 'Equus Systems Ltd.',
  },
});

export const createSoftwareApplicationSchema = (appData) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: appData.name,
  description: appData.description,
  url: appData.url,
  applicationCategory: 'WebApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Equus Systems Ltd.',
  },
  softwareVersion: '1.0',
  releaseNotes: appData.features || 'Advanced AI-powered features',
});

export const createServiceSchema = (serviceData) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: serviceData.name,
  description: serviceData.description,
  provider: {
    '@type': 'Organization',
    name: 'Equus Systems Ltd.',
  },
  areaServed: 'Worldwide',
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: serviceData.url,
  },
  category: serviceData.category || 'Technology Services',
});

export const createBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

export const createFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// Combine multiple schemas into a single JSON-LD object
export const combineSchemas = (...schemas) => ({
  '@context': 'https://schema.org',
  '@graph': schemas,
});

// SEO page configurations
export const SEO_CONFIG = {
  home: {
    title: 'Equus Systems Ltd. - Advanced Technology Solutions',
    description:
      'Leading provider of AI-powered applications and advanced technology solutions for modern businesses. Explore our innovative web applications and automation tools.',
    keywords:
      'Equus Systems Ltd., technology solutions, AI applications, web development, business automation, TFL AI, transport, innovation',
    structuredData: combineSchemas(
      createOrganizationSchema(),
      createWebSiteSchema(),
      createWebPageSchema({
        title: 'Home - Equus Systems Ltd.',
        description:
          'Leading provider of AI-powered applications and technology solutions',
        url: 'https://equussystems.co',
        topic: 'Technology Solutions',
      }),
    ),
  },

  auth: {
    signin: {
      title: 'Sign In',
      description:
        'Sign in to your Equus Systems Ltd. account to access our AI-powered applications and services.',
      keywords: 'sign in, login, Equus Systems Ltd. account, authentication',
      noIndex: true,
    },
    signup: {
      title: 'Sign Up',
      description:
        'Create your Equus Systems Ltd. account to access cutting-edge AI applications and technology solutions.',
      keywords: 'sign up, register, create account, Equus Systems Ltd.',
      noIndex: true,
    },
    resetPassword: {
      title: 'Reset Password',
      description: 'Reset your Equus Systems Ltd. account password.',
      keywords: 'reset password, account recovery, Equus Systems Ltd.',
      noIndex: true,
    },
    verifyEmail: {
      title: 'Verify Email',
      description: 'Verify your Equus Systems Ltd. account email address.',
      keywords: 'email verification, account verification, Equus Systems Ltd.',
      noIndex: true,
    },
  },

  dashboard: {
    title: 'Dashboard',
    description:
      'Your Equus Systems Ltd. dashboard - access AI applications, manage your account, and explore our technology solutions.',
    keywords: 'dashboard, user portal, AI applications, account management',
    noIndex: true,
  },

  user: {
    dashboard: {
      title: 'User Dashboard',
      description:
        'Access your Equus Systems Ltd. dashboard and account overview.',
      keywords: 'user dashboard, Equus Systems Ltd., account overview',
      noIndex: true,
    },
    profile: {
      title: 'Edit Profile',
      description: 'Update your Equus Systems Ltd. profile details.',
      keywords: 'profile, account details, Equus Systems Ltd.',
      noIndex: true,
    },
    settings: {
      title: 'Account Settings',
      description: 'Manage your Equus Systems Ltd. account settings.',
      keywords: 'settings, account settings, Equus Systems Ltd.',
      noIndex: true,
    },
    passwordChange: {
      title: 'Change Password',
      description: 'Update your Equus Systems Ltd. account password.',
      keywords: 'change password, account security, Equus Systems Ltd.',
      noIndex: true,
    },
  },

  admin: {
    dashboard: {
      title: 'Admin Dashboard',
      description: 'Administrative overview of Equus Systems Ltd.',
      keywords: 'admin dashboard, Equus Systems Ltd., administration',
      noIndex: true,
    },
    users: {
      title: 'User Management',
      description: 'Manage Equus Systems Ltd. user accounts.',
      keywords: 'user management, admin, Equus Systems Ltd.',
      noIndex: true,
    },
    analytics: {
      title: 'Analytics',
      description: 'Review Equus Systems Ltd. analytics and metrics.',
      keywords: 'analytics, metrics, admin, Equus Systems Ltd.',
      noIndex: true,
    },
    pageViews: {
      title: 'Page Views',
      description: 'Monitor Equus Systems Ltd. page view analytics.',
      keywords: 'page views, analytics, admin, Equus Systems Ltd.',
      noIndex: true,
    },
    subdomainRequests: {
      title: 'Subdomain Requests',
      description: 'Review subdomain access requests.',
      keywords: 'subdomain requests, admin, Equus Systems Ltd.',
      noIndex: true,
    },
    contacts: {
      title: 'Contacts',
      description: 'Review contact submissions and inquiries.',
      keywords: 'contacts, inquiries, admin, Equus Systems Ltd.',
      noIndex: true,
    },
  },

  notFound: {
    title: 'Page Not Found',
    description:
      'The page you are looking for could not be found. Return to Equus Systems Ltd. to explore our technology solutions.',
    keywords: '404, page not found, Equus Systems Ltd.',
    noIndex: true,
  },

  unauthorized: {
    title: 'Unauthorized',
    description: 'You do not have permission to access this resource.',
    keywords: 'unauthorized, access denied, Equus Systems Ltd.',
    noIndex: true,
  },
};

// Extend with About page config
SEO_CONFIG.about = {
  title: 'About Equus Systems Ltd. — Agentic AI and Our Approach',
  description:
    'Learn about Equus Systems Ltd. and our Agentic AI approach: purpose-driven intelligence, integrated tools, contextual memory, and adaptive autonomy.',
  keywords:
    'About Equus Systems Ltd., Agentic AI, autonomous AI, AI consulting, tool-using agents, contextual memory, adaptive autonomy',
  structuredData: combineSchemas(
    createOrganizationSchema(),
    createWebPageSchema({
      title: 'About Equus Systems Ltd.',
      description:
        'Equus Systems builds agentic AI solutions that think, learn, and act to deliver lasting impact.',
      url: 'https://equussystems.co/about',
      topic: 'About Equus Systems',
    }),
  ),
};

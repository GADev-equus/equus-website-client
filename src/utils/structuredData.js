/**
 * Structured Data Utilities for SEO
 * Generates JSON-LD structured data for better search engine understanding
 */

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Equus Systems",
  url: "https://equussystems.co",
  logo: "https://equussystems.co/favicon.ico",
  description: "Advanced technology solutions and AI-powered applications for modern businesses.",
  foundingDate: "2024",
  sameAs: [
    "https://github.com/equussystems",
    "https://linkedin.com/company/equussystems"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "English"
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Web Development",
    "Artificial Intelligence",
    "Business Automation",
    "Technology Solutions"
  ]
});

export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Equus Systems",
  url: "https://equussystems.co",
  description: "Advanced technology solutions and AI-powered applications for modern businesses.",
  publisher: {
    "@type": "Organization",
    name: "Equus Systems"
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://equussystems.co/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

export const createWebPageSchema = (pageData) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageData.title,
  description: pageData.description,
  url: pageData.url,
  isPartOf: {
    "@type": "WebSite",
    name: "Equus Systems",
    url: "https://equussystems.co"
  },
  about: {
    "@type": "Thing",
    name: pageData.topic || pageData.title
  },
  datePublished: pageData.datePublished || new Date().toISOString(),
  dateModified: pageData.dateModified || new Date().toISOString(),
  author: {
    "@type": "Organization",
    name: "Equus Systems"
  }
});

export const createSoftwareApplicationSchema = (appData) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: appData.name,
  description: appData.description,
  url: appData.url,
  applicationCategory: "WebApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  publisher: {
    "@type": "Organization",
    name: "Equus Systems"
  },
  softwareVersion: "1.0",
  releaseNotes: appData.features || "Advanced AI-powered features"
});

export const createServiceSchema = (serviceData) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: serviceData.name,
  description: serviceData.description,
  provider: {
    "@type": "Organization",
    name: "Equus Systems"
  },
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: serviceData.url
  },
  category: serviceData.category || "Technology Services"
});

export const createBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url
  }))
});

export const createFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});

// Combine multiple schemas into a single JSON-LD object
export const combineSchemas = (...schemas) => ({
  "@context": "https://schema.org",
  "@graph": schemas
});

// SEO page configurations
export const SEO_CONFIG = {
  home: {
    title: 'Equus Systems - Advanced Technology Solutions',
    description: 'Leading provider of AI-powered applications and advanced technology solutions for modern businesses. Explore our innovative web applications and automation tools.',
    keywords: 'Equus Systems, technology solutions, AI applications, web development, business automation, TFL AI, transport, innovation',
    structuredData: combineSchemas(
      createOrganizationSchema(),
      createWebSiteSchema(),
      createWebPageSchema({
        title: 'Home - Equus Systems',
        description: 'Leading provider of AI-powered applications and technology solutions',
        url: 'https://equussystems.co',
        topic: 'Technology Solutions'
      })
    )
  },
  
  auth: {
    signin: {
      title: 'Sign In',
      description: 'Sign in to your Equus Systems account to access our AI-powered applications and services.',
      keywords: 'sign in, login, Equus Systems account, authentication',
      noIndex: true
    },
    signup: {
      title: 'Sign Up',
      description: 'Create your Equus Systems account to access cutting-edge AI applications and technology solutions.',
      keywords: 'sign up, register, create account, Equus Systems',
      noIndex: true
    }
  },
  
  dashboard: {
    title: 'Dashboard',
    description: 'Your Equus Systems dashboard - access AI applications, manage your account, and explore our technology solutions.',
    keywords: 'dashboard, user portal, AI applications, account management',
    noIndex: true
  },
  
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found. Return to Equus Systems to explore our technology solutions.',
    keywords: '404, page not found, Equus Systems',
    noIndex: true
  }
};
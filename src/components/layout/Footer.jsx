/**
 * Footer Component - Site footer with links and company information
 * Responsive footer with brand info, navigation links, and legal information
 */

import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/#about' },
      { name: 'Services', href: '/#services' },
      { name: 'Contact', href: '/#contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Support', href: '/support' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl text-foreground">EQUUS SYSTEMS</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-6">
              Empowering businesses with advanced AI solutions and consulting services. 
              Like the steadfast horse from which our name derives, we provide reliable 
              and powerful technology to propel your business forward.
            </p>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">
                Built with modern web technologies for optimal performance and security.
              </p>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} Equus Systems. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Tech Stack Badge */}
            <div className="text-xs text-muted-foreground">
              <span className="inline-flex items-center space-x-1">
                <span>Powered by</span>
                <span className="font-medium text-primary">React</span>
                <span>•</span>
                <span className="font-medium text-primary">Node.js</span>
                <span>•</span>
                <span className="font-medium text-primary">MongoDB</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Development Notice */}
      <div className="bg-accent/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🚧 This website is currently under development. Some features may be limited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
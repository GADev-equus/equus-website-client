/**
 * Home Page - Main landing page component
 * Displays hero section, services, about, and contact form
 * Uses Equus design system with Tailwind CSS utilities - migrated from inline styles
 */

import ContactForm from '@/components/ContactForm';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';

const Home = () => {
  return (
    <>
      <SEOHelmet
        title={SEO_CONFIG.home.title}
        description={SEO_CONFIG.home.description}
        keywords={SEO_CONFIG.home.keywords}
        structuredData={SEO_CONFIG.home.structuredData}
        url="https://equussystems.co"
      />
      <div className="container-equus">
        {/* Hero section */}
        <section className="equus-section equus-section-centered pt-12 pb-8">
          <h2 className="text-hero text-equus-primary font-semibold mb-6">
            EMPOWERING YOUR BUSINESS WITH AI
          </h2>
          <p className="text-body-large text-equus-muted container-content">
            Like the steadfast horse from which our name derives, we provide
            reliable and powerful AI solutions to propel your business forward.
          </p>
        </section>

        {/* Services section */}
        <section className="equus-section equus-section-centered">
          <h3 className="text-section-title text-equus-primary font-semibold">
            OUR SERVICES
          </h3>
          <div className="grid-equus-services">
            <div className="equus-card-highlighted">
              <h4 className="text-card-title text-equus-secondary font-semibold mb-4">
                AI Consulting
              </h4>
              <p className="text-equus-muted leading-relaxed">
                Strategic guidance to integrate AI into your business processes
              </p>
            </div>
            <div className="equus-card-highlighted">
              <h4 className="text-card-title text-equus-secondary font-semibold mb-4">
                Custom AI Solutions
              </h4>
              <p className="text-equus-muted leading-relaxed">
                Tailored artificial intelligence systems designed for your
                specific needs
              </p>
            </div>
            <div className="equus-card-highlighted">
              <h4 className="text-card-title text-equus-secondary font-semibold mb-4">
                Implementation Support
              </h4>
              <p className="text-equus-muted leading-relaxed">
                End-to-end assistance in deploying AI technologies
              </p>
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="equus-section equus-section-centered">
          <h3 className="text-section-title text-equus-primary font-semibold">
            ABOUT EQUUS
          </h3>
          <p className="text-body-large text-equus-muted container-content">
            <em className="font-semibold not-italic text-equus-primary">
              Equus
            </em>{' '}
            means "horse" in Latin, symbolizing strength, reliability, and
            forward momentum. At Equus Systems, we embody these qualities in our
            approach to AI consulting and solutions development.
          </p>
        </section>

        {/* Contact section */}
        <section className="equus-section equus-section-centered">
          <h3 className="text-section-title text-equus-primary font-semibold">
            CONTACT US
          </h3>
          <div className="flex justify-center w-full">
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

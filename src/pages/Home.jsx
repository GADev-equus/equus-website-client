/**
 * Home Page - Main landing page component
 * Displays hero section, services, about, and contact form
 * Uses Equus design system with Tailwind CSS - matches original App.css styling
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
      <div style={{ 
        maxWidth: 'var(--equus-max-width-container)',
        margin: '0 auto',
        padding: 'var(--equus-spacing-lg) var(--equus-spacing-sm)',
        width: '100%'
      }}>
        {/* Hero section */}
        <section className="equus-section" style={{ 
          paddingTop: 'var(--equus-spacing-xl)', 
          paddingBottom: 'var(--equus-spacing-lg)',
          textAlign: 'center'
        }}>
          <h2 className="font-semibold equus-text-spacing" style={{ 
            fontSize: '2rem',
            fontFamily: 'var(--equus-font-display)',
            color: 'var(--equus-primary)'
          }}>
            EMPOWERING YOUR BUSINESS WITH AI
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: 'var(--equus-line-height-relaxed)',
            color: 'var(--equus-text-secondary)',
            maxWidth: 'var(--equus-max-width-content)',
            margin: '0 auto'
          }}>
            Like the steadfast horse from which our name derives, we provide reliable and powerful AI solutions to propel your business forward.
          </p>
        </section>

        {/* Services section */}
        <section className="equus-section" style={{ textAlign: 'center' }}>
          <h3 className="font-semibold equus-text-spacing" style={{ 
            fontSize: '1.8rem',
            fontFamily: 'var(--equus-font-display)',
            color: 'var(--equus-primary)',
            marginBottom: 'var(--equus-spacing-lg)'
          }}>
            OUR SERVICES
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--equus-grid-gap)',
            justifyItems: 'center'
          }}>
            <div className="equus-card" style={{ 
              backgroundColor: 'var(--equus-background-white)',
              borderLeft: 'var(--equus-border-accent) solid var(--equus-primary)',
              width: '100%',
              maxWidth: '350px'
            }}>
              <h4 className="font-semibold equus-text-spacing" style={{ 
                fontSize: '1.3rem',
                fontFamily: 'var(--equus-font-alt)',
                color: 'var(--equus-secondary)'
              }}>
                AI Consulting
              </h4>
              <p style={{ 
                color: 'var(--equus-text-secondary)',
                lineHeight: 'var(--equus-line-height-base)'
              }}>
                Strategic guidance to integrate AI into your business processes
              </p>
            </div>
            <div className="equus-card" style={{ 
              backgroundColor: 'var(--equus-background-white)',
              borderLeft: 'var(--equus-border-accent) solid var(--equus-primary)',
              width: '100%',
              maxWidth: '350px'
            }}>
              <h4 className="font-semibold equus-text-spacing" style={{ 
                fontSize: '1.3rem',
                fontFamily: 'var(--equus-font-alt)',
                color: 'var(--equus-secondary)'
              }}>
                Custom AI Solutions
              </h4>
              <p style={{ 
                color: 'var(--equus-text-secondary)',
                lineHeight: 'var(--equus-line-height-base)'
              }}>
                Tailored artificial intelligence systems designed for your specific needs
              </p>
            </div>
            <div className="equus-card" style={{ 
              backgroundColor: 'var(--equus-background-white)',
              borderLeft: 'var(--equus-border-accent) solid var(--equus-primary)',
              width: '100%',
              maxWidth: '350px'
            }}>
              <h4 className="font-semibold equus-text-spacing" style={{ 
                fontSize: '1.3rem',
                fontFamily: 'var(--equus-font-alt)',
                color: 'var(--equus-secondary)'
              }}>
                Implementation Support
              </h4>
              <p style={{ 
                color: 'var(--equus-text-secondary)',
                lineHeight: 'var(--equus-line-height-base)'
              }}>
                End-to-end assistance in deploying AI technologies
              </p>
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="equus-section" style={{ textAlign: 'center' }}>
          <h3 className="font-semibold equus-text-spacing" style={{ 
            fontSize: '1.8rem',
            fontFamily: 'var(--equus-font-display)',
            color: 'var(--equus-primary)',
            marginBottom: 'var(--equus-spacing-lg)'
          }}>
            ABOUT EQUUS
          </h3>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: 'var(--equus-line-height-relaxed)',
            color: 'var(--equus-text-secondary)',
            maxWidth: 'var(--equus-max-width-content)',
            margin: '0 auto'
          }}>
            <em className="font-semibold not-italic" style={{ color: 'var(--equus-primary)' }}>Equus</em> means "horse" in Latin, symbolizing strength, reliability, and forward momentum. 
            At Equus Systems, we embody these qualities in our approach to AI consulting and solutions development.
          </p>
        </section>

        {/* Contact section */}
        <section className="equus-section" style={{ textAlign: 'center' }}>
          <h3 className="font-semibold equus-text-spacing" style={{ 
            fontSize: '1.8rem',
            fontFamily: 'var(--equus-font-display)',
            color: 'var(--equus-primary)',
            marginBottom: 'var(--equus-spacing-lg)'
          }}>
            CONTACT US
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
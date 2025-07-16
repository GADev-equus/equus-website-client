/**
 * Home Page - Main landing page component
 * Displays hero section, services, about, and contact form
 * Uses Equus design system with Tailwind CSS - matches original App.css styling
 */

import ContactForm from '@/components/ContactForm';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ 
      borderColor: 'var(--equus-border-color)',
      backgroundColor: 'var(--equus-background-dark)',
      border: 'var(--equus-border-width) solid var(--equus-border-color)'
    }}>
      {/* Header with gradient background */}
      <header className="text-white text-center" style={{ 
        background: 'var(--equus-gradient-primary)',
        padding: 'var(--equus-spacing-lg) var(--equus-spacing-sm)'
      }}>
        <h1 className="font-bold" style={{ 
          fontSize: '2.5rem', 
          letterSpacing: 'var(--equus-letter-spacing-tight)',
          fontFamily: 'var(--equus-font-display)',
          marginBottom: 'var(--equus-spacing-xs)'
        }}>
          EQUUS SYSTEMS
        </h1>
        <p className="opacity-90 font-light" style={{ 
          fontSize: '1.1rem' 
        }}>
          ADVANCED AI SOLUTIONS & CONSULTING
        </p>
      </header>

      {/* Main content */}
      <main style={{ 
        flex: 1,
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
      </main>

      {/* Footer with gradient background */}
      <footer className="text-white text-center mt-auto" style={{ 
        background: 'var(--equus-gradient-primary)',
        padding: 'var(--equus-spacing-lg) var(--equus-spacing-sm)'
      }}>
        <div className="rounded-lg mx-auto" style={{ 
          background: 'rgba(231, 76, 60, 0.1)', 
          border: 'var(--equus-border-width) solid var(--equus-accent)',
          borderRadius: 'var(--equus-border-radius)',
          maxWidth: 'var(--equus-max-width-notice)',
          padding: 'var(--equus-spacing-sm)'
        }}>
          <p className="font-bold" style={{ 
            marginBottom: 'var(--equus-spacing-xs)' 
          }}>This is a temporary holding page</p>
          <p className="opacity-80" style={{ 
            margin: '0' 
          }}>Our full website is currently under development</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
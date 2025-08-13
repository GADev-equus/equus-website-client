/**
 * Hero Component - Main hero section for home page
 * Professional implementation using CSS classes instead of inline styles
 */

import './Hero.css';
import DecorativeAccent from './ui/DecorativeAccent';

const Hero = () => {
  return (
    <section className="hero-section">
      {/* Background gradient overlay */}
      <div className="hero-background-overlay" />

      {/* Main content */}
      <div className="hero-content">
        {/* Main heading with enhanced styling */}
        <h1 className="hero-heading">
          <span className="hero-brand-name">EQUUS SYSTEMS Ltd.</span>
          <span className="hero-tagline">EMPOWERING YOUR BUSINESS THROUGH</span>
          <span className="hero-focus-word">AI</span>
        </h1>

        {/* Enhanced description */}
        <div className="hero-description-container">
          <p className="hero-description">
            Like the{' '}
            <strong className="hero-description-highlight-primary">
              steadfast horse
            </strong>{' '}
            from which our name derives, we provide
            <span className="hero-description-highlight-secondary">
              {' '}
              reliable and powerful AI solutions
            </span>{' '}
            to propel your business forward.
          </p>

          {/* Visual elements */}
          <div className="hero-pillars">
            <div className="hero-pillar">
              <div className="hero-pillar-dot hero-pillar-dot-primary"></div>
              <span className="hero-pillar-text hero-pillar-text-primary">
                PURPOSE DRIVEN
              </span>
            </div>
            <div className="hero-pillar-separator"></div>
            <div className="hero-pillar">
              <div className="hero-pillar-dot hero-pillar-dot-olive"></div>
              <span className="hero-pillar-text hero-pillar-text-olive">
                INTELLIGENCE
              </span>
            </div>
            <div className="hero-pillar-separator"></div>
            <div className="hero-pillar">
              <div className="hero-pillar-dot hero-pillar-dot-accent"></div>
              <span className="hero-pillar-text hero-pillar-text-accent">
                AUTONOMY
              </span>
            </div>
            <div className="hero-pillar-separator"></div>
            <div className="hero-pillar">
              <div className="hero-pillar-dot hero-pillar-dot-primary"></div>
              <span className="hero-pillar-text hero-pillar-text-primary">
                CONTEXTUAL AWARENESS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

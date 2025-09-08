/**
 * Home Page - Main landing page component
 * Displays hero section, services, about, and contact form
 * Uses Equus design system with Tailwind CSS utilities - migrated from inline styles
 */

import ContactForm from '@/components/ContactForm';
import SEOHelmet from '@/components/shared/SEOHelmet';
import Hero from '@/components/Hero';
import { SEO_CONFIG } from '@/utils/structuredData';
import { Fieldset, Card, CardTitle, CardDescription } from '@/components/ui';
import DecorativeAccent from '@/components/ui/DecorativeAccent';
import AnimatedSection from '@/components/ui/AnimatedSection';

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
        <Hero />

        {/* Services section with staggered animations */}
        <AnimatedSection 
          animation="fade-in"
          as="section"
          className="equus-section equus-section-centered"
        >
          <Fieldset legend="OUR SERVICES" size="lg">
            <div className="grid-equus-services">
              <AnimatedSection 
                animation="slide-up"
                delay={100}
              >
                <Card variant="service" size="equus">
                  <CardTitle>Strategic AI Consulting</CardTitle>
                  <CardDescription>
                    In-depth assessments to identify high-impact opportunities,
                    define success metrics, and align AI initiatives with your
                    core business goals
                  </CardDescription>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection 
                animation="slide-up"
                delay={300}
              >
                <Card variant="service" size="equus">
                  <CardTitle>Custom AI Development</CardTitle>
                  <CardDescription>
                    End-to-end delivery—from agentic AI solutions and
                    knowledge-graph-driven architectures, to seamless integration
                    and optimization
                  </CardDescription>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection 
                animation="slide-up"
                delay={500}
              >
                <Card variant="service" size="equus">
                  <CardTitle>Agentic Workflows & Graph Flows</CardTitle>
                  <CardDescription>
                    We build autonomous, multi-agent systems powered by
                    intelligent graph structures that coordinate tasks, contextual
                    decision-making, and dynamic execution without human
                    bottlenecks
                  </CardDescription>
                </Card>
              </AnimatedSection>
            </div>
          </Fieldset>
        </AnimatedSection>

        {/* About section (teaser) with fade-in animation */}
        <AnimatedSection 
          animation="fade-in"
          as="section"
          className="equus-section equus-section-centered"
          id="about"
        >
          <Fieldset legend="ABOUT EQUUS" size="lg">
            <div className="flex justify-center w-full">
              <AnimatedSection 
                animation="scale-in"
                delay={200}
              >
                <Card variant="service" size="equus">
                  <CardDescription>
                    We build Agentic AI systems that go beyond simple
                    automation—solutions that think, learn, and act to deliver
                    lasting impact.
                  </CardDescription>
                  <div className="mt-4">
                    <a className="text-equus-primary underline" href="/about">
                      Read the full story →
                    </a>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </Fieldset>
        </AnimatedSection>

        {/* Contact section with slide-up animation */}
        <AnimatedSection 
          animation="fade-in"
          as="section"
          className="equus-section equus-section-centered"
          id="contact"
        >
          <Fieldset legend="CONTACT US" size="lg">
            <div className="flex justify-center w-full">
              <AnimatedSection 
                animation="slide-up"
                delay={200}
              >
                <ContactForm />
              </AnimatedSection>
            </div>
          </Fieldset>
        </AnimatedSection>
      </div>
    </>
  );
};

export default Home;

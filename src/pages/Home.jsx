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

        {/* Services section */}
        <section className="equus-section equus-section-centered">
          <Fieldset legend="OUR SERVICES" size="lg">
            <div className="grid-equus-services">
              <Card variant="service" size="equus">
                <CardTitle>Strategic AI Consulting</CardTitle>
                <CardDescription>
                  In-depth assessments to identify high-impact opportunities,
                  define success metrics, and align AI initiatives with your
                  core business goals
                </CardDescription>
              </Card>
              <Card variant="service" size="equus">
                <CardTitle>Custom AI Development</CardTitle>
                <CardDescription>
                  End-to-end delivery—from agentic AI solutions and
                  knowledge-graph-driven architectures, to seamless integration
                  and optimization
                </CardDescription>
              </Card>
              <Card variant="service" size="equus">
                <CardTitle>Agentic Workflows & Graph Flows</CardTitle>
                <CardDescription>
                  We build autonomous, multi-agent systems powered by
                  intelligent graph structures that coordinate tasks, contextual
                  decision-making, and dynamic execution without human
                  bottlenecks
                </CardDescription>
              </Card>
            </div>
          </Fieldset>
        </section>

        {/* Section divider */}
        <div className="relative py-8">
          <DecorativeAccent
            position="center"
            width="12rem"
            height="0.25rem"
            gradient="primary-secondary"
          />
        </div>

        {/* About section (teaser) */}
        <section className="equus-section equus-section-centered" id="about">
          <Fieldset legend="ABOUT EQUUS" size="lg">
            <div className="flex justify-center w-full">
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
            </div>
          </Fieldset>
        </section>

        {/* Section divider */}
        <div className="relative py-8">
          <DecorativeAccent
            position="center"
            width="12rem"
            height="0.25rem"
            gradient="olive-accent"
          />
        </div>

        {/* Contact section */}
        <section className="equus-section equus-section-centered" id="contact">
          <Fieldset legend="CONTACT US" size="lg">
            <div className="flex justify-center w-full">
              <ContactForm />
            </div>
          </Fieldset>
        </section>
      </div>
    </>
  );
};

export default Home;

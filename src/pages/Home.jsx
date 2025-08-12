/**
 * Home Page - Main landing page component
 * Displays hero section, services, about, and contact form
 * Uses Equus design system with Tailwind CSS utilities - migrated from inline styles
 */

import ContactForm from '@/components/ContactForm';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';
import { Fieldset, Card, CardTitle, CardDescription } from '@/components/ui';

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
          <h2 className="text-hero text-equus-primary font-semibold mb-6 heading-underline-olive">
            EMPOWERING YOUR BUSINESS WITH AI
          </h2>
          <p className="text-body-large text-equus-muted container-content">
            Like the steadfast horse from which our name derives, we provide
            reliable and powerful AI solutions to propel your business forward.
          </p>
        </section>

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

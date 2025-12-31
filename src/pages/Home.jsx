/**
 * Home Page - Main landing page component
 * Displays hero section, services, about, and contact form
 * Uses Equus design system with Tailwind CSS utilities - migrated from inline styles
 */

import { Link } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';
import SEOHelmet from '@/components/shared/SEOHelmet';
import Hero from '@/components/Hero';
import { SEO_CONFIG } from '@/utils/structuredData';
import {
  Fieldset,
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
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
              <AnimatedSection animation="slide-up" delay={100}>
                <Card variant="service" size="equus">
                  <CardTitle>Agentic Workflows and Graph Flows</CardTitle>
                  <CardDescription>
                    We develop autonomous multi-agent systems (MAS) leveraging
                    intelligent graph-based architectures to enable scalable
                    task execution, dynamic coordination, contextual
                    decision-making, and decentralized operations—removing
                    constraints and minimizing dependence on manual processes,
                    and enhancing overall system efficiency
                  </CardDescription>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={500}>
                <Card variant="service" size="equus">
                  <CardTitle>Custom AI Development</CardTitle>
                  <CardDescription>
                    End-to-end delivery: from agentic AI solutions and
                    knowledge-graph-driven architectures, to seamless
                    integration and optimisation
                  </CardDescription>
                </Card>
                <Card variant="service" size="equus">
                  <CardTitle>Strategic AI Consulting</CardTitle>
                  <CardDescription>
                    In-depth assessments to identify high-impact opportunities,
                    define success metrics, and align AI initiatives with your
                    core business goals
                  </CardDescription>
                </Card>
              </AnimatedSection>
            </div>
          </Fieldset>
        </AnimatedSection>

        {/* About section using services layout */}
        <AnimatedSection
          animation="fade-in"
          as="section"
          className="equus-section equus-section-centered"
          id="about"
        >
          <Fieldset legend="ABOUT EQUUS" size="lg">
            <div className="grid-equus-services">
              <AnimatedSection animation="slide-up" delay={100}>
                <Card variant="service" size="equus">
                  <CardTitle>Purpose-Driven Intelligence</CardTitle>
                  <CardContent>
                    <p className="text-equus-muted text-sm sm:text-base leading-relaxed mb-3">
                      Agentic systems understand objectives and pursue outcomes
                      rather than waiting for instructions.
                    </p>
                    <ul className="about-list space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
                      <li>interpreting goals instead of one-off prompts.</li>
                      <li>
                        decomposing complex challenges into manageable steps.
                      </li>
                      <li>
                        persisting until the job is done, adjusting course as
                        needed.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={250}>
                <Card variant="service" size="equus">
                  <CardTitle>Partner with Equus</CardTitle>
                  <CardContent>
                    <p className="text-equus-muted text-sm sm:text-base leading-relaxed mb-4">
                      We translate these principles into solutions that make
                      complex journeys intuitive and effective for your teams.
                    </p>
                    <Link className="text-equus-primary underline" to="/about">
                      Read the full story
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={400}>
                <Card variant="service" size="equus">
                  <CardTitle>Contextual Awareness</CardTitle>
                  <CardContent>
                    <p className="text-equus-muted text-sm sm:text-base leading-relaxed mb-3">
                      Memory and context enable smarter, more informed decisions
                      over time.
                    </p>
                    <ul className="about-list space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
                      <li>previous user interactions and results.</li>
                      <li>historical context to inform future choices.</li>
                      <li>evolving knowledge that improves with experience.</li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={550}>
                <Card variant="service" size="equus">
                  <CardTitle>Adaptive Autonomy</CardTitle>
                  <CardContent>
                    <p className="text-equus-muted text-sm sm:text-base leading-relaxed mb-3">
                      Equus systems adapt in real time, keeping teams focused on
                      outcomes rather than orchestration.
                    </p>
                    <ul className="about-list space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
                      <li>navigating unexpected challenges independently.</li>
                      <li>
                        adjusting strategies in real time based on feedback.
                      </li>
                      <li>learning from both success and failure.</li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={700}>
                <Card variant="service" size="equus">
                  <CardTitle>Integrated Tool Usage</CardTitle>
                  <CardContent>
                    <p className="text-equus-muted text-sm sm:text-base leading-relaxed mb-3">
                      Our agents interact with the wider ecosystem to deliver
                      measurable outcomes.
                    </p>
                    <ul className="about-list space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
                      <li>
                        connecting to APIs, databases, and third-party services.
                      </li>
                      <li>executing actions within digital environments.</li>
                      <li>
                        learning which tools are best for specific scenarios.
                      </li>
                    </ul>
                  </CardContent>
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
            <AnimatedSection animation="slide-up" delay={200}>
              <ContactForm />
            </AnimatedSection>
          </Fieldset>
        </AnimatedSection>
      </div>
    </>
  );
};

export default Home;

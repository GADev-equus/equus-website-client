/**
 * About Page - Detailed information about Equus Systems Ltd. and Agentic AI
 * Uses Fieldset and existing utilities to match site style.
 */

import { Link } from 'react-router-dom';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { Section } from '@/components/ui';
import { H2, H3 } from '@/components/ui/heading';
import { SEO_CONFIG } from '@/utils/structuredData';
import AnimatedSection from '@/components/ui/AnimatedSection';

const About = () => {
  return (
    <div className="container-equus">
      <SEOHelmet
        title={SEO_CONFIG?.about?.title || 'About Equus Systems Ltd.'}
        description={
          SEO_CONFIG?.about?.description ||
          'Learn about Equus Systems Ltd. and our Agentic AI approach.'
        }
        keywords={
          SEO_CONFIG?.about?.keywords ||
          'Equus Systems Ltd., About, Agentic AI, Autonomy, AI Consulting'
        }
        structuredData={SEO_CONFIG?.about?.structuredData}
        url="https://equussystems.co/about"
      />

      <div className="equus-section">
        <Section title="ABOUT EQUUS" size="lg">
          <article className="w-full px-4 sm:px-6 space-y-6 sm:space-y-8">
          {/* Intro with fade-in animation */}
          <AnimatedSection animation="fade-in" duration="slow" as="header">
            <H2
              variant="olive"
              align="center"
              className="mb-4 heading-underline-olive"
            >
              Agentic AI: Moving Beyond Traditional Intelligence
            </H2>
            <p className="text-equus-muted text-sm sm:text-base leading-relaxed max-w-prose text-center mx-auto">
              Traditional AI follows a simple formula: you ask, it answers. At
              Equus Systems Ltd., we embrace the next frontier: Agentic AI. You
              set the goal and it figures out the best way to get there.
            </p>
          </AnimatedSection>

          {/* Section 1 with slide-up animation */}
          <AnimatedSection
            animation="slide-up"
            delay={200}
            as="section"
          >
            <H3 variant="primary">Purpose-Driven Intelligence</H3>
            <p className="text-equus-muted mt-2 text-sm sm:text-base leading-relaxed">
              Unlike conventional AI that waits for instructions, agentic
              systems understand objectives and pursue outcomes. They're capable
              of:
            </p>
            <ul className="about-list mt-2 space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
              <li>interpreting goals instead of one-off prompts.</li>
              <li>decomposing complex challenges into manageable steps.</li>
              <li>
                persisting until the job is done, adjusting course as needed.
              </li>
            </ul>
          </AnimatedSection>

          {/* Section 2 with slide-up animation */}
          <AnimatedSection
            animation="slide-up"
            delay={400}
            as="section"
          >
            <H3 variant="primary">Integrated Tool Usage</H3>
            <p className="text-equus-muted mt-2 text-sm sm:text-base leading-relaxed">
              Agentic AI does not operate in isolation; it interacts with
              real-world tools and systems. These agents:
            </p>
            <ul className="about-list mt-2 space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
              <li>connecting to APIs, databases, and third-party services.</li>
              <li>executing actions within digital environments.</li>
              <li>
                learning over time which tools are best for specific scenarios.
              </li>
            </ul>
          </AnimatedSection>

          {/* Section 3 with slide-up animation */}
          <AnimatedSection
            animation="slide-up"
            delay={600}
            as="section"
          >
            <H3 variant="primary">Contextual Awareness with Memory</H3>
            <p className="text-equus-muted mt-2 text-sm sm:text-base leading-relaxed">
              To make smarter decisions, agentic systems remember. They retain:
            </p>
            <ul className="about-list mt-2 space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
              <li>previous user interactions and results.</li>
              <li>historical context to inform future choices.</li>
              <li>evolving knowledge that improves with experience.</li>
            </ul>
          </AnimatedSection>

          {/* Section 4 with slide-up animation */}
          <AnimatedSection
            animation="slide-up"
            delay={800}
            as="section"
          >
            <H3 variant="primary">Adaptive Autonomy</H3>
            <p className="text-equus-muted mt-2 text-sm sm:text-base leading-relaxed">
              Agentic AI is capable of independent thought and flexible action.
              This includes:
            </p>
            <ul className="about-list mt-2 space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive">
              <li>
                navigating unexpected challenges without human intervention.
              </li>
              <li>adjusting strategies in real-time based on feedback.</li>
              <li>learning from both success and failure.</li>
            </ul>
          </AnimatedSection>

          {/* Closing section with slide-up animation */}
          <AnimatedSection
            animation="slide-up"
            delay={300}
            as="section"
            className="space-y-3"
          >
            <H3 variant="primary">
              Empowering the Future with Equus Systems Ltd.
            </H3>
            <p className="text-equus-muted text-sm sm:text-base leading-relaxed">
              At Equus Systems we have taken these principles and have created
              solutions that solve real problems. By building these solutions
              using Agentic AI we have made what may seem complex and difficult
              appear simple and engaging.
            </p>
            <p className="text-equus-muted text-sm sm:text-base leading-relaxed">
              With this experience we can also engage with businesses to explore
              new products and solutions. We have many years of experience in
              software development focusing on how users engage with technology
              and get answers to questions.
            </p>
            <div>
              <Link to="/#contact" className="text-equus-primary underline">
                Get in touch with us
              </Link>
            </div>
          </AnimatedSection>
          </article>
        </Section>
      </div>
    </div>
  );
};

export default About;

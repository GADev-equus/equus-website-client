/**
 * About Page - Detailed information about Equus Systems and Agentic AI
 * Uses Fieldset and existing utilities to match site style.
 */

import { Link } from 'react-router-dom';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { Fieldset } from '@/components/ui';
import { SEO_CONFIG } from '@/utils/structuredData';

const About = () => {
  return (
    <div className="container-equus py-10 sm:py-12">
      <SEOHelmet
        title={SEO_CONFIG?.about?.title || 'About Equus Systems'}
        description={
          SEO_CONFIG?.about?.description ||
          'Learn about Equus Systems and our Agentic AI approach.'
        }
        keywords={
          SEO_CONFIG?.about?.keywords ||
          'Equus Systems, About, Agentic AI, Autonomy, AI Consulting'
        }
        structuredData={SEO_CONFIG?.about?.structuredData}
        url="https://equussystems.co/about"
      />

      <Fieldset legend="ABOUT EQUUS" size="lg">
        <article className="w-full px-4 sm:px-6 space-y-6 sm:space-y-8">
          {/* Intro */}
          <header>
            <h2 className="text-hero text-white font-semibold font-display mb-4 heading-underline-olive">
              Agentic AI: Moving Beyond Traditional Intelligence
            </h2>
            <p className="text-equus-muted text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8 max-w-prose">
              Traditional AI follows a simple formula: you ask → it answers. At
              Equus Systems, we embrace the next frontier: Agentic AI. You set
              the goal → it figures out the best way to get there.
            </p>
          </header>

          {/* Section 1 */}
          <section className="pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
              Purpose-Driven Intelligence
            </h3>
            <p className="text-equus-muted mt-2 text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8">
              Unlike conventional AI that waits for instructions, agentic
              systems understand objectives and pursue outcomes. They're capable
              of:
            </p>
            <ul className="list-disc ml-5 sm:ml-6 mt-2 space-y-1 text-equus-muted text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8 marker:text-equus-olive">
              <li>Interpreting goals instead of one-off prompts</li>
              <li>Decomposing complex challenges into manageable steps</li>
              <li>
                Persisting until the job is done—adjusting course as needed
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
              Integrated Tool Usage
            </h3>
            <p className="text-equus-muted mt-2 text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8">
              Agentic AI doesn't operate in isolation—it interacts with
              real-world tools and systems. These agents:
            </p>
            <ul className="list-disc ml-5 sm:ml-6 mt-2 space-y-1 text-equus-muted text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8 marker:text-equus-olive">
              <li>Connect to APIs, databases, and third-party services</li>
              <li>Execute actions within digital environments</li>
              <li>
                Learn over time which tools are best for specific scenarios
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
              Contextual Awareness with Memory
            </h3>
            <p className="text-equus-muted mt-2 text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8">
              To make smarter decisions, agentic systems remember. They retain:
            </p>
            <ul className="list-disc ml-5 sm:ml-6 mt-2 space-y-1 text-equus-muted text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8 marker:text-equus-olive">
              <li>Previous user interactions and results</li>
              <li>Historical context to inform future choices</li>
              <li>Evolving knowledge that improves with experience</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
              Adaptive Autonomy
            </h3>
            <p className="text-equus-muted mt-2 text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8">
              Agentic AI is capable of independent thought and flexible action.
              This includes:
            </p>
            <ul className="list-disc ml-5 sm:ml-6 mt-2 space-y-1 text-equus-muted text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8 marker:text-equus-olive">
              <li>
                Navigating unexpected challenges without human intervention
              </li>
              <li>Adjusting strategies in real-time based on feedback</li>
              <li>Learning from both success and failure</li>
            </ul>
          </section>

          {/* Closing */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
              Empowering the Future with Equus Systems
            </h3>
            <p className="text-equus-muted text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-8">
              At Equus Systems, we design and build intelligent agentic
              solutions that go beyond simple automation. Our mission is to help
              businesses unlock the full potential of AI—systems that think,
              learn, and act to deliver lasting impact.
            </p>
            <div>
              <Link to="/#contact" className="text-equus-primary underline">
                Get in touch with us →
              </Link>
            </div>
          </section>
        </article>
      </Fieldset>
    </div>
  );
};

export default About;

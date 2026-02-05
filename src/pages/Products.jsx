import SEOHelmet from '../components/shared/SEOHelmet';
import {
  Section,
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { H2 } from '@/components/ui/heading';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/ui/AnimatedSection';

const Products = () => {
  return (
    <div className="container-equus">
      <SEOHelmet
        title="Products - Equus Systems"
        description="Explore our innovative products and solutions designed to meet your business needs."
        keywords="products, solutions, business, technology, equus systems"
        url="https://equussystems.co/products"
      />

      <div className="equus-section">
        <Section title="OUR PRODUCTS" size="lg">
          <article className="w-full px-4 sm:px-6 space-y-6 sm:space-y-8">
            {/* Intro with fade-in animation */}
            <AnimatedSection animation="fade-in" duration="slow" as="header">
              <H2
                variant="olive"
                align="center"
                className="mb-4 heading-underline-olive"
              >
                OUR PRODUCTS
              </H2>
              <p className="text-equus-muted text-sm sm:text-base leading-relaxed max-w-prose text-center mx-auto">
                Discover our cutting-edge AI solutions designed to transform your
                business operations and drive innovation.
              </p>
            </AnimatedSection>

            <div className="grid-equus-services">
              <AnimatedSection animation="slide-up" delay={100}>
                <Card variant="service" size="equus" className="flex flex-col">
                  <CardTitle>AI-Powered TFL Assistant</CardTitle>
                  <CardDescription className="flex-grow text-sm sm:text-base leading-relaxed">
                    Intelligent London transport assistant with real-time tube
                    status and multi-agent AI system featuring 14 specialized
                    line agents.
                  </CardDescription>
                  <CardContent className="mt-auto pt-4">
                    <Link
                      to="/articles/ai-powered-tfl-assistant"
                      className="text-equus-primary underline text-sm sm:text-base"
                    >
                      Read more &rarr;
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={300}>
                <Card variant="service" size="equus" className="flex flex-col">
                  <CardTitle>AI Tutor Platform</CardTitle>
                  <CardDescription className="flex-grow text-sm sm:text-base leading-relaxed">
                    Personalized learning experience with intelligent tutoring and
                    adaptive educational content powered by advanced AI models.
                  </CardDescription>
                  <CardContent className="mt-auto pt-4">
                    <Link
                      to="/articles/ai-tutor-platform"
                      className="text-equus-primary underline text-sm sm:text-base"
                    >
                      Read more &rarr;
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={500}>
                <Card variant="service" size="equus">
                  <CardTitle>Enterprise Solutions</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Custom business solutions with advanced analytics, user
                    management, and secure authentication systems for enterprise
                    needs.
                  </CardDescription>
                </Card>
              </AnimatedSection>
            </div>
          </article>
        </Section>
      </div>

      <div className="equus-section">
        <Section title="WHY CHOOSE EQUUS" size="lg">
          <article className="w-full px-4 sm:px-6">
            <div className="grid-equus-services">
              <AnimatedSection animation="scale-in" delay={100}>
                <Card variant="service" size="equus">
                  <CardTitle>Fast & Reliable</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    High-performance solutions built with modern technologies
                    for optimal speed and reliability.
                  </CardDescription>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="scale-in" delay={300}>
                <Card variant="service" size="equus">
                  <CardTitle>Secure by Design</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Enterprise-grade security with JWT authentication, role-based
                    access, and comprehensive protection.
                  </CardDescription>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="scale-in" delay={500}>
                <Card variant="service" size="equus">
                  <CardTitle>User-Focused</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Intuitive interfaces designed with user experience as the
                    top priority for maximum engagement.
                  </CardDescription>
                </Card>
              </AnimatedSection>
            </div>
          </article>
        </Section>
      </div>
    </div>
  );
};

export default Products;


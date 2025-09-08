import SEOHelmet from '../components/shared/SEOHelmet';
import {
  Fieldset,
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import DecorativeAccent from '@/components/ui/DecorativeAccent';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/ui/AnimatedSection';

const Products = () => {
  return (
    <>
      <SEOHelmet
        title="Products - Equus Systems"
        description="Explore our innovative products and solutions designed to meet your business needs."
        keywords="products, solutions, business, technology, equus systems"
        url="https://equussystems.co/products"
      />
      <div className="container-equus">
        {/* Hero section with fade-in animation */}
        <AnimatedSection 
          animation="fade-in"
          duration="slow"
          as="section"
          className="equus-section equus-section-centered pt-12 pb-8"
        >
          <AnimatedSection 
            animation="slide-down"
            delay={200}
            as="h2"
            className="text-hero text-equus-primary font-semibold mb-6"
          >
            OUR PRODUCTS
          </AnimatedSection>
          <AnimatedSection 
            animation="fade-in"
            delay={500}
            as="p"
            className="text-body-large text-equus-muted container-content"
          >
            Discover our cutting-edge AI solutions designed to transform your
            business operations and drive innovation.
          </AnimatedSection>
        </AnimatedSection>

        {/* Products section with staggered animations */}
        <AnimatedSection 
          animation="fade-in"
          as="section"
          className="equus-section equus-section-centered"
        >
          <Fieldset legend="AI SOLUTIONS" size="lg">
            <div className="grid-equus-services">
              <AnimatedSection 
                animation="slide-up"
                delay={100}
              >
                <Card variant="service" size="equus" className="flex flex-col">
                  <CardTitle>AI-Powered TFL Assistant</CardTitle>
                  <CardDescription className="flex-grow">
                    Intelligent London transport assistant with real-time tube
                    status and multi-agent AI system featuring 14 specialized line
                    agents.
                  </CardDescription>
                  <CardContent className="mt-auto pt-4">
                    <Link
                      to="/articles/ai-powered-tfl-assistant"
                      className="text-equus-primary underline text-sm"
                    >
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection 
                animation="slide-up"
                delay={300}
              >
                <Card variant="service" size="equus" className="flex flex-col">
                  <CardTitle>AI Tutor Platform</CardTitle>
                  <CardDescription className="flex-grow">
                    Personalized learning experience with intelligent tutoring and
                    adaptive educational content powered by advanced AI models.
                  </CardDescription>
                  <CardContent className="mt-auto pt-4">
                    <Link
                      to="/articles/ai-tutor-platform"
                      className="text-equus-primary underline text-sm"
                    >
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection 
                animation="slide-up"
                delay={500}
              >
                <Card variant="service" size="equus">
                  <CardTitle>Enterprise Solutions</CardTitle>
                  <CardDescription>
                    Custom business solutions with advanced analytics, user
                    management, and secure authentication systems for enterprise
                    needs.
                  </CardDescription>
                </Card>
              </AnimatedSection>
            </div>
          </Fieldset>
        </AnimatedSection>

        {/* Features section with staggered animations */}
        <AnimatedSection 
          animation="fade-in"
          as="section"
          className="equus-section equus-section-centered"
        >
          <Fieldset legend="WHY CHOOSE EQUUS" size="lg">
            <div className="grid-equus-services">
              <AnimatedSection 
                animation="scale-in"
                delay={100}
              >
                <Card variant="service" size="equus">
                  <CardTitle>Fast & Reliable</CardTitle>
                  <CardDescription>
                    High-performance solutions built with modern technologies for
                    optimal speed and reliability.
                  </CardDescription>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection 
                animation="scale-in"
                delay={300}
              >
                <Card variant="service" size="equus">
                  <CardTitle>Secure by Design</CardTitle>
                  <CardDescription>
                    Enterprise-grade security with JWT authentication, role-based
                    access, and comprehensive protection.
                  </CardDescription>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection 
                animation="scale-in"
                delay={500}
              >
                <Card variant="service" size="equus">
                  <CardTitle>User-Focused</CardTitle>
                  <CardDescription>
                    Intuitive interfaces designed with user experience as the top
                    priority for maximum engagement.
                  </CardDescription>
                </Card>
              </AnimatedSection>
            </div>
          </Fieldset>
        </AnimatedSection>
      </div>
    </>
  );
};

export default Products;

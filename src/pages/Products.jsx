import SEOHelmet from '../components/shared/SEOHelmet';
import { Fieldset, Card, CardTitle, CardDescription } from '@/components/ui';

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
        {/* Hero section */}
        <section className="equus-section equus-section-centered pt-12 pb-8">
          <h2 className="text-hero text-equus-primary font-semibold mb-6">
            OUR PRODUCTS
          </h2>
          <p className="text-body-large text-equus-muted container-content">
            Discover our cutting-edge AI solutions designed to transform your
            business operations and drive innovation.
          </p>
        </section>

        {/* Products section */}
        <section className="equus-section equus-section-centered">
          <Fieldset legend="AI SOLUTIONS" size="lg">
            <div className="grid-equus-services">
              <Card variant="service" size="equus">
                <CardTitle>AI-Powered TFL Assistant</CardTitle>
                <CardDescription>
                  Intelligent London transport assistant with real-time tube
                  status and multi-agent AI system featuring 14 specialized line
                  agents.
                </CardDescription>
              </Card>
              <Card variant="service" size="equus">
                <CardTitle>AI Tutor Platform</CardTitle>
                <CardDescription>
                  Personalized learning experience with intelligent tutoring and
                  adaptive educational content powered by advanced AI models.
                </CardDescription>
              </Card>
              <Card variant="service" size="equus">
                <CardTitle>Enterprise Solutions</CardTitle>
                <CardDescription>
                  Custom business solutions with advanced analytics, user
                  management, and secure authentication systems for enterprise
                  needs.
                </CardDescription>
              </Card>
            </div>
          </Fieldset>
        </section>

        {/* Features section */}
        <section className="equus-section equus-section-centered">
          <Fieldset legend="WHY CHOOSE EQUUS" size="lg">
            <div className="grid-equus-services">
              <Card variant="service" size="equus">
                <CardTitle>Fast & Reliable</CardTitle>
                <CardDescription>
                  High-performance solutions built with modern technologies for
                  optimal speed and reliability.
                </CardDescription>
              </Card>
              <Card variant="service" size="equus">
                <CardTitle>Secure by Design</CardTitle>
                <CardDescription>
                  Enterprise-grade security with JWT authentication, role-based
                  access, and comprehensive protection.
                </CardDescription>
              </Card>
              <Card variant="service" size="equus">
                <CardTitle>User-Focused</CardTitle>
                <CardDescription>
                  Intuitive interfaces designed with user experience as the top
                  priority for maximum engagement.
                </CardDescription>
              </Card>
            </div>
          </Fieldset>
        </section>
      </div>
    </>
  );
};

export default Products;

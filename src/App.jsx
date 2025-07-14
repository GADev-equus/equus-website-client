import './App.css'
import ContactForm from './components/ContactForm'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">EQUUS SYSTEMS</h1>
        <p className="tagline">ADVANCED AI SOLUTIONS & CONSULTING</p>
      </header>

      <main className="main">
        <section className="hero">
          <h2 className="hero-title">EMPOWERING YOUR BUSINESS WITH AI</h2>
          <p className="hero-subtitle">
            Like the steadfast horse from which our name derives, we provide reliable and powerful AI solutions to propel your business forward.
          </p>
        </section>

        <section className="services">
          <h3 className="section-title">OUR SERVICES</h3>
          <div className="service-grid">
            <div className="service-card">
              <h4>AI Consulting</h4>
              <p>Strategic guidance to integrate AI into your business processes</p>
            </div>
            <div className="service-card">
              <h4>Custom AI Solutions</h4>
              <p>Tailored artificial intelligence systems designed for your specific needs</p>
            </div>
            <div className="service-card">
              <h4>Implementation Support</h4>
              <p>End-to-end assistance in deploying AI technologies</p>
            </div>
          </div>
        </section>

        <section className="about">
          <h3 className="section-title">ABOUT EQUUS</h3>
          <p className="about-text">
            <em>Equus</em> means "horse" in Latin, symbolizing strength, reliability, and forward momentum. 
            At Equus Systems, we embody these qualities in our approach to AI consulting and solutions development.
          </p>
        </section>

        <section className="contact">
          <h3 className="section-title">CONTACT US</h3>
          <ContactForm />
        </section>
      </main>

      <footer className="footer">
        <div className="holding-notice">
          <p><strong>This is a temporary holding page</strong></p>
          <p>Our full website is currently under development</p>
        </div>
      </footer>
    </div>
  )
}

export default App

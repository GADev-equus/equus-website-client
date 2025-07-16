/**
 * MainLayout - Main application layout with header and footer
 * Provides consistent layout structure for public and authenticated pages
 */

import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
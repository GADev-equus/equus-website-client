/**
 * Footer - Main site footer component
 * Uses header-fixed pattern for consistency with Header component
 * Uses Equus design system variables for consistent styling
 * Height calculation handled by Header component
 */

const Footer = () => {
  return (
    <footer className="footer-fixed">
      <div className="footer-notice-card">
        <p className="footer-title font-bold">
          This is a temporary holding page
        </p>
        <p className="footer-subtitle opacity-80">
          Our full website is currently under development
        </p>
      </div>
    </footer>
  );
};

export default Footer;
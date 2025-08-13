/**
 * DecorativeAccent Component
 * A reusable decorative accent bar with gradient styling
 * Uses Equus design system colors for brand consistency
 */

import './DecorativeAccent.css';

const DecorativeAccent = ({
  className = '',
  position = 'bottom',
  width = '6rem',
  height = '0.25rem',
  gradient = 'primary-olive',
}) => {
  const gradientOptions = {
    'primary-olive':
      'linear-gradient(90deg, var(--equus-primary), var(--equus-olive))',
    'primary-secondary':
      'linear-gradient(90deg, var(--equus-primary), var(--equus-secondary))',
    'primary-accent':
      'linear-gradient(90deg, var(--equus-primary), var(--equus-accent))',
    'olive-accent':
      'linear-gradient(90deg, var(--equus-olive), var(--equus-accent))',
  };

  const positionClasses = {
    bottom: 'decorative-accent-bottom',
    top: 'decorative-accent-top',
    center: 'decorative-accent-center',
  };

  const style = {
    width,
    height,
    background: gradientOptions[gradient] || gradientOptions['primary-olive'],
  };

  return (
    <div
      className={`decorative-accent ${positionClasses[position]} ${className}`}
      style={style}
    />
  );
};

export default DecorativeAccent;

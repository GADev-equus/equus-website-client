/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Equus Brand Colors - Using oklch format for accessibility and consistency
        equus: {
          primary: 'oklch(0.6487 0.2345 256.0579)', // #3498db blue
          secondary: 'oklch(0.3532 0 0)', // #2c3e50 dark blue
          accent: 'oklch(0.704 0.191 22.216)', // #e74c3c red
          olive: 'oklch(0.4532 0.054 145.0579)', // #3b4d3f olive green

          // Neutral colors
          background: 'oklch(0.145 0 0)', // Dark background
          foreground: 'oklch(0.985 0 0)', // White text
          card: 'oklch(0.205 0 0)', // Card background
          'card-foreground': 'oklch(0.985 0 0)', // Card text
          popover: 'oklch(0.205 0 0)', // Popover background
          'popover-foreground': 'oklch(0.985 0 0)', // Popover text

          muted: 'oklch(0.269 0 0)', // Muted background
          'muted-foreground': 'oklch(0.708 0 0)', // Muted text

          // Border and input colors
          border: 'oklch(1 0 0 / 0.4)', // Semi-transparent white border
          input: 'oklch(1 0 0 / 0.15)', // Semi-transparent white input
          ring: 'oklch(0.556 0 0)', // Ring color

          // Chart colors for data visualization
          chart: {
            1: 'oklch(0.488 0.243 264.376)', // Blue
            2: 'oklch(0.696 0.17 162.48)', // Teal
            3: 'oklch(0.769 0.188 70.08)', // Yellow
            4: 'oklch(0.627 0.265 303.9)', // Purple
            5: 'oklch(0.645 0.246 16.439)', // Red
          },

          // Sidebar colors
          sidebar: 'oklch(0.205 0 0)', // Sidebar background
          'sidebar-foreground': 'oklch(0.985 0 0)', // Sidebar text
          'sidebar-primary': 'oklch(0.488 0.243 264.376)', // Sidebar primary
          'sidebar-primary-foreground': 'oklch(0.985 0 0)', // Sidebar primary text
          'sidebar-accent': 'oklch(0.269 0 0)', // Sidebar accent
          'sidebar-accent-foreground': 'oklch(0.985 0 0)', // Sidebar accent text
          'sidebar-border': 'oklch(1 0 0 / 0.1)', // Sidebar border
          'sidebar-ring': 'oklch(0.556 0 0)', // Sidebar ring
        },
      },
      fontFamily: {
        branding: ['AquireLight', 'Nunito', 'sans-serif'],
        display: ['Nunito', 'sans-serif'],
        base: ['Nunito', 'sans-serif'],
        alt: ['Sen', 'sans-serif'],
      },
      borderRadius: {
        default: '0.625rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.75rem',
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        xxl: '4rem',
      },
      maxWidth: {
        content: '600px',
        container: '1200px',
        notice: '400px',
      },
      lineHeight: {
        relaxed: '1.7',
      },
      breakpoints: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

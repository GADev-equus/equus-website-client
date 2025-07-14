# Equus Website Client

React frontend application for the Equus website built with Vite.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will run on **port 5173** by default.

## Project Structure

```
client/
├── src/
│   ├── App.jsx         # Main app component
│   ├── App.css         # App-specific styles
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles and CSS reset
├── public/             # Static assets
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Features

- ✅ React 18 with JavaScript (no TypeScript)
- ✅ Vite for fast development and building
- ✅ Complete CSS reset implemented
- ✅ Clean starter app with "Hello World"
- ✅ Modern development tooling
- ✅ Hot module replacement (HMR)

## Development

### Available Scripts
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

### CSS Reset
A comprehensive CSS reset is implemented in `src/index.css` that includes:
- Complete margin/padding reset
- Box-sizing normalization
- Form element styling reset
- Modern CSS best practices

### Dependencies
- **react** - UI library
- **react-dom** - React DOM renderer
- **vite** - Build tool and development server (v5.4.10 for Node.js 18.x compatibility)

## Backend Integration

The client is designed to work with the Node.js/Express backend:
- **Backend URL**: `http://localhost:8000`
- **Frontend URL**: `http://localhost:5173`
- CORS is configured in the backend to allow communication

## Next Steps

- Add React Router for navigation
- Set up API client for backend communication
- Add component library or UI framework
- Implement authentication
- Add state management (Context API, Redux, etc.)
- Set up environment variables
- Add testing framework
- Configure deployment
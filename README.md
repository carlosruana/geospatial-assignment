# Geospatial Flow Editor

A modern web application for visualizing and processing geospatial data using a visual flow-based interface. Built with React, TypeScript, React Flow, and deck.gl.

## 🌟 Features

- **Visual Flow Editor**: Create and edit geospatial data processing workflows using an intuitive node-based interface
- **GeoJSON Support**: Import and visualize GeoJSON data from URLs
- **Interactive Map Visualization**: Powered by deck.gl for high-performance rendering of geographic data
- **Layer Management**: Stack and organize multiple geospatial layers with automatic z-indexing
- **Real-time Processing**: Process and transform geospatial data in real-time
- **Modern UI**: Built with Material-UI for a clean, responsive interface

## 🚀 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Material-UI v7
- **Flow Editor**: XY Flow (React Flow)
- **Map Visualization**: deck.gl
- **Geospatial Processing**: Turf.js
- **Testing**:
     - Unit Tests: Vitest + React Testing Library
     - E2E Tests: Playwright
- **Code Quality**:
     - ESLint
     - Prettier
     - Husky for pre-commit hooks

## 📁 Project Structure

```
├── e2e/                 # End-to-end tests using Playwright
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── features/       # Feature-based modules
│   │   ├── flow/      # Flow editor feature
│   │   └── geospatial/# Geospatial visualization feature
│   ├── shared/        # Shared components and utilities
│   ├── styles/        # Global styles and themes
│   ├── test/          # Test setup and utilities
│   ├── utils/         # Utility functions
│   └── views/         # Page components
└── package.json
```

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd geospatial-assignment
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## 🧪 Testing

- Run unit tests:

```bash
npm test
```

- Run tests in watch mode:

```bash
npm run test:watch
```

- Run end-to-end tests:

```bash
npm run test:e2e
```

- View test coverage:

```bash
npm run test:coverage
```

## 🔧 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests
- `npm run prepare`: Install Husky git hooks

## 🚧 Future Improvements

1. **Enhanced Geospatial Operations**:

     - Support for more complex geometric operations (union, difference, etc.)
     - Custom coordinate system transformations
     - Support for more geospatial file formats (Shapefile, KML, etc.)

2. **User Experience**:

     - Undo/redo functionality in the flow editor
     - Layer styling options
     - Save and load workflow configurations
     - Export processed data in various formats

3. **Performance Optimizations**:

     - Implement data streaming for large GeoJSON files
     - Implement layer-level caching

4. **Developer Experience**:
     - Add Storybook for component documentation
     - Implement CI/CD pipeline

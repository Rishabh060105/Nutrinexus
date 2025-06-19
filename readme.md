# Food Explorer Application

## Overview

Food Explorer is a modern web application that allows users to search, browse, and explore food products using the OpenFoodFacts API. The application features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database integration. It provides functionality for product search, detailed product views, shopping cart management, and filtering by categories and nutrition grades.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Context API with useReducer for global state
- **Routing**: Wouter for client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Session Management**: In-memory storage for development (extensible to database)
- **API Integration**: OpenFoodFacts API for food product data

### Database Design
- **Primary Database**: PostgreSQL (configured via Drizzle)
- **Schema Management**: Drizzle Kit for migrations
- **Current Schema**: Users table with authentication fields
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations

## Key Components

### State Management
- **AppContext**: Manages search state, products, filters, and loading states
- **CartContext**: Handles shopping cart operations with localStorage persistence
- **Error Boundary**: Provides graceful error handling and recovery

### Core Features
- **Product Search**: Real-time search with debouncing, supports both text and barcode queries
- **Category Filtering**: Dynamic category selection with formatted display names
- **Nutrition Grade Filtering**: Visual grade indicators (A-E) with color coding
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Product Details**: Modal-based detailed product information display

### UI Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Loading States**: Skeleton components and spinners for better UX
- **Error Handling**: User-friendly error messages with retry functionality
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

### Search and Filtering Flow
1. User inputs search term or selects filters
2. AppContext manages state updates with debouncing
3. API client constructs OpenFoodFacts API queries
4. Results are cached using TanStack Query
5. Products are displayed in responsive grid layout

### Shopping Cart Flow
1. User adds products to cart from product cards or detail view
2. CartContext manages cart state and localStorage synchronization
3. Cart sidebar displays items with quantity controls
4. Cart state persists across browser sessions

### Product Detail Flow
1. User clicks product card or navigates to product URL
2. Product barcode is extracted from route parameters
3. Detailed product data is fetched from OpenFoodFacts API
4. Modal displays comprehensive product information

## External Dependencies

### Third-Party APIs
- **OpenFoodFacts API**: Primary data source for food product information
- **Base URL**: Configured via environment variable (VITE_OFF_BASE_URL)
- **User Agent**: Custom identifier for API requests

### Key Libraries
- **UI Components**: Extensive use of Radix UI primitives for accessibility
- **Form Handling**: React Hook Form with Zod validation schemas
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for image galleries

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 instance
- **Hot Reload**: Vite development server with HMR
- **Port Configuration**: Port 5000 for development server

### Production Build
- **Frontend**: Static assets built to dist/public directory
- **Backend**: ESBuild bundles server code to dist/index.js
- **Database**: Drizzle migrations applied via db:push command
- **Deployment**: Autoscale deployment target on Replit

### Environment Configuration
- **Database**: DATABASE_URL for PostgreSQL connection
- **API**: VITE_OFF_BASE_URL for OpenFoodFacts API endpoint
- **Build**: Separate development and production configurations

### Monitoring and Logging
- **Request Logging**: Express middleware logs API requests with timing
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Development**: Runtime error overlay for debugging






# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Dear Carmate** frontend - a Next.js 14.1.4 TypeScript application using the Pages Router for a car dealership management system. The app provides comprehensive tools for managing vehicles, customers, contracts, and business operations.

## Key Technologies

- **Framework**: Next.js 14.1.4 with Pages Router (not App Router)
- **Language**: TypeScript with strict configuration
- **State Management**: 
  - Zustand for global client state
  - TanStack React Query v5 for server state and caching
  - React Hook Form for form state
- **HTTP Client**: Axios with JWT token interceptors
- **Styling**: SCSS modules with SpoqaHanSansNeo Korean font
- **Authentication**: Cookie-based JWT with automatic refresh
- **UI Libraries**: React DND (drag-and-drop), Chart.js, date-fns

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Start production server
npm start
```

## Environment Setup

Required environment variable:
- `NEXT_PUBLIC_BASE_URL`: Backend API base URL

## Architecture & Code Organization

### Naming Conventions

The codebase follows a sophisticated domain-driven design with consistent prefixes:

- **`data-access-*`**: React Query hooks for API calls and server state management
- **`feature-*`**: Main business logic components and complex UI features
- **`ui-*`**: Reusable presentation components and simple UI elements
- **`util-*`**: Domain utilities, contexts, constants, and helper functions

### Directory Structure

```
src/
├── components/           # Reusable UI components
├── pages/               # Next.js pages (Pages Router)
├── contexts/            # React contexts and providers
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── stores/              # Zustand stores
├── styles/              # Global SCSS and modules
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

### Core Business Domains

1. **Car Management** (`feature-car-*`): Vehicle inventory with advanced filtering and search
2. **Customer Management** (`feature-customer-*`): CRM functionality for customer data
3. **Contract Management** (`feature-contract-*`): Drag-and-drop workflow board for deal progression
4. **Document Management** (`feature-document-*`): File upload/download with preview
5. **Company & User Management**: Multi-tenant system with role-based access
6. **Dashboard** (`feature-dashboard-*`): Analytics and metrics with Chart.js

## Authentication System

- JWT tokens stored in HTTP cookies (not localStorage)
- Automatic token refresh handled by Axios interceptors
- 401 responses trigger automatic logout and redirect
- Route protection implemented via Next.js middleware
- Direct browser-to-backend API calls (no Next.js API routes used)

## Data Flow Patterns

### API Integration
- Use React Query hooks from `data-access-*` files for all server interactions
- Axios interceptors handle authentication tokens automatically
- Consistent error handling with toast notifications
- Optimistic updates where appropriate

### State Management
- Zustand stores for global client state (user session, UI preferences)
- React Query for all server state (automatic caching, invalidation)
- React Hook Form for complex form state with validation
- Local useState for simple component state

### Component Architecture
- Container/Presenter pattern: `feature-*` components handle logic, `ui-*` components handle presentation
- Props drilling avoided using contexts for shared state
- Consistent prop interfaces with TypeScript

## Styling Guidelines

- SCSS modules for component-specific styles
- Global utilities in `styles/globals.scss`
- Korean typography using SpoqaHanSansNeo font family
- Responsive design with mobile-first approach
- CSS custom properties for theming

## Development Guidelines

### File Organization
- Group related files by domain/feature
- Use index files for clean imports
- Keep components focused and single-responsibility
- Separate API logic into `data-access-*` files

### TypeScript Usage
- Strict mode enabled - no implicit any
- Define interfaces for all API responses
- Use proper typing for React Query hooks
- Leverage path aliases for clean imports

### Error Handling
- Global error boundary for unhandled errors
- Consistent toast notifications for user feedback
- React Query error states for API failures
- Form validation using React Hook Form

## Common Development Tasks

### Adding a New Feature
1. Create `feature-[domain]-[feature-name]` component
2. Add corresponding `data-access-[domain]` hooks if API needed
3. Create `ui-*` components for reusable pieces
4. Add proper TypeScript interfaces
5. Include error handling and loading states

### API Integration
1. Define TypeScript interfaces for request/response
2. Create React Query hooks in `data-access-*` files
3. Handle loading, error, and success states
4. Implement optimistic updates where beneficial

### Styling New Components
1. Create SCSS module file alongside component
2. Use semantic class names matching component structure
3. Leverage global utilities when appropriate
4. Ensure mobile responsiveness

## Path Aliases

```typescript
// Configured in tsconfig.json
"@/*": "./src/*"
"@/components/*": "./src/components/*"
"@/pages/*": "./src/pages/*"
// ... etc
```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Natours project - a complete web application for tour booking and management. It's built with Node.js, Express, MongoDB, and features both a REST API and server-side rendered views using Pug templates.

## Common Development Commands

### Starting the Application
```bash
# Development server with hot reload
npm run dev

# Production server
npm start

# Production mode with nodemon
npm run start:prod

# Debug with ndb
npm run debug
```

### Frontend Development
```bash
# Watch and bundle JavaScript files
npm run watch:js

# Build JavaScript bundle for production
npm run build:js
```

### Database Operations
```bash
# Import development data
node dev-data/data/import-dev-data.js --import

# Delete all data
node dev-data/data/import-dev-data.js --delete

# Import tours only
node dev-data/data/import-dev-data.js --import --import-type tours
```

## Architecture Overview

### Core Application Structure

The application follows a clean MVC architecture with separation of concerns:

- **Entry Point**: `server.js` - Handles database connection and server setup with proper error handling
- **Express App**: `app.js` - Main Express application configuration, middleware setup, and route mounting
- **Routes**: RESTful API endpoints in `/routes/` directory following versioning (`/api/v1/`)
- **Controllers**: Business logic in `/controllers/` directory
- **Models**: Mongoose schemas and models in `/models/` directory
- **Views**: Pug templates in `/views/` directory for server-side rendering
- **Utilities**: Helper functions and middleware in `/utils/` directory

### Key Components

#### 1. Factory Pattern Handler
- `controllers/handlerFactory.js` - Implements generic CRUD operations using factory pattern
- Provides reusable functions: `getAll`, `getOne`, `createOne`, `updateOne`, `deleteOne`
- Used by controllers to avoid code duplication

#### 2. Authentication & Authorization
- JWT-based authentication with cookies
- Role-based access control (user, guide, lead-guide, admin)
- Password reset functionality via email
- Protected routes middleware

#### 3. API Features
- Advanced filtering, sorting, pagination, and field limiting
- Implemented in `utils/apiFeatures.js`
- Supports nested routes for reviews

#### 4. Security Middleware
- Helmet for security headers
- Rate limiting (100 requests per hour per IP)
- NoSQL query injection sanitization
- XSS protection
- Parameter pollution prevention
- CORS enabled

#### 5. Payment Integration
- Stripe webhook handling
- Booking management system
- Secure checkout process

### Data Models

#### User Model
- Authentication fields (email, password, role)
- Profile management with photo uploads
- Password reset tokens
- Active status for soft deletion

#### Tour Model
- Tour information with detailed descriptions
- Pricing and duration
- Location data with GeoJSON
- Image management with multiple images
- Start dates and group sizes

#### Review Model
- Rating system (1-5 stars)
- User-tour relationship
- Review content with timestamps

#### Booking Model
- Tour and user references
- Payment information
- Booking status management

### Environment Configuration

Required environment variables in `config.env`:
- `DATABASE`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Token expiration time
- `JWT_COOKIE_EXPIRES_IN`: Cookie expiration time
- `STRIPE_SECRET_KEY`: Stripe API key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

### Important File Patterns

- Routes follow RESTful conventions with `/api/v1/` prefix
- Controllers use async/await with error handling wrapper
- Models include validation, virtuals, and middleware
- Views use Pug templating with inheritance
- Static assets served from `/public/` directory
- JavaScript files bundled using Parcel

### Error Handling

- Custom error classes in `utils/appError.js`
- Global error handler in `controllers/errorController.js`
- Async error wrapper in `utils/catchAsync.js`
- Operational vs programming errors distinction
- Proper error responses for development and production

### Database

- MongoDB with Mongoose ODM
- Development database: `natours-test`
- Data seeding scripts in `dev-data/data/`
- JSON data files for tours, users, and reviews

### Testing and Development

- No specific test commands configured
- Development uses nodemon for auto-restart
- Debugging available with ndb
- ESLint configured with Airbnb style guide
- Prettier for code formatting

### Frontend

- Server-side rendering with Pug templates
- Client-side JavaScript bundled with Parcel
- Public assets including images, CSS, and bundled JS
- Responsive design with custom CSS
- Map integration using Mapbox
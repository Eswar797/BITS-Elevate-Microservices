# EduPulse - Layered Architecture Version

This is the layered architecture version of the EduPulse Learning Management System. It maintains all the features of the original microservices version but is structured in a traditional layered architecture pattern.

## Architecture Overview

The application follows a layered architecture pattern with the following layers:

1. **Presentation Layer**
   - Handles HTTP requests and responses
   - Routes and controllers
   - Input validation
   - Response formatting

2. **Application Layer**
   - Business logic and use cases
   - Service classes
   - Transaction management
   - Business rules enforcement

3. **Domain Layer**
   - Business entities and models
   - Domain logic
   - Value objects
   - Domain events

4. **Infrastructure Layer**
   - Database access
   - External service integration
   - Security
   - Logging and monitoring

## Features

- User Management (registration, authentication, profile)
- Course Management (creation, enrollment, content)
- Payment Processing (Stripe integration)
- Email Notifications (Mailgun integration)
- Role-Based Access Control

## Project Structure

```
src/
├── presentation/         # Presentation layer
│   ├── routes/          # API routes
│   └── controllers/     # Request handlers
├── application/         # Application layer
│   └── services/        # Business logic services
├── domain/             # Domain layer
│   └── models/         # Domain models
└── infrastructure/     # Infrastructure layer
    ├── database/       # Database configuration
    ├── external-services/ # External service integrations
    ├── security/       # Security utilities
    └── logging/        # Logging configuration
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   STRIPE_SECRET_KEY=your_stripe_key
   MAILGUN_API_KEY=your_mailgun_key
   ```

4. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

### User Management
- POST /api/users/register - Register a new user
- POST /api/users/login - User login
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- POST /api/users/enroll/:courseId - Enroll in a course

### Course Management
- GET /api/courses - List all courses
- POST /api/courses - Create a new course
- GET /api/courses/:id - Get course details
- PUT /api/courses/:id - Update course
- DELETE /api/courses/:id - Delete course

### Payment Processing
- POST /api/payments/create-intent - Create payment intent
- POST /api/payments/confirm - Confirm payment

## Development

- Use `npm run dev` for development with hot reload
- Use `npm test` to run tests
- Follow the layered architecture pattern when adding new features

## License

MIT License 
# BITS-Elevate Microservices

A comprehensive microservices-based learning platform with user management, course management, payment processing, and visualization services.

## Architecture Overview

This application is built using a microservices architecture with the following components:

- **Frontend**: React-based UI with TypeScript and Tailwind CSS
- **User Management Service**: Handles user authentication and profile management
- **Course Management Service**: Manages course creation, enrollment, and content
- **Payment Service**: Processes payments and manages transactions
- **Visualization Service**: Provides analytics and data visualization

## Prerequisites

- Node.js (v16+)
- MongoDB
- Docker and Docker Compose (optional, for containerized deployment)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Eswar797/BITS-Elevate-Microservices.git
cd BITS-Elevate-Microservices
```

### Environment Setup

1. Copy the example environment files in each service directory:

```bash
# From the root directory
cp Microservices/user-managment/.env.example Microservices/user-managment/.env
cp Microservices/course-management/.env.example Microservices/course-management/.env
cp Microservices/payment-management/.env.example Microservices/payment-management/.env
cp Microservices/visualization-service/.env.example Microservices/visualization-service/.env
cp Microservices/frontend/.env.example Microservices/frontend/.env
```

2. Update the environment files with your configuration (MongoDB connection strings, API keys, etc.)

### Running the Application

#### Option 1: Manual Setup

1. Start the user management service:
```bash
cd Microservices/user-managment
npm install
npm start
```

2. Start the course management service:
```bash
cd Microservices/course-management
npm install
npm start
```

3. Start the payment service:
```bash
cd Microservices/payment-management
npm install
npm start
```

4. Start the visualization service:
```bash
cd Microservices/visualization-service
npm install
npm start
```

5. Start the frontend:
```bash
cd Microservices/frontend
npm install
npm run dev
```

#### Option 2: Using the Provided Scripts

For Windows:
```bash
# From the root directory
./start-services.bat
```

For Linux/Mac:
```bash
# From the root directory
chmod +x start-services.sh
./start-services.sh
```

#### Option 3: Using Docker Compose (Recommended for Production)

```bash
# From the root directory
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:5173
- User Management API: http://localhost:5000
- Course Management API: http://localhost:5001
- Payment Service API: http://localhost:5002
- Visualization Service: http://localhost:5003

## Features

### User Management
- User registration and authentication
- Profile management
- Role-based access (Student, Creator, Admin)

### Course Management
- Course creation and editing for instructors
- Enrollment and progress tracking for students
- Content management and organization

### Payment Processing
- Secure payment processing
- Transaction history
- Refund handling

### Visualization and Analytics
- Course performance metrics
- User engagement analytics
- Revenue reporting

## Development

### Project Structure

```
Microservices/
├── user-managment/          # User authentication and management
├── course-management/       # Course creation and enrollment
├── payment-management/      # Payment processing
├── visualization-service/   # Analytics and visualization
├── frontend/                # React frontend application
├── docker-compose.yml       # Docker-compose configuration
└── start-services.sh/bat    # Scripts to start all services
```

### API Documentation

Each service includes its own API documentation:

- User Management: http://localhost:5000/api-docs
- Course Management: http://localhost:5001/api-docs
- Payment Service: http://localhost:5002/api-docs

## Troubleshooting

### Common Issues

1. **Connection Refused Errors**:
   - Ensure all services are running
   - Check that the ports are not being used by other applications

2. **Database Connection Issues**:
   - Verify MongoDB is running
   - Check connection strings in environment files

3. **CORS Errors**:
   - Ensure CORS is properly configured in each service
   - Check frontend API endpoint configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- BITS Pilani for supporting this educational project
- All contributors who have dedicated their time and expertise 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { setupDatabase } = require('./infrastructure/database');
const { setupSecurity } = require('./infrastructure/security');
const { setupLogging } = require('./infrastructure/logging');
const { setupExternalServices } = require('./infrastructure/external-services');

// Import routes
const userRoutes = require('./presentation/routes/userRoutes');
const courseRoutes = require('./presentation/routes/courseRoutes');
const paymentRoutes = require('./presentation/routes/paymentRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // This is needed for the React app to work properly
}));
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Setup infrastructure
setupDatabase();
setupSecurity(app);
setupLogging(app);
setupExternalServices();

// Serve static files from the React app in the presentation layer
app.use(express.static(path.join(__dirname, 'presentation/build')));

// API Routes - all under /api prefix
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'presentation/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
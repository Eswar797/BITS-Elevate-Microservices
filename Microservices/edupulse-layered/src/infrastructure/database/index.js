const mongoose = require('mongoose');

const setupDatabase = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: process.env.MONGODB_POOL_SIZE || 10,
      serverSelectionTimeoutMS: process.env.MONGODB_CONNECTION_TIMEOUT || 30000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { setupDatabase }; 
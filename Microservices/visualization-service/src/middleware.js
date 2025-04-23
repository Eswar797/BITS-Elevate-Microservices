const axios = require('axios');

const visualizationServiceUrl = process.env.VISUALIZATION_SERVICE_URL || 'http://localhost:3005';

const traceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const traceId = `${req.method}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end function
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    // Send trace data to visualization service
    axios.post(`${visualizationServiceUrl}/api/traces`, {
      traceId,
      serviceId: process.env.SERVICE_NAME || 'unknown-service',
      component: req.path,
      timestamp: startTime,
      duration,
      method: req.method,
      statusCode: res.statusCode
    }).catch(error => {
      console.error('Error sending trace data:', error);
    });
    
    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = traceMiddleware; 
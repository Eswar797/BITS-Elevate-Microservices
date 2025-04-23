import axios from 'axios';

const visualizationServiceUrls = [
    process.env.VISUALIZATION_SERVICE_URL || 'http://localhost:3005',
    'http://visualization-service:3005'
];

const traceMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const traceId = `${req.method}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store original end function
    const originalEnd = res.end;
    
    // Override end function
    res.end = function(chunk, encoding) {
        const duration = Date.now() - startTime;
        
        // Send trace data to all visualization services
        const traceData = {
            traceId,
            serviceId: 'course-service',
            component: req.path,
            timestamp: startTime,
            duration,
            method: req.method,
            statusCode: res.statusCode
        };

        // Send to all visualization services
        visualizationServiceUrls.forEach(url => {
            axios.post(`${url}/api/traces`, traceData)
                .catch(error => {
                    console.error(`Error sending trace data to ${url}:`, error.message);
                });
        });
        
        // Call original end function
        originalEnd.call(this, chunk, encoding);
    };
    
    next();
};

export default traceMiddleware; 
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const winston = require('winston');
const cors = require('cors');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"]
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fontawesome', express.static(path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free')));

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Store active traces and service states
const activeTraces = new Map();
const serviceStates = new Map([
    ['user-service', { status: 'inactive', lastActive: 0 }],
    ['course-service', { status: 'inactive', lastActive: 0 }],
    ['payment-service', { status: 'inactive', lastActive: 0 }]
]);

// Store connected clients
const connectedClients = new Map();

// Function to update service status
function updateServiceStatus(serviceId, status) {
    const service = serviceStates.get(serviceId);
    if (service) {
        service.status = status;
        service.lastActive = Date.now();
        serviceStates.set(serviceId, service);
        logger.info(`Service ${serviceId} status updated to ${status}`);
    }
}

// Function to get current system state
function getSystemState() {
    return {
        services: Array.from(serviceStates.entries()).map(([id, state]) => ({
            id,
            name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            status: state.status
        })),
        activeTraces: Array.from(activeTraces.values()),
        connectedClients: Array.from(connectedClients.entries()).map(([id, data]) => ({
            id,
            type: data.type
        }))
    };
}

// WebSocket connection handling
io.on('connection', (socket) => {
    logger.info('New client connected');
    
    // Generate a unique client ID with user type
    const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const clientType = 'user'; // Set type to user for all clients
    
    // Store client information
    connectedClients.set(clientId, { type: clientType, socketId: socket.id });
    
    // Notify all clients about the new connection
    io.emit('client-connected', { clientId, type: clientType });
    
    // Send initial system state to the new client
    socket.emit('system-state', getSystemState());
    
    socket.on('disconnect', () => {
        logger.info('Client disconnected');
        connectedClients.delete(clientId);
        io.emit('client-disconnected', { clientId });
    });
});

// API endpoint to receive trace data
app.post('/api/traces', express.json(), (req, res) => {
    const trace = req.body;
    logger.info('Received trace:', JSON.stringify(trace, null, 2));
    
    // Ensure trace has required fields
    if (!trace.traceId) trace.traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    if (!trace.timestamp) trace.timestamp = Date.now();
    if (!trace.statusCode) trace.statusCode = 200;
    if (!trace.duration) trace.duration = Math.floor(Math.random() * 100) + 50; // Random duration for demo
    if (!trace.method) trace.method = ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)]; // Random method
    
    // Update service status
    updateServiceStatus(trace.serviceId, 'active');
    
    // Store trace
    activeTraces.set(trace.traceId, trace);
    
    // Keep only the last 100 traces
    if (activeTraces.size > 100) {
        const oldestKey = Array.from(activeTraces.keys())[0];
        activeTraces.delete(oldestKey);
    }
    
    // Broadcast updates
    io.emit('trace-update', trace);
    io.emit('system-state', getSystemState());
    
    // Set timeout to reset service status
    setTimeout(() => {
        updateServiceStatus(trace.serviceId, 'inactive');
        io.emit('system-state', getSystemState());
    }, 5000);
    
    res.status(200).json({ message: 'Trace received' });
});

// API endpoint to get current system state
app.get('/api/system-state', (req, res) => {
    res.json(getSystemState());
});

// Test endpoint to verify service is working
app.get('/api/test', (req, res) => {
    logger.info('Test endpoint hit');
    res.json({ 
        message: 'Visualization service is running',
        connectedClients: Array.from(connectedClients.keys()),
        activeTraces: Array.from(activeTraces.keys()),
        serviceStates: Object.fromEntries(serviceStates)
    });
});

// Manual trace test endpoint with enhanced parameters
app.post('/api/test-trace', express.json(), (req, res) => {
    const testTrace = {
        traceId: `test-${Date.now()}`,
        serviceId: req.body.serviceId || 'user-service',
        component: req.body.component || 'test-component',
        timestamp: Date.now(),
        duration: req.body.duration || Math.floor(Math.random() * 200) + 50,
        method: req.body.method || ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        statusCode: req.body.statusCode || [200, 201, 204, 400, 404, 500][Math.floor(Math.random() * 6)],
        endpoint: req.body.endpoint || '/api/test',
        userId: req.body.userId || `user_${Math.floor(Math.random() * 1000)}`,
        requestSize: req.body.requestSize || Math.floor(Math.random() * 5000),
        responseSize: req.body.responseSize || Math.floor(Math.random() * 10000)
    };

    logger.info('Sending test trace:', JSON.stringify(testTrace, null, 2));
    
    // Update service status
    updateServiceStatus(testTrace.serviceId, 'active');
    
    // Store trace
    activeTraces.set(testTrace.traceId, testTrace);
    
    // Broadcast updates
    io.emit('trace-update', testTrace);
    io.emit('system-state', getSystemState());
    
    // Set timeout to reset service status
    setTimeout(() => {
        updateServiceStatus(testTrace.serviceId, 'inactive');
        io.emit('system-state', getSystemState());
    }, 5000);
    
    res.status(200).json({ message: 'Test trace sent', trace: testTrace });
});

// Generate random traces endpoint for demo and testing
app.post('/api/generate-traces', express.json(), (req, res) => {
    const count = req.body.count || 5;
    const interval = req.body.interval || 2000; // ms between traces
    const services = ['user-service', 'course-service', 'payment-service'];
    const components = ['auth', 'profile', 'courses', 'enrollment', 'payment', 'checkout'];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const statusCodes = [200, 201, 204, 400, 404, 500, 503];
    
    let generated = 0;
    
    const generateTrace = () => {
        if (generated >= count) return;
        
        const serviceId = services[Math.floor(Math.random() * services.length)];
        const component = components[Math.floor(Math.random() * components.length)];
        const method = methods[Math.floor(Math.random() * methods.length)];
        const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
        const duration = Math.floor(Math.random() * 500) + 20;
        
        const trace = {
            traceId: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            serviceId,
            component,
            timestamp: Date.now(),
            duration,
            method,
            statusCode,
            endpoint: `/api/${component}`,
            userId: `user_${Math.floor(Math.random() * 1000)}`,
            requestSize: Math.floor(Math.random() * 5000),
            responseSize: Math.floor(Math.random() * 10000)
        };
        
        // Update service status
        updateServiceStatus(trace.serviceId, 'active');
        
        // Store trace
        activeTraces.set(trace.traceId, trace);
        
        // Broadcast updates
        io.emit('trace-update', trace);
        io.emit('system-state', getSystemState());
        
        // Set timeout to reset service status
        setTimeout(() => {
            updateServiceStatus(trace.serviceId, 'inactive');
            io.emit('system-state', getSystemState());
        }, 5000);
        
        generated++;
        
        // Schedule next trace
        if (generated < count) {
            setTimeout(generateTrace, interval);
        }
    };
    
    // Start generating traces
    generateTrace();
    
    res.status(200).json({ 
        message: `Generating ${count} traces with ${interval}ms interval`,
        count,
        interval
    });
});

// Serve the main visualization page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.VISUALIZATION_PORT || 3005;
server.listen(PORT, () => {
    logger.info(`Visualization service running on port ${PORT}`);
    logger.info(`Test endpoint available at http://localhost:${PORT}/api/test`);
}); 
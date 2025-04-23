# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code but not node_modules
COPY . .

# Run the app in development mode
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a startup script
RUN echo '#!/bin/sh' > /docker-entrypoint.d/99-log-port.sh && \
    echo 'echo "Nginx server is running on port 80"' >> /docker-entrypoint.d/99-log-port.sh && \
    chmod +x /docker-entrypoint.d/99-log-port.sh

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
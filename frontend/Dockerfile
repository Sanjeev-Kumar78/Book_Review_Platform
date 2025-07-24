FROM node:lts-alpine3.22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better layer caching
COPY package*.json ./

# Install dependencies (need dev dependencies for build)
RUN npm ci

# Copy configuration files
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY index.html ./

# Copy source code
COPY src ./src
COPY public ./public

# Copy server.js for production
COPY server.js ./

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001

# Change ownership of the app directory
RUN chown -R frontend:nodejs /app

# Switch to non-root user
USER frontend

# Expose port (Railway will set the PORT environment variable)
EXPOSE 4173

# Start the application using our server.js script
CMD ["npm", "start"]

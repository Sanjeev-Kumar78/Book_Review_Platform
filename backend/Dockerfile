FROM node:lts-alpine3.22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better layer caching
COPY package*.json ./

# Copy the Prisma schema for client generation
COPY prisma ./prisma

# Install dependencies including dev dependencies for build
RUN npm ci --only=production=false

# Copy the TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client and build TypeScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Change ownership of the app directory
RUN chown -R backend:nodejs /app

# Switch to non-root user
USER backend

# Expose port (Railway will provide the PORT environment variable)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "run", "start"]
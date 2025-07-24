FROM node:lts-alpine3.22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy configuration files
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY index.html ./

# Copy source code and server file
COPY src ./src
COPY server.js ./

# Accept build-time environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application with environment variables
RUN npm run build

# Expose port (Railway will set the PORT environment variable)
EXPOSE 4173

# Start the application using our server.js script
CMD ["npm", "start"]

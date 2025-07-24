FROM node:lts-alpine3.22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (need dev dependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port (Railway will set the PORT environment variable)
EXPOSE 4173

# Start the application using our server.js script
CMD ["npm", "start"]

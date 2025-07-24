FROM node:lts-alpine3.22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better layer caching
COPY package*.json ./

# Copy the Prisma schema for client generation
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy the TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client and build TypeScript
RUN npm run build

# Expose port (Railway will provide the PORT environment variable)
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"]
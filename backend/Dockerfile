FROM node:lts-alpine3.22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the Prisma schema and other necessary files
COPY prisma ./prisma

# Install dependencies including dev dependencies for build
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client and build TypeScript
RUN npm run build

# Expose port (Railway will set PORT environment variable)
EXPOSE $PORT

# Start the application
CMD [ "npm", "run", "start" ]
FROM node:lts-alpine3.22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the Prisma schema and other necessary files
COPY prisma ./prisma

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Start the application
CMD [ "npm", "run", "start" ]
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

EXPOSE 4173

# Start the application with proper host binding
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]

# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies (use a volume mount for node_modules in docker-compose.yml)
RUN npm install

# Copy the rest of your Next.js app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
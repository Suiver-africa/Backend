# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]

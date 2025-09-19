<<<<<<< HEAD
# build stage
FROM node:20 AS builder
WORKDIR /app
=======
# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
>>>>>>> parent of 3b8bf6f (update)
COPY package*.json ./

# Install dependencies
RUN npm install
<<<<<<< HEAD
=======

# Copy all source code
>>>>>>> parent of 3b8bf6f (update)
COPY . .

# Build the NestJS app
RUN npm run build

<<<<<<< HEAD
# runtime stage
FROM node:20
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
CMD ["node", "dist/main.js"]
EXPOSE 3000
=======
# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
>>>>>>> parent of 3b8bf6f (update)

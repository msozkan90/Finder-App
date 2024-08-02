# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package*.json ./

RUN npm install -g nodemon && npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application with nodemon for automatic restarts
CMD ["nodemon", "src/index.js"]

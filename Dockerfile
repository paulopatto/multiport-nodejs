# Use an official Node runtime as the base image
FROM node:20-alpine

# Define environment variable
ENV NODE_ENV=production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the ports the app runs on
EXPOSE 8080 8000 9000


# Command to run the application
CMD ["node", "main.js"]
# Use official Node.js image as the base image
FROM node:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli

# Copy the entire project to the working directory
COPY . .

# Build the Angular app
RUN ng build --configuration production

# Expose the port the app runs on
EXPOSE 4200

# Run ng serve when the container starts
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]


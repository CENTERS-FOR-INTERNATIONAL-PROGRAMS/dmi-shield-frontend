# Use official Node.js image as the base image
FROM node:22.16.0-bookworm AS builder 
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

RUN chmod 775 -R /app/dist/

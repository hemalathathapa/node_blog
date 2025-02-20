# Use Node.js as the base image for building the frontend
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Build the production-ready React app
RUN npm run build

# Use Nginx to serve the built frontend
FROM nginx:alpine

# Copy the built frontend from the previous stage to Nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

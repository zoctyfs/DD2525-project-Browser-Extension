# Use the official Node.js image from Docker Hub
FROM node:14

# Create and set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 8080 to the host
EXPOSE 8080

# Command to run the server
CMD ["npm", "start"]

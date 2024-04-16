# Use an official Node.js image as a base
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose necessary ports
EXPOSE 3000
EXPOSE 5000

# Command to run your application
CMD ["npm", "start"]


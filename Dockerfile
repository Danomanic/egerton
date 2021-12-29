# Use an official Node runtime as a parent image
FROM node:17-alpine

# Set the working directory to /app
WORKDIR '/app'

# Copy package.json to the working directory
COPY package.json .

# Install any needed packages specified in package.json
RUN yarn

# Copying the rest of the code to the working directory
COPY . .

# Run index.js when the container launches
CMD ["node", "src/index.js"]
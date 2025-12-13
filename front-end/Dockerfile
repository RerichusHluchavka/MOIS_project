# Use the requested Node.js version
FROM node:22.16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definitions first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the default Angular/Ionic port
EXPOSE 4200

# Start the application
# --host 0.0.0.0 binds to all interfaces so it's accessible outside the container
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

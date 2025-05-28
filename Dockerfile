# Use official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY project/package.json ./project/
RUN npm install && cd project && npm install

# Copy the rest of the app
COPY . .

# Build the frontend (assuming Vite)
RUN cd project && npm run build

# Expose the port (change if your app uses a different port)
EXPOSE 5173

# Start the app (adjust if you have a different start script)
CMD ["npm", "run", "--prefix", "project", "preview", "--", "--port", "5173", "--host"]

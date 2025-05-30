FROM node:18-slim

RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libnss3 \
    libxss1 \
    xdg-utils \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]

# Use an official slim Node.js image as the base
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Install required dependencies for Puppeteer to run in headless mode
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libnss3 \
    libxss1 \
    xdg-utils \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libdrm2 \
    libgbm1 \
    wget \
    ca-certificates \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy only the package.json files first for Docker layer caching
COPY package*.json ./

# Install only production dependencies for performance
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the source code
COPY . .

# Expose a port (optional – for healthcheck, webhook server, etc.)
EXPOSE 3000

# Optional: Add a health check to make sure the bot stays alive
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', res => res.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1))"

# Default command to start the viewbot scheduler
CMD ["node", "scheduler.js"]

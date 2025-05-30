# Use slim Node.js base image
FROM node:18-slim

# Create a non-root user
RUN useradd -m appuser

# Set working directory
WORKDIR /app

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libdrm2 \
    libgbm1 \
    wget \
    ca-certificates \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Optional: Skip Chrome download and set executable
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Optional Chrome install (uncomment if not using Puppeteer's bundled one)
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
#     echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
#     apt-get update && \
#     apt-get install -y google-chrome-stable

# Copy dependency files first for layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the code
COPY . .

# Set non-root user
USER appuser

# Expose port (adjust if needed)
EXPOSE 3000

# Health check (adjust command if needed)
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

# Start the bot
CMD ["node", "scheduler.js"]

FROM node:18-slim

# Set working directory
WORKDIR /app

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  libnss3 \
  libxss1 \
  xdg-utils \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Start the app
CMD ["node", "scheduler.js"]

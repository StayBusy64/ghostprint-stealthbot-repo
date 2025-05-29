FROM node:18-slim

# Set working directory
WORKDIR /app

# Install only the puppeteer dependencies
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libnss3 \
    libxss1 \
    xdg-utils \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy app files
COPY . .

# Install npm packages (puppeteer included)
RUN npm install

# Run the app
CMD ["node", "scheduler.js"]

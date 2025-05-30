# 1. Start with a valid base image
FROM node:18-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Install required system packages for Puppeteer
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  libnss3 \
  libxss1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libdrm2 \
  libgbm1 \
  xdg-utils \
  wget \
  ca-certificates \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# 4. Copy only package files first for layer caching
COPY package*.json ./

# 5. Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# 6. Copy the rest of your codebase
COPY . .

# 7. Tell Docker what port to expose (if your bot needs this)
EXPOSE 3000

# 8. Actually run your bot
CMD ["node", "scheduler.js"]

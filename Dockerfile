FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install puppeteer@22.8.2 --save

# Add puppeteer headless dependencies
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  libnss3 \
  libxss1 \
  xdg-utils \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 3000

CMD ["node", "scheduler.js"]

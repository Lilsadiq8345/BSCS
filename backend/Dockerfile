FROM node:20-slim

# Install system dependencies for node-gyp or other native modules if needed
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]

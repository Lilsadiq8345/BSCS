#!/bin/bash
echo "🚀 Starting Browser Secure Code Server..."

# 1. Check Docker
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running. Please start Docker Desktop."
  exit 1
fi

# 2. Launch
docker-compose up -d --build

# 3. Database Sync
echo "🗄️  Syncing Database..."
sleep 5
docker-compose exec -T backend npx prisma migrate dev --name init
docker-compose exec -T backend npx prisma db seed

echo "✅ System Ready!"
echo "🌐 URL: http://localhost:3000"
echo "🔑 Login: admin@codeserver.com / admin123"

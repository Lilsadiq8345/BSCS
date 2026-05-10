# Setup Guide - Browser Secure Code Server

## Local Development

### 1. Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if not using Docker)

### 2. Environment Setup
Copy the `.env.example` to `.env` in the root:

```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Database Setup
```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Run with Docker Compose
```bash
docker-compose up --build
```

The frontend will be at `http://localhost:3000` and the backend at `http://localhost:4000`.

## Production Deployment (Linux VPS)

1. **Clone the repository** to your VPS.
2. **Install Docker and Nginx**.
3. **Configure Nginx** using the `nginx.conf.example` provided.
4. **Set up SSL** via Certbot.
5. **Update `.env`** with production secrets and your domain.
6. **Run `docker-compose -f docker-compose.prod.yml up -d`** (you may want to create a separate prod compose file with restricted restart policies).
7. **Create initial Admin user**:
   - Use the register endpoint or a database seed script to create an admin user.

## IP Whitelisting (Optional)
To restrict access to specific IPs, add the following to your NestJS `AuthGuard` or a custom middleware:

```typescript
const allowedIps = ['123.123.123.123'];
const clientIp = request.ip;
if (!allowedIps.includes(clientIp)) {
  throw new ForbiddenException('IP not allowed');
}
```

Alternatively, use Nginx:

```nginx
allow 123.123.123.123;
deny all;
```

## 🐳 Docker Deployment (Recommended for Testing)

To run the entire platform in a professional, containerized environment, use Docker Compose:

1. **Build and Start**:
   ```bash
   docker-compose up --build
   ```

2. **Access the Platform**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:4000](http://localhost:4000)

3. **Default Credentials**:
   - **Admin Login**: `admin@codeserver.com` / `admin123`
   - **Developer Login**: (Provision via Admin Panel)

---
*Note: Ensure Docker Desktop is running on your machine before starting.*
